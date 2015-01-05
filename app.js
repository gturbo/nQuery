var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var db = require('./routes/db-crude');
var monetdb = require('./routes/monetdb');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
var lessMiddleware = require('less-middleware');
app.use(lessMiddleware(path.join(__dirname, 'sources'), {dest: path.join(__dirname, 'public')}));
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');

app.use('/', routes);
app.use('/db', db);
app.use('/monetdb', monetdb);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// custom template compilation stack in dev env
// watch templates (source directory)
// generates client templates.js file in public directory
if (app.get('env') === 'development') {

    // compile templates
    var compile = require('./compile');
    var templateDir = __dirname + '/templates/';
    var outPutFile = __dirname + '/public/js/templates.js';
    var fs = require('fs');
    fs.watch(templateDir, function () {
        compile.compile(templateDir, function (err, js) {
            if (err) console.log("ERROR in template compilation", err)
            else {
                fs.writeFile(outPutFile, js, function (err) {
                    if (err)
                        console.log(err);
                    else
                        console.log(new Date(), " template.js refreshed");
                });
            }
        })
    });
}

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
