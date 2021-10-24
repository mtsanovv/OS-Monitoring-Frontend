sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend(OS_MONITORING_CONTROLLER_CREATE_USER, {
        pageLoaded: function () {
            this.checkRestApiAvailability(); // on success it also hides the loading
        },

        saveModel: function() {
            const modelObj = this.getView().getModel().getProperty("/obj");
            modelObj.setUsername(this.globalById('createUserUsernameInput').getValue());
            modelObj.setPassword(this.globalById('createUserPasswordInput').getValue());
            modelObj.setPasswordConfirmation(this.globalById('createUserPasswordConfirmationInput').getValue());
        },

        submitUser: function() {
            this.saveModel();
            const validationSuccessful = this.validateUser();
            if(validationSuccessful) {
                this.globalById(OS_MONITORING_PAGE_CREATE_USER).setBusy(true);
                this.sendUser();
                return;
            }
            // if the validation has not been successful, everything needed has already been shown
        },

        sendUser: function() {
            const thisController = this;
            const modelObj = this.getView().getModel().getProperty("/obj");
            const userToSend = modelObj.getUser();
            $.ajax({
                type: 'POST',
                url: CONFIG.API_BASE_URL + USERS_PATH,
                data: JSON.stringify(userToSend),
                success: function (result) {
                    thisController.globalById(OS_MONITORING_PAGE_CREATE_USER).setBusy(false);
                    thisController.getView().showSuccessMessageAndCleanFields();
                },
                error: function (xhr, status, error)
                {
                    thisController.globalById(OS_MONITORING_PAGE_CREATE_USER).setBusy(false);
                    if(xhr.readyState != 4 || xhr.status != 400) {
                        // netowrk error or http response that's not 400 Bad Request
                        thisController.osMonitoringNotAvailable("the API has returned an unexpected response or might be down");
                    } else {
                        // http error is 400 Bad Request
                        const result = JSON.parse(xhr.responseText);
                        const obj = {
                            submitErrorMessage: result.exception
                        };
                        thisController.passModel(new UserObjectModel(obj));
                    }
                }
            });
        },

        validateUser: function() {
            const modelObj = this.getView().getModel().getProperty("/obj");
            const usernameInput = this.globalById('createUserUsernameInput');
            const passwordInput = this.globalById('createUserPasswordInput');
            const passwordConfirmationInput = this.globalById('createUserPasswordConfirmationInput');

            const passwordValidation = modelObj.validatePassword();
            const passwordConfirmationValidation = modelObj.validatePasswordConfirmation();
            const passwordAndConfirmationMatch = modelObj.validatePasswordAndConfirmationMatch();

            let validationSuccessful = true;

            if(!modelObj.validateUsername()) {
                usernameInput.setValueState(sap.ui.core.ValueState.Error);
                validationSuccessful = false;
            }

            if(!passwordValidation) {
                passwordInput.setValueState(sap.ui.core.ValueState.Error);
                passwordInput.setValueStateText("Password has to be more than 7 characters long");
                validationSuccessful = false;
            }

            if(!passwordConfirmationValidation) {
                passwordConfirmationInput.setValueState(sap.ui.core.ValueState.Error);
                passwordConfirmationInput.setValueStateText("You need to confirm the password");
                validationSuccessful = false;
            }

            if(passwordConfirmationValidation && !passwordAndConfirmationMatch) {
                passwordConfirmationInput.setValueState(sap.ui.core.ValueState.Error);
                passwordConfirmationInput.setValueStateText("Password confirmation does not match the password entered");
                validationSuccessful = false;
            }

            return validationSuccessful;
        },

        checkRestApiAvailability: function() {
            const thisController = this;
            $.ajax({
                type: 'GET',
                url: CONFIG.API_BASE_URL + "/",
                success: function (result) {
                    thisController.getView().hideLoading();
                    thisController.passModel(new UserObjectModel({}));
                },
                error: function (xhr, status, error)
                {
                    thisController.osMonitoringNotAvailable("the API cannot be reached");
                }
            });
        },

        osMonitoringNotAvailable: function(message) {
            const obj = {
                message: "The OS Monitoring REST API is currently unavailable (" + message + ")."
            };
            this.passModel(new UserObjectModel(obj));
        }
    });
});