sap.ui.jsview(OS_MONITORING_VIEW_STATS, {
   
    getControllerName: function() {
       return OS_MONITORING_CONTROLLER_STATS;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(OS_MONITORING_PAGE_STATS, { title: OS_MONITORING_PAGE_STATS_TITLE });
        oPage.setVisible(false)
             .setBusyIndicatorDelay(0);
        this.createErrorMessageStrip(oPage);

        const verticalLayout = new sap.ui.layout.VerticalLayout();
        verticalLayout.addStyleClass("sapUiResponsiveMargin");

        oPage.addContent(verticalLayout);
        return oPage;
    },

    createErrorMessageStrip: function(oPage) {
        const errorMessageStrip = new sap.m.MessageStrip('errorMessageStrip', { type: sap.ui.core.MessageType.Error, showIcon: true });
        errorMessageStrip.addStyleClass("sapUiResponsiveMargin")
                         .setVisible(false);
        oPage.addContent(errorMessageStrip);
    },

    applyModel: function() {
        const modelObj = this.getModel().getProperty('/obj');
        const errorMessage = modelObj.getMessage();
        const oController = this.getController();
        const statsPage = oController.globalById(OS_MONITORING_PAGE_STATS);
        const errorMessageStrip = oController.globalById('errorMessageStrip');

        statsPage.setBusy(false);
        if(errorMessage) {
            errorMessageStrip.setVisible(true)
                             .setText(errorMessage);
            oController.toggleMainPageNav(false);
        } else {
            errorMessageStrip.setVisible(false);
            oController.toggleMainPageNav(true);
        }
    },
 
    loadPage: function() {
        const oController = this.getController();
        const errorMessageStrip = oController.globalById('errorMessageStrip');
        const statsPage = oController.globalById(OS_MONITORING_PAGE_STATS);
        errorMessageStrip.setVisible(false);
        statsPage.setBusy(true);
        oController.pageLoaded();
    },

    hideLoading: function() {
        const viewPage = this.getController().globalById(OS_MONITORING_PAGE_STATS);
        // stats is the only page that doesn't toggle its app.busy off itself
        if(!viewPage.getVisible()) {
            viewPage.setVisible(true);
        }
    }
 });
  