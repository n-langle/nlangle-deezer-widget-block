<?php
/**
 * Plugin Name:       NLangle Deezer Widget Block
 * Description:       A WordPress block for embedding Deezer music content. This plugin is not affiliated with, authorized, maintained, sponsored, or endorsed by Deezer or any of its affiliates or subsidiaries.
 * Version:           0.1.1
 * Requires at least: 6.4
 * Requires PHP:      7.4
 * Author:            nlangle
 * Author URI:        https://github.com/n-langle
 * Repository:        https://github.com/n-langle/nlangle-deezer-widget-block
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       nlangle-deezer-widget-block
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Deezer Widget Block class
 */
class DeezerWidgetBlock {
	/**
	 * Instance
	 *
	 * @var self
	 */
	private static $instance = null;

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'register_deezer_widget_block' ] );
		add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
	}

	/**
	 * Register the block
	 */
	public function register_deezer_widget_block(): void {
		register_block_type( __DIR__ . '/build' );

		wp_add_inline_script(
			'nlangle-deezer-widget-editor-script',
			'const deezerWidgetBlockData = ' . wp_json_encode(
				[
					'restSearchUrl' => esc_url( rest_url( '/nlangle-deezer-widget-block/v1/search' ) ),
					'nonce'         => wp_create_nonce( 'wp_rest' ),
				]
			) . ';',
			'before'
		);
	}

	/**
	 * Initialize the REST API
	 */
	public function rest_api_init(): void {
		register_rest_route(
			'nlangle-deezer-widget-block/v1',
			'/search',
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'search' ],
				'permission_callback' => function ( $request ) {
					return current_user_can( 'edit_posts' );
				},
				'args'                => [
					'query'      => [
						'type'     => 'string',
						'required' => true,
					],
					'connection' => [
						'type'              => 'string',
						'required'          => false,
						'validate_callback' => function ( $value ) {
							$allowed_values = [
								'',
								'album',
								'artist',
								'playlist',
								'podcast',
								'track',
							];

							return in_array( $value, $allowed_values, true );
						},
					],
				],
			]
		);
	}

	/**
	 * Search
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public function search( WP_REST_Request $request ): \WP_REST_Response {
		$query      = sanitize_text_field( $request->get_param( 'query' ) );
		$connection = sanitize_text_field( $request->get_param( 'connection' ) );
		$args       = [
			'headers' => [
				'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
			]
		];
		$url        = esc_url_raw( 'https://api.deezer.com/search' . ( $connection ? '/' . $connection : '' ) . '?q=' . urlencode( $query ) );
		$response   = wp_remote_get( $url, $args );
		
		if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
			return rest_ensure_response( [
				'data'       => [],
				'error'      => esc_html( $response->get_error_message() ),
				'deezer_url' => esc_url( $url ),
			] );
		}
	
		$body = wp_remote_retrieve_body( $response );
	
		try {
			$data = json_decode( $body, true, 512, JSON_THROW_ON_ERROR );
		} catch ( \Exception $e ) {
			return rest_ensure_response( [
				'data'       => [],
				'error'      => esc_html( $e->getMessage() ),
				'deezer_url' => esc_url( $url ),
			] );
		}

		$data['error']      = '';
		$data['deezer_url'] = esc_url( $url );
	
		return rest_ensure_response( $data );
	}

	public static function get_instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
}

/**
 * Initialize the plugin
 */
DeezerWidgetBlock::get_instance();
