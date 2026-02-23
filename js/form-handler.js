/**
 * Contact form: submits to Google Sheets via a Google Apps Script web app URL.
 * Set your URL in the form's action in index.html, or replace SCRIPT_URL below.
 */

(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn = form.querySelector('.submit-btn');
    var originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    var action = form.getAttribute('action');

    if (!action) {
      alert('Form is not configured. Add your Google Apps Script web app URL to the form action in index.html. See README for steps.');
      btn.disabled = false;
      btn.textContent = originalText;
      return;
    }

    var params = new URLSearchParams();
    params.append('fullname', form.fullname.value);
    params.append('email', form.email.value);
    params.append('affiliation', form.affiliation.value);
    params.append('location', form.location.value);

    fetch(action, {
      method: 'POST',
      body: params,
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then(function () {
        btn.textContent = 'Sent';
        form.reset();
        setTimeout(function () {
          btn.disabled = false;
          btn.textContent = originalText;
        }, 2000);
      })
      .catch(function () {
        alert('Something went wrong. Please try again or email us directly.');
        btn.disabled = false;
        btn.textContent = originalText;
      });
  });
})();
