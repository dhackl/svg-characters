import React, { Component } from 'react';
import SVG from 'svg.js';
import './Game.css';

import Character from '../editor/Character';
import CharacterEditor from '../editor/CharacterEditor';
import World from '../world/World';
import Collision from '../world/Collision';

import io from 'socket.io-client';
const socket = io('http://localhost:5080');
//const socket = io('wss://svg-characters-server.herokuapp.com', { secure: true });

const FPS = 60;

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

        this.editorRef = React.createRef();
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

        this.player = null;
        this.playerDirection = { x: 0, y: 0 };
        this.canUpdateDepth = true;
        
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
                        character.move(player.direction);

                        // Depth calculation
                        if (hasMoved) {
                            var world = this.worldRef.current;
                            if (character.svg)
                                world.setCharacterDepth(character.svg);
                        }
                    }

                    
                }
            }
        });

        // New player added or existing player removed -> update state
        socket.on('update-player-data', playerData => {

            this.resetCharacterDomPosition();

            
            //console.log(playerData);
            var characters = this.state.characters;
            
            for (var id in playerData) {
                var pData = playerData[id];

                var charId = 'c-' + id;
                var character = characters.find(char => char.id === charId);
                

                // Load all characters which are in my world
                if (pData.currentWorld === this.currentWorldId) {
                    if (!character) {
                        // Character doesn't exist yet -> add it to my world
                        characters.push({
                            id: 'c-' + id,
                            settings: pData.characterProps,
                            ref: React.createRef()
                        });
                    }
                    else {
                        // Character already here -> nothing to do
                    }
                }
                else {
                    // Character not in my world

                    if (character) {
                        // Character still here (probably was in my world before) -> remove it
                        characters.splice(characters.indexOf(character), 1);
                    }
                }
            }

            this.setState({
                characters: characters
            }, () => {
                //console.log(document.getElementById('game-svg'));
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


        // Start main game loop
        setInterval(() => {
            this.update();
        }, 1000 / FPS);
    }

    componentDidUpdate() {
        this.gameViewSvg = SVG.adopt(this.gameViewRef.current);
    }

    connectToServer(characterProps) {
        this.spawnNpcCharacters();

        socket.emit('new-player', {
            characterProps: characterProps
        });

        // ID of the player, I can control
        this.myPlayerId = 'c-' + socket.id;

        // Switch from editor to play mode
        this.setState({
            inPlayMode: true
        });

        this.player = this.getCharacterById(this.myPlayerId);
    }

    spawnNpcCharacters() {
        for (var i = 0; i < 5; i++) {
            var props = this.editorRef.current.getRandomCharacterSettings();
            socket.emit('new-npc', {
                characterProps: props
            });
        }
    }

    handleKeyDown(ev) {
        if (!this.state.inPlayMode)
            return;

        if (ev.key === 'ArrowLeft') {
            this.playerDirection.x = -1;
        }
        else if (ev.key === 'ArrowRight') {
            this.playerDirection.x = 1;
        }
        else if (ev.key === 'ArrowUp') {
            this.playerDirection.y = -1;
        }
        else if (ev.key === 'ArrowDown') {
            this.playerDirection.y = 1;
        }

    }

    handleKeyUp(ev) {
        if (ev.key === 'ArrowLeft') {
            this.playerDirection.x = 0;
        }
        else if (ev.key === 'ArrowRight') {
            this.playerDirection.x = 0;
        }
        else if (ev.key === 'ArrowUp') {
            this.playerDirection.y = 0;
        }
        else if (ev.key === 'ArrowDown') {
            this.playerDirection.y = 0;
        }

    }

    getCharacterById(id) {
        var character = this.state.characters.find(character => character.id === id);
        if (character)
            return character.ref.current;
        return null;
    }

    // Called 60 times per second
    update() {
        
        var player = this.getCharacterById(this.myPlayerId);
        if (!player)
            return;

        // Handle Keyboard Input 
        if (player.move(this.playerDirection)) {
            // Direction has changed -> notify server
            socket.emit('movement', this.playerDirection);
        }
        

        // Client-side player movement and prediction
        for (var i = 0; i < this.state.characters.length; i++) {
            let char = this.state.characters[i];
            let character = this.getCharacterById(char.id);
            let speed = 4;

            var prevPosition = {x: 0, y: 0};
            var hasMoved = character.moveInDirection(speed, prevPosition);
            //character.move(player.direction, prevPosition);

        }

        // Move camera for my player
        this.handleCameraMovement(player);
    }

    handleCameraMovement(player) {
                 
        var relativePlayerX = player.svg.x() + this.camera.position.x;
        var relativePlayerY = player.svg.y() + this.camera.position.y;

        // Scrolling in X
        if (relativePlayerX > this.camera.SCROLL_POS_RIGHT)
            this.camera.position.x = Math.min(Math.max(-player.svg.x() + this.camera.SCROLL_POS_RIGHT, -4000), 0);
        else if (relativePlayerX < this.camera.SCROLL_POS_LEFT)
            this.camera.position.x = Math.min(Math.max(-player.svg.x() + this.camera.SCROLL_POS_LEFT, -4000), 0);
        // Scrolling in Y
        if (relativePlayerY > this.camera.SCROLL_POS_DOWN)
            this.camera.position.y = Math.min(Math.max(-player.svg.y() + this.camera.SCROLL_POS_DOWN, -4000), 0);
        else if (relativePlayerY < this.camera.SCROLL_POS_UP)
            this.camera.position.y = Math.min(Math.max(-player.svg.y() + this.camera.SCROLL_POS_UP, -4000), 0);


        this.gameViewSvg.translate(this.camera.position.x, this.camera.position.y);
        
    }

    resetCharacterDomPosition() {
        // Rearrange characters to be positioned like when they are first rendered, to prevent React fail
        for (var i = 0; i < this.state.characters.length; i++) {
            var char = this.state.characters[i];
            var character = char.ref.current;
            if (character && character.svg) {
                SVG.get('collision-visualization').after(character.svg);
                console.log(character.svg);
            }
            
        }
    }

    render() {

        this.resetCharacterDomPosition();

        return(
            <div id="game-outer">
                {this.state.inPlayMode === false &&
                    <CharacterEditor ref={this.editorRef} onFinished={this.connectToServer} />
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