# Braithwaite — One-Page Website

A one-page site for Braithwaite (cultural relations consultancy), built from your Figma design. It includes a contact form that can send submissions to a Google Sheet.

---

## What’s in this project

- **index.html** — The single page (header, hero, services, about, contact form, footer).
- **css/styles.css** — All layout and styling (cream background, dark blue text, serif/sans typography).
- **js/scroll-spy.js** — Updates the sticky nav dot based on scroll position and click.
- **js/form-handler.js** — Handles the contact form and sends data to your Google Sheet (once you set the URL).
- **assets/** — SVGs (logos, menu dot, arrows).
- **images/** — Add **hunter-braithwaite.png** here for the About section headshot. If missing, a dark blue placeholder is shown.

---

## Viewing the site locally

1. Open the folder `braithwaite-website` in Cursor (or any editor).
2. Right-click **index.html** and choose **Open with Live Server** (if you use the Live Server extension), or double-click **index.html** to open it in your browser.

---

## Connecting the contact form to Google Sheets

The form is set up to send data to a **Google Apps Script** “web app” that appends a new row to a Google Sheet. You do this once in Google; then you paste the URL into your site.

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. In the first row, add headers: **Full name**, **Email**, **Affiliation**, **Location** (and optionally **Timestamp**).
3. Save the sheet and note its URL (you’ll use the Sheet’s ID in the script).

### Step 2: Add the script that writes to the Sheet

1. In the Sheet, go to **Extensions → Apps Script**.
2. Delete any sample code and paste this (replace `YOUR_SHEET_ID` with the ID from your Sheet URL; the ID is the long string between `/d/` and `/edit`):

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
  var params = e.parameter || {};
  var row = [
    params.fullname || '',
    params.email || '',
    params.affiliation || '',
    params.location || '',
    new Date()
  ];
  sheet.appendRow(row);
  return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
}
```

(The site sends the form as `application/x-www-form-urlencoded`, so `e.parameter` in Apps Script will contain `fullname`, `email`, `affiliation`, and `location`.)

3. Save the project (e.g. name it “Braithwaite Form”).
4. Click **Deploy → New deployment**. Choose type **Web app**.
5. Set **Execute as**: Me. Set **Who has access**: Anyone.
6. Click **Deploy**, then copy the **Web app URL** (it looks like `https://script.google.com/macros/s/.../exec`).

### Step 3: Put the URL in your website

1. Open **index.html** in Cursor.
2. Find the contact form line that looks like:
   ```html
   <form class="contact-form" id="contact-form" action="" method="POST">
   ```
3. Replace `action=""` with your web app URL, e.g.:
   ```html
   <form class="contact-form" id="contact-form" action="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec" method="POST">
   ```
4. Save the file.

Form submissions will now be appended as new rows in your Google Sheet.

---

## Optional: Add the headshot

Place Hunter Braithwaite’s photo in the **images** folder and name it **hunter-braithwaite.png**. The About section will display it automatically. If the file is missing, that area will show a dark blue block until you add the image.

---

## Changing colors or fonts

- **css/styles.css** starts with variables in `:root`:
  - `--color-cream` — page background.
  - `--color-navy` — text and accents.
  - `--font-serif` — logo and headlines (Cormorant Garamond).
  - `--font-sans` — body and UI (Inter).

Edit those to match any Figma updates.
