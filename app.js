
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var mongoose=require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

//passport config 
require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect ('mongodb://127.0.0.1:27017/Thriftal',{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
  console.log('here......')
})

//express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash 
app.use(flash());

//global vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error= req.flash('error');

  next();
});

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// app.use(function(req, res, next){
// res.locals.session = req.session;
// next();

// });

module.exports = app;
