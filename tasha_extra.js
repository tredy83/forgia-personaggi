/* Calderone Omnicomprensivo di Tasha (errata ITA 08/2022): stili, manovre, Metamagie, Patto e Suppliche, talenti,
   incantesimi aggiuntivi e privilegi di classe opzionali. Testi in sintesi nostra, nomi e numeri dal manuale italiano. */
(function (G) {
  const D = G.DND;
  const FONTE = 'tce';
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const AL = { 'lama roboante': 'lama tonante', 'tentacoli neri di evard': 'tentacoli neri', 'sfera congelante di otiluke': 'sfera congelante', 'legame telepatico di rary': 'legame telepatico', 'sfera elastica di otiluke': 'sfera elastica', 'freccia acida di melf': 'freccia acida', 'evocare bestia': 'evoca bestia' };
  D.TASHA_MANCANTI = D.TASHA_MANCANTI || [];
  const idDa = (nome) => { const n = AL[norm(nome)] || norm(nome); const s = D.INCANTESIMI.find((x) => norm(x.nome) === n) || D.INCANTESIMI.find((x) => norm(x.nome).replace(/ \(.*$/, '') === n); if (!s) { D.TASHA_MANCANTI.push(nome); return null; } return s.id; };
  const ids = (...n) => n.map(idDa).filter(Boolean);

  /* ---- Stili di combattimento: [id, nome, testo, fonte, classi] ---- */
  [
    ['cieca', 'Combattere alla Cieca', 'Vista cieca entro 3 m: vedi tutto ciò che non è dietro copertura totale, anche accecato o al buio, e distingui le creature invisibili che non si nascondono.', ['guerriero', 'paladino', 'ranger']],
    ['lancio', 'Combattere con Armi da Lancio', 'Estrai un\'arma da lancio come parte dell\'attacco; con un\'arma da lancio a distanza che colpisce ottieni +2 ai danni.', ['guerriero', 'ranger']],
    ['disarmato', 'Combattere Disarmato', 'Colpi senz\'armi: 1d6 + For contundenti (1d8 se non impugni armi né scudo); all\'inizio di ogni tuo turno infliggi 1d4 contundenti a una creatura che stai afferrando.', ['guerriero']],
    ['intercettazione', 'Intercettazione', 'Reazione: quando una creatura che vedi colpisce un bersaglio diverso da te entro 1,5 m, riduci il danno di 1d10 + bonus di competenza (minimo 0). Serve uno scudo o un\'arma semplice o da guerra.', ['guerriero', 'paladino']],
    ['superiore', 'Tecnica Superiore', 'Impari una manovra del Maestro di Battaglia e ottieni un dado di superiorità d6 (si somma ad altri dadi; si recupera con un riposo breve o lungo). CD = 8 + competenza + For o Des.', ['guerriero']],
    ['benedetto', 'Guerriero Benedetto', 'Impari due trucchetti da chierico (contano come da paladino, caratteristica Carisma); a ogni livello puoi sostituirne uno.', ['paladino']],
    ['druidico', 'Guerriero Druidico', 'Impari due trucchetti da druido (contano come da ranger, caratteristica Saggezza); a ogni livello puoi sostituirne uno.', ['ranger']],
  ].forEach((s) => D.STILI.push([s[0], s[1], s[2], FONTE, s[3]]));

  /* ---- Manovre: [id, nome, testo, fonte] ---- */
  [
    ['afferrante', 'Colpo Afferrante', 'Subito dopo aver colpito in mischia nel tuo turno: spendi un dado di superiorità e tenti di afferrare il bersaglio con un\'azione bonus; il dado si somma alla prova di Forza (Atletica).'],
    ['imboscata', 'Imboscata', 'Su una prova di Destrezza (Furtività) o sul tiro di iniziativa: spendi un dado e lo aggiungi al risultato (se non sei incapacitato).'],
    ['lanciorapido', 'Lancio Rapido', 'Azione bonus: spendi un dado e attacchi a distanza con un\'arma da lancio (puoi estrarla nell\'attacco); se colpisci aggiungi il dado ai danni.'],
    ['preparazione', 'Preparazione', 'Reazione, quando una creatura che vedi entra nella portata della tua arma da mischia: spendi un dado e la attacchi; se colpisci aggiungi il dado ai danni.'],
    ['presenza', 'Presenza Imponente', 'Su una prova di Carisma (Intimidire, Intrattenere o Persuasione): spendi un dado e lo aggiungi al risultato.'],
    ['scambio', 'Scambio', 'Nel tuo turno, entro 1,5 m da una creatura consenziente, spendi un dado e scambiate posizione (almeno 1,5 m di movimento, senza attacchi di opportunità). Tira il dado: tu o l\'altra creatura (a tua scelta) ottenete quel bonus alla CA fino all\'inizio del tuo prossimo turno.'],
    ['valutazione', 'Valutazione Tattica', 'Su una prova di Intelligenza (Indagare o Storia) o Saggezza (Intuizione): spendi un dado e lo aggiungi al risultato.'],
  ].forEach((m) => D.MANOVRE.push([m[0], m[1], m[2], FONTE]));

  /* ---- Nuove opzioni dentro i gruppi di scelta (Metamagia, Dono del Patto, Suppliche) ---- */
  D.OPZ_FONTE = D.OPZ_FONTE || {};
  const gr = (id) => D.SCELTE.find((g) => g.id === id);
  const add = (id, o) => { const g = gr(id); if (!g) return; g.opz.push(o); D.OPZ_FONTE[id + '/' + o[0]] = FONTE; };
  add('metamagia', ['mirato', 'Incantesimo Mirato', 'Se manchi con il tiro per colpire di un incantesimo, spendi 2 punti stregoneria e ritira il d20 (devi usare il nuovo risultato). Si può usare anche se hai già usato un\'altra Metamagia su quell\'incantesimo.']);
  add('metamagia', ['trasmutato', 'Incantesimo Trasmutato', 'Se lanci un incantesimo che infligge danni di acido, freddo, fulmine, fuoco, tuono o veleno, spendi 1 punto stregoneria e cambi il tipo di danno in un altro di questa lista.']);
  add('patto', ['talismano', 'Patto del Talismano', 'Il patrono ti dona un amuleto: chi lo indossa, se fallisce una prova di caratteristica, può aggiungere 1d4 al tiro (competenza volte per riposo lungo). Se lo perdi, un rituale di 1 ora (in un riposo breve o lungo) ne crea un altro e distrugge il precedente; diventa polvere alla tua morte.']);
  [
    ['castigo-tal', 'Castigo del Talismano', 'Reazione: se chi indossa il talismano viene colpito da un attaccante entro 9 m da te e nel tuo campo visivo, infliggi all\'attaccante danni psichici pari alla competenza e lo respingi fino a 3 m da chi indossa il talismano.', 0, 'talismano'],
    ['dono-protettore', 'Dono del Protettore', 'Una pagina del Libro delle Ombre accoglie tanti nomi quanto la tua competenza (scritti con un\'azione, con il tuo permesso). Quando una creatura il cui nome è sulla pagina scende a 0 PF ma resta in vita, passa a 1 PF; una sola volta finché non completi un riposo lungo.', 9, 'tomo'],
    ['investitura', 'Investitura del Signore delle Catene', 'Quando lanci Trova Famiglio, il famiglio ottiene velocità di volare o nuotare di 12 m (a tua scelta), attacca con l\'azione bonus che gli ordini, ha attacchi magici che ignorano immunità e resistenza ai danni non magici, usa la tua CD per i suoi tiri salvezza e, con la tua reazione, ottiene resistenza a un danno subito.', 0, 'catena'],
    ['legame-tal', 'Legame del Talismano', 'Quando un\'altra creatura indossa il talismano puoi teletrasportarti con un\'azione nello spazio libero più vicino a lei (stesso piano); lei può fare lo stesso verso di te. Usi pari alla competenza per riposo lungo.', 12, 'talismano'],
    ['mente-occulta', 'Mente Occulta', 'Vantaggio ai tiri salvezza su Costituzione per mantenere la concentrazione su un incantesimo.', 0],
    ['protez-tal', 'Protezione del Talismano', 'Se chi indossa il talismano fallisce un tiro salvezza, può aggiungere 1d4 al tiro (competenza volte per riposo lungo).', 7, 'talismano'],
    ['schiavitu', 'Schiavitù Immortale', 'Lanci Animare Morti senza slot incantesimo; non puoi rifarlo fino al riposo lungo.', 5],
    ['scrittura', 'Scrittura Lontana', 'Una pagina del Libro delle Ombre accoglie tanti nomi quanto la tua competenza. Puoi lanciare Inviare su una creatura il cui nome è sulla pagina senza slot né componenti materiali: scrivi il messaggio sulla pagina, il bersaglio lo sente e l\'eventuale risposta appare sulla pagina per 1 minuto.', 5, 'tomo'],
  ].forEach((o) => add('suppliche', o));

  /* ---- Talenti (nome → testo) ---- */
  D.TALENTI_FONTE = D.TALENTI_FONTE || {};
  D.TALENTI_DESC = D.TALENTI_DESC || {};
  const tal = (nome, desc) => { D.TALENTI_FONTE[nome] = FONTE; D.TALENTI_DESC[nome] = desc; };
  tal('Abilità Impeccabile', '+1 a una caratteristica a scelta (max 20); competenza in un\'abilità; maestria (competenza raddoppiata) in un\'abilità in cui sei già competente e che non abbia già un raddoppio.');
  tal('Adepto di Metamagia', 'Prerequisito: Incantesimi o Magia del Patto. Impari due opzioni di Metamagia dello stregone (una sola per incantesimo, salvo eccezioni; puoi sostituirne una a ogni aumento di caratteristica). Ottieni 2 punti stregoneria solo per la Metamagia (riposo lungo).');
  tal('Adepto Occulto', 'Prerequisito: Incantesimi o Magia del Patto. Impari una Supplica Occulta del warlock (se ha un prerequisito devi soddisfarlo da warlock); a ogni livello puoi sostituirla.');
  tal('Bisturi da Battaglia', '+1 a For o Des (max 20). Una volta per turno, con un attacco che infligge danni taglienti, riduci di 3 m la velocità del bersaglio fino all\'inizio del tuo turno successivo. Con un critico tagliente il bersaglio ha svantaggio ai tiri per colpire fino all\'inizio del tuo turno successivo.');
  tal('Contaminazione Fatata', '+1 a Int, Sag o Car (max 20). Conosci Passo Velato e un incantesimo di 1° livello di divinazione o ammaliamento a scelta; li lanci ciascuno una volta senza slot (riposo lungo) o con slot. Caratteristica da incantatore: quella aumentata.');
  tal('Contaminazione Ombrosa', '+1 a Int, Sag o Car (max 20). Conosci Invisibilità e un incantesimo di 1° livello di illusione o necromanzia a scelta; li lanci ciascuno una volta senza slot (riposo lungo) o con slot. Caratteristica da incantatore: quella aumentata.');
  tal('Cuoco', '+1 a Cos o Sag (max 20). Competenza con gli utensili da cuoco. In un riposo breve prepari cibo per 4 + competenza creature: chi spende Dadi Vita recupera 1d8 PF extra. Con un\'ora di lavoro o alla fine di un riposo lungo cucini delizie pari alla competenza: durano 8 ore, mangiarne una (azione bonus) dà PF temporanei pari alla competenza.');
  tal('Maestria dei Veleni', 'Ignori la resistenza al veleno nei danni da veleno; avveleni un\'arma con un\'azione bonus; competenza con le sostanze da avvelenatore; con 1 ora e 50 mo crei dosi di veleno potente pari alla competenza (TS Cos CD 14 o 2d8 veleno e avvelenato).');
  tal('Martello Vivente', '+1 a For o Cos (max 20). Una volta per turno, con un attacco contundente, sposti il bersaglio (al massimo di una taglia più grande) di 1,5 m in uno spazio libero. Con un critico contundente hai vantaggio ai tiri per colpire contro di esso fino all\'inizio del tuo turno successivo.');
  tal('Pistolero', '+1 a Des (max 20). Competenza nelle armi da fuoco; ignori la proprietà ricarica; nessuno svantaggio ad attaccare a distanza entro 1,5 m da un ostile.');
  tal('Rudimenti da Artefice', 'Impari un trucchetto e un incantesimo di 1° livello dalla lista da artefice (caratteristica Intelligenza); l\'incantesimo si lancia una volta senza slot per riposo lungo (o con slot). Competenza in un tipo di strumenti da artigiano, usabile come focus per gli incantesimi con Intelligenza.');
  tal('Rudimenti da Guerriero', 'Prerequisito: competenza con un\'arma da guerra. Impari uno Stile di Combattimento del guerriero (diverso da quelli che hai); a ogni aumento di caratteristica puoi sostituirlo.');
  tal('Stile Penetrante', '+1 a For o Des (max 20). Una volta per turno, con un attacco perforante, ritiri uno dei dadi di danno (usi il nuovo risultato). Con un critico perforante tiri un dado di danno extra.');
  tal('Telecinesi', '+1 a Int, Sag o Car (max 20). Conosci Mano Magica (senza componenti verbali o somatiche, mano invisibile; se già la conosci, la gittata aumenta di 9 m). Azione bonus: una creatura nel tuo campo visivo entro 9 m fa un TS Forza (CD 8 + competenza + caratteristica aumentata) o è spostata di 1,5 m verso di te o in direzione opposta (può fallire volontariamente).');
  tal('Telepatia', '+1 a Int, Sag o Car (max 20). Parli telepaticamente con qualsiasi creatura nel tuo campo visivo entro 18 m (in una lingua che conosci; capisce solo se la parla, e non può rispondere telepaticamente). Lanci Individuazione dei Pensieri senza slot né componenti, una volta per riposo lungo (o con slot di 2° o superiore).');
  D.TALENTI_TASHA = Object.keys(D.TALENTI_FONTE);

  /* ---- Incantesimi aggiuntivi per classe (sempre attivi con il manuale) ---- */
  const TR = ['Lama Roboante', 'Lama Verdefiamma', 'Lenza Elettrizzante', 'Scheggia della Mente', 'Turbine di Spade'];
  D.INC_FONTE = D.INC_FONTE || {};
  D.INC_FONTE.tce = {
    bardo: ids('Comando', 'Spruzzo Colorato', 'Aiuto', 'Immagine Speculare', 'Ingrandire/Ridurre', 'Fortezza della Mente', 'Lentezza', 'Parola Guaritrice di Massa', 'Allucinazione Mortale', 'Legame Telepatico', 'Banchetto degli Eroi', 'Sogno del Velo Celeste', 'Spruzzo Prismatico', 'Antipatia/Simpatia', 'Muro Prismatico'),
    chierico: ids('Aura di Vitalità', 'Sudario Spirituale', 'Aura di Purezza', 'Aura di Vita', 'Evoca Celestiale', 'Bagliore Solare', 'Esplosione Solare', 'Parola del Potere Guarire'),
    druido: ids('Protezione dal Bene e dal Male', 'Evoca Bestia', 'Fiamma Perenne', 'Ingrandire/Ridurre', 'Presagio', 'Arma Elementale', 'Aura di Vitalità', 'Evoca Folletto', 'Rinascita', 'Divinazione', 'Evoca Elementale', 'Scudo di Fuoco', 'Cono di Freddo', 'Carne in Pietra', 'Simbolo', 'Nube Incendiaria'),
    mago: ids(...TR, 'Miscela Caustica di Tasha', 'Caratteristica Potenziata', 'Presagio', 'Scudiscio Mentale di Tasha', 'Evoca Bestia d\'Ombra', 'Evoca Folletto', 'Evoca Non Morto', 'Fortezza della Mente', 'Parlare con i Morti', 'Sudario Spirituale', 'Divinazione', 'Evoca Aberrazione', 'Evoca Costrutto', 'Evoca Elementale', 'Abito Ultraterreno di Tasha', 'Evoca Immondo', 'Sogno del Velo Celeste', 'Lama del Disastro'),
    paladino: ids('Preghiera di Guarigione', 'Riposo Inviolato', 'Vincolo di Interdizione', 'Sudario Spirituale', 'Evoca Celestiale'),
    ranger: ids('Intralciare', 'Punizione Incandescente', 'Aiuto', 'Arma Magica', 'Caratteristica Potenziata', 'Evoca Bestia', 'Folata di Vento', 'Arma Elementale', 'Evoca Folletto', 'Fondersi nella Pietra', 'Rinascita', 'Dominare Bestie', 'Evoca Elementale', 'Ristorare Superiore'),
    stregone: ids(...TR, 'Miscela Caustica di Tasha', 'Unto', 'Arma Magica', 'Lama Infuocata', 'Scudiscio Mentale di Tasha', 'Sfera Infuocata', 'Fortezza della Mente', 'Tocco del Vampiro', 'Scudo di Fuoco', 'Mano di Bigby', 'Abito Ultraterreno di Tasha', 'Carne in Pietra', 'Sfera Congelante di Otiluke', 'Sogno del Velo Celeste', 'Semipiano', 'Lama del Disastro'),
    warlock: ids(...TR, 'Evoca Bestia d\'Ombra', 'Evoca Folletto', 'Evoca Non Morto', 'Fortezza della Mente', 'Sudario Spirituale', 'Evoca Aberrazione', 'Cerchio di Teletrasporto', 'Fuorviare', 'Legame Planare', 'Abito Ultraterreno di Tasha', 'Evoca Immondo', 'Sogno del Velo Celeste', 'Fatale', 'Lama del Disastro', 'Portale'),
  };


  /* ---- Privilegi di classe opzionali ----
     { id, cl, liv, nome, desc, sost: [nomi dei privilegi sostituiti], fonte, usi:(L,mods,pb)=>n, inc:[[livClasse, idIncantesimo]] } */
  D.OPZIONALI = D.OPZIONALI || [];
  const imb = (cl, l1, l2, l3) => ({ id: cl.slice(0, 3) + '-imbrigliare', cl, liv: l1, nome: 'Imbrigliare il Potere Divino', desc: 'Spendi un uso di Incanalare Divinità per alimentare gli incantesimi: con un\'azione bonus, toccando il simbolo sacro e mormorando una preghiera, recuperi uno slot incantesimo speso di livello pari o inferiore a metà del bonus di competenza (arrotondato per eccesso). Usi: 1 al ' + l1 + '° livello, 2 al ' + l2 + '°, 3 al ' + l3 + '° (riposo lungo).', usi: (L) => (L >= l3 ? 3 : L >= l2 ? 2 : 1) });
  [
    { id: 'bar-conosc', cl: 'barbaro', liv: 3, nome: 'Conoscenza Primordiale', desc: 'Al 3° e di nuovo al 10° livello ottieni competenza in un\'abilità a tua scelta dall\'elenco delle abilità del barbaro al 1° livello.' },
    { id: 'bar-balzo', cl: 'barbaro', liv: 7, nome: 'Balzo Istintivo', desc: 'Come parte dell\'azione bonus per entrare in ira, puoi muoverti fino a metà della tua velocità.' },
    { id: 'bard-ispirazione', cl: 'bardo', liv: 2, nome: 'Ispirazione Magica', desc: 'Se una creatura con un tuo dado di Ispirazione Bardica lancia un incantesimo che ripristina PF o infligge danni, può tirare il dado e sommarlo ai PF guadagnati o ai danni inflitti (scegliendo il bersaglio). Il dado è perso.' },
    { id: 'bard-versatilita', cl: 'bardo', liv: 4, nome: 'Versatilità Bardica', desc: 'A ogni livello che dà un aumento di caratteristica puoi: sostituire un\'abilità scelta per Maestria con un\'altra tua competenza senza Maestria, oppure sostituire un trucchetto appreso con Incantesimi con un altro trucchetto da bardo.' },
    imb('chierico', 2, 6, 18),
    { id: 'chi-trucchetti', cl: 'chierico', liv: 4, nome: 'Trucchetti Versatili', desc: 'A ogni livello che dà un aumento di caratteristica puoi sostituire un trucchetto appreso con Incantesimi con un altro trucchetto da chierico.' },
    { id: 'chi-colpi', cl: 'chierico', liv: 8, nome: 'Colpi Benedetti', desc: 'Sostituisce Colpo Divino o Incantesimi Potenti. Quando infliggi danni con un trucchetto o con un attacco con arma, puoi infliggere anche 1d8 danni radiosi; una volta per turno.', sost: ['Colpo Divino', 'Incantesimi Potenti'] },
    { id: 'dru-compagno', cl: 'druido', liv: 2, nome: 'Compagno Selvatico', desc: 'Con un\'azione spendi un uso di Forma Selvatica per lanciare Trova Famiglio senza componenti materiali: il famiglio è un folletto (non una bestia) e scompare dopo un numero di ore pari a metà del tuo livello da druido.' },
    { id: 'dru-trucchetti', cl: 'druido', liv: 4, nome: 'Trucchetti Versatili', desc: 'A ogni livello che dà un aumento di caratteristica puoi sostituire un trucchetto appreso con Incantesimi con un altro trucchetto da druido.' },
    { id: 'gue-versatilita', cl: 'guerriero', liv: 4, nome: 'Versatilità Marziale', desc: 'A ogni livello che dà un aumento di caratteristica puoi sostituire uno stile di combattimento con un altro stile da guerriero e, se conosci manovre del Maestro di Battaglia, sostituirne una con un\'altra.' },
    { id: 'lad-mira', cl: 'ladro', liv: 3, nome: 'Mira Ferma', desc: 'Azione bonus: ottieni vantaggio al prossimo tiro per colpire del turno. Solo se non ti sei mosso in questo turno; dopo averla usata la tua velocità è 0 fino a fine turno.' },
    { id: 'mag-formule', cl: 'mago', liv: 3, nome: 'Formule dei Trucchetti', desc: 'Hai trascritto formule arcane nel libro: dopo un riposo lungo, consultandole, puoi sostituire un trucchetto da mago che conosci con un altro trucchetto dalla lista da mago.' },
    { id: 'mon-arma', cl: 'monaco', liv: 2, nome: 'Arma Personalizzata', desc: 'Dopo un riposo breve o lungo tocchi un\'arma concentrandovi il ki: diventa arma da monaco finché non usi di nuovo il privilegio. Deve essere semplice o da guerra, senza le proprietà pesante e speciale, e devi esserne competente.' },
    { id: 'mon-infuso', cl: 'monaco', liv: 3, nome: 'Attacco Infuso di Ki', desc: 'Se spendi 1 o più punti ki nella tua azione durante il turno, puoi fare come azione bonus un attacco con colpo senz\'armi o arma da monaco prima della fine del turno.' },
    { id: 'mon-guarigione', cl: 'monaco', liv: 4, nome: 'Guarigione Accelerata', desc: 'Con un\'azione, spendi 2 punti ki e tira un dado di Arti Marziali: recuperi PF pari al risultato + bonus di competenza.' },
    { id: 'mon-mira', cl: 'monaco', liv: 5, nome: 'Mira Focalizzata', desc: 'Se fallisci un tiro per colpire, puoi spendere da 1 a 3 punti ki per aumentarlo di 2 per ogni punto speso.' },
    imb('paladino', 3, 7, 15),
    { id: 'pal-versatilita', cl: 'paladino', liv: 4, nome: 'Versatilità Marziale', desc: 'A ogni livello che dà un aumento di caratteristica puoi sostituire uno stile di combattimento con un altro stile da paladino.' },
    { id: 'ran-esploratore', cl: 'ranger', liv: 1, nome: 'Esploratore Esperto', desc: 'Sostituisce Esploratore Nato. Astuto (1°): scegli un\'abilità in cui sei competente: il bonus di competenza è doppio nelle prove con essa; impari due lingue. Girovago (6°): velocità +1,5 m e velocità di scalare e nuotare pari a quella a terra. Instancabile (10°): azione, PF temporanei 1d8 + Sag (minimo 1) competenza volte per riposo lungo; ogni riposo breve riduce di 1 l\'indebolimento.', sost: ['Esploratore Nato'] },
    { id: 'ran-avversario', cl: 'ranger', liv: 1, nome: 'Avversario Prescelto', desc: 'Sostituisce Nemico Prescelto. Quando colpisci una creatura puoi marcarla come nemico prescelto (1 minuto o fino a perdita di concentrazione): la prima volta per turno che le infliggi danni aggiungi 1d4 (1d6 dal 6°, 1d8 dal 14°). Competenza volte per riposo lungo.', sost: ['Nemico Prescelto'], usi: (L, m, pb) => pb },
    { id: 'ran-focus', cl: 'ranger', liv: 2, nome: 'Focus da Incantatore', desc: 'Puoi usare un focus druidico come focus da incantatore per i tuoi incantesimi da ranger.' },
    { id: 'ran-consapevolezza', cl: 'ranger', liv: 3, nome: 'Consapevolezza Primitiva', desc: 'Sostituisce Consapevolezza Primordiale. Apprendi incantesimi aggiuntivi ai livelli 3°, 5°, 9°, 13° e 17° (non contano tra i conosciuti): Parlare con gli Animali, Percezione delle Bestie, Parlare con i Vegetali, Localizza Creatura, Comunione con la Natura. Ognuno si lancia una volta senza slot per riposo lungo.', sost: ['Consapevolezza Primordiale'], inc: [[3, idDa('Parlare con gli Animali')], [5, idDa('Percezione delle Bestie')], [9, idDa('Parlare con i Vegetali')], [13, idDa('Localizza Creatura')], [17, idDa('Comunione con la Natura')]] },
    { id: 'ran-compagno', cl: 'ranger', sub: 'bestie', liv: 3, nome: 'Compagno Primordiale', desc: 'Sostituisce il Compagno del Ranger del Signore delle Bestie. Evochi una bestia primordiale amichevole che obbedisce ai tuoi ordini: scegli la scheda tra Bestia della Terra, del Mare o del Cielo (usa il tuo bonus di competenza BC; scegli tu che animale è). Agisce nel tuo turno: solo Schivata, salvo ordini con un\'azione bonus (o sacrificando uno dei tuoi attacchi per farle fare Attacco). Se è morta da meno di un\'ora la rianimi con un\'azione e uno slot di 1° livello o superiore (1 minuto, PF pieni); dopo un riposo lungo puoi evocarne un\'altra. Legame Primordiale: sommi il tuo BC alle prove e ai TS della bestia. CA 13 + BC; Sensi: Percezione passiva 12, scurovisione 18 m. TERRA (Media): PF 5 + 5 × livello da ranger, velocità 12 m e scalare 12 m, Carica (se si muove 6 m in linea retta e colpisce: 1d6 taglienti extra, TS Forza o prono), Dilaniare 1d8 + 2 + BC taglienti. MARE (Media): PF 5 + 5 × livello, velocità 1,5 m e nuotare 18 m, Anfibia, Colpo Afferrante 1d6 + 2 + BC contundenti o perforanti e afferra. CIELO (Piccola): PF 4 + 4 × livello, velocità 3 m e volare 18 m, Sfuggente (nessun attacco di opportunità volando via), Sbrandellare 1d4 + 3 + BC taglienti. Tutti attaccano con il tuo bonus di attacco degli incantesimi.', sost: ['Compagno del Ranger'] },
    { id: 'ran-versatilita', cl: 'ranger', liv: 4, nome: 'Versatilità Marziale', desc: 'A ogni livello che dà un aumento di caratteristica puoi sostituire uno stile di combattimento con un altro stile da ranger.' },
    { id: 'ran-velo', cl: 'ranger', liv: 10, nome: 'Velo della Natura', desc: 'Sostituisce Nascondersi in Piena Vista (Mimetismo). Azione bonus: diventi magicamente invisibile con il tuo equipaggiamento fino all\'inizio del tuo turno successivo. Competenza volte per riposo lungo.', sost: ['Mimetismo'], usi: (L, m, pb) => pb },
    { id: 'str-versatilita', cl: 'stregone', liv: 4, nome: 'Versatilità Stregonesca', desc: 'A ogni livello che dà un aumento di caratteristica puoi sostituire un\'opzione di Metamagia con un\'altra, oppure un trucchetto appreso con Incantesimi con un altro trucchetto da stregone.' },
    { id: 'str-guida', cl: 'stregone', liv: 5, nome: 'Guida Magica', desc: 'Se fallisci una prova di caratteristica, puoi spendere 1 punto stregoneria per ritirare il d20 (devi usare il nuovo risultato).' },
    { id: 'war-versatilita', cl: 'warlock', liv: 4, nome: 'Versatilità Occulta', desc: 'A ogni livello che dà un aumento di caratteristica puoi: sostituire un trucchetto di Magia del Patto; sostituire l\'opzione di Dono del Patto; dal 12° sostituire un incantesimo di Arcanum Mistico con un altro dello stesso livello. Se perdi i prerequisiti di qualche Supplica devi sostituirla.' },
  ].forEach((o) => D.OPZIONALI.push(Object.assign({ fonte: FONTE }, o)));
  /* il vecchio nome rimane come alias, per eventuali salvataggi o script esterni */
  D.OPT_TASHA = D.OPZIONALI;

  /* ---- Risorse (cerchietti sulla scheda): 'classe/Nome del privilegio' → usi ---- */
  D.RIS_PRIV = Object.assign(D.RIS_PRIV || {}, {
    'barbaro/Consapevolezza Magica': (L, m, pb) => pb, 'barbaro/Magia Corroborante': (L, m, pb) => pb, 'barbaro/Furia Contagiosa': (L, m, pb) => pb, 'barbaro/Chiamata alla Caccia': (L, m, pb) => pb,
    'bardo/Ispirazione Contagiosa': (L, m) => Math.max(1, m.car), 'bardo/Compimento della Creazione': () => 1, 'bardo/Oggetto Danzante': () => 1,
    'chierico/Passi nella Notte': (L, m, pb) => pb, 'chierico/Incarnazione della Legge': (L, m) => Math.max(1, m.sag), 'chierico/Legame Incoraggiante': (L, m, pb) => pb,
    'druido/Fiamme Cauterizzanti': (L, m, pb) => pb, 'druido/Recupero Ardente': () => 1, 'druido/Infestazione Fungina': (L, m) => Math.max(1, m.sag), 'druido/Presagio Cosmico': (L, m, pb) => pb,
    'guerriero/Energia Psionica': (L, m, pb) => 2 * pb, 'guerriero/Potenza del Gigante': (L, m, pb) => pb, 'guerriero/Scudo Runico': (L, m, pb) => pb, 'guerriero/Baluardo della Forza': () => 1, 'guerriero/Maestro della Telecinesi': () => 1,
    'ladro/Energia Psionica': (L, m, pb) => 2 * pb, 'ladro/Lamenti dalla Tomba': (L, m, pb) => pb, 'ladro/Cammino Fantasma': () => 1, 'ladro/Velo Psichico': () => 1, 'ladro/Squarciare la Mente': () => 1,
    'mago/Melodia della Lama': (L, m, pb) => pb, 'mago/Mente Manifesta': (L, m, pb) => pb, 'mago/Comunione con il Testo': () => 1,
    'monaco/Mano della Misericordia Suprema': () => 1,
    'paladino/Baluardo dei Mortali': () => 1, 'paladino/Leggenda Vivente': () => 1, 'paladino/Difesa Gloriosa': (L, m) => Math.max(1, m.car),
    'ranger/Sciame Riunito': (L, m, pb) => pb, 'ranger/Marea Avvolgente': (L, m, pb) => pb, 'ranger/Dispersione Brulicante': (L, m, pb) => pb, 'ranger/Viandante Velato': (L, m) => Math.max(1, m.sag), 'ranger/Rinforzi Fatati': () => 1,
    'stregone/Ripristino dell\'Equilibrio': (L, m, pb) => pb, 'stregone/Trance dell\'Ordine': () => 1, 'stregone/Cavalleria Meccanica': () => 1, 'stregone/Implosione Distorcente': () => 1,
    'warlock/Dono Elementale': (L, m, pb) => pb, 'warlock/Tentacolo delle Profondità': (L, m, pb) => pb, 'warlock/Presa dei Tentacoli': () => 1, 'warlock/Immersione Insondabile': () => 1,
    'artefice/Lampo di Genio': (L, m) => Math.max(1, m.int), 'artefice/Oggetto che Custodisce l\'Incantesimo': (L, m) => Math.max(2, 2 * m.int), 'artefice/Scossa Arcana': (L, m) => Math.max(1, m.int),
    'artefice/Cannone Occulto': () => 1, 'artefice/Campo Difensivo': (L, m, pb) => pb, 'artefice/Presa Magnetica': (L, m, pb) => pb,
  });
})(typeof window !== 'undefined' ? window : globalThis);
