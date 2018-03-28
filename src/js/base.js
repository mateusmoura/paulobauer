/**
* Arquivo responsavel pela chamada de todas as funcionalidades do site 
*
* @author: Mateus Moura
* @email: chagas[dot]mateus[at]gmail[dot]com
* @date: 27/03/2018
* 
* Copyright(c) Todos os direitos reservados a 
*/

if (window.console == null) window.console = { log: function (p) { }, error: function (p) { } };

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP = function () {},
      fBound = function () {
        return fToBind.apply(this instanceof fNOP && oThis
             ? this
             : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)));
      };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

var site = {
  /*
  * Funcionalidades GLOBAL onde e chamado em todas as páginas do projeto.
  */
  global: function(){
    var _collapse = $('.collapse');

    // MM.Mascarar();
    // for (var i = _collapse.length - 1; i >= 0; i--) {
    //   MM.Collapsible(_collapse.eq(i), true);
    // };

    // MM.Modal();
    // MM.ValidarFormularios($('form.validate'));

    // var data = [
    //   {
    //     "title": "All Day Event",
    //     "start": "2015-12-01",
    //     'description': 'Hurrayyyyyyyyyy',
    //   },
    //   {
    //     "title": "Long Event",
    //     "start": "2015-12-07",
    //     "image": "http://www.skiheavenly.com/~/media/heavenly/images/732x260%20header%20images/events-heavenly-header.ashx",
    //     "end": "2015-12-10"
    //   },
    //   {
    //     "id": "999",
    //     "title": "Repeating Event",
    //     "start": "2015-12-09T16:00:00-05:00"
    //   },
    //   {
    //     "id": "999",
    //     "title": "Repeating Event",
    //     "start": "2015-12-16T16:00:00-05:00"
    //   },
    //   {
    //     "title": "Conference",
    //     "start": "2015-12-11",
    //     "end": "2015-12-13"
    //   },
    //   {
    //     "title": "Meeting",
    //     "start": "2015-12-12T10:30:00-05:00",
    //     "end": "2015-12-12T12:30:00-05:00"
    //   },
    //   {
    //     "title": "Lunch",
    //     "start": "2015-12-12T12:00:00-05:00"
    //   },
    //   {
    //     "title": "Meeting",
    //     "image": "http://www.skiheavenly.com/~/media/heavenly/images/732x260%20header%20images/events-heavenly-header.ashx",
    //     "start": "2015-12-12T14:30:00-05:00"
    //   },
    //   {
    //     "title": "Happy Hour",
    //     "start": "2015-12-12T17:30:00-05:00"
    //   },
    //   {
    //     "title": "Dinner",
    //     "start": "2015-12-12T20:00:00"
    //   },
    //   {
    //     "title": "Birthday Party",
    //     "start": "2015-12-13T07:00:00-05:00"
    //   },
    //   {
    //     "title": "Click for Google",
    //     "url": "http://google.com/",
    //     "start": "2015-12-28"
    //   },
    //   {
    //     "title": "Click for Google",
    //     "url": "http://google.com/",
    //     "start": "2016-01-02"
    //   }
    // ];

    if($('main').hasClass('about')) {
      this.home();
    }

    // MM.Calendar($('.block__fullcalendar'), data);
  },
  /* Home page */
  home: function () {
    
  },
  /*
  * Callback quando salva um evento na modal.
  */
  registerEvent: function () {
    console.log('Callback modal');
  }
}


$( function(){
  site.global();
});