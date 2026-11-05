/* Esporta in PDF A4 ciò che sta in #stampa (per iPad/iPhone, dove la stampa diretta di Safari taglia e scala le pagine).
   Ogni pagina viene "fotografata" a 2x e messa in un PDF: si apre, e da lì Condividi → Stampa. Librerie caricate solo al bisogno. */
(function (G) {
  'use strict';
  const X = (G.FORGIA_X = G.FORGIA_X || {});
  const D = G.document;
  const iOS = () => /iPad|iPhone|iPod/.test(G.navigator.userAgent) || (G.navigator.platform === 'MacIntel' && G.navigator.maxTouchPoints > 1);
  X.usaPdf = () => { try { if (G.location.search.includes('pdf=0')) return false; if (G.location.search.includes('pdf=1') || G.localStorage.getItem('forgia_pdf') === '1') return true; } catch (e) { /* niente */ } return iOS(); };
  const carica = (src) => new Promise((ok, ko) => { const s = D.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => ko(new Error('Libreria PDF non caricata (' + src + ')')); D.head.appendChild(s); });
  const librerie = async () => { if (!G.html2canvas) await carica('lib/html2canvas.min.js'); if (!(G.jspdf && G.jspdf.jsPDF)) await carica('lib/jspdf.umd.min.js'); };
  const MM = 25.4 / 96;
  const SEL = '.uffpag,.cartapag,.ig-pag,.pt-pag,.pagina';
  const attendi = (ms) => new Promise((r) => setTimeout(r, ms));
  async function immagini(root) {
    const im = [...root.querySelectorAll('img')].filter((i) => !i.complete);
    if (im.length) await Promise.race([Promise.all(im.map((i) => new Promise((r) => { i.addEventListener('load', r); i.addEventListener('error', r); }))), attendi(6000)]);
    try { await D.fonts.ready; } catch (e) { /* niente */ }
  }
  function overlay() {
    const o = D.createElement('div'); o.className = 'pdf-ov no-print';
    o.innerHTML = '<div class="pdf-box"><div class="pdf-t">Preparo il PDF…</div><div class="pdf-bar"><i></i></div><div class="pdf-s"></div></div>';
    D.body.appendChild(o); return o;
  }
  X.pdfStampa = async function () {
    const src = D.getElementById('stampa'); if (!src || !src.innerHTML.trim()) return;
    const ov = overlay(); const t = ov.querySelector('.pdf-t'), bar = ov.querySelector('.pdf-bar i'), sub = ov.querySelector('.pdf-s');
    const chiudi = () => { ov.remove(); };
    const stage = D.createElement('div'); stage.className = 'pdfstage';
    try {
      await librerie();
      stage.innerHTML = src.innerHTML; D.body.appendChild(stage);
      await immagini(stage); await attendi(60);
      const tutte = [...stage.querySelectorAll(SEL)];
      const pagine = tutte.filter((e) => !tutte.some((o) => o !== e && o.contains(e)));
      if (!pagine.length) throw new Error('Niente da stampare');
      const pdf = new G.jspdf.jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
      let n = 0;
      for (let i = 0; i < pagine.length; i++) {
        const el = pagine[i]; sub.textContent = 'Pagina ' + (i + 1) + ' di ' + pagine.length; bar.style.width = Math.round(i / pagine.length * 100) + '%'; await attendi(10);
        const w = el.offsetWidth, h = el.offsetHeight; if (!w || !h) continue;
        const cv = await G.html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false, width: w, height: h, windowWidth: Math.max(w, G.innerWidth) });
        const wmm = w * MM, hmm = h * MM; const land = wmm > hmm * 1.1; const PW = land ? 297 : 210, PH = land ? 210 : 297;
        const lunga = hmm > PH * 1.03 * Math.min(1, PW / wmm); /* pagina "a scorrimento" (più alta di un foglio): si spezza */
        const k = lunga ? Math.min(1, PW / wmm) : Math.min(PW / wmm, PH / hmm); /* altrimenti riempie il foglio */
        const ox = (PW - wmm * k) / 2; const pxmm = cv.width / wmm; const fetta = lunga ? Math.floor((PH / k) * pxmm) : cv.height;
        const parti = Math.max(1, Math.ceil((cv.height - 2) / fetta));
        for (let p = 0; p < parti; p++) {
          const y = p * fetta, hh = Math.min(fetta, cv.height - y); if (hh < 4) continue;
          const c2 = D.createElement('canvas'); c2.width = cv.width; c2.height = hh; const cx = c2.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, c2.width, c2.height); cx.drawImage(cv, 0, y, cv.width, hh, 0, 0, cv.width, hh);
          if (n) pdf.addPage('a4', land ? 'landscape' : 'portrait'); else if (land) { pdf.deletePage(1); pdf.addPage('a4', 'landscape'); }
          pdf.addImage(c2.toDataURL('image/jpeg', 0.92), 'JPEG', ox, 0, wmm * k, (hh / pxmm) * k, undefined, 'FAST'); n++;
        }
      }
      bar.style.width = '100%';
      const blob = pdf.output('blob'); const url = URL.createObjectURL(blob); const nome = 'la-forgia-degli-eroi.pdf';
      const file = (typeof G.File === 'function') ? new G.File([blob], nome, { type: 'application/pdf' }) : null;
      const puoiCond = !!(file && G.navigator.canShare && G.navigator.canShare({ files: [file] }));
      t.textContent = '✔ PDF pronto (' + n + (n === 1 ? ' pagina' : ' pagine') + ')'; sub.innerHTML = 'Apri il PDF, poi <b>Condividi → Stampa</b> e scegli la stampante.';
      const az = D.createElement('div'); az.className = 'pdf-az';
      az.innerHTML = '<a class="pdf-b" href="' + url + '" target="_blank" rel="noopener">📄 Apri PDF</a>' + (puoiCond ? '<button class="pdf-b" data-c="1">📤 Condividi / Stampa</button>' : '') + '<a class="pdf-b sec" href="' + url + '" download="' + nome + '">⬇ Scarica</a><button class="pdf-b sec" data-x="1">Chiudi</button>';
      ov.querySelector('.pdf-box').appendChild(az);
      az.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.x) { chiudi(); setTimeout(() => URL.revokeObjectURL(url), 60000); } else if (b.dataset.c) G.navigator.share({ files: [file], title: 'La Forgia degli Eroi' }).catch(() => {}); });
    } catch (e) {
      t.textContent = 'PDF non riuscito'; sub.textContent = String(e && e.message || e); ov.querySelector('.pdf-bar').remove();
      const b = D.createElement('button'); b.className = 'pdf-b sec'; b.textContent = 'Chiudi'; b.onclick = chiudi; ov.querySelector('.pdf-box').appendChild(b);
    } finally { stage.remove(); }
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
