/* La Forgia degli Eroi – INTERFACCIA, ARCHIVIO E SCHEDA */
(function () {
  const D = window.DND; const M = D.M; const fmt = M.fmt;
  const KEY = 'dnd5e-forgia-v1';

  /* ---------- utilità ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const libera = (ch) => '<p><label><input type="checkbox" data-bind="modLibera"' + (ch.modLibera ? ' checked' : '') + '> Modifica libera (ignora la regola delle sostituzioni)</label></p>';
  const opt = (v, l, sel) => '<option value="' + esc(v) + '"' + (sel ? ' selected' : '') + '>' + esc(l) + '</option>';
  const metri = (v) => String(v).replace('.', ',') + ' m';
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const setPath = (o, p, v) => { const k = p.split('.'); let c = o; while (k.length > 1) { const n = k.shift(); c = c[n] = c[n] || {}; } c[k[0]] = v; };

  /* ---------- archivio (localStorage + eventuale sincronizzazione online) ---------- */
  const C = window.FORGIA_CLOUD || { attivo: false, utente: null };
  let KEYATT = KEY;
  const leggi = (k) => { try { const d = JSON.parse(localStorage.getItem(k) || '{"personaggi":[]}'); if (!d.personaggi) d.personaggi = []; return d; } catch (e) { return { personaggi: [] }; } };
  let DB = C.attivo ? { personaggi: [] } : leggi(KEY); let erroreSalvataggio = '';
  const scriviLocale = () => { try { localStorage.setItem(KEYATT, JSON.stringify({ ...DB, personaggi: DB.personaggi.filter((p) => !p.bozza) })); erroreSalvataggio = ''; } catch (e) { erroreSalvataggio = 'Impossibile salvare su questo browser!'; } };
  const inviati = new Map(); // id -> firma dell'ultima versione inviata online
  const firma = (p) => (p.aggiornato || '') + '|' + (p.cestinato ? 1 : 0);
  function sincronizza() {
    if (!C.attivo || !C.utente) return;
    DB.personaggi.forEach((p) => {
      if (p.bozza) return;
      if (!p.owner) { p.owner = C.utente.uid; p.ownerNome = C.utente.nome; }
      if (inviati.get(p.id) !== firma(p)) { inviati.set(p.id, firma(p)); C.salva(p); }
    });
    [...inviati.keys()].forEach((id) => { if (!DB.personaggi.some((p) => p.id === id)) { inviati.delete(id); C.elimina(id); } });
  }
  const scrivi = () => { scriviLocale(); sincronizza(); infoBarra(); };
  const trova = (id) => DB.personaggi.find((p) => p.id === id);
  const sezione = () => {
    if (S.vista === 'home') return 'home';
    if (S.vista === 'party') return 'party';
    if (S.vista === 'bestiario') { const B = window.FORGIA_X.statoBestiario ? window.FORGIA_X.statoBestiario() : {}; return B.modo === 'inc' ? 'incontri' : (B.tab === 'avv' ? 'avventure' : 'bestiario'); }
    if (S.vista === 'elenco' || S.vista === 'editor') return 'elenco';
    return '';
  };
  const navBarra = () => {
    const nav = $('#barra-nav'); if (!nav) return;
    if (C.attivo && !C.utente) { nav.innerHTML = ''; return; }
    const g = !C.attivo || C.utente.ruolo === 'gestore'; const cur = sezione();
    const v = [['elenco', 'vaiElenco', 'Personaggi']].concat(g ? [['party', 'vaiParty', 'Party Tracker'], ['bestiario', 'vaiBestiario', 'Bestiario'], ['avventure', 'vaiAvventure', 'Avventure'], ['incontri', 'vaiIncontri', 'Incontri']] : []);
    const html = v.map(([k, az, t]) => '<button class="nav-v' + (cur === k ? ' on' : '') + '" data-az="' + az + '">' + t + '</button>').join('');
    if (nav._h !== html) { nav._h = html; nav.innerHTML = html; }
  };
  const poni = (el, html) => { if (el._h !== html) { el._h = html; el.innerHTML = html; } };
  const infoBarra = () => {
    navBarra();
    const n = DB.personaggi.filter((p) => !p.cestinato).length; const el = $('#barra-info'); if (!el) return;
    if (!C.attivo) { poni(el, erroreSalvataggio ? '<b>⚠ ' + erroreSalvataggio + '</b>' : n + ' personaggi salvati su questo dispositivo'); return; }
    if (!C.utente) { poni(el, ''); return; }
    const st = C.stato(); const sinc = st.errore ? '<b title="' + esc(st.errore) + '">⚠ non sincronizzato</b>' : st.inCoda ? 'sincronizzo…' : '☁ sincronizzato';
    poni(el, '<div class="ib-riga"><span class="utente-barra">👤 ' + esc(C.utente.nome) + ' <em>(' + (C.utente.ruolo === 'gestore' ? 'gestore' : 'genitore') + ')</em></span> <span class="sync">' + n + ' personaggi · ' + sinc + '</span></div>'
      + '<div class="ib-riga"><button class="pic sec chiaro" data-az="vaiProfilo">Profilo</button>' + (C.utente.ruolo === 'gestore' ? ' <button class="pic sec chiaro" data-az="vaiUtenti">Account</button>' : '') + ' <button class="pic sec chiaro" data-az="esci">Esci</button></div>');
  };

  const campagne = () => { const m = new Map(); DB.personaggi.forEach((p) => { const c = String(p.campagna || '').trim(); if (c && !m.has(c.toLowerCase())) m.set(c.toLowerCase(), c); }); return [...m.values()].sort((a, b) => a.localeCompare(b, 'it')); };
  const S = { cesSel: new Set(), vista: 'home', id: null, tab: 'identita', filtro: '', cestino: false };
  const corrente = () => trova(S.id);
  const salvaCorrente = () => { const c = corrente(); if (c) { c.aggiornato = new Date().toISOString(); scrivi(); } };

  /* ---------- elenco ---------- */
  function vistaElenco() {
    const f = S.filtro.toLowerCase();
    const lista = DB.personaggi.filter((p) => !!p.cestinato === S.cestino)
      .filter((p) => !f || [p.nome, p.giocatore.nome, p.giocatore.cognome, p.ownerNome || '', p.campagna || ''].join(' ').toLowerCase().includes(f))
      .sort((a, b) => (a.giocatore.cognome + a.giocatore.nome).localeCompare(b.giocatore.cognome + b.giocatore.nome) || a.nome.localeCompare(b.nome));
    const nCest = DB.personaggi.filter((p) => p.cestinato).length;
    let righe = lista.map((p) => {
      const cl = M.contaClassi(p).map((c) => c.def.nome + ' ' + c.livello).join(' / ');
      const r = D.razza(p.razza);
      const gio = (p.giocatore.cognome + ' ' + p.giocatore.nome).trim() || '—'; const gest = C.attivo && C.utente && C.utente.ruolo === 'gestore';
      const data = new Date(p.aggiornato).toLocaleDateString('it-IT');
      const az = S.cestino
        ? '<button class="pic sec" data-az="ripristina" data-id="' + p.id + '">Ripristina</button> <button class="pic pericolo" data-az="elimina" data-id="' + p.id + '">Elimina per sempre</button>'
        : '<button class="pic" data-az="apri" data-id="' + p.id + '">Apri</button> <button class="pic oro" data-az="apriLivelli" data-id="' + p.id + '">⬆ Sali di livello</button> <button class="pic sec" data-az="stampa" title="Stampa la scheda" data-id="' + p.id + '">🖨 Stampa</button> <button class="pic sec" data-az="duplica" data-id="' + p.id + '">Duplica</button> <button class="pic sec" data-az="cestina" title="Sposta nel cestino" data-id="' + p.id + '">🗑 Elimina</button>';
      return '<tr>' + (S.cestino ? '<td><input type="checkbox" data-az="cesSel" data-id="' + p.id + '"' + (S.cesSel.has(p.id) ? ' checked' : '') + '></td>' : '') + '<td data-l="Giocatore">' + esc(gio) + '</td>' + (gest ? '<td data-l="Creato da">' + esc(p.ownerNome || '—') + '</td>' : '') + '<td class="pn" data-l="Personaggio"><b>' + esc(p.nome || 'Senza nome') + '</b></td><td data-l="Campagna">' + esc(p.campagna || '') + '</td><td data-l="Razza">' + esc(r ? r.nome : '') + '</td><td data-l="Classe">' + esc(cl) + '</td><td data-l="Modificato">' + data + '</td><td class="az">' + az + '</td></tr>';
    }).join('');
    const tabella = lista.length
      ? (S.cestino ? '<div class="barra-elenco"><button class="pic sec" data-az="cesTutti">Seleziona tutti</button><button class="pic sec" data-az="cesNessuno">Nessuno</button><button class="pic pericolo" data-az="cesElimina"' + (S.cesSel.size ? '' : ' disabled') + '>🗑 Elimina selezionati (' + S.cesSel.size + ')</button><button class="pic pericolo" data-az="cesSvuota">Svuota tutto il cestino</button></div>' : '') + '<table><thead><tr>' + (S.cestino ? '<th></th>' : '') + '<th>Giocatore</th>' + (C.attivo && C.utente && C.utente.ruolo === 'gestore' ? '<th>Creato da</th>' : '') + '<th>Personaggio</th><th>Campagna</th><th>Razza</th><th>Classe / livello</th><th>Modificato</th><th></th></tr></thead><tbody>' + righe + '</tbody></table>'
      : '<div class="vuoto">' + (S.cestino ? 'Il cestino è vuoto.' : 'Nessun personaggio ancora. Premi <b>＋ Nuovo personaggio</b> per cominciare.') + '</div>';
    return '<div class="barra-elenco">'
      + '<button data-az="nuovo">＋ Nuovo personaggio</button>'
      + '<input type="search" placeholder="Cerca per nome, cognome o campagna…" value="' + esc(S.filtro) + '" data-az="filtro">'
      + '<button class="sec" data-az="toggleCestino">' + (S.cestino ? '← Torna ai personaggi' : '🗑 Cestino (' + nCest + ')') + '</button>'
      + '<button class="sec" data-az="esporta">⬇ Esporta archivio</button>'
      + '<button class="sec" data-az="importa">⬆ Importa archivio</button>'
      + '</div><div class="card">' + tabella + '</div>'
      + (C.attivo ? bannerLocali() + '<p class="mute">I personaggi sono salvati <b>online</b> e si ritrovano da qualsiasi dispositivo con il tuo accesso' + (C.utente && C.utente.ruolo === 'gestore' ? ' (come gestore vedi quelli di tutti)' : ' (vedi solo quelli creati da te)') + '. Ogni tanto puoi comunque usare <b>Esporta archivio</b> per tenerne una copia.</p>'
        : '<p class="mute">I personaggi sono salvati <b>in questo browser</b> di questo dispositivo. Per sicurezza, ogni tanto usa <b>Esporta archivio</b> e conserva il file (serve anche per spostare i personaggi su un altro computer).</p>');
  }

  /* ---------- accesso online ---------- */
  function bannerLocali() {
    if (!C.attivo || !C.utente) return '';
    let n = 0; try { if (localStorage.getItem(KEY + ':migrato')) return ''; n = leggi(KEY).personaggi.filter((p) => !p.cestinato).length; } catch (e) { return ''; }
    return n ? '<div class="avviso">Su questo dispositivo ci sono <b>' + n + '</b> personaggi salvati prima dell\'accesso online. <button class="pic oro" data-az="caricaLocali">Caricali online (a nome mio)</button> <button class="pic sec" data-az="ignoraLocali">Non servono</button></div>' : '';
  }
  function vistaLogin() {
    return '<div class="login card"><img class="logo-login" src="logo-argini-ludici.jpg" alt="Argini Ludici – Compagnia di gioco"><h2>La Forgia degli Eroi</h2><p class="mute">Accesso riservato a gestori e genitori di Argini Ludici.</p>'
      + (S.msgLogin ? '<div class="avviso">' + esc(S.msgLogin) + '</div>' : '')
      + '<label for="lg-user">Username (o email)</label><input id="lg-user" autocomplete="username" autocapitalize="none" value="' + esc(S.userLogin || '') + '">'
      + '<label for="lg-pass">Password</label><input id="lg-pass" type="password" autocomplete="current-password">'
      + '<p><button data-az="login"' + (S.attesa ? ' disabled' : '') + '>' + (S.attesa ? 'Accesso in corso…' : 'Entra') + '</button></p>'
      + '<p class="mute">Non hai un accesso? Chiedilo a un gestore di Argini Ludici.</p></div>';
  }
  function vistaUtenti() {
    const lista = (S.utenti || []).slice().sort((a, b) => (a.ruolo === b.ruolo ? 0 : a.ruolo === 'gestore' ? -1 : 1) || (a.nome || '').localeCompare(b.nome || ''));
    const righe = lista.map((u) => {
      const io = u.uid === C.utente.uid;
      return '<tr' + (u.attivo ? '' : ' class="spento"') + '><td><b>' + esc(u.nome || u.username) + '</b>' + (io ? ' <em class="mute">(tu)</em>' : '') + '</td><td>' + esc(u.username || '') + '</td><td>' + (u.ruolo === 'gestore' ? 'Gestore' : 'Genitore') + '</td><td>' + (u.attivo ? 'Attivo' : 'Disattivato') + '</td><td class="az">'
        + (io ? '' : '<button class="pic sec" data-az="utRuolo" data-uid="' + u.uid + '">' + (u.ruolo === 'gestore' ? 'Rendi genitore' : 'Rendi gestore') + '</button> <button class="pic sec" data-az="utAttivo" data-uid="' + u.uid + '">' + (u.attivo ? 'Disattiva' : 'Riattiva') + '</button> <button class="pic pericolo" data-az="utElimina" data-uid="' + u.uid + '">Elimina accesso</button>')
        + (u.username && u.username.includes('@') ? ' <button class="pic sec" data-az="utReset" data-uid="' + u.uid + '">Invia reset password</button>' : '') + '</td></tr>';
    }).join('');
    return '<div class="barra-elenco"><button class="sec" data-az="tornaElenco">← Personaggi</button></div>'
      + '<div class="card"><h3>Nuovo accesso</h3><p class="mute">Crea l\'accesso di un genitore o di un altro gestore. Comunicagli username e password: potrà cambiare la password dal suo Profilo. Se come username scrivi un indirizzo email, potrà anche usare "Password dimenticata".</p>'
      + (S.msgUt ? '<div class="avviso">' + esc(S.msgUt) + '</div>' : '')
      + '<div class="riga"><div class="col"><label>Nome e cognome</label><input id="nu-nome"></div><div class="col"><label>Username (es. mario.rossi) o email</label><input id="nu-user" autocapitalize="none"></div>'
      + '<div class="col"><label>Password (min. 6 caratteri)</label><input id="nu-pass" type="text" autocomplete="off"></div>'
      + '<div class="col"><label>Ruolo</label><select id="nu-ruolo"><option value="genitore">Genitore (vede solo i suoi personaggi)</option><option value="gestore">Gestore (vede e modifica tutto)</option></select></div></div>'
      + '<p><button data-az="utCrea">Crea accesso</button></p></div>'
      + '<div class="card"><h3>Accessi (' + lista.length + ')</h3>' + (lista.length ? '<table><thead><tr><th>Nome</th><th>Username</th><th>Ruolo</th><th>Stato</th><th></th></tr></thead><tbody>' + righe + '</tbody></table>' : '<div class="vuoto">Nessun accesso.</div>')
      + '<p class="mute">«Disattiva» blocca subito l\'accesso senza perdere i personaggi. «Elimina accesso» toglie l\'abilitazione per sempre (i personaggi creati restano visibili ai gestori).</p></div>';
  }
  function vistaProfilo() {
    return '<div class="barra-elenco"><button class="sec" data-az="tornaElenco">← Personaggi</button></div>'
      + '<div class="card"><h3>Il mio profilo</h3><p><b>' + esc(C.utente.nome) + '</b> · username <b>' + esc(C.utente.username) + '</b> · ruolo <b>' + (C.utente.ruolo === 'gestore' ? 'gestore' : 'genitore') + '</b></p></div>'
      + '<div class="card"><h3>Cambia password</h3>' + (S.msgPw ? '<div class="avviso">' + esc(S.msgPw) + '</div>' : '')
      + '<div class="riga"><div class="col"><label>Password attuale</label><input id="pw-old" type="password" autocomplete="current-password"></div><div class="col"><label>Nuova password (min. 6 caratteri)</label><input id="pw-new" type="password" autocomplete="new-password"></div></div>'
      + '<p><button data-az="cambiaPw">Cambia password</button></p></div>';
  }

  /* ---------- editor ---------- */
  const TABS = [['identita', 'Razza'], ['classe', 'Classe'], ['punteggi', 'Caratteristiche'], ['livelli', 'Livelli'], ['equip', 'Equipaggiamento'], ['magia', 'Incantesimi'], ['scheda', 'Scheda']];

  function vistaEditor() {
    const ch = corrente();
    const tabs = TABS.map(([id, l]) => '<button class="' + (S.tab === id ? 'attiva' : '') + '" data-az="tab" data-t="' + id + '">' + l + '</button>').join('');
    return '<div class="barra-elenco"><button class="sec" data-az="tornaElenco">← Elenco personaggi</button>' + (ch.bozza ? '<button class="oro" data-az="salvaBozza">💾 Salva il personaggio</button><span class="mute">Nuovo personaggio: non è ancora salvato.</span>' : '<span class="mute">Si salva da solo ad ogni modifica.</span>') + '</div>'
      + '<div class="editor"><div><div class="tabs">' + tabs + '</div>' + contenutoTab(ch) + '</div><aside class="riepilogo card" id="riepilogo">' + riepilogo(ch) + '</aside></div>';
  }

  function riepilogo(ch) {
    const d = M.derive(ch); const man = M.valida(ch).filter((x) => !x.ok);
    const cl = d.classi.map((c) => c.def.nome + ' ' + c.livello).join(' / ');
    const rit = window.FORGIA_X.ritratto(ch);
    return (rit ? '<div class="ritratto"><img class="rit-img" data-az="zoomRitratto" title="Clicca per ingrandire" src="' + rit + '" alt="Ritratto di ' + esc(d.razza.nome) + ' ' + esc(cl) + '"><label class="rit-usa"><input type="checkbox" data-az="ritrattoScheda"' + (ch.ritrattoScheda ? ' checked' : '') + '> Metti questo disegno nella scheda (pagina 2)</label></div>' : '')
      + '<div class="nome">' + esc(ch.nome || 'Senza nome') + '</div><div class="mute">' + esc(d.razza.nome) + (d.sub ? ' (' + esc(d.sub.nome) + ')' : '') + ' · ' + esc(cl) + '</div>'
      + '<div class="stat"><div><b>' + d.ca + '</b><span>CA</span></div><div><b>' + d.pf + '</b><span>PF</span></div><div><b>' + fmt(d.pb) + '</b><span>Competenza</span></div><div><b>' + fmt(d.iniziativa) + '</b><span>Iniziativa</span></div></div>'
      + '<div class="mute">Livello ' + d.tot + ' · Velocità ' + metri(d.velocita) + '</div>'
      + (man.length ? '<h4>Da completare</h4><ul style="padding-left:1.1rem;margin:.2rem 0">' + man.map((x) => '<li class="ko">' + esc(x.t) + '</li>').join('') + '</ul>' : '<p class="ok">✔ Scheda completa</p>')
      + '<button class="oro" style="width:100%;margin-top:.5rem" data-az="stampa" data-id="' + ch.id + '">🖨 Stampa / PDF</button>';
  }
  const aggiornaRiepilogo = () => { const ch = corrente(); const e = $('#riepilogo'); if (!ch || !e) return; const h = riepilogo(ch); if (e._h !== h) { e._h = h; e.innerHTML = h; } }; // se identico non si tocca il DOM (altrimenti si perde il click sul pulsante)

  function contenutoTab(ch) {
    switch (S.tab) {
      case 'identita': return tabIdentita(ch);
      case 'punteggi': return tabPunteggi(ch);
      case 'classe': return tabClasse(ch);
      case 'livelli': return tabLivelli(ch);
      case 'equip': return tabEquip(ch);
      case 'magia': return tabMagia(ch);
      case 'scheda': return tabScheda(ch);
    }
    return '';
  }

  /* --- 1. identità --- */
  function tabIdentita(ch) {
    const r = D.razza(ch.razza);
    let razzaExtra = '';
    if (r.bonusLiberi) {
      const rec = M.consigliaBonusLiberi(ch);
      razzaExtra += '<div class="col" style="flex-basis:100%"><label>Bonus +' + r.bonusLiberi.valore + ' a ' + r.bonusLiberi.n + (r.bonusLiberi.n > 1 ? ' caratteristiche' : ' caratteristica') + (r.bonusLiberi.escludi.length ? ' (diverse da Carisma)' : '') + ' <span class="mute">– consigliate per la tua classe: ' + rec.map((a) => D.ABIL_NOME[a]).join(', ') + '</span></label><div class="sel-lista">'
        + D.ABIL.filter((a) => !r.bonusLiberi.escludi.includes(a)).map((a) => '<label><input type="checkbox" data-az="toggleArr" data-path="scelteRazza.bonusLiberi" data-val="' + a + '" data-max="' + r.bonusLiberi.n + '"' + ((ch.scelteRazza.bonusLiberi || []).includes(a) ? ' checked' : '') + '> ' + D.ABIL_NOME[a] + '</label>').join('') + '</div></div>';
    }
    if (r.abilitaLibere) {
      razzaExtra += '<div class="col" style="flex-basis:100%"><label>Competenza in ' + r.abilitaLibere + (r.abilitaLibere > 1 ? ' abilità a scelta' : ' abilità a scelta') + (r.fonte ? '' : ' (Versatilità)') + '</label><div class="sel-lista">'
        + D.ABILITA.map((s) => '<label><input type="checkbox" data-az="toggleArr" data-path="scelteRazza.abilita" data-val="' + s.id + '" data-max="' + r.abilitaLibere + '"' + ((ch.scelteRazza.abilita || []).includes(s.id) ? ' checked' : '') + '> ' + s.nome + '</label>').join('') + '</div></div>';
    }
    if (r.talentoLibero) {
      razzaExtra += '<div class="col"><label>Talento d\'origine <span class="mute">(a scelta, di cui soddisfi i prerequisiti)</span></label><input data-bind="scelteRazza.talento" list="talenti" value="' + esc((ch.scelteRazza || {}).talento || '') + '" autocomplete="off"></div>';
    }
    if (r.drago) {
      razzaExtra += '<div class="col"><label>Discendenza draconica</label><select data-bind="scelteRazza.drago">' + D.DRAGHI.map((x) => opt(x[0], x[0] + ' (' + x[1] + ')', ch.scelteRazza.drago === x[0])).join('') + '</select></div>';
    }
    const sf = D.sfondo(ch.sfondo);
    const flagTasha = '<div class="card tasha-flag"><h3>Manuali opzionali</h3><p class="mute">Il programma usa sempre il Manuale del Giocatore. Attiva qui i manuali aggiuntivi che il tuo gruppo usa: compaiono classi, sottoclassi, opzioni e incantesimi che ne fanno parte. Se li lasci spenti il personaggio usa solo le regole base.</p>'
      + D.manualiLista().map((m) => '<label class="tasha-lab"><input type="checkbox" data-az="fonte" data-id="' + m.id + '"' + (D.fonteOk(ch, m.id) ? ' checked' : '') + '> <span><b>' + esc(m.nome) + '</b><br><span class="mute">' + esc(m.desc) + '</span></span></label>').join('') + '</div>';
    return flagTasha + '<div class="card"><h3>Chi gioca e chi è il personaggio</h3><div class="riga">'
      + '<div class="col"><label>Nome del giocatore</label><input data-bind="giocatore.nome" value="' + esc(ch.giocatore.nome) + '"></div>'
      + '<div class="col"><label>Cognome del giocatore</label><input data-bind="giocatore.cognome" value="' + esc(ch.giocatore.cognome) + '"></div>'
      + '<div class="col"><label>Nome del personaggio</label><input data-bind="nome" value="' + esc(ch.nome) + '"></div>'
      + '<div class="col"><label>Campagna <span class="mute">(facoltativa)</span></label><input data-bind="campagna" list="elenco-campagne" autocomplete="off" placeholder="Es. Discesa nell\'Avernus" value="' + esc(ch.campagna || '') + '"><datalist id="elenco-campagne">' + campagne().map((c) => '<option value="' + esc(c) + '">').join('') + '</datalist></div></div></div>'
      + '<div class="card"><h3>Razza, background, allineamento</h3><div class="riga">'
      + '<div class="col"><label>Razza</label><select data-az="razza">' + D.RAZZE.filter((x) => D.fonteOk(ch, x.fonte) || x.id === ch.razza).map((x) => opt(x.id, x.nome + (x.fonte ? ' (' + D.fonteSigla(x.fonte) + ')' : ''), x.id === ch.razza)).join('') + '</select></div>'
      + (r.sub ? '<div class="col"><label>Sottorazza</label><select data-bind="sub">' + r.sub.map((x) => opt(x.id, x.nome, x.id === ch.sub)).join('') + '</select></div>' : '')
      + '<div class="col"><label>Genere</label><select data-bind="genere"><option value="M"' + (ch.genere !== 'F' ? ' selected' : '') + '>Maschio</option><option value="F"' + (ch.genere === 'F' ? ' selected' : '') + '>Femmina</option></select></div>'
      + '<div class="col"><label>Background</label><select data-bind="sfondo">' + D.SFONDI.map((x) => opt(x.id, x.nome, x.id === ch.sfondo)).join('') + '</select></div>'
      + '<div class="col"><label>Allineamento</label><select data-bind="allineamento">' + D.ALLINEAMENTI.map((x) => opt(x, x, x === ch.allineamento)).join('') + '</select></div>'
      + razzaExtra + '</div>'
      + D.descBox(D.DESC.razza[ch.razza], 'Cosa diventi: ' + r.nome + '.') + D.descBox(r.sub ? D.DESC.sub[ch.razza + '/' + ch.sub] : '', r.sub ? (r.sub.find((x) => x.id === ch.sub) || {}).nome + '.' : '')
      + (function () {
        const bi = D.SFONDI_INFO[sf.id] || { desc: '', priv: ['', ''], equip: '' };
        return '<div class="bg-descr"><h4>' + esc(sf.nome) + '</h4><p>' + esc(bi.desc) + '</p>'
          + '<p><b>Competenze in abilità:</b> ' + sf.abilita.map((x) => D.abilita(x).nome).join(' e ') + '<br><b>Strumenti e linguaggi:</b> ' + esc(sf.altro) + '<br><b>Equipaggiamento:</b> ' + esc(bi.equip) + '</p>'
          + '<p><b>Privilegio – ' + esc(bi.priv[0]) + ':</b> ' + esc(bi.priv[1]) + '</p></div>';
      })()
      + D.descBox(D.DESC.allin[ch.allineamento], ch.allineamento + '.')
      + (function () {
        const dl = M.derive(ch); if (!dl.lingueSlot) return '';
        const LIN = ['Abissale', 'Celestiale', 'Comune', 'Draconico', 'Elfico', 'Gergo delle Profondità', 'Gigante', 'Gnomesco', 'Goblin', 'Halfling', 'Infernale', 'Nanico', 'Orchesco', 'Primordiale', 'Silvano', 'Sottocomune'];
        const sc = (ch.lingue || []).slice(0, dl.lingueSlot); let h = '<h4>Lingue a scelta</h4><div class="riga">';
        for (let i = 0; i < dl.lingueSlot; i++) {
          const altre = dl.lingueFisse.concat(sc.filter((x, j) => j !== i && x));
          h += '<div class="col"><label>Lingua ' + (i + 1) + '</label><select data-az="lingua" data-i="' + i + '"><option value="">— scegli —</option>' + LIN.filter((x) => !altre.includes(x)).map((x) => opt(x, x, x === sc[i])).join('') + '</select></div>';
        }
        return h + '</div><p class="mute">Conosci già: ' + esc(dl.lingueFisse.join(', ')) + '. Le lingue a scelta vengono da razza e background.</p>';
      })()
      + '<h4>Tratti della razza</h4><ul>' + M.derive(ch).tratti.map((t) => '<li><b>' + esc(t.nome) + '.</b> ' + esc(t.desc) + '</li>').join('') + '</ul></div>';
  }

  /* --- 2. caratteristiche --- */
  function tabPunteggi(ch) {
    const c = D.classe(ch.livelli[0]); const d = M.derive(ch); const prio = M.prioritaPG(ch);
    const metodi = [['array', 'Array standard (15,14,13,12,10,8)'], ['punti', 'Acquisto a punti (27)'], ['tiri', 'Tiro dei dadi (4d6, scarta il più basso)'], ['manuale', 'Manuale']];
    const pool = ch.metodo === 'array' ? [15, 14, 13, 12, 10, 8] : ch.tiri.slice().sort((a, b) => b - a);
    const speso = D.ABIL.reduce((s, a) => s + (M.COSTO[ch.punteggi[a]] == null ? 99 : M.COSTO[ch.punteggi[a]]), 0);
    let ctrl = '';
    if (ch.metodo === 'tiri') {
      ctrl += '<div class="riga" style="margin-bottom:.6rem"><button data-az="tiraTutti">🎲 ' + (ch.tiri.length ? 'Ritira i dadi' : 'Tira i dadi') + '</button>'
        + (ch.tiri.length ? '<span>Risultati: ' + ch.tiri.map((t) => '<span class="chip"><b>' + t + '</b></span>').join('') + '</span>' : '<span class="mute">Premi per tirare 6 volte 4d6 (si scarta il dado più basso).</span>') + '</div>';
    }
    if (ch.metodo === 'punti') ctrl += '<p>Punti spesi: <b class="' + (speso > 27 ? 'ko' : 'ok') + '">' + speso + ' / 27</b> (minimo 8, massimo 15 prima dei bonus razziali)</p>';
    const caselle = D.ABIL.map((a) => {
      let campo;
      if (ch.metodo === 'array' || ch.metodo === 'tiri') {
        campo = '<select data-az="setPunteggio" data-ab="' + a + '">' + (pool.length ? pool.map((v) => opt(v, v, v === ch.punteggi[a])).join('') : opt(8, 8, true)) + '</select>';
      } else if (ch.metodo === 'punti') {
        campo = '<div class="punti-ctrl"><button class="pic" data-az="punti" data-ab="' + a + '" data-dir="-1">−</button><b>' + ch.punteggi[a] + '</b><button class="pic" data-az="punti" data-ab="' + a + '" data-dir="1">＋</button></div>';
      } else {
        campo = '<input type="number" min="3" max="20" style="width:5rem" data-az="setPunteggio" data-ab="' + a + '" value="' + ch.punteggi[a] + '">';
      }
      const br = M.bonusRazza(ch)[a] || 0;
      return '<div class="p-box"><div class="et">' + D.ABIL_NOME[a] + '</div><div class="mod">' + fmt(d.mods[a]) + '</div>' + campo + '<div class="fin">finale <b>' + d.fin[a] + '</b>' + (br ? ' (razza ' + fmt(br) + ')' : '') + '</div></div>';
    }).join('');

    // consiglio
    let consiglio = '';
    if (ch.metodo !== 'manuale' && !(ch.metodo === 'tiri' && ch.tiri.length < 6)) {
      const rc = M.consigliaPunteggi(ch);
      const righe = rc.ordine.map((a, i) => {
        const f = rc.punteggi[a] + (rc.bonus[a] || 0);
        return '<tr><td>' + D.ABIL_NOME[a] + '</td><td><b>' + rc.punteggi[a] + '</b></td><td>' + (rc.bonus[a] ? fmt(rc.bonus[a]) : '–') + '</td><td><b>' + f + '</b> (' + fmt(M.mod(f)) + ')</td><td>' + esc(rc.motivi[a]) + '</td></tr>';
      }).join('');
      consiglio = '<div class="card"><h3>🧭 Dove mettere i punteggi migliori</h3><p>' + esc(c.consiglio) + '</p>'
        + (c.prioritaAlt ? '<div class="riga" style="margin-bottom:.5rem"><div class="col"><label>Stile di gioco</label><select data-bind="variante"><option value="">Guerriero forte (Forza)</option>' + opt('alt', c.prioritaAlt.nome, ch.variante === 'alt') + '</select></div></div>' : '')
        + '<table class="consigli"><thead><tr><th>Caratteristica</th><th>Valore</th><th>Razza</th><th>Finale</th><th>Perché</th></tr></thead><tbody>' + righe + '</tbody></table>'
        + '<p><button class="oro" data-az="applicaConsiglio">✨ Applica questa distribuzione</button> <span class="mute">Calcolata tenendo conto dei bonus della razza scelta (' + esc(d.razza.nome) + ').</span></p></div>';
    }
    return '<div class="card"><h3>Come vuoi ottenere i punteggi?</h3><div class="riga"><div class="col"><select data-az="metodo">' + metodi.map(([id, l]) => opt(id, l, id === ch.metodo)).join('') + '</select></div></div>'
      + ctrl + '<div class="punteggi-grid">' + caselle + '</div></div>' + consiglio;
  }

  /* --- 3. classe --- */
  const PREREQ = { barbaro: { tutte: ['for'] }, bardo: { tutte: ['car'] }, chierico: { tutte: ['sag'] }, druido: { tutte: ['sag'] }, guerriero: { una: ['for', 'des'] }, ladro: { tutte: ['des'] }, mago: { tutte: ['int'] }, monaco: { tutte: ['des', 'sag'] }, paladino: { tutte: ['for', 'car'] }, ranger: { tutte: ['des', 'sag'] }, stregone: { tutte: ['car'] }, warlock: { tutte: ['car'] }, artefice: { tutte: ['int'] } };

  function tabClasse(ch) {
    const c = D.classe(ch.livelli[0]); const d = M.derive(ch); const gia = M.abilitaGia(ch); const opz = M.abilitaOpzioni(ch);
    const scelta = (ch.livelli.length === 1)
      ? '<div class="col"><label>Classe</label><select data-az="classe1">' + D.CLASSI.filter((x) => D.fonteOk(ch, x.fonte) || x.id === ch.livelli[0]).map((x) => opt(x.id, x.nome, x.id === ch.livelli[0])).join('') + '</select></div>'
      : '<div class="col"><label>Classe iniziale</label><b>' + c.nome + '</b> <span class="mute">(si cambia solo al livello 1)</span></div>';
    const abil = opz.map((id) => {
      const s = D.abilita(id); const g = gia.has(id); const sel = (ch.abilita || []).includes(id);
      return '<label class="' + (g ? 'dis' : '') + '"><input type="checkbox" data-az="toggleArr" data-path="abilita" data-scambia="1" data-val="' + id + '" data-max="' + c.nAbilita + '"' + (sel ? ' checked' : '') + (g ? ' disabled' : '') + '> ' + s.nome + (g ? ' <em>(già da razza/background)</em>' : '') + '</label>';
    }).join('');
    const md = M.maestrieDovute(ch); let mae = '';
    if (md) {
      mae = '<div class="card"><h3>Maestria (competenza doppia)</h3><p class="mute">Scegli ' + md + ' abilità in cui sei già competente: il bonus di competenza vale il doppio.</p><div class="sel-lista">'
        + [...d.compAbilita].map((id) => { const sel = (ch.maestrie || []).includes(id); return '<label><input type="checkbox" data-az="toggleArr" data-path="maestrie" data-scambia="1" data-val="' + id + '" data-max="' + md + '"' + (sel ? ' checked' : '') + '> ' + D.abilita(id).nome + '</label>'; }).join('') + '</div></div>';
    }
    const haStile = d.classi.some((k) => k.def.stile && k.livello >= (k.def.stileDa || 1));
    const optT = (D.OPZIONALI && D.OPZIONALI.length) ? (() => { const lst = D.OPZIONALI.filter((o) => D.fonteOk(ch, o.fonte) && d.classi.some((k) => k.id === o.cl && k.livello >= o.liv && (!o.sub || (k.sub && k.sub.id === o.sub)))); if (!lst.length) return ''; return '<div class="card"><h3>Privilegi di classe opzionali</h3><p class="mute">Privilegi facoltativi dei manuali attivi: attivali solo se il DM li permette. Quelli che sostituiscono un privilegio nascondono l\'originale.</p><div class="sel-lista">' + lst.map((o) => '<label><input type="checkbox" data-az="optTasha" data-val="' + o.id + '"' + ((ch.opt || {})[o.id] ? ' checked' : '') + '> <b>' + esc(o.nome) + '</b> <span class="mute">(' + esc(D.fonteSigla(o.fonte)) + ' · ' + o.liv + '° · ' + esc(o.desc) + ')</span></label>').join('') + '</div></div>'; })() : '';
    const stile = haStile ? '<div class="card"><h3>Stile di Combattimento</h3><select data-bind="stile">' + opt('', '— scegli —', !ch.stile) + D.STILI.filter((s) => (D.fonteOk(ch, s[3]) || ch.stile === s[0]) && (!s[4] || ch.stile === s[0] || d.classi.some((k) => k.def.stile && s[4].includes(k.id)) )).map((s) => opt(s[0], s[1] + (s[3] ? ' (' + D.fonteSigla(s[3]) + ')' : '') + ' – ' + s[2], ch.stile === s[0])).join('') + '</select></div>' : '';
    const stileTutto = stile + optT;
    const kd = d.classi.find((k) => k.id === 'monaco' && k.sottoclasseAttiva && k.sub && k.sub.id === 'elementi');
    let disc = '';
    if (kd) {
      const nd = D.discMonacoMax(kd.livello); const sc = (ch.discipline || []).filter((id) => { const x = D.DISC_MONACO.find((y) => y[0] === id); return x && x[2] <= kd.livello; });
      disc = '<div class="card"><h3>Discipline Elementali * (' + sc.length + '/' + nd + ')</h3><p class="mute">Sintonia Elementale la conosci già. Scegli ' + nd + ' disciplina/e: ognuna costa punti ki quando la usi. Alcune richiedono un livello minimo.</p><div class="sel-lista">'
        + D.DISC_MONACO.filter((x) => x[2] <= kd.livello).map((x) => { const sel = (ch.discipline || []).includes(x[0]); const piena = sc.length >= nd && !sel; return '<label class="' + (piena ? 'dis' : '') + '"><input type="checkbox" data-az="toggleArr" data-path="discipline" data-val="' + x[0] + '" data-max="' + nd + '"' + (sel ? ' checked' : '') + '> <b>' + esc(x[1]) + '</b> <em class="mute">(' + x[3] + ' ki' + (x[2] > 3 ? ', liv. ' + x[2] : '') + ')</em> – ' + esc(x[4]) + '</label>'; }).join('') + '</div><p class="mute">* ' + esc(D.AVVISO_CAMBIO) + '</p>' + libera(ch) + '</div>';
    }
    const km = d.classi.find((k) => k.id === 'guerriero' && k.sottoclasseAttiva && k.sub && k.sub.id === 'maestro');
    let man = '';
    if (km) {
      const nm = D.manovreMax(km.livello); const sm = (ch.manovre || []).length;
      man = '<div class="card"><h3>Manovre * (' + Math.min(sm, nm) + '/' + nm + ')</h3><p class="mute">Ogni manovra si usa spendendo un dado di superiorità (D = il dado speso). Una sola manovra per attacco. Scegli ' + nm + ' manovre.</p><div class="sel-lista">'
        + D.MANOVRE.filter((x) => D.fonteOk(ch, x[3]) || (ch.manovre || []).includes(x[0])).map((x) => { const sel = (ch.manovre || []).includes(x[0]); const piena = sm >= nm && !sel; return '<label class="' + (piena ? 'dis' : '') + '"><input type="checkbox" data-az="toggleArr" data-path="manovre" data-val="' + x[0] + '" data-max="' + nm + '"' + (sel ? ' checked' : '') + '> <b>' + esc(x[1]) + '</b> – ' + esc(x[2]) + '</label>'; }).join('') + '</div><p class="mute">* ' + esc(D.AVVISO_CAMBIO) + '</p>' + libera(ch) + '</div>';
    }
    let sg = '';
    d.classi.forEach((k) => D.scelteDi(k).forEach((g) => {
      const n = g.n(k.livello); const sel = M.sceltiValidi(ch, k, g).map((o) => o.id); const ops = D.opzioniScelta(g, k, ch);
      const patto = ((ch.scelte || {}).patto || [])[0]; const motivo = (o) => (k.livello < o.liv ? 'dal livello ' + o.liv : o.truc && (!o.patto || patto === o.patto) ? 'serve il trucchetto Deflagrazione Occulta' : 'serve il Patto della ' + (o.patto === 'catena' ? 'Catena' : o.patto === 'lama' ? 'Lama' : 'Tomo'));
      if (n === 1) {
        sg += '<div class="card"><h3>' + esc(g.nome) + (g.avviso ? ' *' : '') + '</h3>' + (g.nota ? '<p class="mute">' + esc(g.nota) + '</p>' : '') + '<select data-az="sceltaUna" data-id="' + g.id + '">' + opt('', '— scegli —', !sel.length) + ops.map((o) => opt(o.id, o.nome, sel[0] === o.id)).join('') + '</select>'
          + (sel.length ? '<p>' + esc((ops.find((o) => o.id === sel[0]) || {}).desc || '') + '</p>' : '') + (g.avviso ? '<p class="mute">* ' + esc(g.avviso) + '</p>' + (g.id === 'suppliche' ? libera(ch) : '') : '') + '</div>';
      } else {
        sg += '<div class="card"><h3>' + esc(g.nome) + (g.avviso ? ' *' : '') + ' (' + sel.length + '/' + n + ')</h3>' + (g.nota ? '<p class="mute">' + esc(g.nota) + '</p>' : '') + '<div class="sel-lista">'
          + ops.map((o) => { const on = sel.includes(o.id); const piena = sel.length >= n && !on; const blocca = piena || !o.ok; return '<label class="' + (blocca ? 'dis' : '') + '"><input type="checkbox" data-az="toggleArr" data-path="scelte.' + g.id + '" data-val="' + o.id + '" data-max="' + n + '"' + (on ? ' checked' : '') + (blocca ? ' disabled' : '') + '> <b>' + esc(o.nome) + '</b>' + (o.ok ? '' : ' <em class="mute">(' + motivo(o) + ')</em>') + ' – ' + esc(o.desc) + '</label>'; }).join('') + '</div>' + (g.avviso ? '<p class="mute">* ' + esc(g.avviso) + '</p>' + (g.id === 'suppliche' ? libera(ch) : '') : '') + '</div>';
      }
    }));
    const subs = d.classi.filter((k) => k.sottoclasseAttiva).map((k) => {
      const sc = k.def.sottoclasse;
      return '<div class="col"><label>' + k.def.nome + ' · ' + sc.titolo + '</label><select data-az="sottoclasse" data-cl="' + k.id + '">' + opt('', '— scegli —', !k.sub) + sc.opzioni.filter((o) => D.fonteOk(ch, o.fonte) || (k.sub && k.sub.id === o.id)).map((o) => opt(o.id, o.nome + (o.fonte ? ' (' + D.fonteSigla(o.fonte) + ')' : ''), k.sub && k.sub.id === o.id)).join('') + '</select></div>' + (k.sub ? '<div class="col" style="flex-basis:100%">' + D.descBox(D.DESC.sottoclasse[k.id + '/' + k.sub.id], k.sub.nome + '.') + '</div>' : '');
    }).join('');
    return '<div class="card"><h3>Classe di partenza</h3><div class="riga">' + scelta + '</div>'
      + D.descBox(D.DESC.classe[c.id], 'Cosa diventi: ' + c.nome + '.') + '<p>' + esc(c.consiglio) + '</p>'
      + '<p class="mute">Dado Vita d' + c.dado + ' · Tiri salvezza: ' + c.salvezze.map((a) => D.ABIL_NOME[a]).join(', ') + ' · Armature: ' + (c.armature.length ? c.armature.join(', ') : 'nessuna') + ' · Armi: ' + c.armi.map((x) => x === 'semplice' ? 'semplici' : x === 'da guerra' ? 'da guerra' : x).join(', ') + '</p></div>'
      + '<div class="card"><h3>Abilità di classe (' + (ch.abilita || []).length + '/' + c.nAbilita + ')</h3><div class="sel-lista">' + abil + '</div>'
      + '<p><button class="oro" data-az="consigliaAbilita">✨ Scegli per me le più utili</button> <span class="mute">Evita quelle che hai già da razza e background.</span></p></div>'
      + mae + stileTutto + disc + man + sg
      + (subs ? '<div class="card"><h3>Sottoclasse</h3><div class="riga">' + subs + '</div></div>' : '');
  }

  /* --- 4. livelli --- */
  function tabLivelli(ch) {
    const d = M.derive(ch); const tot = ch.livelli.length;
    const ultima = ch.livelli[tot - 1];
    const ok = (id) => { const f = M.finali(ch); const p = PREREQ[id]; if (id === ch.livelli[0] || ch.livelli.includes(id)) return true; return p.tutte ? p.tutte.every((a) => f[a] >= 13) : p.una.some((a) => f[a] >= 13); };
    const selCl = '<select id="nuova-classe">' + D.CLASSI.filter((x) => D.fonteOk(ch, x.fonte) || ch.livelli.includes(x.id)).map((x) => opt(x.id, x.nome + (ok(x.id) ? '' : ' (requisiti non soddisfatti)'), x.id === ultima)).join('') + '</select>';
    const cnt = {}; const righe = ch.livelli.map((cid, i) => {
      cnt[cid] = (cnt[cid] || 0) + 1; const cd = D.classe(cid); const cl = cnt[cid];
      const nov = cd.tratti.filter((t) => t[0] === cl).map((t) => t[1]);
      const sc = cd.sottoclasse; if (sc.livello === cl) nov.push(sc.titolo);
      const asi = cd.asi.includes(cl);
      const pf = i === 0 ? cd.dado : Math.floor(cd.dado / 2) + 1;
      return '<tr><td>' + (i + 1) + '</td><td>' + cd.nome + ' ' + cl + '</td><td>' + fmt(Math.max(1, pf + d.mods.cos)) + '</td><td>' + (nov.length ? esc(nov.join(', ')) : '–') + (asi ? ' <span class="chip">Aumento di Punteggio / Talento</span>' : '') + '</td></tr>';
    }).join('');
    // ASI
    const slots = M.slotAsi(ch); let asiHtml = '';
    if (slots.length) {
      asiHtml = '<div class="card"><h3>Aumenti di Punteggio e Talenti</h3>' + slots.map((s) => {
        const e = ch.asi[s.liv] || { tipo: 'asi' }; const tmp = clone(ch); delete tmp.asi[s.liv];
        const fin = M.finali(tmp); const cons = M.consigliaAsi(fin, M.prioritaPG(ch));
        const sel = (campo, val) => '<select data-az="setAsi" data-liv="' + s.liv + '" data-campo="' + campo + '">' + opt('', '—', !val) + D.ABIL.map((a) => opt(a, D.ABIL_NOME[a] + ' (' + fin[a] + ')', val === a)).join('') + '</select>';
        let corpo;
        if (e.tipo === 'talento') {
          corpo = '<input list="talenti" placeholder="Nome del talento" data-az="setAsi" data-liv="' + s.liv + '" data-campo="talento" value="' + esc(e.talento || '') + '"> <span class="mute">+1 a (se il talento lo prevede):</span> ' + sel('bonus', e.bonus);
        } else {
          corpo = '+1 a ' + sel('a', e.a) + ' +1 a ' + sel('b', e.b) + ' <span class="mute">(stessa caratteristica due volte = +2)</span>';
        }
        return '<div class="riga" style="margin-bottom:.5rem;border-bottom:1px solid var(--linea);padding-bottom:.5rem"><div style="min-width:9rem"><b>Livello ' + s.liv + '</b><br><span class="mute">' + D.classe(s.classe).nome + ' ' + s.livClasse + '</span></div>'
          + '<div class="col"><select data-az="setAsi" data-liv="' + s.liv + '" data-campo="tipo">' + opt('asi', 'Aumenta i punteggi', e.tipo !== 'talento') + opt('talento', 'Scegli un talento', e.tipo === 'talento') + '</select> ' + corpo
          + '<div class="mute">💡 Consiglio: ' + (cons.a ? '+1 ' + D.ABIL_NOME[cons.a] + (cons.b ? ' e +1 ' + D.ABIL_NOME[cons.b] : '') + ' – ' : '') + esc(cons.perche) + ' <button class="pic sec" data-az="applicaAsi" data-liv="' + s.liv + '">Applica</button></div></div></div>';
      }).join('') + '<datalist id="talenti">' + D.TALENTI.concat(Object.keys(D.TALENTI_FONTE || {}).filter((t) => D.fonteOk(ch, D.TALENTI_FONTE[t]))).map((t) => '<option value="' + esc(t) + '">').join('') + '</datalist></div>';
    }
    const man = M.valida(ch).filter((x) => !x.ok);
    return '<div class="card"><h3>Livello attuale: ' + tot + '</h3>'
      + '<div class="riga"><div class="col"><label>Sali di livello come…</label>' + selCl + '</div><div class="col" style="flex:0 0 auto"><button class="oro" data-az="saliLivello">⬆ Sali al livello ' + (tot + 1) + '</button></div>'
      + (tot > 1 ? '<div class="col" style="flex:0 0 auto"><button class="sec" data-az="scendiLivello">↩ Annulla ultimo livello</button></div>' : '') + '</div>'
      + (tot >= 20 ? '<div class="avviso">Hai già raggiunto il livello 20.</div>' : '')
      + '<p class="mute">Per cambiare classe (multiclasse) scegli un\'altra classe: servono 13 nella caratteristica richiesta. Punti ferita calcolati col valore medio del dado.</p></div>'
      + '<div class="card"><h3>Storia dei livelli</h3><table class="timeline"><thead><tr><th>Liv.</th><th>Classe</th><th>PF</th><th>Novità</th></tr></thead><tbody>' + righe + '</tbody></table></div>'
      + asiHtml
      + (man.length ? '<div class="avviso">Mancano ancora delle scelte: ' + man.map((x) => esc(x.t)).join(' · ') + ' — <button class="pic sec" data-az="tab" data-t="classe">vai a Classe</button></div>' : '');
  }

  /* --- 5. equipaggiamento --- */
  function tabEquip(ch) {
    const d = M.derive(ch);
    const armi = (cat) => D.ARMI.filter((w) => w.cat === cat).map((w) => '<label><input type="checkbox" data-az="toggleArr" data-path="armi" data-val="' + w.id + '"' + (ch.armi.includes(w.id) ? ' checked' : '') + '> ' + w.nome + ' <em class="mute">' + w.dado + '</em></label>').join('');
    return '<div class="card"><h3>Armatura</h3><div class="riga"><div class="col"><select data-bind="armatura">' + D.ARMATURE.map((a) => opt(a.id, a.nome + (a.tipo ? ' (' + a.tipo + ', CA ' + a.base + (a.max === 99 ? ' + Des' : a.max ? ' + Des max 2' : '') + ')' : ''), a.id === (ch.armatura || 'nessuna'))).join('') + '</select></div>'
      + '<div class="col"><label style="color:inherit"><input type="checkbox" data-bind="scudo"' + (ch.scudo ? ' checked' : '') + '> Scudo (+2 CA)</label></div></div>'
      + '<p>Classe Armatura: <b style="font-size:1.3rem">' + d.ca + '</b></p>' + d.avvisiCA.map((a) => '<div class="avviso">' + esc(a) + '</div>').join('')
      + '<p><button class="oro" data-az="equipConsigliato">✨ Equipaggiamento consigliato per la classe</button></p></div>'
      + '<div class="card"><h3>Armi (compaiono nella tabella attacchi della scheda)</h3><h4>Semplici</h4><div class="sel-lista">' + armi('semplice') + '</div><h4>Da guerra</h4><div class="sel-lista">' + armi('da guerra') + '</div>'
      + (d.attacchi.length ? '<h4>Attacchi calcolati</h4><table><thead><tr><th>Arma</th><th>Per colpire</th><th>Danno</th><th></th></tr></thead><tbody>' + d.attacchi.map((a) => '<tr><td>' + a.nome + '</td><td><b>' + fmt(a.bonus) + '</b></td><td>' + esc(a.danno) + '</td><td class="mute">' + (a.prof ? '' : '<span class="ko">non competente – senza bonus di competenza</span>') + '</td></tr>').join('') + '</tbody></table>' : '') + '</div>'
      + '<div class="card"><h3>Altro equipaggiamento</h3><textarea data-bind="equip" placeholder="Zaino, razioni, corda, monete…">' + esc(ch.equip) + '</textarea></div>';
  }

  /* --- 6. incantesimi --- */
  function tabMagia(ch) { return window.FORGIA_X.tabMagia(ch, { esc }); }
  /* --- 7. scheda --- */
  function tabScheda(ch) {
    return '<div class="card"><div class="riga"><button class="oro" data-az="stampa" data-id="' + ch.id + '">🖨 Stampa / salva PDF</button><span class="mute">Nel dialogo di stampa scegli "A4", margini predefiniti, e "Salva come PDF" se vuoi il file.</span></div>'
      + (function () {
        const dt = ch.dett || {};
        const t = (k, l, alt) => '<div class="col" style="flex-basis:' + (alt || '100%') + '"><label>' + l + '</label><textarea style="min-height:3.5rem" data-bind="dett.' + k + '">' + esc(dt[k] || '') + '</textarea></div>';
        const i = (k, l) => '<div class="col" style="flex-basis:130px"><label>' + l + '</label><input data-bind="dett.' + k + '" value="' + esc(dt[k] || '') + '"></div>';
        const m = (k, l) => '<div class="col" style="flex-basis:90px"><label>' + l + '</label><input type="number" min="0" data-bind="dett.m_' + k + '" value="' + esc(dt['m_' + k] || '') + '"></div>';
        const sel = (path, l, opts, cur) => '<div class="col" style="flex-basis:240px"><label>' + l + '</label><select data-bind="' + path + '">' + opts.map((o) => '<option value="' + o[0] + '"' + (o[0] === cur ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div>';
        return '<h3 style="margin-top:1rem">Opzioni di stampa</h3><div class="riga">' + sel('modelloScheda', 'Modello di scheda', [['uff', 'Ufficiale D&D 5ª ed. (grafica WotC)'], ['semplice', 'Semplice (solo testo)'], ['bimbi', 'Ufficiale D&D per bambini (stessa scheda, sezioni colorate)']], ch.modelloScheda || 'uff') + sel('dett.stampaDesc', 'Pagina con descrizioni degli incantesimi', [['si', 'Sì, includila'], ['no', 'No']], dt.stampaDesc || 'si') + i('xp', 'Punti esperienza') + '</div>'
          + (ch.modelloScheda === 'bimbi' ? '<div class="riga" style="align-items:center;gap:.8rem"><label><input type="checkbox" data-az="legendaDM"' + (ch.legendaDM ? ' checked' : '') + '> Stampa legenda scheda per DM (aggiunge una pagina in fondo)</label> <button class="sec" data-az="stampaLegenda">🖨 Stampa solo la legenda per il DM</button></div>' : '')
          + '<h3 style="margin-top:1rem">Personalità (pagina 1 della scheda)</h3><p class="rnd"><button class="oro" data-az="casuale" data-gr="pers">🎲 Compila a caso</button> <button class="sec" data-az="casuale" data-gr="pers" data-tutto="1" title="Sostituisce anche i campi già scritti">🔄 Rigenera tutto</button> <span class="mute">Inventa tratti, ideali, legami e difetti coerenti con background, classe e allineamento. «Compila» riempie solo i campi vuoti.</span></p><div class="riga">' + t('tratti', 'Tratti caratteriali', '48%') + t('ideali', 'Ideali', '48%') + t('legami', 'Legami', '48%') + t('difetti', 'Difetti', '48%') + '</div>'
          + '<h3>Monete</h3><div class="riga">' + m('pr', 'Rame') + m('pa', 'Argento') + m('pe', 'Electrum') + m('po', 'Oro') + m('pp', 'Platino') + '</div>'
          + '<h3>Simbolo e nome (pagina 2)</h3><div class="simbolo-box">' + (ch.simbolo ? '<div class="sy-prev">' + window.FORGIA_X.simboloSVG(ch.simbolo, 90, 108) + '</div>' : '') + '<div class="sy-ctl"><p><button class="oro" data-az="simboloGenera">🎲 ' + (ch.simbolo ? 'Genera un altro simbolo e nome' : 'Genera simbolo e nome a caso') + '</button></p>'
            + (ch.simbolo ? '<div class="col"><label>Nome del simbolo (modificabile)</label><input data-bind="simbolo.nome" value="' + esc(ch.simbolo.nome) + '"></div><p><label><input type="checkbox" data-az="simboloScheda"' + (ch.simboloScheda ? ' checked' : '') + '> Metti simbolo e nome nella scheda (riquadro Simbolo, pagina 2)</label></p>' : '<p class="mute">Un emblema e un nome d\'ordine o di compagnia, scelti in base alla classe. Potrai inserirli o no nella scheda.</p>') + '</div></div>'
          + '<h3>Aspetto e storia (pagina 2)</h3><p class="rnd"><button class="oro" data-az="casuale" data-gr="asp">🎲 Compila a caso</button> <button class="sec" data-az="casuale" data-gr="asp" data-tutto="1" title="Sostituisce anche i campi già scritti">🔄 Rigenera tutto</button> <span class="mute">Età, altezza, peso, occhi, pelle, capelli, aspetto, storia, alleati e tesori in base a razza, classe, background e livello.</span></p><div class="riga">' + i('eta', 'Età') + i('altezza', 'Altezza') + i('peso', 'Peso') + i('occhi', 'Occhi') + i('pelle', 'Pelle') + i('capelli', 'Capelli') + '</div>'
          + '<div class="riga">' + t('aspetto', 'Aspetto (disegno/descrizione)') + t('storia', 'Storia del personaggio') + t('alleati', 'Alleati e organizzazioni', '48%') + t('tesoro', 'Tesori', '48%') + '</div>'
          + '<h3>Note libere</h3><textarea data-bind="note" placeholder="Appunti, tratti aggiuntivi…" style="min-height:5rem">' + esc(ch.note) + '</textarea></div>';
      })()
      + '<div class="anteprima">' + foglioHTML(ch) + '</div>';
  }

  /* ---------- LA SCHEDA STAMPABILE ---------- */
  function foglioHTML(ch) { return window.FORGIA_X.foglio(ch, { esc, fmt, metri }); }
  function vistaHome() {
    const g = !C.attivo || C.utente.ruolo === 'gestore';
    const T = [['nuovo', '🧙', 'Nuovo personaggio', 'Crea un eroe passo dopo passo', 'viola']].concat([['vaiElenco', '🛡️', 'Personaggi', 'Le schede dei giocatori: apri, modifica, stampa', 'blu']])
      .concat(g ? [['vaiParty', '🧭', 'Party Tracker', 'Il foglio del gruppo da tenere al tavolo', 'verde'], ['vaiBestiario', '🐉', 'Bestiario', 'Cerca i mostri e stampa le loro carte', 'rosso'], ['vaiAvventure', '📜', 'Avventure', 'Raggruppa i mostri di ogni avventura', 'oro'], ['vaiIncontri', '⚔️', 'Incontri', 'Iniziativa, PF e carte dei mostri dell\'incontro', 'rosa']] : []);
    return '<section class="home"><h1>Che cosa vuoi fare?</h1><div class="home-griglia">'
      + T.map(([az, ic, t, d, col]) => '<button class="home-tile ' + col + '" data-az="' + az + '"><span class="ht-img">' + ic + '</span><b>' + t + '</b><small>' + d + '</small></button>').join('') + '</div></section>';
  }
  /* stampa: aspetta che le immagini della scheda siano caricate (sul telefono altrimenti escono pagine bianche) */
  const stampaPronta = () => {
    if (window.FORGIA_X.usaPdf && window.FORGIA_X.usaPdf()) { window.FORGIA_X.pdfStampa(); return; }
    const imgs = [...document.querySelectorAll('#stampa img')].filter((i) => !i.complete);
    const via = () => requestAnimationFrame(() => setTimeout(() => window.print(), 50));
    if (!imgs.length) { via(); return; }
    let fatto = false; const fine = () => { if (!fatto) { fatto = true; via(); } };
    Promise.all(imgs.map((i) => new Promise((r) => { i.addEventListener('load', r); i.addEventListener('error', r); }))).then(fine); setTimeout(fine, 4000);
  };
  window.FORGIA_X.stampaPronta = stampaPronta;
  ['uff_1.jpg', 'uff_2.jpg', 'uff_3.jpg', 'logo-argini-bn.png'].forEach((u) => { const i = new Image(); i.src = u; });
  /* ---------- rendering ---------- */
  const NAV_USCITA = new Set(['vaiHome', 'vaiElenco', 'vaiParty', 'vaiBestiario', 'vaiAvventure', 'vaiIncontri', 'vaiUtenti', 'vaiProfilo', 'tornaElenco', 'esci', 'apri', 'apriLivelli', 'nuovo']);
  function chiediBozza(ch, prosegui) {
    const o = document.createElement('div'); o.className = 'zoom-rit no-print'; o.style.cursor = 'default';
    o.innerHTML = '<div class="dlg-bozza"><h3>Personaggio non salvato</h3><p>«' + esc(ch.nome || 'Senza nome') + '» non è ancora stato salvato. Vuoi salvarlo prima di uscire?</p>'
      + '<p class="dlg-az"><button class="oro" data-b="salva">💾 Salva ed esci</button><button class="pericolo" data-b="scarta">Non salvare</button><button class="sec chiaro" data-b="resta">← Resta qui</button></p></div>';
    o.addEventListener('click', (e) => {
      const b = e.target.closest('[data-b]'); if (!b) return; const v = b.dataset.b; o.remove();
      if (v === 'resta') return;
      if (v === 'salva') { delete ch.bozza; ch.aggiornato = new Date().toISOString(); S.bozzaId = null; scrivi(); }
      else { DB.personaggi = DB.personaggi.filter((x) => x.id !== ch.id); S.bozzaId = null; S.id = null; }
      prosegui();
    });
    document.body.appendChild(o);
  }
  window.addEventListener('beforeunload', (e) => { const b = S.bozzaId && trova(S.bozzaId); if (b && b.bozza) { e.preventDefault(); e.returnValue = ''; } });
  function risolviBozza() {
    const id = S.bozzaId; if (!id || (S.vista === 'editor' && S.id === id)) return;
    S.bozzaId = null; const ch = trova(id); if (!ch || !ch.bozza) return;
    if (!confirm('Il personaggio «' + (ch.nome || 'Senza nome') + '» non è stato ancora salvato.\n\nOK = salvalo • Annulla = non salvarlo (viene scartato)')) { DB.personaggi = DB.personaggi.filter((x) => x.id !== id); if (S.id === id) S.id = null; return; }
    delete ch.bozza; ch.aggiornato = new Date().toISOString(); scrivi();
  }
  function render() {
    risolviBozza();
    const app = $('#app');
    if (C.attivo && !C.utente) app.innerHTML = S.avvio ? '<p class="mute centro">Verifico l\'accesso…</p>' : vistaLogin();
    else if (S.vista === 'home') app.innerHTML = vistaHome();
    else if (S.vista === 'utenti' && C.attivo && C.utente.ruolo === 'gestore') app.innerHTML = vistaUtenti();
    else if (S.vista === 'bestiario' && (!C.attivo || C.utente.ruolo === 'gestore')) app.innerHTML = window.FORGIA_X.vistaBestiario();
    else if (S.vista === 'party' && (!C.attivo || C.utente.ruolo === 'gestore')) { app.innerHTML = window.FORGIA_X.vistaParty(); window.FORGIA_X.partyDopoRender(); }
    else if (S.vista === 'profilo' && C.attivo) app.innerHTML = vistaProfilo();
    else if (S.vista === 'elenco') app.innerHTML = vistaElenco();
    else if (corrente()) app.innerHTML = vistaEditor();
    else { S.vista = 'elenco'; app.innerHTML = vistaElenco(); }
    infoBarra();
  }

  function nuovoPG() {
    const ch = M.nuovo(); if (C.attivo && C.utente) { ch.owner = C.utente.uid; ch.ownerNome = C.utente.nome; }
    const rc = M.consigliaPunteggi(ch, 'array'); ch.punteggi = rc.punteggi;
    ch.bozza = true; DB.personaggi.push(ch); S.bozzaId = ch.id; S.id = ch.id; S.vista = 'editor'; S.tab = 'identita'; render();
  }

  /* ---------- azioni ---------- */
  const azioni = {
    nuovo: nuovoPG,
    apri(el) { S.id = el.dataset.id; S.vista = 'editor'; S.tab = 'identita'; render(); },
    apriLivelli(el) { S.id = el.dataset.id; S.vista = 'editor'; S.tab = 'livelli'; render(); },
    tornaElenco() { S.vista = S.torna || 'elenco'; S.torna = null; S.msgUt = S.msgPw = ''; render(); },
    vaiHome() { S.vista = 'home'; S.id = null; render(); },
    vaiElenco() { S.vista = 'elenco'; S.id = null; S.cestino = false; render(); },
    vaiUtenti() { S.vista = 'utenti'; S.msgUt = ''; render(); },
    vaiProfilo() { S.vista = 'profilo'; S.msgPw = ''; render(); },
    login() {
      const u = $('#lg-user').value; const p = $('#lg-pass').value; S.userLogin = u; S.msgLogin = '';
      if (!u.trim() || !p) { S.msgLogin = 'Inserisci username e password.'; render(); return; }
      S.attesa = true; render();
      C.accedi(u, p).then(() => {}, (e) => { S.attesa = false; S.msgLogin = e.message; render(); });
    },
    esci() { C.esci().then(() => {}, () => {}); },
    caricaLocali() {
      const loc = leggi(KEY).personaggi.filter((p) => !p.cestinato); let n = 0;
      loc.forEach((p) => { if (DB.personaggi.some((x) => x.id === p.id)) p.id = M.uid(); p.owner = C.utente.uid; p.ownerNome = C.utente.nome; p.aggiornato = new Date().toISOString(); DB.personaggi.push(p); n++; });
      try { localStorage.setItem(KEY + ':migrato', '1'); } catch (e) { /* ignora */ }
      scrivi(); render(); alert('Caricati online ' + n + ' personaggi.');
    },
    ignoraLocali() { try { localStorage.setItem(KEY + ':migrato', '1'); } catch (e) { /* ignora */ } render(); },
    utCrea() {
      const v = { nome: $('#nu-nome').value.trim(), username: $('#nu-user').value.trim(), password: $('#nu-pass').value, ruolo: $('#nu-ruolo').value };
      if (!v.username || !v.nome || v.password.length < 6) { S.msgUt = 'Compila nome, username e una password di almeno 6 caratteri.'; render(); return; }
      S.msgUt = 'Creo l\'accesso…'; render();
      C.creaUtente(v).then(() => { S.msgUt = 'Accesso creato per ' + v.nome + '. Username: ' + v.username + ' · Password: ' + v.password; render(); }, (e) => { S.msgUt = e.message; render(); });
    },
    utRuolo(el) { const u = (S.utenti || []).find((x) => x.uid === el.dataset.uid); if (u && confirm('Cambiare il ruolo di ' + (u.nome || u.username) + '?')) C.aggiornaUtente(u.uid, { ruolo: u.ruolo === 'gestore' ? 'genitore' : 'gestore' }).catch((e) => alert(e.message)); },
    utAttivo(el) { const u = (S.utenti || []).find((x) => x.uid === el.dataset.uid); if (u) C.aggiornaUtente(u.uid, { attivo: !u.attivo }).catch((e) => alert(e.message)); },
    utElimina(el) { const u = (S.utenti || []).find((x) => x.uid === el.dataset.uid); if (u && confirm('Eliminare l\'accesso di ' + (u.nome || u.username) + '? Non potrà più entrare.')) C.eliminaUtente(u.uid).catch((e) => alert(e.message)); },
    utReset(el) { const u = (S.utenti || []).find((x) => x.uid === el.dataset.uid); if (u) C.inviaReset(u.username).then(() => alert('Email di reset inviata a ' + u.username), (e) => alert(e.message)); },
    cambiaPw() {
      const o = $('#pw-old').value; const n = $('#pw-new').value;
      if (!o || n.length < 6) { S.msgPw = 'Inserisci la password attuale e una nuova di almeno 6 caratteri.'; render(); return; }
      C.cambiaPassword(o, n).then(() => { S.msgPw = 'Password cambiata.'; render(); }, (e) => { S.msgPw = e.message; render(); });
    },

    tab(el) { S.tab = el.dataset.t; render(); window.scrollTo(0, 0); },
    toggleCestino() { S.cestino = !S.cestino; S.cesSel.clear(); render(); },
    cesSel(el) { if (el.checked) S.cesSel.add(el.dataset.id); else S.cesSel.delete(el.dataset.id); const y = scrollY; render(); scrollTo(0, y); },
    cesTutti() { DB.personaggi.filter((p) => p.cestinato).forEach((p) => S.cesSel.add(p.id)); render(); },
    cesNessuno() { S.cesSel.clear(); render(); },
    cesElimina() { const n = S.cesSel.size; if (!n || !confirm('Eliminare DEFINITIVAMENTE i ' + n + ' personaggi selezionati? Non si può annullare.')) return; DB.personaggi = DB.personaggi.filter((p) => !(p.cestinato && S.cesSel.has(p.id))); S.cesSel.clear(); scrivi(); render(); },
    cesSvuota() { const n = DB.personaggi.filter((p) => p.cestinato).length; if (!n || !confirm('Svuotare il cestino ed eliminare DEFINITIVAMENTE tutti i ' + n + ' personaggi che contiene? Non si può annullare.')) return; DB.personaggi = DB.personaggi.filter((p) => !p.cestinato); S.cesSel.clear(); scrivi(); render(); },
    filtro(el) { S.filtro = el.value; const pos = el.selectionStart; render(); const n = $('input[data-az=filtro]'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } },
    duplica(el) {
      const o = trova(el.dataset.id); const c = clone(o); c.id = M.uid(); c.nome = (o.nome || 'Senza nome') + ' (copia)'; c.creato = c.aggiornato = new Date().toISOString(); if (C.attivo && C.utente) { c.owner = C.utente.uid; c.ownerNome = C.utente.nome; }
      DB.personaggi.push(c); scrivi(); render();
    },
    cestina(el) { const p = trova(el.dataset.id); if (confirm('Spostare "' + (p.nome || 'Senza nome') + '" nel cestino? Potrai ripristinarlo.')) { p.cestinato = true; p.aggiornato = new Date().toISOString(); scrivi(); render(); } },
    ripristina(el) { const p = trova(el.dataset.id); p.cestinato = false; p.aggiornato = new Date().toISOString(); scrivi(); render(); },
    elimina(el) { const p = trova(el.dataset.id); if (confirm('Eliminare DEFINITIVAMENTE "' + (p.nome || 'Senza nome') + '"? Non si può annullare.')) { DB.personaggi = DB.personaggi.filter((x) => x.id !== p.id); scrivi(); render(); } },
    esporta() {
      const blob = new Blob([JSON.stringify({ app: 'forgia-personaggi', versione: 1, personaggi: DB.personaggi }, null, 1)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'personaggi-dnd-' + new Date().toISOString().slice(0, 10) + '.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    },
    importa() { $('#file-import').click(); },
    salvaBozza() { const ch = corrente(); if (!ch) return; delete ch.bozza; S.bozzaId = null; ch.aggiornato = new Date().toISOString(); scrivi(); render(); },
    zoomRitratto(el) {
      const o = document.createElement('div'); o.className = 'zoom-rit no-print';
      o.innerHTML = '<img src="' + el.getAttribute('src') + '" alt=""><span>✕ Chiudi</span>';
      const chiudi = () => { o.remove(); document.removeEventListener('keydown', tasto); };
      const tasto = (e) => { if (e.key === 'Escape') chiudi(); };
      o.addEventListener('click', chiudi); document.addEventListener('keydown', tasto); document.body.appendChild(o);
    },
    simboloGenera() { const ch = corrente(); if (!ch) return; ch.simbolo = window.FORGIA_X.simboloGenera(ch); salvaCorrente(); render(); },
    legendaDM(el) { const ch = corrente(); ch.legendaDM = el.checked; salvaCorrente(); },
    stampaLegenda() { $('#stampa').innerHTML = window.FORGIA_X.legendaDM(); stampaPronta(); },
    simboloScheda(el) { const ch = corrente(); ch.simboloScheda = el.checked; salvaCorrente(); },
    ritrattoScheda(el) { const ch = corrente(); ch.ritrattoScheda = el.checked; salvaCorrente(); aggiornaRiepilogo(); },
    stampa(el) {
      const ch = trova(el.dataset.id || S.id); if (!ch) return;
      $('#stampa').innerHTML = foglioHTML(ch); stampaPronta();
    },
    optTasha(el) { const ch = corrente(); ch.opt = ch.opt || {}; if (el.checked) ch.opt[el.dataset.val] = true; else delete ch.opt[el.dataset.val]; salvaCorrente(); render(); },
    fonte(el) {
      const ch = corrente(); const f = el.dataset.id; const on = !!el.checked;
      D.fonti(ch)[f] = on; ch.manuali = Object.assign({ mdg: true }, ch.manuali || {}); ch.manuali[f] = on; if (f === 'tce') ch.tasha = on;
      if (M.potaScelte) M.potaScelte(ch);
      salvaCorrente(); render();
    },
    razza(el) {
      const ch = corrente(); ch.razza = el.value; const r = D.razza(el.value);
      ch.sub = r.sub ? r.sub[0].id : ''; ch.scelteRazza = { bonusLiberi: [], drago: 'Rosso', abilita: [] };
      ch.abilita = (ch.abilita || []).filter((x) => !M.abilitaGia(ch).has(x));
      salvaCorrente(); render();
    },
    metodo(el) {
      const ch = corrente(); ch.metodo = el.value;
      if (el.value === 'array' || el.value === 'punti') ch.punteggi = M.consigliaPunteggi(ch, el.value).punteggi;
      else if (el.value === 'tiri') { ch.tiri = []; D.ABIL.forEach((a) => (ch.punteggi[a] = 8)); }
      salvaCorrente(); render();
    },
    setPunteggio(el) { const ch = corrente(); ch.punteggi[el.dataset.ab] = +el.value; salvaCorrente(); render(); },
    punti(el) {
      const ch = corrente(); const a = el.dataset.ab; const nv = ch.punteggi[a] + (+el.dataset.dir);
      if (nv < 8 || nv > 15) return;
      const prova = Object.assign({}, ch.punteggi, { [a]: nv });
      const sp = D.ABIL.reduce((s, k) => s + M.COSTO[prova[k]], 0);
      if (sp > 27) return;
      ch.punteggi[a] = nv; salvaCorrente(); render();
    },
    tiraTutti() {
      const ch = corrente(); if (ch.tiri.length && !confirm('Hai già tirato i dadi. Vuoi davvero ritirare?')) return;
      ch.tiri = M.tiraSet(); ch.punteggi = M.consigliaPunteggi(ch, 'tiri').punteggi; salvaCorrente(); render();
    },
    applicaConsiglio() {
      const ch = corrente(); const r = D.razza(ch.razza);
      if (r.bonusLiberi && (ch.scelteRazza.bonusLiberi || []).length < r.bonusLiberi.n) ch.scelteRazza.bonusLiberi = M.consigliaBonusLiberi(ch);
      ch.punteggi = M.consigliaPunteggi(ch).punteggi; salvaCorrente(); render();
    },
    toggleArr(el) {
      const ch = corrente(); if (el.disabled) { el.checked = !el.checked; return; } const p = el.dataset.path; const v = el.dataset.val; const max = el.dataset.max ? +el.dataset.max : 99;
      const k = p.split('.'); let o = ch; while (k.length > 1) { const x = k.shift(); o = o[x] = o[x] || {}; } let arr = o[k[0]] || [];
      const CL = { discipline: 'monaco', manovre: 'guerriero', 'scelte.suppliche': 'warlock' };
      if (CL[p] && !ch.modLibera) {
        // regola del manuale: una sostituzione per ogni livello guadagnato dopo aver fatto la scelta
        const kk = M.contaClassi(ch).find((x) => x.id === CL[p]); const L = kk ? kk.livello : 0;
        ch.acq = ch.acq || {}; const A = (ch.acq[p] = ch.acq[p] || {});
        arr.forEach((id) => { if (A[id] == null) A[id] = L; });
        if (!el.checked) {
          const da = A[v] == null ? L : A[v];
          if (da < L) {
            ch.sost = ch.sost || {}; const usati = (ch.sost[p] = ch.sost[p] || []);
            let lv = da + 1; while (lv <= L && usati.includes(lv)) lv++;
            if (lv > L) { el.checked = true; alert('Il manuale permette di sostituire una sola scelta per ogni livello guadagnato: per questo livello l\'hai già fatto. Puoi cambiare liberamente le scelte fatte a questo livello, oppure attivare "Modifica libera".'); return; }
            usati.push(lv);
          }
          delete A[v];
        } else if (arr.length < max) A[v] = L;
      }
      if (el.checked) { if (arr.length < max && !arr.includes(v)) arr = arr.concat([v]); else if (arr.length >= max && el.dataset.scambia && !arr.includes(v)) arr = arr.slice(arr.length - max + 1).concat([v]); else if (arr.length >= max) { el.checked = false; return; } } else arr = arr.filter((x) => x !== v);
      o[k[0]] = arr; if (p.indexOf('scelte.') === 0) M.potaScelte(ch); salvaCorrente(); render();
    },
    sceltaUna(el) { const ch = corrente(); ch.scelte = ch.scelte || {}; ch.scelte[el.dataset.id] = el.value ? [el.value] : []; M.potaScelte(ch); salvaCorrente(); render(); },
    classe1(el) {
      const ch = corrente(); const vecchia = ch.livelli[0]; ch.livelli = [el.value]; delete ch.sottoclassi[vecchia];
      ch.abilita = []; ch.maestrie = []; ch.stile = ''; ch.discipline = []; ch.manovre = []; ch.scelte = {}; ch.acq = {}; ch.sost = {}; ch.variante = ''; ch.asi = {};
      const e = D.EQUIP[el.value]; if (e) { ch.armatura = e.armatura; ch.scudo = e.scudo; ch.armi = e.armi.slice(); }
      if (ch.metodo === 'array' || ch.metodo === 'punti') ch.punteggi = M.consigliaPunteggi(ch, ch.metodo).punteggi;
      salvaCorrente(); render();
    },
    consigliaAbilita() { const ch = corrente(); ch.abilita = M.consigliaAbilita(ch); salvaCorrente(); render(); },
    casuale(el) { const ch = corrente(); if (!ch) return; D.casuale.genera(ch, el.dataset.gr, !!el.dataset.tutto); salvaCorrente(); render(); },
    lingua(el) { const ch = corrente(); ch.lingue = ch.lingue || []; ch.lingue[+el.dataset.i] = el.value; for (let i = 0; i < ch.lingue.length; i++) if (!ch.lingue[i]) ch.lingue[i] = ''; salvaCorrente(); render(); },
    sottoclasse(el) { const ch = corrente(); ch.sottoclassi[el.dataset.cl] = el.value; M.potaScelte(ch); salvaCorrente(); render(); },
    saliLivello() {
      const ch = corrente(); if (ch.livelli.length >= 20) return;
      const cl = $('#nuova-classe').value; M.aggiungiLivello(ch, cl); scrivi(); render();
    },
    scendiLivello() { const ch = corrente(); if (confirm('Annullare l\'ultimo livello (' + ch.livelli.length + ')? Le scelte fatte a quel livello andranno perse.')) { M.togliLivello(ch); scrivi(); render(); } },
    setAsi(el) {
      const ch = corrente(); const liv = el.dataset.liv; const e = ch.asi[liv] = ch.asi[liv] || { tipo: 'asi' };
      e[el.dataset.campo] = el.value; salvaCorrente(); render();
    },
    applicaAsi(el) {
      const ch = corrente(); const liv = el.dataset.liv; const tmp = clone(ch); delete tmp.asi[liv];
      const c = M.consigliaAsi(M.finali(tmp), M.prioritaPG(ch)); ch.asi[liv] = { tipo: 'asi', a: c.a, b: c.b }; salvaCorrente(); render();
    },
    equipConsigliato() {
      const ch = corrente(); const e = D.EQUIP[ch.livelli[0]]; if (!e) return;
      ch.armatura = e.armatura; ch.scudo = e.scudo; ch.armi = e.armi.slice(); salvaCorrente(); render();
    },
  };

  Object.assign(azioni, window.FORGIA_X.azioni({ S, corrente, salvaCorrente, render }));
  Object.assign(azioni, window.FORGIA_X.azioniBestiario({ S, render, pgs: () => DB.personaggi }));
  Object.assign(azioni, window.FORGIA_X.azioniParty({ S, render, pgs: () => DB.personaggi, scrivi, trova }));

  /* ---------- eventi ---------- */
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-az]'); if (!el) return;
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) return;
    const bz = S.bozzaId && S.vista === 'editor' ? trova(S.bozzaId) : null;
    if (bz && bz.bozza && NAV_USCITA.has(el.dataset.az) && azioni[el.dataset.az]) { chiediBozza(bz, () => azioni[el.dataset.az](el, e)); return; }
    if (azioni[el.dataset.az]) azioni[el.dataset.az](el, e);
  });
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.id === 'file-import') return;
    if (el.dataset && el.dataset.az && ['INPUT', 'SELECT'].includes(el.tagName) && el.dataset.az !== 'filtro') { azioni[el.dataset.az](el, e); return; }
    if (el.dataset && el.dataset.bind) {
      const ch = corrente(); if (!ch) return;
      if (el.dataset.bind === 'campagna') { const v = el.value.replace(/\s+/g, ' ').trim(); const gia = campagne().find((c) => c.toLowerCase() === v.toLowerCase()); el.value = gia || v; }
      setPath(ch, el.dataset.bind, el.type === 'checkbox' ? el.checked : el.value);
      salvaCorrente();
      if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type !== 'checkbox')) { return; } // già aggiornato mentre si scrive: niente ridisegno (farebbe perdere il click sul pulsante successivo)
      render();
    }
  });
  document.addEventListener('input', (e) => {
    const el = e.target;
    if (el.dataset && el.dataset.az === 'filtro') { azioni.filtro(el); return; }
    if (el.dataset && el.dataset.bind && (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type !== 'checkbox'))) {
      const ch = corrente(); if (!ch) return;
      setPath(ch, el.dataset.bind, el.value); salvaCorrente(); aggiornaRiepilogo();
    }
  });
  $('#file-import').addEventListener('change', (e) => {
    const f = e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const dati = JSON.parse(rd.result); const lista = dati.personaggi || [];
        if (!Array.isArray(lista) || !lista.length) throw new Error('vuoto');
        let nuovi = 0; let agg = 0;
        lista.forEach((p) => { if (!p.id || !p.livelli) return; const i = DB.personaggi.findIndex((x) => x.id === p.id); if (i >= 0) { DB.personaggi[i] = p; agg++; } else { DB.personaggi.push(p); nuovi++; } });
        scrivi(); render(); alert('Importati ' + nuovi + ' personaggi nuovi, ' + agg + ' aggiornati.');
      } catch (err) { alert('Il file non è un archivio valido.'); }
      e.target.value = '';
    };
    rd.readAsText(f);
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id && /^lg-/.test(e.target.id)) { e.preventDefault(); azioni.login(); } });
  window.addEventListener('beforeprint', () => { if (S.vista === 'editor' && corrente() && !$('#stampa').innerHTML) $('#stampa').innerHTML = foglioHTML(corrente()); });

  function applicaRemoto(mod, err) {
    let cambiato = false;
    (mod || []).forEach((m) => {
      if (m.tipo === 'rimosso') { if (trova(m.id)) { DB.personaggi = DB.personaggi.filter((p) => p.id !== m.id); cambiato = true; if (S.id === m.id) { S.id = null; S.vista = 'elenco'; } } inviati.delete(m.id); return; }
      const i = DB.personaggi.findIndex((p) => p.id === m.id);
      if (i < 0) { DB.personaggi.push(m.p); inviati.set(m.id, firma(m.p)); cambiato = true; }
      else if ((m.p.aggiornato || '') > (DB.personaggi[i].aggiornato || '') && !(S.vista === 'editor' && S.id === m.id)) { DB.personaggi[i] = m.p; inviati.set(m.id, firma(m.p)); cambiato = true; }
    });
    if (cambiato) { scriviLocale(); if (S.vista === 'elenco') render(); }
    infoBarra();
  }
  if (C.attivo) {
    S.avvio = true; C.alSync = infoBarra;
    C.alCambioStato((u, msg) => {
      S.attesa = false; S.avvio = false;
      if (!u) { window.FORGIA_X.bestiarioReset(); if (KEYATT !== KEY) { try { localStorage.removeItem(KEYATT); } catch (e) { /* ignora */ } } DB = { personaggi: [] }; inviati.clear(); KEYATT = KEY; S.vista = 'home'; S.id = null; if (msg) S.msgLogin = msg; render(); return; }
      KEYATT = KEY + ':' + u.uid; DB = leggi(KEYATT); DB.personaggi.forEach((p) => inviati.set(p.id, firma(p)));
      S.vista = 'home'; S.id = null; S.msgLogin = '';
      C.sottoscrivi(applicaRemoto);
      if (u.ruolo === 'gestore') C.sottoscriviUtenti((l) => { S.utenti = l; if (S.vista === 'utenti') render(); });
      render();
    });
  }
  render();
  window.FORGIA = { S, DB: () => DB, foglioHTML, azioni, render };
})();
