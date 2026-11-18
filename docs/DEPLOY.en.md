# Deployment guide

[繁體中文](DEPLOY.md) | **English**

This guide shows how to host your own copy of headmap (頭圖 3D). No programming is needed; follow the steps for the platform you pick.

> The app's interface is in Traditional Chinese. Button names quoted from the app are given in Chinese with an English gloss.

## Three things to know first

1. **It is a fully static site.** No backend, no database, no build step and no packages to install. Put the files of this folder, unchanged, on anything that can serve web pages and the site is live.
2. **Drawings stay in each user's own browser.** Your host never receives anyone's drawings, and you need no storage for them.
3. **Data is tied to the address.** Drawings made on `a.example.com` are not visible on `b.example.com`. Settle on the address before you invite people to use the site (see [Changing the address](#changing-the-address)).

The whole site is about 9 MB; the four head models account for about 6 MB.

## Pick a platform

| Platform | Cost | Good for | GitHub account needed? |
|---|---|---|---|
| [Cloudflare Pages](#cloudflare-pages) | Free | Most people; the official site runs on it | Yes (or upload the files directly, no account link needed) |
| [GitHub Pages](#github-pages) | Free | People already on GitHub | Yes |
| [Netlify](#netlify) | Free tier | Drag-and-drop uploads | Optional |
| [Vercel](#vercel) | Free tier is for personal, non-commercial use | People already on Vercel | Yes |
| [Your own server](#your-own-server) | Depends on the server | You have a server or a domain | No |

The first four give you a free HTTPS address. Dashboards change from time to time; if a button is named slightly differently from what is written here, pick the one with the closest meaning.

## Get the code

- **Fork (recommended):** on <https://github.com/headmap-app/headmap> click **Fork** in the top right. You get your own copy, and picking up new versions later takes one click (see [Updating](#updating)).
- **Download ZIP:** on the same page click **Code → Download ZIP** and unpack it. Use this if you would rather upload files than connect GitHub.

## Cloudflare Pages

1. Fork this repository.
2. Sign in to [Cloudflare](https://dash.cloudflare.com/), open **Workers & Pages** → **Create** → switch to the **Pages** tab → **Connect to Git**.
3. Authorize Cloudflare to read your GitHub account (you can limit it to this one repository), then select your fork.
4. Fill in the settings:

   | Field | Value |
   |---|---|
   | Project name | Your choice. The address becomes `project-name.pages.dev` |
   | Production branch | `main` |
   | Framework preset | `None` |
   | Build command | leave empty |
   | Build output directory | leave empty (the repository root) |

5. Click **Save and Deploy**. After about a minute `https://project-name.pages.dev/` is live.

From then on, every new commit on `main` in your repository is deployed automatically.

**Without GitHub:** in step 2 choose **Upload assets** instead, name the project, and drag the unpacked folder in. To update, upload again.

The `_headers` file in the repository is read by Cloudflare Pages: it serves the licence text (`LICENSE`) as plain text, stops the site's address from being sent to other sites as a referrer, and adds security settings: other sites cannot embed this page in theirs, and the page only loads code from its own address. Leave it as it is.

## GitHub Pages

1. Fork this repository.
2. In your fork open **Settings** → **Pages** in the left column.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**; set **Branch** to `main` and the folder to `/ (root)`; click **Save**.
4. After a minute or two the address appears at the top of the same page: `https://your-account.github.io/repository-name/`.

Notes:

- The `.nojekyll` file tells GitHub to serve the files as they are. Do not delete it.
- On GitHub Pages the full licence text link in the About sheet may download the file instead of showing it. This does not affect the app.
- All sites under `your-account.github.io` share one browser storage area. Two copies of this app under the same account will read the same drawing library.

## Netlify

**From GitHub:** sign in to [Netlify](https://app.netlify.com/) → **Add new site** → **Import an existing project** → choose GitHub and your fork → leave **Build command** empty and set **Publish directory** to `.` (or leave it empty) → **Deploy**.

**Drag and drop:** open <https://app.netlify.com/drop> and drag the unpacked folder in.

The `_headers` file works on Netlify as well.

## Vercel

Sign in to [Vercel](https://vercel.com/) → **Add New… → Project** → import your fork → set **Framework Preset** to **Other** and leave **Build Command** and **Output Directory** unset → **Deploy**.

Vercel's free (Hobby) plan is for personal, non-commercial use only. For a business, use a paid plan or another platform.

## Your own server

Copy every file in this folder to the web root and serve it with any static web server. Two examples follow.

**Caddy** (obtains an HTTPS certificate automatically):

```
headmap.example.com {
    root * /var/www/headmap
    file_server
}
```

**nginx:**

```nginx
server {
    listen 80;
    server_name headmap.example.com;
    root /var/www/headmap;
    index index.html;

    # File names carry no version hash: revalidate every time so updates show up at once
    add_header Cache-Control "no-cache";
    add_header Referrer-Policy "no-referrer";
    # Security settings, the same as in _headers
    add_header X-Content-Type-Options "nosniff";
    add_header X-Frame-Options "DENY";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

    location = /LICENSE { default_type text/plain; }
    # If you deploy with git clone, do not serve the .git folder
    location ~ /\.git { deny all; }
}
```

Notes:

- **Turn on HTTPS.** "Add to Home Screen" and the phone's share / save-to-photos sheet do not work on addresses without HTTPS (`localhost` is the exception).
- **Do not set long cache lifetimes on `index.html`, `style.css` or `src/`.** These file names carry no version hash, so a long cache keeps users on an old version.
- On your own server, add the security settings from `_headers` yourself (the nginx example above already has them).
- `.js` files must be served with a JavaScript type (`text/javascript` or `application/javascript`); web servers do this by default. Unknown types for `.glb` and `.webmanifest` are fine.
- `server.mjs` is a small server for local preview. For a public site use one of the platforms above or a regular web server. To let phones on the same Wi-Fi try it for a moment, run `node server.mjs --lan`.

## Check after going live

1. Open the address and wait for 「載入頭模…」 (loading the head model) to disappear.
2. Tap **＋** in the top right → **3D 頭模** (3D head): the head appears, and dragging inside the hair area draws a line.
3. Go back to the home screen and add a **2D 五視圖** (2D five views) drawing: the line art of the five views appears.
4. Reload the page: both drawings are still there.
5. Home screen **⋯ → 關於與授權** (About and licences): the source code link is correct (see the next section).

## Make it your own

Everything works without changing anything. If you do customize, these are the usual places:

| File | What to change |
|---|---|
| `og:url` and `og:image` near the top of `index.html` | Your address. This is the preview shown when the link is pasted into LINE, Facebook and similar apps |
| `<title>` and `description` in `index.html` | The page name and its one-line description |
| The source code link in the 「關於與授權」 sheet in `index.html` | **Required if you changed the code:** point it to your public source (see [Licence](#licence-agpl-30)) |
| `manifest.webmanifest` | The name (`name`, `short_name`) and colours used when added to the home screen |
| `icons/` | Three icons: 192×192, 512×512 and 180×180 (`apple-touch-icon.png`) |
| `assets/heads/heads.json` | `default` = the head model used for new 3D drawings; `default2d` = the head model used for 2D |
| `Content-Security-Policy` in `_headers` | If your changes load anything from another address (fonts, analytics and so on), add that address here or the browser will block it. Change the same line in `server.mjs` too |

After changing a head model's landmark data (`assets/heads/*.json`), run `node tools/build-transfer.mjs` to regenerate the reference points used when switching head models.

Check your changes locally first: `node server.mjs`, open <http://127.0.0.1:8080/>, and run `npm test`.

## Licence (AGPL-3.0)

The code is licensed under [AGPL-3.0](../LICENSE). In plain words:

- You **may** use, modify and host it free of charge, including for business.
- **Unmodified deployment:** keep the original source code link in the 「關於與授權」 sheet and you are done.
- **Modified and offered to others over a network:** you must let your users get the source code of your version, under AGPL-3.0 as well. The simplest way is to make your fork public and point the source code link in 「關於與授權」 to it.
- **Keep** the `LICENSE` file, the copyright notices and the third-party licence files (`assets/heads/licenses/` and the `LICENSE` file in each `vendor/` folder).

This is a summary to help understanding, not legal advice; where it differs from the full text in `LICENSE`, the full text governs.

## Updating

- **Forks:** on your repository's front page click **Sync fork → Update branch**. Cloudflare Pages, GitHub Pages, Netlify and Vercel redeploy automatically. If you edited the same file yourself, GitHub will ask you to resolve the conflict first.
- **Uploaded files:** download the ZIP again and upload it again.
- **Your own server:** run `git pull` in the site folder, or copy the files again.

Updating does not touch users' drawings (they live in each user's browser).

## Changing the address

The drawing library is stored per address. To a browser each of these is a different address, and the app opens with an empty library after the change:

- moving from `project-name.pages.dev` to your own domain
- switching from `http://` to `https://`
- changing the subdomain or the port

Before the change, ask users to open the home screen at the old address and choose **⋯ → 匯出全部頭圖** (export all drawings), then choose **匯入 JSON** (import JSON) in the same menu at the new address. If you can, settle on the address before promoting the site.

## Troubleshooting

**The page stays on 「載入頭模…」, or shows 「頭模清單讀不到」 (cannot read the head model list)**
The files in `assets/heads/` were not uploaded completely (the four `.glb` files total about 6 MB), or `index.html` was opened directly in the browser. The page has to be opened through a web server (`http://` or `https://`); `file://` does not work.

**Blank page**
Press F12 and read the console. An error about the MIME type of a module means the server is not sending `.js` files as JavaScript. An error about import maps means the browser is too old (Chrome / Edge 89, Safari 16.4 or Firefox 108 and later are required).

**I updated the site but still see the old version**
The server or CDN cache has not expired. Force a reload first (Ctrl+Shift+R); on your own server check the cache settings (see [Your own server](#your-own-server)).

**Drawings disappeared on an iPhone or iPad**
For sites that were not added to the Home Screen, Safari deletes stored data after seven days of browser use without a visit. Ask users to add the site to the Home Screen through the share menu, and to export important drawings regularly.

**The full licence text link downloads a file**
The server does not know that `LICENSE` (no file extension) is text. Cloudflare Pages and Netlify are already handled by `_headers`; on other hosts configure it yourself or leave it.

**Can I see what users draw?**
No. The app has no backend. Drawings exist only in each person's own browser unless they export a file and send it to you.
