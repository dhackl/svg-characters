import React, { Component } from 'react';
import SVG from 'svg.js';
import ColorUtils from './../util/ColorUtils';
import Point from '../util/Point';

import tshirtBasic from '../resources/clothes/tshirt-basic.svg';
import shirtWhite from '../resources/clothes/shirt-white.svg';
export default class ClothesTop  {

    static STYLE_NAKED = 'naked';
    static COLOR_PRIMARY = '#ff8844'; // Main color to substitute
    static COLOR_PRIMARY_DARK = '#ce520b'; // Dark version of main color to substitute

    static clothes = new Map();


    static init() {
        ClothesTop.clothes.set("naked", tshirtBasic);
        ClothesTop.clothes.set("tshirt", tshirtBasic);
        ClothesTop.clothes.set("shirt-white", shirtWhite);
    }

    static getClothesPath(styleId) {
        // Load external SVG for clothes data
        let clothesStyle = ClothesTop.clothes.get(styleId);
        return fetch(clothesStyle).then(r => r.text());
    }
}