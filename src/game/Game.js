import React, { Component } from 'react';
import SVG from 'svg.js';
import './Game.css';

import Character from '../editor/Character';
import CharacterEditor from '../editor/CharacterEditor';
import World from '../world/World';
import Collision from '../world/Collision';

import openSocket from 'socket.io-client';
//const socket = openSocket('http://localhost:5080');
const socket = openSocket('https://svg-characters.herokuapp.com:5080');



export default class Game extends Component {

    constructor(props) {
        super(props);

        this.state = {
            characters: [],
            inPlayMode: false
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.connectToServer = this.connectToServer.bind(this);

        this.worldRef = React.createRef();
        this.gameViewRef = React.createRef();

        this.myPlayerId = '';
        this.currentWorldId = 'map01';

        this.camera = {
            SCROLL_POS_RIGHT: 1000,
            SCROLL_POS_LEFT: 800,
            SCROLL_POS_UP: 300,
            SCROLL_POS_DOWN: 600,

            position: {x: 0, y: 0},
            zoom: 1.0
        };

        // Update player position etc.
        socket.on('state', players => {
            if (this.state.inPlayMode === true) {
                for (var id in players) {
                    var player = players[id];
                    /*var playerSvg = SVG.get('c-' + id);
                    if (playerSvg)
                        playerSvg.move(player.x, player.y);*/
                    var character = this.getCharacterById('c-' + id);
                    if (character) {
                        var prevPosition = {x: 0, y: 0};
                        var hasMoved = character.moveTo(player.x, player.y, prevPosition);
                        character.move(player.direction, prevPosition);

                        // Depth calculation
                        if (hasMoved) {
                            var world = this.worldRef.current;
                            var characterSvg = SVG.get('c-' + id);
                            if (characterSvg)
                                world.setCharacterDepth(characterSvg);
                        }
                    }

                    // Move camera for my player
                    if (this.myPlayerId === 'c-' + id) {
                        
                        var relativePlayerX = player.x + this.camera.position.x;
                        var relativePlayerY = player.y + this.camera.position.y;

                        // Scrolling in X
                        if (relativePlayerX > this.camera.SCROLL_POS_RIGHT)
                            this.camera.position.x = Math.min(Math.max(-player.x + this.camera.SCROLL_POS_RIGHT, -4000), 0);
                        else if (relativePlayerX < this.camera.SCROLL_POS_LEFT)
                            this.camera.position.x = Math.min(Math.max(-player.x + this.camera.SCROLL_POS_LEFT, -4000), 0);
                        // Scrolling in Y
                        if (relativePlayerY > this.camera.SCROLL_POS_DOWN)
                            this.camera.position.y = Math.min(Math.max(-player.y + this.camera.SCROLL_POS_DOWN, -4000), 0);
                        else if (relativePlayerY < this.camera.SCROLL_POS_UP)
                            this.camera.position.y = Math.min(Math.max(-player.y + this.camera.SCROLL_POS_UP, -4000), 0);
            

                        this.gameViewSvg.translate(this.camera.position.x, this.camera.position.y);
                    }
                }
            }
        });

        // New player added or existing player removed -> update state
        socket.on('update-player-data', playerData => {
            var characters = [];

            for (var id in playerData) {
                var pData = playerData[id];

                // Load all character which are in my world
                if (pData.currentWorld === this.currentWorldId) {
                    characters.push({
                        id: 'c-' + id,
                        settings: pData.characterProps,
                        ref: React.createRef()
                    });
                }
            }

            this.setState({
                characters: characters
            });
        });

        // Player has changed world -> load the new world
        socket.on('world-change', data => {
            this.currentWorldId = data.worldId;
            var world = this.worldRef.current;
            world.loadWorld(data.worldId);
        })

        // Listen for incoming chat messages
        socket.on('chat-out', data => {
            var senderCharacter = this.getCharacterById('c-' + data.sender);
            senderCharacter.setChatMessage(data.message);
        });
    }

    componentDidUpdate() {
        this.gameViewSvg = SVG.adopt(this.gameViewRef.current);
    }

    connectToServer(characterProps) {
        socket.emit('new-player', {
            characterProps: characterProps
        });

        // ID of the player, I can control
        this.myPlayerId = 'c-' + socket.id;

        // Switch from editor to play mode
        this.setState({
            inPlayMode: true
        });

    }

    handleKeyDown(ev) {
        if (!this.state.inPlayMode)
            return;

        var xDir = 0, yDir = 0;
        if (ev.key === 'ArrowLeft') {
            xDir = -1;
        }
        else if (ev.key === 'ArrowRight') {
            xDir = 1;
        }
        else if (ev.key === 'ArrowUp') {
            yDir = -1;
        }
        else if (ev.key === 'ArrowDown') {
            yDir = 1;
        }

        var player = this.getCharacterById(this.myPlayerId);
        var direction = {x: xDir, y: yDir};
        player.move(direction);
        socket.emit('movement', direction);
    }

    handleKeyUp() {
        var player = this.getCharacterById(this.myPlayerId);
        player.stopMoving();
    }

    getCharacterById(id) {
        var character = this.state.characters.find(character => character.id === id);
        if (character)
            return character.ref.current;
        return null;
    }

    render() {
        // Rearrange characters before render to prevent React fail
        for (var i = 0; i < this.state.characters.length; i++) {
            var char = this.state.characters[i];
            var charSvg = SVG.get(char.id);
            if (charSvg)
                SVG.get('collision-visualization').after(charSvg);
        }

        return(
            <div id="game-outer">
                {this.state.inPlayMode === false &&
                    <CharacterEditor onFinished={this.connectToServer} />
                }
                {this.state.inPlayMode === true && 
                    <div id="game-panel" onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} tabIndex="0">
                        <svg id="game-svg" ref={this.gameViewRef}>
                            <World ref={this.worldRef}>
                                {this.state.characters.map(character => 
                                    <Character id={character.id} isFemale={character.settings.body.isFemale} settings={character.settings} ref={character.ref} key={'character' + character.id} />
                                )}
                            </World>
                        </svg>
                        <ChatBox />
                    </div>
                }
            </div>
        );
    }
}

class ChatBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: ''
        };

        this.handleChatChanged = this.handleChatChanged.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
    }

    handleChatChanged(ev) {
        this.setState({
            message: ev.target.value
        });
    }

    sendChatMessage(ev) {
        ev.preventDefault();

        var message = this.state.message;

        if (message.length > 0) {
            socket.emit('chat-in', {
                message: message
            });
            this.setState({
                message: ''
            });
        }
    }

    render() {
        return (
            <div id="chat-panel">
                <form onSubmit={this.sendChatMessage}>
                    <input className="chat-input" onChange={this.handleChatChanged} value={this.state.message} />
                    <button>Send</button>
                </form>
            </div>
        );
    }
}