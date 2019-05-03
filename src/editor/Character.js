import React, { Component } from 'react';
import SVG from 'svg.js';

import './CharacterEditor.css';
import Point from '../util/Point';
import Rectangle from '../util/Rectangle';
import ColorUtils from '../util/ColorUtils';
import Eyes from './Eyes';
import Ears from './Ears';
import Mouth from './Mouth';
import Eyebrows from './Eyebrows';
import Neck from './Neck';
import Nose from './Nose';
import Hair from './Hair';
import Torso from './Torso';
import Arm from './Arm';
import Leg from './Leg';
import Clothes from './Clothes';

export default class Character extends Component {

    constructor(props) {
        super(props);

        this.bodyAnimations = [];

        this.toggleSideView = this.toggleSideView.bind(this);
    }

    componentDidMount() {
        //this.buildHead();
        
        // Animate character
        this.createBodyAnimations();
        this.stopBodyAnimation();    
    }

    componentWillReceiveProps(nextProps) {
        /*this.setState({
            settings: nextProps.settings 
        });*/
    }

    toggleSideView() {
        this.setState({
            sideView: !this.props.settings.sideView
        }, () => {
            this.stopBodyAnimation();
            if (this.props.settings.sideView) {
                // Face
                SVG.get('left-eye').dmove(30, 0);
                SVG.get('left-brow').dmove(6, 0);
                SVG.get('right-eye').dmove(-30, 0).scale(0.8, 1);
                SVG.get('right-brow').dmove(-6, 0);

                SVG.get('right-ear').hide();

                SVG.get('nose-group').dmove(35, 0);
                SVG.get('mouth-group').dmove(35, 0);

                // Arms
                //SVG.get('left-arm').dmove(20, 0);
                SVG.get('right-arm').dmove(10, 0).scale(-1, 1).rotate(-20).back();

                this.props.settings.hair.hairStyle += '_side';
            }
            else {
                // Face
                SVG.get('left-eye').dmove(-30, 0);
                SVG.get('left-brow').dmove(-6, 0);
                SVG.get('right-eye').scale(1, 1).dmove(30, 0);
                SVG.get('right-brow').dmove(6, 0);

                SVG.get('right-ear').show();

                SVG.get('nose-group').dmove(-35, 0);
                SVG.get('mouth-group').dmove(-35, 0);

                // Arms
                //SVG.get('left-arm').dmove(20, 0);
                SVG.get('right-arm').rotate(20).scale(-1, 1).dmove(-10, 0).front();

                this.props.settings.hair.hairStyle = this.props.settings.hair.hairStyle.substring(0, this.props.settings.hair.hairStyle.length - 5);
            }
            this.startBodyAnimation();
        });
    }

    createBodyAnimations() {
        // Arms
        this.bodyAnimations.push(SVG.get('right-arm').animate(500).scale(1, 1.2, 0, 0));
        this.bodyAnimations.push(SVG.get('left-arm').animate(500).delay(500).scale(1, 1.2, 0, 0));

        // Legs
        this.bodyAnimations.push(SVG.select('.left-leg').animate(500).scale(1, 1.2, 0, 0));
        this.bodyAnimations.push(SVG.select('.right-leg').animate(500).delay(500).scale(1, 1.2, 0, 0));

        // Body Shaking
        this.bodyAnimations.push(SVG.get('character-head').animate(500).dmove(0, 5));
    }

    startBlinkAnimation() {

    }

    startBodyAnimation() {
        this.bodyAnimations.forEach(anim => {
            anim.play();
        });
    }

    stopBodyAnimation() {
        this.bodyAnimations.forEach(anim => {
            anim.stop(); 
        });
    }

    render() {
        
        return (
            <g id={this.props.id} transform={`translate(0 100) scale(${this.props.settings.zoom} ${this.props.settings.zoom})`} >

                <defs>
                    <linearGradient id="mouth-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0" stopColor="#e69c6b" />
                        <stop offset="1" stopColor="#bc5d38" />                                
                    </linearGradient>
                    <linearGradient id={`neck-gradient-${this.props.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0" stopColor={ColorUtils.blend(this.props.settings.body.skinColor, '#552200', 0.2)} />
                        <stop offset="1" stopColor={this.props.settings.body.skinColor} />                                
                    </linearGradient>
                    <linearGradient id="linear-01">
                        <stop offset="0" stopColor={this.props.settings.clothes.colorTop} />
                        <stop offset="0.5" stopColor={ColorUtils.shade(this.props.settings.clothes.colorTop, 0.5)} />
                        <stop offset="1" stopColor={this.props.settings.clothes.colorTop} />
                    </linearGradient>
                </defs>

                <g id="character-head">
                    <Neck neckProps={this.props.settings.neck} headBounds={this.props.settings.headBounds} id={this.props.id} />

                    <path id="head-main" d={this.props.settings.svg} style={{fill: this.props.settings.body.skinColor}} />

                    <Eyes eyeProps={this.props.settings.eye} bodyProps={this.props.settings.body} headBounds={this.props.settings.headBounds} />
                    <Eyebrows eyeProps={this.props.settings.eye} headBounds={this.props.settings.headBounds} />

                    <Mouth mouthProps={this.props.settings.mouth} headBounds={this.props.settings.headBounds} />
                    <Nose noseProps={this.props.settings.nose} bodyProps={this.props.settings.body} headBounds={this.props.settings.headBounds} />

                    <Ears earProps={this.props.settings.ear} bodyProps={this.props.settings.body} headBounds={this.props.settings.headBounds} />

                    <Hair hairProps={this.props.settings.hair} headBounds={this.props.settings.headBounds} />
                </g>

                <g className="left-leg" transform={`translate(-10 380) scale(1 1)`}>
                    <Leg elemId="left-leg-inner" bodyProps={this.props.settings.body}  />
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothUpperLeg}}></g>
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothLowerLeg}}></g>
                </g>
                <g className="right-leg" transform={`translate(100 380) scale(-1 1)`}>
                    <Leg elemId="right-leg-inner" bodyProps={this.props.settings.body}  />
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothUpperLeg}}></g>
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothLowerLeg}}></g>
                </g>
                

            
                <Torso bodyProps={this.props.settings.body} />
                <g transform="translate(-45 155)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothTorso}}></g>

                <g id="right-arm" transform={`translate(130 195) scale(-1 1)`}>
                    <Arm id="right-arm-inner" bodyProps={this.props.settings.body} />
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothUpperArm}}></g>
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothLowerArm}}></g>
                </g>

                <g id="left-arm" transform={`translate(-40 195) scale(1 1)`}>
                    <Arm id="left-arm-inner" bodyProps={this.props.settings.body} />
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothUpperArm}}></g>
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothLowerArm}}></g>
                </g>

            </g>
        );
    }
}
