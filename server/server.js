// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var fs = require('fs');
var svgson = require('svgson');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

var Collision = require('./framework/Collision');

const PORT = 5080;
const SYNC_INTERVAL = 30; // FPS

app.set('port', PORT);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(PORT, function() {
    console.log('Starting server on port ' + PORT);
});

// Handle Players
var players = {};
var playerData = {};
io.on('connection', function(socket) {

    // Add newly connected players
    socket.on('new-player', data => {
        var initWorld = 'map01';

        players[socket.id] = {
            x: worlds.get(initWorld).spawnPoint.x,
            y: worlds.get(initWorld).spawnPoint.y,
            direction: {x: 0, y: 1}
        };
        playerData[socket.id] = {
            characterProps: data.characterProps,
            currentWorld: initWorld 
        };

        io.sockets.emit('update-player-data', playerData);
    });

    // Update player movements
    socket.on('movement', data => {
        var player = players[socket.id] || { x: 0, y: 0, direction: {} };
        var pData = playerData[socket.id];
        var step = 8;
        player.x += data.x * step;
        player.y += data.y * step;
        player.direction.x = data.x;
        player.direction.y = data.y;

        // Handle collisions server-side
        var collisionData = { nextWorld: null };
        Collision.handleCollision(player, worlds.get(pData.currentWorld), collisionData);

        // Changed world
        if (collisionData.nextWorld) {
            // Move player to new spawn point
            player.x = worlds.get(collisionData.nextWorld).spawnPoint.x;
            player.y = worlds.get(collisionData.nextWorld).spawnPoint.y;

            pData.currentWorld = collisionData.nextWorld;

            socket.emit('world-change', {
                worldId: collisionData.nextWorld
            });
            io.sockets.emit('update-player-data', playerData);
        }
    });

    // Remove disconnected players
    socket.on('disconnect', function() {
        delete players[socket.id];
        delete playerData[socket.id];

        io.sockets.emit('update-player-data', playerData);
    });

    // Chat
    socket.on('chat-in', data => {
        io.sockets.emit('chat-out', {
            sender: socket.id,
            message: data.message
        });
    });
});

// Update game state for all connected players
setInterval(function() {
    io.sockets.emit('state', players);
}, 1000 / SYNC_INTERVAL);


// Load worlds
var worlds = new Map();
var worldIds = ['map01', 'cave01'];
worldIds.forEach(worldId => {
    fs.readFile(`resources/world/${worldId}.svg`, (err, data) => {
        svgson.parse(data.toString()).then(json => {

            var world = {
                colliders: [],
                spawnPoint: {x: 0, y: 0}
            };

            // Colliders
            var collisions = json.children.find(child => child.attributes['id'] && child.attributes['id'] === 'map-collision');
            for (var i = 0; i < collisions.children.length; i++) {
                world.colliders.push(collisions.children[i]);
            }
    
            // Spawn Point
            var spawn = json.children.find(child => child.attributes['id'] && child.attributes['id'] === 'spawn');
            world.spawnPoint.x = Number(spawn.attributes['x']);
            world.spawnPoint.y = Number(spawn.attributes['y']);
    
            worlds.set(worldId, world);
        });
    });
});
