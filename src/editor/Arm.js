import React, { Component } from 'react';
import ColorUtils from './../util/ColorUtils';

export default class Arm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        //let width = this.props.noseProps.width * 0.1;
        //let height = this.props.noseProps.height * 0.1;
        
        return (
            <g id="arm-group" transform={this.props.transform}>
                <UpperArm bodyProps={this.props.bodyProps} isFemale={this.props.isFemale}>
                </UpperArm>
            </g>
        );
    }
}

class UpperArm extends Component {

    constructor(props) {
        super(props);
    }

    buildShoulder() {
        var pathStr = `
        m 0 0 
        c 0,-2.35 -1.00,-4.50 -2.75,-5.70 
          -1.70,-1.20 -3.75,-1.15 -5.50,0 
          -1.70,1.80 -2.75,3.35 -2.75,5.70 
        l 0,7.15 11,0 z
        `;

        if (this.props.isFemale === true) {
            pathStr = `
            m 0,0 
            c 0,-2.35 -1,-4.5 -2.75,-5.7 
            -0.8161165,-0.183534 -2.773787,-0.1777282 -3.6109127,0 
            -1.7,1.8 -2.75,3.35 -2.75,5.7 
            v 7.15 h 7.1109127 z`;
        }

        return pathStr;
    }

    buildArm() {
        var pathStr = `
        m 0 0
        h 5.70 
        c 3.75,0.95 1.75,9.75 0,18.25 
        h -5.70 
        c -0.35,-6.50 -2.80,-15.55 0,-18.25 z
        `;

        if (this.props.isFemale === true) {
            pathStr = `
            m 1,0 7.3071431,0 c 1.494642,-0.4734453 -1.375,8.7290255 -1.375,18.2499997 h -4.3250001 c -0.151204,0 -2.742754,-17.0334986 -1.607143,-18.2499997 z
            `;
        }

        return pathStr;
    }

    sidePose() {
        //return ;
    }

    render() {
        let dShoulder = this.buildShoulder();
        let dArm = this.buildArm();
        //let width = this.props.noseProps.width * 0.1;
        //let height = this.props.noseProps.height * 0.1;
        
        let offsetX = this.props.bodyProps.direction == 1 ? 10 : 0;

        let rotation = this.props.isFemale === true ? 20 : 20;

        return (
            <g id="upper-arm-group" transform={`scale(4.3 4.3) rotate(${rotation} 5 5)`}>
                <path d={dArm} style={{fill: this.props.bodyProps.skinColor}} transform={`translate(0 12) scale(1 1)`} />
                <path d={dShoulder} style={{fill: this.props.bodyProps.skinColor}} transform={`translate(10 7) scale(1 1)`} />
                <LowerArm bodyProps={this.props.bodyProps} isFemale={this.props.isFemale} />
            </g>
        );
    }
}

class LowerArm extends Component {

    constructor(props) {
        super(props);
    }

    buildArm() {
        /*var pathStr = `
        m 0 0 
        h 5.70 
        v 15.60 
        h -5.70 z
        `;*/
        var pathStr = `
        m 0,0 c 1.88116,-6.64603 7.73478,-0.4098 6.36121,-1.96896 2.26238,2.36971 2.51042,15.32313 4.81068,22.758483 l -4.64925,1.599031 c -5.37348,-17.009043 -7.11155,-18.558942 -6.52264,-22.388554 z
        `;

        if (this.props.isFemale === true) {
            pathStr = `
            m 0,0 c 1.3804974,-5.0439096 3.5767657,-0.85532537 3.9924916,-0.60024157 1.4783654,1.47836544 2.492653,9.97693557 4.9696895,17.58906557 l -3.1466479,1.245478 c 0,0 -6.4044432,-14.40469 -5.8155332,-18.234302 z
            `;
        }

        return pathStr;
    }

    render() {
        let dArm = this.buildArm();
        //let width = this.props.noseProps.width * 0.1;
        //let height = this.props.noseProps.height * 0.1;
        
        let rotation = this.props.isFemale === true ? 20 : 20;
        let femaleOffset = this.props.isFemale === true ? 3 : 0;

        return (
            <g className="lower-arm-group" transform={`translate(${femaleOffset} 30) rotate(-${rotation} 0 0)`}>
                <path d={dArm} style={{fill: this.props.bodyProps.skinColor}} />
                <Hand bodyProps={this.props.bodyProps} isFemale={this.props.isFemale} />
            </g>
        );
    }
}

class Hand extends Component {

    constructor(props) {
        super(props);
    }

    buildHand() {
        var pathStr = `
        m 0,0 
          14.90,-0.50 
          2.35,13.70 
          1,3.90 
          4.35,7.95 
          -4.30,4.55 
          -5.65,-0.30 
          -4.10,0.65 
          -1.95,-2.25 
          -2.65,0.65 
          -5.70,-5.65 
          -2.80,-11.60 z
        `;

        return pathStr;
    }

    buildThumb() {
        var pathStr = `
        m 0,0 
          7.05,2.35 
          3.75,4.65 1.80,4.25 
          -2.85,1.30 
          -5.10,-4.90 
          -7.60,-3.15 z
        `;

        return pathStr;
    }

    render() {
        let dHand = this.buildHand();
        let dThumb = this.buildThumb();
        //let width = this.props.noseProps.width * 0.1;
        //let height = this.props.noseProps.height * 0.1;
        
        let scale = this.props.isFemale === true ? 0.25 : 0.3;

        return (
            <g id="hand-group" transform={`translate(5 15) scale(${scale} ${scale})`}>
                <path d={dHand} style={{fill: this.props.bodyProps.skinColor}} />
                <path d={dThumb} style={{fill: this.props.bodyProps.skinColor}} transform={`translate(15 2)`} />
            </g>
        );
    }
}