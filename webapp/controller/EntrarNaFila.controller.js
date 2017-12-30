sap.ui.define([
	"iamsoft/filav/cliente/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"iamsoft/filav/cliente/model/Cliente",
    'sap/m/MessageToast',
    "iamsoft/filav/cliente/model/formatter",
], function(BaseController, JSONModel, Cliente, MessageToast, formatter) {
	"use strict";

	return BaseController.extend("iamsoft.filav.cliente.controller.EntrarNaFila", {

        formatter: formatter,

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

            oModel = new JSONModel({});
            this.getView().setModel(oModel, 'turno');
            this.getView().bindElement({path: '/', model: 'turno'})

            oModel = new JSONModel([]);
            this.getView().setModel(oModel, 'notificacoes');
            this.getView().bindElement({path: '/', model: 'notificacoes'})

            Cliente.getInstance();
        },

		onItemClose: function (oEvent) {
			let oNotificacao = oEvent.getSource().getBindingContext(
                'notificacoes').getObject();
            let oModel = this.getModel('notificacoes');
            let aNotificacoes = oModel.getData();
            let index = aNotificacoes.indexOf(oNotificacao)
            aNotificacoes.splice(index, 1);
			oModel.refresh();
		},

        getDescricaoNotificacao: function(event, data){
            switch(event){
                case 'QR_CODE':
                    return "Para entrar numa fila, por favor passar "+
                    "o codigo QR por algum dos scanners disponiveis.";
                case 'TURNO_ATIVO':
                    return "Você já tem turno para ser atendido, o "+
                    "estado atual é: "+data.turno.texto_estado;
                case 'FILAS_DISPONIBLES':
                    return "Por favor selecione a fila em que você "+
                        "deseja ingressar."
            };
        },

        estaNaFila: function(turno){
            return turno&&turno.estado==1;
        },

        foiChamadoNoPosto: function(turno){
            return turno&&turno.estado==3;
        },

        setSairDaFilaButtonVisible: function(visible=true){
            let oModel = this.getModel('view');
            let view = oModel.getData();
            view.sairDaFilaButtonVisible = visible;
            oModel.refresh();
        },

        addNotificacao: function(event, data){
            let oModel = this.getModel('notificacoes');
            let notificacoes = oModel.getData();
            notificacoes.unshift({
                title: event,
                description: this.getDescricaoNotificacao(event, data),
                datetime: String(Date()),
                priority: this.foiChamadoNoPosto(data.turno)?"Medium":"Low",
                });
            oModel.setData(notificacoes)
            oModel.refresh();
        },

        onFilasDisponibles: function(channel, event, data){
            this.addNotificacao(event, data);

            let oModel = this.getModel('turno')
            oModel.setData({});
            oModel.refresh();

            let filas = data.filas;

            oModel = this.getModel();
            oModel.setData(filas);
            oModel.refresh();

            this.setQrCodeVisible(false);
            this.setFormVisible();
            this.setSairDaFilaButtonVisible(false);
        },

        onQrCode: function(channel, event, data){
			this.addNotificacao(event, data);

            let oModel = this.getModel('turno')
            oModel.setData({});
            oModel.refresh();

            let qrcode = data.qrcode;
            oModel = this.getModel('view');
            let view = oModel.getData();
            view.qrcode.qrcode = qrcode;
            oModel.refresh();
            this.setQrCodeVisible();
            this.setFormVisible(false);
            this.setSairDaFilaButtonVisible(false)
        },

        onTurnoAtivo: function(channel, event, data){
			this.addNotificacao(event, data);
            let turno = data.turno;
            let oModel = this.getModel('turno')
            oModel.setData(turno);
            oModel.refresh();
            this.setQrCodeVisible(false);
            this.setFormVisible(false);
            this.setSairDaFilaButtonVisible(this.estaNaFila(turno))
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
            this.setQrCodeVisible(false);
            this.setFormVisible(false);
            this.setSairDaFilaButtonVisible(false);
        },

        onCancelar(oEvent){
            this.setQrCodeVisible();
            this.setFormVisible(false);
            this.setSairDaFilaButtonVisible(false);
        },

        onSairDaFila(oEvent){
            Cliente.getInstance().sairDaFila(
                this.getModel('turno').getData().id);
        },

        onAtualizar(oEvent){
            Cliente.getInstance().atualizar();
        },

	});
});
