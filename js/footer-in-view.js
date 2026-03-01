/**
 * Footer color switch: when the footer scrolls into view, add .footer-in-view
 * so CSS can transition from cream bg + navy text to navy bg + cream text.
 */
(function () {
  var footer = document.querySelector('.site-footer');
  if (!footer) return;

  var inViewClass = 'footer-in-view';
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          footer.classList.add(inViewClass);
        } else {
          footer.classList.remove(inViewClass);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px' }
  );

  observer.observe(footer);
})();
