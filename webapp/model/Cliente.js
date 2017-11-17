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
                if (data.message == 'QR_CODE'){
                    var eventBus = sap.ui.getCore().getEventBus();
                    eventBus.publish("CLIENTE", "QR_CODE", data.data.qrcode); 
                }
                else if (data.message == 'FILAS_DISPONIBLES'){
                    var eventBus = sap.ui.getCore().getEventBus();
                    eventBus.publish("CLIENTE", "FILAS_DISPONIBLES", data.data.filas); 
                }
			});
		},

		entrarNaFila: function(fila){
			this._socket.send({message: 'ENTRAR_NA_FILA', fila: fila})
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
