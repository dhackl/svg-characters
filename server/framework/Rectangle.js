var Vector2 = require('./Vector2');

module.exports = class Rectangle {

    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    left() {
        return this.x;
    }
    right() {
        return this.x + this.width;
    }
    top() {
        return this.y;
    }
    bottom() {
        return this.y + this.height;
    }
    center() {
        return new Point(this.x + (this.width / 2), this.y + (this.height / 2));
    }

    intersects(r2) {
        return !(r2.left() > this.right() || 
            r2.right() < this.left() || 
            r2.top() > this.bottom() ||
            r2.bottom() < this.top());
    }

    getIntersectionDepth(rectB) {
        // Calculate half sizes.
        let halfWidthA = this.width / 2.0;
        let halfHeightA = this.height / 2.0;
        let halfWidthB = rectB.width / 2.0;
        let halfHeightB = rectB.height / 2.0;

        // Calculate centers.
        let centerA = new Vector2(this.left() + halfWidthA, this.top() + halfHeightA);
        let centerB = new Vector2(rectB.left() + halfWidthB, rectB.top() + halfHeightB);

        // Calculate current and minimum-non-intersecting distances between centers.
        let distanceX = centerA.x - centerB.x;
        let distanceY = centerA.y - centerB.y;
        let minDistanceX = halfWidthA + halfWidthB;
        let minDistanceY = halfHeightA + halfHeightB;

        // If we are not intersecting at all, return (0, 0).
        if (Math.abs(distanceX) >= minDistanceX || Math.abs(distanceY) >= minDistanceY)
            return Vector2.zero;

        // Calculate and return intersection depths.
        let depthX = distanceX > 0 ? minDistanceX - distanceX : -minDistanceX - distanceX;
        let depthY = distanceY > 0 ? minDistanceY - distanceY : -minDistanceY - distanceY;
        return new Vector2(depthX, depthY);
    }

    getBottomCenter() {
        return new Vector2(this.x + this.width / 2.0, this.bottom());
    }
}