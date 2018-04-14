module.exports = io => {

    io.on('connection', function (socket) {
        console.log("ICI CONNECTED");
    });

    io.on('disconnect', function (socket) {
        console.log('user disconnected');
    });
}


