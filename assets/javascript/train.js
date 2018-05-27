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
    storageBucket: "train-scheduler-148c9.appspot.com",
    messagingSenderId: "524509369820"
  };

  firebase.initializeApp(config);

var database = firebase.database();

$('#addTrainBtn').on('click', function (event) {

    event.preventDefault();

    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = moment($("#firstTrainInput").val().trim(), "HH:mm").subtract(10, "years").format("X");
    var frequency = $("#frequencyInput").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    }

    //uploads to the firstbase database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    alert("Train Added!");

    //clears text boxes
    $('#trainNameInput').val("");
    $('#destinationInput').val("");
    $('#firstTrainInput').val("");
    $('#frequencyInput').val("");

});

database.ref().on('child_added', function (snapshot) {
    var name = snapshot.val().name;
    var destination = snapshot.val().destination;
    var frequency = snapshot.val().frequency;
    var firstTrain = snapshot.val().firstTrain;

    var remainder = moment().diff(moment.unix(firstTrain), "minutes") % frequency;
    var minutes = frequency - remainder;
    var arrival = moment().add(minutes, "m").format("hh:mm A")

    console.log(remainder);
    console.log(minutes);
    console.log(arrival);

    $("#trainTable > tBody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + arrival + "</td><td>"
    + minutes + "</td></tr>")
});
