/* =========================================================
   ACD HOTELS CHENNAI — interactions
   ========================================================= */
(function () {
  'use strict';

  var WA_NUMBER = '917397260932';                 // +91 7397 260 932
  var PRICES = { single: 900, double: 1500 };
  var ROOM_LABEL = { single: 'Single Capsule Room', double: 'Double Capsule Room (Couple)' };

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- PRELOADER ---------------- */
  var preloader = $('#preloader'), preBar = $('#preBar'), pct = 0;
  var preTimer = setInterval(function () {
    pct = Math.min(pct + Math.random() * 18, 100);
    if (preBar) preBar.style.width = pct + '%';
    if (pct >= 100) clearInterval(preTimer);
  }, 130);

  function bootDone() {
    clearInterval(preTimer);
    if (preBar) preBar.style.width = '100%';
    setTimeout(function () {
      if (preloader) preloader.classList.add('is-gone');
      document.body.classList.add('is-ready');
    }, 320);
  }
  window.addEventListener('load', bootDone);
  setTimeout(bootDone, 3800); // safety net if an image stalls

  /* ---------------- STARS ---------------- */
  var STAR = '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
  $$('.stars').forEach(function (box) {
    var html = '';
    for (var i = 0; i < 5; i++) {
      html += STAR.replace('<svg', '<svg style="animation-delay:' + (i * 90) + 'ms"');
    }
    box.innerHTML = html;
  });

  /* ---------------- HEADER ---------------- */
  var header = $('#header'), progress = $('#scrollProgress'), lastY = 0;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-stuck', y > 30);
    // hide on scroll-down past hero, show on scroll-up
    if (y > 420 && y > lastY + 4 && !document.body.classList.contains('is-locked')) {
      header.classList.add('is-hidden');
    } else if (y < lastY - 4) {
      header.classList.remove('is-hidden');
    }
    lastY = y;

    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () { onScroll(); ticking = false; });
    }
  }, { passive: true });
  onScroll();

  /* ---------------- MOBILE NAV ---------------- */
  var mobToggle = $('#mobToggle'), mobNav = $('#mobNav'), navScrim = $('#navScrim');

  function setMenu(open) {
    mobToggle.classList.toggle('is-open', open);
    mobToggle.setAttribute('aria-expanded', String(open));
    mobToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobNav.classList.toggle('is-open', open);
    navScrim.classList.toggle('is-on', open);
    document.body.classList.toggle('is-locked', open);
    if (open) mobNav.removeAttribute('inert'); else mobNav.setAttribute('inert', '');
  }
  mobToggle.addEventListener('click', function () {
    setMenu(!mobNav.classList.contains('is-open'));
  });
  navScrim.addEventListener('click', function () { setMenu(false); });
  $$('#mobNav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* ---------------- ACTIVE NAV LINK ---------------- */
  var sections = $$('main section[id]');
  var navLinks = $$('.nav-link');
  if ('IntersectionObserver' in window && sections.length) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ---------------- SCROLL REVEAL ---------------- */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var d = parseInt(e.target.dataset.delay || 0, 10);
        setTimeout(function () { e.target.classList.add('is-in'); }, reduced ? 0 : d);
        obs.unobserve(e.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { revObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------- COUNTERS ---------------- */
  function runCount(el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || 0, 10);
    if (reduced) { el.textContent = target.toFixed(dec); return; }
    var dur = 1500, t0 = performance.now();
    (function step(now) {
      var p = Math.min((now - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(dec);
    })(t0);
  }
  var counters = $$('.count');
  if ('IntersectionObserver' in window) {
    var cObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        runCount(e.target); obs.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cObs.observe(c); });
  } else {
    counters.forEach(runCount);
  }

  /* ---------------- HERO SLIDER ---------------- */
  var slides = $$('.hero-slide'), dotsBox = $('#heroDots'), idx = 0, autoTimer = null;

  slides.forEach(function (_, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Go to image ' + (i + 1));
    if (i === 0) b.classList.add('is-on');
    b.addEventListener('click', function () { go(i); restart(); });
    dotsBox.appendChild(b);
  });
  var dots = $$('button', dotsBox);

  function go(n) {
    idx = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
    dots.forEach(function (d, i) { d.classList.toggle('is-on', i === idx); });
    // eagerly load the next image
    var nxt = slides[(idx + 1) % slides.length].querySelector('img');
    if (nxt && nxt.loading === 'lazy') nxt.loading = 'eager';
  }
  function restart() {
    clearInterval(autoTimer);
    if (!reduced) autoTimer = setInterval(function () { go(idx + 1); }, 6000);
  }
  $('#heroPrev').addEventListener('click', function () { go(idx - 1); restart(); });
  $('#heroNext').addEventListener('click', function () { go(idx + 1); restart(); });
  restart();

  // pause when tab hidden / hero offscreen
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearInterval(autoTimer); else restart();
  });

  // swipe
  var hero = $('.hero'), tx0 = null, ty0 = null;
  hero.addEventListener('touchstart', function (e) {
    tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY;
  }, { passive: true });
  hero.addEventListener('touchend', function (e) {
    if (tx0 === null) return;
    var dx = e.changedTouches[0].clientX - tx0;
    var dy = e.changedTouches[0].clientY - ty0;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { go(idx + (dx < 0 ? 1 : -1)); restart(); }
    tx0 = ty0 = null;
  }, { passive: true });

  // keyboard
  document.addEventListener('keydown', function (e) {
    if ($('#lightbox').hidden === false) return;
    if (window.scrollY > window.innerHeight) return;
    if (e.key === 'ArrowLeft') { go(idx - 1); restart(); }
    if (e.key === 'ArrowRight') { go(idx + 1); restart(); }
  });

  /* ---------------- PARALLAX + CURSOR GLOW + TILT ---------------- */
  if (!reduced) {
    var pxEls = $$('[data-parallax]');
    if (pxEls.length) {
      window.addEventListener('scroll', function () {
        requestAnimationFrame(function () {
          var y = window.scrollY;
          pxEls.forEach(function (el) {
            el.style.transform = 'translate3d(0,' + (y * parseFloat(el.dataset.parallax)) + 'px,0)';
          });
        });
      }, { passive: true });
    }

    var glow = $('#cursorGlow');
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      window.addEventListener('mousemove', function (e) {
        glow.classList.add('is-on');
        glow.style.transform = 'translate3d(' + (e.clientX - 210) + 'px,' + (e.clientY - 210) + 'px,0)';
      }, { passive: true });

      // spotlight sweep inside amenity cards
      $$('.amen-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
      });

      // subtle 3D tilt
      $$('[data-tilt]').forEach(function (el) {
        el.style.transformStyle = 'preserve-3d';
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          var rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
          var ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
          el.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-6px)';
        });
        el.addEventListener('mouseleave', function () { el.style.transform = ''; });
      });

      // magnetic buttons
      $$('[data-magnetic]').forEach(function (el) {
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.16) + 'px,' +
            ((e.clientY - r.top - r.height / 2) * 0.26 - 3) + 'px)';
        });
        el.addEventListener('mouseleave', function () { el.style.transform = ''; });
      });
    }
  }

  /* ---------------- REVIEWS MARQUEE ---------------- */
  var REVIEWS = [
    { n: 'Priya Ramaswamy', i: 'PR', w: '2 weeks ago', t: 'Hands down the best capsule hotel in Chennai. Clean, cosy, and incredibly affordable. Free laundry and kitchen are absolute lifesavers!' },
    { n: 'Karthik & Divya M.', i: 'KM', w: '1 month ago', t: 'Stayed for our anniversary. The double capsule is surprisingly spacious and romantic. Staff are so warm. Will definitely return!' },
    { n: 'Arun Selvam', i: 'AS', w: '3 weeks ago', t: 'The snooker table is an unexpected gem! Met amazing people. ACD is not just a hotel — it’s a community. Loved every minute!' },
    { n: 'Meera Thiagarajan', i: 'MT', w: '5 days ago', t: 'Finally a hotel that genuinely cares! Bathrooms are hospital-level clean. At Rs.800 per night this is unbelievable value.' },
    { n: 'Rahul Krishnamurthy', i: 'RK', w: '2 months ago', t: 'Solo trip to Chennai — ACD made it unforgettable. Felt completely safe, met amazing travellers, and saved a ton!' },
    { n: 'Kavitha Sundaram', i: 'KS', w: '3 days ago', t: 'Best value in Chennai, period. The pay-at-hotel policy is so refreshing. Truly guest-first hospitality!' }
  ];
  var track = $('#revTrack');
  function revCard(r) {
    var el = document.createElement('article');
    el.className = 'rev-card';
    el.innerHTML =
      '<div class="rev-head">' +
        '<div class="rev-av">' + r.i + '</div>' +
        '<div class="rev-who"><strong></strong><span>' + r.w + '</span></div>' +
      '</div>' +
      '<div class="stars" aria-hidden="true"></div>' +
      '<p class="rev-txt"></p>' +
      '<span class="rev-src">Google Review</span>';
    $('.rev-who strong', el).textContent = r.n;
    $('.rev-txt', el).textContent = r.t;
    var s = '';
    for (var i = 0; i < 5; i++) s += STAR;
    $('.stars', el).innerHTML = s;
    return el;
  }
  // duplicate the set so the -50% marquee loops seamlessly
  REVIEWS.concat(REVIEWS).forEach(function (r) { track.appendChild(revCard(r)); });

  /* ---------------- LIGHTBOX ---------------- */
  var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  var galImgs = $$('#galGrid .gal-item'), lbIdx = 0;

  function lbShow(i) {
    lbIdx = (i + galImgs.length) % galImgs.length;
    var fig = galImgs[lbIdx], img = $('img', fig);
    lbImg.src = img.dataset.full || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = $('figcaption', fig).textContent;
  }
  function lbOpen(i) {
    lbShow(i);
    lb.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(function () { lb.classList.add('is-on'); });
    $('#lbClose').focus();
  }
  function lbClose() {
    lb.classList.remove('is-on');
    document.body.classList.remove('is-locked');
    setTimeout(function () { lb.hidden = true; lbImg.removeAttribute('src'); }, 350);
  }
  galImgs.forEach(function (fig, i) {
    fig.addEventListener('click', function () { lbOpen(i); });
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');
    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lbOpen(i); }
    });
  });
  $('#lbClose').addEventListener('click', lbClose);
  $('#lbPrev').addEventListener('click', function () { lbShow(lbIdx - 1); });
  $('#lbNext').addEventListener('click', function () { lbShow(lbIdx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') lbClose();
    if (e.key === 'ArrowLeft') lbShow(lbIdx - 1);
    if (e.key === 'ArrowRight') lbShow(lbIdx + 1);
  });
  // swipe in lightbox
  var lx0 = null;
  lb.addEventListener('touchstart', function (e) { lx0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (lx0 === null) return;
    var dx = e.changedTouches[0].clientX - lx0;
    if (Math.abs(dx) > 55) lbShow(lbIdx + (dx < 0 ? 1 : -1));
    lx0 = null;
  }, { passive: true });

  /* ---------------- QUIZ ---------------- */
  var quiz = $('#quizModal');
  var quizPick = { who: 'single', rooms: '1' };
  var quizSeen = false;

  function quizOpen() {
    quiz.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(function () { quiz.classList.add('is-on'); });
  }
  function quizClose() {
    quiz.classList.remove('is-on');
    document.body.classList.remove('is-locked');
    setTimeout(function () { quiz.hidden = true; }, 420);
  }
  $$('.quiz-opt').forEach(function (b) {
    b.addEventListener('click', function () {
      var group = b.parentElement.dataset.group;
      $$('.quiz-opt', b.parentElement).forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      quizPick[group] = b.dataset.val;
    });
  });
  $$('[data-close-quiz]').forEach(function (el) { el.addEventListener('click', quizClose); });
  $('#quizGo').addEventListener('click', function () {
    quizClose();
    setTimeout(function () { bkOpen(quizPick.who, parseInt(quizPick.rooms, 10)); }, 300);
  });

  /* ---------------- BOOKING PANEL ---------------- */
  var bk = $('#booking'), rowsBox = $('#roomRows');

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function isoDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  function addRow(type, qty) {
    var row = document.createElement('div');
    row.className = 'room-row';
    row.innerHTML =
      '<label><span>Room Type</span>' +
        '<select class="rr-type">' +
          '<option value="single">Single Capsule — ₹900 / night</option>' +
          '<option value="double">Double Capsule — ₹1500 / night</option>' +
        '</select>' +
      '</label>' +
      '<label><span>Rooms</span>' +
        '<input class="rr-qty" type="number" min="1" max="10" step="1" value="1" inputmode="numeric">' +
      '</label>' +
      '<button type="button" class="row-del" aria-label="Remove room">&times;</button>';
    $('.rr-type', row).value = type || 'single';
    $('.rr-qty', row).value = qty || 1;
    $('.row-del', row).addEventListener('click', function () {
      if (rowsBox.children.length <= 1) return;
      row.remove(); syncDel(); calc();
    });
    $('.rr-type', row).addEventListener('change', calc);
    $('.rr-qty', row).addEventListener('input', calc);
    rowsBox.appendChild(row);
    syncDel();
  }
  function syncDel() {
    var only = rowsBox.children.length <= 1;
    $$('.row-del', rowsBox).forEach(function (b) { b.disabled = only; });
  }

  function nights() {
    var a = $('#bkIn').value, b = $('#bkOut').value;
    if (!a || !b) return 0;
    var diff = (new Date(b) - new Date(a)) / 86400000;
    return diff > 0 ? Math.round(diff) : 0;
  }

  function calc() {
    var n = nights(), total = 0, list = $('#bkSumList');
    list.innerHTML = '';
    $$('.room-row', rowsBox).forEach(function (row) {
      var type = $('.rr-type', row).value;
      var qty = Math.max(1, Math.min(10, parseInt($('.rr-qty', row).value, 10) || 1));
      var sub = PRICES[type] * qty * (n || 1);
      total += sub;
      var li = document.createElement('li');
      li.innerHTML = '<span>' + ROOM_LABEL[type] + ' × ' + qty +
        (n ? ' × ' + n + ' night' + (n > 1 ? 's' : '') : '') +
        '</span><strong>₹' + sub.toLocaleString('en-IN') + '</strong>';
      list.appendChild(li);
    });
    if (n) {
      var li2 = document.createElement('li');
      li2.innerHTML = '<span>Stay length</span><strong>' + n + ' night' + (n > 1 ? 's' : '') + '</strong>';
      list.appendChild(li2);
    }
    $('#bkTotal').textContent = total ? '₹' + total.toLocaleString('en-IN') : '—';
    return { nights: n, total: total };
  }

  function bkOpen(type, count) {
    if (!rowsBox.children.length) addRow(type || 'single', count || 1);
    else {
      rowsBox.innerHTML = '';
      addRow(type || 'single', count || 1);
    }
    var today = new Date();
    var tmr = new Date(today.getTime() + 86400000);
    var inEl = $('#bkIn'), outEl = $('#bkOut');
    inEl.min = isoDate(today);
    outEl.min = isoDate(tmr);
    if (!inEl.value) inEl.value = isoDate(today);
    if (!outEl.value) outEl.value = isoDate(tmr);

    bk.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(function () { bk.classList.add('is-on'); });
    calc();
  }
  function bkClose() {
    bk.classList.remove('is-on');
    document.body.classList.remove('is-locked');
    setTimeout(function () { bk.hidden = true; }, 720);
  }

  $('#bkBack').addEventListener('click', bkClose);
  $('#bkAdd').addEventListener('click', function () { addRow('single', 1); calc(); });
  $('#bkIn').addEventListener('change', function () {
    var d = new Date($('#bkIn').value);
    if (isNaN(d)) return;
    var next = new Date(d.getTime() + 86400000);
    $('#bkOut').min = isoDate(next);
    if (!$('#bkOut').value || new Date($('#bkOut').value) <= d) $('#bkOut').value = isoDate(next);
    calc();
  });
  $('#bkOut').addEventListener('change', calc);

  // clear the invalid outline as soon as the guest starts correcting the field
  ['#bkName', '#bkPhone', '#bkIn', '#bkOut'].forEach(function (sel) {
    var el = $(sel);
    ['input', 'change'].forEach(function (ev) {
      el.addEventListener(ev, function () { el.classList.remove('is-bad'); });
    });
  });

  // Book Now triggers: first click shows the quiz, later clicks go straight in
  $$('.js-book').forEach(function (b) {
    b.addEventListener('click', function () {
      setMenu(false);
      var room = b.dataset.room;
      if (room) { bkOpen(room, 1); return; }
      if (!quizSeen) { quizSeen = true; quizOpen(); }
      else bkOpen(quizPick.who, parseInt(quizPick.rooms, 10));
    });
  });

  /* ---------------- SUBMIT → WHATSAPP ---------------- */
  var done = $('#doneModal');
  function doneOpen() {
    done.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(function () { done.classList.add('is-on'); });
  }
  function doneClose() {
    done.classList.remove('is-on');
    document.body.classList.remove('is-locked');
    setTimeout(function () { done.hidden = true; }, 420);
  }
  $$('[data-close-done]').forEach(function (el) { el.addEventListener('click', doneClose); });

  function niceDate(v) {
    var d = new Date(v);
    if (isNaN(d)) return v;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  $('#bkForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#bkName'), phone = $('#bkPhone');
    var bad = false;

    [name, phone].forEach(function (f) { f.classList.remove('is-bad'); });
    if (!name.value.trim()) { name.classList.add('is-bad'); bad = true; }
    if (!/^[0-9]{10}$/.test(phone.value.replace(/\D/g, '').slice(-10)) || phone.value.replace(/\D/g, '').length < 10) {
      phone.classList.add('is-bad'); bad = true;
    }
    if (bad) { (name.classList.contains('is-bad') ? name : phone).focus(); return; }

    var sums = calc();
    if (!sums.nights) { $('#bkOut').classList.add('is-bad'); $('#bkOut').focus(); return; }

    var lines = [];
    lines.push('*New Booking Request — ACD Hotels*');
    lines.push('');
    lines.push('Name: ' + name.value.trim());
    lines.push('Phone: ' + phone.value.trim());
    lines.push('Check-in: ' + niceDate($('#bkIn').value) + ' (12:00 PM)');
    lines.push('Check-out: ' + niceDate($('#bkOut').value) + ' (11:00 AM)');
    lines.push('Nights: ' + sums.nights);
    lines.push('');
    lines.push('*Rooms*');
    $$('.room-row', rowsBox).forEach(function (row) {
      var type = $('.rr-type', row).value;
      var qty = Math.max(1, parseInt($('.rr-qty', row).value, 10) || 1);
      lines.push('• ' + ROOM_LABEL[type] + ' × ' + qty + ' — ₹' + PRICES[type] + '/night');
    });
    lines.push('');
    lines.push('*Grand Total: ₹' + sums.total.toLocaleString('en-IN') + '*');
    lines.push('Payment: Pay at Hotel');

    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank');
    doneOpen();
  });

  /* ---------------- ESC closes overlays ---------------- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!done.hidden) return doneClose();
    if (!quiz.hidden) return quizClose();
    if (!bk.hidden) return bkClose();
    if (mobNav.classList.contains('is-open')) setMenu(false);
  });

  /* ---------------- SMOOTH ANCHORS ---------------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var top = t.getBoundingClientRect().top + window.scrollY -
        (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hdr-h'), 10) || 70) - 12;
      window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
    });
  });
})();
