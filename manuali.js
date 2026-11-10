/* Registro dei manuali opzionali.
   Ogni manuale ha un id (es. 'tce'); gli elementi che ne fanno parte (classi, sottoclassi, stili, manovre,
   opzioni di scelta, privilegi opzionali, talenti, incantesimi) portano la proprietà  fonte: '<id>'  e compaiono
   solo se il personaggio ha quel manuale attivo (ch.fonti[<id>]). Per aggiungere un nuovo manuale basta:
   D.registraManuale('id', {nome, sigla, desc}) e poi caricare un file di dati che usa fonte:'id'. */
(function (G) {
  const D = G.DND;
  D.MANUALI_REG = D.MANUALI_REG || {};
  D.registraManuale = (id, info) => { D.MANUALI_REG[id] = Object.assign({ id, nome: id, sigla: id, desc: '', ordine: Object.keys(D.MANUALI_REG).length + 1, elenco: '' }, info); return D.MANUALI_REG[id]; };
  /* insieme dei manuali attivi del personaggio (migra il vecchio flag ch.tasha) */
  D.fonti = (ch) => {
    if (!ch) return {};
    if (!ch.fonti) { ch.fonti = {}; if (ch.tasha) ch.fonti.tce = true; }
    return ch.fonti;
  };
  D.fonteOk = (ch, f) => !f || !!D.fonti(ch)[f];
  D.fonteSigla = (f) => (f && D.MANUALI_REG[f] ? D.MANUALI_REG[f].sigla : '');
  D.manualiLista = () => Object.keys(D.MANUALI_REG).map((k) => D.MANUALI_REG[k]).sort((a, b) => a.ordine - b.ordine);
  D.registraManuale('tce', {
    nome: 'Calderone Omnicomprensivo di Tasha', sigla: 'Tasha',
    desc: 'classe Artefice, 26 nuove sottoclassi, privilegi di classe opzionali, stili di combattimento, manovre, Metamagie, Suppliche e Patto del Talismano, talenti e incantesimi aggiuntivi (testo italiano con l\'errata 08/2022).',
  });
})(typeof window !== 'undefined' ? window : globalThis);
