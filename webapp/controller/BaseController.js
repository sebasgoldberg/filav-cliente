sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
    "sap/ui/model/BindingMode",
], function(Controller, JSONModel, History, BindingMode) {
	"use strict";

	return Controller.extend("iamsoft.filav.cliente.controller.BaseController", {

		onInit: function () {
            this._baseUriService = this.getOwnerComponent()
                .getManifestEntry('/sap.app/dataSources/mainService/uri');
            this.initModel();
        },

        getModel : function (sName) {
            return this.getView().getModel(sName);
        },

        getRouter : function () {
            return this.getOwnerComponent().getRouter();
        },

        getBaseUriService: function(){
            return this._baseUriService;
        },

        getUriService: function(relativeUri){
            return this.getBaseUriService() + relativeUri;
        },

        initModel: function(){
			var oModel = new JSONModel([]);
			this.getView().setModel(oModel);
			this.getView().bindElement('/');
        },

        loadAndBindModel: function(relativeUri, options){

            var _options = Object.assign({},{ 
                modelName:undefined, 
                bindPath:'/', 
                sizeLimit:100,
            }, options || {});

            return new Promise(function(resolve, reject){

                var uriService = this.getUriService(relativeUri);

                jQuery.ajax(
                    uriService,
                    {
                        dataType: "json",
                        success: function(data){
                            var oModel = new JSONModel(data);
                            oModel.setSizeLimit(_options.sizeLimit);
                            this.getView().setModel(oModel, _options.modelName);
                            this.getView().bindElement({path: _options.bindPath, model: _options.modelName})
                            resolve(data);
                        }.bind(this)
                    }
                ).fail(function( jqXHR, textStatus, errorThrown ) {
                    reject(jqXHR)
                });

            }.bind(this));
        },

        get: function(uri, isRelative=true){
            return new Promise(function(resolve, reject){

                let uriService;
                if (isRelative)
                    uriService = this.getUriService(uri);
                else
                    uriService = uri;
                
                jQuery.ajax(uriService,
                    {
                        type : "GET",
                        contentType : "application/json",
                        dataType : "json",
                        success : function(data, textStatus, jqXHR) {
                            resolve(data);
                        }
                    }
                ).fail(function( jqXHR, textStatus, errorThrown ) {
                    reject(jqXHR)
                });
                
            }.bind(this));
        },

        _pp: function(relativeUri, data, type){
            return new Promise(function(resolve, reject){

                var uriService = this.getUriService(relativeUri);
                
                jQuery.ajax(uriService,
                    {
                        type : type,
                        contentType : "application/json",
                        dataType : "json",
                        data: JSON.stringify(data),
                        success : function(data,textStatus, jqXHR) {
                            resolve(data);
                        }
                    }
                ).fail(function( jqXHR, textStatus, errorThrown ) {
                    reject(jqXHR.responseJSON)
                });
                
            }.bind(this));
        },

        post: function(relativeUri, data){
            return this._pp(relativeUri, data, "POST");
        },

        put: function(relativeUri, data){
            return this._pp(relativeUri, data, "PUT");
        },

        patch: function(relativeUri, data){
            return this._pp(relativeUri, data, "PATCH");
        },

        delete: function(relativeUri){
            return new Promise(function(resolve, reject){

                var uriService = this.getUriService(relativeUri);
                
                jQuery.ajax(uriService,
                    {
                        type : "DELETE",
                        contentType : "application/json",
                        dataType : "json",
                        success : function(data,textStatus, jqXHR) {
                            resolve(data);
                        }
                    }
                ).fail(function( jqXHR, textStatus, errorThrown ) {
                    reject(jqXHR.responseJSON)
                });
                
            }.bind(this));
        },

		navBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true /*no history*/);
			}
        },

		removeFromTable: function(tableId, deleterPromiseCreator){
            let oTable = this.getView().byId(tableId)
			var aContexts = oTable.getSelectedContexts();

			if (aContexts && aContexts.length) {

				var deletePromises = aContexts.map(function(oContext) {
					return deleterPromiseCreator(oContext.getObject());
				}.bind(this));

				return Promise.all(deletePromises).then( result => {
                    oTable.removeSelections();
                    return result;
                });
			}

			return new Promise(function(resolve, reject){
				reject("Debe seleccionar al menos un item.");
			})
		},

		setBusy: function(bIsBusy){
            let oControl;
            if (this.busyControl)
                oControl = this.getView().byId(this.busyControl);
            else
                oControl = this.getView();
			oControl.setBusy(bIsBusy);
		},

		notifyListChanged: function(){
			var eventBus = sap.ui.getCore().getEventBus();
			eventBus.publish("ListChannel", "onListChanged", this._listId);
		},

        error: function(message){
            console.error(message);
        },
	});
});