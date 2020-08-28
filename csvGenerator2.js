// Schedule Program Run
const cron = require("node-cron");
const express = require("express");
const fs = require("fs");

//app = express();

//cron.schedule("* * * * *", function() {
  // Greeting
  console.log('CSV generator is starting');
  // Import Twit
  var Twit = require('twit');
  // Import Sentiment
  var Sentiment = require('sentiment');
  // Authenticate
  var config = require ('./config');
  var T = new Twit(config);

  // CSV
  const ObjectsToCsv = require ('objects-to-csv');

  // Get Tweets with Given Parameters
  var params = {
      q: 'remote work',
      lang: 'en',
      //since: '2019-10-16',//Since YYYY-MM_DD
      //Unit
      // Reutrns result with an ID greater (more recent) than specified ID
      //track: ['hello', 'bye'],
      //until: '2020:06:22',
      //create_at
      //user: flowers_count, freinds_count, favourites_count, created_at
      //created_at: '2020:06:20',
      count: 100
  }

  T.get('search/tweets', params, gotData);

  //Outputs Tweet and Sentiment Analysis
  async function gotData(err, data, response) {
      var tweets = data.statuses;
      var sentiment = new Sentiment();
      var csv_array = [];
      var csv_column = ['Date', 'Tweet', 'Sentiment Score', 'Calculation',
      'Possitive Word(s)', 'Negative Word(s)'];
      csv_array.push(csv_column);
      for (var i=0; i<tweets.length; i++) {
          row_array = []; //New array for new row
          var date = tweets[i].created_at; // Pulls tweet date
          row_array.push(date); // Adds tweet date to array
          var tweet = tweets[i].text; // Pulls tweet text
          row_array.push(tweet); // Adds tweet text to array
          var analysis = sentiment.analyze(tweets[i].text); // Analyze tweet text
          row_array.push(analysis['score']); // Adds sentiment score to row array.
          //row_array.push(analysis['words']);
          row_array.push(analysis['calculation']);
          row_array.push(analysis['possitive']);
          row_array.push(analysis['negative']);
          csv_array.push(row_array); //Adds row array to bigger, csv array
      }
      //Creating Date for CSV file name
      let date_ob = new Date();
      let date_ = ('0' + date_ob.getDate()).slice(-2);
      let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
      let year = date_ob.getFullYear();
      let hours = date_ob.getHours();
      let minutes = date_ob.getMinutes();
      let seconds = date_ob.getSeconds();
      var csvName = (year + '-' + month + '-' + date_ + '_' + hours + '-' + minutes + '-' + seconds);

      // Exports data as CSV
      const csv = new ObjectsToCsv(csv_array);
      await csv.toDisk('Remote' + csvName + '.csv');


      // Farewell Message
      console.log('CSV generator has completed request. OPEN FILE: ' + 'Remote' + csvName + '.csv');
  }
//});
