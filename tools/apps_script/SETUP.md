# Backend Setup — 5 minutes

The voting app uses a Google Apps Script + Sheet as the backend. Cheap,
auditable, no infrastructure. Setup is one-time.

## What you do

1. Open Google Drive → New → Google Sheets. Name it
   **"AI Engineering Weekend Challenge — Ballots"** (or whatever you want).

2. Inside the sheet: **Extensions → Apps Script**. The script editor opens
   in a new tab.

3. Delete the default `function myFunction()`. Open
   [tools/apps_script/Code.gs](Code.gs) from this repo, copy the entire
   contents, and paste into the Apps Script editor.

4. **Set the admin token** — the script reads it from Script Properties
   instead of source so it's safe to push to GitHub.
   - In the Apps Script editor: gear icon (Project Settings) on the
     left sidebar → scroll to **Script Properties** → **Add script
     property** → name: `ADMIN_TOKEN`, value: any long random string
     (e.g. `aie-9f3a7c1e6b2d8045-tally`). Save.
   - You'll use this token to view the live tally URL.
   - Save the script with **File → Save** (Ctrl+S).

5. **Deploy → New Deployment**.
   - Click the gear icon, select **Web app**
   - Description: `AIE Ballot v1`
   - Execute as: **Me** (your account)
   - Who has access: **Anyone**
   - Click **Deploy**
   - Authorize when prompted (you'll see a "Google hasn't verified this
     app" warning — that's normal for personal Apps Scripts; click
     Advanced → Go to project → Allow)

6. Copy the **Web app URL** at the end (looks like
   `https://script.google.com/macros/s/AKfycb…/exec`).

7. Open [assets/js/config.js](../../assets/js/config.js) and paste the URL
   into `BALLOT_ENDPOINT`.

That's it. Reload the voting page. Ballots now go to your sheet.

## What you'll see in the sheet

A `Ballots` tab gets created on the first ballot, with columns:

```
timestamp | voter_email | voter_name | jose | ianjay | revo | jas | cathy | ralph | ciri | leo | ivan | john
```

Each row = one ballot. Each cell under a submitter slug = the chosen
idea_id (e.g. `jose-02`).

## How to read results

In the same browser, hit:

```
<your web app url>?action=tally&token=<your admin token>
```

JSON response with vote counts per idea per submitter. Use this for the
final winner reveal.

## If something goes wrong

- **Frontend can't reach the endpoint** — check the URL in
  `assets/js/config.js`. It must be the `/exec` URL, not the `/dev` URL.
- **CORS error in browser console** — Apps Script web apps allow
  cross-origin requests by default; make sure you deployed as **Anyone**,
  not "Anyone with Google account."
- **"Already voted" but you never voted** — clear localStorage in your
  browser AND check the Ballots sheet for your email. Delete that row if
  you want to allow re-voting (rare).
- **Duplicate submissions still slipping through** — the script uses
  `LockService` to prevent races, so this shouldn't happen. If it does,
  check the Apps Script execution log.

## Updating the script later

Apps Script web apps are versioned. After editing the code:

1. Save in the editor.
2. **Deploy → Manage deployments** → pencil icon → Version: **New
   version** → Deploy.
3. The URL stays the same — no frontend changes needed.

## How voting closes (and shows results)

Voting auto-closes when ANY of these is true (whichever hits first):

1. **Quorum** — `EXPECTED_VOTERS` (default 10) ballots have been cast
2. **24-hour window** — current time is past `STARTS_AT + WINDOW_HOURS`
   (default 24h). Set `STARTS_AT = ""` to disable the deadline trigger.
3. **Manual** — flip `FORCE_CLOSED = true` and redeploy a new version

### Starting the 24-hour countdown

`STARTS_AT` is stored in Script Properties — no source edit, no redeploy
needed once v3 is live. Two ways to start:

**Option A — one-click start URL (recommended).** When you announce the
challenge to the team, hit this in your browser:

```
https://<your-web-app-url>/exec?action=start&token=<ADMIN_TOKEN>
```

The script records `STARTS_AT = <now>` in Script Properties and returns
`{ success, startsAt, closesAt }` so you can confirm. Voting auto-closes
exactly 24 hours later.

If you've already started and want to reset (rare — usually only for
reschedules):
```
https://<your-web-app-url>/exec?action=start&token=<ADMIN_TOKEN>&force=1
```

To **clear** the start time (back to no-deadline mode):
```
https://<your-web-app-url>/exec?action=reset_start&token=<ADMIN_TOKEN>
```

**Option B — manual via Apps Script UI.** Project Settings → Script
Properties → add a property named `STARTS_AT` with the ISO timestamp:

```
2026-04-29T17:00:00+02:00
```

Save. Voting closes 24h after that moment.

You can leave `STARTS_AT` unset and just rely on quorum (10 ballots) — the
deadline is then optional.

When closed:
- The server rejects further ballot POSTs with "Voting has closed."
- The frontend redirects everyone to [results.html](../../results.html).
- The login page swaps the sign-in form for a "View results" CTA.
- The results page shows the winning idea per submitter, with vote counts.
  Ties are broken alphabetically by idea_id (deterministic; flagged in the UI).

To **re-open voting** (e.g. extend the deadline): set `FORCE_CLOSED = false`,
push the deadline forward, and redeploy a new version. Existing ballots stay;
new ones can come in.

To **see the live tally any time** (even before close), as admin:
```
<your web app url>?action=tally&token=<your admin token>
```

To **check status** any time (open / closed / count):
```
<your web app url>?action=status
```

## Redeploying after the v1 was already live

You already deployed v1. To pick up the new closure + results endpoints:

1. In the Apps Script editor: paste the latest [Code.gs](Code.gs)
   (overwrites whatever's in there).
2. **Set the admin token in Script Properties** (one-time, since v2 reads
   it from Properties instead of source) — gear icon on left sidebar →
   Script Properties → Add property → name: `ADMIN_TOKEN`, value: any
   random string. Save.
3. Save the script (Ctrl+S).
4. **Deploy → Manage deployments** → click the pencil on your existing
   deployment → Version: **New version** → description "AIE v2 closure +
   results" → **Deploy**.
5. URL stays the same — frontend already points at it.

## Local fallback

When `BALLOT_ENDPOINT` is empty in `config.js`, the app silently falls
back to localStorage (the original behavior). Useful for local dev. Set
the URL to enable the real backend.
