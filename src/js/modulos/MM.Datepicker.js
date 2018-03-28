/**
* Funcionalidade responsável por colocar as máscaras dos inputs no formulário
* @author: Mateus Moura
* @Version: 1.0
*/

Module('CNA.Datepicker', function(Datepicker){
	Datepicker.fn.initialize = function($settings){
		this.settings = $settings;

		//this.config();
		this.loadScripts();
	};
	/**
	* Carregar Scripts necessários para funcionalidade.
	*/
	Datepicker.fn.loadScripts = function(){
		var _this = this;

		jQuery.ajaxSetup({
			cache: true
		});

		if( $.datepicker === undefined ){
			$.when(
				$.getScript(base_url + "js/plugins/jQuery.ui.datepicker.min.js"),
				$.Deferred(function(deferred){
					$(deferred.resolve)
				})
			).done(function(){
				_this.config();
			}).fail(function() {
				console.log('Erro getScript')
			});
		} else{
			_this.config();
		}
	};
	/**
	* Configuração do plugin para mostrar as máscaras.
	*/
	Datepicker.fn.config = function(){
		var defaults = {
				dateFormat: 'dd/mm/yy',
				showOtherMonths: true,
				changeMonth: false,
				changeYear: false,
				dayNames: [ 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado' ],
				dayNamesMin: [ 'D', 'S', 'T', 'Q', 'Q', 'S', 'S' ],
				dayNamesShort: [ 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb' ],
				monthNames: [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ],
				monthNamesShort: [ 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ]
			},
			settings = $.extend({}, defaults, this.settings||{});


		$('.datepicker').datepicker(settings);
	};
});