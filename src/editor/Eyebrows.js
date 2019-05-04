import React, { Component } from 'react';
import ColorUtils from '../util/ColorUtils';

export default class Eyebrows extends Component {

    constructor(props) {
        super(props);

    }

    buildSVG() {
        var right = 0 + Number(this.props.eyeProps.width);
        var left = 0 - Number(this.props.eyeProps.width);
        var top = 0 - Number(this.props.eyeProps.height);
        var bottom = 0 + Number(this.props.eyeProps.height);

        var s = 5;

        var pathStr = `
        m 0 0
        c 1.95,-1.05 7.55,-2.50 8.10,-1.55 
        l 0,1.05 
        c -2.30,-0.60 -6.65,0.10 -8.10,1.25 z
        `;

        return pathStr;
    }

    render() {
        let d = this.buildSVG();

        let width = this.props.eyeProps.width;
        let color = ColorUtils.blend(this.props.hairProps.hairColor, '#000000', 0.5);
        let scale = 4.5;

        return (
            <g className="eyebrow-group" transform={`translate(50 25)`}>
                <g className="left-brow" transform={`translate(${-this.props.eyeProps.distance - 25} 0) scale(${scale} ${scale})`} >
                    <path d={d} style={{fill: color}} />
                </g>
                <g className="right-brow" transform={`translate(${Number(this.props.eyeProps.distance) + 25} 0) scale(-${scale} ${scale})`}>
                    <path d={d} style={{fill: color}} />
                </g>                
            </g>
        );
    }
}