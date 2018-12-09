class TripForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleTrip = this.handleTrip.bind(this);
    }

    handleOpen(e) {
        this.setState({
            modalOpen: true,
        });
    }

    handleClose(e) {
        this.setState({
            modalOpen: false,
        });
    }

    handleTrip(e) {
        e.preventDefault();

        this.setState({
            modalOpen: false,
        });

        $("#tripMessage").animate({width:'hide'},350);

        if($("#tripTitle").val() == '' || $("#tripLocation").val() == '' || $("#tripDate").val() == '') {
            handleError("All fields are required!");
            return false;
        }

        sendAjax('POST', $("#tripForm").attr("action"), $("#tripForm").serialize(), function() {
            loadTripsFromServer($('token').val());
        });

        document.getElementById("tripTitle").value = "";
        document.getElementById("tripLocation").value = "";
        document.getElementById("tripDate").value = "";
        document.getElementById("tripDetails").value = "";

        return false;
    }

    render() {
        return (
            <div>
                <img className="postButton" onClick={this.handleOpen} src="assets/img/newpost.svg"/>
                <Modal show={this.state.modalOpen} handleClose={this.handleClose}>
                    <h1>Start Your Next Adventure!</h1>
                    <form id="tripForm"
                        onSubmit={this.handleTrip}
                        name="tripForm"
                        action="/maker"
                        method="POST"
                        className="tripForm"
                    >
                        <input className="formInput" id="tripTitle" type="text" name="title" placeholder="Title"/>
                        <input className="formInput" id="tripLocation" type="text" name="location" placeholder="Location"/>
                        <input className="formInput" id="tripDate" type="date" name="startDate"/>
                        <textarea className="formInput" id="tripDetails" type="text" name="details" placeholder="Details"></textarea>
                        <input className="formInput" id="token" type="hidden" name="_csrf" value={this.props.csrf}/>
                        <input className="formSubmit" type="submit" value="Start the Countdown"/>
                        <span id="errorMessage"></span>
                    </form>
                </Modal>
            </div>
        );
    }
}