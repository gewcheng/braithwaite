/**
 * Footer color switch: add .footer-in-view when enough of the footer is visible
 * so CSS can transition from cream bg + navy text to navy bg + cream text.
 * Desktop (min-width 901px): 60% visible. Mobile (max-width 900px): 50% visible.
 */
(function () {
  var footer = document.querySelector('.site-footer');
  if (!footer) return;

  var inViewClass = 'footer-in-view';
  var desktopQuery = window.matchMedia('(min-width: 901px)');
  var observer = null;

  function getThreshold() {
    return desktopQuery.matches ? 0.6 : 0.5;
  }

  function createObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    var threshold = getThreshold();
    observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            footer.classList.add(inViewClass);
          } else {
            footer.classList.remove(inViewClass);
          }
        });
      },
      { threshold: threshold, rootMargin: '0px' }
    );
    observer.observe(footer);
  }

  desktopQuery.addEventListener('change', createObserver);
  createObserver();
})();
