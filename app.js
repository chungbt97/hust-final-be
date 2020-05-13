var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();
var errorHandler = require('./common/ErrorHandler');
//Router

// create server
var app = express();
var cors = require('cors');
app.use(cors());
// Add headers

// view engine setup
mongoose.Promise = global.Promise;
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//connect mongoose
var mongoDB = `mongodb://localhost:27017/${process.env.DB_NAME}`;
mongoose.connect(mongoDB);
var db = mongoose.connection;

//Ràng buộc kết nối với sự kiện lỗi (để lấy ra thông báo khi có lỗi)
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connect successfully');
});

require('./routes')(app);

// error handler
app.use(errorHandler);

module.exports = app;
