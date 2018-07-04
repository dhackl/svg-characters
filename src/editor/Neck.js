import React, { Component } from 'react';

export default class Neck extends Component {

    constructor(props) {
        super(props);

    }

    buildSVG() {
        var pathStr = `
        m 0 0
        c 0,0 -0.266713,7.909423 1.432719,10.852925 
          -3.321992,12.397856 -14.642483,12.188993 -17.953965,-0.169622 
          1.416287,-2.861991 1.22075,-10.690803 1.22075,-10.690803 z
        `;

        return pathStr;
    }

    render() {
        let d = this.buildSVG();

        let width = this.props.neckProps.width * 0.1;
        let height = this.props.neckProps.height * 0.1;
        
        return (
            <g id="neck-group" transform={`translate(${this.props.headBounds.width / 2} ${this.props.headBounds.bottom() - 10})`}>
                <path d={d} style={{fill: 'url(#neck-gradient)'}} transform={`scale(${width} ${height})`} />
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