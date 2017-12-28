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
            eventBus.subscribe("CLIENTE", "FILAS_DISPONIBLES", this.onFilasDisponibles, this);

            let oModel = new JSONModel({
                form: {
                    visible: false,
                    fila: "",
                },
                qrcode: {
                    visible: false,
                    qrcode: "",
                }
            });
            this.getView().setModel(oModel, 'view');
            this.getView().bindElement({path: '/', model: 'view'})

            //this.loadAndBindModel('filas');
            oModel = new JSONModel([]);
            this.getView().setModel(oModel);
            this.getView().bindElement({path: '/'})

            Cliente.getInstance();
        },

        onFilasDisponibles: function(channel, event, filas){
            console.log(filas);

            let oModel = this.getModel();
            oModel.setData(filas);
            oModel.refresh();

            oModel = this.getModel('view');
            let view = oModel.getData();
            view.form.fila = '';
            oModel.refresh();

            this.setQrCodeVisible(false);
            this.setFormVisible();
        },

        onQrCode: function(channel, event, qrcode){
            MessageToast.show(qrcode);
            let oModel = this.getModel('view');
            let view = oModel.getData();
            view.qrcode.qrcode = qrcode;
            oModel.refresh();
            this.setQrCodeVisible();
            this.setFormVisible(false);
        },

        setQrCodeVisible(visible=true){
            let oModel = this.getModel('view');
            let view = oModel.getData();
            view.qrcode.visible = visible;
            oModel.refresh();
        },

        setFormVisible(visible=true){
            let oModel = this.getModel('view');
            let view = oModel.getData();
            view.form.visible = visible;
            oModel.refresh();
        },

        onEntrar(oEvent){
            let view = this.getModel('view').getData();
            Cliente.getInstance().entrarNaFila(view.form.fila,
                view.qrcode.qrcode);
            this.setQrCodeVisible();
            this.setFormVisible(false);
        },

        onCancelar(oEvent){
            this.setQrCodeVisible();
            this.setFormVisible(false);
        },

	});
});
