sap.ui.define([
	"iamsoft/filav/cliente/controller/BaseController",
	"sap/ui/model/json/JSONModel",
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("iamsoft.filav.cliente.controller.EntrarNaFila", {

		onInit: function () {
            BaseController.prototype.onInit.bind(this)();
            this.loadAndBindModel('filas');
        },

	});
});