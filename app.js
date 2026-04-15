const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();
const server = require('http').Server(app);

// express-ws exports a function that takes app and server as params
require('express-ws')(app, server);

const indexRouter = require('./routes/index'); // store the exported router from index.js in pollingRouter
const pollingRouter = require('./routes/polling'); // store the exported router from polling.js in pollingRouter
const longpollingRouter = require('./routes/longpolling'); // store the exported router from longpolling.js in pollingRouter
const sseRouter = require('./routes/sse'); // etc...
const websocketRouter = require('./routes/websocket');

// view engine setup, __dirname provides the abs. path where the current file is executing
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter); // route / to indexRouter
app.use('/polling', pollingRouter); // route /polling/xyz to pollingRouter
app.use('/longpolling', longpollingRouter); // etc...
app.use('/sse', sseRouter);
app.use('/websocket', websocketRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app, server };
