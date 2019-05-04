import React, { Component } from 'react';
import SVG from 'svg.js';
import Character from '../editor/Character';

import worldData from '../resources/world/map01.svg';
import Rectangle from '../util/Rectangle';

export default class World extends Component {

    constructor(props) {
        super(props);

        this.state = {
            world: '',
            colliders: []
        };
    }

    componentWillReceiveProps() {
        fetch(worldData)
        .then(r => r.text())
        .then(text => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(text, "image/svg+xml");
            var root = doc.getElementById('map-root');

            var collision = doc.getElementById('map-collision');
            collision.style.opacity = 0.1;
            
            var colliders = [];
            for (var i = 0; i < collision.children.length; i++) {
                colliders.push(SVG.adopt(collision.children.item(i)));
            }

            this.setState({
                world: root.outerHTML,
                colliders: colliders
            });
        });
    }

    componentDidUpdate() {
        SVG.get('player2').move(300, 200);
    }

    handleCollisions(player) {
        var playerRect = player.getBounds();
        for (var i = 0; i < this.state.colliders.length; i++) {
            var collider = this.state.colliders[i];
            var rect = new Rectangle(collider.x() * 5, collider.y() * 5, collider.width() * 5, collider.height() * 5);
            
            //if (playerRect.intersects(rect)) {
            var depth = playerRect.getIntersectionDepth(rect);
            if (depth.x !== 0 && depth.y !== 0) {
                player.stopMoving();
                if (Math.abs(depth.x) < Math.abs(depth.y)) {
                    player.moveBy(depth.x, 0);
                }
                else {
                    player.moveBy(0, depth.y);
                }
            }
        }
    }

    render() {
        return (
            <g id="world">
                <g dangerouslySetInnerHTML={{__html: this.state.world}} transform={'scale(5 5)'}></g>

                <g id="collision-visualization" transform={'scale(5 5)'}>
                    {this.state.colliders.map((collider, idx) => 
                        <rect x={collider.x()} y={collider.y()} width={collider.width()} height={collider.height()} style={{fill:'#ff0000', opacity:0.1}} key={'crect'+idx} />
                    )}
                </g>

                {this.props.children}
            </g>
        );
    }
}