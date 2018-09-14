import React, { Component } from 'react';

export default class Ears extends Component {

    constructor(props) {
        super(props);

    }

    buildSVG() {
        var pathStr = `
        m 0 0
        a 4.1104907,4.5357142 0 0 0 -4.110861,4.535641 4.1104907,4.5357142 0 0 0 1.509988,3.50883 3.6380208,4.0159969 0 0 0 -0.28112,1.546675 3.6380208,4.0159969 0 0 0 3.638021,4.016293 3.6380208,4.0159969 0 0 0 3.638021,-4.016293 3.6380208,4.0159969 0 0 0 -0.913125,-2.653067 4.1104907,4.5357142 0 0 0 0.62942,-2.402438 4.1104907,4.5357142 0 0 0 -4.110344,-4.535641 z
        `;

        return pathStr;
    }

    render() {
        let d = this.buildSVG();

        //let innerEar = (
        
        return (
            <g id="ears-group">
                <g id="left-ear" transform={`translate(${this.props.headBounds.left() - 5} 40) scale(3 3)`} >
                    <path d={d} style={{fill: this.props.bodyProps.skinColor}} />
                </g>
                <g id="right-ear" transform={`translate(${this.props.headBounds.right() + 5} 40) scale(-3 3)`} >
                    <path d={d} style={{fill: this.props.bodyProps.skinColor}} />
                </g>                
            </g>
        );
    }
}