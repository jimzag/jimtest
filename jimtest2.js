var express = require('express');
var app = express();
//an example external library
var fortune = require('./lib/fortune.js');
var vhost = require('vhost');

//set up handlebars view engine
var handlebars = require('express3-handlebars').create({
    defaultLayout:'main',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port',process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
    console.log ("rendering home");
    res.render('home', {data1: 'hello', data2: 'goodbye'});
});

app.get('/about', function(req, res){
    console.log ("rendering about");
    res.render('about', {fortune: fortune.getFortune()});
});

//the API side functions.  These are called via POST (ajax) from the web page to make a display change
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.post('/api/testpost', function(req, res){
    console.log ("process msg");
    var test_name=req.body.name;
    var test_time=req.body.time;
    console.log ("name ="+test_name+"time="+test_time);
    res.end("yes");
});

//not used - would land here if the call were a GET instead of POST
app.get('/api/testpost', function(req, res){
    console.log ("process get");
});


// custom 404 page
app.use(function(req, res){
    console.log ("not found page");
    res.status(404);
    res.render('404');
});
// custom 500 page
app.use(function(err,req,res,next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});


