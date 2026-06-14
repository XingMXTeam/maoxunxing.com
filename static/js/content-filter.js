document.addEventListener('DOMContentLoaded', function () {
  var filterButtons = document.querySelectorAll('.filter-btn');
  var articleItems = document.querySelectorAll('.article-item');

  function setActiveFilter(activeButton) {
    var filter = activeButton.getAttribute('data-filter');

    filterButtons.forEach(function (btn) {
      var isActive = btn === activeButton;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    articleItems.forEach(function (item) {
      var isVisible = filter === 'all' || item.getAttribute('data-section') === filter;
      item.style.display = isVisible ? '' : 'none';
      item.toggleAttribute('hidden', !isVisible);
    });
  }

  filterButtons.forEach(function (btn) {
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
    btn.addEventListener('click', function () {
      setActiveFilter(btn);
    });
  });
});
