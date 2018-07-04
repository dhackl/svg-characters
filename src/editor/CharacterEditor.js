import React, { Component } from 'react';
import './CharacterEditor.css';
import Point from '../util/Point';
import Rectangle from '../util/Rectangle';
import ColorUtils from '../util/ColorUtils';
import Eyes from './Eyes';
import Ears from './Ears';
import Mouth from './Mouth';
import Eyebrows from './Eyebrows';
import Neck from './Neck';

export default class CharacterEditor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            head: {
                width: 60,
                height: 90,
                skinColor: '#f3bf85'
            },
            eye: {
                distance: 25,
                width: 15,
                height: 8
            },
            ear: {
                color: '#f3bf85'
            },
            mouth: {
                width: 15,
                height: 8
            },
            neck: {
                width: 30,
                height: 30
            },
            headBounds: new Rectangle(),
            svg: '',
            zoom: 1.5
        };

        this.characterProperties = [{
            cat: 'head',
            name: 'width',
            min: 20,
            max: 120,
            val: 60,
        }, {
            cat: 'head',
            name: 'height',
            min: 20,
            max: 120,
            val: 90,
        }, {
            cat: 'head',
            name: 'skinColor',
            type: 'color',
            val: '#f3bf85',
        }, {
            cat: 'eye',
            name: 'distance',
            min: 10,
            max: 50,
            val: 25
        }, {
            cat: 'eye',
            name: 'width',
            min: 5,
            max: 30,
            val: 15
        }, {
            cat: 'eye',
            name: 'height',
            min: 1,
            max: 20,
            val: 8
        }, {
            cat: 'ear',
            name: 'color',
            type: 'color',
            val: '#f3bf85'
        }, {
            cat: 'mouth',
            name: 'width',
            min: 5,
            max: 30,
            val: 15
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
            max: 50,
            val: 30
        }, {
            cat: 'neck',
            name: 'height',
            min: 5,
            max: 50,
            val: 30
        }];

        this.buildSVG = this.buildSVG.bind(this);
    }

    componentDidMount() {
        this.buildSVG();
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
    }

    buildSVG() {
        var right = 60 + Number(this.state.head.width);
        var left = 40 - Number(this.state.head.width);
        var top = 60 - Number(this.state.head.height);
        var bottom = 60 + Number(this.state.head.height);

        var s = 20;

        var pathStr = `
        M ${right} 50 
        C ${right} ${right - s} ${right - s} ${bottom} 50 ${bottom}
          ${left + s} ${bottom} ${left} ${right - s} ${left} 50 
          ${left} ${left + s} ${left + s} ${top} 50 ${top}
          ${right - s} ${top} ${right} ${left + s} ${right} 50 Z
        `;

        this.setState({
            svg: pathStr,
            headBounds: new Rectangle(left, top, right - left, bottom - top)
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
                    <svg>
                        <defs>
                            <linearGradient id="mouth-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0" stopColor="#e69c6b" />
                                <stop offset="1" stopColor="#bc5d38" />                                
                            </linearGradient>
                            <linearGradient id="neck-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0" stopColor={ColorUtils.blend(this.state.head.skinColor, '#552200', 0.2)} />
                                <stop offset="1" stopColor={this.state.head.skinColor} />                                
                            </linearGradient>
                        </defs>

                        <g id="character-outer" transform={`scale(${this.state.zoom} ${this.state.zoom})`}>
                            <Neck neckProps={this.state.neck} headBounds={this.state.headBounds} />

                            <path id="head-main" d={this.state.svg} style={{fill: this.state.head.skinColor}} />

                            <Eyes eyeProps={this.state.eye} headBounds={this.state.headBounds} />
                            <Eyebrows eyeProps={this.state.eye} headBounds={this.state.headBounds} />

                            <Ears earProps={this.state.ear} headBounds={this.state.headBounds} />
                            <Mouth mouthProps={this.state.mouth} headBounds={this.state.headBounds} />
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
        this.props.change(this.props.prop, ev.target.value);
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