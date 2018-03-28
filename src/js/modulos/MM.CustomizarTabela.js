/**
* Funcionalidade responsável pela customização das tabelas.
* @author: Mateus Moura
* @Version: 1.0
*/

Module('CNA.CustomizarTabela', function(CustomizarTabela){
	CustomizarTabela.fn.initialize = function($container, $settings){
		this.container = $container;
		this.tabela = $container.find('table');
		this.settings = $settings;

		//this.building();
		this.loadScripts();
	}
	/**
	* Carregar Scripts necessários para funcionalidade.
	*/
	CustomizarTabela.fn.loadScripts = function(){
		var _this = this;

		jQuery.ajaxSetup({
			cache: true
		});

		if( $.fn.dataTable === undefined ){
			jQuery.getScript(base_url + "js/plugins/jQuery.dataTables.min.js")
				.done(function() {
					_this.config();
				})
				.fail(function() {
					console.log('Erro getScript')
				});
		} else{
			_this.config();
		}
	};
	/**
	* Construir Tabelas customizadas.
	*/
	CustomizarTabela.fn.config = function(){
		jQuery.extend( jQuery.fn.dataTableExt.oSort, {
			"date-uk-pre": function ( a ) {
				var ukDatea = $(a).text().split('/');
				return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
			},
		
			"date-uk-asc": function ( a, b ) {
				return ((a < b) ? -1 : ((a > b) ? 1 : 0));
			},
		
			"date-uk-desc": function ( a, b ) {
				return ((a < b) ? 1 : ((a > b) ? -1 : 0));
			}
		});

		this.defaults = {
			"order": [],
			"paging": true,
			"info": false,
			"searching": false,
			"bFilter" : false,
			"aLengthMenu": [5,10,25,50],
			"bLengthChange": false,
			"oLanguage": { 
				"sProcessing": "Processando...", 
				"sLengthMenu": "Mostrar _MENU_ registros", 
				"sZeroRecords": "Não foram encontrados resultados", 
				"sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros", 
				"sInfoEmpty": "Mostrando de 0 até 0 de 0 registros", 
				"sInfoFiltered": "", 
				"sInfoPostFix": "", 
				"sSearch": "Buscar:", 
				"sUrl": "", 
				"oPaginate": { 
					"sFirst": "Primeiro", 
					"sPrevious": "Anterior", 
					"sNext": "Seguinte", 
					"sLast": "Último" 
				}
			}
		},
		this.settings = $.extend({}, this.defaults, this.settings||{});

		this.tabela.dataTable(this.settings);
	};
	/**
	* Adiciona os eventos necessários.
	*/
	CustomizarTabela.fn.addEventListeners = function(){
		// this.titulo
		// 	.on('click', this.toggleOpen.bind(this));
	};
});