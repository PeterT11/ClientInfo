
'use strict';
const bodyParser = require("body-parser");
var fs = require('fs');
var express = require('express');
var app = express();

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {

    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log('Origin:',origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.use('/', express.static(process.cwd()));
app.post('/',function(req,res) {
      
      let obj = {};
      obj.Ip = req.ip;
      if(obj.Ip.indexOf('::')!==-1)
        obj.Ip = 'Local loop';
      let os = req.headers['user-agent'];
      obj.os =/\(([^\)]*)\)/.exec(os)[1];
      console.log('header:',os,obj.os);
      obj.language=req.headers['accept-language'];
      //console.log(6);
      // console.log('get1:',obj);
      res.end(JSON.stringify(obj));  
    });

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  console.log('strange');
  res.end('Nothing happened');  
  next();
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(3000, function () {
  console.log('Node.js listening 3000...');
});

