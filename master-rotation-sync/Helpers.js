function clearSheetByName(sheetName) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet(); // Get the active spreadsheet
    var sheet = spreadsheet.getSheetByName(sheetName); // Try to get the sheet by name
  
    if (sheet) {
      // If the sheet exists, clear it
      sheet.clear();
      Logger.log(sheetName + " has been cleared.");
    } else {
      // If the sheet doesn't exist, log a message
      Logger.log("Sheet named '" + sheetName + "' does not exist.");
    }
  }
  
  function hideColumnsToRightOfLetter(sheet, columnLetter) {
    var lastColumn = sheet.getMaxColumns(); // Get the total number of columns in the sheet
    var columnNum = columnLetter.charCodeAt(0) - 'A'.charCodeAt(0) + 1; // Convert column letter to column number
    
    if (columnNum < lastColumn) {
      // Hide columns from the one immediately after 'columnNum' to the last column in the sheet
      sheet.hideColumns(columnNum + 1, lastColumn - columnNum);
    }
  }
  
  function hideColumnsBeyondKByName(sheetName) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName); // Get the active sheet
    var totalColumns = sheet.getMaxColumns(); // Get the total number of columns in the sheet
    
    // Column "L" is the 12th column (A=1, B=2, ..., K=11, L=12)
    var startColumnToHide = 12; // Start hiding from column L
    
    // Calculate the number of columns to hide (total columns - first 11 columns)
    var numColumnsToHide = totalColumns - startColumnToHide + 1;
    
    if (numColumnsToHide > 0) {
      // If there are more than 11 columns, then hide columns starting from L
      sheet.hideColumns(startColumnToHide, numColumnsToHide);
    }
  }
  
  function getCellBackgroundColor(sheetName) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName); // Get the active sheet
    var cell = sheet.getRange("B8"); // Specify the cell you're interested in
    var hexColor = cell.getBackground(); // Get the background color of the cell
    
    Logger.log(hexColor); // Log the hex color code to the Google Apps Script log
    return hexColor; // Return the hex color code
  }
  
  function getSheetNamesWithSubstring(substring) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var allSheets = spreadsheet.getSheets();
    var matchingSheetNames = [];
  
    // Loop through all sheets and check if their names include the substring
    for (var i = 0; i < allSheets.length; i++) {
      var sheetName = allSheets[i].getName();
      if (sheetName.includes(substring)) {
        matchingSheetNames.push(sheetName);
      }
    }
  
    return matchingSheetNames;
  }
  
  /**
   * Gets a list of sheet names that contain a specified substring, case-insensitively.
   *
   * @param {string} substring The substring to search for in sheet names, case-insensitively.
   * @return {Array} An array of sheet names that contain the substring, regardless of case.
   */
  function getSheetsBySubstring(substring) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var allSheets = spreadsheet.getSheets();
    var matchingSheetNames = [];
    var lowerCaseSubstring = substring.toLowerCase(); // Convert the substring to lower case for case-insensitive comparison
  
    // Loop through all sheets and check if their names include the substring, case-insensitively
    for (var i = 0; i < allSheets.length; i++) {
      var sheetName = allSheets[i].getName().toLowerCase(); // Convert sheet name to lower case
      if (sheetName.includes(lowerCaseSubstring)) {
        matchingSheetNames.push(allSheets[i].getName()); // Store the original sheet name
      }
    }
  
    return matchingSheetNames;
  }
  
  function getDayName(date) {
    var dateObj = new Date(date);
    var dayName = dateObj.toLocaleDateString("en-US", { weekday: 'long' });
    return dayName;
  }