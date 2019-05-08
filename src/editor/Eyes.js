import React, { Component } from 'react';
import SVG from 'svg.js';
import ColorUtils from './../util/ColorUtils';

export default class Eyes extends Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        //SVG.get('eye-lid').animate(100).attr({ d: this.buildEyeLid(1) }).loop(true, true);
    }

    buildSVG() {
        var right = 0 + Number(this.props.eyeProps.width);
        var left = 0 - Number(this.props.eyeProps.width);
        var top = 0 - Number(this.props.eyeProps.height);
        var bottom = 0 + Number(this.props.eyeProps.height);

        var pathStr = `
        M ${right} 0 
        C ${right} 0 ${right / 2} ${bottom} 0 ${bottom}
          ${left / 2} ${bottom} ${left} 0 ${left} 0 
          ${left} 0 ${left / 2} ${top} 0 ${top}
          ${right / 2} ${top} ${right} 0 ${right} 0 Z
        `;

        return pathStr;
    }

    buildEyeLid(lidSize) {
        var right = 0 + this.props.eyeProps.width;
        var left = 0 - this.props.eyeProps.width;
        var top = 0 - this.props.eyeProps.height;
        var bottom = top + this.props.eyeProps.height * 2 * lidSize; // Lid

        var pathStr = `
        M ${right} 0 
        C ${right} 0 ${right / 2} ${bottom} 0 ${bottom}
          ${left / 2} ${bottom} ${left} 0 ${left} 0 
          ${left} 0 ${left / 2} ${top} 0 ${top}
          ${right / 2} ${top} ${right} 0 ${right} 0 Z
        `;

        return pathStr;
    }

    buildEyeShade() {
        var right = 0 + this.props.eyeProps.width;
        var left = 0 - this.props.eyeProps.width;
        var top = 0 + this.props.eyeProps.height * 2 * 0.8;
        var bottom = this.props.eyeProps.height;

        var pathStr = `
        M ${right} 0 
        C ${right} 0 ${right / 2} ${bottom} 0 ${bottom}
          ${left / 2} ${bottom} ${left} 0 ${left} 0 
          ${left} 0 ${left / 2} ${top} 0 ${top}
          ${right / 2} ${top} ${right} 0 ${right} 0 Z
        `;

        return pathStr;
    }

    render() {
        let d = this.buildSVG();
        let dLid = this.buildEyeLid(this.props.eyeProps.eyeLid * 0.01);
        let lidColor = this.props.isFemale === true ? 'rgb(130, 80, 70)' : ColorUtils.blend(this.props.bodyProps.skinColor, '#552200', 0.2);

        let width = this.props.eyeProps.width;
        let innerEye = (
            <g>
                <ellipse
                    cx={0} 
                    cy={0} 
                    rx={width * 0.3}
                    ry={width * 0.35}
                    style={{fill: '#000'}} />
                <ellipse
                    cx={0} 
                    cy={0} 
                    rx={width * 0.2}
                    ry={width * 0.25}
                    style={{fill: '#666'}} />
                <ellipse
                    cx={0 + width * 0.06} 
                    cy={0 + width * 0.06} 
                    rx={width * 0.06}
                    ry={width * 0.06}
                    style={{fill: '#fff'}} />
                <rect
                    x={0}
                    y={0 - width * 0.4}
                    width={width * 0.5}
                    height={width * 0.3}
                    style={{fill: '#fff', fillOpacity: 0.25}} />
            </g>
        );
        
        return (
            <g className="eyes-group" transform={`translate(50 40)`}>
                <g className="left-eye" transform={`translate(${-this.props.eyeProps.distance} 0)`} >
                    {this.props.isFemale === true &&
                        <path d={this.buildEyeShade()} filter="url(#filter-blur)" style={{fill: '#000', opacity: 0.7}} transform="translate(0 0)" />
                    }
                    <path d={d} style={{fill: '#fff'}} />
                    {innerEye}
                    <path d={dLid} className="eye-lid" style={{fill: lidColor}} />
                   
                </g>
                <g className="right-eye" transform={`translate(${this.props.eyeProps.distance} 0) scale(-1 1)`}>
                    {this.props.isFemale === true &&
                        <path d={this.buildEyeShade()} filter="url(#filter-blur)" style={{fill: '#000', opacity: 0.7}} transform="translate(0 0)" />
                    }
                    <path d={d} style={{fill: '#fff'}} />
                    {innerEye}
                    <path d={dLid} className="eye-lid" style={{fill: lidColor}} />
                    
                </g>                
            </g>
        );
    }
}