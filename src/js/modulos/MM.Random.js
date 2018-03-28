/**
* Funcionalidade responsável pelo Random da BG de FUNDO
* @author: Mateus Moura
* @Version: 1.0
*/

Module('MM.Random', function (Random) {
	Random.fn.initialize = function (block, url, range, time){
		this.block				= block;
		this.url				= url;
		this.range				= range;
		this.timeStamp			= time;
		this.idTime				= 0;

		this.config();
	};
	/**
	* Configuração inicial do Random
	*/
	Random.fn.config = function(){
		$('.header__image--post-preloading', this.block).attr('src', base_url + this.url + Math.floor(Math.random() * (this.range - 1) + 1) + '.jpg').load(function () {
			$('.header__image--post img:not(.header__image--post-preloading)').addClass('header__image--post-preloading');
			$(this).removeClass('header__image--post-preloading');
		});

		//this.addEventListeners();
	};
	/**
	* Adiciona os eventos necessários.
	*/
	Random.fn.addEventListeners = function(){
		this.idTime = setTimeout( function () {
			var _this = this;
			clearInterval(this.idTime);
			$('.header__image--post-preloading', this.block).attr('src', base_url + this.url + Math.floor(Math.random() * (this.range - 1) + 1) + '.jpg').unbind().load(function () {
				$('.header__image--post img:not(.header__image--post-preloading)').addClass('header__image--post-preloading');
				$(this).removeClass('header__image--post-preloading');
				_this.addEventListeners();
			});
		}.bind(this), this.timeStamp);
	};
});