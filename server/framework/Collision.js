var Rectangle = require('./Rectangle');

const TYPE_SOLID = 0;
const TYPE_SECONDARY_EXIT = 1;

module.exports = class Collision {

    

    static handleCollision(player, world, collisionData) {
        var playerRect = new Rectangle(player.x - 50, player.y + 550, 200, 150);
        for (var i = 0; i < world.colliders.length; i++) {
            var collider = world.colliders[i];
            var rect = new Rectangle(
                Number(collider.attributes['x']), Number(collider.attributes['y']), 
                Number(collider.attributes['width']), Number(collider.attributes['height']));
            
            var depth = playerRect.getIntersectionDepth(rect);
            if (depth.x !== 0 && depth.y !== 0) {

                var collisionType = Number(collider.attributes['collision-type']);
                if (!collisionType || collisionType === TYPE_SOLID) {
                    // Blocking object
                    if (Math.abs(depth.x) < Math.abs(depth.y)) {
                        player.x += depth.x;
                    }
                    else {
                        player.y += depth.y;
                    }
                }
                else {
                    // Non-blocking -> execute type specific action
                    if (collisionType === TYPE_SECONDARY_EXIT) {
                        var nextWorld = collider.attributes['secondary-exit'];
                        collisionData.nextWorld = nextWorld;
                    }
                }
            }
        }
    }
}