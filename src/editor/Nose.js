import React, { Component } from 'react';
import ColorUtils from './../util/ColorUtils';

export default class Nose extends Component {

    constructor(props) {
        super(props);

    }

    buildSVG() {
        var pathStr = `
        m 0 0 
        c 1.273361,1.061138 0.18341,2.049409 -0.479769,2.18223 
          -0.767185,0.15367 -1.390914,-0.701886 -2.751613,-0.678259 
          -0.586079,0.01005 -1.478862,0.576844 -2.43123,0.727842 
          -0.387165,0.06138 -1.340644,-1.049088 -0.701252,-1.724331 
          1.170517,-1.236133 1.295165,-2.034874 1.469181,-3.417798 
          0.283951,-2.256763 0.427827,-3.905377 1.021607,-4.538552 
          0.867403,-0.867403 1.134839,-0.796458 1.828879,-0.03625 
          0.789596,0.964565 0.783924,3.6602 0.783924,3.6602 
          0.283964,1.517977 0.359999,3.02204 1.260273,3.824918 z
        `;

        return pathStr;
    }

    render() {
        let d = this.buildSVG();

        let width = this.props.noseProps.width * 0.1;
        let height = this.props.noseProps.height * 0.1;
        
        return (
            <g id="nose-group" transform={`translate(${60 + (1 - width) * 2} ${this.props.headBounds.bottom() - 80})`}>
                <path d={d} style={{fill: ColorUtils.blend(this.props.bodyProps.skinColor, '#772200', 0.2)}} transform={`scale(${width} ${height})`} />
                <path d={d} style={{fill: this.props.bodyProps.skinColor}} transform={`translate(4 -2) scale(${width} ${height})`} />
            </g>
        );
    }
}