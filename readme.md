# Social Gallery Block

[![Deploy](https://github.com/vanpariyar/gutenberg-instagram-post-grid/workflows/Deploy/badge.svg)](https://github.com/vanpariyar/gutenberg-instagram-post-grid/actions)
[![WordPress Plugin](https://img.shields.io/wordpress/plugin/v/social-gallery-block.svg)](https://wordpress.org/plugins/social-gallery-block/)

Social Gallery Block is a powerful and lightweight WordPress plugin that allows you to embed your social media feeds into your website using beautiful grid layouts. It supports **Instagram**, **Twitter (X)**, and **RSS feeds** (perfect for Facebook pages).

![Social Gallery Block Banner](https://user-images.githubusercontent.com/26689210/81413061-6e34d480-9162-11ea-9916-482aa3c747d6.png)

## 🚀 Features
* **Multi-Platform Support:**
    * **Instagram:** Embed public profile grids.
    * **Twitter (X):** Showcase latest media from any public X account.
    * **RSS / Facebook:** Use any RSS feed (or FB-to-RSS bridge) to display a media gallery.
* **Gutenberg Ready:** Dedicated blocks for each platform with real-time previews.
* **Shortcode Support:** Use `[instagram_post_grid]` for Instagram anywhere.
* **No App Required:** Works with public accounts without needing to create complex API Apps.
* **Performance Focused:** Built-in 1-hour transient caching to minimize API calls and speed up your site.
* **Dynamic Rendering:** Galleries update automatically on the frontend without needing to re-save posts.
* **Privacy & Security:** Uses a server-side proxy for images to avoid CORS issues and protect user privacy.

## 📖 How to Use

### Gutenberg Blocks
1. In the editor, click the **+** icon.
2. Search for **"Social Gallery"**, **"Instagram"**, **"Twitter"**, or **"RSS Gallery"**.
3. Add the desired block and configure the settings in the sidebar.

### Shortcode (Instagram Only)
Simply paste the following shortcode into any post, page, or widget:

```text
[instagram_post_grid username="instagram" columns="4" count="12"]
```

#### Shortcode Attributes:
* `username`: (Required) Your Instagram handle.
* `columns`: Number of columns (Default: `4`).
* `count`: Number of posts to display (Default: `12`).
* `cropped`: `yes` or `no` to square-crop images (Default: `yes`).

## 🛠 Local Development

This project uses `@wordpress/scripts` for the build process.

```bash
# Install dependencies
npm install

# Build production assets
npm run build

# Start development mode
npm start
```

## 📸 Screenshots

![Social Gallery Block Settings](https://user-images.githubusercontent.com/26689210/76748799-66c7ff00-67a1-11ea-83a3-d24205d2fa56.png)

## 🤝 Contributing
Welcome! Feel free to open issues or submit pull requests to help make this plugin better.

---
### Author
**Ronak Vanpariya** - [@VanpariyaRonakJ](https://twitter.com/VanpariyaRonakJ/)
