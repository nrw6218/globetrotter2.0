class ProfileView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        //Calculate unique locations
        let uniqueLocations = [];
        let activityInfo;
        if(this.props.trips) {
            for(let i = 0; i < this.props.trips.length; i++) {
                if(!uniqueLocations.includes(this.props.trips[i].location)) {
                    uniqueLocations.push(this.props.trips[i].location);
                }
            }

            const oneDay = 24 * 60 * 60 * 1000;
            
            activityInfo = this.props.trips.map((trip) => {
                if(new Date(trip.startDate) < new Date(trip.createdDate)) {
                    return (
                        <div key={trip._id} className="information" date={trip.startDate}>
                            <img src={this.props.user.imageLink} />                        
                            <h3 className="activityName">{this.props.user.first} {this.props.user.last}</h3>
                            <h3 className="activityDate">{new Date(trip.startDate).toLocaleDateString()}</h3>
                            <p className="activityDetails">
                                {this.props.user.first} traveled to {trip.location} on {new Date(trip.startDate).toDateString()}! Happy exploring!
                            </p>
                        </div>
                    );
                }
                return (
                    <div key={trip._id} className="information" date={trip.createdDate}>
                        <img src={this.props.user.imageLink} />                        
                        <h3 className="activityName">{this.props.user.first} {this.props.user.last}</h3>
                        <h3 className="activityDate">{new Date(trip.createdDate).toLocaleString()}</h3>
                        <p className="activityDetails">
                            {this.props.user.first} planned a trip to {trip.location} in {Math.round(Math.abs(new Date(trip.startDate).getTime() - new Date(trip.createdDate).getTime()) / oneDay)} days! {trip.details}
                        </p>
                    </div>
                );
            });
        }

        // sort activity info by date
        if(activityInfo) {
            for(let i = 0; i < activityInfo.length; i++) {
                for(let j = 1; j < activityInfo.length; j++) {
                    if(new Date(activityInfo[j-1].props.date) < new Date(activityInfo[j].props.date)) {
                        const temp = activityInfo[i];
                        activityInfo[i] = activityInfo[j];
                        activityInfo[j] = temp;
                    }
                }
            }
        }

        return (
            <div className="profile">
                <div className="banner">
                    <img className="profilePic" src={this.props.user.imageLink && this.props.user.imageLink != "" ? this.props.user.imageLink : "assets/img/profilepic.svg"} alt="Profile Picture"/>
                    <h1>{this.props.user.first} {this.props.user.last}</h1>
                    
                    <p className="profileBio">{this.props.user.bio}</p>

                    <div className="userStat">
                        <h3><b>{this.props.trips ? this.props.trips.length : '?'}</b> Total Trips</h3>
                    </div>
                    <div className="userStat">
                        <h3><b>{uniqueLocations.length}</b> Places Explored</h3>
                    </div>
                </div>
                <div className="timeline">
                    {activityInfo ? activityInfo : null}
                </div>
            </div>
        );
    }
}

/*
    Loads the trips for the specified user from the server
*/
const loadTripsFromServer = (csrf, user) => {
    sendAjax('GET', '/getTrips', null, (data) => {
        ReactDOM.render(
            <ProfileView trips={data.trips} csrf={csrf} user={user} />,
            document.querySelector("#content")
        );
    });
};

/*
    Handles initial page setup
*/
const setup = function(csrf, user) {
    ReactDOM.render(
        <ProfileView csrf={csrf} user={user} />,
        document.querySelector("#content")
    );

    loadTripsFromServer(csrf, user);
};

/*
    Gets the token for the current user
*/
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken, result.user);
    });
};

$(document).ready(function() {
    getToken();
});