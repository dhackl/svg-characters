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
                <UpperArm bodyProps={this.props.bodyProps}>
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

        return (
            <g id="upper-arm-group" transform={`rotate(20 5 5)`}>
                <path d={dArm} style={{fill: this.props.bodyProps.skinColor}} transform={`translate(0 12) scale(1.2 1.2)`} />
                <path d={dShoulder} style={{fill: '#aa3311'}} transform={`translate(10 7) scale(1.2 1.2)`} />
                <LowerArm bodyProps={this.props.bodyProps} />
            </g>
        );
    }
}

class LowerArm extends Component {

    constructor(props) {
        super(props);
    }

    buildArm() {
        var pathStr = `
        m 0 0 
        h 5.70 
        v 15.60 
        h -5.70 z
        `;

        return pathStr;
    }

    render() {
        let dArm = this.buildArm();
        //let width = this.props.noseProps.width * 0.1;
        //let height = this.props.noseProps.height * 0.1;
        
        return (
            <g id="lower-arm-group" transform={`translate(0 30) rotate(-40 0 0)`}>
                <path d={dArm} style={{fill: this.props.bodyProps.skinColor}} />
                <Hand bodyProps={this.props.bodyProps} />
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
        
        return (
            <g id="hand-group" transform={`translate(0 15) scale(0.3 0.3)`}>
                <path d={dHand} style={{fill: this.props.bodyProps.skinColor}} />
                <path d={dThumb} style={{fill: this.props.bodyProps.skinColor}} transform={`translate(15 2)`} />
            </g>
        );
    }
}