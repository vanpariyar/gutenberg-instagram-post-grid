<?php
/**
 * Plugin Name: Social Gallery Block
 * Plugin URI: https://github.com/vanpariyar/gutenberg-instagram-post-grid/
 * Description: Social Gallery Block — is a Gutenberg plugin.
 * Author: Ronak Vanpariya
 * Author URI: https://github.com/vanpariyar
 * Version: 2.2.0
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
	wp_register_style( 
		'gutenberg-instagram-post-grid-style', 
		plugins_url( 'build/instagram/style-index.css', __FILE__ ), 
		array(), 
		'2.2.0' 
	);

	register_block_type( __DIR__ . '/build/instagram', array(
		'render_callback' => 'gutenberg_instagram_post_grid_render_block',
	) );
	register_block_type( __DIR__ . '/build/twitter', array(
		'render_callback' => 'gutenberg_instagram_post_grid_render_twitter_block',
	) );
	register_block_type( __DIR__ . '/build/rss', array(
		'render_callback' => 'gutenberg_instagram_post_grid_render_rss_block',
	) );
}
add_action( 'init', 'gutenberg_instagram_post_grid_block_init' );

/**
 * Check if a URL belongs to a social media domain that needs proxying.
 */
function gutenberg_instagram_post_grid_is_social_domain( $url ) {
	$social_domains = array( 'fbcdn.net', 'instagram.com', 'cdninstagram.com', 'twimg.com', 'twitter.com', 'fb.cdn' );
	$parsed_url = parse_url( $url );
	$host = isset( $parsed_url['host'] ) ? $parsed_url['host'] : '';

	foreach ( $social_domains as $domain ) {
		if ( strpos( $host, $domain ) !== false ) {
			return true;
		}
	}
	return false;
}

/**
 * Format large numbers for social display.
 */
function gutenberg_instagram_post_grid_format_number( $x ) {
	if ( ! is_numeric( $x ) ) {
		return $x;
	}
	if ( $x < 9999 ) {
		return $x;
	}
	if ( $x < 1000000 ) {
		return round( $x / 1000 ) . 'K';
	}
	if ( $x < 10000000 ) {
		return number_format( $x / 1000000, 2 ) . 'M';
	}
	if ( $x < 1000000000 ) {
		return round( $x / 1000000 ) . 'M';
	}
	if ( $x < 1000000000000 ) {
		return round( $x / 1000000000 ) . 'B';
	}
	return '1T+';
}

/**
 * Render callback for the RSS block.
 */
function gutenberg_instagram_post_grid_render_rss_block( $attributes ) {
	$url = isset( $attributes['url'] ) ? $attributes['url'] : '';
	$count = isset( $attributes['count'] ) ? (int) $attributes['count'] : 6;
	$columns = isset( $attributes['columns'] ) ? (int) $attributes['columns'] : 3;

	if ( empty( $url ) ) {
		return is_admin() ? '<p>' . __( 'Please provide an RSS feed URL.', 'gutenberg-instagram-post-grid' ) . '</p>' : '';
	}

	$feed = fetch_feed( $url );

	if ( is_wp_error( $feed ) ) {
		return '<p>' . sprintf( __( 'Error: %s', 'gutenberg-instagram-post-grid' ), esc_html( $feed->get_error_message() ) ) . '</p>';
	}

	$items = $feed->get_items( 0, $count );

	if ( empty( $items ) ) {
		return '<p>' . __( 'No items found in feed.', 'gutenberg-instagram-post-grid' ) . '</p>';
	}

	wp_enqueue_style( 'gutenberg-instagram-post-grid-style' );

	ob_start();
	?>
	<div class="wp-block-vanpariyar-rss-post-grid">
		<figure class="wp-block-gallery columns-<?php echo esc_attr( $columns ); ?> is-cropped">
			<ul class="blocks-gallery-grid">
				<?php foreach ( $items as $item ) : 
					$media_url = '';

					// Try to get image from enclosure
					$enclosure = $item->get_enclosure();
					if ( $enclosure && $enclosure->get_link() ) {
						$media_url = $enclosure->get_link();
					}

					// Try to get image from content or description (simple regex)
					if ( ! $media_url ) {
						$content = $item->get_content();
						if ( ! $content ) {
							$content = $item->get_description();
						}

						if ( preg_match( '/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $content, $matches ) ) {
							$media_url = $matches[1];
						}
					}
					
					// Only use proxy for known social domains or if it's not the same site
					$image_url = '';
					if ( $media_url ) {
						if ( gutenberg_instagram_post_grid_is_social_domain( $media_url ) ) {
							$image_url = add_query_arg( array( 'url' => rawurlencode($media_url) ), rest_url( 'instagram-post-grid/v1/proxy-image' ) );
						} else {
							$image_url = $media_url;
						}
					}
					?>
					<li class="blocks-gallery-item">
						<figure>
							<a href="<?php echo esc_url( $item->get_permalink() ); ?>" 
							   target="_blank" 
							   rel="noopener noreferrer" 
							   class="<?php echo ! $image_url ? 'rss-item-link-no-image' : ''; ?>">
								<?php if ( $image_url ) : ?>
									<img src="<?php echo esc_url( $image_url ); ?>" alt="" title="<?php echo esc_attr( $item->get_title() ); ?>" />
								<?php else : ?>
									<div class="rss-item-title">
										<?php echo esc_html( $item->get_title() ); ?>
									</div>
								<?php endif; ?>
							</a>
						</figure>
					</li>
				<?php endforeach; ?>
			</ul>
		</figure>
	</div>
	<?php
	return ob_get_clean();
}

/**
 * Render callback for the Twitter block.
 */
function gutenberg_instagram_post_grid_render_twitter_block( $attributes ) {
	$username = isset( $attributes['username'] ) ? $attributes['username'] : '';
	$count = isset( $attributes['count'] ) ? (int) $attributes['count'] : 6;
	$columns = isset( $attributes['columns'] ) ? (int) $attributes['columns'] : 3;

	if ( empty( $username ) ) {
		return is_admin() ? '<p>' . __( 'Please provide a Twitter username.', 'gutenberg-instagram-post-grid' ) . '</p>' : '';
	}

	$tweets = gutenberg_instagram_post_grid_fetch_twitter( $username );

	if ( is_wp_error( $tweets ) ) {
		return '<p>' . sprintf( __( 'Error: %s', 'gutenberg-instagram-post-grid' ), esc_html( $tweets->get_error_message() ) ) . '</p>';
	}

	$tweets = array_slice( $tweets, 0, $count );

	if ( empty( $tweets ) ) {
		return '<p>' . __( 'No tweets found.', 'gutenberg-instagram-post-grid' ) . '</p>';
	}

	wp_enqueue_style( 'gutenberg-instagram-post-grid-style' );

	ob_start();
	?>
	<div class="wp-block-vanpariyar-twitter-post-grid">
		<figure class="wp-block-gallery columns-<?php echo esc_attr( $columns ); ?> is-cropped">
			<ul class="blocks-gallery-grid">
				<?php foreach ( $tweets as $tweet ) : 
					$media_url = isset( $tweet['media_url'] ) ? $tweet['media_url'] : '';
					if ( ! $media_url ) continue;
					$proxy_url = add_query_arg( array( 'url' => rawurlencode($media_url) ), rest_url( 'instagram-post-grid/v1/proxy-image' ) );
					?>
					<li class="blocks-gallery-item">
						<figure>
							<a href="<?php echo esc_url( $tweet['url'] ); ?>" target="_blank" rel="noopener noreferrer">
								<img src="<?php echo esc_url( $proxy_url ); ?>" alt="" title="<?php echo esc_attr( $tweet['text'] ); ?>" />
							</a>
						</figure>
					</li>
				<?php endforeach; ?>
			</ul>
		</figure>
	</div>
	<?php
	return ob_get_clean();
}

/**
 * Fetch Twitter data using the syndication API workaround.
 */
function gutenberg_instagram_post_grid_fetch_twitter( $username ) {
	$transient_key = 'twitter_grid_' . md5( $username );
	$cached_data = get_transient( $transient_key );
	if ( $cached_data !== false ) {
		return $cached_data;
	}

	$url = "https://syndication.twitter.com/srv/timeline-profile/screen-name/$username";

	$response = wp_remote_get( $url, array(
		'timeout' => 20,
		'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
	) );

	if ( is_wp_error( $response ) ) {
		return $response;
	}

	$html = wp_remote_retrieve_body( $response );
	if ( empty( $html ) ) {
		return new WP_Error( 'empty_response', 'Empty response from Twitter' );
	}

	// Extract JSON from __NEXT_DATA__ script tag
	if ( preg_match( '/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/', $html, $matches ) ) {
		$json_data = json_decode( $matches[1], true );
		$tweets_raw = isset( $json_data['props']['pageProps']['timeline']['entries'] ) ? $json_data['props']['pageProps']['timeline']['entries'] : array();

		$tweets = array();
		foreach ( $tweets_raw as $entry ) {
			if ( ! isset( $entry['content']['tweet'] ) ) continue;

			$tweet_data = $entry['content']['tweet'];
			$media = isset( $tweet_data['entities']['media'][0] ) ? $tweet_data['entities']['media'][0] : null;

			if ( $media ) {
				$tweets[] = array(
					'id' => $tweet_data['id_str'],
					'text' => $tweet_data['full_text'],
					'url' => "https://twitter.com/$username/status/" . $tweet_data['id_str'],
					'media_url' => $media['media_url_https'],
				);
			}
		}

		set_transient( $transient_key, $tweets, HOUR_IN_SECONDS );
		return $tweets;
	}

	return new WP_Error( 'parse_error', 'Could not parse Twitter timeline' );
}

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
			),
		),
	) );
}
add_action( 'rest_api_init', 'gutenberg_instagram_post_grid_register_rest_route' );

/**
 * Proxy Instagram images to avoid CORS/CORP issues.
 */
function gutenberg_instagram_post_grid_proxy_image( $request ) {
	$url = '';
	if ( $request instanceof WP_REST_Request ) {
		$url = $request->get_param( 'url' );

		// Robust URL reconstruction for signed CDN URLs with complex query parameters
		if ( isset($_SERVER['REQUEST_URI']) ) {
			$full_uri = $_SERVER['REQUEST_URI'];
			$query_pos = strpos($full_uri, 'url=');
			if ($query_pos !== false) {
				$url = substr($full_uri, $query_pos + 4);
				$url = rawurldecode($url);
			}
		}
	} else {
		$url = $request;
	}

	if ( empty( $url ) ) {
		return new WP_Error( 'empty_url', 'URL is empty', array( 'status' => 400 ) );
	}

	// Basic security check: only proxy from known Social Media domains
	$allowed_domains = array( 'fbcdn.net', 'instagram.com', 'cdninstagram.com', 'twimg.com', 'twitter.com', 'fb.cdn' );

	// Add current site domain to allowed domains
	$site_url = get_site_url();
	$site_domain = parse_url( $site_url, PHP_URL_HOST );
	if ( $site_domain ) {
		$allowed_domains[] = $site_domain;
	}

	$allowed_domains = apply_filters( 'gutenberg_instagram_post_grid_allowed_proxy_domains', $allowed_domains );

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
		return new WP_Error( 'disallowed_url', 'URL not allowed: ' . esc_html($host), array( 'status' => 403 ) );
	}

	$response = wp_remote_get( $url, array(
		'timeout'    => 60,
		'sslverify'  => false,
		'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
		'headers'    => array(
			'Referer' => 'https://www.instagram.com/',
		),
	) );

	if ( is_wp_error( $response ) ) {
		return new WP_Error( 'fetch_error', $response->get_error_message(), array( 'status' => 500 ) );
	}

	$status = wp_remote_retrieve_response_code( $response );
	if ( $status !== 200 ) {
		return new WP_Error( 'fetch_error', 'Proxy failed. Remote server returned status ' . $status, array( 'status' => $status ) );
	}

	$content_type = wp_remote_retrieve_header( $response, 'content-type' );
	$body = wp_remote_retrieve_body( $response );

	if ( empty( $body ) ) {
		return new WP_Error( 'empty_body', 'Image body is empty', array( 'status' => 500 ) );
	}

	// Clean any previous output to avoid corrupted images
	if ( ( $request instanceof WP_REST_Request ) ) {
		while ( ob_get_level() ) {
			ob_end_clean();
		}

		if ( ! $content_type ) {
			$content_type = 'image/jpeg';
		}

		header( 'Content-Type: ' . $content_type );
		header( 'Content-Length: ' . strlen( $body ) );
		header( 'Cache-Control: public, max-age=86400' );
		header( 'Access-Control-Allow-Origin: *' );
		header( 'X-Content-Type-Options: nosniff' );

		echo $body;
		exit;
	}

	return $body;
}

/**
 * Fetch Instagram data.
 */
function gutenberg_instagram_post_grid_fetch_data( $request ) {
	$username = ( $request instanceof WP_REST_Request ) ? $request->get_param( 'username' ) : $request;
	$transient_key = 'insta_grid_v2_' . md5( $username );

	$cached_data = get_transient( $transient_key );
	if ( $cached_data !== false ) {
		return ( $request instanceof WP_REST_Request ) ? rest_ensure_response( $cached_data ) : $cached_data;
	}

	$url = sprintf( 'https://www.instagram.com/api/v1/users/web_profile_info/?username=%s', $username );

	$response = wp_remote_get( $url, array(
		'timeout' => 20,
		'sslverify' => false,
		'headers' => array(
			'user-agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
			'x-ig-app-id' => '936619743392459',
			'x-asbd-id' => '129477',
			'x-ig-www-claim' => '0',
			'x-requested-with' => 'XMLHttpRequest',
			'accept' => '*/*',
			'accept-language' => 'en-US,en;q=0.9',
			'referer' => 'https://www.instagram.com/' . $username . '/',
			'sec-ch-ua' => '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
			'sec-ch-ua-mobile' => '?0',
			'sec-ch-ua-platform' => '"macOS"',
			'sec-fetch-dest' => 'empty',
			'sec-fetch-mode' => 'cors',
			'sec-fetch-site' => 'same-origin',
		),
	) );

	if ( is_wp_error( $response ) ) {
		return new WP_Error( 'fetch_error', $response->get_error_message(), array( 'status' => 500 ) );
	}

	$status_code = wp_remote_retrieve_response_code( $response );
	$body = wp_remote_retrieve_body( $response );

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

	if ( ! isset( $data->data->user ) && ! isset( $data->graphql->user ) ) {
		return new WP_Error( 'no_user_data', 'Instagram returned success but no user data was found. This may indicate the account is private or the API is limited.', array( 
			'status' => $status_code, 
			'body' => $body 
		) );
	}

	$final_data = $data;
	if ( isset( $data->data->user ) ) {
		$final_data = (object) array(
			'graphql' => (object) array(
				'user' => $data->data->user
			)
		);
	}

	set_transient( $transient_key, $final_data, HOUR_IN_SECONDS );

	return ( $request instanceof WP_REST_Request ) ? rest_ensure_response( $final_data ) : $final_data;
}

/**
 * Render callback for the Instagram block.
 */
function gutenberg_instagram_post_grid_render_block( $attributes ) {
	$atts = array(
		'username'      => isset( $attributes['userName'] ) ? $attributes['userName'] : '',
		'columns'       => isset( $attributes['column'] ) ? $attributes['column'] : 4,
		'count'         => isset( $attributes['postCount'] ) ? $attributes['postCount'] : 12,
		'cropped'       => ( isset( $attributes['isCroped'] ) && ! $attributes['isCroped'] ) ? 'no' : 'yes',
		'showFollowers' => isset( $attributes['showFollowers'] ) ? (bool) $attributes['showFollowers'] : false,
	);

	return gutenberg_instagram_post_grid_render_gallery( $atts );
}

/**
 * Shared rendering function for both block and shortcode.
 */
function gutenberg_instagram_post_grid_render_gallery( $atts ) {
	if ( empty( $atts['username'] ) ) {
		return is_admin() ? '<p>' . __( 'Please provide an Instagram username.', 'gutenberg-instagram-post-grid' ) . '</p>' : '';
	}

	$data = gutenberg_instagram_post_grid_fetch_data( $atts['username'] );

	if ( is_wp_error( $data ) ) {
		$error_message = $data->get_error_message();
		return '<p>' . sprintf( __( 'Error: %s', 'gutenberg-instagram-post-grid' ), esc_html( $error_message ) ) . '</p>';
	}

	$user = isset( $data->graphql->user ) ? $data->graphql->user : null;

	if ( ! $user ) {
		return '<p>' . __( 'No Instagram data found.', 'gutenberg-instagram-post-grid' ) . '</p>';
	}

	$media = isset( $user->edge_owner_to_timeline_media->edges ) ? $user->edge_owner_to_timeline_media->edges : array();
	$media = array_slice( $media, 0, (int) $atts['count'] );

	if ( empty( $media ) ) {
		return '<p>' . __( 'No posts found for this user.', 'gutenberg-instagram-post-grid' ) . '</p>';
	}

	// Enqueue styles
	wp_enqueue_style( 'gutenberg-instagram-post-grid-style' );

	$columns = (int) $atts['columns'];
	$is_cropped = $atts['cropped'] === 'yes';
	$show_followers = isset( $atts['showFollowers'] ) ? $atts['showFollowers'] : false;

	ob_start();
	?>
	<div class="wp-block-vanpariyar-instagram-post-grid">
		<?php if ( $show_followers && isset( $user->edge_followed_by->count ) ) : ?>
			<div class="instagram-follower-count">
				<?php echo sprintf( 
					/* translators: %s: follower count */
					__( 'Followers: %s', 'gutenberg-instagram-post-grid' ), 
					esc_html( gutenberg_instagram_post_grid_format_number( $user->edge_followed_by->count ) ) 
				); ?>
			</div>
		<?php endif; ?>

		<figure class="wp-block-gallery columns-<?php echo esc_attr( $columns ); ?> <?php echo $is_cropped ? 'is-cropped' : ''; ?>">
			<ul class="blocks-gallery-grid">
				<?php foreach ( $media as $post ) : 
					$node = $post->node;
					$proxy_url = add_query_arg( array( 'url' => rawurlencode($node->display_url) ), rest_url( 'instagram-post-grid/v1/proxy-image' ) );
					?>
					<li class="blocks-gallery-item">
						<figure>
							<a href="https://www.instagram.com/p/<?php echo esc_attr( $node->shortcode ); ?>/" target="_blank" rel="noopener noreferrer">
								<img src="<?php echo esc_url( $proxy_url ); ?>" alt="" />
							</a>
						</figure>
					</li>
				<?php endforeach; ?>
			</ul>
		</figure>
	</div>
	<?php
	return ob_get_clean();
}

/**
 * Shortcode to display Instagram post grid.
 */
function gutenberg_instagram_post_grid_shortcode( $atts ) {
	$atts = shortcode_atts( array(
		'username'      => '',
		'columns'       => 4,
		'count'         => 12,
		'cropped'       => 'yes',
		'showFollowers' => false,
	), $atts, 'instagram_post_grid' );

	$atts['showFollowers'] = (bool) $atts['showFollowers'];

	return gutenberg_instagram_post_grid_render_gallery( $atts );
}
add_shortcode( 'instagram_post_grid', 'gutenberg_instagram_post_grid_shortcode' );
