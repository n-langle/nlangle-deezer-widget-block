/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { BlockControls, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RadioControl, RangeControl, SelectControl, TextControl, ToolbarGroup } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';
import { isValidDeezerUrl } from './utils';
import { DeezerHorizontalLockup } from './Icons';
import DeezerWidget from './DeezerWidget';
import CardArtist from './CardArtist';
import CardAlbum from './CardAlbum';
import CardCommon from './CardCommon';
import CardTrack from './CardTrack';

/**
 * cards
 */
const cards = {
	artist: CardArtist,
	album: CardAlbum,
	common: CardCommon,
	track: CardTrack,
};

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object} root0
 * @param {Object} root0.attributes
 * @param {Object} root0.setAttributes
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [connection, setConnection] = useState('');
	const [isEditing, setIsEditing] = useState(!isValidDeezerUrl(attributes.deezerUrl));

	const getCard = (result) => {
		const Card = cards[result.type] || cards.common;
		return <Card result={result} setDeezerUrl={setDeezerUrl} />;
	};

	const onInputSearchChange = (value) => {
		const url = new URL(deezerWidgetBlockData.restSearchUrl);

		url.searchParams.set('query', value);
		url.searchParams.set('connection', connection);

		fetch(url, {
			headers: {
				'X-WP-Nonce': deezerWidgetBlockData.nonce,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				setSearchResults(data);
			});

		setSearchQuery(value);
	};

	const onConnectionChange = (value) => {
		setConnection(value);

		setSearchResults([]);
		setSearchQuery('');
	};

	const onInputDeezerUrlChange = (value) => {
		setAttributes({ deezerUrl: value });
	};

	const setDeezerUrl = (value) => {
		setSearchResults([]);
		setIsEditing(false);
		setAttributes({ deezerUrl: value });
	};

	const onFormSubmit = () => {
		if (isValidDeezerUrl(attributes.deezerUrl)) {
			setIsEditing(false);
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Deezer Widget', 'nlangle-deezer-widget-block')} initialOpen={true}>
					<RadioControl
						label={__('Theme', 'nlangle-deezer-widget-block')}
						selected={attributes.theme}
						options={[
							{ label: __('Auto', 'nlangle-deezer-widget-block'), value: 'auto' },
							{ label: __('Dark', 'nlangle-deezer-widget-block'), value: 'dark' },
							{ label: __('Light', 'nlangle-deezer-widget-block'), value: 'light' },
						]}
						onChange={(theme) => setAttributes({ theme })}
					/>
					<RadioControl
						label={__('Show tracklist', 'nlangle-deezer-widget-block')}
						selected={attributes.showTracklist}
						options={[
							{ label: __('Yes', 'nlangle-deezer-widget-block'), value: 'yes' },
							{ label: __('No', 'nlangle-deezer-widget-block'), value: 'no' },
						]}
						onChange={(showTracklist) => setAttributes({ showTracklist })}
					/>
					<RangeControl
						label={__('Height', 'nlangle-deezer-widget-block')}
						value={attributes.height}
						onChange={(height) => setAttributes({ height })}
						min={150}
						max={1000}
						step={10}
						allowReset={true}
					/>
				</PanelBody>
			</InspectorControls>
			{!isEditing && (
				<BlockControls key="toolbar">
					<ToolbarGroup
						controls={[
							{
								icon: 'edit',
								title: __('Edit', 'nlangle-deezer-widget-block'),
								onClick: () => setIsEditing(true),
							},
						]}
					/>
				</BlockControls>
			)}
			<div {...blockProps}>
				{isEditing || !isValidDeezerUrl(attributes.deezerUrl) ? (
					<>
						<DeezerHorizontalLockup />
						<div className="wp-block-nlangle-deezer-widget__form">
							<div className="wp-block-nlangle-deezer-widget__form-row">
								<SelectControl
									label={__('Filter', 'nlangle-deezer-widget-block')}
									value={connection}
									options={[
										{ label: __('Default', 'nlangle-deezer-widget-block'), value: '' },
										{ label: __('Album', 'nlangle-deezer-widget-block'), value: 'album' },
										{ label: __('Artist', 'nlangle-deezer-widget-block'), value: 'artist' },
										{ label: __('Playlist', 'nlangle-deezer-widget-block'), value: 'playlist' },
										{ label: __('Podcast', 'nlangle-deezer-widget-block'), value: 'podcast' },
										{ label: __('Track', 'nlangle-deezer-widget-block'), value: 'track' },
									]}
									onChange={onConnectionChange}
									__next40pxDefaultSize
									__nextHasNoMarginBottom
								/>
								<div className="wp-block-nlangle-deezer-widget__form-search">
									<TextControl
										label={__('Search', 'nlangle-deezer-widget-block')}
										placeholder={__('Rick Astley', 'nlangle-deezer-widget-block')}
										value={searchQuery}
										onChange={onInputSearchChange}
									/>
									{searchResults.data && searchResults.data.length > 0 && (
										<ul className="wp-block-nlangle-deezer-widget__search-results">
											{searchResults.data.map((result) => (
												<li key={result.id}>{getCard(result)}</li>
											))}
										</ul>
									)}
								</div>
							</div>
							<div className="wp-block-nlangle-deezer-widget__form-row">
								<TextControl
									label={__('Deezer url', 'nlangle-deezer-widget-block')}
									placeholder={__('https://www.deezer.com/us/artist/6160', 'nlangle-deezer-widget-block')}
									value={attributes.deezerUrl}
									onChange={onInputDeezerUrlChange}
								/>
								{attributes.deezerUrl && !isValidDeezerUrl(attributes.deezerUrl) ? (
									<p className="wp-block-nlangle-deezer-widget__form-instruction">{__('Invalid Deezer url', 'nlangle-deezer-widget-block')}</p>
								) : (
									<p className="wp-block-nlangle-deezer-widget__form-instruction">
										{__('Supported contents: Album, Playlist, Track, Artist, Podcast, Episode', 'nlangle-deezer-widget-block')}
									</p>
								)}
							</div>
							<div className="wp-block-nlangle-deezer-widget__form-row">
								<button className="wp-block-nlangle-deezer-widget__form-submit" onClick={onFormSubmit}>
									{__('Embed', 'nlangle-deezer-widget-block')}
								</button>
							</div>
							<p className="wp-block-nlangle-deezer-widget__mention">
								{__('This block uses the Deezer API and Deezer logo but is not endorsed or certified by Deezer.', 'nlangle-deezer-widget-block')}
							</p>
						</div>
					</>
				) : (
					<DeezerWidget {...attributes} />
				)}
			</div>
		</>
	);
}
