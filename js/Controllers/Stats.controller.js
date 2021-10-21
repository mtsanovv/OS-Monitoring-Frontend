sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend(OS_MONITORING_CONTROLLER_STATS, {
        pageLoaded: function () {
            this.getView().hideLoading();
            this.checkRestApiAvailability();
        },

        checkRestApiAvailability: function() {
            const thisController = this;
            $.ajax({
                type: 'GET',
                url: CONFIG.API_BASE_URL + "/",
                success: function (result) {
                    thisController.passModel(new StatsObjectModel({}));
                },
                error: function (xhr, status, error)
                {
                    thisController.osMonitoringNotAvailable("the API base URL cannot be reached");
                }
            });
        },

        osMonitoringNotAvailable: function(message) {
            const obj = {
                message: "The OS Monitoring REST API is currently unavailable (" + message + ")."
            };
            this.passModel(new StatsObjectModel(obj));
        }
    });
});