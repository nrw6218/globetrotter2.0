'use strict';

// variables for the Google object instances
var map = void 0,
    geocoder = void 0,
    infoWindow = void 0,
    worldGeometry = void 0,
    countryString = void 0;

var countries = [];

/*
    Initializes the google map object
*/
var initMap = function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 3
    });

    infoWindow = new google.maps.InfoWindow();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Your Location');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
};

/*
    Handles geolocation errors (occurs if the user denies location services)
*/
var handleLocationError = function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
};

/*
    Loads the trips from the server and
    creates a new pin on the map for each
*/
var loadTripsFromServer = function loadTripsFromServer(csrf, callback) {
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var icons = {
        upcoming: {
            icon: iconBase + 'pin1.png'
        },
        complete: {
            icon: iconBase + 'pin2.png'
        },
        today: {
            icon: iconBase + 'pin3.png'
        }
    };

    sendAjax('GET', '/getTrips', null, function (data) {
        geocoder = new google.maps.Geocoder();

        var _loop = function _loop(i) {
            geocoder.geocode({ 'address': data.trips[i].location }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map,
                        title: data.trips[i].title,
                        icon: '/assets/img/pin' + (i % 3 + 1) + '.png'
                    });
                    marker.addListener('click', function () {
                        infoWindow.open(map, marker);
                        infoWindow.setContent('<h1>' + data.trips[i].title + '</h1><p>' + data.trips[i].details + '</p>');
                    });

                    //Add country to the list of "scratch" countries
                    for (var j = 0; j < results[0].address_components.length; j++) {
                        if (results[0].address_components[j].types.includes("country") && !countries.includes(results[0].address_components[j].short_name)) {
                            countries.push(results[0].address_components[j].short_name);
                            break;
                        }
                    }
                } else {
                    console.dir("Something got wrong " + status);
                }
                if (countries.length > 1) {
                    callback();
                }
            });
        };

        for (var i = 0; i < data.trips.length; i++) {
            _loop(i);
        }
    });
};

/*
    Loads a fusion tables layer on the map based off of
    a string of country names
*/
var loadFusionTable = function loadFusionTable() {
    // build the list of countries
    countryString = "ISO_2DIGIT IN (";
    for (var i = 0; i < countries.length; i++) {
        countryString += "'" + countries[i] + "'";
        if (i != countries.length - 1) {
            countryString += ",";
        } else {
            countryString += ")";
        }
    }
    // if the map has country data, reset it
    if (worldGeometry) {
        worldGeometry.setMap(null);
    }

    // add a new fusion layer
    worldGeometry = new google.maps.FusionTablesLayer({
        query: {
            select: 'geometry',
            from: '1N2LBk4JHwWpOY4d9fobIn27lfnZ5MDy-NoqqRpk',
            where: '' + countryString
        },
        styles: [{
            polygonOptions: {
                fillColor: '#d96459',
                fillOpacity: 0.6
            }
        }],
        map: map,
        suppressInfoWindows: true
    });
};

/*
    Initial page setup
*/
var setup = function setup(csrf) {
    loadTripsFromServer(csrf, loadFusionTable);
};

/*
    Gets the token for the current user
*/
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
/*
    Find the errorMessage object and populate it with a message
*/
var handleError = function handleError(message) {
    $("#errorMessage").text(message);
};

/*
    Redirect the user to the desired location
*/
var redirect = function redirect(response) {
    window.location = response.redirect;
};

/*
    Sends an ajax request
*/
var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};