/**
 * Newsletter (mailing list) form: submits to Google Sheets via a Google Apps Script web app URL.
 * On success, hides the form and shows an in-place thank-you message.
 */

(function () {
  var form = document.getElementById('newsletter-form');
  var newsletterBlock = document.getElementById('connect-newsletter');
  var thankYouBlock = document.getElementById('connect-thank-you');
  if (!form || !newsletterBlock || !thankYouBlock) return;

  function showThankYou() {
    newsletterBlock.hidden = true;
    thankYouBlock.hidden = false;
    if (location.hash !== '#thank-you') {
      location.hash = 'thank-you';
    }
    thankYouBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (location.hash === '#thank-you') {
    newsletterBlock.hidden = true;
    thankYouBlock.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn = form.querySelector('.connect-submit-btn');
    var originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Sending…';

    var action = form.getAttribute('action');

    if (!action) {
      alert('Form is not configured. Add your Google Apps Script web app URL to the form action in index.html. See README for steps.');
      btn.disabled = false;
      btn.innerHTML = originalHtml;
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
        form.reset();
        showThankYou();
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      })
      .catch(function () {
        alert('Something went wrong. Please try again or email us directly.');
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      });
  });
})();
