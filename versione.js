/* Numero di versione dell'app: va aumentato di 1 a ogni nuovo aggiornamento consegnato. */
window.FORGIA_VERSIONE = { n: 10, data: '05/11/2026' };
(function (G) {
  const v = G.FORGIA_VERSIONE; G.FORGIA_VERSIONE_TXT = 'v1.' + v.n + ' · ' + v.data;
  const metti = () => { const e = G.document.createElement('div'); e.className = 'ver-app no-print'; e.textContent = 'La Forgia degli Eroi · versione ' + G.FORGIA_VERSIONE_TXT; G.document.body.appendChild(e); };
  if (G.document.readyState === 'loading') G.document.addEventListener('DOMContentLoaded', metti); else metti();
})(window);
