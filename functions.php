<?php

/**
 * autoload vendors
 */
require_once __DIR__ . '/vendor/autoload.php';

/**
 * REST API endpoints
 */
require_once __DIR__ . '/includes/api.php';

/**
 * react prepare date functions
 */
require_once __DIR__ . '/includes/react.php';

/**
 * setup default redux state
 */
require_once __DIR__ . '/includes/state.php';


/**
 * theme setups
 */
add_theme_support( 'post-thumbnails' );
add_theme_support( 'title-tag' );

add_image_size( 'react-thumbnail', 1600, 900, true );
add_image_size( 'react-thumbnail-mob', 800, 450, true );


/**
 * enqueue theme scripts
 */
add_action( 'wp_enqueue_scripts', 'react_enqueue_scripts' );
function react_enqueue_scripts() {
    wp_deregister_script( 'wp-embed' );
    wp_enqueue_script( 'app', get_template_directory_uri() . '/app/built/app.js', [], '0.0.1', true );
}

/**
 * enqueue theme styles
 */
add_action( 'wp_print_styles', 'react_print_styles' );
function react_print_styles() {
    wp_enqueue_style( 'pure' , 'http://yui.yahooapis.com/pure/0.6.0/pure-min.css' );
    wp_enqueue_style( 'responsive' , 'http://yui.yahooapis.com/pure/0.6.0/grids-responsive-min.css' );
    wp_enqueue_style( 'style', get_template_directory_uri() . '/style.css' );
}

/**
 * unset standard wp search
 */
if ( ! is_admin() && isset( $_GET['s'] ) ) {
    unset( $_GET['s'] );
}