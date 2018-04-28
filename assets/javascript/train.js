/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains- then update the html + update the database
// 3. Create a way to retrieve trains from the train scheduler database.
// 4. Create a way to calculate when the next train will arrive; this should be relative to the current time.
// 5. Users from many different machines must be able to view same train times.

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyCx-8jXPZzvtoCNx9NKl_wwGeazvTGYvgg",
    authDomain: "train-scheduler-148c9.firebaseapp.com",
    databaseURL: "https://train-scheduler-148c9.firebaseio.com",
    projectId: "train-scheduler-148c9",
    storageBucket: "",
    messagingSenderId: "524509369820"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Employees
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var arrTime = moment($("#train-time-input").val().trim(), "HH:mm").format("HH:mm"); //need to come back to this and 
    //find out for moment.js, how to format to miliary time. subtract(1, "years")
    console.log(arrTime);
    var frequency = $("#frequency-input").val().trim();

    //testing to make sure the moment.js is working properly
    // console.log(arrTime);
    // Creates local "temporary" object for holding train data
    console.log(arrTime)
    var newTrain = {
        train: trainName,
        destino: destination,
        arrivalTime: arrTime,
        freq: frequency,
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.train);
    console.log(newTrain.destino);
    console.log(newTrain.arrivalTime);
    console.log(newTrain.freq);

    // Alert
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#train-time-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

//     console.log(childSnapshot.val());

//     // Store everything into a variable.
    var trainName = childSnapshot.val().train;
    var destination = childSnapshot.val().destino;
    var arrTime = childSnapshot.val().arrivalTime;
    var frequency = childSnapshot.val().freq;
    var minAway = minutesAwayFunction(frequency,arrTime)
    console.log(minAway)

    var nextTrain = moment().add(minAway, "minutes").format("hh:mm");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    console.log(nextTrain)
    // var timeDifference = moment().diff(moment.unix(arrTime), "minutes");
    // var remainingTime = moment().diff(moment.unix(arrTime), "minutes") % frequency;
    // var minAway = frequency - remainingTime;

    // var nextTrainArr = moment().add(minutes, "m").format("hh:mm A");

    // console.log(timeDifference);
    // console.log(nextTrainArr);

    // // Current Time
    // var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // // Difference between the times
    // var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // // Time apart (remainder)
    // var tRemainder = diffTime % tFrequency;
    // console.log(tRemainder);

    // // Minute Until Train
    // var tMinutesTillTrain = tFrequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // // Next Train
    // var arrivalTime = moment().add(tMinutesTillTrain, "minutes");
    // console.log("ARRIVAL TIME: " + moment(arrivalTime).format("hh:mm"));

// Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
        frequency +  "</td><td>" + nextTrain + "</td><td>" + minAway + "</td></tr>");
        
        
});

function minutesAwayFunction (tFrequency, firstTime){


 // First Time (pushed back 1 year to make sure it comes before current time)
 var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
 console.log(firstTimeConverted);

 // Current Time
 var currentTime = moment();
 console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

 // Difference between the times
 var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
 console.log("DIFFERENCE IN TIME: " + diffTime);

 // Time apart (remainder)
 var tRemainder = diffTime % tFrequency;
 console.log(tRemainder);

 // Minute Until Train
 var tMinutesTillTrain = tFrequency - tRemainder;
 console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

 return tMinutesTillTrain;
};
 