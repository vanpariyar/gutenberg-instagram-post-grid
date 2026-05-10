# Frequently Asked Questions

### Can I use this for Twitter and Facebook?
Yes! Version 2.2.0 adds dedicated blocks for Twitter and RSS feeds. The RSS block is the best way to display Facebook Page content.

### Does it require a Twitter API key?
No. We use a custom method to fetch public media from Twitter without needing a Developer Account or API Key.

### Can I use it on private accounts?
No, Instagram's public API only allows fetching data from public profiles.

### Why am I seeing a "Rate Limit" error?
Instagram limits the number of requests from a single IP. Our plugin uses caching (1-hour transients) to minimize these requests, but if you still see this, wait a few minutes and it should resolve itself.

### How do I change the look of the grid?
You can use the built-in settings in the Gutenberg block (Columns, Post Count, Cropping) or use the corresponding shortcode attributes. For advanced styling, you can target the `.instagram-post-grid` CSS class in your theme.
