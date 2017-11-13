sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/core/ws/WebSocket",
], function (Object, WebSocket) {
	"use strict";

	let instance;

	let Cliente = Object.extend("iamsoft.filav.cliente.model.Cliente", {
		
		constructor: function () {
			this._socket = new WebSocket("ws://"+window.location.host+"/fila/");
			this._socket.attachOpen( () => {
				// @todo
			});
			this._socket.attachMessage( () => {
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