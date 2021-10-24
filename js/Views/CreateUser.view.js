sap.ui.jsview(OS_MONITORING_VIEW_CREATE_USER, {
   
    getControllerName: function() {
       return OS_MONITORING_CONTROLLER_CREATE_USER;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(OS_MONITORING_PAGE_CREATE_USER, { title: OS_MONITORING_PAGE_CREATE_USER_TITLE, showNavButton: true });
        oPage.setVisible(false)
             .setBusyIndicatorDelay(0)
             .attachNavButtonPress(() => { oController.navToPrevious(); });
        // begin filling page
        this.createErrorDialog(oPage);
        this.createForm(oPage);
        // end filling page
        return oPage;
    },

    createErrorDialog: function(oPage) {
        const oController = this.getController();
        const errorDialog = new sap.m.Dialog('createUserErrorDialog', { title: "An Error has Occurred", titleAlignment: sap.m.TitleAlignment.Center, type: sap.m.DialogType.Message });
        const errorMessageStrip = new sap.m.MessageStrip('createUserDialogErrorStrip', { type: sap.ui.core.MessageType.Error, showIcon: true });
        errorMessageStrip.addStyleClass("sapUiResponsiveMargin");
        const errorMessageDialogButton = new sap.m.Button('createUserErrorDialogButton', { text: 'Continue' , type: sap.m.ButtonType.Emphasized });
        errorMessageDialogButton.attachPress(() => {
            errorDialog.close();
            oController.navigateToStats();
        });
        const errorMessageDialogDismissButton = new sap.m.Button('createUserErrorDialogDismissButton', { text: 'Dismiss' , type: sap.m.ButtonType.Emphasized });
        errorMessageDialogDismissButton.attachPress(() => { errorDialog.close(); });
        errorDialog.addContent(errorMessageStrip);
        errorDialog.addButton(errorMessageDialogButton);
        errorDialog.addButton(errorMessageDialogDismissButton);
        oPage.addContent(errorDialog);
    },

    createForm: function(oPage) {
        const oBlockLayout = new sap.ui.layout.BlockLayout('createUserPageLayout', { background: sap.ui.layout.BlockBackgroundType.Dashboard });
        const blockLayoutRow = new sap.ui.layout.BlockLayoutRow();
        const blockLayoutCell = new sap.ui.layout.BlockLayoutCell({ title: "Enter the new user's details" });
        this.createSuccessMessageStrip(blockLayoutCell);
        this.fillFormBlockLayout(blockLayoutCell);
        blockLayoutRow.addContent(blockLayoutCell);
        oBlockLayout.addContent(blockLayoutRow);
        oPage.addContent(oBlockLayout);
    },

    fillFormBlockLayout: function(blockLayoutCell) {
        const wrappingFlexBox = new sap.m.FlexBox('createUserFormWrappingFlexBox', {alignItems: sap.m.FlexAlignItems.Center, direction: sap.m.FlexDirection.Column });

        this.createUsernameInput(wrappingFlexBox);
        this.createPasswordInput(wrappingFlexBox);
        this.createPasswordConfirmationInput(wrappingFlexBox);
        this.createSubmitButton(wrappingFlexBox);

        blockLayoutCell.addContent(wrappingFlexBox);
    },

    createSuccessMessageStrip: function(blockLayoutCell) {
        const successStrip = new sap.m.MessageStrip('createUserSuccessMessageStrip', { showIcon: true, showCloseButton: true, type: sap.ui.core.MessageType.Success });
        successStrip.addStyleClass("sapUiMediumMarginBottom")
                    .setVisible(false);
        blockLayoutCell.addContent(successStrip);
    },

    createUsernameInput: function(wrappingFlexBox) {
        const oController = this.getController();
        const flexBoxUsernameInput = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, alignItems: sap.m.FlexAlignItems.Start, direction: sap.m.FlexDirection.Column });
        const inputUsername = new sap.m.Input('createUserUsernameInput');
        inputUsername.addStyleClass("sapUiSmallMarginBottom")
                     .setShowValueStateMessage(true)
                     .setValueStateText("Username has to match Linux's username requirements")
                     .setRequired(true)
                     .attachLiveChange((oEvent) => { oController.requiredFieldChanged(oEvent) });
        const inputUsernameLabel = new sap.m.Label({ text: 'Username: ', labelFor: 'createUserUsernameInput' });
        flexBoxUsernameInput.addItem(inputUsernameLabel);
        flexBoxUsernameInput.addItem(inputUsername);
        wrappingFlexBox.addItem(flexBoxUsernameInput);
    },

    createPasswordInput: function(wrappingFlexBox) {
        const oController = this.getController();
        const flexBoxPasswordInput = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, alignItems: sap.m.FlexAlignItems.Start, direction: sap.m.FlexDirection.Column });
        const inputPassword = new sap.m.Input('createUserPasswordInput', { type: sap.m.InputType.Password });
        inputPassword.addStyleClass("sapUiSmallMarginBottom")
                     .setShowValueStateMessage(true)
                     .setValueStateText("Invalid")
                     .setRequired(true)
                     .attachLiveChange((oEvent) => { oController.requiredFieldChanged(oEvent) });
        const inputPasswordLabel = new sap.m.Label({ text: 'Password: ', labelFor: 'createUserPasswordInput' });
        flexBoxPasswordInput.addItem(inputPasswordLabel);
        flexBoxPasswordInput.addItem(inputPassword);
        wrappingFlexBox.addItem(flexBoxPasswordInput);
    },

    createPasswordConfirmationInput: function(wrappingFlexBox) {
        const oController = this.getController();
        const flexBoxPasswordConfirmationInput = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, alignItems: sap.m.FlexAlignItems.Start, direction: sap.m.FlexDirection.Column });
        const inputPasswordConfirmation = new sap.m.Input('createUserPasswordConfirmationInput', { type: sap.m.InputType.Password });
        inputPasswordConfirmation.addStyleClass("sapUiSmallMarginBottom")
                                 .setShowValueStateMessage(true)
                                 .setValueStateText("Invalid")
                                 .setRequired(true)
                                 .attachLiveChange((oEvent) => { oController.requiredFieldChanged(oEvent) });
        const inputPasswordConfirmationLabel = new sap.m.Label({ text: 'Confirm password: ', labelFor: 'createUserPasswordConfirmationInput' });
        flexBoxPasswordConfirmationInput.addItem(inputPasswordConfirmationLabel);
        flexBoxPasswordConfirmationInput.addItem(inputPasswordConfirmation);
        wrappingFlexBox.addItem(flexBoxPasswordConfirmationInput);
    },

    createSubmitButton: function(wrappingFlexBox) {
        const oController = this.getController();
        const submitButton = new sap.m.Button('createUserSubmitButton', { type: sap.m.ButtonType.Emphasized, text: 'Submit' });
        submitButton.attachPress(() => { oController.submitUser(); })
                    .setBusyIndicatorDelay(0);
        wrappingFlexBox.addItem(submitButton);
    },

    applyModel: function() {
        const oController = this.getController();
        const modelObj = this.getModel().getProperty("/obj");
        const message = modelObj.getMessage();
        const submitErrorMessage = modelObj.getSubmitErrorMessage();

        const oSuccessStrip = oController.globalById('createUserSuccessMessageStrip');
        if(oSuccessStrip.getVisible()) {
            oSuccessStrip.setVisible(false);
        }

        if(message) {
            this.showFatalErrorMessage();
        } else if(submitErrorMessage) {
            this.showSubmitErrorMessage();
        }
    },

    showFatalErrorMessage: function() {
        const oController = this.getController();
        const modelObj = this.getModel().getProperty("/obj");
        const message = modelObj.getMessage();

        oController.globalById('createUserDialogErrorStrip').setText(message);
        oController.globalById('createUserErrorDialogDismissButton').setVisible(false);
        oController.globalById('createUserErrorDialogButton').setVisible(true);
        oController.globalById('createUserErrorDialog').open();
    },

    showSubmitErrorMessage: function() {
        const oController = this.getController();
        const modelObj = this.getModel().getProperty("/obj");
        const submitErrorMessage = modelObj.getSubmitErrorMessage();

        oController.globalById('createUserDialogErrorStrip').setText(submitErrorMessage);
        oController.globalById('createUserErrorDialogDismissButton').setVisible(true);
        oController.globalById('createUserErrorDialogButton').setVisible(false);
        oController.globalById('createUserErrorDialog').open();
    },

    showSuccessMessageAndCleanFields: function() {
        const oController = this.getController();
        const modelObj = this.getModel().getProperty("/obj");
        const username = modelObj.getUsername();

        const oSuccessStrip = oController.globalById('createUserSuccessMessageStrip');
        oSuccessStrip.setText("User with username '" + username + "' has been created successfully.")
                     .setVisible(true);

        // destroy the form and recreate it again
        const oFormWrappingFlexBox = oController.globalById('createUserFormWrappingFlexBox');
        oFormWrappingFlexBox.destroyItems();
        oFormWrappingFlexBox.removeAllItems();
        const oFormWrappingFlexBoxParent = oFormWrappingFlexBox.getParent();
        oFormWrappingFlexBoxParent.removeContent(oFormWrappingFlexBox);
        oFormWrappingFlexBox.destroy();
        this.fillFormBlockLayout(oFormWrappingFlexBoxParent);
    },
 
    loadPage: function() {
        // recreate the page layout in order to reset it
        const oController = this.getController();
        const oPage = oController.globalById(OS_MONITORING_PAGE_CREATE_USER);
        const createUserPageLayout = oController.globalById('createUserPageLayout');
        if(createUserPageLayout) {
            oPage.removeContent(createUserPageLayout);
            createUserPageLayout.destroy();
        }
        this.createForm(oPage);
        this.getController().pageLoaded();
    },

    hideLoading: function() {
        const oController = this.getController();
        const thisPage = this.getController().globalById(OS_MONITORING_PAGE_CREATE_USER);
        // mark the app as not busy and show the page
        if(oController.getApp().getBusy()) {
            oController.getApp().setBusy(false);
        }
        if(!thisPage.getVisible()) {
            thisPage.setVisible(true);
        }
    }
 });
  