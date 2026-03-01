/**
 * Footer color switch: add .footer-in-view when enough of the footer is visible
 * so CSS can transition from cream bg + navy text to navy bg + cream text.
 * Desktop (min-width 901px): 75% visible. Mobile (max-width 900px): 50% visible.
 */
(function () {
  var footer = document.querySelector('.site-footer');
  if (!footer) return;

  var inViewClass = 'footer-in-view';
  var mobileQuery = window.matchMedia('(max-width: 900px)');
  var observer = null;

  function createObserver(threshold) {
    if (observer) observer.disconnect();
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

  function updateThreshold() {
    createObserver(mobileQuery.matches ? 0.5 : 0.75);
  }

  mobileQuery.addEventListener('change', updateThreshold);
  updateThreshold();
})();
