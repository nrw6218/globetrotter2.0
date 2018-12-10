"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProfileView = function (_React$Component) {
    _inherits(ProfileView, _React$Component);

    function ProfileView(props) {
        _classCallCheck(this, ProfileView);

        var _this = _possibleConstructorReturn(this, (ProfileView.__proto__ || Object.getPrototypeOf(ProfileView)).call(this, props));

        _this.state = {};
        return _this;
    }

    _createClass(ProfileView, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            //Calculate unique locations
            var uniqueLocations = [];
            var activityInfo = void 0;
            if (this.props.trips) {
                for (var i = 0; i < this.props.trips.length; i++) {
                    if (!uniqueLocations.includes(this.props.trips[i].location)) {
                        uniqueLocations.push(this.props.trips[i].location);
                    }
                }

                var oneDay = 24 * 60 * 60 * 1000;

                activityInfo = this.props.trips.map(function (trip) {
                    if (new Date(trip.startDate) < new Date(trip.createdDate)) {
                        return React.createElement(
                            "div",
                            { key: trip._id, className: "information", date: trip.startDate },
                            React.createElement("img", { src: _this2.props.user.imageLink }),
                            React.createElement(
                                "h3",
                                { className: "activityName" },
                                _this2.props.user.first,
                                " ",
                                _this2.props.user.last
                            ),
                            React.createElement(
                                "h3",
                                { className: "activityDate" },
                                new Date(trip.startDate).toLocaleDateString()
                            ),
                            React.createElement(
                                "p",
                                { className: "activityDetails" },
                                _this2.props.user.first,
                                " traveled to ",
                                trip.location,
                                " on ",
                                new Date(trip.startDate).toDateString(),
                                "! Happy exploring!"
                            )
                        );
                    }
                    return React.createElement(
                        "div",
                        { key: trip._id, className: "information", date: trip.createdDate },
                        React.createElement("img", { src: _this2.props.user.imageLink }),
                        React.createElement(
                            "h3",
                            { className: "activityName" },
                            _this2.props.user.first,
                            " ",
                            _this2.props.user.last
                        ),
                        React.createElement(
                            "h3",
                            { className: "activityDate" },
                            new Date(trip.createdDate).toLocaleString()
                        ),
                        React.createElement(
                            "p",
                            { className: "activityDetails" },
                            _this2.props.user.first,
                            " planned a trip to ",
                            trip.location,
                            " in ",
                            Math.round(Math.abs(new Date(trip.startDate).getTime() - new Date(trip.createdDate).getTime()) / oneDay),
                            " days! ",
                            trip.details
                        )
                    );
                });
            }

            // sort activity info by date
            if (activityInfo) {
                for (var _i = 0; _i < activityInfo.length; _i++) {
                    for (var j = 1; j < activityInfo.length; j++) {
                        if (new Date(activityInfo[j - 1].props.date) < new Date(activityInfo[j].props.date)) {
                            var temp = activityInfo[_i];
                            activityInfo[_i] = activityInfo[j];
                            activityInfo[j] = temp;
                        }
                    }
                }
            }

            return React.createElement(
                "div",
                { className: "profile" },
                React.createElement(
                    "div",
                    { className: "banner" },
                    React.createElement("img", { className: "profilePic", src: this.props.user.imageLink && this.props.user.imageLink != "" ? this.props.user.imageLink : "assets/img/profilepic.svg", alt: "Profile Picture" }),
                    React.createElement(
                        "h1",
                        null,
                        this.props.user.first,
                        " ",
                        this.props.user.last
                    ),
                    React.createElement(
                        "p",
                        { className: "profileBio" },
                        this.props.user.bio
                    ),
                    React.createElement(
                        "div",
                        { className: "userStat" },
                        React.createElement(
                            "h3",
                            null,
                            React.createElement(
                                "b",
                                null,
                                this.props.trips ? this.props.trips.length : '?'
                            ),
                            " Total Trips"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "userStat" },
                        React.createElement(
                            "h3",
                            null,
                            React.createElement(
                                "b",
                                null,
                                uniqueLocations.length
                            ),
                            " Places Explored"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "timeline" },
                    activityInfo ? activityInfo : null
                )
            );
        }
    }]);

    return ProfileView;
}(React.Component);

/*
    Loads the trips for the specified user from the server
*/


var loadTripsFromServer = function loadTripsFromServer(csrf, user) {
    sendAjax('GET', '/getTrips', null, function (data) {
        ReactDOM.render(React.createElement(ProfileView, { trips: data.trips, csrf: csrf, user: user }), document.querySelector("#content"));
    });
};

/*
    Handles initial page setup
*/
var setup = function setup(csrf, user) {
    ReactDOM.render(React.createElement(ProfileView, { csrf: csrf, user: user }), document.querySelector("#content"));

    loadTripsFromServer(csrf, user);
};

/*
    Gets the token for the current user
*/
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken, result.user);
    });
};

$(document).ready(function () {
    getToken();
});
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