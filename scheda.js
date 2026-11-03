/* Foglio personaggio A4 (3 pagine) sul modello della scheda ufficiale D&D 5e */
(function (G) {
  const D = G.DND, M = D.M;
  const X = (G.FORGIA_X = G.FORGIA_X || {});
  X.foglioSemplice = function (ch, u) {
    const esc = u.esc, fmt = u.fmt, metri = u.metri;
  return (function () {
    const d = M.derive(ch); const f = d.fin; const dt = ch.dett || {}; const X = (k) => esc(dt[k] || '');
    const clTxt = d.classi.map((c) => c.def.nome + ' ' + c.livello).join(' / ');
    const subTxt = d.classi.filter((c) => c.sottoclasseAttiva && c.sub).map((c) => c.sub.nome).join(', ');
    const razzaTxt = d.razza.nome + (d.sub ? ' (' + d.sub.nome + ')' : '');
    const gio = (ch.giocatore.nome + ' ' + ch.giocatore.cognome).trim();
    const cmp = (l, v) => '<div class="cmp"><b>' + esc(v) + '</b><small>' + l + '</small></div>';
    const caratt = D.ABIL.map((a) => '<div class="car"><span class="et">' + D.ABIL_NOME[a] + '</span><span class="mod">' + fmt(d.mods[a]) + '</span><span class="pt">' + f[a] + '</span></div>').join('');
    const salv = d.salvezze.map((s) => '<li><i class="' + (s.comp ? 'on' : '') + '"></i><b>' + fmt(s.bonus) + '</b> ' + D.ABIL_NOME[s.car] + '</li>').join('');
    const abil = d.abilita.map((s) => '<li><i class="' + (s.mae ? 'on2' : s.comp ? 'on' : '') + '"></i><b>' + fmt(s.bonus) + '</b> ' + s.nome + ' <em>(' + D.ABIL_SIGLA[s.car] + ')</em></li>').join('');
    const att = d.attacchi.length ? d.attacchi.map((a) => '<tr><td>' + esc(a.nome) + (a.prop ? '<br><span class="piccolo" style="color:#555">' + esc(a.prop) + '</span>' : '') + '</td><td>' + fmt(a.bonus) + '</td><td>' + esc(a.danno) + '</td></tr>').join('') : '<tr><td colspan="3" style="height:12mm"></td></tr>';
    const arma = D.armatura(ch.armatura || 'nessuna');
    const eqTxt = [(arma.id !== 'nessuna' ? 'Armatura: ' + arma.nome : ''), (ch.scudo ? 'Scudo' : ''), ch.equip].filter(Boolean).join('\n');
    const comp = d.competenze;
    const lista = (arr) => arr.length ? arr.join(', ') : '—';
    const risorse = d.risorse.map((r) => '<p class="piccolo"><b>' + esc(r[0]) + ':</b> ' + esc(r[1]) + '</p>').join('');
    const breve = d.privilegi.filter((x) => !x.nascosto).map((p) => esc(p.nome)).concat(d.tratti.filter((x) => !x.nascosto).map((t) => esc(t.nome))).join(' · ');

    const p1 = '<section class="pagina">'
      + '<div class="intest"><div class="nomepg"><b>' + esc(ch.nome || ' ') + '</b><small>Nome del personaggio</small></div>'
      + '<div class="campi">' + cmp('Classe e livello', clTxt + (subTxt ? ' – ' + subTxt : '')) + cmp('Background', d.sfondo.nome) + cmp('Giocatore', gio) + cmp('Razza', razzaTxt) + cmp('Allineamento', ch.allineamento) + cmp('Punti esperienza', '') + '</div></div>'
      + '<div class="tre">'
      + '<div class="colonna">' + caratt
      + '<div class="box ctr" style="margin-top:3mm"><span class="v">' + fmt(d.pb) + '</span><small>Bonus competenza</small></div>'
      + '<div class="box ctr"><span class="v">&nbsp;</span><small>Ispirazione</small></div>'
      + '<div class="box"><small>Tiri salvezza</small><ul class="liste">' + salv + '</ul></div></div>'
      + '<div class="colonna">'
      + '<div class="tri"><div class="box ctr"><span class="v">' + d.ca + '</span><small>Classe Armatura</small></div><div class="box ctr"><span class="v">' + fmt(d.iniziativa) + '</span><small>Iniziativa</small></div><div class="box ctr"><span class="v">' + metri(d.velocita) + '</span><small>Velocità</small></div></div>'
      + '<div class="box"><small>Punti ferita massimi</small> <b style="font-size:12pt">' + d.pf + '</b><div style="height:8mm;border-bottom:1px solid #999"></div><small>Punti ferita attuali</small><div style="height:8mm;border-bottom:1px solid #999"></div><small>Punti ferita temporanei</small></div>'
      + '<div class="riga" style="gap:2mm;flex-wrap:nowrap"><div class="box" style="flex:1"><b>' + esc(d.dadiVita) + '</b><br><small>Dadi vita</small></div><div class="box" style="flex:1"><small>Tiri salvezza contro morte</small><br>Successi ○ ○ ○<br>Fallimenti ○ ○ ○</div></div>'
      + '<div class="box"><small>Attacchi e incantesimi' + (d.attacchiPerAzione > 1 ? ' · ' + d.attacchiPerAzione + ' attacchi per azione' : '') + '</small><table class="tab-att"><thead><tr><th>Nome</th><th>Colpire</th><th>Danno / tipo</th></tr></thead><tbody>' + att + '</tbody></table></div>'
      + '<div class="riga-monete">' + [['pr','PR'],['pa','PA'],['pe','PE'],['po','PO'],['pp','PP']].map((m) => '<div class="box ctr"><span class="v">' + X('m_' + m[0]) + '&nbsp;</span><small>' + m[1] + '</small></div>').join('') + '</div>'
      + '<div class="box" style="flex:1"><small>Equipaggiamento</small><div class="righe" style="min-height:30mm">' + esc(eqTxt) + '</div></div></div>'
      + '<div class="colonna"><div class="box ctr"><span class="v">' + d.percezionePassiva + '</span><small>Saggezza passiva (Percezione)</small></div>'
      + '<div class="box"><small>Abilità</small><ul class="liste">' + abil + '</ul></div>'
      + '<div class="box"><small>Altre competenze e linguaggi</small><p class="piccolo" style="margin-top:1mm"><b>Armature:</b> ' + lista(comp.armature) + '<br><b>Armi:</b> ' + lista(comp.armi) + '<br><b>Altro:</b> ' + esc(comp.altro) + '<br><b>Linguaggi:</b> ' + lista(d.lingue) + '</p></div>'
      + '<div class="box"><small>Tratti caratteriali</small><div class="righe sm">' + X('tratti') + '</div></div>'
      + '<div class="box"><small>Ideali</small><div class="righe sm">' + X('ideali') + '</div></div>'
      + '<div class="box"><small>Legami</small><div class="righe sm">' + X('legami') + '</div></div>'
      + '<div class="box"><small>Difetti</small><div class="righe sm">' + X('difetti') + '</div></div>'
      + '</div></div></section>';

    const priv = d.privilegi.filter((x) => !x.nascosto).map((p) => '<div class="privilegio"><h4>' + esc(p.nome) + ' <small>' + esc(p.fonte) + '</small></h4><p>' + esc(p.desc) + '</p></div>').join('');
    const trat = d.tratti.filter((x) => !x.nascosto).map((t) => '<div class="privilegio"><h4>' + esc(t.nome) + '</h4><p>' + esc(t.desc) + '</p></div>').join('');
    const tal = d.talenti.map((t) => '<div class="privilegio"><h4>' + esc(t.nome) + ' <small>livello ' + t.liv + '</small></h4></div>').join('');
    const p2 = '<section class="pagina"><h2>' + esc(ch.nome || 'Personaggio') + ' · privilegi e tratti</h2>'
      + (risorse ? '<h3>Risorse</h3>' + risorse : '')
      + '<h3>Privilegi di classe</h3><div class="due-col">' + priv + '</div>'
      + '<h3>Tratti razziali</h3><div class="due-col">' + trat + '</div>'
      + (tal ? '<h3>Talenti</h3><div class="due-col">' + tal + '</div>' : '')
      + '<h3>Aspetto</h3><div class="tri" style="grid-template-columns:repeat(6,1fr)">' + [['eta','Età'],['altezza','Altezza'],['peso','Peso'],['occhi','Occhi'],['pelle','Pelle'],['capelli','Capelli']].map((k) => '<div class="cmp"><b>' + X(k[0]) + '&nbsp;</b><small>' + k[1] + '</small></div>').join('') + '</div>'
      + '<h3>Storia del personaggio</h3><div class="righe" style="min-height:40mm">' + X('storia') + '</div>'
      + '<div class="due-col"><div><h3>Alleati e organizzazioni</h3><div class="righe" style="min-height:25mm">' + X('alleati') + '</div></div><div><h3>Tesori</h3><div class="righe" style="min-height:25mm">' + X('tesoro') + '</div></div></div>'
      + '<h3>Appunti</h3><div class="righe" style="min-height:25mm;flex:1">' + esc(ch.note) + '</div></section>';

    const inc = d.incantesimi;
    let p3 = '';
    if (inc.classi.length) {
      const hdr = inc.classi.map((k) => '<div class="box ctr"><small>' + k.classe + ' · ' + D.ABIL_NOME[k.car] + '</small><span class="v">CD ' + k.cd + ' · ' + fmt(k.att) + '</span><small>CD TS / bonus attacco</small></div>').join('');
      const cerchi = (n) => { let h = ''; for (let q = 0; q < n; q++) h += '<i class="cerchio"></i>'; return h; };
      const maxLiv = Math.max(inc.slot.length, ...inc.classi.map((k) => (k.patto ? k.patto[1] : 0)));
      // incantesimi scelti per livello
      const per = {};
      const sc = ch.inc || {};
      inc.classi.forEach((k) => {
        const s = sc[k.id]; if (!s) return;
        const prepSet = new Set(s.prep || []);
        const ids = k.id === 'mago' || k.id === 'cavaliere-mistico' ? null : null;
        const tutti = [].concat(s.truc || [], s.conos || [], s.libro || [], s.prep || []);
        const visti = new Set();
        tutti.forEach((id) => {
          if (visti.has(id)) return; visti.add(id);
          const sp = D.incantesimo && D.incantesimo(id); if (!sp) return;
          (per[sp.liv] = per[sp.liv] || []).push((prepSet.has(id) && (s.libro || []).length ? '● ' : '') + sp.nome);
        });
      });
      if (d.incSub) d.incSub.voci.filter((v) => v.disp).forEach((v) => { const sp = D.incantesimo(v.id); if (sp && !(per[sp.liv] || []).includes('● ' + sp.nome) && !(per[sp.liv] || []).includes(sp.nome)) (per[sp.liv] = per[sp.liv] || []).push('● ' + sp.nome); });
      let liste = '';
      for (let l = 0; l <= maxLiv; l++) {
        const tr = inc.classi.map((k) => k.trucchetti).filter((x) => x != null).reduce((a, b) => a + b, 0);
        let testa = l === 0 ? 'Trucchetti' + (tr ? ' (' + tr + ')' : '') : l + '° livello';
        let slotTxt = '';
        if (l > 0) {
          const n = inc.slot[l - 1] || 0;
          const pt = inc.classi.filter((k) => k.patto && k.patto[1] === l).reduce((a, k) => a + k.patto[0], 0);
          slotTxt = '<span class="slotc">Slot ' + (n + pt) + ' ' + cerchi(n + pt) + '</span>';
        }
        liste += '<div class="sp-liv"><h4>' + testa + slotTxt + '</h4><div class="righe" style="min-height:' + (l === 0 ? 22 : 16) + 'mm">' + esc((per[l] || []).join(', ') + (ch.incantesimi && ch.incantesimi[l] ? ((per[l] || []).length ? ', ' : '') + ch.incantesimi[l] : '')) + '</div></div>';
      }
      const info = inc.classi.map((k) => k.classe + ': ' + [k.conosciuti ? k.conosciuti + ' incantesimi conosciuti' : '', k.preparati ? k.preparati + ' incantesimi preparati' : '', k.libro ? k.libro + ' nel libro' : ''].filter(Boolean).join(', ')).join(' · ');
      p3 = '<section class="pagina"><h2>Incantesimi · ' + esc(ch.nome || '') + '</h2><div class="tri">' + hdr + '</div><p class="piccolo">' + esc(info) + ' · ● = preparato · Annerisci un cerchio ogni volta che usi uno slot.</p><div class="due-col" style="margin-top:2mm">' + liste + '</div>'
        + (ch.incantesimi && ch.incantesimi.note ? '<h3>Note</h3><div class="righe">' + esc(ch.incantesimi.note) + '</div>' : '') + '</section>';
    }
    if (d.incRazza) {
      const R = d.incRazza;
      p3 += '<section class="pagina"><h2>Incantesimi di razza · ' + esc(ch.nome || '') + '</h2><p>' + D.ABIL_NOME[R.car] + ' · CD ' + R.cd + ' · attacco ' + fmt(R.att) + '</p><ul>'
        + R.voci.map((v) => '<li' + (v.disp ? '' : ' style="opacity:.5"') + '><b>' + esc(v.nome) + '</b> – ' + (v.disp ? (v.uso ? '1/riposo lungo' : 'a volontà') : 'dal livello ' + v.liv) + '</li>').join('') + '</ul></section>';
    }
    return p1 + p2 + p3;
  })();
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
