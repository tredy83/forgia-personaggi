/* ACCESSO E ARCHIVIO ONLINE (Firebase Authentication + Cloud Firestore)
   Se FIREBASE_CONFIG è vuoto o l'SDK non si carica, FORGIA_CLOUD.attivo è false e l'app resta in modalità locale. */
(function (G) {
  const cfg = G.FIREBASE_CONFIG;
  const C = (G.FORGIA_CLOUD = { attivo: false, utente: null });
  if (!cfg || !cfg.apiKey || !G.firebase) return;
  C.attivo = true;

  const fb = G.firebase;
  fb.initializeApp(cfg);
  const auth = fb.auth(); const db = fb.firestore();
  const DOMINIO = 'forgia.argini'; // lo username "mario" diventa mario@forgia.argini (non è un indirizzo reale)

  const email = (u) => { u = String(u || '').trim(); return u.includes('@') ? u.toLowerCase() : u.toLowerCase().replace(/\s+/g, '') + '@' + DOMINIO; };
  const usernameDa = (em) => (em || '').endsWith('@' + DOMINIO) ? em.slice(0, -(DOMINIO.length + 1)) : em;
  const errore = (e) => {
    const c = (e && e.code) || '';
    if (/invalid-credential|wrong-password|user-not-found|invalid-email|invalid-login/.test(c)) return 'Username o password non corretti.';
    if (c === 'auth/too-many-requests') return 'Troppi tentativi: riprova tra qualche minuto.';
    if (c === 'auth/network-request-failed' || c === 'unavailable') return 'Nessuna connessione a Internet.';
    if (c === 'auth/weak-password') return 'La password è troppo corta (almeno 6 caratteri).';
    if (c === 'auth/email-already-in-use') return 'Questo username esiste già.';
    if (c === 'auth/requires-recent-login') return 'Per sicurezza esci e rientra, poi riprova.';
    if (c === 'permission-denied') return 'Non hai il permesso per questa operazione.';
    return (e && e.message) || 'Errore imprevisto.';
  };
  C.errore = errore;

  /* ---- stato di accesso ---- */
  let cbStato = () => {};
  C.alCambioStato = (f) => { cbStato = f; };
  auth.onAuthStateChanged(async (u) => {
    if (!u) { C.utente = null; cbStato(null, ''); return; }
    try {
      const d = await db.collection('utenti').doc(u.uid).get();
      const p = d.exists ? d.data() : null;
      if (!p || p.attivo !== true) { await auth.signOut(); C.utente = null; cbStato(null, 'Questo account non è abilitato. Rivolgiti a un gestore.'); return; }
      C.utente = { uid: u.uid, username: usernameDa(u.email), email: u.email, nome: p.nome || usernameDa(u.email), ruolo: p.ruolo === 'gestore' ? 'gestore' : 'genitore' };
      cbStato(C.utente, '');
    } catch (e) { await auth.signOut().catch(() => {}); C.utente = null; cbStato(null, errore(e)); }
  });
  C.accedi = (user, pass) => auth.signInWithEmailAndPassword(email(user), pass).then(() => null, (e) => { throw new Error(errore(e)); });

  /* ---- sincronizzazione dei personaggi ---- */
  let annulla = null; const coda = new Map(); let timer = null; let inVolo = 0; let ultimoErrore = '';
  C.stato = () => ({ inCoda: coda.size + inVolo, errore: ultimoErrore });

  C.sottoscrivi = (cb) => {
    if (annulla) annulla();
    const u = C.utente; if (!u) return;
    const col = db.collection('personaggi');
    const q = u.ruolo === 'gestore' ? col : col.where('owner', '==', u.uid);
    annulla = q.onSnapshot((snap) => {
      const mod = [];
      snap.docChanges().forEach((ch) => {
        if (ch.doc.metadata.hasPendingWrites) return; // modifica nostra, non ancora confermata
        const d = ch.doc.data();
        if (ch.type === 'removed') { mod.push({ tipo: 'rimosso', id: ch.doc.id }); return; }
        try { const p = JSON.parse(d.dati); p.id = ch.doc.id; p.owner = d.owner; p.ownerNome = d.ownerNome || ''; mod.push({ tipo: 'dato', id: ch.doc.id, p }); } catch (e) { /* documento illeggibile: ignorato */ }
      });
      if (mod.length) cb(mod);
    }, (e) => { ultimoErrore = errore(e); cb([], ultimoErrore); });
  };

  const scrivi = () => {
    timer = null; const lotto = [...coda.values()]; coda.clear();
    lotto.forEach((op) => {
      inVolo++;
      const rif = db.collection('personaggi').doc(op.id);
      const prom = op.elimina ? rif.delete() : rif.set({ owner: op.p.owner, ownerNome: op.p.ownerNome || '', aggiornato: op.p.aggiornato || '', cestinato: !!op.p.cestinato, dati: JSON.stringify(op.p) });
      prom.then(() => { ultimoErrore = ''; }, (e) => { ultimoErrore = errore(e); }).then(() => { inVolo--; if (C.alSync) C.alSync(); });
    });
  };
  C.salva = (p) => { coda.set(p.id, { id: p.id, p: JSON.parse(JSON.stringify(p)) }); clearTimeout(timer); timer = setTimeout(scrivi, 1200); if (C.alSync) C.alSync(); };
  C.elimina = (id) => { coda.set(id, { id, elimina: true }); clearTimeout(timer); timer = setTimeout(scrivi, 300); if (C.alSync) C.alSync(); };
  C.svuotaCoda = () => new Promise((ok) => { if (timer) { clearTimeout(timer); scrivi(); } const t = setInterval(() => { if (!inVolo && !coda.size) { clearInterval(t); ok(); } }, 150); setTimeout(() => { clearInterval(t); ok(); }, 8000); });

  C.esci = async () => { await C.svuotaCoda(); if (annulla) { annulla(); annulla = null; } if (annullaUt) { annullaUt(); annullaUt = null; } await auth.signOut(); };

  /* ---- account (solo gestori) ---- */
  let annullaUt = null;
  C.sottoscriviUtenti = (cb) => {
    if (annullaUt) annullaUt();
    annullaUt = db.collection('utenti').onSnapshot((s) => cb(s.docs.map((d) => Object.assign({ uid: d.id }, d.data()))), (e) => cb([], errore(e)));
  };
  C.creaUtente = async ({ username, nome, ruolo, password }) => {
    const em = email(username);
    let sec;
    try {
      try { sec = fb.app('secondaria'); } catch (e) { sec = fb.initializeApp(cfg, 'secondaria'); }
      const cred = await sec.auth().createUserWithEmailAndPassword(em, password);
      const uid = cred.user.uid; await sec.auth().signOut();
      await db.collection('utenti').doc(uid).set({ username: usernameDa(em), nome: nome || usernameDa(em), ruolo: ruolo === 'gestore' ? 'gestore' : 'genitore', attivo: true, creato: new Date().toISOString(), creatoDa: C.utente.uid });
      return uid;
    } catch (e) { throw new Error(errore(e)); }
  };
  C.aggiornaUtente = (uid, campi) => db.collection('utenti').doc(uid).update(campi).catch((e) => { throw new Error(errore(e)); });
  C.eliminaUtente = (uid) => db.collection('utenti').doc(uid).delete().catch((e) => { throw new Error(errore(e)); });

  /* ---- il mio profilo ---- */
  C.cambiaPassword = async (vecchia, nuova) => {
    try {
      const u = auth.currentUser; const cred = fb.auth.EmailAuthProvider.credential(u.email, vecchia);
      await u.reauthenticateWithCredential(cred); await u.updatePassword(nuova);
    } catch (e) { throw new Error(errore(e)); }
  };
  C.inviaReset = (em) => auth.sendPasswordResetEmail(String(em || '').trim()).catch((e) => { throw new Error(errore(e)); });
})(window);
