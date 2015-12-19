var path = require('path')
  , express = require('express.io')
  , app = express().http().io()
  , mongoose = require('mongoose')
  , log = require('util').log;

app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

app.use(app.router);

mongoose.connect('mongodb://localhost/test');

//routes
require('./routes')(app);

app.listen(3000);

log('express.io server running on ' + 3000);
