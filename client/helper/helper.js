/*
    Find the errorMessage object and populate it with a message
*/
const handleError = (message) => {
    $("#errorMessage").text(message);
};

/*
    Redirect the user to the desired location
*/
const redirect = (response) => {
    window.location = response.redirect;
};

/*
    Sends an ajax request
*/
const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};