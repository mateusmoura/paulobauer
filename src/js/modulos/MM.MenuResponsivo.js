/**
* Funcionalidade responsável por abrir o menu responsivo
* @author: Mateus Moura
* @version: 1.0
*/

Module('CNA.MenuResponsivo', function(MenuResponsivo){
	MenuResponsivo.fn.initialize = function(){
		this.menu = $('aside');
		this.botao = $('.btn-abrirMenu, .btn-fecharMenu');
		this.bloquear = false;

		this.config();
		this.addEventListeners();
	};
	/**
	* Funcionalidade para efetuar as configurações
	*/
	MenuResponsivo.fn.config = function(){
		var _this = this,
			_wHeight = $(window).height(),
			_maxHeight = this.menu.find('ul').height() + 150;
			fn_ajustando = function(){
				if( $(this).height() > _maxHeight ){
					_this.menu.height($(this).height());
				}else{
					_this.menu.height(_wHeight);
				}

				if( $(window).width() > 1290 ){
					_this.bloquear = true;

					$('#global').addClass('menu-aberto');

					_this.botao.stop(0, 0).fadeToggle();

					setTimeout(function(){
						$('#global').hasClass('menu-aberto')
							&& $('li a span', _this.menu).css('display', 'inline-block').stop(0, 0).animate({opacity: 1}, 300);
					}, 600 );

					//$('header, main, footer').width('84%');
				} else{
					_this.bloquear = false;

					$('#global').removeClass('menu-aberto');

					if(!$('#global').hasClass('menu-aberto') ){
						$('li a span, .usuario span', _this.menu).stop(0, 0).animate({opacity: 0}, 300, function(){
							$(this).css('display', 'none')
						});
					}
				}
			}, _setTime = "";

		this.menu.height(_wHeight);

		$(window).resize(function(event) {
			clearTimeout( _setTime );

			_setTime = setTimeout(function(){
				fn_ajustando();
			}, 300 );

			// setTimeout(function(){
			// 	var _b = ((($(window).width() - ($('aside').width() + 2)) * 100 ) / $(window).width()) + '%'; 
			// 	document.getElementsByTagName('header')[0].style.width = _b;
			// 	document.getElementsByTagName('main')[0].style.width = _b;
			// 	document.getElementsByTagName('footer')[0].style.width = _b;
			// }, 800 )
			
		});

		if( $(window).width() > 1290 && !$('main.login').length ){
			_this.bloquear = true;

			$('#global').addClass('menu-aberto');

			_this.botao.stop(0, 0).fadeToggle();

			setTimeout(function(){
				$('#global').hasClass('menu-aberto')
					&& $('li a span, .usuario span', _this.menu).css('display', 'inline-block').stop(0, 0).animate({opacity: 1}, 300);
			}, 600 );
		} else{
			_this.bloquear = false;

			$('#global').removeClass('menu-aberto');

			if(!$('#global').hasClass('menu-aberto') ){
				$('li a span, .usuario span', _this.menu).stop(0, 0).animate({opacity: 0}, 300, function(){
					$(this).css('display', 'none')
				});
			}
		}
		// SE PRECISAR DESSA FUNCIONALIDADE VAI TER QUE SER USADA COM UM TIMEOUT.
		// setTimeout(function(){
		// 	var _b = ((($(window).width() - ($('aside').width() + 2)) * 100 ) / $(window).width()) + '%'; 
		// 	document.getElementsByTagName('header')[0].style.width = _b;
		// 	document.getElementsByTagName('main')[0].style.width = _b;
		// 	document.getElementsByTagName('footer')[0].style.width = _b;
		// }, 800 );
	};
	/**
	* Adiciona os eventos necessÃ¡rios.
	*/
	MenuResponsivo.fn.addEventListeners = function(){
		var _this = this;

		this.botao
			.on('click', this.toggleOpen.bind(this));

		this.menu.hover(function(){
			_this.toggleOpen();

			// setTimeout(function(){
			// 	var _b = ((($(window).width() - ($('aside').width() + 2)) * 100 ) / $(window).width()) + '%'; 
			// 	document.getElementsByTagName('header')[0].style.width = _b;
			// 	document.getElementsByTagName('main')[0].style.width = _b;
			// 	document.getElementsByTagName('footer')[0].style.width = _b;
			// }, 800 );

		}, function(){
			_this.toggleOpen();

			// setTimeout(function(){
			// 	var _b = ((($(window).width() - ($('aside').width() + 2)) * 100 ) / $(window).width()) + '%'; 
			// 	document.getElementsByTagName('header')[0].style.width = _b;
			// 	document.getElementsByTagName('main')[0].style.width = _b;
			// 	document.getElementsByTagName('footer')[0].style.width = _b;
			// }, 800 );
		});
	};
	/**
	* Funcionalidade que mostra ou esconder o menu
	*/
	MenuResponsivo.fn.toggleOpen = function(event){
		var _this = this;

		if(_this.bloquear) return false;

		$('#global').toggleClass('menu-aberto');

		_this.botao.stop(0, 0).fadeToggle();

		setTimeout(function(){
			$('#global').hasClass('menu-aberto')
				&& $('li a span, .usuario span', _this.menu).css('display', 'inline-block').stop(0, 0).animate({opacity: 1}, 300);
		}, 600 );

		!$('#global').hasClass('menu-aberto') && $('li a span, .usuario span', _this.menu).hide();

		return false;
	};
});