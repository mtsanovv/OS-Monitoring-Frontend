sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend(OS_MONITORING_CONTROLLER_MAIN, {
        onInit: function () {
            const thisController = this;
            this.applySavedTheme();
            // create all the views
            this.createViews().then(() => {
                // if there was a specific page requested initially, save it in order to go to it later
                thisController.pushCurrentRouteToRouteHistory();
                // we have saved the initially requested page, now let's clean the request URL
                thisController.getRouter().navTo(NAV_HOME);
                // watch for route changes
                thisController.getRouter().attachRouteMatched(thisController.onRouteChange.bind(thisController));
                // return to the previous view when all views have been created
                thisController.navToPrevious(false);
            });
        },

        pushCurrentRouteToRouteHistory: function() {
            const mainModel = this.getOwnerComponent().getModel();
            const newRoute = {
                route: this.getCurrentRouteName(),
                arguments: this.getCurrentRouteArguments()
            };
            if(mainModel) {
                const routeHistory = mainModel.getProperty('/routeHistory');
                routeHistory.push(newRoute);
            } else {
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({
                        routeHistory: [newRoute]
                    })
                );
            }
        },

        createViews: async function() {
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: OS_MONITORING_VIEW_STATS, viewName: OS_MONITORING_VIEW_STATS})));
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: OS_MONITORING_VIEW_USERS_LISTING, viewName: OS_MONITORING_VIEW_USERS_LISTING})));
        },
    
        onRouteChange: function (oEvent) {
            const routeName = oEvent.getParameter("name");
            const args = oEvent.getParameter("arguments");
            switch(routeName) {
                case NAV_STATS:
                    this.getApp().setBusy(true);
                    this.getApp().to(OS_MONITORING_VIEW_STATS);
                    this.getApp().getCurrentPage().loadPage();
                    // stats is the only page that doesn't toggle app.busy off itself
                    this.getApp().setBusy(false);
                    this.getView().changeSelectedNavKey(routeName);
                    this.changeHTMLPageTitle(OS_MONITORING_PAGE_STATS_TITLE);
                    this.pushCurrentRouteToRouteHistory();
                    break;
                case NAV_USERS_LISTING:
                    this.getApp().setBusy(true);
                    this.getApp().to(OS_MONITORING_VIEW_USERS_LISTING);
                    this.getApp().getCurrentPage().loadPage();
                    this.getView().changeSelectedNavKey(routeName);
                    this.changeHTMLPageTitle(OS_MONITORING_PAGE_USERS_LISTING_TITLE);
                    this.pushCurrentRouteToRouteHistory();
                    break;
            }
        },
    
        sideNavToggleClicked: function() {
            sap.ui.getCore().byId(OS_MONITORING_PAGE_MAIN).toggleSideContentMode();
        },

        changeHTMLPageTitle: function(title) {
            document.title = "OS Monitoring | " + title;
        },
    
        changeThemeClicked: function() {
            const storage =  jQuery.sap.storage(jQuery.sap.storage.Type.local);
            const savedTheme = storage.get(SAVED_THEME_STORAGE_PREFIX); 
            const changeThemeDialog = sap.ui.getCore().byId('changeThemeDialog');
            const themeItems = sap.ui.getCore().byId('changeThemeList').getItems();
            let selectedThemeIndex = 0;
            for(let i = 0; i < THEMES.length; i++) {
                if(THEMES[i].id == savedTheme) {
                    selectedThemeIndex = i;
                    break;
                }
            }

            for(let i = 0; i < themeItems.length; i++) {
                if(i == selectedThemeIndex) {
                    themeItems[i].setIcon("sap-icon://sys-enter-2");
                    continue;
                }
                themeItems[i].setIcon(null);
            }

            changeThemeDialog.open();
        },

        themeChanged: function(themeId) {
            const storage =  jQuery.sap.storage(jQuery.sap.storage.Type.local);
            storage.put(SAVED_THEME_STORAGE_PREFIX, themeId);
            sap.ui.getCore().applyTheme(themeId);
        },

        applySavedTheme: function() {
            const storage =  jQuery.sap.storage(jQuery.sap.storage.Type.local);
            const savedTheme = storage.get(SAVED_THEME_STORAGE_PREFIX);
            if(!savedTheme) {
                this.themeChanged(DEFAULT_THEME);
                return;
            }
            sap.ui.getCore().applyTheme(savedTheme);
        }
    });
});