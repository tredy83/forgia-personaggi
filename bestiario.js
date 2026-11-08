/* BESTIARIO per il Dungeon Master (solo gestori): ricerca dei mostri, scheda completa, liste d'avventura
   e carte stampabili fronte/retro (fronte = statistiche, retro = immagine) con formato che si adatta alla quantità di testo.
   I dati dei mostri NON sono nel sito: si importano da file (una volta) e restano nell'archivio privato dei gestori. */
(function (G) {
  const X = (G.FORGIA_X = G.FORGIA_X || {}); const C = G.FORGIA_CLOUD || { attivo: false };
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, "'");
  const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const $ = (s, r) => (r || document).querySelector(s);
  const uid = () => 'av' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  /* ---------- archivio locale (IndexedDB, con riserva in memoria) ---------- */
  const kv = (() => {
    const mem = new Map(); let p = null;
    const apri = () => p || (p = new Promise((ok, ko) => { try { const r = G.indexedDB.open('forgia-bestiario', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); } catch (e) { ko(e); } }));
    const op = (modo, f) => apri().then((db) => new Promise((ok, ko) => { const q = f(db.transaction('kv', modo).objectStore('kv')); q.onsuccess = () => ok(q.result); q.onerror = () => ko(q.error); }));
    return {
      get: (k) => (G.indexedDB ? op('readonly', (s) => s.get(k)).catch(() => mem.get(k)) : Promise.resolve(mem.get(k))),
      set: (k, v) => { mem.set(k, v); return G.indexedDB ? op('readwrite', (s) => s.put(v, k)).catch(() => {}) : Promise.resolve(); },
      del: (k) => { mem.delete(k); return G.indexedDB ? op('readwrite', (s) => s.delete(k)).catch(() => {}) : Promise.resolve(); },
    };
  })();
  const cloud = () => C.attivo && C.utente && C.utente.ruolo === 'gestore';

  /* ---------- stato ---------- */
  const B = { mostri: null, carico: false, errore: '', imgIds: new Set(), imgMem: new Map(), avv: [], avvId: null, tab: 'cerca', q: '', tipo: '', tg: '', fo: '', gsMin: '', gsMax: '', sel: null, sc: new Set(), sa: new Set(), dlg: '', modo: 'bes', limite: 40, msg: '', imp: '', opz: { dorso: 'immagine', leggi: 'normale', esemplari: false, ordine: 'nome' }, stampa: '', prep: false };
  let ridisegna = () => {};
  const TIPI_FIX = { '/mmondo': 'Immondo', 'Elemento/e': 'Elementale', 'Folle.tto': 'Folletto', Giganle: 'Gigante' };
  const nomeNorm = (n) => String(n || '').trim().replace(/\s+/g, ' ').toLowerCase();
  const nomeEsiste = (n, escludiId) => B.avv.some((a) => a.id !== escludiId && nomeNorm(a.nome) === nomeNorm(n));
  const toast = (txt) => { let t = document.getElementById('bes-toast'); if (!t) { t = document.createElement('div'); t.id = 'bes-toast'; document.body.appendChild(t); } t.textContent = txt; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 3200); };
  const inAvv = (id) => { const a = B.avv.find((x) => x.id === B.avvId); const v = a && (a.voci || []).find((x) => x.id === id); return v ? 1 : 0; };
  const FONTI = { mm: { n: 'Manuale dei Mostri', s: 'Man. Mostri' }, mtm: { n: 'Mordenkainen presenta: Mostri del Multiverso', s: 'Mostri Multiverso' }, pers: { n: 'Mostro personalizzato', s: 'Pers.' } };
  const origine = (m, breve) => (m.fo === 'pers' ? (m.av || (breve ? 'Pers.' : 'Mostro personalizzato')) : (breve ? fonte(m).s : fonte(m).n) + ' · p. ' + m.pg);
  const fonte = (m) => FONTI[m.fo || 'mm'] || { n: String(m.fo), s: String(m.fo) };
  const gsT = (m) => (m.gs === '' || m.gs == null ? '—' : m.gs);
  const GSV = (g) => { const s = String(g || '0'); if (s.includes('/')) { const [a, b] = s.split('/'); return Number(a) / Number(b); } return Number(s) || 0; };
  const pePunti = (n) => (n == null ? '' : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
  const mod = (v) => { const m = Math.floor((v - 10) / 2); return (m >= 0 ? '+' : '−') + Math.abs(m); };

  async function carica(forza) {
    if (B.carico && !forza) return; B.errore = '';
    try {
      let lista = null;
      if (cloud()) { try { lista = await C.mostriLeggi(); if (lista.length) await kv.set('mostri', lista); } catch (e) { B.errore = e.message; } }
      if (!lista || !lista.length) lista = (await kv.get('mostri')) || [];
      lista = lista.filter((m) => m.fo !== 'pers');
      let pers = [];
      if (cloud()) { try { pers = await C.persLeggi(); await kv.set('pers', pers); } catch (e) { B.errore = B.errore || e.message; pers = (await kv.get('pers')) || []; } } else pers = (await kv.get('pers')) || [];
      let mods = [];
      if (cloud()) { try { mods = await C.modLeggi(); await kv.set('mod', mods); } catch (e) { B.errore = B.errore || e.message; mods = (await kv.get('mod')) || []; } } else mods = (await kv.get('mod')) || [];
      const mm = new Map(mods.map((x) => [x.id, x])); lista = lista.map((m) => (mm.has(m.id) ? Object.assign({}, mm.get(m.id), { mod: true }) : m));
      pers.forEach((m) => { m.fo = 'pers'; }); lista = lista.concat(pers);
      lista.forEach((m) => { if (TIPI_FIX[m.tipo]) m.tipo = TIPI_FIX[m.tipo]; });
      B.mostri = lista.slice().sort((a, b) => a.n.localeCompare(b.n, 'it') || (a.id - b.id));
      B.mappa = new Map(B.mostri.map((m) => [m.id, m]));
      B.imgIds = new Set(cloud() ? await C.imgIndice().catch(async () => (await kv.get('imgids')) || []) : ((await kv.get('imgids')) || []));
      B.avv = cloud() ? await C.avvLeggi().catch(async () => (await kv.get('avv')) || []) : ((await kv.get('avv')) || []);
      if (cloud()) { kv.set('imgids', [...B.imgIds]); kv.set('avv', B.avv); }
      const visti = new Set(); const cambiate = [];
      B.avv.forEach((a) => { let n = nomeNorm(a.nome), k = 2; const base = String(a.nome || 'Avventura').trim(); while (visti.has(n)) { a.nome = base + ' (' + k++ + ')'; n = nomeNorm(a.nome); cambiate.push(a); } visti.add(n); });
      for (const a of cambiate) await salvaAvv(a).catch(() => {});
      if (!B.avvId && B.avv.length) B.avvId = B.avv[0].id;
    } catch (e) { B.errore = e.message || String(e); B.mostri = B.mostri || []; B.mappa = B.mappa || new Map(); }
    B.carico = true; ridisegna();
  }
  async function leggiImg(id) {
    if (B.imgMem.has(id)) return B.imgMem.get(id);
    if (!B.imgIds.has(id)) return null;
    let d = await kv.get('img:' + id);
    if (!d && cloud()) { try { d = await C.imgLeggi(id); if (d) kv.set('img:' + id, d); } catch (e) { d = null; } }
    if (d) B.imgMem.set(id, d); return d || null;
  }
  async function salvaImg(id, dataUrl) {
    if (cloud()) await C.imgScrivi(id, dataUrl);
    await kv.set('img:' + id, dataUrl); B.imgMem.set(id, dataUrl); B.imgIds.add(id); await kv.set('imgids', [...B.imgIds]);
  }
  async function togliImg(id) {
    if (cloud()) await C.imgElimina(id);
    await kv.del('img:' + id); B.imgMem.delete(id); B.imgIds.delete(id); await kv.set('imgids', [...B.imgIds]);
  }
  async function salvaAvv(a) {
    a.aggiornato = new Date().toISOString();
    if (cloud()) await C.avvScrivi(a);
    await kv.set('avv', B.avv);
  }
  const avvCorr = () => B.avv.find((a) => a.id === B.avvId) || null;

  /* ---------- ridimensionamento immagini (max 800 px, JPEG) ---------- */
  function riduciImg(file, max) {
    return new Promise((ok, ko) => {
      const rd = new FileReader();
      rd.onerror = () => ko(new Error('file illeggibile'));
      rd.onload = () => {
        const im = new Image();
        im.onerror = () => ko(new Error('immagine non valida'));
        im.onload = () => {
          const k = Math.min(1, (max || 800) / Math.max(im.width, im.height)); const c = document.createElement('canvas');
          c.width = Math.max(1, Math.round(im.width * k)); c.height = Math.max(1, Math.round(im.height * k));
          const cx = c.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height); cx.drawImage(im, 0, 0, c.width, c.height);
          let q = 0.84; let d = c.toDataURL('image/jpeg', q); while (d.length > 340000 && q > 0.45) { q -= 0.08; d = c.toDataURL('image/jpeg', q); }
          ok(d);
        };
        im.src = rd.result;
      };
      rd.readAsDataURL(file);
    });
  }

  /* ---------- scheda del mostro (a schermo e per le carte) ---------- */
  const para = (t) => esc(t).replace(/\n/g, '<br>');
  const riga = (et, v) => (v ? '<p><b class="et">' + et + '</b> ' + esc(v) + '</p>' : '');
  function sezione(tit, voci) {
    if (!voci || !voci.length) return '';
    return '<h5>' + tit + '</h5>' + voci.map((v) => '<p>' + (v.n ? '<b><i>' + esc(v.n) + '.</i></b> ' : '') + para(v.t) + '</p>').join('');
  }
  function corpoHTML(m) {
    const ab = ['FOR', 'DES', 'COS', 'INT', 'SAG', 'CAR'];
    return '<p><b class="et">Classe Armatura</b> ' + esc(m.ca) + (m.caN ? ' (' + esc(m.caN) + ')' : '') + '</p>'
      + '<p><b class="et">Punti Ferita</b> ' + esc(m.pf) + (m.dadi ? ' (' + esc(m.dadi) + ')' : '') + '</p>' + riga('Velocità', m.vel)
      + '<div class="mb-ab">' + ab.map((a, i) => '<div><b>' + a + '</b><span>' + esc(m.car[i]) + ' (' + mod(m.car[i]) + ')</span></div>').join('') + '</div>'
      + riga('Tiri Salvezza', m.ts) + riga('Abilità', m.ab) + riga('Vulnerabilità ai Danni', m.vu) + riga('Resistenze ai Danni', m.rs) + riga('Immunità ai Danni', m.im) + riga('Immunità alle Condizioni', m.ic)
      + riga('Sensi', m.se) + riga(m.fo === 'mtm' ? 'Lingue' : 'Linguaggi', m.li || '—') + '<p><b class="et">Sfida</b> ' + esc(m.gs) + (m.gs === '' || m.gs == null ? '—' : ' (' + pePunti(m.pe) + ' PE)') + (m.bp ? '; <b class="et">Bonus di competenza</b> ' + esc(m.bp) : '') + '</p><hr class="mb-hr">'
      + (m.tr || []).map((v) => '<p>' + (v.n ? '<b><i>' + esc(v.n) + '.</i></b> ' : '') + para(v.t) + '</p>').join('')
      + sezione('Azioni', m.az) + sezione('Azioni Bonus', m.bz) + sezione('Reazioni', m.re) + sezione('Azioni Leggendarie', m.le);
  }
  const tipoRiga = (m) => esc([m.tipo, m.tg].filter(Boolean).join(' ') + (m.sub ? ' (' + m.sub + ')' : '') + (m.al ? ', ' + m.al : ''));
  const ricercaImg = (m) => 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(m.n + ' D&D 5e art');

  /* ---------- carte ---------- */
  const FORMATI = [
    { k: 'S', nome: 'piccola', w: 63, h: 88, col: 1, max: 7.2, min: 6.0, per: 9, nc: 3, nr: 3, ox: 10.5, oy: 16.5, spec: true },
    { k: 'M', nome: 'media', w: 95, h: 135, col: 1, max: 8.2, min: 7.0, per: 4, nc: 2, nr: 2, ox: 10, oy: 13.5, spec: true },
    { k: 'L', nome: 'grande', w: 190, h: 135, col: 2, max: 9.2, min: 7.6, per: 2, nc: 1, nr: 2, ox: 10, oy: 13.5, spec: false },
    { k: 'XL', nome: 'foglio intero', w: 190, h: 277, col: 2, max: 10.4, min: 7.4, per: 1, nc: 1, nr: 1, ox: 10, oy: 10, spec: false },
  ];
  const LOGO = 'logo-argini-bn.png';
  function creaFronte(m, f) {
    const el = document.createElement('div'); el.className = 'mcard f-' + f.k; el.style.width = f.w + 'mm'; el.style.height = f.h + 'mm';
    el.innerHTML = '<div class="mc-in"><div class="mc-head"><div class="mc-nome">' + esc(m.n) + '</div><div class="mc-tipo">' + tipoRiga(m) + '</div></div>'
      + '<div class="mc-body"><div class="mc-fit mb">' + corpoHTML(m) + '</div></div>'
      + '<div class="mc-foot"><span>Sfida ' + esc(gsT(m)) + '</span><span>' + esc(origine(m, f.k === 'S')) + '</span></div></div>';
    return el;
  }
  function entra(el, f, minPt) {
    const body = el.querySelector('.mc-body'); const fit = el.querySelector('.mc-fit');
    const due = body.classList.contains('due');
    const sfora = () => (!due && fit.scrollHeight > body.clientHeight - 2) || body.scrollWidth > body.clientWidth + 0.5;
    for (let sz = f.max; sz >= minPt - 1e-6; sz = Math.round((sz - 0.1) * 10) / 10) { fit.style.fontSize = sz + 'pt'; if (!sfora()) return sz; }
    fit.style.fontSize = minPt + 'pt'; return sfora() ? 0 : minPt;
  }
  async function scegliFormato(m, stage, grande) {
    const extra = grande ? 0.6 : 0;
    for (const f of FORMATI) {
      const c = creaFronte(m, f); stage.appendChild(c); const body = c.querySelector('.mc-body'); if (f.col > 1) body.classList.add('due'); adattaNome(c, f);
      const sz = entra(c, f, f.min + extra);
      if (sz) return { f, c, sz };
      c.remove();
    }
    const f = FORMATI[FORMATI.length - 1]; const c = creaFronte(m, f); stage.appendChild(c); c.querySelector('.mc-body').classList.add('due'); adattaNome(c, f);
    const body = c.querySelector('.mc-body'), fit = c.querySelector('.mc-fit');
    let sz = f.min; while (sz > 4.5 && (body.scrollWidth > body.clientWidth + 0.5)) { sz = Math.round((sz - 0.1) * 10) / 10; fit.style.fontSize = sz + 'pt'; }
    return { f, c, sz };
  }
  function adattaNome(c, f) { const n = c.querySelector('.mc-nome'); let z = { S: 11, M: 14, L: 17, XL: 20 }[f.k]; n.style.fontSize = z + 'pt'; while (z > 6 && n.scrollWidth > n.clientWidth + 0.5) { z -= 0.4; n.style.fontSize = z + 'pt'; } }
  function creaRetro(m, f, img, dorso) {
    const el = document.createElement('div'); el.className = 'mcard dorso f-' + f.k; el.style.width = f.w + 'mm'; el.style.height = f.h + 'mm';
    if (dorso === 'immagine' && img) el.innerHTML = '<div class="mc-in mc-img"><img src="' + img + '" alt=""><div class="mc-cap">' + esc(m.n) + '</div></div>';
    else if (dorso === 'bianco') el.innerHTML = '<div class="mc-in mc-vuoto"><div class="mc-cap2">' + esc(m.n) + '</div></div>';
    else el.innerHTML = '<div class="mc-in mc-logo"><img src="' + LOGO + '" alt=""><div class="mc-cap2">' + esc(m.n) + '</div></div>';
    return el;
  }
  async function carteDocumento(voci, opz, cont) {
    cont.innerHTML = ''; if (!voci.length) { cont.innerHTML = '<p class="mute">Nessun mostro da stampare.</p>'; return { n: 0 }; }
    const stage = document.createElement('div'); stage.style.cssText = 'position:absolute;left:-9999px;top:0;width:300mm'; document.body.appendChild(stage);
    try {
      await Promise.allSettled(['13pt Ringbearer', '9pt MPlantin', 'bold 9pt MPlantin', 'italic 9pt MPlantin'].map((f) => document.fonts.load(f)));
      const carte = [];
      for (const v of voci) {
        const r = await scegliFormato(v.m, stage, opz.leggi === 'grande'); const img = opz.dorso === 'immagine' ? await leggiImg(v.m.id) : null;
        for (let i = 0; i < v.n; i++) { const c = i ? r.c.cloneNode(true) : r.c; carte.push({ f: r.f, c, m: v.m, img, sz: r.sz }); }
      }
      if (opz.ordine === 'formato') carte.sort((a, b) => FORMATI.indexOf(a.f) - FORMATI.indexOf(b.f));
      const doc = document.createElement('div'); doc.className = 'carte-doc';
      const stat = {};
      FORMATI.forEach((f) => {
        const gr = carte.filter((x) => x.f === f); if (!gr.length) return; stat[f.k] = gr.length;
        for (let i = 0; i < gr.length; i += f.per) {
          const pg = gr.slice(i, i + f.per); const fr = document.createElement('section'); fr.className = 'cartapag mpag'; const rt = document.createElement('section'); rt.className = 'cartapag mpag';
          pg.forEach((x, j) => {
            const col = j % f.nc, riga = Math.floor(j / f.nc); x.c.style.left = f.ox + col * f.w + 'mm'; x.c.style.top = f.oy + riga * f.h + 'mm'; fr.appendChild(x.c);
            const d = creaRetro(x.m, f, x.img, opz.dorso); const cc = f.spec ? f.nc - 1 - col : col; d.style.left = f.ox + cc * f.w + (window.FORGIA_X.dorsoOff ? window.FORGIA_X.dorsoOff().x : 0) + 'mm'; d.style.top = f.oy + riga * f.h + (window.FORGIA_X.dorsoOff ? window.FORGIA_X.dorsoOff().y : 0) + 'mm'; rt.appendChild(d);
          });
          doc.appendChild(fr); if (opz.dorso !== 'nessuno') doc.appendChild(rt);
        }
      });
      cont.appendChild(doc);
      return { n: carte.length, stat };
    } finally { stage.remove(); }
  }
  const descrFormati = (st) => FORMATI.filter((f) => st && st[f.k]).map((f) => st[f.k] + ' ' + f.nome).join(', ');

  /* ---------- viste ---------- */
  const optGS = () => { const set = [...new Set((B.mostri || []).map((m) => m.gs))].sort((a, b) => GSV(a) - GSV(b)); return set; };
  function filtra() {
    const q = norm(B.q).trim(); const a = B.gsMin === '' ? -1 : GSV(B.gsMin); const b = B.gsMax === '' ? 99 : GSV(B.gsMax);
    return (B.mostri || []).filter((m) => (!q || norm(m.n).includes(q) || norm(m.tipo).includes(q) || norm(m.sub).includes(q)) && (!B.tipo || m.tipo === B.tipo) && (!B.fo || (m.fo || 'mm') === B.fo) && (!B.tg || (m.tg || '').replace(/[oa]$/, '') === B.tg) && GSV(m.gs) >= a && GSV(m.gs) <= b);
  }
  function righeRisultati() {
    const L = filtra(); const mostra = L.slice(0, B.limite);
    const hr = mostra.map((m) => '<div class="bes-riga' + (B.sel === m.id ? ' sel' : '') + '" data-az="besApri" data-id="' + m.id + '"><input type="checkbox" class="bes-ck" data-az="besCk" data-id="' + m.id + '"' + (B.sc.has(m.id) ? ' checked' : '') + ' title="Seleziona per stampare le carte"><div class="bes-r1"><b>' + esc(m.n) + '</b> <span class="mute">' + tipoRiga(m).split(',')[0] + '</span></div><div class="bes-r2">' + esc(origine(m, true).replace(' · p. ', ' p. ')) + ' · GS ' + esc(gsT(m)) + ' · CA ' + esc(m.ca) + ' · PF ' + esc(m.pf) + (B.imgIds.has(m.id) ? ' · 🖼' : '') + '</div><button class="pic ' + (B.sa.has(m.id) ? 'oro' : 'sec') + '" data-az="besAgg" data-id="' + m.id + '" title="Seleziona per aggiungere a un\'avventura">' + (B.sa.has(m.id) ? '✔' : '＋') + '</button></div>').join('');
    return '<div class="bes-intest"><span>☑ Selezionare per <b>stampare</b></span><span><b>＋ Selezionare</b> per aggiungere ad avventura</span></div><div class="mute" style="margin:.3rem 0">' + L.length + ' mostri' + (L.length > mostra.length ? ' (ne mostro ' + mostra.length + ')' : '') + '</div>' + (hr || '<div class="vuoto">Nessun mostro trovato.</div>') + (L.length > mostra.length ? '<p><button class="sec" data-az="besAltri">Mostra altri…</button></p>' : '');
  }
  /* ---------- incantesimi del mostro ---------- */
  const nn = (t) => norm(String(t || '').replace(/\([^)]*\)/g, ' ')).replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  let dizInc = null;
  function dizionario() {
    if (dizInc) return dizInc; const D = (typeof DND !== 'undefined' ? DND : (X.DND || {})); const elenco = D.INCANTESIMI || [];
    dizInc = { per: new Map(), nomi: [] };
    elenco.forEach((s) => { const k = nn(s.nome); if (k && !dizInc.per.has(k)) { dizInc.per.set(k, s.id); dizInc.nomi.push(k); } });
    dizInc.nomi.sort((a, b) => b.length - a.length); return dizInc;
  }
  const ALIAS = { linguaggi: 'lingue', suggerimento: 'suggestione', amici: 'amicizia', 'servo invisibile': 'servitore inosservato', 'creare cibo e bevande': 'creare cibo e acqua', 'passo del vento': 'camminare nel vento', 'barriera affilata': 'barriera di lame', 'barriera affilato': 'barriera di lame', 'modificare la memoria': 'modificare memoria', 'passo de l albero': 'traslazione arborea', 'passo dell albero': 'traslazione arborea' };
  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1; let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) { const cur = [i]; let mn = i; for (let j = 1; j <= b.length; j++) { const v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); cur.push(v); if (v < mn) mn = v; } if (mn > max) return max + 1; prev = cur; }
    return prev[b.length];
  }
  function cercaNome(k, z) {
    if (!k) return null; if (ALIAS[k]) k = ALIAS[k]; if (z.per.has(k)) return z.per.get(k);
    const max = k.length >= 8 ? 2 : (k.length >= 6 ? 1 : 0);
    if (max) { let best = null, bd = max + 1; for (const n of z.nomi) { const d = lev(k, n, max); if (d < bd) { bd = d; best = n; } } if (best) return z.per.get(best); }
    return null;
  }
  function incantesimiMostro(m) {
    const z = dizionario(); const trovati = []; const manca = [];
    const paras = [].concat(m.tr || [], m.az || [], m.bz || []).filter((p) => /incantesim/i.test(p.n || '') || /seguenti incantesimi|incantesimi aggiuntivi/i.test(p.t || ''));
    paras.forEach((p) => {
      const t = String(p.t || ''); const mm = /(?:seguent[ei]|aggiuntiv[oi])[^:]*:/i.exec(t);
      if (!mm) { // un solo incantesimo nella frase: «può lanciare luci danzanti come incantesimo innato»
        const q = /(?:pu[òo] lanciare|lancia)\s+(?:l'incantesimo\s+)?([^.,;:(]+?)(?:\s+(?:come|senza|usando|utilizzando|una volta|a volont)|[.,;:(]|$)/i.exec(t);
        if (q && /innat/i.test(p.n || '')) { const id = cercaNome(nn(q[1]), z); if (id && !trovati.includes(id)) trovati.push(id); }
        return;
      }
      const lista = t.slice(mm.index + mm[0].length);
      lista.split(/[\n:;]|\.(?=\S)|,(?![^(]*\))/).forEach((tok0) => {
        let tok = tok0.replace(/\d+\W{0,3}\s*liv\S*.*$/i, '').replace(/a volont[àa]/gi, ' ').replace(/\b(trucchett\w+|ciascuno|giorno)\b/gi, ' ').replace(/\b[\dliI]\s*\/\s*/g, ' ').replace(/\*.*$/, '');
        let k = nn(tok); if (!k) return; const w = k.split(' '); if (/^(rosso|arancione|giallo|verde|blu|indaco|viola)$/.test(k) || /\(\s*[-+−]?\d/.test(tok) || /\d{2,}/.test(k)) return;
        let id = cercaNome(k, z);
        if (!id) { // il pezzo può contenere un nome noto in fondo o all'inizio (testo OCR attaccato)
          for (const n of z.nomi) { if (n.length >= 5 && (' ' + k + ' ').includes(' ' + n + ' ')) { id = z.per.get(n); break; } }
        }
        if (id) { if (!trovati.includes(id)) trovati.push(id); } else if (k.replace(/ /g, '').length >= 4 && w.length <= 6 && !/^(il|la|lo|i|gli|le|se|come|solo|qualsiasi)\b/.test(k)) manca.push(tok.trim());
      });
    });
    return { ids: trovati, manca: [...new Set(manca)] };
  }
  function avvisoInc(m) {
    const r = incantesimiMostro(m); if (!r.ids.length && !r.manca.length) return '';
    const D = (typeof DND !== 'undefined' ? DND : {}); const nomi = r.ids.map((id) => (D.incantesimo(id) || {}).nome).filter(Boolean);
    return '<div class="bes-alert"><button class="bes-alert-b" data-az="besCarteInc" data-id="' + m.id + '"' + (r.ids.length ? '' : ' disabled') + '>🔮 Questo mostro lancia incantesimi: stampa le carte (' + r.ids.length + ', bianco e nero)</button>'
      + '<div class="mute" style="font-size:.78rem">' + esc(nomi.join(', ')) + (r.manca.length ? '<br>⚠ Non trovati tra gli incantesimi del programma (da cercare a mano): ' + esc(r.manca.join(', ')) : '') + '</div></div>';
  }
  function dettaglio() {
    const m = B.mappa && B.mappa.get(B.sel); if (!m) return '<div class="vuoto">Scegli un mostro dall\'elenco per vederne la scheda.</div>';
    const img = B.imgMem.get(m.id);
    return '<div class="bes-det"><div class="bes-az"><button class="oro" data-az="besStampa1" data-id="' + m.id + '">🖨 Stampa la carta</button> <button class="' + (B.sa.has(m.id) ? 'oro' : 'sec') + '" data-az="besAgg" data-id="' + m.id + '">' + (B.sa.has(m.id) ? '✔ Selezionato per l\'avventura (clicca per togliere)' : '＋ Seleziona per aggiungere a un\'avventura') + '</button> <button class="sec" data-az="besModIn" data-id="' + m.id + '">✎ Correggi i dati</button> <button class="sec" data-az="besImg" data-id="' + m.id + '">🖼 ' + (B.imgIds.has(m.id) ? 'Cambia immagine' : 'Carica immagine') + '</button>' + (B.imgIds.has(m.id) ? ' <button class="sec" data-az="besImgTogli" data-id="' + m.id + '">Rimuovi immagine</button>' : '') + ' <a class="pic sec" target="_blank" rel="noopener" href="' + esc(ricercaImg(m)) + '">🔎 Cerca un\'immagine</a></div>'
      + '<div class="bes-paste" id="bes-paste" tabindex="0">📋 <b>Trovata l\'immagine?</b> Tasto destro → «Copia immagine», poi clicca qui e premi <b>Ctrl+V</b> (oppure trascinala qui sopra). Si salva da sola su ' + esc(m.n) + '.</div>'
      + avvisoInc(m) + (img ? '<img class="bes-foto" src="' + img + '" alt="">' : '') + '<div class="mb mb-sch"><h4>' + esc(m.n) + '</h4><div class="mb-t">' + tipoRiga(m) + '</div><hr class="mb-hr">' + corpoHTML(m) + '</div><p class="mute" style="font-size:.78rem">' + esc(m.fo === 'pers' ? origine(m) : fonte(m).n + ', p. ' + m.pg) + (m.mod && m.fo !== 'pers' ? ' · ✎ scheda corretta a mano' : '') + (m.inc ? ' · ⚠ scheda forse incompleta (azioni non trovate nella lettura del PDF): controlla sul manuale.' : '') + '</p></div>';
  }
  const barraAvv = () => {
    if (!B.avv.length) return '<b>📜 Avventura:</b> <span class="mute">non ne hai ancora una.</span> <button class="oro" data-az="besAvvNuova">＋ Crea la tua prima avventura</button> <span class="mute">Dai un nome alla tua avventura, poi con il pulsante ＋ accanto a ogni mostro lo aggiungi alla lista.</span>';
    const a = avvCorr();
    return '<b>📜 I mostri con ＋ vanno in:</b> <select data-az="besAvvSel">' + B.avv.map((x) => '<option value="' + x.id + '"' + (x.id === B.avvId ? ' selected' : '') + '>' + esc(x.nome || 'Senza nome') + ' (' + conteggiAvv(x) + ')</option>').join('') + '</select> <button class="sec" data-az="besAvvNuova">＋ Nuova avventura</button> <button class="sec" data-az="besTab" data-t="avv">Vedi la lista di «' + esc(a ? a.nome : '') + '» →</button>';
  };
  const pannelloSa = () => {
    if (!B.sa.size) return '';
    const nomi = [...B.sa].map((id) => (B.mappa.get(id) || {}).n).filter(Boolean).sort((x, y) => x.localeCompare(y, 'it')).map(esc).join(', ');
    let h = '<div class="card bes-barra-avv"><b>📜 Mostri scelti per un\'avventura (' + B.sa.size + ')</b><p class="mute">' + nomi + '</p>';
    if (!B.dlg) h += '<p><button class="oro" data-az="besSaAvanti">Avanti →</button> <button class="sec" data-az="besSaSvuota">Annulla selezione</button></p>';
    else {
      h += '<p><b>Vuoi creare una nuova avventura o aggiungere a una esistente?</b></p><p><button class="' + (B.dlg === 'nuova' ? 'oro' : 'sec') + '" data-az="besSaScelta" data-v="nuova">＋ Crea una nuova avventura</button> <button class="' + (B.dlg === 'esist' ? 'oro' : 'sec') + '" data-az="besSaScelta" data-v="esist"' + (B.avv.length ? '' : ' disabled') + '>Aggiungi a una esistente</button> <button class="sec" data-az="besSaSvuota">Annulla</button></p>';
      if (B.dlg === 'nuova') h += '<p><input type="text" id="bes-sa-nome" placeholder="Nome della nuova avventura" maxlength="80"> <button class="oro" data-az="besSaConferma">Crea e aggiungi</button></p>';
      else h += '<p><select id="bes-sa-avv">' + B.avv.map((x) => '<option value="' + x.id + '"' + (x.id === B.avvId ? ' selected' : '') + '>' + esc(x.nome || 'Senza nome') + ' (' + conteggiAvv(x) + ')</option>').join('') + '</select> <button class="oro" data-az="besSaConferma">Aggiungi</button></p>';
    }
    return h + '</div>';
  };
  const tabCerca = () => {
    const tipi = [...new Set((B.mostri || []).map((m) => m.tipo))].sort(); const tgs = ['Minuscol', 'Piccol', 'Medi', 'Grande', 'Enorme', 'Mastodontic'];
    const gs = optGS(); const o = (v, l, s) => '<option value="' + esc(v) + '"' + (s ? ' selected' : '') + '>' + esc(l) + '</option>';
    return '<div class="card"><div class="riga bes-filtri"><input type="search" id="bes-q" placeholder="Cerca un mostro per nome o tipo…" value="' + esc(B.q) + '" data-az="besQ">'
      + '<select data-az="besF" data-k="fo">' + o('', 'Ogni manuale', !B.fo) + Object.keys(FONTI).filter((k) => (B.mostri || []).some((m) => (m.fo || 'mm') === k)).map((k) => o(k, FONTI[k].n, B.fo === k)).join('') + '</select>'
      + '<select data-az="besF" data-k="tipo">' + o('', 'Ogni tipo', !B.tipo) + tipi.map((t) => o(t, t, B.tipo === t)).join('') + '</select>'
      + '<select data-az="besF" data-k="tg">' + o('', 'Ogni taglia', !B.tg) + tgs.map((t) => o(t, t + 'a/o', B.tg === t)).join('') + '</select>'
      + '<select data-az="besF" data-k="gsMin">' + o('', 'GS da…', B.gsMin === '') + gs.map((g) => o(g, 'GS ' + g, B.gsMin === g)).join('') + '</select>'
      + '<select data-az="besF" data-k="gsMax">' + o('', 'GS fino a…', B.gsMax === '') + gs.map((g) => o(g, 'GS ' + g, B.gsMax === g)).join('') + '</select></div></div>'
      + pannelloSa()
      + (B.sc.size ? '<div class="card bes-stampa"><h4>🖨 Carte dei mostri selezionati (' + B.sc.size + ')</h4><p class="mute">' + [...B.sc].map((id) => (B.mappa.get(id) || {}).n).filter(Boolean).sort((x, y) => x.localeCompare(y, 'it')).map(esc).join(', ') + '</p>' + opzioniStampa() + '<p><button class="oro" data-az="besStampaSel">👁 Crea le carte</button> <button data-az="besStampaSelOra">🖨 Stampa</button> <button class="sec" data-az="besScSvuota">Deseleziona tutti</button> <span class="mute">' + (B.stampa || '') + '</span></p><div id="bes-prev"></div></div>' : '<p class="mute" style="margin:.4rem 0">☑ Spunta i mostri nell\'elenco per stampare le loro carte; con ＋ li aggiungi a un\'avventura.</p>')
      + '<div class="bes-griglia"><div class="card"><div id="bes-ris">' + righeRisultati() + '</div></div><div class="card" id="bes-det">' + dettaglio() + '</div></div>';
  };
  function conteggiAvv(a) { return (a.voci || []).length; }
  const tabAvv = () => {
    const a = avvCorr(); const sel = '<select data-az="besAvvSel">' + (B.avv.length ? '' : '<option value="">— nessuna avventura —</option>') + B.avv.map((x) => '<option value="' + x.id + '"' + (x.id === B.avvId ? ' selected' : '') + '>' + esc(x.nome || 'Senza nome') + ' (' + conteggiAvv(x) + ')</option>').join('') + '</select>';
    let corpo = '<p class="mute">Crea una lista per ogni avventura (ogni avventura deve avere un nome diverso), poi aggiungi i mostri dalla scheda <b>Cerca</b> con il pulsante ＋.</p>';
    if (a) {
      const righe = (a.voci || []).slice().sort((x, y) => String((B.mappa.get(x.id) || {}).n || '').localeCompare(String((B.mappa.get(y.id) || {}).n || ''), 'it')).map((v) => { const m = B.mappa.get(v.id); if (!m) return ''; return '<tr><td><a href="#" data-az="besApriDa" data-id="' + m.id + '">' + esc(m.n) + '</a> <span class="mute">GS ' + esc(gsT(m)) + ' · ' + esc(origine(m, true).replace(' · p. ', ' p. ')) + '</span>' + (B.imgIds.has(m.id) ? ' 🖼' : '') + '</td><td><button class="pic sec" data-az="besTogliVoce" data-id="' + m.id + '" title="Togli">✕</button></td></tr>'; }).join('');
      const senza = (a.voci || []).map((v) => B.mappa.get(v.id)).filter((m) => m && !B.imgIds.has(m.id));
      corpo = '<div class="riga"><div class="col"><label>Nome dell\'avventura</label><input type="text" data-az="besAvvNome" value="' + esc(a.nome) + '"></div></div>'
        + ((a.voci || []).length ? '<table class="bes-tab"><thead><tr><th>Mostro</th><th></th></tr></thead><tbody>' + righe + '</tbody></table>' : '<div class="vuoto">La lista è vuota: aggiungi dei mostri dalla scheda Cerca.</div>')
        + '<div class="card bes-stampa"><h4>🖨 Stampa le carte di questa avventura</h4>' + opzioniStampa()
        + '<p><button class="oro" data-az="besStampaAvv"' + ((a.voci || []).length ? '' : ' disabled') + '>👁 Crea le carte</button> <button data-az="besStampaOra">🖨 Stampa</button> <span class="mute">' + (B.stampa || '') + '</span></p><div id="bes-prev"></div></div>'
        + '<p><button class="sec" data-az="besSenzaImg">📋 Elenco mostri senza immagine (' + senza.length + ')</button> <button class="sec pericolo" data-az="besAvvElimina">Elimina avventura</button></p><div id="bes-senza"></div>';
    }
    return '<div class="card"><h3>📜 Avventure</h3><div class="riga">' + sel + ' <button class="sec" data-az="besAvvNuova">＋ Nuova avventura</button></div>' + corpo + '</div>';
  };
  const opzioniStampa = () => '<div class="riga"><label>Retro <select data-az="besOpz" data-k="dorso"><option value="immagine"' + (B.opz.dorso === 'immagine' ? ' selected' : '') + '>Immagine del mostro (se manca: logo)</option><option value="logo"' + (B.opz.dorso === 'logo' ? ' selected' : '') + '>Sempre il logo (adulti)</option><option value="bianco"' + (B.opz.dorso === 'bianco' ? ' selected' : '') + '>Bianco con il nome</option><option value="nessuno"' + (B.opz.dorso === 'nessuno' ? ' selected' : '') + '>Solo fronti (niente retro)</option></select></label>'
    + '<label>Testo <select data-az="besOpz" data-k="leggi"><option value="normale"' + (B.opz.leggi === 'normale' ? ' selected' : '') + '>Normale (carte più piccole)</option><option value="grande"' + (B.opz.leggi === 'grande' ? ' selected' : '') + '>Più grande (carte più grandi)</option></select></label>'
    + '<label><input type="checkbox" data-az="besOpz" data-k="esemplari"' + (B.opz.esemplari ? ' checked' : '') + '> una carta per ogni esemplare</label></div>' + (window.FORGIA_X.dorsoUI ? window.FORGIA_X.dorsoUI() : '');
  const tabDati = () => {
    const n = (B.mostri || []).length; const senza = (B.mostri || []).filter((m) => !B.imgIds.has(m.id));
    return '<div class="card"><h3>📥 Dati dei mostri</h3><p>' + (n ? '<b>' + n + ' mostri</b> caricati, <b>' + B.imgIds.size + '</b> con immagine.' : 'Nessun mostro caricato.') + '</p>'
      + '<p class="mute">I dati vengono dal file <code>mostri-manuale-dei-mostri.json</code> (consegnato a parte: non è nel sito pubblico). Si importa <b>una sola volta</b> e resta nell\'archivio privato dei gestori' + (cloud() ? ' (online, visibile solo ai gestori)' : ' di questo dispositivo') + '. Gli altri manuali si aggiungono importando un altro file: i mostri già presenti restano, e le avventure non cambiano.</p>'
      + '<p><button class="oro" data-az="besImporta">⬆ Importa file dei mostri</button> <span class="mute">' + esc(B.imp) + '</span></p></div>'
      + '<div class="card"><h3>🖼 Immagini</h3><p class="mute">Carica più immagini in una volta: il nome del file deve essere quello del mostro (es. <code>goblin.jpg</code>, <code>drago-rosso-antico.png</code>). Le immagini vengono ridotte e salvate' + (cloud() ? ' online, nell\'archivio privato dei gestori' : ' su questo dispositivo') + '. <b>Usa solo immagini che hai il diritto di usare</b> (tue, libere, o per uso privato al tavolo).</p>'
      + '<p><button class="oro" data-az="besImgBlocco">⬆ Carica immagini (più file)</button> <button class="sec" data-az="besSenzaImgTutti">📋 Elenco di tutti i mostri senza immagine (' + senza.length + ')</button></p><div id="bes-senza"></div><div class="mute">' + esc(B.msgImg || '') + '</div></div>';
  };
  /* ---------- mostri personalizzati (creati a mano dai gestori) ---------- */
  const TIPI_BASE = ['Aberrazione', 'Bestia', 'Celestiale', 'Costrutto', 'Drago', 'Elementale', 'Folletto', 'Gigante', 'Immondo', 'Melma', 'Mostruosità', 'Non morto', 'Sciame', 'Umanoide', 'Vegetale'];
  const TAGLIE = ['Minuscolo', 'Piccolo', 'Medio', 'Grande', 'Enorme', 'Mastodontico'];
  const PE_GS = { 0: 10, '1/8': 25, '1/4': 50, '1/2': 100, 1: 200, 2: 450, 3: 700, 4: 1100, 5: 1800, 6: 2300, 7: 2900, 8: 3900, 9: 5000, 10: 5900, 11: 7200, 12: 8400, 13: 10000, 14: 11500, 15: 13000, 16: 15000, 17: 18000, 18: 20000, 19: 22000, 20: 25000, 21: 33000, 22: 41000, 23: 50000, 24: 62000, 25: 75000, 26: 90000, 27: 105000, 28: 120000, 29: 135000, 30: 155000 };
  const SEZ = [
    ['tr', 'Tratti', 'Capacità sempre attive (es. Vista Acuta, Resistenza alla Magia).', 'Vista Acuta', 'Il mostro dispone di vantaggio alle prove di Saggezza (Percezione) basate sulla vista.'],
    ['az', 'Azioni', 'Gli attacchi e le azioni del mostro. Usa «＋ Modello di attacco» per partire da una frase già pronta.', 'Morso', 'Attacco con Arma da Mischia: +4 al tiro per colpire, portata 1,5 m, un bersaglio. Colpito: 5 (1d6 + 2) danni perforanti.'],
    ['bz', 'Azioni bonus', '', '', ''], ['re', 'Reazioni', '', '', ''], ['le', 'Azioni leggendarie', 'Per i mostri più potenti: scrivi anche l\'introduzione nella prima riga (es. «Il mostro può effettuare 3 azioni leggendarie…»).', '', ''],
  ];
  const formVuoto = () => ({ id: null, n: '', tipo: 'Umanoide', tg: 'Medio', sub: '', al: 'senza allineamento', ca: '12', caN: '', pf: '20', dadi: '', vel: '9 m', car: ['10', '10', '10', '10', '10', '10'], ts: '', ab: '', vu: '', rs: '', im: '', ic: '', se: 'Percezione passiva 10', li: '', gs: '1', av: '', tr: [], az: [{ n: '', t: '' }], bz: [], re: [], le: [], imgData: null });
  const formDa = (m) => { const f = formVuoto(); Object.keys(f).forEach((k) => { if (m[k] != null && k !== 'imgData' && k !== 'id') f[k] = JSON.parse(JSON.stringify(m[k])); }); f.mod = !!m.mod; f.fo = m.fo || 'mm'; f.pg = m.pg == null ? '' : m.pg; f.bp = m.bp || ''; f.gsOrig = String(m.gs == null ? '' : m.gs); f.peOrig = m.pe; f.car = (m.car || f.car).map(String); f.ca = String(m.ca); f.pf = String(m.pf); f.gs = String(m.gs == null ? '1' : m.gs); ['tr', 'az', 'bz', 're', 'le'].forEach((k) => { f[k] = (m[k] || []).map((v) => ({ n: v.n || '', t: v.t || '' })); }); if (!f.az.length) f.az = [{ n: '', t: '' }]; return f; };
  function leggiForm() {
    const f = B.f, root = document.getElementById('bes-form'); if (!f || !root) return;
    root.querySelectorAll('[data-f]').forEach((e) => { const k = e.dataset.f; if (k.slice(0, 3) === 'car') f.car[Number(k.slice(3))] = e.value; else f[k] = e.value; });
    SEZ.forEach(([k]) => { f[k] = [...root.querySelectorAll('.fm-row[data-sec="' + k + '"]')].map((r) => ({ n: r.querySelector('[data-r="n"]').value, t: r.querySelector('[data-r="t"]').value })); });
  }
  function costruisci(f) {
    const num = (v, d) => { const n = Number(String(v).replace(',', '.')); return Number.isFinite(n) ? n : d; };
    const gs = String(f.gs).trim(); const car = f.car.map((v) => Math.max(1, Math.min(30, Math.round(num(v, 10)))));
    const pulisci = (l) => (l || []).map((v) => ({ n: String(v.n || '').trim(), t: String(v.t || '').trim() })).filter((v) => v.n || v.t);
    const m = { id: f.id, n: String(f.n || '').trim().replace(/\s+/g, ' '), tipo: f.tipo, tg: f.tg, sub: String(f.sub || '').trim(), al: String(f.al || '').trim(), ca: Math.round(num(f.ca, 10)), caN: String(f.caN || '').trim(), pf: Math.round(num(f.pf, 1)), dadi: String(f.dadi || '').trim(), vel: String(f.vel || '').trim(), car, ts: String(f.ts || '').trim(), ab: String(f.ab || '').trim(), vu: String(f.vu || '').trim(), rs: String(f.rs || '').trim(), im: String(f.im || '').trim(), ic: String(f.ic || '').trim(), se: String(f.se || '').trim(), li: String(f.li || '').trim(), gs, pe: f.fo && f.fo !== 'pers' && gs === f.gsOrig ? f.peOrig : (PE_GS[gs] != null ? PE_GS[gs] : 0), pg: f.fo && f.fo !== 'pers' ? f.pg : '', fo: f.fo || 'pers', av: f.fo && f.fo !== 'pers' ? '' : String(f.av || '').trim(), tr: pulisci(f.tr), az: pulisci(f.az), bz: pulisci(f.bz), re: pulisci(f.re), le: pulisci(f.le) };
    if (f.bp) m.bp = f.bp; if (m.fo !== 'pers') m.mod = true;
    m.tp = [m.tipo, m.tg].filter(Boolean).join(' ') + (m.sub ? ' (' + m.sub + ')' : '') + (m.al ? ', ' + m.al : '');
    return m;
  }
  const tabNuovo = () => {
    const pers = (B.mostri || []).filter((m) => m.fo === 'pers');
    const opt = (v, l, s) => '<option value="' + esc(v) + '"' + (s ? ' selected' : '') + '>' + esc(l) + '</option>';
    const lista = '<div class="card"><h3>👹 I miei mostri (' + pers.length + ')</h3>'
      + (pers.length ? '<div class="fm-lista">' + pers.map((m) => '<div class="fm-voce"><div><b>' + esc(m.n) + '</b> <span class="mute">' + tipoRiga(m).split(',')[0] + ' · GS ' + esc(gsT(m)) + (m.av ? ' · ' + esc(m.av) : '') + (B.imgIds.has(m.id) ? ' · 🖼' : '') + '</span></div><div class="fm-bt"><button class="pic sec" data-az="besFmCarta" data-id="' + m.id + '">👁 Carta</button><button class="pic sec" data-az="besFmModifica" data-id="' + m.id + '">✎ Modifica</button><button class="pic sec" data-az="besFmDuplica" data-id="' + m.id + '">⧉ Duplica</button><button class="pic sec" data-az="besFmElimina" data-id="' + m.id + '">🗑</button></div></div>').join('') + '</div>' : '<p class="mute">Nessun mostro personalizzato: creane uno qui sotto. I mostri creati sono visibili a tutti i gestori, compaiono nella ricerca del Bestiario (filtro «Mostro personalizzato») e si possono aggiungere alle avventure come tutti gli altri.</p>') + '</div>';
    const prev = '<div class="card bes-stampa" id="fm-risultato"' + (B.nuovoDone ? '' : ' hidden') + '><h4>' + (B.nuovoDone ? '✔ Mostro salvato: ecco la carta' : '') + '</h4><p><button class="oro" data-az="besFmStampa">🖨 Stampa la carta</button> <button class="sec" data-az="besFmAggAvv">＋ Aggiungi a un\'avventura</button> <button class="sec" data-az="besFmChiudi">Chiudi</button> ' + opzioniStampaCorta() + '</p><div id="bes-prev"></div></div>';
    if (!B.f) return prev + lista + '<div class="card"><h3>✚ Nuovo mostro</h3><p class="mute">Crea un mostro speciale per la tua avventura: compili la scheda, premi Salva e il mostro entra nell\'elenco con la sua carta (fronte con le statistiche, retro con l\'immagine).</p><p><button class="oro" data-az="besFmNuovo">✚ Crea un mostro da zero</button></p>'
      + '<p><b>Oppure parti da un mostro esistente</b> (utile per un «Goblin capo» o un «Drago» con qualche modifica):</p><p><input type="text" id="fm-base" list="fm-base-l" placeholder="Scrivi il nome del mostro di partenza…" style="max-width:22rem"><datalist id="fm-base-l">' + (B.mostri || []).filter((m) => m.fo !== 'pers').map((m) => '<option value="' + esc(m.n) + '">').join('') + '</datalist> <button class="sec" data-az="besFmDaBase">Copia i suoi dati</button></p></div>';
    const f = B.f; const tipi = [...new Set(TIPI_BASE.concat(f.tipo ? [f.tipo] : []))];
    const inp = (k, lbl, ph, cl) => '<label class="fm-c ' + (cl || '') + '"><span>' + lbl + '</span><input type="text" data-f="' + k + '" value="' + esc(f[k]) + '" placeholder="' + esc(ph || '') + '"></label>';
    const gsOpt = Object.keys(PE_GS).sort((a, b) => GSV(a) - GSV(b)); if (f.gs !== '' && !(f.gs in PE_GS)) gsOpt.push(String(f.gs));
    const sezioni = SEZ.map(([k, tit, aiuto, exn, ext]) => '<div class="fm-sez"><h4>' + tit + '</h4>' + (aiuto ? '<p class="mute" style="font-size:.8rem">' + aiuto + '</p>' : '')
      + (f[k] || []).map((v, i) => '<div class="fm-row" data-sec="' + k + '" data-i="' + i + '"><input type="text" data-r="n" placeholder="Nome (es. ' + esc(exn || 'Nome') + ')" value="' + esc(v.n) + '"><textarea data-r="t" rows="3" placeholder="Testo (es. ' + esc((ext || '').slice(0, 70)) + '…)">' + esc(v.t) + '</textarea><button class="pic sec" data-az="besFmTogli" data-sec="' + k + '" data-i="' + i + '" title="Togli questa voce">✕</button></div>').join('')
      + '<p><button class="pic sec" data-az="besFmRiga" data-sec="' + k + '">＋ Aggiungi</button>' + (k === 'az' ? ' <button class="pic sec" data-az="besFmRiga" data-sec="az" data-tpl="mischia">＋ Modello di attacco in mischia</button> <button class="pic sec" data-az="besFmRiga" data-sec="az" data-tpl="distanza">＋ Modello di attacco a distanza</button>' : '') + '</p></div>').join('');
    return prev + '<div class="card" id="bes-form"><h3>' + (f.id ? '✎ Modifica: ' + esc(f.n) : '✚ Nuovo mostro') + '</h3>' + (f.fo !== 'pers' ? '<div class="avviso">⚠ <b>Stai correggendo un mostro del manuale</b> (' + esc(FONTI[f.fo] ? FONTI[f.fo].n : f.fo) + ', p. ' + esc(f.pg) + '). Quando salvi, le nuove statistiche valgono per <b>tutti i gestori</b>.</div>' : '')
      + '<div class="fm-g">' + inp('n', 'Nome del mostro *', 'es. Goblin Capo di Valdoria', 'fm-w2')
      + '<label class="fm-c"><span>Tipo</span><select data-f="tipo">' + tipi.map((t) => opt(t, t, t === f.tipo)).join('') + '</select></label>'
      + '<label class="fm-c"><span>Taglia</span><select data-f="tg">' + [...new Set(TAGLIE.concat([f.tg]))].map((t) => opt(t, t, t === f.tg)).join('') + '</select></label>'
      + inp('sub', 'Sottotipo (facoltativo)', 'es. goblinoide') + inp('al', 'Allineamento', 'es. neutrale malvagio')
      + (f.fo === 'pers' ? inp('av', 'Avventura / origine (appare sulla carta)', 'es. La Torre delle Lucciole', 'fm-w2') : '') + '</div>'
      + '<div class="fm-g">' + inp('ca', 'Classe Armatura', '15') + inp('caN', 'Tipo di armatura', 'es. armatura di cuoio, scudo') + inp('pf', 'Punti Ferita', '7') + inp('dadi', 'Dadi vita', 'es. 2d6') + inp('vel', 'Velocità', 'es. 9 m, volare 18 m', 'fm-w2') + '</div>'
      + '<div class="fm-ab">' + ['FOR', 'DES', 'COS', 'INT', 'SAG', 'CAR'].map((a, i) => '<label class="fm-c"><span>' + a + '</span><input type="text" inputmode="numeric" data-f="car' + i + '" value="' + esc(f.car[i]) + '"></label>').join('') + '</div>'
      + '<div class="fm-g">' + inp('ts', 'Tiri salvezza', 'es. Cos +4, Sag +2', 'fm-w2') + inp('ab', 'Abilità', 'es. Furtività +6, Percezione +3', 'fm-w2') + inp('vu', 'Vulnerabilità ai danni', '') + inp('rs', 'Resistenze ai danni', 'es. fuoco') + inp('im', 'Immunità ai danni', '') + inp('ic', 'Immunità alle condizioni', 'es. spaventato')
      + inp('se', 'Sensi', 'es. scurovisione 18 m, Percezione passiva 9', 'fm-w2') + inp('li', 'Linguaggi', 'es. Comune, Goblin', 'fm-w2')
      + '<label class="fm-c"><span>Grado di Sfida</span><select data-f="gs">' + gsOpt.map((g) => opt(g, g + (PE_GS[g] != null ? ' (' + PE_GS[g].toLocaleString('it-IT') + ' PE)' : ''), String(f.gs) === g)).join('') + '</select></label></div>'
      + sezioni
      + '<div class="fm-sez"><h4>🖼 Immagine per il retro della carta (facoltativa)</h4><p class="mute" style="font-size:.8rem">Senza immagine la carta ha il retro con il logo. Puoi aggiungerla anche dopo, dalla scheda del mostro.</p><p>' + (f.imgData ? '<img class="fm-thumb" src="' + f.imgData + '" alt=""> ' : '') + '<button class="sec" data-az="besFmImg">' + (f.imgData ? 'Cambia immagine' : 'Scegli un\'immagine') + '</button>' + (f.imgData ? ' <button class="sec" data-az="besFmImgTogli">Togli</button>' : '') + '<input type="file" id="fm-file" accept="image/*" hidden data-az="besFmFile"></p></div>'
      + '<p class="fm-azioni"><button class="oro" data-az="besFmSalva">💾 Salva il mostro e crea la carta</button> <button class="sec" data-az="besFmAnteprima">👁 Anteprima della carta</button> <button class="sec" data-az="besFmAnnulla">Annulla</button>' + (f.fo !== 'pers' && f.mod ? ' <button class="sec" data-az="besFmRipristina">↩ Ripristina i dati originali del manuale</button>' : '') + ' <span class="mute" id="fm-msg">' + esc(B.fmMsg || '') + '</span></p></div>';
  };
  const opzioniStampaCorta = () => '<label>Retro <select data-az="besOpz" data-k="dorso"><option value="immagine"' + (B.opz.dorso === 'immagine' ? ' selected' : '') + '>immagine</option><option value="logo"' + (B.opz.dorso === 'logo' ? ' selected' : '') + '>logo</option><option value="bianco"' + (B.opz.dorso === 'bianco' ? ' selected' : '') + '>bianco</option><option value="nessuno"' + (B.opz.dorso === 'nessuno' ? ' selected' : '') + '>nessuno</option></select></label>';
  X.vistaBestiario = function () {
    if (!B.carico) { if (!B.prep) { B.prep = true; carica(); } return '<p class="mute centro">Carico il bestiario…</p>'; }
    const vuoto = !(B.mostri || []).length;
    const tabs = [['cerca', '🔎 Cerca'], ['avv', '📜 Avventure'], ['nuovo', '✚ Crea mostro'], ['dati', '⚙ Dati e immagini']].map(([id, l]) => '<button class="' + (B.tab === id ? 'attiva' : '') + '" data-az="besTab" data-t="' + id + '">' + l + '</button>').join('');
    return '<div class="barra-elenco"><b style="font-size:1.1rem">' + (B.modo === 'inc' ? '⚔ Incontri e iniziativa' : '📖 Bestiario del Dungeon Master') + '</b>' + '</div>'
      + (B.errore ? '<div class="avviso">⚠ ' + esc(B.errore) + '</div>' : '')
      + (vuoto && B.tab !== 'dati' && B.modo !== 'inc' ? '<div class="avviso">Il bestiario è vuoto: importa il file dei mostri dalla scheda <b>Dati e immagini</b>. <button class="pic oro" data-az="besTab" data-t="dati">Vai</button></div>' : '')
      + (B.modo === 'inc' ? X.tabIncontri() : '<div class="tabs bes-tabs">' + tabs + '</div>' + (B.tab === 'cerca' ? tabCerca() : B.tab === 'avv' ? tabAvv() : B.tab === 'nuovo' ? tabNuovo() : tabDati()))
      + '<input type="file" id="bes-file-json" accept=".json,application/json" hidden data-az="besFileJson"><input type="file" id="bes-file-img" accept="image/*" hidden data-az="besFileImg"><input type="file" id="bes-file-imgs" accept="image/*" multiple hidden data-az="besFileImgs">';
  };

  /* ---------- azioni ---------- */
  X.azioniBestiario = function (c) {
    const { S, render } = c; ridisegna = () => { if (S.vista === 'bestiario') { const y = window.scrollY; render(); window.scrollTo(0, y); } };
    const creaAvv = async (msg) => {
      let nome = ''; let testo = msg || 'Nome della nuova avventura:';
      for (;;) {
        nome = window.prompt(testo, nome); if (nome === null) return null; nome = nome.trim().replace(/\s+/g, ' ');
        if (!nome) { testo = 'Il nome non può essere vuoto. Dai un nome alla tua avventura:'; continue; }
        if (nomeEsiste(nome)) { testo = 'Esiste già un\'avventura chiamata «' + nome + '». Scegli un nome diverso:'; continue; }
        break;
      }
      const a = { id: uid(), nome, voci: [] }; B.avv.push(a); B.avvId = a.id; await salvaAvv(a).catch((e) => { B.errore = e.message; }); return a;
    };
    const aggiungi = async (id) => {
      let a = avvCorr(); if (!a) { a = await creaAvv('Dai un nome alla tua avventura (i mostri che aggiungi finiranno qui):'); if (!a) return; }
      const m = B.mappa.get(id); const v = a.voci.find((x) => x.id === id);
      if (v) a.voci = a.voci.filter((x) => x.id !== id); else a.voci.push({ id, q: 1 });
      B.msg = ''; await salvaAvv(a).catch((e) => { B.errore = e.message; });
      toast(v ? (m ? m.n : 'Mostro') + ' tolto da «' + a.nome + '»' : '✔ ' + (m ? m.n : 'Mostro') + ' aggiunto a «' + a.nome + '» (' + a.voci.length + ' mostri)'); ridisegna();
    };
    const vociSel = () => [...B.sc].map((id) => ({ m: B.mappa.get(id), n: 1 })).filter((v) => v.m).sort((x, y) => x.m.n.localeCompare(y.m.n, 'it'));
    const vociStampa = (a) => (a.voci || []).map((v) => ({ m: B.mappa.get(v.id), n: 1 })).filter((v) => v.m);
    const prova = async (voci) => {
      const cont = document.getElementById('bes-prev'); if (!cont) return;
      cont.innerHTML = '<p class="mute">Preparo le carte…</p>'; const r = await carteDocumento(voci, B.opz, cont); B.stampa = r.n ? r.n + ' carte: ' + descrFormati(r.stat) : '';
      const sp = $('.bes-stampa .mute:last-of-type'); if (sp) sp.textContent = B.stampa;
    };
    const stampaOra = async (voci) => { const cont = document.getElementById('bes-prev'); if (!cont) return; if (!cont.querySelector('.cartapag')) await prova(voci); if (!cont.querySelector('.cartapag')) return; document.getElementById('stampa').innerHTML = cont.innerHTML; window.FORGIA_X.stampaPronta(); };
    const imgDa = async (blob) => {
      if (B.sel == null) { toast('Apri prima la scheda di un mostro'); return; }
      const m = B.mappa.get(B.sel); try { await salvaImg(B.sel, await riduciImg(blob)); B.errore = ''; toast('✔ Immagine salvata per ' + (m ? m.n : 'il mostro')); } catch (e) { toast('Immagine non salvata: ' + e.message); } ridisegna();
    };
    const imgDaUrl = async (u) => { try { const r = await fetch(u, { mode: 'cors' }); if (!r.ok) throw new Error(); const b = await r.blob(); if (!/^image\//.test(b.type)) throw new Error(); await imgDa(b); } catch (e) { toast('Questo sito non permette il download diretto: tasto destro sull\'immagine → «Copia immagine», poi clicca nella scheda e premi Ctrl+V.'); } };
    if (!X._besPaste) {
      X._besPaste = true;
      document.addEventListener('paste', (e) => {
        if (S.vista !== 'bestiario' || B.tab !== 'cerca' || B.sel == null) return; const t = e.target; if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
        const it = [...(e.clipboardData ? e.clipboardData.items : [])].find((x) => x.type.startsWith('image/')); if (it) { e.preventDefault(); imgDa(it.getAsFile()); }
      });
      document.addEventListener('dragover', (e) => { if (S.vista === 'bestiario' && e.target.closest && e.target.closest('#bes-det')) e.preventDefault(); });
      document.addEventListener('drop', (e) => {
        if (S.vista !== 'bestiario' || !(e.target.closest && e.target.closest('#bes-det'))) return; e.preventDefault(); const dt = e.dataTransfer;
        const f = [...(dt.files || [])].find((x) => x.type.startsWith('image/')); if (f) { imgDa(f); return; }
        const u = (dt.getData('text/uri-list') || dt.getData('text/plain') || '').split('\n')[0].trim(); if (/^https?:/.test(u)) imgDaUrl(u);
      });
    }
    const az = {
      vaiBestiario() { S.vista = 'bestiario'; B.modo = 'bes'; if (B.tab === 'inc') B.tab = 'cerca'; render(); },
      vaiIncontri() { S.vista = 'bestiario'; B.modo = 'inc'; B.tab = 'inc'; render(); },
      vaiAvventure() { S.vista = 'bestiario'; B.modo = 'bes'; B.tab = 'avv'; B.stampa = ''; render(); },
      besTab(el) { leggiForm(); B.tab = el.dataset.t; B.stampa = ''; render(); },

      besFmNuovo() { B.f = formVuoto(); B.nuovoDone = null; B.fmMsg = ''; render(); },
      besFmDaBase() { const nome = (document.getElementById('fm-base') || {}).value; const m = (B.mostri || []).find((x) => nomeNorm(x.n) === nomeNorm(nome)); if (!m) { toast('Non trovo un mostro con questo nome: scegli dall\'elenco che compare mentre scrivi'); return; } B.f = formDa(m); B.f.n = m.n + ' (copia)'; B.f.av = ''; B.nuovoDone = null; B.fmMsg = 'Dati copiati da «' + m.n + '»: modificali e salva.'; render(); },
      besFmDuplica(el) { const m = B.mappa.get(Number(el.dataset.id)); if (!m) return; B.f = formDa(m); B.f.n = m.n + ' (copia)'; B.nuovoDone = null; B.fmMsg = 'Copia di «' + m.n + '»: cambia il nome e salva.'; render(); },
      async besFmModifica(el) { const m = B.mappa.get(Number(el.dataset.id)); if (!m) return; B.f = formDa(m); B.f.id = m.id; B.f.imgData = await leggiImg(m.id); B.nuovoDone = null; B.fmMsg = ''; render(); window.scrollTo(0, 0); },
      besFmRiga(el) { leggiForm(); const tpl = { mischia: { n: 'Colpo', t: 'Attacco con Arma da Mischia: +4 al tiro per colpire, portata 1,5 m, un bersaglio. Colpito: 5 (1d6 + 2) danni taglienti.' }, distanza: { n: 'Arco', t: 'Attacco con Arma a Distanza: +4 al tiro per colpire, gittata 24/96 m, un bersaglio. Colpito: 5 (1d6 + 2) danni perforanti.' } }[el.dataset.tpl] || { n: '', t: '' }; B.f[el.dataset.sec].push(Object.assign({}, tpl)); render(); },
      besFmTogli(el) { leggiForm(); B.f[el.dataset.sec].splice(Number(el.dataset.i), 1); render(); },
      besFmImg() { leggiForm(); const i = document.getElementById('fm-file'); if (i) i.click(); },
      async besFmFile(el) { const file = el.files[0]; el.value = ''; if (!file) return; leggiForm(); try { B.f.imgData = await riduciImg(file); B.f.imgNuova = true; B.f.imgTolta = false; } catch (e) { toast('Immagine non leggibile'); } render(); },
      besFmImgTogli() { leggiForm(); B.f.imgData = null; B.f.imgNuova = false; B.f.imgTolta = true; render(); },
      besFmAnnulla() { B.f = null; B.fmMsg = ''; render(); },
      async besFmAnteprima() {
        leggiForm(); const m = costruisci(B.f); if (!m.n) { toast('Scrivi prima il nome del mostro'); return; }
        m.id = B.f.id || -1; if (B.f.imgData) B.imgMem.set(m.id, B.f.imgData); else if (m.id === -1) B.imgMem.delete(-1);
        const r = document.getElementById('fm-risultato'); if (r) { r.hidden = false; r.querySelector('h4').textContent = '👁 Anteprima della carta (non ancora salvata)'; r.querySelector('[data-az="besFmStampa"]').hidden = true; r.querySelector('[data-az="besFmAggAvv"]').hidden = true; }
        await prova([{ m, n: 1 }]); if (r) r.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      async besFmSalva() {
        leggiForm(); const f = B.f; const m = costruisci(f);
        if (!m.n) { toast('Scrivi il nome del mostro'); return; }
        if ((B.mostri || []).some((x) => x.id !== f.id && nomeNorm(x.n) === nomeNorm(m.n))) { toast('Esiste già un mostro chiamato «' + m.n + '»: scegli un altro nome'); return; }
        if (!f.id) m.id = Math.max(99999, ...(B.mostri || []).filter((x) => x.fo === 'pers').map((x) => x.id)) + 1;
        m.aggiornato = new Date().toISOString();
        const pers = m.fo === 'pers';
        try { if (cloud()) await (pers ? C.persScrivi(m) : C.modScrivi(m)); } catch (e) { B.errore = e.message; toast('Salvataggio online non riuscito: ' + e.message); render(); return; }
        B.mostri = (B.mostri || []).filter((x) => x.id !== m.id).concat([m]).sort((a, c) => a.n.localeCompare(c.n, 'it') || (a.id - c.id)); B.mappa = new Map(B.mostri.map((x) => [x.id, x]));
        if (pers) await kv.set('pers', B.mostri.filter((x) => x.fo === 'pers')); else await kv.set('mod', ((await kv.get('mod')) || []).filter((x) => x.id !== m.id).concat([m]));
        try { if (f.imgNuova && f.imgData) await salvaImg(m.id, f.imgData); else if (f.imgTolta && B.imgIds.has(m.id)) await togliImg(m.id); } catch (e) { B.errore = e.message; toast('Mostro salvato, ma l\'immagine no: ' + e.message); }
        B.imgMem.delete(-1); B.f = null; B.nuovoDone = pers ? m.id : null; B.sel = m.id; if (!pers) B.tab = 'cerca'; B.fmMsg = ''; await leggiImg(m.id); render();
        toast(pers ? '✔ «' + m.n + '» salvato tra i mostri' : '✔ «' + m.n + '» corretto per tutti i gestori'); await prova([{ m, n: 1 }]); const r = document.getElementById('fm-risultato'); if (r) r.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      async besFmCarta(el) { const id = Number(el.dataset.id); const m = B.mappa.get(id); if (!m) return; B.nuovoDone = id; await leggiImg(id); render(); await prova([{ m, n: 1 }]); const r = document.getElementById('fm-risultato'); if (r) r.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
      async besFmStampa() { const m = B.mappa.get(B.nuovoDone); if (m) await stampaOra([{ m, n: 1 }]); },
      async besModIn(el) {
        const m = B.mappa.get(Number(el.dataset.id)); if (!m) return;
        if (m.fo !== 'pers') {
          if (!window.confirm('⚠ ATTENZIONE\n\nStai modificando un mostro esistente: «' + m.n + '» (' + (FONTI[m.fo || 'mm'] ? FONTI[m.fo || 'mm'].n : m.fo) + ', p. ' + m.pg + ').\n\nQuesta modifica cambierà le statistiche di questo mostro PER TUTTI I GESTORI.\n\nSei sicuro di voler modificare?')) return;
          if (!window.confirm('ULTIMA CONFERMA\n\nProcedo quindi con la procedura di modifica del mostro «' + m.n + '»?\n\nQuesta operazione sarà definitiva.')) return;
        }
        B.f = formDa(m); B.f.id = m.id; B.f.imgData = await leggiImg(m.id); B.nuovoDone = null; B.fmMsg = ''; B.tab = 'nuovo'; render(); window.scrollTo(0, 0);
      },
      async besFmRipristina() {
        const f = B.f; if (!f || !f.id || !window.confirm('Ripristinare i dati originali del manuale per «' + f.n + '»? Le tue correzioni andranno perse, per tutti i gestori.')) return;
        try { if (cloud()) await C.modElimina(f.id); } catch (e) { toast('Ripristino non riuscito: ' + e.message); return; }
        await kv.set('mod', ((await kv.get('mod')) || []).filter((x) => x.id !== f.id)); const id = f.id; B.f = null; B.carico = false; B.prep = false; await carica(true); B.sel = id; B.tab = 'cerca'; render(); toast('Dati originali ripristinati');
      },
      besFmChiudi() { B.nuovoDone = null; render(); },
      async besFmAggAvv() { const id = B.nuovoDone; const a = avvCorr(); if (id != null && a && (a.voci || []).some((v) => v.id === id)) { toast('È già in «' + a.nome + '»'); return; } if (id != null) await aggiungi(id); },
      async besFmElimina(el) {
        const id = Number(el.dataset.id); const m = B.mappa.get(id); if (!m || !window.confirm('Eliminare il mostro «' + m.n + '»? Sparisce dall\'elenco e dalle avventure per tutti i gestori.')) return;
        try { if (cloud()) await C.persElimina(id); } catch (e) { toast('Eliminazione non riuscita: ' + e.message); return; }
        B.mostri = B.mostri.filter((x) => x.id !== id); B.mappa = new Map(B.mostri.map((x) => [x.id, x])); await kv.set('pers', B.mostri.filter((x) => x.fo === 'pers'));
        if (B.imgIds.has(id)) await togliImg(id).catch(() => {});
        for (const a of B.avv) { if ((a.voci || []).some((v) => v.id === id)) { a.voci = a.voci.filter((v) => v.id !== id); await salvaAvv(a).catch(() => {}); } }
        B.sa.delete(id); B.sc.delete(id); if (B.sel === id) B.sel = null; if (B.nuovoDone === id) B.nuovoDone = null; toast('Mostro eliminato'); render();
      },
      besQ(el) { B.q = el.value; B.limite = 40; const r = $('#bes-ris'); if (r) r.innerHTML = righeRisultati(); },
      besF(el) { B[el.dataset.k] = el.value; B.limite = 40; render(); },
      besAltri() { B.limite += 60; const r = $('#bes-ris'); if (r) r.innerHTML = righeRisultati(); },
      async besApri(el, e) {
        B.sel = Number(el.dataset.id); await leggiImg(B.sel);
        const r = $('#bes-ris'); if (r) r.innerHTML = righeRisultati(); const d = $('#bes-det'); if (d) { d.innerHTML = dettaglio(); if (window.innerWidth < 800) d.scrollIntoView({ behavior: 'smooth' }); } else { render(); }
      },
      async besApriDa(el, e) { if (e) e.preventDefault(); B.sel = Number(el.dataset.id); B.tab = 'cerca'; await leggiImg(B.sel); render(); },
      besAgg(el, e) { if (e) e.stopPropagation(); const id = Number(el.dataset.id); if (B.sa.has(id)) B.sa.delete(id); else B.sa.add(id); if (!B.sa.size) B.dlg = ''; ridisegna(); },
      besSaAvanti() { B.dlg = B.avv.length ? 'esist' : 'nuova'; ridisegna(); },
      besSaScelta(el) { B.dlg = el.dataset.v; ridisegna(); },
      besSaSvuota() { B.sa.clear(); B.dlg = ''; ridisegna(); },
      async besSaConferma() {
        let a;
        if (B.dlg === 'nuova') {
          const nome = ((document.getElementById('bes-sa-nome') || {}).value || '').trim().replace(/\s+/g, ' ');
          if (!nome) { toast('Scrivi il nome della nuova avventura'); return; }
          if (nomeEsiste(nome)) { toast('Esiste già un\'avventura chiamata «' + nome + '»: scegli un altro nome'); return; }
          a = { id: uid(), nome, voci: [] }; B.avv.push(a);
        } else { const sel = document.getElementById('bes-sa-avv'); a = B.avv.find((x) => x.id === (sel && sel.value)); if (!a) { toast('Scegli un\'avventura'); return; } }
        B.avvId = a.id; a.voci = a.voci || []; let n = 0;
        B.sa.forEach((id) => { if (!a.voci.some((v) => v.id === id)) { a.voci.push({ id, q: 1 }); n++; } });
        await salvaAvv(a).catch((e) => { B.errore = e.message; });
        B.sa.clear(); B.dlg = ''; toast('✔ ' + n + ' mostri aggiunti a «' + a.nome + '» (' + a.voci.length + ' in tutto)'); ridisegna();
      },
      besAvvSel(el) { B.avvId = el.value; B.stampa = ''; render(); },
      async besAvvNuova() { const a = await creaAvv(); if (!a) return; toast('✔ Avventura «' + a.nome + '» creata: ora i mostri con ＋ vanno qui'); ridisegna(); },
      async besAvvNome(el) { const a = avvCorr(); if (!a) return; const nv = el.value.trim().replace(/\s+/g, ' '); if (!nv) { window.alert('Il nome non può essere vuoto.'); el.value = a.nome; return; } if (nomeEsiste(nv, a.id)) { window.alert('Esiste già un\'avventura chiamata «' + nv + '»: scegli un nome diverso.'); el.value = a.nome; return; } a.nome = nv; await salvaAvv(a).catch((e) => { B.errore = e.message; }); const y = window.scrollY; render(); window.scrollTo(0, y); },
      async besAvvElimina() { const a = avvCorr(); if (!a || !window.confirm('Eliminare l\'avventura «' + a.nome + '»?')) return; B.avv = B.avv.filter((x) => x.id !== a.id); B.avvId = B.avv[0] ? B.avv[0].id : null; if (cloud()) await C.avvElimina(a.id).catch((e) => { B.errore = e.message; }); await kv.set('avv', B.avv); render(); },
      async besQta(el) { const a = avvCorr(); const v = a && a.voci.find((x) => x.id === Number(el.dataset.id)); if (!v) return; v.q = Math.max(1, v.q + Number(el.dataset.d)); await salvaAvv(a).catch((e) => { B.errore = e.message; }); ridisegna(); },
      async besTogliVoce(el) { const a = avvCorr(); if (!a) return; a.voci = a.voci.filter((x) => x.id !== Number(el.dataset.id)); await salvaAvv(a).catch((e) => { B.errore = e.message; }); ridisegna(); },
      besOpz(el) { leggiForm(); B.opz[el.dataset.k] = el.type === 'checkbox' ? el.checked : el.value; B.stampa = ''; ridisegna(); },
      besCk(el, e) { const id = Number(el.dataset.id); if (el.checked) B.sc.add(id); else B.sc.delete(id); B.stampa = ''; ridisegna(); },
      besScSvuota() { B.sc.clear(); B.stampa = ''; ridisegna(); },
      async besStampaSel() { await prova(vociSel()); },
      async besStampaSelOra() { await stampaOra(vociSel()); },
      async besStampaAvv() { const a = avvCorr(); if (a) await prova(vociStampa(a)); },
      async besStampaOra() { const a = avvCorr(); if (a) await stampaOra(vociStampa(a)); },
      async besStampa1(el) {
        const m = B.mappa.get(Number(el.dataset.id)); if (!m) return;
        const cont = document.createElement('div'); document.body.appendChild(cont); cont.style.cssText = 'position:absolute;left:-9999px;top:0';
        try { const r = await carteDocumento([{ m, n: 1 }], B.opz, cont); if (!r.n) return; document.getElementById('stampa').innerHTML = cont.innerHTML; } finally { cont.remove(); }
        window.FORGIA_X.stampaPronta();
      },
      async besCarteInc(el) {
        const m = B.mappa.get(Number(el.dataset.id)); if (!m) return; const r = incantesimiMostro(m); if (!r.ids.length) return;
        const cont = document.createElement('div'); document.body.appendChild(cont); cont.style.cssText = 'position:absolute;left:-9999px;top:0';
        try { const n = await X.carteSemplici(r.ids, cont); if (!n) return; document.getElementById('stampa').innerHTML = cont.innerHTML; } finally { cont.remove(); }
        window.FORGIA_X.stampaPronta();
      },
      besImg(el) { B.imgId = Number(el.dataset.id); const f = document.getElementById('bes-file-img'); if (f) f.click(); },
      async besFileImg(el) {
        const file = el.files[0]; el.value = ''; if (!file || B.imgId == null) return;
        try { const d = await riduciImg(file); await salvaImg(B.imgId, d); B.sel = B.imgId; B.errore = ''; } catch (e) { B.errore = 'Immagine non salvata: ' + e.message; }
        ridisegna();
      },
      async besImgTogli(el) { const id = Number(el.dataset.id); if (!window.confirm('Rimuovere l\'immagine di questo mostro?')) return; await togliImg(id).catch((e) => { B.errore = e.message; }); ridisegna(); },
      besImgBlocco() { const f = document.getElementById('bes-file-imgs'); if (f) f.click(); },
      async besFileImgs(el) {
        const files = [...el.files]; el.value = ''; if (!files.length) return; const idx = new Map(); (B.mostri || []).forEach((m) => idx.set(slug(m.n), m));
        let ok = 0; const no = [];
        for (const f of files) {
          const base = slug(f.name.replace(/\.[^.]+$/, '').replace(/[-_ ]*\(?\d+\)?$/, '')); const m = idx.get(base);
          if (!m) { no.push(f.name); continue; }
          try { await salvaImg(m.id, await riduciImg(f)); ok++; } catch (e) { no.push(f.name); }
          B.msgImg = 'Caricate ' + ok + ' immagini…'; const z = $('.mute:last-child'); void z;
        }
        B.msgImg = ok + ' immagini caricate' + (no.length ? '. Non riconosciute (controlla il nome del file): ' + no.join(', ') : '.'); ridisegna();
      },
      besSenzaImg() { const a = avvCorr(); const L = (a ? a.voci : []).map((v) => B.mappa.get(v.id)).filter((m) => m && !B.imgIds.has(m.id)); mostraSenza(L); },
      besSenzaImgTutti() { mostraSenza((B.mostri || []).filter((m) => !B.imgIds.has(m.id))); },
      besImporta() { const f = document.getElementById('bes-file-json'); if (f) f.click(); },
      async besFileJson(el) {
        const file = el.files[0]; el.value = ''; if (!file) return;
        try {
          const dati = JSON.parse(await file.text()); if (!Array.isArray(dati) || !dati.length || !dati[0].n || !dati[0].car) throw new Error('file non valido');
          B.imp = 'Importazione di ' + dati.length + ' mostri…'; ridisegna();
          let ex = []; if (cloud()) { try { ex = await C.mostriLeggi(); } catch (e) { ex = []; } } if (!ex.length) ex = ((await kv.get('mostri')) || B.mostri || []).filter((m) => m.fo !== 'pers'); const nuovi = new Set(dati.map((m) => m.id)); const tutti = ex.filter((m) => !nuovi.has(m.id)).concat(dati).sort((a, b) => a.id - b.id);
          if (cloud()) await C.mostriScrivi(tutti, (i, n) => { B.imp = 'Scrivo ' + i + '/' + n + '…'; });
          await kv.set('mostri', tutti); B.carico = false; B.prep = false; await carica(true); B.imp = 'Importati ' + dati.length + ' mostri (totale ' + tutti.length + ').';
        } catch (e) { B.imp = 'Importazione non riuscita: ' + (e.message || e); }
        ridisegna();
      },
    };
    document.addEventListener('input', (e) => { if (e.target.dataset && e.target.dataset.az === 'besQ') az.besQ(e.target); });
    Object.assign(az, X.azioniIncontri({ B, avvCorr, salva: salvaAvv, opzioniStampa, prova, stampaOra, ridisegna: () => ridisegna(), toast, pgs: () => (c.pgs ? c.pgs() : []) }));
    return az;
  };
  X.statoBestiario = () => ({ modo: B.modo, tab: B.tab });
  X.bestiarioReset = () => { B.mostri = null; B.mappa = null; B.carico = false; B.prep = false; B.imgIds = new Set(); B.imgMem.clear(); B.avv = []; B.avvId = null; B.sel = null; };
  function mostraSenza(L) {
    const box = document.getElementById('bes-senza'); if (!box) return;
    if (!L.length) { box.innerHTML = '<p class="mute">Tutti i mostri hanno un\'immagine. 🎉</p>'; return; }
    const testo = L.map((m) => m.n).join('\n');
    box.innerHTML = '<div class="card"><h4>Mostri senza immagine (' + L.length + ')</h4><p class="mute">Cerca le immagini e caricale dalla scheda del mostro, oppure tutte insieme con «Carica immagini (più file)» dando ai file il nome del mostro.</p><ul class="bes-senza">'
      + L.map((m) => '<li>' + esc(m.n) + ' <a target="_blank" rel="noopener" href="' + esc(ricercaImg(m)) + '">🔎 cerca</a></li>').join('') + '</ul><p><a class="pic sec" download="mostri-senza-immagine.txt" href="data:text/plain;charset=utf-8,' + encodeURIComponent(testo) + '">⬇ Scarica l\'elenco (.txt)</a></p></div>';
  }
  X.bestiarioStato = B; X.bestiarioInterni = { cercaNome: (k) => cercaNome(k, dizionario()), incantesimiMostro, scegliFormato, FORMATI, creaFronte, entra, carteDocumento };
})(typeof globalThis !== 'undefined' ? globalThis : window);
