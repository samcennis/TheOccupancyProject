Parse.initialize("VdWSfZSMsdaB6hfDRMFb1Ct4PJSqJErnABpwTRHW", "8DfK7ADN5SyQn1b9caOOQAhuaZCn1gX7wKSj1uRz");

/* =======================================
========== HELPER FUNCTIONS ==============
======================================= */

// called when user first logs in
var mainPageSetUp = function (user) {

    // set global variable currentUser to user
    currentUser = user;

    // update buttons in right nav
    var htmlForButtons = '<a class="waves-effect waves-light btn modal-trigger" id="logoffTrigger">Logoff</a>';
    $(".nav-right").html(htmlForButtons);

    // Hide floor selection until building is selected
    $("#floor-selection").hide();

    //Show Sensor Emulator Button
    $("#sensorEmulatorLaunch").show();

    // set HTML for building info
    var institutionId = user.get("InstitutionId");
    var Building_Class = Parse.Object.extend("Building");
    var query = new Parse.Query(Building_Class);
    query.equalTo("institutionId", institutionId);
    query.ascending("name");
    query.find({
        success: function (results) {
            var buildingOptionsHTML = '<option value="" disabled selected>Select a building</option>';
            var advancedSearchBuildingOptionsHTML = '<option value="all" selected>Search all buildings</option>';
            for (var i = 0; i < results.length; i++) {
                var building = results[i];
                buildingOptionsHTML += '<option value="' + building.id + '">' + building.get("name") + '</option>';
                advancedSearchBuildingOptionsHTML += '<option value="' + building.id + '">' + building.get("name") + '</option>';
            }

            $("#building-selection").html(buildingOptionsHTML);

            $("#building-selection-advanced").html(advancedSearchBuildingOptionsHTML);

            // initialize select with materialize
            $(document).ready(function () {
                $('select').material_select();
            });
        }
        , error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

var updateDummyPingCurrentBuilding = function (buildingID) {

    var RoomSummary = Parse.Object.extend("Room");
    var query = new Parse.Query(RoomSummary);

    query.equalTo("buildingId", buildingID);
    query.ascending("name");

    query.find({
        success: function (results) {
            var dummyPingRoomOptionsHTML = '<option value="" disabled selected>Select a room</option>';

            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                dummyPingRoomOptionsHTML += '<option value="' + object.id + '">' + object.get("name") + '</option>';
            }

            $("#dummy-room-selection").html(dummyPingRoomOptionsHTML);

            $('select').material_select();

        }
        , error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

var buildHourlyChart = function (elementId, title, xAxisTitle, yAxisTitle, yData) {
    var xLabels = ['12AM', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12PM', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
    buildChart(elementId, title, xAxisTitle, yAxisTitle, xLabels, yData);
}

var buildChart = function (elementId, title, xAxisTitle, yAxisTitle, xLabels, yData) {
    $('#' + elementId).highcharts({
        chart: {
            type: 'areaspline'
            , backgroundColor: 'rgba(255,255,255,0)'
        }
        , title: {
            text: title
        }
        , xAxis: {
            categories: xLabels
            , title: {
                text: xAxisTitle
            }
        }
        , legend: {
            enabled: false
        }
        , yAxis: {
            title: {
                text: yAxisTitle
            }
            , ceiling: 100
        }
        , tooltip: {
            shared: true
            , valueSuffix: '%'
        }
        , credits: {
            enabled: false
        }
        , plotOptions: {
            areaspline: {
                fillOpacity: 0.5
            }
        }
        , series: [{
            data: yData
        }]
    });
}

var buildAvgGraph = function(arrayOfProbabilities) {
    
    var seriesObj = new Array();
    for (key in arrayOfProbabilities) {
        seriesObj.push({"name": key, "data": arrayOfProbabilities[key]});   
    }
    
    $('#averages-graph').highcharts({
        chart: {
            type: 'areaspline',
            backgroundColor: 'rgba(255,255,255,0)'
        },
        title: {
            text: 'Average Hourly Usage for Building by Room'
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 150,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        xAxis: {
            categories: ['12AM', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12PM', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
        },
        yAxis: {
            title: {
                text: '% of time occupied'
            },
            ceiling: 100
        },
        tooltip: {
            shared: true,
            valueSuffix: '%'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5
            }
        },
        series: seriesObj
    });
}

var buildDailyGraph = function(elementName) {
    
    var arr = [Math.random() * 100 - .7, Math.random() * 100 - .2 , Math.random() * 100 - .2, Math.random() * 100 -.2, Math.random() * 100, Math.random() * 100 -.2, Math.random() * 100 - .7];
    
    $('#daily-graph').highcharts({
        chart: {
            type: 'column',
            backgroundColor: 'rgba(255,255,255,0)'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Occupancy by Day'
            },
            ceiling: 100
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}%</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Avg. Occupancy',
            data: arr
        }]
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

$("#loginModalTrigger").click(function () {
    $('#loginModal').openModal();
});

$("#advancedSearchModalTrigger").click(function () {
    $('#advancedSearchModal').openModal();
});

$("#sensorEmulatorModalTrigger").click(function () {
    $('#sensorEmulatorModal').openModal();
});

$(document).on("click", "#logoffTrigger", function () {
    Parse.User.logOut();
    //    $("#main-page").hide();
    //    $("#admin-page").hide();
    //    $("#splash-page").show();
    // refresh the page
    location.reload();
});

$(document).on("click", "#myAccountModalTrigger", function () {
    alert("TODO : Add My Account modal");
});

$("#registrationModalTrigger").click(function () {
    $('#registrationModal').openModal();
});

$("#registerBtn").click(function () {

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
        success: function (object) {
            // Successfully found institution
            var institutionId = object.get("InstitutionId");
            user.set("InstitutionId", institutionId);
            user.set("InstitutionDomain", institutionDomain);

            // sign user up
            user.signUp(null, {
                success: function (user) {
                    //                    // Hooray! Let them use the app now.
                    //                      $("#splash-page").hide();
                    //                      $("#main-page").show();
                    //                      $("#admin-page").show();
                    alert("TODO: Get email verification working, just refresh page for now");
                }
                , error: function (user, error) {
                    // Show the error message somewhere and let the user try again.
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        }
        , error: function (error) {
            // failed becuase institution isn't listed yet I think
            alert("Error: " + error.code + " " + error.message);
        }
    });
});

$("#loginBtn").click(function () {
    Parse.User.logIn($("#email_login").val(), $("#password_login").val(), {
        success: function (user) {
            mainPageSetUp(user);

            $("#splash-page").hide();
            $("#main-page").show();
            //                $("#admin-page").show();
        }
        , error: function (user, error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
});


$("#list-tab").click(function () {
    if ($("#room-list").html() == "") {
        queryBuildingForListView($("#building-selection").val());
    }
});

$("#map-tab").click(function () {
    if ($("#floorPlanWrapper").html() == "") {
        queryBuildingForMapView($("#building-selection").val());
    }
});

$("#advanced-search").click(function () {
    advancedSearch();
    $("advancedSearchModal").closeModal();
});

$("#refreshResults").click(function () {
    $("#building-selection").trigger('change');
});

$("#building-selection").change(function (e) {
    // set floor selection buttons
    var buildingId = $(this).val();

    $("#room-list").html(""); //clear list view
    $("#floorPlanWrapper").html(""); //clear map view

    //Show refresh button
    $("#refreshResults").show();

    //Update Admin Dummy Ping selection for rooms in the current building
    updateDummyPingCurrentBuilding(buildingId);
    //if map tab active
    if ($('a[href="#map"]').hasClass('active')) {
        console.log("map query!");
        queryBuildingForMapView(buildingId);
    } else {
        console.log("list query!");
        queryBuildingForListView(buildingId);
    }
    
    $("#analytics-body").html("");
    $("#analytics-page").show();
});

$("#dummy-room-selection").change(function (e) {
    var MACAddr_RmID_Mapping_Class = Parse.Object.extend("MACAddr_RmID_Mapping");
    var query = new Parse.Query(MACAddr_RmID_Mapping_Class);
    query.equalTo("RoomId", $("#dummy-room-selection").val());
    query.first({
        success: function (object) {
            $("#macAddr").val(object.get("MACAddr"));
        }
        , error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });

});

var queryBuildingForMapView = function (buildingId) {

    $("#loader").show();

    var Building_Class = Parse.Object.extend("Building");
    var query = new Parse.Query(Building_Class);
    query.get(buildingId, {
        success: function (object) {
            // Successfully found building
            var numFloors = object.get("numFloors");
            var floorOptionsHTML = '<label>Floor Selection</label><br />';
            for (var i = 0; i < numFloors; i++) {
                floorOptionsHTML += '<div class="btn waves-effect waves-light floorBtn" value="' + (i + 1) + '">' + (i + 1) + '</div>';
            }

            floorOptionsHTML += "</div>";

            $("#floor-selection").html(floorOptionsHTML);
            $("#floor-selection").show();

            // set room map to first floor
            if ($(".floorBtn")[0] != undefined) {

                $(".floorBtn")[0].click();
            } else {
                $("#floorPlanWrapper").html("Map of this building not available.");

            }
            $("#loader").hide();
        }
        , error: function (error) {
            $("#floorPlanWrapper").html("Map of this building not available.");
            $("#loader").hide();

        }
    });
}

var queryBuildingForListView = function (buildingId) {

    $("#loader").show();

    var Room_Class = Parse.Object.extend("Room");
    var query = new Parse.Query(Room_Class);
    query.equalTo("buildingId", buildingId);
    query.ascending("name");
    query.find({
        success: processSearchQuery
        , error: processErrorQuery
    });
}

var advancedSearch = function () {

    $("#room-list").html(""); //clear list view
    $("#floorPlanWrapper").html(""); //clear map view
    //$('#view-tabs').tabs('select_tab', '#list-tab-li');
    //TODO: Switch tab

    var Room_Class = Parse.Object.extend("Room");
    var query = new Parse.Query(Room_Class);

    if ($("#building-selection-advanced").val() != "all") {
        query.equalTo("buildingId", $("#building-selection-advanced").val());
    }
    query.ascending("name");

    $('#unoccupied').is(':checked') && query.equalTo("occupied", false);

    query.greaterThanOrEqualTo("maxCapacity", $('#capacity').val());

    $('#fixed-furniture').is(':checked') && query.equalTo("fixedFurniture", true);
    $('#moveable-furniture').is(':checked') && query.equalTo("moveableFurniture", true);
    $('#air-conditioning').is(':checked') && query.equalTo("airConditioning", true);
    $('#white-board').is(':checked') && query.equalTo("whiteBoard", true);
    $('#document-camera').is(':checked') && query.equalTo("documentCamera", true);
    $('#chalk-board').is(':checked') && query.equalTo("chalkBoard", true);
    $('#audio-connection').is(':checked') && query.equalTo("audioConnection", true);
    $('#dept-computer').is(':checked') && query.equalTo("deptComputerAvailable", true);
    $('#double-projectors').is(':checked') && query.equalTo("doubleProjectors", true);
    $('#dvd-output').is(':checked') && query.equalTo("dvdVideoComputerOutput", true);

    query.find({
        success: processSearchQuery
        , error: processErrorQuery
    });

}

var processSearchQuery = function (results) {
    $("#loader").hide();
    
    // average of rooms array (an array of arrays)
    allRoomsPlotLines = {};
    
    results.forEach(function (item) {

        var roomInfoHTML = buildRoomInfoHTML(item);

        $("#room-list").append(roomInfoHTML);
        
        // construct analytics page HTML
        var analyticsHTML = '<div id="room-analytics-' + item.id + '-wrapper" style="display: none;">';
        analyticsHTML += '<p style="font-size: 24px;"><b>' + item.get("buildingName") + ":</b> Room " + item.get("name") + "</p>";
        analyticsHTML += '<div id="analytics-avgHourlyGraph-' + item.id + '" style="height: 200px; margin: 0 auto"></div>';
        analyticsHTML += '</div>';
        
        $("#analytics-body").append(analyticsHTML);

        //Don't show this list item if it fails to load
        $("#" + item.id + "-img").on("error", function () {
            $(this).closest("li").hide();
        })

        //Show this list item if img does load, process analytics for room as well
        $("#" + item.id + "-img").on("load", function () {
            var probabilityHourlyOccupiedArray = probabilityOccupiedHourly();
            buildHourlyChart('avgHourlyGraph-' + item.id, 'Average Occupancy by Hour', 'Hour', '% of time occupied', probabilityHourlyOccupiedArray);
            buildHourlyChart('analytics-avgHourlyGraph-' + item.id, 'Average Occupancy by Hour', 'Hour', '% of time occupied', probabilityHourlyOccupiedArray);
            allRoomsPlotLines[item.get("name")] = probabilityHourlyOccupiedArray;
            
            $(this).closest("li").show();   
            $('#room-analytics-' + item.id + '-wrapper').show();
            
            // Build Average Graph
            buildAvgGraph(allRoomsPlotLines);
            
            buildDailyGraph('#daily-graph');
        })
    });
    
    //Initialize accordion:
    $('.collapsible').collapsible({
        accordion: false
    });
}

var processErrorQuery = function (error) {
    alert("Error: " + error.code + " " + error.message);
}



var buildRoomInfoHTML = function (item) {
    var roomInfoHTML = '<li style="display: none;" id="' + item.id + '-li">';

    roomInfoHTML += '<div class="collapsible-header">';
    roomInfoHTML += '<span>' + item.get("buildingName") + " " + item.get("name") + '</span>';
    roomInfoHTML += '<span class="right">' + (item.get("occupied") ? '<span class="red-text">Occupied</span>' : '<span class="green-text">Open</span>') + '</span>';
    roomInfoHTML += '</div>';

    roomInfoHTML += '<div class="row collapsible-body">';
    roomInfoHTML += '<div class="col s3"><img id="' + item.id + '-img"class="responsive-img classroom-img" src="' + item.get("imageURL") + '"></div>';

    roomInfoHTML += '<div class="col s9">';
    roomInfoHTML += '<div>Max capacity: <b>' + item.get("maxCapacity") + '</b></div>';
    roomInfoHTML += '<i class="material-icons">info</i> ' +
        (item.get("fixedFurniture") ? '<div class="chip">Fixed furniture</div>' : '') +
        (item.get("moveableFurniture") ? '<div class="chip">Moveable furniture</div>' : '') +
        (item.get("airConditioning") ? '<div class="chip">Air conditioning</div>' : '') +
        (item.get("whiteBoard") ? '<div class="chip">White board</div>' : '') +
        (item.get("documentCamera") ? '<div class="chip">Document camera</div>' : '') +
        (item.get("chalkBoard") ? '<div class="chip">Chalk board</div>' : '') +
        (item.get("audioConnection") ? '<div class="chip">Audio connection</div>' : '') +
        (item.get("deptComputerAvailable") ? '<div class="chip">Department computer available</div>' : '') +
        (item.get("doubleProjectors") ? '<div class="chip">Double projectors</div>' : '') +
        (item.get("dvdVideoComputerOutput") ? '<div class="chip">DVD Video Computer Output</div>' : '');

    // HighCharts Graphs
    roomInfoHTML += '<div id="avgHourlyGraph-' + item.id + '" style="height: 200px; margin: 0 auto"></div>';
    roomInfoHTML += '';

    roomInfoHTML += '</div>';

    roomInfoHTML += '</div>';
    roomInfoHTML += '</li>';

    return roomInfoHTML;
}

var addMarkerToFloorPlan = function (roomId, percentX, percentY) {

    // make sure percentX and percentY are valid coordinates
    if (!percentX || !percentY) {
        return;
    }

    var RoomSummary_Class = Parse.Object.extend("Room");
    var query = new Parse.Query(RoomSummary_Class);
    query.equalTo("objectId", roomId);
    query.find({
        success: function (results) {
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
        }
        , error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

$(document).on("click", ".floorBtn", function () {
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
        success: function (results) {
            for (var i = 0; i < results.length; i++) {
                var roomMapInfo = results[i];
                var roomId = roomMapInfo.get("roomId");
                var percentX = roomMapInfo.get("percentX");
                var percentY = roomMapInfo.get("percentY");

                addMarkerToFloorPlan(roomId, percentX, percentY);

            }
        }
        , error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
});


$("#dummyPingButton").click(function () {
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
        "MACAddress": $("#macAddr").val()
        , "occupied": ("true" == $('input:radio[name=dummyMotion]:checked').val())
        , "lightsRaw": parseInt($("#dummyLightValue").val())
    };

    Parse.Cloud.run("dummySensorPing", req, {
        success: function (result) {
            //alert('Sent dummy ping. ' + result);

            //Click on currently selected building again to reload rooms
            $("#building-selection").trigger('change');

            $("#sensorEmulatorModal").closeModal();


        }
        , error: function (error) {
            alert(error);
        }
    });


});