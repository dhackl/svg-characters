import React, { Component } from 'react';
import ColorUtils from './../util/ColorUtils';
import Point from '../util/Point';

export default class Hair extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hairCreated: false,
            hairPath: ''
        };
    }

    componentDidMount() {
        this.buildSVG();
    }

    componentWillReceiveProps(nextProps) {
        //this.buildSVG();
    }

    buildSVG() {
        let top = this.props.headBounds.top();
        let left = this.props.headBounds.left();
        let right = this.props.headBounds.right();
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

        return (
            <g id="hair-group" transform={`translate(${this.props.headBounds.left()} ${this.props.headBounds.top() - 40})`}  >
                <path d={d} style={{fill: '#883300'}} />
            </g>
        );
    }
}