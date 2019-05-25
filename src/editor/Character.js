import React, { Component } from 'react';
import SVG from 'svg.js';

import './Character.css';
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
            sideView: false,
            backView: false,

            animOffsets: {
                leftLegPos: {x: 0, y: 0},
                rightLegPos: {x: 0, y: 0},
                leftArmPos: {x: 0, y: 0},
                rightArmPos: {x: 0, y: 0},
                legScale: 1
            },

            svg: '',
            headBounds: new Rectangle(),
            clothes: {
                clothUpperArm: '',
                clothLowerArm: '',
                clothTorso: '',
                clothUpperLeg: '',
                clothLowerLeg: ''
            },

            chatMessage: '',

            mainRef: React.createRef()
        };
    }

    componentDidMount() {
        
        // Females get thinner feet
        if (this.props.isFemale === true) {
            this.setState({
                animOffsets: {
                    leftLegPos: {x: 0, y: 380},
                    rightLegPos: {x: 90, y: 380},
                    leftArmPos: {x: 120, y: 185},
                    rightArmPos: {x: -30, y: 185},
                    legScale: 0.7
                }
            }, () => {
                // Animate character
                this.createBodyAnimations();
            });
        }
        else {
            this.setState({
                animOffsets: {
                    leftLegPos: {x: -10, y: 380},
                    rightLegPos: {x: 100, y: 380},
                    leftArmPos: {x: 130, y: 195},
                    rightArmPos: {x: -40, y: 195},
                    legScale: 1
                }
            }, () => {
                // Animate character
                this.createBodyAnimations();
            });
        }
    }

    componentWillMount() {
        this.rebuild(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.rebuild(nextProps);
    }

    componentDidUpdate() {
        if (this.state.backView) {
            SVG.select(`#${this.props.id} .hair-group`).before(SVG.select(`#${this.props.id} .hair-back`).first());
        }
        else {
            SVG.select(`#${this.props.id} .neck-group`).before(SVG.select(`#${this.props.id} .hair-back`).first());
        }
        //SVG.select(`#${this.props.id} .torso-outer`).before(SVG.select(`#${this.props.id} .lower-arm-group`).first());
    }


    rebuild(props) {
        // ===== Build Head
        var right = 60 + props.settings.head.width;
        var left = 40 - props.settings.head.width;
        var top = 60 - props.settings.head.height;
        var bottom = 60 + props.settings.head.height;

        var s = props.settings.head.roundnessTop;
        var t = props.settings.head.roundnessBottom;

        var pathStr = `
        M ${right} 50 
        C ${right} ${right - t} ${right - t} ${bottom} 50 ${bottom}
          ${left + t} ${bottom} ${left} ${right - t} ${left} 50 
          ${left} ${left + s} ${left + s} ${top} 50 ${top}
          ${right - s} ${top} ${right} ${left + s} ${right} 50 Z
        `;

        this.setState({
            svg: pathStr,
            headBounds: new Rectangle(left, top, right - left, bottom - top),
            mainRef: React.createRef()
        });

        // ===== Build clothes top
        var nakedTop = false;
        let clothes = this.state.clothes;

        // If naked -> return empty path
        if (props.settings.clothes.styleTop === Clothes.STYLE_NAKED) {    
            clothes.clothUpperArm = '';
            clothes.clothLowerArm = '';
            clothes.clothTorso = '';
            nakedTop = true;
        }

        // Otherwise -> load clothes
        Clothes.getClothesTop(props.settings.isFemale, props.settings.clothes.styleTop).then(text => {
            if (nakedTop === false) {
                var parser = new DOMParser();

                // Substitute colors
                text = text.replace(new RegExp(Clothes.COLOR_PRIMARY, 'g'), props.settings.clothes.colorTop);
                text = text.replace(new RegExp(Clothes.COLOR_PRIMARY_DARK, 'g'), ColorUtils.blend(props.settings.clothes.colorTop, '#000000', 0.3));

                var doc = parser.parseFromString(text, "image/svg+xml");
                let upperArm = doc.getElementById('upper-arm');
                let lowerArm = doc.getElementById('lower-arm');
                let torso = doc.getElementById('torso');

                //if (torso != null)
                //    torso.removeAttribute('id');
                
                clothes.clothUpperArm = upperArm != null ? upperArm.outerHTML : '';
                clothes.clothLowerArm = lowerArm != null ? lowerArm.outerHTML : '';
                clothes.clothTorso = torso != null ? torso.outerHTML : '';
            }
            
            this.setState({
                clothes: clothes
            });
        });

        // ===== Build clothes legs
        var nakedLegs = false;
        // If naked -> return empty path
        if (props.settings.clothes.styleLegs === Clothes.STYLE_NAKED) {
            clothes.clothUpperLeg = '';
            clothes.clothLowerLeg = '';
            nakedLegs = true;
        }

        // Otherwise -> load clothes
        Clothes.getClothesLegs(props.settings.isFemale, props.settings.clothes.styleLegs).then(text => {
            if (nakedLegs === false) {
                var parser = new DOMParser();

                // Substitute colors
                text = text.replace(new RegExp(Clothes.COLOR_PRIMARY, 'g'), props.settings.clothes.colorLegs);
                text = text.replace(new RegExp(Clothes.COLOR_PRIMARY_DARK, 'g'), ColorUtils.blend(props.settings.clothes.colorLegs, '#000000', 0.3));

                var doc = parser.parseFromString(text, "image/svg+xml");
                let upperLeg = doc.getElementById('upper-leg');
                let lowerLeg = doc.getElementById('lower-leg');
                
                clothes.clothUpperLeg = upperLeg != null ? upperLeg.outerHTML : '';
                clothes.clothLowerLeg = lowerLeg != null ? lowerLeg.outerHTML : '';
            }
            
            this.setState({
                clothes: clothes
            });
        });
    }

    updateSideView() {
        var prefix = `#${this.props.id} `;
        //this.stopBodyAnimation();
        if (this.state.sideView) {
            // Face
            SVG.select(prefix + '.left-eye').dmove(30, 0);
            SVG.select(prefix + '.left-brow').dmove(6, 0);
            SVG.select(prefix + '.right-eye').dmove(-30, 0).scale(0.8, 1);
            SVG.select(prefix + '.right-brow').dmove(-6, 0);

            SVG.select(prefix + '.right-ear').hide();

            SVG.select(prefix + '.nose-group').dmove(35, 0);
            SVG.select(prefix + '.mouth-group').dmove(35, 0);

            // Arms
            //SVG.get('left-arm').dmove(20, 0);
            SVG.select(prefix + '.right-arm').dmove(10, 0).scale(-1, 1).rotate(-20).back();

            //this.props.settings.hair.hairStyle += '_side';
        }
        else {
            // Face
            SVG.select(prefix + '.left-eye').dmove(-30, 0);
            SVG.select(prefix + '.left-brow').dmove(-6, 0);
            SVG.select(prefix + '.right-eye').scale(1, 1).dmove(30, 0);
            SVG.select(prefix + '.right-brow').dmove(6, 0);

            SVG.select(prefix + '.right-ear').show();

            SVG.select(prefix + '.nose-group').dmove(-35, 0);
            SVG.select(prefix + '.mouth-group').dmove(-35, 0);

            // Arms
            //SVG.get('left-arm').dmove(20, 0);
            SVG.select(prefix + '.right-arm').rotate(20).scale(-1, 1).dmove(-10, 0).front();

            //this.props.settings.hair.hairStyle = this.props.settings.hair.hairStyle.substring(0, this.props.settings.hair.hairStyle.length - 5);
        }
        //this.startBodyAnimation();


        //this.setState({});
    }

    updateBackView() {
        var prefix = `#${this.props.id} `;

        if (this.state.backView) {
            // Face
            SVG.select(prefix + '.character-face').hide();
            
            // Neck
            SVG.select(prefix + '.neck-group > path').attr({style: `fill: ${this.props.settings.body.skinColor}`});

            // Hair
            SVG.select(`#${this.props.id} .hair-group`).before(SVG.select(`#${this.props.id} .hair-back`).first());
            
        }
        else {
            // Face
            SVG.select(prefix + '.character-face').show();
            
            // Neck
            SVG.select(prefix + '.neck-group > path').attr({style: `fill: url(#neck-gradient-${this.props.id})`});
            
            // Hair
            SVG.select(`#${this.props.id} .neck-group`).before(SVG.select(`#${this.props.id} .hair-back`).first());
            
        }
    }

    createBodyAnimations() {
        if (!this.state.isWalking) {
            var anims = this.state.bodyAnimations;

            // Arms
            anims.push(SVG.select('.right-arm').animate(500).scale(1, 1.2, 0, 0).loop(true, true));
            anims.push(SVG.select('.left-arm').animate(500).delay(500).scale(1, 1.2, 0, 0).loop(true, true));

            // Legs
            anims.push(SVG.select('.left-leg').animate(500).scale(this.state.animOffsets.legScale, 1.2, 0, 0).loop(true, true));
            anims.push(SVG.select('.right-leg').animate(500).delay(500).scale(this.state.animOffsets.legScale, 1.2, 0, 0).loop(true, true));

            // Body Shaking
            //anims.push(SVG.select('.character-head').animate(500).dmove(0, 5).loop(true, true));
            anims.push(SVG.select('.torso-outer').animate(500).scale(1, 1.03, 0, 0).loop(true, true));

            this.setState({
                isWalking: true,
                bodyAnimations: anims
            });
        }
    }

    /*move(direction) {
        var step = 300;
        var duration = 1000;

        if (direction.x !== 0) {
            this.playerAnimation = SVG.get(this.props.id).animate(duration).dx(step * direction.x);
        }
        else if (direction.y !== 0) {
            this.playerAnimation = SVG.get(this.props.id).animate(duration).dy(step * direction.y);
        }
        
        if (direction !== this.state.direction) {
            var prevDirection = this.state.direction;
            if (prevDirection.x === 0) prevDirection.x = 1;
            this.setState({
                direction: direction
            }, () => {
                this.changeDirection(prevDirection);
            });
        }
        
        //this.createBodyAnimations();
    }*/
    move(direction) {
        var step = 8;
        var duration = 1000;

        //SVG.get(this.props.id).dmove(step * direction.x, step * direction.y);
        
        if (direction !== this.state.direction) {
            var prevDirection = this.state.direction;
            if (prevDirection.x === 0) prevDirection.x = 1;
            this.setState({
                direction: direction
            }, () => {
                this.changeDirection(prevDirection);
            });
        }
        
        //this.createBodyAnimations();
    }


    stopMoving() {
        /*if (this.playerAnimation)
            this.playerAnimation.stop(false, true);*/
        //this.stopBodyAnimation();
    }

    moveTo(x, y) {
        //SVG.get(this.props.id).move(x, y);
        SVG.adopt(this.state.mainRef.current).move(x, y);
    }

    moveBy(x, y) {
        SVG.get(this.props.id).dmove(x, y);
    }

    changeDirection(prevDirection) {
        var dir = this.state.direction;
        var sideView = dir.x !== 0;
        var backView = dir.y === -1;
        if (this.state.sideView !== sideView) {
            this.setState({
                sideView: sideView
            }, () => this.updateSideView());
        }
        if (this.state.backView !== backView) {
            this.setState({
                backView: backView
            }, () => this.updateBackView());
        }

        

        var characterInner = SVG.select(`#${this.props.id} .character-inner`).first();
        if (dir.x !== 0 && dir.x !== prevDirection.x) {
            characterInner.scale(-1, 1);
        }
        else if (dir.x === 0 && prevDirection.x === -1) {
            characterInner.scale(-1, 1);            
        }
        
    }

    setChatMessage(msg) {
        this.setState({
            chatMessage: msg
        });
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
            <g id={this.props.id} ref={this.state.mainRef} transform={`translate(0 100) scale(${this.props.settings.zoom} ${this.props.settings.zoom})`} >
                <g className="character-inner">
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
                        <Neck neckProps={this.props.settings.neck} headBounds={this.state.headBounds} id={this.props.id} />

                        <path className="head-main" d={this.state.svg} style={{fill: this.props.settings.body.skinColor}} />

                        <g className="character-face">
                            {this.props.isFemale === true && <Cheeks headBounds={this.state.headBounds} />}

                            <Eyes eyeProps={this.props.settings.eye} bodyProps={this.props.settings.body} headBounds={this.state.headBounds} isFemale={this.props.isFemale} />
                            <Eyebrows eyeProps={this.props.settings.eye} hairProps={this.props.settings.hair} headBounds={this.state.headBounds} />

                            <Mouth mouthProps={this.props.settings.mouth} headBounds={this.state.headBounds} isFemale={this.props.isFemale} />
                            <Nose noseProps={this.props.settings.nose} bodyProps={this.props.settings.body} headBounds={this.state.headBounds} />
                        </g>

                        <Ears earProps={this.props.settings.ear} bodyProps={this.props.settings.body} headBounds={this.state.headBounds} />

                        <Hair hairProps={this.props.settings.hair} headBounds={this.state.headBounds} />
                    </g>

                    <g className="left-leg" transform={`translate(${this.state.animOffsets.leftLegPos.x} ${this.state.animOffsets.leftLegPos.y}) scale(${this.state.animOffsets.legScale} 1)`}>
                        <Leg elemId="left-leg-inner" bodyProps={this.props.settings.body}  />
                        <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothUpperLeg}}></g>
                        <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothLowerLeg}}></g>
                    </g>
                    <g className="right-leg" transform={`translate(${this.state.animOffsets.rightLegPos.x} ${this.state.animOffsets.rightLegPos.y}) scale(-${this.state.animOffsets.legScale} 1)`}>
                        <Leg elemId="right-leg-inner" bodyProps={this.props.settings.body}  />
                        <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothUpperLeg}}></g>
                        <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothLowerLeg}}></g>
                    </g>
                    

                    <g className="right-arm" transform={`translate(${this.state.animOffsets.leftArmPos.x} ${this.state.animOffsets.leftArmPos.y}) scale(-1 1)`}>
                        <Arm id="right-arm-inner" bodyProps={this.props.settings.body} isFemale={this.props.isFemale} />
                        <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothUpperArm}}></g>
                        <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothLowerArm}}></g>
                    </g>

                    <g className="left-arm" transform={`translate(${this.state.animOffsets.rightArmPos.x} ${this.state.animOffsets.rightArmPos.y}) scale(1 1)`}>
                        <Arm id="left-arm-inner" bodyProps={this.props.settings.body} isFemale={this.props.isFemale} />
                        <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothUpperArm}}></g>
                        <g transform="translate(0 -40)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothLowerArm}}></g>
                    </g>

                    <g className="torso-outer">
                        <Torso bodyProps={this.props.settings.body} isFemale={this.props.isFemale} />
                        <g transform="translate(-45 155)" dangerouslySetInnerHTML={{__html: this.state.clothes.clothTorso}}></g>
                    </g>

                    <rect x="-40" y="550" width="170" height="150" style={{fill:'#ff0000', opacity:0.1}} />
                </g>
                <text className="player-chat-message" x="0" y="-50">{this.state.chatMessage}</text>
            </g>
        );
    }
}
