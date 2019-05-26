const ZERO = {x: 0, y: 0};

module.exports = class Vector2 {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static get zero() {
        return ZERO;
    }
}