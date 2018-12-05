"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SettingsWindow = function (_React$Component) {
    _inherits(SettingsWindow, _React$Component);

    function SettingsWindow(props) {
        _classCallCheck(this, SettingsWindow);

        var _this = _possibleConstructorReturn(this, (SettingsWindow.__proto__ || Object.getPrototypeOf(SettingsWindow)).call(this, props));

        _this.state = {
            user: props.user,
            csrf: props.csrf,
            accountChange: true
        };

        _this.handlePasswordUpdate = _this.handlePasswordUpdate.bind(_this);
        _this.handleAccountUpdate = _this.handleAccountUpdate.bind(_this);
        _this.checkAccountValues = _this.checkAccountValues.bind(_this);
        return _this;
    }

    _createClass(SettingsWindow, [{
        key: "handlePasswordUpdate",
        value: function handlePasswordUpdate(e) {
            e.preventDefault();

            if ($("#pass").val() == '' || $("#newpass").val() == '' || $("#newpass2").val() == '') {
                handleError("You must fill out all required fields!");
                return false;
            }

            sendAjax($("#passwordForm").attr("method"), $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);

            return false;
        }
    }, {
        key: "handleAccountUpdate",
        value: function handleAccountUpdate(e) {
            e.preventDefault();

            if ($("#first").val() == '' && $("#last").val() == '' && $("#email").val() == '') {
                handleError("You have not made any changes to your account.");
                return false;
            }

            sendAjax($("#accountForm").attr("method"), $("#accountForm").attr("action"), $("#accountForm").serialize(), redirect);

            return false;
        }
    }, {
        key: "checkAccountValues",
        value: function checkAccountValues(e) {
            if ($("#first").val() == '' && $("#last").val() == '' && $("#email").val() == '') {
                this.setState({ accountChange: true });
            } else {
                this.setState({ accountChange: false });
            }
            console.dir(this.state.accountChange);
        }
    }, {
        key: "render",
        value: function render() {
            var currentHour = new Date().getHours();
            var greeting = 'Good evening';

            if (currentHour < 12) {
                greeting = 'Good morning';
            } else if (currentHour < 18) {
                greeting = 'Good afternoon';
            }

            return React.createElement(
                "div",
                { className: "settings" },
                React.createElement(
                    "h1",
                    null,
                    "User Settings"
                ),
                React.createElement(
                    "h3",
                    null,
                    greeting,
                    " ",
                    this.state.user.first
                ),
                React.createElement(
                    "div",
                    { className: "stackable" },
                    React.createElement(
                        "form",
                        { id: "accountForm",
                            name: "accountForm",
                            onSubmit: this.handleAccountUpdate,
                            action: "/accountChange",
                            method: "PUT",
                            className: "settingsForm"
                        },
                        React.createElement(
                            "h2",
                            null,
                            "Account"
                        ),
                        React.createElement("input", { className: "formInput", id: "first", name: "first", onChange: this.checkAccountValues, placeholder: this.state.user.first }),
                        React.createElement("input", { className: "formInput", id: "last", name: "last", onChange: this.checkAccountValues, placeholder: this.state.user.last }),
                        React.createElement("input", { className: "formInput", id: "email", name: "email", onChange: this.checkAccountValues, placeholder: this.state.user.email }),
                        React.createElement("input", { type: "hidden", name: "_csrf", value: this.state.csrf }),
                        React.createElement("input", {
                            className: "formSubmit",
                            id: "accountSubmit",
                            type: "submit",
                            value: "Save Changes",
                            disabled: this.state.accountChange
                        }),
                        React.createElement("span", { id: "errorMessage" })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "stackable" },
                    React.createElement(
                        "form",
                        { id: "passwordForm",
                            name: "passwordForm",
                            onSubmit: this.handlePasswordUpdate,
                            action: "/password",
                            method: "PUT",
                            className: "settingsForm"
                        },
                        React.createElement(
                            "h2",
                            null,
                            "Update Password"
                        ),
                        React.createElement("input", { className: "formInput", id: "pass", type: "password", name: "pass", placeholder: "Current Password" }),
                        React.createElement("input", { className: "formInput", id: "newpass", type: "password", name: "newpass", placeholder: "New Password" }),
                        React.createElement("input", { className: "formInput", id: "newpass2", type: "password", name: "newpass2", placeholder: "Retype New Password" }),
                        React.createElement("input", { type: "hidden", name: "_csrf", value: this.state.csrf }),
                        React.createElement("input", { className: "formSubmit", type: "submit", value: "Change Password" }),
                        React.createElement("span", { id: "errorMessage" })
                    )
                )
            );
        }
    }]);

    return SettingsWindow;
}(React.Component);

var setup = function setup(csrf, user) {
    ReactDOM.render(React.createElement(SettingsWindow, { csrf: csrf, user: user }), document.querySelector("#settings"));
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        console.dir(result);
        setup(result.csrfToken, result.user);
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
