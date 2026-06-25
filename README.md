# Personal Brand Guide Bot 

A guided chatbot that walks an artist through Lennon's **"Make Content That
Attracts Buyers"** exercise (9 questions), then builds them a finished
**Personal Brand Guide** — viewable on screen and downloadable as a PDF.
Powered by Claude via your own Anthropic API key.

---

## What's in this folder

| File | What it is |
|------|------------|
| `index.html` | The chat experience + the guide view + PDF download. This is the page your clients see. |
| `api/chat.js` | The secure backend. Holds your API key and talks to Claude. |
| `api/systemPrompt.js` | **The bot's brain** — its questions, coaching style, and how it builds the guide. Edit this to change wording. Plain English, no coding needed. |
| `package.json` | Basic project info. |

---

## How it works (the 30-second version)

1. A client opens the page and the bot greets them and asks question 1.
2. It walks them through all 9 questions, nudging gently when answers are thin.
3. When done, it assembles their mission statement and a full guide, including
   30 starter post ideas drawn from their own answers.
4. They read it on screen and download it as a PDF.

Your **API key lives only on the server** (`api/chat.js`), never in the
browser, so it can't be stolen by visitors.

---

## Deploy it in ~10 minutes (Vercel — free)

You don't need to be technical. Follow these steps.

### 1. Get your Anthropic API key
- Go to **console.anthropic.com** → sign in → **API Keys** → **Create Key**.
- Copy the key (starts with `sk-ant-...`). Keep it private.
- Add a little credit on the **Billing** page (even $5 goes a long way — see costs below).

### 2. Put this folder on GitHub (or upload to Vercel directly)
- Easiest path: create a free **github.com** account, make a new repository,
  and upload these files (keeping the `api/` folder structure intact).

### 3. Deploy on Vercel
- Go to **vercel.com** → sign in with GitHub → **Add New Project** → pick this repo → **Deploy**.
- Vercel automatically serves `index.html` and runs `api/chat.js` as a function. No config needed.

### 4. Add your API key as an environment variable
- In your Vercel project: **Settings → Environment Variables**.
- Add: name `ANTHROPIC_API_KEY`, value = your `sk-ant-...` key. Save.
- (Optional) Add `CLAUDE_MODEL` if you ever want a different model. Default is `claude-sonnet-4-6`.
- Click **Redeploy** so the key takes effect.

You now have a live URL like `https://your-project.vercel.app`. Open it and test it.

---

## Embed it in Kajabi

On any Kajabi page or lesson, add a **Custom Code** block and paste:

```html
<iframe
  src="https://your-project.vercel.app"
  style="width:100%; height:760px; border:none; border-radius:12px;"
  title="Build Your Personal Brand Guide">
</iframe>
```

Replace the URL with your real Vercel URL. That's it — the bot now lives inside
your Kajabi course or page.

---

## What it costs you

Clients don't pay or use "credits" — **you** pay Anthropic only for what's used,
billed per word processed (called *tokens*). This exercise is one focused
session, so it's cheap:

- A full run-through (9 questions + the generated guide) typically costs roughly
  **$0.05–$0.20 in API usage** on the default Sonnet model.
- So **100 clients ≈ $5–$20 total**. Hosting on Vercel's free tier is $0.
- Want it cheaper? Set `CLAUDE_MODEL` to a smaller/faster model. Want it sharper?
  Use a larger one. You control the trade-off.

Set a monthly spend limit in the Anthropic console if you want a hard cap.

---

## Changing how the bot talks

Open `api/systemPrompt.js`. Everything the bot says, asks, and how it builds the
guide is written there in plain English. Edit the words, save, redeploy. The
9 questions, coaching nudges, mission formula, and the example post ideas all
live in that one file.

---

## Note

This is your own self-hosted tool. Keep your API key private, and never paste it
into `index.html` or anywhere the browser can see it — it belongs only in the
Vercel environment variable.
