const settingsState = {
    accountChange: true,
};

const handlePasswordUpdate = (e) => {
    e.preventDefault();

    if($("#pass").val() == '' || $("#newpass").val() == '' || $("#newpass2").val() == '') {
        handleError("You must fill out all required fields!");
        return false;
    }

    sendAjax($("#passwordForm").attr("method"), $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);

    return false;
}

const handleAccountUpdate = (e) => {
    e.preventDefault();

    if ($("#first").val() == '' && $("#last").val() == '' && $("#email").val() == '') {
        handleError("You have not made any changes to your account.");
        return false;
    }

    sendAjax($("#accountForm").attr("method"), $("#accountForm").attr("action"), $("#accountForm").serialize(), redirect);

    return false;
}

const checkAccountValues = (e) => {
    console.dir('CHECKING');
    if ($("#first").val() == '' && $("#last").val() == '' && $("#email").val() == '') {
        settingsState.accountChange = true;
        $("#accountSubmit").disabled = true;
    } else {
        settingsState.accountChange = false;
        $("#accountSubmit").disabled = false;
    }
}

const SettingsWindow = (props) => {
    const currentHour = new Date().getHours();
    let greeting = 'Good evening';

    const state = {
        value: '',
    };

    if (currentHour < 12) {
        greeting = 'Good morning';
    } else if (currentHour < 18) {
        greeting = 'Good afternoon';
    }

    return (
        <div className="settings">
            <h1>User Settings</h1>
            <h3>{greeting} {props.user.first}</h3>
            <div className="stackable">
                <form id="accountForm" 
                    name="accountForm" 
                    onSubmit={handleAccountUpdate}
                    action="/accountChange" 
                    method="PUT" 
                    className="settingsForm"
                >
                    <h2>Account</h2>
                    <input className="formInput" id="first" name="first" onChange={checkAccountValues} placeholder={props.user.first}/>
                    <input className="formInput" id="last" name="last" onChange={checkAccountValues} placeholder={props.user.last}/>
                    <input className="formInput" id="email" name="email" onChange={checkAccountValues} placeholder={props.user.email}/>
                    <input type="hidden" name="_csrf" value={props.csrf}/>
                    <input 
                        className="formSubmit" 
                        id="accountSubmit"
                        type="submit" 
                        value="Save Changes"
                    />
                    <span id="errorMessage"></span>
                </form>
            </div>
            <div className="stackable">
                <form id="passwordForm" 
                    name="passwordForm" 
                    onSubmit={handlePasswordUpdate}
                    action="/password" 
                    method="PUT" 
                    className="settingsForm"
                >
                    <h2>Update Password</h2>
                    <input className="formInput" id="pass" type="password" name="pass" placeholder="Current Password"/>
                    <input className="formInput" id="newpass" type="password" name="newpass" placeholder="New Password"/>
                    <input className="formInput" id="newpass2" type="password" name="newpass2" placeholder="Retype New Password"/>
                    <input type="hidden" name="_csrf" value={props.csrf}/>
                    <input className="formSubmit" type="submit" value="Change Password"/>
                    <span id="errorMessage"></span>
                </form>
            </div>
        </div>
    );
};

const setup = function(csrf, user) {
    ReactDOM.render(
        <SettingsWindow csrf={csrf} user={user} />,
        document.querySelector("#settings")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        console.dir(result);
        setup(result.csrfToken, result.user);
    });
};

$(document).ready(function() {
    getToken();
});