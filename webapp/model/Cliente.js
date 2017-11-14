sap.ui.define([
	"sap/ui/base/Object",
], function (Object) {
	"use strict";

	let instance;

	let Cliente = Object.extend("iamsoft.filav.cliente.model.Cliente", {
		
		constructor: function () {
			this._socket = new channels.WebSocketBridge();
			this._socket.connect("/fila/");
			this._socket.listen( (action, stream) => {
				// @todo
        console.log(action);
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
