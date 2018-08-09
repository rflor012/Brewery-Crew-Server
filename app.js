require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
//added in after the generation of the Express Project
const cors         = require('cors');
const session      = require('express-session');
const passport     = require('passport');
//Added a new folder /config with a passport.js file to config passport
const passportSetup= require('./config/passport');

passportSetup(passport);


mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/server', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//Session allows us to use cookies to track a user session,
// never put critical information into a cookie, can compromise the site
// more info https://www.npmjs.com/package/express-session
app.use(session({
  secret: 'angular key this is passport secret',
  resave: true,
  saveUninitialized: true,
  cookie: {httpOnly: true, maxAge: 2419200000 }
}));

app.use(passport.initialize());
app.use(passport.session());



// default value for title local, but now we changed it to be even more true
app.locals.title = 'Paola Rosalia and Rodrigo are Awesome :)';

//this is setting up cors for the angular front-end
app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200']
}))



///------- Routes -------------------------

    //index
const index = require('./routes/index');
app.use('/', index);

    //auth
const authRoutes = require('./routes/auth-routes');
app.use('/api', authRoutes);

    //review
const reviewRoutes = require('./routes/review-routes');
app.use('/api', reviewRoutes);

    //brewery
const breweryRoutes = require('./routes/brewery-routes');
app.use('/api', breweryRoutes);

    //beer
const beerRoutes = require('./routes/beer-routes');
app.use('/api', beerRoutes);


///------- End Of Routes ------------------

module.exports = app;
