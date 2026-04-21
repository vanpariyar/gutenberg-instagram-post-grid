import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { 
	TextControl,
	ToggleControl,
	RangeControl,
	PanelBody,
	PanelRow,
	Button,
} from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import './editor.scss';
import './style.scss';
import metadata from './block.json';

const fnum = (x) => {
	if(isNaN(x)) return x;
	if(x < 9999) {
		return x;
	}
	if(x < 1000000) {
		return Math.round(x/1000) + "K";
	}
	if( x < 10000000) {
		return (x/1000000).toFixed(2) + "M";
	}
	if(x < 1000000000) {
		return Math.round((x/1000000)) + "M";
	}
	if(x < 1000000000000) {
		return Math.round((x/1000000000)) + "B";
	}
	return "1T+";
}

const getProxyUrl = ( url ) => {
	if ( ! url ) return '';
	return addQueryArgs( '/wp-json/instagram-post-grid/v1/proxy-image', { url } );
};

const InstaPanel = ({props , getUserInfo }) => {
	return (
		<PanelBody title={ __( 'Instagram Settings', 'gutenberg-instagram-post-grid' ) } initialOpen={ true }>
			<PanelRow>
				<strong>Note: This Will only works For instagram Public Acoount.</strong>
			</PanelRow>
			<PanelRow>
				<ToggleControl checked={ props.attributes.showFollowers } label="show Your Followers" onChange={ () => props.setAttributes({ 'showFollowers': !props.attributes.showFollowers }) } />				
			</PanelRow>
			<PanelRow>
				<ToggleControl checked={ props.attributes.isCroped } label="Image Crop ?" onChange={ () => props.setAttributes({ 'isCroped': !props.attributes.isCroped }) } />				
			</PanelRow>
			<PanelRow>
				<p>Column Settings:</p>
				<RangeControl
					value={ props.attributes.column }
					onChange={ ( column ) => props.setAttributes( { column: column } ) }
					min={ 1 }
					max={ 8 }
				/>
			</PanelRow>
			<PanelRow>
				<p>Post Count:</p>
				<RangeControl
					value={ props.attributes.postCount }
					onChange={ ( postCount ) => props.setAttributes( { postCount: postCount } ) }
					min={ 1 }
					max={ 12 }
				/>
			</PanelRow>
			<PanelRow>
				<TextControl value={ props.attributes.userName }  label="Enter Your Instagram username" onChange={(val)=> props.setAttributes({ 'userName': val })} />	
			</PanelRow>
			{props.attributes.userName ? 
			<PanelRow>
				<Button isPrimary onClick={ ()=> getUserInfo() } > Fetch My Details </Button>	
			</PanelRow>
			: ''}
		</PanelBody>
	);
}

const MyPanel = ({props , getUserInfo }) => (
	<InspectorControls>
		<InstaPanel props = {props} getUserInfo = { getUserInfo } />
	</InspectorControls>	
);

const InstagramEmbed = ({ props, getUserInfo, isServer = false }) => {
	const { attributes } = props;
	const { userObject, column, isCroped, postCount, showFollowers, userName } = attributes;

	if ( ! userObject || ! userObject.userObjectLoaded ) {
		if ( isServer ) {
			return null;
		}
		return (
			<div className="instagram-placeholder">
				<h3>{ metadata.title }</h3>
				<InstaPanel props={ props } getUserInfo={ getUserInfo } />
			</div>
		);
	}

	const userData = userObject.userObject && userObject.userObject.graphql ? userObject.userObject.graphql.user : null;

	if ( ! userData ) {
		return isServer ? null : <div>{ __( 'No Instagram data found for user: ', 'gutenberg-instagram-post-grid' ) + userName }</div>;
	}

	return (
		<Fragment>
			<FollowerCount 
				count={ userData ? fnum( userData.edge_followed_by.count ) : '' } 
				showFollowers={ showFollowers } 
			/>
			<figure className={ `wp-block-gallery columns-${ column } ${ isCroped ? 'is-cropped' : '' }` }>
				<ul className="blocks-gallery-grid">
					{ userData.edge_owner_to_timeline_media.edges.slice( 0, postCount ).map( ( value, key ) => (
						<li key={ key } className="blocks-gallery-item">
							<figure>
								<img 
									src={ getProxyUrl( value.node.display_url ) } 
									alt="" 
									tabIndex="0" 
								/>
							</figure>
						</li>
					) ) }
				</ul>
			</figure>
		</Fragment>
	);
};

const FollowerCount = ({count, showFollowers}) => (
	<Fragment>
	{ showFollowers && count ? <div className="instagram-follower-count">{ `Followers Count - ${count}` }</div> : '' } 
	</Fragment> 	
);

registerBlockType( metadata.name, {
	edit: ( props ) => {
		const getUserInfo = async () => {
			let userName = (props.attributes.userName);
			userName = typeof(userName) !== 'undefined' ?  userName : 'instagram';
			
			try {
				const response = await apiFetch({
					path: `instagram-post-grid/v1/fetch?username=${userName}`,
					method: 'GET',
				});
				
				const userObjectLoaded = (response && typeof(response.captcha) == 'undefined' && response.graphql) ? 1 : 0 ;
				props.setAttributes( { 
					"userObject": { userObject : response  , userObjectLoaded: userObjectLoaded } 
				} );
			} catch (error) {
				console.error('Error fetching Instagram data:', error);
				props.setAttributes( { 
					"userObject": { userObject : {}  , userObjectLoaded: 0 } 
				} );
			}
		}

		return (
			<div { ...useBlockProps() }>
				<MyPanel props={props} getUserInfo={ getUserInfo }/>
				<InstagramEmbed props={ props } getUserInfo={ getUserInfo } />
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
