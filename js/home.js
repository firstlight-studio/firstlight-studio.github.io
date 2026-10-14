// Accueil : le lever du jour. On arrive de nuit ; au défilement le soleil en bandes du logo se lève, le ciel passe
// à l'aube puis au jour, la moitié haute du soleil rejoint le logo de l'en-tête et ses trois bandes deviennent les
// cartes des apps. Tout passe par transform/opacity (plus le contour des bandes pendant leur métamorphose).
(function () {
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var io = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var out = function (t) { return 1 - Math.pow(1 - t, 3); };
  // bandes du logo (fraction du rayon sous le centre du soleil) et largeur finale des cartes
  var BANDS = [[.129, .324], [.488, .676], [.876, 1]];
  var TOP = [246, 202, 93], BOT = [231, 164, 76];
  var mix = function (t) { return 'rgb(' + TOP.map(function (c, i) { return Math.round(lerp(c, BOT[i], t)); }).join(',') + ')'; };

  document.addEventListener('DOMContentLoaded', function () {
    var sec = document.querySelector('.dawn');
    if (!sec) return;
    var q = function (s) { return sec.querySelector(s); };
    var pin = q('.pin'), sky = q('.sky'), stars = q('.stars'), star = q('.mstar'), disc = q('.disc'), glow = q('.glow');
    var bands = sec.querySelectorAll('.band'), caps = sec.querySelectorAll('.cap'), c3 = q('.cap.c3');
    var nav = document.querySelector('.nav'), mark = nav.querySelector('.brand img');
    var L = {}, last = {};

    for (var i = 0; i < 46; i++) {
      var s = document.createElement('i');
      s.style.left = (Math.random() * 100).toFixed(2) + '%';
      s.style.top = (Math.random() * 72).toFixed(2) + '%';
      if (Math.random() < .25) s.style.width = s.style.height = '3px';
      stars.appendChild(s);
    }
    bands.forEach(function (b, k) { b.style.background = 'linear-gradient(180deg,' + mix((1 + BANDS[k][0]) / 2) + ',' + mix((1 + BANDS[k][1]) / 2) + ')'; });

    function layout() {
      var w = pin.clientWidth, h = pin.clientHeight, mob = w < 640;
      var r = Math.min(w * (mob ? .34 : .26), h * .27, 250);
      var CH = mob ? 76 : 86, GAP = mob ? 12 : 14, CW = Math.min(w - (mob ? 32 : 80), 720);
      c3.style.top = (64 + (mob ? h * .05 : h * .1)) + 'px';
      var top = c3.offsetTop + c3.offsetHeight + (mob ? 26 : 40);
      var m = mark.getBoundingClientRect();
      L = { w: w, h: h, r: r, CH: CH, cx: w / 2, cy: h * (mob ? .6 : .58),
            mx: m.left + m.width / 2, my: m.top + m.height / 2, ms: m.width,
            cards: (mob ? [1, .95, .9] : [1, .92, .84]).map(function (f, k) { var cw = CW * f; return { x: (w - cw) / 2, y: top + k * (CH + GAP), w: cw }; }) };
      bands.forEach(function (b, k) { b.style.width = L.cards[k].w + 'px'; b.style.height = CH + 'px'; });
      sky.style.height = (h * 5) + 'px';
      disc.style.width = disc.style.height = '200px';
      star.style.width = star.style.height = '100px';
      last = {};
    }

    function set(el, x, y, sx, sy) { el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) scale(' + sx.toFixed(4) + ',' + (sy == null ? sx : sy).toFixed(4) + ')'; }
    function flag(key, el, cls, on) { if (last[key] !== on) { last[key] = on; el.classList.toggle(cls, on); } }

    function render(p) {
      var h = L.h, day = io(seg(p, .04, .76));
      sky.style.transform = 'translate3d(0,' + (-(4 * h) * (1 - day)).toFixed(1) + 'px,0)';
      stars.style.opacity = 1 - seg(p, .22, .5);

      // le soleil monte depuis le bas de l'écran, grandit un peu, puis se tient au centre
      var rise = io(seg(p, 0, .5)), r = L.r * lerp(.82, 1, rise);
      var cx = L.cx, cy = lerp(h + L.r * .3, L.cy, rise);
      var meta = seg(p, .6, .86);

      // la moitié haute : rejoint le logo de l'en-tête
      var d = io(seg(p, .6, .82)), dx = lerp(cx, L.mx, d), dy = lerp(cy - r / 2, L.my, d), dr = lerp(r, L.ms * .32, d);
      set(disc, dx - dr, dy - dr / 2, dr * 2 / 200);   // le svg du demi-disque fait 200 × 200 (moitié haute dessinée en haut)
      disc.style.opacity = 1 - seg(p, .78, .84);
      mark.style.opacity = sec.classList.contains('static') ? 1 : seg(p, .78, .84);

      // l'étoile du matin, en haut à gauche du soleil comme dans le logo ; le jour l'efface
      var ss = r * .46;
      set(star, cx - r * 1.12 - ss / 2, cy - r * .98 - ss / 2, ss / 100);
      star.style.opacity = seg(p, .02, .1) * (1 - seg(p, .44, .6));

      set(glow, cx, cy, r * 3.4 / 100);
      glow.style.opacity = (.55 + .45 * rise) * (1 - seg(p, .58, .74));

      // les trois bandes : tranches du soleil, puis cartes (même élément, mis à l'échelle)
      bands.forEach(function (b, k) {
        var a = BANDS[k][0], z = BANDS[k][1];
        var half = function (y) { return Math.sqrt(Math.max(0, 1 - y * y)) * r; };
        var bw = 2 * half(a), bh = (z - a) * r, bx = cx - half(a), by = cy + a * r;
        var c = L.cards[k], t = io(seg(p, .6 + k * .035, .84 + k * .035));
        var x = lerp(bx, c.x, t), y = lerp(by, c.y, t), sx = lerp(bw / c.w, 1, t), sy = lerp(bh / L.CH, 1, t);
        set(b, x, y, sx, sy);
        // contour : cercle du soleil (en coordonnées de la carte) qui s'ouvre, puis bords arrondis de la carte
        var ex = r / sx * (1 + t * 30), ey = r / sy * (1 + t * 30);
        var ox = (cx - x) / sx, oy = (cy - y) / sy;
        b.style.clipPath = t >= 1 ? 'none' : 'ellipse(' + ex.toFixed(1) + 'px ' + ey.toFixed(1) + 'px at ' + ox.toFixed(1) + 'px ' + oy.toFixed(1) + 'px)';
        b.style.borderRadius = (Math.min(1, t * 2.5) * L.CH / 2).toFixed(1) + 'px';
        b.style.boxShadow = t > .9 ? '0 14px 34px -16px rgba(120, 70, 20, .45)' : 'none';
        flag('b' + k, b, 'done', p >= .9);
      });

      flag('dark', nav, 'dark', p < .42);
      flag('glass', nav, 'glass', p > .74);
      var c = p < .12 ? 0 : p > .16 && p < .36 ? 1 : p > .38 && p < .58 ? 2 : p > .74 ? 3 : -1;
      if (last.c !== c) { last.c = c; caps.forEach(function (el, i) { el.classList.toggle('on', i === c); }); }
    }

    Scene(sec, { layout: layout, render: render, still: 1 });
    // « Apps » : la fin de la scène, quand les bandes sont devenues les cartes
    function toApps() { if (location.hash === '#apps') scrollTo(0, sec.offsetTop + sec.offsetHeight - pin.clientHeight); }
    addEventListener('load', toApps); addEventListener('hashchange', toApps);
  });
})();
