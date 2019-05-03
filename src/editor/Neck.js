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

        let width = this.props.neckProps.width * 0.2;
        let height = this.props.neckProps.height * 0.1;
        
        return (
            <g id="neck-group" transform={`translate(${45 + (1 - width) * 10} ${this.props.headBounds.bottom() - 10}) scale(${-width} ${height})`}>
                <path d={d} style={{fill: `url(#neck-gradient-${this.props.id})`}} />
            </g>
        );
    }
}