# Complete Setup Guide — World-Class 3D Portfolio

> This guide takes you from zero to a live, fully functional portfolio in about 30–45 minutes.
> Everything is **100% free** — no credit card required anywhere.

---

## Prerequisites

| Tool | Purpose | Install |
|------|---------|---------|
| Node.js 18+ | Runtime | https://nodejs.org |
| pnpm | Package manager | `npm install -g pnpm` |
| Git | Version control | https://git-scm.com |
| Vercel CLI | Deployment | `npm install -g vercel` |
| A GitHub account | Repo + free CRON | https://github.com |
| Telegram app | Notifications | App Store / Play Store |
| Discord account | Notifications | https://discord.com |
| Outlook email | Notifications | Already have it ✓ |
| A Google account | Google Sheets | https://accounts.google.com |

---

## Step 1 — Clone and Install

```bash
# Clone your repo (after pushing to GitHub)
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Install dependencies with pnpm
pnpm install
```

---

## Step 2 — Customize Your Content (JSON Files)

All content is in the `/data/` folder. Edit these files to make it yours:

### `data/profile.json`
```json
{
  "name": "Your Name",
  "title": "Your Title",
  "taglines": ["Full Stack Developer", "UI Craftsman", ...],
  "bio": "Your full bio...",
  "email": "your@outlook.com",
  "socials": {
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourusername"
  }
}
```

### `data/projects.json`
- Add each project as an object in the array
- Set `"featured": true` to show in the carousel
- Add project images to `/public/images/projects/`

### `data/skills.json`
- Update skills under each category
- Adjust `level` (0–100) for the skill bars

### `data/experience.json`
- Add your work history in reverse chronological order

### `data/certifications.json`
- Add your certs with name, issuer, year
- Add badge images to `/public/images/certs/`

### `data/services.json`
- Update pricing, descriptions, and features for each service

---

## Step 3 — Set Up Google Sheets (Free, No Credit Card)

This stores every project order someone submits through your portfolio.

### 3a. Create the Google Sheet
1. Go to https://sheets.google.com and create a **new spreadsheet**
2. Name it "Portfolio Orders"
3. In **Row 1**, add these headers exactly:
   ```
   Timestamp | Name | Email | Service | Budget | Description | Status
   ```

### 3b. Create the Apps Script Webhook
1. In your Google Sheet: **Extensions → Apps Script**
2. Delete any existing code and paste this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.name || '',
      data.email || '',
      data.service || '',
      data.budget || '',
      data.description || '',
      'New'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: GET endpoint to fetch orders for daily digest
function doGet(e) {
  const params = e.parameter;
  if (params.action === 'getOrders') {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    const orders = rows.slice(1).map(row => {
      return {
        timestamp: row[0],
        name: row[1],
        email: row[2],
        service: row[3],
        budget: row[4],
        description: row[5],
        status: row[6]
      };
    }).filter(o => o.status === 'New');

    return ContentService
      .createTextOutput(JSON.stringify({ orders }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** (Ctrl+S)
4. Click **Deploy → New Deployment**
5. Click the gear icon ⚙ next to "Type" and select **Web App**
6. Set:
   - **Execute as**: Me (your Google account)
   - **Who has access**: Anyone
7. Click **Deploy**
8. **Authorize** the app when prompted (it needs to access your Sheet)
9. **Copy the deployment URL** — it looks like:
   `https://script.google.com/macros/s/AKfycby.../exec`
10. This is your `GOOGLE_APPS_SCRIPT_URL` ✓

---

## Step 4 — Set Up Telegram Bot (Free, Instant Notifications)

### 4a. Create the bot
1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Choose a name: e.g., "Portfolio Notifications"
4. Choose a username: e.g., `yourname_portfolio_bot`
5. BotFather gives you a **token**: `1234567890:ABC-xyz...`
   → This is your `TELEGRAM_BOT_TOKEN` ✓

### 4b. Get your Chat ID
1. Send any message to your new bot (search by username, say "hello")
2. Visit this URL in your browser (replace YOUR_TOKEN):
   `https://api.telegram.org/bot{YOUR_TOKEN}/getUpdates`
3. Look for `"chat":{"id": 123456789}` in the response
   → This number is your `TELEGRAM_CHAT_ID` ✓

---

## Step 5 — Set Up Discord Webhook (Free)

1. Open Discord and create a **new private server** (or use existing)
2. Create a channel called `#portfolio-orders`
3. Right-click the channel → **Edit Channel**
4. Go to **Integrations → Webhooks → New Webhook**
5. Give it a name: "Portfolio Bot"
6. Click **Copy Webhook URL**
   → This is your `DISCORD_WEBHOOK_URL` ✓

---

## Step 6 — Outlook SMTP Notes

Your Outlook email is used to send notification emails to yourself.

- **Host**: `smtp.office365.com`
- **Port**: `587`
- **Username**: Your full Outlook email
- **Password**: Your Outlook password

> **Note**: If you have 2-Factor Authentication enabled on Outlook, you may need to create an **App Password**:
> Outlook Settings → Security → Advanced Security → App passwords → Create

- **Email**: `your@outlook.com` → `OUTLOOK_EMAIL` ✓
- **Password**: your password or app password → `OUTLOOK_PASSWORD` ✓

---

## Step 7 — Generate CRON Secret

Run this in your terminal to generate a secure random secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output → this is your `CRON_SECRET` ✓

---

## Step 8 — Create .env.local

In the project root, create `.env.local` (this is gitignored):

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in all 7 values from Steps 3–7.

---

## Step 9 — Test Locally

```bash
pnpm dev
```

Open http://localhost:3000

**Test the contact form:**
1. Go to the Contact section
2. Fill out the form and submit
3. Check your Google Sheet — a new row should appear
4. Check Telegram — you should get a message
5. Check Discord — you should see a notification
6. Check your Outlook inbox

---

## Step 10 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial portfolio build"
git branch -M main
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

> ⚠️ **Never commit .env.local** — it's in .gitignore ✓

---

## Step 11 — Deploy to Vercel (Free, No Credit Card)

```bash
vercel login
# Choose: Continue with GitHub (no credit card needed)

vercel
# Follow prompts — it auto-detects Next.js
```

Or deploy via Vercel Dashboard:
1. Go to https://vercel.com → Sign up with GitHub (free)
2. Click **Add New → Project**
3. Import your GitHub repo
4. Click **Deploy**

### Add Environment Variables in Vercel Dashboard
1. Go to your project → **Settings → Environment Variables**
2. Add all 7 variables from your `.env.local`:
   - `GOOGLE_APPS_SCRIPT_URL`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `DISCORD_WEBHOOK_URL`
   - `OUTLOOK_EMAIL`
   - `OUTLOOK_PASSWORD`
   - `CRON_SECRET`
3. Set all to **Production + Preview + Development**
4. **Redeploy** after adding env vars

Your live URL will be: `https://your-project.vercel.app`

---

## Step 12 — Set Up GitHub Actions CRON

The daily 9 PM IST digest runs via GitHub Actions (unlimited free on public repos).

### Add GitHub Secrets
1. Go to your GitHub repo → **Settings → Secrets and variables → Actions**
2. Click **New repository secret** and add:

| Secret Name | Value |
|------------|-------|
| `PORTFOLIO_URL` | `https://your-project.vercel.app` |
| `CRON_SECRET` | Same value as your `CRON_SECRET` env var |

### Test the CRON
1. Go to **GitHub → Actions tab**
2. Click **"Daily Order Digest"**
3. Click **"Run workflow"** → **"Run workflow"**
4. Watch it run — check Telegram/Discord/Email for the digest

From now on, it runs automatically every day at **9:00 PM IST**.

---

## Step 13 — Update Your Portfolio Content

To update content at any time:
1. Edit the relevant JSON file in `/data/`
2. `git add . && git commit -m "update: ..." && git push`
3. Vercel auto-deploys in ~30 seconds

**No restarts, no rebuilds needed — just edit JSON and push.**

---

## Troubleshooting

### Form submissions not showing in Sheets
- Check that the Apps Script is deployed as "Anyone can access"
- Re-deploy the Apps Script after making any code changes
- Check Vercel function logs: Vercel Dashboard → Project → Functions

### Telegram not receiving messages
- Verify `TELEGRAM_BOT_TOKEN` has no spaces
- Make sure you sent at least one message to the bot first
- Re-check `TELEGRAM_CHAT_ID` via the getUpdates URL

### Outlook email failing
- Check for typos in email/password
- If 2FA is enabled, use an App Password instead
- Some Outlook accounts block SMTP — try logging in and unlocking SMTP access

### 3D not showing on mobile
- The site auto-reduces quality (`AdaptiveDpr`) on low-end devices
- 3D requires WebGL — works on all modern browsers
- On very old phones, the particle count reduces automatically

### Build failing
```bash
pnpm build
# Check the error output
```

---

## Cost Summary

| Service | Free Tier | Credit Card? |
|---------|-----------|-------------|
| Vercel Hobby | 100GB bandwidth, unlimited deploys | ❌ Never |
| Google Apps Script | Unlimited | ❌ Never |
| Telegram Bot API | Unlimited messages | ❌ Never |
| Discord Webhooks | Unlimited | ❌ Never |
| Outlook SMTP | ~300 emails/day | ❌ Never |
| GitHub Actions | Unlimited (public repo) | ❌ Never |
| **Monthly Total** | **$0.00** | **Never** |
