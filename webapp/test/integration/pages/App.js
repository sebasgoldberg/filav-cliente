sap.ui.define([
	"sap/ui/test/Opa5",
	"iamsoft/filav/cliente/test/integration/pages/Common"
], function(Opa5, Common) {
	"use strict";
	var sViewName = "App";
	Opa5.createPageObjects({
		onTheAppPage: {
			baseClass : Common,

			actions: {},

			assertions: {

				iShouldSeeTheApp: function () {
					return this.waitFor({
						id: "app",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The App view is displayed");
						},
						errorMessage: "Did not find the App view"
					});
				}
			}
		}
	});

});