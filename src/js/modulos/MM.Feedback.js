/**
* Funcionalidade responsável por personalizar as mensagens do site
* @author: Mateus Moura
* @Version: 1.0
*/

Module('CNA.Feedback', function(Feedback){
	Feedback.fn.initialize = function($texto, $tipo, $url){
		this.texto = $texto;
		this.tipo = $tipo;
		this.url = $url;

		this.config();
		this.mostrar();
	};
	/**
	* Configurações da função
	*/
	Feedback.fn.config = function(){
		var _tipo = this.tipo == null ? "" : this.tipo;

		if( _tipo === 'sucesso' ){
			this.feedback = $('<div class="feedback sucesso"><p>'+this.texto+'</p></div>').appendTo($('main'));
		}else if (_tipo === 'erro') {
			this.feedback =  $('<div class="feedback error"><p>'+this.texto+'</p><a href="'+this.url+'">Ajuda</a></div>').appendTo($('main'));
		}else{
			this.feedback =  $('<div class="feedback atencao"><p>'+this.texto+'</p><a href="'+this.url+'">Desfazer</a></div>').appendTo($('main'));
		};
	};
	/**
	* Mostrar a mensagem personalizada.
	*/
	Feedback.fn.mostrar = function(){
		var _this = this;
		console.log( _this.feedback.height() )

		this.feedback.css({
			top: -( _this.feedback.height() )
		}).animate({
			top: '10px',
			opacity: 1
		}, 800 )

		this.feedback.fadeIn(2500 , function() {
			setTimeout( function(){
				_this.esconder();
			}, 3000 )
		});


	};
	/**
	* Esconde a mensagem personalizada.
	*/
	Feedback.fn.esconder = function(){
		var _this = this;

		this.feedback.animate({
			opacity: 0,
			top: -( _this.feedback.height() )
		}, 800, function(){
			_this.feedback.remove();
		});
	};
});