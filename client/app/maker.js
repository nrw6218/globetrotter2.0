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
                    <h3 className="emptytrip">No Trips yet</h3>
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
                    <CircularProgressBar 
                        sqSize={200} 
                        strokeWidth={15} 
                        start={this.state.focusTrip ? this.state.focusTrip.startDate : 0} 
                        total={this.state.focusTrip ? this.state.focusTrip.totalDays : 0}
                        title={this.state.focusTrip ? this.state.focusTrip.title : 0}
                    />
                    <h3 className="tripTitle">{this.state.focusTrip ? this.state.focusTrip.title : 'New Trip'}</h3>
                    <h3 className="tripLocation">{this.state.focusTrip ? this.state.focusTrip.location : 'Orlando, Florida'}</h3>
                    <p className="tripDetails">{this.state.focusTrip ? this.state.focusTrip.details : 'No trip selected'}</p>
                </Modal>
            </div>
        );
    }
}

const Modal = ({ handleClose, show, children }) => {

    return (
      <div id="modal" className={show ? "modalOpen" : "modalClosed"}>
        <section className="modalContent">
            {children}
            <img className="closeButton" onClick={handleClose} src="assets/img/close.svg"/>
        </section>
      </div>
    );
};

/*
    Handles the creation of a new trip
*/
const handleTrip = (e) => {
    e.preventDefault();

    $("#tripMessage").animate({width:'hide'},350);

    if($("#tripTitle").val() == '' || $("#tripLocation").val() == '' || $("#tripDate").val() == '') {
        handleError("All fields are required!");
        return false;
    }

    sendAjax('POST', $("#tripForm").attr("action"), $("#tripForm").serialize(), function() {
        loadTripsFromServer($('token').val());
    });

    return false;
};

/*
    Handles the creation of the Trip Form which allows the user to add a new trip to their account
*/
const TripForm = (props) => {
    return (
        <form id="tripForm"
            onSubmit={handleTrip}
            name="tripForm"
            action="/maker"
            method="POST"
            className="tripForm"
        >
            <input className="formInput" id="tripTitle" type="text" name="title" placeholder="Title"/>
            <input className="formInput" id="tripLocation" type="text" name="location" placeholder="Location"/>
            <input className="formInput" id="tripDetails" type="text" name="details" placeholder="Details"/>
            <input className="formInput" id="tripDate" type="date" name="startDate"/>
            <input className="formInput" id="token" type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Make Trip"/>
            <span id="errorMessage"></span>
        </form>
    );
};

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