sap.ui.define([
    'iamsoft/filav/cliente/model/Cliente',
], function (Cliente) {

    'use strict';

    let ESTADOS_TURNO = Cliente.ESTADOS_TURNO;

    return {

        turnoStatusTitle: function (oTurno) {
            switch (oTurno.estado){
            case ESTADOS_TURNO.NA_FILA:
                return 'Você esta na fila';
            case ESTADOS_TURNO.CLIENTE_CHAMADO:
                return 'Atenção: você foi chamado no posto '+oTurno.posto.nome;
            case ESTADOS_TURNO.NO_ATENDIMENTO:
                return 'Você esta no atendimento';
            }
            return 'Não está em nenhuma fila';
        },

        turnoStatusText: function (oTurno) {
            if (!oTurno.texto_estado)
                return 'Sem fila';
            return oTurno.texto_estado;
        },

        turnoStatusState: function (oTurno) {
            switch (oTurno.estado){
            case ESTADOS_TURNO.NA_FILA ||
                ESTADOS_TURNO.NO_ATENDIMENTO ||
                ESTADOS_TURNO.ATENDIDO:
                return 'Success';
            case ESTADOS_TURNO.CLIENTE_CHAMADO:
                return 'Warning';
            case ESTADOS_TURNO.AUSENTE:
                return 'Error';
            }
            return 'None';
        },

    };
});
