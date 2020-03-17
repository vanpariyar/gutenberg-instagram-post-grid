/**
 * BLOCK: Gutenberg Instagram Block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { useState, Fragment } = wp.element;
const { 
	TextControl,
	CheckboxControl,
	RadioControl,
	SelectControl,
	TextareaControl,
	ToggleControl,
	RangeControl,
	Panel,
	PanelBody,
	PanelRow,
	Spinner,
	Button,
} = wp.components;
const { InspectorControls } = wp.blockEditor;

const MyPanel = ({props , getUserInfo }) => (
	<InspectorControls>
		<PanelBody title="My Block Settings" initialOpen={ true }>
			<PanelRow>
				<strong>Note: This Will only works For instagram Public Acoount.</strong>
			</PanelRow>
			<PanelRow>
				<ToggleControl checked={ props.attributes.showFollowers } label="show Your Followers" onChange={ () => props.setAttributes({ 'showFollowers': !props.attributes.showFollowers }) } />				
			</PanelRow>
			<PanelRow>
				<TextControl value={ props.attributes.userName }  label="Enter Your Instagram username" onChange={(val)=> props.setAttributes({ 'userName': val })} />	
			</PanelRow>
			<PanelRow>
				<Button isPrimary onClick={ ()=> getUserInfo() } > Fetch My Details </Button>	
			</PanelRow>
		</PanelBody>
	</InspectorControls>	
);
const InstagramEmbed = ({props , getUserInfo }) => (
	props.attributes.userObject.userObjectLoaded ?
	<section>
		<figure className="wp-block-gallery columns-4 is-cropped">
			<ul className="blocks-gallery-grid">
				{props.attributes.userObject.userObject.graphql.user.edge_owner_to_timeline_media.edges.map((value, key) =>  
					<li key={key} className="blocks-gallery-item">
						<figure className="">
							<img src={value.node.display_url} alt="" data-id="130" tabindex="0" aria-label="image 1 of 8 in gallery" />
						</figure>
					</li>
				)}
			</ul>
		</figure>
	</section> 
	: 
	<div>
		<PanelBody title="My Block Settings" initialOpen={ true }>
			<PanelRow>
				<strong>Note: This Will only works For instagram Public Acoount.</strong>
			</PanelRow>
			<PanelRow>
				<ToggleControl checked={ props.attributes.showFollowers } label="show Your Followers" onChange={ () => props.setAttributes({ 'showFollowers': !props.attributes.showFollowers }) } />				
			</PanelRow>
			<PanelRow>
				<TextControl value={ props.attributes.userName }  label="Enter Your Instagram username" onChange={(val)=> props.setAttributes({ 'userName': val })} />	
			</PanelRow>
			<PanelRow>
				<Button isPrimary onClick={ ()=> getUserInfo() } > Fetch My Details </Button>
			</PanelRow>
		</PanelBody>
	</div>	
);
const FollowerCount = ({count, showFollowers}) => (
	<div>
	{ showFollowers ? `Followers Count - ${count}` : '' } 
	</div> 	
);
/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'vanpariyar/instagram-post-grid', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Instagram Post Grid' ), // Block title.
	icon: 'instagram', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Instagram Post Grid' ),
		__( 'vanpariyar' ),
		__( 'create-guten-block' ),
	],
	attributes: {
		"userName": {
			type: 'string'
		},
		"showFollowers": {
			type: 'boolean',
			default: 0,
		},
		"showProfilePic": {
			type: 'boolean'
		},
		"userObject":{
			type: 'object',
			default: {
				userObjectLoaded: 0,
				userObject: {},
			},
			
		},
		"userObjectLoaded":{
			type: 'boolean',
			default: 0,
		}
	},
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */
	edit: ( props ) => {
		const getUserInfo = async () => {
			let userName = (props.attributes.userName);
			userName = typeof(userName) !== 'undefined' ?  userName : 'instagram';
			const response = await fetch(`https://www.instagram.com/${userName}?__a=1`)
				.then(retured =>{
					if(retured.ok) return retured;		
					// throw new Error('Problem With Network');
				}).then(retured =>{
					return retured.json();
				});
			const userObjectLoaded = (typeof(response.captcha) == 'undefined') ? 1 : 0 ;
			props.setAttributes( { 
				"userObject": { userObject : response  , userObjectLoaded: userObjectLoaded } 
			} );		
		}

		return (
			<div>
				<MyPanel props={props} getUserInfo={ getUserInfo }/>
				<FollowerCount count={ typeof(props.attributes.userObject.userObject.graphql) != 'undefined' ? props.attributes.userObject.userObject.graphql.user.edge_followed_by.count : '' } showFollowers={ props.attributes.showFollowers } />
				<InstagramEmbed props={ props } getUserInfo={ getUserInfo }/>
			</div>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Frontend HTML.
	 */
	save: ( props ) => {
		return (
			<div>
				<InstagramEmbed props={props} getUserInfo={ getUserInfo }/>
			</div>
		);
	},
} );
