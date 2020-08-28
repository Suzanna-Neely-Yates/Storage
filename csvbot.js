// Greeting
console.log("Bot is starting");

// Import Twit
var Twit = require("twit");

// Import Sentiment
var Sentiment = require('sentiment');

// Authenticate
var config = require ('./config');
var T = new Twit(config);

// CSV
const ObjectsToCsv = require ('objects-to-csv');

// Get Tweets with Given Parameters
// Reference: https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline#:~:text=There%20are%20limits%20to%20the,to%20the%20oldest%20ID%20available.&text=Specifies%20the%20number%20of%20Tweets,of%20200%20per%20distinct%20request.
var params = {
    q: 'cowork', //Tweet containing word...
    lang: "en", //Language
    since: "2019-10-16",//Since YYYY-MM_DD
    //Unit
    // Reutrns result with an ID greater (more recent) than specified ID
    //track: ['hello', 'bye'],
    //until: "2020:06:18",
    count: 100
}

T.get('search/tweets', params, gotData);
//T.get('search/tweets.json', params, gotData);

//Outputs Tweet and Sentiment Analysis
async function gotData(err, data, response) {
    var tweets = data.statuses;
    var sentiment = new Sentiment();
    var csv_array = [];
    for (var i=0; i<tweets.length; i++) {
        mini_array = []; //New array that will be every row of csv
        var tweet = tweets[i].text; // Pulls tweet text
        mini_array.push(tweet); // Adds tweet text to array
        var analysis = sentiment.analyze(tweets[i].text); // Analyze tweets
        mini_array.push(analysis["score"]); // Adds sentiment score to array.
        //mini_array.push(analysis["words"]);
        mini_array.push(analysis["calculation"]);
        //mini_array.push(analysis["possitive"]);
        //mini_array.push(analysis["negative"]);
        csv_array.push(mini_array); //Adds sub array to bigger array
    }
    // Exports data as CSV
    const csv = new ObjectsToCsv(csv_array);
    await csv.toDisk('./csv_array.csv');
}
