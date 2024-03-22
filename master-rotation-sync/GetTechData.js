function getTechInfo(sheetName, startRow) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    var data = [];
    var row = startRow;
    var lastRow = sheet.getLastRow();
    var now = new Date(); // Current date for future check
  
    while (row <= lastRow) {
      var dateCell = sheet.getRange('A' + row).getValue();
      if (dateCell instanceof Date && dateCell > now) {
        var date = Utilities.formatDate(dateCell, Session.getScriptTimeZone(), "yyyy-MM-dd");
        var events = [];
  
        // Increment to start from the next row after the date
        row++;
        while (row <= lastRow && !(sheet.getRange('A' + row).getValue() instanceof Date)) {
          var eventName = sheet.getRange('A' + row).getValue();
          
          // Prepare to collect all text values from the row after the event name row
          var listRow = row + 1;
          // Assuming values can extend from column A to the last column with data
          var lastColumn = sheet.getLastColumn();
          var namesRange = sheet.getRange(listRow, 1, 1, lastColumn);
          var namesValues = namesRange.getValues()[0];
          
          var namesList = namesValues.filter(function(value) {
            return typeof value === 'string' && value.trim() !== ''; // Only include non-empty strings
          }).map(function(name) {
            return name.trim(); // Trim the names
          });
  
          if (eventName) { // Add event if there's an event name
            events.push({
              "name": eventName,
              "categories": [
                {
                  "name": "Tech",
                  "members": namesList // Use the collected names list
                }
              ]
            });
          }
  
          // Move to the next potential event date row
          row += 2;
        }
  
        // Add date and its events to data if there are any events
        if (events.length > 0) {
          data.push({
            "date": date,
            "events": events
          });
        }
      } else {
        // Not a date or not in the future, move to the next row
        row++;
      }
    }
  
    return data
  }