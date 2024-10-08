const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const catalogRouter = require('./routes/catalog'); 
const User = require('./models/usersModel');
const asyncHandler = require("express-async-handler");

const session = require("express-session");
const flash = require('connect-flash')
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')
require('dotenv').config()


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
// Set up mongoose connection
const expressAsyncHandler = require('express-async-handler');

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGO_URI

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

//added below
/*
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ usernameEmail: username }).catch(err => done(err));
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    if (user.password !== password) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  })
);
*/
passport.use(
  new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ usernameEmail: username }).catch(err => done(err));
  console.log(`User ${username} attempted to log in.`);
  //if (err) return done(err);
  if (!user) return done(null, false, { message: "Incorrect username" });
  if (!bcrypt.compareSync(password, user.password)) { 
      return done(null, false, { message: "Incorrect password" });
  }    
  return done(null, user);
}));


//sending data to be stored:
passport.serializeUser((user, done) => {
  done(null, user.id);
});
// recieveing stored data:
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});
//aded above
app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/catalog", catalogRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
