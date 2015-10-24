var fs = require('fs');

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
