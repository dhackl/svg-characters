import React, { Component } from 'react';
import SVG from 'svg.js';
import Character from '../editor/Character';

import Rectangle from '../util/Rectangle';
import Collision from './Collision';

import mapMap01 from '../resources/world/map01.svg';
import mapCave01 from '../resources/world/cave01.svg';

export default class World extends Component {

    static worldMap = new Map();

    constructor(props) {
        super(props);

        this.state = {
            world: '',
            worldDefs: '',
            colliders: [],
            spawnPoint: {x: 0, y: 0}
        };
    }

    static init() {
        World.worldMap.set('map01', mapMap01);
        World.worldMap.set('cave01', mapCave01);
        
    }

    componentWillReceiveProps() {
        this.loadWorld(mapMap01);
    }

    loadWorld(worldData) {
        fetch(worldData)
        .then(r => r.text())
        .then(text => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(text, "image/svg+xml");
            var defs = doc.getElementsByTagName('defs').item(0).innerHTML;
            var root = doc.getElementById('map-root');

            // Collisions
            var collision = doc.getElementById('map-collision');
            collision.style.opacity = 0.1;
            
            var colliders = [];
            for (var i = 0; i < collision.children.length; i++) {
                colliders.push(SVG.adopt(collision.children.item(i)));
            }

            // Spawn Point
            var spawn = doc.getElementById('spawn');
            spawn.style.opacity = 0;
            var spawnSvg = SVG.adopt(spawn);            

            this.setState({
                world: root.outerHTML,
                worldDefs: defs,
                colliders: colliders,
                spawnPoint: {x: spawnSvg.x(), y: spawnSvg.y()}
            });
        });
    }

    componentDidUpdate() {
        // Put player on spawn point
        SVG.get('player1').move(this.state.spawnPoint.x, this.state.spawnPoint.y);

        SVG.get('player2').move(300, 200);
    }

    handleCollisions(player) {
        var playerRect = player.getBounds();
        for (var i = 0; i < this.state.colliders.length; i++) {
            var collider = this.state.colliders[i];
            var rect = new Rectangle(collider.x(), collider.y(), collider.width(), collider.height());
            
            //if (playerRect.intersects(rect)) {
            var depth = playerRect.getIntersectionDepth(rect);
            if (depth.x !== 0 && depth.y !== 0) {

                var collisionType = Number(collider.attr('collision-type'));
                if (!collisionType || collisionType === Collision.TYPE_SOLID) {
                    // Blocking object
                    player.stopMoving();
                    if (Math.abs(depth.x) < Math.abs(depth.y)) {
                        player.moveBy(depth.x, 0);
                    }
                    else {
                        player.moveBy(0, depth.y);
                    }
                }
                else {
                    // Non-blocking -> execute type specific action
                    if (collisionType === Collision.TYPE_SECONDARY_EXIT) {
                        var nextWorld = collider.attr('secondary-exit');
                        this.loadWorld(World.worldMap.get(nextWorld));
                    }
                }
            }
        }
    }

    render() {
        return (
            <g id="world">
                <defs dangerouslySetInnerHTML={{__html: this.state.worldDefs}}></defs>
                <g dangerouslySetInnerHTML={{__html: this.state.world}}></g>

                <g id="collision-visualization">
                    {this.state.colliders.map((collider, idx) => 
                        <rect x={collider.x()} y={collider.y()} width={collider.width()} height={collider.height()} style={{fill:'#ff0000', opacity:0.1}} key={'crect'+idx} />
                    )}
                </g>

                {this.props.children}
            </g>
        );
    }
}