/**
 * Simple CMS via sheet.best: fetches copy from a Google Sheet and injects it
 * into elements with data-cms, data-cms-html, or data-cms-list attributes.
 *
 * Set your sheet.best connection URL in the config below (or via data attribute on body).
 * Sheet format: first row headers "key" and "value"; each row = one content key.
 * For data-cms-list keys, use "Label|URL" per line in the value cell.
 */
(function () {
  // Replace with your sheet.best Connection URL after connecting your Google Sheet
  var SHEET_BEST_URL = '';

  var body = document.body;
  var connectionUrl = (body && body.getAttribute('data-sheet-best-url')) || SHEET_BEST_URL;

  function showCmsContent() {
    if (body) {
      body.classList.remove('cms-loading');
      body.classList.add('cms-ready');
    }
  }

  if (!connectionUrl) {
    console.info('CMS: No sheet.best URL configured. Using static content. Add data-sheet-best-url to <body> or set SHEET_BEST_URL in js/cms.js.');
    showCmsContent();
    return;
  }

  fetch(connectionUrl)
    .then(function (res) { return res.json(); })
    .then(function (rows) {
      if (!Array.isArray(rows) || rows.length === 0) {
        showCmsContent();
        return;
      }
      var map = {};
      rows.forEach(function (row) {
        var k = row.key || row.Key;
        var v = row.value != null ? row.value : row.Value;
        if (k) map[String(k).trim()] = v;
      });
      applyContent(map);
      showCmsContent();
    })
    .catch(function (err) {
      console.warn('CMS: Could not load content from sheet.', err);
      showCmsContent();
    });

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

    // data-cms-href="key" → set element href (for links)
    document.querySelectorAll('[data-cms-href]').forEach(function (el) {
      var key = el.getAttribute('data-cms-href');
      var val = get(key);
      if (val) el.href = val;
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
