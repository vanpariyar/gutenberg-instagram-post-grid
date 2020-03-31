<?php
/**
 * Plugin Name: Gutenberg Instagram post Grid
 * Plugin URI: https://github.com/vanpariyar/gutenberg-instagram-post-grid/
 * Description: gutenberg-instagram-post-grid — is a Gutenberg plugin.
 * Author: Ronak Vanpariya
 * Author URI: https://github.com/vanpariyar
 * Version: 1.0.0
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
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
