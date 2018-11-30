"use strict";

/*
    Handles the creation of a new trip
*/
var handleTrip = function handleTrip(e) {
    e.preventDefault();

    $("#tripMessage").animate({ width: 'hide' }, 350);

    if ($("#tripTitle").val() == '' || $("#tripLocation").val() == '' || $("#tripDate").val() == '') {
        handleError("All fields are required!");
        return false;
    }

    sendAjax('POST', $("#tripForm").attr("action"), $("#tripForm").serialize(), function () {
        loadTripsFromServer($('token').val());
    });

    return false;
};

/*
    Handles the deletion of a trip
*/
var handleDelete = function handleDelete(e) {
    e.preventDefault();

    sendAjax('DELETE', '/deleteTrip', $('#deleteTrip').serialize(), function () {
        loadTripsFromServer($('token').val());
    });

    return false;
};

/*
    Handles the creation of the Trip Form which allows the user to add a new trip to their account
*/
var TripForm = function TripForm(props) {
    return React.createElement(
        "form",
        { id: "tripForm",
            onSubmit: handleTrip,
            name: "tripForm",
            action: "/maker",
            method: "POST",
            className: "tripForm"
        },
        React.createElement("input", { className: "formInput", id: "tripTitle", type: "text", name: "title", placeholder: "Title" }),
        React.createElement("input", { className: "formInput", id: "tripLocation", type: "text", name: "location", placeholder: "Location" }),
        React.createElement("input", { className: "formInput", id: "tripDetails", type: "text", name: "details", placeholder: "Details" }),
        React.createElement("input", { className: "formInput", id: "tripDate", type: "date", name: "startDate" }),
        React.createElement("input", { className: "formInput", id: "token", type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Make Trip" }),
        React.createElement("span", { id: "errorMessage" })
    );
};

/*
    Creates a list of trip objects to display in the maker
*/
var TripList = function TripList(props) {
    if (props.trips.length === 0) {
        return React.createElement(
            "div",
            { className: "tripList" },
            React.createElement(
                "h3",
                { className: "emptytrip" },
                "No Trips yet"
            )
        );
    }

    var tripNodes = props.trips.map(function (trip) {
        return React.createElement(
            "div",
            { key: trip._id, className: "trip" },
            React.createElement(CircularProgressBar, { sqSize: 200, strokeWidth: 15, start: trip.startDate, total: trip.totalDays, title: trip.title }),
            React.createElement(
                "h3",
                { className: "tripTitle" },
                trip.title ? trip.title : 'New Trip'
            ),
            React.createElement(
                "h3",
                { className: "tripLocation" },
                trip.location ? trip.location : 'Orlando, Florida'
            ),
            React.createElement(
                "p",
                { className: "tripDetails" },
                trip.details
            ),
            React.createElement(
                "form",
                { className: "delete",
                    id: "deleteTrip",
                    onSubmit: handleDelete,
                    name: "deleteTrip",
                    action: "/deleteTrip",
                    method: "DELETE"
                },
                React.createElement("input", { type: "hidden", name: "_id", value: trip._id }),
                React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
                React.createElement("input", { style: { height: "20px" }, type: "image", src: "/assets/img/deleteButton.png", border: "0", alt: "Submit" })
            )
        );
    });

    // Returns the list of trips PLUS a sample of an advertisement in the application
    return React.createElement(
        "div",
        { className: "tripList" },
        tripNodes,
        React.createElement(
            "div",
            { className: "trip advertisement" },
            React.createElement("img", { className: "adImage", src: "assets/img/harrypotter.jpg" }),
            React.createElement(
                "h3",
                { className: "tripTitle" },
                "Wizarding World of Harry Potter"
            ),
            React.createElement(
                "h3",
                { className: "tripLocation" },
                "SUGGESTED DESTINATION"
            ),
            React.createElement(
                "p",
                { className: "tripDetails" },
                "Enter The Wizarding World of Harry Potter\u2122\u2014two lands of groundbreaking thrills and magical fun."
            ),
            React.createElement(
                "a",
                { className: "learnMore", href: "https://www.universalorlando.com/web/en/us/universal-orlando-resort/the-wizarding-world-of-harry-potter/hub/index.html", target: "_blank" },
                "Learn More"
            )
        )
    );
};

/*
    Loads the trips for the specified user from the server
*/
var loadTripsFromServer = function loadTripsFromServer(csrf) {
    sendAjax('GET', '/getTrips', null, function (data) {
        ReactDOM.render(React.createElement(TripList, { trips: data.trips, csrf: csrf }), document.querySelector("#trips"));
    });
};

/*
    Handles initial page setup
*/
var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(TripForm, { csrf: csrf }), document.querySelector("#maketrip"));

    ReactDOM.render(React.createElement(TripList, { trips: [], csrf: csrf }), document.querySelector("#trips"));

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

//Original code from https://codepen.io/bbrady/pen/ozrjKE
//Code extended and updated by Nikolas Whiteside
var CircularProgressBar = function CircularProgressBar(props) {

  //Number of seconds in a day
  var oneDay = 24 * 60 * 60 * 1000;

  // Size of the enclosing square
  var sqSize = props.sqSize;
  // SVG centers the stroke width on the radius, subtract out so circle fits in square
  var radius = (props.sqSize - props.strokeWidth) / 2;
  // Enclose cicle in a circumscribing square
  var viewBox = "0 0 " + sqSize + " " + sqSize;
  // Arc length at 100% coverage is the circle circumference
  var dashArray = radius * Math.PI * 2;

  //Dates
  var start_date = new Date(props.start);
  var current_date = new Date();
  var daysLeft = void 0;
  var dashOffset = void 0;
  var measure = void 0;
  if (start_date.getTime() - current_date.getTime() > 0) {
    daysLeft = Math.round(Math.abs(start_date.getTime() - current_date.getTime()) / oneDay);
    dashOffset = dashArray - dashArray * (Math.abs(daysLeft - props.total) / props.total);
  } else {
    daysLeft = 0;
    dashOffset = 0;
  }

  if (daysLeft > 1) {
    measure = "days";
  } else if (daysLeft == 1) {
    measure = "day";
  } else {
    measure = "";
  }

  return React.createElement(
    "svg",
    {
      width: props.sqSize,
      height: props.sqSize,
      viewBox: viewBox },
    React.createElement("circle", {
      className: "circle-background",
      cx: props.sqSize / 2,
      cy: props.sqSize / 2,
      r: radius,
      strokeWidth: props.strokeWidth + "px" }),
    React.createElement("circle", {
      className: "circle-progress",
      cx: props.sqSize / 2,
      cy: props.sqSize / 2,
      r: radius,
      strokeWidth: props.strokeWidth + "px"
      // Start progress marker at 12 O'Clock
      , transform: "rotate(-90 " + props.sqSize / 2 + " " + props.sqSize / 2 + ")",
      style: {
        stroke: daysLeft > 0 ? props.color : "rgba(150,206,180,1)",
        strokeDasharray: dashArray,
        strokeDashoffset: dashOffset
      } }),
    React.createElement(
      "text",
      {
        className: "circle-text",
        x: "50%",
        y: "50%",
        dy: ".3em",
        textAnchor: "middle" },
      (daysLeft > 0 ? daysLeft : 'CHARTED') + " " + measure
    )
  );
};
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
