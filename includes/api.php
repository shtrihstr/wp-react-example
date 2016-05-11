<?php

/**
 * Create API router with namespace 'api/v1'
 * @see https://github.com/shtrihstr/simple-rest-api
 */
$api = new Simple_REST_API\Router( 'api/v1' );

/**
 * GET /wp-json/api/v1/posts-by/category/category-name?page=1
 *
 */
$api->get( '/posts-by/category/{category}', function ( WP_REST_Request $request, WP_REST_Response $response, $category ) {

    if ( empty ( $category ) ) {
        $response->set_status( 404 );
        return $response;
    }

    if( 0 == ( $page = absint( $request->get_param( 'page' ) ) ) ) {
        $page = 1;
    }

    $args = [
        'category_name' => $category->slug,
        'paged' => $page,
        'update_post_meta_cache' => false,
        'update_post_term_cache' => false,
    ];

    $query = new WP_Query( $args );

    $response->set_data( [
        'slugs' => wp_list_pluck( $query->posts, 'post_name' ),
        'found' => absint( $query->found_posts ),
        'pages' => absint( $query->max_num_pages ),
        'page' => $page,
    ] );

    return $response;

} )->convert( 'category', function ( $category ) {
    return get_category_by_slug( trim( $category ) );
} );


/**
 * GET /wp-json/api/v1/posts-by/tag/tag-name
 *
 */
$api->get( '/posts-by/tag/{tag}', function ( WP_REST_Request $request, WP_REST_Response $response, $tag ) {

    if ( empty ( $tag ) ) {
        $response->set_status( 404 );
        return $response;
    }

    if( 0 == ( $page = absint( $request->get_param( 'page' ) ) ) ) {
        $page = 1;
    }

    $args = [
        'tag' => $tag->slug,
        'paged' => $page,
        'update_post_meta_cache' => false,
        'update_post_term_cache' => false,
    ];

    $query = new WP_Query( $args );

    $response->set_data( [
        'slugs' => wp_list_pluck( $query->posts, 'post_name' ),
        'found' => absint( $query->found_posts ),
        'pages' => absint( $query->max_num_pages ),
        'page' => $page,
    ] );

    return $response;

} )->convert( 'tag', function ( $tag ) {
    return get_term_by( 'slug', trim( $tag ), 'post_tag' );
} );


/**
 * GET /wp-json/api/v1/posts-by/author/author-name
 */
$api->get( '/posts-by/author/{author}', function ( WP_REST_Request $request, WP_REST_Response $response, $author ) {

    if ( empty ( $author ) ) {
        $response->set_status( 404 );
        return $response;
    }

    if( 0 == ( $page = absint( $request->get_param( 'page' ) ) ) ) {
        $page = 1;
    }

    $args = [
        'author_name' => $author->user_nicename,
        'paged' => $page,
        'update_post_meta_cache' => false,
        'update_post_term_cache' => false,
    ];

    $query = new WP_Query( $args );

    $response->set_data( [
        'slugs' => wp_list_pluck( $query->posts, 'post_name' ),
        'found' => absint( $query->found_posts ),
        'pages' => absint( $query->max_num_pages ),
        'page' => $page,
    ] );

    return $response;

} )->convert( 'author', function ( $author ) {
    return get_user_by( 'slug', trim( $author ) );
} );


/**
 * GET /wp-json/api/v1/posts-by/date/desc
 */
$api->get( '/posts-by/date/{order}', function ( WP_REST_Request $request, WP_REST_Response $response, $order ) {

    if( 0 == ( $page = absint( $request->get_param( 'page' ) ) ) ) {
        $page = 1;
    }

    $args = [
        'orderby' => 'date',
        'order' => $order,
        'paged' => $page,
        'update_post_meta_cache' => false,
        'update_post_term_cache' => false,
    ];

    $query = new WP_Query( $args );

    $response->set_data( [
        'slugs' => wp_list_pluck( $query->posts, 'post_name' ),
        'found' => absint( $query->found_posts ),
        'pages' => absint( $query->max_num_pages ),
        'page' => $page,
    ] );

    return $response;

} )->convert( 'order', function ( $order ) {
    $order = mb_strtoupper( $order );
    return in_array( $order, ['ASC', 'DESC'] ) ? $order : 'DESC';
} );


/**
 * GET /wp-json/api/v1/posts-by/search?query=abc
 *
 */
$api->get( '/posts-by/search', function ( WP_REST_Request $request, WP_REST_Response $response ) {
    $s = $request->get_param( 'query' );

    if( 0 == ( $page = absint( $request->get_param( 'page' ) ) ) ) {
        $page = 1;
    }

    $args = [
        's' => $s,
        'paged' => $page,
        'update_post_meta_cache' => false,
        'update_post_term_cache' => false,
    ];

    $query = new WP_Query( $args );

    $response->set_data( [
        'slugs' => wp_list_pluck( $query->posts, 'post_name' ),
        'found' => absint( $query->found_posts ),
        'pages' => absint( $query->max_num_pages ),
        'page' => $page,
    ] );

    return $response;
} );


/**
 * GET /wp-json/api/v1/post/slug-or-id?context=view|feed
 *
 */
$api->get( '/post/{post}', function ( WP_REST_Request $request, WP_REST_Response $response, $post ) {

    if ( empty ( $post ) ) {
        $response->set_status( 404 );
        return $response;
    }

    $context = trim( $request->get_param( 'context' ) );
    if ( ! in_array( $context, ['view', 'feed'] ) ) {
        $context = 'view';
    }

    $categories = wp_list_pluck( (array) get_the_terms( $post, 'category' ), 'term_id' );
    $tags = wp_list_pluck( (array) get_the_terms( $post, 'post_tag' ), 'term_id' );

    $post_data = [
        'id' => absint( $post->ID ),
        'slug' => $post->post_name,
        'title' => get_the_title( $post ),
        'thumbnail' => react_get_image_params( get_the_post_thumbnail( $post, 'react-thumbnail' ) ),
        'summary' => get_post_meta( $post->ID, 'react-html-summary-tree', true ),
        'date' => get_post_time( 'U', true, $post ),
        'link' => get_permalink( $post ),
        'categories' => array_filter( $categories ),
        'tags' => array_filter( $tags ),
        'author' => absint( $post->post_author ),
    ];

    if ( 'view' == $context ) {
        $post_data['content'] = get_post_meta( $post->ID, 'react-html-tree', true );
    }

    $response->set_data( [ 'post' => $post_data ] );
    return $response;

} )->convert( 'post', function ( $post ) {
    $post_data = null;
    if ( preg_match( '/\d+/i', $post ) ) {
        $post_data = get_post( absint( $post ), OBJECT );
    }
    if( empty( $post_data ) ) {
        $post_data = get_page_by_path( $post, OBJECT, 'post' );
    }
    return $post_data;
} );


/**
 * GET /wp-json/api/v1/authors
 *
 */
$api->get( '/authors', function () {

    $users = get_users( [
        'who' => 'authors',
        'has_published_posts' => true
    ] );

    if( is_multisite() ) {
        foreach( get_super_admins() as $super_admin ) {
            $user = get_user_by( 'login', $super_admin );
            if( count_user_posts( $user->ID, 'post' ) > 0 ) {
                $users[] = $user;
            }
        }
    }

    $authors = array_values( array_map( function( $user ) {
        return [
            'id' => $user->ID,
            'slug' => esc_attr( $user->user_nicename ),
            'name' => esc_html( $user->display_name ),
            'avatar' => react_get_image_params( get_avatar( $user->user_email, 48 ) ),
            'link' => get_author_posts_url( $user->ID ),
        ];
    }, $users ) );

    return ['authors' => $authors];

} );


/**
 * GET /wp-json/api/v1/categories
 *
 */
$api->get( '/categories', function () {

    $categories = array_values( array_map( function( $term ) {
        return [
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'link' => get_category_link( $term->term_id )
        ];
    }, get_terms( 'category', ['update_term_meta_cache' => false, 'parent'  => 0] ) ) );

    return ['categories' => $categories];
} );


/**
 * GET /wp-json/api/v1/tags
 *
 */
$api->get( '/tags', function () {

    $tags = array_values( array_map( function( $term ) {
        return [
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'link' => get_category_link( $term->term_id )
        ];
    }, get_terms( 'post_tag', ['update_term_meta_cache' => false] ) ) );

    return ['tags' => $tags];
} );
