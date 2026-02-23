/**
 * Scroll-spy: updates the sticky nav so the dot (menu-dot.svg) indicates
 * which section is in view. Sections are separated by horizontal hairlines (hr.section-rule).
 */
(function () {
  var sectionIds = ['why', 'services', 'about', 'connect'];
  var navItems = document.querySelectorAll('.nav-item[data-section]');
  var sections = sectionIds.map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);

  if (!navItems.length || !sections.length) return;

  var activeClass = 'active';
  // Match scroll-margin: section is "active" when its top reaches the nav line (header + 1rem)
  var offset = 166; // header 150px + 1rem
  var ignoreScrollUntil = 0; // after a nav click, ignore scroll updates for a short time

  function setActive(sectionId) {
    navItems.forEach(function (item) {
      if (item.getAttribute('data-section') === sectionId) {
        item.classList.add(activeClass);
      } else {
        item.classList.remove(activeClass);
      }
    });
  }

  function onScroll() {
    if (Date.now() < ignoreScrollUntil) return; // don't overwrite click-set active during scroll
    var current = sectionIds[0];
    for (var i = 0; i < sections.length; i++) {
      var rect = sections[i].getBoundingClientRect();
      if (rect.top <= offset) {
        current = sectionIds[i];
      }
    }
    setActive(current);
  }

  window.addEventListener('scroll', function () {
    window.requestAnimationFrame(onScroll);
  }, { passive: true });

  // On nav click: set active immediately and ignore scroll-based updates until scroll settles
  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var sectionId = item.getAttribute('data-section');
      if (sectionId) {
        setActive(sectionId);
        ignoreScrollUntil = Date.now() + 500; // 500ms so scroll-spy doesn't overwrite during scroll
      }
    });
  });

  // Set initial active section
  onScroll();
})();
