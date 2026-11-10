/* Calderone Omnicomprensivo di Tasha (con errata ITA 08/2022): opzioni di personaggio.
   Tutto ciò che è di questo manuale (fonte: 'tce') è attivo solo se il personaggio ha il manuale attivo (ch.fonti.tce, casella all'inizio della creazione).
   Testi in parole nostre (sintesi), nomi e numeri dal manuale italiano. */
(function (G) {
  const D = G.DND;
  const F = (liv, nome, desc) => [liv, nome, desc];
  const SUB = (id, nome, extra) => Object.assign({ id, nome, tratti: [], fonte: 'tce' }, extra || {});
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const ALIAS = { 'lama roboante': 'lama tonante', 'santuario privato di mordenkainen': 'santuario privato', 'scrigno segreto di leomund': 'scrigno segreto', 'segugio fedele di mordenkainen': 'segugio fedele', 'sfera elastica di otiluke': 'sfera elastica', 'parola curativa': 'parola guaritrice', 'parola curativa di massa': 'parola guaritrice di massa', 'freccia acida di melf': 'freccia acida' };
  /* nome (italiano) → id dell'incantesimo; null se non presente nel programma */
  const idDa = (nome) => {
    const n = ALIAS[norm(nome)] || norm(nome);
    let s = D.INCANTESIMI.find((x) => norm(x.nome) === n) || D.INCANTESIMI.find((x) => norm(x.nome).replace(/ \(.*$/, '') === n) || D.INCANTESIMI.find((x) => norm(x.nome).startsWith(n));
    return s ? s.id : null;
  };
  const ids = (...nomi) => nomi.map(idDa).filter(Boolean);
  D.TASHA_MANCANTI = [];
  const ids2 = (...nomi) => nomi.map((n) => { const i = idDa(n); if (!i) D.TASHA_MANCANTI.push(n); return i; }).filter(Boolean);

  /* =====================  ARTEFICE  ===================== */
  const LISTA_ART = {
    0: ['Fiotto Acido', 'Lama Roboante', 'Creare Falò', 'Luci Danzanti', 'Dardo di Fuoco', 'Morsa del Gelo', 'Lama Verdefiamma', 'Guida', 'Luce', 'Lenza Elettrizzante', 'Mano Magica', 'Pietra Magica', 'Riparare', 'Messaggio', 'Spruzzo Velenoso', 'Prestidigitazione', 'Raggio di Gelo', 'Resistenza', 'Stretta Folgorante', 'Salvare i Morenti', 'Turbine di Spade', 'Frusta di Spine', 'Rombo di Tuono'],
    1: ['Assorbire Elementi', 'Allarme', 'Catapulta', 'Cura Ferite', 'Individuazione del Magico', 'Camuffare Se Stesso', 'Ritirata Rapida', 'Luminescenza', 'Vita Falsata', 'Caduta Morbida', 'Unto', 'Identificare', 'Saltare', 'Passo Veloce', 'Purificare Cibo e Bevande', 'Santuario', 'Trabocchetto', 'Miscela Caustica di Tasha'],
    2: ['Aiuto', 'Alterare Se Stesso', 'Arma Magica', 'Bocca Magica', 'Caratteristica Potenziata', 'Fiamma Perenne', 'Ingrandire/Ridurre', 'Invisibilità', 'Levitazione', 'Movimenti del Ragno', 'Pirotecnica', 'Protezione dai Veleni', 'Ragnatela', 'Riscaldare il Metallo', 'Ristorare Inferiore', 'Scritta Celeste', 'Scurovisione', 'Serratura Arcana', 'Sfocatura', 'Trucco della Corda', 'Vedere Invisibilità'],
    3: ['Arma Elementale', 'Camminare sull’Acqua', 'Creare Cibo e Acqua', 'Dissolvi Magie', 'Fortezza della Mente', 'Frecce Infuocate', 'Glifo di Interdizione', 'Intermittenza', 'Protezione dall’Energia', 'Respirare sott’Acqua', 'Rinascita', 'Servitore Minuscolo', 'Sonnellino', 'Velocità', 'Volare'],
    4: ['Anatema Elementale', 'Evoca Costrutto', 'Fabbricare', 'Libertà di Movimento', 'Occhio Arcano', 'Pelle di Pietra', 'Santuario Privato di Mordenkainen', 'Scolpire Pietra', 'Scrigno Segreto di Leomund', 'Segugio Fedele di Mordenkainen', 'Sfera Elastica di Otiluke'],
    5: ['Abilità Potenziata', 'Animare Oggetti', 'Creazione', 'Mano di Bigby', 'Muro di Pietra', 'Ristorare Superiore', 'Trasmutare Roccia'],
  };
  /* aggiunge 'artefice' alla lista di classi degli incantesimi (si aggiorna anche l'indice D.INC_PER_ID) */
  Object.keys(LISTA_ART).forEach((lv) => LISTA_ART[lv].forEach((n) => {
    const id = idDa(n);
    if (!id) { D.TASHA_MANCANTI.push('[artefice] ' + n); return; }
    const s = D.INC_PER_ID[id]; if (s && !s.classi.includes('artefice')) s.classi = s.classi.concat('artefice');
  }));
  D.TRUCCHETTI.artefice = [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4];
  D.INC_SUB_LIV.artefice = [3, 5, 9, 13, 17];
  D.INC_SUB['artefice/alchimista'] = [ids2('Parola Curativa', 'Raggio di Infermità'), ids2('Sfera Infuocata', 'Freccia Acida di Melf'), ids2('Forma Gassosa', 'Parola Curativa di Massa'), ids2('Inaridire', 'Interdizione alla Morte'), ids2('Nube Mortale', 'Rianimare Morti')];
  D.INC_SUB['artefice/armaiolo'] = [ids2('Dardo Incantato', 'Onda Tonante'), ids2('Frantumare', 'Immagine Speculare'), ids2('Fulmine', 'Trama Ipnotica'), ids2('Invisibilità Superiore', 'Scudo di Fuoco'), ids2('Muro di Forza', 'Passapareti')];
  D.INC_SUB['artefice/artigliere'] = [ids2('Onda Tonante', 'Scudo'), ids2('Frantumare', 'Raggio Rovente'), ids2('Palla di Fuoco', 'Muro di Vento'), ids2('Muro di Fuoco', 'Tempesta di Ghiaccio'), ids2('Cono di Freddo', 'Muro di Forza')];
  D.INC_SUB['artefice/fabbro'] = [ids2('Eroismo', 'Scudo'), ids2('Punizione Marchiante', 'Vincolo di Interdizione'), ids2('Aura di Vitalità', 'Evoca Raffica'), ids2('Aura di Purezza', 'Scudo di Fuoco'), ids2('Cura Ferite di Massa', 'Punizione Esiliante')];

  const T_ART = [
    F(1, 'Invenzione Magica', 'Con arnesi da scasso o strumenti da artigiano in mano, con un\'azione dai a un oggetto Minuscolo non magico una proprietà a scelta: luce (1,5 m + 1,5 m), un messaggio registrato di 6 secondi, un suono o odore continuo, oppure un effetto visivo statico. Dura finché non la termini; puoi incantare un numero di oggetti pari al mod. Intelligenza (minimo 1).'),
    F(1, 'Lancio di Incantesimi', 'Incantatore a metà (arrotondato per eccesso) con Intelligenza; prepari Int + metà livello da artefice (minimo 1) dalla lista da artefice. Come focus usi arnesi da scasso o strumenti da artigiano di cui sei competente (dal 2° anche un oggetto con una tua infusione). Puoi lanciare come rituali gli incantesimi rituali preparati.'),
    F(2, 'Infondere negli Oggetti', 'Impari infusioni (4 al 2°, poi 6, 8, 10 e 12 al 6°, 10°, 14°, 18°) e dopo ogni riposo lungo puoi infondere oggetti non magici, fino al massimo di oggetti infusi (2 al 2°, poi 3, 4, 5, 6). Ogni oggetto ha una sola infusione e può essere infuso una volta sola; a ogni livello puoi sostituire un\'infusione.'),
    F(3, 'Lo Strumento Più Adatto', 'Con arnesi da scasso o strumenti da artigiano crei in 1 ora, entro 1,5 m, un set di strumenti da artigiano non magico (svanisce quando lo ripeti).'),
    F(6, 'Maestria negli Strumenti', 'Il bonus di competenza raddoppia nelle prove fatte con strumenti in cui sei competente.'),
    F(7, 'Lampo di Genio', 'Reazione: tu o una creatura entro 9 m che vedi aggiungete il tuo mod. Intelligenza a una prova di caratteristica o a un TS (mod. Int volte, minimo 1, per riposo lungo).'),
    F(10, 'Adepto degli Oggetti Magici', 'Puoi sintonizzarti con 4 oggetti magici; creare oggetti magici comuni o non comuni richiede un quarto del tempo e metà del costo.'),
    F(11, 'Oggetto che Custodisce l\'Incantesimo', 'Dopo un riposo lungo custodisci in un\'arma semplice o da guerra (o in un oggetto-focus) un incantesimo da artefice di 1° o 2° livello con tempo di lancio di 1 azione. Chi lo impugna può usarlo (con la tua caratteristica da incantatore) un numero di volte pari al doppio del mod. Intelligenza (minimo 2).'),
    F(14, 'Sapiente degli Oggetti Magici', 'Puoi sintonizzarti con 5 oggetti magici e ignori i requisiti di classe, razza, incantesimo e livello per usarli.'),
    F(18, 'Maestro degli Oggetti Magici', 'Puoi sintonizzarti con 6 oggetti magici.'),
    F(20, 'Anima dell\'Artificio', '+1 ai TS per ogni oggetto magico in sintonia; se scendi a 0 PF ma sei vivo, con una reazione termini un\'infusione e resti a 1 PF.'),
  ];
  D.CLASSI.push({
    id: 'artefice', nome: 'Artefice', fonte: 'tce', dado: 8, salvezze: ['cos', 'int'], nAbilita: 2,
    abilitaOpz: ['arcano', 'indagare', 'medicina', 'natura', 'percezione', 'rapidita', 'storia'],
    armi: ['semplice'], armature: ['leggere', 'medie', 'scudi'], asi: [4, 8, 12, 16, 19],
    incantatore: { tipo: 'meta', su: true, car: 'int', preparati: true, trucchetti: 'artefice' },
    priorita: ['int', 'cos', 'des', 'sag', 'for', 'car'],
    consiglio: 'Intelligenza per incantesimi, CD e privilegi (Lampo di Genio, infusioni). Costituzione per i PF e la concentrazione; Destrezza per la CA (armature leggere/medie) e le armi a distanza.',
    sottoclasse: { livello: 3, titolo: 'Specializzazione da Artefice', opzioni: [SUB('alchimista', 'Alchimista'), SUB('armaiolo', 'Armaiolo'), SUB('artigliere', 'Artigliere'), SUB('fabbro', 'Fabbro da Battaglia')] },
    tratti: T_ART,
  });
  const TS = {
    'artefice/alchimista': [
      F(3, 'Competenza negli Strumenti', 'Competenza nelle scorte da alchimista (o in un altro strumento da artigiano, se già ce l\'hai).'),
      F(3, 'Elisir Sperimentale', 'Dopo un riposo lungo crei un elisir toccando un\'ampolla vuota (e uno in più per ogni slot di 1° livello o superiore speso; 2 elisir dal 6°, 3 dal 15°). Effetto a caso su d6: 1 Guarigione 2d4 + Int; 2 Rapidità: velocità +3 m per 1 ora; 3 Resilienza: +1 CA per 10 minuti; 4 Coraggio: un d4 da sommare a ogni tiro per colpire e TS per 1 minuto; 5 Volo: velocità di volo 3 m per 10 minuti; 6 Trasformazione: come Alterare Se Stesso (10 minuti). Dura fino a quando viene bevuto o al tuo prossimo riposo lungo.'),
      F(5, 'Alchimico Sapiente', 'Quando lanci un incantesimo con le scorte da alchimista come focus, aggiungi il mod. Intelligenza (minimo +1) a un tiro di cura o ai danni da acido, fuoco, necrotici o veleno.'),
      F(9, 'Reagenti Ristorativi', 'Chi beve un tuo elisir ottiene 2d6 + mod. Int PF temporanei. Lanci Ristorare Inferiore senza slot né preparazione (mod. Int volte per riposo lungo).'),
      F(15, 'Maestria nella Chimica', 'Resistenza ai danni da acido e veleno e immunità all\'avvelenamento. Lanci Ristorare Superiore e Cura Ferite senza slot, preparazione né componenti (una volta ciascuno per riposo lungo).'),
    ],
    'artefice/armaiolo': [
      F(3, 'Strumenti del Mestiere', 'Competenza nelle armature pesanti e negli strumenti da fabbro (o in un altro strumento da artigiano, se già ce l\'hai).'),
      F(3, 'Armatura Arcana', 'Con un\'azione, impugnando gli strumenti da fabbro, trasformi l\'armatura che indossi in armatura arcana: nessun requisito di Forza, vale come focus per gli incantesimi da artefice, si attacca a te e non può essere rimossa contro la tua volontà, si espande a coprire tutto il corpo (l\'elmo si mette e toglie con un\'azione bonus), sostituisce eventuali arti mancanti. La togli o indossi con un\'azione. Resta arcana finché non ne indossi un\'altra o muori.'),
      F(3, 'Modello di Armatura', 'Scegli Guardiano o Infiltrato (cambi a ogni riposo breve o lungo, impugnando gli strumenti da fabbro). L\'arma speciale del modello usa il tuo mod. Intelligenza per colpire e per i danni, al posto di Forza o Destrezza. GUARDIANO — Guanti del Tuono: i guanti contano come armi da mischia semplici, 1d8 danni da tuono; la creatura colpita ha svantaggio ai tiri per colpire contro bersagli diversi da te fino all\'inizio del tuo turno successivo. Campo Difensivo: azione bonus, ottieni PF temporanei pari al tuo livello da artefice (sostituiscono quelli che hai; svaniscono se togli l\'armatura), un numero di volte pari al bonus di competenza per riposo lungo. INFILTRATO — Lanciatore di Fulmini: arma a distanza semplice, gittata 27/90 m, 1d6 fulmine; una volta per turno il colpo infligge 1d6 fulmine extra a una creatura. Passi Potenziati: velocità +1,5 m. Campo di Attenuazione: vantaggio alle prove di Destrezza (Furtività); se l\'armatura dà svantaggio, vantaggio e svantaggio si annullano.'),
      F(5, 'Attacco Extra', 'Due attacchi con l\'azione di Attacco.'),
      F(9, 'Modifiche all\'Armatura', 'L\'armatura arcana conta come quattro oggetti separati per le infusioni (corazza, stivali, elmo, arma speciale), ognuno infondibile; se cambi modello l\'infusione dell\'arma speciale si trasferisce. Il massimo di oggetti infusi aumenta di 2, ma gli oggetti extra devono far parte dell\'armatura arcana.'),
      F(15, 'Armatura Perfezionata', 'GUARDIANO — Presa Magnetica: reazione quando una creatura Grande o più piccola termina il turno entro 9 m e che vedi: TS Forza (CD incantesimi) o viene attirata di 9 m verso di te in uno spazio libero; se arriva entro 1,5 m puoi sferrarle un attacco con l\'arma da mischia semplice. Usi pari al bonus di competenza per riposo lungo. INFILTRATO — Chi subisce danni da fulmine dal Lanciatore brilla fino all\'inizio del tuo turno successivo: la creatura emette luce fioca (1,5 m) e ha svantaggio ai tiri per colpire contro di te; il tuo successivo tiro per colpire contro di essa ha vantaggio e, se colpisce, infligge 1d6 fulmine extra.'),
    ],
    'artefice/artigliere': [
      F(3, 'Competenza negli Strumenti', 'Competenza negli strumenti da intagliatore (o in un altro strumento da artigiano, se già ce l\'hai).'),
      F(3, 'Cannone Occulto', 'Con un\'azione (strumenti da intagliatore o da fabbro) crei un cannone Piccolo o Minuscolo entro 1,5 m: oggetto magico CA 18, PF = 5 × livello da artefice, immune a veleno e psichici, TS e prove con tutti i punteggi a 10; Riparare gli ridà 2d6 PF; scompare a 0 PF o dopo 1 ora, o se lo elimini con un\'azione. Dopo averlo creato non puoi ripetere l\'azione fino a un riposo lungo, a meno di spendere uno slot. Un solo cannone alla volta. Scegli il tipo; con un\'azione bonus (entro 18 m) lo attivi e puoi farlo spostare di 4,5 m: Balista della Forza (attacco a distanza con incantesimo, 36 m, 2d8 forza e spinta di 1,5 m), Lanciafiamme (cono 4,5 m, TS Des, 2d8 fuoco, metà se superato; incendia oggetti infiammabili) o Protettore (a te e a chi scegli entro 3 m: 1d8 + mod. Int PF temporanei, minimo +1).'),
      F(5, 'Arma da Fuoco Arcana', 'Dopo un riposo lungo, con gli strumenti da intagliatore incidi sigilli su una bacchetta, un bastone o una verga: diventa la tua arma da fuoco arcana (focus per i tuoi incantesimi da artefice). Quando lanci un incantesimo con essa, tira 1d8 e aggiungilo a un tiro per i danni dell\'incantesimo.'),
      F(9, 'Cannone Esplosivo', 'I tiri per i danni del cannone aumentano di 1d8. Con un\'azione puoi farlo esplodere (entro 18 m): ogni creatura entro 6 m fa un TS Destrezza (CD incantesimi), 3d8 danni da forza, metà se superato; il cannone è distrutto.'),
      F(15, 'Posizione Fortificata', 'Tu e i tuoi alleati entro 3 m da un tuo cannone avete mezza copertura. Puoi avere due cannoni insieme: li crei con la stessa azione (non con lo stesso slot) e li attivi con la stessa azione bonus; possono essere diversi.'),
    ],
    'artefice/fabbro': [
      F(3, 'Competenza negli Strumenti', 'Competenza negli strumenti da fabbro (o in un altro strumento da artigiano, se già ce l\'hai).'),
      F(3, 'Pronto per la Battaglia', 'Competenza nelle armi da guerra; con un\'arma magica usi Intelligenza al posto di Forza o Destrezza per colpire e per i danni.'),
      F(3, 'Difensore d\'Acciaio', 'Crei un costrutto compagno (CA 15, PF = 2 + Int + 5 × livello da artefice, velocità 12 m): condivide la tua iniziativa e agisce dopo di te, fa Schivata se non gli ordini altro con un\'azione bonus. Attacco Squarcio Rinforzato 1d8 + BC forza, Riparazione (3/giorno, 2d8 + BC PF), reazione Devia Attacco (svantaggio a chi attacca un altro bersaglio entro 1,5 m). Se muore lo rianimi con strumenti da fabbro e uno slot; ne crei uno nuovo dopo un riposo lungo.'),
      F(5, 'Attacco Extra', 'Due attacchi con l\'azione di Attacco.'),
      F(9, 'Scossa Arcana', 'Quando tu (con arma magica) o il difensore colpite: 2d6 danni da forza extra oppure 2d6 PF a una creatura o oggetto entro 9 m dal bersaglio (mod. Int volte per riposo lungo, una volta per turno).'),
      F(15, 'Difensore Migliorato', 'Scossa Arcana a 4d6; il difensore ha +2 CA e, con Devia Attacco, infligge all\'attaccante 1d4 + Int danni da forza.'),
    ],
  };
  Object.keys(TS).forEach((k) => { D.TRATTI_SUB[k] = TS[k]; });
  /* assegna i privilegi alle sottoclassi Tasha (sottoclassi.js è già stato eseguito) */
  D.tashaAssegnaTratti = () => D.CLASSI.forEach((c) => { if (c.sottoclasse) c.sottoclasse.opzioni.forEach((o) => { const k = c.id + '/' + o.id; if (o.fonte && D.TRATTI_SUB[k]) o.tratti = D.TRATTI_SUB[k]; }); });

  /* Infusioni: [id, nome, descrizione, livello minimo] */
  const INF = [
    ['anello-ricarica', 'Anello Ricarica Incantesimi', 'Anello (sintonia). Con un\'azione chi lo indossa recupera uno slot incantesimo speso di 3° livello o inferiore; poi è inutilizzabile fino all\'alba.', 6],
    ['arma-migliorata', 'Arma Migliorata', 'Arma semplice o da guerra. +1 a colpire e ai danni (+2 dal 10° livello da artefice).'],
    ['arma-splendente', 'Arma Splendente', 'Arma semplice o da guerra (sintonia). +1 a colpire e ai danni; azione bonus per accendere o spegnere una luce (9 m + 9 m). 4 cariche: reazione dopo essere stato colpito per accecare l\'attaccante (TS Cos); recupera 1d4 cariche all\'alba.', 6],
    ['armatura-forza', 'Armatura della Forza Magica', 'Armatura (sintonia). 6 cariche: aggiungi il mod. Intelligenza a una prova o un TS di Forza, o evita di cadere prono (reazione). Recupera 1d6 cariche all\'alba.'],
    ['armatura-propulsione', 'Armatura a Propulsione Arcana', 'Armatura (sintonia). Velocità +1,5 m; guanti-arma da lancio 1d8 forza (gittata 6/18 m) che tornano da soli; non si toglie contro la tua volontà e sostituisce arti mancanti.', 14],
    ['armatura-resistente', 'Armatura Resistente', 'Armatura (sintonia). Resistenza a un tipo di danno scelto all\'infusione (acido, freddo, fuoco, forza, fulmine, necrotico, veleno, psichico, radioso, tuono).', 6],
    ['colpo-ripetuto', 'Colpo Ripetuto', 'Arma con munizioni (sintonia). +1 a distanza, ignora la ricarica e produce da sola le munizioni magiche.'],
    ['difesa-migliorata', 'Difesa Migliorata', 'Armatura o scudo. +1 alla CA (+2 dal 10° livello da artefice).'],
    ['elmo-consapevolezza', 'Elmo della Consapevolezza', 'Elmo (sintonia). Vantaggio all\'iniziativa; chi lo indossa non può essere sorpreso se non è incapacitato.', 10],
    ['focus-arcano', 'Focus Arcano Migliorato', 'Verga, bastone o bacchetta (sintonia). +1 ai tiri per colpire con incantesimi (+2 dal 10°) e ignora la mezza copertura.'],
    ['mente-acuta', 'Mente Acuta', 'Armatura o veste. 4 cariche: reazione per riuscire a un TS Cos di concentrazione; recupera 1d4 cariche all\'alba.'],
    ['rep-bacchetta-dei-segreti', 'Replica: Bacchetta dei segreti', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 2° livello.', 2],
    ['rep-bacchetta-di-individuazione-del-magico', 'Replica: Bacchetta di individuazione del magico', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 2° livello.', 2],
    ['rep-borsa-conservante', 'Replica: Borsa conservante', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 2° livello.', 2],
    ['rep-copricapo-del-respirare-sott-acqua', 'Replica: Copricapo del respirare sott\'acqua', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 2° livello.', 2],
    ['rep-corda-per-scalare', 'Replica: Corda per scalare', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 2° livello.', 2],
    ['rep-giara-alchemica', 'Replica: Giara alchemica', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 2° livello.', 2],
    ['rep-occhiali-della-notte', 'Replica: Occhiali della notte', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 2° livello.', 2],
    ['rep-pietre-parlanti', 'Replica: Pietre parlanti', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 2° livello.', 2],
    ['rep-anello-del-camminare-sull-acqua', 'Replica: Anello del camminare sull\'acqua', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 6° livello.', 6],
    ['rep-flauto-incantatore', 'Replica: Flauto incantatore', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 6° livello.', 6],
    ['rep-guanti-ladreschi', 'Replica: Guanti ladreschi', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 6° livello.', 6],
    ['rep-lanterna-della-rivelazione', 'Replica: Lanterna della rivelazione', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 6° livello.', 6],
    ['rep-lenti-dello-charme', 'Replica: Lenti dello charme', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 6° livello.', 6],
    ['rep-mantello-della-manta', 'Replica: Mantello della manta', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 6° livello.', 6],
    ['rep-mantello-elfico', 'Replica: Mantello elfico', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 6° livello.', 6],
    ['rep-stivali-elfici', 'Replica: Stivali elfici', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 6° livello.', 6],
    ['rep-anello-del-saltare', 'Replica: Anello del saltare', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-anello-di-scudo-mentale', 'Replica: Anello di scudo mentale', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-bracciali-dell-arciere', 'Replica: Bracciali dell\'arciere', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-cappello-del-camuffamento', 'Replica: Cappello del camuffamento', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-collana-dell-adattamento', 'Replica: Collana dell\'adattamento', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-elmo-della-telepatia', 'Replica: Elmo della telepatia', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-faretra-di-ehlonna', 'Replica: Faretra di Ehlonna', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-fascia-dell-intelletto', 'Replica: Fascia dell\'intelletto', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-fermaglio-dello-scudo', 'Replica: Fermaglio dello scudo', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-flauto-dei-topi', 'Replica: Flauto dei topi', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-guanti-cattura-proiettili', 'Replica: Guanti cattura proiettili', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-guanti-del-nuotare-e-scalare', 'Replica: Guanti del nuotare e scalare', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-guanti-del-potere-orchesco', 'Replica: Guanti del potere orchesco', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-lenti-dell-aquila', 'Replica: Lenti dell\'aquila', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-mantello-della-protezione', 'Replica: Mantello della protezione', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-medaglione-dei-pensieri', 'Replica: Medaglione dei pensieri', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-pantofole-del-ragno', 'Replica: Pantofole del ragno', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-stivali-alati', 'Replica: Stivali alati', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-stivali-dell-inverno', 'Replica: Stivali dell\'inverno', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-stivali-molleggiati', 'Replica: Stivali molleggiati', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-talismano-della-rimarginazione', 'Replica: Talismano della rimarginazione', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 10° livello.', 10],
    ['rep-amuleto-della-salute', 'Replica: Amuleto della salute', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 14° livello.', 14],
    ['rep-anello-della-liberta-di-azione', 'Replica: Anello della libertà di azione', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 14° livello.', 14],
    ['rep-anello-dell-ariete', 'Replica: Anello dell\'ariete', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 14° livello.', 14],
    ['rep-anello-di-protezione', 'Replica: Anello di protezione', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 14° livello.', 14],
    ['rep-bracciali-della-difesa', 'Replica: Bracciali della difesa', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 14° livello.', 14],
    ['rep-cintura-della-forza-dei-giganti-delle-colline', 'Replica: Cintura della forza dei giganti delle colline', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 14° livello.', 14],
    ['rep-corno-della-distruzione', 'Replica: Corno della distruzione', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 14° livello.', 14],
    ['rep-gemma-della-visione', 'Replica: Gemma della visione', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 14° livello.', 14],
    ['rep-manette-dimensionali', 'Replica: Manette dimensionali', 'Replichi questo oggetto magico (nessuna sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 14° livello.', 14],
    ['rep-mantello-del-pipistrello', 'Replica: Mantello del pipistrello', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 14° livello.', 14],
    ['rep-stivali-della-levitazione', 'Replica: Stivali della levitazione', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 14° livello.', 14],
    ['rep-stivali-della-velocita', 'Replica: Stivali della velocità', 'Replichi questo oggetto magico (richiede sintonia; dettagli nella Dungeon Master\'s Guide). Tabella degli oggetti replicabili da artefice di 14° livello.', 14],
    ['ritorno-arma', 'Ritorno dell\'Arma', 'Arma da lancio. +1 a colpire e ai danni; dopo un attacco a distanza torna nella mano.'],
    ['scudo-repulsione', 'Scudo della Repulsione', 'Scudo (sintonia). +1 CA; 4 cariche: reazione dopo essere stato colpito in mischia per spingere l\'attaccante di 4,5 m. Recupera 1d4 cariche all\'alba.', 6],
    ['servo-omuncolo', 'Servo Omuncolo', 'Oggetto: gemma o cristallo da almeno 100 mo (il cuore della creatura). Costrutto Minuscolo: CA 13, PF = 1 + mod. Int + livello da artefice, velocità 6 m e volo 9 m, Elusione, immune a veleno. Condivide la tua iniziativa (agisce dopo di te) e fa solo Schivata, salvo ordini con un\'azione bonus. Colpo di Forza: attacco a distanza (9 m) con il tuo bonus d\'attacco degli incantesimi, 1d4 + BC forza. Reazione Incanalare Magia: infligge un tuo incantesimo a contatto (entro 36 m da te). Riparare gli ridà 2d6 PF; svanisce se muori tu o lui.'],
    ['stivali-sentiero', 'Stivali del Sentiero Tortuoso', 'Stivali (sintonia). Azione bonus: teletrasporto fino a 4,5 m in uno spazio già occupato nel turno.', 6],
  ];
  D.SCELTE.push({
    id: 'infusioni', cl: 'artefice', sub: null, nome: 'Infusioni dell\'Artefice', da: 2,
    n: (L) => (L >= 18 ? 12 : L >= 14 ? 10 : L >= 10 ? 8 : L >= 6 ? 6 : 4),
    nota: 'Dopo ogni riposo lungo puoi infondere fino a 2 oggetti (3 dal 6°, 4 dal 10°, 5 dal 14°, 6 dal 18°).',
    opz: INF, avviso: D.AVVISO_CAMBIO,
  });
  D.SCELTE.push({
    id: 'modello', cl: 'artefice', sub: 'armaiolo', nome: 'Modello di Armatura', da: 3, n: () => 1, nota: 'Puoi cambiarlo dopo ogni riposo breve o lungo.',
    opz: [
      ['guardiano', 'Guardiano', 'Guanti del Tuono: arma semplice da mischia, 1d8 tuono, il bersaglio ha svantaggio ad attaccare altri fino al tuo prossimo turno. Campo Difensivo: azione bonus, PF temporanei pari al livello da artefice (BC volte per riposo lungo).'],
      ['infiltrato', 'Infiltrato', 'Lanciatore di Fulmini: arma a distanza semplice (27/90 m), 1d6 fulmine più 1d6 extra una volta per turno. Passi Potenziati: velocità +1,5 m. Campo di Attenuazione: vantaggio alle prove di Furtività.'],
    ],
  });
  D.RIS_CLASSE = D.RIS_CLASSE || {};
  D.RIS_CLASSE.artefice = (c, mods) => {
    const L = c.livello; const n = c.def.nome; const out = [];
    out.push([n + ' – Invenzione Magica', 'oggetti incantati insieme: ' + Math.max(1, mods.int)]);
    if (L >= 2) out.push([n + ' – Infondere negli Oggetti', (L >= 18 ? 12 : L >= 14 ? 10 : L >= 10 ? 8 : L >= 6 ? 6 : 4) + ' infusioni conosciute, fino a ' + (L >= 18 ? 6 : L >= 14 ? 5 : L >= 10 ? 4 : L >= 6 ? 3 : 2) + ' oggetti infusi', L >= 18 ? 6 : L >= 14 ? 5 : L >= 10 ? 4 : L >= 6 ? 3 : 2]);
    return out;
  };
  D.EQUIP.artefice = { armatura: 'borchiato', scudo: false, armi: ['balestra leggera', 'pugnale'] };
  D.TASHA_PAG = Object.assign(D.TASHA_PAG || {}, { artefice: 9 });
  D.DESC.classe.artefice = 'Un inventore magico: lancia incantesimi tramite strumenti e congegni, infonde oggetti comuni di poteri magici e costruisce compagni meccanici o cannoni. Ottimo per chi ama ingegnarsi e dare una mano al gruppo.';
  Object.assign(D.DESC.sottoclasse, {
    'artefice/alchimista': 'Prepara elisir con effetti diversi, cura e fa danni con acidi e veleni.',
    'artefice/armaiolo': 'Trasforma l\'armatura in una seconda pelle magica: Guardiano in prima linea o Infiltrato furtivo.',
    'artefice/artigliere': 'Crea cannoni occulti (fuoco, forza o protezione) e incanala incantesimi distruttivi.',
    'artefice/fabbro': 'Combatte con un difensore d\'acciaio che lo protegge, e cura riparando e rianimando.',
  });
  D.tashaAssegnaTratti();
  D.TASHA = { versione: 1 };
})(typeof window !== 'undefined' ? window : globalThis);
