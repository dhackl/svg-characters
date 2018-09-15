import React, { Component } from 'react';
import SVG from 'svg.js';
import ColorUtils from './../util/ColorUtils';
import Point from '../util/Point';

import tshirtBasic from '../resources/clothes/tshirt-basic.svg';
import shirtWhite from '../resources/clothes/shirt-white.svg';

import jeansBasic from '../resources/clothes/jeans-basic.svg';

export default class Clothes  {

    static STYLE_NAKED = 'naked';
    static COLOR_PRIMARY = '#ff8844'; // Main color to substitute
    static COLOR_PRIMARY_DARK = '#ce520b'; // Dark version of main color to substitute

    static clothesTop = new Map();
    static clothesLegs = new Map();


    static init() {
        Clothes.clothesTop.set('naked', tshirtBasic);
        Clothes.clothesTop.set('tshirt', tshirtBasic);
        Clothes.clothesTop.set('shirt-white', shirtWhite);

        Clothes.clothesLegs.set('naked', tshirtBasic);
        Clothes.clothesLegs.set('jeans', jeansBasic);
    }

    static getClothesTop(styleId) {
        // Load external SVG for clothes data
        let clothesStyle = Clothes.clothesTop.get(styleId);
        return fetch(clothesStyle).then(r => r.text());
    }

    static getClothesLegs(styleId) {
        // Load external SVG for clothes data
        let clothesStyle = Clothes.clothesLegs.get(styleId);
        return fetch(clothesStyle).then(r => r.text());
    }
}