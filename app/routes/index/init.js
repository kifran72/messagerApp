/**
 * @param  {Object} app
 */
function initIndex(app, session, con, io, server, connectedUsers, moment) {

    let users = [];


    app.get('/', function (req, res) {
        if (!req.session.connected) return res.render('users/login', {
            message: 'Bienvenue'
        });
        return res.render('index', {
            message: 'Bienvenue',
            image: req.session.img_url,
            username: req.session.username,
            mail: req.session.mail_users
        });
    });


    app.get('/login', function (req, res) {
        if (req.session.connected) return res.redirect('/');
        return res.render('users/login', {
            message: 'Bienvenue',
            info: 'Connexion en cours'
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
                req.session.id_user = result[0].id_user;
                req.session.mail_users = result[0].mail_users;
                req.session.username = username;
                req.session.account_type = result[0].role;
                req.session.img_url = result[0].img_url;


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



        let userCon = users.find(userInfo => userInfo.id_user === req.session.id_user);

        if (userCon) {
            users.splice(users.indexOf({
                username: req.session.username,
                id_user: req.session.id_user
            }), 1);

            io.sockets.emit('remove user', users);
        }

        req.session.destroy(function (err) {
            if (err) throw err;
            return res.render('users/login', {
                message: 'Bienvenue'
            });

        });
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
        if (!req.session.connected) return res.redirect('/');
        return res.render('worldChat', {
            message: "hello",
            username: req.session.username,
            id_user: req.session.id_user,
            image: req.session.img_url
        });

    });

    app.get('/worldchat/getMessages', function (req, res) {
        let search = 'SELECT *, u.img_url FROM messages m, users u WHERE m.id_user=u.id_user LIMIT 30';

        let userCon = users.find(userInfo => userInfo.id_user === req.session.id_user);

        if (!userCon) {
            users.push({
                username: req.session.username,
                id_user: req.session.id_user,
                img_url: req.session.img_url
            });

            io.sockets.emit('add user', users);
        } else {
            io.sockets.emit('add user', users);
        }

        con.query(search, function (err, result, fields) {
            if (err) throw err;
            if (result.length != 0) {
                let messages = [];
                let date;

                for (let i = 0; i < result.length; i++) {
                    date = moment(result[i].created_at).format('D MMM YY HH:mm');

                    messages.push({
                        username: result[i].username,
                        message: result[i].message,
                        created_at: date,
                        id_user: result[i].id_user,
                        id_message: result[i].id_message,
                        img_url: result[i].img_url
                    });
                }

                return res.send({ messages });
            } else {
                return res.send({});
            }
        });


    });

    app.post('/worldchat/sendMessage', function (req, res) {
        let message = req.body.message;
        let id_user = req.session.id_user;


        let search = 'INSERT INTO messages(id_user, message, created_at) VALUES(?,?,NOW())';
        con.query(search, [id_user, message], function (err, result, fields) {
            if (err) throw err;

            io.sockets.emit('echo', {
                message: message,
                id_message: result.insertId,
                username: req.session.username,
                created_at: moment().format('D MMM YY HH:mm'),
                id_user: id_user,
                img_url: req.session.img_url
            });

            return res.send({
                success: true,
                content: message
            });
        });
    });


    app.get('/profil', function (req, res) {

        if (!req.session.connected) return res.render('users/login', {
            message: 'Bienvenue'
        });


        return res.render('users/profil', {
            message: 'Profil',
            image: req.session.img_url,
            username: req.session.username,
            mail: req.session.mail_users
        });
    })

}

module.exports = initIndex;