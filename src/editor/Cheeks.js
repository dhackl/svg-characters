import React, { Component } from 'react';

export default class Cheeks extends Component {

    constructor(props) {
        super(props);

    }

    buildSVG() {
        var pathStr = `
        m 0,0 
        c 2.8761,8.34719 6.8794,22.2705 8.2885,23.86648 6.214,7.03836 21.2278,-13.87643 21.2278,-22.79886 0,-8.92242 -9.3194,-22.77477 -18.7084,-22.77477 -9.3889,0 -13.7146,13.27145 -10.8079,21.70715 z
        `;

        return pathStr;
    }

    render() {
        let d = this.buildSVG();

        let intensity = 0.15;

        return (
            <g className="cheeks-group" transform={`translate(${0} ${this.props.headBounds.bottom() - 75})`} >
                <path className="cheek" d={d} transform={`scale(1 1)`} filter="url(#filter-blur)" style={{fill: '#d0614b', opacity: intensity}} />
                <path className="cheek" d={d} transform={`translate(100 0) scale(-1 1)`} filter="url(#filter-blur)" style={{fill: '#d0614b', opacity: intensity}} />
            </g>
        );
    }
}