/* Green Oasis Gabella — «Una giornata all'Oasi»
   - luce della pagina: CSS scroll-driven dove c'è animation-timeline,
     altrimenti interpolazione in JS (IntersectionObserver + requestAnimationFrame)
   - orologio 08:00 → 23:00 legato allo scroll
   - capitoli: foto sticky che cambia con il testo, scena che si apre
   - hero: parallasse leggera al mouse (solo puntatore fine)
   Niente cookie, niente analytics, niente invio dati. */
(function () {
  'use strict';
  var html = document.documentElement;
  var ridotto = window.matchMedia('(prefers-reduced-motion: reduce)');
  var cssScroll = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()') && CSS.supports('animation-timeline: view()'));
  html.classList.add(cssScroll ? 'css-scroll' : 'no-css-scroll');
  html.classList.remove('no-js');

  /* ---------- le quattro tappe di luce (stesse del CSS) ---------- */
  var TAPPE = [
    { t: 0,    bg: '#17382a', bg2: '#224b36', a: '#8fd17a', b: '#fff0b8', c: '#8adbd2', acc: '#cfefb3', sole: 12,  stelle: 0, luna: 0 },
    { t: 0.35, bg: '#0f3339', bg2: '#145a5a', a: '#35c5d8', b: '#ffd36a', c: '#7fb069', acc: '#8fe6f2', sole: 4,   stelle: 0, luna: 0 },
    { t: 0.65, bg: '#2a1710', bg2: '#4a2512', a: '#f2a63b', b: '#e25a2c', c: '#7a2e3f', acc: '#ffc46b', sole: 78,  stelle: 0, luna: 0 },
    { t: 1,    bg: '#070a14', bg2: '#0d1430', a: '#2a3c8f', b: '#6b3fb8', c: '#ff5fa2', acc: '#c9b7ff', sole: 130, stelle: 1, luna: 1 }
  ];
  var FASI = ['mattina', 'pomeriggio', 'sera', 'notte'];

  function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  function mix(c1, c2, k) {
    var a = hex(c1), b = hex(c2);
    return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * k) + ',' + Math.round(a[1] + (b[1] - a[1]) * k) + ',' + Math.round(a[2] + (b[2] - a[2]) * k) + ')';
  }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function tappa(t) {
    var i = 0;
    while (i < TAPPE.length - 2 && t > TAPPE[i + 1].t) i++;
    var p = TAPPE[i], q = TAPPE[i + 1], k = (t - p.t) / (q.t - p.t);
    k = Math.max(0, Math.min(1, k));
    return { p: p, q: q, k: k };
  }
  function applicaLuce(t) {
    var s = tappa(t), p = s.p, q = s.q, k = s.k, st = html.style;
    st.setProperty('--t', t.toFixed(4));
    st.setProperty('--bg', mix(p.bg, q.bg, k));
    st.setProperty('--bg-2', mix(p.bg2, q.bg2, k));
    st.setProperty('--glow-a', mix(p.a, q.a, k));
    st.setProperty('--glow-b', mix(p.b, q.b, k));
    st.setProperty('--glow-c', mix(p.c, q.c, k));
    st.setProperty('--acc', mix(p.acc, q.acc, k));
    st.setProperty('--sole-y', lerp(p.sole, q.sole, k).toFixed(2) + 'vh');
    st.setProperty('--stelle', lerp(p.stelle, q.stelle, k).toFixed(3));
    st.setProperty('--luna', lerp(p.luna, q.luna, k).toFixed(3));
  }

  /* ---------- orologio: 08:00 → 12:00 → 19:00 → 23:00 sulle stesse soglie ---------- */
  var orologio = document.getElementById('ora');
  function oraDa(t) {
    var h;
    if (t <= 0.35) h = 8 + (t / 0.35) * 4;
    else if (t <= 0.65) h = 12 + ((t - 0.35) / 0.30) * 7;
    else h = 19 + ((t - 0.65) / 0.35) * 4;
    var m = Math.round((h % 1) * 60 / 5) * 5, H = Math.floor(h);
    if (m === 60) { m = 0; H++; }
    if (H >= 23) { H = 23; m = 0; }
    return (H < 10 ? '0' : '') + H + ':' + (m < 10 ? '0' : '') + m;
  }
  var ultimaOra = '';
  function aggiornaOrologio(t) {
    if (!orologio) return;
    var s = oraDa(t);
    if (s !== ultimaOra) { ultimaOra = s; orologio.textContent = s; }
    var f = FASI[t < 0.18 ? 0 : t < 0.5 ? 1 : t < 0.82 ? 2 : 3];
    if (html.getAttribute('data-fase-ora') !== f) html.setAttribute('data-fase-ora', f);
  }

  /* ---------- fine della giornata: dove comincia la notte piena ---------- */
  var notte = document.getElementById('notte');
  var fine = 0;
  function misura() {
    var top = notte ? notte.getBoundingClientRect().top + window.scrollY : window.innerHeight * 5;
    fine = Math.max(window.innerHeight * 2, top + window.innerHeight * 0.9);
    html.style.setProperty('--fine-giornata', Math.round(fine) + 'px');
  }

  /* ---------- scroll ---------- */
  var richiesto = false;
  function sulloScroll() {
    if (richiesto) return;
    richiesto = true;
    requestAnimationFrame(function () {
      richiesto = false;
      var t = fine ? Math.max(0, Math.min(1, window.scrollY / fine)) : 0;
      aggiornaOrologio(t);
      if (ridotto.matches) {
        /* senza movimento: la luce cambia a scatti, per fase */
        var f = FASI[t < 0.18 ? 0 : t < 0.5 ? 1 : t < 0.82 ? 2 : 3];
        if (html.getAttribute('data-fase') !== f) html.setAttribute('data-fase', f);
      } else if (!cssScroll) {
        applicaLuce(t);
      }
    });
  }
  window.addEventListener('scroll', sulloScroll, { passive: true });
  window.addEventListener('resize', function () { misura(); sulloScroll(); });
  window.addEventListener('load', function () { misura(); sulloScroll(); });
  misura(); sulloScroll();

  /* ---------- comparse: IntersectionObserver (fallback e capitoli) ---------- */
  if ('IntersectionObserver' in window) {
    var ioSale = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) { if (v.isIntersecting) { v.target.classList.add('in'); ioSale.unobserve(v.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    document.querySelectorAll('.sale, .righello').forEach(function (el) { ioSale.observe(el); });

    /* i blocchi di testo dei capitoli: compaiono e scelgono la foto della scena */
    var ioBlocchi = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        if (!v.isIntersecting) return;
        v.target.classList.add('in');
        var cap = v.target.closest('.capitolo');
        var k = v.target.getAttribute('data-foto');
        if (cap && k) {
          cap.querySelectorAll('.scena img').forEach(function (img) {
            img.classList.toggle('attiva', img.getAttribute('data-k') === k);
          });
        }
      });
    }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });
    document.querySelectorAll('.capitolo .blocco').forEach(function (b) { ioBlocchi.observe(b); });

    /* senza animation-timeline: la scena si apre quando il capitolo entra */
    if (!cssScroll) {
      var ioCap = new IntersectionObserver(function (voci) {
        voci.forEach(function (v) { if (v.isIntersecting) { v.target.classList.add('aperta'); ioCap.unobserve(v.target); } });
      }, { rootMargin: '0px 0px -30% 0px', threshold: 0.05 });
      document.querySelectorAll('.capitolo').forEach(function (c) { ioCap.observe(c); });
    }
  } else {
    document.querySelectorAll('.sale, .capitolo .blocco, .righello').forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('.capitolo').forEach(function (c) { c.classList.add('aperta'); });
  }
  /* la prima foto di ogni capitolo è visibile da subito */
  document.querySelectorAll('.capitolo .scena img:first-of-type').forEach(function (img) { img.classList.add('attiva'); });

  /* ---------- hero: parallasse leggera al mouse (solo con puntatore fine) ---------- */
  var hero = document.querySelector('.hero');
  var par = hero && hero.querySelector('.foto .par');
  var testo = hero && hero.querySelector('.testo');
  if (hero && par && window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches && !ridotto.matches) {
    var mx = 0, my = 0, cx = 0, cy = 0, vivo = false;
    function anima() {
      cx += (mx - cx) * 0.06; cy += (my - cy) * 0.06;
      par.style.transform = 'translate3d(' + (cx * 18).toFixed(2) + 'px,' + (cy * 14).toFixed(2) + 'px,0) scale(1.04)';
      if (testo) testo.style.setProperty('--px', (cx * -8).toFixed(2) + 'px');
      if (Math.abs(mx - cx) > 0.001 || Math.abs(my - cy) > 0.001) requestAnimationFrame(anima); else vivo = false;
    }
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
      if (!vivo) { vivo = true; requestAnimationFrame(anima); }
    });
    hero.addEventListener('mouseleave', function () { mx = 0; my = 0; if (!vivo) { vivo = true; requestAnimationFrame(anima); } });
  }

  /* ---------- anno nel piè di pagina non serve: la data è scritta a mano (novembre 2026) ---------- */
})();
