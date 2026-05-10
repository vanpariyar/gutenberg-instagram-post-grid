# Shortcode Usage

The `[instagram_post_grid]` shortcode allows you to display your Instagram grid in the Classic Editor, widgets, or any page builder.

## Basic Usage

```text
[instagram_post_grid username="instagram"]
```

## Available Attributes

| Attribute | Description | Default |
| :--- | :--- | :--- |
| `username` | (Required) Your Instagram handle. | - |
| `columns` | Number of columns (1-8). | `4` |
| `count` | Number of posts to display (1-12). | `12` |
| `cropped` | `yes` or `no` to square-crop images. | `yes` |

## Examples

### 3-Column Grid with 6 Posts
```text
[instagram_post_grid username="nasa" columns="3" count="6"]
```

### Uncropped Images
```text
[instagram_post_grid username="natgeo" cropped="no"]
```
