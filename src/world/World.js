import React, { Component } from 'react';
import SVG from 'svg.js';
import Character from '../editor/Character';

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
            staticObjects: []
        };

        this.doDepthCheck = true;
    }

    static init() {
        World.worldMap.set('map01', mapMap01);
        World.worldMap.set('cave01', mapCave01);
        
    }

    componentWillMount() {
        this.loadWorld('map01');
    }

    loadWorld(worldId) {
        this.doDepthCheck = false;
        console.log('depth check off');

        fetch(World.worldMap.get(worldId))
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

            // Static objects -> first level children under root (for depth checks)
            var staticObjects = [];
            for (var i = 0; i < root.children.length; i++) {
                var obj = root.children.item(i);
                if (obj.id !== 'map-bg') {
                    var svgObj = SVG.adopt(obj); // Have to do this??
                    var objData = {
                        id: obj.id,
                        y: svgObj.y(),
                        height: svgObj.height()
                    };
                    if (obj.tagName === 'g') {
                        // Give the group object the ypos and height of its first child (usually shadow)
                        var child = SVG.adopt(obj.children.item(0));
                        objData.y = child.y();
                        objData.height = child.height();
                    }
                    staticObjects.push(objData);
                }
            }
            staticObjects.sort((a, b) => (a.y + a.height) - (b.y + b.height));

            this.setState({
                world: root.outerHTML,
                worldDefs: defs,
                colliders: colliders,
                staticObjects: staticObjects
            }, () => {
                this.doDepthCheck = true;
                console.log('depth check on');
            });
        });
    }

    componentDidUpdate() {
        // Sort static objects by y-position
        for (var i = 0; i < this.state.staticObjects.length - 1; i++) {
            var obj = this.state.staticObjects[i];
            var nextObj = this.state.staticObjects[i + 1];
            SVG.get(obj.id).after(SVG.get(nextObj.id));
        }
    }

    setCharacterDepth(character) {
        if (!this.doDepthCheck)
            return;

        var charY = character.y() + Character.OFFSET_HEIGHT;
        for (var i = 0; i < this.state.staticObjects.length; i++) {
            var obj = this.state.staticObjects[i];
            if (obj.y + obj.height > charY) {
                // First static object that's 'in front of' character -> put character behind it 
                SVG.get(obj.id).before(character);
                return;
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