/**
* Funcionalidade responsável por customizar os Checkbox ou Radios
* @author: Mateus Moura
* @Version: 1.0
*/

Module('CNA.CustomizarChecks', function(CustomizarChecks){
	CustomizarChecks.fn.initialize = function($inputs){
		var _this = this;
		this.allInputs = $('input[type=radio], input[type=checkbox]');

		if( $inputs != undefined ){
			for (var i = $inputs.length - 1; i >= 0; i--) {
				_this.building($inputs.eq(i));
			};
		} else{
			for (var i = _this.allInputs.length - 1; i >= 0; i--) {
				_this.building(_this.allInputs.eq(i));
			};
		}
		
	};
	/**
	* Construir campos necessários.
	*/
	CustomizarChecks.fn.building = function($input){
		var _div = $('<div class="custom-checks"></div>');

		_div.insertAfter($($input));
		$($input).appendTo(_div);

		this.addEventListeners($input);
	};
	/**
	* Adiciona os eventos necessários.
	*/
	CustomizarChecks.fn.addEventListeners = function($input){
		$input
			.on('click', this.onInputClick);
	};
	/**
	* Evento de CLICK do INPUT
	*/
	CustomizarChecks.fn.onInputClick = function(event){
		var _inp = $(this);

		if( _inp.is('[type=checkbox]') ){
			_inp.is(':checked') ? _inp.parent().addClass('selecionado') : _inp.parent().removeClass('selecionado');
		}
		else{
			$('.selecionado input[name='+ _inp.attr('name') +']').parent().removeClass('selecionado');
			_inp.parent().addClass('selecionado');
		}
	};
});