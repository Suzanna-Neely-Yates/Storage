// Greeting
console.log('Bot is starting');

// Import Twit
var Twit = require('twit');

// Import Sentiment
var Sentiment = require('sentiment');

// Authenticate
var config = require ('./config');
var T = new Twit(config);

// Get Tweets with Given Parameters
var params = {
    q: 'work',
    lang: 'en',
    //until: 'YYYY:MM:DD',
    count: 2
}

T.get('search/tweets', params, gotData);

//Outputs Tweet and Sentiment Analysis
function gotData(err, data, response) {
    var tweets = data.statuses;
    var sentiment = new Sentiment();
    var sub_array = [];
    var super_arrray = [];
    for (var i=0; i<tweets.length; i++) {
        var tweet = tweets[i].text; //Tweet Text
        var analysis = sentiment.analyze(tweets[i].text); //Sentiment Analysis Result (Dictionary)
        var data = [{'Tweet': tweet, 'Score': analysis['score'],
        'Words': analysis['words'],  'Possitive Words': analysis['possitive'],
        'Negative Words': analysis['negative']}];
        console.log(data);
        console.log(analysis);
    }

}
