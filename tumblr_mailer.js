var fs  = require('fs'),
  csvParse = require('./csvParse'),
  ejs = require('ejs'),
  email = require('./email'),
  tumblr = require('tumblr.js');

// Create Tumblr client
var tumblr_client = tumblr.createClient({
  consumer_key: 'OZ3tMvEFmiMBZtp9hlu0IkdWvUUmqazm61eoUjdhtYbIht9Z2u',
  consumer_secret: 'CXLU7tt90y8L8ONd4Y8YRHOzEGI32vm10b32BbweZ3u9Qts67w',
  token: 'TQQ8Ig8ZsS1KZGfZu36Cg5IsYxwWNbgqMqGaNkhT1buTS1kj2q',
  token_secret: 'MOZX8hcYUrwJfBujhf0Pt0CQxPcZf6PcUhTeqEYun31xlvqmGj'
});

var latestPosts = [];
// Retrieve latest posts (within last week) from tumblr, store in latestPosts
tumblr_client.posts('whyFullstack.tumblr.com', function(err, blog) {
  var posts = blog.posts,
    weekInMs = 1000 * 60 * 60 * 24 * 7; // posts within last week

  for (var i = 0; i < posts.length; i++) {
    var postDateInMs = Date.parse(posts[i].date);
    if (Date.now() - postDateInMs < weekInMs)
      latestPosts.push(posts[i]);
  }

  var csvFile = fs.readFileSync('./friend_list.csv', 'utf8');
  var entries = csvParse.csvParse(csvFile);

  var emailTemplate = fs.readFileSync('./email_template.html', 'utf8');

  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var customizedEmail = ejs.render(emailTemplate, {
      firstName: entry['firstName'],
      latestPosts: latestPosts,
      numMonthsSinceContact: entry['numMonthsSinceContact'],
    });

    email.sendEmail(entry['firstName'], entry['emailAddress'], 'Yus', 'yustynn@gmail.com', 'Sup.', customizedEmail);
    console.log('Sending email to ' + entry['firstName'] + '...');
  }
});
