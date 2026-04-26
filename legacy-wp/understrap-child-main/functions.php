<?php
/**
 * Understrap Child Theme functions and definitions
 *
 * @package UnderstrapChild
 */

defined( 'ABSPATH' ) || exit;


add_action( 'wp_enqueue_scripts', 'yugotour_enqueue_styles', 999 );
function yugotour_enqueue_styles() {
    wp_enqueue_style( 'child-understrap-style', get_stylesheet_directory_uri() . '/style.css', array( 'understrap-styles' ) );
    wp_dequeue_script( 'yugotour-custom-js' );
    wp_deregister_script( 'yugotour-custom-js' );
    wp_localize_script( 'child-understrap-scripts', 'yugoData', array(
        'theme_url' => get_stylesheet_directory_uri(),
        'ajax_url'  => admin_url('admin-ajax.php'),
    ));
}

function yugotour_load_font_awesome() {
    wp_enqueue_style( 'font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css' );
}
add_action( 'wp_enqueue_scripts', 'yugotour_load_font_awesome' );

function understrap_remove_scripts() {
    wp_dequeue_style( 'understrap-styles' );
    wp_deregister_style( 'understrap-styles' );
    wp_dequeue_script( 'understrap-scripts' );
    wp_deregister_script( 'understrap-scripts' );
}
add_action( 'wp_enqueue_scripts', 'understrap_remove_scripts', 20 );

// Manually enqueue MetaSlider public CSS since No Conflict mode prevents it
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style(
        'metaslider-public',
        plugins_url('ml-slider/assets/metaslider/public.css'),
        array(),
        '3.108.0'
    );
    wp_enqueue_style(
        'metaslider-flex-slider',
        plugins_url('ml-slider/assets/sliders/flexslider/flexslider.css'),
        array(),
        '3.108.0'
    );
});

function theme_enqueue_styles() {
    $the_theme     = wp_get_theme();
    $theme_version = $the_theme->get( 'Version' );
    $suffix        = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
    $theme_styles  = "/css/child-theme{$suffix}.css";
    $theme_scripts = "/js/child-theme{$suffix}.js";
    $css_version   = $theme_version . '.' . filemtime( get_stylesheet_directory() . $theme_styles );
    $js_version    = $theme_version . '.' . filemtime( get_stylesheet_directory() . $theme_scripts );

    wp_enqueue_style( 'child-understrap-styles', get_stylesheet_directory_uri() . $theme_styles, array(), $css_version );
    wp_enqueue_script( 'jquery' );
    wp_enqueue_script( 'child-understrap-scripts', get_stylesheet_directory_uri() . $theme_scripts, array(), $js_version, true );

    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles' );

// Add iframe-page body class to book-now page
function yugotour_book_now_body_class($classes) {
    if (is_page('book-now')) {
        $classes[] = 'iframe-page';
    }
    return $classes;
}
add_filter('body_class', 'yugotour_book_now_body_class');

/**
 * Register Custom Post Type: Tour
 * Register Custom Taxonomy: Tour City
 */
function yugotour_register_custom_post_types() {
    $tax_labels = array(
        'name'          => 'Cities',
        'singular_name' => 'City',
        'all_items'     => 'All Cities',
        'edit_item'     => 'Edit City',
        'update_item'   => 'Update City',
        'add_new_item'  => 'Add New City',
        'new_item_name' => 'New City Name',
        'menu_name'     => 'Cities',
    );

    register_taxonomy( 'tour_city', array( 'tour' ), array(
        'hierarchical'      => true,
        'labels'            => $tax_labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array( 'slug' => 'city' ),
        'show_in_rest'      => true,
    ));

    $post_labels = array(
        'name'          => 'Tours',
        'singular_name' => 'Tour',
        'menu_name'     => 'Tours',
        'add_new'       => 'Add New',
        'add_new_item'  => 'Add New Tour',
        'edit_item'     => 'Edit Tour',
        'all_items'     => 'All Tours',
    );

    register_post_type( 'tour', array(
        'labels'        => $post_labels,
        'public'        => true,
        'has_archive'   => true,
        'menu_icon'     => 'dashicons-location-alt',
        'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'revisions', 'page-attributes' ),
        'show_in_rest'  => true,
        'taxonomies'    => array( 'tour_city' ),
        'rewrite'       => array( 'slug' => 'tours' ),
        'menu_position' => 5,
    ));
}
add_action( 'init', 'yugotour_register_custom_post_types' );

// Helper: generate extra ACF fields
function yugo_generate_extra_fields($start, $end) {
    $fields = [];
    for ($i = $start; $i <= $end; $i++) {
        $fields[] = array('key' => "field_extra_{$i}_title", 'label' => "Extra {$i} Title",      'name' => "tour_extra_{$i}",            'type' => 'text',   'wrapper' => array('width' => '33'));
        $fields[] = array('key' => "field_extra_{$i}_price", 'label' => "Extra {$i} Price",      'name' => "tour_extra_{$i}_price",      'type' => 'text',   'wrapper' => array('width' => '33'));
        $fields[] = array('key' => "field_extra_{$i}_solo",  'label' => "Extra {$i} Solo Price", 'name' => "tour_extra_{$i}_price_solo", 'type' => 'text',   'wrapper' => array('width' => '33'));
    }
    return $fields;
}

// Helper: generate step ACF fields
function yugo_generate_step_fields($start, $end) {
    $fields = [];
    for ($i = $start; $i <= $end; $i++) {
        $fields[] = array('key' => "field_step_{$i}_title", 'label' => "Step {$i} Title",       'name' => "step_{$i}_title",       'type' => 'text');
        $fields[] = array('key' => "field_step_{$i}_desc",  'label' => "Step {$i} Description", 'name' => "step_{$i}_description", 'type' => 'wysiwyg', 'tabs' => 'visual', 'toolbar' => 'basic', 'media_upload' => 0);
        $fields[] = array('key' => "field_step_{$i}_photo", 'label' => "Step {$i} Photo",       'name' => "step_{$i}_photo",       'type' => 'image',   'return_format' => 'url', 'preview_size' => 'medium');
    }
    return $fields;
}

// ACF Field Group
if ( function_exists('acf_add_local_field_group') ) {
    acf_add_local_field_group(array(
        'key'    => 'group_tour_fields',
        'title'  => 'Tour Details',
        'fields' => array(

            // Header Images
            array('key' => 'field_tour_thumbnail',      'label' => 'Tour Thumbnail',                'name' => 'tour_thumbnail',      'type' => 'image',  'return_format' => 'url'),
            array('key' => 'field_tour_header_desktop', 'label' => 'Header Background (Desktop)',   'name' => 'tour_header_desktop', 'type' => 'image',  'return_format' => 'url'),
            array('key' => 'field_tour_header_mobile',  'label' => 'Header Background (Mobile)',    'name' => 'tour_header_mobile',  'type' => 'image',  'return_format' => 'url'),

            // Core Info
            array('key' => 'field_tour_id',       'label' => 'Tour ID Number',  'name' => 'tour_id',       'type' => 'text'),
            array('key' => 'field_tour_city',     'label' => 'City',            'name' => 'tour_city',     'type' => 'taxonomy', 'taxonomy' => 'tour_city', 'field_type' => 'select', 'save_terms' => true, 'load_terms' => true),
            array('key' => 'field_tour_intro_1',  'label' => 'Intro Text 1',    'name' => 'tour_intro_1',  'type' => 'textarea'),
            array('key' => 'field_tour_duration', 'label' => 'Duration',        'name' => 'tour_duration', 'type' => 'text'),

            // Pricing
            array('key' => 'field_tour_price_group', 'label' => 'Price per Person (Group)', 'name' => 'tour_price_group', 'type' => 'number', 'prepend' => '€'),
            array('key' => 'field_tour_price_solo',  'label' => 'Price per Person (Solo)',  'name' => 'tour_price_solo',  'type' => 'number', 'prepend' => '€'),

            // Includes
            array('key' => 'field_tour_includes', 'label' => 'Includes', 'name' => 'tour_includes', 'type' => 'wysiwyg', 'tabs' => 'visual', 'toolbar' => 'basic', 'media_upload' => 0),

            // Optional Extras
            array('key' => 'field_extra_1_title', 'label' => 'Extra 1 Title', 'name' => 'tour_extra_1',       'type' => 'text', 'wrapper' => array('width' => '50')),
            array('key' => 'field_extra_1_price', 'label' => 'Extra 1 Price', 'name' => 'tour_extra_1_price', 'type' => 'text', 'wrapper' => array('width' => '50')),
            ...yugo_generate_extra_fields(2, 6),

            // Intro Text 2
            array('key' => 'field_tour_intro_2', 'label' => 'Intro Text 2', 'name' => 'tour_intro_2', 'type' => 'wysiwyg', 'tabs' => 'visual', 'toolbar' => 'basic', 'media_upload' => 0),

            // Tour Steps
            ...yugo_generate_step_fields(1, 8),
        ),
        'location' => array(array(array('param' => 'post_type', 'operator' => '==', 'value' => 'tour'))),
        'menu_order'            => 0,
        'position'              => 'normal',
        'style'                 => 'default',
        'label_placement'       => 'top',
        'instruction_placement' => 'label',
    ));
}

// Dynamic extras filter for Formidable checkbox field
add_filter('frm_setup_new_vars', 'yugo_map_includes_from_acf', 99, 2);
function yugo_map_includes_from_acf($values, $field) {
    if ($field->field_key !== 'tour_includes_data') return $values;

    $tour_id_param = isset($_GET['tourID']) ? sanitize_text_field($_GET['tourID']) : '';
    if (empty($tour_id_param)) return $values;

    $posts = get_posts(array(
        'post_type'  => 'tour',
        'meta_query' => array(array('key' => 'tour_id', 'value' => $tour_id_param)),
        'numberposts' => 1
    ));

    if ($posts) {
        $post_id = $posts[0]->ID;
        $includes_text = get_field('tour_includes', $post_id);
        
       if (!empty($includes_text)) {
            // Strip any existing tags to avoid <p> inside <li>
            $clean_text = strip_tags($includes_text);
            $lines = explode("\n", str_replace("\r", "", $clean_text));
            
            $list_html = '<ul class="yugo-includes-list">';
            foreach ($lines as $line) {
                if (trim($line) !== '') {
                    // This is the fix: wrapping in <li> instead of <p>
                    $list_html .= '<li>' . esc_html(trim($line)) . '</li>';
                }
            }
            $list_html .= '</ul>';
            $values['value'] = $list_html;
        }
    }
    return $values;
}

// AJAX handler — fetch tour includes by tour ID
// Used by booking-iframe.php JS to populate the Includes field dynamically
add_action('wp_ajax_get_tour_includes',        'yugotour_get_tour_includes');
add_action('wp_ajax_nopriv_get_tour_includes', 'yugotour_get_tour_includes');
function yugotour_get_tour_includes() {
    $tour_id = isset($_GET['tourID']) ? sanitize_text_field($_GET['tourID']) : '';
    if (empty($tour_id)) {
        wp_send_json_error('No tour ID');
        return;
    }
    $posts = get_posts(array(
        'post_type'   => 'tour',
        'meta_query'  => array(array('key' => 'tour_id', 'value' => $tour_id)),
        'numberposts' => 1,
    ));
    if (!$posts) {
        wp_send_json_error('Tour not found');
        return;
    }
    $includes = get_field('tour_includes', $posts[0]->ID);
    wp_send_json_success($includes ? $includes : '');
}

function add_child_theme_textdomain() {
    load_child_theme_textdomain( 'understrap-child', get_stylesheet_directory() . '/languages' );
}
add_action( 'after_setup_theme', 'add_child_theme_textdomain' );

function understrap_default_bootstrap_version() {
    return 'bootstrap5';
}
add_filter( 'theme_mod_understrap_bootstrap_version', 'understrap_default_bootstrap_version', 20 );

function understrap_child_customize_controls_js() {
    wp_enqueue_script(
        'understrap_child_customizer',
        get_stylesheet_directory_uri() . '/js/customizer-controls.js',
        array( 'customize-preview' ),
        '20130508',
        true
    );
}
add_action( 'customize_controls_enqueue_scripts', 'understrap_child_customize_controls_js' );

add_filter( 'block_editor_settings_all', function( $editor_settings ) {
    $editor_settings['fontFamilies'] = [
        [ 'name' => 'Fakt Pro',           'slug' => 'fakt',     'fontFamily' => '"FaktPro", sans-serif' ],
        [ 'name' => 'Art Grotesk',        'slug' => 'grotesk',  'fontFamily' => '"FLArtGrotesk", sans-serif' ],
        [ 'name' => 'Cooper Black',       'slug' => 'cooper',   'fontFamily' => '"CooperBlackPro", serif' ],
        [ 'name' => 'Job Clarendon',      'slug' => 'clarendon','fontFamily' => '"JobClarendon", serif' ],
        [ 'name' => 'Zipper',             'slug' => 'zipper',   'fontFamily' => '"Zipper", sans-serif' ],
        [ 'name' => 'TungstenCompressed', 'slug' => 'tungsten', 'fontFamily' => '"TungstenCompressed", sans-serif' ],
    ];
    return $editor_settings;
});

function yugotour_customize_register( $wp_customize ) {
    $wp_customize->add_section( 'yugo_video_settings', array(
        'title'    => __( 'Television Video Settings', 'yugotour' ),
        'priority' => 30,
    ));
    $wp_customize->add_setting( 'yugo_tv_video_url', array(
        'default'   => 'https://www.youtube.com/watch?v=w3MiHAacio0',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'yugo_tv_video_control', array(
        'label'    => __( 'YouTube Video URL', 'yugotour' ),
        'section'  => 'yugo_video_settings',
        'settings' => 'yugo_tv_video_url',
        'type'     => 'text',
    )));
}
add_action( 'customize_register', 'yugotour_customize_register' );

function yugotour_customize_social( $wp_customize ) {
    $wp_customize->add_section( 'yugo_social_links', array(
        'title'    => __( 'Yugotour Social Links', 'yugotour' ),
        'priority' => 30,
    ));
    $platforms = array(
        'belgrade_ig' => 'Belgrade Instagram',
        'belgrade_fb' => 'Belgrade Facebook',
        'sarajevo_ig' => 'Sarajevo Instagram',
        'sarajevo_fb' => 'Sarajevo Facebook',
    );
    foreach ( $platforms as $id => $label ) {
        $wp_customize->add_setting( $id, array( 'default' => '', 'sanitize_callback' => 'esc_url_raw' ));
        $wp_customize->add_control( $id, array( 'label' => $label, 'section' => 'yugo_social_links', 'type' => 'url' ));
    }
}
add_action( 'customize_register', 'yugotour_customize_social' );

function yugotour_customize_footer( $wp_customize ) {
    $wp_customize->add_section( 'yugo_footer_settings', array(
        'title'    => __( 'Yugotour Footer Content', 'yugotour' ),
        'priority' => 30,
    ));
    $text_fields = array(
        'belgrade_address' => 'Belgrade Address & Contact',
        'sarajevo_address' => 'Sarajevo Address & Contact',
    );
    foreach ( $text_fields as $id => $label ) {
        $wp_customize->add_setting( $id, array( 'default' => '', 'sanitize_callback' => 'wp_kses_post' ));
        $wp_customize->add_control( $id, array( 'label' => $label, 'section' => 'yugo_footer_settings', 'type' => 'textarea' ));
    }
    $review_links = array(
        'belgrade_google' => 'Belgrade Google Review URL',
        'belgrade_trip'   => 'Belgrade TripAdvisor URL',
        'sarajevo_google' => 'Sarajevo Google Review URL',
        'sarajevo_trip'   => 'Sarajevo TripAdvisor URL',
    );
    foreach ( $review_links as $id => $label ) {
        $wp_customize->add_setting( $id, array( 'default' => '', 'sanitize_callback' => 'esc_url_raw' ));
        $wp_customize->add_control( $id, array( 'label' => $label, 'section' => 'yugo_footer_settings', 'type' => 'url' ));
    }
}
add_action( 'customize_register', 'yugotour_customize_footer' ); 