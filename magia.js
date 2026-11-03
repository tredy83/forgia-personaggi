/* SCHEDA INCANTESIMI: scelta degli incantesimi con consigli e slot da barrare */
(function (G) {
  const D = G.DND; const M = D.M; const X = (G.FORGIA_X = G.FORGIA_X || {});
  const FILTRO = {}; // filtri visuali per classe: { liv, q }
  const ORD = ['Trucchetti', '1° livello', '2° livello', '3° livello', '4° livello', '5° livello', '6° livello', '7° livello', '8° livello', '9° livello'];

  const sceltaCl = (ch, id) => { ch.inc = ch.inc || {}; return (ch.inc[id] = ch.inc[id] || { truc: [], conos: [], libro: [], prep: [] }); };
  X.sceltaCl = sceltaCl;
  // manuali abilitati per il personaggio (di base solo il Manuale del Giocatore)
  const manuali = (ch) => Object.assign({ mdg: true }, (ch && ch.manuali) || {});
  const manOk = (ch, s) => !!manuali(ch)[s.fonte || 'mdg'];
  const lista = (k, liv, ch, extra) => D.INCANTESIMI.filter((s) => (s.classi.includes(k.lista) || (k.extra || []).includes(s.id)) && (liv === 0 ? s.liv === 0 : s.liv >= 1 && s.liv <= k.livMax) && (manOk(ch, s) || (extra || []).includes(s.id)));
  X.manuali = manuali; X.manOk = manOk;

  // quali liste usa ogni classe: [chiave, etichetta, massimo, sorgente]
  function liste(k, sel) {
    const out = [];
    if (k.trucchetti) out.push(['truc', 'Trucchetti', k.trucchetti, 0]);
    if (k.libro) { out.push(['libro', 'Libro degli incantesimi', k.libro, 1]); out.push(['prep', 'Incantesimi preparati', k.preparati, 'libro']); }
    else if (k.conosciuti) out.push(['conos', 'Incantesimi conosciuti', k.conosciuti, 1]);
    else if (k.preparati) out.push(['prep', 'Incantesimi preparati', k.preparati, 1]);
    return out;
  }
  X.liste = liste;

  function righe(ch, k, key, max, sorg, sel, c) {
    const { esc } = c;
    let base;
    if (sorg === 'libro') base = D.INCANTESIMI.filter((s) => sel.libro.includes(s.id));
    else base = lista(k, sorg, ch, sel[key]);
    const scelti = sel[key]; const piena = scelti.length >= max;
    const fuori = (k.scuole && key === 'conos') ? scelti.filter((id) => { const q = D.incantesimo(id); return q && !k.scuole.includes(q.scuola); }).length : 0;
    const f = FILTRO[k.id + key] || { liv: '', q: '' };
    return base.map((s) => {
      const on = scelti.includes(s.id);
      const nascosta = (f.liv !== '' && String(s.liv) !== f.liv) || (f.q && !(s.nome + ' ' + s.testo + ' ' + s.scuola).toLowerCase().includes(f.q));
      return '<tr class="inc-riga" data-liv="' + s.liv + '" data-txt="' + esc((s.nome + ' ' + s.testo + ' ' + s.scuola).toLowerCase()) + '"' + (nascosta ? ' style="display:none"' : '') + '>'
        + '<td style="width:2rem"><input type="checkbox" data-az="incToggle" data-cl="' + k.id + '" data-key="' + key + '" data-id="' + s.id + '" data-max="' + max + '"' + (on ? ' checked' : '') + ((piena && !on) || (on && key === 'truc' && (k.fissi || []).includes(s.id)) || (!on && k.scuole && key === 'conos' && !k.scuole.includes(s.scuola) && fuori >= k.liberi) ? ' disabled' : '') + '></td>'
        + '<td><b>' + esc(s.nome) + '</b> <span class="chip">' + (s.liv ? s.liv + '°' : 'trucchetto') + ' · ' + s.scuola + (s.rituale ? ' · rituale' : '') + (s.conc ? ' · conc.' : '') + '</span>' + ((k.extra || []).includes(s.id) && !s.classi.includes(k.lista) ? ' <span class="chip fonte">lista del patrono</span>' : '') + (k.fissi && k.fissi.includes(s.id) ? ' <span class="chip fonte">sempre conosciuto</span>' : '') + (s.fonte && s.fonte !== 'mdg' ? ' <span class="chip fonte">' + esc(D.fonteEtichetta(s, true)) + '</span>' : '')
        + '<div class="mute">' + esc(s.tempo) + ' · ' + esc(s.gittata) + ' · ' + esc(s.comp) + ' · ' + esc(s.durata) + '</div>'
        + '<details class="inc-desc"><summary>' + (s.sintesi ? 'Sintesi' : 'Descrizione completa') + '</summary>' + (s.sintesi ? '<p class="mute"><i>Sintesi in parole nostre: il testo completo è sul manuale (' + esc((D.MANUALI.find((x) => x[0] === s.fonte) || [0, ''])[1]) + ').</i></p>' : '') + s.desc.map((p) => '<p>' + esc(p) + '</p>').join('') + (s.alto ? '<p><b>Ai livelli più alti.</b> ' + esc(s.alto) + '</p>' : '') + '</details></td></tr>';
    }).join('');
  }

  // card "Incantesimi di razza"
  function cardRazza(ch, d, esc) {
    const R = d.incRazza; if (!R) return '';
    let h = '<div class="card"><h3>✨ Incantesimi di razza</h3><p class="mute">Li conosci grazie alla tua razza (' + esc(d.sub ? d.sub.nome : d.razza.nome) + '): non contano tra gli incantesimi della classe. Caratteristica: <b>' + D.ABIL_NOME[R.car] + '</b> · CD <b>' + R.cd + '</b> · attacco <b>' + M.fmt(R.att) + '</b>.</p>';
    if (R.scelta) {
      const cand = D.INCANTESIMI.filter((x) => x.liv === 0 && x.classi.includes(R.scelta.cl) && manOk(ch, x));
      h += '<div class="riga"><div class="col"><label>Trucchetto da mago a scelta</label><select data-bind="scelteRazza.trucchetto"><option value="">— scegli —</option>' + cand.map((x) => '<option value="' + x.id + '"' + (R.scelta.id === x.id ? ' selected' : '') + '>' + esc(x.nome) + '</option>').join('') + '</select></div></div>';
    }
    h += '<table><thead><tr><th>Incantesimo</th><th>Quando</th><th>Uso</th></tr></thead><tbody>' + R.voci.map((v) => {
      const sp = D.incantesimo(v.id);
      return '<tr' + (v.disp ? '' : ' style="opacity:.5"') + '><td><b>' + esc(v.nome) + '</b> <span class="chip">' + (sp.liv ? sp.liv + '°' : 'trucchetto') + ' · ' + sp.scuola + '</span>'
        + '<details class="inc-desc"><summary>Descrizione</summary>' + sp.desc.map((p) => '<p>' + esc(p) + '</p>').join('') + '</details></td>'
        + '<td>' + (v.disp ? 'Disponibile' : 'dal livello ' + v.liv) + '</td>'
        + '<td>' + (v.uso ? (v.disp ? '<span class="mute">1/riposo lungo' + (v.slot > sp.liv ? ' (come ' + v.slot + '° livello)' : '') + '</span>' : '–') : 'a volontà') + '</td></tr>';
    }).join('') + '</tbody></table></div>';
    return h;
  }
  X.cardRazza = cardRazza;

  // card "Incantesimi sempre preparati" (domini, giuramenti, circolo della Terra)
  function cardSub(ch, d, esc) {
    const R = d.incSub; if (!R) return '';
    let h = '<div class="card"><h3>📖 Incantesimi di sottoclasse</h3><p class="mute">Sono sempre preparati e <b>non contano</b> nel numero di incantesimi che puoi preparare. Si lanciano con i tuoi slot normali.</p>'
      + '<table><thead><tr><th>Incantesimo</th><th>Da</th><th>Quando</th></tr></thead><tbody>' + R.voci.map((v) => {
        const sp = D.incantesimo(v.id);
        return '<tr' + (v.disp ? '' : ' style="opacity:.5"') + '><td><b>' + esc(v.nome) + '</b> <span class="chip">' + sp.liv + '° · ' + sp.scuola + '</span>'
          + '<details class="inc-desc"><summary>' + (sp.sintesi ? 'Sintesi' : 'Descrizione') + '</summary>' + sp.desc.map((p) => '<p>' + esc(p) + '</p>').join('') + '</details></td><td>' + esc(v.fonte) + '</td><td>' + (v.disp ? 'Disponibile' : 'dal livello ' + v.liv) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
    return h;
  }
  X.cardSub = cardSub;

  X.tabMagia = function (ch, c) {
    const { esc } = c; const d = M.derive(ch); const inc = d.incantesimi;
    if (!inc.classi.length) return cardRazza(ch, d, esc) + cardSub(ch, d, esc) + (X.tabCarte ? X.tabCarte(ch) : '') + '<div class="card"><h3>Incantesimi</h3><p class="mute">Questo personaggio non lancia incantesimi (per ora). Compariranno qui scegliendo una classe incantatrice, oppure la sottoclasse Cavaliere Mistico o Mistificatore Arcano.</p></div>';
    const man = manuali(ch);
    let h0 = '<div class="card"><h3>Manuali degli incantesimi</h3><p class="mute">Scegli da quali manuali puoi prendere gli incantesimi. Quelli già scelti restano sempre visibili.</p><div class="riga">'
      + D.MANUALI.map((x) => '<label class="chip-check"><input type="checkbox" data-az="manuale" data-id="' + x[0] + '"' + (man[x[0]] ? ' checked' : '') + '> ' + esc(x[1]) + ' <span class="mute">(' + D.INCANTESIMI.filter((s) => (s.fonte || 'mdg') === x[0]).length + ')</span></label>').join('') + '</div></div>';
    h0 = cardRazza(ch, d, esc) + cardSub(ch, d, esc) + h0;
    // --- slot da barrare ---
    let slotHtml = inc.slot.map((n, i) => '<div class="slot-riga"><span>' + (i + 1) + '° livello</span><span><b>' + n + '</b> slot</span></div>').join('');
    inc.classi.filter((k) => k.patto).forEach((k) => { slotHtml += '<div class="slot-riga"><span>Patto (' + k.patto[1] + '° livello)</span><span><b>' + k.patto[0] + '</b> slot</span></div>'; });
    const info = inc.classi.map((k) => '<tr><td><b>' + k.classe + '</b></td><td>' + D.ABIL_NOME[k.car] + '</td><td>' + k.cd + '</td><td>' + M.fmt(k.att) + '</td><td>' + (k.trucchetti != null ? k.trucchetti : '–') + '</td><td>' + (k.conosciuti ? k.conosciuti + ' conosciuti' : k.preparati ? k.preparati + ' preparati' : '–') + (k.libro ? ' (libro: ' + k.libro + ')' : '') + '</td></tr>').join('');
    let h = h0 + '<div class="card"><h3>Magia</h3><table><thead><tr><th>Classe</th><th>Caratteristica</th><th>CD</th><th>Attacco</th><th>Trucchetti</th><th>Incantesimi</th></tr></thead><tbody>' + info + '</tbody></table>' + (inc.multiclasse ? '<p class="mute">Slot calcolati con la regola del multiclasse.</p>' : '') + '</div>';
    h += '<div class="card"><h3>Slot incantesimo</h3><p class="mute">Quanti slot hai a disposizione: gli usi si segnano sulla scheda stampata.</p>' + slotHtml + '</div>';
    // --- scelta incantesimi per classe ---
    inc.classi.forEach((k) => {
      const sel = sceltaCl(ch, k.id); const cons = D.CONSIGLI_INC[k.consigli] || { nota: '', truc: [], liv: [] };
      h += '<div class="card"><h3>' + k.classe + ': scegli gli incantesimi</h3>';
      if (k.scuole) h += '<p class="mute">Regola della sottoclasse: la maggior parte degli incantesimi conosciuti deve essere di ' + k.scuole.join(' o ').toLowerCase() + '; ' + k.liberi + ' ' + (k.liberi === 1 ? 'può' : 'possono') + ' essere di qualsiasi scuola (quello del 3° livello e quelli dell\'8°, 14° e 20°).</p>';
      if (cons.nota) h += '<div class="consiglio">💡 <b>Consiglio per i primi incantesimi.</b> ' + esc(cons.nota) + '</div>';
      h += '<p><button class="oro" data-az="incConsiglia" data-cl="' + k.id + '">✨ Scegli per me i consigliati</button> <button class="sec pic" data-az="incSvuota" data-cl="' + k.id + '">Svuota scelte</button></p>';
      liste(k, sel).forEach(([key, et, max, sorg]) => {
        const n = sel[key].length;
        h += '<h4>' + et + ' <span class="chip ' + (n === max ? 'ok' : 'ko') + '">' + n + ' / ' + max + '</span></h4>';
        if (sorg === 'libro' && !sel.libro.length) { h += '<p class="mute">Prima scegli gli incantesimi del libro.</p>'; return; }
        const f = FILTRO[k.id + key] || { liv: '', q: '' };
        if (key !== 'truc') {
          let opts = '<option value="">Tutti i livelli</option>';
          for (let l = 1; l <= k.livMax; l++) opts += '<option value="' + l + '"' + (f.liv === String(l) ? ' selected' : '') + '>' + ORD[l] + '</option>';
          h += '<div class="riga" style="margin-bottom:.4rem"><select data-inclv="' + k.id + key + '">' + opts + '</select><input type="search" placeholder="Cerca per nome o effetto…" data-incq="' + k.id + key + '" value="' + esc(f.q) + '"></div>';
        }
        h += '<table class="inc-tab" data-bloc="' + k.id + key + '"><tbody>' + righe(ch, k, key, max, sorg, sel, c) + '</tbody></table>';
      });
      h += '</div>';
    });
    h += (X.tabCarte ? X.tabCarte(ch) : '');
    h += '<div class="card"><h3>Altri incantesimi e appunti</h3><textarea data-bind="incantesimi.note" placeholder="Incantesimi da pergamena, rituali, note…">' + esc((ch.incantesimi || {}).note || '') + '</textarea></div>';
    return h;
  };

  // scelta "a rotazione" tra i livelli, seguendo l'ordine di priorità
  function scegliConsigliati(k, cons, base, n, livMin, ch) {
    const per = {};
    cons.liv.forEach((id) => { const s = D.incantesimo(id); if (s && s.liv >= livMin && s.liv <= k.livMax && s.classi.includes(k.lista) && base.includes(id)) (per[s.liv] = per[s.liv] || []).push(id); });
    const out = []; let giro = true;
    while (out.length < n && giro) {
      giro = false;
      Object.keys(per).map(Number).sort((a, b) => a - b).forEach((l) => { if (out.length < n && per[l].length) { out.push(per[l].shift()); giro = true; } });
    }
    // se mancano, completa con altri incantesimi della classe
    if (out.length < n) lista(k, 1, ch).forEach((s) => { if (out.length < n && !out.includes(s.id) && base.includes(s.id)) out.push(s.id); });
    return out;
  }

  X.azioni = function (c) {
    const { S, corrente, salvaCorrente, render } = c;
    const tieni = () => { const y = window.scrollY; render(); window.scrollTo(0, y); };
    const infoCl = (ch, id) => M.derive(ch).incantesimi.classi.find((k) => k.id === id);
    return {
      incToggle(el) {
        const ch = corrente(); const sel = sceltaCl(ch, el.dataset.cl); const key = el.dataset.key; const id = el.dataset.id; const max = +el.dataset.max;
        let arr = sel[key];
        if (!el.checked && key === 'truc') { const k0 = infoCl(ch, el.dataset.cl); if (k0 && (k0.fissi || []).includes(id)) { el.checked = true; return; } }
        if (el.checked) { if (arr.length >= max) { el.checked = false; return; } arr = arr.concat([id]); }
        else { arr = arr.filter((x) => x !== id); if (key === 'libro') sel.prep = sel.prep.filter((x) => x !== id); }
        sel[key] = arr; salvaCorrente(); tieni();
      },
      incConsiglia(el) {
        const ch = corrente(); const k = infoCl(ch, el.dataset.cl); if (!k) return;
        const sel = sceltaCl(ch, k.id); const cons = D.consigliUniti(k.consigli, ch, manuali(ch));
        const tutti = (liv) => lista(k, liv, ch).map((s) => s.id);
        if (k.trucchetti) { const t = cons.truc.filter((id) => tutti(0).includes(id)); lista(k, 0, ch).forEach((s) => { if (!t.includes(s.id)) t.push(s.id); }); sel.truc = t.slice(0, k.trucchetti); }
        if (k.libro) { sel.libro = scegliConsigliati(k, cons, tutti(1), k.libro, 1, ch); sel.prep = scegliConsigliati(k, cons, sel.libro, k.preparati, 1, ch); }
        else if (k.conosciuti) sel.conos = scegliConsigliati(k, cons, tutti(1), k.conosciuti, 1, ch);
        else if (k.preparati) sel.prep = scegliConsigliati(k, cons, tutti(1), k.preparati, 1, ch);
        salvaCorrente(); tieni();
      },
      manuale(el) { const ch = corrente(); ch.manuali = Object.assign({ mdg: true }, ch.manuali || {}); ch.manuali[el.dataset.id] = el.checked; salvaCorrente(); tieni(); },
      ...(X.azioniCarte ? X.azioniCarte(c) : {}),
      incSvuota(el) { const ch = corrente(); ch.inc = ch.inc || {}; ch.inc[el.dataset.cl] = { truc: [], conos: [], libro: [], prep: [] }; salvaCorrente(); tieni(); },
    };
  };

  // filtri sulle liste (solo visuali: si aggiornano al volo senza ridisegnare)
  document.addEventListener('input', (e) => {
    const el = e.target; if (!el.dataset || el.dataset.incq === undefined) return;
    const b = el.dataset.incq; const f = (FILTRO[b] = FILTRO[b] || { liv: '', q: '' }); f.q = el.value.trim().toLowerCase(); applica(b);
  });
  document.addEventListener('change', (e) => {
    const el = e.target; if (!el.dataset || el.dataset.inclv === undefined) return;
    const b = el.dataset.inclv; const f = (FILTRO[b] = FILTRO[b] || { liv: '', q: '' }); f.liv = el.value; applica(b);
  });
  function applica(b) {
    const f = FILTRO[b]; const t = document.querySelector('[data-bloc="' + b + '"]'); if (!t) return;
    t.querySelectorAll('.inc-riga').forEach((r) => { const ok = (f.liv === '' || r.dataset.liv === f.liv) && (!f.q || r.dataset.txt.includes(f.q)); r.style.display = ok ? '' : 'none'; });
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
