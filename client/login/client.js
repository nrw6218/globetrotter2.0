/*
    Handles user login
*/
const handleLogin = (e) => {
    e.preventDefault();

    $("#tripMessage").animate({width:"hide"},350);

    if($("#email").val() == '' || $("#pass").val() == '') {
        handleError("Email or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());
    
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}

/*
    Handles user signup
*/
const handleSignup = (e) => {
    e.preventDefault();

    $("#tripMessage").animate({width:'hide'},350);

    if($("#first").val() == '' || $("#last").val() == '' || $("#email").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("Please fill out all fields.");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("Please make sure both passwords match.");
        return false;
    }

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!$('#email').val().match(mailformat)) {
        handleError("Looks like that email isn't quite right... Please try again.");
        return false;
    }
    
    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

/*
    Generates the login form
*/
const LoginWindow = (props) => {
    return (
        <form id="loginForm" 
            name="loginForm" 
            onSubmit={handleLogin} 
            action="/login" 
            method="POST" 
            className="mainForm"
        >
            <h1 className="logo">Globe-Trotter</h1>
            <p>
                Start charting your next adventure!
            </p>
            <input className="formInput" id="email" type="text" name="email" placeholder="Email"/>
            <input className="formInput" id="pass" type="password" name="pass" placeholder="Password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Log in"/>
            <span id="errorMessage"></span>
            <p className="signUpPrint">Don't have an account? <a id="signupButton" href="/signup" onClick={e => setUpSignupWindow(e, props.csrf)}>Sign up</a>!</p>
        </form>
    );
};

/*
    Generates the signup form
*/
const SignupWindow = (props) => {
    return (
        <form id="signupForm" 
            name="signupForm" 
            onSubmit={handleSignup} 
            action="/signup" 
            method="POST" 
            className="mainForm"
        >
            <h1 className="logo">Globe-Trotter</h1>
            <p>
                Start charting your next adventure!
            </p>
            <input className="formInput" id="first" type="text" name="first" placeholder="First Name"/>
            <input className="formInput" id="last" type="text" name="last" placeholder="Last Name"/>
            <input className="formInput" id="email" type="text" name="email" placeholder="Email Address"/>
            <input className="formInput" id="pass" type="password" name="pass" placeholder="Password"/>
            <input className="formInput" id="pass2" type="password" name="pass2" placeholder="Retype Password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Sign Up"/>
            <span id="errorMessage"></span>
            <p className="signUpPrint">Already have an account? <a id="loginButton" href="/login" onClick={e => setUpLoginWindow(e, props.csrf)}>Log in</a>!</p>
        </form>
    );
};

/*
    Renders the login form to the screen
*/
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

/*
    Renders the signup form to the screen
*/
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

/*
    Initial setup of signup window
*/
const setUpSignupWindow = (e, csrf) => {
    e.preventDefault();
    createSignupWindow(csrf);
}

/*
    Initial setup of login window
*/
const setUpLoginWindow = (e, csrf) => {
    e.preventDefault();
    createLoginWindow(csrf);
}

/*
    Gets the token for the current user
*/
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        createLoginWindow(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});
