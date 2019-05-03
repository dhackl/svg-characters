import React, { Component } from 'react';
import ColorUtils from './../util/ColorUtils';

export default class Torso extends Component {

    constructor(props) {
        super(props);

    }

    buildSVG() {
        let fat = this.props.bodyProps.fat * 0.2;

        var pathStr = `
        m 9.65,-3.95 
          c 0,9.75 12.75,10.20 12.75,0
          l 9.65,3.95 
          c ${2.25 + fat},7.75 ${1.20 + fat},17.50 0,32.40 
            ${-0.55 + fat},4.70 ${-1.50 + fat},8.95 0,19.00 
          h -32.70 
          c ${0.55 - fat},-4.70 ${1.50 - fat},-8.95 0,-19.00 
            ${-2.25 - fat},-7.75 ${-1.20 - fat},-17.50 0,-32.40 z
        `;

        return pathStr;
    }

    render() {
        let d = this.buildSVG();

        //let width = this.props.noseProps.width * 0.1;
        //let height = this.props.noseProps.height * 0.1;
        
        return (
            <g className="torso-group" transform={`translate(-18 180) scale(4 4)`}>
                <path d={d} style={{fill: this.props.bodyProps.skinColor}} transform={`translate(0 0)`} />
            </g>
        );
    }
}