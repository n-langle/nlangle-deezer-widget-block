=== NLangle Deezer Widget Block ===
Contributors:      nlangle
Repository:        https://github.com/n-langle/nlangle-deezer-widget-block
Tags:              block, deezer, widget, audio
Tested up to:      7.1.2
Stable tag:        0.1.2
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A WordPress block for embedding Deezer music players into your content. This plugin is not affiliated with, authorized, maintained, sponsored, or endorsed by Deezer or any of its affiliates or subsidiaries. Supports albums, playlists, tracks, artists and podcasts.

== Description ==

The NLangle Deezer Widget Block allows you to easily embed Deezer music players into your WordPress posts and pages using the block editor. Simply paste a Deezer URL for an album, playlist, track, artist or podcast and the block will display an interactive player widget.

Features:
* Supports embedding albums, playlists, tracks, artists and podcasts
* Clean, native Deezer player interface
* Responsive design that adapts to your content width
* Simple URL-based embedding - just paste and go
* Maintains consistent styling with WordPress block editor

This block makes it easy to share music from Deezer's extensive catalog directly in your WordPress content. The embedded player allows visitors to preview and play music without leaving your site.


== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/nlangle-deezer-widget-block` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress


== Frequently Asked Questions ==

= Does it work ? =

Yes.

== Screenshots ==

1. Example of the plugin in action

== Changelog ==

= 0.1.2 =
* Fix stable version

= 0.1.1 =
* Minor style adjustment for editor context

= 0.1.0 =
* Release

== External services ==

=== Back office ===
This plugin connects to the [Deezer Search API](https://developers.deezer.com/api/search) to retrieve music and podcast data for embedding players in your WordPress content.

The plugin sends the following data to Deezer's API:
* Search queries entered by users when searching for music or podcasts
* The type of content being searched (album, artist, playlist, podcast, or track)

This data is sent only when:
* A user with edit permissions searches for content using the block editor
* The search is performed through the WordPress REST API

The Deezer API is provided by Deezer S.A. and is subject to their terms of service and privacy policy:
* [Deezer API Terms of Service](https://developers.deezer.com/termsofuse)
* [Deezer Privacy Policy](https://www.deezer.com/legal/personal-datas)

=== Front office ===
The Deezer widget use cookies :
_abck
ajs_anonymous_id
ajs_user_id
bm_sz
consentMarketing
consentStatistics
didomi_token
dz_lang
dzr_uniq_id
sid

Data are also stored in local storage
ak_a
ak_ax
chakra-ui-color-mode

=== Credits ===
This plugin uses the Deezer API and Deezer logo but is not endorsed or certified by Deezer.
[deezer.com](https://www.deezer.com)
