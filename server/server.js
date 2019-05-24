// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

const PORT = 5080;

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

// Add the WebSocket handlers
io.on('connection', function(socket) {

});

// Handle Players
var players = {};
var playerData = {};
io.on('connection', function(socket) {

    // Add newly connected players
    socket.on('new-player', data => {
        players[socket.id] = {
            x: 300,
            y: 100
        };
        playerData[socket.id] = {
            characterProps: data.characterProps
        };

        io.sockets.emit('update-player-data', playerData);
    });

    // Update player movements
    socket.on('movement', data => {
        var player = players[socket.id] || {};
        var step = 8;
        player.x += data.x * step;
        player.y += data.y * step;
    });

    // Remove disconnected players
    socket.on('disconnect', function() {
        delete players[socket.id];
        delete playerData[socket.id];

        io.sockets.emit('update-player-data', playerData);
    });
});

// Update game state for all connected players
setInterval(function() {
    io.sockets.emit('state', players);
}, 1000 / 60);