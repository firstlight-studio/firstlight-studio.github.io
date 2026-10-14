# Site First Light

Site statique du studio First Light (apps), publié sur https://firstlight-studio.github.io (GitHub Pages, branche main).

- `index.html` : accueil, scène « le lever du jour » (`js/home.js`).
- `deux-toits.html` : page de Deux Toits, scène de la semaine (`js/deux-toits.js`) ; sert d'aide (#aide) et de confidentialité (#confidentialite) pour l'App Store.
- `js/scene.js` : moteur commun des scènes au défilement (épinglage, lissage, image fixe si « réduire les animations »).
- `js/site.js` : en-tête, pied de page, apparitions.
- Après une modification de CSS/JS, augmenter `?v=` dans les pages (Safari garde l'ancienne version en cache).

Aucun script externe, aucune police chargée d'ailleurs, aucun traceur.
