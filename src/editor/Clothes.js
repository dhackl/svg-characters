import React, { Component } from 'react';
import SVG from 'svg.js';
import ColorUtils from './../util/ColorUtils';
import Point from '../util/Point';

import tshirtBasic from '../resources/clothes/tshirt-basic.svg';
import shirtWhite from '../resources/clothes/shirt-white.svg';
import tanktop01 from '../resources/clothes/tanktop01.svg';
import tanktop02 from '../resources/clothes/tanktop02.svg';
import suit01 from '../resources/clothes/suit01.svg';
import tshirtWomen from '../resources/clothes/tshirt-women.svg';

import jeansBasic from '../resources/clothes/jeans-basic.svg';
import shortsBasic from '../resources/clothes/shorts-basic.svg';
import shortsWomen from '../resources/clothes/shorts-women.svg';


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
        Clothes.clothesTop.set('tanktop01', tanktop01);
        Clothes.clothesTop.set('tanktop02', tanktop02);
        Clothes.clothesTop.set('suit01', suit01);
        Clothes.clothesTop.set('tshirt-women', tshirtWomen);

        Clothes.clothesLegs.set('naked', tshirtBasic);
        Clothes.clothesLegs.set('jeans', jeansBasic);
        Clothes.clothesLegs.set('shorts', shortsBasic);
        Clothes.clothesLegs.set('shorts-women', shortsWomen);
        
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