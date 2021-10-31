sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend(OS_MONITORING_CONTROLLER_USERS_LISTING, {
        pageLoaded: function() {
            this.checkRestApiAvailability(); // on success it also hides the loading
        },

        deleteUserDialogCheckboxChanged(oEvent) {
            const checkbox = oEvent.getSource();
            const modelObj = this.getView().getModel().getProperty("/obj");
            modelObj.setShouldDeleteHome(checkbox.getSelected());
        },

        refreshUsersListing: function() {
            this.getView().createUsersListingTable();
            this.fetchAllUsers();
        },

        deleteUser: function() {
            const thisController = this;
            const modelObj = this.getView().getModel().getProperty("/obj");
            const user = modelObj.getUser();
            const deleteUserDialog = this.globalById("getUsersDeleteUserDialog");

            $.ajax({
                type: 'DELETE',
                url: CONFIG.API_BASE_URL + USERS_PATH + '/' + user.username,
                data: JSON.stringify({ deleteHome: modelObj.getShouldDeleteHome() }),
                success: function(result) {
                    if(deleteUserDialog.isBusy()) {
                        deleteUserDialog.setBusy(false);
                        deleteUserDialog.close();
                    }
                },
                error: function (xhr, status, error) {
                    if(deleteUserDialog.isBusy()) {
                        deleteUserDialog.setBusy(false);
                    }

                    if(xhr.readyState != 4 || xhr.status != 400) {
                        // network error
                        thisController.osMonitoringNotAvailable("the API has returned an unexpected response or might be down");
                        // we need to get the new model after the os monitoring is not available message has been passed
                        thisController.getView().getModel().getProperty("/obj").setShouldNotFireAfterCloseDeleteDialog(true);
                        deleteUserDialog.close();
                    } else {
                        // http error is 400 bad request
                        const result = JSON.parse(xhr.responseText);
                        modelObj.setServerContactErrorMessage(result.exception);
                        thisController.getView().showDeletionErrorMessage();
                    }
                }
            });
        },

        onSearchUsersListing: function(oEvent) {
			const query = this.escapeRegex(oEvent.getSource().getValue());
            const table = this.globalById("usersListingTable");
            const tableItems = table.getItems();
            let usersShown = 0;
            for(const columnListItem of tableItems) {
                const cells = columnListItem.getCells();
                const userData = [];
                for(let i = 0; i < cells.length - 1; i++) {
                    userData.push(cells[i].getText());
                }
                let showRow = false;
                for(const data of userData) {
                    if(data.match(new RegExp("(" + query + ")+", "i"))) {
                        showRow = true;
                        usersShown++;
                        break;
                    }
                }
                columnListItem.setVisible(showRow);
            }
            this.getView().changeUsersCount(usersShown);
        },

        fetchAllUsers: function() {
            const thisController = this;
            $.ajax({
                type: 'GET',
                url: CONFIG.API_BASE_URL + USERS_PATH,
                success: function (result) {
                    thisController.passModel(new UsersListingObjectModel({ users: result }));
                }
            });
        },

        checkRestApiAvailability: function() {
            const thisController = this;
            $.ajax({
                type: 'GET',
                url: CONFIG.API_BASE_URL + "/",
                success: function (result) {
                    thisController.getView().hideLoading();
                    thisController.fetchAllUsers();
                },
                error: function (xhr, status, error)
                {
                    thisController.osMonitoringNotAvailable("the API cannot be reached");
                }
            });
        },

        osMonitoringNotAvailable: function(message) {
            this.displayFatalErrorMessage("The OS Monitoring REST API is currently unavailable (" + message + ").");
        },

        displayFatalErrorMessage: function(message) {
            const obj = {
                message: message
            };
            this.passModel(new UsersListingObjectModel(obj));
        }
    });
});