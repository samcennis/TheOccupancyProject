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