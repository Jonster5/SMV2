let PORT = process.env.PORT || 80;

let express = require('express');

let app = express();

//app.use(express.static('public'));

let server = app.listen(PORT);

let io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.emit('news', {hello: 'world'});
});
