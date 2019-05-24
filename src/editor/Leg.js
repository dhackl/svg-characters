import React, { Component } from 'react';

export default class Leg extends Component {

    render() {
        //let width = this.props.noseProps.width * 0.1;
        //let height = this.props.noseProps.height * 0.1;
        //let values = this.props.elemId === 'left-leg' ? '3.5 3.5;3.5 3.9;3.5 3.5' : '-3.5 3.9;-3.5 3.5;-3.5 3.9';

        return (
            <g id={this.props.elemId}>
                <UpperLeg bodyProps={this.props.bodyProps}>
                </UpperLeg>

                
            </g>
        );
    }
}

class UpperLeg extends Component {

    buildUpperLeg() {
        var pathStr = `
        m 0 0 
          17.70,0 
          -1.30,11.10 
          -2.45,11.70 
        c 0.30,6.25 -1.85,12.35 -3.15,19.40 
          -0.60,3.30 -9.25,15.30 -13.35,0.70 
          0.15,-5.90 -0.65,-5.30 -1.15,-19.45 
          0.15,-3.35 -0.05,-7.65 1.35,-18.15 
          0.20,-1.60 2.10,-3.65 2.35,-5.50 z
        `;

        return pathStr;
    }

    render() {
        let dLeg = this.buildUpperLeg();

        //let width = this.props.noseProps.width * 0.1;
        //let height = this.props.noseProps.height * 0.1;
        
        return (
            <g id="upper-leg-group" transform="scale(3.5 3.5)">
                <path d={dLeg} style={{fill: this.props.bodyProps.skinColor}} transform={`translate(0 0)`} />
                <LowerLeg bodyProps={this.props.bodyProps} />
            </g>
        );
    }
}

class LowerLeg extends Component {

    buildLeg() {
        var pathStr = `
        m 0 0 
          0.10,11.15 
        c -0.30,0.85 -0.715,5.40 -0.55,7.40 
          -0.75,3.35 -0.30,9.05 -1.25,11.45 
        l -10.40,-0.35 
        c -1.50,-4.70 -1.00,-7.90 -1.00,-12.50 
          -0.10,-3.75 -1.15,-5.20 0.10,-12.25 
        l 0.35,-4.90 
        c 4.45,-5.40 8.65,-4.85 12.65,0 z
        `;

        return pathStr;
    }

    render() {
        let dLeg = this.buildLeg();
        //let width = this.props.noseProps.width * 0.1;
        //let height = this.props.noseProps.height * 0.1;
        
        return (
            <g id="lower-leg-group" transform={`translate(10 45) rotate(0 0 0)`}>
                <Foot bodyProps={this.props.bodyProps} />
                <path d={dLeg} style={{fill: this.props.bodyProps.skinColor}} />
            </g>
        );
    }
}

class Foot extends Component {

    buildFoot() {
        var pathStr = `
        m 0 0 
          -31.48,2.47 
        c -0.88,9.36 2.50,13.50 2.52,24.10 
        a 3.14,5.41 16.55 0 0 -1.7246,3.1562 3.1455755,5.4184189 16.552453 0 0 1.4707,6.0918 3.1455755,5.4184189 16.552453 0 0 3.8418,-2.5703 4.9244938,7.7024131 0 0 0 4.623,5.0723 4.9244938,7.7024131 0 0 0 3.9727,-3.1641 5.0507627,7.7024131 0 0 0 4.4863,4.1739 5.0507627,7.7024131 0 0 0 4.0703,-3.1543 4.9244938,7.323606 0 0 0 2.875,1.3867 4.9244938,7.323606 0 0 0 4.1504,-3.3965 c 1.3543,2.1963 3.6813,3.6484 6.3301,3.6484 4.1842,0 7.5761,-3.113 7.5761,-7.5761 -1.4816,-2.5606 -3.3082,-4.8354 -5.0429,-6.5157 -6.9298,-10.6922 -1.3265,-14.3387 -2.6192,-23.7285 z
        `;

        return pathStr;
    }

    render() {
        let dFoot = this.buildFoot();
        //let width = this.props.noseProps.width * 0.1;
        //let height = this.props.noseProps.height * 0.1;
        
        return (
            <g id="foot-group" transform={`translate(-3 28) scale(0.25 0.25)`}>
                <path d={dFoot} style={{fill: this.props.bodyProps.skinColor}} />
            </g>
        );
    }
}