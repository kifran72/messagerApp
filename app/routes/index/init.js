/**
 * @param  {Object} app
 */
function initIndex(app, session, con, io, server, connectedUsers) {

    app.get('/', function (req, res) {
        if (!req.session.connected) return res.render('users/login', {
            message: 'Bienvenue'
        });
        return res.render('index', {
            message: 'Bienvenue',
            account_type: req.session.account_type
        });
    });


    app.get('/login', function (req, res) {
        if (req.session.connected) return res.redirect('/');
        return res.render('users/login', {
            message: 'Bienvenue'
        });

    });


    app.post('/login', function (req, res) {
        let username = req.body.username;
        let password = req.body.password;

        let search = 'SELECT * FROM users WHERE username = ? AND password = ?';
        con.query(search, [username, password], function (err, result, fields) {
            if (err) throw err;
            if (result.length != 0) {
                req.session.connected = true;
                req.session.username = username;
                req.session.account_type = result[0].role;

                return res.send({
                    username: username,
                    success: true,
                })
            }
            return res.send({
                success: false
            })
        })
    });

    // déconnexion
    app.get('/logout', function (req, res) {
        if (!req.session.connected) return res.render('users/login', {
            message: 'Bienvenue'
        });
        req.session.destroy(function (err) {
            if (err) throw err;
            return res.render('users/login', {
                message: 'Bienvenue'
            });

        })
    });


    app.get('/signup', function (req, res) {
        res.render('users/signup', {
            message: 'Bienvenue'
        });
    });

    app.post('/signup', function (req, res) {
        let mail = req.body.mail;
        let username = req.body.username;
        let password = req.body.password;
        let passwordTest = req.body.passwordTest;
        let account_type = 0;
        let img_url = 0;

        console.log(mail);

        if (password == passwordTest) {
            let search = 'SELECT username FROM users WHERE username = ?';
            con.query(search, [username], function (err, result, fields) {
                if (err) throw err;
                if (result.length == 0) {
                    let sql = 'INSERT INTO users(username, mail_users, password, account_type, img_url) VALUES(?,?,?,?,?)';
                    con.query(sql, [username, mail, password, account_type, img_url], function (err, result) {
                        if (err) throw err;
                        console.log(result);

                        return res.send({
                            username: username,
                            success: true,
                            message: "Utilisateur crée !"
                        });
                    });
                } else {
                    console.log("Utilisateur déjà existant en BDD.");
                    return res.send({
                        username: username,
                        success: false,
                        message: "Utilisateur déjà existant en BDD."
                    });
                }
            })
        } else {
            console.log("Les mots de passes reçus de sont pas identiques.");
        }
    })

    app.get('/worldchat', function (req, res) {
        res.render('worldChat', {
            message: 'worldchat'
        });
    });

    app.post('/worldchat', function (req, res) {

        // Chatroom
        let numUsers = 0;
        let usersConnected = [];

        io.on('connection', function (socket) {
            let addedUser = false;
            let getLastMsg = function () {
                con.query('SELECT message, username FROM messages LIMIT 30',
                    function (err, rows) {
                        if (err) {
                            socket.emit('error', err.code);
                            return true;
                        }
                        for (k in rows) {
                            let row = rows[k];
                            message = {
                                message: row.message,
                                username: row.username,
                                user_id: row.user_id
                            }
                            socket.emit('new message', message);
                        }
                    }
                )
            }

            socket.on('add private room', function (room) {
                //socket.join(room);
                console.log(room);
            });

            // when the client emits 'new message', this listens and executes
            socket.on('new message', function (data) {

                if (data.startsWith('/pv')) {
                    const args = data.split(/\s+/g);
                    let prefix = args[0];
                    let username = args[1];
                    let message = args.slice(2).join(" ");

                    console.log(message);

                    if (username == socket.username) {
                        socket.emit('error_msg', 'Vous ne pouvez pas vous envoyer un message !');
                    } else if (connectedUsers[username]) {

                        socket.broadcast.to(connectedUsers[username].id).emit('new message', {
                            username: socket.username,
                            message: message,
                            id_user: socket.id,
                            from: connectedUsers[username].username,
                            command: true
                        });
                    } else {
                        socket.emit('error_msg', 'Mauvais utilisateur !');
                    }
                } else {
                    let $created_at = Date.now();

                    //console.log(message);

                    con.query('INSERT INTO messages SET id_user = ?, message = ?, username = ?, created_at = ?', [
                        socket.id,
                        data,
                        socket.username,
                        new Date($created_at)
                    ], function (err) {
                        if (err) {
                            socket.emit('error', err);
                        }
                        // we tell the client to execute 'new message'
                        socket.broadcast.emit('new message', {
                            username: socket.username,
                            message: data,
                            id_user: socket.id
                        });
                    })
                }
            });

            // when the client emits 'add user', this listens and executes
            socket.on('add user', function (username) {
                if (addedUser) return;

                // we store the username in the socket session for this client
                socket.username = username;
                ++numUsers;
                addedUser = true;
                socket.emit('login', {
                    numUsers: numUsers
                });

                connectedUsers[username] = socket;

                getLastMsg();
                io.sockets.emit('clear user list');
                for (k in connectedUsers) {
                    let row = connectedUsers[k];

                    io.sockets.emit('updateListUsers', {
                        username: connectedUsers[k].username,
                        numUsers: numUsers,
                        id: connectedUsers[k].id
                    });
                }

                // echo globally (all clients) that a person has connected
                // Envoi de la letiable $userConnected pour la liste
                socket.broadcast.emit('user joined', {
                    username: socket.username,
                    numUsers: numUsers,
                    id: connectedUsers[username].id
                });
            });

            // when the client emits 'typing', we broadcast it to others
            socket.on('typing', function () {
                socket.broadcast.emit('typing', {
                    username: socket.username
                });
            });

            // when the client emits 'stop typing', we broadcast it to others
            socket.on('stop typing', function () {
                socket.broadcast.emit('stop typing', {
                    username: socket.username
                });
            });

            // when the user disconnects.. perform this
            socket.on('disconnect', function () {
                if (addedUser) {
                    --numUsers;
                    delete connectedUsers[socket.username];

                    io.sockets.emit('clear user list');
                    for (k in connectedUsers) {
                        let row = connectedUsers[k];

                        io.sockets.emit('updateListUsers', {
                            username: connectedUsers[k].username,
                            numUsers: numUsers,
                            id: connectedUsers[k].id
                        });
                    }

                    // echo globally that this client has left
                    socket.broadcast.emit('user left', {
                        username: socket.username,
                        numUsers: numUsers
                    });
                }
            });
        })
    })


}
module.exports = initIndex;