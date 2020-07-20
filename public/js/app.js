/**
 * Displays the form with which the user can edit the button.
 *
 * @param {String} editFormID - The id of the form.
 * @param {String} buttonID - The id of the button that the form will edit.
 */
function toggleButtonEditForm(editFormID, buttonID) {

    // Reset all form data before displaying it.
    document.getElementById("hyperlinkButtonForm").reset();

    // Make the div holding the form active and thereby visible to the user.
    document.getElementById(editFormID).classList.toggle("active");

    // Set the id of the button as a value of a hidden field inside the form. This will be used later
    // to determine which button we must edit.
    document.getElementById("callingButtonID").value = buttonID;
}

/**
 * Dynamically create the grid that will hold the buttons.
 *
 * @param {integer} rows - The number of rows in the grid
 * @param {integer} cols - The number of colomns in the grid
 * @param {Array} hyperlinkButtonsList - The list of hyperlink buttons that will be in the grid.
 */
function createButtonGrid(rows, cols, hyperlinkButtonsList) {

    const container = document.getElementById("buttonGridContainer");

    container.style.setProperty('--grid-rows', rows);
    container.style.setProperty('--grid-cols', cols);

    for (let index = 1; index <= (rows * cols); index++) {
        let cell = document.createElement("div");
        cell.id = "gridElement" + index;
        container.appendChild(cell).className = "grid-hyperlinkButton";
    }

    setUpGridButtons(hyperlinkButtonsList);
}

/**
 *  Adds the buttons to the grid.
 *
 * @param {Array} hyperlinkButtonsList - The list of hyperlink buttons that will be in the grid.
 */
function setUpGridButtons(hyperlinkButtonsList) {

    // Go through all buttons that have an attached hyperlink to them, add them to the grid, and set their attributes.
    for (let hyperlinkButton of hyperlinkButtonsList) {

        let buttonGridPosition = (hyperlinkButton["buttonID"]).match(/\d+/g);

        addHyperlinkButtonToGrid(buttonGridPosition, hyperlinkButton);
    }

    for (let gridElement of document.getElementById("buttonGridContainer").childNodes) {

        if (gridElement.innerHTML === "") {

            addEmptyButtonToGrid(gridElement);
        }
    }
}

/**
 * Add a button containing a hyperlink to the grid.
 *
 * @param {integer} buttonGridPosition - the position of the button in the grid
 * @param {Array.{buttonID: string, websiteTitle: string, websiteLink: string, buttonColor: string}} - the hyperlink button properties
 */
function addHyperlinkButtonToGrid(buttonGridPosition, button) {

    let newGridButton = document.createElement("button");
    newGridButton.id = button["buttonID"];
    newGridButton.onclick = function () {
        openWebsite(button["websiteLink"]);
    };
    newGridButton.title = button["websiteTitle"];
    newGridButton.style.backgroundColor = button["buttonColor"];
    newGridButton.className = "hyperlinkButton";
    document.getElementById("gridElement" + buttonGridPosition).appendChild(newGridButton);

    addHyperlinkButtonEditDeleteButtons(buttonGridPosition, button);
}

/**
 * Open the indicated website URL in a new browser tab.
 *
 * If the URL does not include "http://" or "https://" then this function adds it to it.
 *
 * @param {string} websiteURL - The URL of the website
 */
function openWebsite(websiteURL) {

    if ((websiteURL.match(/(http(s)?:\/\/.).*/g) !== null)) {

        window.open(websiteURL, '_blank');
    } else {

        window.open('https://' + websiteURL, '_blank');
    }
}

/**
 * Adds the buttons for editing and deleting hyberlink button.
 *
 * @param {integer} buttonGridPosition - the position of the button in the grid
 * @param {Array.{buttonID: string, websiteTitle: string, websiteLink: string, buttonColor: string}} - the hyperlink button properties
 */
function addHyperlinkButtonEditDeleteButtons(buttonGridPosition, button) {

    // Create a container that will hold the "Edit" and "Delete" buttons for the hyperlink button and the buttons to it.
    let editDeleteButtonsContainer = document.createElement("div");
    editDeleteButtonsContainer.id = "gridEditDeleteElement" + (button["buttonID"]).match(/\d+/g);
    editDeleteButtonsContainer.className = "editDeleteButtonsContainer";
    editDeleteButtonsContainer.style.setProperty('border-color', button["buttonColor"]);
    document.getElementById("gridElement" + buttonGridPosition).appendChild(editDeleteButtonsContainer);
    let editButton = document.createElement("button");
    let deleteButton = document.createElement("button");
    editButton.id = "editButton" + (button["buttonID"]).match(/\d+/g);
    deleteButton.id = "deleteButton" + (button["buttonID"]).match(/\d+/g);
    editButton.onclick = function () {

        showHyperlinkButtonEditForm(button);
    };
    deleteButton.onclick = function () {

        deleteHyperlinkButton(button["buttonID"]);
    };
    editButton.className = "hyperlinkEditButton";
    deleteButton.className = "hyperlinkDeleteButton";
    document.getElementById("gridEditDeleteElement" + buttonGridPosition).appendChild(editButton);
    document.getElementById("gridEditDeleteElement" + buttonGridPosition).appendChild(deleteButton);
}


/**
 * Allows the user to edit a hyperlink button by first showing him/her the button edit form, and then
 * modifying the attributes of the button.
 *
 * @param {Array.{buttonID: string, websiteTitle: string, websiteLink: string, buttonColor: string}} - the hyperlink button properties
 */
function showHyperlinkButtonEditForm(button) {

    toggleButtonEditForm('buttonEditModal', button["buttonID"]);

    document.getElementById('websiteNameInput').value = button["websiteTitle"];
    document.getElementById('websiteURLInput').value = button["websiteLink"];
    document.getElementById('buttonColorInput').value = button["buttonColor"];
}

/**
 * Add an empty (not containing a hyperlink) button to a specified grid element.
 *
 * @param {object} gridElement - The grid element (<div>) in which we will add the empty button.
 */
function addEmptyButtonToGrid(gridElement) {

    let newGridButton = document.createElement("button");

    newGridButton.id = "button" + (gridElement.id).match(/\d+/g);
    newGridButton.onclick = function () {
        toggleButtonEditForm('buttonEditModal', newGridButton.id);
    };
    newGridButton.className = "hyperlinkButton";

    gridElement.appendChild(newGridButton);
}

/**
 * Deletes the hyperlink button from the grid and then replaces it with a new empty button.
 *
 * @param {string} buttonID - The id of the button we want to delete.
 */
function deleteHyperlinkButton(buttonID) {

    if (confirm('Delete this hyperlink button?')) {

        $.ajax({
            url: '/',
            type: 'DELETE',
            data: {
                "hyperlinkButtonID": buttonID
            },
            success: function (response) {

                removeButtonFromGrid(buttonID);

                addEmptyButtonToGrid(document.getElementById("gridElement" + buttonID.match(/\d+/g)));

                console.log(response);
            },
            error: function (response) {
                console.log(response);
            }
        });
    } else {

    }
}

/**
 * Removes the deleted button from its position in the grid.
 *
 * @param {string} buttonID - The id of the button we want to delete.
 */
function removeButtonFromGrid(buttonID) {

    document.getElementById("gridElement" + buttonID.match(/\d+/g)).textContent = '';
}

function submitForm() {

    let callingButtonID = document.getElementById("callingButtonID").value;
    let websiteName = document.getElementById("websiteNameInput").value;
    let websiteURL = document.getElementById("websiteURLInput").value;
    let buttonColor = document.getElementById("buttonColorInput").value;

    if (!urlIsValid(websiteURL)) {

        alert("You have entered an invalid website URL, please try again.");

        document.getElementById("websiteURLInput").innerHTML = '';

        return false;
    }

    $.ajax({
        url: '/',
        type: 'POST',
        data: {
            "callingButtonID": callingButtonID,
            "websiteName": websiteName,
            "websiteURL": websiteURL,
            "buttonColor": buttonColor
        },
        success: function (response) {

            removeButtonFromGrid(callingButtonID);

            addHyperlinkButtonToGrid(
                callingButtonID.match(/\d+/g),
                {
                    buttonID: callingButtonID,
                    websiteTitle: websiteName,
                    websiteLink: websiteURL,
                    buttonColor: buttonColor
                }
            );

            toggleButtonEditForm("buttonEditModal", callingButtonID);
        },
        error: function (response) {

            alert(response.responseJSON["error_description"]);

            console.log(response);
        }
    });

    return true;
}

/**
 * Method that validates URLs.
 *
 * @param string websiteURL - the URL we are trying to validate
 * @returns {boolean} - Returns "true" if is valid URL, otherwise returns "false"
 */
function urlIsValid(websiteURL) {

    var pattern = new RegExp(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/);

    console.log("pattern.test(websiteURL) " + pattern.test(websiteURL));

    return pattern.test(websiteURL);

    // return (websiteURL.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) !== null);
}
