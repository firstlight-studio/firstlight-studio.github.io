// Moteur commun des scènes au défilement : une section haute dont l'intérieur reste épinglé à l'écran,
// et une fonction render(p) appelée avec p de 0 à 1. Le défilement est lissé (inertie courte) pour que
// la molette et le doigt donnent un mouvement continu ; rien n'est lu dans la page pendant l'image.
// Sans animation (« réduire les animations ») : render(still) une fois, image fixe.
window.Scene = function (sec, opts) {
  var pin = sec.querySelector('.pin');
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var top = 0, span = 1, target = 0, cur = -1, last = 0, running = false;
  var TAU = .085; // secondes : temps de rattrapage du lissage

  function measure() {
    top = sec.getBoundingClientRect().top + scrollY;
    span = Math.max(1, sec.offsetHeight - pin.clientHeight);
  }
  function read() { var p = (scrollY - top) / span; return p < 0 ? 0 : p > 1 ? 1 : p; }
  function tick(now) {
    var dt = Math.min(.05, (now - last) / 1000 || .016); last = now;
    var d = target - cur;
    cur = Math.abs(d) < 1e-4 ? target : cur + d * (1 - Math.exp(-dt / TAU));
    opts.render(cur);
    if (cur !== target) requestAnimationFrame(tick); else running = false;
  }
  function wake() {
    target = read();
    if (!running && target !== cur) { running = true; last = performance.now(); requestAnimationFrame(tick); }
  }
  function resize() { measure(); opts.layout && opts.layout(); opts.render(cur); if (!still) wake(); }

  if (still) sec.classList.add('static');
  measure(); opts.layout && opts.layout();
  cur = target = still ? opts.still : read();
  opts.render(cur);
  sec.classList.add('ready');
  addEventListener('resize', resize);
  if (!still) {
    addEventListener('scroll', wake, { passive: true });
    addEventListener('load', function () { measure(); wake(); });
  }
};
