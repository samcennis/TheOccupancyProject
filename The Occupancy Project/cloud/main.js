require('cloud/app.js');

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


// Function to append more data to a SensorReading before it is saved to the server
Parse.Cloud.beforeSave('SensorReading', function(request, response) { 
  
    var sensorReading = request.object;
    
    // Determine if lights are on based on the raw photoresistor value
    // TODO: Determine the threshold from a look up table in the database
    if (parseInt(sensorReading.get("lightsRaw")) > 50 ){
        sensorReading.set("lightsOn", true);
    }
    else{
        sensorReading.set("lightsOn", false);   
    }
    
    response.success();
});