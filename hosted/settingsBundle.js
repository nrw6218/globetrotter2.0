"use strict";

var settingsState = {
    accountChange: true
};

var handlePasswordUpdate = function handlePasswordUpdate(e) {
    e.preventDefault();

    if ($("#pass").val() == '' || $("#newpass").val() == '' || $("#newpass2").val() == '') {
        handleError("You must fill out all required fields!");
        return false;
    }

    sendAjax($("#passwordForm").attr("method"), $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);

    return false;
};

var handleAccountUpdate = function handleAccountUpdate(e) {
    e.preventDefault();

    if ($("#first").val() == '' && $("#last").val() == '' && $("#email").val() == '') {
        handleError("You have not made any changes to your account.");
        return false;
    }

    sendAjax($("#accountForm").attr("method"), $("#accountForm").attr("action"), $("#accountForm").serialize(), redirect);

    return false;
};

var checkAccountValues = function checkAccountValues(e) {
    console.dir('CHECKING');
    if ($("#first").val() == '' && $("#last").val() == '' && $("#email").val() == '') {
        settingsState.accountChange = true;
        $("#accountSubmit").disabled = true;
    } else {
        settingsState.accountChange = false;
        $("#accountSubmit").disabled = false;
    }
};

var SettingsWindow = function SettingsWindow(props) {
    var currentHour = new Date().getHours();
    var greeting = 'Good evening';

    var state = {
        value: ''
    };

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
            props.user.first
        ),
        React.createElement(
            "div",
            { className: "stackable" },
            React.createElement(
                "form",
                { id: "accountForm",
                    name: "accountForm",
                    onSubmit: handleAccountUpdate,
                    action: "/accountChange",
                    method: "PUT",
                    className: "settingsForm"
                },
                React.createElement(
                    "h2",
                    null,
                    "Account"
                ),
                React.createElement("input", { className: "formInput", id: "first", name: "first", onChange: checkAccountValues, placeholder: props.user.first }),
                React.createElement("input", { className: "formInput", id: "last", name: "last", onChange: checkAccountValues, placeholder: props.user.last }),
                React.createElement("input", { className: "formInput", id: "email", name: "email", onChange: checkAccountValues, placeholder: props.user.email }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", {
                    className: "formSubmit",
                    id: "accountSubmit",
                    type: "submit",
                    value: "Save Changes"
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
                    onSubmit: handlePasswordUpdate,
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
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { className: "formSubmit", type: "submit", value: "Change Password" }),
                React.createElement("span", { id: "errorMessage" })
            )
        )
    );
};

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
