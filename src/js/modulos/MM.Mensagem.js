/**
* Funcionalidade responsável por personalizar as mensagens do site
* @author: Mateus Moura
* @Version: 1.0
*/
Module('CNA.Mensagem', function(Mensagem){
	Mensagem.fn.initialize = function(titulo, mensagem, tipo){
		this.titulo = titulo;
		this.mensagem = mensagem;
		this.tipo = tipo;

		$('div.message-alert').length 
			? this.html = $('div.message-alert')
			: this.html = $("<div class='message-alert'><a href='#this' class='bt-fechar'><i class='icon icon-fechar'></i></a> <span class='bg'></span><h2></h2><p></p></div>").appendTo('body');

		$('#overlay').length
			? this.overlay = $('#overlay')
			: this.overlay = $('<div id="overlay"></div>').appendTo('body');

		this.config();
		this.addEventListeners();
		this.mostrar();
	};
	/**
	* Configurações da função
	*/
	Mensagem.fn.config = function(titulo, mensagem, tipo){
		var tipo = this.tipo == null ? "" : this.tipo;

		this.html.attr("class", "message-alert " + tipo);
		this.html.find("h2").html(this.titulo);
		this.html.find("p").html(this.mensagem);

		if ($.browser.msie && $.browser.version == "6.0")
			this.html.css('top', $(window).scrollTop() + 100);
	};
	/**
	* Mostrar a mensagem personalizada.
	*/
	Mensagem.fn.mostrar = function(){
		this.html.add(this.overlay).fadeIn('slow');
	};
	/**
	* Adiciona os eventos necessários.
	*/
	Mensagem.fn.addEventListeners = function(){
		$('.bt-fechar', this.html)
			.on('click', this.onButtonClick.bind(this));

		this.overlay
			.on('click', this.onButtonClick.bind(this));
	};
	/**
	* Evento de CLICK para fechar a Mensagem.
	*/
	Mensagem.fn.onButtonClick = function(){
		this.html.add(this.overlay).fadeOut('slow');
	};
});