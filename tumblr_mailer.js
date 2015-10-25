var fs  = require('fs'),
  ejs   = require('ejs'),
  mandrill = require('mandrill-api/mandrill'),
  tumblr = require('tumblr.js');

// Create Tumblr client
var tumblr_client = tumblr.createClient({
  consumer_key: 'OZ3tMvEFmiMBZtp9hlu0IkdWvUUmqazm61eoUjdhtYbIht9Z2u',
  consumer_secret: 'CXLU7tt90y8L8ONd4Y8YRHOzEGI32vm10b32BbweZ3u9Qts67w',
  token: 'TQQ8Ig8ZsS1KZGfZu36Cg5IsYxwWNbgqMqGaNkhT1buTS1kj2q',
  token_secret: 'MOZX8hcYUrwJfBujhf0Pt0CQxPcZf6PcUhTeqEYun31xlvqmGj'
});

// Create Mandrill client
var mandrill_client = new mandrill.Mandrill('EJlx7_7SZLjqN3h-oQ02tg');

// Sends email using Mandrill API
function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        // console.log(message);
        // console.log(result);
        console.log('Email Sent!');
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
 }

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
  var entries = csvParse(csvFile);

  var emailTemplate = fs.readFileSync('./email_template.html', 'utf8');

  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var customizedEmail = ejs.render(emailTemplate, {
      firstName: entry['firstName'],
      latestPosts: latestPosts,
      numMonthsSinceContact: entry['numMonthsSinceContact'],
    });

    sendEmail(entry['firstName'], entry['emailAddress'], 'Yus', 'yustynn@gmail.com', 'Sup.', customizedEmail);
    console.log('Sending email to ' + entry['firstName'] + '...');
  }
});

// Return an array of rows stored in objects. Each cell is accessible
// by the header name of its column.
function csvParse(csvContents) {
  var rows = csvContents.split('\n');
  rows.pop(); // remove excess \n
  var headers = rows[0].split(',');
  var entries = [];

  // Go over each row (except row 0, the header row)
  for (var i = 1; i < rows.length; i++) {
    var cells = rows[i].split(',');
    var entry = {};

    for (var j = 0; j < 4; j++) {
      // set property name of cell header = row's corresponding cell value
      entry[headers[j]] = cells[j];
    }
    entries.push(entry);
  }

  return entries;
}
