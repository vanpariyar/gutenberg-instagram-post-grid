# Getting Started

Social Gallery Block is a powerful and lightweight WordPress plugin that allows you to embed your public Instagram posts into your website using a beautiful grid layout.

## Installation

1. Upload the `gutenberg-instagram-post-grid` folder to the `/wp-content/plugins/` directory, or install directly through the WordPress plugins screen.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. **Gutenberg:** Search for the "Social Gallery" block in the editor.
4. **Shortcode:** Use `[instagram_post_grid username="your_handle"]` anywhere on your site.

## How to Use

### Gutenberg Block
1. In the editor, click the **+** icon.
2. Search for **"Social Gallery"** or **"Instagram"**.
3. Add the block and enter your Instagram username in the settings sidebar.

![Social Gallery Block Settings](https://user-images.githubusercontent.com/26689210/76748799-66c7ff00-67a1-11ea-83a3-d24205d2fa56.png)

### Shortcode
Simply paste the following shortcode into any post, page, or widget:

```text
[instagram_post_grid username="instagram" columns="4" count="12"]
```

## Local Development

If you want to contribute or modify the plugin:

```bash
# Install dependencies
npm install

# Build production assets
npm run build

# Start development mode
npm start
```

### Docker Setup
A `docker-compose.yml` is provided for quick environment setup:
```bash
docker-compose up
```
Visit: `http://localhost:8080/`
