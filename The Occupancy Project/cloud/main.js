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

// Function to update the RoomSummary for the sensor's room after the SensorReading is saved to the server
Parse.Cloud.afterSave('SensorReading', function(request) {
   
    var MAC_to_RmID = Parse.Object.extend("MACAddr_RmID_Mapping");
    var sensorReading = request.object;
    var mac = sensorReading.get("MACAddress");
    
    var mapQuery = new Parse.Query(MAC_to_RmID);
	mapQuery.equalTo("MACAddr", mac);
	mapQuery.first({
		success: function(map) {
			if (!map) {
				alert("Map query error: No MAC to Room ID map found for this MAC address.");
			}
            
            var RoomSummary = Parse.Object.extend("RoomSummary");
			roomQuery = new Parse.Query(RoomSummary);
            var roomID = map.get("RoomId");

            roomQuery.get( roomID, {
                success: function(roomSummary){
                    roomSummary.set("occupied", sensorReading.get("occupied"));
                    roomSummary.set("lightsOn", sensorReading.get("lightsOn"));
                    roomSummary.save();
                    
                    //TODO: Add the new SensorReading to RoomHistory, because this current sensor reading will be deleted up the next ping from a sensor                  
                },
                error: function(object, error){
                    alert("RoomSummary query error for roomID: " + roomID + " " + error.code + " " + error.message);
                }
                
            });
            
		},
		error: function(error) {

			// Error performing the initial query. Report error to client.
			alert("Query error: " + error.code + " " + error.message);
		}
	});
    
});