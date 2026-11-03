/* Generatore casuale di aspetto, personalità e storia, coerente con razza, classe, background, allineamento e livello */
(function (G) {
  const D = (G.DND = G.DND || {});
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const mischia = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
  const quanti = (a, n) => mischia(a).slice(0, n);
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const fine = (s) => (/[.!?…]$/.test(s) ? s : s + '.');

  /* ----- fisico per razza: età [min,max], altezza cm, peso kg ----- */
  const FIS = {
    umano: [[18, 80], [150, 192], [50, 110]], elfo: [[100, 650], [152, 188], [45, 80]], nano: [[50, 330], [122, 152], [60, 95]],
    halfling: [[22, 140], [80, 105], [16, 24]], dragonide: [[15, 70], [178, 215], [90, 150]], gnomo: [[40, 420], [90, 123], [16, 27]],
    mezzelfo: [[20, 170], [150, 188], [50, 90]], mezzorco: [[14, 70], [170, 205], [80, 130]], tiefling: [[18, 95], [150, 192], [50, 100]],
  };
  const OCCHI = {
    umano: ['castani', 'neri', 'verdi', 'azzurri', 'grigi', 'nocciola', 'ambra'],
    elfo: ['verde bosco', 'argento', 'viola chiaro', 'dorati', 'blu notte', 'verde smeraldo', 'grigio tempesta'],
    nano: ['castano scuro', 'nero carbone', 'grigio ferro', 'ambra', 'verde muschio'],
    halfling: ['castani', 'nocciola', 'verdi', 'azzurri', 'scuri e vivaci'],
    dragonide: ['rosso brace', 'oro', 'argento', 'blu elettrico', 'verde acido', 'bianchi'],
    gnomo: ['blu vivace', 'verde acqua', 'ambra', 'viola', 'castani e curiosi'],
    mezzelfo: ['verdi', 'castani con riflessi dorati', 'grigio-azzurri', 'nocciola', 'ambra'],
    mezzorco: ['gialli', 'neri', 'castano scuro', 'rossi', 'grigio acciaio'],
    tiefling: ['neri senza pupille visibili', 'rosso rubino', 'oro lucente', 'bianchi', 'viola', 'argento'],
  };
  const PELLE = {
    umano: ['chiara', 'olivastra', 'ambrata', 'bruna', 'scura', 'lentigginosa', 'abbronzata'],
    elfo: ['pallida', 'color avorio', 'bronzo chiaro', 'bruna', 'argentea'],
    nano: ['rosea e segnata dal sole', 'bruna', 'color terra', 'chiara', 'olivastra'],
    halfling: ['rosea', 'chiara con lentiggini', 'abbronzata', 'olivastra'],
    dragonide: ['squame rosse', 'squame blu', 'squame dorate', 'squame verdi', 'squame bianche', 'squame argentee', 'squame nere', 'squame di bronzo', 'squame di rame', 'squame d’ottone'],
    gnomo: ['rosea', 'abbronzata', 'color nocciola', 'chiara'],
    mezzelfo: ['chiara', 'olivastra', 'dorata', 'bruna'],
    mezzorco: ['grigio-verde', 'verde oliva', 'grigio scuro', 'bruna con riflessi verdastri'],
    tiefling: ['rosso scuro', 'viola', 'blu notte', 'grigio cenere', 'rosa intenso', 'bruna con riflessi rossi'],
  };
  const CAPELLI = {
    umano: ['neri e corti', 'castani e ricci', 'biondi e lisci', 'rossi e ribelli', 'grigi', 'rasati', 'lunghi e intrecciati', 'brizzolati'],
    elfo: ['argentei e lunghissimi', 'neri e lisci', 'biondi dorati', 'castano scuro intrecciati', 'bianchi', 'verde pallido'],
    nano: ['neri con barba intrecciata', 'rossi con barba folta', 'grigi con lunga barba', 'castani con baffi enormi', 'biondi in due trecce'],
    halfling: ['ricci e castani', 'biondi e spettinati', 'neri e lisci', 'rossi e arruffati'],
    dragonide: ['nessuno: testa liscia e squamata', 'una cresta di scaglie', 'nessuno: piccole spine sul capo'],
    gnomo: ['bianchi e cotonosi', 'rossi e arruffati', 'blu per un esperimento', 'castani ben pettinati', 'verdi per un esperimento'],
    mezzelfo: ['castano rame', 'neri e ondulati', 'biondi scuri', 'argentei', 'castani con una ciocca chiara'],
    mezzorco: ['neri e radi', 'rasati ai lati', 'una lunga treccia scura', 'rossicci e ispidi'],
    tiefling: ['neri come l’inchiostro', 'viola scuro', 'rossi come brace', 'bianchi', 'blu notte', 'argento'],
  };
  const NOTE_RAZZA = {
    umano: ['Ha lo sguardo di chi non si ferma mai.', 'Il suo viso racconta una vita di viaggi.'],
    elfo: ['Ha orecchie lunghe e appuntite e si muove senza fare rumore.', 'La sua figura è slanciata e quasi sempre silenziosa.'],
    nano: ['È largo di spalle e sembra scolpito nella roccia.', 'Cammina con passo pesante e sicuro.'],
    halfling: ['Piccolo e rapido, ha i piedi grandi e pelosi e un sorriso contagioso.', 'È basso ma ha una presenza sorprendente.'],
    dragonide: ['Una coda possente e un muso da drago lo rendono impossibile da ignorare.', 'Dalle narici esce a volte un filo di fumo.'],
    gnomo: ['È minuscolo, con un naso grande e mani sempre sporche d’inchiostro o di olio.', 'Gli occhi sembrano non stare mai fermi.'],
    mezzelfo: ['Ha i tratti eleganti dell’elfo e la robustezza dell’umano.', 'Le orecchie sono appena a punta.'],
    mezzorco: ['Due zanne spuntano dalla mascella inferiore e i muscoli sono imponenti.', 'È alto e massiccio, con cicatrici di vecchie battaglie.'],
    tiefling: ['Due corna curve spuntano dalla fronte e una coda sottile si muove dietro la schiena.', 'Le corna sono lunghe e decorate; la coda si muove quando è nervoso.'],
  };
  const NOTE_CLASSE = {
    barbaro: ['Indossa pellicce e porta con sé una grossa ascia.', 'Ha tatuaggi tribali sulle braccia e cicatrici sul petto.'],
    bardo: ['Porta a tracolla il suo strumento e un mantello colorato.', 'Veste abiti vistosi con piume e nastri tintinnanti.'],
    chierico: ['Porta ben in vista il simbolo sacro della sua divinità.', 'Indossa una veste robusta e una mazza sempre a portata di mano.'],
    druido: ['Porta amuleti di legno e foglie e va spesso scalzo.', 'Ha un bastone nodoso e il mantello coperto di muschio.'],
    guerriero: ['Indossa un’armatura ben tenuta e un’arma lucidata ogni sera.', 'Ha il portamento dritto e lo sguardo vigile di un soldato.'],
    ladro: ['Veste di scuro, con un cappuccio e molte tasche nascoste.', 'Si muove senza rumore e ha dita agili.'],
    mago: ['Porta una veste lunga, un grosso libro e le mani macchiate d’inchiostro.', 'Ha un cappello a punta e un bastone con una piccola gemma.'],
    monaco: ['Veste in modo semplice ed è sempre scalzo o con sandali.', 'Il suo sguardo è calmo e il corpo è asciutto e allenato.'],
    paladino: ['Indossa un’armatura lucida con il simbolo del suo giuramento.', 'Porta con sé un mantello bianco e una spada benedetta.'],
    ranger: ['Indossa un mantello verde e porta un arco sempre pronto.', 'Ha i vestiti di cuoio consumati dai viaggi nei boschi.'],
    stregone: ['Ha segni o bagliori strani legati alla sua magia innata.', 'I suoi occhi scintillano quando perde il controllo.'],
    warlock: ['Porta simboli misteriosi del suo patto e un ghigno furbo.', 'Ha un’ombra che a volte sembra muoversi per conto suo.'],
  };
  const ASPETTO_GEN = ['I capelli sono sempre spettinati.', 'Ha una piccola cicatrice sul sopracciglio.', 'Sorride spesso e ha un’espressione amichevole.', 'Ha lo sguardo serio e osservatore.', 'Porta un anello di cui non parla mai.', 'Ha un odore di fumo e di viaggio.', 'Cammina con una leggera zoppia.', 'Ha una voce profonda e calda.', 'Parla a bassa voce e ride poco.', 'Si muove con grande sicurezza.', 'Porta una sciarpa colorata ogni giorno.', 'Ha le mani callose di chi lavora.', 'È sempre in movimento e non sta mai fermo.', 'Ha un tatuaggio piccolo ma significativo.', 'Si pettina e si cura con attenzione maniacale.'];
  const VESTI_BG = {
    accolito: 'Veste con semplicità e porta un simbolo sacro.', artigiano: 'Ha un grembiule e strumenti da lavoro nelle tasche.', ciarlatano: 'Indossa abiti appariscenti e un po’ ridicoli.',
    criminale: 'Porta abiti scuri e passa spesso inosservato.', eremita: 'Ha vesti rattoppate e una lunga barba o capelli incolti.', eroe: 'Veste abiti semplici ma rispettati dal villaggio.',
    intrattenitore: 'Porta costumi vistosi con nastri e campanelle.', marinaio: 'Ha pelle bruciata dal sole e un cappello logoro.', nobile: 'Veste con eleganza e tessuti pregiati.',
    soldato: 'Porta un’uniforme logora con un distintivo di reparto.', straniero: 'Ha abiti di fattura diversa da quelli locali.', sapiente: 'Ha occhiali o lenti e molti taccuini.', monello: 'Ha vestiti rattoppati e due occhi attenti.',
  };

  /* ----- personalità per background ----- */
  const BG = {
    accolito: { t: ['Cito spesso preghiere e proverbi sacri.', 'Vedo un segno degli dei in ogni cosa.', 'Sono molto paziente con chi non capisce.', 'Provo curiosità per i riti e le usanze di ogni popolo.'], i: ['Fede. Credo che gli dei guidino i miei passi.', 'Carità. Aiuto chi ha bisogno, senza chiedere nulla in cambio.', 'Tradizione. Le antiche usanze meritano di essere rispettate.'], l: ['Devo recuperare una reliquia perduta del mio tempio.', 'Proteggo il piccolo santuario della mia infanzia.', 'Un vecchio maestro del tempio mi ha affidato una missione.'], d: ['Mi fido troppo di chi ha un’autorità religiosa.', 'Giudico in fretta chi non condivide la mia fede.', 'Ho paura di deludere i miei maestri.'] },
    artigiano: { t: ['Sistemo volentieri ciò che è rotto.', 'Mi piace il lavoro ben fatto e lo dico a tutti.', 'Parlo molto dei miei attrezzi come fossero amici.', 'Giudico le persone da come trattano gli oggetti.'], i: ['Maestria. Voglio creare qualcosa che duri nei secoli.', 'Comunità. Siamo più forti quando lavoriamo insieme.', 'Onestà. Un buon prezzo e un lavoro pulito.'], l: ['Devo dimostrare il valore della mia gilda.', 'Mio fratello ha ereditato la nostra bottega e io devo aiutarlo.', 'Un mio capolavoro è andato perduto e voglio ritrovarlo.'], d: ['Per un buon affare faccio quasi tutto.', 'Mi arrabbio se qualcuno critica il mio lavoro.', 'Ho l’ossessione della perfezione.'] },
    ciarlatano: { t: ['Mi invento una storia diversa ogni volta che mi presento.', 'Ho sempre un trucco nascosto nella manica.', 'Sorrido tanto: è la mia arma preferita.', 'Cambio idea e amici con grande facilità.'], i: ['Libertà. Le catene sono fatte per essere spezzate.', 'Divertimento. Se non ridiamo, che senso ha?', 'Creatività. Un buon inganno è un’opera d’arte.'], l: ['Devo restituire un favore a chi mi ha salvato da un guaio.', 'Qualcuno che ho imbrogliato mi cerca ancora.', 'Ho un vecchio complice che non vedo da anni.'], d: ['Non resisto a un’occasione di guadagno facile.', 'Mento anche quando non serve.', 'Scappo ogni volta che le cose si fanno serie.'] },
    criminale: { t: ['Mi siedo sempre vicino alla porta, per scappare.', 'Parlo poco e osservo tutto.', 'Ho sempre un piano di riserva.', 'Quando sono nervoso, faccio scherzi e battute.'], i: ['Libertà. Nessuno può dirmi cosa fare.', 'Lealtà. Non tradisco chi mi ha aiutato.', 'Riscatto. Posso essere migliore del mio passato.'], l: ['Devo ripagare un vecchio debito con chi mi ha protetto.', 'Un amico è finito in prigione per colpa mia.', 'Voglio ritrovare un oggetto che ho dovuto abbandonare.'], d: ['Quando vedo qualcosa di prezioso, devo prenderlo.', 'Mi fido davvero di poche persone.', 'Se i guai sono grossi, scappo.'] },
    eremita: { t: ['Mi perdo spesso nei miei pensieri e parlo da solo.', 'Faccio domande strane e inattese.', 'Parlo poco, ma quando lo faccio ne vale la pena.', 'Amo il silenzio e la natura più della compagnia.'], i: ['Scoperta. Cerco una grande verità che nessuno ha ancora visto.', 'Pace. La serenità vale più dell’oro.', 'Saggezza. Si impara molto ascoltando.'], l: ['Devo trovare un luogo sacro che ho visto in sogno.', 'Proteggo il mio segreto, che potrebbe cambiare il mondo.', 'Voglio rivedere la mia vecchia capanna nel bosco.'], d: ['Faccio fatica a capire le convenzioni sociali.', 'Mi arrabbio se qualcuno disturba la mia pace.', 'Ho l’ossessione di una grande scoperta.'] },
    eroe: { t: ['Do sempre una mano volentieri, anche agli sconosciuti.', 'Gli elogi mi imbarazzano: faccio il possibile senza mettermi in mostra.', 'Ricordo il nome di chiunque mi abbia aiutato.', 'Ho molta determinazione quando ho un’idea in testa.'], i: ['Giustizia. Nessuno deve subire soprusi.', 'Coraggio. Si deve agire, anche con paura.', 'Speranza. Voglio ispirare gli altri.'], l: ['Proteggo la gente del mio villaggio a ogni costo.', 'Qualcuno mi ha insegnato a combattere: gli devo tutto.', 'Un mio caro è in pericolo e devo salvarlo.'], d: ['Mi fido troppo di chi mi sembra in difficoltà.', 'Non so dire di no a chi chiede aiuto.', 'Ho un nemico che non dimentica.'] },
    intrattenitore: { t: ['Mi esibisco in ogni occasione, anche quando nessuno lo chiede.', 'Racconto storie e le abbellisco sempre un po’.', 'Faccio amicizia con tutti con una battuta.', 'Canto o canticchio quando sono nervoso.'], i: ['Bellezza. L’arte rende il mondo migliore.', 'Emozione. Voglio far ridere e commuovere.', 'Libertà. Vado dove mi porta il cuore.'], l: ['Il mio strumento è un regalo di una persona speciale.', 'Voglio superare il mio rivale più famoso.', 'Devo ritrovare un vecchio compagno di spettacoli.'], d: ['Ho bisogno di applausi e attenzioni.', 'Mi innamoro troppo in fretta.', 'Esagero con vino e cibo ai banchetti.'] },
    marinaio: { t: ['Dico “capitano” a chiunque comandi.', 'Racconto storie di mari e mostri, forse un po’ gonfiate.', 'Ho sempre voglia di partire.', 'Amo il mare più di ogni altra cosa e ci faccio paragoni continui.'], i: ['Libertà. Il mare è la mia casa.', 'Equipaggio. Ci si salva solo insieme.', 'Avventura. L’orizzonte chiama sempre.'], l: ['Voglio ritrovare la nave che ho perduto.', 'Devo qualcosa al mio capitano.', 'Cerco un porto e una persona che ho lasciato.'], d: ['Bevo troppo quando sono in compagnia.', 'Sono superstizioso e rispetto ogni segno.', 'Quando mi arrabbio, dimentico ogni prudenza.'] },
    nobile: { t: ['La mia educazione si nota in ogni gesto.', 'Parlo con eleganza, a volte con un po’ di superbia.', 'Mi aspetto di essere trattato con rispetto.', 'Sono generoso con chi mi tratta bene.'], i: ['Responsabilità. Chi ha di più deve aiutare gli altri.', 'Onore. Il mio nome vale più dell’oro.', 'Potere. Con l’influenza giusta si può fare tutto.'], l: ['Devo proteggere il buon nome della mia famiglia.', 'Cerco un parente scomparso.', 'Ho giurato fedeltà a una persona che stimo moltissimo.'], d: ['Mi lascio abbindolare dalle adulazioni.', 'Do per scontato che gli altri siano al mio servizio.', 'Faccio fatica nelle situazioni semplici e pratiche.'] },
    soldato: { t: ['Sono sempre cortese con i superiori e brusco con gli altri.', 'Mi alzo all’alba e voglio l’ordine ovunque.', 'Racconto di battaglie come fossero ricordi di famiglia.', 'Conservo la calma sotto pressione.'], i: ['Dovere. Seguo gli ordini giusti fino in fondo.', 'Camerati. Non lascio indietro nessuno.', 'Coraggio. La paura è vinta dall’azione.'], l: ['Il mio vecchio reparto è la mia famiglia.', 'Devo la vita a un compagno che ora è lontano.', 'Cerco di proteggere chi non ha un esercito.'], d: ['Faccio fatica a disobbedire a un ordine, anche sbagliato.', 'Ho incubi di vecchie battaglie.', 'Mi arrabbio se qualcuno disprezza i soldati.'] },
    straniero: { t: ['Ho sempre curiosità di conoscere usanze nuove.', 'Parlo poco la lingua del posto e a volte equivoco.', 'Mi muovo con prudenza in ogni villaggio.', 'Racconto spesso di posti lontani che nessuno conosce.'], i: ['Appartenenza. Cerco un posto che possa chiamare casa.', 'Rispetto. Ogni cultura ha qualcosa da insegnare.', 'Libertà. Il mondo è troppo grande per una sola strada.'], l: ['Voglio tornare alla mia terra, un giorno.', 'Un amico del luogo mi ha accolto e gli devo molto.', 'Cerco una persona che ho perso lungo il cammino.'], d: ['Mi fido poco dei locali.', 'Non so mai quando fermarmi.', 'Mi sento fuori posto ovunque io vada.'] },
    sapiente: { t: ['Uso parole difficili per fare colpo.', 'Ho letto di tutto e lo ricordo, ma non sempre a proposito.', 'Prendo appunti anche nei momenti più strani.', 'Se non conosco una risposta, faccio ricerche finché non la trovo.'], i: ['Conoscenza. Il sapere è la vera ricchezza.', 'Curiosità. Ogni mistero va indagato.', 'Condivisione. Insegnare è più bello che sapere.'], l: ['Cerco un libro leggendario perduto.', 'Il mio vecchio maestro mi ha lasciato un enigma da risolvere.', 'Difendo la mia biblioteca a ogni costo.'], d: ['Perdo il senso del tempo quando studio.', 'Mi fido ciecamente di ciò che leggo.', 'Posso far arrabbiare gli altri con le mie correzioni.'] },
    monello: { t: ['Rubo un biscotto quando nessuno guarda.', 'Ho sempre fame, anche quando ho appena mangiato.', 'Sono veloce a ridere e a scappare.', 'Faccio amicizia con animali randagi in pochi minuti.'], i: ['Gentilezza. Chi ha poco aiuta chi ha meno.', 'Libertà. Nessuno mi dirà più dove dormire.', 'Riscatto. Dimostrerò che anche un monello vale qualcosa.'], l: ['Ho un piccolo amico di strada che ho promesso di rivedere.', 'Voglio ripagare chi mi ha dato un tetto nei giorni peggiori.', 'Cerco la mia vera famiglia.'], d: ['Faccio fatica a fidarmi di un adulto.', 'Accumulo oggetti inutili in ogni tasca.', 'Se la situazione si fa pesante, scappo.'] },
  };
  /* ----- ideali per allineamento ----- */
  const ALL = {
    'Legale Buono': ['Onore. Mantengo sempre la parola data.', 'Giustizia. Le leggi sono il modo di proteggere i deboli.'],
    'Neutrale Buono': ['Bontà. Faccio la cosa giusta, a prescindere dalle regole.', 'Gentilezza. Aiutare gli altri è sempre una buona idea.'],
    'Caotico Buono': ['Libertà. Nessuno merita di essere schiavo.', 'Ribellione. Sfido le regole ingiuste.'],
    'Legale Neutrale': ['Ordine. Una società funziona se ognuno fa la sua parte.', 'Tradizione. Le regole antiche ci tengono uniti.'],
    'Neutrale': ['Equilibrio. Evito gli eccessi e cerco la via di mezzo.', 'Pragmatismo. Faccio quello che serve, senza grandi dichiarazioni.'],
    'Caotico Neutrale': ['Libertà. Seguo solo il mio istinto.', 'Imprevedibilità. La vita è più bella quando non sai cosa accadrà.'],
    'Legale Malvagio': ['Ambizione. Salirò il più in alto possibile, con ogni mezzo legale.', 'Potere. Chi comanda deve saper farsi rispettare.'],
    'Neutrale Malvagio': ['Interesse. Penso a me stesso prima di tutto.', 'Opportunità. Se c’è un vantaggio, lo prendo.'],
    'Caotico Malvagio': ['Sfida. Le regole sono fatte per essere rotte.', 'Audacia. Per ottenere ciò che voglio, rischio tutto.'],
  };
  /* ----- per classe ----- */
  const CL = {
    barbaro: { t: ['Mi arrabbio in fretta ma mi calmo altrettanto presto.', 'Rido a voce alta e abbraccio forte.'], d: ['Quando mi arrabbio, non ascolto più nessuno.', 'Trovo noiose le trattative lunghe.'], s: ['Ho vissuto tra le montagne, in un clan fiero e libero.', 'Ho scoperto la mia furia durante una caccia finita male.', 'Il mio clan mi ha cacciato per aver difeso uno straniero.'] },
    bardo: { t: ['Ho sempre pronta una canzone o un verso.', 'Racconto storie, anche quando non servono.'], d: ['Non so tenere un segreto.', 'Faccio promesse troppo in fretta.'], s: ['Ho imparato a suonare da una vecchia girovaga che mi ha accolto.', 'Ho scoperto che le parole possono aprire ogni porta.', 'Ho studiato al collegio dei bardi e poi ho lasciato la scuola per viaggiare.'] },
    chierico: { t: ['Prego prima di ogni decisione importante.', 'Do sempre un consiglio, anche se non richiesto.'], d: ['Giudico severamente chi non rispetta la mia divinità.', 'Faccio fatica a perdonare chi tradisce la fiducia.'], s: ['Ho sentito la voce della mia divinità durante un periodo difficile.', 'Ho passato l’infanzia in un tempio, tra preghiere e cura dei malati.', 'Un miracolo mi ha salvato la vita e ho giurato di ricambiare.'] },
    druido: { t: ['Mi sento più a casa tra gli alberi che tra le case.', 'Parlo con piante e animali come con vecchi amici.'], d: ['Non sopporto chi rovina la natura.', 'Mi fido troppo degli animali e poco delle persone.'], s: ['Ho passato l’infanzia in un cerchio di antichi alberi.', 'Un cervo bianco mi ha guidato verso la mia vocazione.', 'Ho imparato i segreti della natura da un vecchio custode del bosco.'] },
    guerriero: { t: ['Mi alleno ogni giorno, senza eccezioni.', 'Rispetto un avversario valoroso.'], d: ['Sfido a duello chi mi insulta.', 'Faccio fatica a chiedere aiuto.'], s: ['Ho imparato a combattere nel villaggio, con una vecchia spada trovata nel fienile.', 'Mi sono addestrato in una guarnigione di confine.', 'Ho affrontato una banda di briganti per difendere la mia famiglia.'] },
    ladro: { t: ['Noto subito dove sono le uscite e i punti deboli.', 'Faccio amicizia in fretta, ma con chiunque.'], d: ['Non resisto a una serratura difficile.', 'Quando vedo un guaio, penso a sparire.'], s: ['Ho imparato a muovermi nell’ombra nelle vie della città.', 'Un vecchio maestro di scasso mi ha insegnato tutti i trucchi.', 'Ho rubato per sopravvivere e ora lo faccio solo per i giusti motivi.'] },
    mago: { t: ['Ho sempre un libro sottobraccio.', 'Mi emoziono davanti a un nuovo incantesimo.'], d: ['Disprezzo chi non studia.', 'Mi distraggo e dimentico ciò che mi circonda.'], s: ['Ho studiato in una torre di magia, tra pergamene e polvere.', 'Ho scoperto di avere talento quando ho acceso una candela con il pensiero.', 'Il mio maestro mi ha lasciato il suo libro degli incantesimi.'] },
    monaco: { t: ['Parlo piano e con calma.', 'Mi inchino a ogni avversario prima di combattere.'], d: ['Disprezzo il lusso e le comodità.', 'Sono troppo rigido con le regole che mi sono dato.'], s: ['Ho vissuto in un monastero in cima a una montagna, tra allenamenti e meditazione.', 'Un maestro anziano mi ha insegnato a trasformare il corpo in un’arma.', 'Ho lasciato il monastero per mettere alla prova ciò che ho imparato.'] },
    paladino: { t: ['Dico sempre la verità, anche quando fa male.', 'Aiuto chi è in difficoltà senza esitare.'], d: ['Sono inflessibile con chi infrange il mio giuramento.', 'Mi sento responsabile di tutto ciò che accade.'], s: ['Ho giurato davanti a un altare di difendere i deboli.', 'Un cavaliere errante mi ha preso come scudiero.', 'Ho visto un villaggio bruciare e ho deciso che non sarebbe più successo.'] },
    ranger: { t: ['Mi sveglio all’alba e controllo sempre le tracce.', 'Sono più a mio agio con gli animali che con le persone.'], d: ['Non mi fido degli abitanti delle città.', 'Seguo una pista anche quando sarebbe meglio rinunciare.'], s: ['Ho vissuto da solo ai margini del bosco, sorvegliando i sentieri.', 'Un mostro ha distrutto la mia casa e ho giurato di scovarlo.', 'Ho imparato a cacciare e a orientarmi da una vecchia guida.'] },
    stregone: { t: ['Ho paura di quel che posso fare, ma ne sono anche affascinato.', 'Sono impulsivo e un po’ teatrale.'], d: ['Quando mi emoziono, la magia sfugge al mio controllo.', 'Evito di parlare del mio passato.'], s: ['Da piccolo, la mia magia si è manifestata all’improvviso.', 'Un antenato misterioso mi ha lasciato il suo potere nel sangue.', 'Ho incantato tutta una festa senza accorgermene, e da allora mi guardano diversamente.'] },
    warlock: { t: ['Sono misterioso e non rivelo mai tutto.', 'Faccio ironia sulle cose più cupe.'], d: ['Non so rifiutare un patto vantaggioso.', 'Sento una voce nella testa e a volte la ascolto troppo.'], s: ['Ho fatto un patto con un essere misterioso in un momento disperato.', 'Ho trovato un oggetto antico che mi ha parlato.', 'Una presenza mi ha offerto potere in cambio di un favore.'] },
  };
  /* ----- storia per razza e background ----- */
  const RZ_ORI = {
    umano: ['Vengo da un villaggio di campi e mulini.', 'Ho passato l’infanzia in una grande città piena di mercati.', 'La mia famiglia viaggiava di paese in paese.'],
    elfo: ['Vengo da una radura antica, dove gli alberi sono più vecchi dei ricordi.', 'Ho passato molti anni in una città elfica dalle torri di luce.', 'Ho lasciato la foresta per vedere come vivono le altre razze.'],
    nano: ['Vengo da una grande fortezza scavata nella montagna.', 'La mia famiglia estrae gemme e forgia da generazioni.', 'Ho lasciato la mia gilda per vedere il mondo sopra la roccia.'],
    halfling: ['Vengo da un villaggio tranquillo, fatto di colline e orti.', 'La mia famiglia ha una grande tavola dove c’è sempre posto per un ospite.', 'Ho lasciato la mia contea per cercare avventura.'],
    dragonide: ['Vengo da un clan fiero, dove l’onore conta più di tutto.', 'Il mio clan mi ha insegnato a essere leale e orgoglioso.', 'Ho lasciato le terre del clan per dimostrare il mio valore.'],
    gnomo: ['Vengo da una città di tunnel e officine, piena di strani congegni.', 'La mia famiglia inventa ogni tipo di aggeggio.', 'Ho lasciato la mia casa per cercare ispirazione.'],
    mezzelfo: ['Ho vissuto a metà tra due mondi, senza sentirmi del tutto a casa in nessuno.', 'Mia madre e mio padre mi hanno insegnato due modi di vedere la vita.', 'Ho viaggiato fin da piccolo cercando il mio posto.'],
    mezzorco: ['Ho passato l’infanzia tra due popoli, sempre guardato con sospetto.', 'Ho dovuto dimostrare il mio valore fin da bambino.', 'Mi hanno insegnato che la forza serve a proteggere.'],
    tiefling: ['Ho passato l’infanzia tra sguardi diffidenti, per il mio aspetto.', 'Ho imparato presto che gli altri giudicano dalle apparenze.', 'Una persona gentile mi ha dato un tetto e un nome.'],
  };
  const BG_ST = {
    accolito: 'Per anni ho servito in un tempio, tra preghiere e visite ai malati.', artigiano: 'Ho fatto l’apprendista in una bottega, poi qualcosa mi ha spinto a partire.', ciarlatano: 'Ho imbrogliato mezzo regno, finché qualcuno non mi ha scoperto.',
    criminale: 'Ho vissuto ai margini della legge e ho imparato a cavarmela.', eremita: 'Ho passato anni da solo in un luogo remoto, tra studio e silenzio.', eroe: 'Ho salvato il mio villaggio da una minaccia e da allora tutti mi conoscono.',
    intrattenitore: 'Ho girato per piazze e taverne, facendo ridere e commuovere.', marinaio: 'Ho solcato i mari su una nave, tra tempeste e leggende.', nobile: 'Ho passato l’infanzia in una casa nobile, con privilegi e obblighi.',
    soldato: 'Ho prestato servizio in un esercito e ho visto più di quanto vorrei.', straniero: 'Ho viaggiato per terre lontane, lontano da casa.', sapiente: 'Ho passato la giovinezza tra libri e biblioteche.', monello: 'Ho passato l’infanzia per strada, imparando a sopravvivere.',
  };
  const MOT = {
    buono: ['Ora viaggio per aiutare chi ne ha bisogno.', 'Voglio rendere il mondo un po’ più giusto.', 'Ho giurato di proteggere chi non può difendersi.'],
    neutrale: ['Viaggio per scoprire cosa mi aspetta oltre l’orizzonte.', 'Cerco un modo per guadagnarmi un posto nel mondo.', 'Ho deciso di unirmi a un gruppo di avventurieri per vedere dove mi porta.'],
    malvagio: ['Voglio dimostrare quanto valgo, a ogni costo.', 'Cerco ricchezze e gloria, e non lascio che nessuno me le tolga.', 'Seguo un’ambizione che mi brucia dentro.'],
  };
  const FINE_LV = [
    [1, 4, ['La mia avventura è appena cominciata.', 'Sono ancora all’inizio del mio cammino.']],
    [5, 10, ['Ho già affrontato pericoli e il mio nome comincia a circolare.', 'Dopo molte sfide, comincio a sentirmi parte di qualcosa di grande.']],
    [11, 20, ['Il mio nome è conosciuto in molte terre, nel bene e nel male.', 'Dopo anni di avventure sono ormai una leggenda.']],
  ];
  const ALLY_BG = {
    accolito: ['Il tempio della mia infanzia', 'Un ordine di chierici itineranti'], artigiano: ['La gilda degli artigiani', 'Un vecchio maestro di bottega'], ciarlatano: ['Una compagnia di cantastorie', 'Un vecchio complice'],
    criminale: ['Una banda di strada', 'Un contrabbandiere di fiducia'], eremita: ['Un misterioso saggio della foresta', 'Gli animali del bosco'], eroe: ['Gli abitanti del mio villaggio', 'Un vecchio sindaco riconoscente'],
    intrattenitore: ['Una compagnia teatrale', 'Un oste che mi fa suonare gratis'], marinaio: ['Il mio vecchio equipaggio', 'Un capitano di porto'], nobile: ['La mia famiglia nobile', 'Un maggiordomo fidato'],
    soldato: ['Il mio vecchio reparto', 'Un sergente che mi stima'], straniero: ['Una famiglia che mi ha accolto', 'Un mercante amico'], sapiente: ['La biblioteca dove ho studiato', 'Un maestro anziano'], monello: ['Una banda di ragazzini di strada', 'Un fornaio gentile'],
  };
  const ALLY_CL = {
    barbaro: 'Il mio clan', bardo: 'Il collegio dei bardi', chierico: 'La chiesa della mia divinità', druido: 'Il Circolo dei Druidi', guerriero: 'Una compagnia di mercenari', ladro: 'La gilda dei ladri',
    mago: 'La mia vecchia scuola di magia', monaco: 'Il mio monastero', paladino: 'Il mio ordine di cavalieri', ranger: 'Una guida del bosco', stregone: 'Un misterioso protettore', warlock: 'Il mio patrono misterioso',
  };
  const TES = {
    accolito: ['Un simbolo sacro benedetto', 'Un libro di preghiere'], artigiano: ['Un set di attrezzi ben curati', 'Un pezzo che ho forgiato io'], ciarlatano: ['Un set di dadi truccati', 'Una bottiglia di “elisir”'],
    criminale: ['Un pugnale con un’incisione', 'Un sacchetto di monete nascosto'], eremita: ['Un rotolo di appunti misteriosi', 'Una piccola pietra levigata'], eroe: ['Un medaglione donato dal villaggio', 'Un attrezzo che mi ha salvato'],
    intrattenitore: ['Il mio strumento preferito', 'Una lettera da un ammiratore'], marinaio: ['Un amuleto portafortuna del mare', 'Una vecchia bussola'], nobile: ['Un anello con lo stemma di famiglia', 'Una lettera di presentazione'],
    soldato: ['Un distintivo di reparto', 'Un trofeo di battaglia'], straniero: ['Un ricordo della mia terra', 'Un cappello portafortuna'], sapiente: ['Un taccuino pieno di appunti', 'Una lettera di un vecchio maestro'], monello: ['Un giocattolo di legno', 'Un sassolino fortunato'],
  };

  const gruppoAll = (a) => (/Buono/.test(a) ? 'buono' : /Malvagio/.test(a) ? 'malvagio' : 'neutrale');
  const nascita = (rid, lv) => { // età credibile
    const f = FIS[rid] || FIS.umano; const [mn, mx] = f[0]; const t = Math.min(0.95, 0.12 + lv * 0.015 + Math.random() * 0.35);
    return Math.round(mn + (mx - mn) * t * (rid === 'umano' || rid === 'mezzorco' ? 1 : 0.5));
  };

  D.casuale = {
    genera(ch, gruppo, sovrascrivi) {
      ch.dett = ch.dett || {};
      const rid = ch.razza; const cl = ch.livelli[0]; const bg = ch.sfondo; const lv = ch.livelli.length;
      const b = BG[bg] || BG.eroe; const c = CL[cl] || CL.guerriero; const al = ch.allineamento || 'Neutrale';
      const scrivi = (k, v) => { if (sovrascrivi || !String(ch.dett[k] || '').trim()) ch.dett[k] = v; };
      if (gruppo === 'pers') {
        scrivi('tratti', quanti(b.t.concat(c.t), 3).slice(0, 2).join(' ') );
        scrivi('ideali', pick(Math.random() < 0.5 ? ALL[al] || ALL.Neutrale : b.i));
        scrivi('legami', pick(b.l));
        scrivi('difetti', pick(b.d.concat(c.d)));
      } else {
        const f = FIS[rid] || FIS.umano;
        const t = Math.random();
        const th = Math.min(1, Math.max(0, t + (Math.random() - 0.5) * 0.4));
        scrivi('eta', nascita(rid, lv) + ' anni');
        scrivi('altezza', ((f[1][0] + (f[1][1] - f[1][0]) * t) / 100).toFixed(2).replace('.', ',') + ' m');
        scrivi('peso', Math.round(f[2][0] + (f[2][1] - f[2][0]) * th) + ' kg');
        scrivi('occhi', pick(OCCHI[rid] || OCCHI.umano)); scrivi('pelle', pick(PELLE[rid] || PELLE.umano)); scrivi('capelli', pick(CAPELLI[rid] || CAPELLI.umano));
        scrivi('aspetto', [pick(NOTE_RAZZA[rid] || NOTE_RAZZA.umano), pick(NOTE_CLASSE[cl] || NOTE_CLASSE.guerriero), pick(ASPETTO_GEN), VESTI_BG[bg] || ''].filter(Boolean).join(' '));
        const lvT = FINE_LV.find((x) => lv >= x[0] && lv <= x[1]) || FINE_LV[0];
        scrivi('storia', [pick(RZ_ORI[rid] || RZ_ORI.umano), BG_ST[bg] || '', pick(c.s), pick(MOT[gruppoAll(al)]), pick(lvT[2])].filter(Boolean).join(' '));
        scrivi('alleati', fine(pick((ALLY_BG[bg] || ALLY_BG.eroe))) + ' ' + fine(ALLY_CL[cl] || ''));
        scrivi('tesoro', pick(TES[bg] || TES.eroe) + '. ' + pick(['Qualche moneta d’avanzo.', 'Una mappa dal significato incerto.', 'Una piccola gemma di poco valore.', 'Un portafortuna di famiglia.', 'Una lettera mai consegnata.']));
      }
      return ch;
    },
  };
})(window);
