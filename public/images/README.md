# Image folders for The Fix Collective

Images in `public/` are served from the site root. Use paths like `/images/site/logo.png` in your code or markup.

## Structure

### `site/`
General site-wide images: logo, favicon, homepage hero, shared graphics, etc.

**Example:** `/images/site/logo.png`, `/images/site/hero.jpg`

---

### `shops/{shop-slug}/`
One folder per shop for that shop’s imagery.

| Shop slug       | Shop name          |
|----------------|--------------------|
| `urban-roots`   | The Fix Urban Roots |
| `self-care`     | The Fix Self-Care   |
| `stitch`        | Stitch              |
| `survival-kits` | Survival Kits      |

#### Shop logo (homepage cards)
Place each shop’s logo in that shop’s folder as **`logo.png`** (or **`logo.svg`**).  
The homepage shows these in the brown “The Fix Collective” box.

| File path | Shop |
|-----------|------|
| `shops/urban-roots/logo.png` | The Fix Urban Roots |
| `shops/self-care/logo.png` | The Fix Self-Care |
| `shops/stitch/logo.png` | Stitch |
| `shops/survival-kits/logo.png` | Survival Kits |

If the file is missing, the site shows the shop’s first letter as a fallback.

#### `shops/{shop-slug}/landing/`
Images for that shop’s **landing page** (e.g. hero, banners, section images).

**Examples:**
- `/images/shops/urban-roots/landing/hero.jpg`
- `/images/shops/self-care/landing/banner.png`

#### `shops/{shop-slug}/products/`
Images for **products** in that shop. The site looks for `{productId}.jpg`, then `.png`, then `.webp`.

- **One image per product:** `ur-starter-bed-kit.jpg`, `sc-evening-ritual-kit.png`, etc.
- Product IDs match the ids in your product data (e.g. `ur-ebook-compost`, `sc-evening-ritual-kit`).

**Examples:**
- `/images/shops/urban-roots/products/ur-starter-bed-kit.jpg`
- `/images/shops/self-care/products/sc-evening-ritual-kit.png`

---

### `platform/{platform-slug}/`
Images for each **platform** landing page (Community, Marketplace, Courses, etc.).

| Folder        | Page       |
|---------------|------------|
| `community`   | Community  |
| `marketplace` | Marketplace|
| `courses`     | Courses    |
| `downloads`   | Downloads  |
| `maps`        | Maps       |
| `messages`    | Messages   |
| `rootsync`    | RootSync   |

**Example:** `/images/platform/community/hero.jpg`

---

## Using images in the app

- **Next.js:** Put files under `public/images/...` and reference them with paths starting with `/images/...` (e.g. `<img src="/images/shops/urban-roots/landing/hero.jpg" />`).
- **CSS/backgrounds:** Use `url('/images/...')`.
- **Image component:** Next.js `Image` also uses `/images/...` when the file is in `public/`.

Recommended: keep filenames lowercase, use hyphens, and common web formats (e.g. `.jpg`, `.png`, `.webp`).
