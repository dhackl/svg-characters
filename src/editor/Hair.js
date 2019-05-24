import React, { Component } from 'react';
import Point from '../util/Point';

import hairBald01 from '../resources/hair/bald01.svg';
import hairShort01 from '../resources/hair/short01.svg';
import hairShort01Side from '../resources/hair/short01_side.svg';
import hairShort02 from '../resources/hair/short02.svg';
import hairShort03 from '../resources/hair/short03.svg';
import hairShort04 from '../resources/hair/short04.svg';
import hairVeryShort01 from '../resources/hair/very-short01.svg';

import hairLong01 from '../resources/hair/long01.svg';
import hairLong02 from '../resources/hair/long02.svg';

export default class Hair extends Component {

    static STYLE_BALD = 'bald';
    static hairStyles = new Map();
    static hairMen = new Map();
    static hairWomen = new Map();

    constructor(props) {
        super(props);

        this.state = {
            hairPath: '',
            hairBackPath: ''
        };

    }

    static init() {
        Hair.hairMen.set("bald", hairShort01);
        Hair.hairMen.set("bald01", hairBald01);
        Hair.hairMen.set("short01", hairShort01);
        Hair.hairMen.set("short01_side", hairShort01Side);
        Hair.hairMen.set("short02", hairShort02);
        Hair.hairMen.set("short03", hairShort03);
        Hair.hairMen.set("short04", hairShort04);
        Hair.hairMen.set("veryShort01", hairVeryShort01);

        Hair.hairWomen.set("long01", hairLong01);
        Hair.hairWomen.set("long02", hairLong02);

        Hair.hairStyles = new Map([...Hair.hairMen, ...Hair.hairWomen]);
    }

    getHairPath() {
        // If bald -> return empty path
        if (this.props.hairProps.hairStyle === Hair.STYLE_BALD) {
            this.setState({
                hairPath: ''
            });
            return;
        }

        // Load external SVG for hair data
        let hairStyle = Hair.hairStyles.get(this.props.hairProps.hairStyle);
        fetch(hairStyle)
        .then(r => r.text())
        .then(text => {
            //let svg = SVG(text);
            var parser = new DOMParser();
            var doc = parser.parseFromString(text, "image/svg+xml");
            let path = doc.getElementById('hair-path').getAttribute('d');
            let backElem = doc.getElementById('hair-back');
            let pathBack = backElem ? backElem.getAttribute('d') : '';
            
            this.setState({
                hairPath: path,
                hairBackPath: pathBack
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        this.getHairPath();
    }

    buildRandomHair() {
        /*let top = this.props.headBounds.top();
        let left = this.props.headBounds.left();
        let right = this.props.headBounds.right();*/
        let width = this.props.headBounds.width;

        let points = [];
        let noHorizontalPoints = 20;
        let offset = width / noHorizontalPoints;
        /*let minTop = 10;
        let maxTop = 15;
        let minBottom = 50;
        let maxBottom = 70;*/
        let min = 5;
        let max = 15;
        
        for (let i = 1; i < noHorizontalPoints - 1; i++) {
            //let y = (i % 2 == 0) minBottom + Math.random() * (maxBottom - minBottom) : minTop + Math.random() * (maxTop - minTop);
            let y = min + Math.random() * (max - min);
            points.push(new Point(offset, i % 2 === 0 ? y : -y));
        }

        let pointsStr = ' ';
        points.forEach(p => pointsStr += p.x + ',' + p.y + ' ');

        let pathStr = `
        m 0,0 
          0,100
          ${pointsStr}
          0,-30 
        c ${-width / 2},${-width / 4} ${-width / 2},${-width / 4} ${-offset * (noHorizontalPoints - 2)},0 z
        `;

        this.setState({
            hairPath: pathStr
        });
    }

    render() {
        let d = this.state.hairPath;
        let dBack = this.state.hairBackPath;

        return (
            <g className="hair-group" transform={`translate(-40 -65) scale(4.6 4.6)`}  >
                <path d={d} style={{fill: this.props.hairProps.hairColor}} />
                <path transform={`translate(-40 -65) scale(4.6 4.6)`} className="hair-back" d={dBack} style={{fill: this.props.hairProps.hairColor}} />
            </g>
        );
    }
}