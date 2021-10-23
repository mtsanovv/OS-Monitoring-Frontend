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
                    thisController.pollOsStats();
                },
                error: function (xhr, status, error)
                {
                    thisController.osMonitoringNotAvailable("the API cannot be reached");
                }
            });
        },

        pollOsStats: function() {
            const thisController = this;
            $.ajax({
                type: 'GET',
                url: CONFIG.API_BASE_URL + STATS_PATH,
                success: function (result) {
                    const statsObjectModel = new StatsObjectModel(result);
                    statsObjectModel.setAsStatsResponse();
                    thisController.passModel(statsObjectModel);
                    if(thisController.getCurrentRouteName() == NAV_STATS) {
                        // continue polling the os stats only if the user is currently on the stats page
                        setTimeout(() => { thisController.pollOsStats(); }, STATS_POLL_INTERVAL);
                    }
                },
                error: function (xhr, status, error)
                {
                    thisController.checkRestApiAvailability();
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