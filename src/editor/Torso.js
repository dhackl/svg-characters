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

        if (this.props.isFemale === true) {
            pathStr = `m 10.580878,-1.6285714 c 0.544245,8.0258428 11.005041,9.3086134 12.214284,-0.1785717 0.421403,2.8811585 3.17452,4.6700104 7.884093,5.084563 0.56292,2.4863344 -3.466019,6.9945871 -0.183048,13.2780141 2.825267,5.407409 -1.56616,9.816352 -2.068901,13.165994 0.271428,8.45 1.196429,9.932143 1.696429,19.982143 l -26.6285719,0.08929 c 0,-4.829434 1.3035719,-11.896428 0.803572,-21.946428 C -0.65849811,23.942143 -0.05869363,19.51467 1.6209577,15.831057 4.4964057,9.5249648 1.9606122,8.5605671 2.3790921,3.9285714 6.0705421,2.8674636 8.5748507,3.316748 10.580878,-1.6285714 Z`;
        }

        return pathStr;
    }

    buildBreast() {
        var pathStr = `
        m 0,0 a 6.3415954,6.657588 1.4525126 0 0 -0.735703,5.824162 6.3415954,6.657588 1.4525126 0 0 8.038654,4.15624 6.3415954,6.657588 1.4525126 0 0 3.722886,-3.538345 6.3415954,6.657588 1.4525126 0 1 -3.242516,2.625218 6.3415954,6.657588 1.4525126 0 1 -8.038653,-4.15624 6.3415954,6.657588 1.4525126 0 1 0.255332,-4.911035 z
        `;

        return pathStr;
    }

    render() {
        let d = this.buildSVG();

        //let width = this.props.noseProps.width * 0.1;
        //let height = this.props.noseProps.height * 0.1;
        
        let darkerColor =  ColorUtils.blend(this.props.bodyProps.skinColor, '#000', 0.1);

        return (
            <g className="torso-group" transform={`translate(-18 180) scale(4 4)`}>
                <path d={d} style={{fill: this.props.bodyProps.skinColor}} transform={`translate(0 0)`} />
                
                <g transform={`translate(1 17)`}>
                    <path d={this.buildBreast()} style={{fill: darkerColor}} />
                    <ellipse cx="5" cy="5" rx="0.4" ry="0.8" style={{fill: darkerColor}} />
                </g>
                <g transform={`translate(30 17) scale(-1 1)`}>
                    <path d={this.buildBreast()} style={{fill: darkerColor}} />
                    <ellipse cx="5" cy="5" rx="0.4" ry="0.8" style={{fill: darkerColor}} />
                </g>
            </g>
        );
    }
}