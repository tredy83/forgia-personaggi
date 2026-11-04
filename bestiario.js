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
  const B = { mostri: null, carico: false, errore: '', imgIds: new Set(), imgMem: new Map(), avv: [], avvId: null, tab: 'cerca', q: '', tipo: '', tg: '', fo: '', gsMin: '', gsMax: '', sel: null, limite: 40, msg: '', imp: '', opz: { dorso: 'immagine', leggi: 'normale', esemplari: false, ordine: 'nome' }, stampa: '', prep: false };
  let ridisegna = () => {};
  const FONTI = { mm: { n: 'Manuale dei Mostri', s: 'Man. Mostri' }, mtm: { n: 'Mordenkainen presenta: Mostri del Multiverso', s: 'Mostri Multiverso' } };
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
      B.mostri = lista.slice().sort((a, b) => a.n.localeCompare(b.n, 'it') || (a.id - b.id));
      B.mappa = new Map(B.mostri.map((m) => [m.id, m]));
      B.imgIds = new Set(cloud() ? await C.imgIndice().catch(async () => (await kv.get('imgids')) || []) : ((await kv.get('imgids')) || []));
      B.avv = cloud() ? await C.avvLeggi().catch(async () => (await kv.get('avv')) || []) : ((await kv.get('avv')) || []);
      if (cloud()) { kv.set('imgids', [...B.imgIds]); kv.set('avv', B.avv); }
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
      + '<div class="mc-foot"><span>Sfida ' + esc(gsT(m)) + '</span><span>' + esc(f.k === 'S' ? fonte(m).s : fonte(m).n) + ' · p. ' + esc(m.pg) + '</span></div></div>';
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
            const d = creaRetro(x.m, f, x.img, opz.dorso); const cc = f.spec ? f.nc - 1 - col : col; d.style.left = f.ox + cc * f.w + 'mm'; d.style.top = f.oy + riga * f.h + 'mm'; rt.appendChild(d);
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
    const hr = mostra.map((m) => '<div class="bes-riga' + (B.sel === m.id ? ' sel' : '') + '" data-az="besApri" data-id="' + m.id + '"><div class="bes-r1"><b>' + esc(m.n) + '</b> <span class="mute">' + tipoRiga(m).split(',')[0] + '</span></div><div class="bes-r2">' + esc(fonte(m).s) + ' p. ' + esc(m.pg) + ' · GS ' + esc(gsT(m)) + ' · CA ' + esc(m.ca) + ' · PF ' + esc(m.pf) + (B.imgIds.has(m.id) ? ' · 🖼' : '') + '</div><button class="pic sec" data-az="besAgg" data-id="' + m.id + '" title="Aggiungi all\'avventura">＋</button></div>').join('');
    return '<div class="mute" style="margin:.3rem 0">' + L.length + ' mostri' + (L.length > mostra.length ? ' (ne mostro ' + mostra.length + ')' : '') + '</div>' + (hr || '<div class="vuoto">Nessun mostro trovato.</div>') + (L.length > mostra.length ? '<p><button class="sec" data-az="besAltri">Mostra altri…</button></p>' : '');
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
    return '<div class="bes-det"><div class="bes-az"><button class="oro" data-az="besStampa1" data-id="' + m.id + '">🖨 Stampa la carta</button> <button class="sec" data-az="besAgg" data-id="' + m.id + '">＋ Aggiungi all\'avventura</button> <button class="sec" data-az="besImg" data-id="' + m.id + '">🖼 ' + (B.imgIds.has(m.id) ? 'Cambia immagine' : 'Carica immagine') + '</button>' + (B.imgIds.has(m.id) ? ' <button class="sec" data-az="besImgTogli" data-id="' + m.id + '">Rimuovi immagine</button>' : '') + ' <a class="pic sec" target="_blank" rel="noopener" href="' + esc(ricercaImg(m)) + '">🔎 Cerca un\'immagine</a></div>'
      + avvisoInc(m) + (img ? '<img class="bes-foto" src="' + img + '" alt="">' : '') + '<div class="mb mb-sch"><h4>' + esc(m.n) + '</h4><div class="mb-t">' + tipoRiga(m) + '</div><hr class="mb-hr">' + corpoHTML(m) + '</div><p class="mute" style="font-size:.78rem">' + esc(fonte(m).n) + ', p. ' + esc(m.pg) + (m.inc ? ' · ⚠ scheda forse incompleta (azioni non trovate nella lettura del PDF): controlla sul manuale.' : '') + '</p></div>';
  }
  const tabCerca = () => {
    const tipi = [...new Set((B.mostri || []).map((m) => m.tipo))].sort(); const tgs = ['Minuscol', 'Piccol', 'Medi', 'Grande', 'Enorme', 'Mastodontic'];
    const gs = optGS(); const o = (v, l, s) => '<option value="' + esc(v) + '"' + (s ? ' selected' : '') + '>' + esc(l) + '</option>';
    return '<div class="card"><div class="riga bes-filtri"><input type="search" id="bes-q" placeholder="Cerca un mostro per nome o tipo…" value="' + esc(B.q) + '" data-az="besQ">'
      + '<select data-az="besF" data-k="fo">' + o('', 'Ogni manuale', !B.fo) + Object.keys(FONTI).filter((k) => (B.mostri || []).some((m) => (m.fo || 'mm') === k)).map((k) => o(k, FONTI[k].n, B.fo === k)).join('') + '</select>'
      + '<select data-az="besF" data-k="tipo">' + o('', 'Ogni tipo', !B.tipo) + tipi.map((t) => o(t, t, B.tipo === t)).join('') + '</select>'
      + '<select data-az="besF" data-k="tg">' + o('', 'Ogni taglia', !B.tg) + tgs.map((t) => o(t, t + 'a/o', B.tg === t)).join('') + '</select>'
      + '<select data-az="besF" data-k="gsMin">' + o('', 'GS da…', B.gsMin === '') + gs.map((g) => o(g, 'GS ' + g, B.gsMin === g)).join('') + '</select>'
      + '<select data-az="besF" data-k="gsMax">' + o('', 'GS fino a…', B.gsMax === '') + gs.map((g) => o(g, 'GS ' + g, B.gsMax === g)).join('') + '</select></div></div>'
      + '<div class="bes-griglia"><div class="card"><div id="bes-ris">' + righeRisultati() + '</div></div><div class="card" id="bes-det">' + dettaglio() + '</div></div>';
  };
  function conteggiAvv(a) { return (a.voci || []).reduce((s, v) => s + v.q, 0); }
  const tabAvv = () => {
    const a = avvCorr(); const sel = '<select data-az="besAvvSel">' + (B.avv.length ? '' : '<option value="">— nessuna avventura —</option>') + B.avv.map((x) => '<option value="' + x.id + '"' + (x.id === B.avvId ? ' selected' : '') + '>' + esc(x.nome || 'Senza nome') + ' (' + conteggiAvv(x) + ')</option>').join('') + '</select>';
    let corpo = '<p class="mute">Crea una lista per ogni avventura, poi aggiungi i mostri dalla scheda <b>Cerca</b> con il pulsante ＋.</p>';
    if (a) {
      const righe = (a.voci || []).map((v) => { const m = B.mappa.get(v.id); if (!m) return ''; return '<tr><td><a href="#" data-az="besApriDa" data-id="' + m.id + '">' + esc(m.n) + '</a> <span class="mute">GS ' + esc(gsT(m)) + ' · ' + esc(fonte(m).s) + ' p. ' + esc(m.pg) + '</span>' + (B.imgIds.has(m.id) ? ' 🖼' : '') + '</td><td class="q"><button class="pic sec" data-az="besQta" data-id="' + m.id + '" data-d="-1">−</button> <b>' + v.q + '</b> <button class="pic sec" data-az="besQta" data-id="' + m.id + '" data-d="1">＋</button></td><td><button class="pic sec" data-az="besTogliVoce" data-id="' + m.id + '" title="Togli">✕</button></td></tr>'; }).join('');
      const senza = (a.voci || []).map((v) => B.mappa.get(v.id)).filter((m) => m && !B.imgIds.has(m.id));
      corpo = '<div class="riga"><div class="col"><label>Nome dell\'avventura</label><input type="text" data-az="besAvvNome" value="' + esc(a.nome) + '"></div></div>'
        + ((a.voci || []).length ? '<table class="bes-tab"><thead><tr><th>Mostro</th><th>Quantità</th><th></th></tr></thead><tbody>' + righe + '</tbody></table>' : '<div class="vuoto">La lista è vuota: aggiungi dei mostri dalla scheda Cerca.</div>')
        + '<div class="card bes-stampa"><h4>🖨 Stampa le carte di questa avventura</h4>' + opzioniStampa()
        + '<p><button class="oro" data-az="besStampaAvv"' + ((a.voci || []).length ? '' : ' disabled') + '>👁 Crea le carte</button> <button data-az="besStampaOra">🖨 Stampa</button> <span class="mute">' + (B.stampa || '') + '</span></p><div id="bes-prev"></div></div>'
        + '<p><button class="sec" data-az="besSenzaImg">📋 Elenco mostri senza immagine (' + senza.length + ')</button> <button class="sec pericolo" data-az="besAvvElimina">Elimina avventura</button></p><div id="bes-senza"></div>';
    }
    return '<div class="card"><h3>📜 Avventure</h3><div class="riga">' + sel + ' <button class="sec" data-az="besAvvNuova">＋ Nuova avventura</button></div>' + corpo + '</div>';
  };
  const opzioniStampa = () => '<div class="riga"><label>Retro <select data-az="besOpz" data-k="dorso"><option value="immagine"' + (B.opz.dorso === 'immagine' ? ' selected' : '') + '>Immagine del mostro (se manca: logo)</option><option value="logo"' + (B.opz.dorso === 'logo' ? ' selected' : '') + '>Sempre il logo (adulti)</option><option value="bianco"' + (B.opz.dorso === 'bianco' ? ' selected' : '') + '>Bianco con il nome</option><option value="nessuno"' + (B.opz.dorso === 'nessuno' ? ' selected' : '') + '>Solo fronti (niente retro)</option></select></label>'
    + '<label>Testo <select data-az="besOpz" data-k="leggi"><option value="normale"' + (B.opz.leggi === 'normale' ? ' selected' : '') + '>Normale (carte più piccole)</option><option value="grande"' + (B.opz.leggi === 'grande' ? ' selected' : '') + '>Più grande (carte più grandi)</option></select></label>'
    + '<label><input type="checkbox" data-az="besOpz" data-k="esemplari"' + (B.opz.esemplari ? ' checked' : '') + '> una carta per ogni esemplare</label></div>';
  const tabDati = () => {
    const n = (B.mostri || []).length; const senza = (B.mostri || []).filter((m) => !B.imgIds.has(m.id));
    return '<div class="card"><h3>📥 Dati dei mostri</h3><p>' + (n ? '<b>' + n + ' mostri</b> caricati, <b>' + B.imgIds.size + '</b> con immagine.' : 'Nessun mostro caricato.') + '</p>'
      + '<p class="mute">I dati vengono dal file <code>mostri-manuale-dei-mostri.json</code> (consegnato a parte: non è nel sito pubblico). Si importa <b>una sola volta</b> e resta nell\'archivio privato dei gestori' + (cloud() ? ' (online, visibile solo ai gestori)' : ' di questo dispositivo') + '. Gli altri manuali si aggiungono importando un altro file: i mostri già presenti restano, e le avventure non cambiano.</p>'
      + '<p><button class="oro" data-az="besImporta">⬆ Importa file dei mostri</button> <span class="mute">' + esc(B.imp) + '</span></p></div>'
      + '<div class="card"><h3>🖼 Immagini</h3><p class="mute">Carica più immagini in una volta: il nome del file deve essere quello del mostro (es. <code>goblin.jpg</code>, <code>drago-rosso-antico.png</code>). Le immagini vengono ridotte e salvate' + (cloud() ? ' online, nell\'archivio privato dei gestori' : ' su questo dispositivo') + '. <b>Usa solo immagini che hai il diritto di usare</b> (tue, libere, o per uso privato al tavolo).</p>'
      + '<p><button class="oro" data-az="besImgBlocco">⬆ Carica immagini (più file)</button> <button class="sec" data-az="besSenzaImgTutti">📋 Elenco di tutti i mostri senza immagine (' + senza.length + ')</button></p><div id="bes-senza"></div><div class="mute">' + esc(B.msgImg || '') + '</div></div>';
  };
  X.vistaBestiario = function () {
    if (!B.carico) { if (!B.prep) { B.prep = true; carica(); } return '<div class="barra-elenco"><button class="sec" data-az="tornaElenco">← Personaggi</button></div><p class="mute centro">Carico il bestiario…</p>'; }
    const vuoto = !(B.mostri || []).length;
    const tabs = [['cerca', '🔎 Cerca'], ['avv', '📜 Avventure'], ['dati', '⚙ Dati e immagini']].map(([id, l]) => '<button class="' + (B.tab === id ? 'attiva' : '') + '" data-az="besTab" data-t="' + id + '">' + l + '</button>').join('');
    return '<div class="barra-elenco"><button class="sec" data-az="tornaElenco">← Personaggi</button><b style="font-size:1.1rem">📖 Bestiario del Dungeon Master</b></div>'
      + (B.errore ? '<div class="avviso">⚠ ' + esc(B.errore) + '</div>' : '')
      + (vuoto && B.tab !== 'dati' ? '<div class="avviso">Il bestiario è vuoto: importa il file dei mostri dalla scheda <b>Dati e immagini</b>. <button class="pic oro" data-az="besTab" data-t="dati">Vai</button></div>' : '')
      + '<div class="tabs bes-tabs">' + tabs + '</div>' + (B.tab === 'cerca' ? tabCerca() : B.tab === 'avv' ? tabAvv() : tabDati())
      + '<input type="file" id="bes-file-json" accept=".json,application/json" hidden data-az="besFileJson"><input type="file" id="bes-file-img" accept="image/*" hidden data-az="besFileImg"><input type="file" id="bes-file-imgs" accept="image/*" multiple hidden data-az="besFileImgs">';
  };

  /* ---------- azioni ---------- */
  X.azioniBestiario = function (c) {
    const { S, render } = c; ridisegna = () => { if (S.vista === 'bestiario') { const y = window.scrollY; render(); window.scrollTo(0, y); } };
    const aggiungi = async (id) => {
      let a = avvCorr(); if (!a) { a = { id: uid(), nome: 'Nuova avventura', voci: [] }; B.avv.push(a); B.avvId = a.id; }
      const v = a.voci.find((x) => x.id === id); if (v) v.q++; else a.voci.push({ id, q: 1 });
      B.msg = ''; await salvaAvv(a).catch((e) => { B.errore = e.message; }); ridisegna();
    };
    const vociStampa = (a) => (a.voci || []).map((v) => ({ m: B.mappa.get(v.id), n: B.opz.esemplari ? v.q : 1 })).filter((v) => v.m);
    const prova = async (voci) => {
      const cont = document.getElementById('bes-prev'); if (!cont) return;
      cont.innerHTML = '<p class="mute">Preparo le carte…</p>'; const r = await carteDocumento(voci, B.opz, cont); B.stampa = r.n ? r.n + ' carte: ' + descrFormati(r.stat) : '';
      const sp = $('.bes-stampa .mute:last-of-type'); if (sp) sp.textContent = B.stampa;
    };
    const stampaOra = async (voci) => { const cont = document.getElementById('bes-prev'); if (!cont) return; if (!cont.querySelector('.cartapag')) await prova(voci); if (!cont.querySelector('.cartapag')) return; document.getElementById('stampa').innerHTML = cont.innerHTML; window.print(); };
    const az = {
      vaiBestiario() { S.vista = 'bestiario'; render(); },
      besTab(el) { B.tab = el.dataset.t; B.stampa = ''; render(); },
      besQ(el) { B.q = el.value; B.limite = 40; const r = $('#bes-ris'); if (r) r.innerHTML = righeRisultati(); },
      besF(el) { B[el.dataset.k] = el.value; B.limite = 40; render(); },
      besAltri() { B.limite += 60; const r = $('#bes-ris'); if (r) r.innerHTML = righeRisultati(); },
      async besApri(el, e) {
        B.sel = Number(el.dataset.id); await leggiImg(B.sel);
        const r = $('#bes-ris'); if (r) r.innerHTML = righeRisultati(); const d = $('#bes-det'); if (d) { d.innerHTML = dettaglio(); if (window.innerWidth < 800) d.scrollIntoView({ behavior: 'smooth' }); } else { render(); }
      },
      async besApriDa(el, e) { if (e) e.preventDefault(); B.sel = Number(el.dataset.id); B.tab = 'cerca'; await leggiImg(B.sel); render(); },
      besAgg(el, e) { if (e) e.stopPropagation(); aggiungi(Number(el.dataset.id)); },
      besAvvSel(el) { B.avvId = el.value; B.stampa = ''; render(); },
      async besAvvNuova() { const nome = window.prompt('Nome della nuova avventura:', ''); if (nome === null) return; const a = { id: uid(), nome: nome.trim() || 'Nuova avventura', voci: [] }; B.avv.push(a); B.avvId = a.id; await salvaAvv(a).catch((e) => { B.errore = e.message; }); B.tab = 'avv'; render(); },
      async besAvvNome(el) { const a = avvCorr(); if (!a) return; a.nome = el.value; await salvaAvv(a).catch((e) => { B.errore = e.message; }); const y = window.scrollY; render(); window.scrollTo(0, y); },
      async besAvvElimina() { const a = avvCorr(); if (!a || !window.confirm('Eliminare l\'avventura «' + a.nome + '»?')) return; B.avv = B.avv.filter((x) => x.id !== a.id); B.avvId = B.avv[0] ? B.avv[0].id : null; if (cloud()) await C.avvElimina(a.id).catch((e) => { B.errore = e.message; }); await kv.set('avv', B.avv); render(); },
      async besQta(el) { const a = avvCorr(); const v = a && a.voci.find((x) => x.id === Number(el.dataset.id)); if (!v) return; v.q = Math.max(1, v.q + Number(el.dataset.d)); await salvaAvv(a).catch((e) => { B.errore = e.message; }); ridisegna(); },
      async besTogliVoce(el) { const a = avvCorr(); if (!a) return; a.voci = a.voci.filter((x) => x.id !== Number(el.dataset.id)); await salvaAvv(a).catch((e) => { B.errore = e.message; }); ridisegna(); },
      besOpz(el) { B.opz[el.dataset.k] = el.type === 'checkbox' ? el.checked : el.value; B.stampa = ''; ridisegna(); },
      async besStampaAvv() { const a = avvCorr(); if (a) await prova(vociStampa(a)); },
      async besStampaOra() { const a = avvCorr(); if (a) await stampaOra(vociStampa(a)); },
      async besStampa1(el) {
        const m = B.mappa.get(Number(el.dataset.id)); if (!m) return;
        const cont = document.createElement('div'); document.body.appendChild(cont); cont.style.cssText = 'position:absolute;left:-9999px;top:0';
        try { const r = await carteDocumento([{ m, n: 1 }], B.opz, cont); if (!r.n) return; document.getElementById('stampa').innerHTML = cont.innerHTML; } finally { cont.remove(); }
        window.print();
      },
      async besCarteInc(el) {
        const m = B.mappa.get(Number(el.dataset.id)); if (!m) return; const r = incantesimiMostro(m); if (!r.ids.length) return;
        const cont = document.createElement('div'); document.body.appendChild(cont); cont.style.cssText = 'position:absolute;left:-9999px;top:0';
        try { const n = await X.carteSemplici(r.ids, cont); if (!n) return; document.getElementById('stampa').innerHTML = cont.innerHTML; } finally { cont.remove(); }
        window.print();
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
          let ex = []; if (cloud()) { try { ex = await C.mostriLeggi(); } catch (e) { ex = []; } } if (!ex.length) ex = (await kv.get('mostri')) || B.mostri || []; const nuovi = new Set(dati.map((m) => m.id)); const tutti = ex.filter((m) => !nuovi.has(m.id)).concat(dati).sort((a, b) => a.id - b.id);
          if (cloud()) await C.mostriScrivi(tutti, (i, n) => { B.imp = 'Scrivo ' + i + '/' + n + '…'; });
          await kv.set('mostri', tutti); B.carico = false; B.prep = false; await carica(true); B.imp = 'Importati ' + dati.length + ' mostri (totale ' + tutti.length + ').';
        } catch (e) { B.imp = 'Importazione non riuscita: ' + (e.message || e); }
        ridisegna();
      },
    };
    document.addEventListener('input', (e) => { if (e.target.dataset && e.target.dataset.az === 'besQ') az.besQ(e.target); });
    return az;
  };
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
