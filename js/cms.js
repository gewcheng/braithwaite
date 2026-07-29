/**
 * Simple CMS via a Google Sheet's CSV export: fetches copy and injects it
 * into elements with data-cms, data-cms-html, or data-cms-list attributes.
 *
 * Setup (one-time, in Google Sheets):
 *   Share → General access → "Anyone with the link" (Viewer).
 *   Then use this URL as data-cms-sheet-url on <body> (or CMS_SHEET_URL below):
 *   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv
 *
 * Sheet format: first row headers "key" and "value"; each row = one content key.
 * For data-cms-list keys, use "Label|URL" per line in the value cell.
 */
(function () {
  // Replace with your Google Sheets "publish to web" CSV URL after publishing
  var CMS_SHEET_URL = '';

  var body = document.body;
  var sheetUrl = (body && body.getAttribute('data-cms-sheet-url')) || CMS_SHEET_URL;

  function showCmsContent() {
    if (body) {
      body.classList.remove('cms-loading');
      body.classList.add('cms-ready');
    }
  }

  if (!sheetUrl) {
    console.info('CMS: No sheet URL configured. Using static content. Add data-cms-sheet-url to <body> or set CMS_SHEET_URL in js/cms.js.');
    showCmsContent();
    return;
  }

  fetch(sheetUrl)
    .then(function (res) {
      if (!res.ok) throw new Error('CMS sheet request failed: ' + res.status);
      return res.text();
    })
    .then(function (csvText) {
      var rows = parseCsv(csvText);
      if (!rows.length) {
        showCmsContent();
        return;
      }
      var header = rows[0].map(function (h) { return String(h).trim().toLowerCase(); });
      var keyIdx = header.indexOf('key');
      var valIdx = header.indexOf('value');
      if (keyIdx === -1 || valIdx === -1) {
        showCmsContent();
        return;
      }
      var map = {};
      for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var k = row[keyIdx];
        if (k) map[String(k).trim()] = row[valIdx];
      }
      applyContent(map);
      showCmsContent();
    })
    .catch(function (err) {
      console.warn('CMS: Could not load content from sheet.', err);
      showCmsContent();
    });

  // Minimal RFC 4180 CSV parser: handles quoted fields, embedded commas,
  // embedded newlines, and escaped ("") quotes.
  function parseCsv(text) {
    var rows = [];
    var row = [];
    var field = '';
    var inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(field);
        field = '';
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(field);
        field = '';
        if (row.length > 1 || row[0] !== '') rows.push(row);
        row = [];
      } else {
        field += c;
      }
    }
    if (field !== '' || row.length) {
      row.push(field);
      rows.push(row);
    }
    return rows;
  }

  function applyContent(map) {
    function get(key) {
      var v = map[key];
      return v == null ? '' : String(v).trim();
    }

    // data-cms="key" → textContent; for <a> with email-like value, also set href to mailto:value
    document.querySelectorAll('[data-cms]').forEach(function (el) {
      var key = el.getAttribute('data-cms');
      var val = get(key);
      if (!val) return;
      el.textContent = val;
      if (el.tagName === 'A' && val.indexOf('@') > 0 && !/\s/.test(val)) {
        el.href = 'mailto:' + val;
      }
    });

    // data-cms-href="key" → set element href; value = URL or "Label|URL" (URL after pipe)
    document.querySelectorAll('[data-cms-href]').forEach(function (el) {
      var key = el.getAttribute('data-cms-href');
      var val = get(key);
      if (!val) return;
      var parts = val.split('|').map(function (p) { return p.trim(); });
      var url = parts[1] || parts[0];
      if (url) el.href = url;
    });

    // data-cms-html="key" → innerHTML (use only for trusted sheet content)
    document.querySelectorAll('[data-cms-html]').forEach(function (el) {
      var key = el.getAttribute('data-cms-html');
      var val = get(key);
      if (val) el.innerHTML = val;
    });

    // data-cms-list="key" → fill container with <li><a> items; value = "Label|URL" per line
    document.querySelectorAll('[data-cms-list]').forEach(function (el) {
      var key = el.getAttribute('data-cms-list');
      var raw = get(key);
      if (!raw) return;
      var lines = raw.split(/\r?\n/).filter(Boolean);
      var html = '';
      lines.forEach(function (line) {
        var parts = line.split('|').map(function (p) { return p.trim(); });
        var label = parts[0] || '';
        var url = parts[1];
        if (url) {
          html += '<li><a href="' + escapeAttr(url) + '" target="_blank" rel="noopener">' + escapeHtml(label) + '</a></li>';
        } else {
          html += '<li>' + escapeHtml(label) + '</li>';
        }
      });
      if (html) el.innerHTML = html;
    });
  }

  function escapeAttr(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
