sap.ui.define([
	"sap/ui/base/Object",
    "iamsoft/socket/model/Socket"
], function (Object, Socket) {
	"use strict";

	let instance;

	let Cliente = Object.extend("iamsoft.filav.cliente.model.Cliente", {
		
		constructor: function () {
			this._socket = new Socket('/fila/');
			this._socket.listen( data => {
                this.publishToEventBus(data.message, data.data);
			});
		},

        publishToEventBus: function(event, data){
            var eventBus = sap.ui.getCore().getEventBus();
            eventBus.publish("CLIENTE", event, data); 
        },

		entrarNaFila: function(fila, qrcode){
			this._socket.send({message: 'ENTRAR_NA_FILA',  data: {fila: fila, qrcode: qrcode}})
		},

	});

	return {
        getInstance: function () {
            if (!instance) {
                instance = new Cliente();
            }
            return instance;
        }
    };
});
