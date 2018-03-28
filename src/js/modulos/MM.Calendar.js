/**
* Funcionalidade responsável por criar o calendário
* @author: Mateus Moura
* @Version: 1.0
*/
Module('MM.Calendar', function (Calendar) {
	Calendar.fn.initialize = function ($container, $json) {
		this.$container			= $container;
		this.$calendar			= $('#calendar, .calendar', this.$container);
		this.$actions			= $('.block__fullcalendar--actions', this.$container);
		this.$json				= $json;

		this.loadScripts();
	};
	/**
	* Carregar Scripts necessários para funcionalidade.
	*/
	Calendar.fn.loadScripts = function(){
		var _this = this;

		jQuery.ajaxSetup({
			cache: true
		});

		if(jQuery.fn.fullCalendar === undefined){
			$.when(
				$.getScript(base_url + "js/plugins/moment.min.js"),
				$.getScript(base_url + "js/plugins/jQuery.fullcalendar.js"),
				$.Deferred(function(deferred){
					$.getScript(base_url + "js/plugins/pt-br.js");
					$(deferred.resolve);
				})
			).done(function(){
				setTimeout(function () {
					_this.config();
				}, 1000);
			}).fail(function(a, b, c) {
				console.log('Erro getScript', a, b, c)
			});
		} else{
			_this.config();
		}
	};
	/**
	* Configuração do plugin para mostrar o calendário.
	*/
	Calendar.fn.config = function(){
		console.log('Events data>>> ', this.$json);

		this.$calendar.fullCalendar({
			defaultDate: moment().format('YYYY[-]MM[-]DD'),
			editable: false,
			lang: 'pt-br',
			eventLimit: true, // allow "more" link when too many events
			contentHeight: 1080,
			header : {
				left: 'prev',
				center: 'title',
				right: 'next'
			},
			dayNamesShort: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
			timeFormat: 'H(:mm)[h]',
			events: this.$json,
			eventLimitText: '',
			views: {
				basic: {
					columnFormat: 'ddd D/M'
				}
			},
			eventRender: function(event, element) {
				if(event.description) {
					$('<p class="fc-description">' + event.description + '</p>').appendTo(element.find('.fc-content'));
				}

				if(event.image) {
					$('<img src="' + event.image + '" alt="'+ event.title +'" class="fc-image">').prependTo(element.find('.fc-content'));
				}
			}
		});

		this.addEventListeners();
	};
	/**
	* Adiciona os eventos necessários.
	*/
	Calendar.fn.addEventListeners = function () {
		this.$actions
			.on('click', '.btn-month', function (event) {
				event.preventDefault();
				/* Act on the event */
				$('.btn-active', this.$actions).removeClass('btn-active btn-default').addClass('btn-disabled btn-white-b');
				$(event.currentTarget).addClass('btn-active btn-default');
				this.$calendar.fullCalendar('changeView', 'month');
			}.bind(this))
			.on('click', '.btn-week', function (event) {
				event.preventDefault();
				/* Act on the event */
				$('.btn-active', this.$actions).removeClass('btn-active btn-default').addClass('btn-disabled btn-white-b');
				$(event.currentTarget).addClass('btn-active btn-default');
				this.$calendar.fullCalendar('changeView', 'basicWeek');
			}.bind(this));
	};
});