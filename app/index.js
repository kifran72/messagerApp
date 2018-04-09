let express = require('express');
let app = express();
let connectedUsers = {};
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let twig = require('twig');
let bodyParser = require('body-parser');
let session = require('express-session');
let cookieParser = require('cookie-parser');
let mysql = require('mysql');
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "messagerapp"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.set('views', 'views');
app.set('view engine', 'html');
app.engine('html', twig.__express);
app.set('twig options', {
    strict_variables: false,
});

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
    cookie: { maxAge: 60000 }
}))


// ROUTES
require('./routes/index').init(app, session, con, io, server, connectedUsers);

// ALL OTHER ROUTES REDIRECT TO '/'
app.get('*', function (req, res) {
    res.redirect('/');
});



module.exports = app;

