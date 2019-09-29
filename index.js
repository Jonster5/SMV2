let PORT = process.env.PORT || 80;

let express = require('express');

let app = express();

let server = app.listen(PORT);

app.use(express.static('public'));

let io = require('socket.io')(server);

io.on('connection', function(socket) {
    io.socket.emit('news', { hello: 'world' });
});