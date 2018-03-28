/**
* Arquivo responsavel pela chamada de todas as funcionalidades do site PAC2 - MAPA MAIN
*
* @author: Mateus Moura
* @email: chagas[dot]mateus[at]gmail[dot]com
* @date: 26/11/2011
*
* Copyright(c) Todos os direitos reservados a 
*/

if (window.console == null) window.console = { log: function (p) { }, error: function (p) { } };

var oThis = "";

var gMapapac = function () {
    oThis = this;

    this.init();
}

gMapapac.fn = gMapapac.prototype;
gMapapac.fn.extend = jQuery.extend;
gMapapac.fn.extend(
{
    init: function ()
	{
		oThis.markerClusterer = {};
		oThis.loading = $( "#loading" );
		oThis.no_click_filter = $( "#no_click_filter" );
		oThis.buildCluster = false;
		oThis.controlKML = [];
		oThis.kmlpline = [];
		oThis.markerObras = {};
		oThis.verify = false;
		oThis.noRefresh = false;
		oThis.uFilter = false;
		oThis.typesFilter = ["3000", "3002", "3001", "3003", "4004", "4001", "4000", "4002", "4003", "5000", "5002", "5001", "6002", "6000", "6001", "1000", "1004", "1005", "1002", "1001", "1003", "2004", "2005", "2000", "2001", "2002", "2003"];
		oThis.listDivs = []; // Lista das divs do customLabel
		oThis.map = null;
		oThis.imageUrl = base_url + "pub/img/mapa/pin/placa_transparent.png";//'http://chart.apis.google.com/chart?cht=mm&chs=24x32&' + 'chco=FFFFFF,008CFF,000000&ext=.png';
		oThis.styles = {
			t1: { name: "violeta", cod: "A578D4" },
			t2: { name: "verde", cod: "7BC12A" },
			t3: { name: "amarelo", cod: "E1B439" },
			t4: { name: "vermelho", cod: "C63A3A" },
			t5: { name: "laranja", cod: "E47D0D" },
			t6: { name: "azul", cod: "1694BD" }
		};
			
		oThis.getFilters();
	},
	
	getFilters: function() // AJAX DO FILTRO DOS TIPOS
	{
		$.ajax(
		{
			url: base_url + "mapa/structure/",
			dataType: "json",
			success: function( response )
			{
				var subeixos = response.subeixos;
					
				oThis.build.filters( subeixos );
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				console.log( "ERROR - Filtro : ", jqXHR, textStatus, errorThrown )
			}
		});
	},
	
	getMarkers: function( data, url, callback, datatype, type, center ) // AJAX DOS JSONS DAS OBRAS
	{
		!type == undefined
			&& ( type = "GET" );
		
		if( oThis.abortajax != undefined )
		{
			console.log( "ABORTANDO AJAX" );
			url != base_url + "mapa/ufs"
				&& oThis.abortajax.abort();	
		}			
			
		oThis.loading.show();
		oThis.no_click_filter.show();
		
		$.ajax(
		{
			url: url,
			data: data,
			type: type,
			dataType: datatype,
			beforeSend: function( b, c )
			{
				//console.log( "Before:  ", b, c );
				oThis.abortajax = b;
			},
			success: function( response )
			{
				callback( response, center );
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				console.log( "ERROR - JSON : ", jqXHR, textStatus, errorThrown );
				oThis.loading.hide();
				oThis.no_click_filter.hide(); 
			}
		});
	}
});