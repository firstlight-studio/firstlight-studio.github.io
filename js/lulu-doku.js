// Lulu Doku : une vraie grille 6 × 6 du jeu, jouable dans la page (générée par le moteur du jeu, solution unique).
// Un toucher : croix ou case vide. Deux touchers : Lulu. Une Lulu mal placée coûte un cœur, comme dans l'app.
(function () {
  var N = 6;
  var REG = [0,0,0,2,2,2, 0,0,0,2,1,1, 0,0,2,2,1,1, 0,4,2,2,5,3, 0,4,4,4,5,5, 4,4,5,5,5,5];
  var SOL = [0, 10, 14, 23, 25, 33];
  var COL = ['#aee38f', '#ffdc72', '#ffa595', '#ffa8d6', '#cfa9ff', '#9db2ff'];   // couleur de chaque zone (palette Bonbon)
  var LULU = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M22 26 C7 25 4 50 9 63 C12 71 22 71 25 63 C28 54 30 38 28 30 Z" fill="#a8653a"/><path d="M78 26 C93 25 96 50 91 63 C88 71 78 71 75 63 C72 54 70 38 72 30 Z" fill="#a8653a"/><circle cx="50" cy="52" r="32" fill="#f0b97e"/><ellipse cx="50" cy="65" rx="18" ry="14" fill="#fff4e6"/><ellipse cx="38.5" cy="49" rx="5" ry="6.2" fill="#241c2c"/><ellipse cx="61.5" cy="49" rx="5" ry="6.2" fill="#241c2c"/><circle cx="40.2" cy="46.6" r="1.8" fill="#fff"/><circle cx="63.2" cy="46.6" r="1.8" fill="#fff"/><ellipse cx="50" cy="58.5" rx="6.4" ry="4.6" fill="#241c2c"/><path d="M43.5 67 Q50 72.5 56.5 67" fill="none" stroke="#241c2c" stroke-width="2.6" stroke-linecap="round"/></svg>';

  var play = document.querySelector('.ld-play');
  if (!play) return;
  var board = play.querySelector('.ld-board'), msg = play.querySelector('.ld-msg'), heartsEl = play.querySelector('.ld-hearts'), win = play.querySelector('.ld-win');
  play.querySelector('.ld-win-lulu').innerHTML = LULU;
  var state, hearts, cells = [], pending = null;

  // les zones en tuiles : un liseré blanc entre deux zones, et les coins arrondis là où deux bords se rejoignent
  function zone(r, c) { return r < 0 || c < 0 || r >= N || c >= N ? -1 : REG[r * N + c]; }
  for (var i = 0; i < N * N; i++) {
    var r = Math.floor(i / N), c = i % N, z = REG[i];
    var t = zone(r - 1, c) !== z, b = zone(r + 1, c) !== z, l = zone(r, c - 1) !== z, rt = zone(r, c + 1) !== z;
    var el = document.createElement('button');
    el.type = 'button'; el.className = 'ld-cell'; el.dataset.i = i; el.setAttribute('role', 'gridcell');
    el.style.background = COL[z];
    el.style.boxShadow = [t && 'inset 0 2px #fff', b && 'inset 0 -2px #fff', l && 'inset 2px 0 #fff', rt && 'inset -2px 0 #fff', 'inset 0 0 0 .5px rgba(32,29,63,.13)'].filter(Boolean).join(',');
    el.style.borderRadius = [t && l, t && rt, b && rt, b && l].map(function (k) { return k ? '28%' : '0'; }).join(' ');
    el.setAttribute('aria-label', 'Ligne ' + (r + 1) + ', colonne ' + (c + 1));
    board.appendChild(el); cells.push(el);
  }

  function reset() {
    state = new Array(N * N).fill(''); hearts = 3; pending = null;
    board.classList.remove('won'); win.classList.remove('on');
    render(); say('Place 6 Lulu.');
  }
  function say(t) { msg.textContent = t; }
  function render() {
    cells.forEach(function (el, i) {
      el.classList.toggle('x', state[i] === 'x');
      el.classList.toggle('lulu', state[i] === 'lulu');
      if (state[i] === 'lulu' && !el.firstChild) el.innerHTML = LULU;
      if (state[i] !== 'lulu') el.innerHTML = '';
    });
    heartsEl.textContent = '❤️'.repeat(hearts) + '🤍'.repeat(3 - hearts);
    heartsEl.setAttribute('aria-label', hearts + ' cœur' + (hearts > 1 ? 's' : ''));
  }
  function cross(i) { state[i] = state[i] === 'x' ? '' : state[i] === 'lulu' ? '' : 'x'; render(); }
  function lulu(i) {
    if (state[i] === 'lulu') { state[i] = ''; render(); return; }
    if (SOL.indexOf(i) < 0) {
      hearts--; state[i] = ''; render();
      cells[i].classList.remove('bad'); void cells[i].offsetWidth; cells[i].classList.add('bad');
      if (navigator.vibrate) navigator.vibrate(40);
      if (hearts <= 0) { board.style.pointerEvents = 'none'; say('Plus de cœurs ! On recommence ?'); }
      else say('Pas là : Lulu y serait gênée. Il reste ' + hearts + ' cœur' + (hearts > 1 ? 's' : '') + '.');
      return;
    }
    state[i] = 'lulu'; render();
    var placed = SOL.filter(function (k) { return state[k] === 'lulu'; }).length;
    say(placed === 6 ? 'Grille réussie !' : placed + ' Lulu sur 6.');
    if (placed === 6) { board.classList.add('won'); setTimeout(function () { win.classList.add('on'); }, 900); }
  }
  board.addEventListener('click', function (e) {
    var el = e.target.closest('.ld-cell'); if (!el) return;
    var i = +el.dataset.i;
    if (pending && pending.i === i) { clearTimeout(pending.t); pending = null; lulu(i); return; }   // deuxième toucher : Lulu
    if (pending) { clearTimeout(pending.t); cross(pending.i); }
    pending = { i: i, t: setTimeout(function () { pending = null; cross(i); }, 260) };
  });
  board.addEventListener('keydown', function (e) {   // au clavier : L pour Lulu
    var el = e.target.closest('.ld-cell'); if (el && (e.key === 'l' || e.key === 'L')) lulu(+el.dataset.i);
  });
  play.querySelectorAll('.ld-reset').forEach(function (b) { b.addEventListener('click', function () { board.style.pointerEvents = ''; reset(); }); });
  reset();
})();
