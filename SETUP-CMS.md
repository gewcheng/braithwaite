# Braithwaite website — CMS setup (Google Sheets, no third-party service)

Your client can edit the site’s copy by updating a **Google Sheet**. The site reads the sheet directly (as CSV) on every page load, so changes appear the next time someone visits — no third-party connector, no trial period, no account to pay for.

*(This project previously used sheet.best to bridge the sheet to the site. That service's free trial expired and stopped working, so it's been removed — the site now reads the Google Sheet's own CSV export directly.)*

---

## 1. Create the Google Sheet

1. Create a new Google Sheet (or use the existing one at Hunter's content sheet URL).
2. **First row (headers):** Column **A**: `key` | Column **B**: `value`
3. From row 2 onward, add one row per content item using the keys in the table below.

### Content keys reference

| Key | Where it appears | Notes |
|-----|------------------|--------|
| `hero_headline` | Main headline (About) | One line |
| `hero_copy_p1` | First paragraph under headline | Plain text |
| `hero_copy_p2` | Second paragraph under headline | Plain text |
| `service_1_title` | First service heading | e.g. "Strategic Communications" |
| `service_1_body` | First service description | Plain text |
| `service_2_title` | Second service heading | e.g. "Partnership & Programming Development" |
| `service_2_body` | Second service description | Plain text |
| `service_3_title` | Third service heading | e.g. "Individual Advising" |
| `service_3_body` | Third service description | Plain text |
| `experience_bio_1` | First bio paragraph (Experience) | Simple HTML allowed (e.g. `<i>Artforum</i>`) |
| `experience_bio_2` | Second bio paragraph | Plain text |
| `experience_clients_heading` | Heading above client lists | e.g. "Select clients" |
| `experience_clients` | Left column: client list | **One line per item:** `Label\|URL`; line without `\|` = text only |
| `experience_clients_right` | Right column: client list | Same format as above |
| `connect_inquiries_heading` | Footer "INQUIRIES" heading | e.g. "INQUIRIES" |
| `connect_email` | Contact email (link text and mailto) | e.g. `hello@braithwaite.llc` |
| `connect_newsletter_heading` | Mailing list heading | e.g. "JOIN THE MAILING LIST" |
| `footer_tagline` | Footer tagline | e.g. "Strategic Communications" |
| `footer_copyright` | Copyright line | e.g. "© Braithwaite LLC 2026" |

**Note:** the sheet may still have `footer_linkedin_url`, `footer_substack_url`, and `footer_instagram_url` rows left over from an earlier version — these are no longer read by the site. The social links in the footer are hardcoded directly in `index.html` (search for `footer-links`). To change them, edit the `href` values there.

**List format (clients / writing):**  
In the **value** cell, put one link per line, each as `Label|URL`:

```
Ford Foundation|https://www.fordfoundation.org
Mellon Foundation|https://www.mellon.org
Knight Foundation|https://knightfoundation.org
```

A line with no `|` is shown as plain text in the list (no link) (e.g. “+ Municipal and cultural departments…”).

---

## 2. Make the sheet readable by the site

1. In Google Sheets: **Share** the sheet → set to **“Anyone with the link” can view**. This is required so the site can read it — no Google sign-in is needed to read it this way.
2. Get the sheet's ID from its URL: `https://docs.google.com/spreadsheets/d/THIS_LONG_ID/edit`
3. The CSV URL the site needs is:
   `https://docs.google.com/spreadsheets/d/THIS_LONG_ID/export?format=csv`

---

## 3. Add the URL to the website

1. Open **index.html** in the site’s root folder.
2. Find the `<body>` tag at the top. It has an attribute:  
   `data-cms-sheet-url=""`
3. Paste the CSV URL from step 2 between the quotes:  
   `data-cms-sheet-url="https://docs.google.com/spreadsheets/d/THIS_LONG_ID/export?format=csv"`
4. Save and deploy the site as usual.

---

## 4. How updates work

- The site loads copy from the sheet when someone visits the page.
- Your client edits the Google Sheet and saves; the next page load shows the new content.
- If the sheet URL is missing or the request fails, the site still shows the default text already in the HTML (the text currently in `index.html`) — so a broken connection never takes the site down, it just stops showing edits until it's fixed.

No code changes are needed for routine copy updates — only edit the sheet. `data-cms-sheet-url` in **index.html** only needs to change if you switch to a different Google Sheet entirely.
