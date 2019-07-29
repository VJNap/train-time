// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAnH_GhkfH1DW00XTqLpifySd4uCqq3p54",
    authDomain: "train-time-6654f.firebaseapp.com",
    databaseURL: "https://train-time-6654f.firebaseio.com",
    projectId: "train-time-6654f",
    storageBucket: "",
    messagingSenderId: "212035944697",
    appId: "1:212035944697:web:821480dd71dd941c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// Add trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    var newTrain = {}

    // User input variables
    newTrain.trainName = $("#train-name-input").val().trim();
    newTrain.trainDest = $("#destination-input").val().trim();
    newTrain.trainTime = $("#firstTime-input").val().trim();
    newTrain.trainFrequency = $("#frequency-input").val().trim();
    // if empty - return
    database.ref().push(newTrain);
    // empty fields on click
});

// Update row on firebase update
database.ref().on("child_added", function (snap) {
    var trainName = snap.val().trainName;
    var trainDest = snap.val().trainDest;
    var trainTime = snap.val().trainTime;
    var trainFrequency = snap.val().trainFrequency;
    console.log(trainTime);

    // First Time (pushed back 1 year to make sure it comes before current time)
    //    var trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
    var hourTime = trainTime.split(":")[0]
    var minuteTime = trainTime.split(":")[1]
    var trainTimeConverted = moment().hours(hourTime).minutes(minuteTime);
    console.log(trainTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var trainRemainder = diffTime % trainFrequency;
    console.log(trainRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFrequency - trainRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");
    console.log("ARRIVAL TIME: " + nextTrain);

    var newTr = $("<tr>")
    newTr.append(`<td>${trainName}</td>`);
    newTr.append(`<td>${trainDest}</td>`);
    newTr.append(`<td>${trainFrequency}</td>`);
    newTr.append(`<td>${nextTrain}</td>`);
    newTr.append(`<td>${tMinutesTillTrain}</td>`);
    $("tbody").append(newTr);
});

// Assume the following situations.

// (TEST 1)
// First Train of the Day is 3:00 AM
// Assume Train comes every 3 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:18 -- 2 minutes away

// (TEST 2)
// First Train of the Day is 3:00 AM
// Assume Train comes every 7 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:21 -- 5 minutes away


// ==========================================================

// Solved Mathematically
// Test case 1:
// 16 - 00 = 16
// 16 % 3 = 1 (Modulus is the remainder)
// 3 - 1 = 2 minutes away
// 2 + 3:16 = 3:18

// Solved Mathematically
// Test case 2:
// 16 - 00 = 16
// 16 % 7 = 2 (Modulus is the remainder)
// 7 - 2 = 5 minutes away
// 5 + 3:16 = 3:21

