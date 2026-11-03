/* CONSIGLI SUGLI INCANTESIMI: per ogni classe una nota e le liste in ordine di priorità.
   "Scegli per me" prende i primi che rispettano classe e livello massimo disponibile. */
(function (G) {
  const D = (G.DND = G.DND || {});
  const L = (s) => s.trim().split(/\s+/);
  D.CONSIGLI_INC = {
    bardo: {
      nota: 'Il Bardo conosce pochi incantesimi, quindi scegline di versatili: uno o due di cura (Parola Guaritrice), uno di controllo (Sonno, Charme su Persone) e qualcosa per parlare e ingannare. Beffa Crudele è il trucchetto da bardo per eccellenza.',
      truc: L('beffa-crudele mano-magica illusione-minore luci-danzanti prestidigitazione messaggio'),
      liv: L(`parola-guaritrice sonno charme-su-persone onda-tonante cura-ferite camuffare-se-stesso anatema eroismo caduta-morbida immagine-silenziosa
        blocca-persone invisibilita suggestione frantumare ristorare-inferiore individuazione-dei-pensieri calmare-emozioni
        dissolvi-magie trama-ipnotica immagine-maggiore paura lingue scagliare-maledizione
        porta-dimensionale invisibilita-superiore metamorfosi confusione liberta-di-movimento
        cura-ferite-di-massa blocca-mostri dominare-persone modificare-memoria`),
    },
    chierico: {
      nota: 'Il Chierico prepara gli incantesimi ogni giorno dalla lista completa. Parti con cura (Parola Guaritrice, Cura Ferite), protezione (Benedizione, Scudo della Fede) e un attacco (Dardo Tracciante). Fiamma Sacra è il trucchetto offensivo più usato.',
      truc: L('fiamma-sacra guida luce salvare-i-morenti taumaturgia resistenza riparare'),
      liv: L(`benedizione parola-guaritrice cura-ferite scudo-della-fede dardo-tracciante santuario comando anatema infliggi-ferite
        arma-spirituale ristorare-inferiore preghiera-di-guarigione aiuto blocca-persone silenzio
        guardiani-spirituali rinascita dissolvi-magie parola-guaritrice-di-massa faro-di-speranza creare-cibo-e-acqua
        interdizione-alla-morte guardiano-della-fede esilio
        cura-ferite-di-massa rianimare-morti colpo-infuocato ristorare-superiore`),
    },
    druido: {
      nota: 'Il Druido prepara gli incantesimi dalla lista completa. Per cominciare: cura (Parola Guaritrice), controllo (Intralciare, Nube di Nebbia) e un po\' di danno. Artificio Druidico e Produrre Fiamma sono i trucchetti classici.',
      truc: L('produrre-fiamma artificio-druidico randello-incantato guida resistenza'),
      liv: L(`parola-guaritrice cura-ferite intralciare onda-tonante nube-di-nebbia bacche-benefiche amicizia-con-gli-animali luminescenza passo-veloce charme-su-persone
        pelle-di-corteccia bagliore-lunare crescita-di-spuntoni blocca-persone ristorare-inferiore lama-infuocata sfera-infuocata passare-senza-tracce
        evoca-animali invocare-il-fulmine muro-di-vento tempesta-di-nevischio dissolvi-magie luce-diurna
        pelle-di-pietra metamorfosi dominare-bestie muro-di-fuoco evoca-creature-boschive liberta-di-movimento
        cura-ferite-di-massa ristorare-superiore evoca-elementale`),
    },
    mago: {
      nota: 'Il libro del Mago parte con 6 incantesimi e ne guadagna 2 a ogni livello: sceglili con cura. Scudo e Dardo Incantato sono quasi indispensabili; Sonno è fortissimo ai primi livelli. Tra i trucchetti punta su Dardo di Fuoco e Mano Magica.',
      truc: L('dardo-di-fuoco mano-magica illusione-minore raggio-di-gelo luce messaggio riparare prestidigitazione'),
      liv: L(`dardo-incantato scudo sonno armatura-magica mani-brucianti identificare individuazione-del-magico trova-famiglio charme-su-persone camuffare-se-stesso onda-tonante disco-fluttuante nube-di-nebbia
        immagine-speculare invisibilita passo-velato raggio-rovente ragnatela blocca-persone oscurita frantumare
        palla-di-fuoco fulmine controincantesimo dissolvi-magie volare velocita intermittenza
        porta-dimensionale muro-di-fuoco invisibilita-superiore metamorfosi tempesta-di-ghiaccio
        cono-di-freddo telecinesi muro-di-forza nube-mortale`),
    },
    paladino: {
      nota: 'Il Paladino prepara incantesimi dalla lista, ma ne usa pochi: Favore Divino e Punizione Marchiante rafforzano gli attacchi, Cura Ferite e Benedizione sostengono il gruppo.',
      truc: [],
      liv: L(`benedizione cura-ferite favore-divino scudo-della-fede eroismo comando individuazione-del-bene-e-del-male protezione-dal-bene-e-dal-male
        punizione-marchiante aiuto ristorare-inferiore trova-cavalcatura arma-magica
        luce-diurna rinascita dissolvi-magie
        interdizione-alla-morte esilio`),
    },
    ranger: {
      nota: 'Il Ranger conosce pochi incantesimi: Marchio del Cacciatore è il suo incantesimo simbolo e va quasi sempre scelto per primo. Poi esplorazione e cura.',
      truc: [],
      liv: L(`marchio-del-cacciatore cura-ferite bacche-benefiche nube-di-nebbia passo-veloce saltare allarme parlare-con-gli-animali individuazione-del-magico
        passare-senza-tracce pelle-di-corteccia scurovisione localizza-oggetto silenzio crescita-di-spuntoni scopri-trappole
        evoca-animali crescita-vegetale muro-di-vento camminare-sullacqua luce-diurna parlare-con-le-piante
        pelle-di-pietra liberta-di-movimento localizza-creatura`),
    },
    stregone: {
      nota: 'Lo Stregone conosce pochi incantesimi, quindi niente doppioni: due trucchetti offensivi, uno di utilità e uno per parlare. Dardo Incantato e Scudo sono ottimi al 1° livello; Armatura Magica ti dà una buona CA.',
      truc: L('dardo-di-fuoco raggio-di-gelo stretta-folgorante prestidigitazione illusione-minore colpo-accurato spruzzo-velenoso mano-magica luce messaggio'),
      liv: L(`dardo-incantato scudo armatura-magica sonno mani-brucianti charme-su-persone camuffare-se-stesso onda-tonante ritirata-rapida
        immagine-speculare invisibilita passo-velato raggio-rovente blocca-persone sfocatura
        palla-di-fuoco fulmine controincantesimo volare velocita intermittenza
        porta-dimensionale invisibilita-superiore metamorfosi muro-di-fuoco
        cono-di-freddo telecinesi animare-oggetti blocca-mostri`),
    },
    warlock: {
      nota: 'Il Warlock ha pochi slot ma sempre al livello massimo, quindi conta la qualità. Deflagrazione Occulta è il suo trucchetto d\'attacco insuperabile; con gli slot punta su controllo e difesa.',
      truc: L('deflagrazione-occulta illusione-minore mano-magica tocco-gelido prestidigitazione spruzzo-velenoso colpo-accurato'),
      liv: L(`intimorire-infernale charme-su-persone ritirata-rapida protezione-dal-bene-e-dal-male comprensione-dei-linguaggi servitore-inosservato scritto-illusorio
        blocca-persone invisibilita oscurita passo-velato immagine-speculare movimenti-del-ragno raggio-di-affaticamento
        dissolvi-magie paura volare trama-ipnotica forma-gassosa tocco-vampirico controincantesimo rimuovi-maledizione
        porta-dimensionale inaridire esilio
        scrutare sogno blocca-mostri`),
    },
    terzo: {
      nota: 'Cavaliere Mistico e Mistificatore Arcano usano la lista del Mago e conoscono pochi incantesimi. Il Cavaliere sceglie soprattutto Abiurazione e Invocazione (due incantesimi liberi da qualsiasi scuola); il Mistificatore deve avere Mano Magica come trucchetto.',
      truc: L('mano-magica dardo-di-fuoco stretta-folgorante raggio-di-gelo illusione-minore prestidigitazione'),
      liv: L(`scudo armatura-magica dardo-incantato sonno charme-su-persone camuffare-se-stesso ritirata-rapida onda-tonante
        passo-velato immagine-speculare invisibilita sfocatura raggio-rovente
        controincantesimo velocita intermittenza dissolvi-magie
        porta-dimensionale invisibilita-superiore`),
    },
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
