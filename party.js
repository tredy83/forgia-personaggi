/* PARTY TRACKER per il Dungeon Master (solo gestori): cerca i personaggi creati nel programma (per campagna,
   nome del PG o nome del giocatore), li seleziona e compila in automatico il foglio "Party Tracker"
   (8 PG per foglio, sul modello di party tracker fornito dal DM). */
(function (G) {
  const D = G.DND; const M = D.M; const X = (G.FORGIA_X = G.FORGIA_X || {});
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const $ = (s, r) => (r || document).querySelector(s);
  const fmt = (n) => (n >= 0 ? '+' : '−') + Math.abs(n);
  const metri = (n) => String(n).replace('.', ',') + ' m';

  const P = { q: '', camp: '', sel: new Set(), per: 6, nota: null, msg: '' };
  let ctx = null; let tmr = null;
  const attivi = () => (ctx ? ctx.pgs() : []).filter((p) => !p.cestinato);
  const gio = (p) => ((p.giocatore && p.giocatore.nome) + ' ' + (p.giocatore && p.giocatore.cognome)).trim();
  const campagne = () => { const m = new Map(); attivi().forEach((p) => { const c = String(p.campagna || '').trim(); if (c && !m.has(c.toLowerCase())) m.set(c.toLowerCase(), c); }); return [...m.values()].sort((a, b) => a.localeCompare(b, 'it')); };
  const ordina = (a, b) => String(a.campagna || '').localeCompare(String(b.campagna || ''), 'it') || gio(a).localeCompare(gio(b), 'it') || String(a.nome).localeCompare(String(b.nome), 'it');

  function filtra() {
    const q = norm(P.q).trim();
    return attivi().filter((p) => {
      if (P.camp === '__none') { if (p.campagna) return false; } else if (P.camp && String(p.campagna || '').toLowerCase() !== P.camp.toLowerCase()) return false;
      if (!q) return true;
      return norm([p.nome, p.giocatore.nome, p.giocatore.cognome, p.giocatore.cognome + ' ' + p.giocatore.nome, p.campagna].join(' ')).includes(q);
    }).sort(ordina);
  }

  /* ---------- dati del tracker per un PG ---------- */
  const SIGLE = { for: 'For', des: 'Des', cos: 'Cos', int: 'Int', sag: 'Sag', car: 'Car' };
  function noteAuto(ch, d) {
    const righe = [];
    const sensi = [];
    const sv = d.tratti.find((t) => /scurovisione/i.test(t.nome)); if (sv) { const m = /(\d+(?:[.,]\d+)?)\s*m\b/.exec(sv.desc || ''); sensi.push('Scurovisione ' + (m ? m[1].replace('.', ',') + ' m' : '')); }
    sensi.push('Vel. ' + metri(d.velocita)); sensi.push('Iniz. ' + fmt(d.iniziativa));
    righe.push(sensi.join(' · ').replace(/\s+·/g, ' ·'));
    const ts = d.salvezze.filter((s) => s.comp).map((s) => SIGLE[s.car] + ' ' + fmt(s.bonus)); if (ts.length) righe.push('Tiri salvezza: ' + ts.join(', '));
    (d.incantesimi && d.incantesimi.classi || []).forEach((k) => { const c = D.classe(k.classe); righe.push('Incantesimi' + (c ? ' (' + c.nome + ')' : '') + ': CD ' + k.cd + ', att. ' + fmt(k.att)); });
    const stile = (d.privilegi || []).find((x) => x.fonte === 'Stile');
    if (stile) righe.push(String(stile.nome).replace(/^Stile di Combattimento:\s*/, '').replace(/^Combattere con /, '') + ': ' + stile.desc);
    const usati = new Set();
    (d.risorse || []).forEach((r) => { const n = String(r[0]).replace(/^[^–]*–\s*/, ''); usati.add(n.toLowerCase()); righe.push(n + ': ' + r[1]); });
    const breve = (x) => x.nome + (x.desc && x.desc.length <= 120 ? ': ' + x.desc : '');
    const SALTA = /^(stile di combattimento|lancio di incantesimi|magia del patto|maestria|competenz|linguaggi?|lingue)/i;
    (d.privilegi || []).filter((x) => !x.nascosto && x.fonte !== 'Stile' && !SALTA.test(x.nome) && !usati.has(String(x.nome).toLowerCase())).forEach((x) => righe.push(breve(x)));
    d.tratti.filter((t) => !t.nascosto && !/scurovisione|trance|linguaggi?|lingue/i.test(t.nome) && !usati.has(String(t.nome).toLowerCase())).forEach((t) => righe.push(breve(t)));
    return righe.join('\n');
  }
  function dati(ch) {
    const d = M.derive(ch);
    return {
      id: ch.id, nome: ch.nome || '', giocatore: gio(ch), razza: d.razza ? d.razza.nome.replace(/\s*\(.*\)/, '') + (d.sub ? ' (' + d.sub.nome + ')' : '') : '',
      classe: d.classi.map((c) => c.def.nome + ' ' + c.livello).join(' / '), bg: d.sfondo ? d.sfondo.nome : '', all: ch.allineamento || '', liv: d.tot, ca: d.ca, pf: d.pf, pp: d.percezionePassiva,
      att: (d.attacchi || []).slice(0, 4).map((a) => ({ n: a.nome, b: a.bonus, d: a.danno })), campagna: ch.campagna || '',
      note: typeof ch.noteDM === 'string' ? ch.noteDM : noteAuto(ch, d), modificata: typeof ch.noteDM === 'string',
    };
  }

  /* ---------- il foglio ---------- */
  /* Il foglio usa come fondo il party tracker fornito dal DM (party-sfondo.svg, 792x612 pt):
     i dati sono scritti sopra, nelle posizioni esatte dei riquadri. Unità: 1 u = 1 pt del foglio originale. */
  const ANC = [[51.0, 107.1], [242.9, 107.7], [438.2, 108.3], [631.5, 108.3], [50.6, 364.9], [242.8, 365.8], [438.1, 366.4], [632.0, 367.1]];
  const U = (n) => 'calc(var(--u)*' + n + ')';
  const at = (x, y, w, h, cls, html) => '<div class="pa ' + cls + '" style="left:' + U(x) + ';top:' + U(y) + ';width:' + U(w) + ';height:' + U(h) + '">' + html + '</div>';
  function cardHTML(t, k) {
    const [ax, ay] = ANC[k];
    const campo = (x, y, w, txt, c) => at(x, y, w, 12, 'pf ' + (c || ''), '<b>' + esc(txt) + '</b>');
    let h = campo(-27, -14, 79, t.nome, 'nm') + campo(57, -14, 79, t.giocatore, 'nm')
      + campo(-25, 3, 40, t.razza) + campo(16, 3, 41, t.classe) + campo(57, 3, 43, t.bg) + campo(101, 3, 36, t.all)
      + at(-25, 29, 50, 25, 'num', '<b>' + t.liv + '</b>') + at(36, 29, 37, 25, 'num', '<b>' + t.ca + '</b>') + at(84, 29, 36, 25, 'num', '<b>' + t.pf + '</b>')
      + at(-37, 74, 25, 21, 'num pp', '<b>' + t.pp + '</b>');
    /* riquadro unico: copre i cinque riquadri stampati (tratti, ideali, legami, debolezze, note) */
    const X0 = -30, Y0 = 99.5, W = 161, H = 138.5; const att = t.att.slice(0, 3);
    h += at(X0 - 1, Y0 - 1, W + 9, H + 2, 'cop', '');
    let y = Y0;
    if (att.length) {
      const th = 11 + att.length * 9.5;
      h += at(X0, y, W, th, 'tab', '<div class="th"><span>Nome</span><span>Bonus att.</span><span>Danni/tipo</span></div>' + att.map((a) => '<div class="tr"><span>' + esc(a.n) + '</span><span>' + fmt(a.b) + '</span><span>' + esc(a.d) + '</span></div>').join(''));
      y += th + 2.5;
    }
    h += at(X0, y, W, Y0 + H - y, 'nota', '<div class="nt">' + esc(t.note).replace(/\n/g, '<br>') + '</div><div class="nl">Note</div>');
    return '<div class="pa" style="left:' + U(ax) + ';top:' + U(ay) + '">' + h + '</div>';
  }
  function bannerTesto(sel) {
    if (P.camp && P.camp !== '__none') return campagne().find((c) => c.toLowerCase() === P.camp.toLowerCase()) || P.camp;
    const c = [...new Set(sel.map((p) => p.campagna).filter(Boolean))]; return c.length === 1 ? c[0] : c.length ? c.join(' · ') : '';
  }
  const chiaveNota = (camp) => 'forgia:party:' + norm(camp || '_');
  const leggiNota = (camp) => { try { return localStorage.getItem(chiaveNota(camp)) || ''; } catch (e) { return ''; } };
  function pagineHTML(sel) {
    const per = 8; const camp = bannerTesto(sel); const nota = leggiNota(camp);
    const tt = sel.map((p) => dati(p)); const out = [];
    for (let i = 0; i < tt.length; i += per) {
      out.push('<section class="pt-pag"><img class="pt-bg" src="party-sfondo.svg" alt="">'
        + at(284, 31, 215, 33, 'camp', '<b>' + esc(camp) + '</b>') + at(505, 33, 235, 30, 'pnote', esc(nota).replace(/\n/g, '<br>'))
        + tt.slice(i, i + per).map((t, k) => cardHTML(t, k)).join('') + '</section>');
    }
    return out.join('');
  }
  function fit(root) {
    const rid = (el, z0, zmin, w) => { let z = z0; el.style.fontSize = 'calc(var(--u)*' + z + ')'; while (z > zmin && (w ? el.firstChild.offsetWidth > el.clientWidth : el.scrollHeight > el.clientHeight + 1)) { z -= 0.2; el.style.fontSize = 'calc(var(--u)*' + z.toFixed(1) + ')'; } };
    root.querySelectorAll('.nt').forEach((el) => rid(el, 6.8, 3.8, false));
    root.querySelectorAll('.pf').forEach((el) => rid(el, el.classList.contains('nm') ? 9 : 7.5, 3.4, true));
    root.querySelectorAll('.camp').forEach((el) => rid(el, 21, 8, true));
    root.querySelectorAll('.pnote').forEach((el) => rid(el, 7.5, 4.5, false));
  }
  const selezionati = () => attivi().filter((p) => P.sel.has(p.id)).sort(ordina);
  function disegnaAnteprima() {
    const box = $('#pt-prev'); if (!box) return; const sel = selezionati();
    const cnt = $('#pt-cnt'); if (cnt) cnt.textContent = sel.length + ' selezionati';
    if (!sel.length) { box.innerHTML = '<div class="vuoto">Seleziona uno o più personaggi dall\'elenco: il foglio si compila da solo.</div>'; return; }
    box.innerHTML = '<div class="pt-pagine" style="--u:' + Math.max(0.5, Math.min(1.4, (box.clientWidth - 4) / 792)).toFixed(3) + 'px">' + pagineHTML(sel) + '</div>'; fit(box);
  }

  /* ---------- schermata ---------- */
  function righe() {
    const L = filtra(); if (!L.length) return '<div class="vuoto">' + (attivi().length ? 'Nessun personaggio corrisponde alla ricerca.' : 'Non ci sono ancora personaggi: creali dalla sezione Personaggi.') + '</div>';
    return L.map((p) => {
      const d = M.derive(p); const cl = d.classi.map((c) => c.def.nome + ' ' + c.livello).join(' / ');
      const ap = P.nota === p.id;
      return '<div class="pt-riga' + (P.sel.has(p.id) ? ' sel' : '') + '"><label class="pt-chk"><input type="checkbox" data-az="ptSel" data-id="' + p.id + '"' + (P.sel.has(p.id) ? ' checked' : '') + '> <span><b>' + esc(p.nome || 'Senza nome') + '</b> <span class="mute">' + esc(gio(p) || '—') + '</span><br><small class="mute">' + esc(d.razza ? d.razza.nome.replace(/\s*\(.*\)/, '') : '') + ' · ' + esc(cl) + (p.campagna ? ' · 🏰 ' + esc(p.campagna) : '') + '</small></span></label>'
        + '<span class="pt-bt"><button class="pic sec" data-az="ptApri" data-id="' + p.id + '">Apri</button> <button class="pic oro" data-az="ptLivello" data-id="' + p.id + '">⬆ Livello</button> <button class="pic sec" data-az="ptNotaApri" data-id="' + p.id + '">✎ Note</button></span>'
        + (ap ? '<div class="pt-ne"><textarea data-az="ptNota" data-id="' + p.id + '" rows="7">' + esc(dati(p).note) + '</textarea><div class="mute" style="font-size:.78rem">Le note si compilano da sole (scurovisione, velocità, risorse, incantesimi…): puoi riscriverle a piacere. ' + (typeof p.noteDM === 'string' ? '<button class="pic sec" data-az="ptNotaRip" data-id="' + p.id + '">↺ Ripristina il testo automatico</button>' : '') + '</div></div>' : '') + '</div>';
    }).join('');
  }
  X.vistaParty = function () {
    const cs = campagne(); const o = (v, l, s) => '<option value="' + esc(v) + '"' + (s ? ' selected' : '') + '>' + esc(l) + '</option>';
    const sel = selezionati(); const camp = bannerTesto(sel);
    return '<div class="barra-elenco"><b>🧭 Party Tracker</b><span class="mute">Solo per i gestori</span></div>'
      + '<div class="card"><div class="riga pt-filtri"><input type="search" id="pt-q" data-az="ptQ" placeholder="Cerca per campagna, personaggio o giocatore…" value="' + esc(P.q) + '">'
      + '<select data-az="ptCamp">' + o('', 'Tutte le campagne', !P.camp) + cs.map((c) => o(c, c, P.camp.toLowerCase() === c.toLowerCase())).join('') + o('__none', 'Senza campagna', P.camp === '__none') + '</select>'
      + '</div>'
      + '<p><button class="sec" data-az="ptTutti">☑ Seleziona tutti quelli in elenco</button> <button class="sec" data-az="ptNessuno">☐ Deseleziona tutto</button> <span class="chip" id="pt-cnt">' + sel.length + ' selezionati</span></p></div>'
      + '<div class="pt-griglia"><div class="card"><div id="pt-lista">' + righe() + '</div></div>'
      + '<div class="card"><h3>Foglio del Party Tracker</h3><p class="mute">Si compila da solo con i dati dei personaggi (livello, CA, PF, percezione passiva, attacchi) e un unico riquadro <b>Note</b> con quello che serve al DM.</p>'
      + '<label>Note del gruppo' + (camp ? ' · ' + esc(camp) : '') + ' <span class="mute">(stampate nel riquadro in alto; si ricordano su questo dispositivo)</span></label><textarea id="pt-pn" data-az="ptPN" rows="2" placeholder="Es. luogo, data della sessione, obiettivo del gruppo…">' + esc(leggiNota(camp)) + '</textarea>'
      + '<p><button class="oro" data-az="ptStampa">🖨 Stampa / salva PDF</button> <span class="mute">Nel dialogo di stampa scegli <b>A4</b>, <b>orizzontale</b>, margini <b>nessuno</b>, scala 100% e attiva «Grafica di sfondo».</span></p>'
      + '<div id="pt-prev"></div></div></div>';
  };
  X.partyDopoRender = disegnaAnteprima;

  X.azioniParty = function (c) {
    ctx = c; const ridisegna = () => { const y = G.scrollY; c.render(); disegnaAnteprima(); G.scrollTo(0, y); };
    const ch = (id) => c.trova(id);
    const salva = (p) => { p.aggiornato = new Date().toISOString(); c.scrivi(); };
    const az = {
      vaiParty() { c.S.vista = 'party'; c.render(); disegnaAnteprima(); },
      ptQ(el) { P.q = el.value; const r = $('#pt-lista'); if (r) r.innerHTML = righe(); },
      ptCamp(el) { P.camp = el.value; ridisegna(); },
      ptSel(el) { if (el.checked) P.sel.add(el.dataset.id); else P.sel.delete(el.dataset.id); const r = el.closest('.pt-riga'); if (r) r.classList.toggle('sel', el.checked); disegnaAnteprima(); },
      ptTutti() { filtra().forEach((p) => P.sel.add(p.id)); ridisegna(); },
      ptNessuno() { P.sel.clear(); ridisegna(); },
      ptApri(el) { c.S.id = el.dataset.id; c.S.vista = 'editor'; c.S.tab = 'identita'; c.S.torna = 'party'; c.render(); },
      ptLivello(el) { c.S.id = el.dataset.id; c.S.vista = 'editor'; c.S.tab = 'livelli'; c.S.torna = 'party'; c.render(); },
      ptNotaApri(el) { P.nota = P.nota === el.dataset.id ? null : el.dataset.id; const r = $('#pt-lista'); if (r) r.innerHTML = righe(); },
      ptNota(el) { const p = ch(el.dataset.id); if (!p) return; p.noteDM = el.value; clearTimeout(tmr); tmr = setTimeout(() => { salva(p); disegnaAnteprima(); }, 350); },
      ptNotaRip(el) { const p = ch(el.dataset.id); if (!p) return; delete p.noteDM; salva(p); const r = $('#pt-lista'); if (r) r.innerHTML = righe(); disegnaAnteprima(); },
      ptPN(el) { const camp = bannerTesto(selezionati()); try { localStorage.setItem(chiaveNota(camp), el.value); } catch (e) { /* ignora */ } clearTimeout(tmr); tmr = setTimeout(disegnaAnteprima, 350); },
      ptStampa() {
        const sel = selezionati(); if (!sel.length) { alert('Seleziona almeno un personaggio.'); return; }
        const st = $('#stampa'); st.innerHTML = '<div class="pt-print">' + pagineHTML(sel) + '</div>'; st.style.cssText = 'display:block;position:absolute;left:-99999px;top:0;width:900px;visibility:hidden'; st.querySelectorAll('.pt-print').forEach((e) => { e.style.display = 'block'; }); fit(st); st.style.cssText = ''; (G.FORGIA_X.stampaPronta || G.print.bind(G))();
      },
    };
    G.document.addEventListener('input', (e) => { const t = e.target; if (t.dataset && ['ptQ', 'ptNota', 'ptPN'].includes(t.dataset.az)) az[t.dataset.az](t); });
    return az;
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
