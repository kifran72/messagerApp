let express = require('express');
let fileUpload = require('express-fileupload');
let formidable = require('formidable');
let fs = require('fs');
let app = express();
let connectedUsers = {};
let moment = require('moment');
let http = require('http').Server(app);
let io = require('socket.io')(http);
let twig = require('twig');
let bodyParser = require('body-parser');
let session = require('express-session');
let mysql = require('mysql');
let con = mysql.createConnection({
    host: 'localhost',
    user: 'kifran',
    password: 'toor',
    database: 'messagerapp',
});



con.connect(function(err) {
    if (err) throw err;
    console.log('BDD Connected!');
});
require('../config/socket')(io);

// Moment FR
require('moment/locale/fr.js');

app.set('views', 'views');
app.set('view engine', 'html');
app.engine('html', twig.__express);
app.set('twig options', {
    strict_variables: false,
});

// Upload Files  
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    createParentPath: true

}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false,
}));

// parse application/json
app.use(bodyParser.json());

app.use('/vendor', express.static('public/vendor'));
app.use('/js', express.static('public/js'));
app.use('/css', express.static('public/css'));
app.use('/img', express.static('public/img'));
app.use('/assets', express.static('public'));

// initialise une session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 60000,
    },
}));




// ROUTES

// app.post('/upload', function(req, res) {
//     if (!req.files || Object.keys(req.files).length === 0) {
//         return res.status(400).send('No files were uploaded.');
//     }
//     let idUser = req.session.id_user
//     let insertImgUser = 'UPDATE users SET img_url = ? WHERE id_user = ?';
//     let sampleFile = req.files.sampleFile;
//     let formatUsername = req.session.username;
//     let fileUserUrl = `${__dirname}/public/imgProfils/${sampleFile.name}`;
//     req.session.img_url = fileUserUrl;
//     sampleFile.mv(fileUserUrl, function(err) {
//         if (err) {
//             return res.status(500).send(err);
//         } else {
//             // con.query(insertImgUser, [fileUserUrl, idUser], function(err, result) {
//             //     if (err) throw err;
//             //     if (result.length != 0) {
//             //         return res.send({
//             //             success: true,
//             //         });
//             //     } else {
//             //         return res.send({
//             //             success: false,
//             //         });
//             //     }
//             // });

//             res.send('File uploaded to ' + uploadPath);

//         }
//     });


// });


require('./routes/index').init(app, session, con, io, http, connectedUsers, moment);

// ALL OTHER ROUTES REDIRECT TO '/'
app.get('*', function(req, res) {
    res.redirect('/');
});


module.exports = http;