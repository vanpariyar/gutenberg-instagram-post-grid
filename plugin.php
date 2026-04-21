<?php
/**
 * Plugin Name: Social Gallery Block
 * Plugin URI: https://github.com/vanpariyar/gutenberg-instagram-post-grid/
 * Description: Social Gellery Block — is a Gutenberg plugin.
 * Author: Ronak Vanpariya
 * Author URI: https://github.com/vanpariyar
 * Version: 2.1
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 */
function gutenberg_instagram_post_grid_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'gutenberg_instagram_post_grid_block_init' );

/**
 * Register the REST API endpoint for Instagram data.
 */
function gutenberg_instagram_post_grid_register_rest_route() {
	register_rest_route( 'instagram-post-grid/v1', '/fetch', array(
		'methods'  => 'GET',
		'callback' => 'gutenberg_instagram_post_grid_fetch_data',
		'permission_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
		'args'     => array(
			'username' => array(
				'required' => true,
				'sanitize_callback' => 'sanitize_text_field',
			),
		),
	) );

	register_rest_route( 'instagram-post-grid/v1', '/proxy-image', array(
		'methods'  => 'GET',
		'callback' => 'gutenberg_instagram_post_grid_proxy_image',
		'permission_callback' => '__return_true',
		'args'     => array(
			'url' => array(
				'required' => true,
				'sanitize_callback' => 'esc_url_raw',
			),
		),
	) );
}
add_action( 'rest_api_init', 'gutenberg_instagram_post_grid_register_rest_route' );

/**
 * Proxy Instagram images to avoid CORS/CORP issues.
 */
function gutenberg_instagram_post_grid_proxy_image( $request ) {
	$url = $request->get_param( 'url' );
	
	// Basic security check: only proxy from known Instagram/FB domains
	$allowed_domains = array( 'fbcdn.net', 'instagram.com', 'cdninstagram.com' );
	$parsed_url = parse_url( $url );
	$host = isset( $parsed_url['host'] ) ? $parsed_url['host'] : '';
	
	$is_allowed = false;
	foreach ( $allowed_domains as $domain ) {
		if ( strpos( $host, $domain ) !== false ) {
			$is_allowed = true;
			break;
		}
	}

	if ( ! $is_allowed ) {
		return new WP_Error( 'disallowed_url', 'URL not allowed', array( 'status' => 403 ) );
	}

	$response = wp_remote_get( $url, array(
		'timeout'   => 60,
		'sslverify' => false, // Often needed in local environments/Playground
		'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
	) );

	if ( is_wp_error( $response ) ) {
		return new WP_Error( 'fetch_error', $response->get_error_message(), array( 'status' => 500 ) );
	}

	$status = wp_remote_retrieve_response_code( $response );
	if ( $status !== 200 ) {
		return new WP_Error( 'fetch_error', 'Image returned status ' . $status, array( 'status' => $status ) );
	}

	$content_type = wp_remote_retrieve_header( $response, 'content-type' );
	$body = wp_remote_retrieve_body( $response );

	if ( empty( $body ) ) {
		return new WP_Error( 'empty_body', 'Image body is empty', array( 'status' => 500 ) );
	}

	// Clean any previous output to avoid corrupted images
	while ( ob_get_level() ) {
		ob_end_clean();
	}

	if ( ! $content_type ) {
		$content_type = 'image/jpeg'; // Fallback
	}

	header( 'Content-Type: ' . $content_type );
	header( 'Content-Length: ' . strlen( $body ) );
	header( 'Cache-Control: public, max-age=86400' );
	header( 'Access-Control-Allow-Origin: *' );
	header( 'X-Content-Type-Options: nosniff' );
	
	echo $body;
	exit;
}

/**
 * Fetch Instagram data from the server side to avoid CORS issues.
 */
function gutenberg_instagram_post_grid_fetch_data( $request ) {
	$username = $request->get_param( 'username' );
	
	// Strategy: Use the web_profile_info endpoint which is currently more reliable than ?__a=1
	// but requires an App ID header.
	$url = sprintf( 'https://www.instagram.com/api/v1/users/web_profile_info/?username=%s', $username );
	
	$response = wp_remote_get( $url, array(
		'timeout' => 20,
		'sslverify' => false,
		'headers' => array(
			'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
			'x-ig-app-id' => '936619743392459', // This is a public App ID used by the web client
		),
	) );

	if ( is_wp_error( $response ) ) {
		return new WP_Error( 'fetch_error', $response->get_error_message(), array( 'status' => 500 ) );
	}

	$status_code = wp_remote_retrieve_response_code( $response );
	$body = wp_remote_retrieve_body( $response );

	// Strip the "for (;;);" prefix if Instagram adds it for JSON hijacking protection
	if ( strpos( $body, 'for (;;);' ) === 0 ) {
		$body = substr( $body, 9 );
	}

	$data = json_decode( $body );

	if ( ! $data || $status_code !== 200 ) {
		return new WP_Error( 'invalid_data', 'Invalid data or error from Instagram', array( 
			'status' => $status_code, 
			'body' => $body 
		) );
	}

	// The web_profile_info endpoint returns data in a slightly different format (data.user instead of graphql.user)
	// We'll normalize it to keep the JS simple, or just return as is if the JS can handle it.
	// But to match the previous structure:
	if ( isset( $data->data->user ) ) {
		return rest_ensure_response( array(
			'graphql' => array(
				'user' => $data->data->user
			)
		) );
	}

	return rest_ensure_response( $data );
}
