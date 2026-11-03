/* Carte incantesimo stampabili: 9 carte per foglio A4 (fronti), con il foglio dei dorsi dopo ogni foglio di fronti. */
(function (G) {
  const D = (G.DND = G.DND || {}); const X = (G.FORGIA_X = G.FORGIA_X || {}); const M = D.M;
  const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const COL = { abiurazione: '#6dc3d3', ammaliamento: '#b34485', evocazione: '#59326c', divinazione: '#d7cb42', invocazione: '#377c54', illusione: '#393f7d', necromanzia: '#80453a', trasmutazione: '#7ebf5d' };
  const ENG = { abjuration: 'abiurazione', enchantment: 'ammaliamento', conjuration: 'evocazione', divination: 'divinazione', evocation: 'invocazione', illusion: 'illusione', necromancy: 'necromanzia', transmutation: 'trasmutazione' };
  const CLASSI = [['mago', 'Mago'], ['bardo', 'Bardo'], ['chierico', 'Chierico'], ['druido', 'Druido'], ['stregone', 'Stregone'], ['warlock', 'Warlock'], ['ranger', 'Ranger'], ['paladino', 'Paladino']];
  const DORSI = [['pergamena', 'Pergamena (a colori)'], ['nero', 'Nero con drago (molto inchiostro)'], ['bianco', 'Bianco (risparmia inchiostro)']];
  const OPZ0 = { truc: true, prep: true, libro: false, dorso: 'pergamena' };
  const opz = (ch) => Object.assign({}, OPZ0, ch.carte || {});
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const scuolaKey = (s) => { const k = norm(s.scuola); return COL[k] ? k : (ENG[k] || 'abiurazione'); };
  const scuri = (hex) => { const n = parseInt(hex.slice(1), 16); const f = (v) => Math.round(v * 0.62); return 'rgb(' + f(n >> 16) + ',' + f((n >> 8) & 255) + ',' + f(n & 255) + ')'; };

  // incantesimi da stampare, in base alle scelte del personaggio
  X.carteElenco = function (ch) {
    const o = opz(ch); const ids = []; const add = (id) => { if (id && !ids.includes(id)) ids.push(id); };
    Object.keys(ch.inc || {}).forEach((k) => {
      const s = ch.inc[k]; if (!s) return;
      if (o.truc) (s.truc || []).forEach(add);
      if (o.prep) [].concat(s.conos || [], s.prep || []).forEach(add);
      if (o.libro) (s.libro || []).forEach(add);
    });
    const SB = M.derive(ch).incSub; if (SB && o.prep) SB.voci.filter((v) => v.disp).forEach((v) => add(v.id));
    const R = M.derive(ch).incRazza; if (R) R.voci.filter((v) => v.disp).forEach((v) => { if (v.spLiv === 0 ? o.truc : o.prep) add(v.id); });
    return ids.map((id) => D.incantesimo(id)).filter(Boolean).sort((a, b) => a.liv - b.liv || a.nome.localeCompare(b.nome));
  };

  const fmtGitt = (t) => String(t || '').replace(/^Incantatore/i, 'Personale').replace(/\bmetri\b/g, 'm').replace(/\bmetro\b/g, 'm').replace(/\bchilometri\b/g, 'km');
  const fmtDur = (t) => { let d = String(t || '').replace(/^Concentrazione,\s*(massimo|fino a)\s*/i, '').replace(/^Concentrazione,?\s*/i, ''); return d.charAt(0).toUpperCase() + d.slice(1); };
  const fmtTempo = (t) => { let d = String(t || '').split(',')[0]; return d.charAt(0).toUpperCase() + d.slice(1); };
  const costo = (s) => { const m = /(\d[\d.]*)\s*mo\b/.exec(s.comp || ''); if (!m) return ''; return m[1] + ' mo' + (/consum/i.test((s.comp || '') + ' ' + s.testo) ? '*' : ''); };
  const ico = (n, on, st) => '<img class="ic' + (on ? ' on' : '') + '" src="carte/' + n + '.png" style="' + st + '" alt="">';

  function tokens(s) {
    const out = []; const rid = D.TESTO_CARTA && D.TESTO_CARTA[s.id];
    const par = rid ? [rid] : s.desc.concat(s.alto ? ['Ai livelli più alti. ' + s.alto] : []);
    par.forEach((p, i) => { if (i) out.push('\n'); String(p).split(/\s+/).filter(Boolean).forEach((w) => out.push(w)); });
    return out;
  }
  function tokHtml(tk, pre, post) {
    let h = '<p>'; const w = tk.slice();
    if (pre) w.unshift('…'); if (post) w.push('…');
    w.forEach((t, i) => { if (t === '\n') h += '</p><p>'; else h += (h.endsWith('<p>') ? '' : ' ') + esc(t); });
    return h + '</p>';
  }

  function creaCarta(s, parte, tot) {
    const k = scuolaKey(s); const c = COL[k]; const el = document.createElement('div'); el.className = 'carta'; el.style.setProperty('--c', c); el.style.setProperty('--cd', scuri(c));
    const man = String(s.comp || '').replace(/\([^)]*\)/g, ''); const V = /\bV\b/.test(man), So = /\bS\b/.test(man), Ma = /\bM\b/.test(man);
    const band = [s.scuola, s.rituale ? 'Rituale' : '', s.conc ? 'Concentrazione' : ''].filter(Boolean).join(' · ') + (tot > 1 ? ' · carta ' + parte + '/' + tot : '');
    const rif = D.fonteEtichetta(s, true) + (s.sintesi ? ' · sintesi' : '') + (D.TESTO_CARTA && D.TESTO_CARTA[s.id] ? ' · testo ridotto' : '');
    el.innerHTML = '<div class="c-bar"></div><img class="c-sc" src="carte/scuola_' + k + '.png" alt="">'
      + '<div class="c-nome">' + esc(s.nome.replace(/\s*\(.*\)\s*$/, '')) + '</div><div class="c-liv">Liv ' + s.liv + '</div>'
      + '<div class="c-r" style="top:14.8mm">Gittata</div><div class="c-v" style="top:14.8mm">' + esc(fmtGitt(s.gittata)) + '</div>'
      + '<div class="c-r" style="top:19.9mm">Durata</div>' + (s.conc ? '<img class="c-conc" src="carte/concentrazione.png" alt="">' : '') + '<div class="c-v' + (s.conc ? ' conc' : '') + '" style="top:19.9mm">' + esc(fmtDur(s.durata)) + '</div>'
      + '<div class="c-r" style="top:25mm">Lancio</div><div class="c-v" style="top:25mm">' + esc(fmtTempo(s.tempo)) + '</div>'
      + '<div class="c-cls">' + CLASSI.map((x) => '<div' + (s.classi.includes(x[0]) ? ' class="on"' : '') + '>' + x[1] + '</div>').join('') + '</div>'
      + ico('rituale', s.rituale, 'left:7.6mm;top:31.1mm;height:6.6mm') + ico('verbale', V, 'left:16mm;top:31.6mm;height:5.6mm') + ico('somatico', So, 'left:25mm;top:31.2mm;height:6.4mm') + ico('materiale', Ma, 'left:32mm;top:31.2mm;height:6.4mm')
      + (Ma && costo(s) ? '<div class="c-cost">' + esc(costo(s)) + '</div>' : '')
      + '<div class="c-band">' + esc(band) + '</div><div class="c-txt"><div class="c-in"></div></div><div class="c-ref">' + esc(rif) + '</div>';
    return el;
  }
  function riduci(box, sel, max, min, passo) {
    let sz = max; box.style.fontSize = sz + 'pt';
    while (sz > min && (box.scrollWidth > box.clientWidth + 0.5 || box.scrollHeight > box.clientHeight + 0.5)) { sz -= passo; box.style.fontSize = sz + 'pt'; }
  }

  // costruisce le carte (con eventuale divisione dei testi lunghi) dentro il contenitore "stage" già in pagina
  function costruisci(lista, stage) {
    const carte = [];
    lista.forEach((s) => {
      const tk = tokens(s); const SIZES = [7, 6.6, 6.2, 5.9, 5.7, 5.5, 5.3];
      const prova = (card, arr, pre, post, size) => { const txt = card.querySelector('.c-txt'); const inn = card.querySelector('.c-in'); txt.style.fontSize = size + 'pt'; inn.innerHTML = tokHtml(arr, pre, post); return inn.offsetHeight <= txt.clientHeight - 5; };
      // quante carte servono? prima prova a stare in una sola
      let c0 = creaCarta(s, 1, 1); stage.appendChild(c0);
      // il corpo si rimpicciolisce a piccoli passi finché tutto il testo sta nel riquadro
      let ok = false;
      for (let sz = 7; sz >= 3.4; sz = Math.round((sz - 0.1) * 10) / 10) if (prova(c0, tk, false, false, sz)) { ok = true; break; }
      rifinisci(c0); carte.push(c0); c0.dataset.fit = ok ? '1' : '0';
    });
    return carte;
  }
  function rifinisci(card) { riduci(card.querySelector('.c-nome'), null, 13, 6, 0.4); card.querySelectorAll('.c-v').forEach((v) => riduci(v, null, 8.6, 4.8, 0.3)); riduci(card.querySelector('.c-band'), null, 7.4, 5, 0.3); }

  X.carteDocumento = async function (ch, cont) {
    const o = opz(ch); const lista = X.carteElenco(ch);
    cont.innerHTML = ''; if (!lista.length) { cont.innerHTML = '<p class="mute">Nessun incantesimo selezionato: scegli prima gli incantesimi qui sopra.</p>'; return 0; }
    const stage = document.createElement('div'); stage.style.cssText = 'position:absolute;left:-9999px;top:0;width:63mm;height:88mm'; document.body.appendChild(stage);
    try {
      await Promise.allSettled(['13pt Ringbearer', '9pt MPlantin', 'bold 9pt MPlantin', 'italic 9pt MPlantin'].map((f) => document.fonts.load(f)));
      const carte = costruisci(lista, stage);
      const doc = document.createElement('div'); doc.className = 'carte-doc';
      for (let i = 0; i < carte.length; i += 9) {
        const gruppo = carte.slice(i, i + 9);
        const fr = document.createElement('section'); fr.className = 'cartapag'; const rt = document.createElement('section'); rt.className = 'cartapag';
        gruppo.forEach((cd, j) => {
          const col = j % 3, riga = Math.floor(j / 3); cd.style.top = 16.5 + riga * 88 + 'mm'; cd.style.left = 10.5 + col * 63 + 'mm'; fr.appendChild(cd);
          const d = document.createElement('div'); d.className = 'carta dorso d-' + o.dorso; d.innerHTML = '<div class="d-t">Incantesimo</div>'; d.style.backgroundImage = 'url(carte/dorso_' + o.dorso + '.jpg)'; d.style.top = 16.5 + riga * 88 + 'mm'; d.style.left = 10.5 + (2 - col) * 63 + 'mm'; rt.appendChild(d);   // dorso speculare per la stampa fronte-retro
        });
        doc.appendChild(fr); doc.appendChild(rt);
      }
      cont.appendChild(doc);
      // seconda verifica a carte già in pagina: se qualcosa sborda ancora, il corpo si riduce ancora un po'
      carte.forEach((cd) => { const t = cd.querySelector('.c-txt'); let z = parseFloat(t.style.fontSize) || 6.6; while (z > 3 && (t.scrollHeight > t.clientHeight + 1 || t.scrollWidth > t.clientWidth + 1)) { z = Math.round((z - 0.1) * 10) / 10; t.style.fontSize = z + 'pt'; } });
      return carte.length;
    } finally { stage.remove(); }
  };

  X.tabCarte = function (ch) {
    const dd = M.derive(ch); if (!dd.incantesimi.classi.length && !dd.incRazza && !dd.incSub) return '';
    const o = opz(ch); const n = X.carteElenco(ch).length;
    const chk = (k, et) => '<label><input type="checkbox" data-az="carteOpt" data-k="' + k + '"' + (o[k] ? ' checked' : '') + '> ' + et + '</label>';
    return '<div class="card carte-opz"><h3>🃏 Carte incantesimo</h3><p class="mute">Stampa le carte degli incantesimi scelti: 9 per foglio A4, con un foglio di fronti e uno di dorsi (stampa fronte-retro sul lato lungo). Dopo la stampa ritaglia lungo i bordi.</p>'
      + '<p>' + chk('truc', 'Trucchetti') + chk('prep', 'Conosciuti / preparati') + chk('libro', 'Tutti gli incantesimi del libro') + '</p>'
      + '<div class="riga"><label>Dorso <select data-az="carteOpt" data-k="dorso">' + DORSI.map((d) => '<option value="' + d[0] + '"' + (o.dorso === d[0] ? ' selected' : '') + '>' + d[1] + '</option>').join('') + '</select></label></div>'
      + '<p><span class="chip">' + n + ' incantesimi selezionati</span> <button class="oro" data-az="carteAnteprima">👁 Crea anteprima</button> <button data-az="carteStampa">🖨 Stampa carte</button></p>'
      + '<div id="carte-prev"></div>'
      + '<p class="mute" style="font-size:.78rem">Ogni incantesimo occupa una sola carta: i testi più lunghi sono in versione ridotta. Per gli incantesimi non SRD il testo è una sintesi. Grafica ispirata a nBeebz\'s 5e Spell Cards (CC BY-NC-SA 4.0, uso non commerciale): vedi carte/CREDITI.txt.</p></div>';
  };

  X.azioniCarte = function (c) {
    const { corrente, salvaCorrente, render } = c;
    const costruisciOra = async () => { const ch = corrente(); const cont = document.getElementById('carte-prev'); if (!ch || !cont) return 0; cont.innerHTML = '<p class="mute">Preparo le carte…</p>'; return X.carteDocumento(ch, cont); };
    return {
      carteOpt(el) { const ch = corrente(); ch.carte = Object.assign({}, OPZ0, ch.carte || {}); ch.carte[el.dataset.k] = el.type === 'checkbox' ? el.checked : el.value; salvaCorrente(); const y = window.scrollY; render(); window.scrollTo(0, y); },
      async carteAnteprima() { await costruisciOra(); },
      async carteStampa() {
        const cont = document.getElementById('carte-prev'); if (!cont) return;
        if (!cont.querySelector('.cartapag')) { const n = await costruisciOra(); if (!n) return; }
        document.getElementById('stampa').innerHTML = cont.innerHTML; window.print();
      },
    };
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
