# Instagram Gallery

The Instagram Gallery block allows you to embed your public Instagram posts into your website using a beautiful grid layout.

## Features
- **Dynamic Updates:** Automatically fetches the latest posts on the frontend.
- **Shortcode Support:** Can also be used via `[instagram_post_grid]`.
- **Follower Count:** Optional toggle to show your follower count.

## How to Use
1. Add the **Social Gallery (Instagram)** block in Gutenberg.
2. Enter your Instagram username in the sidebar.
3. Adjust columns and post counts as needed.

## Shortcode Usage
Use `[instagram_post_grid username="your_handle" columns="4" count="12"]`.

| Attribute | Description | Default |
| :--- | :--- | :--- |
| `username` | (Required) Your Instagram handle. | - |
| `columns` | Number of columns (1-8). | `4` |
| `count` | Number of posts to display (1-12). | `12` |
| `cropped` | `yes` or `no` to square-crop images. | `yes` |
