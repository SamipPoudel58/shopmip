require('dotenv').config();
const { MONGO_ATLAS, MONGO_LOCAL, NODE_ENV } = process.env;
const MONGO = NODE_ENV === 'development' ? MONGO_LOCAL : MONGO_ATLAS;
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
// session
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression'); // necessary for heroku not aws,gcp,azure
// const morgan = require("morgan");
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');

// store sessions in database
const store = new MongoDBStore({
  uri: MONGO,
  collection: 'sessions',
});

const csrfProtection = csrf();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/webp' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
////////////////////////////////////////////////////////////////////

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const authRoutes = require('./routes/auth.js');

const errorController = require('./controllers/error.js');
const User = require('./models/user');

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" } // flags: a means the data will not be overwritten instead be appended
// );

app.use(helmet()); // secure the headers
app.use(compression());

app.use(
  expressCspHeader({
    directives: {
      'img-src': ["'self'", 'https://res.cloudinary.com'],
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
// session middleware
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

// find current user
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

// CSRF Protection Middleware
app.use((req, res, next) => {
  // locals allows to access variables inside views
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.redirect('/500');
});

const PORT = process.env.PORT || 4000;

mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(PORT);
    console.log(`Server running on port ${PORT}`);
    console.log(`Connected to ${NODE_ENV} Database`);
  })
  .catch(console.err);
