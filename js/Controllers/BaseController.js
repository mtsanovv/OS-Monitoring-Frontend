sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend(OS_MONITORING_BASE_CONTROLLER, {
        toggleMainPageNav: function(toggle) {
            const sideNavigationToggleButton = this.globalById(SIDE_NAV_TOGGLE_BUTTON);
            sideNavigationToggleButton.setEnabled(toggle);
            for(const item of this.getMainPage().getSideContent().getItem().getItems()) {
                item.setEnabled(toggle);
            }
        },

        globalById: function(id) {
            return sap.ui.getCore().byId(id);
        },

        getRouter: function() {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
    
        getApp: function() {
            return sap.ui.getCore().byId(OS_MONITORING_APP);
        },

        getMainPage: function() {
            return this.globalById(OS_MONITORING_PAGE_MAIN);
        },

        getFirstChildViewController: function() {
            return this.globalById(OS_MONITORING_VIEW_STATS).getController();
        },

        getCurrentRouteName: function() {
            const router = this.getFirstChildViewController().getRouter();
            const currentHash = router.getHashChanger().getHash();
            const routeInfo = router.getRouteInfoByHash(currentHash);
            return routeInfo && routeInfo.name != NAV_HOME ? routeInfo.name : NAV_STATS; 
        },

        getCurrentRouteArguments: function() {
            const router = this.getFirstChildViewController().getRouter();
            const currentHash = router.getHashChanger().getHash();
            return router.getRouteInfoByHash(currentHash).arguments;
        },

        navToPrevious: function(removeLastRoute = true) {
            const mainModel = this.getFirstChildViewController().getOwnerComponent().getModel();
            const routeHistory = mainModel.getProperty("/routeHistory");
            if(removeLastRoute) {
                routeHistory.splice(routeHistory.length - 1, 1); // remove the current route from the route history
            }
            const prevRoute = routeHistory.pop();
            let route = NAV_STATS;
            let args;

            if(prevRoute) {
                route = prevRoute.route;
                args = prevRoute.arguments;
                
                if(route == this.getCurrentRouteName()) {
                    route = NAV_STATS;
                }
            }

            this.navTo(route, args);
        },

        navTo: function(route, args) {
            this.getFirstChildViewController().getRouter().navTo(route, args);
        },

        passModel: function(obj) {
            const ob = {
                obj: obj
            };
            this.getView().setModel(new sap.ui.model.json.JSONModel(ob));
            this.getView().applyModel();
        },
      
        getModelObjProperty: function() {
            return this.getView().getModel().getProperty("/obj");
        },

        navigateToStats: function() {
            this.navTo(NAV_STATS);
        },

        requiredFieldChanged: function(oEvent) {
            const oSource = oEvent.getSource();
            if(oSource.getValueState() == sap.ui.core.ValueState.Error) {
                oSource.setValueState(sap.ui.core.ValueState.None);
            }
        },

        escapeRegex: function(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        }
    });
});