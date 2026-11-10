/* Guida Omnicomprensiva di Xanathar - sottoclassi (testi sintetizzati dal manuale italiano + errata 2020; riassunti nostri, numeri del manuale). */
(function (G) {
  const D = G.DND;
  const FONTE = 'xge';
  const F = (liv, nome, desc) => [liv, nome, desc];
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const AL = { 'lama roboante': 'lama tonante', 'tentacoli neri di evard': 'tentacoli neri', 'sfera congelante di otiluke': 'sfera congelante', 'parola curativa': 'parola guaritrice', 'parola curativa di massa': 'parola guaritrice di massa', 'capanna di leomund': 'capanna', 'legame telepatico di rary': 'legame telepatico', 'sfera elastica di otiluke': 'sfera elastica', 'freccia acida di melf': 'freccia acida' };
  D.TASHA_MANCANTI = D.TASHA_MANCANTI || [];
  D.INC_SUB_LIV_KEY = D.INC_SUB_LIV_KEY || {};
  const idDa = (nome) => { const n = AL[norm(nome)] || norm(nome); const s = D.INCANTESIMI.find((x) => norm(x.nome) === n) || D.INCANTESIMI.find((x) => norm(x.nome).replace(/ \(.*$/, '') === n); if (!s) { D.TASHA_MANCANTI.push(nome); return null; } return s.id; };
  const ids = (...n) => n.map(idDa).filter(Boolean);
  const agg = (cl, id, nome, tratti, desc) => {
    const c = D.classe(cl); c.sottoclasse.opzioni.push({ id, nome, tratti: [], fonte: FONTE });
    D.TRATTI_SUB[cl + '/' + id] = tratti; D.DESC.sottoclasse[cl + '/' + id] = desc;
  };
  /* ---------- BARBARO ---------- */
  agg('barbaro', 'guardiano', 'Cammino del Guardiano Ancestrale', [
    F(3, 'Protettori Ancestrali', 'In Ira, la prima creatura che colpisci con un attacco nel tuo turno diventa bersaglio di guerrieri spettrali: fino all\'inizio del tuo turno successivo ha svantaggio ai tiri per colpire contro chiunque non sia tu e, se colpisce un altro, quella creatura ha resistenza ai danni di quell\'attacco. Termina se l\'Ira termina.'),
    F(6, 'Spiriti Protettori', 'In Ira, reazione: quando una creatura che vedi entro 9 m subisce danni, li riduci di 2d6 (3d6 al 10°, 4d6 al 14°).'),
    F(10, 'Consultare gli Spiriti', 'Lanci Presagio o Chiaroveggenza senza slot né componenti materiali (caratteristica Saggezza); con Chiaroveggenza evochi invisibilmente uno spirito ancestrale al posto del sensore. Una volta per riposo breve o lungo.'),
    F(14, 'Antenati Vendicativi', 'Quando usi Spiriti Protettori, l\'attaccante subisce danni da forza pari ai danni prevenuti.'),
  ], 'Il barbaro che si circonda degli spiriti degli antenati: ostacola i nemici e protegge gli alleati vicini.');
  agg('barbaro', 'araldo', 'Cammino dell\'Araldo della Tempesta', [
    F(3, 'Aura Tempestosa', 'In Ira emani un\'aura di 3 m (non oltre la copertura totale); l\'effetto si attiva entrando in Ira e come azione bonus a ogni turno. Scegli ambiente (cambiabile a ogni livello): DESERTO: le altre creature nell\'aura subiscono 2 fuoco (3 al 5°, 4 al 10°, 5 al 15°, 6 al 20°). MARE: un bersaglio nell\'aura fa TS Des (CD 8 + competenza + Cos) o 1d6 fulmine, metà se superato (2d6 al 10°, 3d6 al 15°, 4d6 al 20°). TUNDRA: le creature a tua scelta nell\'aura ottengono 2 PF temporanei (3 al 5°, 4 al 10°, 5 al 15°, 6 al 20°).'),
    F(6, 'Anima Tempestosa', 'DESERTO: resistenza al fuoco, ignori il caldo estremo, con un\'azione incendi un oggetto infiammabile non indossato. MARE: resistenza al fulmine, respiro sott\'acqua, nuotare 9 m. TUNDRA: resistenza al freddo, ignori il freddo estremo, con un\'azione trasformi in ghiaccio un cubo d\'acqua di 1,5 m (1 minuto).'),
    F(10, 'Tempesta Protettrice', 'Le creature a tua scelta entro la tua Aura Tempestosa ottengono la resistenza di Anima Tempestosa.'),
    F(14, 'Tempesta Furibonda', 'DESERTO: reazione quando una creatura nell\'aura ti colpisce: TS Des o danni da fuoco pari a metà del livello da barbaro. MARE: reazione quando colpisci una creatura nell\'aura: TS Forza o cade prona. TUNDRA: quando l\'aura si attiva scegli una creatura: TS Forza o velocità 0 fino all\'inizio del tuo prossimo turno.'),
  ], 'Il barbaro che trasforma l\'ira in un manto di tempesta: deserto, mare o tundra.');
  agg('barbaro', 'zelota', 'Cammino dello Zelota', [
    F(3, 'Furia Divina', 'In Ira, la prima creatura che colpisci con un attacco con arma in ogni turno subisce 1d6 + metà del livello da barbaro di danni extra, necrotici o radiosi (scegli il tipo al momento di ottenere il privilegio).'),
    F(3, 'Guerriero degli Dèi', 'Se un incantesimo come Rianimare Morti ha l\'unico effetto di riportarti in vita, l\'incantatore non ha bisogno di componenti materiali.'),
    F(6, 'Concentrazione Fanatica', 'Se fallisci un TS in Ira puoi ripeterlo e devi usare il nuovo risultato; una volta per Ira.'),
    F(10, 'Presenza Zelante', 'Azione bonus: fino a dieci creature a tua scelta entro 18 m che ti sentono hanno vantaggio ai tiri per colpire e ai TS fino all\'inizio del tuo prossimo turno. Una volta per riposo lungo.'),
    F(14, 'Ira Imperitura', 'In Ira, a 0 PF non diventi privo di sensi: fai ancora i TS contro morte; se dovessi morire per i TS falliti, muori solo quando l\'Ira finisce e solo se hai ancora 0 PF.'),
  ], 'Il barbaro che incanala la furia di una divinità guerriera in colpi divini.');
  /* ---------- BARDO ---------- */
  agg('bardo', 'sussurri', 'Collegio dei Sussurri', [
    F(3, 'Lame Psichiche', 'Quando colpisci con un attacco con arma puoi spendere un uso di Ispirazione Bardica per infliggere 2d6 danni psichici extra (una volta per round, nel tuo turno). 3d6 al 5°, 5d6 al 10°, 8d6 al 15°.'),
    F(3, 'Parole di Terrore', 'Parlando da solo per 1 minuto con un umanoide, puoi instillargli paranoia: alla fine TS Saggezza (CD incantesimi) o resta spaventato da te (o da chi scegli) per 1 ora, finché non è attaccato/danneggiato o vede alleati attaccati/danneggiati. Se supera il TS non sa di essere stato bersaglio. Una volta per riposo breve o lungo.'),
    F(6, 'Manto di Sussurri', 'Reazione: quando un umanoide muore entro 9 m ne catturi l\'ombra (fino a riposo lungo). Con un\'azione la trasformi in un travestimento che ti fa apparire come il defunto, vivo e in salute, per 1 ora (o finché non lo termini con azione bonus); accedi alle informazioni che condivideva liberamente. Chi indaga: prova di Intuizione contro il tuo Inganno con +5 per te. Una volta per riposo breve o lungo.'),
    F(14, 'Conoscenze dell\'Ombra', 'Azione: sussurri a una creatura entro 9 m (che ti capisca): TS Saggezza (CD incantesimi) o resta affascinata 8 ore (o finché tu o i tuoi alleati la attaccate, danneggiate o la costringete a un TS). Il bersaglio crede che tu conosca il suo segreto più mortificante e ti obbedisce senza rischiare la vita né combattere per te. Una volta per riposo lungo.'),
  ], 'Il bardo spia e manipola con la paura, i segreti e le ombre.');
  agg('bardo', 'incanto', 'Collegio dell\'Incanto', [
    F(3, 'Manto di Ispirazione', 'Azione bonus, spendendo un uso di Ispirazione Bardica: scegli un numero di creature pari al tuo mod. Carisma (min. 1) entro 18 m che ti vedono; ognuna ottiene 5 PF temporanei e può usare la reazione per muoversi fino alla sua velocità senza provocare attacchi di opportunità. PF temporanei: 8 al 5°, 11 al 10°, 14 al 15°.'),
    F(3, 'Esibizione Estasiante', 'Dopo almeno 1 minuto di esibizione scegli umanoidi pari al tuo mod. Carisma (min. 1) entro 18 m che l\'hanno seguita tutta: TS Saggezza (CD incantesimi) o restano affascinati per 1 ora (idolatrano il bardo; finisce se subiscono danni, se li attacchi o se vedono attaccare un tuo alleato). Chi supera il TS non ne è consapevole. Una volta per riposo breve o lungo.'),
    F(6, 'Manto di Maestà', 'Azione bonus: lanci Comando senza slot e ti ammanti di bellezza ultraterrena per 1 minuto (concentrazione); durante la durata puoi lanciare Comando come azione bonus ogni turno senza slot. Le creature affascinate da te falliscono automaticamente il TS contro di esso. Una volta per riposo lungo.'),
    F(14, 'Maestà Inviolabile', 'Il tuo aspetto diventa permanentemente ultraterreno. Azione bonus: per 1 minuto (o finché incapacitato) chi tenta di attaccarti per la prima volta in un turno fa un TS Carisma (CD incantesimi): se fallisce non può attaccarti in quel turno e deve cambiare bersaglio; se supera può attaccare ma ha svantaggio ai TS contro i tuoi incantesimi nel tuo turno successivo. Una volta per riposo breve o lungo.'),
  ], 'Il bardo che usa la magia fatata per ispirare, affascinare e comandare.');
  agg('bardo', 'spade', 'Collegio delle Spade', [
    F(3, 'Competenze Bonus', 'Competenza nelle armature medie e nella scimitarra. Se sei competente in un\'arma da mischia semplice o da guerra puoi usarla come focus da incantatore per gli incantesimi da bardo.'),
    F(3, 'Stile di Combattimento', 'Scegli Duellare (+2 ai danni con un\'arma da mischia a una mano senza altre armi) oppure Combattere con Due Armi (aggiungi il mod. di caratteristica ai danni del secondo attacco).'),
    F(3, 'Virtuosismo della Lama', 'Quando effettui l\'azione di Attacco la tua velocità base aumenta di 3 m fino a fine turno e, se un attacco con arma colpisce, puoi usare una opzione per turno spendendo un uso di Ispirazione Bardica: Virtuosismo Difensivo (danni extra pari al dado e lo aggiungi alla CA fino al tuo turno successivo), Tagliente (danni extra anche a un\'altra creatura a tua scelta entro 1,5 m dal bersaglio) o Mobile (danni extra, spingi il bersaglio di 1,5 m + 30 cm per il risultato e poi con reazione ti muovi fino alla velocità base in uno spazio entro 1,5 m dal bersaglio).'),
    F(6, 'Attacco Extra', 'Puoi attaccare due volte invece di una quando effettui l\'azione di Attacco.'),
    F(14, 'Virtuosismo del Maestro', 'Ogni volta che usi un\'opzione di Virtuosismo della Lama puoi tirare un d6 e usarlo al posto di spendere un dado di Ispirazione Bardica.'),
  ], 'Il bardo lama: spettacoli con le armi e abilità marziali.');
  /* ---------- CHIERICO (sottoclasse al 1° livello) ---------- */
  agg('chierico', 'forgia', 'Dominio della Forgia', [
    F(1, 'Competenze Bonus', 'Competenza nelle armature pesanti e negli strumenti da fabbro.'),
    F(1, 'Benedizione della Forgia', 'Alla fine di un riposo lungo tocchi un\'armatura o un\'arma semplice o da guerra non magica: fino al riposo lungo successivo (o alla tua morte) diventa magica, con +1 alla CA (armatura) o +1 ai tiri per colpire e ai danni (arma). Una volta per riposo lungo.'),
    F(2, 'Incanalare Divinità: Benedizione dell\'Artigiano', 'Rituale di 1 ora per fabbricare un oggetto non magico che includa metallo (arma, armatura, dieci munizioni, set di strumenti o altro) di valore pari o inferiore a 100 mo, entro 1,5 m da te. Fornisci metallo (anche monete) di pari valore, che si fonde in modo irrecuperabile. Puoi anche duplicare un oggetto metallico non magico (es. una chiave) se hai l\'originale.'),
    F(6, 'Anima della Forgia', 'Resistenza ai danni da fuoco; con un\'armatura pesante hai +1 alla CA.'),
    F(8, 'Colpo Divino', 'Una volta per turno, quando colpisci con un attacco con arma, infliggi 1d8 danni da fuoco extra (2d8 dal 14° livello).'),
    F(17, 'Santo della Forgia e del Fuoco', 'Immunità ai danni da fuoco; con un\'armatura pesante hai resistenza ai danni contundenti, perforanti e taglienti degli attacchi non magici.'),
  ], 'Il chierico fabbro divino: armi e armature benedette, fuoco e metallo.');
  agg('chierico', 'tomba', 'Dominio della Tomba', [
    F(1, 'Cerchio di Mortalità', 'Quando un incantesimo ripristina PF a una creatura a 0 PF, usi il risultato massimo di ogni dado. Impari il trucchetto Salvare i Morenti (non conta nel limite): per te ha gittata 9 m e si lancia come azione bonus.'),
    F(1, 'Occhi della Tomba', 'Azione: fino alla fine del tuo prossimo turno conosci la posizione di ogni non morto entro 18 m (non dietro copertura totale né protetto da divinazione). Usi pari al mod. Saggezza (minimo 1) per riposo lungo.'),
    F(2, 'Incanalare Divinità: Verso la Tomba', 'Azione: scegli una creatura entro 9 m che vedi e la maledici fino alla fine del tuo prossimo turno: la prossima volta che tu o un alleato la colpite con un attacco, ha vulnerabilità a tutti i danni di quell\'attacco; poi la maledizione termina.'),
    F(6, 'Sentinella alla Porta della Morte', 'Reazione: quando tu o una creatura entro 9 m che vedi subite un colpo critico, lo trasformi in un colpo normale (annulla gli effetti da critico). Usi pari al mod. Saggezza (minimo 1) per riposo lungo.'),
    F(8, 'Incantesimi Potenti', 'Aggiungi il mod. di Saggezza ai danni dei tuoi trucchetti da chierico.'),
    F(17, 'Custode delle Anime', 'Quando un nemico che vedi muore entro 18 m, tu o una creatura a tua scelta entro 18 m recuperate PF pari ai Dadi Vita del nemico. Non puoi usarlo se incapacitato; una volta fino all\'inizio del tuo turno successivo.'),
  ], 'Il chierico che veglia sul confine tra vita e morte.');
  D.INC_SUB['chierico/forgia'] = [ids('Identificare', 'Punizione Incandescente'), ids('Arma Magica', 'Riscaldare il Metallo'), ids('Arma Elementale', 'Protezione dall\'Energia'), ids('Fabbricare', 'Muro di Fuoco'), ids('Animare Oggetti', 'Creazione')];
  D.INC_SUB['chierico/tomba'] = [ids('Anatema', 'Vita Falsata', 'Salvare i Morenti'), ids('Raggio di Affaticamento', 'Riposo Inviolato'), ids('Rinascita', 'Tocco del Vampiro'), ids('Inaridire', 'Interdizione alla Morte'), ids('Guscio Anti-Vita', 'Rianimare Morti')];
  /* ---------- DRUIDO ---------- */
  agg('druido', 'sogni', 'Circolo dei Sogni', [
    F(2, 'Balsamo della Corte dell\'Estate', 'Hai una riserva di d6 pari al tuo livello da druido. Azione bonus: scegli una creatura entro 36 m che vedi e spendi dadi (al massimo metà del tuo livello da druido): recupera PF pari al totale e ottiene 1 PF temporaneo per dado speso. Recuperi tutti i dadi con un riposo lungo.'),
    F(6, 'Focolare della Luce Lunare e dell\'Ombra', 'Durante un riposo breve o lungo tocchi un punto: una sfera invisibile di 9 m (bloccata da copertura totale) dà a te e ai tuoi alleati +5 alle prove di Furtività (Des) e Percezione (Sag); le fiamme aperte al suo interno non sono visibili dall\'esterno. Svanisce a fine riposo o se esci.'),
    F(10, 'Sentieri Nascosti', 'Azione bonus: ti teletrasporti fino a 18 m in uno spazio libero che vedi; oppure con un\'azione teletrasporti una creatura consenziente che tocchi fino a 9 m. Usi pari al mod. Saggezza (minimo 1) per riposo lungo.'),
    F(14, 'Viandante dei Sogni', 'Dopo un riposo breve puoi lanciare senza slot né componenti materiali Cerchio di Teletrasporto, Scrutare o Sogno (tu come messaggero). Cerchio di Teletrasporto apre un portale verso l\'ultimo luogo in cui hai completato un riposo lungo sul piano attuale (altrimenti fallisce senza essere sprecato). Una volta per riposo lungo.'),
  ], 'Il druido legato alla Selva Fatata: guarigione, sentieri nascosti e viaggi onirici.');
  agg('druido', 'pastore', 'Circolo del Pastore', [
    F(2, 'Lingua dei Boschi', 'Impari a parlare, leggere e scrivere il Silvano; le bestie capiscono le tue parole e tu decifri i loro rumori e movimenti.'),
    F(2, 'Totem Spirituale', 'Azione bonus: evochi uno spirito incorporeo entro 18 m che crea un\'aura di 9 m (1 minuto o finché sei incapacitato; azione bonus per muoverlo di 18 m). Una volta per riposo breve o lungo. Falco: reazione per dare vantaggio a un tiro per colpire contro un bersaglio nell\'aura; tu e gli alleati nell\'aura avete vantaggio a Percezione (Sag). Orso: le creature scelte nell\'aura ottengono 5 + livello da druido PF temporanei all\'evocazione; tu e gli alleati avete vantaggio a prove e TS di Forza. Unicorno: tu e gli alleati avete vantaggio alle prove per individuare creature nell\'aura; se lanci un incantesimo con slot che ripristina PF, ogni creatura scelta nell\'aura recupera anche PF pari al tuo livello da druido.'),
    F(6, 'Evocatore Possente', 'Le bestie e i folletti che evochi o crei con un incantesimo hanno 2 PF extra per Dado Vita e le loro armi naturali sono magiche.'),
    F(10, 'Spirito Guardiano', 'Quando una bestia o un folletto da te evocato/creato con un incantesimo termina il turno nell\'aura del Totem Spirituale, recupera PF pari a metà del tuo livello da druido.'),
    F(14, 'Evocazioni Fedeli', 'Se scendi a 0 PF o sei incapacitato contro la tua volontà, ottieni subito Evoca Animali come con slot di 9° livello: quattro bestie GS 2 o meno entro 6 m da te, che ti proteggono se non comandate; dura 1 ora senza concentrazione. Una volta per riposo lungo.'),
  ], 'Il druido protettore di bestie e folletti, con spiriti totemici e evocazioni potenziate.');
  /* ---------- GUERRIERO ---------- */
  agg('guerriero', 'arciere', 'Arciere Arcano', [
    F(3, 'Conoscenze dell\'Arciere Arcano', 'Competenza in Arcano o Natura (a scelta) e impari il trucchetto Prestidigitazione o Artificio Druidico.'),
    F(3, 'Tiro Arcano', 'Impari due opzioni di Tiro Arcano (una in più a 7°, 10°, 15° e 18° livello; dal 18° ogni opzione migliora). Una volta per turno, quando scagli una freccia con un arco corto o lungo come parte dell\'azione di Attacco, puoi applicarle un\'opzione: la decidi quando colpisce (salvo opzioni senza tiro per colpire). Due usi, recuperati con un riposo breve o lungo. CD del TS = 8 + competenza + mod. Intelligenza.'),
    F(7, 'Freccia Magica', 'Ogni freccia non magica scagliata con arco corto o lungo può diventare magica per superare resistenze e immunità ai danni non magici; la magia svanisce dopo il tiro.'),
    F(7, 'Tiro Curvo', 'Quando manchi con una freccia magica puoi usare un\'azione bonus per ripetere il tiro per colpire contro un bersaglio diverso entro 18 m dal bersaglio originale.'),
    F(15, 'Tiro Sempre Pronto', 'Se tiri l\'iniziativa e non hai usi di Tiro Arcano, ne recuperi uno.'),
  ], 'Il guerriero che infonde magia elfica nelle frecce con effetti soprannaturali.');
  agg('guerriero', 'errante', 'Cavaliere Errante', [
    F(3, 'Competenza Bonus', 'Competenza in Addestrare Animali, Intrattenere, Intuizione, Persuasione o Storia (a scelta), oppure impari un linguaggio a scelta.'),
    F(3, 'Nato in Sella', 'Vantaggio ai TS per non cadere dalla cavalcatura; se cadi di non più di 3 m e non sei incapacitato atterri in piedi; montare/smontare costa solo 1,5 m di movimento.'),
    F(3, 'Marchio Incrollabile', 'Quando colpisci con un attacco in mischia puoi marchiare la creatura fino alla fine del tuo prossimo turno (termina se sei incapacitato o muori, o se qualcun altro la marchia). Entro 1,5 m da te ha svantaggio ai tiri per colpire che non ti bersagliano. Se infligge danni a un altro, nel tuo turno successivo puoi attaccarla con un attacco speciale in mischia come azione bonus, con vantaggio e danni extra pari a metà del tuo livello da guerriero. Usi pari al mod. Forza (minimo 1) per riposo lungo.'),
    F(7, 'Manovra Protettiva', 'Se tu o una creatura entro 1,5 m che vedi viene colpita da un attacco, reazione (con arma da mischia o scudo): tiri 1d8 e lo aggiungi alla CA del bersaglio contro quell\'attacco; se colpisce comunque, il bersaglio ha resistenza ai danni dell\'attacco. Usi pari al mod. Costituzione (minimo 1) per riposo lungo.'),
    F(10, 'Mantenere la Posizione', 'Le creature provocano un attacco di opportunità da te quando si muovono di 1,5 m o più entro la tua portata; se lo colpisci, la velocità del bersaglio scende a 0 fino a fine turno.'),
    F(15, 'Carica Feroce', 'Se ti muovi di almeno 3 m in linea retta subito prima di attaccare e colpisci, il bersaglio fa un TS Forza (CD 8 + competenza + mod. Forza) o cade prono. Una volta per turno.'),
    F(18, 'Difensore Vigile', 'Hai una reazione speciale, utilizzabile una volta per turno di ogni creatura (tranne il tuo), solo per un attacco di opportunità e non nello stesso turno in cui usi la reazione normale.'),
  ], 'Il guerriero cavalleresco: combatte in sella e protegge chi gli è affidato.');
  agg('guerriero', 'samurai', 'Samurai', [
    F(3, 'Competenza Bonus', 'Competenza in Intrattenere, Intuizione, Persuasione o Storia (a scelta), oppure impari un linguaggio a scelta.'),
    F(3, 'Spirito Combattivo', 'Azione bonus: vantaggio ai tiri per colpire con le armi fino a fine turno e 5 PF temporanei (10 al 10°, 15 al 15° livello). Tre usi, recuperati con un riposo lungo.'),
    F(7, 'Cortigiano Elegante', 'Aggiungi il mod. di Saggezza alle prove di Carisma (Persuasione). Ottieni competenza nei TS su Saggezza (se già l\'hai, in quelli su Intelligenza o Carisma a scelta).'),
    F(10, 'Spirito Instancabile', 'Quando tiri l\'iniziativa e non hai usi di Spirito Combattivo, ne recuperi uno.'),
    F(15, 'Colpo Rapido', 'Se nel tuo turno effettui l\'azione di Attacco e hai vantaggio al tiro per colpire contro un bersaglio, puoi rinunciare al vantaggio per effettuare un attacco con arma aggiuntivo contro di lui. Una volta per turno.'),
    F(18, 'Forza di fronte alla Morte', 'Se subisci danni che ti porterebbero a 0 PF senza ucciderti sul colpo, reazione: ritardi la perdita di sensi e fai subito un turno extra (interrompendo l\'attuale); i danni a 0 PF causano comunque fallimenti ai TS contro morte e tre fallimenti ti uccidono; a fine turno extra cadi privo di sensi se hai ancora 0 PF. Una volta per riposo lungo.'),
  ], 'Il guerriero di spirito indomabile: vantaggio e PF temporanei a comando.');
  /* Opzioni di Tiro Arcano (scelta vera) */
  D.SCELTE.push({ id: 'tiroarcano', cl: 'guerriero', sub: 'arciere', nome: 'Opzioni di Tiro Arcano', da: 3, n: (L) => (L >= 18 ? 6 : L >= 15 ? 5 : L >= 10 ? 4 : L >= 7 ? 3 : 2), nota: 'Una nuova opzione a 7°, 10°, 15° e 18° livello; puoi sostituirne una quando sali di livello. Dal 18° livello ogni opzione migliora (danni raddoppiati).', opz: [
    ['afferrante', 'Freccia Afferrante', 'Evocazione. Rovi velenosi: 2d6 veleno extra; 2d6 taglienti la prima volta per turno che il bersaglio si muove di 30 cm o più; velocità −3 m. Il bersaglio o chi ha portata fino a lui usa un\'azione per rimuoverli con una prova di Forza (Atletica) contro la CD; altrimenti 1 minuto o finché non usi di nuovo l\'opzione. Dal 18°: 4d6 veleno e 4d6 taglienti.'],
    ['ammaliante', 'Freccia Ammaliante', 'Ammaliamento. 2d6 psichici extra; il bersaglio sceglie un tuo alleato entro 9 m: TS Saggezza o è affascinato da lui fino all\'inizio del tuo prossimo turno (termina se l\'alleato lo attacca, lo danneggia o lo costringe a un TS). Dal 18°: 4d6.'],
    ['cercatrice', 'Freccia Cercatrice', 'Divinazione. Non fai tiro per colpire: scegli una creatura vista nell\'ultimo minuto; la freccia vola verso di lei (svolta gli angoli, ignora mezza copertura e tre quarti). Se è nella gittata e c\'è un percorso: TS Destrezza; se fallisce subisce i danni della freccia + 1d6 forza e conosci la sua posizione; se supera, metà danni e non la conosci. Dal 18°: 2d6 forza.'],
    ['ombra', 'Freccia d\'Ombra', 'Illusione. 2d6 psichici extra; TS Saggezza o il bersaglio non vede oltre 1,5 m fino all\'inizio del tuo prossimo turno. Dal 18°: 4d6.'],
    ['esiliante', 'Freccia Esiliante', 'Abiurazione. TS Carisma o il bersaglio è esiliato nella Selva Fatata: incapacitato e velocità 0 fino alla fine del suo turno successivo, poi ricompare. Dal 18°: anche 2d6 danni da forza.'],
    ['esplosiva', 'Freccia Esplosiva', 'Invocazione. Dopo il colpo, il bersaglio e tutte le creature entro 3 m da esso subiscono 2d6 danni da forza. Dal 18°: 4d6.'],
    ['indebolente', 'Freccia Indebolente', 'Necromanzia. 2d6 necrotici extra; TS Costituzione o i danni delle sue armi sono dimezzati fino all\'inizio del tuo prossimo turno. Dal 18°: 4d6.'],
    ['perforante', 'Freccia Perforante', 'Trasmutazione. Non fai tiro per colpire: la freccia avanza lungo una linea larga 30 cm e lunga 9 m ignorando oggetti e copertura; ogni creatura sulla linea fa un TS Destrezza: se fallisce subisce i danni della freccia + 1d6 perforanti, se supera la metà. Dal 18°: 2d6 perforanti.'],
  ] });
  /* ---------- LADRO ---------- */
  agg('ladro', 'esploratore', 'Esploratore', [
    F(3, 'Schermagliatore', 'Come reazione, quando un nemico termina il suo turno entro 1,5 m da te, ti muovi fino a metà della tua velocità senza provocare attacchi di opportunità.'),
    F(3, 'Survivalista', 'Competenza in Natura e Sopravvivenza (se non l\'hai già); il tuo bonus di competenza è raddoppiato nelle prove che le usano.'),
    F(9, 'Mobilità Superiore', 'La tua velocità base sul terreno aumenta di 3 m (anche scalare e nuotare, se le possiedi).'),
    F(13, 'Maestro di Imboscate', 'Vantaggio ai tiri per l\'iniziativa. La prima creatura che colpisci nel primo round di un combattimento è più facile da colpire: tutti i tiri per colpire contro di lei hanno vantaggio fino all\'inizio del tuo turno successivo.'),
    F(17, 'Colpo Improvviso', 'Se effettui l\'azione di Attacco nel tuo turno, puoi fare un attacco aggiuntivo come azione bonus. Può beneficiare dell\'Attacco Furtivo anche se l\'hai già usato in questo turno, ma non puoi usarlo due volte contro lo stesso bersaglio nello stesso turno.'),
  ], 'Il ladro esploratore: avanguardia nelle terre selvagge, mobile e implacabile.');
  agg('ladro', 'indagatore', 'Indagatore', [
    F(3, 'Orecchio per l\'Inganno', 'Nelle prove di Saggezza (Intuizione) per capire se una creatura mente, un d20 pari o inferiore a 7 conta come 8.'),
    F(3, 'Occhio per i Dettagli', 'Azione bonus: puoi effettuare una prova di Saggezza (Percezione) per notare una creatura o un oggetto nascosto oppure di Intelligenza (Indagare) per scoprire o decifrare indizi.'),
    F(3, 'Combattimento Intuitivo', 'Azione bonus: prova di Saggezza (Intuizione) contrapposta all\'Inganno (Carisma) di una creatura che vedi e non incapacitata. Se hai successo puoi usare l\'Attacco Furtivo contro di lei anche senza vantaggio (ma non con svantaggio), per 1 minuto o finché non lo usi con successo contro un altro bersaglio.'),
    F(9, 'Occhio di Lince', 'Vantaggio alle prove di Saggezza (Percezione) e Intelligenza (Indagare) se non ti muovi di più di metà della tua velocità nel turno.'),
    F(13, 'Occhio Infallibile', 'Azione: percepisci illusioni, mutaforma in forma diversa dall\'originale e altre magie concepite per ingannare i sensi entro 9 m (se non sei accecato o assordato), senza rivelazioni su ciò che è celato. Usi pari al mod. Saggezza (minimo 1) per riposo lungo.'),
    F(17, 'Individuare il Punto Debole', 'Finché Combattimento Intuitivo si applica a una creatura, il tuo Attacco Furtivo contro di essa infligge 3d6 danni extra.'),
  ], 'Il ladro investigatore: smaschera menzogne e debolezze con occhio clinico.');
  agg('ladro', 'pianificatore', 'Pianificatore', [
    F(3, 'Maestro di Intrighi', 'Competenza nei trucchi per il camuffamento, negli arnesi da falsario e in un gioco a scelta; impari due linguaggi a scelta. Puoi imitare infallibilmente il parlare e l\'accento di una creatura che hai sentito parlare per almeno 1 minuto (se conosci il linguaggio).'),
    F(3, 'Maestro di Tattiche', 'Puoi usare l\'azione di Aiuto come azione bonus; quando aiuti un alleato ad attaccare, il bersaglio può trovarsi entro 9 m da te (invece di 1,5 m) se puoi vederti o sentirti.'),
    F(9, 'Manipolatore Intuitivo', 'Dopo almeno 1 minuto passato a osservare una creatura o a interagire con lei fuori dal combattimento, il DM ti rivela se è pari, superiore o inferiore a te in due tra: Intelligenza, Saggezza, Carisma, livelli di classe. A discrezione del DM scopri parte della sua storia o un tratto caratteriale.'),
    F(13, 'Fuorviare', 'Reazione: quando sei bersaglio di un attacco e una creatura entro 1,5 m ti fornisce copertura contro di esso, l\'attacco bersaglia quella creatura anziché te.'),
    F(17, 'Anima Ingannevole', 'I tuoi pensieri non possono essere letti con la telepatia o altri mezzi se non vuoi; puoi proiettare falsi pensieri con una prova di Carisma (Inganno) contro l\'Intuizione (Saggezza) di chi li legge. Le magie che stabiliscono se menti dicono sempre che dici la verità, se lo desideri, e non puoi essere costretto a dire la verità con la magia.'),
  ], 'Il ladro stratega: intrighi, segreti, tattiche e inganni.');
  agg('ladro', 'spadaccino', 'Spadaccino', [
    F(3, 'Gioco di Gambe', 'Nel tuo turno, se effettui un attacco in mischia contro una creatura, essa non può effettuare attacchi di opportunità contro di te per il resto del turno.'),
    F(3, 'Audacia del Fanfarone', 'Aggiungi il mod. di Carisma ai tiri per l\'iniziativa. Non ti serve vantaggio per usare l\'Attacco Furtivo se nessun\'altra creatura oltre al bersaglio è entro 1,5 m da te (le altre regole restano).'),
    F(9, 'Spavalderia', 'Azione: prova di Carisma (Persuasione) contro l\'Intuizione (Saggezza) di una creatura che ti sente e condivide un linguaggio. Se vinci e la creatura è ostile: svantaggio ai tiri per colpire contro altri bersagli e niente attacchi di opportunità contro altri, per 1 minuto, finché un tuo compagno non la attacca o influenza con un incantesimo, o finché a più di 18 m. Se non è ostile: è affascinata per 1 minuto (finisce se tu o i compagni le fate qualcosa di dannoso).'),
    F(13, 'Manovra Elegante', 'Azione bonus: vantaggio alla successiva prova di Destrezza (Acrobazia) o Forza (Atletica) nello stesso turno.'),
    F(17, 'Maestro Duellante', 'Se manchi con un tiro per colpire puoi ripeterlo con vantaggio. Una volta per riposo breve o lungo.'),
  ], 'Il ladro duellante: velocità, fascino e fioretto.');
  /* ---------- MAGO ---------- */
  agg('mago', 'guerra', 'Magia della Guerra', [
    F(2, 'Deviazione Arcana', 'Reazione: quando vieni colpito da un attacco o fallisci un TS, ottieni +2 alla CA contro quell\'attacco o +4 a quel TS. Finché il tuo turno successivo non termina puoi lanciare solo trucchetti.'),
    F(2, 'Ingegno Tattico', 'Aggiungi il tuo mod. di Intelligenza ai tiri per l\'iniziativa.'),
    F(6, 'Impulso di Potere', 'Puoi immagazzinare impulsi di potere fino al tuo mod. Intelligenza (minimo 1); dopo un riposo lungo ne hai 1. Ne ottieni uno quando termini con successo un incantesimo con Dissolvi Magie o Controincantesimo, e se completi un riposo breve senza impulsi. Una volta per turno, quando infliggi danni con un incantesimo da mago, puoi spenderne uno per infliggere danni da forza extra pari a metà del tuo livello da mago.'),
    F(10, 'Magia Durevole', 'Finché mantieni la concentrazione su un incantesimo hai +2 alla CA e a tutti i tiri salvezza.'),
    F(14, 'Sudario di Deviazione', 'Quando usi Deviazione Arcana puoi far sprigionare una scarica di energia: fino a tre creature a tua scelta entro 18 m che vedi subiscono danni da forza pari a metà del tuo livello da mago.'),
  ], 'Il mago da guerra: invocazione e abiurazione per attaccare e difendersi insieme.');
  /* ---------- MONACO ---------- */
  agg('monaco', 'kensei', 'Via del Kensei', [
    F(3, 'Cammino del Kensei', 'Armi da kensei: scegli un\'arma da mischia e un\'arma a distanza (semplici o da guerra, senza le proprietà pesante e speciale; vale anche l\'arco lungo): competenza se non l\'hai, e sono armi da monaco. A 6°, 11° e 17° livello scegli un tipo di arma in più. Parata Agile: se fai un colpo senz\'armi con l\'azione di Attacco e impugni un\'arma da mischia da kensei, +2 alla CA fino al tuo turno successivo. Tiro del Kensei: azione bonus, i bersagli colpiti con attacchi a distanza con armi da kensei subiscono 1d4 danni extra fino a fine turno. Via del Pennello: competenza in scorte da calligrafo o strumenti da pittore (a scelta).'),
    F(6, 'Tutt\'uno con la Lama', 'Le armi da kensei sono magiche per superare resistenze e immunità. Colpo Abile: quando colpisci con un\'arma da kensei puoi spendere 1 punto ki per infliggere danni extra pari al tuo dado di Arti Marziali (una volta per turno).'),
    F(11, 'Affilare la Lama', 'Azione bonus: spendi fino a 3 punti ki per dare a un\'arma da kensei che tocchi un bonus ai tiri per colpire e ai danni pari ai punti spesi, per 1 minuto o finché non lo usi di nuovo (nessun effetto su armi magiche che hanno già un bonus).'),
    F(17, 'Precisione Infallibile', 'Se manchi con un\'arma da monaco nel tuo turno puoi ripetere il tiro per colpire. Una volta per turno.'),
  ], 'Il monaco che fa dell\'arma un\'estensione del corpo: precisione, ki e calligrafia.');
  agg('monaco', 'ubriaco', 'Via del Maestro Ubriaco', [
    F(3, 'Competenze Bonus', 'Competenza in Intrattenere e nelle scorte da mescitore.'),
    F(3, 'Tecnica dell\'Ubriaco', 'Quando usi la Raffica di Colpi ottieni i benefici dell\'azione di Disimpegno e la tua velocità base aumenta di 3 m fino a fine turno.'),
    F(6, 'Andatura Ondeggiante', 'Balzare in Piedi: alzarsi da prono costa 1,5 m di movimento. Ridirigere Attacco: quando una creatura manca il monaco con un attacco in mischia, reazione e 1 punto ki per far colpire quell\'attacco un\'altra creatura (non l\'attaccante) entro 1,5 m da te che vedi.'),
    F(11, 'Fortuna dell\'Ubriaco', 'Quando hai svantaggio a una prova di caratteristica, tiro per colpire o TS, puoi spendere 2 punti ki per annullare lo svantaggio.'),
    F(17, 'Frenesia Intossicata', 'Quando usi la Raffica di Colpi puoi fare fino a tre attacchi aggiuntivi (cinque in totale), purché ogni attacco della Raffica bersagli una creatura diversa in questo turno.'),
  ], 'Il monaco dai movimenti imprevedibili: danza di parate, fughe e colpi.');
  agg('monaco', 'solare', 'Via dell\'Anima Solare', [
    F(3, 'Dardo del Sole Radioso', 'Nuova opzione di attacco con l\'azione di Attacco: attacco con incantesimo a distanza, gittata 9 m, sei competente, aggiungi il mod. Destrezza a tiro per colpire e danni; danni radiosi con il dado di Arti Marziali (d4 al 3°, ecc.). Puoi spendere 1 punto ki per farlo due volte come azione bonus se hai usato l\'azione di Attacco (con Attacco Extra vale per qualsiasi attacco dell\'azione).'),
    F(6, 'Colpo dell\'Onda Incandescente', 'Dopo l\'azione di Attacco puoi spendere 2 punti ki per lanciare Mani Brucianti come azione bonus; ogni punto ki aggiuntivo aumenta di 1 il livello dell\'incantesimo (massimo 2 + punti extra pari a metà del tuo livello da monaco).'),
    F(11, 'Esplosione Solare Incandescente', 'Azione: scagli un globo di luce fino a 45 m che esplode in una sfera di 6 m di raggio: ogni creatura fa un TS Costituzione (nessun TS dietro copertura totale) o subisce 2d6 danni radiosi. Per ogni punto ki speso (fino a 3) i danni aumentano di 2d6.'),
    F(17, 'Scudo Solare', 'Aura di luce intensa 9 m e fioca altri 9 m, estinguibile o ripristinabile con azione bonus. Se una creatura ti colpisce in mischia mentre la luce splende, reazione: subisce danni radiosi pari a 5 + il tuo mod. Saggezza.'),
  ], 'Il monaco che trasforma il ki in dardi e globi di luce radiosa.');
  /* ---------- PALADINO (sottoclasse al 3° livello) ---------- */
  agg('paladino', 'conquista', 'Giuramento di Conquista', [
    F(3, 'Incanalare Divinità: Colpo Guidato', 'Quando effettui un tiro per colpire puoi ottenere +10 al tiro; decidi dopo aver visto il risultato ma prima che il DM dichiari se colpisce.'),
    F(3, 'Incanalare Divinità: Presenza Conquistatrice', 'Azione: ogni creatura a tua scelta entro 9 m che vedi fa un TS Saggezza o è spaventata da te per 1 minuto; ripete il TS a fine di ogni suo turno.'),
    F(7, 'Aura di Conquista', 'Aura di 3 m (9 m dal 18° livello) finché non sei incapacitato: una creatura spaventata da te ha velocità 0 finché è nell\'aura e subisce danni psichici pari a metà del tuo livello da paladino se inizia il turno lì.'),
    F(15, 'Intimorire Sprezzante', 'Chi ti colpisce con un attacco subisce danni psichici pari al tuo mod. Carisma (minimo 1), se non sei incapacitato.'),
    F(20, 'Conquistatore Invincibile', 'Azione: per 1 minuto diventi un avatar della conquista: resistenza a tutti i danni; un attacco aggiuntivo con l\'azione di Attacco; le armi da mischia mettono a segno un critico con 19 o 20. Una volta per riposo lungo.'),
  ], 'Il paladino che schiaccia il caos con paura e dominio: cavaliere tiranno.');
  agg('paladino', 'redenzione', 'Giuramento di Redenzione', [
    F(3, 'Incanalare Divinità: Emissario di Pace', 'Azione bonus: +5 alle prove di Carisma (Persuasione) per 10 minuti.'),
    F(3, 'Incanalare Divinità: Intimorire i Violenti', 'Reazione, subito dopo che un attaccante entro 9 m infligge danni con un attacco a una creatura diversa da te: TS Saggezza; se fallisce subisce danni radiosi pari ai danni che ha appena inflitto, se supera la metà.'),
    F(7, 'Aura del Guardiano', 'Quando una creatura entro 3 m (9 m dal 18° livello) subisce danni, reazione: subisci tu quei danni al posto suo. Non trasferisce altri effetti e i danni non possono essere ridotti in alcun modo.'),
    F(15, 'Spirito Protettivo', 'Se termini il tuo turno in combattimento con meno della metà dei PF e non sei incapacitato, recuperi 1d6 + metà del tuo livello da paladino PF.'),
    F(20, 'Emissario di Redenzione', 'Resistenza a tutti i danni inflitti da altre creature; chi ti colpisce con un attacco subisce danni radiosi pari a metà dei danni che hai subito. Se attacchi una creatura, lanci un incantesimo su di essa o le infliggi danni (non con questo privilegio), i benefici non funzionano contro di essa finché non completi un riposo lungo.'),
  ], 'Il paladino pacificatore: crede nella redenzione e protegge anche a proprio danno.');
  D.INC_SUB['paladino/conquista'] = [ids('Armatura di Agathys', 'Comando'), ids('Arma Spirituale', 'Blocca Persone'), ids('Paura', 'Scagliare Maledizione'), ids('Dominare Bestie', 'Pelle di Pietra'), ids('Dominare Persone', 'Nube Mortale')];
  D.INC_SUB['paladino/redenzione'] = [ids('Santuario', 'Sonno'), ids('Blocca Persone', 'Calmare Emozioni'), ids('Controincantesimo', 'Trama Ipnotica'), ids('Pelle di Pietra', 'Sfera Elastica di Otiluke'), ids('Blocca Mostri', 'Muro di Forza')];
  /* ---------- RANGER (sottoclasse al 3° livello) ---------- */
  agg('ranger', 'tenebre', 'Cacciatore delle Tenebre', [
    F(3, 'Magia del Cacciatore delle Tenebre', 'Incantesimi aggiuntivi da ranger (non contano nel numero di incantesimi conosciuti): Camuffare Se Stesso (3°), Trucco della Corda (5°), Paura (9°), Invisibilità Superiore (13°), Sembrare (17°).'),
    F(3, 'Imboscata Terrificante', 'Aggiungi il mod. di Saggezza ai tiri per l\'iniziativa. All\'inizio del tuo primo turno di ogni combattimento la tua velocità base aumenta di 3 m fino a fine turno; se effettui l\'azione di Attacco puoi fare un attacco aggiuntivo con arma come parte dell\'azione e, se colpisce, il bersaglio subisce 1d8 danni extra del tipo dell\'arma.'),
    F(3, 'Vista dell\'Ombra', 'Scurovisione entro 18 m (+9 m se ce l\'hai già dalla razza). Nell\'oscurità sei invisibile a qualsiasi creatura che si affidi alla scurovisione per vedere nel buio.'),
    F(7, 'Mente di Ferro', 'Competenza nei TS su Saggezza (se già l\'hai, in quelli su Intelligenza o Carisma a scelta).'),
    F(11, 'Raffica del Cacciatore', 'Una volta in ogni tuo turno in cui manchi con un attacco con arma puoi fare un altro attacco con arma come parte della stessa azione.'),
    F(15, 'Schivata dell\'Ombra', 'Quando una creatura ti attacca senza vantaggio, reazione: imponi svantaggio a quel tiro (prima di conoscerne l\'esito).'),
  ], 'Il ranger delle tenebre: imboscate fulminee nell\'oscurità.');
  agg('ranger', 'uccisore', 'Uccisore di Mostri', [
    F(3, 'Magia dell\'Uccisore di Mostri', 'Incantesimi aggiuntivi da ranger (non contano nel numero di incantesimi conosciuti): Protezione dal Bene e dal Male (3°), Zona di Verità (5°), Cerchio Magico (9°), Esilio (13°), Blocca Mostri (17°).'),
    F(3, 'Percezione del Cacciatore', 'Azione: scegli una creatura entro 18 m che vedi e apprendi le sue eventuali resistenze, immunità e vulnerabilità ai danni (se è celata alla divinazione percepisci che non ne ha). Usi pari al mod. Saggezza (minimo 1) per riposo lungo.'),
    F(3, 'Preda dell\'Uccisore', 'Azione bonus: designa una creatura entro 18 m che vedi; la prima volta in ogni turno che la colpisci con un attacco con arma subisce 1d6 danni extra. Dura fino a un riposo breve o lungo o finché non designi un\'altra creatura.'),
    F(7, 'Difesa Soprannaturale', 'Aggiungi 1d6 ai TS che ti impone il bersaglio della tua Preda dell\'Uccisore e alle prove di caratteristica per sfuggire alla lotta con lui.'),
    F(11, 'Nemesi degli Incantatori', 'Reazione: quando una creatura entro 18 m lancia un incantesimo o si teletrasporta, fa un TS Saggezza (CD incantesimi) o l\'incantesimo/teletrasporto fallisce ed è sprecato. Una volta per riposo breve o lungo.'),
    F(15, 'Contrattacco dell\'Uccisore', 'Se il bersaglio della tua Preda ti costringe a un TS, reazione: attacchi con arma la preda prima del TS; se colpisce, superi automaticamente il TS e applichi i normali effetti dell\'attacco.'),
  ], 'Il ranger cacciatore di creature della notte e di chi usa la magia nera.');
  agg('ranger', 'orizzonte', 'Viandante dell\'Orizzonte', [
    F(3, 'Magia del Viandante dell\'Orizzonte', 'Incantesimi aggiuntivi da ranger (non contano nel numero di incantesimi conosciuti): Protezione dal Bene e dal Male (3°), Passo Velato (5°), Velocità (9°), Esilio (13°), Cerchio di Teletrasporto (17°).'),
    F(3, 'Individuazione dei Portali', 'Azione: individui distanza e direzione del portale planare più vicino entro 1,5 km. Una volta per riposo breve o lungo.'),
    F(3, 'Combattente Planare', 'Azione bonus: scegli una creatura entro 9 m che vedi; la prossima volta che la colpisci in questo turno con un attacco con arma tutti i danni diventano da forza e subisce 1d8 danni da forza extra (2d8 dall\'11° livello).'),
    F(7, 'Passo Etereo', 'Azione bonus: lanci Forma Eterea senza slot; l\'incantesimo termina alla fine del tuo turno attuale. Una volta per riposo breve o lungo.'),
    F(11, 'Colpo Distante', 'Con l\'azione di Attacco puoi teletrasportarti fino a 3 m in uno spazio libero che vedi prima di ogni attacco. Se attacchi almeno due creature diverse puoi fare un attacco aggiuntivo contro una terza creatura.'),
    F(15, 'Difesa Spettrale', 'Reazione, quando subisci danni da un attacco: resistenza a tutti i danni di quell\'attacco in questo turno.'),
  ], 'Il ranger che sorveglia i portali planari e combatte tra i piani.');
  D.INC_SUB['ranger/tenebre'] = [ids('Camuffare Se Stesso'), ids('Trucco della Corda'), ids('Paura'), ids('Invisibilità Superiore'), ids('Sembrare')];
  D.INC_SUB['ranger/uccisore'] = [ids('Protezione dal Bene e dal Male'), ids('Zona di Verità'), ids('Cerchio Magico'), ids('Esilio'), ids('Blocca Mostri')];
  D.INC_SUB['ranger/orizzonte'] = [ids('Protezione dal Bene e dal Male'), ids('Passo Velato'), ids('Velocità'), ids('Esilio'), ids('Cerchio di Teletrasporto')];
  /* ---------- STREGONE (origine al 1° livello) ---------- */
  agg('stregone', 'divina', 'Anima Divina', [
    F(1, 'Magia Divina', 'Quando impari o sostituisci un trucchetto o un incantesimo da stregone di 1° livello o superiore puoi sceglierlo anche dalla lista del chierico (diventa un incantesimo da stregone). Scegli un\'affinità (bene, male, legge, caos, neutralità): impari un incantesimo aggiuntivo che non conta nel limite di incantesimi conosciuti, e se lo sostituisci devi sostituirlo con un incantesimo da chierico. Bene: Cura Ferite. Male: Infliggi Ferite. Legge: Benedizione. Caos: Anatema. Neutralità: Protezione dal Bene e dal Male.'),
    F(1, 'Prescelto dagli Dèi', 'Se fallisci un TS o manchi con un tiro per colpire puoi tirare 2d4 e aggiungerli al totale. Una volta per riposo breve o lungo.'),
    F(6, 'Guarigione Potenziata', 'Quando tu o un alleato entro 1,5 m tirate i dadi per i PF ripristinati da un incantesimo, puoi spendere 1 punto stregoneria per ripetere il tiro di un numero qualsiasi di quei dadi (una volta, se non sei incapacitato; solo una volta per turno).'),
    F(14, 'Ali Ultraterrene', 'Azione bonus: ali spettrali e velocità di volare 9 m finché non sei incapacitato, muori o le congedi con un\'azione bonus. Aspetto: aquila (bene/legge), pipistrello (male/caos), libellula (neutralità).'),
    F(18, 'Recupero Ultraterreno', 'Azione bonus, quando hai meno della metà dei PF: recuperi PF pari a metà del tuo massimo. Una volta per riposo lungo.'),
  ], 'Lo stregone toccato dal divino: magia da chierico, fortuna sacra e ali ultraterrene.');
  agg('stregone', 'ombre', 'Magia delle Ombre', [
    F(1, 'Occhi dell\'Oscuro', 'Scurovisione entro 36 m. Al 3° livello impari Oscurità (non conta nel limite) e puoi lanciarla spendendo 2 punti stregoneria o 1 slot; con i punti stregoneria vedi attraverso l\'oscurità creata.'),
    F(1, 'Forza della Tomba', 'Quando i danni ti porterebbero a 0 PF fai un TS Carisma (CD 5 + danni subiti): se lo superi scendi invece a 1 PF. Non vale con danni radiosi o colpi critici. Dopo un successo non puoi riusarlo fino a un riposo lungo.'),
    F(6, 'Segugio dei Presagi Nefasti', 'Azione bonus, 3 punti stregoneria: evochi un segugio (statistiche del lupo feroce, ma Medio e mostruosità) che bersaglia una creatura entro 36 m che vedi. PF temporanei pari a metà del tuo livello da stregone; si muove attraverso creature e oggetti come terreno difficile (5 danni da forza se termina il turno in un oggetto); conosce la posizione del bersaglio; compare entro 9 m dal bersaglio, può solo muoversi verso di lui e attaccarlo (anche attacchi di opportunità solo su di lui). Il bersaglio ha svantaggio ai TS contro i tuoi incantesimi finché il segugio è entro 1,5 m. Scompare a 0 PF, se il bersaglio scende a 0 PF o dopo 5 minuti.'),
    F(14, 'Camminare nelle Ombre', 'Azione bonus, se sei in luce fioca o oscurità: ti teletrasporti fino a 36 m in uno spazio libero che vedi, anch\'esso in luce fioca o oscurità.'),
    F(18, 'Forma d\'Ombra', 'Azione bonus, 6 punti stregoneria: per 1 minuto hai resistenza a tutti i danni tranne radiosi e da forza e ti muovi attraverso creature e oggetti come terreno difficile (5 danni da forza se termini il turno in un oggetto). Termina se sei incapacitato, muori o la congedi con un\'azione bonus.'),
  ], 'Lo stregone delle ombre: creatura della Coltre Oscura, difficile da uccidere.');
  agg('stregone', 'tempesta', 'Stregoneria della Tempesta', [
    F(1, 'Portavoce del Vento', 'Parli, leggi e scrivi il Primordiale (capisci Aquan, Auran, Ignan e Terran).'),
    F(1, 'Magia Tempestosa', 'Azione bonus, subito prima o dopo aver lanciato un incantesimo di 1° livello o superiore: voli fino a 3 m senza provocare attacchi di opportunità.'),
    F(6, 'Cuore della Tempesta', 'Resistenza ai danni da fulmine e da tuono. Quando inizi a lanciare un incantesimo di 1° livello o superiore che infligge danni da fulmine o da tuono, le creature a tua scelta entro 3 m che vedi subiscono danni da fulmine o tuono (scegli tu) pari a metà del tuo livello da stregone.'),
    F(6, 'Guida della Tempesta', 'Se piove puoi usare un\'azione per fermare la pioggia in una sfera di 6 m centrata su di te (termina con azione bonus). Se c\'è vento, azione bonus per ogni round: scegli la direzione del vento in una sfera di 30 m centrata su di te fino alla fine del tuo prossimo turno (senza cambiarne la velocità).'),
    F(14, 'Furia della Tempesta', 'Reazione, quando sei colpito da un attacco in mischia: l\'attaccante subisce danni da fulmine pari al tuo livello da stregone e fa un TS Forza (CD incantesimi) o viene spinto di 6 m in linea retta lontano da te.'),
    F(18, 'Anima del Vento', 'Immunità ai danni da fulmine e da tuono; velocità di volare magica 18 m. Azione: riduci la tua velocità di volare a 9 m per 1 ora e dai velocità di volare 9 m per 1 ora a 3 + mod. Carisma creature entro 9 m. Una volta per riposo breve o lungo.'),
  ], 'Lo stregone dell\'aria elementale: vento, tuoni e fulmini.');
  /* incantesimi aggiuntivi */
  D.INC_SUB['stregone/ombre'] = [[], ids('Oscurità')];
  D.INC_SUB_LIV_KEY['stregone/ombre'] = [1, 3];
  /* Anima Divina: l'incantesimo dipende dall'affinità scelta */
  D.INC_SUB_SCELTA = D.INC_SUB_SCELTA || {};
  D.INC_SUB_SCELTA['stregone/divina'] = { gruppo: 'affinita', liv: 1, mappa: { bene: ids('Cura Ferite'), male: ids('Infliggi Ferite'), legge: ids('Benedizione'), caos: ids('Anatema'), neutralita: ids('Protezione dal Bene e dal Male') } };
  D.SCELTE.push({ id: 'affinita', cl: 'stregone', sub: 'divina', nome: 'Affinità Divina', da: 1, n: () => 1, nota: 'Decide l\'incantesimo aggiuntivo (e l\'aspetto delle Ali Ultraterrene).', opz: [
    ['bene', 'Bene', 'Incantesimo aggiuntivo: Cura Ferite. Ali d\'aquila.'],
    ['male', 'Male', 'Incantesimo aggiuntivo: Infliggi Ferite. Ali da pipistrello.'],
    ['legge', 'Legge', 'Incantesimo aggiuntivo: Benedizione. Ali d\'aquila.'],
    ['caos', 'Caos', 'Incantesimo aggiuntivo: Anatema. Ali da pipistrello.'],
    ['neutralita', 'Neutralità', 'Incantesimo aggiuntivo: Protezione dal Bene e dal Male. Ali da libellula.'],
  ] });
  /* ---------- WARLOCK (patrono al 1° livello) ---------- */
  agg('warlock', 'celestiale', 'Il Celestiale', [
    F(1, 'Lista Ampliata degli Incantesimi', 'Gli incantesimi del Celestiale si aggiungono alla lista da warlock: Cura Ferite e Dardo Tracciante (1°); Ristorare Inferiore e Sfera Infuocata (2°); Luce Diurna e Rinascita (3°); Guardiano della Fede e Muro di Fuoco (4°); Colpo Infuocato e Ristorare Superiore (5°).'),
    F(1, 'Trucchetti Bonus', 'Impari i trucchetti Fiamma Sacra e Luce (contano come da warlock ma non nel limite).'),
    F(1, 'Luce Guaritrice', 'Hai una riserva di d6 pari a 1 + il tuo livello da warlock. Azione bonus: curi una creatura entro 18 m che vedi spendendo dadi (al massimo il tuo mod. Carisma, minimo 1 dado): recupera PF pari al totale. La riserva si ricarica con un riposo lungo.'),
    F(6, 'Anima Radiosa', 'Resistenza ai danni radiosi. Quando lanci un incantesimo che infligge danni radiosi o da fuoco, aggiungi il mod. Carisma a un tiro per i danni radiosi o da fuoco contro uno dei bersagli.'),
    F(10, 'Resilienza Celestiale', 'Dopo un riposo breve o lungo ottieni PF temporanei pari al tuo livello da warlock + mod. Carisma; fino a cinque creature che vedi alla fine del riposo ottengono PF temporanei pari a metà del tuo livello da warlock + mod. Carisma.'),
    F(14, 'Vendetta Incandescente', 'Quando devi fare un TS contro morte all\'inizio del tuo turno puoi invece rialzarti in un\'esplosione di energia radiosa: recuperi PF pari a metà del tuo massimo e ogni creatura a tua scelta entro 9 m subisce 2d8 + mod. Carisma danni radiosi ed è accecata fino a fine turno. Una volta per riposo lungo.'),
  ], 'Il patrono dei Piani Superiori: cura, luce sacra e fuoco radioso.');
  agg('warlock', 'sortilegio', 'La Lama del Sortilegio', [
    F(1, 'Lista Ampliata degli Incantesimi', 'Gli incantesimi della Lama del Sortilegio si aggiungono alla lista da warlock: Punizione Collerica e Scudo (1°); Punizione Marchiante e Sfocatura (2°); Arma Elementale e Intermittenza (3°); Allucinazione Mortale e Punizione Demoralizzante (4°); Cono di Freddo e Punizione Esiliante (5°).'),
    F(1, 'Maledizione della Lama del Sortilegio', 'Azione bonus: maledici una creatura entro 9 m che vedi per 1 minuto (termina se il bersaglio o tu morite o se sei incapacitato): bonus ai danni contro di essa pari alla competenza; i tuoi tiri per colpire contro di essa sono critici con 19 o 20; se muore recuperi PF pari al tuo livello da warlock + mod. Carisma (minimo 1). Una volta per riposo breve o lungo.'),
    F(1, 'Combattente del Sortilegio', 'Competenza nelle armature medie, negli scudi e nelle armi da guerra. Dopo un riposo lungo puoi toccare un\'arma in cui sei competente (senza la proprietà a due mani): usi il mod. Carisma invece di Forza o Destrezza per tiri per colpire e danni, fino al riposo lungo. Se ottieni il Patto della Lama, vale per ogni arma del patto evocata.'),
    F(6, 'Spettro Maledetto', 'Quando uccidi un umanoide puoi far emergere il suo spirito come spettro (statistiche del Manuale dei Mostri) con PF temporanei pari a metà del tuo livello da warlock, ai tuoi ordini, con bonus ai tiri per colpire pari al mod. Carisma (minimo +0). Dura fino alla fine del riposo lungo successivo. Una volta per riposo lungo.'),
    F(10, 'Armatura dei Sortilegi', 'Se il bersaglio maledetto ti colpisce con un tiro per colpire, reazione: tira 1d6; con 4 o più l\'attacco manca a prescindere dal tiro.'),
    F(14, 'Maestro dei Sortilegi', 'Quando la creatura maledetta dalla tua Maledizione muore, puoi applicare la maledizione a un\'altra creatura entro 9 m che vedi (se non sei incapacitato), senza recuperare PF per la morte precedente.'),
  ], 'Il patto con la forza della Coltre Oscura: maledizioni e armi d\'ombra.');
  D.INC_SUB['warlock/celestiale'] = [ids('Cura Ferite', 'Dardo Tracciante'), ids('Ristorare Inferiore', 'Sfera Infuocata'), ids('Luce Diurna', 'Rinascita'), ids('Guardiano della Fede', 'Muro di Fuoco'), ids('Colpo Infuocato', 'Ristorare Superiore')];
  D.INC_SUB['warlock/sortilegio'] = [ids('Punizione Collerica', 'Scudo'), ids('Punizione Marchiante', 'Sfocatura'), ids('Arma Elementale', 'Intermittenza'), ids('Allucinazione Mortale', 'Punizione Demoralizzante'), ids('Cono di Freddo', 'Punizione Esiliante')];
  /* ---- Suppliche Occulte di Xanathar: [id, nome, testo, livMin, patto, trucchetto] ---- */
  D.OPZ_FONTE = D.OPZ_FONTE || {};
  const gr = (id) => D.SCELTE.find((g) => g.id === id);
  const add = (id, o) => { const g = gr(id); if (!g) return; g.opz.push(o); D.OPZ_FONTE[id + '/' + o[0]] = FONTE; };
  [
    ['arma-migliorata', 'Arma del Patto Migliorata', 'L\'arma evocata con il Patto della Lama può essere usata come focus da incantatore; ottiene +1 ai tiri per colpire e ai danni (se non è già magica con bonus); può essere un arco corto, un arco lungo, una balestra leggera o una pesante.', 0, 'lama'],
    ['aspetto-luna', 'Aspetto della Luna', 'Non hai più bisogno di dormire e non puoi essere costretto a farlo; per un riposo lungo puoi passare tutte le 8 ore in attività leggere (es. leggere il Libro delle Ombre, fare la guardia).', 0, 'tomo'],
    ['dono-imperituri', 'Dono degli Imperituri', 'Quando recuperi PF mentre il tuo famiglio è entro 30 m da te, ogni dado tirato per i PF recuperati conta come se avesse ottenuto il risultato massimo.', 0, 'catena'],
    ['dono-profondita', 'Dono delle Profondità', 'Respiri sott\'acqua e hai velocità di nuotare pari alla velocità sul terreno. Lanci Respirare Sott\'Acqua una volta senza slot (riposo lungo).', 5],
    ['fuga-ingannatore', 'Fuga dell\'Ingannatore', 'Lanci Libertà di Movimento una volta su te stesso senza slot (riposo lungo).', 7],
    ['mantello-mosche', 'Mantello di Mosche', 'Azione bonus: aura di 1,5 m (non oltre la copertura totale) simile a uno sciame di mosche, finché non sei incapacitato o la congedi. Vantaggio alle prove di Carisma (Intimidire), svantaggio alle altre prove di Carisma; ogni altra creatura che inizia il turno nell\'aura subisce danni da veleno pari al tuo mod. Carisma (minimo 0). Una volta per riposo breve o lungo.', 5],
    ['lancia-letargia', 'Lancia della Letargia', 'Una volta per turno, quando colpisci una creatura con Deflagrazione Occulta, riduci la sua velocità di 3 m fino alla fine del tuo turno successivo.', 0, '', 'deflagrazione-occulta'],
    ['punizione-occulta', 'Punizione Occulta', 'Una volta per turno, quando colpisci con l\'arma del patto puoi spendere uno slot da warlock per infliggere 1d8 danni da forza extra + 1d8 per livello dello slot e far cadere prono il bersaglio (Enorme o inferiore).', 5, 'lama'],
    ['sguardo-fantasma', 'Sguardo Fantasma', 'Azione: per 1 minuto (concentrazione) vedi attraverso gli oggetti solidi entro 9 m e hai scurovisione in quella gittata; percepisci gli oggetti come immagini spettrali e trasparenti. Una volta per riposo breve o lungo.', 7],
    ['sortilegio-pazzia', 'Sortilegio della Pazzia', 'Prerequisito: incantesimo Sortilegio o un privilegio da warlock che maledica. Azione bonus: infliggi danni psichici pari al tuo mod. Carisma (minimo 1) al bersaglio maledetto e a ogni creatura a tua scelta entro 1,5 m da esso. Devi vedere il bersaglio ed essere entro 9 m.', 5],
    ['sortilegio-implacabile', 'Sortilegio Implacabile', 'Prerequisito: incantesimo Sortilegio o un privilegio da warlock che maledica. Azione bonus: ti teletrasporti fino a 9 m in uno spazio libero che vedi entro 1,5 m dal bersaglio maledetto (che devi vedere).', 7],
    ['stretta-hadar', 'Stretta di Hadar', 'Una volta per turno, quando colpisci una creatura con Deflagrazione Occulta, puoi trascinarla in linea retta di 3 m verso di te.', 0, '', 'deflagrazione-occulta'],
    ['sudario-ombre', 'Sudario delle Ombre', 'Lanci Invisibilità a volontà, senza slot.', 15],
    ['tomba-levistus', 'Tomba di Levistus', 'Reazione, quando subisci danni: ti rinchiudi in una tomba di ghiaccio (si scioglie alla fine del tuo turno successivo) e ottieni 10 PF temporanei per livello da warlock, che assorbono il massimo dei danni innescanti. Subito dopo hai vulnerabilità al fuoco, velocità 0 e sei incapacitato fino allo scioglimento (inclusi i PF temporanei rimasti). Una volta per riposo breve o lungo.', 5],
  ].forEach((o) => add('suppliche', o));
  /* ---- Talenti Razziali (cap. 1, pp. 73-76): nome → testo ---- */
  D.TALENTI_FONTE = D.TALENTI_FONTE || {};
  D.TALENTI_DESC = D.TALENTI_DESC || {};
  const tal = (nome, desc) => { D.TALENTI_FONTE[nome] = FONTE; D.TALENTI_DESC[nome] = desc; };
  tal('Agilità Tarchiata', 'Prerequisito: Nano o razza Piccola. +1 a Forza o Destrezza (max 20); velocità base +1,5 m; competenza in Acrobazia o Atletica (a scelta); vantaggio alle prove di Atletica o Acrobazia per sfuggire a una lotta.');
  tal('Alta Magia Drow', 'Prerequisito: Elfo (drow). Impari Individuazione del Magico (a volontà) e Levitazione e Dissolvi Magie (una volta ciascuno, riposo lungo), senza slot. Caratteristica da incantatore: Carisma.');
  tal('Costituzione Infernale', 'Prerequisito: Tiefling. +1 a Costituzione (max 20); resistenza ai danni da freddo e da veleno; vantaggio ai TS per non essere avvelenato.');
  tal('Fiamme di Flegeto', 'Prerequisito: Tiefling. +1 a Intelligenza o Carisma (max 20); quando tiri i danni da fuoco di un incantesimo puoi ripetere un 1 su un dado (usi il nuovo risultato); quando lanci un incantesimo che infligge danni da fuoco una cortina di fiamme ti avvolge fino alla fine del tuo prossimo turno (luce intensa 9 m + fioca 9 m, non ti danneggia): chi ti colpisce in mischia entro 1,5 m subisce 1d4 danni da fuoco.');
  tal('Fortuna Generosa', 'Prerequisito: Halfling. Quando un alleato entro 9 m che vedi ottiene 1 su un d20 (tiro per colpire, prova o TS), reazione: lo ripete e usa il nuovo risultato. Dopo l\'uso non puoi usare Fortunato fino alla fine del tuo turno successivo.');
  tal('Furia Orchesca', 'Prerequisito: Mezzorco. +1 a Forza o Costituzione (max 20); quando colpisci con un\'arma semplice o da guerra puoi tirare un dado dei danni dell\'arma in più come danni extra (una volta per riposo breve o lungo); subito dopo Tenacia Implacabile puoi usare la reazione per un attacco con arma.');
  tal('Magia degli Elfi dei Boschi', 'Prerequisito: Elfo (dei boschi). Impari un trucchetto da druido a scelta e Passo Veloce e Passare senza Tracce (una volta ciascuno, riposo lungo), senza slot. Caratteristica da incantatore: Saggezza.');
  tal('Paura Draconica', 'Prerequisito: Dragonide. +1 a Forza, Costituzione o Carisma (max 20); invece di esalare l\'Arma a Soffio puoi ruggire: ogni creatura a tua scelta entro 9 m fa un TS Saggezza (CD 8 + competenza + mod. Carisma) o è spaventata per 1 minuto (ripete il TS se subisce danni). Supera automaticamente chi non può vederti o sentirti.');
  tal('Pelle di Drago', 'Prerequisito: Dragonide. +1 a Forza, Costituzione o Carisma (max 20); senza armatura la CA è 13 + mod. Destrezza (anche con scudo); artigli retrattili: colpi senz\'armi con 1d4 + mod. Forza danni taglienti.');
  tal('Precisione Elfica', 'Prerequisito: Elfo o mezzelfo. +1 a Destrezza, Intelligenza, Saggezza o Carisma (max 20); quando hai vantaggio a un tiro per colpire che usa Destrezza, Intelligenza, Saggezza o Carisma puoi ripetere un dado una volta.');
  tal('Prodigio', 'Prerequisito: Mezzelfo, mezzorco o umano. Competenza in un\'abilità, in uno strumento e in un linguaggio a scelta; maestria (competenza raddoppiata) in un\'abilità in cui sei competente e che non benefici già di un raddoppio.');
  tal('Scomparire', 'Prerequisito: Gnomo. +1 a Destrezza o Intelligenza (max 20); reazione subito dopo aver subito danni: diventi invisibile fino alla fine del tuo turno successivo o finché non attacchi, infliggi danni o obblighi a un TS. Una volta per riposo breve o lungo.');
  tal('Seconda Possibilità', 'Prerequisito: Halfling. +1 a Destrezza, Costituzione o Carisma (max 20); reazione quando una creatura che vedi ti colpisce: deve ripetere il tiro per colpire. Si ricarica quando tiri l\'iniziativa o con un riposo breve o lungo.');
  tal('Teletrasporto Fatato', 'Prerequisito: Elfo (alto). +1 a Intelligenza o Carisma (max 20); impari il Silvano; impari Passo Velato (una volta, riposo breve o lungo) senza slot, caratteristica Intelligenza.');
  tal('Tempra Nanica', 'Prerequisito: Nano. +1 a Costituzione (max 20); ogni volta che effettui l\'azione di Schivata puoi spendere un Dado Vita: tiri il dado, aggiungi il mod. Costituzione e recuperi quei PF (minimo 1).');

  /* ---- Risorse (cerchietti sulla scheda) ---- */
  D.RIS_PRIV = Object.assign(D.RIS_PRIV || {}, {
    'barbaro/Consultare gli Spiriti': () => 1, 'barbaro/Presenza Zelante': () => 1,
    'bardo/Parole di Terrore': () => 1, 'bardo/Manto di Sussurri': () => 1, 'bardo/Conoscenze dell\'Ombra': () => 1, 'bardo/Esibizione Estasiante': () => 1, 'bardo/Manto di Maestà': () => 1, 'bardo/Maestà Inviolabile': () => 1,
    'chierico/Benedizione della Forgia': () => 1, 'chierico/Occhi della Tomba': (L, m) => Math.max(1, m.sag), 'chierico/Sentinella alla Porta della Morte': (L, m) => Math.max(1, m.sag),
    'druido/Balsamo della Corte dell\'Estate': (L) => L, 'druido/Sentieri Nascosti': (L, m) => Math.max(1, m.sag), 'druido/Viandante dei Sogni': () => 1, 'druido/Totem Spirituale': () => 1, 'druido/Evocazioni Fedeli': () => 1,
    'guerriero/Tiro Arcano': () => 2, 'guerriero/Marchio Incrollabile': (L, m) => Math.max(1, m.for), 'guerriero/Manovra Protettiva': (L, m) => Math.max(1, m.cos), 'guerriero/Spirito Combattivo': () => 3, 'guerriero/Forza di fronte alla Morte': () => 1,
    'ladro/Occhio Infallibile': (L, m) => Math.max(1, m.sag), 'ladro/Maestro Duellante': () => 1,
    'paladino/Conquistatore Invincibile': () => 1, 
    'ranger/Percezione del Cacciatore': (L, m) => Math.max(1, m.sag), 'ranger/Nemesi degli Incantatori': () => 1, 'ranger/Individuazione dei Portali': () => 1, 'ranger/Passo Etereo': () => 1,
    'stregone/Prescelto dagli Dèi': () => 1, 'stregone/Recupero Ultraterreno': () => 1, 'stregone/Forza della Tomba': () => 1, 'stregone/Anima del Vento': () => 1,
    'warlock/Luce Guaritrice': (L) => 1 + L, 'warlock/Vendetta Incandescente': () => 1, 'warlock/Maledizione della Lama del Sortilegio': () => 1, 'warlock/Spettro Maledetto': () => 1,
  });

  D.registraManuale('xge', {
    nome: 'Guida Omnicomprensiva di Xanathar', sigla: 'Xanathar', ordine: 0,
    desc: '31 nuove sottoclassi (inclusi Arciere Arcano con le Opzioni di Tiro Arcano, Cavaliere Errante, Samurai, Lama del Sortilegio), le Suppliche Occulte, i Talenti Razziali e gli incantesimi di Xanathar (testo italiano con l\'errata 2020).',
  });
  D.tashaAssegnaTratti();
})(typeof window !== 'undefined' ? window : globalThis);
