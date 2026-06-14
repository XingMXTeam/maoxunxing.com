(function () {
  var overlay = null;
  var images = [];
  var currentIndex = 0;
  var previousFocus = null;

  function open(src, imgList, idx) {
    images = imgList || [src];
    currentIndex = idx || 0;
    previousFocus = document.activeElement;
    if (overlay) close();

    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image preview');
    overlay.innerHTML =
      '<button class="lightbox-close" aria-label="Close image preview">&times;</button>' +
      (images.length > 1 ? '<button class="lightbox-nav lightbox-prev" aria-label="Previous image">&lsaquo;</button>' : '') +
      '<img src="' + images[currentIndex] + '" alt="" />' +
      (images.length > 1 ? '<button class="lightbox-nav lightbox-next" aria-label="Next image">&rsaquo;</button>' : '');

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    if (images.length > 1) {
      overlay.querySelector('.lightbox-prev').addEventListener('click', function (e) {
        e.stopPropagation();
        navigate(-1);
      });
      overlay.querySelector('.lightbox-next').addEventListener('click', function (e) {
        e.stopPropagation();
        navigate(1);
      });
    }
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    overlay.querySelector('.lightbox-close').focus();
  }

  function close() {
    if (overlay) {
      overlay.remove();
      overlay = null;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus();
      }
      previousFocus = null;
    }
  }

  function navigate(dir) {
    if (!overlay || images.length < 2) return;
    currentIndex = (currentIndex + dir + images.length) % images.length;
    var img = overlay.querySelector('img');
    if (img) img.src = images[currentIndex];
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  }

  // Gallery lightbox
  document.addEventListener('DOMContentLoaded', function () {
    var galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
      var srcs = [];
      galleryItems.forEach(function (item) {
        var img = item.querySelector('img');
        srcs.push(item.getAttribute('href') || (img && img.src));
      });
      galleryItems.forEach(function (item, idx) {
        item.addEventListener('click', function (e) {
          e.preventDefault();
          if (srcs[idx]) open(srcs[idx], srcs.filter(Boolean), idx);
        });
      });
    }

    // Blog post image lightbox
    var articleImgs = document.querySelectorAll('.content article img');
    if (articleImgs.length > 0) {
      var imgSrcs = [];
      articleImgs.forEach(function (img) {
        imgSrcs.push(img.src);
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', img.alt ? 'Preview image: ' + img.alt : 'Preview image');
      });
      articleImgs.forEach(function (img, idx) {
        function openImage(e) {
          e.preventDefault();
          e.stopPropagation();
          open(img.src, imgSrcs, idx);
        }

        img.addEventListener('click', openImage);
        img.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            openImage(e);
          }
        });
      });
    }
  });
})();
