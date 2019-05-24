import React, { Component } from 'react';
import SVG from 'svg.js';

import './CharacterEditor.css';
import Point from '../util/Point';
import Rectangle from '../util/Rectangle';
import ColorUtils from '../util/ColorUtils';
import Eyes from './Eyes';
import Ears from './Ears';
import Mouth from './Mouth';
import Eyebrows from './Eyebrows';
import Neck from './Neck';
import Nose from './Nose';
import Hair from './Hair';
import Torso from './Torso';
import Arm from './Arm';
import Leg from './Leg';
import Clothes from './Clothes';
import Character from './Character';

import World from '../world/World';
import CharacterProperties from './CharacterProperties';

export default class CharacterEditor extends Component {

    constructor(props) {
        super(props);

        World.init();
        Clothes.init();
        Hair.init();

        this.state = {
            body: {
                direction: 0,
                skinColor: '#f3bf85',
                fat: 5,
                muscles: 10
            },
            head: {
                width: 60,
                height: 90,
                roundnessTop: 15,
                roundnessBottom: 20
            },
            hair: {
                hairStyle: 'short01',
                hairColor: '#aa5511'
            },
            eye: {
                distance: 25,
                width: 15,
                height: 8,
                eyeLid: 20
            },
            ear: {
                
            },
            mouth: {
                width: 18,
                height: 8
            },
            neck: {
                width: 15,
                height: 30
            },
            nose: {
                width: 30,
                height: 35
            },
            clothes: {
                styleTop: 'tshirt',
                colorTop: '#ab2710',
                styleLegs: 'jeans',
                colorLegs: '#20243c',
                clothUpperArm: '',
                clothLowerArm: '',
                clothTorso: '',
                clothUpperLeg: '',
                clothLowerLeg: ''
            },
            headBounds: new Rectangle(),
            svg: '',
            zoom: 1.0,
            sideView: false
        };

        this.buildSVG = this.buildSVG.bind(this);

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.randomizeCharacter = this.randomizeCharacter.bind(this);
        this.update = this.update.bind(this);

        this.playerRef = React.createRef();
        this.worldRef = React.createRef();
    }

    componentDidMount() {
        this.buildSVG(this.state, true);
        
        //this.transformSidePose();

        this.buildClothesTop(this.state, true);
        this.buildClothesLegs(this.state, true);

        // Generate side-view of character
        // #CLONE
        //let clone = SVG.get('character-outer').clone();
        //clone.dmove(200, 0);
        // #USE
        //let draw = SVG.adopt(document.getElementById('character-svg'));
        //let clone = draw.use(SVG.get('character-outer')).dmove(400, 0);    
    }

    componentWillMount() {
        this.randomizeCharacter();
    }

    initProps() {

    }

    setProp(prop, val) {
        var propCat = prop.cat;
        var propName = prop.name;
        var bodyPart = this.state[propCat];
        bodyPart[propName] = val;
        
        var state = this.state;
        state[bodyPart] = bodyPart;
        this.setState(state);
        this.buildSVG(this.state, true);

        if (prop.cat === 'clothes') {
            if (prop.name.indexOf('Top') >= 0)
                this.buildClothesTop(this.state, true);
            else
                this.buildClothesLegs(this.state, true);
        }

        
    }

    buildSVG(settings, useState) {
        var right = 60 + settings.head.width;
        var left = 40 - settings.head.width;
        var top = 60 - settings.head.height;
        var bottom = 60 + settings.head.height;

        var s = settings.head.roundnessTop;
        var t = settings.head.roundnessBottom;

        /*var pathStr = `
        M ${right} 50 
        C ${right} ${right - s} ${right - s} ${bottom} 50 ${bottom}
          ${left + s} ${bottom} ${left} ${right - s} ${left} 50 
          ${left} ${left + s} ${left + s} ${top} 50 ${top}
          ${right - s} ${top} ${right} ${left + s} ${right} 50 Z
        `;*/

        var pathStr = `
        M ${right} 50 
        C ${right} ${right - t} ${right - t} ${bottom} 50 ${bottom}
          ${left + t} ${bottom} ${left} ${right - t} ${left} 50 
          ${left} ${left + s} ${left + s} ${top} 50 ${top}
          ${right - s} ${top} ${right} ${left + s} ${right} 50 Z
        `;

        if (useState) {
            this.setState({
                svg: pathStr,
                headBounds: new Rectangle(left, top, right - left, bottom - top)
            });
        }
        else {
            settings.svg = pathStr;
            settings.headBounds = new Rectangle(left, top, right - left, bottom - top);
        }
    }

    buildClothesTop(settings, useState) {
        // If naked -> return empty path
        if (settings.clothes.styleTop === Clothes.STYLE_NAKED) {
            let clothes = settings.clothes;
            clothes.clothUpperArm = '';
            clothes.clothLowerArm = '';
            clothes.clothTorso = '';

            if (useState) {
                this.setState({
                    clothes: clothes
                });
            }
            return;
        }

        // Otherwise -> load clothes
        Clothes.getClothesTop(settings.isFemale, settings.clothes.styleTop).then(text => {
            var parser = new DOMParser();

            // Substitute colors
            text = text.replace(new RegExp(Clothes.COLOR_PRIMARY, 'g'), settings.clothes.colorTop);
            text = text.replace(new RegExp(Clothes.COLOR_PRIMARY_DARK, 'g'), ColorUtils.blend(settings.clothes.colorTop, '#000000', 0.3));

            var doc = parser.parseFromString(text, "image/svg+xml");
            let upperArm = doc.getElementById('upper-arm');
            let lowerArm = doc.getElementById('lower-arm');
            let torso = doc.getElementById('torso');

            //if (torso != null)
            //    torso.removeAttribute('id');
            
            let clothes = settings.clothes;
            clothes.clothUpperArm = upperArm != null ? upperArm.outerHTML : '';
            clothes.clothLowerArm = lowerArm != null ? lowerArm.outerHTML : '';
            clothes.clothTorso = torso != null ? torso.outerHTML : '';
            
            if (useState) {
                this.setState({
                    clothes: clothes
                });
            }
        });

    }

    buildClothesLegs(settings, useState) {
        // If naked -> return empty path
        if (settings.clothes.styleLegs === Clothes.STYLE_NAKED) {
            let clothes = settings.clothes;
            clothes.clothUpperLeg = '';
            clothes.clothLowerLeg = '';
            if (useState) {
                this.setState({
                    clothes: clothes
                });
            }
            return;
        }

        // Otherwise -> load clothes
        Clothes.getClothesLegs(settings.isFemale, settings.clothes.styleLegs).then(text => {
            var parser = new DOMParser();

            // Substitute colors
            text = text.replace(new RegExp(Clothes.COLOR_PRIMARY, 'g'), settings.clothes.colorLegs);
            text = text.replace(new RegExp(Clothes.COLOR_PRIMARY_DARK, 'g'), ColorUtils.blend(settings.clothes.colorLegs, '#000000', 0.3));

            var doc = parser.parseFromString(text, "image/svg+xml");
            let upperLeg = doc.getElementById('upper-leg');
            let lowerLeg = doc.getElementById('lower-leg');
            
            let clothes = settings.clothes;
            clothes.clothUpperLeg = upperLeg != null ? upperLeg.outerHTML : '';
            clothes.clothLowerLeg = lowerLeg != null ? lowerLeg.outerHTML : '';
            
            if (useState) {
                this.setState({
                    clothes: clothes
                });
            }
        });
    }

    groupByArray(xs, key) { 
        return xs.reduce(function (rv, x) { 
            let v = key instanceof Function ? key(x) : x[key]; 
            let el = rv.find((r) => r && r.key === v); 
            if (el) { 
                el.values.push(x); 
            } else { 
                rv.push({ key: v, values: [x] }); 
            } return rv; 
        }, []); 
    }

    randomizeCharacter() {
        var settings = {};
        var isFemale = Math.random() < 0.5;
        var charProps = isFemale ? CharacterProperties.propsFemale : CharacterProperties.propsMale;

        for (var i = 0; i < charProps.length; i++) {
            var prop = charProps[i];

            // Select or generate new body part object
            var bodyPart = settings[prop.cat];
            if (!bodyPart) {
                settings[prop.cat] = {};
                bodyPart = settings[prop.cat];
            }

            // Generate random value within the prop's bounds (color, items or min/max range)
            var val = null;
            if (prop.type === 'color') {
                if (prop.name === 'skinColor')
                    val = ColorUtils.getRandomSkinTone();
                else
                    val = ColorUtils.getRandomColor();
            }
            else if (prop.type === 'string') {
                let keys = Array.from(prop.items.keys());
                let randomKey = keys[Math.floor(Math.random() * keys.length)];
                console.log(randomKey);
                val = randomKey;
                if (!val) 
                    val = prop.val;
            }
            else {
                val = prop.min + Math.floor(Math.random() * (prop.max - prop.min));
            }

            bodyPart[prop.name] = val;
            
        }

        settings.zoom = this.state.zoom;
        settings.sideView = this.state.sideView;
        settings.isFemale = isFemale;

        // Build
        this.buildSVG(settings, false);
        this.buildClothesTop(settings, false);
        this.buildClothesLegs(settings, false);

        this.randomCharacterSettings = settings;

        this.buildSVG(this.state, true);
        this.buildClothesTop(this.state, true);
        this.buildClothesLegs(this.state, true);
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

        var player = this.playerRef.current;
        player.move({x: xDir, y: yDir});

        var world = this.worldRef.current;
        world.handleCollisions(player);
    }

    handleKeyUp() {
        var player = this.playerRef.current;
        player.stopMoving();
    }

    update(delta) {        
        // Check for collision (TODO: move to a different/better location !!) 
        var player = this.playerRef.current;
        var world = this.worldRef.current;
        world.handleCollisions(player);

        //setInterval(this.update, 33);
    }

    render() {
        let propGroups = this.groupByArray(CharacterProperties.propsMale, 'cat');

        let elements = propGroups.map(group => 
            <PropertyGroupBox name={group.key} key={group.key} >
                {
                    group.values.map(prop => {
                        if (prop.type === 'color')
                            return <PropertyColorPicker prop={prop} key={prop.cat + prop.name} change={this.setProp.bind(this)}/>
                        else if (prop.type === 'string')
                            return <PropertyDropdown prop={prop} key={prop.cat + prop.name} items={prop.items} change={this.setProp.bind(this)}/>
                        else 
                            return <PropertySlider prop={prop} key={prop.cat + prop.name} change={this.setProp.bind(this)} />
                    })
                }
            </PropertyGroupBox>
        );

        return (
            <div id="character-editor">
                <div id="character-toolbar">
                    <button className="btn-toolbar" onClick={this.randomizeCharacter}>Randomize</button>
                </div>
                <div id="character-props">
                    {elements}
                </div>
                <div id="character-preview" onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} tabIndex="0">
                    <svg id="character-svg">
                        <World ref={this.worldRef}>
                            <Character isFemale="true" id="player1" ref={this.playerRef} settings={this.state} />
                            <Character isFemale={this.randomCharacterSettings.isFemale} id="player2" settings={this.randomCharacterSettings} />
                        </World>
                    </svg>
                </div>
            </div>
        );
    }
}

class PropertyGroupBox extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="prop-groupbox">
                <h3 className="prop-grouplabel">{this.props.name}</h3>
                {this.props.children}
            </div>
        );
    }
}

class PropertySlider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.prop.val
        };

        this.valueChanged = this.valueChanged.bind(this);
    }

    valueChanged(ev) {
        this.setState({
            value: ev.target.value
        });
        this.props.change(this.props.prop, Number(ev.target.value));
    }

    render() {
        return (
            <div className="prop-slider">
                <span className="prop-label">{this.props.prop.name}</span>
                <input type="range" className="slider" min={this.props.prop.min} max={this.props.prop.max} value={this.state.value} onChange={this.valueChanged} />
                <input type="text" className="prop-value" value={this.state.value} disabled />
            </div>
        );
    }
}

class PropertyColorPicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            color: this.props.prop.val
        }

        this.valueChanged = this.valueChanged.bind(this);
    }

    valueChanged(ev) {
        this.setState({
            color: ev.target.value
        });
        this.props.change(this.props.prop, ev.target.value);
    }

    render() {
        return (
            <div className="prop-colorpicker">
                <span className="prop-label">{this.props.prop.name}</span>
                <input type="color" value={this.state.color} onChange={this.valueChanged} />
                <input type="text" className="prop-value" value={this.state.color} disabled />
            </div>
        );
    }
}

class PropertyDropdown extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.prop.val
        };

        this.valueChanged = this.valueChanged.bind(this);
    }

    valueChanged(ev) {
        this.setState({
            value: ev.target.value
        });
        this.props.change(this.props.prop, ev.target.value);
    }

    render() {
        const items = [];
        this.props.items.forEach((val, key) => 
            items.push(<option key={'op-' + key} value={key}>{key}</option>)
        );
        return (
            <div className="prop-dropdown">
                <span className="prop-label">{this.props.prop.name}</span>
                <select className="dropdown" onChange={this.valueChanged}>
                    {items}
                </select>
            </div>
        );
    }
}

class Toolbar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div></div>
        );
    }
}