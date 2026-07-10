# YMDC Website

Static site — no build step, no framework. Open `index.html` directly or run any local static server..

## Structure
```
index.html              → homepage
blog/index.html         → blog listing
blog/posts/*.html       → individual posts
css/style.css           → all styling (brand vars at top: navy/gold/red)
js/main.js              → footer year + nav scroll shadow
images/logo.png         → YMDC logo
sitemap.xml, robots.txt → SEO
CNAME                   → GitHub Pages custom domain file (contains "ymdc.pk")
```

## Local preview
Open `index.html` in a browser, or from this folder run:
```
python3 -m http.server 8000
```
then visit `http://localhost:8000`

## Deploy to GitHub Pages
1. Push this folder to a new GitHub repo (public or private both work with Pages).
2. Repo → Settings → Pages → set source to your main branch, root folder.
3. Repo → Settings → Pages → Custom domain → enter `ymdc.pk` (the CNAME file already has this, GitHub will pick it up).
4. In your domain DNS panel (expresswebhosters.com → ymdc.pk → DNS), add:
   - **A records** (four of them) for the root domain pointing to:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME record** for `www` pointing to `<your-github-username>.github.io`
5. Wait for DNS propagation (can take a few hours), then check "Enforce HTTPS" in GitHub Pages settings once the domain verifies.

## Adding a new blog post
1. Copy `blog/posts/dental-scaling-guide.html` as a template.
2. Update: `<title>`, meta description, canonical URL, JSON-LD `headline`/`description`/`datePublished`, and the article body.
3. Add a new `<a class="blog-card">` block in `blog/index.html` linking to the new post.
4. Add the new post's URL to `sitemap.xml`.
5. (Optional) Swap the homepage's 2nd/3rd blog preview placeholder cards on `index.html` for the new post once you have 3+ real posts.

## Editable content you'll likely revisit
- **Promotions section** (`index.html`, "Current Promotions") — seasonal, update pricing/offers directly in the HTML.
- **Doctor cards** (`index.html`, `#doctors`) — update availability if schedules change.
- **WhatsApp number** — currently `923356733777` in `wa.me` links across all pages; find/replace if it changes.
