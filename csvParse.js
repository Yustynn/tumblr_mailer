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

module.exports.csvParse = csvParse;
