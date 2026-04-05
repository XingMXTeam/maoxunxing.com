(function () {
  var overlay = null;
  var images = [];
  var currentIndex = 0;

  function open(src, imgList, idx) {
    images = imgList || [src];
    currentIndex = idx || 0;
    if (overlay) close();

    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML =
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      (images.length > 1 ? '<button class="lightbox-nav lightbox-prev" aria-label="Previous">&lsaquo;</button>' : '') +
      '<img src="' + images[currentIndex] + '" alt="" />' +
      (images.length > 1 ? '<button class="lightbox-nav lightbox-next" aria-label="Next">&rsaquo;</button>' : '');

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
  }

  function close() {
    if (overlay) {
      overlay.remove();
      overlay = null;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    }
  }

  function navigate(dir) {
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
        srcs.push(item.getAttribute('href') || item.querySelector('img').src);
      });
      galleryItems.forEach(function (item, idx) {
        item.addEventListener('click', function (e) {
          e.preventDefault();
          open(srcs[idx], srcs, idx);
        });
      });
    }

    // Blog post image lightbox
    var articleImgs = document.querySelectorAll('.content article img');
    if (articleImgs.length > 0) {
      var imgSrcs = [];
      articleImgs.forEach(function (img) {
        imgSrcs.push(img.src);
      });
      articleImgs.forEach(function (img, idx) {
        img.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          open(img.src, imgSrcs, idx);
        });
      });
    }
  });
})();
