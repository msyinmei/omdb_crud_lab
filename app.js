var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

//Beginning
app.get('/', function(req, res){
  res.render('index.ejs');
});

//Search
app.get('/search', function(req, res){

  //Grab the movie title from the URL query string
  var searchTerm = req.query.movieTitle;

  //Build the URL that we're going to call
  var url = "http://www.omdbapi.com/?s=" + searchTerm;

  // Call the OMBD API searching for the movie
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(body);
      res.render("results", {movieList: obj.Search});
    }
  });
});

//Movie Details
app.get('/results/:id', function(req,res){
   var filmId = req.params.id;
   var obj;
  //Build the URL that we're going to call
  var url = "http://www.omdbapi.com/?i=" + filmId;

  // Call the OMBD API searching for the movie
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      obj = JSON.parse(body);
      res.render("details", {film: obj});
    }
  });
});

// Variables for add to Watchlist
var watchLater = [];
//Add to Watchlist
app.get('/later', function(req,res){
  res.render('later', {watchLater: watchLater});
});
app.post('/later/:id', function(req,res){
  var imdbID = req.params.id;
  var id = req.body.id;
  var title = req.body.title;
  watchLater.push({id:id, title:title, imdbID:imdbID});
  res.redirect("/later");
});
app.delete('/later', function(req,res){
  //remove a movie from the watchLater list
  var id = req.body.id;
  for (var i = 0; i < watchLater.length ; i++) {
    if(watchLater[i].id === id) {
      watchLater.splice(i,1);
    }
  }
  res.redirect("/later");
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});