(function ($, root, undefined) {
	
	$(function () {
		
		'use strict';

		let counter = 0;
		
		// $.ajax({
		// 	type: 'GET',
		// 	url: 'http://localhost/paulobauer/src/docs/success.json', // templateDir is declared in the footer
		// 	success: function(result) {
		// 		var length = result.length;

		// 		console.log(result);
		// 		create_posts(result);
		// 	},
		// });

		const create_posts = function (posts) {
			const post = posts[counter];

			if (!post.Cidade) {
				console.log('TODOS POSTS CRIADOS')

				return false;
			}

			const params = {
				action: 'wp_create_event',
				Cidade: post.Cidade,
				Valor: post.Valor,
				Tipo: post.Tipo,
				tema: post.tema,
				Descrição: post.Descrição,
				lat: post.lat,
				long: post.long
			}

			$.ajax({
				type: 'POST',
				data: params,
				url: ajaxurl, // templateDir is declared in the footer
				success: function(result) {
					if (result.status == 200) {
						console.log('Post Criado');
						counter++;
						create_posts(posts);
					} else {
						console.log('SUCCESS: Ocorreu um erro ao criar', post);
						counter++;
						create_posts(posts);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log('ERROR: Ocorreu um erro ao criar', post);
					counter++;
					create_posts(posts);
				}
			});
		}
	});
	
})(jQuery, this);
