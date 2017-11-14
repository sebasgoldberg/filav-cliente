sap.ui.define([
	"iamsoft/filav/cliente/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"iamsoft/filav/cliente/model/Cliente",
], function(BaseController, JSONModel, Cliente) {
	"use strict";

	return BaseController.extend("iamsoft.filav.cliente.controller.EntrarNaFila", {

      onInit: function () {
          BaseController.prototype.onInit.bind(this)();

          let oModel = new JSONModel({
            fila: "",
          });
          this.getView().setModel(oModel, 'form');
          this.getView().bindElement({path: '/', model: 'form'})

          this.loadAndBindModel('filas');

          Cliente.getInstance();
      },

      onEntrar(oEvent){
          let form = this.getModel('form').getData();
          Cliente.getInstance().entrarNaFila(form.fila);
      }

	});
});
