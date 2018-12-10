'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TripList = function (_React$Component) {
    _inherits(TripList, _React$Component);

    function TripList(props) {
        _classCallCheck(this, TripList);

        var _this = _possibleConstructorReturn(this, (TripList.__proto__ || Object.getPrototypeOf(TripList)).call(this, props));

        _this.state = {
            modalOpen: false,
            focusTrip: null
        };

        _this.handleDelete = _this.handleDelete.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleClose = _this.handleClose.bind(_this);
        return _this;
    }

    /*
        Handles the deletion of a trip
    */


    _createClass(TripList, [{
        key: 'handleDelete',
        value: function handleDelete(e) {
            e.preventDefault();

            sendAjax('DELETE', '/deleteTrip', $('#deleteTrip').serialize(), function () {
                loadTripsFromServer($('token').val());
            });

            return false;
        }
    }, {
        key: 'handleClick',


        /*
            Opens the modal and sets the trip accordingly
        */
        value: function handleClick(trip) {
            // Enable the modal
            this.setState({
                modalOpen: true,
                focusTrip: trip
            });
        }

        /*
            Closes the modal
        */

    }, {
        key: 'handleClose',
        value: function handleClose(e) {
            this.setState({
                modalOpen: false
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            if (this.props.trips.length === 0) {
                return React.createElement(
                    'div',
                    { className: 'tripList' },
                    React.createElement(
                        'h3',
                        { className: 'emptytrip' },
                        'Time to fill your map!'
                    ),
                    React.createElement(
                        'p',
                        { className: 'firstTime' },
                        'Click on the NEW POST button to get started.'
                    )
                );
            }
            var tripNodes = this.props.trips.map(function (trip) {
                return React.createElement(
                    'div',
                    { key: trip._id, onClick: function onClick() {
                            return _this2.handleClick(trip);
                        }, className: 'trip' },
                    React.createElement(CircularProgressBar, { sqSize: 200, strokeWidth: 15, start: trip.startDate, total: trip.totalDays, title: trip.title }),
                    React.createElement(
                        'h3',
                        { className: 'tripTitle' },
                        trip.title ? trip.title : 'New Trip'
                    ),
                    React.createElement(
                        'h3',
                        { className: 'tripLocation' },
                        trip.location ? trip.location : 'Orlando, Florida'
                    ),
                    React.createElement(
                        'p',
                        { className: 'tripDetails' },
                        trip.details
                    ),
                    React.createElement(
                        'form',
                        { className: 'delete',
                            id: 'deleteTrip',
                            onSubmit: _this2.handleDelete,
                            name: 'deleteTrip',
                            action: '/deleteTrip',
                            method: 'DELETE'
                        },
                        React.createElement('input', { type: 'hidden', name: '_id', value: trip._id }),
                        React.createElement('input', { type: 'hidden', id: 'token', name: '_csrf', value: _this2.props.csrf }),
                        React.createElement('input', { style: { height: "20px" }, type: 'image', src: '/assets/img/deleteButton.png', border: '0', alt: 'Submit' })
                    )
                );
            });

            // Returns the list of trips PLUS a sample of an advertisement in the application
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'tripList' },
                    tripNodes,
                    React.createElement(
                        'div',
                        { className: 'trip advertisement' },
                        React.createElement('img', { className: 'adImage', src: 'assets/img/harrypotter.jpg' }),
                        React.createElement(
                            'h3',
                            { className: 'tripTitle' },
                            'Wizarding World of Harry Potter'
                        ),
                        React.createElement(
                            'h3',
                            { className: 'tripLocation' },
                            'SUGGESTED DESTINATION'
                        ),
                        React.createElement(
                            'p',
                            { className: 'tripDetails' },
                            'Enter The Wizarding World of Harry Potter\u2122\u2014two lands of groundbreaking thrills and magical fun.'
                        ),
                        React.createElement(
                            'a',
                            { className: 'learnMore', href: 'https://www.universalorlando.com/web/en/us/universal-orlando-resort/the-wizarding-world-of-harry-potter/hub/index.html', target: '_blank' },
                            'Learn More'
                        )
                    )
                ),
                React.createElement(
                    Modal,
                    { show: this.state.modalOpen, handleClose: this.handleClose },
                    React.createElement(
                        'div',
                        { className: 'tripInfo' },
                        React.createElement(
                            'div',
                            { className: 'tripRing' },
                            React.createElement(CircularProgressBar, {
                                sqSize: 200,
                                strokeWidth: 15,
                                start: this.state.focusTrip ? this.state.focusTrip.startDate : 0,
                                total: this.state.focusTrip ? this.state.focusTrip.totalDays : 0,
                                title: this.state.focusTrip ? this.state.focusTrip.title : 0
                            })
                        ),
                        React.createElement(
                            'div',
                            { className: 'content' },
                            React.createElement(
                                'h2',
                                { className: 'tripTitle' },
                                this.state.focusTrip ? this.state.focusTrip.title : 'New Trip'
                            ),
                            React.createElement(
                                'h3',
                                { className: 'tripLocation' },
                                this.state.focusTrip ? this.state.focusTrip.location : 'Orlando, Florida',
                                ' - ',
                                this.state.focusTrip ? new Date(this.state.focusTrip.startDate).toLocaleDateString() : 'No start date available'
                            ),
                            React.createElement(
                                'p',
                                { className: 'tripDetails' },
                                this.state.focusTrip ? this.state.focusTrip.details : 'No trip selected'
                            )
                        )
                    )
                )
            );
        }
    }]);

    return TripList;
}(React.Component);

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
    var viewBox = '0 0 ' + sqSize + ' ' + sqSize;
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
        'svg',
        {
            width: props.sqSize,
            height: props.sqSize,
            viewBox: viewBox },
        React.createElement('circle', {
            className: 'circle-background',
            cx: props.sqSize / 2,
            cy: props.sqSize / 2,
            r: radius,
            strokeWidth: props.strokeWidth + 'px' }),
        React.createElement('circle', {
            className: 'circle-progress',
            cx: props.sqSize / 2,
            cy: props.sqSize / 2,
            r: radius,
            strokeWidth: props.strokeWidth + 'px'
            // Start progress marker at 12 O'Clock
            , transform: 'rotate(-90 ' + props.sqSize / 2 + ' ' + props.sqSize / 2 + ')',
            style: {
                stroke: daysLeft > 0 ? props.color : "rgba(150,206,180,1)",
                strokeDasharray: dashArray,
                strokeDashoffset: dashOffset
            } }),
        React.createElement(
            'text',
            {
                className: 'circle-text',
                x: '50%',
                y: '50%',
                dy: '.3em',
                textAnchor: 'middle' },
            (daysLeft > 0 ? daysLeft : 'CHARTED') + ' ' + measure
        )
    );
};
var Modal = function Modal(_ref) {
    var handleClose = _ref.handleClose,
        show = _ref.show,
        children = _ref.children;


    /*
      Returns a modal object, containing the passed in children
    */
    return React.createElement(
        'div',
        { className: show ? "modal modalOpen" : "modal modalClosed" },
        React.createElement(
            'section',
            { className: 'modalContent' },
            children,
            React.createElement('img', { className: 'closeButton', onClick: handleClose, src: 'assets/img/close.svg' })
        )
    );
};

var TripForm = function (_React$Component2) {
    _inherits(TripForm, _React$Component2);

    function TripForm(props) {
        _classCallCheck(this, TripForm);

        var _this3 = _possibleConstructorReturn(this, (TripForm.__proto__ || Object.getPrototypeOf(TripForm)).call(this, props));

        _this3.state = {
            modalOpen: false
        };

        _this3.handleOpen = _this3.handleOpen.bind(_this3);
        _this3.handleClose = _this3.handleClose.bind(_this3);
        _this3.handleTrip = _this3.handleTrip.bind(_this3);
        return _this3;
    }

    /*
        Opens the modal using state
    */


    _createClass(TripForm, [{
        key: 'handleOpen',
        value: function handleOpen(e) {
            this.setState({
                modalOpen: true
            });
        }

        /*
            Closes the modal
        */

    }, {
        key: 'handleClose',
        value: function handleClose(e) {
            this.setState({
                modalOpen: false
            });
        }

        /*
            Handles the creation of a trip object
        */

    }, {
        key: 'handleTrip',
        value: function handleTrip(e) {
            e.preventDefault();

            this.setState({
                modalOpen: false
            });

            $("#tripMessage").animate({ width: 'hide' }, 350);

            if ($("#tripTitle").val() == '' || $("#tripLocation").val() == '' || $("#tripDate").val() == '') {
                handleError("All fields are required!");
                return false;
            }

            sendAjax('POST', $("#tripForm").attr("action"), $("#tripForm").serialize(), function () {
                loadTripsFromServer($('token').val());
            });

            document.getElementById("tripTitle").value = "";
            document.getElementById("tripLocation").value = "";
            document.getElementById("tripDate").value = "";
            document.getElementById("tripDetails").value = "";

            return false;
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement('img', { className: 'postButton', onClick: this.handleOpen, src: 'assets/img/newpost.svg' }),
                React.createElement(
                    Modal,
                    { show: this.state.modalOpen, handleClose: this.handleClose },
                    React.createElement(
                        'h1',
                        null,
                        'Start Your Next Adventure!'
                    ),
                    React.createElement(
                        'form',
                        { id: 'tripForm',
                            onSubmit: this.handleTrip,
                            name: 'tripForm',
                            action: '/maker',
                            method: 'POST',
                            className: 'tripForm'
                        },
                        React.createElement('input', { className: 'formInput', id: 'tripTitle', type: 'text', name: 'title', placeholder: 'Title' }),
                        React.createElement('input', { className: 'formInput', id: 'tripLocation', type: 'text', name: 'location', placeholder: 'Location' }),
                        React.createElement('input', { className: 'formInput', id: 'tripDate', type: 'date', name: 'startDate' }),
                        React.createElement('textarea', { className: 'formInput', id: 'tripDetails', type: 'text', name: 'details', placeholder: 'Details' }),
                        React.createElement('input', { className: 'formInput', id: 'token', type: 'hidden', name: '_csrf', value: this.props.csrf }),
                        React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Start the Countdown' }),
                        React.createElement('span', { id: 'errorMessage' })
                    )
                )
            );
        }
    }]);

    return TripForm;
}(React.Component);
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