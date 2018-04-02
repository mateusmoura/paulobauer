/**
* Funcionalidade responsável por criar o Mapa com os Cluster dos Markers
* @author: Mateus Moura
* @Version: 1.0
*/

var google__map = [];

const base_url = '../';

Module('MM.GoogleMaps', function (GoogleMaps){
  GoogleMaps.fn.initialize = function ($map, $json) {
    this.container			= $map;
    this.total_data_json = $json;
    this.data_json			= $json;
    this.google_map			= [];

    this.markerClusterer	= {};
    this.loading			= $( "#loading" );
    this.no_click_filter	= $( "#no_click_filter" );
    this.buildCluster		= false;
    this.controlKML			= [];
    this.kmlpline			= [];
    this.markerObras		= {};
    this.verify				= false;
    this.noRefresh			= false;
    this.uFilter			= false;
    this.typesFilter		= ["3000", "3002", "3001", "3003", "4004", "4001", "4000", "4002", "4003", "5000", "5002", "5001", "6002", "6000", "6001", "1000", "1004", "1005", "1002", "1001", "1003", "2004", "2005", "2000", "2001", "2002", "2003"];
    this.listDivs			= []; // Lista das divs do customLabel
    this.map				= null;
    this.imageUrl			= base_url + "../images/mapa/pin/preto.png";//'http://chart.apis.google.com/chart?cht=mm&chs=24x32&' + 'chco=FFFFFF,008CFF,000000&ext=.png';
    this.styles				= {
                  t1: { name: "violeta", cod: "A578D4" },
                  t2: { name: "verde", cod: "7BC12A" },
                  t3: { name: "amarelo", cod: "E1B439" },
                  t4: { name: "vermelho", cod: "C63A3A" },
                  t5: { name: "laranja", cod: "E47D0D" },
                  t6: { name: "azul", cod: "1694BD" },
                  t7: { name: "preto", cod: "000000" }
                };

    this.loadScripts();
  };
  /**
  * Carregar Scripts necessários para funcionalidade.
  */
  GoogleMaps.fn.loadScripts = function(){
    var _this = this;

    jQuery.ajaxSetup({
      cache: true
    });

    $.when(
      //$.getScript(base_url + "js/plugins/google.jsapi.js"),
      $.getScript(base_url + "js/mapa/markerclusterer.js"),
      ////$.getScript(base_url + "js/mapa/jquery.simplemodal.1.4.1.min.js"),
      $.getScript(base_url + "js/mapa/customLabel.js"),
      $.getScript(base_url + "js/mapa/geoxml3.js"),
      ////$.getScript(base_url + "js/mapa/libs/jquery-ui-1.8.14.custom.min.js"),
      $.getScript(base_url + "js/mapa/libs/infobox.js"),
      $.getScript(base_url + "js/mapa/coloroverlay.js"),
      $.Deferred(function(deferred){
        $(deferred.resolve)
      })
    ).done(function(){
      _this.config();
    }).fail(function() {
      console.log('Erro getScript')
    });
  };
  /**
  * Configuração do Mapa.
  */
  GoogleMaps.fn.config = function(){
    this.google_geocoder = new google.maps.Geocoder();
    this.google_map = new google.maps.Map(this.container, {
      zoom: 8,
      scrollwheel: false,
      place: 'Santa Catarina, Brasil',
      center: new google.maps.LatLng(-27.3747833, -49.8212626),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#523735"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#ff0000"
            },
            {
              "weight": 0.5
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          "featureType": "administrative.province",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#ff0000"
            },
            {
              "weight": 2.5
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#447530"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#e9bc62"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#db8555"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#b9d3c2"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#92998d"
            }
          ]
        }
      ]
    });

    google__map = this.google_map;

    var overlay = new Coloroverlay({ map: this.google_map });

    this.build();
    this.filter();
  };
  /**
  * Getters
  */
  GoogleMaps.fn.getGoogleMap = function () {
    return this.google_map;
  };
  /**
  * Adiciona os Marker no Mapa
  */
  GoogleMaps.fn.build = function () {
    var _this				= this;
    this.mcOptions			= {gridSize: 1, maxZoom: 10, averageCenter: true};
    this.markers			= [];
    this.infowindow			= new InfoBox({
                  content					: "building...",
                  alignBottom				: true,
                  pixelOffset				: new google.maps.Size(-90, -38),
                  closeBoxMargin			: "15px",
                  infoBoxClearance		: new google.maps.Size(1, 1),
                  pane					: "floatPane",
                  disableAutoPan			: false,
                  isHidden				: false
                });

    google.maps.event.addListener(this.infowindow, 'domready', function() {
      $(".block__infobox--body .fechar").click();
      $(".block__infobox--body .fechar").unbind().click(function(event) {
        event.preventDefault();
        if (infowindow) infowindow.close();

        return false;
      });
    });

    for (var i = this.data_json.length - 1; i >= 0; i--) {
    //for (var i = 0; i < this.data_json.length; i++) {
      const item = this.data_json[i];
      var latLng = new google.maps.LatLng(item.lat, item.long),
        marker = new google.maps.Marker({
          position			: latLng,
          draggable			: false,
          icon				: new google.maps.MarkerImage(`${base_url}/../images/mapa/pin/${this.styles[item.tema].name}.png`, new google.maps.Size(15, 15)),
          title				: item.Tipo,
          // categories			: item.categories,
          //horario				: item.horario_de_funcionamento,
          //endereco			: item.localizacao.address,
          //link_do_post		: item.link_do_post,
          //imagem				: item.imagem,
          html: '<div class="block__infobox">'+
                '<div class="block__infobox--body">'+
                  '<div class="block__infobox--body-overlay"></div>' +
                  '<h3>' + item.Cidade + '</h3>' +
                  '<p>' + item.Descricao + '</p>' +
                  '<strong>' + item.Valor + '</strong>' +
                  // '<div class="block__infobox--foot">'+
                  //   '<a class="fechar" href="' + item.link_do_post + '">Ler post sobre este lugar <i class="icon icon-arrow"></i></a>'+
                  // '</div>'+
                '</div>'+
              '</div>'
        });

      google.maps.event.addListener(marker, 'click', function	(event) {
        var ev = event,
          $mevent = this;

        var _buildHTML					= $('<div>' + $mevent.html + '</div>'),
          _nav						= $('.block__infobox--category nav', _buildHTML),
          _cat_html					= $('<a href="#this" class="btn btn-default"></a>');

        // for (var b = $mevent.categories.length - 1; b >= 0; b--) {
        //   _cat_html.text($mevent.categories[b].name).attr('href', $mevent.categories[b].permalink);
        //   _cat_html.appendTo(_nav);
        // }

        _this.infowindow.setContent(_buildHTML.html());
        _this.infowindow.open(_this.google_map);
        _this.infowindow.setPosition(event.latLng);

        //oThis.getMarkers( "hash=" + this.hash, base_url + "mapa/obra/", buildInfo, "json", "POST", false );
        //oThis.noRefresh = true;
      });

      this.markers.push(marker);

      marker.setMap(this.google_map);
    }

    // this.mc	= new MarkerClusterer(this.google_map, this.markers, this.mcOptions, 'preto');

    this.blockClick = false;
  };
  /**
  * Adiciona os eventos necessários.
  */
  GoogleMaps.fn.addEventListener = function () {
    google.maps.event.addListener( oThis.map, "mouseup", function (event) {
      console.log( "mouseup" );
      this.noRefresh == false
        && oThis.actions.initView( "mouseup" );
    }.bind(this));
    
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
  };
  /**
  * Remove Marcadores
  */
  GoogleMaps.fn.removeMarker = function() {
    for (let i = 0; i < this.markers.length; i++) {
      const element = this.markers[i];
      element.setMap(null);
    }
  };
  /**
  * Filtros
  */
  GoogleMaps.fn.filter = function() {
    const filter = $('.block__map--filter');
    const self = this;
    this.blockClick = false;

    $('input', filter).on('change', (e) => {
      let tipos = [];
      const inputs = $('input:checked', filter);

      if (this.blockClick) return false;

      // this.mc.clearMarkers();
      this.removeMarker();

      this.blockClick = true;

      inputs.each(item => {
        tipos.push($(inputs[item]).data('tipo'));
      });

      this.data_json = this.total_data_json.filter(item => {
        return tipos.indexOf(item.tema) >= 0;
      });

      this.build();
    })
  };
});