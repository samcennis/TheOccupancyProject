Parse.initialize("VdWSfZSMsdaB6hfDRMFb1Ct4PJSqJErnABpwTRHW", "8DfK7ADN5SyQn1b9caOOQAhuaZCn1gX7wKSj1uRz");
        
/* =======================================
========== HELPER FUNCTIONS ==============
======================================= */

// called when user first logs in
var mainPageSetUp = function(user) {
    
    // set global variable currentUser to user
    currentUser = user;
    
    // update buttons in right nav
    var htmlForButtons = '<a style="margin-right: 10px" class="waves-effect waves-light btn modal-trigger" id="myAccountModalTrigger">My Account</a>';
    htmlForButtons += '<a class="waves-effect waves-light btn modal-trigger" id="logoffTrigger">Logoff</a>';
    $(".nav-right").html(htmlForButtons);                


    // set HTML for building info
    var institutionId = user.get("InstitutionId");            
    var Institution_Building_Mapping_Class = Parse.Object.extend("Institution_Building_Mapping");
    var query = new Parse.Query(Institution_Building_Mapping_Class);
    query.equalTo("InstitutionId", institutionId);
    query.find({
        success: function(results) {
            var buildingOptionsHTML = '<option value="" disabled selected>Select a building</option>';
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                buildingOptionsHTML += '<option value="' + object.get("BuildingId") + '">' + object.get("BuildingName") + '</option>';
            }

            $("#building-selection").html(buildingOptionsHTML);

            // initialize select with materialize
            $(document).ready(function() {
                $('select').material_select();
            });
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

var updateDummyPingCurrentBuilding = function(buildingID) {
    
    var RoomSummary = Parse.Object.extend("RoomSummary");
    var query = new Parse.Query(RoomSummary);
    
    query.equalTo("buildingId", buildingID);
    query.ascending("roomName");
    
    query.find({
        success: function(results) {
            var dummyPingRoomOptionsHTML = '<option value="" disabled selected>Select a room</option>';
            
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                dummyPingRoomOptionsHTML += '<option value="' + object.get("objectId") + '">' + object.get("roomName") + '</option>';
            }

            $("#dummy-room-selection").html(dummyPingRoomOptionsHTML);
            
            $('select').material_select();
            
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
    
    
}

/* =======================================
========== INITIALIZATION ================
======================================= */

var currentUser = Parse.User.current();
if (currentUser) {
    // see if regular user or admin (TODO: Implement 3 parse roles, "Site-Admin", "Institution-Admin", and then a user who exists without extra permissions, for certain levels, limit class write access
    mainPageSetUp(currentUser);
    $("#main-page").show();
//            $("#admin-page").show();

} else {
    // not logged in, show splash page
    $("#splash-page").show();
}



/* =======================================
========== EVENT LISTENERS ===============
======================================= */

$("#loginModalTrigger").click(function() {
    $('#loginModal').openModal(); 
});

$(document).on("click","#logoffTrigger",function() {
    Parse.User.logOut();
//    $("#main-page").hide();
//    $("#admin-page").hide();
//    $("#splash-page").show();
    // refresh the page
    location.reload();
});

$(document).on("click","#myAccountModalTrigger",function() {
    alert("TODO : Add My Account modal");
});

$("#registrationModalTrigger").click(function() {
    $('#registrationModal').openModal(); 
});

$("#registerBtn").click(function() {

    // TODO : Error checking for empty or invalid inputs
    // TODO : Add verifcation email step (so don't log them in right away, make them verify their email, then bring them to the site to log in again when clicking the link

    var user = new Parse.User();
    user.set("first_name", $("#first_name").val());
    user.set("last_name", $("#last_name").val());
    user.set("username", $("#email_reg").val());
    user.set("email", $("#email_reg").val());
    user.set("password", $("#password_reg").val());    

    // get email domain
    var emailParts = $("#email_reg").val().split("@");
    var institutionDomain = emailParts[1];

    // look up institution id with that email
    var InstitutionClass = Parse.Object.extend("Institution");
    var query = new Parse.Query(InstitutionClass);
    query.equalTo("InstitutionDomain", institutionDomain);
    query.first({
      success: function(object) {
        // Successfully found institution
        var institutionId =  object.get("InstitutionId");
        user.set("InstitutionId", institutionId);
        user.set("InstitutionDomain", institutionDomain);

        // sign user up
        user.signUp(null, {
          success: function(user) {
//                    // Hooray! Let them use the app now.
//                      $("#splash-page").hide();
//                      $("#main-page").show();
//                      $("#admin-page").show();
              alert("TODO: Get email verification working, just refresh page for now");
          },
          error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            alert("Error: " + error.code + " " + error.message);
          }
        });
      },
      error: function(error) {
        // failed becuase institution isn't listed yet I think
        alert("Error: " + error.code + " " + error.message);
      }
    });
});

$("#loginBtn").click(function() {
    Parse.User.logIn($("#email_login").val(), $("#password_login").val(), {
      success: function(user) {
        mainPageSetUp(user);

        $("#splash-page").hide();
        $("#main-page").show();
//                $("#admin-page").show();
      },
      error: function(user, error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
});

$("#building-selection").change(function(e) {
    // set floor selection buttons
    var buildingId = $(this).val();
    var institutionId = currentUser.get("InstitutionId");  

    //Update Admin Dummy Ping selection for rooms in the current building
    updateDummyPingCurrentBuilding(buildingId);
    
    // update floor map with first floor map
    var Institution_Building_Mapping_Class = Parse.Object.extend("Institution_Building_Mapping");
    var query = new Parse.Query(Institution_Building_Mapping_Class);
    query.equalTo("BuildingId", buildingId);
    query.first({
        success: function(object) {
            // Successfully found building
            var numFloors =  object.get("NumFloors");
            var floorOptionsHTML = '<label>Floor Selection</label><br />';
            for (var i = 0; i < numFloors; i++) {
                floorOptionsHTML += '<div class="btn waves-effect waves-light floorBtn" value="' + (i+1) + '">' + (i+1) + '</div>';
            }

            floorOptionsHTML += "</div>";

            $("#floor-selection").html(floorOptionsHTML);
            
            // set room map to first floor
            $(".floorBtn")[0].click();
        },
        error: function(error) {
            // failed becuase institution isn't listed yet I think
            alert("Error: " + error.code + " " + error.message);
        }
    });
});

var addMarkerToFloorPlan = function(roomId, percentX, percentY) {
    
    // make sure percentX and percentY are valid coordinates
    if (!percentX || !percentY) {
        return;
    }
    
    var RoomSummary_Class = Parse.Object.extend("RoomSummary");
    var query = new Parse.Query(RoomSummary_Class);
    query.equalTo("objectId", roomId);
    query.find({
        success: function(results) {
            for (var j = 0; j < results.length; j++) {
                var roomSummary = results[j];
                var occupiedFlag = roomSummary.get("occupied");                           

                // add marker to map
                if (occupiedFlag) {
                    $("#floorPlanWrapper").append('<img class="floorPlanMarker" style="top: ' + percentY + '%; left: ' + percentX + '%;" src="img/OccupancyMarkers/X.png" />');
                } else {
                    $("#floorPlanWrapper").append('<img class="floorPlanMarker" style="top: ' + percentY + '%; left: ' + percentX + '%;" src="img/OccupancyMarkers/O.png" />');
                }
            }
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

$(document).on("click",".floorBtn",function() {
    var floorVal = $(this).attr("value");
    var buildingId = $("#building-selection").val();
    var institutionId = currentUser.get("InstitutionId");
    
    // create map html
    var mapHtml = "";
    
    mapHtml += '<img id="floorPlanImg" src="img/FloorPlans/' + institutionId + "_" + buildingId + "_" + floorVal + '.png" />';
    $("#floorPlanWrapper").html(mapHtml);   
    
    // for each room on that buildings floor, look at x,y coordinates of room and sensor data 
    var RoomMapInfo_Class = Parse.Object.extend("RoomMapInfo");
    var query = new Parse.Query(RoomMapInfo_Class);
    query.equalTo("buildingId", buildingId);
    query.equalTo("floor", floorVal);
    query.find({
        success: function(results) {
            for (var i = 0; i < results.length; i++) {
                var roomMapInfo = results[i];
                var roomId = roomMapInfo.get("roomId");
                var percentX = roomMapInfo.get("percentX");
                var percentY = roomMapInfo.get("percentY");
                
                addMarkerToFloorPlan(roomId, percentX, percentY);
                
            }
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
});


$("#dummyPingButton").click(function() {
    /*var SensorReading = Parse.Object.extend("SensorReading");
    var sensorReading = new SensorReading();
    
    sensorReading.set("MACAddress", $("#macAddr").val());
    sensorReading.set("occupied", ("true" == $('input:radio[name=dummyMotion]:checked').val()));
    sensorReading.set("lightsRaw", parseInt($("#dummyLightValue").val()));
    
    sensorReading.save(null, {
    success: function(sensorReading) {
        alert('New SensorReading created with objectId: ' + sensorReading.id); 
    },
    error: function(sensorReading, error) {
        alert('Failed to create new object, with error code: ' + error.message);   
    }
    });*/
    
    var req = { 
        "MACAddress": $("#macAddr").val(),
        "occupied": ("true" == $('input:radio[name=dummyMotion]:checked').val()),
        "lightsRaw": parseInt($("#dummyLightValue").val())
    };
    
    Parse.Cloud.run("dummySensorPing", req, { 
        success: function(result) {   
            alert('Sent dummy ping. ' + result); 
        },
        error: function(error) {
            alert( error );
        }
    });
      

});