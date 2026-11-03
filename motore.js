/* Generatore di PG D&D 5e – MOTORE DI CALCOLO
   Nessuna dipendenza dal DOM: si può provare anche da Node. */
(function (G) {
  const D = G.DND;
  const M = (D.M = {});

  M.mod = (s) => Math.floor((s - 10) / 2);
  M.fmt = (n) => (n >= 0 ? '+' : '') + n;
  M.pb = (tot) => Math.ceil(Math.max(1, tot) / 4) + 1;
  M.uid = () => 'pg_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /* ---------- personaggio vuoto ---------- */
  M.nuovo = function () {
    const ora = new Date().toISOString();
    return {
      id: M.uid(), v: 1, giocatore: { nome: '', cognome: '' }, nome: '', razza: 'umano', sub: '',
      scelteRazza: { bonusLiberi: [], drago: 'Rosso', abilita: [] }, sfondo: 'soldato', allineamento: 'Neutrale', lingue: [],
      metodo: 'array', tiri: [], punteggi: { for: 8, des: 8, cos: 8, int: 8, sag: 8, car: 8 }, variante: '',
      livelli: ['guerriero'], sottoclassi: {}, abilita: [], maestrie: [], stile: '', discipline: [], manovre: [], scelte: {}, asi: {},
      armatura: 'nessuna', scudo: false, armi: [], incantesimi: {}, equip: '', note: '', cestinato: false, creato: ora, aggiornato: ora,
    };
  };

  /* ---------- dadi ---------- */
  M.tira4d6 = function () {
    const d = [0, 0, 0, 0].map(() => 1 + Math.floor(Math.random() * 6)).sort((a, b) => a - b);
    return d[1] + d[2] + d[3];
  };
  M.tiraSet = () => [1, 2, 3, 4, 5, 6].map(M.tira4d6);

  /* ---------- struttura delle classi del PG ---------- */
  M.contaClassi = function (ch) {
    const out = [];
    ch.livelli.forEach((cid) => {
      let e = out.find((x) => x.id === cid);
      if (!e) { e = { id: cid, livello: 0, def: D.classe(cid) }; out.push(e); }
      e.livello++;
    });
    out.forEach((e) => {
      const sc = e.def.sottoclasse;
      e.sottoclasseAttiva = e.livello >= sc.livello;
      e.sub = sc.opzioni.find((o) => o.id === (ch.sottoclassi || {})[e.id]) || null;
      e.incantatore = e.def.incantatore || (e.sottoclasseAttiva && e.sub && e.sub.incantatore) || null;
      if (e.incantatore && e.incantatore.da && e.livello < e.incantatore.da) e.incantatore = null;
      if (e.incantatore && e.incantatore.tipo === 'terzo' && e.livello < 3) e.incantatore = null;
    });
    return out;
  };

  // livelli in cui si ha diritto a un Aumento di Punteggio / Talento
  M.slotAsi = function (ch) {
    const cnt = {}; const out = [];
    ch.livelli.forEach((cid, i) => {
      cnt[cid] = (cnt[cid] || 0) + 1;
      if (D.classe(cid).asi.includes(cnt[cid])) out.push({ liv: i + 1, classe: cid, livClasse: cnt[cid] });
    });
    return out;
  };

  M.bonusRazza = function (ch) {
    const r = D.razza(ch.razza); const out = {};
    if (!r) return out;
    const add = (b) => Object.keys(b || {}).forEach((k) => (out[k] = (out[k] || 0) + b[k]));
    add(r.bonus);
    const s = (r.sub || []).find((x) => x.id === ch.sub);
    if (s) add(s.bonus);
    if (r.bonusLiberi) (ch.scelteRazza.bonusLiberi || []).slice(0, r.bonusLiberi.n).forEach((a) => { out[a] = (out[a] || 0) + r.bonusLiberi.valore; });
    return out;
  };

  M.finali = function (ch) {
    const br = M.bonusRazza(ch); const fin = {};
    D.ABIL.forEach((a) => (fin[a] = (ch.punteggi[a] || 8) + (br[a] || 0)));
    Object.keys(ch.asi || {}).forEach((liv) => {
      if (+liv > ch.livelli.length) return;
      const e = ch.asi[liv];
      if (e.tipo === 'asi') {
        if (e.a) fin[e.a] += 1;
        if (e.b) fin[e.b] += 1; // se a === b vale +2
      } else if (e.tipo === 'talento' && e.bonus) fin[e.bonus] += 1;
    });
    D.ABIL.forEach((a) => (fin[a] = Math.min(20, fin[a])));
    if (ch.livelli.filter((c) => c === 'barbaro').length >= 20) { fin.for = Math.min(24, fin.for + 4); fin.cos = Math.min(24, fin.cos + 4); }
    return fin;
  };

  /* ---------- calcolo completo ---------- */
  const profArmi = (ch, classi, razza, sub, arma) => {
    const lista = [];
    classi.forEach((c) => lista.push(...c.def.armi));
    if (razza && razza.armi) lista.push(...razza.armi);
    if (sub && sub.armi) lista.push(...sub.armi);
    return lista.some((x) => x === arma.cat || x.toLowerCase() === arma.nome.toLowerCase());
  };
  const profArmature = (classi, razza, sub, tipo) => {
    if (!tipo) return true;
    const lista = [];
    classi.forEach((c) => lista.push(...c.def.armature));
    if (sub && sub.armature) lista.push(...sub.armature);
    return lista.includes(tipo);
  };

  M.derive = function (ch) {
    const razza = D.razza(ch.razza); const sub = razza && razza.sub ? razza.sub.find((s) => s.id === ch.sub) || null : null;
    const sfondo = D.sfondo(ch.sfondo);
    const classi = M.contaClassi(ch); const tot = ch.livelli.length; const pb = M.pb(tot);
    const fin = M.finali(ch); const mods = {}; D.ABIL.forEach((a) => (mods[a] = M.mod(fin[a])));
    const prima = classi[0];
    const r = { razza, sub, sfondo, classi, tot, pb, fin, mods };

    // Tiri salvezza
    const sal = new Set(prima ? prima.def.salvezze : []);
    classi.forEach((c) => {
      if (c.id === 'monaco' && c.livello >= 14) D.ABIL.forEach((a) => sal.add(a));
      if (c.id === 'ladro' && c.livello >= 15) sal.add('sag');
    });
    r.salvezze = D.ABIL.map((a) => ({ car: a, comp: sal.has(a), bonus: mods[a] + (sal.has(a) ? pb : 0) }));

    // Abilità
    const comp = new Set();
    if (sfondo) sfondo.abilita.forEach((x) => comp.add(x));
    if (razza && razza.abilita) razza.abilita.forEach((x) => comp.add(x));
    (ch.scelteRazza.abilita || []).forEach((x) => comp.add(x));
    (ch.abilita || []).forEach((x) => comp.add(x));
    const mae = new Set((ch.maestrie || []).filter((x) => comp.has(x)));
    const tuttofare = classi.some((c) => c.id === 'bardo' && c.livello >= 2);
    r.abilita = D.ABILITA.map((s) => {
      const c = comp.has(s.id); const m = mae.has(s.id);
      const b = mods[s.car] + (m ? 2 * pb : c ? pb : tuttofare ? Math.floor(pb / 2) : 0);
      return { id: s.id, nome: s.nome, car: s.car, comp: c, mae: m, bonus: b };
    });
    r.compAbilita = comp;
    r.percezionePassiva = 10 + r.abilita.find((s) => s.id === 'percezione').bonus;

    // Punti ferita
    let pf = 0; const dv = {};
    ch.livelli.forEach((cid, i) => {
      const c = D.classe(cid);
      dv[c.dado] = (dv[c.dado] || 0) + 1;
      const base = i === 0 ? c.dado : Math.floor(c.dado / 2) + 1;
      pf += Math.max(1, base + mods.cos);
    });
    let extra = (sub && sub.pfLivello ? sub.pfLivello : 0);
    classi.forEach((c) => { if (c.sottoclasseAttiva && c.sub && c.sub.pfLivello) extra += c.sub.pfLivello; });
    const robusti = Object.keys(ch.asi || {}).filter((l) => +l <= tot && ch.asi[l].tipo === 'talento' && ch.asi[l].talento === 'Robusto').length;
    extra += robusti * 2;
    r.pfExtraLivello = extra;
    r.pf = pf + extra * tot;
    r.dadiVita = Object.keys(dv).sort((a, b) => b - a).map((d) => dv[d] + 'd' + d).join(' + ');

    // Classe Armatura
    const armor = D.armatura(ch.armatura || 'nessuna') || D.ARMATURE[0];
    const scudo = !!ch.scudo; const avvisi = [];
    let ca;
    if (armor.id === 'nessuna') {
      const opz = [10 + mods.des];
      if (classi.some((c) => c.id === 'barbaro')) opz.push(10 + mods.des + mods.cos);
      if (classi.some((c) => c.id === 'monaco') && !scudo) opz.push(10 + mods.des + mods.sag);
      classi.forEach((c) => { if (c.sottoclasseAttiva && c.sub && c.sub.caBase) opz.push(c.sub.caBase.base + mods[c.sub.caBase.car]); });
      ca = Math.max(...opz);
    } else {
      ca = armor.base + (armor.max === 99 ? mods.des : Math.min(mods.des, armor.max));
      if (!profArmature(classi, razza, sub, armor.tipo)) avvisi.push('Non hai competenza con le armature ' + armor.tipo + ': svantaggio a prove di For/Des, attacchi e niente incantesimi.');
      if (armor.forza && fin.for < armor.forza) avvisi.push('Servirebbe Forza ' + armor.forza + ': velocità −3 m.');
      if (armor.svant) avvisi.push(armor.nome + ' impone svantaggio alle prove di Furtività.');
      if (ch.stile === 'difesa') ca += 1;
    }
    if (scudo) {
      ca += 2;
      if (!profArmature(classi, razza, sub, 'scudi')) avvisi.push('Non hai competenza con gli scudi.');
    }
    r.ca = ca; r.avvisiCA = avvisi; r.armatura = armor;

    // Velocità
    let vel = (sub && sub.velocita) || (razza ? razza.velocita : 9);
    const mon = classi.find((c) => c.id === 'monaco');
    if (mon && armor.id === 'nessuna' && !scudo) vel += mon.livello >= 18 ? 9 : mon.livello >= 14 ? 7.5 : mon.livello >= 10 ? 6 : mon.livello >= 6 ? 4.5 : mon.livello >= 2 ? 3 : 0;
    const bar = classi.find((c) => c.id === 'barbaro');
    if (bar && bar.livello >= 5 && armor.tipo !== 'pesanti') vel += 3;
    r.velocita = vel;
    r.iniziativa = mods.des;

    // Attacchi per azione
    let att = 1;
    classi.forEach((c) => {
      if (['barbaro', 'monaco', 'paladino', 'ranger'].includes(c.id) && c.livello >= 5) att = Math.max(att, 2);
      if (c.id === 'guerriero') att = Math.max(att, c.livello >= 20 ? 4 : c.livello >= 11 ? 3 : c.livello >= 5 ? 2 : 1);
    });
    r.attacchiPerAzione = att;

    // Armi
    const monaco = classi.find((c) => c.id === 'monaco');
    const dadoMonaco = monaco ? (monaco.livello >= 17 ? '1d10' : monaco.livello >= 11 ? '1d8' : monaco.livello >= 5 ? '1d6' : '1d4') : null;
    r.attacchi = (ch.armi || []).map((id) => D.arma(id)).filter(Boolean).map((w) => {
      let car;
      const accurata = w.prop.includes('accurata');
      if (w.tipo === 'distanza') car = 'des';
      else if (accurata || (monaco && (w.cat === 'semplice' || w.id === 'spada corta'))) car = mods.des > mods.for ? 'des' : 'for';
      else car = 'for';
      const prof = profArmi(ch, classi, razza, sub, w);
      let bonusAtt = mods[car] + (prof ? pb : 0) + (ch.stile === 'arcieria' && w.tipo === 'distanza' ? 2 : 0);
      let dado = w.dado; let flat = mods[car];
      if (w.id === 'pugno') { dado = dadoMonaco || '1'; }
      if (ch.stile === 'duellare' && w.tipo === 'mischia' && !w.prop.includes('a due mani') && !w.prop.includes('pesante')) flat += 2;
      const dmg = dado === '1' ? String(Math.max(1, 1 + flat)) : dado + (flat ? M.fmt(flat) : '');
      return { id: w.id, nome: w.nome, bonus: bonusAtt, danno: dmg + ' ' + w.dtipo, prop: w.prop.join(', '), prof };
    });

    // Incantesimi
    r.incantesimi = M.calcolaIncantesimi(ch, classi, mods, pb);
    r.incRazza = M.incantesimiRazza(ch, razza, sub, mods, pb, tot);

    // Risorse e privilegi
    r.risorse = M.risorse(classi, mods, pb);
    r.privilegi = [];
    classi.forEach((c) => {
      c.def.tratti.filter((t) => t[0] <= c.livello).forEach((t) => r.privilegi.push({ fonte: c.def.nome + ' ' + t[0], nome: t[1], desc: t[2] }));
      if (c.sottoclasseAttiva && c.sub) {
        r.privilegi.push({ nascosto: true, fonte: c.def.nome, nome: c.def.sottoclasse.titolo + ': ' + c.sub.nome, desc: (c.sub.tratti || []).filter((t) => t[0] <= c.livello).map((t) => t[1]).join(', ') });
        (c.sub.tratti || []).filter((t) => t[0] <= c.livello).forEach((t) => r.privilegi.push({ fonte: c.sub.nome + ' ' + t[0], nome: t[1], desc: t[2] }));
        if (c.id === 'guerriero' && c.sub.id === 'maestro') (ch.manovre || []).slice(0, D.manovreMax(c.livello)).map((id) => D.MANOVRE.find((x) => x[0] === id)).filter(Boolean).forEach((x) => r.privilegi.push({ fonte: 'Manovra', nome: 'Manovra: ' + x[1], desc: x[2] }));
        if (c.id === 'monaco' && c.sub.id === 'elementi') (ch.discipline || []).slice(0, D.discMonacoMax(c.livello)).map((id) => D.DISC_MONACO.find((x) => x[0] === id)).filter((x) => x && x[2] <= c.livello).forEach((x) => r.privilegi.push({ fonte: 'Disciplina', nome: 'Disciplina: ' + x[1] + ' (' + x[3] + ' ki)', desc: x[4] }));
      }
    });
    classi.forEach((c) => D.scelteDi(c).forEach((g) => M.sceltiValidi(ch, c, g).forEach((o) => {
      let desc = o.desc;
      if (g.id === 'terreno') { const sp = (D.INC_SUB['terreno/' + o.id] || []).map((l) => l.map((id) => (D.incantesimo(id) || {}).nome).join(' e ')); desc = 'Incantesimi del circolo sempre preparati: ' + sp.join('; ') + '.'; }
      r.privilegi.push({ fonte: g.nome, nome: g.nome + ': ' + o.nome, desc });
    })));
    r.incSub = M.incantesimiSub(ch, classi);
    if (ch.stile) { const s = D.STILI.find((x) => x[0] === ch.stile); if (s) r.privilegi.push({ fonte: 'Stile', nome: 'Stile di Combattimento: ' + s[1], desc: s[2] }); }
    r.tratti = [];
    if (razza) { razza.tratti.forEach((t) => r.tratti.push({ nome: t[0], desc: t[1] })); }
    if (sub) sub.tratti.forEach((t) => r.tratti.push({ nome: t[0], desc: t[1] }));
    if (razza && razza.drago) {
      const d = D.DRAGHI.find((x) => x[0] === ch.scelteRazza.drago) || D.DRAGHI[7];
      r.tratti.push({ nome: 'Discendenza: drago ' + d[0], desc: 'Soffio e resistenza: ' + d[1] + '. CD soffio = ' + (8 + mods.cos + pb) + '.' });
    }
    r.talenti = Object.keys(ch.asi || {}).filter((l) => +l <= tot && ch.asi[l].tipo === 'talento' && ch.asi[l].talento).map((l) => ({ liv: +l, nome: ch.asi[l].talento }));

    // Lingue e competenze (testo)
    // voci già gestite altrove (abilità, competenze, velocità, incantesimi, lingue): non servono nel riquadro "Privilegi e tratti"
    const RIDONDANTI = /^(Sensi Acuti|Minaccioso|Versatilità|Versatilità nelle Abilità|Piede Lesto|Lingua Extra|Trucchetto|Competenza negli Strumenti|Retaggio Infernale|Magia Drow|Illusionista Nato|Druidico|Gergo Ladresco|Addestramento (con le Armi|da Combattimento|con le Armature))/;
    r.tratti.forEach((t) => { if (RIDONDANTI.test(t.nome)) t.nascosto = true; });
    r.privilegi.forEach((p) => { if (/^(Druidico|Gergo Ladresco|Incantesimi del Circolo|Lista Ampliata degli Incantesimi)$/.test(p.nome)) p.nascosto = true; });
    const lingue = [];
    let slot = 0;
    const agg = (arr) => (arr || []).forEach((x) => { if (/a scelta/i.test(x)) slot++; else lingue.push(x); });
    agg(razza && razza.lingue); agg(sub && sub.lingue);
    if (sfondo && sfondo.altro) { const mm = sfondo.altro.match(/(\d+|un[ao]?|due)\s+lingu/i); if (mm) slot += /^\d+$/.test(mm[1]) ? +mm[1] : /^due$/i.test(mm[1]) ? 2 : 1; }
    if (classi.some((c) => c.id === 'druido')) lingue.push('Druidico');
    if (classi.some((c) => c.id === 'ladro')) lingue.push('Gergo ladresco');
    const sc = (ch.lingue || []).slice(0, slot);
    for (let i = 0; i < slot; i++) if (sc[i] && !lingue.includes(sc[i])) lingue.push(sc[i]);
    r.lingue = lingue; r.lingueSlot = slot; r.lingueFisse = lingue.filter((x) => !(ch.lingue || []).slice(0, slot).includes(x));
    const armiC = new Set(); const armatC = new Set();
    classi.forEach((c) => { c.def.armi.forEach((x) => armiC.add(x === 'semplice' ? 'Armi semplici' : x === 'da guerra' ? 'Armi da guerra' : x)); c.def.armature.forEach((x) => armatC.add(x === 'scudi' ? 'Scudi' : 'Armature ' + x)); });
    if (razza && razza.armi) razza.armi.forEach((x) => armiC.add(x));
    if (sub && sub.armi) sub.armi.forEach((x) => armiC.add(x));
    if (sub && sub.armature) sub.armature.forEach((x) => armatC.add('Armature ' + x));
    r.competenze = { armi: [...armiC], armature: [...armatC], altro: [(sfondo ? sfondo.altro : '').replace(/,?\s*(\d+|un[ao]?|due)\s+lingu\w*( a scelta)?/i, '').replace(/^\s*,\s*/, '').trim(), razza && razza.id === 'nano' ? 'Uno strumento da artigiano a scelta (fabbro, birraio o scalpellino)' : ''].filter(Boolean).join('; ') || '—' };

    return r;
  };

  /* ---------- incantesimi ---------- */
  // incantesimi concessi dalla razza (Tiefling, Drow, Alto Elfo, Gnomo delle Foreste)
  M.incantesimiRazza = function (ch, razza, sub, mods, pb, tot) {
    const def = (sub && sub.incRazza) || (razza && razza.incRazza); if (!def) return null;
    const car = def.car; const out = { car, cd: 8 + pb + mods[car], att: pb + mods[car], voci: [], scelta: null };
    def.lista.forEach((x) => { const sp = D.incantesimo(x.id); if (sp) out.voci.push({ id: x.id, nome: sp.nome, liv: x.liv, spLiv: sp.liv, uso: x.uso || 0, slot: x.slot || sp.liv, disp: tot >= x.liv }); });
    if (def.scelta) {
      const idc = (ch.scelteRazza || {}).trucchetto; const sp = idc && D.incantesimo(idc);
      out.scelta = { cl: def.scelta.cl, liv: def.scelta.liv, id: sp ? idc : '' };
      if (sp) out.voci.push({ id: idc, nome: sp.nome, liv: def.scelta.liv, spLiv: 0, uso: 0, slot: 0, disp: tot >= def.scelta.liv });
    }
    return out;
  };
  /* opzioni scelte (valide per livello e patto) di un gruppo di scelte guidate, nel numero consentito */
  M.sceltiValidi = function (ch, k, g) {
    const sel = ((ch.scelte || {})[g.id]) || [];
    const ok = D.opzioniScelta(g, k, ch).filter((o) => o.ok);
    return sel.map((id) => ok.find((o) => o.id === id)).filter(Boolean).slice(0, g.n(k.livello));
  };
  /* elimina le scelte guidate non più valide (cambio di patto, sottoclasse o classe) */
  M.potaScelte = function (ch) {
    ch.scelte = ch.scelte || {};
    const attivi = new Set();
    M.contaClassi(ch).forEach((k) => D.scelteDi(k).forEach((g) => { attivi.add(g.id); ch.scelte[g.id] = M.sceltiValidi(ch, k, g).map((o) => o.id); }));
    Object.keys(ch.scelte).forEach((id) => { if (!attivi.has(id)) delete ch.scelte[id]; });
  };
  /* incantesimi sempre preparati di dominio, giuramento e circolo (Terra) */
  M.incantesimiSub = function (ch, classi) {
    const voci = [];
    classi.forEach((c) => {
      if (!c.sottoclasseAttiva || !c.sub) return;
      let chiave = c.id + '/' + c.sub.id; let fonte = c.sub.nome;
      if (c.id === 'druido') { const t = ((ch.scelte || {}).terreno || [])[0]; if (c.sub.id !== 'terra' || !t) return; chiave = 'terreno/' + t; fonte = 'Circolo della Terra (' + (D.TERRENI.find((x) => x[0] === t) || [0, t])[1] + ')'; }
      const tab = D.INC_SUB[chiave]; const livs = D.INC_SUB_LIV[c.id]; if (!tab || !livs) return;
      tab.forEach((par, i) => par.forEach((id) => { const sp = D.incantesimo(id); if (sp) voci.push({ id, nome: sp.nome, spLiv: sp.liv, fonte, liv: livs[i], classe: c.def.nome, disp: c.livello >= livs[i] }); }));
    });
    return voci.length ? { voci } : null;
  };
  M.calcolaIncantesimi = function (ch, classi, mods, pb) {
    const lista = []; let contrib = 0; let nCasters = 0; let unico = null;
    classi.forEach((c) => {
      const inc = c.incantatore; if (!inc) return;
      const L = c.livello; const m = mods[inc.car];
      const info = { id: c.id, classe: c.def.nome, car: inc.car, cd: 8 + pb + m, att: pb + m, tipo: inc.tipo };
      info.lista = inc.tipo === 'terzo' ? 'mago' : c.id; // lista incantesimi da cui si sceglie
      info.consigli = inc.tipo === 'terzo' ? 'terzo' : c.id;
      info.livMax = inc.tipo === 'completo' ? Math.min(9, Math.ceil(L / 2))
        : inc.tipo === 'meta' ? Math.min(5, Math.floor((L + 3) / 4))
          : inc.tipo === 'terzo' ? (L < 7 ? 1 : L < 13 ? 2 : L < 19 ? 3 : 4)
            : D.SLOT_PATTO[L - 1][1];
      info.livClasse = L;
      if (c.id === 'warlock' && c.sub && D.INC_SUB['warlock/' + c.sub.id]) info.extra = [].concat(...D.INC_SUB['warlock/' + c.sub.id].slice(0, info.livMax));
      if (c.id === 'ladro' && c.sub && c.sub.id === 'mistificatore') { info.fissi = ['mano-magica']; info.scuole = ['Ammaliamento', 'Illusione']; }
      if (c.id === 'guerriero' && c.sub && c.sub.id === 'cavaliere') { info.scuole = ['Abiurazione', 'Invocazione']; }
      if (info.scuole) info.liberi = 1 + (L >= 8) + (L >= 14) + (L >= 20);
      if (inc.trucchetti) info.trucchetti = (D.TRUCCHETTI[inc.trucchetti] || [])[L - 1] || 0;
      if (inc.conosciuti) info.conosciuti = (D.CONOSCIUTI[inc.conosciuti] || [])[L - 1] || 0;
      if (info.fissi) {
        ch.inc = ch.inc || {}; const se = (ch.inc[c.id] = ch.inc[c.id] || { truc: [], conos: [], libro: [], prep: [] });
        info.fissi.forEach((id) => { if (!se.truc.includes(id)) se.truc.unshift(id); });
        if (info.trucchetti != null && se.truc.length > info.trucchetti) se.truc = se.truc.slice(0, info.trucchetti);
      }
      if (inc.preparati) info.preparati = Math.max(1, m + (inc.tipo === 'meta' ? Math.floor(L / 2) : L));
      if (inc.libro) info.libro = 6 + 2 * (L - 1);
      lista.push(info);
      if (inc.tipo === 'completo') { contrib += L; nCasters++; unico = ['completo', L]; }
      else if (inc.tipo === 'meta') { contrib += Math.floor(L / 2); nCasters++; unico = ['meta', L]; }
      else if (inc.tipo === 'terzo') { contrib += Math.floor(L / 3); nCasters++; unico = ['terzo', L]; }
      else if (inc.tipo === 'patto') { info.patto = D.SLOT_PATTO[L - 1]; }
    });
    let slot = [];
    if (nCasters === 1) {
      const [t, L] = unico;
      const lv = t === 'completo' ? L : t === 'meta' ? Math.ceil(L / 2) : Math.ceil(L / 3);
      slot = lv > 0 ? D.SLOT_COMPLETO[lv - 1].slice() : [];
    } else if (nCasters > 1) {
      slot = contrib > 0 ? D.SLOT_COMPLETO[Math.min(20, contrib) - 1].slice() : [];
    }
    return { classi: lista, slot, multiclasse: nCasters > 1 };
  };

  /* ---------- risorse di classe ---------- */
  M.risorse = function (classi, mods, pb) {
    const out = [];
    classi.forEach((c) => {
      const L = c.livello; const n = c.def.nome;
      switch (c.id) {
        case 'barbaro': out.push([n + ' – Ira', (L >= 20 ? 'illimitate' : L >= 17 ? 6 : L >= 12 ? 5 : L >= 6 ? 4 : L >= 3 ? 3 : 2) + ' usi/riposo lungo, danni in Ira ' + (L >= 16 ? '+4' : L >= 9 ? '+3' : '+2')]); break;
        case 'bardo': out.push([n + ' – Ispirazione Bardica', Math.max(1, mods.car) + ' usi, ' + (L >= 15 ? 'd12' : L >= 10 ? 'd10' : L >= 5 ? 'd8' : 'd6') + (L >= 5 ? ' (riposo breve)' : ' (riposo lungo)')]); break;
        case 'chierico': if (L >= 2) out.push([n + ' – Incanalare Divinità', (L >= 18 ? 3 : L >= 6 ? 2 : 1) + ' uso/i per riposo breve']); if (L >= 5) out.push([n + ' – Distruggere Non Morti', 'GS ' + (L >= 17 ? 4 : L >= 14 ? 3 : L >= 11 ? 2 : L >= 8 ? 1 : '1/2')]); break;
        case 'druido': if (L >= 2) out.push([n + ' – Forma Selvatica', '2 usi/riposo breve, GS max ' + (L >= 8 ? '1 (con volo)' : L >= 4 ? '1/2 (no volo)' : '1/4 (no volo né nuoto)')]); break;
        case 'guerriero':
          out.push([n + ' – Recuperare Energie', '1d10 + ' + L + ' PF (1/riposo breve)']);
          if (L >= 2) out.push([n + ' – Azione Impetuosa', (L >= 17 ? 2 : 1) + ' uso/i per riposo breve']);
          if (L >= 9) out.push([n + ' – Indomito', (L >= 17 ? 3 : L >= 13 ? 2 : 1) + ' uso/i per riposo lungo']);
          break;
        case 'ladro': out.push([n + ' – Attacco Furtivo', Math.ceil(L / 2) + 'd6']); break;
        case 'mago': out.push([n + ' – Recupero Arcano', 'slot recuperati fino a livello totale ' + Math.ceil(L / 2) + ' (1/giorno)']); break;
        case 'monaco':
          out.push([n + ' – Arti Marziali', 'dado ' + (L >= 17 ? 'd10' : L >= 11 ? 'd8' : L >= 5 ? 'd6' : 'd4')]);
          if (L >= 2) out.push([n + ' – Ki', L + ' punti, CD ' + (8 + pb + mods.sag) + ' (riposo breve)']);
          break;
        case 'paladino':
          out.push([n + ' – Imposizione delle Mani', 5 * L + ' PF di riserva (riposo lungo)']);
          if (L >= 3) out.push([n + ' – Incanalare Divinità', '1 uso/riposo breve']);
          if (L >= 6) out.push([n + ' – Aura di Protezione', '+' + Math.max(1, mods.car) + ' ai TS, raggio ' + (L >= 18 ? '9 m' : '3 m')]);
          break;
        case 'ranger': out.push([n + ' – Nemici/Terreni prescelti', (L >= 14 ? 3 : L >= 6 ? 2 : 1) + ' nemici, ' + (L >= 10 ? 3 : L >= 6 ? 2 : 1) + ' terreni']); break;
        case 'stregone': if (L >= 2) out.push([n + ' – Fonte di Magia', L + ' punti stregoneria']); if (L >= 3) out.push([n + ' – Metamagia', (L >= 17 ? 4 : L >= 10 ? 3 : 2) + ' opzioni']); break;
        case 'warlock': if (L >= 2) out.push([n + ' – Suppliche Occulte', D.INVOCAZIONI[L - 1] + ' conosciute']); break;
      }
    });
    return out;
  };

  /* ---------- CONSIGLI: distribuzione dei punteggi ---------- */
  M.prioritaPG = function (ch) {
    const c = D.classe(ch.livelli[0]);
    if (c.prioritaAlt && ch.variante === 'alt') return c.prioritaAlt.lista;
    return c.priorita;
  };

  // bonus liberi consigliati (es. Mezzelfo): i due punteggi più utili per la classe
  M.consigliaBonusLiberi = function (ch) {
    const r = D.razza(ch.razza); if (!r || !r.bonusLiberi) return [];
    return M.prioritaPG(ch).filter((a) => !r.bonusLiberi.escludi.includes(a)).slice(0, r.bonusLiberi.n);
  };

  const COSTO = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
  M.COSTO = COSTO;
  const PESI = [10, 7, 5, 3, 2, 1];
  const TESTI = [
    'Caratteristica principale: la usi per attaccare, lanciare incantesimi o per le abilità chiave.',
    'Seconda per importanza: sostiene CA, PF o i tiri salvezza più comuni.',
    'Terza: ti tiene in vita senza rubare punti alle principali.',
    'Intermedia: serve per qualche abilità o salvezza.',
    'Bassa: raramente decisiva per questa classe.',
    'La meno utile per questa classe: qui conviene mettere il valore più basso.',
  ];

  M.consigliaPunteggi = function (ch, metodo) {
    metodo = metodo || ch.metodo;
    const prio = M.prioritaPG(ch);
    const br = M.bonusRazza(ch);
    // se la scelta libera non è ancora fatta, simula quella consigliata
    const r = D.razza(ch.razza);
    if (r && r.bonusLiberi && (ch.scelteRazza.bonusLiberi || []).length < r.bonusLiberi.n) {
      M.consigliaBonusLiberi(ch).forEach((a) => (br[a] = (br[a] || 0) + r.bonusLiberi.valore));
    }
    const valuta = (vals) => { // vals indicizzati come prio
      let s = 0;
      prio.forEach((a, i) => { const f = vals[i] + (br[a] || 0); s += PESI[i] * (2 * M.mod(f) + f * 0.01); });
      return s;
    };
    let migliore = null; let best = -1e9;
    if (metodo === 'punti') {
      const rec = (i, budget, cur) => {
        if (i === 6) { const s = valuta(cur); if (s > best) { best = s; migliore = cur.slice(); } return; }
        for (let v = 8; v <= 15; v++) {
          if (COSTO[v] > budget) break;
          cur[i] = v; rec(i + 1, budget - COSTO[v], cur);
        }
      };
      rec(0, 27, []);
    } else {
      const base = metodo === 'tiri' && ch.tiri.length === 6 ? ch.tiri.slice() : [15, 14, 13, 12, 10, 8];
      const perm = (arr, cur, usati) => {
        if (cur.length === 6) { const s = valuta(cur); if (s > best) { best = s; migliore = cur.slice(); } return; }
        const visti = new Set();
        for (let i = 0; i < 6; i++) {
          if (usati[i] || visti.has(base[i])) continue;
          visti.add(base[i]); usati[i] = true; cur.push(base[i]);
          perm(arr, cur, usati);
          cur.pop(); usati[i] = false;
        }
      };
      perm(base, [], []);
    }
    const punteggi = {}; const motivi = {};
    prio.forEach((a, i) => {
      punteggi[a] = migliore[i];
      const f = migliore[i] + (br[a] || 0);
      let t = TESTI[i];
      if (br[a]) t += ' Con il bonus razziale ' + M.fmt(br[a]) + ' arriva a ' + f + ' (mod. ' + M.fmt(M.mod(f)) + ').';
      else t += ' Modificatore finale ' + M.fmt(M.mod(f)) + '.';
      motivi[a] = t;
    });
    return { punteggi, motivi, ordine: prio, bonus: br };
  };

  // Consiglio per un Aumento di Punteggio
  M.consigliaAsi = function (fin, prio) {
    const aperti = prio.filter((a) => fin[a] < 20);
    const dispari = aperti.slice(0, 4).filter((a) => fin[a] % 2 === 1);
    if (dispari.length >= 2) return { a: dispari[0], b: dispari[1], perche: 'Due punteggi dispari importanti: +1 a ciascuno porta entrambi a un modificatore più alto.' };
    if (dispari.length === 1) {
      const altro = aperti.find((a) => a !== dispari[0] && fin[a] % 2 === 0);
      return { a: dispari[0], b: altro || dispari[0], perche: 'Il punteggio dispari sale subito di modificatore; l\'altro +1 prepara il prossimo salto.' };
    }
    if (aperti.length) return { a: aperti[0], b: aperti[0], perche: 'Il punteggio principale è pari: +2 vale un intero punto di modificatore.' };
    return { a: null, b: null, perche: 'Tutte le caratteristiche importanti sono già a 20: valuta un talento.' };
  };

  const PREF_ABILITA = {
    barbaro: ['atletica', 'percezione', 'sopravvivenza', 'intimidire', 'natura', 'addestrare'],
    bardo: ['persuasione', 'intrattenere', 'inganno', 'percezione', 'intuizione', 'acrobazia', 'furtivita', 'arcano'],
    chierico: ['intuizione', 'persuasione', 'religione', 'medicina', 'storia'],
    druido: ['percezione', 'natura', 'sopravvivenza', 'medicina', 'intuizione', 'arcano'],
    guerriero: ['percezione', 'atletica', 'intimidire', 'acrobazia', 'sopravvivenza', 'intuizione'],
    ladro: ['furtivita', 'percezione', 'rapidita', 'acrobazia', 'inganno', 'intuizione', 'indagare', 'persuasione'],
    mago: ['arcano', 'indagare', 'intuizione', 'storia', 'medicina'],
    monaco: ['acrobazia', 'furtivita', 'atletica', 'intuizione', 'storia'],
    paladino: ['persuasione', 'atletica', 'intuizione', 'intimidire', 'religione'],
    ranger: ['furtivita', 'percezione', 'sopravvivenza', 'natura', 'indagare', 'atletica'],
    stregone: ['persuasione', 'inganno', 'intuizione', 'arcano', 'intimidire'],
    warlock: ['arcano', 'inganno', 'intimidire', 'indagare', 'storia'],
  };

  M.abilitaOpzioni = function (ch) {
    const c = D.classe(ch.livelli[0]);
    return c.abilitaOpz === 'tutte' ? D.ABILITA.map((s) => s.id) : c.abilitaOpz;
  };

  M.abilitaGia = function (ch) { // abilità già date da razza/background
    const s = new Set(); const r = D.razza(ch.razza); const b = D.sfondo(ch.sfondo);
    if (r && r.abilita) r.abilita.forEach((x) => s.add(x));
    if (b) b.abilita.forEach((x) => s.add(x));
    (ch.scelteRazza.abilita || []).forEach((x) => s.add(x));
    return s;
  };

  M.consigliaAbilita = function (ch) {
    const c = D.classe(ch.livelli[0]); const gia = M.abilitaGia(ch); const opz = M.abilitaOpzioni(ch);
    const pref = (PREF_ABILITA[c.id] || []).filter((x) => opz.includes(x) && !gia.has(x));
    const resto = opz.filter((x) => !gia.has(x) && !pref.includes(x));
    return pref.concat(resto).slice(0, c.nAbilita);
  };

  M.maestrieDovute = function (ch) {
    let n = 0; const cnt = {};
    ch.livelli.forEach((cid) => { cnt[cid] = (cnt[cid] || 0) + 1; const m = D.classe(cid).maestria; if (m && m[cnt[cid]]) n += m[cnt[cid]]; });
    return n;
  };

  D.EQUIP = {
    barbaro: { armatura: 'nessuna', scudo: false, armi: ['ascia bipenne', 'giavellotto', 'ascia'] },
    bardo: { armatura: 'cuoio', scudo: false, armi: ['stocco', 'pugnale'] },
    chierico: { armatura: 'scaglie', scudo: true, armi: ['mazza', 'balestra leggera'] },
    druido: { armatura: 'cuoio', scudo: false, armi: ['scimitarra', 'bastone'] },
    guerriero: { armatura: 'maglia', scudo: true, armi: ['spada lunga', 'balestra leggera', 'ascia'] },
    ladro: { armatura: 'cuoio', scudo: false, armi: ['stocco', 'arco corto', 'pugnale'] },
    mago: { armatura: 'nessuna', scudo: false, armi: ['bastone', 'pugnale'] },
    monaco: { armatura: 'nessuna', scudo: false, armi: ['pugno', 'spada corta', 'dardo'] },
    paladino: { armatura: 'maglia', scudo: true, armi: ['spada lunga', 'giavellotto'] },
    ranger: { armatura: 'scaglie', scudo: false, armi: ['spada corta', 'arco lungo'] },
    stregone: { armatura: 'nessuna', scudo: false, armi: ['balestra leggera', 'pugnale'] },
    warlock: { armatura: 'cuoio', scudo: false, armi: ['balestra leggera', 'pugnale'] },
  };

  /* ---------- controllo di completezza ---------- */
  M.valida = function (ch) {
    const out = []; const c = D.classe(ch.livelli[0]); const tot = ch.livelli.length;
    const pun = D.ABIL.map((a) => ch.punteggi[a]);
    out.push({ ok: !!ch.nome.trim(), t: 'Nome del personaggio' });
    out.push({ ok: !!(ch.giocatore.nome.trim() || ch.giocatore.cognome.trim()), t: 'Nome e cognome del giocatore' });
    if (ch.metodo === 'array') out.push({ ok: [...pun].sort((a, b) => b - a).join() === '15,14,13,12,10,8', t: 'Array standard: ogni valore (15,14,13,12,10,8) usato una volta' });
    if (ch.metodo === 'punti') { const sp = pun.reduce((s, v) => s + (COSTO[v] == null ? 99 : COSTO[v]), 0); out.push({ ok: sp <= 27, t: 'Acquisto a punti: ' + sp + '/27 spesi' }); }
    if (ch.metodo === 'tiri') out.push({ ok: ch.tiri.length === 6 && [...pun].sort().join() === [...ch.tiri].sort().join(), t: 'Tiri: assegna tutti e sei i valori ottenuti' });
    const r = D.razza(ch.razza);
    if (r && r.sub && !ch.sub) out.push({ ok: false, t: 'Scegli la sottorazza' });
    if (r && r.bonusLiberi) out.push({ ok: (ch.scelteRazza.bonusLiberi || []).length === r.bonusLiberi.n, t: 'Scegli i ' + r.bonusLiberi.n + ' bonus razziali liberi' });
    if (r && r.abilitaLibere) out.push({ ok: (ch.scelteRazza.abilita || []).length === r.abilitaLibere, t: 'Scegli le ' + r.abilitaLibere + ' abilità razziali' });
    out.push({ ok: (ch.abilita || []).length === c.nAbilita, t: 'Abilità di classe: ' + (ch.abilita || []).length + '/' + c.nAbilita });
    const md = M.maestrieDovute(ch);
    if (md) out.push({ ok: (ch.maestrie || []).length === md, t: 'Maestrie: ' + (ch.maestrie || []).length + '/' + md });
    M.contaClassi(ch).forEach((k) => {
      if (k.sottoclasseAttiva && !k.sub) out.push({ ok: false, t: k.def.nome + ': scegli ' + k.def.sottoclasse.titolo });
    });
    M.contaClassi(ch).forEach((k) => { if (k.id === 'monaco' && k.sottoclasseAttiva && k.sub && k.sub.id === 'elementi') { const n = D.discMonacoMax(k.livello); const g = (ch.discipline || []).filter((id) => { const x = D.DISC_MONACO.find((y) => y[0] === id); return x && x[2] <= k.livello; }).length; out.push({ ok: g >= n, t: 'Discipline elementali: ' + g + '/' + n }); } });
    M.contaClassi(ch).forEach((k) => { if (k.id === 'guerriero' && k.sottoclasseAttiva && k.sub && k.sub.id === 'maestro') { const n = D.manovreMax(k.livello); const g = (ch.manovre || []).length; out.push({ ok: g >= n, t: 'Manovre: ' + Math.min(g, n) + '/' + n }); } });
    M.contaClassi(ch).forEach((k) => D.scelteDi(k).forEach((g) => {
      const n = g.n(k.livello); const v = M.sceltiValidi(ch, k, g).length;
      out.push({ ok: v >= n, t: g.nome + ': ' + v + '/' + n });
    }));
    M.derive(ch).incantesimi.classi.filter((k) => k.scuole).forEach((k) => {
      const conos = ((ch.inc || {})[k.id] || {}).conos || [];
      const fuori = conos.filter((id) => { const sp = D.incantesimo(id); return sp && !k.scuole.includes(sp.scuola); }).length;
      out.push({ ok: fuori <= k.liberi, t: k.classe + ': incantesimi di scuola libera ' + fuori + '/' + k.liberi + ' (gli altri devono essere di ' + k.scuole.join(' o ').toLowerCase() + ')' });
    });
    const stileClasse = M.contaClassi(ch).find((k) => k.def.stile && k.livello >= (k.def.stileDa || 1));
    if (stileClasse) out.push({ ok: !!ch.stile, t: 'Stile di Combattimento' });
    M.slotAsi(ch).forEach((s) => {
      const e = ch.asi[s.liv];
      const ok = e && ((e.tipo === 'asi' && e.a && e.b) || (e.tipo === 'talento' && e.talento));
      out.push({ ok: !!ok, t: 'Livello ' + s.liv + ': Aumento di Punteggio o Talento' });
    });
    return out;
  };

  /* ---------- salita di livello ---------- */
  M.aggiungiLivello = function (ch, classeId) { ch.livelli.push(classeId); ch.aggiornato = new Date().toISOString(); };
  M.togliLivello = function (ch) {
    if (ch.livelli.length <= 1) return;
    const liv = ch.livelli.length; ch.livelli.pop(); delete ch.asi[liv];
    const usate = new Set(ch.livelli);
    Object.keys(ch.sottoclassi).forEach((k) => { if (!usate.has(k)) delete ch.sottoclassi[k]; });
    ch.aggiornato = new Date().toISOString();
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
