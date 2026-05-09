# Social Gallery Block

[![Deploy](https://github.com/vanpariyar/gutenberg-instagram-post-grid/workflows/Deploy/badge.svg)](https://github.com/vanpariyar/gutenberg-instagram-post-grid/actions)
[![WordPress Plugin](https://img.shields.io/wordpress/plugin/v/social-gallery-block.svg)](https://wordpress.org/plugins/social-gallery-block/)

Social Gallery Block is a powerful and lightweight WordPress plugin that allows you to embed your public Instagram posts into your website using a beautiful grid layout. It works both as a **Gutenberg Block** and a **Shortcode**.

![Social Gallery Block Banner](https://user-images.githubusercontent.com/26689210/81413061-6e34d480-9162-11ea-9916-482aa3c747d6.png)

## 🚀 Features
* **Gutenberg Ready:** Easy-to-use block with real-time preview.
* **Shortcode Support:** Use `[instagram_post_grid]` anywhere (Classic Editor, Widgets, etc.).
* **No App Required:** Works with public Instagram accounts without needing to create a Facebook/Instagram App.
* **Performance Focused:** Built-in 1-hour transient caching to minimize API calls and prevent rate-limiting.
* **Interactive:** Images link directly to the original Instagram posts.
* **Customizable:** Change column count, post count, and toggle image cropping.
* **Privacy & Security:** Uses a server-side proxy to avoid CORS/CORP issues and protect your site's integrity.

## 📖 How to Use

### Gutenberg Block
1. In the editor, click the **+** icon.
2. Search for **"Social Gallery"** or **"Instagram"**.
3. Add the block and enter your Instagram username in the settings sidebar.

### Shortcode
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

# Generate distribution ZIP
npm run plugin-zip
```

### Docker Setup
A `docker-compose.yml` is provided for quick environment setup:
```bash
docker-compose up
```
Visit: `http://localhost:8080/`

## 📸 Screenshots

![Social Gallery Block Settings](https://user-images.githubusercontent.com/26689210/76748799-66c7ff00-67a1-11ea-83a3-d24205d2fa56.png)

## 🤝 Contributing
Welcome! Feel free to open issues or submit pull requests to help make this plugin better.

---
### Author
**Ronak Vanpariya** - [@VanpariyaRonakJ](https://twitter.com/VanpariyaRonakJ/)
