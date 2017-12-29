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
            eventBus.subscribe("CLIENTE", "TURNO_ATIVO", this.onTurnoAtivo, this);

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

            oModel = new JSONModel([]);
            this.getView().setModel(oModel, 'notificacoes');
            this.getView().bindElement({path: '/', model: 'notificacoes'})

            Cliente.getInstance();
        },

		onItemClose: function (oEvent) {
			let oNotificacao = oEvent.getSource().getBindingContext().getObject();
            let oModel = this.getModel('notificacoes');
            let aNotificacoes = oModel.getData();
            aNotificacoes.splice(aNotificacoes.indexOf(oNotificacao));
			oModel.refresh();
		},

        addNotificacao: function(event, data){
            let oModel = this.getModel('notificacoes');
            let notificacoes = oModel.getData();
            notificacoes.unshift({
                title: event,
                description: "",
                datetime: String(Date()),
                priority: "Low",
                });
            oModel.setData(notificacoes)
            oModel.refresh();
        },

        onFilasDisponibles: function(channel, event, data){
            this.addNotificacao(event, data);

            let filas = data.filas;
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

        onQrCode: function(channel, event, data){
			this.addNotificacao(event, data);

            let qrcode = data.qrcode;
            MessageToast.show(qrcode);
            let oModel = this.getModel('view');
            let view = oModel.getData();
            view.qrcode.qrcode = qrcode;
            oModel.refresh();
            this.setQrCodeVisible();
            this.setFormVisible(false);
        },

        onTurnoAtivo: function(channel, event, data){
			this.addNotificacao(event, data);

            let turno = data.turno;
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
