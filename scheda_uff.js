/* Scheda sul modello ufficiale WotC (PDF in italiano): immagine di sfondo + testo sovrapposto in punti PDF (594x783).
   Pagine 1-3 = scheda ufficiale; pagina 4 = privilegi e tratti completi; pagina 5 (facoltativa) = descrizioni incantesimi. */
(function (G) {
  const D = G.DND, M = D.M;
  const X = (G.FORGIA_X = G.FORGIA_X || {});
  // ritratti disponibili: razza-classe-genere (file in ritratti/). Si aggiungono qui nuove combinazioni.
  const RITRATTI = new Set(['umano', 'elfo', 'nano']);
  X.ritratto = (ch) => {
    const g = ch.genere === 'F' ? 'femmina' : 'maschio';
    const f = ch.razza + '-' + (ch.livelli && ch.livelli[0]) + '-' + g;
    return RITRATTI.has(ch.razza) && ch.livelli && ch.livelli[0] && !(X.ritrattiMancanti || []).includes(f) ? 'ritratti/' + f + '.webp' : '';
  };
  X.ritrattiMancanti = [];
  const ESC = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // logo Argini Ludici in bianco e nero (pagine della scheda ufficiale e pagine di testo)
  const LOGO = '<img src="logo-argini-bn.png" alt="Argini Ludici" style="position:absolute;left:534pt;top:757pt;width:26pt;height:26pt">';
  const LOGO_P = '<img class="logo-pag" src="logo-argini-bn.png" alt="Argini Ludici">';

  // dimensione del carattere adattata alla larghezza del riquadro (stima prudente per i caratteri "a mano"): mai sopra il massimo, mai sotto 4,5 pt
  const FS = (txt, max, w) => Math.round(Math.max(4.5, Math.min(max, w / (Math.max(1, String(txt || '').length) * 0.62))) * 10) / 10;

  // elementi posizionati (coordinate in pt, origine in alto a sinistra)
  const T = (x, y, txt, o = {}) => '<span class="uf-t" style="left:' + x + 'pt;top:' + y + 'pt;' + (o.w ? 'width:' + o.w + 'pt;' : '') + (o.s ? 'font-size:' + o.s + 'pt;' : '') + (o.a ? 'text-align:' + o.a + ';' : '') + (o.b ? 'font-weight:700;' : '') + '">' + ESC(txt) + '</span>';
  const C = (x, y, txt, s, w) => T(x - (w || 60) / 2, y - (s || 10) * 0.62, txt, { w: w || 60, a: 'center', s: s || 10, b: 1 });   // centrato su (x,y)
  const B = (x, y, w, h, txt, s, lh) => '<div class="uf-b" style="left:' + x + 'pt;top:' + y + 'pt;width:' + w + 'pt;height:' + h + 'pt;font-size:' + (s || 7) + 'pt;line-height:' + (lh || (s || 7) + 1.5) + 'pt">' + ESC(txt) + '</div>';
  const DOT = (x, y, k) => '<i class="uf-dot ' + (k || '') + '" style="left:' + (x - 3.2) + 'pt;top:' + (y - 3.2) + 'pt"></i>';
  const RING = (x, y) => '<i class="uf-ring" style="left:' + (x - 4) + 'pt;top:' + (y - 4) + 'pt"></i>';

  const SKILL_ROWS = [['acrobazia', 317], ['addestrare', 330], ['arcano', 344], ['atletica', 357], ['furtivita', 371], ['indagare', 384], ['inganno', 398], ['intimidire', 411], ['intrattenere', 425], ['intuizione', 438], ['medicina', 452], ['natura', 465], ['percezione', 479], ['persuasione', 492], ['rapidita', 506], ['religione', 519], ['sopravvivenza', 533], ['storia', 546]];
  const SAVE_ROWS = [202, 215, 229, 242, 256, 269];
  const AB_BOX = [135, 207, 278, 350, 422, 493];
  const AB_OVAL = [186.5, 258.5, 329.5, 401.5, 472.5, 544.5];
  // righe incantesimi (y della riga): [colonna, y iniziali]
  const rows = (y0, n, p) => Array.from({ length: n }, (_, i) => y0 + i * (p || 14));
  const LIV = {
    0: { col: 0, y: rows(177.9, 8), circ: false },
    1: { col: 0, y: rows(348.9, 13), head: 317 }, 2: { col: 0, y: rows(575.5, 13), head: 546.5 },
    3: { col: 1, y: rows(179.2, 13), head: 149.5 }, 4: { col: 1, y: rows(404.8, 13), head: 375.5 }, 5: { col: 1, y: rows(631.3, 9), head: 602 },
    6: { col: 2, y: rows(179.2, 9), head: 149.5 }, 7: { col: 2, y: rows(349, 9), head: 319.5 }, 8: { col: 2, y: rows(518.8, 7), head: 489 }, 9: { col: 2, y: rows(659.5, 7), head: 630 },
  };
  const COLX = [0, 189, 376];

  function dati(ch, d) {
    const dt = ch.dett || {};
    return { dt, X: (k) => dt[k] || '' };
  }

  X.foglioUff = function (ch, u) {
    const d = M.derive(ch); const f = d.fin; const dt = ch.dett || {}; const fmt = u.fmt; const metri = u.metri;
    const clTxt = d.classi.map((c) => c.def.nome + ' ' + c.livello).join(' / ');
    const subTxt = d.classi.filter((c) => c.sottoclasseAttiva && c.sub).map((c) => c.sub.nome).join(', ');
    const razzaTxt = d.razza.nome + (d.sub ? ' (' + d.sub.nome + ')' : '');
    const gio = (ch.giocatore.nome + ' ' + ch.giocatore.cognome).trim();
    let h = '';

    /* ---------- PAGINA 1 ---------- */
    h += C(143, 63.5, ch.nome || '', FS(ch.nome, 15, 185), 185);
    const tcl = clTxt + (subTxt ? ' – ' + subTxt : '');
    h += T(264, 44, tcl, { s: FS(tcl, 8.5, 108), w: 108 }) + T(377, 44, d.sfondo.nome, { s: FS(d.sfondo.nome, 8.5, 92), w: 92 }) + T(473, 44, gio, { s: FS(gio, 8.5, 92), w: 92 });
    h += T(264, 70, razzaTxt, { s: FS(razzaTxt, 8.5, 108), w: 108 }) + T(377, 70, ch.allineamento || '', { s: FS(ch.allineamento, 8.5, 92), w: 92 }) + T(473, 70, dt.xp || '', { s: FS(dt.xp, 8.5, 92), w: 92 });
    D.ABIL.forEach((a, i) => {
      h += C(50.5, AB_BOX[i] + 25, fmt(d.mods[a]), 17, 50) + C(50.5, AB_OVAL[i], f[a], 10, 30);
    });
    h += C(102, 170.5, fmt(d.pb), 11, 26);
    d.salvezze.forEach((s, i) => {
      const y = SAVE_ROWS[i];
      if (s.comp) h += DOT(96.5, y + 3.7);
      h += T(104, y - 1.4, fmt(s.bonus), { s: 8.5, w: 16, a: 'center', b: 1 });
    });
    SKILL_ROWS.forEach(([id, y]) => {
      const s = d.abilita.find((x) => x.id === id); if (!s) return;
      if (s.mae) h += RING(96.5, y + 3.7); else if (s.comp) h += DOT(96.5, y + 3.7);
      h += T(104, y - 1.4, fmt(s.bonus), { s: 8.5, w: 16, a: 'center', b: 1 });
    });
    h += C(36, 592.5, d.percezionePassiva, 11, 28);
    h += C(241, 151, d.ca, 17, 40) + C(297, 152, fmt(d.iniziativa), 15, 48) + C(355, 152, metri(d.velocita), metri(d.velocita).length > 4 ? 10 : 13, 48);
    h += T(303, 189, d.pf, { s: 10, b: 1, w: 66 });
    h += C(256, 331, d.dadiVita, 11, 76);
    // attacchi (3 righe grigie + righe sotto)
    const att = d.attacchi;
    const attY = [386.5, 407.5, 427.5];
    att.slice(0, 3).forEach((a, i) => { h += T(218, attY[i], a.nome, { s: FS(a.nome, 7.5, 62), w: 62 }) + T(285, attY[i], fmt(a.bonus), { s: 8.5, w: 31, a: 'center', b: 1 }) + T(321, attY[i] + (a.danno.length > 14 ? 0.5 : 0), a.danno, { s: a.danno.length > 14 ? 6 : 7, w: 60 }); });
    const extra = att.slice(3).map((a) => a.nome + '  ' + fmt(a.bonus) + '  ' + a.danno);
    if (d.attacchiPerAzione > 1) extra.unshift('Attacchi per azione: ' + d.attacchiPerAzione);
    h += B(216, 441.5, 168, 112, extra.join('\n'), 7, 11);
    // competenze e linguaggi
    const comp = d.competenze; const lista = (a) => a.length ? a.join(', ') : '—';
    h += B(29, 617.2, 164, 130, 'Armature: ' + lista(comp.armature) + '\nArmi: ' + lista(comp.armi) + '\nAltro: ' + comp.altro + '\nLinguaggi: ' + lista(d.lingue), 6.8, 11);
    // monete
    [['pr', 601], ['pa', 627], ['pe', 653], ['po', 679], ['pp', 704.5]].forEach(([k, y]) => { h += C(237, y, dt['m_' + k] || '', 9, 40); });
    // equipaggiamento
    const arma = D.armatura(ch.armatura || 'nessuna');
    const eq = [(arma.id !== 'nessuna' ? 'Armatura: ' + arma.nome : ''), (ch.scudo ? 'Scudo' : ''), ch.equip].filter(Boolean).join('\n');
    h += B(264, 584.2, 120, 164, eq, 6.8, 11);
    // personalità
    h += B(414, 132, 152, 58, dt.tratti || '', 6.8, 9) + B(414, 201, 152, 45, dt.ideali || '', 6.8, 9) + B(414, 257, 152, 45, dt.legami || '', 6.8, 9) + B(414, 311, 152, 46, dt.difetti || '', 6.8, 9);
    // privilegi e tratti: solo nomi (testo completo a pagina 4)
    {
      // elenco abilità: nome + breve descrizione, ridotto se non entra nel riquadro
      const voci = d.privilegi.filter((x) => !x.nascosto).map((p) => ({ u: p.usi, n: p.nome, d: (p.fonte !== 'Stile' && !/ \d+$/.test(p.fonte || '') && /: /.test(p.nome)) ? '': p.desc }))
        .concat(d.tratti.filter((x) => !x.nascosto).map((t) => ({ n: t.nome, d: t.desc })))
        .concat(d.talenti.map((t) => ({ n: 'Talento: ' + t.nome, d: t.desc || '' })));
      const taglia = (t, max) => { if (!t || t.length <= max) return t; const c = t.slice(0, max); const p = Math.max(c.lastIndexOf('. '), c.lastIndexOf('; '), c.lastIndexOf(', ')); return (p > max * 0.5 ? c.slice(0, p) : c.slice(0, c.lastIndexOf(' '))) + '…'; };
      // le righe stampate nel riquadro distano 11 pt: ogni riga di testo occupa esattamente una riga del modulo
      const LH = 11.0; const RIGHE_MAX = 32;
      const tiers = [[900, 7.2], [500, 7], [300, 6.8], [150, 6.8], [90, 6.8], [60, 6.8], [0, 7]];
      let scelta = tiers[tiers.length - 1], testo = [];
      for (const [mx, fs] of tiers) {
        const cpl = Math.floor(160 / (fs * 0.5)); let righe = 0;
        testo = voci.map((v) => ({ u: v.u, n: v.n, d: mx ? taglia(v.d, mx) : '' }));
        testo.forEach((v) => { righe += Math.ceil((v.n.length + 2 + (v.d ? v.d.length + 1 : 0)) / cpl) + (v.u ? Math.ceil(v.u / 22) : 0); });
        scelta = [mx, fs];
        if (righe + (mx ? 0 : 1) <= RIGHE_MAX) break;
      }
      const corpo = testo.map((v) => '<div><b>' + ESC(v.n) + '.</b>' + (v.d ? ' ' + ESC(v.d) : '') + (v.u ? '<br>' + '<i class="cerchio" style="width:2.6mm;height:2.6mm;margin:0 .9mm 0 0"></i>'.repeat(v.u) : '') + '</div>').join('');
      h += '<div class="uf-b" style="left:408pt;top:384.8pt;width:160pt;height:' + (LH * RIGHE_MAX) + 'pt;font-size:' + scelta[1] + 'pt;line-height:' + LH + 'pt">' + corpo + (voci.length && !scelta[0] ? '<div style="font-size:6pt">(Descrizioni complete a pagina 4)</div>' : '') + '</div>';
    }
    const p1 = '<section class="uffpag"><img class="uf-bg" src="uff_1.jpg" alt="">' + h + LOGO + '</section>';

    /* ---------- PAGINA 2 ---------- */
    h = C(143, 64, ch.nome || '', (ch.nome || '').length > 18 ? 11.5 : 15, 185);
    h += T(256, 44, dt.eta || '', { s: FS(dt.eta, 9, 100), w: 100 }) + T(369, 44, dt.altezza || '', { s: FS(dt.altezza, 9, 92), w: 92 }) + T(466, 44, dt.peso || '', { s: FS(dt.peso, 9, 92), w: 92 });
    h += T(256, 70, dt.occhi || '', { s: FS(dt.occhi, 9, 100), w: 100 }) + T(369, 70, dt.pelle || '', { s: FS(dt.pelle, 9, 92), w: 92 }) + T(466, 70, dt.capelli || '', { s: FS(dt.capelli, 9, 92), w: 92 });
    const rit = ch.ritrattoScheda && X.ritratto(ch);
    if (ch.simboloScheda && ch.simbolo) {
      const nm = ch.simbolo.nome || '';
      h += '<div style="position:absolute;left:412pt;top:144.7pt;width:140pt;height:15pt;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-weight:700;color:#222;font-size:' + (nm.length > 26 ? 6.2 : nm.length > 20 ? 7.2 : 8.4) + 'pt;white-space:nowrap">' + ESC(nm) + '</div>'
        + '<div style="position:absolute;left:412pt;top:163pt;width:140pt;height:111pt;display:flex;align-items:center;justify-content:center">' + X.simboloSVG(ch.simbolo, 92, 110) + '</div>';
    }
    h += rit ? '<img src="' + rit + '" alt="" style="position:absolute;left:29pt;top:125pt;width:161pt;height:215pt;object-fit:contain">' : B(29, 125, 161, 215, dt.aspetto || '', 8, 11);
    h += B(218, 119, 170, 218, dt.alleati || '', 7.5, 12.1);
    h += B(28, 372.6, 164, 372, dt.storia || '', 7.5, 11);
    h += B(218, 360, 350, 205, ch.note || '', 7.5, 12.1);
    h += B(218, 614.8, 350, 130, dt.tesoro || '', 7.5, 11);
    const p2 = '<section class="uffpag"><img class="uf-bg" src="uff_2.jpg" alt="">' + h + LOGO + '</section>';

    /* ---------- PAGINA 3: incantesimi ---------- */
    let p3 = '';
    const inc = d.incantesimi;
    const RZ = d.incRazza; const soloRazza = !inc.classi.length && RZ;
    if (inc.classi.length || soloRazza) {
      const lc = soloRazza ? [{ classe: 'Razza: ' + (d.sub ? d.sub.nome : d.razza.nome), car: RZ.car, cd: RZ.cd, att: RZ.att }] : inc.classi;
      h = T(62, 66, lc.map((k) => k.classe).join(' / '), { s: FS(lc.map((k) => k.classe).join(' / '), 11, 185), b: 1, w: 185 });
      h += C(309, 61, lc.map((k) => D.ABIL_SIGLA[k.car]).filter((v, i, a) => a.indexOf(v) === i).join('/'), 13, 70);
      h += C(409, 61, lc.map((k) => k.cd).join(' / '), 15, 70);
      h += C(512, 61, lc.map((k) => fmt(k.att)).join(' / '), 15, 70);
      // liste incantesimi scelti
      const per = {}; const visti = new Set();
      inc.classi.forEach((k) => {
        const s = (ch.inc || {})[k.id]; if (!s) return;
        const prep = new Set([].concat(s.prep || []));
        const noti = [].concat(s.truc || [], s.conos || [], s.prep || []);
        const libroSolo = (s.libro || []).filter((id) => !prep.has(id));
        noti.concat(libroSolo).forEach((id) => {
          if (visti.has(id)) return; visti.add(id);
          const sp = D.incantesimo(id); if (!sp) return;
          const preparato = noti.includes(id);
          (per[sp.liv] = per[sp.liv] || []).push({ nome: sp.nome, fonte: D.fonteEtichetta(sp, true), prep: preparato });
        });
      });
      if (d.incSub) d.incSub.voci.filter((v) => v.disp).forEach((v) => { if (visti.has(v.id)) return; visti.add(v.id); const sp = D.incantesimo(v.id); (per[sp.liv] = per[sp.liv] || []).push({ nome: sp.nome, fonte: 'sottoclasse', prep: true }); });
      if (RZ) RZ.voci.filter((v) => v.disp).forEach((v) => { if (visti.has(v.id)) return; visti.add(v.id); const sp = D.incantesimo(v.id); (per[sp.liv] = per[sp.liv] || []).push({ nome: sp.nome, fonte: 'razza', prep: true }); });
      for (let l = 0; l <= 9; l++) {
        const cfg = LIV[l]; const ox = COLX[cfg.col];
        const lista = (per[l] || []).sort((a, b) => (b.prep - a.prep) || a.nome.localeCompare(b.nome));
        if (l > 0) {
          const tot = (inc.slot[l - 1] || 0) + inc.classi.filter((k) => k.patto && k.patto[1] === l).reduce((a, k) => a + k.patto[0], 0);
          if (tot) {
            h += C(67 + ox, cfg.head, tot, 12, 40);
            for (let i = 0; i < tot && i < 9; i++) h += RING(100 + ox + i * 10.5, cfg.head);
          }
        }
        const n = cfg.y.length;
        lista.slice(0, n).forEach((s, i) => {
          const y = cfg.y[i];
          if (l > 0) { h += s.prep ? DOT(28 + ox, y - 3.6) : ''; }
          h += '<span class="uf-t" style="left:' + ((l > 0 ? 41 : 30) + ox) + 'pt;top:' + (y - 10.4) + 'pt;width:' + (l > 0 ? 150 : 165) + 'pt;font-size:8pt">' + ESC(s.nome) + ' <span style="font-size:5.5pt;opacity:.8">(' + ESC(s.fonte) + ')</span></span>';
        });
        if (lista.length > n) h += T(41 + ox, cfg.y[n - 1] + 1, '+' + (lista.length - n) + ' altri (vedi pagina 5)', { s: 6, w: 150 });
      }
      p3 = '<section class="uffpag"><img class="uf-bg" src="uff_3.jpg" alt="">' + h + LOGO + '</section>';
    }

    /* ---------- PAGINA 4: privilegi e tratti completi (modello semplice) ---------- */
    const ris = d.risorse.map((r) => '<p class="piccolo"><b>' + ESC(r[0]) + ':</b> ' + ESC(r[1]) + '</p>').join('');
    const priv = d.privilegi.filter((x) => !x.nascosto).map((p) => '<div class="privilegio"><h4>' + ESC(p.nome) + ' <small>' + ESC(p.fonte) + '</small></h4><p>' + ESC(p.desc) + '</p>' + (p.usi ? '<span class="usi">' + '<i class="cerchio"></i>'.repeat(p.usi) + '</span>' : '') + '</div>').join('');
    const trat = d.tratti.filter((x) => !x.nascosto).map((t) => '<div class="privilegio"><h4>' + ESC(t.nome) + '</h4><p>' + ESC(t.desc) + '</p></div>').join('');
    const tal = d.talenti.map((t) => '<div class="privilegio"><h4>' + ESC(t.nome) + ' <small>livello ' + t.liv + '</small></h4>' + (t.desc ? '<p>' + ESC(t.desc) + '</p>' : '') + '</div>').join('');
    const p4 = '<section class="pagina">' + LOGO_P + '<h2>' + ESC(ch.nome || 'Personaggio') + ' · privilegi e tratti</h2>' + (ris ? '<h3>Risorse</h3>' + ris : '')
      + '<h3>Privilegi di classe</h3><div class="due-col">' + priv + '</div><h3>Tratti razziali</h3><div class="due-col">' + trat + '</div>' + (tal ? '<h3>Talenti</h3><div class="due-col">' + tal + '</div>' : '') + '</section>';

    /* ---------- PAGINA 5: descrizioni incantesimi scelti ---------- */
    let p5 = '';
    if ((inc.classi.length || RZ) && dt.stampaDesc !== 'no') {
      const ids = []; if (d.incSub) d.incSub.voci.filter((v) => v.disp).forEach((v) => ids.push(v.id)); if (RZ) RZ.voci.filter((v) => v.disp).forEach((v) => ids.push(v.id)); inc.classi.forEach((k) => { const s = (ch.inc || {})[k.id]; if (s) [].concat(s.truc || [], s.conos || [], s.prep || [], s.libro || []).forEach((id) => { if (!ids.includes(id)) ids.push(id); }); });
      const sp = ids.map((id) => D.incantesimo(id)).filter(Boolean).sort((a, b) => a.liv - b.liv || a.nome.localeCompare(b.nome));
      if (sp.length) {
        p5 = '<section class="pagina pag-inc">' + LOGO_P + '<h2>Incantesimi di ' + ESC(ch.nome || 'Personaggio') + ' · descrizioni</h2><div class="inc-col">'
          + sp.map((s) => '<div class="privilegio"><h4>' + ESC(s.nome) + ' <small>' + (s.liv ? s.liv + '° livello' : 'trucchetto') + ' · ' + ESC(s.scuola) + (s.rituale ? ' · rituale' : '') + ' · ' + ESC(D.fonteEtichetta(s)) + '</small></h4><p class="piccolo"><i>' + ESC(s.tempo) + ' · ' + ESC(s.gittata) + ' · ' + ESC(s.comp) + ' · ' + ESC(s.durata) + '</i></p>'
            + (s.sintesi ? '<p class="piccolo"><i>(Sintesi: testo completo sul manuale)</i></p>' : '') + s.desc.map((p) => '<p class="piccolo">' + ESC(p) + '</p>').join('') + (s.alto ? '<p class="piccolo"><b>Ai livelli più alti.</b> ' + ESC(s.alto) + '</p>' : '') + '</div>').join('') + '</div></section>';
      }
    }
    return p1 + p2 + p3 + p4 + p5;
  };

  X.foglio = function (ch, u) {
    return ch.modelloScheda === 'semplice' ? X.foglioSemplice(ch, u) : X.foglioUff(ch, u);
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
