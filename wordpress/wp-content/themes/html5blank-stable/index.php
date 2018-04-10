<?php get_header(); ?>

<?php 
	$counter				= 0;
	$page_index				= 0;
	$posts_types			= array('acoes');

	$places					= query_posts( array( 'post_type' => $posts_types, 'posts_per_page' => '1000', 'orderby' => 'menu_order', 'order' => 'ASC' ) );

	for ($i = 0; $i < count($places); ++$i) {
		$lat_long = get_field('local', $places[$i]->ID);
		$tipo = get_field('tipo', $places[$i]->ID);
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
		$places[$i]->valor = $valor;
		$places[$i]->titulo = $post->post_title;
		$places[$i]->content = $post->post_content;
		// $places[$i]->post = $post;
		$places[$i]->categories = $cats;
	}

	$json_pages = json_encode($places);

	
?>
	<script>
			var emendas = <?php echo $json_pages; ?>;

			console.log(emendas);
		</script>

	<code>
		<?php echo $json_pages; ?>
	</code>

	<main role="main">
		<!-- section -->
		<section>

			<h1><?php _e( 'Latest Posts', 'html5blank' ); ?></h1>

			<?php get_template_part('loop'); ?>

			<?php get_template_part('pagination'); ?>

		</section>
		<!-- /section -->
	</main>

<?php get_sidebar(); ?>

<?php get_footer(); ?>
