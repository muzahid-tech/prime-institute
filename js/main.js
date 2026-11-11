/* ============================================================
   PRIME INSTITUTE — Main JavaScript
   (with automatic demo-image placeholder engine)
   ============================================================ */

$(function () {

  /* ---------- 1. Footer Year ---------- */
  $('#year').text(new Date().getFullYear());

  /* ---------- 2. Active Nav Link ---------- */
  var current = window.location.pathname.split('/').pop() || 'index.html';
  $('.main-nav .nav-link').each(function () {
    var href = $(this).attr('href');
    if (href === current) $(this).addClass('active');
  });

  /* ---------- 3. Back to Top ---------- */
  $(window).on('scroll', function () {
    $('#backTop').toggleClass('show', $(this).scrollTop() > 350);
  });
  $('#backTop').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 400);
  });

  /* ---------- 4. Animated Counters ---------- */
  function animateCounter($el) {
    var target = parseInt($el.data('target'), 10);
    var duration = 1500;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      $el.text(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
      else $el.text(target);
    }
    requestAnimationFrame(step);
  }
  function initCounters() {
    var $c = $('.counter');
    if (!$c.length) return;
    var run = false;
    function check() {
      if (run) return;
      var top = $c.first().offset().top;
      if ($(window).scrollTop() + $(window).height() > top + 40) {
        run = true;
        $c.each(function () { animateCounter($(this)); });
      }
    }
    $(window).on('scroll load', check);
    check();
  }
  initCounters();

  /* ============================================================
     5. AUTO PLACEHOLDER ENGINE
     Any <img> that fails to load is replaced with a branded SVG.
     ============================================================ */

  function applyPlaceholder(img) {
    if (!img || img.dataset.phApplied) return;
    img.dataset.phApplied = '1';

    var label = (img.alt || 'Prime Institute').replace(/[<>&"']/g, '');
    var w = parseInt(img.getAttribute('width'), 10) || 600;
    var h = parseInt(img.getAttribute('height'), 10) || 400;

    // deterministic hue from label
    var hue = 210;
    for (var i = 0; i < label.length; i++) hue = (hue + label.charCodeAt(i) * 5) % 360;

    var bg1 = 'hsl(' + hue + ', 45%, 22%)';
    var bg2 = 'hsl(' + hue + ', 50%, 12%)';
    var accent = '#f4a300';
    var fs1 = Math.round(h * 0.09);
    var fs2 = Math.round(h * 0.05);
    var scale = (h / 400).toFixed(3);

    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0%" stop-color="' + bg1 + '"/>' +
          '<stop offset="100%" stop-color="' + bg2 + '"/>' +
        '</linearGradient></defs>' +
        '<rect width="100%" height="100%" fill="url(#g)"/>' +
        '<circle cx="' + (w * 0.85) + '" cy="' + (h * 0.2) + '" r="' + (h * 0.3) +
          '" fill="' + accent + '" opacity="0.07"/>' +
        '<circle cx="' + (w * 0.15) + '" cy="' + (h * 0.85) + '" r="' + (h * 0.25) +
          '" fill="' + accent + '" opacity="0.05"/>' +
        '<g transform="translate(' + (w / 2) + ',' + (h * 0.32) + ') scale(' + scale + ')">' +
          '<polygon points="0,-28 70,-8 0,12 -70,-8" fill="' + accent + '"/>' +
          '<rect x="-38" y="2" width="76" height="34" rx="4" fill="#ffffff"/>' +
          '<rect x="-5" y="-32" width="10" height="46" fill="' + accent + '"/>' +
          '<circle cx="0" cy="-32" r="5" fill="#0b2545"/>' +
        '</g>' +
        '<text x="50%" y="' + (h * 0.62) + '" text-anchor="middle" ' +
          'font-family="Poppins,Arial,sans-serif" font-size="' + fs1 + '" ' +
          'font-weight="700" fill="#ffffff">' + label + '</text>' +
        '<text x="50%" y="' + (h * 0.73) + '" text-anchor="middle" ' +
          'font-family="Poppins,Arial,sans-serif" font-size="' + fs2 + '" ' +
          'fill="' + accent + '" letter-spacing="3" font-weight="600">PRIME INSTITUTE</text>' +
      '</svg>';

    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  // Capture-phase listener (works for img error events)
  window.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') applyPlaceholder(e.target);
  }, true);

  // Scan for images already broken (before JS ran)
  function scanImages() {
    $('img').each(function () {
      if (this.complete && this.naturalWidth === 0 && !this.dataset.phApplied) {
        applyPlaceholder(this);
      }
    });
  }
  $(window).on('load', scanImages);
  setTimeout(scanImages, 300);
  setTimeout(scanImages, 1200);

  /* ============================================================
     6. Card Builders
     ============================================================ */

  function courseCard(c) {
    var subjects = (c.subjects || [])
      .map(function (s) { return '<span class="chip">' + s + '</span>'; })
      .join('');
    return '' +
      '<div class="col-md-6 col-lg-4 course-item" data-category="' + c.category + '">' +
        '<div class="course-card">' +
          '<div class="course-thumb">' +
            '<span class="course-tag">' + c.categoryLabel + '</span>' +
            '<img src="' + c.image + '" alt="' + c.title + '" loading="lazy" />' +
          '</div>' +
          '<div class="course-body">' +
            '<h5>' + c.title + '</h5>' +
            '<p class="course-desc">' + c.description + '</p>' +
            '<div>' + subjects + '</div>' +
            '<div class="course-meta">' +
              '<span><i class="fa-regular fa-clock"></i>' + c.duration + '</span>' +
              '<span><i class="fa-solid fa-user-group"></i>' + c.seats + '</span>' +
            '</div>' +
            '<div class="d-flex justify-content-between align-items-center mt-3">' +
              '<span class="course-price">' + c.fee + '</span>' +
              '<a href="contact.html" class="btn btn-brand btn-sm">Enquire</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function teacherCard(t) {
    return '' +
      '<div class="col-sm-6 col-lg-3 teacher-item" data-stream="' + t.stream + '">' +
        '<div class="teacher-card">' +
          '<div class="teacher-photo">' +
            '<img src="' + t.image + '" alt="' + t.name + '" loading="lazy" />' +
          '</div>' +
          '<div class="teacher-body">' +
            '<h6>' + t.name + '</h6>' +
            '<div class="teacher-subject">' + t.subject + '</div>' +
            '<p class="teacher-qual">' + t.qualification + '<br>' + t.experience + ' Experience</p>' +
            '<div class="teacher-social">' +
              '<a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>' +
              '<a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>' +
              '<a href="#" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function eventCard(e) {
    var cls = e.status === 'past' ? ' event-past' : '';
    return '' +
      '<div class="col-md-6 col-lg-4">' +
        '<div class="event-card' + cls + '">' +
          '<div class="event-thumb">' +
            '<div class="event-date-badge">' +
              '<span class="d">' + e.day + '</span>' +
              '<span class="m">' + e.month + '</span>' +
            '</div>' +
            '<img src="' + e.image + '" alt="' + e.title + '" loading="lazy" />' +
          '</div>' +
          '<div class="event-body">' +
            '<span class="event-cat">' + e.category + '</span>' +
            '<h5>' + e.title + '</h5>' +
            '<p class="event-desc">' + e.description + '</p>' +
            '<div class="event-meta">' +
              '<div><i class="fa-regular fa-calendar"></i>' + e.dateLabel + ' · ' + e.time + '</div>' +
              '<div><i class="fa-solid fa-location-dot"></i>' + e.venue + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ============================================================
     7. JSON Loaders
     ============================================================ */

  function loadCourses(target, limit) {
    var $t = $(target); if (!$t.length) return;
    $.getJSON('data/courses.json')
      .done(function (d) {
        var list = limit ? d.slice(0, limit) : d;
        $t.html(list.map(courseCard).join(''));
        setTimeout(scanImages, 100);
      })
      .fail(function () {
        $t.html('<div class="col-12 empty-state"><i class="fa-solid fa-triangle-exclamation me-2"></i>Course data could not be loaded. Please run the site on a local server.</div>');
      });
  }
  loadCourses('#courseGridHome', 3);
  loadCourses('#courseGrid', 0);

  function loadTeachers(target, limit) {
    var $t = $(target); if (!$t.length) return;
    $.getJSON('data/teachers.json')
      .done(function (d) {
        var list = limit ? d.slice(0, limit) : d;
        $t.html(list.map(teacherCard).join(''));
        setTimeout(scanImages, 100);
      })
      .fail(function () {
        $t.html('<div class="col-12 empty-state"><i class="fa-solid fa-triangle-exclamation me-2"></i>Teacher data could not be loaded.</div>');
      });
  }
  loadTeachers('#teacherGridHome', 4);
  loadTeachers('#teacherGrid', 0);

  function loadEvents(target, limit, status) {
    var $t = $(target); if (!$t.length) return;
    $.getJSON('data/events.json')
      .done(function (d) {
        var list = d;
        if (status) list = list.filter(function (e) { return e.status === status; });
        if (limit) list = list.slice(0, limit);
        $t.html(list.length ? list.map(eventCard).join('')
          : '<div class="col-12 empty-state">No events to display right now. Please check back soon.</div>');
        setTimeout(scanImages, 100);
      })
      .fail(function () {
        $t.html('<div class="col-12 empty-state"><i class="fa-solid fa-triangle-exclamation me-2"></i>Event data could not be loaded.</div>');
      });
  }
  loadEvents('#eventGridHome', 3, 'upcoming');
  loadEvents('#eventGridUpcoming', 0, 'upcoming');
  loadEvents('#eventGridPast', 0, 'past');

  /* ============================================================
     8. Filter Buttons
     ============================================================ */

  $(document).on('click', '#courseFilters .filter-btn', function () {
    var f = $(this).data('filter');
    $('#courseFilters .filter-btn').removeClass('active');
    $(this).addClass('active');
    $('.course-item').each(function () {
      $(this).toggle(f === 'all' || $(this).data('category') === f);
    });
    $('#courseEmpty').toggle($('.course-item:visible').length === 0);
  });

  $(document).on('click', '#teacherFilters .filter-btn', function () {
    var f = $(this).data('filter');
    $('#teacherFilters .filter-btn').removeClass('active');
    $(this).addClass('active');
    $('.teacher-item').each(function () {
      $(this).toggle(f === 'all' || $(this).data('stream') === f);
    });
  });

  /* ============================================================
     9. Contact Form Validation
     ============================================================ */

  $('#contactForm').on('submit', function (e) {
    e.preventDefault();
    var valid = true;
    var $form = $(this);

    $form.find('.form-control, .form-select').each(function () {
      var $f = $(this);
      var val = $.trim($f.val());
      if ($f.prop('required') && !val) { $f.addClass('is-invalid'); valid = false; }
      else $f.removeClass('is-invalid');

      if ($f.attr('type') === 'email' && val &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        $f.addClass('is-invalid'); valid = false;
      }
      if ($f.attr('type') === 'tel' && val &&
          !/^[0-9+\-\s()]{10,15}$/.test(val)) {
        $f.addClass('is-invalid'); valid = false;
      }
    });

    if (!valid) {
      $('#formAlert').removeClass('d-none alert-success')
        .addClass('alert alert-danger')
        .html('<i class="fa-solid fa-circle-exclamation me-2"></i>Please correct the highlighted fields.');
      return;
    }

    var $btn = $form.find('button[type="submit"]');
    $btn.prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin me-2"></i>Sending...');

    setTimeout(function () {
      $('#formAlert').removeClass('d-none alert-danger')
        .addClass('alert alert-success')
        .html('<i class="fa-solid fa-circle-check me-2"></i>Thank you! Your enquiry has been received. Our team will contact you within 24 hours.');
      $form[0].reset();
      $btn.prop('disabled', false).html('<i class="fa-solid fa-paper-plane me-2"></i>Send Message');
    }, 900);
  });

  $(document).on('input change', '.form-control, .form-select', function () {
    $(this).removeClass('is-invalid');
  });

  /* ---------- 10. Smooth Scroll ---------- */
  $('a[href^="#"]').on('click', function (e) {
    var t = $(this).attr('href');
    if (t === '#' || t.length < 2) return;
    var $el = $(t);
    if ($el.length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $el.offset().top - 80 }, 500);
    }
  });

});