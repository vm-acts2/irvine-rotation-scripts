function run() {

  clearSheetByName("Weekly Rotation - Autogenerated");
  outputSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Weekly Rotation - Autogenerated");
  hideColumnsToRightOfLetter(outputSheet, "Q");

  outputJsonObjects = []

  // SWS Praise Object Generation
  praiseInfoDict = getSWSPraiseInfo("Praise Rotation - Mirrored");
  praiseInfoJson = convertFormatToJson("SWS", "Praise", "DCE", praiseInfoDict);
  outputJsonObjects.push(praiseInfoJson);

  swsSheets = getSheetsBySubstring("IRV SWS");
  console.log(swsSheets)

  for (const swsSheet of swsSheets) {

    // SWS General Tech Object Generation
    swsGeneralTechDict = getSWSGeneralTechInfo(swsSheet);
    swsGeneralTechJson = convertFormatToJson("SWS", "General", "DCE", swsGeneralTechDict); 
    outputJsonObjects.push(swsGeneralTechJson);

    // SWS Sound Object Generation
    swsSoundInfoDict = getSWSSoundInfo(swsSheet);
    swsSoundInfoJson = convertFormatToJson("SWS", "Sound", "DCE", swsSoundInfoDict); 
    outputJsonObjects.push(swsSoundInfoJson);

    // SWS Lighting Object Generation
    swsLightingInfoDict = getSWSLightingInfo(swsSheet);
    swsLightingInfoJson = convertFormatToJson("SWS", "Lighting", "DCE", swsLightingInfoDict); 
    outputJsonObjects.push(swsLightingInfoJson);

    // SWS Video Object Generation
    swsVideoInfoDict = getSWSVideoInfo(swsSheet);
    swsVideoInfoJson = convertFormatToJson("SWS", "Video", "DCE", swsVideoInfoDict); 
    outputJsonObjects.push(swsVideoInfoJson);

    // SWS Breakfast Object Generation
    swsBreakfastInfoDict = getSWSBreakfastInfo(swsSheet);
    swsBreakfastInfoJson = convertFormatToJson("SWS", "Breakfast", "DCE", swsBreakfastInfoDict);
    outputJsonObjects.push(swsBreakfastInfoJson);

    // SWS Lunch Object Generation
    swsLunchInfoDict = getSWSLunchInfo(swsSheet);
    swsLunchInfoJson = convertFormatToJson("SWS", "Lunch", "DCE", swsLunchInfoDict); 
    outputJsonObjects.push(swsLunchInfoJson);

    // SWS Misc. Tech Object Generation
    swsMiscTechInfoDict = getSWSMiscTechInfo(swsSheet);
    swsMiscTechInfoJson = convertFormatToJson("SWS", "Misc. Tech", "DCE", swsMiscTechInfoDict); 
    outputJsonObjects.push(swsMiscTechInfoJson);

    // SWS Additional Object Generation
    swsAdditionalInfoDict = getSWSAdditionalInfo(swsSheet);
    swsAdditionalInfoJson = convertFormatToJson("SWS", "Additional Roles", "DCE", swsAdditionalInfoDict); 
    outputJsonObjects.push(swsAdditionalInfoJson);
  }

  // Food Rotation Object Generation
  foodInfoJson = getFoodInfo("Food Rotations", 14);
  outputJsonObjects.push(foodInfoJson)

  // Tech Rotation Object Generation
  techInfoJson = getTechInfo("Tech Team Rotation", 33);
  console.log(JSON.stringify(techInfoJson, null, 4))
  outputJsonObjects.push(techInfoJson)

  masterJsonOutput = mergeJsonOutputs(outputJsonObjects);
  buildMasterRotationFromJsonData(outputSheet, masterJsonOutput);

  // OUTPUT TESTING!!
//   var sampleRotationOutputString = `[
//     {
//         "date": "2023.02.11",
//         "events": [
//             {
//                 "name": "SWS",
//                 "categories": [
//                     {
//                         "name": "Praise",
//                         "location": "DCE",
//                         "lead": "Jermaine Zhang",
//                         "members": [
//                             "Chris Shokunbi",
//                             "Kevin Wong",
//                             "Jonathan Allsman",
//                             "Mary Zhuang",
//                             "Luke Ren"
//                         ]
//                     }
//                 ]
//             }
//         ]
//     }
// ]`;

//   sampleRotationOutputJson = JSON.parse(sampleRotationOutputString);
}

function mergeJsonOutputs(lists) {
  var eventsByDate = new Map();

  lists.forEach(list => {
    list.forEach(item => {
      var dateKey = item.date;
      
      item.events.forEach(event => {
        // Create a composite key for unique events by date and name
        var eventKey = dateKey + '|' + event.name;
        
        if (!eventsByDate.has(dateKey)) {
          eventsByDate.set(dateKey, { date: item.date, events: new Map() });
        }
        
        var eventsOnDate = eventsByDate.get(dateKey).events;
        if (!eventsOnDate.has(eventKey)) {
          // Initialize with the event structure, including an empty categories array if needed
          eventsOnDate.set(eventKey, { name: event.name, categories: [] });
        }
        
        // Now, merge categories for the same event
        var existingEvent = eventsOnDate.get(eventKey);
        event.categories.forEach(category => {
          var existingCategory = existingEvent.categories.find(c => c.name === category.name);
          if (existingCategory) {
            // Optionally merge details within the same category, like members
            existingCategory.members = [...new Set([...existingCategory.members, ...category.members])];
          } else {
            existingEvent.categories.push(category);
          }
        });
      });
    });
  });

  // Convert the map structures back into arrays
  var mergedList = Array.from(eventsByDate, ([, {date, events}]) => ({
    date: date,
    events: Array.from(events, ([, event]) => event)
  }));

  // Optional: Sort the merged list by date
  mergedList.sort((a, b) => new Date(a.date) - new Date(b.date));

  return mergedList;
}

function buildMasterRotationFromJsonData(outputSheet, rotationOutputJson) {
  currentRow = 2
  populateHeaders(outputSheet, currentRow);
  currentRow += 1; 
  
  // Iterate over each item in the array
  for (var i = 0; i < rotationOutputJson.length; i++) {
    var dayEvents = rotationOutputJson[i];
    populateDateHeader(outputSheet, currentRow, dayEvents.date);
    currentRow += 1;
    
    // Iterate over each event in the events array
    for (var j = 0; j < dayEvents.events.length; j++) {
      var event = dayEvents.events[j];
      
      populateEventHeader(outputSheet, currentRow, event.name);
      currentRow += 1;
      
      // Iterate over each category in the categories array
      for (var k = 0; k < event.categories.length; k++) {
        var category = event.categories[k];
        populateEvent(outputSheet, currentRow, category.name, category.location, category.lead, category.members)
        currentRow += 1
      } 
    }
  }
}