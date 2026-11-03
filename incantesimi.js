/* Indice incantesimi. I dati (testi completi dell'SRD 5.1 italiano) stanno in inc_dati.js */
(function (G) {
  const D = (G.DND = G.DND || {});
  D.caricaIncantesimi = function () {
    D.MANUALI = [['mdg', 'Manuale del Giocatore', 'Manuale del Giocatore'], ['xge', 'Guida Omnicomprensiva di Xanathar', 'Xanathar'], ['tce', 'Calderone Omnicomprensivo di Tasha', 'Tasha']];
    D.INCANTESIMI = (D.INC_DATI || []).map((s) => Object.assign({ fonte: 'mdg' }, s)).concat(D.INC_MDG2 || [], D.INC_XAN || [], D.INC_TASHA || []).map((s) => Object.assign({}, s, { testo: s.desc.concat(s.alto ? ['Ai livelli più alti. ' + s.alto] : []).join(' ') }));
    D.INC_PER_ID = {}; D.INCANTESIMI.forEach((s) => (D.INC_PER_ID[s.id] = s));
    D.incantesimo = (id) => D.INC_PER_ID[id];
    // etichetta della fonte per la scheda: (Manuale del Giocatore) / (Xanathar) / (Tasha, p. 106)
    D.fonteEtichetta = (s, corta) => { const f = corta ? ({ mdg: 'MdG', xge: 'Xanathar', tce: 'Tasha' })[s.fonte || 'mdg'] : (D.MANUALI.find((m) => m[0] === (s.fonte || 'mdg')) || [])[1] || ''; return f + (s.pag ? ', p. ' + s.pag : ''); };
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
