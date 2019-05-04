import React, { Component } from 'react';

export default class Mouth extends Component {

    constructor(props) {
        super(props);

    }

    buildSVG() {
        var pathStr = `
            m 0,0 
            c 1.423,-0.2696 4.5723,-1.1073 5.7218,-1.3428 
              2.2379,-0.4586 5.9117,-1.0292 8.4758,-1.0787 
              2.8659,-0.055 4.7111,0.4847 9.0074,1.432 
              4.3925,0.1352 7.2623,-1.2731 11.7555,-1.4829 
              3.7178,-0.1736 7.875,2.0011 10.9104,0.9142 
              -5.4678,10.3329 -35.4173,9.1315 -45.8709,1.5582 z
        `;

        if (this.props.isFemale) {
            pathStr = `
            m -5.536803,-1 c 1.3463877,-0.1546815 9.7487557,3.26090461 11.258603,2.4848837 2.2379,-0.4586 5.9117,-1.0292 8.4758,-1.0787 2.8659,-0.055 4.7111,0.4847 9.0074,1.432 4.3925,0.1352 7.2623,-1.2731 11.7555,-1.4829 3.7178,-0.1736 11.91561,-0.5242813 14.95101,-1.6111813 -6.294983,12.3713472 -46.416712,11.531215 -55.448313,0.2558976 z
            `;
        }

        return pathStr;
    }

    buildLipCrack() {
        var pathStr = `
            m 0 0 
            c 16.3433,2.671 28.074,3.3062 43.0768,-0.8226 
            l -0.3915,0.065 
            c -11.7115,4.3128 -26.2265,3.9879 -43.9697,1.1887 z
        `;

        if (this.props.isFemale) {
            pathStr = `
            m -3,0 c 15.9533112,5.6609158 37.5724552,5.7823268 52.8982282,-0.8226001 l -0.3915,0.065 c -11.812033,6.7255938 -36.184331,7.2615758 -53.7911282,1.1887001 z
            `;
        }

        return pathStr;
    }

    render() {
        let d = this.buildSVG();
        let dLipCrack = this.buildLipCrack();

        let width = this.props.mouthProps.width * 0.05;
        let height = this.props.mouthProps.height * 0.1;

        return (
            <g className="mouth-outer" transform={`translate(${25 + (1 - width) * 20} ${this.props.headBounds.bottom() - 40}) scale(${width} ${height})`}>
                <g className="mouth-group">
                    <path d={d} style={{fill: 'url(#mouth-gradient)'}} />
                    <path d={dLipCrack} style={{fill: '#944527'}} />
                </g>
            </g>
        );
    }
}