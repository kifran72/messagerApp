module.exports = io => {

    io.on('connection', function (socket) {

    });

    io.on('disconnect', function (socket) {
        console.log('user disconnected');
    });
}


