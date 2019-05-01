import React, { Component } from 'react';
import SVG from 'svg.js';
import Character from '../editor/Character';

import worldData from '../resources/world/map01.svg';

export default class World extends Component {

    constructor(props) {
        super(props);

        this.state = {
            world: ''
        };
    }

    componentWillReceiveProps() {
        fetch(worldData)
        .then(r => r.text())
        .then(text => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(text, "image/svg+xml");
            var root = doc.getElementById('map-root');

            this.setState({
                world: root.outerHTML
            });
        });
    }

    render() {
        return (
            <g id="world">
                <g dangerouslySetInnerHTML={{__html: this.state.world}} transform={'scale(5 5)'}></g>
                <Character settings={this.props.characterSettings} />
            </g>
        );
    }
}