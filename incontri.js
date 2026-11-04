/* INITIATIVE TRACKER per il Dungeon Master (solo gestori): incontri con griglia di iniziativa, stampabile in A4.
   Gli incontri sono salvati dentro l'avventura (a.incontri), quindi viaggiano con essa. Si usa dalla scheda "Incontri" del Bestiario. */
(function (G) {
  const X = (G.FORGIA_X = G.FORGIA_X || {});
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rid = () => 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const NT = 20; // caselle del contatore dei turni
  const I = { sel: {}, pg: '', ok: false };
  let api = null;

  const incontri = (a) => (a.incontri = a.incontri || []);
  const corr = (a) => { const L = incontri(a); return L.find((x) => x.id === I.sel[a.id]) || (L[0] ? (I.sel[a.id] = L[0].id, L[0]) : null); };
  const mod = (v) => Math.floor(((Number(v) || 10) - 10) / 2);
  const tira = (m) => Math.floor(Math.random() * 20) + 1 + mod(m && m.car ? m.car[1] : 10);
  const ordinate = (inc) => inc.righe.map((r, i) => [r, i]).sort((x, y) => (y[0].ini === '' || y[0].ini == null ? -999 : y[0].ini) - (x[0].ini === '' || x[0].ini == null ? -999 : x[0].ini) || x[1] - y[1]).map((x) => x[0]);

  /* ---------- schermata ---------- */
  function tabella(inc) {
    const L = ordinate(inc);
    const hr = L.map((r) => '<tr' + (r.sorp ? ' class="sorp"' : '') + '><td><input type="checkbox" data-az="incRiga" data-k="sorp" data-id="' + r.id + '"' + (r.sorp ? ' checked' : '') + '></td>'
      + '<td><input class="n2" type="number" data-az="incRiga" data-k="ini" data-id="' + r.id + '" value="' + esc(r.ini) + '" placeholder="?"></td>'
      + '<td><input type="text" data-az="incRiga" data-k="n" data-id="' + r.id + '" value="' + esc(r.n) + '">' + (r.pg ? ' <span class="chip">PG</span>' : '') + '</td>'
      + '<td><input class="n2" type="text" data-az="incRiga" data-k="ca" data-id="' + r.id + '" value="' + esc(r.ca) + '"></td>'
      + '<td><input class="n3" type="text" data-az="incRiga" data-k="pf" data-id="' + r.id + '" value="' + esc(r.pf) + '"></td>'
      + '<td class="inc-bt">' + (r.mid ? '<button class="pic sec" data-az="incTira" data-id="' + r.id + '" title="Tira di nuovo l\'iniziativa (tutto il gruppo)">🎲</button> ' : '') + '<button class="pic sec" data-az="incTogli" data-id="' + r.id + '" title="Togli">✕</button></td></tr>').join('');
    return '<table class="inc-tab"><thead><tr><th>Sorpreso</th><th>Iniziativa</th><th>Nome</th><th>CA</th><th>PF</th><th></th></tr></thead><tbody>' + (hr || '<tr><td colspan="6" class="vuoto">Nessuno nell\'incontro: aggiungi i mostri qui sopra.</td></tr>') + '</tbody></table>';
  }
  X.tabIncontri = function () {
    const B = api.B; const a = api.avvCorr(); const esc2 = esc;
    if (!B.avv.length) return '<div class="card"><h3>⚔ Incontri</h3><p class="mute">Gli incontri si creano dentro un\'avventura. Crea prima l\'avventura e scegli i suoi mostri dalla scheda <b>Cerca</b> (pulsante ＋).</p><p><button class="oro" data-az="besTab" data-t="avv">Vai alle Avventure</button></p></div>';
    const sel = '<select data-az="besAvvSel">' + B.avv.map((x) => '<option value="' + x.id + '"' + (x.id === B.avvId ? ' selected' : '') + '>' + esc2(x.nome || 'Senza nome') + '</option>').join('') + '</select>';
    const inc = corr(a);
    let h = '<div class="card"><h3>⚔ Incontri</h3><div class="riga"><label>Avventura</label> ' + sel + '</div><div class="inc-sel">'
      + incontri(a).map((x) => '<button class="' + (inc && x.id === inc.id ? 'oro' : 'sec') + '" data-az="incSel" data-id="' + x.id + '">' + esc2(x.nome) + '</button>').join(' ') + ' <button class="sec" data-az="incNuovo">＋ Nuovo incontro</button></div>'
      + (!(a.voci || []).length ? '<p class="mute">Questa avventura non ha ancora mostri: aggiungili dalla scheda Cerca con il pulsante ＋.</p>' : '') + '</div>';
    if (!inc) return h + '<div class="card"><p class="mute">Premi <b>＋ Nuovo incontro</b> per cominciare (es. «Incontro 1»). Poi scegli quali mostri dell\'avventura ne fanno parte: entrano nella griglia con l\'iniziativa già tirata.</p></div>';
    const turni = Array.from({ length: NT }, (_, i) => '<span class="inc-t' + (i < (inc.turni || 0) ? ' on' : '') + '" data-az="incTurno" data-k="' + (i + 1) + '">' + (i + 1) + '</span>').join('');
    const mostri = (a.voci || []).map((v) => { const m = B.mappa.get(v.id); if (!m) return ''; const gia = inc.righe.filter((r) => r.mid === m.id).length;
      return '<div class="inc-m"><span><b>' + esc2(m.n) + '</b> <span class="mute">GS ' + esc2(m.gs) + ' · CA ' + esc2(m.ca) + ' · PF ' + esc2(m.pf) + ' · iniz. ' + (mod(m.car ? m.car[1] : 10) >= 0 ? '+' : '−') + Math.abs(mod(m.car ? m.car[1] : 10)) + (gia ? ' · nell\'incontro: ' + gia : '') + '</span></span>'
        + '<span><input class="n2" type="number" min="1" max="30" value="' + v.q + '" id="inc-q-' + m.id + '"> <button class="sec" data-az="incAgg" data-id="' + m.id + '">＋ Aggiungi</button></span></div>'; }).join('');
    const pgs = api.pgs().filter((p) => !p.cestinato).sort((x, y) => String(x.nome).localeCompare(String(y.nome), 'it'));
    h += '<div class="card"><div class="riga"><div class="col"><label>Nome dell\'incontro</label><input type="text" data-az="incNome" value="' + esc2(inc.nome) + '"></div></div>'
      + '<label>Note (nome dell\'incontro, pagina dell\'avventura, appunti…)</label><textarea data-az="incNote" rows="2" placeholder="Es. Pag. 42 · Imboscata nel bosco">' + esc2(inc.note || '') + '</textarea>'
      + '<p class="inc-turni"><b>Turni</b> <span class="mute">(tocca un numero per segnare i turni fatti)</span><br>' + turni + ' <button class="pic sec" data-az="incTurnoZero">azzera</button></p></div>'
      + '<div class="card"><h4>Mostri dell\'avventura</h4><p class="mute">Scegli quanti ne entrano nell\'incontro. Ogni tipo tira <b>una sola iniziativa</b> (d20 + Destrezza): 4 goblin hanno tutti lo stesso valore.</p>' + (mostri || '<p class="mute">Nessun mostro.</p>')
      + '<p><button class="oro" data-az="incAggTutti">＋ Aggiungi tutti i mostri dell\'avventura</button></p>'
      + '<h4>Personaggi</h4><div class="riga"><select id="inc-pg"><option value="">— scegli un personaggio salvato —</option>' + pgs.map((p) => '<option value="' + p.id + '">' + esc2(p.nome || 'Senza nome') + (p.campagna ? ' · ' + esc2(p.campagna) : '') + '</option>').join('') + '</select> <button class="sec" data-az="incAggPg">＋ Aggiungi</button> <button class="sec" data-az="incAggLibero">＋ Riga libera</button></div>'
      + '<p class="mute" style="font-size:.8rem">I personaggi si possono anche scrivere a mano sul foglio stampato, nella riga del loro valore di iniziativa.</p></div>'
      + '<div class="card"><h4>Griglia dell\'incontro</h4>' + tabella(inc)
      + '<p><button class="sec" data-az="incTiraTutti">🎲 Tira di nuovo tutte le iniziative dei mostri</button> <button class="oro" data-az="incStampa">🖨 Stampa (A4)</button> <button class="sec pericolo" data-az="incElimina">Elimina incontro</button></p></div>';
    return h;
  };

  /* ---------- foglio stampabile A4 ---------- */
  function foglio(a, inc) {
    const L = inc.righe.filter((r) => r.ini !== '' && r.ini != null); const da = L.length ? Math.max(20, ...L.map((r) => r.ini)) : 20; const fino = L.length ? Math.min(-5, ...L.map((r) => r.ini)) : -5;
    const righe = [];
    for (let v = da; v >= fino; v--) { const q = L.filter((r) => r.ini === v); if (!q.length) righe.push({ v }); else q.forEach((r) => righe.push({ v, r })); }
    const sen = inc.righe.filter((r) => r.ini === '' || r.ini == null); sen.forEach((r) => righe.push({ v: '', r }));
    const h = Math.max(5.2, Math.min(9, 232 / (righe.length + 1))); const fs = Math.min(11, h * 1.15);
    const cel = (x) => '<div class="ig-r"><span class="ig-s">' + (x.r && x.r.sorp ? '✕' : '') + '</span><span class="ig-i">' + x.v + '</span><span class="ig-n">' + (x.r ? esc(x.r.n) : '') + '</span><span class="ig-c">' + (x.r ? esc(x.r.ca) : '') + '</span><span class="ig-p">' + (x.r ? esc(x.r.pf) : '') + '</span></div>';
    return '<section class="ig-pag" style="--rh:' + h.toFixed(2) + 'mm;--fs:' + fs.toFixed(1) + 'pt"><div class="ig-top"><img src="logo-argini-bn.png" alt=""><div class="ig-tit"><b>' + esc(inc.nome) + '</b><span>' + esc(a.nome) + '</span></div>'
      + '<div class="ig-note">' + esc(inc.note || '').replace(/\n/g, '<br>') + '</div></div>'
      + '<div class="ig-turni"><b>Turni</b>' + Array.from({ length: NT }, (_, i) => '<span class="' + (i < (inc.turni || 0) ? 'on' : '') + '">' + (i + 1) + '</span>').join('') + '</div>'
      + '<div class="ig-h"><span>Sorpreso</span><span>Ordine iniziativa</span><span>Nome</span><span>CA</span><span>PF</span></div>' + righe.map(cel).join('') + '</section>';
  }

  X.azioniIncontri = function (a0) {
    api = a0;
    const cur = () => { const a = api.avvCorr(); return a ? { a, inc: corr(a) } : {}; };
    const salva = async (a) => { a.aggiornato = new Date().toISOString(); await api.salva(a); };
    const riga = (inc, id) => inc.righe.find((r) => r.id === id);
    const nuovaRiga = (m, ini, g, nome) => ({ id: rid(), g, mid: m.id, n: nome, ca: m.ca, pf: m.pf, ini, sorp: false });
    const aggMostro = (inc, m, q) => {
      const g = rid(); const ini = tira(m); const gia = inc.righe.filter((r) => r.mid === m.id);
      const tot = gia.length + q; if (tot > 1) gia.forEach((r, i) => { if (r.n === m.n) r.n = m.n + ' ' + (i + 1); });
      for (let i = 0; i < q; i++) inc.righe.push(nuovaRiga(m, ini, g, tot > 1 ? m.n + ' ' + (gia.length + i + 1) : m.n));
    };
    const az = {
      incSel(el) { const a = api.avvCorr(); if (a) I.sel[a.id] = el.dataset.id; api.ridisegna(); },
      async incNuovo() {
        const a = api.avvCorr(); if (!a) return; const L = incontri(a); let nome = 'Incontro ' + (L.length + 1), t = 'Nome del nuovo incontro:';
        for (;;) { nome = G.prompt(t, nome); if (nome === null) return; nome = nome.trim().replace(/\s+/g, ' '); if (!nome) { t = 'Il nome non può essere vuoto:'; nome = 'Incontro ' + (L.length + 1); continue; } if (L.some((x) => x.nome.toLowerCase() === nome.toLowerCase())) { t = 'Esiste già un incontro «' + nome + '» in questa avventura. Scegli un altro nome:'; continue; } break; }
        const inc = { id: rid(), nome, note: '', turni: 0, righe: [] }; L.push(inc); I.sel[a.id] = inc.id; await salva(a); api.ridisegna();
      },
      async incNome(el) { const { a, inc } = cur(); if (!inc) return; const v = el.value.trim().replace(/\s+/g, ' '); if (!v) { G.alert('Il nome non può essere vuoto.'); el.value = inc.nome; return; } if (incontri(a).some((x) => x.id !== inc.id && x.nome.toLowerCase() === v.toLowerCase())) { G.alert('Esiste già un incontro con questo nome.'); el.value = inc.nome; return; } inc.nome = v; await salva(a); api.ridisegna(); },
      async incNote(el) { const { a, inc } = cur(); if (!inc) return; inc.note = el.value; clearTimeout(az._t); az._t = setTimeout(() => salva(a), 400); },
      async incTurno(el) { const { a, inc } = cur(); if (!inc) return; const k = Number(el.dataset.k); inc.turni = (inc.turni || 0) === k ? k - 1 : k; await salva(a); api.ridisegna(); },
      async incTurnoZero() { const { a, inc } = cur(); if (!inc) return; inc.turni = 0; await salva(a); api.ridisegna(); },
      async incAgg(el) { const { a, inc } = cur(); if (!inc) return; const m = api.B.mappa.get(Number(el.dataset.id)); const q = Math.max(1, Math.min(30, Number((document.getElementById('inc-q-' + el.dataset.id) || {}).value) || 1)); if (!m) return; aggMostro(inc, m, q); await salva(a); api.toast('✔ ' + q + ' × ' + m.n + ' nell\'incontro «' + inc.nome + '» (iniziativa tirata)'); api.ridisegna(); },
      async incAggTutti() { const { a, inc } = cur(); if (!inc) return; let n = 0; (a.voci || []).forEach((v) => { const m = api.B.mappa.get(v.id); if (m) { aggMostro(inc, m, v.q); n += v.q; } }); await salva(a); api.toast('✔ ' + n + ' mostri aggiunti a «' + inc.nome + '»'); api.ridisegna(); },
      async incAggPg() {
        const { a, inc } = cur(); if (!inc) return; const id = (document.getElementById('inc-pg') || {}).value; const p = id && api.pgs().find((x) => x.id === id); if (!p) { api.toast('Scegli un personaggio dall\'elenco'); return; }
        let ca = '', pf = ''; try { const d = G.DND.M.derive(p); ca = d.ca; pf = d.pf; } catch (e) { /* ignora */ }
        inc.righe.push({ id: rid(), g: null, mid: null, pg: true, n: p.nome || 'Personaggio', ca, pf, ini: '', sorp: false }); await salva(a); api.toast('✔ ' + (p.nome || 'Personaggio') + ' aggiunto: scrivi la sua iniziativa nella griglia'); api.ridisegna();
      },
      async incAggLibero() { const { a, inc } = cur(); if (!inc) return; inc.righe.push({ id: rid(), g: null, mid: null, pg: true, n: '', ca: '', pf: '', ini: '', sorp: false }); await salva(a); api.ridisegna(); },
      async incRiga(el) {
        const { a, inc } = cur(); if (!inc) return; const r = riga(inc, el.dataset.id); if (!r) return; const k = el.dataset.k;
        if (k === 'sorp') r.sorp = el.checked; else if (k === 'ini') r.ini = el.value === '' ? '' : Math.max(-20, Math.min(40, Math.round(Number(el.value)))); else r[k] = el.value;
        await salva(a); if (k === 'ini' || k === 'sorp') api.ridisegna();
      },
      async incTira(el) { const { a, inc } = cur(); if (!inc) return; const r = riga(inc, el.dataset.id); const m = r && api.B.mappa.get(r.mid); if (!m) return; const ini = tira(m); inc.righe.filter((x) => x.g && x.g === r.g).forEach((x) => { x.ini = ini; }); await salva(a); api.ridisegna(); },
      async incTiraTutti() { const { a, inc } = cur(); if (!inc) return; const per = new Map(); inc.righe.forEach((r) => { if (!r.mid) return; const k = r.g || r.id; if (!per.has(k)) per.set(k, tira(api.B.mappa.get(r.mid))); r.ini = per.get(k); }); await salva(a); api.ridisegna(); },
      async incTogli(el) { const { a, inc } = cur(); if (!inc) return; inc.righe = inc.righe.filter((r) => r.id !== el.dataset.id); await salva(a); api.ridisegna(); },
      async incElimina() { const { a, inc } = cur(); if (!inc || !G.confirm('Eliminare l\'incontro «' + inc.nome + '»?')) return; a.incontri = incontri(a).filter((x) => x.id !== inc.id); I.sel[a.id] = null; await salva(a); api.ridisegna(); },
      incStampa() { const { a, inc } = cur(); if (!inc) return; if (!inc.righe.length) { api.toast('Aggiungi prima qualcuno all\'incontro'); return; } const st = document.getElementById('stampa'); st.innerHTML = '<div class="ig-print">' + foglio(a, inc) + '</div>'; G.print(); },
    };
    if (!I.ok) { I.ok = true; document.addEventListener('input', (e) => { const t = e.target; if (t && t.dataset && t.dataset.az === 'incNote' && t.tagName === 'TEXTAREA') az.incNote(t); }); }
    return az;
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
