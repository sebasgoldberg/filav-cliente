sap.ui.define([
    'sap/ui/base/Object',
    'iamsoft/socket/model/Socket'
], function (Object, Socket) {
    'use strict';

    return {

        ESTADOS_TURNO: {
            INICIAL: 0,
            NA_FILA: 1,
            CANCELADO: 2,
            CLIENTE_CHAMADO: 3,
            NO_ATENDIMENTO: 4,
            AUSENTE: 5,
            ATENDIDO: 6,
        },

        Cliente: Object.extend('iamsoft.filav.cliente.model.Cliente', {
            
            constructor: function () {
                this._socket = new Socket('/fila/');
                this._socket.listen( data => {
                    this.publishToEventBus(data.message, data.data);
                });
            },

            publishToEventBus: function(event, data){
                var eventBus = sap.ui.getCore().getEventBus();
                eventBus.publish('CLIENTE', event, data); 
            },

            entrarNaFila: function(fila, qrcode){
                this._socket.send({message: 'ENTRAR_NA_FILA',  data: {fila: fila, qrcode: qrcode}});
            },

            sairDaFila: function(turno){
                this._socket.send({message: 'SAIR_DA_FILA',  data: {turno: turno}});
            },

            atualizar: function(){
                this._socket.send({message: 'GET_ESTADO',  data: {}});
            },

        }),


    };
});
