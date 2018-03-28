/**
* Arquivo responsavel pela chamada de todas as funcionalidades do hotsite Divulgação do novo sistema de classificação
*
* @author: Mateus Moura chagas[dot]mateus[at]gmail[dot]com
* @date: 13/06/2011
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
		oThis.typesFilter = ["3000", "3002", "3001", "3003", "4004", "4001", "4000", "4002", "4003", "5000", "5002", "5001", "6002", "6000", "6001", "1000", "1004", "1005", "1002", "1001", "1003", "2004", "2005", "2000", "2001", "2002", "2003"];
		oThis.listDivs = []; // Lista das divs do customLabel
		oThis.map = null;
		oThis.imageUrl = base_url + "pub/img/mapa/pin/placa_transparent.png";//'http://chart.apis.google.com/chart?cht=mm&chs=24x32&' + 'chco=FFFFFF,008CFF,000000&ext=.png';
		oThis.styles = {
			t1: "violeta",
			t2: "verde",
			t3: "amarelo",
			t4: "vermelho",
			t5: "laranja",
			t6: "azul"
		};
			
		oThis.getFilters();
		
	},
	
	initialize: function()
	{
		console.log( 'initialize' )
		
		oThis.map = new google.maps.Map(document.getElementById('map'), {
			zoom: 4,
			center: new google.maps.LatLng(-15.8, -47.9),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		
		google.maps.event.addListener(oThis.map, 'zoom_changed', function() { // TODA VEZ QUE DER 1 ZOOM NO MAPA EXECUTA ESSA FUNÇÃO
			console.log( oThis.map.zoom, "  <<< Valor do zoom para o parametro" );
			console.log( oThis.map.center, "  << Lag/long do centro do map" );
			var points = [];
			
			points.push( oThis.map.getBounds().getNorthEast().Qa );
			points.push( oThis.map.getBounds().getNorthEast().Ra );
			points.push( oThis.map.getBounds().getSouthWest().Qa );
			points.push( oThis.map.getBounds().getSouthWest().Ra );
			//console.log( google.maps.ControlPosition.TOP_LEFT, google.maps.ControlPosition.BOTTOM_RIGHT ) // PAREI AQUI
			//console.log( google.maps.getBounds )
			oThis.map.zoom >= 6 && oThis.map.zoom <= 10
				&& oThis.getMarkers( "uf=" + uf + "&tipos=" + oThis.typesFilter + "&pontos=" + points + "&limit=500&start=0", base_url + "mapa/obras/", oThis.clusterObras, "json" ,"POST", false );
			
		});
		
		google.maps.event.addListener( oThis.map, "bounds_changed", function( bo ) // TODA VEZ QUE MOVER O MAPA EXECUTA ESSA FUNÇÃO
		{
			console.log( oThis.map.getBounds(), "   << Bounds" );
			console.log( "Nordeste: ", oThis.map.getBounds().getNorthEast(), "Sudeste: ", oThis.map.getBounds().getSouthWest() );
			var bw = oThis.map.getBounds();
			var sw = bw.getSouthWest();
			var ne = bw.getNorthEast();
			
			new google.maps.Marker({
				position: new google.maps.LatLng( ne.lat(), ne.lng() ),
				draggable: false,
				map: oThis.map
			});
			
			new google.maps.Marker({
				position: new google.maps.LatLng( sw.lat(), sw.lng() ),
				draggable: false,
				map: oThis.map
			});
			
			console.log( oThis.map.zoom, "  <<< Valor do zoom para o parametro" );
			
			if(  oThis.map.zoom == "15" ) 
			{
				 
			}
		});
	
		var refresh = document.getElementById('refresh');
		google.maps.event.addDomListener(refresh, 'click', oThis.refreshMap);
	
		var clear = document.getElementById('clear');
		google.maps.event.addDomListener(clear, 'click', oThis.clearClusters);
		
		// AJAX PARA QUANDO INICIAR O MAPA COM O TOTAL DE OBRAS EM CADA UF
		$( "#estados option:first" ).attr( "selected", "selected" );
		oThis.map.zoom <= "6"
			&& oThis.getMarkers( "uf=" + $( "#estados" ).val() + "&tipos=" + oThis.typesFilter, base_url + "mapa/ufs", oThis.totalObras, "json" ,"POST", false );
			
		//oThis.map.overlayMapTypes.insertAt(0, new CoordMapType(new google.maps.Size(256, 256)));
		
		var dataCluster = {
			maxZoom: 1,
			gridSize: 20
			//styles: oThis.styles[1]
		}
		
		//oThis.refreshMap( dataCluster );
		
		// AJAX MONTANDO O KML
		//oThis.testeKML();
	},
	
	testeKML: function()
	{
		var markerImage = new google.maps.MarkerImage(oThis.imageUrl, new google.maps.Size(24, 32));
		$.getScript( base_url + "pub/js/mapa/ProjectedOverlay.js" );
		var itemBuffer = 0;
		
		var myParser = new geoXML3.parser(
			{
				map: oThis.map,
				zoom: true,
				processStyles: true,
				createMarker:drawKMLMarker,
				createPolyline:drawKMLPolyline,
				createPolygon:drawKMLPolygon
			});
			myParser.parse( base_url + "pub/teste/7915.kml"); //7915
			
			function drawKMLMarker( placemark )
			{
				console.log( placemark, " <<<< Marker " )
				var markerImage = new google.maps.MarkerImage(oThis.imageUrl, new google.maps.Size(24, 32));
				var latLng = new google.maps.LatLng(placemark.latlng.Qa, placemark.latlng.Ra)
			
				var marker = new google.maps.Marker({
					position: latLng,
					draggable: false,
					map: oThis.map,
					icon: markerImage,
					title: "Teste KML",
					html: '<div id="content">'+
					'<div id="siteNotice">'+
					'</div>'+
					'<h1 id="firstHeading">KML teste</h1>'+
					'</div>'+
					'</div>'
				});
			}
			function drawKMLPolyline( placemark )
			{
				var drawKMLPolylineElm = function(placemark, j, path) {
					if(j < placemark.LineString.length) {
						var coords = placemark.LineString[j].coordinates;
						var bounds = new google.maps.LatLngBounds();
						drawKMLPolylinePoint(placemark, j, coords, 0, path);
					} else {
						onDrawKMLPolyline(path);
					}
				}
			
				var drawKMLPolylinePoint = function(placemark, j, coords, i, path) {
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
				}
				
				var onDrawKMLPolyline = function(path) {
					var color = "4E6E0B";
					var weight = "4";
					
					// point to open the infowindow if triggered
					var point = path[Math.floor(path.length / 2)];
					
					// Load basic polyline properties
					var polyOptions = {
						map: oThis.map,
						path: path,
						strokeColor: "#" + color,
						strokeWeight: weight,
						title: placemark.name
					};
					// create polyline
					var p = new google.maps.Polyline(polyOptions);
					p.bounds = new google.maps.LatLngBounds();
					//thisObj.display = p;
					
					// set click event
					google.maps.event.addListener(p, "click", function(event) { console.log( "aki vai ser um ajax para infoWindow" ) });
					//setLoaded();
				}
				drawKMLPolylineElm(placemark, 0, []);
			}
			function drawKMLPolygon( placemark )
			{
				var color = placemark.style.color;
				var weight = "4";
				
				// create paths
				var paths = [];
				var bounds = new google.maps.LatLngBounds();
				var pathsLength = 0;
				
				for (var polygonPart=0; polygonPart < placemark.Polygon.length; polygonPart ++) {
					for (var j = 0; j < placemark.Polygon[polygonPart].outerBoundaryIs.length; j++) {
						var coords = placemark.Polygon[polygonPart].outerBoundaryIs[j].coordinates;
						var path = [];
						for (var i=0;i<coords.length;i++) {
							var pt = new google.maps.LatLng(coords[i].lat, coords[i].lng);
							path.push(pt);
							bounds.extend(pt);
						}
						paths.push(path);
						pathsLength += path.length;
					}
					for (var j=0; j<placemark.Polygon[polygonPart].innerBoundaryIs.length; j++) {
						var coords = placemark.Polygon[polygonPart].innerBoundaryIs[j].coordinates;
						var path = [];
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
				google.maps.event.addListener(p, "click", function(event) {console.log( "aki vai ser um ajax para infoWindow" )});
				
				//setLoaded();
				return p;
			}
		/*$.ajax(
		{
			url: base_url + "pub/kml/9059.kml",
			dataType: "xml",
			type: "GET",
			success: function(response)
			{
				console.log( response );
				

				var myParser = new geoXML3.parser(
				{
					map: oThis.map,
					processStyles: true,
				    createMarker: addMyMarker,
				    createOverlay: addMyOverlay
				});
				myParser.parse( base_url + "pub/kml/9059.kml");
				
				function addMyMarker(placemark) {
				  // Marker handling code goes here
				  console.log( "addMyMarker  " , placemark )
				  if (someCondition) {
					myParser.createMarker(placemark);
				  }
				};
			
				function addMyOverlay(groundOverlay) {
				  // Overlay handling code goes here
				  if (someCondition) {
					myParser.createOverlay(groundOverlay);
				  }
				};
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				console.log( "ERROR - Filtro : ", jqXHR, textStatus, errorThrown )
			}
		})*/
	},
	
	getFilters: function() // AJAX DO FILTRO DOS TIPOS
	{
		$.ajax(
		{
			url: base_url + "mapa/structure/",
			dataType: "json",
			success: function( response )
			{
				var subeixos = response.subeixos,
					$tree = $( "ul#tree" );
					
				$( subeixos ).each( function()
				{
					var oSub = this,
						subLI = $( '<li class="collapsed"><span class="open"><img src="http://pac2.digitalg.org/pub/img/mapa/filtro/fechado.png"></span><input type="checkbox" checked="checked" class="father"><label class="father"></label></li>' ),
						ulType = $( "<ul class='types'></ul>" );
						
						$( oSub.tipos ).each( function()
						{
							var oTyp = this,
								typeLI = $( '<li class="leaf"><span></span><input class="children" checked="checked" type="checkbox"><label></label></li>' );
							
							typeLI
								.find( "input" ).val( oTyp.tipo_hash ).end()
								.find( "label" ).text( oTyp.tipo_titulo ).end()
							.appendTo( ulType );
						});
						
						ulType.hide().appendTo( subLI );
						
						subLI
							.find( "input.father" ).val( oSub.subeixo_hash ).end()
							.find( "label.father" ).text( oSub.subeixo_titulo ).end()
						.appendTo( $tree );
				});
				
				$( "span.open", $tree ).unbind().click( function()
				{
					var $bt = $( this );
					
					$bt.siblings( "ul.types" ).slideToggle().toggleClass( "active" );
					
					$bt.siblings( "ul.types" ).hasClass( "active" )
						? $( "img", $bt ).attr( "src", $( "img", $bt ).attr( "src" ).replace( "fechado", "aberto" ) )
						: $( "img", $bt ).attr( "src", $( "img", $bt ).attr( "src" ).replace( "aberto", "fechado" ) );
					
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
						{
							$in.attr( "checked", "" );	
						}
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
					
					console.log( oThis.typesFilter, "   <<<<  Father" );
					uf != ""
						&& (center = true);
					
					//oThis.map.zoom <= 6
						//&& oThis.getMarkers( "uf=" + $( "#estados" ).val() + "&tipos=" + oThis.typesFilter, base_url + "mapa/ufs", oThis.totalObras, "json" ,"POST", center );
					oThis.map.zoom >= 6 && oThis.map.zoom <= 10
						&& !$input.is( ":checked" )
							? $( "input.children", $input.parent('li.collapsed') ).each( function()
							{
								var $inID = $( this ).val();
								console.log( $inID, oThis.markerClusterer[ "t"+$inID ] )
								if( oThis.markerClusterer )
									oThis.markerClusterer[ "t"+$inID ] != undefined
										&& oThis.markerClusterer[ "t"+$inID ].clearMarkers();
							})
							: $( "input.children", $input.parent('li.collapsed') ).each( function()
							{
								var $inID = $( this ).val();
								
								oThis.refreshMap( '', oThis.jsonClusterMarkers[ "t"+$inID ], oThis.styles["t" + $inID.split( "00" )[ 0 ] ], $inID );
							});
				});
				
				$( "input.children", $tree ).change( function()
				{
					var $in = $( this ),
						uf = $( "#estados" ).val(),
						center = false;
					
					oThis.typesFilter = [];
					
					$( "input.father", $in.parents( "li.collapsed" ) ).attr( "checked", "" );
					
					$( "ul.types li.leaf input:checked", $tree ).each( function()
					{
						oThis.typesFilter.push( $( this ).val() );
					});
					
					console.log( oThis.typesFilter,  "  <<< Children" );
					
					$( "input.children:checked", $in.parent().siblings( "li.leaf" ) ).length == $( "input.children", $in.parent().siblings( "li.leaf" ) ).length + 1
							&& $( "input.father", $in.parents( "li.collapsed" ) ).attr( "checked", "checked" );
					
					uf != ""
						&& (center = true);
					
					oThis.map.zoom <= 6
						&& oThis.getMarkers( "uf=" + uf + "&tipos=" + oThis.typesFilter, base_url + "mapa/ufs", oThis.totalObras, "json" ,"POST", center );
					
					oThis.map.zoom >= 6 && oThis.map.zoom <= 10
						&& !$in.is( ":checked" )
							? oThis.markerClusterer[ "t"+$in.val() ].clearMarkers()
							: oThis.refreshMap( '', oThis.jsonClusterMarkers[ "t"+$in.val() ], oThis.styles["t" + $in.val().split( "00" )[ 0 ] ], $in.val() );
					
					return false;
				});
				
				$( "#estados" ).change( function()
				{
					var uf = $( this ).val(),
						center = false;
					
					uf != ""
						&& ( center = true );
					
					oThis.map.zoom <= 6
						&& oThis.getMarkers( "uf=" + uf + "&tipos=" + oThis.typesFilter, base_url + "mapa/ufs", oThis.totalObras, "json" ,"POST", center );
						
					if( center == false )
					{
						oThis.map.setCenter( new google.maps.LatLng(-15.8, -47.9) );
						oThis.map.setZoom( 4 );
					}
					
					return false;
				});
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				console.log( "ERROR - Filtro : ", jqXHR, textStatus, errorThrown )
			}
		});
	},
	
	//estados: ["AC","AP","AM","PA","RO","RR","TO","AL","BA","CE","MA","PB","PE","PI","RN","SE","DF","GO","MT","MS","ES","MG","RJ","SP","PR","RS","SC"],
	//stateslaglong:["-8.971897,-70.461915","1.274309, -51.358887","-4.674980,-64.937989","-5.703448,-52.655274","-10.984335,-62.828614","1.823423,-61.136719","-10.768556,-48.238770","-9.774024,-36.900879","-12.297068,-41.471192","-4.915833,-39.405762","-5.943899,-44.898926","-7.209900,-36.681153","-8.450639,-37.691895","-7.558546,-42.503907","-5.572250,-36.747071","-10.574222,-37.230469","-15.810753,-47.942688","-15.072123,-49.732911","-12.790375,-55.313965","-21.330315,-54.610840","-19.248922,-40.438477","-17.497389,-44.415528","-21.881890,-41.822754","-22.268764,-48.678223","-24.806681,-51.688477","-28.921631,-52.743165","-27.059126,-50.677735"],
	
	getMarkers: function( data, url, callback, datatype, type, center ) // AJAX DOS JSONS DAS OBRAS
	{
		!type == undefined
			&& ( type = "GET" );
		
		$.ajax(
		{
			url: url,
			data: data,
			type: type,
			dataType: datatype,
			success: function( response )
			{
				callback( response, center );
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				console.log( "ERROR - JSON : ", jqXHR, textStatus, errorThrown )
			}
		});
	},
	
	totalObras: function( json, center ) // CALLBACK PARA MONTAR MARKERS COM O VALOR TOTAL DE OBRAS
	{
		var markerImage = new google.maps.MarkerImage(oThis.imageUrl, new google.maps.Size(24, 32));
		
		if( oThis.listDivs.length )
		{
			Label.prototype.onRemove(oThis.listDivs);
			oThis.listDivs = [];
		}
		
		oThis.markersLabel = [];
		oThis.jsonCountStates = json;
		
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
		
		if( center && oThis.map.zoom <= 6 )
		{
			oThis.map.setCenter( new google.maps.LatLng(oThis.jsonCountStates[0].lat, oThis.jsonCountStates[0].long) );
			oThis.map.setZoom( 6 );
		}
	},
	
	clearClusters: function( e )
	{
		e.preventDefault();
		e.stopPropagation();
		oThis.markerClusterer.clearMarkers();
	},
	
	clusterObras: function( json )
	{
		console.log( "Passou no CLUSTEROBRAS" );
		var dataCluster = {
			maxZoom: 1,
			gridSize: 20
			//styles: oThis.styles[1]
		}
		oThis.jsonClusterMarkers = json;
		//console.log( "CLUSTER INTERMEDIARIO >>>> ", json.t1001 ); oThis.typesFilter.length
		if( oThis.markerClusterer )
			for( var b = 0; b < oThis.markerClusterer.length; ++b )
				oThis.markerClusterer[oThis.typesFilter[b]].clearMarkers();
		
		var color = "";
		
		for (var i = 0; i < 27; ++i)
		{
			color = "t" + oThis.typesFilter[i].split( "00" )[ 0 ];
			
			console.log( oThis.typesFilter[i], "   TIPO TIPO TIPO TIPO COLOR :::: ", oThis.styles[ color ], "    ", oThis.typesFilter[i].split( "00" )[ 0 ], "  ", oThis.typesFilter[i].split( "00" ), "   ", color );
			
			oThis.refreshMap( dataCluster, json[ "t"+oThis.typesFilter[i] ], oThis.styles[ color ], oThis.typesFilter[i] );
		}
	},
	
	refreshMap: function( dataCluster, json, color, typeID )
	{
		if( json == undefined )
			return false;
		
		//if (oThis.markerClusterer) {
			//oThis.markerClusterer.clearMarkers();
			//oThis.markerClusterer = null;
		//}
		if( oThis.listDivs.length )
		{
			Label.prototype.onRemove(oThis.listDivs);
			oThis.listDivs = [];
		}
	
		var markers = [];
		var jsonD = json;
		console.log( "CLUSTER INTERMEDIARIO >>>> ", jsonD[0] )
		
		var markerImage = new google.maps.MarkerImage(oThis.imageUrl, new google.maps.Size(24, 32));
		var strToPoint = function(str)
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
		}
	
		for (var i = 0; i < jsonD.length; ++i) {
			//console.log( i, jsonD[i] )
			var latLng = new google.maps.LatLng(jsonD[i].la, jsonD[i].lo)
			//console.log( jsonD[i].obra_latitude, jsonD[i].obra_longitude, strToPoint( jsonD[i].obra_latitude ) , strToPoint( jsonD[i].obra_longitude ) )
			
			var marker = new google.maps.Marker({
				position: latLng,
				draggable: false,
				map: oThis.map,
				icon: markerImage,
				title: jsonD[i].h,
				html: '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<h1 id="firstHeading">'+jsonD[i].h+'</h1>'+
				'</div>'+
				'</div>',
				mateus: i
			});
			markers.push(marker);
			/*google.maps.event.addListener(marker, "click", function(event) {console.log( "fazer ajax" );});*/
			//var contentString = '<div id="content" hash="'+jsonD[i].h+'">'+'</div>';
			//console.log("marker: >>> ",  marker )  ;
			
		}
		
		//var contentString = 
		var infowindow = new google.maps.InfoWindow({
			/*position: ev.latLng,*/
			content: "holding..."
		});
		
		for (var b = 0; b < markers.length; b++) {
			var marker = markers[b];
			
			google.maps.event.addListener(marker, 'click', function( event ) {
				var ev = event;
				
				console.log( new google.maps.LatLng(ev.latLng.Pa,ev.latLng.Qa) )  
				
				console.log( marker )
				infowindow.setContent(this.html);
				infowindow.open(oThis.map, this);
				//infowindow.open(oThis.map, marker);
			});/*
			google.maps.event.addListener(marker, 'click', function () {
				infowindow.open(map, maker);
			});*/
		}
		
		var zoom = parseInt(document.getElementById('zoom').value, 10);
		var size = parseInt(document.getElementById('size').value, 10);
		var style = parseInt(document.getElementById('style').value, 10);
		zoom = zoom == -1 ? null : zoom;
		size = size == -1 ? null : size;
		style = style == -1 ? null: style;
		
		console.log( "dataCluster: ",  zoom, size, style )
		
		dataCluster.maxZoom = zoom;
		dataCluster.gridSize = 40;
		dataCluster.styles = oThis.styles[style];
		
		oThis.markerClusterer[ "t" + typeID ] = new MarkerClusterer(oThis.map, markers, dataCluster, color);
		
		//var newT = {};
		
		//newT[ "t" + typeID ] =  new MarkerClusterer(oThis.map, markers, dataCluster, color);
		//oThis.markerClusterer.push( newT );
	
		//oThis.markerClusterer.push( { "t"+typeID : new MarkerClusterer(oThis.map, markers, dataCluster, color) } );
		
		console.log( "MARKERS: ", markers.length )
	}
	
	
});

$( function()
{
	
});

var gmapapac = new gMapapac();

google.load('maps', '3', {
	other_params: 'sensor=false'
});

google.setOnLoadCallback(oThis.initialize);

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

/*var Map = function() {
	var thisObj = this;
	this.elm;
	
	this.init = function() {
		config();
		return this;
	}
	
	var config = function() {
		var options = {
			zoom : 4,
			center : new google.maps.LatLng(-15.8, -47.9),
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};
		thisObj.elm = new google.maps.Map(document.getElementById("map"), options);
		var overlay = new Coloroverlay({map:thisObj.elm});
	}
	
	this.refresh = function() {
		this.elm.setZoom(this.elm.zoom + 1);
		this.elm.setZoom(this.elm.zoom - 1);
	}
}*/