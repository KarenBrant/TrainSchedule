function getGifs() {
  // var eachGif = $(this).attr("data-name");
  // console.log("eachGif: " + eachGif);
  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=Fa70mFCWf8G52I9zVzhUHWRb20hnGjjM&limit=10&q=train&rating=G";

  $.ajax( {
      url: queryURL,
      method: "GET"
    }).then(function(response) { 
        var gifs = response.data;
        console.log(gifs);
        for (var i=0; i<gifs.length;i++) {
          var gif = gifs[i];
                // Create variables for animated gifs and still gifs
                var animated = gifs.images.downsized.url;
                // Create the still gifs and add the rating to the html
                if(i=2) {
                  var el = $('<div class="image" style="background-image: url(' + animated + ')"></div>');
                  $('#gif-train').append(el);
                }
        }
    });
  }
// getGifs();


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
      // Grabbed values from text boxes
      trName = $("#train-name").val().trim();
      console.log ("Train name from text: " + trName);
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

    // Firebase watcher + initial loader + order/limit HINT: .on("child_added"
  //database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
    database.ref().orderByChild("dateAdded").on("child_added", function(snapshot){
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();
        tFreq = parseInt(sv.trFreq);
        console.log("Frequency: " + tFreq);

        // var convertedTime = moment(sv.trTime, 'HH:mm');
        // console.log("Military Time: " + convertedTime);
        // var convTime = convertedTime.unix();
        var curTime = moment();
        var firstTimeConverted = moment(sv.trTime, "HH:mm").subtract(1, "years");
        console.log("Current Time: " + curTime);

        var newTime = moment().diff(moment(firstTimeConverted), "minutes");
        // var newMin = moment().minute(newTime);
        // console.log("New Minutes: " + newMin);

        // if(newMin<sv.trFreq) {
        //   minAway = newMin;
        // } else {
        //   var next = Math.floor(newMin/sv.trFreq);
        var remainder = newTime%tFreq;
        var minAway = tFreq - remainder;
        var nextTr = moment().add(minAway, "minutes");
        var nextTrTime = moment(nextTr).format("hh:mm");
    
        console.log ("Minutes away: " + minAway);
        
        //   console.log("Division: " + next);
        //   console.log("Remainder: " + remainder);
        // }
        // Console.loging the last user's data
        //snapStartDate = new Date(sv.startDate);
  
        //months = Math.floor((new Date() - snapStartDate)  / (60*1000*60*24*30))
        
        //console.log("SnapStartDate: " + snapStartDate);
    
        // Change the HTML to reflect
        // $("tbody").text(sv.name);
        // $("").text(sv.role);
        // $("").text(sv.startDate);
        // $("").text(sv.monthlyRate);
        $('tbody').append(`<tr><td class="text-center">${sv.trName}</td><td class="text-center">${sv.dest}</td>
        <td class="text-center">${tFreq}</td><td class="text-center">${nextTrTime}</td><td class="text-center">${minAway}</td></tr>`);
    
        // Handle the errors
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
        
      });