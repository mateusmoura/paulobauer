/**
* Funcionalidade responsável pelo Collapse.
* @author: Mateus Moura
* @Version: 1.0
*/

Module('CNA.Listas', function(Listas){
	Listas.fn.initialize = function(){
		this.listas = $('div.listas');

		for (var i = this.listas.length - 1; i >= 0; i--) {
			this.fixarCabeca(this.listas.eq(i).data('lista', i));
		};

		this.addEventListeners();
		
	};
	/**
	* Funcionalidade responsável por adicionar deixar fixo a barra da listagem.
	*/
	Listas.fn.fixarCabeca = function($lista){
		var _boxCabeca = $('.box-cabeca', $lista),
			_posicao = _boxCabeca.offset().top;

		$(window).scroll(function(event) {
			$(this).scrollTop() >= _posicao
				? _boxCabeca.addClass('fixar')
				: _boxCabeca.removeClass('fixar')
		});
	}
	/**
	* Adiciona os eventos necessários.
	*/
	Listas.fn.addEventListeners = function(){
		$('.box-esquerda')
			.on('change', 'input', this.onSelecionarItem);

		$('.lista-acoes')
			.on('change', '.checkbox input', this.onSelecionarTodos);

		if( $('div.box-conteudo', this.listas).hasClass('box-links') ){
			this.listas
				.on('click', '.box-item', function(event) {
					if( !$(event.target).is('input[type=checkbox]') && !$(event.target).is('label') ){
						window.location.href = base_url + $(this).data('url');
					}
				});
		}
	};
	/**
	* Funcionalidade para selecionar 1 item.
	*/
	Listas.fn.onSelecionarItem = function($event){
		$(this).is(':checked')
			? $(this).parents('.box-item').addClass('selecionado')
			: $(this).parents('.box-item').removeClass('selecionado');
	};
	/**
	* Funcionalidade para selecionar todos os itens.
	*/
	Listas.fn.onSelecionarTodos = function($event){
		var _bt = $(this);

		if( _bt.is(':checked') ){
			_bt.parents('.listas')
				.find('.box-conteudo .checkbox input:not(:checked)').trigger('click');
		}else{
			_bt.parents('.listas')
				.find('.box-conteudo .checkbox input').trigger('click');
		}
	}
});