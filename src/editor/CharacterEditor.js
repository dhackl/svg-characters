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
            zoom: 1.5
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
            min: 5,
            max: 30,
            val: 15
        }, {
            cat: 'neck',
            name: 'height',
            min: 5,
            max: 50,
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
    }

    componentDidMount() {
        this.buildSVG();
        
        //this.transformSidePose();

        // Animate character
        this.startBodyAnimation();

        Clothes.init();
        this.buildClothesTop();
        this.buildClothesLegs();

        // Generate side-view of character
        // #CLONE
        //let clone = SVG.get('character-outer').clone();
        //clone.dmove(200, 0);
        // #USE
        //let draw = SVG.adopt(document.getElementById('character-svg'));
        //let clone = draw.use(SVG.get('character-outer')).dmove(400, 0);
        
    }

    transformSidePose() {
        // Face
        SVG.get('left-eye').dmove(50, 0);
        SVG.get('left-brow').dmove(50, 0);
        SVG.get('right-eye').hide();
        SVG.get('right-brow').hide();

        SVG.get('right-ear').hide();
        SVG.get('nose-group').dmove(70, 0);

        // Arms
        SVG.get('left-arm').dmove(20, 0);
        SVG.get('right-arm').dmove(20, 0).flip('x').back();
    }

    startBodyAnimation() {
        // Arms
        SVG.get('right-arm').animate(500).scale(1, 1.2, 0, 0).loop(true, true);
        SVG.get('left-arm').animate(500).delay(500).scale(1, 1.2, 0, 0).loop(true, true);

        // Legs
        SVG.get('left-leg').animate(500).scale(1, 1.2, 0, 0).loop(true, true);
        SVG.get('right-leg').animate(500).delay(500).scale(1, 1.2, 0, 0).loop(true, true);

        // Body Shaking
        SVG.get('character-head').animate(500).dmove(0, 5).loop(true, true);
    }

    startBlinkAnimation() {

    }

    stopBodyAnimation() {

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
                this.buildClothesTop();
            else
                this.buildClothesLegs();
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

    buildClothesTop() {
        // If naked -> return empty path
        if (this.state.clothes.styleTop === Clothes.STYLE_NAKED) {
            let clothes = this.state.clothes;
            clothes.clothUpperArm = '';
            clothes.clothLowerArm = '';
            clothes.clothTorso = '';
            this.setState({
                clothes: clothes
            });
            return;
        }

        // Otherwise -> load clothes
        Clothes.getClothesTop(this.state.clothes.styleTop).then(text => {
            var parser = new DOMParser();

            // Substitute colors
            text = text.replace(new RegExp(Clothes.COLOR_PRIMARY, 'g'), this.state.clothes.colorTop);
            text = text.replace(new RegExp(Clothes.COLOR_PRIMARY_DARK, 'g'), ColorUtils.blend(this.state.clothes.colorTop, '#000000', 0.3));

            var doc = parser.parseFromString(text, "image/svg+xml");
            let upperArm = doc.getElementById('upper-arm');
            let lowerArm = doc.getElementById('lower-arm');
            let torso = doc.getElementById('torso');
            
            let clothes = this.state.clothes;
            clothes.clothUpperArm = upperArm != null ? upperArm.outerHTML : '';
            clothes.clothLowerArm = lowerArm != null ? lowerArm.outerHTML : '';
            clothes.clothTorso = torso != null ? torso.outerHTML : '';
            
            this.setState({
                clothes: clothes
            });
        });

    }

    buildClothesLegs() {
        // If naked -> return empty path
        if (this.state.clothes.styleLegs === Clothes.STYLE_NAKED) {
            let clothes = this.state.clothes;
            clothes.clothUpperLeg = '';
            clothes.clothLowerLeg = '';
            this.setState({
                clothes: clothes
            });
            return;
        }

        // Otherwise -> load clothes
        Clothes.getClothesLegs(this.state.clothes.styleLegs).then(text => {
            var parser = new DOMParser();

            // Substitute colors
            text = text.replace(new RegExp(Clothes.COLOR_PRIMARY, 'g'), this.state.clothes.colorLegs);
            text = text.replace(new RegExp(Clothes.COLOR_PRIMARY_DARK, 'g'), ColorUtils.blend(this.state.clothes.colorLegs, '#000000', 0.3));

            var doc = parser.parseFromString(text, "image/svg+xml");
            let upperLeg = doc.getElementById('upper-leg');
            let lowerLeg = doc.getElementById('lower-leg');
            
            let clothes = this.state.clothes;
            clothes.clothUpperLeg = upperLeg != null ? upperLeg.outerHTML : '';
            clothes.clothLowerLeg = lowerLeg != null ? lowerLeg.outerHTML : '';
            
            this.setState({
                clothes: clothes
            });
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
                <div id="character-props">
                    {elements}
                </div>
                <div id="character-preview">
                    <svg id="character-svg">
                        <defs>
                            <linearGradient id="mouth-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0" stopColor="#e69c6b" />
                                <stop offset="1" stopColor="#bc5d38" />                                
                            </linearGradient>
                            <linearGradient id="neck-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0" stopColor={ColorUtils.blend(this.state.body.skinColor, '#552200', 0.2)} />
                                <stop offset="1" stopColor={this.state.body.skinColor} />                                
                            </linearGradient>
                            <linearGradient id="linear-01">
                                <stop offset="0" stopColor={this.state.clothes.colorTop} />
                                <stop offset="0.5" stopColor={ColorUtils.shade(this.state.clothes.colorTop, 0.5)} />
                                <stop offset="1" stopColor={this.state.clothes.colorTop} />
                            </linearGradient>
                        </defs>

                        <g id="character-outer" transform={`translate(0 100) scale(${this.state.zoom} ${this.state.zoom})`}>

                            <g id="character-head">
                                <Neck neckProps={this.state.neck} headBounds={this.state.headBounds} />

                                <path id="head-main" d={this.state.svg} style={{fill: this.state.body.skinColor}} />

                                <Eyes eyeProps={this.state.eye} bodyProps={this.state.body} headBounds={this.state.headBounds} />
                                <Eyebrows eyeProps={this.state.eye} headBounds={this.state.headBounds} />

                                <Mouth mouthProps={this.state.mouth} headBounds={this.state.headBounds} />
                                <Nose noseProps={this.state.nose} bodyProps={this.state.body} headBounds={this.state.headBounds} />

                                <Ears earProps={this.state.ear} bodyProps={this.state.body} headBounds={this.state.headBounds} />

                                <Hair hairProps={this.state.hair} headBounds={this.state.headBounds} />
                            </g>

                            <g id="left-leg" transform={`translate(-10 380) scale(1 1)`}>
                                <Leg elemId="left-leg-inner" bodyProps={this.state.body}  />
                                <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothUpperLeg}}></g>
                                <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothLowerLeg}}></g>
                            </g>
                            <g id="right-leg" transform={`translate(100 380) scale(-1 1)`}>
                                <Leg elemId="right-leg-inner" bodyProps={this.state.body}  />
                                <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothUpperLeg}}></g>
                                <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothLowerLeg}}></g>
                            </g>
                            

                        
                            <Torso bodyProps={this.state.body} />
                            <g transform="translate(-45 155)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothTorso}}></g>

                            <g id="right-arm" transform={`translate(130 195) scale(-1 1)`}>
                                <Arm id="right-arm-inner" bodyProps={this.state.body} />
                                <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothUpperArm}}></g>
                                <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothLowerArm}}></g>
                            </g>

                            <g id="left-arm" transform={`translate(-40 195) scale(1 1)`}>
                                <Arm id="left-arm-inner" bodyProps={this.state.body} />
                                <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothUpperArm}}></g>
                                <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothLowerArm}}></g>
                            </g>

                        </g>
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