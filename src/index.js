import { registerBlockType } from '@wordpress/blocks';
import { __, sprintf } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import {
	TextControl,
	ToggleControl,
	RangeControl,
	PanelBody,
	PanelRow,
	Button,
	Notice,
} from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import './editor.scss';
import './style.scss';
import metadata from './block.json';

const fnum = ( x ) => {
	if ( isNaN( x ) ) {
		return x;
	}
	if ( x < 9999 ) {
		return x;
	}
	if ( x < 1000000 ) {
		return Math.round( x / 1000 ) + 'K';
	}
	if ( x < 10000000 ) {
		return ( x / 1000000 ).toFixed( 2 ) + 'M';
	}
	if ( x < 1000000000 ) {
		return Math.round( x / 1000000 ) + 'M';
	}
	if ( x < 1000000000000 ) {
		return Math.round( x / 1000000000 ) + 'B';
	}
	return '1T+';
};

const getProxyUrl = ( url ) => {
	if ( ! url ) {
		return '';
	}
	return addQueryArgs( '/wp-json/instagram-post-grid/v1/proxy-image', {
		url,
	} );
};

const InstaPanel = ( { props, getUserInfo, error } ) => {
	return (
		<PanelBody
			title={ __(
				'Instagram Settings',
				'gutenberg-instagram-post-grid'
			) }
			initialOpen={ true }
		>
			{ error && (
				<Notice status="error" isDismissible={ false }>
					{ error }
				</Notice>
			) }
			<PanelRow>
				<strong>
					{ __(
						'Note: This will only work for public Instagram accounts.',
						'gutenberg-instagram-post-grid'
					) }
				</strong>
			</PanelRow>
			<PanelRow>
				<ToggleControl
					checked={ props.attributes.showFollowers }
					label={ __(
						'Show follower count',
						'gutenberg-instagram-post-grid'
					) }
					onChange={ () =>
						props.setAttributes( {
							showFollowers: ! props.attributes.showFollowers,
						} )
					}
				/>
			</PanelRow>
			<PanelRow>
				<ToggleControl
					checked={ props.attributes.isCroped }
					label={ __(
						'Crop images?',
						'gutenberg-instagram-post-grid'
					) }
					onChange={ () =>
						props.setAttributes( {
							isCroped: ! props.attributes.isCroped,
						} )
					}
				/>
			</PanelRow>
			<PanelRow>
				<p>
					{ __(
						'Column Settings:',
						'gutenberg-instagram-post-grid'
					) }
				</p>
				<RangeControl
					value={ props.attributes.column }
					onChange={ ( column ) => props.setAttributes( { column } ) }
					min={ 1 }
					max={ 8 }
				/>
			</PanelRow>
			<PanelRow>
				<p>{ __( 'Post Count:', 'gutenberg-instagram-post-grid' ) }</p>
				<RangeControl
					value={ props.attributes.postCount }
					onChange={ ( postCount ) =>
						props.setAttributes( { postCount } )
					}
					min={ 1 }
					max={ 12 }
				/>
			</PanelRow>
			<PanelRow>
				<TextControl
					value={ props.attributes.userName }
					label={ __(
						'Enter Instagram username',
						'gutenberg-instagram-post-grid'
					) }
					onChange={ ( val ) =>
						props.setAttributes( { userName: val } )
					}
				/>
			</PanelRow>
			{ props.attributes.userName ? (
				<PanelRow>
					<Button isPrimary onClick={ () => getUserInfo() }>
						{ ' ' }
						{ __(
							'Fetch Details',
							'gutenberg-instagram-post-grid'
						) }{ ' ' }
					</Button>
				</PanelRow>
			) : (
				''
			) }
		</PanelBody>
	);
};

const MyPanel = ( { props, getUserInfo, error } ) => (
	<InspectorControls>
		<InstaPanel
			props={ props }
			getUserInfo={ getUserInfo }
			error={ error }
		/>
	</InspectorControls>
);

const InstagramEmbed = ( { props, getUserInfo, isServer = false, error } ) => {
	const { attributes } = props;
	const { userObject, column, isCroped, postCount, showFollowers, userName } =
		attributes;

	if ( ! userObject || ! userObject.userObjectLoaded ) {
		if ( isServer ) {
			return null;
		}
		return (
			<div className="instagram-placeholder">
				<h3>{ metadata.title }</h3>
				<InstaPanel
					props={ props }
					getUserInfo={ getUserInfo }
					error={ error }
				/>
			</div>
		);
	}

	const userData =
		userObject.userObject && userObject.userObject.graphql
			? userObject.userObject.graphql.user
			: null;

	if ( ! userData ) {
		return isServer ? null : (
			<div>
				{ sprintf(
					/* translators: %s: Instagram username */
					__(
						'No Instagram data found for user: %s',
						'gutenberg-instagram-post-grid'
					),
					userName
				) }
			</div>
		);
	}

	return (
		<Fragment>
			<FollowerCount
				count={
					userData ? fnum( userData.edge_followed_by.count ) : ''
				}
				showFollowers={ showFollowers }
			/>
			<figure
				className={ `wp-block-gallery columns-${ column } ${
					isCroped ? 'is-cropped' : ''
				}` }
			>
				<ul className="blocks-gallery-grid">
					{ userData.edge_owner_to_timeline_media.edges
						.slice( 0, postCount )
						.map( ( value, key ) => (
							<li key={ key } className="blocks-gallery-item">
								<figure>
									<a
										href={ `https://www.instagram.com/p/${ value.node.shortcode }/` }
										target="_blank"
										rel="noopener noreferrer"
									>
										<img
											src={ getProxyUrl(
												value.node.display_url
											) }
											alt=""
											tabIndex="0"
										/>
									</a>
								</figure>
							</li>
						) ) }
				</ul>
			</figure>
		</Fragment>
	);
};

const FollowerCount = ( { count, showFollowers } ) => (
	<Fragment>
		{ showFollowers && count ? (
			<div className="instagram-follower-count">
				{ sprintf(
					/* translators: %s: follower count */
					__( 'Followers: %s', 'gutenberg-instagram-post-grid' ),
					count
				) }
			</div>
		) : (
			''
		) }
	</Fragment>
);

registerBlockType( metadata.name, {
	edit: function Edit( props ) {
		const [ error, setError ] = useState( null );

		const getUserInfo = async () => {
			let userName = props.attributes.userName;
			userName = typeof userName !== 'undefined' ? userName : 'instagram';
			setError( null );

			try {
				const response = await apiFetch( {
					path: `instagram-post-grid/v1/fetch?username=${ userName }`,
					method: 'GET',
				} );

				const userObjectLoaded =
					response &&
					typeof response.captcha === 'undefined' &&
					response.graphql
						? 1
						: 0;

				if ( ! userObjectLoaded ) {
					setError(
						__(
							'Could not fetch Instagram data. The account might be private or rate-limited.',
							'gutenberg-instagram-post-grid'
						)
					);
				}

				props.setAttributes( {
					userObject: {
						userObject: response,
						userObjectLoaded,
					},
				} );
			} catch ( err ) {
				// eslint-disable-next-line no-console
				console.error( 'Error fetching Instagram data:', err );

				let errorMessage = __(
					'An error occurred while fetching Instagram data.',
					'gutenberg-instagram-post-grid'
				);

				if ( err.data && err.data.body ) {
					try {
						const body = JSON.parse( err.data.body );
						if ( body.message ) {
							errorMessage = body.message;
						}
					} catch ( e ) {
						// Fallback to default or err.message
					}
				} else if ( err.message ) {
					errorMessage = err.message;
				}

				setError( errorMessage );
				props.setAttributes( {
					userObject: { userObject: {}, userObjectLoaded: 0 },
				} );
			}
		};

		return (
			<div { ...useBlockProps() }>
				<MyPanel
					props={ props }
					getUserInfo={ getUserInfo }
					error={ error }
				/>
				<InstagramEmbed
					props={ props }
					getUserInfo={ getUserInfo }
					error={ error }
				/>
			</div>
		);
	},

	save: ( props ) => {
		return (
			<div { ...useBlockProps.save() }>
				<InstagramEmbed props={ props } isServer={ true } />
			</div>
		);
	},
} );
