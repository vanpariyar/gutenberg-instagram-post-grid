=== Social Gallery Block ===
Contributors: vanpariyar
Tags: instagram, gallery, gutenberg, social gallery, shortcode
Requires at least: 5.0
Requires PHP: 7.0
Tested up to: 6.5
Stable tag: 2.1.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Embed your public Instagram posts into your website using a beautiful grid layout. Works as a Gutenberg Block or a Shortcode.

== Description ==

Social Gallery Block is a lightweight and powerful WordPress plugin designed to showcase your Instagram content effortlessly. Unlike many other plugins, it doesn't require you to create a complex Facebook or Instagram App to fetch public data.

Whether you are using the modern Gutenberg editor or the Classic editor, this plugin has you covered with its native block and versatile shortcode.

### Key Features:
* **Gutenberg Native:** A dedicated "Social Gallery" block with live preview and easy customization.
* **Versatile Shortcode:** Use `[instagram_post_grid]` in any post, page, or widget.
* **Performance First:** Features built-in 1-hour transient caching to speed up your site and avoid Instagram rate-limiting.
* **No App Hassle:** Fetch public profile details without needing an Instagram API App.
* **Interactive Grid:** Images link directly to the original Instagram posts for better engagement.
* **Privacy & Security:** Uses a server-side proxy to serve images, preventing CORS/CORP issues and protecting your visitors' privacy.
* **Highly Customizable:** Control columns, post counts, and image cropping directly from the editor or shortcode attributes.

### Want to contribute?
Check out the project on GitHub: https://github.com/vanpariyar/gutenberg-instagram-post-grid/

== Installation ==

1. Upload the `gutenberg-instagram-post-grid` folder to the `/wp-content/plugins/` directory, or install directly through the WordPress plugins screen.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. **Gutenberg:** Search for the "Social Gallery" block in the editor.
4. **Shortcode:** Use `[instagram_post_grid username="your_handle"]` anywhere on your site.

== Frequently Asked Questions ==

= Does this require an Instagram Access Token? =
No! This plugin fetches data from public profiles using Instagram's web API, so you don't need to generate or maintain access tokens.

= Can I use it on private accounts? =
No, Instagram's public API only allows fetching data from public profiles.

= Why am I seeing a "Rate Limit" error? =
Instagram limits the number of requests from a single IP. Our plugin uses caching to minimize these requests, but if you still see this, wait a few minutes and it should resolve itself.

== Screenshots ==

1. The Gutenberg Block settings and real-time preview.
2. The Instagram grid layout on the frontend.
3. Post count and column settings.
4. Block preview with placeholder.

== Shortcode Usage ==

Display your grid anywhere with:
`[instagram_post_grid username="instagram" columns="4" count="12"]`

**Available Attributes:**
* `username`: (Required) Your Instagram username.
* `columns`: Number of columns (1-8).
* `count`: Number of posts to show (1-12).
* `cropped`: `yes` or `no` to toggle square cropping.

== Changelog ==

= 2.1.0 =
* NEW: Added `[instagram_post_grid]` shortcode support.
* NEW: Images now link to original Instagram posts.
* NEW: Added 1-hour server-side caching for better performance.
* IMPROVED: Refined API headers to prevent 401/429 errors.
* IMPROVED: Better error reporting in the Gutenberg editor.
* FIX: Resolved image proxying and loading issues.
* CHORE: Updated metadata and documentation for WordPress.org submission.

= 2.1 =
- Fix the plugin name and working on gallery not showing
= 2.0 =
- Fix the gallery is not rendering after Update
= 1.8 =
- Minor Changes (Typo and Name Fix)
= 1.0 =
- Initial: First Version

== Upgrade Notice ==
Please update to 2.1.0 for significantly improved performance, clickable images, and shortcode support.
