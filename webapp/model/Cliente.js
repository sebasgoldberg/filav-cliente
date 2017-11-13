sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/core/ws/WebSocket",
], function (Object) {
	"use strict";

	let instance;

	let Cliente = Object.extend("iamsoft.filav.cliente.model.Cliente", {
		
		constructor: function () {
			this._socket = new WebSocket("/fila/");
			this._socket._attachOpen( () => {
				// @todo
			});
			this._socket._attachMessage( () => {
				// @todo
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