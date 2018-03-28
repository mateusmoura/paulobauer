/**
* Arquivo responsavel pela chamada de todas as funcionalidades do site PAC2 - MAPA ACTIONS
*
* @author: Mateus Moura
* @email: chagas[dot]mateus[at]gmail[dot]com
* @date: 26/11/2011
*
* Copyright(c) Todos os direitos reservados a 
*/

gMapapac.fn.extend(
{
	actions:
	{
		init: function()
		{
			oThis.actions.zoomChange();
			oThis.actions.mapChange();
			
			var refresh = document.getElementById('refresh');
			google.maps.event.addDomListener(refresh, 'click', oThis.refreshMap);
		
			var clear = document.getElementById('clear');
			google.maps.event.addDomListener(clear, 'click', oThis.clearClusters);
		},
		
		zoomChange: function() // AÇÕES QUANDO MUDA O ZOOM DO MAPA
		{
			google.maps.event.addListener(oThis.map, 'zoom_changed', function() { // TODA VEZ QUE DER 1 ZOOM NO MAPA EXECUTA ESSA FUNÇÃO
				console.log( "zoom_changed" )
				//oThis.boundsbw = oThis.map.getBounds();
				//oThis.actions.initView( "zoom_changed" );
				oThis.verify = false;
			});	
		},
		
		mapChange: function() // AÇÕES QUANDO MUDA A POSIÇÃO DO MAPA
		{
			google.maps.event.addListener( oThis.map, "mouseup", function( event )
			{
				console.log( "mouseup" );
				oThis.noRefresh == false
					&& oThis.actions.initView( "mouseup" );
			});
			
			google.maps.event.addListener( oThis.map, "mousedown", function()
			{
				console.log( "mousedown" );
			});
			
			google.maps.event.addListener( oThis.map, "bounds_changed", function( bo ) // TODA VEZ QUE MOVER O MAPA EXECUTA ESSA FUNÇÃO
			{	
				console.log( "bounds_changed" );
				oThis.boundsbw = oThis.map.getBounds();
				if( oThis.verify == false )
				{
					oThis.actions.initView( "bounds_changed" );
					oThis.verify = true;
				}
			});
		},
		
		initView: function() // INICIA O GET DOS MARKERS SE MOVER O MAPA
		{
			var bw = oThis.boundsbw,
				sw = bw.getSouthWest(),
				ne = bw.getNorthEast(),
				center = false,
				uf = $( "#estados" ).val(),
				points = [];
				
			uf != ""
				&& ( center = true );
				
			points.push( ne.lat() );
			points.push( ne.lng() );
			points.push( sw.lat() );
			points.push( sw.lng() );
			
			if( oThis.map.zoom <= 6 && oThis.uFilter == false )
			{
				if( oThis.jsonCountStates == undefined )
					oThis.getMarkers( "uf=" + uf + "&tipos=" + oThis.typesFilter, base_url + "mapa/ufs", oThis.build.totalObras, "json" ,"POST", center );
			}
			else if( oThis.map.zoom > 6 && oThis.map.zoom <= 10 && oThis.uFilter == false )
			{
				oThis.jsonCountStates = undefined;
				
				oThis.getMarkers( "uf=" + uf + "&tipos=" + oThis.typesFilter + "&pontos=" + points + "&limit=500&start=0", base_url + "mapa/obras/", oThis.build.clusterObras, "json" ,"POST", false );
				//oThis.getMarkers( "uf=" + uf + "&tipos=" + oThis.typesFilter + "&pontos=" + points + "&limit=500&start=0", base_url + "mapa/obras/", oThis.build.callobras, "json" ,"POST", false );
			}
			else if( oThis.map.zoom > 10 && oThis.uFilter == false )
				oThis.getMarkers( "uf=" + uf + "&tipos=" + oThis.typesFilter + "&pontos=" + points + "&limit=500&start=0", base_url + "mapa/obras/", oThis.build.callobras, "json" ,"POST", false );
			else if( oThis.uFilter )
			{
				var filtro = window.location.pathname.split( "/filtro/" )[ 1 ].split( "/" ),
					eixo = filtro[ 0 ],
					tipo = filtro[ 1 ],
					obra = filtro[ 2 ],
					uf = filtro[ 3 ];
					
				console.log( eixo, tipo, obra, uf )
				
				uf == undefined
					&& ( uf = "BR" );
				
				if( obra != 0 )
					oThis.getMarkers( "hash=" + obra, base_url + "mapa/obra/", oThis.build.urlFilter, "json", "POST", false );
				else if( tipo != 0 )
					oThis.getMarkers( "uf=" + uf + "&tipos=" + [ tipo ] + "&pontos=" + points + "&limit=500&start=0", base_url + "mapa/obras/", oThis.build.clusterObras, "json", "POST", false );
				else if( eixo != 0 )
					oThis.getMarkers( "uf=" + uf + "&tipos=" + [ eixo + 0, eixo + 1, eixo + 2, eixo + 3, eixo + 4, eixo + 5 ] + "&pontos=" + points + "&limit=500&start=0", base_url + "mapa/obras/", oThis.build.clusterObras, "json", "POST", false );
				else if( uf != undefined )
					oThis.getMarkers( "uf=" + uf + "&tipos=" + oThis.typesFilter + "&pontos=" + points + "&limit=500&start=0", base_url + "mapa/obras/", oThis.build.clusterObras, "json", "POST", false );
			}
		},
		
		clearClusters: function( e )
		{
			e.preventDefault();
			e.stopPropagation();
			oThis.markerClusterer.clearMarkers();
		},
		
		openInfoWindow: function( markers, openI ) // ABRE JANELA COM AS INFORMAÇÕES DE 1 OBRA
		{
			openI == undefined
				&& ( openI = false );
			
			var infowindow = new InfoBox({
					content : "building...",
					alignBottom : true,
					pixelOffset : new google.maps.Size(-90, -38),
					closeBoxMargin : "15px",
					infoBoxClearance : new google.maps.Size(1, 1),
					pane : "floatPane",
					disableAutoPan: false,
					isHidden: false
				}),
				includeField = function( title, elem )
				{
					if( elem != undefined && trim(elem) != "" )
					{
						var txt = '<dl>';
						txt += '<dt>'+title+'</dt>';
						txt += '<dd>'+elem+'</dd>';
						txt += '</dl>';
						
						return txt;
					}
				},
				toDate = function(time) {
					if( time != "" )
					{
						var date = new Date(time*1000);
						return date.getDate() + "/" + String(date.getMonth()+1) + "/" + date.getFullYear();
					}
				},
				toCurrency = function(num) {
					num = String(num);
					num = num.split(".").join("").split(",").join(""); // remove points and commas
					num = num.replace(/([0-9]{2}$)/, ",$1"); // cents
					num = num.split("").reverse().join(""); // reverse
					num = num.replace(/([0-9]{3}(?=.+))/g, "$1."); // thousands
					num = num.split("").reverse().join(""); // reverse
					return num == 'undefined' || num == "" ? "" : "R$ " + num;
				},
				trim = function(str) {
					return str.replace(/^\s+|\s+$/g,"");
				};
				
			google.maps.event.addListener(infowindow, 'domready', function() {
				$(".infobox_body .fechar").click();
				$(".infobox_body .fechar").unbind().click(function(event) {
					event.preventDefault();
					if (infowindow) infowindow.close();
					oThis.noRefresh = false;
					
					return false;
				});
			});
			
			for (var b = 0; b < markers.length; b++) {
				var marker = markers[b];
				
				google.maps.event.addListener(marker, 'click', function( event ) {
					var ev = event,
						$mevent = this,
						buildInfo = function( json, center )
						{
							var buildHTML = $( $mevent.html ),
								tablecont = $( "div.content", buildHTML );
							
							$( "span.loading", buildHTML ).remove();
							
							buildHTML.find( "div.infobox_body h3" ).text( json.titulo );
							
							$( includeField( "Estados", json.uf ) ).appendTo( tablecont );
							$( includeField( "Município", json.municipios ) ).appendTo( tablecont );
							$( includeField( "Executor", json.executor ) ).appendTo( tablecont );
							$( includeField( "Responsável", json.responsavel ) ).appendTo( tablecont );
							$( includeField( "Investimento total", toCurrency( json.investimento_total ) ) ).appendTo( tablecont );
							$( includeField( "Investiomento até 2014", toCurrency( json.investimento_2011 ) ) ).appendTo( tablecont );
							$( includeField( "Investimento após 2014", toCurrency( json.investimento_2014 ) ) ).appendTo( tablecont );
							$( includeField( "Data de conclusão", toDate( json.data_conclusao ) ) ).appendTo( tablecont );
							$( includeField( "Estágio", json.estagio ) ).appendTo( tablecont );
							$( includeField( "Referência", toDate( json.data_referencia ) ) ).appendTo( tablecont );
							
							infowindow.setContent(buildHTML.html());
							infowindow.open(oThis.map);
							infowindow.setPosition(event.latLng);
							//infowindow.open(oThis.map, $mevent);
								
							oThis.loading.hide();
						};
					
					oThis.getMarkers( "hash=" + this.hash, base_url + "mapa/obra/", buildInfo, "json", "POST", false );
					oThis.noRefresh = true;
				});
			};
		},
		
		filters: function( $tree ) // AÇÕES DOS FILTROS
		{
			$('#filter').draggable();
			
			$( "span.open", $tree ).unbind().click( function()
			{
				var $bt = $( this );
				
				$bt.siblings( "ul.types" ).slideToggle().toggleClass( "active" );
				
				$bt.siblings( "ul.types" ).hasClass( "active" )
					? $( "img", $bt ).attr( "src", $( "img", $bt ).attr( "src" ).replace( "fech", "aber" ) )
					: $( "img", $bt ).attr( "src", $( "img", $bt ).attr( "src" ).replace( "aber", "fech" ) );
				
				return false;
			});
			
			$( "input.father", $tree ).change( function()
			{
				var $input = $( this ),
					uf = $( "#estados" ).val(),
					center = false;
				
				$input.addClass( "filter" );
				oThis.typesFilter = [];
				
				$( "input:not('.father')", $input.parent( "li.collapsed" ) ).each( function()
				{
					var $in = $( this );
					
					if( $input.is(":checked") )
					{
						$in.attr( "checked", "checked" );
						oThis.typesFilter.push( $in.val() );
					}
					else
						$in.attr( "checked", "" );	
					
				});
				
				$( "input.father:not('.filter')", $tree ).each( function()
				{
					var $inpu = $( this );
					
					$( "input:not('.father')", $inpu.parent() ).each( function()
					{
						var $in = $( this );
						
						//$in.attr( "checked", "checked" );
						$in.is(":checked")
							&& oThis.typesFilter.push( $in.val() );
					});
				});
				
				$input.removeClass( "filter" );
				
				//console.log( oThis.typesFilter, "   <<<<  Father" );
				uf != ""
					&& (center = true);
				
				// REMOVE OU ADICIONA OS MARKERS DE ACORDO COM O FILTRO
				if( oThis.map.zoom <= 6 && oThis.uFilter == false )
				{
					oThis.getMarkers( "uf=" + $( "#estados" ).val() + "&tipos=" + oThis.typesFilter, base_url + "mapa/ufs", oThis.build.totalObras, "json" ,"POST", center );
				}
				else if( oThis.map.zoom > 6 && oThis.map.zoom <= 10 || oThis.uFilter == true && oThis.map.zoom > 4 && oThis.map.zoom <= 10 )
				{
					!$input.is( ":checked" )
						? $( "input.children", $input.parent('li.collapsed') ).each( function()
						{
							var $inID = $( this ).val();
							
							oThis.markerClusterer[ "t"+$inID ] != undefined
								&& oThis.markerClusterer[ "t"+$inID ].clearMarkers();
						})
						: $( "input.children", $input.parent('li.collapsed') ).each( function()
						{
							var $inID = $( this ).val();
							
							if( oThis.jsonClusterMarkers[ "t"+$inID ] != undefined )
							{
								oThis.build.typeClusterObra( '', oThis.jsonClusterMarkers[ "t"+$inID ], oThis.styles["t" + $inID.split( "00" )[ 0 ] ], $inID )
							}
							else
							{
								var points = [],
									bw = oThis.map.getBounds(),
									sw = bw.getSouthWest(),
									ne = bw.getNorthEast();
					
								points.push( ne.lat() );
								points.push( ne.lng() );
								points.push( sw.lat() );
								points.push( sw.lng() );
								
								oThis.getMarkers( "uf=" + $( "#estados" ).val() + "&tipos=" + oThis.typesFilter + "&pontos=" + points + "&limit=500&start=0", base_url + "mapa/obras/", oThis.build.clusterObras, "json" ,"POST", false );
							}
						});
				}
				else if( oThis.map.zoom > 10 || oThis.uFilter == true && oThis.map.zoom > 10 )
				{
					!$input.is( ":checked" )
						? $( "input.children", $input.parent('li.collapsed') ).each( function()
						{
							var $inID = $( this ).val();
							
							if( oThis.markerObras[ "t"+$inID ] != undefined )
								for( var c = 0; c < oThis.markerObras[ "t"+$inID ].length; ++c )
									oThis.markerObras[ "t"+$inID ][ c ].setMap(null);
						})
						: $( "input.children", $input.parent('li.collapsed') ).each( function()
						{
							var $inID = $( this ).val();
							
							if( oThis.jsonClusterMarkers[ "t"+$inID ] != undefined )
							{
								oThis.build.obras( oThis.jsonClusterMarkers[ "t"+$inID ], oThis.styles["t" + $inID.split( "00" )[ 0 ] ], $inID )
							}
							else
							{
								var points = [],
									bw = oThis.map.getBounds(),
									sw = bw.getSouthWest(),
									ne = bw.getNorthEast();
					
								points.push( ne.lat() );
								points.push( ne.lng() );
								points.push( sw.lat() );
								points.push( sw.lng() );
								
								oThis.getMarkers( "uf=" + $( "#estados" ).val() + "&tipos=" + oThis.typesFilter + "&pontos=" + points + "&limit=500&start=0", base_url + "mapa/obras/", oThis.build.callobras, "json" ,"POST", false );
							}
						});
				}
			});
			
			$( "input.children", $tree ).change( function()
			{
				var $in = $( this ),
					uf = $( "#estados" ).val(),
					center = false,
					$inID = $in.val();
				
				oThis.typesFilter = [];
				
				$( "input.father", $in.parents( "li.collapsed" ) ).attr( "checked", "" );
				
				$( "ul.types li.leaf input:checked", $tree ).each( function()
				{
					oThis.typesFilter.push( $( this ).val() );
				});
				
				$( "input.children:checked", $("li.leaf", $in.parents("ul.types") ) ).length == $( "input.children", $("li.leaf", $in.parents("ul.types") ) ).length
						&& $( "input.father", $in.parents( "li.collapsed" ) ).attr( "checked", "checked" );
				
				uf != ""
					&& (center = true);
				
				if( oThis.map.zoom <= 6 )
				{
					oThis.getMarkers( "uf=" + uf + "&tipos=" + oThis.typesFilter, base_url + "mapa/ufs", oThis.build.totalObras, "json" ,"POST", center );
				}
				if( oThis.map.zoom > 6 && oThis.map.zoom <= 10)
				{
					
					if( !$in.is( ":checked" ))
					{
						oThis.markerClusterer[ "t"+$inID ] != undefined
							&& oThis.markerClusterer[ "t"+$inID ].clearMarkers();
					}
					else
					{
						if( oThis.jsonClusterMarkers[ "t"+$inID ] != undefined )
						{
							oThis.build.typeClusterObra( '', oThis.jsonClusterMarkers[ "t"+$inID ], oThis.styles["t" + $inID.split( "00" )[ 0 ] ], $inID );
						}
						else
						{
							var points = [],
								bw = oThis.map.getBounds(),
								sw = bw.getSouthWest(),
								ne = bw.getNorthEast();
				
							points.push( ne.lat() );
							points.push( ne.lng() );
							points.push( sw.lat() );
							points.push( sw.lng() );
							
							oThis.getMarkers( "uf=" + $( "#estados" ).val() + "&tipos=" + oThis.typesFilter + "&pontos=" + points + "&limit=500&start=0", base_url + "mapa/obras/", oThis.build.clusterObras, "json" ,"POST", false );
						}	
					}
				}
				else if( oThis.map.zoom > 10 )
				{
					if( !$in.is( ":checked" ) )
					{
						if( oThis.markerObras[ "t"+$inID ] != undefined )
							for( var c = 0; c < oThis.markerObras[ "t"+$inID ].length; ++c )
								oThis.markerObras[ "t"+$inID ][ c ].setMap(null);
					}
					else
					{ 
						if( oThis.jsonClusterMarkers[ "t"+$inID ] != undefined )
						{
							oThis.build.obras( oThis.jsonClusterMarkers[ "t"+$inID ], oThis.styles["t" + $inID.split( "00" )[ 0 ] ], $inID )
						}
						else
						{
							var points = [],
								bw = oThis.map.getBounds(),
								sw = bw.getSouthWest(),
								ne = bw.getNorthEast();
				
							points.push( ne.lat() );
							points.push( ne.lng() );
							points.push( sw.lat() );
							points.push( sw.lng() );
							
							oThis.getMarkers( "uf=" + $( "#estados" ).val() + "&tipos=" + oThis.typesFilter + "&pontos=" + points + "&limit=500&start=0", base_url + "mapa/obras/", oThis.build.callobras, "json" ,"POST", false );
						}
					}
				}
				
				return false;
			});
			
			$( "#estados" ).change( function()
			{
				var uf = $( this ).val(),
					center = false,
					bw = oThis.map.getBounds(),
					sw = bw.getSouthWest(),
					ne = bw.getNorthEast();
				
				uf != ""
					&& ( center = true );
					
				if( oThis.map.zoom <= 6 )
				{
					oThis.getMarkers( "uf=" + uf + "&tipos=" + oThis.typesFilter, base_url + "mapa/ufs", oThis.build.totalObras, "json" ,"POST", center );
				}
				else if( oThis.map.zoom > 6 && oThis.map.zoom <= 10)
				{
					var callUF = function( json, center )
					{
						oThis.jsonCountStates = json;
						oThis.verify = false;
						
						if( center )
						{
							oThis.map.setCenter( new google.maps.LatLng(oThis.jsonCountStates[0].lat, oThis.jsonCountStates[0].long) );
							oThis.map.setZoom( 7 );
						}
					}
					
					oThis.getMarkers( "uf=" + uf + "&tipos=" + oThis.typesFilter, base_url + "mapa/ufs", callUF, "json" ,"POST", center );
				}
				else if( oThis.map.zoom > 10 )
				{
					var callUF = function( json, center )
					{
						oThis.jsonCountStates = json;
						oThis.verify = false;
						
						if( center )
						{
							oThis.map.setCenter( new google.maps.LatLng(oThis.jsonCountStates[0].lat, oThis.jsonCountStates[0].long) );
							oThis.map.setZoom( 7 );
						}
					}
					
					oThis.getMarkers( "uf=" + uf + "&tipos=" + oThis.typesFilter, base_url + "mapa/ufs", callUF, "json" ,"POST", center );
					
					/*oThis.jsonClusterMarkers != undefined
						&& oThis.noBuild == false && ( oThis.build.callobras( oThis.jsonClusterMarkers, center ) );*/
				}
				
				if( center == false && oThis.map.zoom <= 6 )
				{
					oThis.map.setCenter( new google.maps.LatLng(-13.8, -47.9) );
					oThis.map.setZoom( 5 );
				}
				
				return false;
			});
		}
	}
});

var gmapapac = new gMapapac();

google.load('maps', '3', {
	other_params: 'sensor=false'
});

google.setOnLoadCallback(oThis.build.init);

function CoordMapType(tileSize) {
  this.tileSize = tileSize;
}

CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
  var div = ownerDocument.createElement('DIV');
  div.innerHTML = coord;
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
  div.style.fontSize = '10';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px';
  div.style.borderColor = '#AAAAAA';
  return div;
};