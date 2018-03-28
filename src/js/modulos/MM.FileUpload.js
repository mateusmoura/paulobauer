/**
* Funcionalidade responsável por customizar os inputs de upload no formulário
* @author: Mateus Moura
* @Version: 1.0
*/

Module('CNA.FileUpload', function(FileUpload){
	FileUpload.fn.initialize = function($input){
		this.inputs = $input != undefined ? $input : $('input[type=file]');

		//this.config();
		this.loadScripts();
	};
	/**
	* Carregar Scripts necessários para funcionalidade.
	*/
	FileUpload.fn.loadScripts = function(){
		var _this = this;

		jQuery.ajaxSetup({
			cache: true
		});

		if($.fn.dropzone === undefined){
			$.when(
				$.getScript(base_url + "js/plugins/dropzone.js"),
				$.Deferred(function(deferred){
					$(deferred.resolve)
				})
			).done(function(){
				_this.config();
			}).fail(function() {
				console.log('Erro getScript')
			});
		} else{
			_this.config();
		}
	};
	/**
	* Configuração do plugin para mostrar o dropzone.
	*/
	FileUpload.fn.config = function(){
		var preview = '<div class="dz-preview dz-file-preview">\
						  <div class="dz-details">\
						    <div class="dz-filename"><span data-dz-name></span></div>\
						    <div class="dz-size" data-dz-size></div>\
						    <img data-dz-thumbnail />\
						  </div>\
						  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\
						  <div class="dz-success-mark"><span>✔</span></div>\
						  <div class="dz-error-mark"><span>✘</span></div>\
						  <div class="dz-error-message"><span data-dz-errormessage></span></div>\
						</div>'

		this.inputs
			.parent('.dropzone').dropzone({ url: "/file", previewTemplate: preview, dictDefaultMessage: 'Arraste ou  selecione um arquivo' });
	};
});