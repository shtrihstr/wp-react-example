<?php

/**
 * Serialize and save post content to object
 */
add_action( 'save_post', 'react_post_save_callback' );
function react_post_save_callback( $post_id ) {

    $post = get_post( $post_id );
    if( in_array( get_post_type( $post ) , [ 'post', 'page' ] ) ) {

        require_once __DIR__ . '/classes/react-html-serializer.php';

        // logout user
        $current_user = wp_get_current_user();
        $user_id = 0;
        if( $current_user instanceof WP_User ) {
            $user_id = $current_user->ID;
            wp_set_current_user( 0 );
        }

        $content = apply_filters( 'the_content', $post->post_content );

        // try get post summary
        $summary = false;
        if( in_array( get_post_type( $post ) , [ 'post' ] ) ) {
            $extended = get_extended( $post->post_content );
            if( ! empty( $extended['extended'] ) ) {
                $summary = apply_filters( 'the_content', $extended['main']  );
            }
            else {
                $summary = '';
            }
        }

        // restore user
        if( $user_id > 0 ) {
            wp_set_current_user( $user_id );
        }

        $serializer = new React_Html_Serializer();

        $tree = $serializer->serialize( $content );

        update_post_meta( $post_id, 'react-html-tree', $tree );

        if( $summary !== false ) {
            $summary_tree = null;
            if( '' === $summary ) {
                $summary_tree = array_slice( $tree, 0, 2 );
            }
            else {
                $serializer = new React_Html_Serializer();
                $summary_tree = $serializer->serialize( $summary );
            }
            update_post_meta( $post_id, 'react-html-summary-tree', $summary_tree );
        }
    }
}

/**
 * Parse <img /> params
 *
 * @param $img_html
 * @return array|null
 */
function react_get_image_params( $img_html ) {
    $matches = [];
    preg_match_all( '/(alt|title|src|srcset|class|id)=["\']([^"\']*)["\']/i', $img_html, $matches );
    $attributes = $matches[1];
    $values = $matches[2];
    $params = [];
    foreach ( $attributes as $index => $attribute ) {
        if ( 'class' == $attribute ) {
            $attribute = 'className';
        }
        elseif ( 'srcset' == $attribute ) {
            $attribute = 'srcSet';
        }

        $params[$attribute] = $values[$index];
    }
    return count( $params ) == 0 ? null : $params;
}
