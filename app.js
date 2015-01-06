var express = require('express'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  multer = require('multer'),
  favicon = require('serve-favicon'),
  http = require('http'),
  path = require('path'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  app = express(),
  router = express.Router();

app.set('port', process.env.PORT || process.argv[2] || 8080);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.set('views', path.join( __dirname, '/views') );
app.set('view engine', 'html');
app.engine('html', require('vash').__express);
app.use(methodOverride());
app.use(cookieParser());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'blarg blarg' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app);

if (app.get('env') == 'development'){
  app.use(logger('dev'));
  app.use(errorHandler());
}

app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});