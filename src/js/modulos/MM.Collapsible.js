/**
* Funcionalidade responsável pelo Collapse.
* @author: Mateus Moura
* @Version: 1.0
*/

Module('MM.Collapsible', function(Collapsible){
	Collapsible.fn.initialize = function($container, $closeOthers){
		this.container = $container;
		this.coll_title = $container.find('.coll_title');
		this.coll_content = $container.find('.coll_content');
		this.colorChange = $container.hasClass('close');
		this.closeOthers = $closeOthers;

		$container.hasClass('open')
			&& $container.removeClass('close');

		this.addEventListeners();
	};
	/**
	* Adiciona os eventos necessários.
	*/
	Collapsible.fn.addEventListeners = function(){
		this.coll_title
			.on('click', this.toggleOpen.bind(this));
	};
	/**
	* Funcionalidade que mostra o conteúdo.
	*/
	Collapsible.fn.toggleOpen = function(){
		this.coll_content.slideToggle('500');
		this.container.toggleClass('open');

		if(this.colorChange){
			this.container.toggleClass('close');
		}

		if( this.closeOthers){
			this.coll_title.parent().siblings('.collapse.open')
				.find('.coll_content').slideUp(function(){
					$(this).parent().removeClass('open');
				}).end();
		}
		
		return false;
	};
});