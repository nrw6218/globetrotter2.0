// variables for the Google object instances
let map, geocoder, infoWindow, worldGeometry, countryString;

let countries = [];

/*
    Initializes the google map object
*/
const initMap = () => {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 3
    });

    infoWindow = new google.maps.InfoWindow;

      // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Your Location');
            infoWindow.open(map);
            map.setCenter(pos);
        }, () => {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
    }
}

/*
    Handles geolocation errors (occurs if the user denies location services)
*/
const handleLocationError = (browserHasGeolocation, infoWindow, pos) => {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

/*
    Loads the trips from the server and
    creates a new pin on the map for each
*/
const loadTripsFromServer = (csrf, callback) => {
    const iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    const icons = {
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

    sendAjax('GET', '/getTrips', null, (data) => {
        geocoder =  new google.maps.Geocoder();
        for(let i = 0; i < data.trips.length; i++) {
            geocoder.geocode( { 'address': data.trips[i].location }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    let marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map,
                        title: data.trips[i].title,
                        icon: `/assets/img/pin${(i%3) + 1}.png`,
                    });
                    marker.addListener('click', function() {
                        infoWindow.open(map, marker);
                        infoWindow.setContent(`<h1>${data.trips[i].title}</h1><p>${data.trips[i].details}</p>`);
                    });

                    //Add country to the list of "scratch" countries
                    for(let j = 0; j < results[0].address_components.length; j++) {
                        if(results[0].address_components[j].types.includes("country") && !countries.includes(results[0].address_components[j].short_name)) {
                            countries.push(results[0].address_components[j].short_name);
                            break;
                        }
                    }
                } else {
                    console.dir("Something got wrong " + status);
                }
                if(countries.length > 1) {
                    callback();
                }
            });
        }
    });
};

/*
    Loads a fusion tables layer on the map based off of
    a string of country names
*/
const loadFusionTable = () => {
    // build the list of countries
    countryString = "ISO_2DIGIT IN (";
    for(let i = 0; i < countries.length; i++) {
        countryString += "'" + countries[i] + "'";
        if(i != countries.length - 1) {
            countryString += ",";
        } else {
            countryString += ")";
        }
    }
    // if the map has country data, reset it
    if(worldGeometry) {
        worldGeometry.setMap(null);
    }

    // add a new fusion layer
    worldGeometry = new google.maps.FusionTablesLayer({
        query: {
            select: 'geometry',
            from: '1N2LBk4JHwWpOY4d9fobIn27lfnZ5MDy-NoqqRpk',
            where: `${countryString}`
        },
        styles: [
            {
                polygonOptions: {
                    fillColor: '#d96459',
                    fillOpacity: 0.6
                }
            }, 
        ],
        map: map,
        suppressInfoWindows: true,
    });
};

/*
    Initial page setup
*/
const setup = function(csrf) {
    loadTripsFromServer(csrf, loadFusionTable);
};

/*
    Gets the token for the current user
*/
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});