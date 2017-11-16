sap.ui.define([
	"iamsoft/filav/cliente/controller/BaseController",
], function(BaseController) {
	"use strict";

	return BaseController.extend("iamsoft.filav.cliente.controller.EsperandoNaFila", {

		onInit: function () {
            BaseController.prototype.onInit.bind(this)();
			this.refresh();
        },


        refresh(){
			this.loadAndBindModel('cliente/turnos/ativos');
        }
    

	});
});
