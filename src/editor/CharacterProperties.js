import Hair from "./Hair";
import Clothes from "./Clothes";

export default class CharacterProperties {

    static propsMale = [{
        cat: 'body',
        name: 'direction',
        min: 0,
        max: 3,
        val: 0
    }, {
        cat: 'body',
        name: 'skinColor',
        type: 'color',
        val: '#f3bf85',
    }, {
        cat: 'body',
        name: 'fat',
        min: 0,
        max: 30,
        val: 5,
    }, {
        cat: 'head',
        name: 'width',
        min: 50,
        max: 70,
        val: 60,
    }, {
        cat: 'head',
        name: 'height',
        min: 80,
        max: 100,
        val: 90,
    }, {
        cat: 'head',
        name: 'roundnessTop',
        min: 1,
        max: 40,
        val: 20,
    }, {
        cat: 'head',
        name: 'roundnessBottom',
        min: 5,
        max: 40,
        val: 20,
    }, {
        cat: 'hair',
        name: 'hairStyle',
        type: 'string',
        val: 'short01',
        items: Hair.hairMen
    }, {
        cat: 'hair',
        name: 'hairColor',
        type: 'color',
        val: '#aa5511'
    }, {
        cat: 'eye',
        name: 'distance',
        min: 15,
        max: 35,
        val: 25
    }, {
        cat: 'eye',
        name: 'width',
        min: 10,
        max: 20,
        val: 15
    }, {
        cat: 'eye',
        name: 'height',
        min: 5,
        max: 12,
        val: 8
    }, {
        cat: 'eye',
        name: 'eyeLid',
        min: 0,
        max: 100,
        val: 20
    }, {
        cat: 'mouth',
        name: 'width',
        min: 10,
        max: 25,
        val: 18
    }, {
        cat: 'mouth',
        name: 'height',
        min: 1,
        max: 20,
        val: 8
    }, {
        cat: 'neck',
        name: 'width',
        min: 15,
        max: 18,
        val: 15
    }, {
        cat: 'neck',
        name: 'height',
        min: 30,
        max: 40,
        val: 30
    }, {
        cat: 'nose',
        name: 'width',
        min: 15,
        max: 50,
        val: 30
    }, {
        cat: 'nose',
        name: 'height',
        min: 15,
        max: 50,
        val: 35
    }, {
        cat: 'clothes',
        name: 'styleTop',
        type: 'string',
        val: 'tshirt',
        items: Clothes.clothesTopMen
    }, {
        cat: 'clothes',
        name: 'colorTop',
        type: 'color',
        val: '#ab2710'
    }, {
        cat: 'clothes',
        name: 'styleLegs',
        type: 'string',
        val: 'jeans',
        items: Clothes.clothesLegsMen
    }, {
        cat: 'clothes',
        name: 'colorLegs',
        type: 'color',
        val: '#20243c'
    }];

    /////////////////////////////////////
    /////////////////////////////////////

    static propsFemale = [{
        cat: 'body',
        name: 'direction',
        min: 0,
        max: 3,
        val: 0
    }, {
        cat: 'body',
        name: 'skinColor',
        type: 'color',
        val: '#f3bf85',
    }, {
        cat: 'body',
        name: 'fat',
        min: 0,
        max: 30,
        val: 5,
    }, {
        cat: 'head',
        name: 'width',
        min: 60,
        max: 70,
        val: 65,
    }, {
        cat: 'head',
        name: 'height',
        min: 70,
        max: 90,
        val: 80,
    }, {
        cat: 'head',
        name: 'roundnessTop',
        min: 1,
        max: 40,
        val: 20,
    }, {
        cat: 'head',
        name: 'roundnessBottom',
        min: 30,
        max: 40,
        val: 30,
    }, {
        cat: 'hair',
        name: 'hairStyle',
        type: 'string',
        val: 'short01',
        items: Hair.hairWomen
    }, {
        cat: 'hair',
        name: 'hairColor',
        type: 'color',
        val: '#aa5511'
    }, {
        cat: 'eye',
        name: 'distance',
        min: 15,
        max: 35,
        val: 25
    }, {
        cat: 'eye',
        name: 'width',
        min: 10,
        max: 20,
        val: 15
    }, {
        cat: 'eye',
        name: 'height',
        min: 5,
        max: 12,
        val: 8
    }, {
        cat: 'eye',
        name: 'eyeLid',
        min: 0,
        max: 100,
        val: 20
    }, {
        cat: 'mouth',
        name: 'width',
        min: 10,
        max: 25,
        val: 18
    }, {
        cat: 'mouth',
        name: 'height',
        min: 1,
        max: 20,
        val: 8
    }, {
        cat: 'neck',
        name: 'width',
        min: 15,
        max: 18,
        val: 15
    }, {
        cat: 'neck',
        name: 'height',
        min: 30,
        max: 40,
        val: 30
    }, {
        cat: 'nose',
        name: 'width',
        min: 15,
        max: 50,
        val: 30
    }, {
        cat: 'nose',
        name: 'height',
        min: 15,
        max: 50,
        val: 35
    }, {
        cat: 'clothes',
        name: 'styleTop',
        type: 'string',
        val: 'tshirt',
        items: Clothes.clothesTopWomen
    }, {
        cat: 'clothes',
        name: 'colorTop',
        type: 'color',
        val: '#ab2710'
    }, {
        cat: 'clothes',
        name: 'styleLegs',
        type: 'string',
        val: 'jeans',
        items: Clothes.clothesLegsWomen
    }, {
        cat: 'clothes',
        name: 'colorLegs',
        type: 'color',
        val: '#20243c'
    }];

}