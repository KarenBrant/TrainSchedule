
var database = firebase.database();

// Initial Values
var trName = "";
var dest = "";
var trTime;
var trFreq;

// Capture Button Click
$("#train-submit").on("click", function(event) {
  event.preventDefault();
  console.log("submitted");
  // Grabbed values from input boxes
  trName = $("#train-name").val().trim();
  dest = $("#destination").val().trim();
  trTime = $("#train-time").val();
  trFreq = $("#train-freq").val();

  // Code for handling the push
  lastPushed = database.ref().push({
    trName: trName,
    dest: dest,
    trTime: trTime,
    trFreq: trFreq,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

// Capture the firebase values
database.ref().orderByChild("dateAdded").on("child_added", function(snapshot){
  // storing the snapshot.val() in a variable for convenience
  var sv = snapshot.val();
  tFreq = parseInt(sv.trFreq);
  console.log("Frequency: " + tFreq);
  // Set current time and get the train time
  var curTime = moment();
  var firstTimeConverted = moment(sv.trTime, "HH:mm")
  console.log("Current Time: " + curTime);
  // Get the difference between the train time and the current time
  var newTime = moment().diff(moment(firstTimeConverted), "minutes");
  // Figure out if the difference is less than or greater than the frequency
  // If the difference is less than the frequency, then the difference equals the time remaining before 
  // the next train.
  // If the difference is greater than the frequency, then the remainder of the difference/frequency
  // is subtracted from the frequency.
  if(newTime<sv.trFreq) {
    minAway = newTime;
  } else {
    var remainder = newTime%tFreq;
    var minAway = tFreq - remainder;
  }
  var nextTr = moment().add(minAway, "minutes");
  var nextTrTime = moment(nextTr).format("hh:mm");
  console.log ("Minutes away: " + minAway);
  // Add the body to the table
  $('tbody').append(`<tr><td class="text-center">${sv.trName}</td><td class="text-center">${sv.dest}</td>
  <td class="text-center">${tFreq}</td><td class="text-center">${nextTrTime}</td><td class="text-center">${minAway}</td></tr>`);
    
  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });