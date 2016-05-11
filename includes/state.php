<?php

define( 'BLOG_LOADING_STATUS_DONE', 'done' );

/**
 * Set default redux state
 *
 * @param array $state
 */
function react_set_initial_state( $state ) {
    if( ! isset( $GLOBALS['initial_state'] ) ) {
        $GLOBALS['initial_state'] = [];
    }
    $GLOBALS['initial_state'] = array_merge_recursive( $GLOBALS['initial_state'], $state );
}

/**
 * print redux init state object
 */
add_action( 'wp_footer', 'react_print_initial_state' );
function react_print_initial_state() {
    if ( isset( $GLOBALS['initial_state'] ) ) {
        $state = json_encode( $GLOBALS['initial_state'] );
        echo "<script>window.__INITIAL_STATE__ = $state;</script>";
    }
}

/**
 * setup default redux init state
 */
add_action( 'wp', 'react_set_default_state' );
function react_set_default_state() {

    $categories = array_values( array_map( function( $term ) {
        return [
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'link' => get_category_link( $term->term_id )
        ];
    }, get_terms( 'category', ['update_term_meta_cache' => false, 'parent'  => 0] ) ) );


    $state = [
        'blog' => [
            'categories' => [
                'loading' => [
                    'status' => BLOG_LOADING_STATUS_DONE,
                    'code' => null
                ],
                'terms' => $categories,
            ],
        ]
    ];

    react_set_initial_state( $state );
}