import React, { Component } from 'react';

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
        c 1.2416625,-1.321805 2.110102,-1.710216 3.663447,-1.611702 
          2.688591,0.170512 2.715064,0.342916 4.069621,1.428024 
        l 0.40722,0.765202 
        c -1.560116,-1.276853 -2.408488,-1.312147 -4.547753,-1.363311 
          -1.66446,-0.03981 -3.6457501,0.564999 -4.0855141,2.134534 z
        `;

        return pathStr;
    }

    render() {
        let d = this.buildSVG();

        let width = this.props.eyeProps.width;
        let color = '#62371b';
        let scale = 4.5;

        return (
            <g id="eyebrow-group" transform={`translate(${this.props.headBounds.width / 3} 25)`}>
                <g id="left-brow" transform={`translate(${-this.props.eyeProps.distance - 20} 0) scale(${scale} ${scale})`} >
                    <path d={d} style={{fill: color}} />
                </g>
                <g id="right-brow" transform={`translate(${this.props.eyeProps.distance - 20} 0) scale(${scale} ${scale})`}>
                    <path d={d} style={{fill: color}} />
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