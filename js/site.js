// En-tête et pied de page communs, apparitions douces au défilement.
(function () {
  var de = document.documentElement;
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) de.classList.add('anim');

  document.addEventListener('DOMContentLoaded', function () {
    var isHome = !!document.querySelector('.dawn');
    var nav = document.querySelector('.nav');
    nav.innerHTML = '<div class="wrap"><a class="brand" href="./"><img src="img/first-light.svg" alt="" width="30" height="30">First Light</a>' +
      '<nav aria-label="Menu"><a href="./#apps">Apps</a><a class="opt" href="./#promesses">Nos promesses</a><a href="#contact">Contact</a></nav></div>';
    if (!isHome) nav.classList.add('glass');
    else nav.querySelector('.brand img').style.opacity = 0;

    document.querySelector('footer').innerHTML = '<div class="wrap" id="contact">' +
      '<div><a class="brand" href="./"><img src="img/first-light.svg" alt="" width="30" height="30">First Light</a>' +
      '<p style="max-width:340px;margin:0">Des apps claires pour le travail et le quotidien. Un studio <a href="https://hearthold-studio.github.io/">Hearthold</a>, en France.</p></div>' +
      '<div class="cols"><div><h4>Apps</h4><a href="deux-toits.html">Deux Toits</a><a href="lulu-doku.html">Lulu Doku</a></div>' +
      '<div><h4>Contact</h4><a href="mailto:moonbeamstudio.contact@gmail.com">moonbeamstudio.contact@gmail.com</a><a href="deux-toits.html#aide">Aide Deux Toits</a><a href="lulu-doku.html#aide">Aide Lulu Doku</a></div>' +
      '<div><h4>La maison</h4><a href="https://hearthold-studio.github.io/">Hearthold</a><a href="https://moonbeamstudio.github.io/">Moon Beam Studio</a><a href="https://hearthold-studio.github.io/legal.html">Mentions légales</a></div></div>' +
      '<p class="copy">© 2026 First Light · Hearthold · Fait en France</p></div>';

    if (!de.classList.contains('anim')) return;
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('main section:not(.dawn) :is(.eyebrow, h2, .lead, .promise, .card, .house, .shots img, .prose > *)').forEach(function (el) {
      el.classList.add('rv');
      el.style.setProperty('--d', Math.min(Array.prototype.indexOf.call(el.parentNode.children, el), 5) * 80 + 'ms');
      obs.observe(el);
    });
  });
})();
