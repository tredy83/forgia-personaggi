/* Generatore di simbolo (stemma araldico in SVG) e nome per il riquadro SIMBOLO della scheda, coerenti con la classe. */
(function (G) {
  const X = (G.FORGIA_X = G.FORGIA_X || {});
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const S5 = (cx, cy, R, r, n) => { let p = ''; for (let i = 0; i < n * 2; i++) { const a = Math.PI * i / n - Math.PI / 2, q = i % 2 ? r : R; p += (i ? 'L' : 'M') + (cx + q * Math.cos(a)).toFixed(1) + ' ' + (cy + q * Math.sin(a)).toFixed(1); } return p + 'Z'; };
  /* cariche: disegnate in un quadrato 0..100, da colorare con "fill" */
  const CARICHE = {
    spada: { n: 'Spada', g: 'f', d: '<path d="M50 14 L57 24 V70 H43 V24 Z"/><rect x="30" y="68" width="40" height="7" rx="2"/><rect x="46" y="75" width="8" height="14"/><circle cx="50" cy="92" r="4.5"/>' },
    stella: { n: 'Stella', g: 'f', d: '<path d="' + S5(50, 52, 38, 16, 5) + '"/>' },
    stella8: { n: 'Stella', g: 'f', d: '<path d="' + S5(50, 50, 40, 15, 8) + '"/>' },
    luna: { n: 'Luna', g: 'f', d: '<path d="M64 14 A38 38 0 1 0 64 88 A30 30 0 1 1 64 14 Z"/>' },
    sole: { n: 'Sole', g: 'm', d: '<circle cx="50" cy="50" r="19"/>' + [...Array(12)].map((_, i) => { const a = i * Math.PI / 6; return '<path d="M' + (50 + 26 * Math.cos(a - .12)).toFixed(1) + ' ' + (50 + 26 * Math.sin(a - .12)).toFixed(1) + ' L' + (50 + 42 * Math.cos(a)).toFixed(1) + ' ' + (50 + 42 * Math.sin(a)).toFixed(1) + ' L' + (50 + 26 * Math.cos(a + .12)).toFixed(1) + ' ' + (50 + 26 * Math.sin(a + .12)).toFixed(1) + 'Z"/>'; }).join('') },
    torre: { n: 'Torre', g: 'f', d: '<path d="M26 90 V38 H20 V16 H32 V24 H42 V16 H58 V24 H68 V16 H80 V38 H74 V90 Z"/><path fill="#0006" d="M44 90 V64 A6 6 0 0 1 56 64 V90 Z"/>' },
    quercia: { n: 'Quercia', g: 'f', d: '<circle cx="50" cy="34" r="24"/><circle cx="30" cy="48" r="18"/><circle cx="70" cy="48" r="18"/><path d="M44 52 H56 L60 92 H40 Z"/>' },
    fiamma: { n: 'Fiamma', g: 'f', d: '<path d="M50 8 C58 28 78 38 74 62 C72 78 62 90 50 90 C38 90 26 78 28 62 C29 52 36 46 40 38 C42 46 46 48 48 46 C52 36 46 24 50 8 Z"/>' },
    chiave: { n: 'Chiave', g: 'f', d: '<circle cx="50" cy="26" r="16"/><circle cx="50" cy="26" r="7" fill="#0007"/><rect x="45" y="40" width="10" height="52"/><rect x="55" y="66" width="14" height="7"/><rect x="55" y="80" width="10" height="7"/>' },
    corona: { n: 'Corona', g: 'f', d: '<path d="M14 74 L20 30 L38 52 L50 22 L62 52 L80 30 L86 74 Z"/><rect x="14" y="78" width="72" height="10" rx="2"/>' },
    ascia: { n: 'Ascia', g: 'f', d: '<rect x="46" y="12" width="8" height="80" rx="3"/><path d="M54 18 C84 14 92 42 84 60 C76 52 66 52 54 56 Z"/>' },
    montagna: { n: 'Montagna', g: 'f', d: '<path d="M6 86 L38 24 L52 52 L64 34 L94 86 Z"/>' },
    onda: { n: 'Onda', g: 'f', d: '<path d="M8 40 Q22 24 36 40 T64 40 T92 40 V52 Q78 36 64 52 T36 52 T8 52 Z"/><path d="M8 64 Q22 48 36 64 T64 64 T92 64 V76 Q78 60 64 76 T36 76 T8 76 Z"/>' },
    martello: { n: 'Martello', g: 'm', d: '<rect x="20" y="16" width="60" height="26" rx="4"/><rect x="45" y="40" width="10" height="52" rx="3"/>' },
    libro: { n: 'Libro', g: 'm', d: '<path d="M10 24 Q30 16 48 26 V86 Q30 76 10 84 Z"/><path d="M90 24 Q70 16 52 26 V86 Q70 76 90 84 Z"/>' },
    occhio: { n: 'Occhio', g: 'm', d: '<path d="M6 50 Q50 6 94 50 Q50 94 6 50 Z"/><circle cx="50" cy="50" r="15" fill="#0008"/><circle cx="50" cy="50" r="6" fill="#fff"/>' },
    goccia: { n: 'Goccia', g: 'f', d: '<path d="M50 8 C64 34 78 48 78 64 C78 82 66 92 50 92 C34 92 22 82 22 64 C22 48 36 34 50 8 Z"/>' },
    elmo: { n: 'Elmo', g: 'm', d: '<path d="M24 86 V44 C24 24 38 12 50 12 C62 12 76 24 76 44 V86 H62 V56 H38 V86 Z"/><rect x="40" y="38" width="20" height="7" fill="#0008"/>' },
    scudo: { n: 'Scudo', g: 'm', d: '<path d="M22 14 H78 V54 C78 74 62 86 50 92 C38 86 22 74 22 54 Z"/>' },
    foglia: { n: 'Foglia', g: 'f', d: '<path d="M18 86 C14 40 40 14 86 14 C90 56 66 84 22 82 Z"/><path d="M22 82 L66 36" stroke="#0007" stroke-width="4" fill="none"/>' },
    artiglio: { n: 'Artiglio', g: 'm', d: '<path d="M30 12 C36 44 28 70 18 90 C46 80 72 60 80 22 C62 40 52 40 30 12 Z"/>' },
  };
  const PER_CLASSE = {
    barbaro: ['ascia', 'montagna', 'fiamma', 'artiglio'], bardo: ['libro', 'stella', 'corona', 'luna'], chierico: ['sole', 'fiamma', 'libro', 'goccia'],
    druido: ['quercia', 'luna', 'onda', 'foglia'], guerriero: ['spada', 'scudo', 'torre', 'ascia', 'elmo'], ladro: ['chiave', 'luna', 'occhio', 'artiglio'],
    mago: ['stella8', 'luna', 'libro', 'occhio'], monaco: ['montagna', 'onda', 'fiamma', 'goccia'], paladino: ['spada', 'sole', 'corona', 'torre', 'scudo'],
    ranger: ['quercia', 'foglia', 'montagna', 'artiglio'], stregone: ['fiamma', 'stella8', 'occhio', 'goccia'], warlock: ['occhio', 'luna', 'chiave', 'stella8'],
  };
  /* coppie campo + carica (colori ben leggibili anche in stampa) */
  const COL = { rosso: ['#b3262e', 'rosso', 'rossa'], blu: ['#1f4e9c', 'blu', 'blu'], verde: ['#2b7a4b', 'verde', 'verde'], nero: ['#23201f', 'nero', 'nera'], viola: ['#6a3fa0', 'viola', 'viola'], bianco: ['#f3efe4', 'bianco', 'bianca'], oro: ['#e1ad2f', 'dorato', 'dorata'], argento: ['#c7ccd4', 'argentato', 'argentata'] };
  const SCURI = ['rosso', 'blu', 'verde', 'nero', 'viola'], CHIARI = ['bianco', 'oro', 'argento'];
  const FORME = {
    araldico: 'M8 6 H92 V58 C92 88 68 106 50 114 C32 106 8 88 8 58 Z',
    tondo: 'M50 8 A44 44 0 1 1 49.9 8 Z',
    rombo: 'M50 4 L94 58 L50 116 L6 58 Z',
    banda: 'M10 6 H90 V92 L50 114 L10 92 Z',
    arco: 'M10 118 V44 C10 22 28 6 50 6 C72 6 90 22 90 44 V118 Z',
  };
  const TIPI = ['Ordine', 'Compagnia', 'Casata', 'Gilda', 'Confraternita', 'Clan', 'Legione', 'Fratellanza', 'Congrega'];
  X.simboloGenera = (ch) => {
    const cl = ch && ch.livelli && ch.livelli[0];
    const cid = Math.random() < 0.75 && PER_CLASSE[cl] ? pick(PER_CLASSE[cl]) : pick(Object.keys(CARICHE));
    const campoScuro = Math.random() < 0.7; const campo = pick(campoScuro ? SCURI : CHIARI);
    let carica = pick(campoScuro ? CHIARI : SCURI); const c2 = pick(Object.keys(COL).filter((k) => k !== campo && k !== carica));
    const c = CARICHE[cid]; const adj = COL[carica][c.g === 'm' ? 1 : 2];
    const tipo = pick(TIPI); const vocale = /^[AEIOU]/.test(c.n); const art = vocale ? 'dell\'' : (c.g === 'm' ? 'del ' : 'della ');
    const nome = tipo + ' ' + art + c.n + ' ' + adj.charAt(0).toUpperCase() + adj.slice(1);
    return { nome, forma: pick(Object.keys(FORME)), campo, div: pick(['pieno', 'pieno', 'palo', 'fascia', 'banda', 'capo']), c2, carica: cid, colCarica: carica };
  };
  X.simboloSVG = (s, w, h) => {
    if (!s) return '';
    const id = 'sy' + Math.random().toString(36).slice(2, 7); const f = FORME[s.forma] || FORME.araldico; const campo = COL[s.campo][0], c2 = COL[s.c2][0], cc = COL[s.colCarica][0];
    const dv = { pieno: '', palo: '<rect x="50" y="0" width="60" height="130" fill="' + c2 + '"/>', fascia: '<rect x="0" y="0" width="110" height="60" fill="' + c2 + '"/>', banda: '<path d="M0 0 H60 L110 50 V130 L0 70 Z" fill="' + c2 + '" opacity="0"/><path d="M-10 20 L60 -10 L120 100 L50 130 Z" fill="' + c2 + '" opacity="0"/><path d="M0 0 H110 V40 L0 110 Z" fill="' + c2 + '"/>', capo: '<rect x="0" y="0" width="110" height="34" fill="' + c2 + '"/>' }[s.div] || '';
    const car = CARICHE[s.carica]; const sc = s.div === 'capo' ? 0.5 : 0.56; const ty = s.div === 'capo' ? 66 : 60;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="' + (w || 100) + '" height="' + (h || 120) + '"><defs><clipPath id="' + id + '"><path d="' + f + '"/></clipPath></defs>'
      + '<path d="' + f + '" fill="' + campo + '"/><g clip-path="url(#' + id + ')">' + dv + '</g>'
      + '<g transform="translate(' + (50 - 50 * sc).toFixed(1) + ' ' + (ty - 50 * sc).toFixed(1) + ') scale(' + sc + ')" fill="' + cc + '" stroke="#000" stroke-width="3" stroke-linejoin="round" paint-order="stroke">' + car.d + '</g>'
      + '<path d="' + f + '" fill="none" stroke="#111" stroke-width="3.5" stroke-linejoin="round"/></svg>';
  };
})(window);
