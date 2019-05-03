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

export default class CharacterEditor extends Component {

    constructor(props) {
        super(props);

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

        this.characterProperties = [{
            cat: 'body',
            name: 'direction',
            min: 0,
            max: 3,
            val: 0
        }, {
            cat: 'body',
            name: 'skinColor',
            type: 'color',
            val: '#f3bf85',
        }, {
            cat: 'body',
            name: 'fat',
            min: 0,
            max: 30,
            val: 5,
        }, {
            cat: 'head',
            name: 'width',
            min: 50,
            max: 70,
            val: 60,
        }, {
            cat: 'head',
            name: 'height',
            min: 80,
            max: 100,
            val: 90,
        }, {
            cat: 'head',
            name: 'roundnessTop',
            min: 1,
            max: 40,
            val: 20,
        }, {
            cat: 'head',
            name: 'roundnessBottom',
            min: 5,
            max: 40,
            val: 20,
        }, {
            cat: 'hair',
            name: 'hairStyle',
            type: 'string',
            val: 'short01',
            items: Hair.hairStyles
        }, {
            cat: 'hair',
            name: 'hairColor',
            type: 'color',
            val: '#aa5511'
        }, {
            cat: 'eye',
            name: 'distance',
            min: 15,
            max: 35,
            val: 25
        }, {
            cat: 'eye',
            name: 'width',
            min: 10,
            max: 20,
            val: 15
        }, {
            cat: 'eye',
            name: 'height',
            min: 5,
            max: 12,
            val: 8
        }, {
            cat: 'eye',
            name: 'eyeLid',
            min: 0,
            max: 100,
            val: 20
        }, {
            cat: 'mouth',
            name: 'width',
            min: 10,
            max: 25,
            val: 18
        }, {
            cat: 'mouth',
            name: 'height',
            min: 1,
            max: 20,
            val: 8
        }, {
            cat: 'neck',
            name: 'width',
            min: 15,
            max: 18,
            val: 15
        }, {
            cat: 'neck',
            name: 'height',
            min: 30,
            max: 40,
            val: 30
        }, {
            cat: 'nose',
            name: 'width',
            min: 15,
            max: 50,
            val: 30
        }, {
            cat: 'nose',
            name: 'height',
            min: 15,
            max: 50,
            val: 35
        }, {
            cat: 'clothes',
            name: 'styleTop',
            type: 'string',
            val: 'tshirt',
            items: Clothes.clothesTop
        }, {
            cat: 'clothes',
            name: 'colorTop',
            type: 'color',
            val: '#ab2710'
        }, {
            cat: 'clothes',
            name: 'styleLegs',
            type: 'string',
            val: 'jeans',
            items: Clothes.clothesLegs
        }, {
            cat: 'clothes',
            name: 'colorLegs',
            type: 'color',
            val: '#20243c'
        }];

        this.buildSVG = this.buildSVG.bind(this);
        this.toggleSideView = this.toggleSideView.bind(this);

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.randomizeCharacter = this.randomizeCharacter.bind(this);
    }

    componentDidMount() {
        this.buildSVG();
        
        //this.transformSidePose();

        Clothes.init();
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

    transformSidePose() {
        
    }

    toggleSideView() {
        this.setState({
            sideView: !this.state.sideView
        }, () => {
            if (this.state.sideView) {
                // Face
                SVG.get('left-eye').dmove(30, 0);
                SVG.get('left-brow').dmove(6, 0);
                SVG.get('right-eye').dmove(-30, 0).scale(0.8, 1);
                SVG.get('right-brow').dmove(-6, 0);

                SVG.get('right-ear').hide();

                SVG.get('nose-group').dmove(35, 0);
                SVG.get('mouth-group').dmove(35, 0);

                // Arms
                //SVG.get('left-arm').dmove(20, 0);
                SVG.get('right-arm').dmove(10, 0).scale(-1, 1).rotate(-20).back();

                var tempState = this.state;
                tempState.hair.hairStyle += '_side';
                this.setState(tempState);
            }
            else {
                // Face
                SVG.get('left-eye').dmove(-30, 0);
                SVG.get('left-brow').dmove(-6, 0);
                SVG.get('right-eye').scale(1, 1).dmove(30, 0);
                SVG.get('right-brow').dmove(6, 0);

                SVG.get('right-ear').show();

                SVG.get('nose-group').dmove(-35, 0);
                SVG.get('mouth-group').dmove(-35, 0);

                // Arms
                //SVG.get('left-arm').dmove(20, 0);
                SVG.get('right-arm').rotate(20).scale(-1, 1).dmove(-10, 0).front();

                var tempState = this.state;
                tempState.hair.hairStyle = this.state.hair.hairStyle.substring(0, this.state.hair.hairStyle.length - 5);
                this.setState(tempState);
            }
        });
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
        this.buildSVG();

        if (prop.cat === 'clothes') {
            if (prop.name.indexOf('Top') >= 0)
                this.buildClothesTop(this.state, true);
            else
                this.buildClothesLegs(this.state, true);
        }
    }

    buildSVG() {
        var right = 60 + this.state.head.width;
        var left = 40 - this.state.head.width;
        var top = 60 - this.state.head.height;
        var bottom = 60 + this.state.head.height;

        var s = this.state.head.roundnessTop;
        var t = this.state.head.roundnessBottom;

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

        this.setState({
            svg: pathStr,
            headBounds: new Rectangle(left, top, right - left, bottom - top)
        });
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
        Clothes.getClothesTop(settings.clothes.styleTop).then(text => {
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
        Clothes.getClothesLegs(settings.clothes.styleLegs).then(text => {
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
        for (var i = 0; i < this.characterProperties.length; i++) {
            var prop = this.characterProperties[i];

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
                val = randomKey;
                if (!val) 
                    val = prop.val;
            }
            else {
                val = prop.min + Math.floor(Math.random() * (prop.max - prop.min));
            }

            bodyPart[prop.name] = val;
            
        }

        // Build Clothes
        this.buildClothesTop(settings, false);
        this.buildClothesLegs(settings, false);

        settings.headBounds = this.state.headBounds;
        settings.svg = this.state.svg;
        settings.zoom = this.state.zoom;
        settings.sideView = this.state.sideView;

        this.randomCharacterSettings = settings;
        this.setState({});
    }

    handleKeyDown(ev) {
        var characterId = 'player1';
        var step = 30;
        var duration = 50;

        if (ev.key === 'ArrowLeft') {
            this.playerAnimation = SVG.get(characterId).animate(duration).dx(-step);
        }
        else if (ev.key === 'ArrowRight') {
            this.playerAnimation = SVG.get(characterId).animate(duration).dx(step)
        }
        else if (ev.key === 'ArrowUp') {
            this.playerAnimation = SVG.get(characterId).animate(duration).dy(-step);
        }
        else if (ev.key === 'ArrowDown') {
            this.playerAnimation = SVG.get(characterId).animate(duration).dy(step);
        }
    }

    handleKeyUp() {
        this.playerAnimation.finish();
        this.playerAnimation.stop();
    }

    render() {
        let propGroups = this.groupByArray(this.characterProperties, 'cat');

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
                    <button className="btn-toolbar" onClick={this.toggleSideView}>Toggle Side View</button>
                    <button className="btn-toolbar" onClick={this.randomizeCharacter}>Randomize</button>
                </div>
                <div id="character-props">
                    {elements}
                </div>
                <div id="character-preview" onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} tabIndex="0">
                    <svg id="character-svg">
                        <World>
                            <Character id="player1" settings={this.state} />
                            <Character id="player2" settings={this.randomCharacterSettings} />
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