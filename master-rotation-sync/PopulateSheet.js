function populateHeaders(sheet, row) {
    headers = [["Category", 
                "Location", 
                "Lead", 
                "Member 1", 
                "Member 2", 
                "Member 3", 
                "Member 4", 
                "Member 5", 
                "Member 6", 
                "Member 7", 
                "Member 8",
                "Member 9",
                "Member 10",
                "Notes"]];
  
    var headerRange = sheet.getRange(`C${row}:O${row}`);
    headerRange.setValues(headers);
    headerRange.setBackground("#b3d9ff");
    headerRange.setBorder(true, true, true, true, true, true, "#000000", SpreadsheetApp.BorderStyle.SOLID_LIGHT);
    headerRange.setFontWeight("bold");
  }
  
  function populateDateHeader(sheet, row, date) {
    var range = sheet.getRange(`C${row}:AT${row}`); // Define the range for styling and text
  
    var dayName = getDayName(date);
    
    // Set the background color of the range to gold
    range.setBackground("#FFD700"); // Gold color hex code
    
    // Merge the cells across the specified range
    range.mergeAcross();
  
    range.setNumberFormat("MM/dd/yyyy");
    
    // Set the text for the merged cell
    range.setValue(dayName + " " + date);
    
    // Center the text horizontally
    range.setHorizontalAlignment("center");
    
    // Optional: Center the text vertically if desired
    range.setVerticalAlignment("middle");
    
    range.setBorder(true, true, true, true, true, true, "#000000", SpreadsheetApp.BorderStyle.SOLID_LIGHT);
  
    // Optional: Set the text to bold if required
    range.setFontWeight("bold");
  }
  
  function populateEventHeader(sheet, row, event) {
    var range = sheet.getRange(`C${row}:AT${row}`); // Define the range for styling and text
    
    // Set the background color of the range to gold
    range.setBackground("#A4C2F4"); // Kinda blue color hex code
    
    // Merge the cells across the specified range
    range.mergeAcross();
    
    // Set the text for the merged cell
    range.setValue(event);
    
    // Center the text horizontally
    range.setHorizontalAlignment("left");
    
    range.setBorder(true, true, true, true, true, true, "#000000", SpreadsheetApp.BorderStyle.SOLID_LIGHT);
  
    // Optional: Set the text to bold if required
    range.setFontWeight("bold");
  }
    
  function populateEvent(sheet, row, category, location, lead, members) {
    // Set category, location, and lead
    sheet.getRange(row, 3).setValue(category);
    sheet.getRange(row, 4).setValue(location);
    sheet.getRange(row, 5).setValue(lead);
  
    // Check if there are members to add
    if (members.length > 0) {
      // If members exist, set their values starting from the 4th column
      var range = sheet.getRange(row, 6, 1, members.length);
      range.setValues([members]); // setValues requires a 2D array
    }
    // Optionally, clear any existing values if members are empty and you're updating a row
    else {
      // Assuming a maximum number of members to clear out old data. Adjust as necessary.
      var maxMembers = 10; // Adjust based on the maximum expected number of members
      sheet.getRange(row, 6, 1, maxMembers).clearContent();
    }
  }