"use strict";

/*
    Handles user login
*/
var handleLogin = function handleLogin(e) {
    e.preventDefault();

    $("#tripMessage").animate({ width: "hide" }, 350);

    if ($("#email").val() == '' || $("#pass").val() == '') {
        handleError("Email or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

/*
    Handles user signup
*/
var handleSignup = function handleSignup(e) {
    e.preventDefault();

    $("#tripMessage").animate({ width: 'hide' }, 350);

    if ($("#first").val() == '' || $("#last").val() == '' || $("#email").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("Please fill out all fields.");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Please make sure both passwords match.");
        return false;
    }

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!$('#email').val().match(mailformat)) {
        handleError("Looks like that email isn't quite right... Please try again.");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

/*
    Generates the login form
*/
var LoginWindow = function LoginWindow(props) {
    return React.createElement(
        "form",
        { id: "loginForm",
            name: "loginForm",
            onSubmit: handleLogin,
            action: "/login",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "h1",
            { className: "logo" },
            "Globe-Trotter"
        ),
        React.createElement(
            "p",
            null,
            "Start charting your next adventure!"
        ),
        React.createElement("input", { className: "formInput", id: "email", type: "text", name: "email", placeholder: "Email" }),
        React.createElement("input", { className: "formInput", id: "pass", type: "password", name: "pass", placeholder: "Password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Log in" }),
        React.createElement("span", { id: "errorMessage" }),
        React.createElement(
            "p",
            { className: "signUpPrint" },
            "Don't have an account? ",
            React.createElement(
                "a",
                { id: "signupButton", href: "/signup", onClick: function onClick(e) {
                        return setUpSignupWindow(e, props.csrf);
                    } },
                "Sign up"
            ),
            "!"
        )
    );
};

/*
    Generates the signup form
*/
var SignupWindow = function SignupWindow(props) {
    return React.createElement(
        "form",
        { id: "signupForm",
            name: "signupForm",
            onSubmit: handleSignup,
            action: "/signup",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "h1",
            { className: "logo" },
            "Globe-Trotter"
        ),
        React.createElement(
            "p",
            null,
            "Start charting your next adventure!"
        ),
        React.createElement("input", { className: "formInput", id: "first", type: "text", name: "first", placeholder: "First Name" }),
        React.createElement("input", { className: "formInput", id: "last", type: "text", name: "last", placeholder: "Last Name" }),
        React.createElement("input", { className: "formInput", id: "email", type: "text", name: "email", placeholder: "Email Address" }),
        React.createElement("input", { className: "formInput", id: "pass", type: "password", name: "pass", placeholder: "Password" }),
        React.createElement("input", { className: "formInput", id: "pass2", type: "password", name: "pass2", placeholder: "Retype Password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign Up" }),
        React.createElement("span", { id: "errorMessage" }),
        React.createElement(
            "p",
            { className: "signUpPrint" },
            "Already have an account? ",
            React.createElement(
                "a",
                { id: "loginButton", href: "/login", onClick: function onClick(e) {
                        return setUpLoginWindow(e, props.csrf);
                    } },
                "Log in"
            ),
            "!"
        )
    );
};

/*
    Renders the login form to the screen
*/
var createLoginWindow = function createLoginWindow(csrf) {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

/*
    Renders the signup form to the screen
*/
var createSignupWindow = function createSignupWindow(csrf) {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

/*
    Initial setup of signup window
*/
var setUpSignupWindow = function setUpSignupWindow(e, csrf) {
    e.preventDefault();
    createSignupWindow(csrf);
};

/*
    Initial setup of login window
*/
var setUpLoginWindow = function setUpLoginWindow(e, csrf) {
    e.preventDefault();
    createLoginWindow(csrf);
};

/*
    Gets the token for the current user
*/
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        createLoginWindow(result.csrfToken);
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
