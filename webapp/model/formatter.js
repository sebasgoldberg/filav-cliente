sap.ui.define([], function () {

	"use strict";

    let NA_FILA=1;
    let CLIENTE_CHAMADO=3;
    let NO_ATENDIMENTO=4

	return {

		turnoStatusTitle: function (oTurno) {
            switch (oTurno.estado){
                case NA_FILA:
                    return "Você esta na fila";
                case CLIENTE_CHAMADO:
                    return "Atenção: você foi chamado no posto "+oTurno.posto.nome
                case NO_ATENDIMENTO:
                    return "Você esta no atendimento";
            }
            return "Não está em nenhuma fila"
		},

		turnoStatusText: function (oTurno) {
            if (!oTurno.texto_estado)
                return "Sem fila"
            return oTurno.texto_estado
		},

		turnoStatusState: function (oTurno) {
            switch (oTurno.estado){
                case NA_FILA:
                    return "Success";
                case CLIENTE_CHAMADO:
                    return "Warning";
                case NO_ATENDIMENTO:
                    return "Success";
            }
			return "None";
		},

	};
});
