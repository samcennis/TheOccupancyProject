// These two lines are required to initialize Express in Cloud Code.
express = require('express');
app = express();

// Set the required API key.
var apiKey = 'VdWSfZSMsdaB6hfDRMFb1Ct4PJSqJErnABpwTRHW';

// Global app configuration section
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.post('/sensor', function(req, res) {

	// Get the request variables.  
	var requestApiKey = req.headers['x-parse-rest-api-key']; 	
	var address = req.body.MACAddress;
	var state = req.body.occupied;
	
	// Check the API key.
	if (requestApiKey === undefined || requestApiKey !== apiKey) {
		res.status(401).send({error:"Missing or incorrect API-key."});
		return;
	}

	// Validate the address.
	if (address === undefined || address.length <= 0 || typeof address !== "string") {
		res.status(400).send({error:"MAC Address missing or not a valid string."});
		return;
	}

	// Validate the state.
	if (state === undefined || typeof state !== "boolean") {
		res.status(400).send({error:"State missing or not a boolean."});
		return;
	}

	// Create the Sensor object.
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

			// Save the (new) sensor with updated state.
			sensor.save(null, {
				success: function (sensor) {
					// The object was saved successfully
					res.send({success:true, MACAddress:address, occupied:state});
				},
				error: function (error) {
					// Error saving the sensor object. Report error to client.
					res.status(400).send({error:"Sensor save error: " + error.code + " " + error.message});
				}
			});
		},
		error: function(error) {

			// Error performing the initial query. Report error to client.
			res.status(400).send({error:"Query error: " + error.code + " " + error.message});;
		}
	});

});

// Enable the express webserver. 
app.listen();