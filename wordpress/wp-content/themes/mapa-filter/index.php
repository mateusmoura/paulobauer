<?php 
	$counter				= 0;
	$page_index				= 0;
	$posts_types			= array('acoes');

	$places					= query_posts( array( 'post_type' => $posts_types, 'posts_per_page' => '1000', 'orderby' => 'menu_order', 'order' => 'ASC' ) );

	for ($i = 0; $i < count($places); ++$i) {
		$lat_long = get_field('local', $places[$i]->ID);
		$select = get_field_object('tipo', $places[$i]->ID);
		$tema = $select['value'];
		$tipo = $select['choices'][$tema];
		$valor = get_field('valor', $places[$i]->ID);
		$post = get_post($places[$i]->ID);
		$categories = wp_get_post_categories($places[$i]->ID);
		$cats = array();

		foreach($categories as $c){
			$cat = get_category( $c );
			$category_link = get_category_link($c);
			$cats[] = array( 'name' => $cat->name, 'slug' => $cat->slug, 'permalink' => esc_url( $category_link ) );
		}

		$places[$i]->localizacao = $lat_long;
		$places[$i]->tipo = $tipo;
		$places[$i]->tema = $tema;
		$places[$i]->valor = $valor;
		$places[$i]->titulo = $post->post_title;
		$places[$i]->content = $post->post_content;
		// $places[$i]->post = $post;
		$places[$i]->categories = $cats;
	}

	$json_pages = json_encode($places);

	header('Content-Type: application/json');
	echo $json_pages;
?>
