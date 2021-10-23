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

        this.createStatsTilesTitle(verticalLayout);
        this.createTiles(verticalLayout);

        oPage.addContent(verticalLayout);
        return oPage;
    },

    createTiles: function(verticalLayout) {
        const horizontalLayout = new sap.ui.layout.HorizontalLayout('statsPageTilesContainer', { allowWrapping: true });

        this.createCpuStatusTile(horizontalLayout);
        this.createRamStatusTile(horizontalLayout);
        this.createSwapStatusTile(horizontalLayout);
        this.createDiskStatusTile(horizontalLayout);

        verticalLayout.addContent(horizontalLayout);
    },

    createCpuStatusTile: function(horizontalLayout) {
        const cpuStatusTile = new sap.m.GenericTile({ header: "CPU usage", failedText: STATUS_UNAVAILABLE });
        cpuStatusTile.addStyleClass("sapUiTinyMarginBegin")
                     .addStyleClass("sapUiTinyMarginBottom");
        const tileContent = new sap.m.TileContent({ footer: STATS_POLL_INTERVAL_TEXT });
        const cpuStatusTileContent = new sap.m.NumericContent({ icon: "sap-icon://settings", scale: "%", withMargin: false });
        tileContent.setContent(cpuStatusTileContent);
        cpuStatusTile.addTileContent(tileContent);
        horizontalLayout.addContent(cpuStatusTile);
    },

    createRamStatusTile: function(horizontalLayout) {
        const ramStatusTile = new sap.m.GenericTile({ header: "RAM usage", failedText: STATUS_UNAVAILABLE });
        ramStatusTile.addStyleClass("sapUiTinyMarginBegin")
                     .addStyleClass("sapUiTinyMarginBottom");
        const tileContent = new sap.m.TileContent({ footer: STATS_POLL_INTERVAL_TEXT });
        const ramStatusTileContent = new sap.m.NumericContent({ icon: "sap-icon://heatmap-chart", scale: "%", withMargin: false });
        tileContent.setContent(ramStatusTileContent);
        ramStatusTile.addTileContent(tileContent);
        horizontalLayout.addContent(ramStatusTile);
    },

    createSwapStatusTile: function(horizontalLayout) {
        const swapStatusTile = new sap.m.GenericTile({ header: "Swap usage", failedText: STATUS_UNAVAILABLE });
        swapStatusTile.addStyleClass("sapUiTinyMarginBegin")
                      .addStyleClass("sapUiTinyMarginBottom");
        const tileContent = new sap.m.TileContent({ footer: STATS_POLL_INTERVAL_TEXT });
        const swapStatusTileContent = new sap.m.NumericContent({ icon: "sap-icon://group-2", scale: "%", withMargin: false });
        tileContent.setContent(swapStatusTileContent);
        swapStatusTile.addTileContent(tileContent);
        horizontalLayout.addContent(swapStatusTile);
    },

    createDiskStatusTile: function(horizontalLayout) {
        const diskStatusTile = new sap.m.GenericTile({ header: "Disk usage", failedText: STATUS_UNAVAILABLE });
        diskStatusTile.addStyleClass("sapUiTinyMarginBegin")
                      .addStyleClass("sapUiTinyMarginBottom");
        const tileContent = new sap.m.TileContent({ footer: STATS_POLL_INTERVAL_TEXT });
        const diskStatusTileContent = new sap.m.NumericContent({ icon: "sap-icon://it-host", scale: "%", withMargin: false });
        tileContent.setContent(diskStatusTileContent);
        diskStatusTile.addTileContent(tileContent);
        horizontalLayout.addContent(diskStatusTile);
    },

    createStatsTilesTitle: function(verticalLayout) {
        const layoutStatsTitle = new sap.m.Title({ text: "System resources usage", titleStyle: sap.ui.core.TitleLevel.H4 });
        layoutStatsTitle.addStyleClass("sapUiTinyMarginBegin")
                        .addStyleClass("sapUiTinyMarginTopBottom");
        verticalLayout.addContent(layoutStatsTitle);
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
        const isStatsResponse = modelObj.getIsStatsResponse();
        const oController = this.getController();
        const statsPage = oController.globalById(OS_MONITORING_PAGE_STATS);
        const errorMessageStrip = oController.globalById('errorMessageStrip');

        statsPage.setBusy(false);

        if(!isStatsResponse) {
            this.setStateOfStatsTiles(sap.m.LoadState.Loading);
        } else {
            this.setStateOfStatsTiles(sap.m.LoadState.Loaded);
            this.updateStatsTiles(modelObj);
        }

        if(errorMessage) {
            errorMessageStrip.setVisible(true)
                             .setText(errorMessage);
            oController.toggleMainPageNav(false);
            this.setStateOfStatsTiles(sap.m.LoadState.Failed);
        } else {
            errorMessageStrip.setVisible(false);
            oController.toggleMainPageNav(true);
        }
    },

    updateStatsTiles: function(modelObj) {
        const oController = this.getController();
        const cpuUsage = modelObj.getCpu();
        const ramUsage = modelObj.getRam();
        const swapUsage = modelObj.getSwap();
        const diskUsage = modelObj.getDisk();
        const allStats = [cpuUsage, ramUsage, swapUsage, diskUsage];
        const statsPageTiles = oController.globalById('statsPageTilesContainer').getContent();
        for(let i = 0; i < statsPageTiles.length; i++) {
            const value = allStats[i];
            const valueColor = this.getCorrespondingValueColor(value);
            const genericTile = statsPageTiles[i];
            const allTileContent = genericTile.getTileContent();
            const numericTileContent = allTileContent[0].getContent();
            numericTileContent.setValue(value);
            numericTileContent.setValueColor(valueColor);
        }
    },

    getCorrespondingValueColor: function(value) {
        if(value < 50) {
            return sap.m.ValueColor.Good;
        } else if(value < 75) {
            return sap.m.ValueColor.Critical;
        }
        return sap.m.ValueColor.Error;
    },

    setStateOfStatsTiles: function(state) {
        const oController = this.getController();
        const statsPageTiles = oController.globalById('statsPageTilesContainer').getContent();
        for(const tile of statsPageTiles) {
            tile.setState(state);
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
  