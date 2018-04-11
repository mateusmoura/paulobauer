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
    this.cidades        = [];
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
                  t1: { name: "violeta", cod: "8f2c79" },
                  t2: { name: "verde", cod: "149253" },
                  t3: { name: "amarelo", cod: "fdb913" },
                  t4: { name: "vermelho", cod: "ec1c24" },
                  t5: { name: "laranja", cod: "f58220" },
                  t6: { name: "azul", cod: "0055a5" },
                  t7: { name: "preto", cod: "0088a3" }
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
      center: new google.maps.LatLng(-27.3747833, -50.8212626),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
            "featureType": "landscape.man_made",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#faf5ed"
                },
                {
                    "lightness": "0"
                },
                {
                    "gamma": "1"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#bae5a6"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "weight": "1.00"
                },
                {
                    "gamma": "1.8"
                },
                {
                    "saturation": "0"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "hue": "#ffb200"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "lightness": "0"
                },
                {
                    "gamma": "1"
                }
            ]
        },
        {
            "featureType": "transit.station.airport",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#b000ff"
                },
                {
                    "saturation": "23"
                },
                {
                    "lightness": "-4"
                },
                {
                    "gamma": "0.80"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#a0daf2"
                }
            ]
        }
    ]
    });

    google__map = this.google_map;

    var overlay = new Coloroverlay({ map: this.google_map });

    const src2 = `http://dev.webfacetecnologia.com.br/paulobauer/docs/sc_laranja.kml`;
    const src = `../docs/sc_laranja.kml`;

    var geoXml = new geoXML3.parser({map: this.google_map});
    geoXml.parse(src);

    this.build();
    // this.filter();
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

    // const select = $('.block__map--select');

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
      const arr = [item.titulo];

      if (!item.localizacao) {
        return false;
      }

      if (this.cidades.indexOf(item.titulo) === -1) {
        this.cidades.push(item.titulo);
        // $(`<option value="${item.titulo}">${item.titulo}</option>`).appendTo(select);
      }

      var latLng = new google.maps.LatLng(item.localizacao.lat, item.localizacao.lng),
        marker = new google.maps.Marker({
          position			: latLng,
          draggable			: false,
          icon				: new google.maps.MarkerImage(`${base_url}/../images/mapa/pin/${this.styles[item.tema].name}.png`, new google.maps.Size(25, 25)),
          title				: item.tipo,
          // categories			: item.categories,
          //horario				: item.horario_de_funcionamento,
          //endereco			: item.localizacao.address,
          //link_do_post		: item.link_do_post,
          //imagem				: item.imagem,
          html: '<div class="block__infobox tema-' + item.tema + '">'+
                '<div class="block__infobox--body">'+
                  '<div class="block__infobox--body-overlay"></div>' +
                  '<h2>' + item.titulo + '</h2>' +
                  '<h3><i class="icone icone-' + item.tema + '"></i>' + item.tipo + '</h3>' +
                  '<p>' + item.content + '</p>' +
                  // '<strong>' + item.Valor + '</strong>' +
                  // '<div class="block__infobox--foot">'+
                  //   '<a class="fechar" href="' + item.link_do_post + '">Ler post sobre este lugar <i class="icon icon-arrow"></i></a>'+
                  // '</div>'+
                  '<div class="block__infobox--arrow"></div>' +
                '</div>'+
              '</div>',
          zIndex: i < 2 ? 99999999 : 9
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

      marker.addListener('dragend', function(event){
        console.log(event.latLng.lat());
        console.log(event.latLng.lng());
      });

      google.maps.event.addListener(marker, "mouseover", function(event) {
        var ev = event,
            $mevent = this;

        var _buildHTML = $('<div>' + $mevent.html + '</div>');

        _this.infowindow.setContent(_buildHTML.html());
        _this.infowindow.open(_this.google_map);
        _this.infowindow.setPosition(event.latLng);
      });

      google.maps.event.addListener(marker, "mouseout", function(event) {
        _this.infowindow.close();
      });

      this.markers.push(marker);

      marker.setMap(this.google_map);
    }

    // this.mc	= new MarkerClusterer(this.google_map, this.markers, this.mcOptions, 'preto');

    this.blockClick = false;

    const input = $('#ms-filter').magicSuggest({
      sortOrder: 'name',
      noSuggestionText: 'Sem sugestões',
      placeholder: 'Selecione uma cidade',
      allowFreeEntries: false,
      data: this.cidades,
      selectionPosition: 'bottom',
      selectionStacked: true,
      selectionRenderer: function(data){
        // this.cidadesSelecionadas.push(data);
        return data.name;
      }
    });

    $(input).unbind().on('selectionchange', function(e,m){
      _this.filterCity(this.getValue());
    });
  };
  /**
  * Adiciona os eventos necessários.
  */
  GoogleMaps.fn.addEventListener = function () {
    google.maps.event.addListener( oThis.map, "mouseup", function (event) {
      
    }.bind(this));
    
    google.maps.event.addListener( oThis.map, "mousedown", function() {

    });
    
    google.maps.event.addListener( oThis.map, "bounds_changed", function( bo ) // TODA VEZ QUE MOVER O MAPA EXECUTA ESSA FUNÇÃO
    {
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

      console.log('====================================');
      console.log(tipos);
      console.log('====================================');

      this.data_json = this.total_data_json.filter(item => {
        return tipos.indexOf(item.tema) >= 0;
      });

      this.build();
    })
  };
  /**
  * Filtros Cidades
  */
  GoogleMaps.fn.filterCity = function(filterArray) {
    if (this.blockClick) return false;

    this.blockClick = true;

    this.removeMarker();

    if (filterArray.length) {
      this.data_json = this.total_data_json.filter(item => {
        return filterArray.indexOf(item.titulo) >= 0;
      });
    } else {
      this.data_json = this.total_data_json;
    }

    this.build();
  };
});