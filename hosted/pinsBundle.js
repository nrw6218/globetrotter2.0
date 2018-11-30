'use strict';

// variables for the Google object instances
var map = void 0,
    geocoder = void 0,
    infoWindow = void 0;

/*
    Initializes the google map object
*/
var initMap = function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 10
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
var loadTripsFromServer = function loadTripsFromServer(csrf) {
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
                } else {
                    console.dir("Something got wrong " + status);
                }
            });
        };

        for (var i = 0; i < data.trips.length; i++) {
            _loop(i);
        }
    });
};

/*
    Initial page setup
*/
var setup = function setup(csrf) {
    loadTripsFromServer(csrf);
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
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
    window.location = response.redirect;
};

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
