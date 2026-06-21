# StrataDesk AI — Setup Instructions

## What's in this folder
- `index.html` — the landing page + AGM minutes tool
- `api/generate-minutes.js` — the secure backend function that calls Claude (keeps your API key hidden)
- `vercel.json` — config so Vercel runs the function correctly

## How to deploy (today)

### 1. Get an Anthropic API key
- Go to console.anthropic.com
- Sign up / log in
- Go to "API Keys" → "Create Key"
- Copy it somewhere safe (you'll need it in step 4)
- Note: you'll need to add a small amount of credit ($5-10 is plenty to start) under "Billing"

### 2. Push this folder to GitHub
- Go to github.com → New repository → name it `stratadesk-site` → make it Public
- Upload all the files in this folder (drag and drop on the GitHub web page works fine)

### 3. Deploy on Vercel
- Go to vercel.com → sign up with your GitHub account
- Click "Add New Project" → select your `stratadesk-site` repo → Deploy
- It'll give you a live URL like `stratadesk-site.vercel.app`

### 4. Add your API key to Vercel (important — do this or the tool won't work)
- In your Vercel project, go to Settings → Environment Variables
- Add a new variable:
  - Name: `ANTHROPIC_API_KEY`
  - Value: (paste the key from step 1)
- Click Save
- Go to the "Deployments" tab and click "Redeploy" on the latest deployment so it picks up the new key

### 5. Connect your domain
- In Vercel: Settings → Domains → add `stratadeskai.com.au`
- Vercel will show you DNS records (usually an A record and a CNAME)
- Log into VentraIP → find your domain → DNS settings → add those exact records
- Takes a few minutes to a few hours to go live

## Testing it
Once deployed, paste some rough meeting notes into the tool on your live site and click
"Generate draft minutes." If it doesn't work, the most common cause is the API key
environment variable not being set, or not redeploying after adding it.
