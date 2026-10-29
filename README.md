# Ahmed Hussain — Portfolio

A one-page portfolio for Ahmed Hussain: GlobalSync AI, Gem Content Engine, Gem Agency and Gem Autopilot, plus a live AI news feed.

It's a static site with no build step and no dependencies. Open `index.html` in a browser and it works.

## Files

| File | What it is |
|---|---|
| `index.html` | All the page content: text, links, projects, contact |
| `styles.css` | The look: colors, fonts, liquid-glass panels, layout |
| `script.js` | The live AI news feed, and the glass highlight that follows the mouse |
| `privacy.html` | Privacy policy. Update it if you ever add analytics, cookies or a contact form |
| `terms.html` | Terms of use |
| `404.html` | The page visitors see for a broken link. Uses root paths (`/styles.css`) because GitHub Pages serves it at any address |
| `site.webmanifest` | Name, colors and icon used when someone adds the site to their phone's home screen |
| `sitemap.xml`, `robots.txt` | Help search engines find and index the pages |
| `assets/` | Your photo, product logos, product screenshots, favicon and social preview image |
| `design-history/` | The two earlier directions (A · Operator, B · Editorial), kept for reference |

## Common updates

**Change text or links:** edit `index.html`. Each section is labelled with an `id`: `#work`, `#news`, `#skills`, `#contact`.

**Change colors:** the palette is at the top of `styles.css` under `:root`. Gold is `--gold`, teal is `--teal`, the background is `--bg`.

**Change fonts:** headings use Bodoni Moda (`--display`) and body text uses Hanken Grotesk (`--sans`). Both load from Google Fonts in the `<head>` of `index.html`.

**Replace a product screenshot:** save a 1440×900 image over the matching file in `assets/` (`shot-globalsync.webp`, `shot-engine.webp`, `shot-agency.webp`, `shot-autopilot.webp`). WebP keeps the page fast. To convert an image:

```bash
ffmpeg -i screenshot.png -c:v libwebp -quality 82 assets/shot-globalsync.webp
```

**Add a project:** copy one `<article class="glass proj ...">` block in `index.html`, then change the logo, name, screenshot and bullets. The accent color comes from the class: `c1` gold, `c2` coral, `c3` violet, `c4` teal.

**Add TikTok:** the TikTok icon is still defined in the page (`#tt`) but isn't shown. Add this line to the social row:

```html
<a href="https://www.tiktok.com/@yourhandle" target="_blank" rel="noopener" aria-label="TikTok"><svg class="b"><use href="#tt"/></svg></a>
```

## Live AI news

`script.js` pulls the 6 top-voted AI stories from the last 3 days from the public Hacker News search API (`hn.algolia.com`). There's no API key and no server. It refreshes every 10 minutes and has a Refresh button. If the feed is down, visitors see a short message and a link to Hacker News.

To change which stories count as AI news, edit `TERMS` (the search words) and `isAI` (the title filter) in `script.js`.

## Going live

Any static host works. The fastest options:

1. **Netlify Drop:** go to app.netlify.com/drop and drag this whole folder onto the page.
2. **Vercel:** run `npx vercel` in this folder, or import it from GitHub.
3. **GitHub Pages:** push this folder to a repo, then turn on Pages in the repo settings.

**Live at https://mahussain456.github.io** (GitHub Pages, repo `mahussain456/mahussain456.github.io`). To update the live site, commit and push:

```bash
git add -A && git commit -m "Update portfolio" && git push
```

If you move to a custom domain, update these in `index.html`:

- `og:image`, `og:url` and the `canonical` link
- The address in `sitemap.xml`
- The `Sitemap` line in `robots.txt`

## Notes

- Email (`m.ahmedhussain9@gmail.com`) is visible in the page, so spam bots can find it. If that becomes a problem, swap the email link for a contact form.
- The Instagram and YouTube links use `@decodedaisimplified`. Check that both open the right profiles before launch.
- Screenshots of Gem Agency and Gem Autopilot were taken from the running local apps on 29 Oct 2026. The Gem Agency shot shows project names (e.g. "Tech Support"). Retake it with demo data if any are real client names.
