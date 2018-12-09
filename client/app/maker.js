class TripList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            focusTrip: null,
        }
        
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    /*
        Handles the deletion of a trip
    */
    handleDelete(e) {
        e.preventDefault();

        sendAjax('DELETE', '/deleteTrip', $('#deleteTrip').serialize(), () => {
            loadTripsFromServer($('token').val());
        });

        return false;
    };

    handleClick(trip) {
        console.dir(trip);
        // Enable the modal
        this.setState({
            modalOpen: true,
            focusTrip: trip,
        });
    }

    handleClose(e) {
        this.setState({
            modalOpen: false,
        });
    }

    render() {
        if(this.props.trips.length === 0) {
            return (
                <div className="tripList">
                    <h3 className="emptytrip">Time to fill your map!</h3>
                    <p className="firstTime">Click on the NEW POST button to get started.</p>
                </div>
            );
        }
        const tripNodes = this.props.trips.map((trip) => {
            return (
                <div key={trip._id} onClick={() => this.handleClick(trip)} className="trip">
                    <CircularProgressBar sqSize={200} strokeWidth={15} start={trip.startDate} total={trip.totalDays} title={trip.title}/>
                    <h3 className="tripTitle">{trip.title? trip.title : 'New Trip'}</h3>
                    <h3 className="tripLocation">{trip.location? trip.location : 'Orlando, Florida'}</h3>
                    <p className="tripDetails">{trip.details}</p>
                    <form className="delete"
                        id="deleteTrip"
                        onSubmit={this.handleDelete}
                        name="deleteTrip"
                        action="/deleteTrip"
                        method="DELETE"
                    >
                        <input type="hidden" name="_id" value={trip._id}/>
                        <input type="hidden" id="token" name="_csrf" value={this.props.csrf}/>
                        <input style={{height: "20px"}} type="image" src="/assets/img/deleteButton.png" border="0" alt="Submit" />
                    </form>
                </div>
            );
        });
    
        // Returns the list of trips PLUS a sample of an advertisement in the application
        return (
            <div>
                <div className="tripList">
                    {tripNodes}    
                    <div className="trip advertisement">
                        <img className="adImage" src="assets/img/harrypotter.jpg"/>
                        <h3 className="tripTitle">Wizarding World of Harry Potter</h3>
                        <h3 className="tripLocation">SUGGESTED DESTINATION</h3>
                        <p className="tripDetails">Enter The Wizarding World of Harry Potter™—two lands of groundbreaking thrills and magical fun.</p>
                        <a className="learnMore" href="https://www.universalorlando.com/web/en/us/universal-orlando-resort/the-wizarding-world-of-harry-potter/hub/index.html" target="_blank">Learn More</a>
                    </div>
                </div>
                <Modal show={this.state.modalOpen} handleClose={this.handleClose}>
                    <div className="tripInfo">
                        <div className="tripRing">
                            <CircularProgressBar 
                                sqSize={200} 
                                strokeWidth={15} 
                                start={this.state.focusTrip ? this.state.focusTrip.startDate : 0} 
                                total={this.state.focusTrip ? this.state.focusTrip.totalDays : 0}
                                title={this.state.focusTrip ? this.state.focusTrip.title : 0}
                            />
                        </div>
                        <div className="content">
                            <h2 className="tripTitle">{this.state.focusTrip ? this.state.focusTrip.title : 'New Trip'}</h2>
                            <h3 className="tripLocation">{this.state.focusTrip ? this.state.focusTrip.location : 'Orlando, Florida'} - {this.state.focusTrip ? new Date(this.state.focusTrip.startDate).toLocaleDateString() : 'No start date available'}</h3>
                            <p className="tripDetails">{this.state.focusTrip ? this.state.focusTrip.details : 'No trip selected'}</p>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

/*
    Loads the trips for the specified user from the server
*/
const loadTripsFromServer = (csrf) => {
    sendAjax('GET', '/getTrips', null, (data) => {
        ReactDOM.render(
            <TripList trips={data.trips} csrf={csrf} />,
            document.querySelector("#trips")
        );
    });
};

/*
    Handles initial page setup
*/
const setup = function(csrf) {
    ReactDOM.render(
        <TripForm csrf={csrf} />,
        document.querySelector("#maketrip")
    );

    ReactDOM.render(
        <TripList trips={[]} csrf={csrf}/>,
        document.querySelector("#trips")
    );

    loadTripsFromServer(csrf);
};

/*
    Gets the token for the current user
*/
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});