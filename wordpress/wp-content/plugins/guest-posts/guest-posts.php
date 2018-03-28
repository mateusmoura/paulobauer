<?php
/**
 * Plugin Name: Guest Posts
 * Plugin URI: http://www.ibabar.com/blog/guest-posts
 * Description: Give an opportunity to your unregistered readers to post on your Blog.
 * Version: 2.0
 * Author: ibabar
 * Author URI: http://www.ibabar.com
 * Requires at least: 3.0
 * Tested Up to: 3.8.1
 * Stable Tag: 2.0
 * License: GPL v2
 * Shortname: gp or gp_
 */


$guest_posts = new Guest_Posts();
class Guest_Posts{

    private $category;
    private $author;
    public $thanks_page;

    function __construct(){
        add_shortcode('guest-posts', array($this, 'gp_guestposts_shortcode'));
        add_action('wp_ajax_gp_submit_and_save_guests_post', array($this, 'gp_submit_and_save_guests_post_ajax_callback'));
        add_action('wp_ajax_nopriv_gp_submit_and_save_guests_post', array($this, 'gp_submit_and_save_guests_post_ajax_callback'));
        add_action('admin_menu', array($this, 'gp_register_option_page'));
        add_action('admin_init', array($this, 'gp_settings_page_content'));
    }

    function gp_guestposts_shortcode( $atts ) {
        extract ( shortcode_atts (array(
            'cat' => '',
            'author' => '',
            'thanks' => '',
        ), $atts ) );
        $this->category = $cat;
        $this->author = $author;
        $this->thanks_page = $thanks;

        ?>
        <form class="guests-post" id="guests-post" onsubmit="return false" method="post">
            <div class="info" style="display: none"></div>
            <strong><?php echo __('Post Title:', 'guest-posts') ?></strong><br>
            <input type="text" name="title" size="60" required="required" placeholder="<?php echo __('Post title here', 'guest-posts') ?>"><br>
            <strong><?php echo __('Story', 'guest-posts') ?></strong>
            <?php wp_nonce_field('gp_submit_and_save_guests_post', 'gp_submit_and_save_guests_post_unique_key') ?>
            <textarea rows="15" cols="72" required="required" name="story" placeholder="<?php echo __('Start writing your post here', 'guest-posts') ?>"></textarea><br>
            <strong><?php echo __('Tags', 'guest-posts') ?></strong><br>
            <input type="text" name="tags" size="60" placeholder="<?php echo __('Comma Separated Tags', 'guest-posts') ?>"><br><br>
            <strong><?php echo __('Your Name', 'guest-posts') ?></strong><br>
            <input type="text" name="author" size="60" required="required" placeholder="<?php echo __('Your name here', 'guest-posts') ?>"><br>
            <strong><?php echo __('Your Email', 'guest-posts') ?></strong><br>
            <input type="email" name="email" size="60" required="required" placeholder="<?php echo __('Your Email Here', 'guest-posts') ?>"><br>
            <strong><?php echo __('Your Website', 'guest-posts') ?></strong><br>
            <input type="text" name="site" size="60" placeholder="<?php echo __('Your Website Here', 'guest-posts') ?>"><br><br><br>
            <input type="hidden" value="<?php echo $this->category; ?>" name="category">
            <input type="hidden" value="<?php echo $this->author; ?>" name="authorid">
            <input type="hidden" value="<?php echo $this->thanks_page; ?>" name="thanks">
            <input type="submit" value="<?php echo __('Submit The Post', 'guest-posts') ?>"> <input type="reset" value="<?php echo __('Reset', 'guest-posts') ?>">
            <br>
        </form>
        <script type="text/javascript">
            jQuery(document).ready(function($){
                jQuery('#guests-post').on('submit', function(event){
                    event.preventDefault();
                    jQuery.post(
                        '<?php echo admin_url("admin-ajax.php"); ?>',
                        jQuery('#guests-post').serialize() + '&action=gp_submit_and_save_guests_post',
                        function(response){
                            console.log(response);
                            if(response.dead){
                                jQuery('#guests-post').hide().children('.info').text(response.dead).show(1500);
                                return;
                            }
                            console.log('Passed Dead');
                            jQuery('#guests-post').hide().children('.info').text(response.success).show(1500);
                            if(response.redirect_to){
                                setInterval(function(){
                                    window.location.href = response.redirect_to;
                                }, 1500);
                            }
                        }, 'json'
                    );
                });
            });
        </script>
        <?php
        return '';
    }


    function gp_submit_and_save_guests_post_ajax_callback(){
        header('Content-Type: application/json');
        $title = $_POST["title"];
        $story = $_POST["story"];
        $tags = $_POST["tags"];
        $author = $_POST["author"];
        $email = $_POST["email"];
        $site = $_POST["site"];

        if(empty($_POST["authorid"])) $authorid = get_option('gp_author_id'); else $authorid = $_POST["authorid"];
        if(!$authorid) $authorid = 1;

        if(empty($_POST["category"])) $category = get_option('gp_post_category'); else $category = $_POST["category"];
        if(!$category) $category = array(1);
        if(!is_array($category)) $category = array($category);

        if(empty($_POST["thanks"])) $redirect_to = get_option('gp_redirection_url'); else $redirect_to = $_POST["thanks"];
        if(!$redirect_to) $redirect_to = home_url();

        $nonce = $_POST["gp_submit_and_save_guests_post_unique_key"];

//Verify the form fields
        if(empty($title) || empty($story) || empty($author) || empty($email) || empty($nonce)) die(json_encode(array('dead'=>'Please fill the form.')));
        if (! wp_verify_nonce($nonce, 'gp_submit_and_save_guests_post') ) die(json_encode(array('dead'=>'Failed Security check')));

        //Post Properties
        $new_post = array(
            'post_title'    => $title,
            'post_content'  => $story,
            'post_category' => $category,  // Usable for custom taxonomies too
            'tags_input'    => $tags,
            'post_status'   => 'pending',           // Choose: publish, preview, future, draft, etc.
            'post_type' => 'post',  //'post',page' or use a custom post type if you want to
            'post_author' => $authorid //Author ID
        );
//        var_dump($new_post);
        //save the new post
        $pid = wp_insert_post($new_post);

        /* Insert Form data into Custom Fields */
        add_post_meta($pid, 'author', $author, true);
        add_post_meta($pid, 'author-email', $email, true);
        add_post_meta($pid, 'author-website', $site, true);

        if($pid){
            die(json_encode(array(
                'success'       => 'Your post has been submitted successfully. Now redirecting..................',
                'redirect_to'   => $redirect_to
            )));
        }
        die(json_encode(array('dead'=>'Something went wrong')));
    }

    function gp_register_option_page() {
        add_options_page(
            'Guest Posts Settings',
            'Guest Posts',
            'manage_options',
            'guest-posts-settings',
            array($this, 'gp_option_page_callback')
        );


    }
    function gp_option_page_callback() {
        echo '<div id="icon-options-general" class="icon32"></div><h2>Guest Post Settings</h2>';
        echo '<div class="wrap">';
        echo '<form method="post" action="options.php">';
        settings_fields( 'gp_settings_section' );
        do_settings_sections('guest-posts-settings');
        submit_button();
        echo '</form>';
        echo '</div>';
    }


    function gp_settings_page_content() {

        add_settings_section(
            'gp_settings_section',
            'Guest Post Settings',
            array($this, 'gp_settings_section_callback'),
            'guest-posts-settings'
        );

        add_settings_field(
            'gp_author_id',
            'Author ID to save posts',
            array($this, 'gp_author_id_callback'),
            'guest-posts-settings',
            'gp_settings_section'
        );

        register_setting(
            'gp_settings_section',
            'gp_author_id'
        );

        add_settings_field(
            'gp_post_category',
            'Select Caregories to Post',
            array($this, 'gp_post_category_callback'),
            'guest-posts-settings',
            'gp_settings_section'
        );

        register_setting(
            'gp_settings_section',
            'gp_post_category'
        );

        add_settings_field(
            'gp_redirection_url',
            'Redirection URl after submission',
            array($this, 'gp_redirection_url_callback'),
            'guest-posts-settings',
            'gp_settings_section'
        );

        register_setting(
            'gp_settings_section',
            'gp_redirection_url'
        );



    }

    /** Callbacks */

    function gp_settings_section_callback() {}

    function gp_author_id_callback() {
        echo '<input type="text" required name="gp_author_id" value="'.get_option('gp_author_id').'" class="regular-text" />';
    }

    function gp_post_category_callback() {
        $categories = get_categories(array('type' => 'post'));
        $selected_category = get_option('gp_post_category');
        if(!is_array($selected_category)) $selected_category = array($selected_category);
        ?>
        <style type="text/css" scoped>
            .selectcategories {
                height: 200px;
                width: 30%;
                min-width: 200px;
                padding-left: 8px;
                overflow-y: auto;
                border: 1px solid #ccc;
                border-right: 0;
                background-color: #FFF;
                padding-top: 5px;
            }

        </style>
        <?php
        echo '<div class="selectcategories">';
        foreach($categories as $category) {
            $html = '<input type="checkbox" name="gp_post_category[]" value="'. $category->cat_ID .'" ';
            if(in_array($category->cat_ID, $selected_category)) $html .= 'checked="checked"';
            $html .= ' />'.$category->name.'<br />';
            echo $html;
        }
        echo '</div>';
    }

    function gp_redirection_url_callback() {
        echo '<input type="text" required name="gp_redirection_url" value="'.get_option('gp_redirection_url').'" class="regular-text" />';
    }


}