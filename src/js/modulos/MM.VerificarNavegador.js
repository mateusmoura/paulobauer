/**
* Funcionalidade responsável por Verificar o navegador que está sendo utilizado.
* @author: Mateus Moura
* @Version: 1.0
*/

Module('MM.VerificarNavegador', function (VerificarNavegador) {
	VerificarNavegador.fn.initialize = function () {
		var _this = this;

		this.loadScripts();
		this.adicionarClasse();
	};
	/**
	* Carregar Scripts necessários para funcionalidade.
	*/
	VerificarNavegador.fn.loadScripts = function () {
		var _this = this;

		jQuery.ajaxSetup({
			cache: true
		});

		if( $.upgradebrowsers === undefined ){
			jQuery.getScript(base_url + "js/plugins/jQuery.upgradebrowsers.min.js")
				.done(function () {
					_this.building();
				})
				.fail(function () {
					console.log('Erro getScript')
				});
		} else{
			_this.building();
		}
	};
	/**
	* Construir mensagem para o usuário fazer o upgrade
	*/
	VerificarNavegador.fn.building = function () {
		$.upgradebrowsers({
			versions : { chrome:15, mozilla:7, opera:11, safari:5, msie:9 },
			messages : {
				pt:"<strong>Esta não é a última versão do seu navegador!</strong><br /><span>Por favor, atualize-o clicando em um dos links ao lado e você terá uma melhor visualização do site.</span>"
			}
		});
	};
	/**
	* Adiciona classes no Body para determinados navegadores
	*/
	VerificarNavegador.fn.adicionarClasse = function () {
		$.browser.mozilla != undefined
			? $("body").addClass("mozilla")
			: $.browser.opera != undefined
				? $("body").addClass("opera")
				: $.browser.safari != undefined && $("body").addClass("safari");
	};
});

var matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
jQuery.uaMatch = function (ua) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

matched = jQuery.uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
	browser[ matched.browser ] = true;
	browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
	browser.webkit = true;
} else if ( browser.webkit ) {
	browser.safari = true;
}

jQuery.browser = browser;

/* */