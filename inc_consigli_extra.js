/* Consigli aggiuntivi dagli altri manuali: usati da "Scegli per me" solo se il manuale è spuntato. */
(function (G) {
  const D = (G.DND = G.DND || {});
  const mago = { truc: ['scheggia-della-mente', 'lama-tonante', 'rombo-di-tuono'], liv: ['assorbire-elementi', 'miscela-caustica-di-tasha', 'coltello-di-ghiaccio', 'vampa-di-aganazzar', 'scudiscio-mentale-di-tasha', 'aculeo-mentale', 'sonnellino', 'fortezza-della-mente', 'minuscole-meteore-di-melf', 'evoca-aberrazione', 'sfera-acquea', 'scossa-sinaptica', 'prigione-mentale'] };
  D.CONSIGLI_EXTRA = {
    bardo: { truc: ['rombo-di-tuono'], liv: ['sonnellino', 'vento-di-interdizione', 'fortezza-della-mente', 'nemici-in-abbondanza', 'abilita-potenziata', 'scossa-sinaptica'] },
    mago, terzo: mago,
    stregone: { truc: ['lama-verdefiamma', 'scheggia-della-mente', 'morsa-del-gelo'], liv: ['assorbire-elementi', 'coltello-di-ghiaccio', 'catapulta', 'vampa-di-aganazzar', 'scudiscio-mentale-di-tasha', 'soffio-del-drago', 'fortezza-della-mente', 'sonnellino', 'sfera-acquea', 'scossa-sinaptica'] },
    warlock: { truc: ['lama-tonante', 'scheggia-della-mente', 'pietra-magica'], liv: ['incuti-paura', 'lama-dombra', 'aculeo-mentale', 'fortezza-della-mente', 'evoca-folletto-spirito-fatato', 'evoca-non-morto', 'sudario-spirituale', 'ombra-di-moil', 'flusso-di-energia-negativa'] },
    druido: { truc: ['pietra-magica', 'morsa-del-gelo', 'ferocia-primordiale'], liv: ['assorbire-elementi', 'legame-con-le-bestie', 'spirito-guaritore', 'evoca-bestia', 'evoca-folletto-spirito-fatato', 'onda-di-marea', 'eruzione-terrestre', 'guardiano-della-natura', 'evoca-elementale-spirito-elementale', 'collera-della-natura'] },
    chierico: { truc: ['parola-radiosa'], liv: ['cerimonia', 'trasferimento-di-vita', 'sudario-spirituale', 'arma-sacra', 'evoca-celestiale-spirito-celestiale'] },
    paladino: { truc: [], liv: ['cerimonia', 'sudario-spirituale', 'arma-sacra', 'evoca-celestiale-spirito-celestiale'] },
    ranger: { truc: [], liv: ['legame-con-le-bestie', 'trabocchetto', 'spirito-guaritore', 'evoca-bestia', 'frecce-infuocate', 'evoca-folletto-spirito-fatato', 'guardiano-della-natura', 'collera-della-natura'] },
  };
  // unisce i consigli base (Manuale del Giocatore) con quelli degli altri manuali spuntati, alternandoli
  D.consigliUniti = function (chiave, ch, man) {
    const b = D.CONSIGLI_INC[chiave] || { nota: '', truc: [], liv: [] }; const e = D.CONSIGLI_EXTRA[chiave];
    if (!e) return b;
    const ok = (id) => { const s = D.incantesimo(id); return s && (s.fonte || 'mdg') !== 'mdg' && man[s.fonte]; };
    const mix = (a, x) => { x = x.filter(ok); const out = []; for (let i = 0; i < Math.max(a.length, x.length); i++) { if (i < a.length) out.push(a[i]); if (i < x.length) out.push(x[i]); } return out; };
    return Object.assign({}, b, { truc: mix(b.truc, e.truc), liv: mix(b.liv, e.liv) });
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
