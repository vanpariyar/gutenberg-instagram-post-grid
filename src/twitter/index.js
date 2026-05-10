import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	TextControl,
	RangeControl,
	PanelBody,
} from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';

import metadata from './block.json';
import './style.scss';

registerBlockType( metadata.name, {
	edit: function Edit( { attributes, setAttributes } ) {
		return (
			<div { ...useBlockProps() }>
				<InspectorControls>
					<PanelBody title={ __( 'Twitter Settings', 'gutenberg-instagram-post-grid' ) }>
						<TextControl
							label={ __( 'Twitter Username', 'gutenberg-instagram-post-grid' ) }
							value={ attributes.username }
							onChange={ ( username ) => setAttributes( { username } ) }
						/>
						<RangeControl
							label={ __( 'Columns', 'gutenberg-instagram-post-grid' ) }
							value={ attributes.columns }
							onChange={ ( columns ) => setAttributes( { columns } ) }
							min={ 1 }
							max={ 6 }
						/>
						<RangeControl
							label={ __( 'Post Count', 'gutenberg-instagram-post-grid' ) }
							value={ attributes.count }
							onChange={ ( count ) => setAttributes( { count } ) }
							min={ 1 }
							max={ 12 }
						/>
					</PanelBody>
				</InspectorControls>
				{ attributes.username ? (
					<ServerSideRender
						block={ metadata.name }
						attributes={ attributes }
					/>
				) : (
					<div className="placeholder">
						<p>{ __( 'Please enter a Twitter username in the settings.', 'gutenberg-instagram-post-grid' ) }</p>
					</div>
				) }
			</div>
		);
	},
	save: () => null,
} );
