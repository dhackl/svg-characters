import React, { Component } from 'react';

import './CharacterEditor.css';
import ColorUtils from '../util/ColorUtils';
import Clothes from './Clothes';
import Hair from './Hair';
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
                isFemale: false,
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
                colorLegs: '#20243c'
            },
            name: ''
        };

        this.randomizeCharacter = this.randomizeCharacter.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.finish = this.finish.bind(this);

    }

    componentWillMount() {
        this.randomizeCharacter();
    }

    setProp(prop, val) {
        var propCat = prop.cat;
        var propName = prop.name;
        var bodyPart = this.state[propCat];
        bodyPart[propName] = val;
        
        var state = this.state;
        state[bodyPart] = bodyPart;
        this.setState(state);
        
        /*if (prop.name === 'isFemale') {
            this.setProp({cat: 'hair', name: 'hairStyle'}, val === true ? Hair.hairWomen.values().next().value : Hair.hairMen.values().next().value);
        }*/
        
        /*this.buildSVG(this.state, true);

        if (prop.cat === 'clothes') {
            if (prop.name.indexOf('Top') >= 0)
                this.buildClothesTop(this.state, true);
            else
                this.buildClothesLegs(this.state, true);
        }*/

    }

    handleNameChange(ev) {
        this.setState({
            name: ev.target.value
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

    getRandomCharacterSettings() {
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
                val = randomKey;
                if (!val) 
                    val = prop.val;
            }
            else {
                val = prop.min + Math.floor(Math.random() * (prop.max - prop.min));
            }

            bodyPart[prop.name] = val;
            
        }

        settings.body.isFemale = isFemale;

        return settings;   
    }

    randomizeCharacter() {
        this.setState(this.getRandomCharacterSettings());
    }

    finish() {
        this.props.onFinished(this.state);
    }

    render() {
        let propGroups = this.groupByArray(this.state.body.isFemale ? CharacterProperties.propsFemale : CharacterProperties.propsMale, 'cat');

        let elements = propGroups.map(group => 
            <PropertyGroupBox name={group.key} key={group.key} >
                {
                    group.values.map(prop => {
                        if (prop.type === 'color')
                            return <PropertyColorPicker prop={prop} key={prop.cat + prop.name} change={this.setProp.bind(this)}/>
                        else if (prop.type === 'string')
                            return <PropertyDropdown prop={prop} key={prop.cat + prop.name} items={prop.items} change={this.setProp.bind(this)}/>
                        else if (prop.type === 'bool')
                            return <PropertyCheckbox prop={prop} key={prop.cat + prop.name} change={this.setProp.bind(this)}/>
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
                    <button className="btn-toolbar" onClick={this.finish}>Connect</button>       
                    <input placeholder="Enter name..." onChange={this.handleNameChange}></input>
                </div>
                <div id="character-props">
                    {elements}
                </div>
                <div id="character-preview" tabIndex="0">
                    <svg id="character-svg">
                        <Character isFemale={this.state.body.isFemale} id="player1-preview" settings={this.state} />
                    </svg>
                </div>
            </div>
        );
    }
}

class PropertyGroupBox extends Component {

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

class PropertyCheckbox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            checked: this.props.prop.val
        }

        this.valueChanged = this.valueChanged.bind(this);
    }

    valueChanged(ev) {
        this.setState({
            checked: ev.target.checked
        });
        this.props.change(this.props.prop, ev.target.checked);
    }

    render() {
        return (
            <div className="prop-checkbox">
                <span className="prop-label">{this.props.prop.name}</span>
                <input type="checkbox" className="prop-value" checked={this.state.checked} onChange={this.valueChanged} />
            </div>
        );
    }
}

/*class Toolbar extends Component {

    render() {
        return (
            <div></div>
        );
    }
}*/