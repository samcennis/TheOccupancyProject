require('cloud/app.js');

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


Parse.Cloud.define("dummySensorPing", function(request, response) {
    var address = request.params.MACAddress;
	var state = request.params.occupied;
    var lightsRaw = request.params.lightsRaw;
    
    var Sensor = Parse.Object.extend("SensorReading");
	// Look up the sensor object in the Sensor table.
	var query = new Parse.Query(Sensor);
	query.equalTo("MACAddress", address);
	query.first({
		success: function(sensor) {
			
            
			// If the Sensor for the requested identifier is not found. Create a new object.
			if (!sensor) {
				var sensor = new Sensor();
				sensor.set('MACAddress', address);
			}
			
			// Set the requested state for the sensor.
			sensor.set('occupied', state);
            sensor.set('lightsRaw', lightsRaw);

			// Save the (new) sensor with updated state.
			sensor.save(null, {
				success: function (sensor) {
					// The object was saved successfully
					response.success("Object saved with ID: " + sensor.id);
				},
				error: function () {
					// Error saving the sensor object. Report error to client.
					response.error("Sensor save error.");
				}
			});
		},
		error: function(error) {

			// Error performing the initial query. Report error to client.
			respond.error("Query error: " + error.code + " " + error.message);
		}
	});
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
            
            var RoomSummary = Parse.Object.extend("Room");
            
			roomQuery = new Parse.Query(RoomSummary);
            var roomID = map.get("RoomId");

            roomQuery.get( roomID, {
                success: function(roomSummary){
                    roomSummary.set("occupied", sensorReading.get("occupied"));
                    roomSummary.set("lightsOn", sensorReading.get("lightsOn"));
                    roomSummary.save();
                    
                    //Add this new SensorReading to RoomHistory, because the current sensor reading will be deleted up the next ping from the same MAC address                   
                    var RoomHistory = Parse.Object.extend("RoomHistory");
                    var roomHistory = new RoomHistory();
                    roomHistory.set("roomId", roomID)
                    roomHistory.set("MACAddress", sensorReading.get("MACAddress"));
                    roomHistory.set("occupied", sensorReading.get("occupied"));
                    roomHistory.set("lightsOn", sensorReading.get("lightsOn"));
                    roomHistory.set("lightsRaw", sensorReading.get("lightsRaw"));
                    roomHistory.set("sensorReadingTime", sensorReading.get("updatedAt")); //Important: updatedAt and not createdAt does not reflect the time of the SensorReading. 
                    roomHistory.save();
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