
'use strict';

var fs = require('fs');
var express = require('express');
var app = express();

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
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
  
app.route('/')
    .get(function(req, res) {
      console.log('haha');

    })
    .post(function(req,res){
      let obj = {'unix':null, 'natural':null};
      obj = req.body.data;
      console.log('get1:',obj);
      res.end(JSON.stringify(obj));  
    });

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  let obj = {'unix':null, 'natural':null};
  obj = req.body.data;
  console.log('get:',obj);
  res.end(JSON.stringify(obj));  
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
