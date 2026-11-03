/* Generatore di PG D&D 5e – DATI DI GIOCO (Manuale del Giocatore)
   Tutti i testi sono sintesi originali: modificali liberamente per allinearli alla tua localizzazione.
   Per aggiungere contenuti di altri manuali basta aggiungere voci agli array qui sotto. */
(function (G) {
  const D = (G.DND = G.DND || {});

  D.ABIL = ['for', 'des', 'cos', 'int', 'sag', 'car'];
  D.ABIL_NOME = { for: 'Forza', des: 'Destrezza', cos: 'Costituzione', int: 'Intelligenza', sag: 'Saggezza', car: 'Carisma' };
  D.ABIL_SIGLA = { for: 'FOR', des: 'DES', cos: 'COS', int: 'INT', sag: 'SAG', car: 'CAR' };

  D.ABILITA = [
    { id: 'acrobazia', nome: 'Acrobazia', car: 'des' },
    { id: 'addestrare', nome: 'Addestrare Animali', car: 'sag' },
    { id: 'arcano', nome: 'Arcano', car: 'int' },
    { id: 'atletica', nome: 'Atletica', car: 'for' },
    { id: 'furtivita', nome: 'Furtività', car: 'des' },
    { id: 'indagare', nome: 'Indagare', car: 'int' },
    { id: 'inganno', nome: 'Inganno', car: 'car' },
    { id: 'intimidire', nome: 'Intimidire', car: 'car' },
    { id: 'intrattenere', nome: 'Intrattenere', car: 'car' },
    { id: 'intuizione', nome: 'Intuizione', car: 'sag' },
    { id: 'medicina', nome: 'Medicina', car: 'sag' },
    { id: 'natura', nome: 'Natura', car: 'int' },
    { id: 'percezione', nome: 'Percezione', car: 'sag' },
    { id: 'persuasione', nome: 'Persuasione', car: 'car' },
    { id: 'rapidita', nome: 'Rapidità di Mano', car: 'des' },
    { id: 'religione', nome: 'Religione', car: 'int' },
    { id: 'sopravvivenza', nome: 'Sopravvivenza', car: 'sag' },
    { id: 'storia', nome: 'Storia', car: 'int' },
  ];

  D.ALLINEAMENTI = ['Legale Buono', 'Neutrale Buono', 'Caotico Buono', 'Legale Neutrale', 'Neutrale', 'Caotico Neutrale', 'Legale Malvagio', 'Neutrale Malvagio', 'Caotico Malvagio'];

  /* ---------- RAZZE ---------- */
  const TUTTE = { for: 1, des: 1, cos: 1, int: 1, sag: 1, car: 1 };
  D.RAZZE = [
    {
      id: 'umano', nome: 'Umano', velocita: 9, taglia: 'Media', bonus: TUTTE, lingue: ['Comune', 'una a scelta'],
      tratti: [['Versatilità', 'Ogni punteggio di caratteristica aumenta di 1.']],
    },
    {
      id: 'elfo', nome: 'Elfo', velocita: 9, taglia: 'Media', bonus: { des: 2 }, lingue: ['Comune', 'Elfico'], abilita: ['percezione'],
      tratti: [
        ['Scurovisione', 'Vedi al buio entro 18 m (luce fioca come luce, buio come luce fioca, solo in grigio).'],
        ['Sensi Acuti', 'Competenza in Percezione.'],
        ['Retaggio Fatato', 'Vantaggio ai TS contro charme; la magia non può farti addormentare.'],
        ['Trance', 'Meditazione di 4 ore al posto del sonno: ottieni gli stessi benefici di un riposo lungo.'],
      ],
      sub: [
        { id: 'alto', nome: 'Alto Elfo', bonus: { int: 1 }, incRazza: { car: 'int', lista: [], scelta: { liv: 1, lista: 'mago', cl: 'mago' } }, armi: ['Spada lunga', 'Spada corta', 'Arco corto', 'Arco lungo'], lingue: ['una a scelta'],
          tratti: [['Addestramento con le Armi Elfiche', 'Competenza con spada lunga, spada corta, arco corto e arco lungo.'], ['Trucchetto', 'Conosci un trucchetto da mago (Intelligenza come caratteristica).'], ['Lingua Extra', 'Conosci una lingua a scelta.']] },
        { id: 'boschi', nome: 'Elfo dei Boschi', bonus: { sag: 1 }, armi: ['Spada lunga', 'Spada corta', 'Arco corto', 'Arco lungo'], velocita: 10.5,
          tratti: [['Addestramento con le Armi Elfiche', 'Competenza con spada lunga, spada corta, arco corto e arco lungo.'], ['Piede Lesto', 'Velocità base di 10,5 m.'], ['Mimetismo Naturale', 'Puoi nasconderti anche solo con foglie, pioggia, neve o simili.']] },
        { id: 'drow', nome: 'Elfo Oscuro (Drow)', bonus: { car: 1 }, incRazza: { car: 'car', lista: [{ id: 'luci-danzanti', liv: 1 }, { id: 'luminescenza', liv: 3, uso: 1 }, { id: 'oscurita', liv: 5, uso: 1 }] }, armi: ['Stocco', 'Spada corta', 'Balestra a mano'], scurovisione: 36,
          tratti: [['Scurovisione Superiore', 'Scurovisione di 36 m.'], ['Sensibilità alla Luce del Sole', 'Svantaggio a tiri per colpire e prove di Percezione basate sulla vista in piena luce solare.'], ['Magia Drow', 'Luci danzanti; dal 3° livello Fuoco fatato; dal 5° Oscurità (1/riposo lungo ciascuno, Carisma).'], ['Addestramento con le Armi Drow', 'Competenza con stocco, spada corta e balestra a mano.']] },
      ],
    },
    {
      id: 'nano', nome: 'Nano', velocita: 7.5, taglia: 'Media', bonus: { cos: 2 }, lingue: ['Comune', 'Nanico'],
      armi: ['Ascia', 'Ascia da battaglia', 'Martello leggero', 'Martello da guerra'],
      tratti: [
        ['Scurovisione', 'Vedi al buio entro 18 m.'],
        ['Resilienza Nanica', 'Vantaggio ai TS contro veleno e resistenza ai danni da veleno.'],
        ['Velocità Costante', 'La velocità non cala se indossi armature pesanti.'],
        ['Addestramento da Combattimento', 'Competenza con ascia, ascia da battaglia, martello leggero e martello da guerra.'],
        ['Competenza negli Strumenti', 'Competenza in uno strumento da artigiano a scelta (fabbro, birraio, scalpellino).'],
        ['Affinità con la Pietra', 'Doppio bonus di competenza nelle prove di Storia sull\'origine di opere in pietra.'],
      ],
      sub: [
        { id: 'colline', nome: 'Nano delle Colline', bonus: { sag: 1 }, pfLivello: 1, tratti: [['Robustezza Nanica', '+1 punto ferita massimo per ogni livello.']] },
        { id: 'montagne', nome: 'Nano delle Montagne', bonus: { for: 2 }, armature: ['leggere', 'medie'], tratti: [['Addestramento con le Armature Nanica', 'Competenza con armature leggere e medie.']] },
      ],
    },
    {
      id: 'halfling', nome: 'Halfling', velocita: 7.5, taglia: 'Piccola', bonus: { des: 2 }, lingue: ['Comune', 'Halfling'],
      tratti: [
        ['Fortunato', 'Quando ottieni 1 naturale su un d20 puoi ritirare il dado.'],
        ['Coraggioso', 'Vantaggio ai TS contro lo stato di spaventato.'],
        ['Agilità Halfling', 'Puoi muoverti attraverso lo spazio di creature più grandi.'],
      ],
      sub: [
        { id: 'piedelesto', nome: 'Halfling Piedelesto', bonus: { car: 1 }, tratti: [['Furtività Naturale', 'Puoi tentare di nasconderti dietro a creature almeno una taglia più grandi.']] },
        { id: 'tozzo', nome: 'Halfling Tozzo', bonus: { cos: 1 }, tratti: [['Resilienza dei Tozzi', 'Vantaggio ai TS contro veleno e resistenza ai danni da veleno.']] },
      ],
    },
    {
      id: 'dragonide', nome: 'Dragonide', velocita: 9, taglia: 'Media', bonus: { for: 2, car: 1 }, lingue: ['Comune', 'Draconico'], drago: true,
      tratti: [
        ['Discendenza Draconica', 'Scegli un drago cromatico o metallico: determina tipo di soffio e resistenza.'],
        ['Arma a Soffio', 'Azione: soffio a cono di 4,5 m o a linea di 1,5×9 m, secondo il drago. TS (Des o Cos) con CD 8 + mod. Cos + competenza; danni 2d6, che salgono a 3d6, 4d6 e 5d6 ai livelli 6, 11 e 16. Si ricarica con un riposo breve o lungo.'],
        ['Resistenza ai Danni', 'Resistenza al tipo di danno legato alla tua discendenza.'],
      ],
    },
    {
      id: 'gnomo', nome: 'Gnomo', velocita: 7.5, taglia: 'Piccola', bonus: { int: 2 }, lingue: ['Comune', 'Gnomesco'],
      tratti: [
        ['Scurovisione', 'Vedi al buio entro 18 m.'],
        ['Astuzia Gnomesca', 'Vantaggio ai TS di Intelligenza, Saggezza e Carisma contro la magia.'],
      ],
      sub: [
        { id: 'rocce', nome: 'Gnomo delle Rocce', bonus: { cos: 1 }, tratti: [['Conoscenza dell\'Artefice', 'Doppio bonus di competenza nelle prove di Storia su oggetti magici, alchemici o tecnologici.'], ['Inventore', 'Competenza negli strumenti da inventore; puoi costruire piccoli congegni.']] },
        { id: 'foreste', nome: 'Gnomo delle Foreste', bonus: { des: 1 }, incRazza: { car: 'int', lista: [{ id: 'illusione-minore', liv: 1 }] }, tratti: [['Illusionista Nato', 'Conosci il trucchetto Illusione minore (Intelligenza).'], ['Parlare con le Piccole Bestie', 'Comunichi concetti semplici a bestie piccole o più piccole.']] },
      ],
    },
    {
      id: 'mezzelfo', nome: 'Mezzelfo', velocita: 9, taglia: 'Media', bonus: { car: 2 }, bonusLiberi: { n: 2, valore: 1, escludi: ['car'] }, abilitaLibere: 2, lingue: ['Comune', 'Elfico', 'una a scelta'],
      tratti: [
        ['Scurovisione', 'Vedi al buio entro 18 m.'],
        ['Retaggio Fatato', 'Vantaggio ai TS contro charme; la magia non può farti addormentare.'],
        ['Versatilità nelle Abilità', 'Competenza in due abilità a tua scelta.'],
      ],
    },
    {
      id: 'mezzorco', nome: 'Mezzorco', velocita: 9, taglia: 'Media', bonus: { for: 2, cos: 1 }, lingue: ['Comune', 'Orchesco'], abilita: ['intimidire'],
      tratti: [
        ['Scurovisione', 'Vedi al buio entro 18 m.'],
        ['Minaccioso', 'Competenza in Intimidire.'],
        ['Resistenza Implacabile', 'Se scendi a 0 PF ma non muori sul colpo, torni a 1 PF (1/riposo lungo).'],
        ['Attacchi Selvaggi', 'Su un colpo critico in mischia tiri un dado di danno dell\'arma in più.'],
      ],
    },
    {
      id: 'tiefling', nome: 'Tiefling', velocita: 9, taglia: 'Media', bonus: { car: 2, int: 1 }, lingue: ['Comune', 'Infernale'],
      tratti: [
        ['Scurovisione', 'Vedi al buio entro 18 m.'],
        ['Resistenza Infernale', 'Resistenza ai danni da fuoco.'],
        ['Retaggio Infernale', 'Conosci Taumaturgia; dal 3° livello Ira infernale (1/riposo lungo, come 2° livello); dal 5° Oscurità. Carisma.'],
      ],
      incRazza: { car: 'car', lista: [{ id: 'taumaturgia', liv: 1 }, { id: 'intimorire-infernale', liv: 3, uso: 1, slot: 2 }, { id: 'oscurita', liv: 5, uso: 1 }] },
    },
  ];

  D.DRAGHI = [
    ['Nero', 'acido'], ['Blu', 'fulmine'], ['Ottone', 'fuoco'], ['Bronzo', 'fulmine'], ['Rame', 'acido'],
    ['Oro', 'fuoco'], ['Verde', 'veleno'], ['Rosso', 'fuoco'], ['Argento', 'freddo'], ['Bianco', 'freddo'],
  ];

  /* ---------- SFONDI ---------- */
  D.SFONDI = [
    { id: 'accolito', nome: 'Accolito', abilita: ['intuizione', 'religione'], altro: '2 lingue a scelta' },
    { id: 'artigiano', nome: 'Artigiano di Gilda', abilita: ['intuizione', 'persuasione'], altro: 'Strumenti da artigiano, 1 lingua' },
    { id: 'ciarlatano', nome: 'Ciarlatano', abilita: ['inganno', 'rapidita'], altro: 'Kit per il travestimento, kit del falsario' },
    { id: 'criminale', nome: 'Criminale', abilita: ['inganno', 'furtivita'], altro: 'Un gioco, strumenti da scasso' },
    { id: 'eremita', nome: 'Eremita', abilita: ['medicina', 'religione'], altro: 'Kit da erborista, 1 lingua' },
    { id: 'eroe', nome: 'Eroe del Popolo', abilita: ['addestrare', 'sopravvivenza'], altro: 'Strumenti da artigiano, veicoli terrestri' },
    { id: 'intrattenitore', nome: 'Intrattenitore', abilita: ['acrobazia', 'intrattenere'], altro: 'Kit per il travestimento, uno strumento musicale' },
    { id: 'marinaio', nome: 'Marinaio', abilita: ['atletica', 'percezione'], altro: 'Strumenti da navigatore, veicoli acquatici' },
    { id: 'nobile', nome: 'Nobile', abilita: ['storia', 'persuasione'], altro: 'Un gioco, 1 lingua' },
    { id: 'soldato', nome: 'Soldato', abilita: ['atletica', 'intimidire'], altro: 'Un gioco, veicoli terrestri' },
    { id: 'straniero', nome: 'Straniero', abilita: ['atletica', 'sopravvivenza'], altro: 'Uno strumento musicale, 1 lingua' },
    { id: 'sapiente', nome: 'Sapiente', abilita: ['arcano', 'storia'], altro: '2 lingue a scelta' },
    { id: 'monello', nome: 'Monello', abilita: ['rapidita', 'furtivita'], altro: 'Kit per il travestimento, strumenti da scasso' },
  ];

  /* ---------- ARMATURE ---------- */
  D.ARMATURE = [
    { id: 'nessuna', nome: 'Nessuna armatura', tipo: '', base: 10, max: 99 },
    { id: 'imbottita', nome: 'Imbottita', tipo: 'leggere', base: 11, max: 99, svant: true },
    { id: 'cuoio', nome: 'Cuoio', tipo: 'leggere', base: 11, max: 99 },
    { id: 'borchiato', nome: 'Cuoio borchiato', tipo: 'leggere', base: 12, max: 99 },
    { id: 'pelle', nome: 'Pelle', tipo: 'medie', base: 12, max: 2 },
    { id: 'giaco', nome: 'Giaco di maglia', tipo: 'medie', base: 13, max: 2 },
    { id: 'scaglie', nome: 'Corazza di scaglie', tipo: 'medie', base: 14, max: 2, svant: true },
    { id: 'pettorale', nome: 'Pettorale', tipo: 'medie', base: 14, max: 2 },
    { id: 'mezza', nome: 'Mezza armatura', tipo: 'medie', base: 15, max: 2, svant: true },
    { id: 'anelli', nome: 'Cotta di anelli', tipo: 'pesanti', base: 14, max: 0, svant: true },
    { id: 'maglia', nome: 'Cotta di maglia', tipo: 'pesanti', base: 16, max: 0, svant: true, forza: 13 },
    { id: 'strisce', nome: 'Corazza a strisce', tipo: 'pesanti', base: 17, max: 0, svant: true, forza: 15 },
    { id: 'piastre', nome: 'Armatura a piastre', tipo: 'pesanti', base: 18, max: 0, svant: true, forza: 15 },
  ];

  /* ---------- ARMI ---------- */
  const W = (id, nome, cat, tipo, dado, dtipo, prop) => ({ id, nome, cat, tipo, dado, dtipo, prop: prop || [] });
  D.ARMI = [
    W('pugno', 'Colpo senz\'armi', 'semplice', 'mischia', '1', 'contundenti'),
    W('bastone', 'Bastone ferrato', 'semplice', 'mischia', '1d6', 'contundenti', ['versatile 1d8']),
    W('clava', 'Clava', 'semplice', 'mischia', '1d4', 'contundenti', ['leggera']),
    W('pugnale', 'Pugnale', 'semplice', 'mischia', '1d4', 'perforanti', ['accurata', 'leggera', 'da lancio']),
    W('giavellotto', 'Giavellotto', 'semplice', 'mischia', '1d6', 'perforanti', ['da lancio']),
    W('ascia', 'Ascia', 'semplice', 'mischia', '1d6', 'taglienti', ['leggera', 'da lancio']),
    W('martello leggero', 'Martello leggero', 'semplice', 'mischia', '1d4', 'contundenti', ['leggera', 'da lancio']),
    W('mazza', 'Mazza', 'semplice', 'mischia', '1d6', 'contundenti'),
    W('lancia', 'Lancia', 'semplice', 'mischia', '1d6', 'perforanti', ['da lancio', 'versatile 1d8']),
    W('falcetto', 'Falcetto', 'semplice', 'mischia', '1d4', 'taglienti', ['leggera']),
    W('arco corto', 'Arco corto', 'semplice', 'distanza', '1d6', 'perforanti', ['munizioni', 'a due mani']),
    W('balestra leggera', 'Balestra leggera', 'semplice', 'distanza', '1d8', 'perforanti', ['munizioni', 'a due mani']),
    W('fionda', 'Fionda', 'semplice', 'distanza', '1d4', 'contundenti', ['munizioni']),
    W('dardo', 'Dardo', 'semplice', 'distanza', '1d4', 'perforanti', ['accurata', 'da lancio']),
    W('ascia da battaglia', 'Ascia da battaglia', 'da guerra', 'mischia', '1d8', 'taglienti', ['versatile 1d10']),
    W('spada corta', 'Spada corta', 'da guerra', 'mischia', '1d6', 'perforanti', ['accurata', 'leggera']),
    W('spada lunga', 'Spada lunga', 'da guerra', 'mischia', '1d8', 'taglienti', ['versatile 1d10']),
    W('stocco', 'Stocco', 'da guerra', 'mischia', '1d8', 'perforanti', ['accurata']),
    W('scimitarra', 'Scimitarra', 'da guerra', 'mischia', '1d6', 'taglienti', ['accurata', 'leggera']),
    W('martello da guerra', 'Martello da guerra', 'da guerra', 'mischia', '1d8', 'contundenti', ['versatile 1d10']),
    W('spadone', 'Spadone', 'da guerra', 'mischia', '2d6', 'taglienti', ['pesante', 'a due mani']),
    W('ascia bipenne', 'Ascia bipenne', 'da guerra', 'mischia', '1d12', 'taglienti', ['pesante', 'a due mani']),
    W('alabarda', 'Alabarda', 'da guerra', 'mischia', '1d10', 'taglienti', ['pesante', 'portata', 'a due mani']),
    W('frusta', 'Frusta', 'da guerra', 'mischia', '1d4', 'taglienti', ['accurata', 'portata']),
    W('arco lungo', 'Arco lungo', 'da guerra', 'distanza', '1d8', 'perforanti', ['munizioni', 'pesante', 'a due mani']),
    W('balestra a mano', 'Balestra a mano', 'da guerra', 'distanza', '1d6', 'perforanti', ['munizioni', 'leggera']),
    W('balestra pesante', 'Balestra pesante', 'da guerra', 'distanza', '1d10', 'perforanti', ['munizioni', 'pesante', 'a due mani']),
  ];

  D.STILI = [
    ['arcieria', 'Tiro con l\'Arco', '+2 ai tiri per colpire con armi a distanza.'],
    ['difesa', 'Difesa', '+1 alla CA mentre indossi un\'armatura.'],
    ['duellare', 'Duellare', '+2 ai danni con un\'arma a una mano se non impugni altro.'],
    ['possenti', 'Combattere con Armi Possenti', 'Ritira 1 e 2 sui dadi di danno con armi a due mani.'],
    ['protezione', 'Protezione', 'Con lo scudo, reazione per imporre svantaggio a chi attacca un alleato vicino.'],
    ['dueArmi', 'Combattere con Due Armi', 'Aggiungi il modificatore ai danni dell\'attacco con la seconda arma.'],
  ];

  D.TALENTI = ['Abile', 'Allerta', 'Atleta', 'Attore', 'Attaccabrighe', 'Combattente con Armi Possenti', 'Combattente con Due Armi', 'Combattente Montato', 'Difensore Doppio', 'Duellante Difensivo', 'Eredità Draconica', 'Esperto con le Balestre', 'Esperto con le Armi da Tiro', 'Fortunato', 'Guaritore', 'Iniziato alla Magia', 'Inseguitore', 'Lottatore', 'Maestro con le Armi Pesanti', 'Maestro d\'Armi', 'Maestro delle Armature Medie', 'Maestro delle Armature Pesanti', 'Maestro degli Scudi', 'Mobile', 'Osservatore', 'Perforante', 'Resiliente', 'Ritualista', 'Robusto', 'Sentinella', 'Seguace Elementale', 'Tiratore Scelto', 'Telecinetico', 'Telepate', 'Tocco Brutale', 'Vigoroso'];

  /* ---------- TABELLE INCANTESIMI ---------- */
  const COMPLETO = [[2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1]];
  D.SLOT_COMPLETO = COMPLETO;
  D.SLOT_PATTO = [[1, 1], [2, 1], [2, 2], [2, 2], [2, 3], [2, 3], [2, 4], [2, 4], [2, 5], [2, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [4, 5], [4, 5], [4, 5], [4, 5]]; // [slot, livello]
  const arr = (...r) => r;
  const T = (rangeArr) => { const out = []; rangeArr.forEach(([da, a, v]) => { for (let l = da; l <= a; l++) out[l - 1] = v; }); return out; };
  D.TRUCCHETTI = {
    bardo: T([[1, 3, 2], [4, 9, 3], [10, 20, 4]]),
    chierico: T([[1, 3, 3], [4, 9, 4], [10, 20, 5]]),
    druido: T([[1, 3, 2], [4, 9, 3], [10, 20, 4]]),
    mago: T([[1, 3, 3], [4, 9, 4], [10, 20, 5]]),
    stregone: T([[1, 3, 4], [4, 9, 5], [10, 20, 6]]),
    warlock: T([[1, 3, 2], [4, 9, 3], [10, 20, 4]]),
    terzo: T([[1, 2, 0], [3, 9, 2], [10, 20, 3]]),
  };
  D.CONOSCIUTI = {
    bardo: arr(4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22),
    stregone: arr(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15),
    warlock: arr(2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15),
    ranger: arr(0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11),
    terzo: arr(0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13),
  };

  /* ---------- CLASSI ---------- */
  const STD_ASI = [4, 8, 12, 16, 19];
  const F = (liv, nome, desc) => [liv, nome, desc];
  const SUB = (id, nome, extra) => Object.assign({ id, nome, tratti: [] }, extra || {});

  D.CLASSI = [
    {
      id: 'barbaro', nome: 'Barbaro', dado: 12, salvezze: ['for', 'cos'], nAbilita: 2,
      abilitaOpz: ['addestrare', 'atletica', 'intimidire', 'natura', 'percezione', 'sopravvivenza'],
      armi: ['semplice', 'da guerra'], armature: ['leggere', 'medie', 'scudi'], asi: STD_ASI,
      priorita: ['for', 'cos', 'des', 'sag', 'car', 'int'],
      consiglio: 'Forza per colpire e fare danni, Costituzione per i PF (senza armatura CA = 10 + Des + Cos). Intelligenza può essere la caratteristica più bassa senza problemi.',
      sottoclasse: { livello: 3, titolo: 'Cammino Primordiale', opzioni: [SUB('berserker', 'Via del Berserker'), SUB('totemico', 'Via del Guerriero Totemico')] },
      tratti: [
        F(1, 'Ira', 'Azione bonus: vantaggio alle prove e ai TS di Forza, bonus ai danni in mischia con Forza, resistenza a contundenti/perforanti/taglienti. Non puoi lanciare incantesimi. Dura 1 minuto.'),
        F(1, 'Difesa Senza Armatura', 'Senza armatura CA = 10 + mod. Des + mod. Cos (lo scudo è permesso).'),
        F(2, 'Attacco Irruento', 'Puoi attaccare con Forza con vantaggio, ma i nemici hanno vantaggio contro di te fino al tuo prossimo turno.'),
        F(2, 'Percezione del Pericolo', 'Vantaggio ai TS su Destrezza contro effetti che puoi vedere (non se accecato, assordato o incapacitato).'),
        F(5, 'Attacco Extra', 'Due attacchi con l\'azione di Attacco.'),
        F(5, 'Movimento Veloce', '+3 m di velocità se non indossi armatura pesante.'),
        F(7, 'Istinto Ferino', 'Vantaggio all\'iniziativa; se sei sorpreso puoi agire entrando in Ira.'),
        F(9, 'Critico Brutale', 'Un dado di danno extra sui critici in mischia (2 a lv 13, 3 a lv 17).'),
        F(11, 'Ira Implacabile', 'Se scendi a 0 PF in Ira, TS Cos CD 10 per restare a 1 PF. Ogni volta dopo la prima la CD sale di 5 (torna a 10 dopo un riposo).'),
        F(15, 'Ira Persistente', 'L\'Ira termina prematuramente solo se sei incosciente o scegli di terminarla.'),
        F(18, 'Forza Indomita', 'Se il totale di una prova di Forza è inferiore al tuo punteggio, usa il punteggio.'),
        F(20, 'Campione Primordiale', 'Forza e Costituzione +4 (massimo 24).'),
      ],
    },
    {
      id: 'bardo', nome: 'Bardo', dado: 8, salvezze: ['des', 'car'], nAbilita: 3, abilitaOpz: 'tutte',
      armi: ['semplice', 'Balestra a mano', 'Spada lunga', 'Stocco', 'Spada corta'], armature: ['leggere'], asi: STD_ASI,
      maestria: { 3: 2, 10: 2 },
      incantatore: { tipo: 'completo', car: 'car', conosciuti: 'bardo', trucchetti: 'bardo' },
      priorita: ['car', 'des', 'cos', 'sag', 'int', 'for'],
      consiglio: 'Carisma è il cuore di tutto (incantesimi e Ispirazione). Destrezza per CA e iniziativa, Costituzione per i PF e per mantenere la concentrazione.',
      sottoclasse: { livello: 3, titolo: 'Collegio Bardico', opzioni: [SUB('sapienza', 'Collegio della Sapienza'), SUB('valore', 'Collegio del Valore')] },
      tratti: [
        F(1, 'Lancio di Incantesimi', 'Incantatore completo con Carisma; conosci un numero fisso di incantesimi.'),
        F(1, 'Ispirazione Bardica', 'Azione bonus: un alleato entro 18 m aggiunge un d6 a una prova, TS o attacco. Usi = mod. Carisma.'),
        F(2, 'Tuttofare', 'Aggiungi metà del bonus di competenza alle prove in cui non sei competente.'),
        F(2, 'Canto di Riposo', 'Gli alleati che spendono Dadi Vita in un riposo breve recuperano un d6 PF in più (cresce con il livello).'),
        F(3, 'Maestria', 'Raddoppi la competenza in due abilità a scelta (altre due al 10°).'),
        F(5, 'Fonte di Ispirazione', 'Recuperi gli usi di Ispirazione con un riposo breve; l\'Ispirazione diventa d8.'),
        F(6, 'Controfascino', 'Azione: vantaggio ai TS contro charme e paura per te e gli alleati vicini.'),
        F(10, 'Segreti Magici', 'Impari incantesimi da qualsiasi lista (altri 2 al 14° e 2 al 18°).'),
        F(20, 'Ispirazione Superiore', 'Se tiri iniziativa senza usi di Ispirazione, ne recuperi uno.'),
      ],
    },
    {
      id: 'chierico', nome: 'Chierico', dado: 8, salvezze: ['sag', 'car'], nAbilita: 2,
      abilitaOpz: ['intuizione', 'medicina', 'persuasione', 'religione', 'storia'],
      armi: ['semplice'], armature: ['leggere', 'medie', 'scudi'], asi: STD_ASI,
      incantatore: { tipo: 'completo', car: 'sag', preparati: true, trucchetti: 'chierico' },
      priorita: ['sag', 'cos', 'for', 'des', 'car', 'int'],
      consiglio: 'Saggezza per CD e incantesimi preparati. Costituzione per i PF e la concentrazione; con armatura media/pesante serve poca Destrezza.',
      sottoclasse: { livello: 1, titolo: 'Dominio Divino', opzioni: [SUB('conoscenza', 'Dominio della Conoscenza'), SUB('vita', 'Dominio della Vita'), SUB('luce', 'Dominio della Luce'), SUB('natura', 'Dominio della Natura'), SUB('tempesta', 'Dominio della Tempesta'), SUB('inganno', 'Dominio dell\'Inganno'), SUB('guerra', 'Dominio della Guerra')] },
      tratti: [
        F(1, 'Lancio di Incantesimi', 'Incantatore completo con Saggezza; prepari incantesimi ogni giorno (Sag + livello).'),
        F(2, 'Incanalare Divinità', 'Usi di energia divina (1 per riposo, 2 dal 6°, 3 dal 18°): Scacciare Non Morti più effetti del dominio.'),
        F(5, 'Distruggere Non Morti', 'I non morti che falliscono contro Scacciare sono distrutti sotto una certa Sfida (cresce col livello).'),
        F(10, 'Intervento Divino', 'Chiedi aiuto alla tua divinità: percentuale pari al livello di riuscire (1/riposo lungo, 7 giorni se riesce).'),
        F(20, 'Intervento Divino Migliorato', 'L\'Intervento Divino riesce automaticamente.'),
      ],
    },
    {
      id: 'druido', nome: 'Druido', dado: 8, salvezze: ['int', 'sag'], nAbilita: 2,
      abilitaOpz: ['arcano', 'addestrare', 'intuizione', 'medicina', 'natura', 'percezione', 'religione', 'sopravvivenza'],
      armi: ['Bastone ferrato', 'Clava', 'Dardo', 'Falcetto', 'Fionda', 'Giavellotto', 'Lancia', 'Mazza', 'Pugnale', 'Scimitarra'], armature: ['leggere', 'medie', 'scudi'], asi: STD_ASI,
      incantatore: { tipo: 'completo', car: 'sag', preparati: true, trucchetti: 'druido' },
      priorita: ['sag', 'cos', 'des', 'int', 'car', 'for'],
      consiglio: 'Saggezza prima di tutto. Costituzione per sopravvivere, Destrezza per CA e iniziativa. Non indossa armature o scudi di metallo.',
      sottoclasse: { livello: 2, titolo: 'Circolo Druidico', opzioni: [SUB('terra', 'Circolo della Terra'), SUB('luna', 'Circolo della Luna')] },
      tratti: [
        F(1, 'Druidico', 'Conosci la lingua segreta dei druidi.'),
        F(1, 'Lancio di Incantesimi', 'Incantatore completo con Saggezza; prepari incantesimi ogni giorno (Sag + livello).'),
        F(2, 'Forma Selvatica', 'Due volte per riposo breve ti trasformi in una bestia (limiti di Sfida/volo/nuoto crescenti col livello).'),
        F(18, 'Corpo Senza Età', 'Invecchi molto più lentamente.'),
        F(18, 'Incantesimi Bestiali', 'Puoi lanciare incantesimi anche in Forma Selvatica.'),
        F(20, 'Arcidruido', 'Usi illimitati di Forma Selvatica; ignori alcune componenti degli incantesimi.'),
      ],
    },
    {
      id: 'guerriero', nome: 'Guerriero', dado: 10, salvezze: ['for', 'cos'], nAbilita: 2,
      abilitaOpz: ['acrobazia', 'addestrare', 'atletica', 'intuizione', 'intimidire', 'percezione', 'sopravvivenza', 'storia'],
      armi: ['semplice', 'da guerra'], armature: ['leggere', 'medie', 'pesanti', 'scudi'], asi: [4, 6, 8, 12, 14, 16, 19],
      stile: true,
      priorita: ['for', 'cos', 'des', 'sag', 'int', 'car'],
      prioritaAlt: { nome: 'Guerriero agile (arcieri, armi accurate)', lista: ['des', 'cos', 'sag', 'for', 'int', 'car'] },
      consiglio: 'Scegli: Forza (armature pesanti, armi pesanti) oppure Destrezza (arco, armi accurate). Costituzione è sempre al secondo posto.',
      sottoclasse: { livello: 3, titolo: 'Archetipo Marziale', opzioni: [SUB('campione', 'Campione'), SUB('maestro', 'Maestro di Battaglia'), SUB('cavaliere', 'Cavaliere Mistico', { incantatore: { tipo: 'terzo', car: 'int', conosciuti: 'terzo', trucchetti: 'terzo' } })] },
      tratti: [
        F(1, 'Stile di Combattimento', 'Scegli uno stile (vedi sotto).'),
        F(1, 'Recuperare Energie', 'Azione bonus: recuperi 1d10 + livello da guerriero PF (1/riposo breve).'),
        F(2, 'Azione Impetuosa', 'Un\'azione aggiuntiva nel tuo turno (1/riposo breve; 2 dal 17°).'),
        F(5, 'Attacco Extra', 'Due attacchi con l\'azione di Attacco (3 all\'11°, 4 al 20°).'),
        F(9, 'Indomito', 'Ritira un TS fallito (1/riposo lungo; 2 al 13°, 3 al 17°).'),
      ],
    },
    {
      id: 'ladro', nome: 'Ladro', dado: 8, salvezze: ['des', 'int'], nAbilita: 4,
      abilitaOpz: ['acrobazia', 'atletica', 'furtivita', 'indagare', 'inganno', 'intimidire', 'intuizione', 'intrattenere', 'percezione', 'persuasione', 'rapidita'],
      armi: ['semplice', 'Balestra a mano', 'Spada lunga', 'Stocco', 'Spada corta'], armature: ['leggere'], asi: [4, 8, 10, 12, 16, 19],
      maestria: { 1: 2, 6: 2 },
      priorita: ['des', 'cos', 'sag', 'int', 'car', 'for'],
      consiglio: 'Destrezza per attacco, CA e abilità. Costituzione e Saggezza (TS e Percezione) vengono dopo; Intelligenza se vuoi Indagare.',
      sottoclasse: { livello: 3, titolo: 'Archetipo Ladresco', opzioni: [SUB('ladro', 'Ladro'), SUB('assassino', 'Assassino'), SUB('mistificatore', 'Mistificatore Arcano', { incantatore: { tipo: 'terzo', car: 'int', conosciuti: 'terzo', trucchetti: 'terzo' } })] },
      tratti: [
        F(1, 'Maestria', 'Raddoppi la competenza in due abilità (altre due al 6°).'),
        F(1, 'Attacco Furtivo', 'Danni extra una volta per turno con vantaggio o con un alleato adiacente al bersaglio (arma accurata o a distanza). Cresce di 1d6 ogni due livelli.'),
        F(1, 'Gergo Ladresco', 'Conosci il linguaggio segreto dei ladri.'),
        F(2, 'Azione Scaltra', 'Azione bonus per Scatto, Disimpegno o Nascondersi.'),
        F(5, 'Schivata Prodigiosa', 'Reazione: dimezzi il danno di un attacco che vedi.'),
        F(7, 'Elusione', 'I TS su Destrezza riusciti annullano il danno, quelli falliti lo dimezzano.'),
        F(11, 'Talento Affidabile', 'Nelle prove in cui sei competente, un d20 sotto 10 vale 10.'),
        F(14, 'Percezione Cieca', 'Percepisci creature nascoste o invisibili entro 3 m.'),
        F(15, 'Mente Sfuggente', 'Competenza ai TS su Saggezza.'),
        F(18, 'Elusivo', 'Nessun attacco ha vantaggio contro di te se non sei incapacitato.'),
        F(20, 'Colpo di Fortuna', 'Se manchi un attacco, trasformalo in un colpo (o un 20 in una prova) 1/riposo.'),
      ],
    },
    {
      id: 'mago', nome: 'Mago', dado: 6, salvezze: ['int', 'sag'], nAbilita: 2,
      abilitaOpz: ['arcano', 'indagare', 'intuizione', 'medicina', 'religione', 'storia'],
      armi: ['Pugnale', 'Dardo', 'Fionda', 'Bastone ferrato', 'Balestra leggera'], armature: [], asi: STD_ASI,
      incantatore: { tipo: 'completo', car: 'int', preparati: true, trucchetti: 'mago', libro: true },
      priorita: ['int', 'cos', 'des', 'sag', 'car', 'for'],
      consiglio: 'Intelligenza è tutto. Destrezza e Costituzione servono a non morire al primo colpo (pochi PF, nessuna armatura).',
      sottoclasse: { livello: 2, titolo: 'Tradizione Arcana', opzioni: [SUB('abiurazione', 'Scuola di Abiurazione'), SUB('ammaliamento', 'Scuola di Ammaliamento'), SUB('divinazione', 'Scuola di Divinazione'), SUB('evocazione', 'Scuola di Evocazione'), SUB('illusione', 'Scuola di Illusione'), SUB('invocazione', 'Scuola di Invocazione'), SUB('necromanzia', 'Scuola di Necromanzia'), SUB('trasmutazione', 'Scuola di Trasmutazione')] },
      tratti: [
        F(1, 'Lancio di Incantesimi', 'Incantatore completo con Intelligenza; libro degli incantesimi (6 al 1°, +2 per livello), prepari Int + livello.'),
        F(1, 'Recupero Arcano', 'Una volta al giorno, in un riposo breve, recuperi slot per un livello totale pari alla metà del tuo livello (max 5° per slot).'),
        F(18, 'Maestria negli Incantesimi', 'Lanci un incantesimo di 1° e uno di 2° a tua scelta senza usare slot.'),
        F(20, 'Incantesimi Firma', 'Due incantesimi di 3° livello che puoi lanciare una volta ciascuno senza slot.'),
      ],
    },
    {
      id: 'monaco', nome: 'Monaco', dado: 8, salvezze: ['for', 'des'], nAbilita: 2,
      abilitaOpz: ['acrobazia', 'atletica', 'furtivita', 'intuizione', 'religione', 'storia'],
      armi: ['semplice', 'Spada corta'], armature: [], asi: STD_ASI, monaco: true,
      priorita: ['des', 'sag', 'cos', 'for', 'int', 'car'],
      consiglio: 'Destrezza (attacco e CA) e Saggezza (CA e CD del Ki) sono entrambe fondamentali. Poi Costituzione per i PF.',
      sottoclasse: { livello: 3, titolo: 'Tradizione Monastica', opzioni: [SUB('manoaperta', 'Via della Mano Aperta'), SUB('ombra', 'Via dell\'Ombra'), SUB('elementi', 'Via dei Quattro Elementi')] },
      tratti: [
        F(1, 'Difesa Senza Armatura', 'Senza armatura né scudo CA = 10 + mod. Des + mod. Sag.'),
        F(1, 'Arti Marziali', 'Dado danno senz\'armi crescente (d4→d10); puoi usare Destrezza; attacco senz\'armi come azione bonus.'),
        F(2, 'Ki', 'Punti ki = livello da monaco: Raffica di Colpi, Difesa Paziente, Passo del Vento (ricarica con riposo breve).'),
        F(2, 'Movimento Senza Armatura', 'Velocità aumentata senza armatura (+3 m, poi crescente); dal 9° corri su pareti e liquidi.'),
        F(3, 'Deviare Proiettili', 'Reazione: riduci il danno di un attacco a distanza di 1d10 + Des + livello.'),
        F(4, 'Caduta Lenta', 'Reazione: riduci il danno da caduta di 5 × livello.'),
        F(5, 'Attacco Extra', 'Due attacchi con l\'azione di Attacco.'),
        F(5, 'Colpo Stordente', 'Spendi 1 ki per tentare di stordire con un colpo (TS Cos).'),
        F(6, 'Colpi Ki Potenziati', 'I tuoi attacchi senz\'armi contano come magici.'),
        F(7, 'Evasione', 'TS su Destrezza: riuscire annulla il danno, fallire lo dimezza.'),
        F(7, 'Quiete Mentale', 'Azione: termini charme o paura su di te.'),
        F(10, 'Purezza del Corpo', 'Immune a malattie e veleno.'),
        F(13, 'Lingua del Sole e della Luna', 'Comprendi ogni lingua parlata.'),
        F(14, 'Anima di Diamante', 'Competenza in tutti i TS; spendi ki per ritirarne uno.'),
        F(15, 'Corpo Senza Tempo', 'Non invecchi più e non hai bisogno di cibo o acqua.'),
        F(18, 'Corpo Vuoto', 'Spendi ki per diventare invisibile e resistente.'),
        F(20, 'Perfezione', 'Se tiri iniziativa senza punti ki, ne recuperi 4.'),
      ],
    },
    {
      id: 'paladino', nome: 'Paladino', dado: 10, salvezze: ['sag', 'car'], nAbilita: 2,
      abilitaOpz: ['atletica', 'intuizione', 'intimidire', 'medicina', 'persuasione', 'religione'],
      armi: ['semplice', 'da guerra'], armature: ['leggere', 'medie', 'pesanti', 'scudi'], asi: STD_ASI, stile: true, stileDa: 2,
      incantatore: { tipo: 'meta', car: 'car', preparati: true, da: 2 },
      priorita: ['for', 'car', 'cos', 'sag', 'des', 'int'],
      consiglio: 'Forza per colpire con armi pesanti, Carisma per Punizione Divina, auree e incantesimi. Costituzione è il terzo pilastro.',
      sottoclasse: { livello: 3, titolo: 'Giuramento Sacro', opzioni: [SUB('devozione', 'Giuramento di Devozione'), SUB('antichi', 'Giuramento degli Antichi'), SUB('vendetta', 'Giuramento di Vendetta')] },
      tratti: [
        F(1, 'Percezione del Divino', 'Avverti celestiali, immondi e non morti entro 18 m (mod. Car volte per riposo lungo).'),
        F(1, 'Imposizione delle Mani', 'Riserva di guarigione pari a 5 × livello; puoi anche curare malattie e veleno.'),
        F(2, 'Stile di Combattimento', 'Scegli uno stile (vedi sotto).'),
        F(2, 'Lancio di Incantesimi', 'Incantatore a metà con Carisma; prepari Car + metà livello.'),
        F(2, 'Punizione Divina', 'Spendi uno slot dopo un colpo in mischia: danni radiosi 2d8 (+1d8 per livello dello slot oltre il 1°).'),
        F(3, 'Salute Divina', 'Immune alle malattie.'),
        F(3, 'Incanalare Divinità', 'Usi di energia divina legati al giuramento (1/riposo breve).'),
        F(5, 'Attacco Extra', 'Due attacchi con l\'azione di Attacco.'),
        F(6, 'Aura di Protezione', 'Tu e gli alleati entro 3 m aggiungete il tuo mod. Carisma ai TS (min +1).'),
        F(10, 'Aura di Coraggio', 'Tu e gli alleati entro 3 m non potete essere spaventati.'),
        F(11, 'Punizioni Divine Migliorate', '+1d8 danni radiosi con tutti i colpi in mischia.'),
        F(14, 'Tocco Purificatore', 'Termina un incantesimo su di te o su una creatura (mod. Car volte per riposo lungo).'),
        F(18, 'Aure Potenziate', 'Il raggio delle aure sale a 9 m.'),
      ],
    },
    {
      id: 'ranger', nome: 'Ranger', dado: 10, salvezze: ['for', 'des'], nAbilita: 3,
      abilitaOpz: ['addestrare', 'atletica', 'intuizione', 'indagare', 'natura', 'percezione', 'furtivita', 'sopravvivenza'],
      armi: ['semplice', 'da guerra'], armature: ['leggere', 'medie', 'scudi'], asi: STD_ASI, stile: true, stileDa: 2,
      incantatore: { tipo: 'meta', car: 'sag', conosciuti: 'ranger', da: 2 },
      priorita: ['des', 'sag', 'cos', 'for', 'int', 'car'],
      consiglio: 'Destrezza per arco e armi accurate, Saggezza per gli incantesimi e per l\'esplorazione, poi Costituzione.',
      sottoclasse: { livello: 3, titolo: 'Archetipo Ranger', opzioni: [SUB('cacciatore', 'Cacciatore'), SUB('bestie', 'Signore delle Bestie')] },
      tratti: [
        F(1, 'Nemico Prescelto', 'Vantaggio a tracciare e ricordare informazioni su un tipo di creature (altri tipi al 6° e al 14°).'),
        F(1, 'Esploratore Nato', 'Competenza e vantaggi di esplorazione in un tipo di terreno (altri al 6° e al 10°).'),
        F(2, 'Stile di Combattimento', 'Scegli uno stile (vedi sotto).'),
        F(2, 'Lancio di Incantesimi', 'Incantatore a metà con Saggezza; conosci un numero fisso di incantesimi.'),
        F(3, 'Consapevolezza Primordiale', 'Con un\'azione e uno slot senti la presenza di certe creature nei dintorni.'),
        F(5, 'Attacco Extra', 'Due attacchi con l\'azione di Attacco.'),
        F(8, 'Passo della Terra', 'Il terreno difficile non ti rallenta e le piante non ti ostacolano.'),
        F(10, 'Mimetismo', 'Puoi usare l\'azione Nascondersi come azione bonus.'),
        F(14, 'Svanire', 'Non puoi essere tracciato se non vuoi; Nascondersi come azione bonus.'),
        F(18, 'Sensi Ferini', 'Avvertire e combattere creature invisibili entro 9 m senza svantaggio.'),
        F(20, 'Nemico Mortale', 'Una volta per turno aggiungi il tuo mod. Saggezza a tiro per colpire o danni contro un nemico.'),
      ],
    },
    {
      id: 'stregone', nome: 'Stregone', dado: 6, salvezze: ['cos', 'car'], nAbilita: 2,
      abilitaOpz: ['arcano', 'inganno', 'intimidire', 'intuizione', 'persuasione', 'religione'],
      armi: ['Pugnale', 'Dardo', 'Fionda', 'Bastone ferrato', 'Balestra leggera'], armature: [], asi: STD_ASI,
      incantatore: { tipo: 'completo', car: 'car', conosciuti: 'stregone', trucchetti: 'stregone' },
      priorita: ['car', 'cos', 'des', 'sag', 'int', 'for'],
      consiglio: 'Carisma per incantesimi e CD. Costituzione per i pochissimi PF (d6) e la concentrazione. Destrezza per la CA.',
      sottoclasse: { livello: 1, titolo: 'Origine Stregonesca', opzioni: [SUB('draconica', 'Discendenza Draconica', { pfLivello: 1, caBase: { base: 13, car: 'des' } }), SUB('selvaggia', 'Magia Selvaggia')] },
      tratti: [
        F(1, 'Lancio di Incantesimi', 'Incantatore completo con Carisma; conosci un numero fisso di incantesimi.'),
        F(2, 'Fonte di Magia', 'Punti stregoneria = livello: li converti in slot o viceversa.'),
        F(3, 'Metamagia', 'Scegli 2 opzioni per modificare gli incantesimi spendendo punti stregoneria (altre al 10° e al 17°).'),
        F(20, 'Ripristino Stregonesco', 'Recuperi 4 punti stregoneria con un riposo breve.'),
      ],
    },
    {
      id: 'warlock', nome: 'Warlock', dado: 8, salvezze: ['sag', 'car'], nAbilita: 2,
      abilitaOpz: ['arcano', 'inganno', 'indagare', 'intimidire', 'natura', 'religione', 'storia'],
      armi: ['semplice'], armature: ['leggere'], asi: STD_ASI,
      incantatore: { tipo: 'patto', car: 'car', conosciuti: 'warlock', trucchetti: 'warlock' },
      priorita: ['car', 'cos', 'des', 'sag', 'int', 'for'],
      consiglio: 'Carisma per Esplosione Occulta e CD. Costituzione e Destrezza per sopravvivere (pochi slot, ma molto potenti).',
      sottoclasse: { livello: 1, titolo: 'Patrono Ultraterreno', opzioni: [SUB('fatato', 'Il Signore Fatato'), SUB('immondo', 'L\'Immondo'), SUB('antico', 'Il Grande Antico')] },
      tratti: [
        F(1, 'Magia del Patto', 'Pochi slot sempre del livello massimo disponibile; si recuperano con un riposo breve.'),
        F(2, 'Suppliche Occulte', 'Impari 2 suppliche (poi 3 al 5°, 4 al 7°, 5 al 9°, 6 al 12°, 7 al 15°, 8 al 18°); a ogni nuovo livello da warlock puoi cambiarne una.'),
        F(3, 'Dono del Patto', 'Scegli Catena, Lama o Tomo (nella scheda Classe).'),
        F(11, 'Arcanum Mistico (6°)', 'Un incantesimo di 6° livello lanciabile 1/riposo lungo (7° al 13°, 8° al 15°, 9° al 17°).'),
        F(20, 'Maestro dell\'Occulto', 'Invocando il patrono per 1 minuto recuperi tutti gli slot di Magia del Patto spesi (1/riposo lungo).'),
      ],
    },
  ];

  D.INVOCAZIONI = [0, 2, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8];

  D.classe = (id) => D.CLASSI.find((c) => c.id === id);
  D.razza = (id) => D.RAZZE.find((r) => r.id === id);
  D.sfondo = (id) => D.SFONDI.find((s) => s.id === id);
  D.arma = (id) => D.ARMI.find((a) => a.id === id);
  D.armatura = (id) => D.ARMATURE.find((a) => a.id === id);
  D.abilita = (id) => D.ABILITA.find((a) => a.id === id);
})(typeof globalThis !== 'undefined' ? globalThis : window);
