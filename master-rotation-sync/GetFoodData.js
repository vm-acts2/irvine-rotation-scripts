function getFoodInfo(sheetName, startRow) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    var eventsByDate = {}; // Object to hold dates as keys and arrays of events as values
    var row = startRow;
    var lastRow = sheet.getLastRow();
    var now = new Date(); // Get the current date
  
    while (row <= lastRow) {
      var dateCell = sheet.getRange('A' + row).getValue();
      // Break the loop if the dateCell is not a valid Date object
      if (!(dateCell instanceof Date)) {
        break; // Exit if no valid date is found
      }
  
      var date = Utilities.formatDate(dateCell, Session.getScriptTimeZone(), "yyyy-MM-dd");
      // Convert both now and dateCell to comparable formats
      var dateComparable = new Date(date + "T00:00:00Z"); // Ensure dateCell is in a comparable format
  
      // Only proceed if the date is in the future
      if (dateComparable <= now) {
        row += 3; // Skip to the next set of rows if the date is not in the future
        continue;
      }
  
      var eventName = sheet.getRange('A' + (row + 1)).getValue();
      var location = sheet.getRange('B' + (row + 2)).getValue();
      var membersRange = sheet.getRange('C' + (row + 2) + ':J' + (row + 2));
      var members = membersRange.getValues()[0].filter(function(member) {
        return member !== ""; // Filter out empty cells
      });
  
      // Construct the event object
      var event = {
        "name": eventName,
        "categories": [
          {
            "name": "Food", // Assuming category is static as "Food"
            "location": location,
            "lead": members.shift(), // Assuming the first member is the lead
            "members": members
          }
        ]
      };
  
      // Check if the date already exists in the eventsByDate object
      if (!eventsByDate[date]) {
        eventsByDate[date] = [];
      }
      // Append the new event to the array for the corresponding date
      eventsByDate[date].push({
        "date": date,
        "events": [event]
      });
  
      row += 3; // Proceed to the next set of rows for the next event
    }
  
    // Convert the eventsByDate object to an array of its values
    // Each key's array might have multiple events for the same date
    var data = [];
    for (var key in eventsByDate) {
      data = data.concat(eventsByDate[key]); // Flattening the structure
    }
  
    // Optionally sort the data by date
    data.sort(function(a, b) {
      return new Date(a.date) - new Date(b.date);
    });
  
    return data
  }
  