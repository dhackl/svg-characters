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

    static clothesTopMen = new Map();
    static clothesLegsMen = new Map();

    static clothesTopWomen = new Map();
    static clothesLegsWomen = new Map();


    static init() {
        // Men
        Clothes.clothesTopMen.set('naked', tshirtBasic);
        Clothes.clothesTopMen.set('tshirt', tshirtBasic);
        Clothes.clothesTopMen.set('shirt-white', shirtWhite);
        Clothes.clothesTopMen.set('tanktop01', tanktop01);
        Clothes.clothesTopMen.set('tanktop02', tanktop02);
        Clothes.clothesTopMen.set('suit01', suit01);

        Clothes.clothesLegsMen.set('naked', tshirtBasic);
        Clothes.clothesLegsMen.set('jeans', jeansBasic);
        Clothes.clothesLegsMen.set('shorts', shortsBasic);
        

        // Women
        Clothes.clothesTopWomen.set('naked', tshirtWomen);
        Clothes.clothesTopWomen.set('tshirt-women', tshirtWomen);

        Clothes.clothesLegsWomen.set('naked', jeansBasic);        
        Clothes.clothesLegsWomen.set('jeans', jeansBasic);
        Clothes.clothesLegsWomen.set('shorts-women', shortsWomen);
    }

    static getClothesTop(isFemale, styleId) {
        // Load external SVG for clothes data
        let clothesStyle = isFemale === true ? Clothes.clothesTopWomen.get(styleId) : Clothes.clothesTopMen.get(styleId);
        return fetch(clothesStyle).then(r => r.text());
    }

    static getClothesLegs(isFemale, styleId) {
        // Load external SVG for clothes data
        let clothesStyle = isFemale === true ? Clothes.clothesLegsWomen.get(styleId) : Clothes.clothesLegsMen.get(styleId);
        return fetch(clothesStyle).then(r => r.text());
    }
}