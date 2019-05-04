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
import Cheeks from './Cheeks';
import Clothes from './Clothes';

export default class Character extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bodyAnimations: [],
            isWalking: false,
            direction: {x: 0, y: 0},
            sideView: false
        };

        this.mainRef = React.createRef();

        this.leftLegPos = {x: -10, y: 380};
        this.rightLegPos = {x: 100, y: 380};
        this.leftArmPos = {x: 130, y: 195};
        this.rightArmPos = {x: -40, y: 195};
        this.legScale = 1;

        if (this.props.isFemale) {
            this.leftLegPos = {x: 0, y: 380};
            this.rightLegPos = {x: 90, y: 380};
            this.leftArmPos = {x: 120, y: 185};
            this.rightArmPos = {x: -30, y: 185};
            this.legScale = 0.7;
        }
    }

    componentDidMount() {
        //this.buildHead();
        
        // Animate character
        this.createBodyAnimations();

        this.character = this.mainRef.current;
        
    }

    componentWillReceiveProps(nextProps) {
        /*this.setState({
            settings: nextProps.settings 
        });*/
    }

    componentDidUpdate() {
        SVG.select(`#${this.props.id} .neck-group`).before(SVG.select(`#${this.props.id} .hair-back`).first());
        //SVG.select(`#${this.props.id} .torso-outer`).before(SVG.select(`#${this.props.id} .lower-arm-group`).first());
    }

    updateSideView() {
        //this.stopBodyAnimation();
        if (this.state.sideView) {
            // Face
            SVG.select('.left-eye').dmove(30, 0);
            SVG.select('.left-brow').dmove(6, 0);
            SVG.select('.right-eye').dmove(-30, 0).scale(0.8, 1);
            SVG.select('.right-brow').dmove(-6, 0);

            SVG.select('.right-ear').hide();

            SVG.select('.nose-group').dmove(35, 0);
            SVG.select('.mouth-group').dmove(35, 0);

            // Arms
            //SVG.get('left-arm').dmove(20, 0);
            SVG.select('.right-arm').dmove(10, 0).scale(-1, 1).rotate(-20).back();

            this.props.settings.hair.hairStyle += '_side';
        }
        else {
            // Face
            SVG.select('.left-eye').dmove(-30, 0);
            SVG.select('.left-brow').dmove(-6, 0);
            SVG.select('.right-eye').scale(1, 1).dmove(30, 0);
            SVG.select('.right-brow').dmove(6, 0);

            SVG.select('.right-ear').show();

            SVG.select('.nose-group').dmove(-35, 0);
            SVG.select('.mouth-group').dmove(-35, 0);

            // Arms
            //SVG.get('left-arm').dmove(20, 0);
            SVG.select('.right-arm').rotate(20).scale(-1, 1).dmove(-10, 0).front();

            this.props.settings.hair.hairStyle = this.props.settings.hair.hairStyle.substring(0, this.props.settings.hair.hairStyle.length - 5);
        }
        //this.startBodyAnimation();
    }

    createBodyAnimations() {
        if (!this.state.isWalking) {
            var anims = this.state.bodyAnimations;

            // Arms
            anims.push(SVG.select('.right-arm').animate(500).scale(1, 1.2, 0, 0).loop(true, true));
            anims.push(SVG.select('.left-arm').animate(500).delay(500).scale(1, 1.2, 0, 0).loop(true, true));

            // Legs
            anims.push(SVG.select('.left-leg').animate(500).scale(this.legScale, 1.2, 0, 0).loop(true, true));
            anims.push(SVG.select('.right-leg').animate(500).delay(500).scale(this.legScale, 1.2, 0, 0).loop(true, true));

            // Body Shaking
            anims.push(SVG.select('.character-head').animate(500).dmove(0, 5).loop(true, true));
            anims.push(SVG.select('.torso-outer').animate(500).scale(1, 1.03, 0, 0).loop(true, true));

            this.setState({
                isWalking: true,
                bodyAnimations: anims
            });
        }
    }

    move(direction) {
        var step = 300;
        var duration = 1000;

        if (direction.x !== 0) {
            this.playerAnimation = SVG.get(this.props.id).animate(duration).dx(step * direction.x);
        }
        else if (direction.y !== 0) {
            this.playerAnimation = SVG.get(this.props.id).animate(duration).dy(step * direction.y);
        }
        
        /*if (direction !== this.state.direction) {
            var prevDirection = this.state.direction;
            this.setState({
                direction: direction
            }, () => {
                this.changeDirection(prevDirection);
            });
        }*/
        
        //this.createBodyAnimations();
    }

    stopMoving() {
        if (this.playerAnimation)
            this.playerAnimation.stop(false, true);
        //this.stopBodyAnimation();
    }

    moveBy(x, y) {
        SVG.get(this.props.id).dmove(x, y);
    }

    changeDirection(prevDirection) {
        var dir = this.state.direction;
        var sideView = dir.x !== 0;
        if (this.state.sideView !== sideView) {
            this.setState({
                sideView: sideView
            }, () => this.updateSideView());
        }

        if (dir.x !== 0 && dir.x !== prevDirection.x) {
            var character = SVG.get(this.props.id);
            character.flip('x', 0);
        }
    }

    startBlinkAnimation() {

    }

    startBodyAnimation() {
        /*this.state.bodyAnimations.forEach(anim => {
            anim.loop(true, true).play();
        });*/
    }

    stopBodyAnimation() {
        var anims = this.state.bodyAnimations;
        for (var i = 0; i < anims.length; i++) {
            anims[i].stop(true, true);
        }
        this.setState({
            isWalking: false,
            bodyAnimations: []
        });
    }

    getBounds() {
        var element = SVG.get(this.props.id);
        return new Rectangle(element.x() - 50, element.y() + 550, 200, 150);
    }

    render() {
        
        return (
            <g id={this.props.id} ref={this.mainRef} transform={`translate(0 100) scale(${this.props.settings.zoom} ${this.props.settings.zoom})`} >

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
                    <filter id="filter-blur" x="0" y="0">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                    </filter>
                </defs>

                <g className="character-head">
                    <Neck neckProps={this.props.settings.neck} headBounds={this.props.settings.headBounds} id={this.props.id} />

                    <path className="head-main" d={this.props.settings.svg} style={{fill: this.props.settings.body.skinColor}} />

                    {this.props.isFemale && <Cheeks headBounds={this.props.settings.headBounds} />}

                    <Eyes eyeProps={this.props.settings.eye} bodyProps={this.props.settings.body} headBounds={this.props.settings.headBounds} isFemale={this.props.isFemale} />
                    <Eyebrows eyeProps={this.props.settings.eye} hairProps={this.props.settings.hair} headBounds={this.props.settings.headBounds} />

                    

                    <Mouth mouthProps={this.props.settings.mouth} headBounds={this.props.settings.headBounds} isFemale={this.props.isFemale} />
                    <Nose noseProps={this.props.settings.nose} bodyProps={this.props.settings.body} headBounds={this.props.settings.headBounds} />

                    <Ears earProps={this.props.settings.ear} bodyProps={this.props.settings.body} headBounds={this.props.settings.headBounds} />

                    <Hair hairProps={this.props.settings.hair} headBounds={this.props.settings.headBounds} />
                </g>

                <g className="left-leg" transform={`translate(${this.leftLegPos.x} ${this.leftLegPos.y}) scale(${this.legScale} 1)`}>
                    <Leg elemId="left-leg-inner" bodyProps={this.props.settings.body}  />
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothUpperLeg}}></g>
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothLowerLeg}}></g>
                </g>
                <g className="right-leg" transform={`translate(${this.rightLegPos.x} ${this.rightLegPos.y}) scale(-${this.legScale} 1)`}>
                    <Leg elemId="right-leg-inner" bodyProps={this.props.settings.body}  />
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothUpperLeg}}></g>
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothLowerLeg}}></g>
                </g>
                

                <g className="right-arm" transform={`translate(${this.leftArmPos.x} ${this.leftArmPos.y}) scale(-1 1)`}>
                    <Arm id="right-arm-inner" bodyProps={this.props.settings.body} isFemale={this.props.isFemale} />
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothUpperArm}}></g>
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothLowerArm}}></g>
                </g>

                <g className="left-arm" transform={`translate(${this.rightArmPos.x} ${this.rightArmPos.y}) scale(1 1)`}>
                    <Arm id="left-arm-inner" bodyProps={this.props.settings.body} isFemale={this.props.isFemale} />
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothUpperArm}}></g>
                    <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothLowerArm}}></g>
                </g>

                <g className="torso-outer">
                    <Torso bodyProps={this.props.settings.body} isFemale={this.props.isFemale} />
                    <g transform="translate(-45 155)" dangerouslySetInnerHTML={{__html: this.props.settings.clothes.clothTorso}}></g>
                </g>

                <rect x="-40" y="550" width="170" height="150" style={{fill:'#ff0000', opacity:0.1}} />
            </g>
        );
    }
}
