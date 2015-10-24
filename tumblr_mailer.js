var fs = require('fs');

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

var csvFile = fs.readFileSync('./friend_list.csv', 'utf8');
var entries = csvParse(csvFile);

var emailTemplate = fs.readFileSync('./email_template.html', 'utf8');

for (var entry in entries) {
  // replace FIRST_NAME
  var customizedEmail = emailTemplate.replace('FIRST_NAME', entries[0]['firstName']);
  // replace NUM_MONTHS_SINCE_CONTACT
  customizedEmail = customizedEmail.replace('NUM_MONTHS_SINCE_CONTACT', entries[0]['numMonthsSinceContact']);
  console.log(customizedEmail);
}
