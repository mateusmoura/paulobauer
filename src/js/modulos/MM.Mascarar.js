/**
* Funcionalidade responsável por colocar as máscaras dos inputs no formulário
* @author: Mateus Moura
* @Version: 1.0
*/
Module('MM.Mascarar', function(Mascarar){
	Mascarar.fn.initialize = function($input){
		this.inputs = $input != undefined ? $input : $('input[type=text]');

		this.loadScripts();
	};
	/**
	* Carregar Scripts necessários para funcionalidade.
	*/
	Mascarar.fn.loadScripts = function(){
		var _this = this;

		jQuery.ajaxSetup({
			cache: true
		});

		if($.mask === undefined){
			$.when(
				$.getScript(base_url + "js/plugins/jQuery.maskinput.js"),
				$.getScript(base_url + "js/plugins/jQuery.onlyNumber.js"),
				$.getScript(base_url + "js/plugins/jQuery.maskMoney.js"),
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
	Mascarar.fn.config = function(){
		this.inputs
			.filter('.mask-cnpj').mask('99.999.999/9999-99').data("mask", "__.___.___/____-__").end()
			.filter('.mask-cpf').mask('999.999.999-99').data("mask", "___.___.___-__").end()
			.filter('.mask-cep').mask('99.999-999').data("mask", "__.___-___").end()
			.filter('.mask-date').mask('99/99/9999').data("mask", "__/__/____").end()
			.filter('.numeros').onlyNumber().end()
			.filter('.mask-phone').focusout(function(){
				var phone, element;
				element = $(this);
				element.unmask();
				phone = element.val().replace(/\D/g, '');
				if(phone.length > 10) {
					element.mask("(99) 99999-999?9").data("mask", "(__) ____-_____");
				} else {
					element.mask("(99) 9999-9999?9").data("mask", "(__) ____-_____");
				}
			}).trigger('focusout').end()
			.filter('.mask-money').maskMoney({prefix:'R$ ', allowNegative: true, thousands:'.', decimal:',', affixesStay: true}).end();

		this.inputs.filter(function(index) {
			var _this = $(this);
			
			if( _this.hasClass('mask-custom') ) {
				_this.mask(_this.data('masks')).data('mask', _this.data('masks').replace(/9/g, '_'));
			}
		});
	};
});