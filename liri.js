require('dotenv').config();
var fs = require('fs');
var request = require('request');
var action = process.argv[2];
var input = process.argv[3];

var keys = require('./keys');
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

var Spotify = require('node-spotify-api');
// var Spotify = require('spotify');
var spotify = new Spotify(keys.spotify);

var omdb = require('omdb');

// action(command, name);
// function action(command, name) {
switch (action) {
  case 'my-tweets':
    twitter();
    break;

  case 'spotify-this-song':
    spotifyApp();
    break;

  case 'movie-this':
    movie();
    break;

  case 'do-what-it-says':
    doit();
    break;
}

function twitter() {
  var params = { screen_name: input, count: 20 };
  client.get('statuses/user_timeline', params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      for (i = 0; i < tweets.length; i++) {
        console.log(
          'Tweet: ' + tweets[i].text + '' + 'Create at: ' + tweets[i].created_at
        );
      }
    } else {
      console.log(error);
    }
  });
}

function movie() {
  var queryUrl = ' http://www.omdbapi.com/?t=' + input + '&apikey=e87da087';
  // var input = process.argv[3];
  if (input === null) {
    input = 'Mr.Nobody';
    console.log('working fine.');
  }
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("It's working fine.");
    }
    var movie = JSON.parse(body);
    console.log('Title: ' + movie.Title);
    console.log('Release Year: ' + movie.Year);
    console.log('IMDB Rating: ' + movie.imdbRating);
    console.log('Rotten Tomatoes Rating: ' + movie.Ratings[1].Value);
    console.log('Country: ' + movie.Country);
    console.log('Language: ' + movie.Language);
    console.log('Plot: ' + movie.Plot);
    console.log('Actors: ' + movie.Actors);
  });
}

function spotifyApp() {
  if (!input) {
    input = 'The Sign';
    console.log("It's working here.");
  }
  spotify.search({ type: 'track', query: input }, function(error, data) {
    if (error) {
      console.log('Error occurred: ' + error);
    }

    var songInfo = data.tracks.items;
    console.log('Song Name: ' + songInfo[0].name);
    console.log('Artist(s): ' + songInfo[0].artists[0].name);
    console.log('Preview Link: ' + songInfo[0].preview_url);
    console.log('Album: ' + songInfo[0].album.name);
  });
}

function doit() {
  fs.readFile('random.txt', 'utf8', function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(',');
    if (dataArr[0] === 'spotify-this-song') {
      spotifyApp(dataArr[1]);
    }
    if (dataArr[0] === 'movie-this') {
      movie(dataArr[1]);
    }
  });
}
