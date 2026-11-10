/* Calderone Omnicomprensivo di Tasha – sottoclassi (testi sintetizzati dal manuale italiano + errata 08/2022; le descrizioni sono riassunti nostri, i numeri sono quelli del manuale). */
(function (G) {
  const D = G.DND;
  const FONTE = 'tce';
  const F = (liv, nome, desc) => [liv, nome, desc];
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const AL = { 'lama roboante': 'lama tonante', 'tentacoli neri di evard': 'tentacoli neri', 'sfera congelante di otiluke': 'sfera congelante', 'parola curativa': 'parola guaritrice', 'parola curativa di massa': 'parola guaritrice di massa', 'capanna di leomund': 'capanna', 'legame telepatico di rary': 'legame telepatico', 'sfera elastica di otiluke': 'sfera elastica', 'freccia acida di melf': 'freccia acida' };
  D.TASHA_MANCANTI = D.TASHA_MANCANTI || [];
  const idDa = (nome) => { const n = AL[norm(nome)] || norm(nome); const s = D.INCANTESIMI.find((x) => norm(x.nome) === n) || D.INCANTESIMI.find((x) => norm(x.nome).replace(/ \(.*$/, '') === n); if (!s) { D.TASHA_MANCANTI.push(nome); return null; } return s.id; };
  const ids = (...n) => n.map(idDa).filter(Boolean);
  const agg = (cl, id, nome, tratti, desc) => {
    const c = D.classe(cl); c.sottoclasse.opzioni.push({ id, nome, tratti: [], fonte: FONTE });
    D.TRATTI_SUB[cl + '/' + id] = tratti; D.DESC.sottoclasse[cl + '/' + id] = desc;
  };

  /* ---------- BARBARO ---------- */
  agg('barbaro', 'bestia', 'Cammino della Bestia', [
    F(3, 'Forma della Bestia', 'Quando entri in Ira puoi trasformarti: finché l\'Ira dura sei un\'arma naturale (conta come arma da mischia semplice, aggiungi mod. For ad attacco e danni). Scegli a ogni Ira: Morso (1d8 perforanti; una volta per turno, se hai meno della metà dei PF quando infliggi danni recuperi PF pari alla competenza), Artigli (1d6 taglienti; una volta per turno, con l\'azione Attacco, un attacco con artiglio extra) oppure Coda (1d8 perforanti, portata; reazione: se una creatura entro 3 m ti colpisce aggiungi 1d8 alla CA contro quell\'attacco).'),
    F(6, 'Anima Bestiale', 'Le armi naturali della Forma della Bestia sono magiche. Dopo ogni riposo breve o lungo scegli un adattamento fino al riposo successivo: nuotare (velocità di nuotare pari alla velocità e respiro sott\'acqua), scalare (velocità di scalare pari alla velocità, anche sui soffitti) oppure saltare (prova di Atletica una volta per turno: salto più lungo di totale × 30 cm).'),
    F(10, 'Furia Contagiosa', 'Quando colpisci con un\'arma naturale in Ira, il bersaglio fa un TS Saggezza (CD 8 + Cos + competenza) o subisce un effetto a tua scelta: usa la reazione per attaccare in mischia un\'altra creatura che scegli, oppure subisce 2d12 danni psichici. Competenza volte per riposo lungo.'),
    F(14, 'Chiamata alla Caccia', 'Entrando in Ira scegli fino a Cos creature consenzienti (minimo 1) entro 9 m che vedi: ottieni 5 PF temporanei per ciascuna; fino alla fine dell\'Ira ognuna può, una volta per turno, aggiungere 1d6 ai danni di un attacco che colpisce. Competenza volte per riposo lungo.'),
  ], 'Il barbaro la cui Ira libera la bestia interiore: lo trasforma in un\'arma naturale con morso, artigli o coda.');
  agg('barbaro', 'magiaselvaggia', 'Cammino della Magia Selvaggia', [
    F(3, 'Consapevolezza Magica', 'Azione: fino alla fine del tuo prossimo turno conosci la posizione di ogni incantesimo e oggetto magico entro 18 m non dietro copertura totale, e la scuola di magia di un incantesimo. Competenza volte per riposo lungo.'),
    F(3, 'Impeto Selvaggio', 'Quando entri in Ira tira un d8 sulla tabella Magia Selvaggia (CD dei TS 8 + competenza + Cos): 1 viticci oscuri (TS Cos o 1d12 necrotici alle creature che scegli entro 9 m, e tu ottieni 1d12 PF temporanei); 2 teletrasporto di 9 m (ripetibile ogni turno con azione bonus); 3 spirito che esplode (TS Des o 1d6 forza entro 1,5 m; ripetibile con azione bonus); 4 un\'arma impugnata infligge danni da forza, è leggera e da lancio (6/18 m) e ritorna; 5 chi ti colpisce subisce 1d6 forza; 6 luci protettive: +1 alla CA tua e degli alleati entro 3 m; 7 fiori e viti: terreno difficile per i nemici entro 4,5 m; 8 fulmine dal petto (TS Cos o 1d6 radiosi e accecato fino al tuo prossimo turno; ripetibile con azione bonus).'),
    F(6, 'Magia Corroborante', 'Azione: tocca una creatura (anche te): per 10 minuti può tirare 1d3 e sommarlo a ogni tiro per colpire e prova di caratteristica, oppure recupera uno slot di livello pari o inferiore al risultato di 1d3. Una creatura beneficia di questo effetto una volta per riposo lungo. Competenza volte per riposo lungo.'),
    F(10, 'Reazione Instabile', 'Subito dopo aver subito danni o fallito un TS durante l\'Ira, reazione: tira sulla tabella Magia Selvaggia e sfrutta subito l\'effetto, che sostituisce quello attuale.'),
    F(14, 'Impeto Controllato', 'Ogni volta che tiri sulla tabella Magia Selvaggia tira due dadi e scegli il risultato; se escono numeri uguali scegli l\'effetto che preferisci.'),
  ], 'Il barbaro la cui Ira libera magia selvaggia: ogni volta che si infuria succede qualcosa di inatteso.');

  /* ---------- BARDO ---------- */
  agg('bardo', 'eloquenza', 'Collegio dell\'Eloquenza', [
    F(3, 'Arte Oratoria', 'Nelle prove di Carisma (Persuasione) e Carisma (Inganno) un d20 pari o inferiore a 9 conta come 10.'),
    F(3, 'Parole Inquietanti', 'Azione bonus: spendi un uso di Ispirazione Bardica e scegli una creatura entro 18 m che vedi; tira il dado di Ispirazione e la creatura sottrae il risultato dal TS successivo che effettua prima dell\'inizio del tuo prossimo turno.'),
    F(6, 'Ispirazione Infallibile', 'Quando una creatura aggiunge un tuo dado di Ispirazione Bardica a una prova, un attacco o un TS e il tiro fallisce, può tenersi il dado.'),
    F(6, 'Linguaggio Universale', 'Azione: scegli fino a Car creature (minimo 1) entro 18 m che vedi: ti comprendono magicamente, qualunque lingua parlino, per 1 ora. Poi non puoi riusarlo fino al riposo lungo, a meno di spendere uno slot di qualsiasi livello.'),
    F(14, 'Ispirazione Contagiosa', 'Reazione: quando una creatura entro 18 m aggiunge con successo un tuo dado di Ispirazione Bardica a una prova, un attacco o un TS, un\'altra creatura (non tu) entro 18 m che ti sente ottiene un dado di Ispirazione Bardica senza che tu spenda un uso. Car volte (minimo 1) per riposo lungo.'),
  ], 'Il bardo oratore: parole che convincono e scoraggiano, e un\'ispirazione che si propaga.');
  agg('bardo', 'creazione', 'Collegio della Creazione', [
    F(3, 'Granello di Potenziale', 'Quando dai un dado di Ispirazione Bardica a una creatura, un granello Minuscolo orbita entro 1,5 m da lei finché il dado non è perso. Quando il dado è usato: su una prova di caratteristica la creatura tira di nuovo il dado e sceglie il risultato; su un tiro per colpire il bersaglio e le creature a tua scelta entro 1,5 m fanno un TS Cos o subiscono danni da tuono pari al dado; su un TS la creatura ottiene PF temporanei pari al dado + mod. Carisma (minimo 1).'),
    F(3, 'Compimento della Creazione', 'Azione: crei un oggetto non magico a scelta in uno spazio libero entro 3 m (valore massimo 20 mo × livello da bardo; Medio o minore, Grande dal 6°, Enorme dal 14°). Dura ore pari alla competenza; ne hai uno solo alla volta. Una volta per riposo lungo, o spendendo uno slot di 2° livello o superiore.'),
    F(6, 'Oggetto Danzante', 'Azione: animi un oggetto non magico Grande o minore entro 9 m che vedi: costrutto amichevole (CA 16, PF 10 + 5 × livello da bardo, velocità 9 m e volare 9 m fluttuando, Schianto Rinforzato 1d10 + competenza forza; Danza Irrefrenabile: modifica di 3 m la velocità di chi inizia il turno entro 3 m). Dura 1 ora, ne hai uno alla volta; obbedisce con la tua azione bonus (anche insieme a Ispirazione Bardica). Una volta per riposo lungo, o con uno slot di 3° livello o superiore.'),
    F(14, 'Crescendo Creativo', 'Con Compimento della Creazione puoi creare più oggetti insieme: pari a mod. Carisma (minimo 2); solo uno della taglia massima, gli altri Piccoli o Minuscoli. Non c\'è più il limite di valore in mo.'),
  ], 'Il bardo del Canto della Creazione: dà vita a oggetti e li anima, e potenzia l\'ispirazione con granelli di energia.');

  /* ---------- CHIERICO (sottoclasse al 1° livello) ---------- */
  agg('chierico', 'crepuscolo', 'Dominio del Crepuscolo', [
    F(1, 'Competenze Bonus', 'Competenza nelle armi da guerra e nelle armature pesanti.'),
    F(1, 'Occhi della Notte', 'Scurovisione entro 90 m (luce fioca vista come intensa, buio come luce fioca). Azione: la condividi con fino a Sag creature consenzienti (minimo 1) entro 3 m che vedi, per 1 ora. Poi non puoi riusarlo fino al riposo lungo, a meno di spendere uno slot di qualsiasi livello.'),
    F(1, 'Benedizione Vigile', 'Azione: una creatura che tocchi (anche te) ha vantaggio al successivo tiro di iniziativa; il vantaggio termina dopo il tiro o se usi di nuovo il privilegio.'),
    F(2, 'Incanalare Divinità: Santuario del Crepuscolo', 'Azione: una sfera di crepuscolo di raggio 9 m (luce fioca) è centrata su di te, ti segue e dura 1 minuto (o finché sei incapacitato o muori). Quando una creatura (te compreso) termina il turno nella sfera, ottiene PF temporanei pari a 1d6 + livello da chierico, oppure termina su di sé un effetto che la rende affascinata o spaventata.'),
    F(6, 'Passi nella Notte', 'Azione bonus, in luce fioca o buio: ottieni una velocità di volare pari alla velocità sul terreno per 1 minuto. Competenza volte per riposo lungo.'),
    F(8, 'Colpo Divino', 'Una volta per turno, quando colpisci con un\'arma, infliggi 1d8 danni radiosi extra (2d8 dal 14° livello).'),
    F(17, 'Sudario del Crepuscolo', 'Tu e i tuoi alleati nella sfera del Santuario del Crepuscolo avete mezza copertura.'),
  ], 'Il chierico del crepuscolo: conforta e protegge gli alleati dal buio, vede nella notte e vola nell\'oscurità.');
  agg('chierico', 'ordine', 'Dominio dell\'Ordine', [
    F(1, 'Competenze Bonus', 'Competenza nelle armature pesanti e in Intimidire o Persuasione (a scelta).'),
    F(1, 'Voce dell\'Autorità', 'Se lanci un incantesimo con uno slot di 1° livello o superiore avente un alleato come bersaglio, quell\'alleato può usare subito la reazione per fare un attacco con arma contro una creatura che vedi a tua scelta (se i bersagli sono più alleati, scegli tu quale attacca).'),
    F(2, 'Incanalare Divinità: Pretesa dell\'Ordine', 'Azione: ogni creatura a tua scelta entro 9 m che ti vede e sente fa un TS Saggezza o è affascinata fino al termine del tuo prossimo turno o finché subisce danni; puoi far lasciar cadere ciò che hanno in mano a chi fallisce.'),
    F(6, 'Incarnazione della Legge', 'Se lanci un incantesimo di ammaliamento con uno slot di 1° livello o superiore e tempo di lancio di 1 azione, puoi lanciarlo con un\'azione bonus. Sag volte (minimo 1) per riposo lungo.'),
    F(8, 'Colpo Divino', 'Una volta per turno, quando colpisci con un\'arma, infliggi 1d8 danni psichici extra (2d8 dal 14° livello).'),
    F(17, 'Ira dell\'Ordine', 'Se nel tuo turno infliggi danni con Colpo Divino puoi maledire la creatura fino all\'inizio del tuo prossimo turno: la prossima volta che un tuo alleato la colpisce con un attacco, subisce anche 2d8 danni psichici e la maledizione termina. Una volta per turno.'),
  ], 'Il chierico dell\'ordine: impone obbedienza, fa attaccare gli alleati e piega i nemici alla legge.');
  agg('chierico', 'pace', 'Dominio della Pace', [
    F(1, 'Strumento di Pace', 'Competenza in Intuizione, Intrattenere o Persuasione (a scelta).'),
    F(1, 'Legame Incoraggiante', 'Azione: scegli fino a competenza creature consenzienti entro 9 m che vedi (puoi includerti): per 10 minuti o finché non lo usi di nuovo sono legate; quando sono entro 9 m l\'una dall\'altra ognuna può aggiungere 1d4 a un tiro per colpire, una prova o un TS (una volta per turno). Competenza volte per riposo lungo.'),
    F(2, 'Incanalare Divinità: Balsamo della Pace', 'Azione: ti muovi fino alla tua velocità senza provocare attacchi di opportunità; ogni creatura entro 1,5 m dal tuo percorso recupera 2d6 + Sag PF (minimo 1), una volta per creatura.'),
    F(6, 'Legame Protettivo', 'Quando una creatura sotto Legame Incoraggiante sta per subire danni, una seconda creatura legata entro 9 m da lei può usare la reazione per teletrasportarsi entro 1,5 m dalla prima e subire tutto il danno.'),
    F(8, 'Incantesimi Potenti', 'Aggiungi il mod. di Saggezza ai danni dei tuoi trucchetti da chierico.'),
    F(17, 'Legame Espansivo', 'Legame Incoraggiante e Legame Protettivo funzionano entro 18 m e chi subisce il danno con Legame Protettivo ha resistenza a quel danno.'),
  ], 'Il chierico della pace: lega gli alleati, li protegge a vicenda e dona sollievo.');
  D.INC_SUB['chierico/crepuscolo'] = [ids('Luminescenza', 'Sonno'), ids('Bagliore Lunare', 'Vedere Invisibilità'), ids('Aura di Vitalità', 'Capanna di Leomund'), ids('Aura di Vita', 'Invisibilità Superiore'), ids('Cerchio di Potere', 'Fuorviare')];
  D.INC_SUB['chierico/ordine'] = [ids('Comando', 'Eroismo'), ids('Blocca Persone', 'Zona di Verità'), ids('Lentezza', 'Parola Curativa di Massa'), ids('Compulsione', 'Localizza Creatura'), ids('Comunione', 'Dominare Persone')];
  D.INC_SUB['chierico/pace'] = [ids('Eroismo', 'Santuario'), ids('Aiuto', 'Vincolo di Interdizione'), ids('Faro di Speranza', 'Inviare'), ids('Aura di Purezza', 'Sfera Elastica di Otiluke'), ids('Legame Telepatico di Rary', 'Ristorare Superiore')];

  /* ---------- DRUIDO ---------- */
  D.INC_SUB_LIV_KEY = D.INC_SUB_LIV_KEY || {};
  agg('druido', 'fiamma', 'Circolo della Fiamma', [
    F(2, 'Incantesimi del Circolo', 'Sempre preparati (non contano per i preparabili): Cura Ferite e Mani Brucianti (2°); Raggio Rovente e Sfera Infuocata (3°); Crescita Vegetale e Rinascita (5°); Aura di Vita e Scudo di Fuoco (7°); Colpo Infuocato e Cura Ferite di Massa (9°).'),
    F(2, 'Evocare Spirito della Fiamma', 'Azione, spendendo un uso di Forma Selvatica: evochi uno spirito della fiamma (Elementale Piccolo, CA 13, PF 5 + 5 × livello da druido, velocità 9 m e volare 9 m, immune al fuoco; Seme di Fiamma a distanza 18 m: 1d6 + competenza fuoco; Teletrasporto Esplosivo: 1d6 + competenza fuoco a chi è entro 1,5 m dal punto lasciato, TS Des) entro 9 m. Alla comparsa le creature entro 3 m dallo spirito (non tu) fanno un TS Des o subiscono 2d6 fuoco. Condivide la tua iniziativa, agisce dopo di te e può solo Schivare salvo tuo ordine (azione bonus). Dura 1 ora.'),
    F(6, 'Legame Migliorato', 'Finché lo spirito è attivo, quando lanci un incantesimo che infligge danni da fuoco o ripristina PF aggiungi 1d8 al lancio. Inoltre un incantesimo con portata diversa da "se stessi" può avere origine da te o dallo spirito.'),
    F(10, 'Fiamme Cauterizzanti', 'Quando una creatura Piccola o più grande muore entro 9 m da te o dallo spirito, compare per 1 minuto una fiamma spettrale nel suo spazio: quando una creatura che vedi vi entra puoi usare la reazione per estinguerla e curarla o ustionarla di 2d10 + Sag. Competenza volte per riposo lungo.'),
    F(14, 'Recupero Ardente', 'Se scendi a 0 PF e lo spirito è entro 36 m, puoi far scendere a 0 i PF dello spirito per recuperare metà dei tuoi PF e rialzarti subito. 1/riposo lungo.'),
  ], 'Il druido legato a uno spirito della fiamma: distruzione e rinascita, con un compagno di fuoco.');
  agg('druido', 'spore', 'Circolo delle Spore', [
    F(2, 'Incantesimi del Circolo', 'Impari il trucchetto Tocco Gelido; sempre preparati: Cecità/Sordità e Riposo Inviolato (3°); Animare Morti e Forma Gassosa (5°); Confusione e Inaridire (7°); Contagio e Nube Mortale (9°).'),
    F(2, 'Alone di Spore', 'Reazione: quando una creatura che vedi si muove entro 3 m da te o inizia il turno lì, fa un TS Costituzione (CD incantesimi) o subisce 1d4 danni necrotici (1d6 al 6°, 1d8 al 10°, 1d10 al 14° livello).'),
    F(2, 'Entità Simbiotica', 'Azione, spendendo un uso di Forma Selvatica: ottieni 4 PF temporanei per livello da druido. Per 10 minuti (o finché perdi tutti i PF temporanei o usi Forma Selvatica): l\'Alone di Spore tira i danni due volte; i tuoi attacchi con armi da mischia infliggono 1d6 danni necrotici extra.'),
    F(6, 'Infestazione Fungina', 'Reazione: una bestia o un umanoide Piccolo o Medio che muore entro 3 m si rialza con 1 PF come zombi (statistiche del Manuale dei Mostri); resta animato 1 ora, agisce dopo di te e può solo attaccare in mischia. Sag volte (minimo 1) per riposo lungo.'),
    F(10, 'Diffusione di Spore', 'Azione bonus, con Entità Simbiotica attiva: lanci le spore in un cubo di 3 m di spigolo entro 9 m per 1 minuto; chi vi entra o inizia lì il turno subisce i danni dell\'Alone di Spore (TS Cos), una volta per turno. Finché il cubo esiste non usi la reazione dell\'Alone.'),
    F(14, 'Corpo Fungino', 'Non puoi essere accecato, assordato, spaventato o avvelenato; i colpi critici contro di te contano come colpi normali (salvo che sei incapacitato).'),
  ], 'Il druido del ciclo di vita e decomposizione: spore necrotiche, funghi e non morti obbedienti.');
  agg('druido', 'stelle', 'Circolo delle Stelle', [
    F(2, 'Carta Celeste', 'Hai una carta celeste (oggetto Minuscolo che funge da focus druidico). Mentre la impugni conosci il trucchetto Guida e hai preparato Dardo Tracciante (conta come da druido, non per i preparabili); puoi lanciare Dardo Tracciante senza slot competenza volte per riposo lungo. Se la perdi, un rituale di 1 ora ne crea un\'altra.'),
    F(2, 'Forma Siderale', 'Azione bonus, spendendo un uso di Forma Selvatica: per 10 minuti emani luce intensa 3 m e fioca altri 3 m e scegli una costellazione. Arciere: azione bonus, attacco a distanza con incantesimo a 18 m: 1d8 + Sag radiosi. Calice: quando lanci un incantesimo con slot per ripristinare PF, tu o una creatura entro 9 m recupera 1d8 + Sag PF. Drago: nelle prove di Int o Sag e nei TS di concentrazione (Cos) un d20 pari o inferiore a 9 conta come 10.'),
    F(6, 'Presagio Cosmico', 'Dopo un riposo lungo tira un dado: pari = Ventura, dispari = Sventura (fino al riposo lungo). Reazione: quando una creatura entro 9 m che vedi sta per fare un tiro per colpire, un TS o una prova, tira 1d6 e lo aggiungi (Ventura) o lo sottrai (Sventura). Competenza volte per riposo lungo.'),
    F(10, 'Costellazioni Scintillanti', 'I dadi di Arciere e Calice diventano 2d8; il Drago dà una velocità di volare di 6 m (fluttuando). All\'inizio di ogni tuo turno puoi cambiare costellazione.'),
    F(14, 'Manto di Stelle', 'Con la Forma Siderale sei parzialmente incorporeo: resistenza ai danni contundenti, perforanti e taglienti.'),
  ], 'Il druido che attinge alla luce delle stelle: costellazioni che ispirano, guariscono e proteggono.');
  D.INC_SUB['druido/fiamma'] = [ids('Cura Ferite', 'Mani Brucianti'), ids('Raggio Rovente', 'Sfera Infuocata'), ids('Crescita Vegetale', 'Rinascita'), ids('Aura di Vita', 'Scudo di Fuoco'), ids('Colpo Infuocato', 'Cura Ferite di Massa')];
  D.INC_SUB['druido/spore'] = [ids('Tocco Gelido'), ids('Cecità/Sordità', 'Riposo Inviolato'), ids('Animare Morti', 'Forma Gassosa'), ids('Confusione', 'Inaridire'), ids('Contagio', 'Nube Mortale')];
  D.INC_SUB['druido/stelle'] = [ids('Guida', 'Dardo Tracciante')];
  D.INC_SUB_LIV_KEY['druido/fiamma'] = [2, 3, 5, 7, 9];
  D.INC_SUB_LIV_KEY['druido/spore'] = [2, 3, 5, 7, 9];
  D.INC_SUB_LIV_KEY['druido/stelle'] = [2];

  /* ---------- GUERRIERO ---------- */
  agg('guerriero', 'runico', 'Cavaliere Runico', [
    F(3, 'Competenze Bonus', 'Competenza negli strumenti da fabbro; sai parlare, leggere e scrivere il Gigante.'),
    F(3, 'Intagliatore di Rune', 'Conosci 2 rune (3 al 7°, 4 al 10°, 5 al 15° livello): ogni volta che sali di livello puoi sostituirne una. Dopo ogni riposo lungo incidi una runa diversa su ciascun oggetto che tocchi (arma, armatura, scudo, gioiello o altro oggetto indossato o tenuto in una mano), pari alle rune conosciute; una runa per oggetto, dura fino al riposo lungo. CD di Magia Runica = 8 + competenza + mod. Costituzione. Ogni runa ha un beneficio passivo e un effetto invocabile (una volta per riposo breve o lungo).'),
    F(3, 'Potenza del Gigante', 'Azione bonus, 1 minuto: se sei più piccolo diventi Grande (se c\'è spazio), hai vantaggio alle prove e ai TS di Forza e, una volta per turno, un attacco con arma o colpo senz\'armi infligge 1d6 danni extra (1d8 dal 10°, 1d10 dal 18°). Competenza volte per riposo lungo.'),
    F(7, 'Scudo Runico', 'Reazione: quando una creatura entro 18 m che vedi subisce un tiro per colpire, l\'attaccante ripete il d20 e usa il nuovo risultato. Competenza volte per riposo lungo.'),
    F(10, 'Grande Statura', 'Cresci permanentemente di 3d4 cm; il danno extra di Potenza del Gigante diventa 1d8.'),
    F(15, 'Maestro delle Rune', 'Puoi invocare ognuna delle rune conosciute due volte invece di una, recuperando gli usi con un riposo breve o lungo.'),
    F(18, 'Colosso Runico', 'Il danno extra di Potenza del Gigante diventa 1d10 e puoi diventare Enorme; a quella taglia la tua portata aumenta di 1,5 m.'),
  ], 'Il guerriero che incide rune dei giganti sul suo equipaggiamento e può ingigantirsi.');
  agg('guerriero', 'psionico', 'Guerriero Psionico', [
    F(3, 'Energia Psionica', 'Hai dadi di Energia Psionica pari al doppio della competenza (d6; d8 al 5°, d10 all\'11°, d12 al 17° livello). Recuperi tutti i dadi spesi con un riposo lungo e, una volta per riposo breve o lungo, ne recuperi uno con un\'azione bonus. Campo Protettivo: reazione, quando tu o una creatura entro 9 m subite danni, spendi un dado e riduci i danni del risultato + mod. Intelligenza (minimo 1). Colpo Psionico: una volta per turno, dopo aver colpito con un\'arma un bersaglio entro 9 m, spendi un dado per infliggere danni da forza pari al dado + mod. Intelligenza. Movimento Telecinetico: azione, sposti di 9 m un oggetto non equipaggiato Grande o minore o una creatura consenziente (o un oggetto Minuscolo da/verso la tua mano); una volta per riposo breve o lungo, o spendendo un dado.'),
    F(7, 'Adepto Telecinetico', 'Balzo Psionico: azione bonus, velocità di volare pari al doppio della velocità fino a fine turno (una volta per riposo breve o lungo, o spendendo un dado). Spinta Telecinetica: quando infliggi danni con Colpo Psionico il bersaglio fa un TS Forza (CD 8 + competenza + mod. Int) o è fatto cadere prono oppure spostato di 3 m in orizzontale.'),
    F(10, 'Scudo Mentale', 'Resistenza ai danni psichici. Se inizi il turno affascinato o spaventato, spendi un dado per terminare tutti gli effetti che causano quelle condizioni.'),
    F(15, 'Baluardo della Forza', 'Azione bonus: scegli fino a mod. Intelligenza creature (minimo 1, puoi includerti) entro 9 m che vedi: hanno mezza copertura per 1 minuto o finché sei incapacitato. Una volta per riposo lungo, o spendendo un dado.'),
    F(18, 'Maestro della Telecinesi', 'Lanci Telecinesi senza componenti (caratteristica da incantatore Intelligenza). Nei turni in cui ti concentri sull\'incantesimo puoi effettuare un attacco con arma come azione bonus. Una volta per riposo lungo, o spendendo un dado.'),
  ], 'Il guerriero dei poteri psionici: dadi di Energia Psionica per difendersi, colpire e muovere con la mente.');
  /* Rune del Cavaliere Runico (scelta vera) */
  D.SCELTE.push({ id: 'rune', cl: 'guerriero', sub: 'runico', nome: 'Rune Conosciute', da: 3, n: (L) => (L >= 15 ? 5 : L >= 10 ? 4 : L >= 7 ? 3 : 2), nota: 'Le rune si possono sostituire a ogni livello guadagnato. Runa delle Colline e delle Tempeste dal 7° livello.', opz: [
    ['nuvole', 'Runa delle Nuvole', 'Vantaggio a Rapidità di Mano e Inganno. Reazione: quando tu o una creatura entro 9 m che vedi subite un tiro per colpire, dirotti l\'attacco su un\'altra creatura entro 9 m (non l\'attaccante). Una volta per riposo breve o lungo.'],
    ['fuoco', 'Runa del Fuoco', 'Competenza raddoppiata nelle prove con strumenti. Quando colpisci con un\'arma puoi invocare catene infuocate: +2d6 danni da fuoco e il bersaglio fa un TS Forza o è trattenuto 1 minuto (2d6 fuoco a inizio di ogni suo turno; ripete il TS a fine turno). Una volta per riposo breve o lungo.'],
    ['gelo', 'Runa del Gelo', 'Vantaggio ad Addestrare Animali e Intimidire. Azione bonus: per 10 minuti +2 alle prove di caratteristica e ai TS su Forza e Costituzione. Una volta per riposo breve o lungo.'],
    ['pietre', 'Runa delle Pietre', 'Vantaggio a Intuizione e scurovisione 36 m. Reazione, quando una creatura che vedi termina il turno entro 9 m: TS Saggezza o è affascinata 1 minuto, con velocità 0 e incapacitata (ripete il TS a fine turno). Una volta per riposo breve o lungo.'],
    ['colline', 'Runa delle Colline', 'Vantaggio ai TS contro veleno e resistenza ai danni da veleno. Azione bonus: resistenza ai danni contundenti, perforanti e taglienti per 1 minuto. Una volta per riposo breve o lungo.', 7],
    ['tempeste', 'Runa delle Tempeste', 'Vantaggio alle prove di Arcano; non puoi essere sorpreso (se non incapacitato). Azione bonus: stato profetico per 1 minuto: con una reazione imponi vantaggio o svantaggio a un tiro per colpire, TS o prova di una creatura entro 18 m (te compreso). Una volta per riposo breve o lungo.', 7],
  ] });

  /* ---------- LADRO ---------- */
  agg('ladro', 'fantasma', 'Fantasma', [
    F(3, 'Sussurri dei Morti', 'Dopo ogni riposo breve o lungo puoi scegliere un\'abilità o una competenza negli strumenti che non hai e ottenerla grazie a una presenza spettrale; perdi la competenza scelta quando usi di nuovo questo privilegio.'),
    F(3, 'Lamenti dalla Tomba', 'Subito dopo un Attacco Furtivo nel tuo turno puoi scegliere un\'altra creatura che vedi entro 9 m dalla prima: tira metà (arrotondata per eccesso) dei dadi di Attacco Furtivo e la seconda creatura subisce danni necrotici pari al totale. Competenza volte per riposo lungo.'),
    F(9, 'Pegni dei Defunti', 'Reazione, quando una creatura muore entro 9 m: crei nella tua mano libera un pegno dell\'anima (oggetto Minuscolo); ne puoi avere al massimo competenza. Con un pegno con te hai vantaggio ai TS contro morte e ai TS su Costituzione. Quando fai un Attacco Furtivo puoi distruggere un pegno per usare Lamenti dalla Tomba senza consumare un uso. Azione: distruggi un pegno ovunque sia per porre una domanda allo spirito legato (risponde in una lingua che conosceva, brevemente, non necessariamente il vero).'),
    F(13, 'Cammino Fantasma', 'Azione bonus: forma spettrale per 10 minuti (o finché la termini con un\'azione bonus): velocità di volare 3 m (fluttuando), tiri per colpire contro di te con svantaggio, attraversi creature e oggetti come terreno difficile (1d10 danni da forza se termini il turno dentro uno). Per riusarlo servono un riposo lungo o la distruzione di un pegno come parte dell\'azione bonus.'),
    F(17, 'Compagno della Morte', 'Quando usi Lamenti dalla Tomba i danni necrotici colpiscono sia la prima che la seconda creatura. Alla fine di un riposo lungo, se non ne hai, ottieni un pegno dell\'anima.'),
  ], 'Il ladro toccato dalla morte: strumenti d\'altri mondi, pegni delle anime e attacchi che attraversano il velo.');
  agg('ladro', 'lama', 'Lama Spirituale', [
    F(3, 'Energia Psionica', 'Hai dadi di Energia Psionica pari al doppio della competenza (d6; d8 al 5°, d10 all\'11°, d12 al 17° livello). Recuperi tutti i dadi spesi con un riposo lungo e, una volta per riposo breve o lungo, ne recuperi uno con un\'azione bonus. Abilità Psicorinforzata: se fallisci una prova con un\'abilità o uno strumento in cui sei competente, tira un dado e aggiungilo (il dado è speso solo se la prova riesce). Sussurri Psichici: azione, scegli fino a competenza creature che vedi e tira un dado: per quel numero di ore potete parlare telepaticamente (entro 1,5 km); il primo uso dopo un riposo lungo non spende il dado.'),
    F(3, 'Lame Psichiche', 'Quando fai l\'azione di Attacco puoi manifestare una lama psichica nella mano libera: arma da mischia semplice accurata e da lancio (gittata 18 m), 1d6 + mod. della caratteristica usata danni psichici; svanisce dopo l\'attacco. Dopo l\'attacco puoi fare un attacco bonus con una seconda lama (azione bonus, 1d4 invece di 1d6) se l\'altra mano è libera.'),
    F(9, 'Lame dell\'Anima', 'Colpi Guidati: se manchi con le Lame Psichiche tira un dado di Energia Psionica e aggiungilo; se così colpisci il dado è speso. Teletrasporto Psichico: azione bonus, manifesti una lama e spendi un dado: la lanci in uno spazio libero che vedi a 3 m × il risultato e ti teletrasporti lì.'),
    F(13, 'Velo Psichico', 'Azione: invisibilità (con ciò che indossi e porti) per 1 ora o finché non la congedi; termina se infliggi danni o imponi un TS. Una volta per riposo lungo, o spendendo un dado di Energia Psionica.'),
    F(17, 'Squarciare la Mente', 'Quando fai un Attacco Furtivo con le Lame Psichiche, il bersaglio fa un TS Saggezza (CD 8 + competenza + mod. Des) o è stordito per 1 minuto (ripete il TS a fine turno). Una volta per riposo lungo, o spendendo tre dadi di Energia Psionica.'),
  ], 'Il ladro con poteri psionici: lame di energia mentale e dadi di Energia Psionica.');

  /* ---------- MAGO ---------- */
  agg('mago', 'canto', 'Canto della Lama', [
    F(2, 'Addestramento in Guerra e Canto', 'Competenza nelle armature leggere, in un tipo di arma da mischia a una mano a scelta e in Intrattenere (se non l\'hai già).'),
    F(2, 'Melodia della Lama', 'Azione bonus (senza armatura media o pesante né scudo): per 1 minuto ottieni CA + mod. Intelligenza (minimo +1), velocità +3 m, vantaggio alle prove di Acrobazia e +mod. Intelligenza (min. +1) ai TS su Costituzione per la concentrazione. Termina se sei incapacitato, indossi armatura media/pesante o scudo, o attacchi con un\'arma a due mani. Competenza volte per riposo lungo.'),
    F(6, 'Attacco Extra', 'Attacchi due volte (invece di una) con l\'azione di Attacco; puoi lanciare un trucchetto al posto di uno degli attacchi.'),
    F(10, 'Canzone di Difesa', 'Con la Melodia attiva, reazione: quando subisci danni spendi uno slot e riduci i danni di 5 volte il livello dello slot.'),
    F(14, 'Canzone di Vittoria', 'Con la Melodia attiva aggiungi il mod. di Intelligenza (minimo +1) ai danni degli attacchi con la tua arma da mischia.'),
  ], 'Il mago spadaccino elfico: scherma, danza e magia in un\'unica arte.');
  agg('mago', 'scribi', 'Ordine degli Scribi', [
    F(2, 'Calamo Incantato', 'Azione bonus: crei un pennino Minuscolo nella mano libera, che non richiede inchiostro (di colore a tua scelta). Copiare un incantesimo nel libro richiede 2 minuti per livello dell\'incantesimo. Puoi cancellare ciò che hai scritto entro 1,5 m con un\'azione bonus. Il pennino svanisce se ne crei un altro o muori.'),
    F(2, 'Libro degli Incantesimi Risvegliato', 'Quando impugni il libro: lo usi come focus; quando lanci un incantesimo da mago con uno slot puoi sostituire il tipo di danno con un tipo di un altro incantesimo del libro dello stesso livello dello slot; lanci un rituale nel tempo normale invece di +10 minuti (1/riposo lungo). Puoi trasferire la coscienza del libro in un altro libro durante un riposo breve usando il Calamo Incantato.'),
    F(6, 'Mente Manifesta', 'Azione bonus, con il libro: la mente appare come oggetto spettrale Minuscolo entro 18 m (luce fioca 3 m, scurovisione 18 m, vede e sente e condivide con te). Quando lanci un incantesimo da mago nel tuo turno puoi farlo dallo spazio della mente. Competenza volte al giorno; la fai fluttuare di 9 m con un\'azione bonus. Una volta evocata non puoi riusarla fino al riposo lungo, a meno di spendere uno slot di qualsiasi livello.'),
    F(10, 'Scrivano Arcano', 'Al termine di un riposo lungo crei una pergamena toccando un foglio vuoto col Calamo Incantato, copiando un incantesimo di 1° o 2° livello con tempo di lancio 1 azione dal tuo libro (entro 1,5 m): conta come di un livello superiore; si lancia leggendola con un\'azione, ma svanisce se lanciato o al riposo lungo. Costo e tempo per creare pergamene magiche sono dimezzati col Calamo.'),
    F(14, 'Comunione con il Testo', 'Vantaggio alle prove di Intelligenza (Arcano) col libro con te. Se subisci danni con la mente manifesta, reazione: eviti i danni e termini l\'evocazione; poi tira 3d6: il libro perde incantesimi a tua scelta di livello combinato pari o superiore al risultato (se non bastano scendi a 0 PF); li ritrovi dopo 1d6 riposi lunghi. 1/riposo lungo.'),
  ], 'Il mago-erudito: il suo libro degli incantesimi è un compagno senziente.');

  /* ---------- MONACO ---------- */
  agg('monaco', 'astrale', 'Via del Sé Astrale', [
    F(3, 'Braccia del Sé Astrale', 'Azione bonus, 1 ki: per 10 minuti evochi le braccia astrali (finché non sei incapacitato o muori). All\'evocazione ogni creatura a tua scelta che vedi entro 3 m fa un TS Destrezza o subisce danni da forza pari a due dadi di Arti Marziali. Finché sono evocate: usi Saggezza invece di Forza per prove e TS di Forza; puoi infliggere colpi senz\'armi con le braccia, con portata +1,5 m; per quei colpi usi Saggezza invece di Forza o Destrezza per tiri per colpire e danni, e infliggono danni da forza.'),
    F(6, 'Volto del Sé Astrale', 'Azione bonus (o insieme alle Braccia), 1 ki: per 10 minuti. Vista Astrale: vedi normalmente nel buio, anche magico, fino a 36 m. Saggezza dello Spirito: vantaggio a Intuizione e Intimidire. Parola dello Spirito: una creatura che vedi entro 18 m capisce le tue parole, oppure ti fai sentire da tutti entro 180 m.'),
    F(11, 'Corpo del Sé Astrale', 'Quando hai evocato Braccia e Volto, il corpo compare senza azione. Deviare l\'Energia: reazione, riduci di 1d10 + Sag i danni da acido, freddo, fuoco, forza, fulmine o tuono. Braccia Potenziate: una volta per turno, quando colpisci con le braccia infliggi un danno extra pari a un dado di Arti Marziali.'),
    F(17, 'Sé Astrale Risvegliato', 'Azione bonus, 5 ki: evochi braccia, volto e corpo insieme per 10 minuti. Armatura dello Spirito: +2 alla CA. Raffica Astrale: con Raffica di Colpi attacchi tre volte invece di due quando usi le braccia.'),
  ], 'Il monaco che evoca il proprio sé astrale: braccia, volto e corpo spettrali alimentati dal ki.');
  agg('monaco', 'misericordia', 'Via della Misericordia', [
    F(3, 'Strumenti di Misericordia', 'Competenza in Intuizione e Medicina e nella borsa da erborista; ottieni una maschera speciale per usare i privilegi di questa tradizione.'),
    F(3, 'Mano Guaritrice', 'Azione, 1 ki: tocchi una creatura e le ripristini PF pari a un dado di Arti Marziali + mod. Saggezza. Quando usi Raffica di Colpi puoi sostituire un colpo senz\'armi con questo privilegio, senza spendere ki.'),
    F(3, 'Mano del Dolore', 'Quando colpisci con un colpo senz\'armi, spendi 1 ki per infliggere danni necrotici extra pari a un dado di Arti Marziali + mod. Saggezza. Una volta per turno.'),
    F(6, 'Tocco del Medico', 'Con Mano Guaritrice puoi anche terminare una malattia o una condizione tra accecato, assordato, paralizzato, avvelenato o stordito. Con Mano del Dolore puoi rendere la creatura avvelenata fino alla fine del tuo prossimo turno.'),
    F(11, 'Raffica di Guarigione e Dolore', 'Con Raffica di Colpi puoi sostituire un colpo senz\'armi con Mano Guaritrice senza ki, e usare Mano del Dolore su un colpo di Raffica senza ki (una volta per turno).'),
    F(17, 'Mano della Misericordia Suprema', 'Azione, 5 ki: tocchi il cadavere di una creatura morta da meno di 24 ore: torna in vita con 4d10 + mod. Saggezza PF, senza le condizioni accecato, assordato, paralizzato, avvelenato e stordito. Una volta per riposo lungo.'),
  ], 'Il monaco guaritore (e a volte boia): maestro della forza vitale degli altri.');

  /* ---------- PALADINO ---------- */
  agg('paladino', 'sentinelle', 'Giuramento delle Sentinelle', [
    F(3, 'Incantesimi di Giuramento', 'Sempre preparati: Allarme e Individuazione del Magico (3°); Bagliore Lunare e Vedere Invisibilità (5°); Anti-Individuazione e Controincantesimo (9°); Aura di Purezza ed Esilio (13°); Blocca Mostri e Scrutare (17°).'),
    F(3, 'Incanalare Divinità: Volontà della Sentinella', 'Azione: scegli fino a Car creature (minimo 1) entro 9 m che vedi; tu e loro avete vantaggio ai TS su Intelligenza, Saggezza e Carisma per 1 minuto.'),
    F(3, 'Incanalare Divinità: Abiurare Creature Extraplanari', 'Azione: aberrazioni, celestiali, elementali, folletti e immondi entro 9 m che ti sentono fanno un TS Saggezza; se falliscono sono scacciati per 1 minuto o finché subiscono danni.'),
    F(7, 'Aura della Sentinella', 'Tu e le creature a tua scelta entro 3 m (9 m dal 18°) aggiungete la tua competenza ai tiri di iniziativa (se non sei incapacitato).'),
    F(15, 'Punizione Solerte', 'Reazione: quando tu o una creatura entro 9 m che vedi superate un TS su Int, Sag o Car, infliggi 2d8 + mod. Carisma danni da forza alla creatura che lo ha imposto.'),
    F(20, 'Baluardo dei Mortali', 'Azione bonus, 1 minuto: vista pura entro 36 m; vantaggio ai tiri per colpire contro aberrazioni, celestiali, folletti e immondi; quando infliggi danni a una creatura può fare un TS Carisma (CD incantesimi) o è esiliata nel suo piano d\'origine (se supera il TS non è più esiliabile per 24 ore). 1/riposo lungo, o spendendo uno slot di 5° livello.'),
  ], 'Il paladino che veglia sul reame dei mortali contro le minacce extraplanari: iniziativa, sventare l\'inganno e abiurare le creature di altri piani.');
  agg('paladino', 'gloria', 'Giuramento di Gloria', [
    F(3, 'Incantesimi di Giuramento', 'Sempre preparati: Dardo Tracciante ed Eroismo (3°); Arma Magica e Caratteristica Potenziata (5°); Protezione dall\'Energia e Velocità (9°); Compulsione e Libertà di Movimento (13°); Colpo Infuocato e Comunione (17°).'),
    F(3, 'Incanalare Divinità: Atleta Impareggiabile', 'Azione bonus, 10 minuti: vantaggio a Atletica e Acrobazia, capacità di carico/spinta/sollevamento doppia, salti in lungo e in alto +3 m (che costano movimento).'),
    F(3, 'Incanalare Divinità: Punizione Ispiratrice', 'Subito dopo Punizione Divina puoi usare Incanalare Divinità (azione bonus) per distribuire a creature entro 9 m (te compreso) PF temporanei pari a 2d8 + livello da paladino, divisi a piacere.'),
    F(7, 'Aura di Alacrità', 'La tua velocità aumenta di 3 m. Gli alleati che iniziano il turno entro 1,5 m da te (3 m dal 18°) ottengono +3 m di velocità fino a fine turno.'),
    F(15, 'Difesa Gloriosa', 'Reazione: quando tu o una creatura entro 3 m che vedi subite un tiro per colpire, aggiungi Car (min. +1) alla CA del bersaglio; se l\'attacco fallisce puoi attaccare con un\'arma l\'aggressore, se a portata. Car volte (min. 1) per riposo lungo.'),
    F(20, 'Leggenda Vivente', 'Azione bonus, 1 minuto: vantaggio a tutte le prove di Carisma; una volta per turno un attacco con arma che manca diventa un colpo; se fallisci un TS puoi ripeterlo (reazione) usando il nuovo risultato. 1/riposo lungo, o spendendo uno slot di 5° livello.'),
  ], 'Il paladino destinato alla gloria: atletismo, velocità e ispirazione per sé e i compagni.');
  D.INC_SUB['paladino/sentinelle'] = [ids('Allarme', 'Individuazione del Magico'), ids('Bagliore Lunare', 'Vedere Invisibilità'), ids('Anti-Individuazione', 'Controincantesimo'), ids('Aura di Purezza', 'Esilio'), ids('Blocca Mostri', 'Scrutare')];
  D.INC_SUB['paladino/gloria'] = [ids('Dardo Tracciante', 'Eroismo'), ids('Arma Magica', 'Caratteristica Potenziata'), ids('Protezione dall\'Energia', 'Velocità'), ids('Compulsione', 'Libertà di Movimento'), ids('Colpo Infuocato', 'Comunione')];

  /* ---------- RANGER ---------- */
  agg('ranger', 'sciami', 'Custode degli Sciami', [
    F(3, 'Sciame Riunito', 'Uno sciame di spiriti della natura (intangibile, resta nel tuo spazio) ti assiste. Una volta per turno, subito dopo aver colpito una creatura con un attacco, scegli un effetto: il bersaglio subisce 1d6 danni perforanti; oppure fa un TS Forza (CD incantesimi) o viene spostato di 4,5 m in orizzontale; oppure sposti te stesso di 1,5 m in orizzontale. Competenza volte per riposo lungo. Dall\'11° livello i danni sono 1d8, una creatura spostata può anche cadere prona e, quando sei spostato, hai mezza copertura fino al tuo prossimo turno.'),
    F(3, 'Magia del Custode degli Sciami', 'Impari Mano Magica (la mano ha l\'aspetto dello sciame). Incantesimi addizionali che contano come da ranger ma non per il totale dei conosciuti: Luminescenza (3°); Ragnatela (5°); Forma Gassosa (9°); Occhio Arcano (13°); Piaga degli Insetti (17°).'),
    F(7, 'Marea Avvolgente', 'Azione bonus: ottieni una velocità di volare di 3 m e puoi fluttuare, per 1 minuto o finché non sei incapacitato. Competenza volte per riposo lungo.'),
    F(15, 'Dispersione Brulicante', 'Reazione, quando subisci danni: resistenza a quel danno e ti teletrasporti in uno spazio libero entro 9 m che vedi. Competenza volte per riposo lungo.'),
  ], 'Il ranger legato a uno sciame di spiriti della natura: lo aiuta in battaglia, lo solleva in volo e lo trasporta altrove.');
  agg('ranger', 'viandante', 'Viandante Fatato', [
    F(3, 'Colpi Terribili', 'Una volta per turno, quando colpisci con un\'arma, infliggi 1d4 danni psichici extra (1d6 dall\'11° livello).'),
    F(3, 'Magia del Viandante Fatato', 'Incantesimi addizionali che contano come da ranger ma non per il totale dei conosciuti: Charme su Persone (3°); Passo Velato (5°); Dissolvi Magie (9°); Porta Dimensionale (13°); Fuorviare (17°). In più ricevi un Dono della Selva Fatata (cosmetico).'),
    F(3, 'Fascino Ultraterreno', 'Aggiungi il mod. di Saggezza (minimo +1) alle prove di Carisma. Competenza in una tra Inganno, Intrattenere e Persuasione.'),
    F(7, 'Giravolta Ammaliante', 'Vantaggio ai TS per non essere affascinato o spaventato. Reazione: quando una creatura entro 36 m che vedi supera un TS contro charme o spavento, un\'altra creatura entro 36 m fa un TS Saggezza (CD incantesimi) o resta affascinata o spaventata (a tua scelta) per 1 minuto, ripetendo il TS a fine turno.'),
    F(11, 'Rinforzi Fatati', 'Impari Evoca Folletto (non conta per i conosciuti, senza componenti materiali); lo lanci una volta senza slot (riposo lungo). Puoi renderlo senza concentrazione: la durata diventa 1 minuto.'),
    F(15, 'Viandante Velato', 'Lanci Passo Velato senza slot Sag volte (minimo 1) per riposo lungo; puoi portare una creatura consenziente entro 1,5 m che vedi, che appare entro 1,5 m dalla tua destinazione.'),
  ], 'Il ranger con la magia della Selva Fatata: fascino, danni psichici e teletrasporti.');
  D.INC_SUB['ranger/sciami'] = [ids('Luminescenza'), ids('Ragnatela'), ids('Forma Gassosa'), ids('Occhio Arcano'), ids('Piaga degli Insetti')];
  D.INC_SUB['ranger/viandante'] = [ids('Charme su Persone'), ids('Passo Velato'), ids('Dissolvi Magie'), ids('Porta Dimensionale'), ids('Fuorviare')];

  /* ---------- STREGONE ---------- */
  D.INC_SUB_LIV.ranger = [3, 5, 9, 13, 17];
  D.INC_SUB_LIV.stregone = [1, 3, 5, 7, 9];
  agg('stregone', 'meccanica', 'Anima Meccanica', [
    F(1, 'Incantesimi Meccanici', 'Incantesimi sempre conosciuti (contano come da stregone, ma non per il totale dei conosciuti): Allarme e Protezione dal Bene e dal Male (1°); Aiuto e Ristorare Inferiore (3°); Dissolvi Magie e Protezione dall\'Energia (5°); Evoca Costrutto e Libertà di Movimento (7°); Muro di Forza e Ristorare Superiore (9°). A ogni livello da stregone puoi sostituirne uno con un altro dello stesso livello di abiurazione o trasmutazione dalle liste di stregone, warlock o mago.'),
    F(1, 'Ripristino dell\'Equilibrio', 'Reazione: quando una creatura entro 9 m che vedi sta per tirare un d20 con vantaggio o svantaggio, annulli l\'effetto del vantaggio o svantaggio. Competenza volte per riposo lungo.'),
    F(6, 'Bastione della Legge', 'Azione: spendi da 1 a 5 punti stregoneria per creare una barriera magica attorno a te o a una creatura entro 9 m che vedi, fatta di tanti d8 quanti i punti spesi. Quando la creatura protetta subisce danni può spendere un numero qualsiasi di questi dadi, tirarli e ridurre i danni del totale. Dura fino al riposo lungo o a un nuovo uso.'),
    F(14, 'Trance dell\'Ordine', 'Azione bonus, 1 minuto: i tiri per colpire contro di te non hanno vantaggio; un risultato di 9 o meno sul d20 nei tuoi tiri per colpire, prove e TS conta come 10. Poi non puoi riusarlo fino al riposo lungo, a meno di spendere 5 punti stregoneria.'),
    F(18, 'Cavalleria Meccanica', 'Azione: spiriti dell\'ordine (aspetto di modron o costrutti) riempiono un cubo di 9 m di spigolo da te: ripristinano fino a 100 PF divisi tra le creature nel cubo, riparano ogni oggetto danneggiato e terminano gli incantesimi di 6° livello o inferiore a tua scelta. Poi non puoi riusarlo fino al riposo lungo, a meno di spendere 7 punti stregoneria.'),
  ], 'Lo stregone toccato dall\'ordine di Mechanus: incantesimi di protezione e ripristino che riportano l\'equilibrio.');
  agg('stregone', 'aberrante', 'Mente Aberrante', [
    F(1, 'Incantesimi Psionici', 'Incantesimi sempre conosciuti (contano come da stregone, ma non per il totale dei conosciuti): Braccia di Hadar, Scheggia della Mente (trucchetto) e Sussurri Dissonanti (1°); Calmare Emozioni e Individuazione dei Pensieri (3°); Fame di Hadar e Inviare (5°); Evoca Aberrazione e Tentacoli Neri di Evard (7°); Legame Telepatico di Rary e Telecinesi (9°). A ogni livello da stregone puoi sostituirne uno con un altro dello stesso livello di divinazione o ammaliamento dalle liste di stregone, warlock o mago.'),
    F(1, 'Conversazione Telepatica', 'Azione bonus: scegli una creatura entro 9 m; potete parlare telepaticamente finché siete a distanza (in km) non superiore a mod. Carisma × 1,5 (minimo 1,5 km). Dura un numero di minuti pari al livello da stregone; termina se sei incapacitato o muori, o se la usi su un\'altra creatura.'),
    F(6, 'Stregoneria Psionica', 'Quando lanci un incantesimo di 1° livello o superiore dalla lista degli Incantesimi Psionici puoi spendere punti stregoneria pari al suo livello invece di uno slot: in tal caso non servono componenti verbali, somatiche né materiali (salvo quelle consumate).'),
    F(6, 'Difese Psichiche', 'Resistenza ai danni psichici e vantaggio ai TS per non essere affascinato o spaventato.'),
    F(14, 'Rivelazione della Carne', 'Azione bonus: spendi 1 o più punti stregoneria per trasformare il corpo per 10 minuti; ogni punto dà un beneficio a scelta: vedere le creature invisibili entro 18 m; velocità di volare pari alla velocità e fluttuare; velocità di nuotare doppia e respirare sott\'acqua; passare per spazi stretti fino a 2,5 cm e liberarti da prese non magiche con 1,5 m di movimento.'),
    F(18, 'Implosione Distorcente', 'Azione: ti teletrasporti in uno spazio libero che vedi entro 36 m. Le creature entro 9 m dallo spazio lasciato fanno un TS Forza: se falliscono subiscono 3d10 danni da forza e sono spinte verso quello spazio, altrimenti metà dei danni. Poi non puoi riusarlo fino al riposo lungo, a meno di spendere 5 punti stregoneria.'),
  ], 'Lo stregone dalla mente alterata da un\'entità aliena: telepatia, incantesimi psionici e mutazioni del corpo.');
  D.INC_SUB['stregone/meccanica'] = [ids('Allarme', 'Protezione dal Bene e dal Male'), ids('Aiuto', 'Ristorare Inferiore'), ids('Dissolvi Magie', 'Protezione dall\'Energia'), ids('Evoca Costrutto', 'Libertà di Movimento'), ids('Muro di Forza', 'Ristorare Superiore')];
  D.INC_SUB['stregone/aberrante'] = [ids('Braccia di Hadar', 'Scheggia della Mente', 'Sussurri Dissonanti'), ids('Calmare Emozioni', 'Individuazione dei Pensieri'), ids('Fame di Hadar', 'Inviare'), ids('Evoca Aberrazione', 'Tentacoli Neri di Evard'), ids('Legame Telepatico di Rary', 'Telecinesi')];

  /* ---------- WARLOCK ---------- */
  agg('warlock', 'genio', 'Il Genio', [
    F(1, 'Lista degli Incantesimi Espansa', 'Quando impari un incantesimo da warlock puoi sceglierlo anche tra quelli del Genio e del tipo di genio scelto (dao, djinni, efreeti, marid). Al 9° livello di incantesimo si aggiunge Desiderio.'),
    F(1, 'Recipiente del Genio', 'Ricevi un recipiente magico (oggetto Minuscolo) che funge da focus per gli incantesimi da warlock. CA pari alla CD dei tuoi incantesimi, PF pari al livello da warlock + competenza, immune a veleno e psichici. Se lo perdi o è distrutto, un rituale di 1 ora (in un riposo) te ne dà un altro.'),
    F(1, 'Ira del Genio', 'Una volta per turno, quando vai a segno con un tiro per colpire, infliggi danni extra pari alla competenza; tipo in base al genio: contundenti (dao), tuono (djinni), fuoco (efreeti), freddo (marid).'),
    F(1, 'Recipiente: Rifugio Portatile', 'Mentre tocchi il recipiente, con un\'azione entri in un cilindro extradimensionale (raggio 6 m, altezza 6 m) per un numero di ore pari al doppio della competenza; senti ciò che accade fuori; esci con un\'azione bonus. Dopo essere entrato non puoi rientrare fino al riposo lungo. Disponibile dal 1° livello.'),
    F(6, 'Dono Elementale', 'Resistenza a un tipo di danno in base al genio: contundenti (dao), tuono (djinni), fuoco (efreeti), freddo (marid). Azione bonus: velocità di volare 9 m per 10 minuti, fluttuando; competenza volte per riposo lungo.'),
    F(10, 'Santuario del Recipiente', 'Quando entri nel recipiente con Rifugio Portatile puoi portare con te fino a 5 creature consenzienti entro 9 m. Puoi espellerle con un\'azione bonus. Chi resta 10 minuti ottiene i benefici di un riposo breve e aggiunge la competenza ai PF recuperati con i Dadi Vita.'),
    F(14, 'Desiderio Limitato', 'Azione: esprimi un desiderio al recipiente e ottieni l\'effetto di un incantesimo di 6° livello o inferiore con tempo di lancio di 1 azione, da qualsiasi lista, senza requisiti né componenti costose. Poi non puoi riusarlo per 1d4 riposi lunghi.'),
  ], 'Il warlock legato a un genio nobile: un recipiente come rifugio, danni elementali e un desiderio limitato.');
  agg('warlock', 'insondabile', 'L\'Insondabile', [
    F(1, 'Lista degli Incantesimi Espansa', 'Quando impari un incantesimo da warlock puoi sceglierlo anche tra quelli dell\'Insondabile: Creare o Distruggere Acqua, Onda Tonante (1°); Folata di Vento, Silenzio (2°); Fulmine, Tempesta di Nevischio (3°); Controllare Acqua, Evoca Elementale – solo acqua (4°); Cono di Freddo, Mano di Bigby – a forma di tentacolo (5°).'),
    F(1, 'Tentacolo delle Profondità', 'Azione bonus: crei un tentacolo di 3 m entro 18 m (1 minuto o finché ne crei un altro). Attacco in mischia con incantesimo contro una creatura entro 3 m dal tentacolo: 1d8 freddo (2d8 dal 10°) e velocità −3 m fino al tuo prossimo turno. Con un\'azione bonus lo muovi di 9 m e ripeti l\'attacco. Competenza volte per riposo lungo.'),
    F(1, 'Dono del Mare', 'Velocità di nuotare 12 m e respiri sott\'acqua.'),
    F(6, 'Anima Oceanica', 'Resistenza al freddo. Sott\'acqua puoi comunicare con ogni creatura ugualmente sott\'acqua e viceversa.'),
    F(6, 'Spira Guardiana', 'Reazione: quando tu o una creatura che vedi subite danni entro 3 m dal tentacolo, riduci i danni di 1d8 (2d8 dal 10°).'),
    F(10, 'Presa dei Tentacoli', 'Impari Tentacoli Neri di Evard (conta come da warlock, non per i conosciuti): lo lanci una volta senza slot (riposo lungo). Quando lo lanci ottieni PF temporanei pari al livello da warlock e i danni non interrompono la concentrazione.'),
    F(14, 'Immersione Insondabile', 'Azione: apri portali verso acque: teletrasporti te e fino a 5 creature consenzienti che vedi entro 9 m in un luogo d\'acqua (grande almeno quanto uno stagno) che hai già visto, entro 1,5 km o entro 9 m da acqua, in spazi liberi entro 9 m l\'uno dall\'altro. Una volta per riposo breve o lungo.'),
  ], 'Il warlock del mare e delle profondità: tentacoli spettrali, freddo e il dominio dell\'acqua.');
  D.INC_SUB['warlock/insondabile'] = [ids('Creare o Distruggere Acqua', 'Onda Tonante'), ids('Folata di Vento', 'Silenzio'), ids('Fulmine', 'Tempesta di Nevischio'), ids('Controllare Acqua', 'Evoca Elementale'), ids('Cono di Freddo', 'Mano di Bigby')];
  D.INC_SUB['warlock/genio'] = [ids('Individuazione del Bene e del Male'), ids('Allucinazione di Forza'), ids('Creare Cibo e Acqua'), ids('Allucinazione Mortale'), ids('Creazione')];
  /* Tipo di genio (scelta del patrono) */
  D.GENIO_TIPI = {
    dao: { nome: 'Dao (Terra)', danno: 'contundenti', inc: [ids('Santuario'), ids('Crescita di Spine'), ids('Fondersi nella Pietra'), ids('Scolpire Pietra'), ids('Muro di Pietra')] },
    djinni: { nome: 'Djinni (Aria)', danno: 'tuono', inc: [ids('Onda Tonante'), ids('Folata di Vento'), ids('Muro di Vento'), ids('Invisibilità Superiore'), ids('Sembrare')] },
    efreeti: { nome: 'Efreeti (Fuoco)', danno: 'fuoco', inc: [ids('Mani Brucianti'), ids('Raggio Rovente'), ids('Palla di Fuoco'), ids('Scudo di Fuoco'), ids('Colpo Infuocato')] },
    marid: { nome: 'Marid (Acqua)', danno: 'freddo', inc: [ids('Nube di Nebbia'), ids('Sfocatura'), ids('Tempesta di Nevischio'), ids('Controllare Acqua'), ids('Cono di Freddo')] },
  };
  D.SCELTE.push({ id: 'tipogenio', cl: 'warlock', sub: 'genio', nome: 'Tipo di Genio', da: 1, n: () => 1, nota: 'Il tipo del tuo patrono: decide gli incantesimi aggiuntivi, il tipo di danno di Ira del Genio e la resistenza di Dono Elementale.', opz: Object.keys(D.GENIO_TIPI).map((k) => [k, D.GENIO_TIPI[k].nome, 'Danni e resistenza: ' + D.GENIO_TIPI[k].danno + '.']) });

  D.tashaAssegnaTratti();
})(typeof window !== 'undefined' ? window : globalThis);
