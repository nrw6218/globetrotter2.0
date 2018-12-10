class SettingsWindow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: props.user,
            csrf: props.csrf,
            accountChange: true,
            passwordChange: true,
        };

        this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this);
        this.handleAccountUpdate = this.handleAccountUpdate.bind(this);
        this.checkAccountValues = this.checkAccountValues.bind(this);
        this.checkPasswordValues = this.checkPasswordValues.bind(this);
    }

    /*
        Takes the input from the password form and makes an ajax request to
        update this user's password
    */
    handlePasswordUpdate(e) {
        e.preventDefault();
    
        if($("#newpass").val() == '' || $("#newpass2").val() == '') {
            handleError("You must fill out all required fields!");
            return false;
        }
    
        sendAjax($("#passwordForm").attr("method"), $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);
    
        return false;
    }
    
    /*
        Takes the input from the account settings form and makes an ajax request to
        update this user's password
    */
    handleAccountUpdate(e) {
        e.preventDefault();
    
        if ($("#first").val() == '' && $("#last").val() == '' && $("#bio").val() == '' && $("#image").val() == '') {
            handleError("You have not made any changes to your account.");
            return false;
        }
    
        sendAjax($("#accountForm").attr("method"), $("#accountForm").attr("action"), $("#accountForm").serialize(), redirect);
    
        return false;
    }
    
    /*
        Checks if there is text within the account settings form and updates the state accordingly
    */
    checkAccountValues(e) {
        if ($("#first").val() == '' && $("#last").val() == '' && $("#bio").val() == '' && $("#image").val() == '') {
            this.setState({ accountChange: true });
        } else {
            this.setState({ accountChange: false });
        }
    }

    /*
        Checks if there is text within the account settings form and updates the state accordingly
    */
    checkPasswordValues(e) {
        if ($("#newpass").val() == '' || $("#newpass2").val() == '') {
            this.setState({ passwordChange: true });
        } else {
            this.setState({ passwordChange: false });
        }
    }

    render() {
        const currentHour = new Date().getHours();
        let greeting = 'Good evening';

        if (currentHour < 12) {
            greeting = 'Good morning';
        } else if (currentHour < 18) {
            greeting = 'Good afternoon';
        }

        return (
            <div className="settings">
                <h1>User Settings</h1>
                <h3>{greeting} {this.state.user.first}</h3>
                <div className="stackable">
                    <form id="accountForm" 
                        name="accountForm" 
                        onSubmit={this.handleAccountUpdate}
                        action="/accountChange" 
                        method="PUT" 
                        className="settingsForm"
                    >
                        <h2>Account</h2>
                        <input className="formInput" id="first" name="first" onChange={this.checkAccountValues} placeholder={this.state.user.first}/>
                        <input className="formInput" id="last" name="last" onChange={this.checkAccountValues} placeholder={this.state.user.last}/>
                        <input className="formInput" id="image" name="image" onChange={this.checkAccountValues} placeholder={this.state.user.imageLink ? this.state.user.imageLink : 'Link a profile picture from the web!'}/>
                        <textarea className="formInput" id="bio" type="text" name="bio" onChange={this.checkAccountValues} placeholder={this.state.user.bio ? this.state.user.bio : "Write a bio..."}></textarea>
                        <input type="hidden" name="_csrf" value={this.state.csrf}/>
                        <input 
                            className="formSubmit" 
                            id="accountSubmit"
                            type="submit" 
                            value="Save Changes"
                            disabled={this.state.accountChange}
                        />
                        <span id="errorMessage"></span>
                    </form>
                </div>
                <div className="stackable">
                    <form id="passwordForm" 
                        name="passwordForm" 
                        onSubmit={this.handlePasswordUpdate}
                        action="/password" 
                        method="PUT" 
                        className="settingsForm"
                    >
                        <h2>Change Password</h2>
                        <input className="formInput" id="newpass" type="password" name="newpass" onChange={this.checkPasswordValues} placeholder="New Password"/>
                        <input className="formInput" id="newpass2" type="password" name="newpass2" onChange={this.checkPasswordValues} placeholder="Retype New Password"/>
                        <input type="hidden" name="_csrf" value={this.state.csrf}/>
                        <input 
                            className="formSubmit" 
                            type="submit" 
                            value="Change Password"
                            disabled={this.state.passwordChange}    
                        />
                        <span id="errorMessage"></span>
                    </form>
                </div>
            </div>
        );
    }
}

const setup = function(csrf, user) {
    ReactDOM.render(
        <SettingsWindow csrf={csrf} user={user} />,
        document.querySelector("#content")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken, result.user);
    });
};

$(document).ready(function() {
    getToken();
});