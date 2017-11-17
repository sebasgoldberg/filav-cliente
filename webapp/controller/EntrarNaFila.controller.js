sap.ui.define([
	"iamsoft/filav/cliente/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"iamsoft/filav/cliente/model/Cliente",
    'sap/m/MessageToast',
], function(BaseController, JSONModel, Cliente, MessageToast) {
	"use strict";

	return BaseController.extend("iamsoft.filav.cliente.controller.EntrarNaFila", {

        onInit: function () {
            BaseController.prototype.onInit.bind(this)();

            var eventBus = sap.ui.getCore().getEventBus();
            eventBus.subscribe("CLIENTE", "QR_CODE", this.onQrCode, this);

            let oModel = new JSONModel({
                form: {
                    fila: "",
                },
                qrcode: "",
            });
            this.getView().setModel(oModel, 'view');
            this.getView().bindElement({path: '/', model: 'view'})

            this.loadAndBindModel('filas');

            Cliente.getInstance();
        },

        onQrCode: function(channel, event, qrcode){
            MessageToast.show(qrcode);
            let oModel = this.getModel('view');
            let view = oModel.getData();
            view.qrcode = qrcode;
            oModel.refresh();
        },

        onEntrar(oEvent){
            let view = this.getModel('view').getData();
            Cliente.getInstance().entrarNaFila(view.form.fila);
        },

	});
});
