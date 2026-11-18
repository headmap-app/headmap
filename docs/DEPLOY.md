# 部署說明

**繁體中文** | [English](DEPLOY.en.md)

這份說明教你把「頭圖 3D」架成自己的網站。不用會寫程式，照步驟按就可以。

## 先知道三件事

1. **它是純靜態網頁。** 沒有後台、沒有資料庫、沒有建置步驟，也沒有要安裝的套件。把這個資料夾的檔案原封不動放到任何能放網頁的地方，就上線了。
2. **使用者畫的圖只存在他自己的瀏覽器裡。** 你的主機不會收到任何人的圖，也不用準備儲存空間。
3. **資料跟著網址走。** 同一個人在 `a.example.com` 畫的圖，到 `b.example.com` 看不到。所以正式給人用之前，先把網址定下來（見[換網址](#換網址)）。

整個網站約 9 MB，其中四顆頭模約 6 MB。

## 選一個平台

| 平台 | 費用 | 適合 | 要不要 GitHub 帳號 |
|---|---|---|---|
| [Cloudflare Pages](#cloudflare-pages) | 免費 | 大多數人；線上版就是用這個 | 要（也可以直接上傳檔案，不用） |
| [GitHub Pages](#github-pages) | 免費 | 已經在用 GitHub 的人 | 要 |
| [Netlify](#netlify) | 免費方案 | 想用拖放上傳的人 | 不一定 |
| [Vercel](#vercel) | 免費方案限個人、非商業用途 | 已經在用 Vercel 的人 | 要 |
| [自己的主機](#自己的主機) | 看主機 | 有自己的伺服器或網域 | 不用 |

前四個平台都給免費的 HTTPS 網址。平台的介面偶爾會改版，按鈕名稱和下面寫的有點出入時，找意思相近的那一個。

## 取得程式碼

- **Fork（建議）**：在 <https://github.com/headmap-app/headmap> 按右上角的 **Fork**，程式碼就複製一份到你的帳號。之後要跟上新版只要按一個鈕（見[更新到新版](#更新到新版)）。
- **下載 ZIP**：同一頁按 **Code → Download ZIP**，解壓縮。適合不想用 GitHub、要直接上傳檔案的人。

## Cloudflare Pages

1. 先 Fork 這個 repo。
2. 登入 [Cloudflare](https://dash.cloudflare.com/)，左邊選 **Workers & Pages** → **Create（建立）** → 切到 **Pages** 分頁 → **Connect to Git（連接 Git）**。
3. 照畫面授權 Cloudflare 讀你的 GitHub（可以只開放這一個 repo），然後選你 Fork 的 repo。
4. 設定填這樣：

   | 欄位 | 填什麼 |
   |---|---|
   | Project name（專案名稱） | 自己取。網址會是 `專案名稱.pages.dev` |
   | Production branch（正式分支） | `main` |
   | Framework preset（架構） | `None`（無） |
   | Build command（建置指令） | 留空 |
   | Build output directory（輸出目錄） | 留空（就是根目錄） |

5. 按 **Save and Deploy（儲存並部署）**。大約一分鐘後，`https://專案名稱.pages.dev/` 就能開了。

之後每次你的 repo 的 `main` 有新的提交，Cloudflare 會自動重新部署。

**不用 GitHub 的做法**：步驟 2 改選 **Upload assets（上傳檔案）**，取專案名稱，把解壓縮後的整個資料夾拖進去。之後要更新就再上傳一次。

repo 裡的 `_headers` 是給 Cloudflare Pages 看的：讓授權全文（`LICENSE`）用文字顯示、不把來源網址帶給別的網站，也加了安全設定：不讓別的網站把這個網頁嵌進他們的頁面，網頁也只准載入自己網址上的程式。不用改。

## GitHub Pages

1. 先 Fork 這個 repo。
2. 到你 Fork 的 repo → **Settings** → 左邊的 **Pages**。
3. **Build and deployment** 底下，**Source** 選 **Deploy from a branch**；**Branch** 選 `main`、資料夾選 `/ (root)`，按 **Save**。
4. 等一兩分鐘，同一頁上方會出現網址：`https://你的帳號.github.io/repo名稱/`。

注意：

- repo 裡的 `.nojekyll` 是告訴 GitHub「檔案原樣送出、不要另外處理」，不要刪。
- 「關於」裡的「授權全文」在 GitHub Pages 上可能變成下載檔案而不是直接顯示，不影響使用。
- `你的帳號.github.io` 底下的每個網站共用同一份瀏覽器儲存空間。同一個帳號底下放兩份這個網頁，它們會讀到同一個頭圖庫。

## Netlify

**連 GitHub**：登入 [Netlify](https://app.netlify.com/) → **Add new site** → **Import an existing project** → 選 GitHub 和你 Fork 的 repo → **Build command** 留空、**Publish directory** 填 `.`（或留空）→ **Deploy**。

**拖放上傳**：打開 <https://app.netlify.com/drop>，把解壓縮後的整個資料夾拖進去。

`_headers` 在 Netlify 上也有效。

## Vercel

登入 [Vercel](https://vercel.com/) → **Add New… → Project** → 匯入你 Fork 的 repo → **Framework Preset** 選 **Other**，**Build Command** 和 **Output Directory** 都不要填 → **Deploy**。

Vercel 的免費方案（Hobby）只給個人、非商業用途。要拿來做生意，請用付費方案或換別的平台。

## 自己的主機

把這個資料夾的所有檔案放到網站的根目錄，用任何靜態網頁伺服器送出去就可以。下面是兩個例子。

**Caddy**（自動申請 HTTPS 憑證）：

```
headmap.example.com {
    root * /var/www/headmap
    file_server
}
```

**nginx**：

```nginx
server {
    listen 80;
    server_name headmap.example.com;
    root /var/www/headmap;
    index index.html;

    # 檔名沒有版本號：每次都向伺服器確認有沒有新版，更新才會馬上生效
    add_header Cache-Control "no-cache";
    add_header Referrer-Policy "no-referrer";
    # 安全設定，與 _headers 相同
    add_header X-Content-Type-Options "nosniff";
    add_header X-Frame-Options "DENY";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

    location = /LICENSE { default_type text/plain; }
    # 用 git clone 放檔案的話，別把 .git 送出去
    location ~ /\.git { deny all; }
}
```

注意：

- **請開 HTTPS。** 「加入主畫面」和手機的「分享／存到相簿」在沒有 HTTPS 的網址上不能用（`localhost` 例外）。
- **不要對 `index.html`、`style.css`、`src/` 設很長的快取時間。** 這些檔名沒有版本號，快取太久，使用者會一直看到舊版。
- `_headers` 裡的安全設定在自己的主機上要自己加（上面的 nginx 範例已經加好了）。
- `.js` 檔要用 JavaScript 的型別送（`text/javascript` 或 `application/javascript`），一般伺服器預設就是。`.glb`、`.webmanifest` 的型別不認得也沒關係。
- `server.mjs` 是給本機預覽用的小伺服器，正式上線請用上面的平台或一般的網頁伺服器。只想臨時給同一個 Wi-Fi 的手機試，可以用 `node server.mjs --lan`。

## 上線後檢查

1. 打開網址，等「載入頭模…」消失。
2. 按右上角的 **＋** → **3D 頭模**：看得到頭，在頭髮的範圍裡拖一下畫得出線。
3. 回首頁，再新增一張 **2D 五視圖**：看得到五個視圖的線稿。
4. 重新整理網頁：剛剛的兩張頭圖還在。
5. 首頁右上角 **⋯ → 關於與授權**：原始碼連結是對的（見下一節）。

## 改成你自己的版本

都不改也能用。要改的話，常改的是這幾個地方：

| 檔案 | 改什麼 |
|---|---|
| `index.html` 開頭的 `og:url`、`og:image` | 換成你的網址。這是把網址貼到 LINE、Facebook 時出現的預覽 |
| `index.html` 的 `<title>`、`description` | 網頁名稱與一句話說明 |
| `index.html`「關於與授權」裡的原始碼連結 | **有改程式的話必改**，指到你公開的原始碼（見[授權](#授權agpl-30)） |
| `manifest.webmanifest` | 加到主畫面時的名稱（`name`、`short_name`）與顏色 |
| `icons/` | 三張圖示：192×192、512×512、180×180（`apple-touch-icon.png`） |
| `assets/heads/heads.json` | `default`＝3D 新增時用哪顆頭模；`default2d`＝2D 用哪顆 |
| `_headers` 的 `Content-Security-Policy` | 改程式要從別的網址載入東西（字型、統計工具等）時，把那個網址加進去，不然瀏覽器會擋掉。`server.mjs` 裡的同一行也一起改 |

改過頭模的點位資料（`assets/heads/*.json`）之後，要重跑 `node tools/build-transfer.mjs`，重新產生換頭模用的對照點。

改完先在自己的電腦上看：`node server.mjs`，打開 <http://127.0.0.1:8080/>；再跑一次 `npm test`。

## 授權（AGPL-3.0）

程式碼用 [AGPL-3.0](../LICENSE) 授權。白話說：

- **可以**免費使用、修改、架站，也可以用在生意上。
- **原樣部署**（沒改程式）：保留「關於與授權」裡原本的原始碼連結就可以了。
- **改過程式又放上網給別人用**：必須讓使用者拿得到你那一版的原始碼，而且同樣用 AGPL-3.0 授權。最簡單的做法：把你的 Fork 設成公開，並把「關於與授權」裡的原始碼連結改成你的 repo。
- **要保留**：`LICENSE`、版權聲明，以及第三方的授權檔（`assets/heads/licenses/`、`vendor/` 各資料夾裡的 `LICENSE`）。

以上是幫助理解的摘要，不是法律意見；有出入時以 `LICENSE` 全文為準。

## 更新到新版

- **Fork 的**：到你的 repo 首頁按 **Sync fork → Update branch**。Cloudflare Pages、GitHub Pages、Netlify、Vercel 都會自動重新部署。自己改過同一個檔案的話，GitHub 會請你先處理衝突。
- **上傳檔案的**：重新下載 ZIP，再上傳一次。
- **自己的主機**：在網站資料夾裡 `git pull`，或重新複製檔案。

更新不會動到使用者的圖（圖存在他們各自的瀏覽器裡）。

## 換網址

頭圖庫是跟著網址存的。這些情況對瀏覽器來說都是「不同的網址」，換過去會是一個空的頭圖庫：

- 從 `專案名稱.pages.dev` 換成自己的網域
- `http://` 換成 `https://`
- 換子網域或埠號

換之前，請使用者在舊網址的首頁按 **⋯ → 匯出全部頭圖**，到新網址的同一個選單按 **匯入 JSON**。可以的話，在正式推廣之前就把網址定好。

## 常見問題

**畫面一直停在「載入頭模…」，或顯示「頭模清單讀不到」**
`assets/heads/` 裡的檔案沒有傳完整（四個 `.glb` 加起來約 6 MB），或是直接用瀏覽器打開了 `index.html`。這個網頁一定要透過網頁伺服器（`http://` 或 `https://`）開，`file://` 不行。

**整頁空白**
按 F12 看主控台。如果寫著模組的 MIME type 不對，是伺服器沒有把 `.js` 當成 JavaScript 送；如果寫著 import map 相關的錯誤，是瀏覽器太舊（需要 Chrome／Edge 89、Safari 16.4、Firefox 108 以上）。

**更新了，但看到的還是舊版**
伺服器或 CDN 的快取還沒過期。先強制重新整理（Ctrl+Shift+R）；自己的主機請檢查快取設定（見[自己的主機](#自己的主機)）。

**iPhone、iPad 上畫的圖不見了**
Safari 對沒有「加入主畫面」的網站，連續 7 天的使用中沒有打開過，會清掉它存的資料。請使用者用分享選單「加入主畫面」再用，重要的圖定期匯出。

**點「授權全文」變成下載檔案**
伺服器不知道 `LICENSE`（沒有副檔名）是文字檔。Cloudflare Pages 和 Netlify 已經用 `_headers` 處理；其他主機可以自己設定，或不理它。

**可以看到使用者畫了什麼嗎？**
不行。這個網頁沒有後台，圖只存在每個人自己的瀏覽器裡，除非對方把檔案匯出來傳給你。
