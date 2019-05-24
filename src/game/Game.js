import React, { Component } from 'react';
import SVG from 'svg.js';
import './Game.css';

import Character from '../editor/Character';
import CharacterEditor from '../editor/CharacterEditor';
import World from '../world/World';
import Collision from '../world/Collision';

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5080');

export default class Game extends Component {

    constructor(props) {
        super(props);

        this.state = {
            characters: [],
            inPlayMode: false
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.update = this.update.bind(this);
        this.connectToServer = this.connectToServer.bind(this);

        this.worldRef = React.createRef();

        // Update player position etc.
        socket.on('state', players => {
            if (this.state.inPlayMode === true) {
                for (var id in players) {
                    var player = players[id];
                    var playerSvg = SVG.get('c-' + id);
                    if (playerSvg)
                        playerSvg.move(player.x, player.y);
                    //this.getCharacterById(id).moveTo(player.x, player.y);
                }
            }
        });

        // New player added or existing player removed -> update state
        socket.on('update-player-data', playerData => {
            var characters = [];

            for (var id in playerData) {
                var player = playerData[id];
                characters.push({
                    id: 'c-' + id,
                    settings: player.characterProps,
                    ref: React.createRef()
                });
            }

            this.setState({
                characters: characters
            });
        });
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

        var world = this.worldRef.current;
        world.handleCollisions(player);
    }

    handleKeyUp() {
        var player = this.getCharacterById(this.myPlayerId);
        player.stopMoving();
    }

    getCharacterById(id) {
        return this.state.characters.find(character => character.id === id).ref.current;
    }

    update(delta) {        
        // Check for collision (TODO: move to a different/better location !!) 
        var player = SVG.get(this.myPlayerId);
        var world = this.worldRef.current;
        world.handleCollisions(player);

        //setInterval(this.update, 33);
    }

    render() {
        return(
            <div id="game-outer">
                {this.state.inPlayMode === false &&
                    <CharacterEditor onFinished={this.connectToServer} />
                }
                {this.state.inPlayMode === true && 
                    <div id="game-panel" onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} tabIndex="0">
                        <svg id="game-svg">
                            <World ref={this.worldRef}>
                                {this.state.characters.map(character => 
                                    <Character id={character.id} isFemale={character.settings.isFemale} settings={character.settings} ref={character.ref} key={'character' + character.id} />
                                )}
                            </World>
                        </svg>
                    </div>
                }
            </div>
        );
    }
}