sap.ui.define([
	"sap/ui/base/Object",
    "sap/ui/core/ws/WebSocket",
], function (Object, WebSocket) {
	"use strict";

    let ChannelWebSocket = function(path="/fila/"){

        this._socket = new channels.WebSocketBridge();
        this._socket.connect(path);

        this.listen = function(onMessage){
            this._socket.listen(function (action, stream) {
                onMessage(action);
            });
        };

        this.send = function(data){
            this._socket.send(data);
        }

    };


    let WebSocket = function(path="/fila/"){

        this._socket = new WebSocket("ws://"+window.location.host+path);

        this.listen = function(onMessage){
            this._socket.attachMessage(this, function (oEvent) {
                onMessage(JSON.parse(oEvent.getParameter('data')));
            }, this);
        };

        this.send = function(data){
            this._socket.send(JSON.stringify(data));
        }

    };

	let instance;

	let Cliente = Object.extend("iamsoft.filav.cliente.model.Cliente", {
		
		constructor: function () {
			this._socket = new ChannelWebSocket();
			this._socket.listen( data => {
                if (data.message == 'QR_CODE'){
                    var eventBus = sap.ui.getCore().getEventBus();
                    eventBus.publish("CLIENTE", "QR_CODE", data.data.qrcode); 
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
