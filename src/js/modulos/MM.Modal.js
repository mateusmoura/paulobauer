/**
* Funcionalidade responsável por Configurar e mostrar as modais.
* @author: Mateus Moura
* @Version: 1.0
*/

Module('MM.Modal', function (Modal) {
	Modal.fn.initialize = function ($callfn) {
		this.modal = $('#modal').length ? $('#modal') : $('<div id="modal" class="modal"><div class="modal__container"></div></div>').appendTo($('body'));
		this.overlay = $('#overlay').length ? $('#overlay') : $('<div id="overlay"></div>').appendTo($('body'));
		this.call = $callfn;
		this.modalClass = '';

		this.addEventListeners();
	};
	/**
	* Efetua o AJAX do conteúdo da modal.
	*/
	Modal.fn.ajax = function ($url, $evt) {
		var _this = this;

		$.ajax({
			url: $url,
			method: $evt.currentTarget.dataset.modal ? 'POST' : 'GET',
			data: $evt.currentTarget.dataset.modal !== undefined && $evt.currentTarget.dataset.modal,
			cache: true,
			beforeSend: function () {
				//oTalk.loading.add(oTalk.overlay).fadeIn();
				_this.overlay.fadeIn();
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//console.log( "ERROR: ", jqXHR, textStatus, errorThrown );
				//oTalk.loading.add(oTalk.overlay).fadeOut();
				_this.overlay.fadeOut();
			},
			success: function (response) {
				//oTalk.loading.fadeOut();
				$(response).appendTo(_this.modal.find('.modal__container').empty());

				_this.posicionarModal($evt);

				if( _this.call != undefined ){
					_this.call();
				}
				//oTalk.actions[_fnmodal]();
			}
		});
	};
	/**
	* Centraliza a MODAL na página
	*/
	Modal.fn.posicionarModal = function ($evt, $m) {
		if($evt.currentTarget.dataset.cached === "true") {
			$('div.modal__container > div', this.modal).hide();
			$('div.modal__container div.' + $evt.currentTarget.rel, this.modal).show();
		}

		var _modal = $m != undefined ? $m : this.modal,
			_left =  $(window).width() - _modal.width(),
			_top = Math.abs($evt.pageY - (_modal.height() + 50));

		_left = _left/2;

		this.modal.addClass(this.modalClass);

		_modal.css({
			left: _left,
			top: isNaN(_top) ? 15 : _top + 35
		}).fadeIn();

		$("html, body").animate({
			scrollTop: _top
		}, 500 );
	};
	/**
	* Adiciona os eventos necessários.
	*/
	Modal.fn.addEventListeners = function(){
		$('.btn-modal')
			.on('click', this.onButtonClick.bind(this));

		this.modal
			.on('click', '.btn-close', this.onButtonClose.bind(this));

		this.overlay
			.on('click', this.onButtonClose.bind(this));
	};
	/**
	* Evento de CLICK do BOTÃO para mostrar a modal.
	*/
	Modal.fn.onButtonClick = function(event){
		this.modalClass = event.currentTarget.rel;

		if(event.currentTarget.rel != "" && event.currentTarget.dataset.cached == "true"){
			this.overlay.fadeIn();
			this.posicionarModal(event, this.modal);
		}else{
			this.ajax(event.currentTarget.href, event);
		}

		return false;
	};
	/**
	* Evento de CLICK do BOTÃO para fechar a modal.
	*/
	Modal.fn.onButtonClose = function(event){
		this.modal.fadeOut(function(){
			this.overlay.fadeOut();
			this.modal.removeClass(this.modalClass);
			this.modal.removeClass('modal__introduction');
		}.bind(this));

		return false;
	};
});
