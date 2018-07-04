import React, { Component } from 'react';

export default class Eyes extends Component {

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

        let width = this.props.eyeProps.width;
        let innerEye = (
            <g>
                <ellipse
                    cx={0} 
                    cy={0} 
                    rx={width * 0.4}
                    ry={width * 0.4}
                    style={{fill: '#000'}} />
                <ellipse
                    cx={0} 
                    cy={0} 
                    rx={width * 0.3}
                    ry={width * 0.3}
                    style={{fill: '#444'}} />
                <ellipse
                    cx={0 + width * 0.06} 
                    cy={0 + width * 0.06} 
                    rx={width * 0.06}
                    ry={width * 0.06}
                    style={{fill: '#fff'}} />
                <rect
                    x={0}
                    y={0 - width * 0.6}
                    width={width * 0.6}
                    height={width * 0.4}
                    style={{fill: '#fff', fillOpacity: 0.25}} />
            </g>
        );
        
        return (
            <g id="eyes-group" transform={`translate(${this.props.headBounds.width / 3} 40)`}>
                <g id="left-eye" transform={`translate(${-this.props.eyeProps.distance} 0)`} >
                    <path d={d} style={{fill: '#fff'}} />
                    {innerEye}
                </g>
                <g id="right-eye" transform={`translate(${this.props.eyeProps.distance} 0) scale(-1 1)`}>
                    <path d={d} style={{fill: '#fff'}} />
                    {innerEye}
                </g>                
            </g>
        );
    }

    /*render() {
        let d = this.buildSVG();

        return (
            <g id="eyes-group">
                <ellipse id="left-eye"
                    cx={Number(this.props.headBounds.left()) + Number(this.props.eyeProps.distance)} 
                    cy={this.props.headBounds.top() + 50} 
                    rx={this.props.eyeProps.width}
                    ry={this.props.eyeProps.height}
                    style={{fill: '#fff'}} />

                <ellipse id="right-eye"
                    cx={this.props.headBounds.right() - this.props.eyeProps.distance} 
                    cy={this.props.headBounds.top() + 50} 
                    rx={this.props.eyeProps.width}
                    ry={this.props.eyeProps.height}
                    style={{fill: '#fff'}} />
            </g>
        )
    }*/
}