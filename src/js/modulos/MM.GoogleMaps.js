/**
* Funcionalidade responsável por criar o Mapa com os Cluster dos Markers
* @author: Mateus Moura
* @Version: 1.0
*/

var google__map = [];

const base_url = '../';

Module('MM.GoogleMaps', function (GoogleMaps){
  GoogleMaps.fn.initialize = function ($map, $json) {
    this.container			= $map
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
    //this.imageUrl			= base_url + "img/mapa/pin/preto.png";//'http://chart.apis.google.com/chart?cht=mm&chs=24x32&' + 'chco=FFFFFF,008CFF,000000&ext=.png';
    this.imageUrl			= 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&' + 'chco=FFFFFF,008CFF,000000&ext=.png';
    this.styles				= {
                  t1: { name: "violeta", cod: "A578D4" },
                  t2: { name: "verde", cod: "7BC12A" },
                  t3: { name: "amarelo", cod: "E1B439" },
                  t4: { name: "vermelho", cod: "C63A3A" },
                  t5: { name: "laranja", cod: "E47D0D" },
                  t6: { name: "azul", cod: "1694BD" }
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
      zoom: 12,
      scrollwheel: false,
      center: new google.maps.LatLng(-15.793914, -47.882801),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    google__map = this.google_map;

    var overlay = new Coloroverlay({ map: this.google_map });

    this.build();
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
    this.mcOptions			= {gridSize: 50, maxZoom: 18};
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
      console.log(`${this.data_json[i].Cidade}, SC`)
      this.google_geocoder.geocode({ 'address': `${this.data_json[i].Cidade}, SC`}, (results, status) => {
        console.log(results, status);
      })
    }

    // for (var i = this.data_json.length - 1; i >= 0; i--) {
    // //for (var i = 0; i < this.data_json.length; i++) {
    //   var latLng = new google.maps.LatLng(this.data_json[i].localizacao.lat, this.data_json[i].localizacao.lng),
    //     marker = new google.maps.Marker({
    //       position			: latLng,
    //       draggable			: false,
    //       icon				: new google.maps.MarkerImage(base_url + 'img/mapa/pin/preto.png', new google.maps.Size(25, 34)),
    //       title				: this.data_json[i].post_title,
    //       categories			: this.data_json[i].categories,
    //       //horario				: this.data_json[i].horario_de_funcionamento,
    //       //endereco			: this.data_json[i].localizacao.address,
    //       //link_do_post		: this.data_json[i].link_do_post,
    //       //imagem				: this.data_json[i].imagem,
    //       html: '<div class="block__infobox">'+
    //             '<div class="block__infobox--body">'+
    //               '<div class="block__infobox--body-overlay"></div>' +
    //               '<img src="' + this.data_json[i].imagem + '" />' +
    //               '<h3>' + this.data_json[i].post_title + '</h3>' +
    //               '<p>' + this.data_json[i].localizacao.address + '</p>' +
    //               '<span>' + this.data_json[i].horario_de_funcionamento + '</span>' +

    //               '<div class="block__infobox--category">' +
    //                 '<nav></nav>' +
    //               '</div>' +

    //               '<div class="block__infobox--content"><span class="loading"></span></div>'+
    //               '<div class="block__infobox--foot">'+
    //                 '<a class="fechar" href="' + this.data_json[i].link_do_post + '">Ler post sobre este lugar <i class="icon icon-arrow"></i></a>'+
    //               '</div>'+
    //             '</div>'+
    //             '<div class="block__infobox--footer"></div>'+
    //           '</div>'
    //     });

    //   google.maps.event.addListener(marker, 'click', function	(event) {
    //     var ev = event,
    //       $mevent = this;

    //     var _buildHTML					= $('<div>' + $mevent.html + '</div>'),
    //       _nav						= $('.block__infobox--category nav', _buildHTML),
    //       _cat_html					= $('<a href="#this" class="btn btn-default"></a>');

    //     for (var b = $mevent.categories.length - 1; b >= 0; b--) {
    //       _cat_html.text($mevent.categories[b].name).attr('href', $mevent.categories[b].permalink);
    //       _cat_html.appendTo(_nav);
    //     }

    //     _this.infowindow.setContent(_buildHTML.html());
    //     _this.infowindow.open(_this.google_map);
    //     _this.infowindow.setPosition(event.latLng);

    //     //oThis.getMarkers( "hash=" + this.hash, base_url + "mapa/obra/", buildInfo, "json", "POST", false );
    //     //oThis.noRefresh = true;
    //   });

    //   this.markers.push(marker);
    //}

    this.mc					= new MarkerClusterer(this.google_map, this.markers, this.mcOptions, 'preto');
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
});