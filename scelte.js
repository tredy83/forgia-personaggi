/* Scelte guidate di classe e sottoclasse + incantesimi automatici di dominio, giuramento, circolo e patrono.
   Testi in parole nostre; i nomi sono quelli del Manuale del Giocatore. */
(function (G) {
  const D = G.DND;
  /* Incantesimi extra: per chierico/paladino/druido (Terra) sono sempre preparati e non contano nel limite;
     per il warlock sono aggiunti alla lista da cui scegliere. Chiavi: 'classe/sottoclasse' oppure 'terreno/<terreno>'. */
  D.INC_SUB = {"chierico/conoscenza": [["comando", "identificare"], ["presagio", "suggestione"], ["anti-individuazione", "parlare-con-i-morti"], ["confusione", "occhio-arcano"], ["conoscenza-delle-leggende", "scrutare"]], "chierico/guerra": [["favore-divino", "scudo-della-fede"], ["arma-magica", "arma-spirituale"], ["guardiani-spirituali", "manto-del-crociato"], ["liberta-di-movimento", "pelle-di-pietra"], ["blocca-mostri", "colpo-infuocato"]], "chierico/inganno": [["camuffare-se-stesso", "charme-su-persone"], ["immagine-speculare", "passare-senza-tracce"], ["dissolvi-magie", "intermittenza"], ["metamorfosi", "porta-dimensionale"], ["dominare-persone", "modificare-memoria"]], "chierico/luce": [["luminescenza", "mani-brucianti"], ["raggio-rovente", "sfera-infuocata"], ["luce-diurna", "palla-di-fuoco"], ["guardiano-della-fede", "muro-di-fuoco"], ["colpo-infuocato", "scrutare"]], "chierico/natura": [["amicizia-con-gli-animali", "parlare-con-gli-animali"], ["crescita-di-spuntoni", "pelle-di-corteccia"], ["crescita-vegetale", "muro-di-vento"], ["dominare-bestie", "rampicante-afferrante"], ["piaga-degli-insetti", "traslazione-arborea"]], "chierico/tempesta": [["nube-di-nebbia", "onda-tonante"], ["folata-di-vento", "frantumare"], ["invocare-il-fulmine", "tempesta-di-nevischio"], ["controllare-acqua", "tempesta-di-ghiaccio"], ["ondata-distruttiva", "piaga-degli-insetti"]], "chierico/vita": [["benedizione", "cura-ferite"], ["arma-spirituale", "ristorare-inferiore"], ["faro-di-speranza", "rinascita"], ["guardiano-della-fede", "interdizione-alla-morte"], ["cura-ferite-di-massa", "rianimare-morti"]], "paladino/devozione": [["protezione-dal-bene-e-dal-male", "santuario"], ["ristorare-inferiore", "zona-di-verita"], ["dissolvi-magie", "faro-di-speranza"], ["guardiano-della-fede", "liberta-di-movimento"], ["colpo-infuocato", "comunione"]], "paladino/antichi": [["colpo-intrappolante", "parlare-con-gli-animali"], ["bagliore-lunare", "passo-velato"], ["crescita-vegetale", "protezione-dallenergia"], ["pelle-di-pietra", "tempesta-di-ghiaccio"], ["comunione-con-la-natura", "traslazione-arborea"]], "paladino/vendetta": [["anatema", "marchio-del-cacciatore"], ["blocca-persone", "passo-velato"], ["protezione-dallenergia", "velocita"], ["esilio", "porta-dimensionale"], ["blocca-mostri", "scrutare"]], "terreno/artico": [["blocca-persone", "crescita-di-spuntoni"], ["lentezza", "tempesta-di-nevischio"], ["liberta-di-movimento", "tempesta-di-ghiaccio"], ["comunione-con-la-natura", "cono-di-freddo"]], "terreno/costa": [["immagine-speculare", "passo-velato"], ["camminare-sullacqua", "respirare-sottacqua"], ["controllare-acqua", "liberta-di-movimento"], ["evoca-elementale", "scrutare"]], "terreno/deserto": [["sfocatura", "silenzio"], ["creare-cibo-e-acqua", "protezione-dallenergia"], ["inaridire", "terreno-illusorio"], ["muro-di-pietra", "piaga-degli-insetti"]], "terreno/foresta": [["movimenti-del-ragno", "pelle-di-corteccia"], ["crescita-vegetale", "invocare-il-fulmine"], ["divinazione", "liberta-di-movimento"], ["comunione-con-la-natura", "traslazione-arborea"]], "terreno/montagna": [["crescita-di-spuntoni", "movimenti-del-ragno"], ["fondersi-nella-pietra", "fulmine"], ["pelle-di-pietra", "scolpire-pietra"], ["muro-di-pietra", "passapareti"]], "terreno/palude": [["freccia-acida", "oscurita"], ["camminare-sullacqua", "nube-maleodorante"], ["liberta-di-movimento", "localizza-creatura"], ["piaga-degli-insetti", "scrutare"]], "terreno/prateria": [["invisibilita", "passare-senza-tracce"], ["luce-diurna", "velocita"], ["divinazione", "liberta-di-movimento"], ["piaga-degli-insetti", "sogno"]], "terreno/underdark": [["movimenti-del-ragno", "ragnatela"], ["forma-gassosa", "nube-maleodorante"], ["invisibilita-superiore", "scolpire-pietra"], ["nube-mortale", "piaga-degli-insetti"]], "warlock/fatato": [["luminescenza", "sonno"], ["allucinazione-di-forza", "calmare-emozioni"], ["crescita-vegetale", "intermittenza"], ["dominare-bestie", "invisibilita-superiore"], ["dominare-persone", "sembrare"]], "warlock/immondo": [["comando", "mani-brucianti"], ["cecita-sordita", "raggio-rovente"], ["nube-maleodorante", "palla-di-fuoco"], ["muro-di-fuoco", "scudo-di-fuoco"], ["colpo-infuocato", "santificare"]], "warlock/antico": [["risata-incontenibile", "sussurri-dissonanti"], ["allucinazione-di-forza", "individuazione-dei-pensieri"], ["chiaroveggenza", "inviare"], ["dominare-bestie", "tentacoli-neri"], ["dominare-persone", "telecinesi"]]};
  D.INC_SUB_LIV = { chierico: [1, 3, 5, 7, 9], paladino: [3, 5, 9, 13, 17], druido: [3, 5, 7, 9] };
  D.TERRENI = [['artico', 'Artico'], ['costa', 'Costa'], ['deserto', 'Deserto'], ['foresta', 'Foresta'], ['montagna', 'Montagna'], ['palude', 'Palude'], ['prateria', 'Prateria'], ['underdark', 'Underdark']];

  /* Scelte guidate. Ogni gruppo: id, cl (classe), sub (sottoclasse, opzionale), nome, nota, da (livello di classe), n(liv) = quante opzioni,
     opz = [id, nome, descrizione, (livello minimo), (patto richiesto)] */
  const S = (id, cl, sub, nome, da, n, nota, opz) => ({ id, cl, sub, nome, da, n, nota, opz });
  D.SCELTE = [
    S('preda', 'ranger', 'cacciatore', 'Preda del Cacciatore', 3, () => 1, '', [
      ['devastatore', 'Devastatore dell\'Orda', 'Una volta per turno, dopo aver attaccato una creatura con un\'arma, puoi attaccare con la stessa arma un\'altra creatura entro 1,5 m dalla prima (e alla portata dell\'arma).'],
      ['colossi', 'Sterminatore di Colossi', 'Una volta per turno, se colpisci una creatura che ha già subito danni (ha meno PF del massimo), infliggi 1d8 danni extra.'],
      ['giganti', 'Uccisore di Giganti', 'Reazione: quando una creatura Grande o più grande entro 1,5 m ti attacca (colpisca o meno), puoi attaccarla subito dopo, se la vedi.']
    ]),
    S('tattiche', 'ranger', 'cacciatore', 'Tattiche Difensive', 7, () => 1, '', [
      ['orda', 'Sfuggire all\'Orda', 'Gli attacchi di opportunità contro di te hanno svantaggio.'],
      ['multi', 'Difesa dal Multiattacco', 'Quando una creatura ti colpisce con un attacco, ottieni +4 alla CA contro tutti i suoi attacchi successivi per il resto del turno.'],
      ['volonta', 'Volontà d\'Acciaio', 'Hai vantaggio ai tiri salvezza contro l\'essere spaventato.']
    ]),
    S('multiatt', 'ranger', 'cacciatore', 'Multiattacco', 11, () => 1, '', [
      ['turbinante', 'Attacco Turbinante', 'Azione: fai un attacco in mischia contro ogni creatura entro 1,5 m da te (tiro per colpire separato per ciascuna).'],
      ['raffica', 'Raffica', 'Azione: fai un attacco a distanza contro ogni creatura entro 3 m da un punto a gittata, con un tiro per colpire separato per ciascuna (serve una munizione per attacco).']
    ]),
    S('difesa', 'ranger', 'cacciatore', 'Difesa del Cacciatore Superiore', 15, () => 1, '', [
      ['elusione', 'Elusione', 'Se superi un TS su Destrezza che dimezzerebbe i danni, non ne subisci; se lo fallisci ne subisci la metà (serve non essere incapacitato).'],
      ['marea', 'Opporsi alla Marea', 'Reazione: quando una creatura Grande o più piccola ti manca con un attacco in mischia, la costringi a ripeterlo contro un\'altra creatura a tua scelta.'],
      ['schivata', 'Schivata Prodigiosa', 'Reazione: dimezzi i danni di un attacco che ti colpisce e che puoi vedere.']
    ]),
    S('tot3', 'barbaro', 'totemico', 'Spirito Totemico (3°)', 3, () => 1, 'Vale mentre sei in Ira.', [
      ['orso', 'Orso', 'In Ira hai resistenza a tutti i danni tranne quelli psichici.'],
      ['aquila', 'Aquila', 'In Ira puoi usare Scatto come azione bonus e gli attacchi di opportunità contro di te hanno svantaggio.'],
      ['lupo', 'Lupo', 'In Ira i tuoi alleati hanno vantaggio ai tiri per colpire contro i nemici entro 1,5 m da te.']
    ]),
    S('tot6', 'barbaro', 'totemico', 'Aspetto della Bestia (6°)', 6, () => 1, 'Può essere un animale diverso da quello del 3° livello.', [
      ['orso', 'Orso', 'La tua capacità di carico e di sollevamento raddoppia e hai vantaggio alle prove di Forza per spingere, trascinare, sollevare o spezzare oggetti.'],
      ['aquila', 'Aquila', 'Vedi fino a 1,5 km senza difficoltà, discernendo i dettagli come a 30 m, e la luce fioca non ti dà svantaggio alle prove di Percezione.'],
      ['lupo', 'Lupo', 'Segui tracce a passo veloce e ti muovi furtivo a passo normale.']
    ]),
    S('tot14', 'barbaro', 'totemico', 'Sintonia Totemica (14°)', 14, () => 1, 'Vale mentre sei in Ira.', [
      ['orso', 'Orso', 'Ogni nemico entro 1,5 m da te ha svantaggio ai tiri per colpire contro chiunque non sia tu (o un altro con questa Sintonia); è immune se non ti vede né sente o non può essere spaventato.'],
      ['aquila', 'Aquila', 'Hai velocità di volo pari alla velocità base a terra, solo per brevi tratti: cadi se finisci il turno in aria senza sostegno.'],
      ['lupo', 'Lupo', 'Azione bonus: quando colpisci una creatura Grande o più piccola con un\'arma da mischia, puoi buttarla a terra prona.']
    ]),
    S('metamagia', 'stregone', null, 'Metamagia', 3, (L) => 2 + (L >= 10) + (L >= 17), 'Si spendono punti stregoneria; in genere si usa una sola Metamagia per incantesimo.', [
      ['celato', 'Incantesimo Celato', 'Costo 1: lanci l\'incantesimo senza componenti somatiche né verbali.'],
      ['distante', 'Incantesimo Distante', 'Costo 1: raddoppi la gittata (se almeno 1,5 m); un incantesimo a contatto passa a 9 m.'],
      ['esteso', 'Incantesimo Esteso', 'Costo 1: raddoppi la durata di un incantesimo di 1 minuto o più, fino a un massimo di 24 ore.'],
      ['intensificato', 'Incantesimo Intensificato', 'Costo 3: se l\'incantesimo prevede un TS, un bersaglio ha svantaggio al primo TS contro di esso.'],
      ['potenziato', 'Incantesimo Potenziato', 'Costo 1: ritiri fino a mod. Carisma dadi di danno (minimo 1) e usi i nuovi risultati; si combina con un\'altra Metamagia.'],
      ['preciso', 'Incantesimo Preciso', 'Costo 1: se l\'incantesimo prevede un TS, fino a mod. Carisma creature (minimo 1) lo superano automaticamente.'],
      ['raddoppiato', 'Incantesimo Raddoppiato', 'Costo pari al livello dell\'incantesimo (1 per un trucchetto): un incantesimo che bersaglia una sola creatura (e non ha gittata Personale) può colpire anche una seconda creatura entro gittata.'],
      ['rapido', 'Incantesimo Rapido', 'Costo 2: un incantesimo con tempo di lancio di 1 azione si lancia con un\'azione bonus.']
    ]),
    S('patto', 'warlock', null, 'Dono del Patto', 3, () => 1, 'Il tuo patrono ti fa un dono.', [
      ['catena', 'Patto della Catena', 'Impari Trova Famiglio e puoi lanciarlo come rituale (non conta tra gli incantesimi conosciuti). Il famiglio può avere una forma speciale: imp, pseudodrago, quasit o spiritello. Quando usi l\'azione Attacco puoi rinunciare a uno dei tuoi attacchi per lasciare che il famiglio ne faccia uno con la sua reazione.'],
      ['lama', 'Patto della Lama', 'Con un\'azione fai apparire nella mano vuota un\'arma da mischia del patto, della forma che vuoi a ogni evocazione: sei competente, è magica per superare resistenze e immunità, e scompare se resta per 1 minuto a più di 1,5 m da te, se la congedi o se muori. Con un rituale di 1 ora (anche durante un riposo breve) puoi legare al patto un\'arma magica che impugni (non artefatti né armi senzienti) e tenerla in uno spazio extradimensionale quando la congedi.'],
      ['tomo', 'Patto del Tomo', 'Ricevi il Libro delle Ombre: scegli 3 trucchetti da qualsiasi lista di classe. Finché porti con te il libro li lanci a volontà; non contano tra i trucchetti conosciuti e valgono come trucchetti da warlock. Se perdi il libro, un cerimoniale di 1 ora (in un riposo) ne richiama uno nuovo dal patrono.']
    ]),
    S('suppliche', 'warlock', null, 'Suppliche Occulte', 2, (L) => D.INVOCAZIONI[L - 1], 'Alcune richiedono un livello da warlock, un Dono del Patto o di conoscere il trucchetto Deflagrazione Occulta.', [
      ['armatura-ombre', 'Armatura delle Ombre', 'Lanci Armatura Magica su te stesso a volontà, senza slot né componenti.'],
      ['balzo', 'Balzo Ultraterreno', 'Lanci Saltare su te stesso a volontà, senza slot né componenti.', 9],
      ['catene', 'Catene di Carceri', 'Lanci Blocca Mostri a volontà (solo su un celestiale, immondo o elementale), senza slot né componenti; devi fare un riposo lungo prima di usarla di nuovo sulla stessa creatura.', 15, 'catena'],
      ['defl-agonizzante', 'Deflagrazione Agonizzante', 'Quando lanci Deflagrazione Occulta aggiungi il tuo mod. Carisma ai danni che infliggi quando colpisci il bersaglio.', 0, '', 'deflagrazione-occulta'],
      ['defl-respingente', 'Deflagrazione Respingente', 'Quando colpisci una creatura con Deflagrazione Occulta puoi spingerla fino a 3 m via da te, in linea retta.', 0, '', 'deflagrazione-occulta'],
      ['fardello', 'Fardello Mentale', 'Lanci Lentezza una volta per riposo lungo con uno slot di Magia del Patto.', 5],
      ['influenza', 'Influenza Seducente', 'Ottieni competenza in Inganno e Persuasione.'],
      ['cinque-fati', 'Ladro dei Cinque Fati', 'Lanci Anatema una volta per riposo lungo con uno slot di Magia del Patto.'],
      ['lama-assetata', 'Lama Assetata', 'Con l\'arma del patto fai due attacchi con l\'azione Attacco.', 5, 'lama'],
      ['lancia', 'Lancia Occulta', 'Quando lanci Deflagrazione Occulta la sua gittata è di 90 m.', 0, '', 'deflagrazione-occulta'],
      ['libro-segreti', 'Libro degli Antichi Segreti', 'Scegli due incantesimi di 1° livello con il descrittore rituale da qualsiasi lista di classe: restano nel Libro delle Ombre (non contano tra i conosciuti) e li lanci come rituali finché impugni il libro. Puoi aggiungerne altri trovati: livello fino a metà del tuo livello da warlock (per eccesso), 2 ore e 50 mo per livello.', 1, 'tomo'],
      ['lingue-bestie', 'Lingue delle Bestie', 'Lanci Parlare con gli Animali a volontà, senza slot.'],
      ['mille-forme', 'Maestro di Mille Forme', 'Lanci Alterare Se Stesso a volontà, senza slot.', 15],
      ['maschera', 'Maschera dei Molti Volti', 'Lanci Camuffare Se Stesso a volontà, senza slot.'],
      ['occhi-rune', 'Occhi del Custode delle Rune', 'Leggi qualsiasi scrittura.'],
      ['parola', 'Parola Temibile', 'Lanci Confusione una volta per riposo lungo con uno slot di Magia del Patto.', 7],
      ['passo', 'Passo Ascendente', 'Lanci Levitazione su te stesso a volontà, senza slot.', 9],
      ['presagio', 'Presagio di Sventura', 'Lanci Scagliare Maledizione una volta per riposo lungo con uno slot di Magia del Patto.', 5],
      ['scultore', 'Scultore della Carne', 'Lanci Metamorfosi una volta per riposo lungo con uno slot di Magia del Patto.', 7],
      ['servitori-caos', 'Servitori del Caos', 'Lanci Evoca Elementale una volta per riposo lungo con uno slot di Magia del Patto.', 9],
      ['sguardo', 'Sguardo delle Due Menti', 'Con la tua azione tocchi un umanoide consenziente e percepisci attraverso i suoi sensi fino alla fine del tuo turno successivo; finché è sullo stesso piano di esistenza puoi usare l\'azione nei turni seguenti per prolungare il legame. Ottieni i suoi sensi speciali, ma sei cieco e sordo rispetto a ciò che ti circonda.'],
      ['succhiavita', 'Succhiavita', 'Quando colpisci una creatura con l\'arma del patto, questa subisce danni necrotici extra pari al tuo mod. Carisma (minimo 1).', 12, 'lama'],
      ['sussurri-tomba', 'Sussurri dalla Tomba', 'Lanci Parlare con i Morti a volontà, senza slot.', 9],
      ['sussurri-stregati', 'Sussurri Stregati', 'Lanci Compulsione una volta per riposo lungo con uno slot di Magia del Patto.', 7],
      ['ombre', 'Tutt\'uno con le Ombre', 'In un\'area di luce fioca o di oscurità puoi usare l\'azione per diventare invisibile, finché non ti muovi, compi un\'azione o una reazione.', 5],
      ['vigore', 'Vigore Immondo', 'Lanci Vita Falsata su te stesso a volontà, come incantesimo di 1° livello, senza slot.'],
      ['reami-lontani', 'Visione dei Reami Lontani', 'Lanci Occhio Arcano a volontà, senza slot.', 15],
      ['visioni-velate', 'Visioni Velate', 'Lanci Immagine Silenziosa a volontà, senza slot.'],
      ['vista-diavolo', 'Vista del Diavolo', 'Vedi normalmente nell\'oscurità, anche magica, fino a 36 m.'],
      ['vista-occulto', 'Vista dell\'Occulto', 'Lanci Individuazione del Magico a volontà, senza slot.'],
      ['vista-stregata', 'Vista Stregata', 'Vedi la vera forma di qualsiasi mutaforma o creatura celata da magie di illusione o trasmutazione, se è entro 9 m da te e in linea di vista.', 15],
      ['voce-catene', 'Voce del Signore delle Catene', 'Comunichi telepaticamente col tuo famiglio e percepisci attraverso i suoi sensi (purché siate sullo stesso piano); mentre lo fai puoi parlare con la tua voce attraverso di lui.', 1, 'catena']
    ]),
    S('terreno', 'druido', 'terra', 'Terreno del Circolo', 3, () => 1, 'Ti dà quattro livelli di incantesimi sempre preparati (3°, 5°, 7°, 9°).', D.TERRENI.map((t) => [t[0], t[1], 'Incantesimi del circolo del terreno ' + t[1].toLowerCase() + '.']))
  ];
  const CAMBIO = 'Regola del manuale: a ogni livello guadagnato puoi sostituire una scelta già fatta. L\'app la applica: le scelte fatte al livello attuale si cambiano liberamente, le altre una per livello. Per ignorare la regola attiva "Modifica libera" nella scheda Classe.';
  const avv = (id, t) => { D.SCELTE.find((g) => g.id === id).avviso = t; };
  avv('suppliche', 'Testi e prerequisiti confrontati con il manuale (pp. 118–119). ' + CAMBIO);
  D.AVVISO_CAMBIO = CAMBIO;
  /* gruppi che valgono per i livelli della classe (e sottoclasse) del personaggio */
  D.scelteDi = function (k) {
    return D.SCELTE.filter((g) => g.cl === k.id && k.livello >= g.da && (!g.sub || (k.sottoclasseAttiva && k.sub && k.sub.id === g.sub)));
  };
  /* opzioni selezionabili adesso (livello e patto) */
  D.opzioniScelta = function (g, k, ch) {
    const patto = ((ch.scelte || {}).patto || [])[0];
    return g.opz.map((o) => ({ id: o[0], nome: o[1], desc: o[2], liv: o[3] || 0, patto: o[4] || '', truc: o[5] || '' }))
      .map((o) => Object.assign(o, { ok: k.livello >= o.liv && (!o.patto || patto === o.patto) && (!o.truc || (((ch.inc || {})[k.id] || {}).truc || []).includes(o.truc)) }));
  };
})(typeof window !== 'undefined' ? window : globalThis);
