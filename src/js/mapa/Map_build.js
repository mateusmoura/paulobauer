/**
* Arquivo responsavel pela chamada de todas as funcionalidades do site PAC2 - MAPA BUILD
*
* @author: Mateus Moura
* @email: chagas[dot]mateus[at]gmail[dot]com
* @date: 26/11/2011
*
* Copyright(c) Todos os direitos reservados a 
*/

gMapapac.fn.extend(
{
	build:
	{
		init: function()
		{
			console.log( 'initialize' );
			
			oThis.map = new google.maps.Map(document.getElementById('map'), {
				zoom: 5,
				center: new google.maps.LatLng(-13.8, -47.9),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
		
			$.getScript( base_url + "pub/js/mapa/libs/infobox.js" );
			$.getScript( base_url + "pub/js/mapa/coloroverlay.js", function()
			{
				var overlay = new Coloroverlay({ map: oThis.map });
				//console.log("callback overlay" );
			});
			
			oThis.actions.init();
		},
		
		filters: function( subeixos ) // MONTA OS FILTROS DOS MAPAS
		{
			var $tree = $( "ul#tree" );
			
			// VERIFICA SE ESTÁ VINDO DE UM FILTRO
			window.location.pathname.search( "filtro" ) != -1
				? ( oThis.uFilter = true )
				: $( "select#estados option:first" ).attr( "selected", "selected" );
			
			$( subeixos ).each( function()
			{
				var oSub = this,
					subLI = $( '<li class="collapsed"><span class="open"><img src=""></span><input type="checkbox" class="father"><label class="father"></label></li>' ),
					ulType = $( "<ul class='types'></ul>" );
					
					$( oSub.tipos ).each( function()
					{
						var oTyp = this,
							typeLI = $( '<li class="leaf"><span></span><input class="children" type="checkbox"><label></label></li>' );
						
						typeLI
							.find( "input" ).val( oTyp.tipo_hash ).end()
							.find( "label" ).text( oTyp.tipo_titulo ).end()
						.appendTo( ulType );
					});
					
					ulType.hide().appendTo( subLI );
					
					subLI
						.find( "input.father" ).val( oSub.subeixo_hash ).end()
						.find( "label.father" ).text( oSub.subeixo_titulo ).end()
						.find( "span.open img" ).attr( "src", base_url + "pub/img/mapa/filtro/" + oSub.subeixo_hash + "fech.png" ).end()
					.appendTo( $tree );
			});
			
			if(  oThis.uFilter )
			{
				var filtro = window.location.pathname.split( "/filtro/" )[ 1 ].split( "/" ),
					eixo = filtro[ 0 ],
					tipo = filtro[ 1 ],
					obra = filtro[ 2 ],
					uf = filtro[ 3 ];
				
				if( eixo != 0 )
					$( "input.father[value=" + eixo + "]", $tree ).attr( "checked", "checked" ).parent().find( "input.children" ).attr( "checked", "checked" );
				else if( tipo != 0 )
					$( "input.children[value=" + tipo + "]", $tree ).attr( "checked", "checked" );
				
				if( eixo != 0 || tipo != 0 )
				{
					oThis.typesFilter = [];
					
					$( "input:not('.father')", $tree ).each( function()
					{
						$( this ).is(":checked")
							&& oThis.typesFilter.push( $( this ).val() );
					});
				}
				else if( uf != undefined )
					$( "input.father, input.children", $tree ).attr( "checked", "checked" );
				
				uf != undefined
					? $( "#estados option[value=" + uf + "]" ).attr( "selected", "selected" )
					: $( "#estados option:first" ).attr( "selected", "selected" ); // AJAX PARA QUANDO INICIAR O MAPA COM O TOTAL DE OBRAS EM CADA UF
			}
			else
				$( "input.father, input.children", $tree ).attr( "checked", "checked" );
				
			oThis.actions.filters( $tree );
		},
		
		totalObras: function( json, center ) // CALLBACK PARA MONTAR MARKERS COM O VALOR TOTAL DE OBRAS
		{
			var markerImage = new google.maps.MarkerImage(oThis.imageUrl, new google.maps.Size(24, 32));
			
			if( oThis.listDivs.length )
			{
				Label.prototype.onRemove(oThis.listDivs);
				oThis.listDivs = [];
			}
			
			for( var kp = 0; kp < oThis.kmlpline.length; kp++ )
				oThis.kmlpline[ kp ].setMap( null ); 
			
			oThis.kmlpline = [];
			oThis.markersLabel = [];
			oThis.jsonCountStates = json;
			
			// REMOVENDO MARKERS
			for( var b = 0; b < oThis.typesFilter.length; ++b )
				oThis.markerClusterer[ "t" + oThis.typesFilter[b]] != undefined
					&& oThis.markerClusterer[ "t" + oThis.typesFilter[b]].clearMarkers();
			
			for (var i = 0; i < oThis.jsonCountStates.length; ++i) {
				var latLng = new google.maps.LatLng(oThis.jsonCountStates[i].lat, oThis.jsonCountStates[i].long)
				
				var marker = new google.maps.Marker({
					position: latLng,
					draggable: false,
					map: oThis.map,
					icon: markerImage,
					title: oThis.jsonCountStates[i].uf,
					html: '<div id="content">'+
					'<div id="siteNotice">'+
					'</div>'+
					'<h1 id="firstHeading"></h1>'+
					'</div>'+
					'</div>'
				});
				
				 oThis.label = new Label({
				   map: oThis.map
				 }, oThis.jsonCountStates[i].c);
				 
				 oThis.label.bindTo('position', marker, 'position');
				 oThis.label.bindTo('text', marker, 'position');
				
				oThis.markersLabel.push(marker);
			}
			
			if( center )
			{
				oThis.map.setCenter( new google.maps.LatLng(oThis.jsonCountStates[0].lat, oThis.jsonCountStates[0].long) );
				oThis.map.setZoom( 6 );
			}
			
			oThis.loading.hide();
			oThis.no_click_filter.hide();
		},
		
		clusterObras: function( json, center ) // CALLBACK PARA MONTAR MARKERS COM O CLUTERS COLORIDOS
		{
			//console.log( "Passou no CLUSTEROBRAS   ", oThis.markerClusterer );
			var dataCluster = {
				maxZoom: 1,
				gridSize: 20
				//styles: oThis.styles[1]
			},
			color = "";
			oThis.jsonClusterMarkers = json;
			oThis.noBuild = false;
			oThis.buildCluster = true;
			
			if( oThis.listDivs.length )
			{
				Label.prototype.onRemove(oThis.listDivs);
				oThis.listDivs = [];
			}
			
			if( oThis.kmlpline.length )
			{
				for( var kp = 0; kp < oThis.kmlpline.length; kp++ )
					oThis.kmlpline[ kp ].setMap( null ); 
				
				oThis.kmlpline = [];
			}
			
			if( oThis.markerObras.ok != undefined )
			{
				for( var b = 0; b < oThis.typesFilter.length; ++b )
					if( oThis.markerObras[ "t" + oThis.typesFilter[b]] != undefined )
						for( var c = 0; c < oThis.markerObras[ "t" + oThis.typesFilter[b]].length; ++c )
							oThis.markerObras[ "t" + oThis.typesFilter[b]][ c ].setMap(null);
			}
			
			// REMOVENDO MARKERS
			for( var b = 0; b < oThis.typesFilter.length; ++b )
				oThis.markerClusterer[ "t" + oThis.typesFilter[b]] != undefined
					&& oThis.markerClusterer[ "t" + oThis.typesFilter[b]].clearMarkers();
			
			for (var i = 0; i < oThis.typesFilter.length; ++i)
			{
				color = "t" + oThis.typesFilter[i].split( "00" )[ 0 ];
				oThis.build.typeClusterObra( dataCluster, json[ "t"+oThis.typesFilter[i] ], oThis.styles[ color ], oThis.typesFilter[i] );
			}
			
			center
				&& oThis.map.setCenter( new google.maps.LatLng(oThis.jsonCountStates[0].lat, oThis.jsonCountStates[0].long) );
		},
		
		typeClusterObra: function( dataCluster, json, color, typeID ) // MONTA CADA TIPO DE OBRA
		{
			if( json == undefined )
				return false;
			
			var markers = [];
			
			oThis.build.includeMarkers( json, color, markers );
		
			var zoom = parseInt(document.getElementById('zoom').value, 10);
			var size = parseInt(document.getElementById('size').value, 10);
			var style = parseInt(document.getElementById('style').value, 10);
			zoom = zoom == -1 ? null : zoom;
			size = size == -1 ? null : size;
			style = style == -1 ? null: style;
			
			dataCluster.maxZoom = zoom;
			dataCluster.gridSize = 40;
			dataCluster.styles = oThis.styles[style];
			
			oThis.markerClusterer[ "t" + typeID ] = new MarkerClusterer(oThis.map, markers, dataCluster, color.name);
			oThis.loading.hide();
			oThis.no_click_filter.hide();
		},
		
		includeMarkers: function( json, color, markers ) // INCLUINDO MARKES NO MAPA
		{
			var markerImage = new google.maps.MarkerImage(base_url + "pub/img/mapa/pin/" + color.name + ".png", new google.maps.Size(24, 32)),
				strToPoint = function(str)
				{
					if(str.indexOf("\"") == -1) return;
					var orientation = str.split("\"")[1];
					var degrees = str.split("°")[0];
					var minutes = str.split("°")[1].split("'")[0];
					var seconds = str.split("°")[1].split("'")[1];
					var ret = Number(degrees) + (minutes / 60);
					if (!isNaN(parseFloat(seconds)))
						ret += parseFloat(seconds) / 3600;
					if (orientation) {
						if (orientation.toUpperCase() == "S"
								|| orientation.toUpperCase() == "W"
								|| orientation.toUpperCase() == "O")
							ret = -ret;
					}
					return ret;
				};
		
			for (var i = 0; i < json.length; ++i) {
				var latLng = new google.maps.LatLng(json[i].la, json[i].lo);
				
				if( json[i].k.length == 0 )
				{
					var	marker = new google.maps.Marker(
					{
						position: latLng,
						draggable: false,
						map: oThis.map,
						icon: markerImage,
						title: json[i].t,
						hash: json[i].h,
						html: '<div class="infoBox">'+
							'<div class="infobox_header"></div>'+
							'<div class="infobox_body">'+
								'<h3></h3>' +
								'<div class="content"><span class="loading"></span></div>'+
								'<div class="infobox_foot">'+
									'<span>Compartilhe:</span>'+
									'<ul class="compartilhe">'+
										'<li><a title="Facebook" href="javascript: void(0);" onclick="window.open(' + "'http://www.facebook.com/sharer.php?u=http://pac2.digitalg.org/mapa', '_target', 'toolbar=0,status=0,width=650,height=450');" + '"><img alt="Facebook" src="' + base_url + 'pub/img/mapa/tip/facebook.png' + '" /></a></li>'+
										'<li><a title="Twitter" href="javascript: void(0);" onclick="window.open(' + "'http://twitter.com/intent/tweet?url=http://pac2.digitalg.org/mapa&text=Consulte+todas+as+obras+do+PAC2+Brasil','_target', 'toolbar=0,status=0,width=650,height=450'" + ');"><img alt="Twitter" src="' + base_url + 'pub/img/mapa/tip/twitter.png' + '" /></a></li>'+
									'</ul>'+
									'<a class="detalhes" title="Detalhes da obra" href="' + base_url + 'obra/' + json[i].h + '">Detalhes da obra</a>'+
									'<a class="fechar" title="Fechar" href="#">Fechar</a>'+
								'</div>'+
							'</div>'+
							'<div class="infobox_footer"></div>'+
						'</div>'
					});
					
					markers.push(marker);
				}
				else
				{
					var kml = json[i].k.replace( ".kml", "" );
					
					console.log( "Tem KML", kml );
					oThis.controlKML.indexOf( kml ) == -1
						&& oThis.build.buildKML( kml, json[i].h, color.cod );
				}
			};
			
			oThis.actions.openInfoWindow( markers );
		},
		
		callobras: function( json, center ) // CALLBACK PARA MONTAR MARKERS INDIVIDUAIS
		{
			var color = "";
			
			oThis.noBuild = true;
			oThis.markerObras.ok = true;
			
			if( oThis.kmlpline.length )
			{
				for( var kp = 0; kp < oThis.kmlpline.length; kp++ )
					oThis.kmlpline[ kp ].setMap( null ); 
				
				oThis.kmlpline = [];
			}
			
			// REMOVENDO MARKERS
			for( var b = 0; b < oThis.typesFilter.length; ++b )
				oThis.markerClusterer[ "t" + oThis.typesFilter[b]] != undefined
					&& oThis.markerClusterer[ "t" + oThis.typesFilter[b]].clearMarkers();
			
			for (var i = 0; i < oThis.typesFilter.length; ++i)
			{
				color = "t" + oThis.typesFilter[i].split( "00" )[ 0 ];
				oThis.build.obras( json[ "t"+oThis.typesFilter[i] ], oThis.styles[ color ], oThis.typesFilter[i] );
			}
			
			center
				&& oThis.map.setCenter( new google.maps.LatLng(oThis.jsonCountStates[0].lat, oThis.jsonCountStates[0].long) );
			
			oThis.loading.hide();
			oThis.no_click_filter.hide();
		},
		
		obras: function( json, color, typeID ) // MONTA CADA MARKERS INDIVIDUAL
		{  	
			if( json == undefined )
				return false;
			
			var markers = [];
			
			oThis.build.includeMarkers( json, color, markers );
			
			oThis.markerObras[ "t" + typeID ] = markers;
		},
		
		buildKML: function( kml, hash, vcolor )
		{
			//$.getScript( base_url + "pub/js/mapa/ProjectedOverlay.js" );
			var markerImage = new google.maps.MarkerImage(oThis.imageUrl, new google.maps.Size(24, 32)),
				itemBuffer = 0,
				myParser = new geoXML3.parser(
				{
					map: oThis.map,
					zoom: false,
					processStyles: true,
					singleInfoWindow: true,
					createMarker:drawKMLMarker,
					createPolyline:drawKMLPolyline,
					createPolygon:drawKMLPolygon
				});
				
			myParser.parse([ base_url + "pub/kml/" + kml + ".kml" ]); //7915
				
			function drawKMLMarker( placemark )
			{
				console.log( "drawKMLMarker Placemark ", placemark  )
				var markerImage = new google.maps.MarkerImage(oThis.imageUrl, new google.maps.Size(24, 32)),
					latLng = new google.maps.LatLng(placemark.latlng.Qa, placemark.latlng.Ra),
					marker = new google.maps.Marker(
					{
						position: latLng,
						draggable: false,
						map: oThis.map,
						icon: markerImage,
						title: hash,
						html: '<div class="infoBox">'+
							'<div class="infobox_header"></div>'+
							'<div class="infobox_body">'+
								'<h3></h3>' +
								'<div class="content"><span class="loading"></span></div>'+
								'<div class="infobox_foot">'+
									'<span>Compartilhe:</span>'+
									'<ul class="compartilhe">'+
										'<li><a title="Facebook" href="javascript: void(0);" onclick="window.open(' + "'http://www.facebook.com/sharer.php?u=http://pac2.digitalg.org/mapa', '_target', 'toolbar=0,status=0,width=650,height=450');" + '"><img alt="Facebook" src="' + base_url + 'pub/img/mapa/tip/facebook.png' + '" /></a></li>'+
									'<li><a title="Twitter" href="javascript: void(0);" onclick="window.open(' + "'http://twitter.com/intent/tweet?url=http://pac2.digitalg.org/mapa&text=Consulte+todas+as+obras+do+PAC2+Brasil','_target', 'toolbar=0,status=0,width=650,height=450'" + ');"><img alt="Twitter" src="' + base_url + 'pub/img/mapa/tip/twitter.png' + '" /></a></li>'+
									'</ul>'+
									'<a class="detalhes" title="Detalhes da obra" href="' + base_url + 'obra/' + hash + '">Detalhes da obra</a>'+
									'<a class="fechar" title="Fechar" href="#">Fechar</a>'+
								'</div>'+
							'</div>'+
							'<div class="infobox_footer"></div>'+
						'</div>'
					});
			};
			function drawKMLPolyline( placemark )
			{
				console.log( "drawKMLPolyline Placemark ", placemark  )
				var drawKMLPolylineElm = function(placemark, j, path)
					{
						if(j < placemark.LineString.length) {
							var coords = placemark.LineString[j].coordinates,
								bounds = new google.maps.LatLngBounds();
							drawKMLPolylinePoint(placemark, j, coords, 0, path);
						} else {
							onDrawKMLPolyline(path);
						}
					},
					drawKMLPolylinePoint = function(placemark, j, coords, i, path) {
						if(i < coords.length) {
							var pt = new google.maps.LatLng(coords[i].lat, coords[i].lng);
							//thisObj.bounds.extend(pt);
							path.push(pt);
							if(itemBuffer < 10) {
								drawKMLPolylinePoint(placemark, j, coords, Math.floor(i + 1, coords.length), path);
							} else {
								setTimeout(function() {drawKMLPolylinePoint(placemark, j, coords, Math.floor(i + 1, coords.length), path);}, 100);
								itemBuffer = 0;
							}
						} else {
							if(itemBuffer < 10) {
								drawKMLPolylineElm(placemark, j + 1, path);
							} else {
								setTimeout(function() {drawKMLPolylineElm(placemark, j + 1, path);}, 100);
								itemBuffer = 0;
							}
						}
					},
					onDrawKMLPolyline = function(path)
					{
						var color = vcolor,
							weight = "4";
						
						// point to open the infowindow if triggered
						var point = path[Math.floor(path.length / 2)];
						
						// Load basic polyline properties
						var polyOptions = {
							map: oThis.map,
							path: path,
							strokeColor: "#" + color,
							strokeWeight: weight,
							title: hash,
							html: '<div class="infoBox">'+
								'<div class="infobox_header"></div>'+
								'<div class="infobox_body">'+
									'<h3></h3>' +
									'<div class="content"><span class="loading"></span></div>'+
									'<div class="infobox_foot">'+
										'<span>Compartilhe:</span>'+
										'<ul class="compartilhe">'+
											'<li><a title="Facebook" href="javascript: void(0);" onclick="window.open(' + "'http://www.facebook.com/sharer.php?u=http://pac2.digitalg.org/mapa', '_target', 'toolbar=0,status=0,width=650,height=450');" + '"><img alt="Facebook" src="' + base_url + 'pub/img/mapa/tip/facebook.png' + '" /></a></li>'+
									'<li><a title="Twitter" href="javascript: void(0);" onclick="window.open(' + "'http://twitter.com/intent/tweet?url=http://pac2.digitalg.org/mapa&text=Consulte+todas+as+obras+do+PAC2+Brasil','_target', 'toolbar=0,status=0,width=650,height=450'" + ');"><img alt="Twitter" src="' + base_url + 'pub/img/mapa/tip/twitter.png' + '" /></a></li>'+
										'</ul>'+
										'<a class="detalhes" title="Detalhes da obra" href="' + base_url + 'obra/' + hash + '">Detalhes da obra</a>'+
										'<a class="fechar" title="Fechar" href="#">Fechar</a>'+
									'</div>'+
								'</div>'+
								'<div class="infobox_footer"></div>'+
							'</div>'
						};
						
						// create polyline
						var p = new google.maps.Polyline(polyOptions);
						p.bounds = new google.maps.LatLngBounds();
						
						oThis.kmlpline.push( p ); // ESTA SALVANDO OS KMLS PARA REMOVER POSTERIORMENTE
						//thisObj.display = p;
						
						// set click event
						//google.maps.event.addListener(p, "click", function(event) { console.log( "aki vai ser um ajax para infoWindow" ) });
						oThis.actions.openInfoWindow( [ p ] );
						//setLoaded();
					}
				
				drawKMLPolylineElm(placemark, 0, []);
			};
			function drawKMLPolygon( placemark )
			{
				console.log( "drawKMLPolygon Placemark ", placemark  )
				var color = vcolor,
					weight = "4",
					paths = [],
					bounds = new google.maps.LatLngBounds(),
					pathsLength = 0;
				
				for (var polygonPart=0; polygonPart < placemark.Polygon.length; polygonPart ++) {
					for (var j = 0; j < placemark.Polygon[polygonPart].outerBoundaryIs.length; j++) {
						var coords = placemark.Polygon[polygonPart].outerBoundaryIs[j].coordinates,
							path = [];
						for (var i=0;i<coords.length;i++) {
							var pt = new google.maps.LatLng(coords[i].lat, coords[i].lng);
							path.push(pt);
							bounds.extend(pt);
						}
						paths.push(path);
						pathsLength += path.length;
					}
					for (var j=0; j<placemark.Polygon[polygonPart].innerBoundaryIs.length; j++) {
						var coords = placemark.Polygon[polygonPart].innerBoundaryIs[j].coordinates,
							path = [];
						for (var i=0;i<coords.length;i++) {
							var pt = new google.maps.LatLng(coords[i].lat, coords[i].lng);
							path.push(pt);
							thisObj.bounds.extend(pt);
						}
						paths.push(path);
						pathsLength += path.length;
					}
				}
				
				// point to open the infowindow if triggered
				var point = paths[Math.floor(paths.length / 2)];
				
				// Load basic polyline properties
				var polyOptions = {
					map: oThis.map,
					paths: paths,
					strokeColor: "#" + color,
					strokeWeight: weight,
					title: placemark.name,
					fillColor: "#" + color,
					fillOpacity: 0.5
				};
				
				// create polygon
				var p = new google.maps.Polygon(polyOptions);
				p.bounds = bounds;
				//this.display = p;
				
				// set click event
				//google.maps.event.addListener(p, "click", function(event) {console.log( "aki vai ser um ajax para infoWindow" )});
				console.log( "P aki mateus", p );
				oThis.actions.openInfoWindow( p );
				//setLoaded();
				return p;
			};			
		},
		
		urlFilter: function( json, center )
		{
			console.log( json, center );
			var marker = new google.maps.Marker(
			{
				position: new google.maps.LatLng(json.lat_d, json.long_d),
				draggable: false,
				map: oThis.map,
				icon: new google.maps.MarkerImage(base_url + "pub/img/mapa/pin/" + oThis.styles[ "t" + json.tipo_hash.split( "00" )[ 0 ] ].name + ".png", new google.maps.Size(24, 32)),
				title: json.titulo,
				hash: json.hash,
				html: '<div class="infoBox">'+
					'<div class="infobox_header"></div>'+
					'<div class="infobox_body">'+
						'<h3></h3>' +
						'<div class="content"><span class="loading"></span></div>'+
						'<div class="infobox_foot">'+
							'<span>Compartilhe:</span>'+
							'<ul class="compartilhe">'+
								'<li><a title="Facebook" href="javascript: void(0);" onclick="window.open(' + "'http://www.facebook.com/sharer.php?u=http://pac2.digitalg.org/mapa', '_target', 'toolbar=0,status=0,width=650,height=450');" + '"><img alt="Facebook" src="' + base_url + 'pub/img/mapa/tip/facebook.png' + '" /></a></li>'+
								'<li><a title="Twitter" href="javascript: void(0);" onclick="window.open(' + "'http://twitter.com/intent/tweet?url=http://pac2.digitalg.org/mapa&text=Consulte+todas+as+obras+do+PAC2+Brasil','_target', 'toolbar=0,status=0,width=650,height=450'" + ');"><img alt="Twitter" src="' + base_url + 'pub/img/mapa/tip/twitter.png' + '" /></a></li>'+
							'</ul>'+
							'<a class="detalhes" title="Detalhes da obra" href="' + base_url + 'obra/' + json.hash + '">Detalhes da obra</a>'+
							'<a class="fechar" title="Fechar" href="#">Fechar</a>'+
						'</div>'+
					'</div>'+
					'<div class="infobox_footer"></div>'+
				'</div>'
			});
			
			oThis.actions.openInfoWindow( [marker], true );
			oThis.loading.hide();
			oThis.no_click_filter.hide();
		}
	}
});