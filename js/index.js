sap.ui.define([
	"sap/ui/core/ComponentContainer"
], function (ComponentContainer) {
	"use strict";
	const oContainer = new ComponentContainer({
		name: OS_MONITORING_COMPONENT,
		async: true
	});
	oContainer.placeAt("content");
});