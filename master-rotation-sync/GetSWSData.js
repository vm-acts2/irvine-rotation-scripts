// Returns a dictionary of date:list pairs with list[0] being the praise lead

function getSWSPraiseInfo(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var lastColumn = sheet.getLastColumn(); // Get the last column with data
  var datetimeRow = 2; // Assuming datetime values are in row 2
  var itemsStartRow = 3; // Assuming item lists start from row 3
  var itemsEndRow = 12; // Assuming item lists end at row 12

  // Dynamically find the last valid datetime column in row 2
  var lastDatetimeColumn = 2; // Start from column B
  for (var col = 2; col <= lastColumn; col++) {
    var cellValue = sheet.getRange(datetimeRow, col).getValue();
    if (cellValue && cellValue instanceof Date) {
      lastDatetimeColumn = col;
    } else {
      break; // Stop if an empty cell or a non-date cell is encountered
    }
  }

  // Define the datetime and item ranges based on the discovered last datetime column
  var datetimeRange = sheet.getRange(2, 2, 1, lastDatetimeColumn - 1);
  var itemRanges = sheet.getRange(itemsStartRow, 2, itemsEndRow - itemsStartRow + 1, lastDatetimeColumn - 1);

  var datetimeValues = datetimeRange.getValues()[0]; // Extract the first (and only) row as an array.
  var itemValues = itemRanges.getValues(); // 2D array of item values.

  var dictionary = {}; // Initialize the dictionary.
  var now = new Date(); // Get the current date and time.

  // Iterate through each column in the datetime range.
  for (var i = 0; i < datetimeValues.length; i++) {
    var datetimeKey = datetimeValues[i]; // This is the datetime key.

    if (datetimeKey && datetimeKey instanceof Date && datetimeKey >= now) { // Check if the datetimeKey is in the future.
      var itemsList = []; // Initialize the list of items for this key.

      // Iterate through the rows for the current column to compile the items list.
      for (var j = 0; j < itemValues.length; j++) {
        var item = itemValues[j][i]; // Access the item in the current column and row.
        if (item) { // Ensure the item is not empty.
          itemsList.push(item); // Add the item to the list.
        }
      }

      // Since datetimeKey is confirmed to be a Date object, format it.
      var formattedKey = Utilities.formatDate(datetimeKey, Session.getScriptTimeZone(), "yyyy-MM-dd");
      dictionary[formattedKey] = itemsList;
    }
  }

  return dictionary; // Optional: return the dictionary for further processing.
}


function convertFormatToJson(eventName, category, location, inputDictionary) {
  var eventsArray = [];

  // Iterate over each key (date) in the input dictionary
  Object.keys(inputDictionary).forEach(function(date) {
    var names = inputDictionary[date];
    var lead = names[0]; // The first name in the list is the lead
    var members = names.slice(1); // The rest of the names are members

    // Construct the event object for this date
    var event = {
      date: date,
      events: [
        {
          name: eventName,
          categories: [
            {
              name: category,
              location: location,
              lead: lead,
              members: members
            }
          ]
        }
      ]
    };

    // Add the event object to the events array
    eventsArray.push(event);
  });

  return eventsArray;
}


function getSWSBreakfastInfo(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var dictionary = {};
  var dateRow = 11; // Row for dates
  var valueRow = 17; // Row for the first part of the value
  var listRow = 18; // Row for the comma-separated list
  var maxColumns = sheet.getLastColumn(); // Get the last column with data
  var now = new Date(); // Get the current date and time.

  // Iterate over each column starting from B (index 2)
  for (var col = 2; col <= maxColumns; col++) {
    var dateCell = sheet.getRange(dateRow, col).getValue();
    var dateKey = dateCell;
    if (dateCell instanceof Date) {
      // Optionally, format the date to a string if necessary
      dateKey = Utilities.formatDate(dateCell, Session.getScriptTimeZone(), "yyyy-MM-dd");
    } 

    // If the date cell is empty or date is in the past, skip to the next column
    if (!dateKey || dateCell < now) continue;

    var value = sheet.getRange(valueRow, col).getValue(); // Value from row 17
    var listValues = sheet.getRange(listRow, col).getValue().split(',').map(function(item) {
      return item.trim(); // Trim each item in the list from row 18
    });

    // Combine value from row 17 and the list from row 18 into a single list
    var combinedList = [value].concat(listValues);

    
    // Add to dictionary with the date as the key
    dictionary[dateKey] = combinedList;
  }

  return dictionary;
}

function getSWSLunchInfo(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var dictionary = {};
  var dateRow = 11; // Row for dates
  var valueRow = 17; // Row for the first part of the value
  var listRow = 18; // Row for the comma-separated list
  var maxColumns = sheet.getLastColumn(); // Get the last column with data
  var now = new Date(); // Get the current date and time.

  // Iterate over each column starting from B (index 2)
  for (var col = 2; col <= maxColumns; col++) {
    var dateCell = sheet.getRange(dateRow, col).getValue();
    var dateKey = dateCell;
    if (dateCell instanceof Date) {
      // Optionally, format the date to a string if necessary
      dateKey = Utilities.formatDate(dateCell, Session.getScriptTimeZone(), "yyyy-MM-dd");
    } 

    // If the date cell is empty or date is in the past, skip to the next column
    if (!dateKey || dateCell < now) continue;

    var value = sheet.getRange(valueRow, col).getValue(); // Value from row 17
    var listValues = sheet.getRange(listRow, col).getValue().split(',').map(function(item) {
      return item.trim(); // Trim each item in the list from row 18
    });

    // Combine value from row 17 and the list from row 18 into a single list
    var combinedList = [value].concat(listValues);

    
    // Add to dictionary with the date as the key
    dictionary[dateKey] = combinedList;
  }

  return dictionary;
}

function getSWSSoundInfo(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var dictionary = {};
  var dateRow = 11; // Row for dates
  var valueRow = 21; // Row for the first part of the value
  var listRows = [22, 23]; // Rows for individual list items
  var maxColumns = sheet.getLastColumn(); // Get the last column with data
  var now = new Date(); // Get the current date and time.

  // Iterate over each column starting from B (index 2)
  for (var col = 2; col <= maxColumns; col++) {
    var dateCell = sheet.getRange(dateRow, col).getValue();
    var dateKey = dateCell;
    if (dateCell instanceof Date) {
      // Optionally, format the date to a string if necessary
      dateKey = Utilities.formatDate(dateCell, Session.getScriptTimeZone(), "yyyy-MM-dd");
    }

    // If the date cell is empty or the date is in the past, skip to the next column
    if (!dateKey || dateCell < now) continue;

    var value = sheet.getRange(valueRow, col).getValue(); // Value from the specified valueRow
    var listValues = listRows.map(function(row) {
      // Grab and trim the value from each specified row
      return sheet.getRange(row, col).getValue().trim();
    }).filter(function(item) {
      // Optionally filter out empty strings if some rows may not always have a value
      return item !== "";
    });

    // Combine the value from valueRow and the values from listRows into a single list
    var combinedList = [value].concat(listValues);

    // Add to dictionary with the date as the key
    dictionary[dateKey] = combinedList;
  }

  return dictionary;
}

function getSWSLightingInfo(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var dictionary = {};
  var dateRow = 11; // Row for dates
  var valueRow = 28; // Row for the first part of the value
  var listRows = [29]; // Rows for individual list items
  var maxColumns = sheet.getLastColumn(); // Get the last column with data
  var now = new Date(); // Get the current date and time.

  // Iterate over each column starting from B (index 2)
  for (var col = 2; col <= maxColumns; col++) {
    var dateCell = sheet.getRange(dateRow, col).getValue();
    var dateKey = dateCell;
    if (dateCell instanceof Date) {
      // Optionally, format the date to a string if necessary
      dateKey = Utilities.formatDate(dateCell, Session.getScriptTimeZone(), "yyyy-MM-dd");
    }

    // If the date cell is empty or the date is in the past, skip to the next column
    if (!dateKey || dateCell < now) continue;

    var value = sheet.getRange(valueRow, col).getValue(); // Value from the specified valueRow
    var listValues = listRows.map(function(row) {
      // Grab and trim the value from each specified row
      return sheet.getRange(row, col).getValue().trim();
    }).filter(function(item) {
      // Optionally filter out empty strings if some rows may not always have a value
      return item !== "";
    });

    // Combine the value from valueRow and the values from listRows into a single list
    var combinedList = [value].concat(listValues);

    // Add to dictionary with the date as the key
    dictionary[dateKey] = combinedList;
  }

  return dictionary;
}

function getSWSVideoInfo(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var dictionary = {};
  var dateRow = 11; // Row for dates
  var valueRow = 26; // Row for the first part of the value
  var listRows = [24, 25, 27, 30, 31]; // Rows for individual list items
  var categoryColumn = 1; // Assuming column A is the category column
  var maxColumns = sheet.getLastColumn(); // Get the last column with data
  var now = new Date(); // Get the current date and time.

  // Iterate over each column starting from B (index 2)
  for (var col = 2; col <= maxColumns; col++) {
    var dateCell = sheet.getRange(dateRow, col).getValue();
    var dateKey = dateCell;
    if (dateCell instanceof Date) {
      // Optionally, format the date to a string if necessary
      dateKey = Utilities.formatDate(dateCell, Session.getScriptTimeZone(), "yyyy-MM-dd");
    }

    // If the date cell is empty or the date is in the past, skip to the next column
    if (!dateKey || dateCell < now) continue;

    var initialValue = sheet.getRange(valueRow, col).getValue().trim();
    var categoryValue = sheet.getRange(valueRow, categoryColumn).getValue().trim();
    var value = initialValue ? `${initialValue} (${categoryValue})` : "";

    var listValues = listRows.map(function(row) {
      var itemValue = sheet.getRange(row, col).getValue().trim();
      var categoryForRow = sheet.getRange(row, categoryColumn).getValue().trim();
      // Only append category if there's a value
      return itemValue ? `${itemValue} (${categoryForRow})` : "";
    }).filter(function(item) {
      // Filter out empty strings
      return item !== "";
    });

    // Only add the initial value and category if there was an initial value
    var combinedList = initialValue ? [value].concat(listValues) : listValues;

    // If there's no value at all (initial or list), skip adding this date to the dictionary
    if (combinedList.length > 0) {
      dictionary[dateKey] = combinedList;
    }
  }

  return dictionary;
}

function getSWSGeneralTechInfo(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var dictionary = {};
  var dateRow = 11; // Row for dates
  var valueRow = 20; // Row for the first part of the value
  var listRows = [32, 33, 34, 35]; // Rows for individual list items
  var categoryColumn = 1; // Assuming column A is the category column
  var maxColumns = sheet.getLastColumn(); // Get the last column with data
  var now = new Date(); // Get the current date and time.

  // Iterate over each column starting from B (index 2)
  for (var col = 2; col <= maxColumns; col++) {
    var dateCell = sheet.getRange(dateRow, col).getValue();
    var dateKey = dateCell;
    if (dateCell instanceof Date) {
      // Optionally, format the date to a string if necessary
      dateKey = Utilities.formatDate(dateCell, Session.getScriptTimeZone(), "yyyy-MM-dd");
    }

    // If the date cell is empty or the date is in the past, skip to the next column
    if (!dateKey || dateCell < now) continue;

    var initialValue = sheet.getRange(valueRow, col).getValue().trim();
    var categoryValue = sheet.getRange(valueRow, categoryColumn).getValue().trim();
    var value = initialValue ? `${initialValue} (${categoryValue})` : "";

    var listValues = listRows.map(function(row) {
      var itemValue = sheet.getRange(row, col).getValue().trim();
      var categoryForRow = sheet.getRange(row, categoryColumn).getValue().trim();
      // Only append category if there's a value
      return itemValue ? `${itemValue} (${categoryForRow})` : "";
    }).filter(function(item) {
      // Filter out empty strings
      return item !== "";
    });

    // Only add the initial value and category if there was an initial value
    var combinedList = initialValue ? [value].concat(listValues) : listValues;

    // If there's no value at all (initial or list), skip adding this date to the dictionary
    if (combinedList.length > 0) {
      dictionary[dateKey] = combinedList;
    }
  }

  return dictionary;
}

function getSWSMiscTechInfo(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var dictionary = {};
  var dateRow = 11; // Row for dates
  var valueRow = 36; // Row for the first part of the value
  var listRows = [37, 38, 39, 40, 41, 42, 43]; // Rows for individual list items
  var categoryColumn = 1; // Assuming column A is the category column
  var maxColumns = sheet.getLastColumn(); // Get the last column with data
  var now = new Date(); // Get the current date and time.

  // Iterate over each column starting from B (index 2)
  for (var col = 2; col <= maxColumns; col++) {
    var dateCell = sheet.getRange(dateRow, col).getValue();
    var dateKey = dateCell;
    if (dateCell instanceof Date) {
      // Optionally, format the date to a string if necessary
      dateKey = Utilities.formatDate(dateCell, Session.getScriptTimeZone(), "yyyy-MM-dd");
    }

    // If the date cell is empty or the date is in the past, skip to the next column
    if (!dateKey || dateCell < now) continue;

    var initialValue = sheet.getRange(valueRow, col).getValue().trim();
    var categoryValue = sheet.getRange(valueRow, categoryColumn).getValue().trim();
    var value = initialValue ? `${initialValue} (${categoryValue})` : "";

    var listValues = listRows.map(function(row) {
      var itemValue = sheet.getRange(row, col).getValue().trim();
      var categoryForRow = sheet.getRange(row, categoryColumn).getValue().trim();
      // Only append category if there's a value
      return itemValue ? `${itemValue} (${categoryForRow})` : "";
    }).filter(function(item) {
      // Filter out empty strings
      return item !== "";
    });

    // Only add the initial value and category if there was an initial value
    var combinedList = initialValue ? [value].concat(listValues) : listValues;

    // If there's no value at all (initial or list), skip adding this date to the dictionary
    if (combinedList.length > 0) {
      dictionary[dateKey] = combinedList;
    }
  }

  return dictionary;
}

function getSWSAdditionalInfo(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var dictionary = {};
  var dateRow = 11; // Row for dates
  var valueRow = 45; // Row for the first part of the value
  var listRows = [46, 47, 48, 49, 50, 51, 52, 53]; // Rows for individual list items
  var categoryColumn = 1; // Assuming column A is the category column
  var maxColumns = sheet.getLastColumn(); // Get the last column with data
  var now = new Date(); // Get the current date and time.

  // Iterate over each column starting from B (index 2)
  for (var col = 2; col <= maxColumns; col++) {
    var dateCell = sheet.getRange(dateRow, col).getValue();
    var dateKey = dateCell;
    if (dateCell instanceof Date) {
      // Optionally, format the date to a string if necessary
      dateKey = Utilities.formatDate(dateCell, Session.getScriptTimeZone(), "yyyy-MM-dd");
    }

    // If the date cell is empty or the date is in the past, skip to the next column
    if (!dateKey || dateCell < now) continue;

    var initialValue = sheet.getRange(valueRow, col).getValue().trim();
    var categoryValue = sheet.getRange(valueRow, categoryColumn).getValue().trim();
    var value = initialValue ? `${initialValue} (${categoryValue})` : "";

    var listValues = listRows.map(function(row) {
      var itemValue = sheet.getRange(row, col).getValue().trim();
      var categoryForRow = sheet.getRange(row, categoryColumn).getValue().trim();
      // Only append category if there's a value
      return itemValue ? `${itemValue} (${categoryForRow})` : "";
    }).filter(function(item) {
      // Filter out empty strings
      return item !== "";
    });

    // Only add the initial value and category if there was an initial value
    var combinedList = initialValue ? [value].concat(listValues) : listValues;

    // If there's no value at all (initial or list), skip adding this date to the dictionary
    if (combinedList.length > 0) {
      dictionary[dateKey] = combinedList;
    }
  }

  return dictionary;
}