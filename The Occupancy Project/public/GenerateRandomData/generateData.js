var generateMACAddress = function() {
    var MACAddress = generateHexNumber() + ":";
    MACAddress += generateHexNumber() + ":";
    MACAddress += generateHexNumber() + ":";
    MACAddress += generateHexNumber() + ":";
    MACAddress += generateHexNumber() + ":";
    MACAddress += generateHexNumber();
    
    return MACAddress;
}

var generateHexNumber = function() {
    return Math.floor(Math.random() * 256).toString(16);
}

var addMACforRooms = function() {
    var RoomClass = Parse.Object.extend("Room");
    var query = new Parse.Query(RoomClass);
    query.limit(1000);
    query.skip(1000);
    query.find({
      success: function(results) {
        for (var resultKey in results) {
            // console.log(resultKey + ": " + results[resultKey].id);
            
            var MACAddr_RmID_Mapping_Class = Parse.Object.extend("MACAddr_RmID_Mapping");
            var mapping = new MACAddr_RmID_Mapping_Class();
            mapping.set("RoomId", results[resultKey].id);
            mapping.set("MACAddr", generateMACAddress());

            mapping.save(null, {
                success: function() {
                // Execute any logic that should take place after the object is saved.
                console.log('New mapping added');
                },
                error: function(building, error) {
                    alert('Failed to add building ' + buildingNames[i] + ' with error code: ' + error.message);
                }
            });
        }
      },
      error: function(error) {
        // error is an instance of Parse.Error.
      }
    });
}

var probabilityOccupiedHourly = function() {
    
    var hourlyProbability = [];
    for (var i = 0; i < 24; i++) {
        var baseProbability = Math.abs(12 - Math.abs(-13 + i))/12;
        var randomOffset = Math.random() - .8;
        var probability = baseProbability + randomOffset;
        probability = probability < 0 ? 0 : probability;
        probability = probability > 1 ? 1 : probability;
        probability *= 100;
        hourlyProbability[hourlyProbability.length] = probability;
    }    
    return hourlyProbability;
}