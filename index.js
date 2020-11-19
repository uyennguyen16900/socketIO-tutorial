var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const users = [];
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('setUsername', (data) => {
        console.log(data);

        if (users.indexOf(data) > -1) {
            socket.emit('userExists', data + ' username is taken! Try some other username.');
        } else {
            users.push(data);
            socket.emit('userSet', { username: data });
        }
    });
    
    socket.on('msg', (data) => {
        socket.emit('newmsg', data);
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data)
    })
});

http.listen(3000, () => {
    console.log('listening on *:3000')
});