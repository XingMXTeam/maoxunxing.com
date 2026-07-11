(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  ready(function () {
    var gallery = document.querySelector('[data-photo-gallery]');
    if (!gallery) return;

    document.body.classList.add('page-gallery');

    var toggle = gallery.querySelector('[data-photo-view-toggle]');
    var items = Array.prototype.slice.call(gallery.querySelectorAll('.photo-item'));
    var lightbox = gallery.querySelector('[data-photo-lightbox]');
    var lightboxImage = gallery.querySelector('[data-photo-lightbox-image]');
    var lightboxCaption = gallery.querySelector('[data-photo-lightbox-caption]');
    var lightboxCount = gallery.querySelector('[data-photo-lightbox-count]');
    var closeButton = gallery.querySelector('[data-photo-lightbox-close]');
    var previousButton = gallery.querySelector('[data-photo-lightbox-prev]');
    var nextButton = gallery.querySelector('[data-photo-lightbox-next]');

    var activeIndex = -1;
    var previousFocus = null;
    var touchStartX = null;
    var closeTimer = null;

    function setView(view) {
      var nextView = view === 'contain' ? 'contain' : 'cover';
      gallery.setAttribute('data-view', nextView);

      if (toggle) {
        var isContain = nextView === 'contain';
        var label = isContain
          ? toggle.getAttribute('data-contain-label')
          : toggle.getAttribute('data-cover-label');
        toggle.setAttribute('aria-pressed', String(isContain));
        if (label) toggle.setAttribute('aria-label', label);
      }

      try {
        window.localStorage.setItem('photo-gallery-view', nextView);
      } catch (error) {}
    }

    if (toggle) {
      var savedView = null;
      try {
        savedView = window.localStorage.getItem('photo-gallery-view');
      } catch (error) {}

      setView(savedView === 'contain' ? 'contain' : 'cover');
      toggle.addEventListener('click', function () {
        setView(gallery.getAttribute('data-view') === 'cover' ? 'contain' : 'cover');
      });
    }

    if (!lightbox || !lightboxImage || items.length === 0) return;

    function normalizeIndex(index) {
      return (index + items.length) % items.length;
    }

    function getPhoto(index) {
      var item = items[index];
      var image = item && item.querySelector('img');
      var src = '';

      if (image) {
        src = image.currentSrc || image.src || '';
      }
      if (!src && item) {
        src = item.getAttribute('data-photo-src') || '';
      }

      return {
        src: src,
        alt: item ? item.getAttribute('data-photo-alt') || (image && image.alt) || '' : ''
      };
    }

    function preload(index) {
      if (items.length < 2) return;
      var photo = getPhoto(normalizeIndex(index));
      if (!photo.src) return;
      var image = new Image();
      image.decoding = 'async';
      image.src = photo.src;
    }

    function render(index) {
      activeIndex = normalizeIndex(index);
      var photo = getPhoto(activeIndex);
      if (!photo.src) return;

      lightboxImage.classList.remove('is-loaded');
      lightboxImage.alt = photo.alt;
      lightboxImage.onload = function () {
        lightboxImage.classList.add('is-loaded');
      };
      lightboxImage.onerror = function () {
        lightboxImage.classList.remove('is-loaded');
      };
      lightboxImage.src = photo.src;

      if (lightboxImage.complete && lightboxImage.naturalWidth > 0) {
        lightboxImage.classList.add('is-loaded');
      }

      if (lightboxCaption) lightboxCaption.textContent = photo.alt;
      if (lightboxCount) lightboxCount.textContent = String(activeIndex + 1) + ' / ' + String(items.length);

      preload(activeIndex + 1);
      preload(activeIndex - 1);
    }

    function open(index) {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }

      previousFocus = document.activeElement;
      lightbox.hidden = false;
      document.body.classList.add('photo-lightbox-open');
      render(index);

      window.requestAnimationFrame(function () {
        lightbox.classList.add('is-open');
      });

      if (closeButton) closeButton.focus();
    }

    function close() {
      if (lightbox.hidden) return;
      lightbox.classList.remove('is-open');
      document.body.classList.remove('photo-lightbox-open');

      closeTimer = window.setTimeout(function () {
        lightbox.hidden = true;
        lightboxImage.removeAttribute('src');
        lightboxImage.classList.remove('is-loaded');
        activeIndex = -1;
        closeTimer = null;
      }, 180);

      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus();
      }
      previousFocus = null;
    }

    function navigate(direction) {
      if (activeIndex < 0) return;
      render(activeIndex + direction);
    }

    items.forEach(function (item, index) {
      item.addEventListener('click', function () {
        open(index);
      });
    });

    if (closeButton) closeButton.addEventListener('click', close);
    if (previousButton) previousButton.addEventListener('click', function () { navigate(-1); });
    if (nextButton) nextButton.addEventListener('click', function () { navigate(1); });

    lightbox.addEventListener('click', function (event) {
      if (
        event.target === lightbox ||
        event.target === lightboxImage ||
        (event.target && event.target.classList && event.target.classList.contains('photo-lightbox-backdrop'))
      ) {
        close();
      }
    });

    lightbox.addEventListener('touchstart', function (event) {
      if (event.touches.length === 1) touchStartX = event.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (event) {
      if (touchStartX === null || event.changedTouches.length !== 1) return;
      var distance = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(distance) < 50) return;
      navigate(distance > 0 ? -1 : 1);
    }, { passive: true });

    document.addEventListener('keydown', function (event) {
      if (lightbox.hidden) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigate(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigate(1);
      } else if (event.key === 'Tab' && closeButton) {
        event.preventDefault();
        closeButton.focus();
      }
    });
  });
})();