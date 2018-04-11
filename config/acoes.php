<?php
/*
Plugin Name: TODO - Emendas
Version: 1.0-todo
Plugin URI: http://www.todo.com
Description: TODO - Custom post type Emendas
Author: TODO - Simple Custom Post Types Generator
Author URI: http://www.todo.com

----

Copyright 2012 - TODO Author

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/

add_action( 'init', 'register_my_cpt_acoes', 10 );
function register_my_cpt_acoes() {
register_post_type( "acoes", array (
  'labels' => 
  array (
    'name' => 'Emendas',
    'singular_name' => 'Emenda',
    'add_new' => 'Adicionar nova',
    'add_new_item' => 'Adicionar nova Emenda',
    'edit_item' => 'Editar Emenda',
    'new_item' => 'Nova Emenda',
    'view_item' => 'Visualizar Emenda',
    'search_items' => 'Buscar Emenda',
    'not_found' => 'Nenhuma Emenda encontrada',
    'not_found_in_trash' => 'Nenhuma Emenda encontrada no Lixo',
    'parent_item_colon' => 'Parent Entry:',
  ),
  'description' => '',
  'publicly_queryable' => true,
  'exclude_from_search' => false,
  'map_meta_cap' => true,
  'capability_type' => 'post',
  'public' => true,
  'hierarchical' => false,
  'rewrite' => 
  array (
    'slug' => 'acoes',
    'with_front' => true,
    'pages' => true,
    'feeds' => true,
  ),
  'has_archive' => true,
  'query_var' => 'acoes',
  'supports' => 
  array (
    0 => 'title',
    1 => 'editor',
    2 => 'custom-fields',
  ),
  'taxonomies' => 
  array (
    0 => 'category',
  ),
  'show_ui' => true,
  'menu_position' => 30,
  'menu_icon' => false,
  'can_export' => true,
  'show_in_nav_menus' => true,
  'show_in_menu' => true,
) );
}