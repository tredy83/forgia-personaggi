/* Privilegi di sottoclasse (Manuale del Giocatore) – sintesi originali, formato [livello, nome, descrizione].
   Vengono aggiunti a DND.CLASSI[...].sottoclasse.opzioni[...].tratti. */
(function (G) {
  const D = G.DND;
  const T = {
    'barbaro/berserker': [
      [3, 'Frenesia', 'Mentre sei in Ira puoi fare un attacco in mischia extra come azione bonus a ogni turno. Quando l\'Ira finisce subisci 1 livello di indebolimento.'],
      [6, 'Ira Incontenibile', 'In Ira non puoi essere affascinato né spaventato (se lo eri, l\'effetto si sospende finché dura l\'Ira).'],
      [10, 'Presenza Intimidatoria', 'Azione: una creatura a scelta entro 9 m che ti vede deve superare un TS su Saggezza (CD 8 + competenza + mod. Carisma) o resta spaventata fino alla fine del tuo prossimo turno. Nei turni successivi puoi usare un\'azione per prolungare l\'effetto. Una creatura che supera il TS è immune per 24 ore.'],
      [14, 'Ritorsione', 'Reazione: quando una creatura entro 1,5 m ti ferisce, puoi attaccarla subito in mischia.']
    ],
    'barbaro/totemico': [
      [3, 'Cercatore di Spiriti', 'Puoi lanciare come rituali Parlare con gli Animali e Percezione delle Bestie.'],
      [3, 'Spirito Totemico', 'In Ira scegli: Orso (resistenza a tutti i danni tranne psichico), Aquila (Scatto come azione bonus e nemici svantaggiati negli attacchi di opportunità) o Lupo (gli alleati hanno vantaggio contro i nemici vicini a te).'],
      [6, 'Aspetto della Bestia', 'Dono permanente dell\'animale: Orso (carico doppio e forza nel sollevare), Aquila (vista fino a 1,6 km), Lupo (tracci a passo veloce e ti muovi furtivo a passo normale).'],
      [10, 'Viandante Spirituale', 'Puoi lanciare Comunione con la Natura come rituale.'],
      [14, 'Sintonia Totemica', 'In Ira: Orso (i nemici vicini attaccano gli altri con svantaggio), Aquila (voli alla tua velocità), Lupo (azione bonus per atterrare una creatura Grande o più piccola colpita in mischia).']
    ],
    'bardo/sapienza': [
      [3, 'Competenze Bonus', 'Ottieni competenza in 3 abilità a scelta.'],
      [3, 'Parole Taglienti', 'Reazione: spendi un\'Ispirazione Bardica per sottrarre il dado dal tiro (attacco, danni o prova) di una creatura entro 18 m.'],
      [6, 'Segreti Magici Aggiuntivi', 'Impari 2 incantesimi da qualsiasi lista (contano tra quelli conosciuti).'],
      [14, 'Abilità Impareggiabile', 'Quando fai una prova di caratteristica puoi spendere un\'Ispirazione Bardica e sommare il dado.']
    ],
    'bardo/valore': [
      [3, 'Competenze Bonus', 'Ottieni competenza con armature medie, scudi e armi da guerra.'],
      [3, 'Ispirazione in Combattimento', 'Chi riceve la tua Ispirazione può usare il dado anche per aumentare i danni o la CA contro un attacco.'],
      [6, 'Attacco Extra', 'Due attacchi con l\'azione di Attacco.'],
      [14, 'Magia da Battaglia', 'Dopo aver lanciato un incantesimo con un\'azione puoi fare un attacco con arma come azione bonus.']
    ],
    'chierico/conoscenza': [
      [1, 'Benedizioni della Conoscenza', 'Impari 2 lingue e hai competenza raddoppiata in 2 tra Arcano, Storia, Natura e Religione.'],
      [2, 'Incanalare: Conoscenze Secolari', 'Azione: per 10 minuti hai competenza in un\'abilità o strumento a tua scelta.'],
      [6, 'Incanalare: Lettura del Pensiero', 'Leggi i pensieri di una creatura (TS Sag) e puoi lanciare Suggestione su di essa senza slot.'],
      [8, 'Incantesimi Potenti', 'Aggiungi il mod. Saggezza ai danni dei trucchetti da chierico.'],
      [17, 'Visioni del Passato', 'Meditando 1 minuto su un oggetto o un luogo ricevi visioni degli eventi che lo hanno riguardato (1/riposo breve o lungo).']
    ],
    'chierico/vita': [
      [1, 'Competenza Bonus', 'Ottieni competenza con le armature pesanti.'],
      [1, 'Discepolo della Vita', 'Le tue cure con incantesimi guariscono 2 PF in più + il livello dell\'incantesimo.'],
      [2, 'Incanalare: Preservare Vita', 'Azione: distribuisci PF pari a 5 × livello da chierico tra creature entro 9 m, fino a metà dei loro PF massimi.'],
      [6, 'Guaritore Benedetto', 'Quando curi un\'altra creatura con un incantesimo, anche tu recuperi 2 + livello dell\'incantesimo PF.'],
      [8, 'Colpo Divino', 'Una volta per turno un colpo con arma infligge 1d8 radiosi extra (2d8 dal 14°).'],
      [17, 'Guarigione Suprema', 'Nelle cure con dadi, usi sempre il valore massimo di ogni dado.']
    ],
    'chierico/luce': [
      [1, 'Trucchetto Bonus', 'Conosci il trucchetto Luce.'],
      [1, 'Lampo di Interdizione', 'Reazione: imponi svantaggio all\'attacco di una creatura entro 9 m che ti vede (mod. Saggezza volte per riposo lungo).'],
      [2, 'Incanalare: Fulgore dell\'Alba', 'Azione: col simbolo sacro dissolvi ogni oscurità magica entro 9 m; i nemici entro 9 m fanno un TS su Costituzione e subiscono 2d10 + livello da chierico danni radiosi (la metà se lo superano). Chi ha copertura totale è immune.'],
      [6, 'Lampo Migliorato', 'Puoi usare Lampo Protettivo anche per difendere un alleato.'],
      [8, 'Incantesimi Potenti', 'Aggiungi il mod. Saggezza ai danni dei trucchetti da chierico.'],
      [17, 'Corona di Luce', 'Azione: per 1 minuto emani luce solare in 18 m; i nemici dentro hanno svantaggio ai TS contro i tuoi incantesimi di fuoco e radiosi.']
    ],
    'chierico/natura': [
      [1, 'Accolito della Natura', 'Impari un trucchetto da druido e ottieni competenza in una tra Addestrare Animali, Natura e Sopravvivenza.'],
      [1, 'Competenza Bonus', 'Ottieni competenza con le armature pesanti.'],
      [2, 'Incanalare: Charme su Animali e Vegetali', 'Azione: bestie e creature vegetali entro 9 m che ti vedono devono superare un TS su Saggezza o restano affascinate per 1 minuto o finché subiscono danni; ti obbediscono come amiche.'],
      [6, 'Mitigare Elementi', 'Reazione: dai a te o a un alleato entro 9 m resistenza a acido, freddo, fuoco, fulmine o tuono contro un danno.'],
      [8, 'Colpo Divino', 'Una volta per turno un colpo con arma infligge 1d8 di freddo, fuoco o fulmine extra (2d8 dal 14°).'],
      [17, 'Maestro della Natura', 'Puoi comandare le creature affascinate dal tuo Charme come azione bonus.']
    ],
    'chierico/tempesta': [
      [1, 'Competenze Bonus', 'Ottieni competenza con armi da guerra e armature pesanti.'],
      [1, 'Collera della Tempesta', 'Reazione: quando una creatura entro 1,5 m ti colpisce, subisce 2d8 di fulmine o tuono (TS Des dimezza). Mod. Saggezza volte per riposo lungo.'],
      [2, 'Incanalare: Collera Distruttiva', 'Quando tiri danni da fulmine o tuono puoi renderli massimi.'],
      [6, 'Colpo del Tuono e del Fulmine', 'Quando infliggi danni da fulmine, puoi spingere una creatura Grande o più piccola di 3 m.'],
      [8, 'Colpo Divino', 'Una volta per turno un colpo con arma infligge 1d8 di tuono extra (2d8 dal 14°).'],
      [17, 'Nato dalla Tempesta', 'Hai velocità di volo pari alla tua velocità a terra quando sei all\'aperto.']
    ],
    'chierico/inganno': [
      [1, 'Benedizione dell\'Ingannatore', 'Azione: una creatura consenziente che tocchi ha vantaggio alle prove di Furtività per 1 ora.'],
      [2, 'Incanalare: Invocare Duplicato', 'Azione: crei un duplicato illusorio di te entro 9 m per 1 minuto; puoi lanciare incantesimi come se fossi lì e hai vantaggio agli attacchi se lui e te siete vicini al bersaglio.'],
      [6, 'Incanalare: Manto di Ombre', 'Azione: diventi invisibile fino alla fine del tuo prossimo turno; l\'invisibilità termina prima se attacchi o lanci un incantesimo.'],
      [8, 'Colpo Divino', 'Una volta per turno un colpo con arma infligge 1d8 di veleno extra (2d8 dal 14°).'],
      [17, 'Duplicato Migliorato', 'Puoi creare fino a 4 duplicati con Invocare Duplicato.']
    ],
    'chierico/guerra': [
      [1, 'Competenze Bonus', 'Ottieni competenza con armi da guerra e armature pesanti.'],
      [1, 'Sacerdote di Guerra', 'Quando usi l\'azione Attacco puoi fare un attacco con arma come azione bonus. Usi pari al mod. Saggezza (minimo 1) per riposo lungo.'],
      [2, 'Incanalare: Colpo Guidato', 'Dopo aver tirato per colpire ottieni +10 a quel tiro.'],
      [6, 'Incanalare: Benedizione del Dio della Guerra', 'Reazione: dai +10 a un tiro per colpire di un alleato entro 9 m.'],
      [8, 'Colpo Divino', 'Una volta per turno un colpo con arma infligge 1d8 extra dello stesso tipo dell\'arma (2d8 dal 14°).'],
      [17, 'Avatar della Battaglia', 'Resistenza ai danni contundenti, perforanti e taglienti non magici.']
    ],
    'druido/terra': [
      [2, 'Trucchetto Bonus', 'Impari un trucchetto da druido in più.'],
      [2, 'Recupero Naturale', 'Dopo un riposo breve recuperi slot per un livello totale pari a metà del tuo livello da druido (1/riposo lungo, nessuno sopra il 5°).'],
      [3, 'Incantesimi del Circolo', 'Ottieni incantesimi extra sempre preparati, secondo il terreno scelto (artico, costa, deserto, foresta, montagna, palude, prateria, Underdark).'],
      [6, 'Andatura sul Territorio', 'Il terreno difficile non magico non ti rallenta e hai vantaggio ai TS contro piante magiche che ostacolano.'],
      [10, 'Interdizione della Natura', 'Sei immune a veleno e malattie, e non puoi essere affascinato o spaventato da elementali e folletti.'],
      [14, 'Rifugio della Natura', 'Bestie e creature vegetali che vogliono attaccarti devono superare un TS su Saggezza contro la tua CD incantesimi: se falliscono devono scegliere un altro bersaglio o l\'attacco manca. Chi supera il TS è immune a questo effetto per 24 ore.']
    ],
    'druido/luna': [
      [2, 'Forma Selvatica da Combattimento', 'Ti trasformi come azione bonus e puoi spendere uno slot per curarti di 1d8 PF per livello dello slot, come azione bonus, mentre sei trasformato.'],
      [2, 'Forme del Circolo', 'Puoi trasformarti in bestie fino a Sfida 1 (dal 6° livello: livello da druido ÷ 3, arrotondato per difetto).'],
      [6, 'Colpo Primordiale', 'Gli attacchi delle tue forme di bestia contano come magici.'],
      [10, 'Forma Selvatica Elementale', 'Spendi 2 usi di Forma Selvatica per diventare un elementale dell\'aria, dell\'acqua, del fuoco o della terra.'],
      [14, 'Mille Forme', 'Puoi lanciare Alterare Se Stesso a volontà.']
    ],
    'guerriero/campione': [
      [3, 'Critico Migliorato', 'I tuoi attacchi con arma sono critici con 19 o 20 sul d20.'],
      [7, 'Atleta Straordinario', 'Aggiungi metà del bonus di competenza alle prove di For, Des e Cos in cui non sei già competente; il salto in lungo con rincorsa cresce di 30 cm per punto di modificatore di Forza.'],
      [10, 'Stile di Combattimento Aggiuntivo', 'Scegli un secondo stile di combattimento.'],
      [15, 'Critico Superiore', 'I tuoi attacchi con arma sono critici con 18, 19 o 20.'],
      [18, 'Sopravvissuto', 'All\'inizio di ogni tuo turno, se hai meno della metà dei PF massimi (e almeno 1 PF), recuperi 5 + mod. Costituzione PF.']
    ],
    'guerriero/maestro': [
      [3, 'Superiorità in Combattimento', 'Hai 4 dadi di superiorità (d8; 5 al 7°, 6 al 15°) e impari 3 manovre (2 in più al 7°, 10° e 15°; a ogni nuova scelta puoi cambiarne una). Una manovra per attacco. I dadi tornano con un riposo breve o lungo. CD dei TS = 8 + competenza + For o Des.'],
      [3, 'Studioso di Guerra', 'Ottieni competenza con uno strumento da artigiano a tua scelta.'],
      [7, 'Conosci il Tuo Nemico', 'Studiando una creatura per 1 minuto ne scopri alcune capacità rispetto a te (FOR, DES, COS, CA, PF, livello).'],
      [10, 'Superiorità in Combattimento Migliorata', 'I dadi di superiorità diventano d10 (d12 al 18°).'],
      [15, 'Implacabile', 'Se tiri iniziativa senza dadi di superiorità, ne recuperi 1.']
    ],
    'guerriero/cavaliere': [
      [3, 'Incantesimi', 'Incantatore da mago (Intelligenza), con slot di 1/3 del livello; molti incantesimi sono di abiurazione e invocazione.'],
      [3, 'Arma Vincolata', 'Leghi fino a 2 armi con un rito di 1 ora: non puoi essere disarmato e le richiami in mano come azione bonus.'],
      [7, 'Magia da Guerra', 'Dopo aver lanciato un trucchetto puoi fare un attacco con arma come azione bonus.'],
      [10, 'Colpo Mistico', 'Chi colpisci con un\'arma ha svantaggio al TS contro il tuo prossimo incantesimo.'],
      [15, 'Carica Arcana', 'Quando usi Azione Impetuosa puoi anche teletrasportarti di 9 m.'],
      [18, 'Magia da Guerra Migliorata', 'Dopo aver lanciato un incantesimo (di qualsiasi livello) puoi attaccare con arma come azione bonus.']
    ],
    'ladro/ladro': [
      [3, 'Mani Veloci', 'Con Azione Scaltra puoi anche usare Rapidità di Mano, scassinare o usare un oggetto.'],
      [3, 'Lavoro al Secondo Piano', 'Scalare non costa movimento extra e il salto in lungo con rincorsa cresce di 30 cm per punto di modificatore di Destrezza.'],
      [9, 'Furtività Suprema', 'Hai vantaggio alle prove di Furtività se ti muovi al massimo di metà velocità.'],
      [13, 'Usare Oggetto Magico', 'Ignori i requisiti di classe, razza e livello per usare gli oggetti magici.'],
      [17, 'Riflessi da Furfante', 'Nel primo round di ogni combattimento hai due turni: il normale e un secondo a iniziativa −10. Non funziona se sei sorpreso.']
    ],
    'ladro/assassino': [
      [3, 'Competenze Bonus', 'Ottieni competenza con kit del travestimento e kit da avvelenatore.'],
      [3, 'Assassinare', 'Hai vantaggio contro creature che non hanno ancora agito; ogni colpo a una creatura sorpresa è un critico.'],
      [9, 'Maestro Infiltrato', 'Puoi crearti un\'identità falsa (7 giorni e 25 monete d\'oro).'],
      [13, 'Impostore', 'Dopo aver studiato qualcuno per 3 ore ne imiti voce, scrittura e modi.'],
      [17, 'Colpo Mortale', 'Se colpisci una creatura sorpresa, deve superare un TS su Costituzione o subisce danni raddoppiati.']
    ],
    'ladro/mistificatore': [
      [3, 'Incantesimi', 'Incantatore da mago (Intelligenza), con slot di 1/3 del livello; molti incantesimi sono di ammaliamento e illusione.'],
      [3, 'Gioco di Prestigio della Mano Magica', 'La tua Mano Magica è invisibile e può rubare o riporre oggetti e usare arnesi da ladro.'],
      [9, 'Imboscata Magica', 'Se sei nascosto a una creatura e le lanci un incantesimo, ha svantaggio ai TS contro di esso in quel turno.'],
      [13, 'Ingannatore Versatile', 'Azione bonus: con la Mano Magica distrai una creatura entro 1,5 m dalla mano spettrale; fino a fine turno hai vantaggio ai tiri per colpire contro di essa.'],
      [17, 'Ladro di Incantesimi', 'Reazione, quando sei bersaglio di un incantesimo: la creatura fa un TS usando la sua caratteristica da incantatore contro la tua CD; se fallisce, l\'incantesimo è annullato su di te e tu lo ruba. Per 8 ore lo conosci e puoi lanciarlo con i tuoi slot; il lanciatore non può più usarlo finché dura. 1/riposo lungo.']
    ],
    'mago/abiurazione': [
      [2, 'Abiuratore Sapiente', 'Copiare abiurazioni nel libro degli incantesimi costa metà tempo e denaro.'],
      [2, 'Interdizione Arcana', 'Un\'abiurazione crea uno scudo con PF pari a 2 × livello da mago + mod. Int, che assorbe i tuoi danni.'],
      [6, 'Interdizione Proiettata', 'Reazione: lo scudo assorbe i danni di un alleato entro 9 m.'],
      [10, 'Abiurazione Migliorata', 'Aggiungi la competenza alle prove di caratteristica di Controincantesimo e Dissolvi Magie.'],
      [14, 'Resistenza agli Incantesimi', 'Vantaggio ai TS contro gli incantesimi e resistenza ai loro danni.']
    ],
    'mago/ammaliamento': [
      [2, 'Ammaliatore Sapiente', 'Copiare ammaliamenti nel libro costa metà tempo e denaro.'],
      [2, 'Sguardo Ipnotico', 'Azione: una creatura entro 1,5 m che ti vede e sente deve superare un TS su Saggezza o resta affascinata e incapacitata fino alla fine del tuo prossimo turno.'],
      [6, 'Fascino Istintivo', 'Reazione: quando una creatura entro 9 m ti attacca (prima di sapere se colpisce) puoi costringerla a un TS su Saggezza; se fallisce, l\'attacco è deviato sulla creatura più vicina (tu escluso).'],
      [10, 'Ammaliamento Condiviso', 'Un incantesimo di ammaliamento a bersaglio singolo può colpire anche una seconda creatura.'],
      [14, 'Alterare Ricordi', 'Quando affascini una creatura con un incantesimo di ammaliamento, questa non si accorge di essere stata affascinata; inoltre puoi farle dimenticare 1 + mod. Carisma ore (minimo 1) di tempo, se fallisce un TS su Intelligenza.']
    ],
    'mago/divinazione': [
      [2, 'Divinatore Sapiente', 'Copiare divinazioni nel libro costa metà tempo e denaro.'],
      [2, 'Portento', 'Dopo un riposo lungo tira 2d20 e tienili: puoi sostituire con loro un tiro d20 di qualsiasi creatura (3 dadi dal 14°).'],
      [6, 'Divinazione Esperta', 'Lanciando una divinazione di 2° o più recuperi uno slot inferiore (max 5°).'],
      [10, 'Terzo Occhio', 'Azione: ottieni un beneficio a scelta fino al prossimo riposo breve o lungo: scurovisione 18 m, vista eterea 18 m, lettura di ogni scrittura o vedere l\'invisibilità entro 3 m.']
    ],
    'mago/evocazione': [
      [2, 'Evocatore Sapiente', 'Copiare evocazioni nel libro costa metà tempo e denaro.'],
      [2, 'Evocazione Minore', 'Azione: crei un oggetto inanimato non magico (fino a 90 cm di lato e 5 kg) per 1 ora.'],
      [6, 'Trasposizione Benevola', 'Azione: ti teletrasporti di 9 m o scambi posto con una creatura consenziente (poi serve un\'evocazione o un riposo lungo).'],
      [10, 'Evocazione Focalizzata', 'I danni non interrompono la tua concentrazione sulle evocazioni.'],
      [14, 'Evocazioni Perduranti', 'Le creature che evochi hanno 30 PF temporanei.']
    ],
    'mago/illusione': [
      [2, 'Illusionista Sapiente', 'Copiare illusioni nel libro costa metà tempo e denaro.'],
      [2, 'Illusione Minore Migliorata', 'Impari Illusione Minore (se non l\'hai già) e puoi creare insieme suono e immagine.'],
      [6, 'Illusioni Duttili', 'Quando lanci un\'illusione con durata di almeno 1 minuto puoi usare un\'azione per modificarla finché dura.'],
      [10, 'Sosia Illusorio', 'Reazione: quando una creatura ti attacca crei un doppione illusorio che subisce l\'attacco, che manca automaticamente (1/riposo breve o lungo).'],
      [14, 'Realtà Illusoria', 'Azione bonus: un oggetto inanimato non magico di un\'illusione che stai mantenendo diventa reale per 1 minuto, ma non può infliggere danni né ferire.']
    ],
    'mago/invocazione': [
      [2, 'Invocatore Sapiente', 'Copiare invocazioni nel libro costa metà tempo e denaro.'],
      [2, 'Plasmare Incantesimi', 'Negli incantesimi ad area proteggi alleati (1 + livello dell\'incantesimo): non subiscono danni.'],
      [6, 'Trucchetto Potente', 'Chi supera il TS contro i tuoi trucchetti subisce comunque metà danni.'],
      [10, 'Invocazione Potente', 'Aggiungi il mod. Intelligenza ai danni degli incantesimi da mago di invocazione.'],
      [14, 'Saturazione Magica', 'Quando lanci un incantesimo da mago di 1°–5° puoi infliggere il massimo dei danni. La prima volta nessun contraccolpo; dalle volte successive prima di un riposo lungo subisci 2d12 danni necrotici per livello dell\'incantesimo (+1d12 per ogni uso ulteriore). Non puoi evitarli in alcun modo.']
    ],
    'mago/necromanzia': [
      [2, 'Negromante Sapiente', 'Copiare necromanzie nel libro costa metà tempo e denaro.'],
      [2, 'Raccolto Macabro', 'Una volta per turno, quando uccidi una creatura (non costrutto né non morto) con un incantesimo, recuperi PF pari a 2 × livello dell\'incantesimo (3× se è di necromanzia).'],
      [6, 'Servitori Non Morti', 'Impari Animare Morti; quando lo lanci crei un cadavere in più. I tuoi non morti hanno PF massimi aumentati del tuo livello da mago e aggiungono il bonus di competenza ai danni.'],
      [10, 'Impervio alla Non Morte', 'Resistenza ai danni necrotici; i tuoi PF massimi non possono essere ridotti.'],
      [14, 'Comandare Non Morti', 'Azione: controlli un non morto (TS Carisma; più facile se ha poca Intelligenza).']
    ],
    'mago/trasmutazione': [
      [2, 'Trasmutatore Sapiente', 'Copiare trasmutazioni nel libro costa metà tempo e denaro.'],
      [2, 'Alchimia Minore', 'Ogni 10 minuti puoi trasformare un cubo di 30 cm di legno, pietra (non gemme), ferro, rame o argento in uno degli altri materiali; torna normale dopo 1 ora o se perdi la concentrazione.'],
      [6, 'Pietra del Trasmutatore', 'Crei in 8 ore una pietra che dà a chi la porta un beneficio: scurovisione 18 m, +3 m di velocità, competenza ai TS su Costituzione o resistenza ad acido, freddo, fulmine, fuoco o tuono.'],
      [10, 'Mutaforma', 'Lanci Metamorfosi solo su te stesso (GS massimo 1) senza slot né componenti (1/riposo breve o lungo).'],
      [14, 'Maestro Trasmutatore', 'Azione: consumi la pietra per scegliere un effetto: trasformazione maggiore di un oggetto, panacea (cura malattie, veleni, maledizioni), ringiovanire di 3d10 anni o rianimare un morto da non più di 1 minuto.']
    ],
    'monaco/manoaperta': [
      [3, 'Tecnica della Mano Aperta', 'Con Raffica di Colpi puoi imporre al bersaglio: cadere a terra (TS Des), essere spinto di 4,5 m (TS For) o non poter fare reazioni.'],
      [6, 'Integrità del Corpo', 'Azione: recuperi PF pari a 3 × livello da monaco (1/riposo lungo).'],
      [11, 'Tranquillità', 'A ogni riposo lungo ottieni un effetto simile a Santuario.'],
      [17, 'Palmo Tremante', 'Con 3 ki imprimi vibrazioni in una creatura colpita; per un numero di giorni pari al tuo livello puoi, con un\'azione, attivarle: TS su Costituzione o scende a 0 PF; se supera, subisce 10d10 danni necrotici.']
    ],
    'monaco/ombra': [
      [3, 'Arti dell\'Ombra', 'Con 2 ki lanci Oscurità, Passo Senza Tracce, Silenzio o Scurovisione; conosci anche Illusione Minore.'],
      [6, 'Passo dell\'Ombra', 'Azione bonus: ti teletrasporti di 18 m tra zone in penombra o buio e il primo attacco ha vantaggio.'],
      [11, 'Manto di Ombre', 'Azione: diventi invisibile in penombra o buio finché non attacchi o lanci incantesimi.'],
      [17, 'Opportunista', 'Reazione: quando una creatura entro 1,5 m da te è colpita da un alleato, la attacchi.']
    ],
    'monaco/elementi': [
      [3, 'Discepolo degli Elementi', 'Conosci Sintonia Elementale e una disciplina elementale a scelta (altre al 6°, 11° e 17°; a ogni nuova disciplina puoi cambiarne una già nota). Ogni disciplina costa punti ki. Dal 5° puoi spendere ki extra per potenziare gli incantesimi (massimo ki per incantesimo: 3, poi 4 al 9°, 5 al 13°, 6 al 17°).'],
      [3, 'Sintonia Elementale', 'Azione: entro 9 m produci un effetto minore a scelta: un effetto sensoriale di acqua, aria, fuoco o terra; accendi o spegni una fiamma; raffreddi o scaldi fino a 0,5 kg di materiale per 1 ora; crei un cubo di 30 cm di terra, fuoco, acqua o foschia per 1 minuto.']
    ],
    'paladino/devozione': [
      [3, 'Incanalare: Arma Consacrata', 'Azione: per 1 minuto aggiungi il mod. Carisma ai tiri per colpire con l\'arma impugnata (min +1); l\'arma diventa magica ed emette luce.'],
      [3, 'Incanalare: Scacciare i Sacrileghi', 'Azione: immondi e non morti entro 9 m che ti sentono devono superare un TS su Saggezza o sono scacciati (fuggono) per 1 minuto.'],
      [7, 'Aura di Devozione', 'Tu e gli alleati entro 3 m (9 m dal 18°) non potete essere affascinati.'],
      [15, 'Purezza di Spirito', 'Sei sempre protetto da Protezione dal Bene e dal Male.'],
      [20, 'Nube Sacra', 'Azione: per 1 minuto emani luce, infliggi 10 danni radiosi ai nemici vicini a ogni loro turno e hai vantaggio ai TS contro gli incantesimi di immondi e non morti.']
    ],
    'paladino/antichi': [
      [3, 'Incanalare: Collera della Natura', 'Azione: rampicanti spettrali afferrano una creatura entro 3 m, che resta trattenuta se fallisce un TS su Forza o Destrezza (ripete il TS a fine turno).'],
      [3, 'Incanalare: Scacciare gli Infedeli', 'Azione: fate e immondi entro 9 m che ti sentono devono superare un TS su Saggezza o sono scacciati per 1 minuto.'],
      [7, 'Aura di Interdizione', 'Tu e gli alleati entro 3 m (9 m dal 18°) avete resistenza ai danni da incantesimi.'],
      [15, 'Sentinella Imperitura', 'Se scendi a 0 PF torni a 1 PF (1/riposo lungo) e non invecchi per cause magiche.'],
      [20, 'Campione degli Antichi', 'Azione: per 1 minuto rigeneri 10 PF a turno, lanci incantesimi come azione bonus e i nemici sono svantaggiati ai TS contro i tuoi incantesimi.']
    ],
    'paladino/vendetta': [
      [3, 'Incanalare: Abiurare Nemico', 'Azione: una creatura entro 18 m fa un TS su Saggezza (svantaggio se immonda o non morta): se fallisce è spaventata e con velocità 0 per 1 minuto o finché subisce danni; se supera dimezza la velocità.'],
      [3, 'Incanalare: Giuramento di Inimicizia', 'Azione bonus: giuri inimicizia a una creatura entro 3 m; per 1 minuto (o finché cade a 0 PF) hai vantaggio ai tiri per colpire contro di lei.'],
      [7, 'Vendicatore Implacabile', 'Quando colpisci con un attacco di opportunità puoi muoverti, come parte della reazione, fino a metà della tua velocità, senza provocare altri attacchi di opportunità dal bersaglio.'],
      [15, 'Anima di Vendetta', 'Reazione: attacchi in mischia chi è sotto Giuramento di Inimicizia quando attacca.'],
      [20, 'Angelo Vendicatore', 'Azione: per 1 ora hai ali (volo 18 m) e un\'aura di 9 m; i nemici che entrano o iniziano il turno nell\'aura devono superare un TS su Saggezza o restano spaventati per 1 minuto, e i tiri per colpire contro di loro hanno vantaggio. 1/riposo lungo.']
    ],
    'ranger/cacciatore': [
      [3, 'Preda del Cacciatore', 'Scegli una di queste opzioni: Devastatore dell\'Orda, Sterminatore di Colossi o Uccisore di Giganti.'],
      [7, 'Tattiche Difensive', 'Scegli una di queste opzioni: Difesa dal Multiattacco, Sfuggire all\'Orda o Volontà d\'Acciaio.'],
      [11, 'Multiattacco', 'Scegli una di queste opzioni: Attacco Turbinante o Raffica.'],
      [15, 'Difesa del Cacciatore Superiore', 'Scegli una di queste opzioni: Elusione, Opporsi alla Marea o Schivata Prodigiosa.']
    ],
    'ranger/bestie': [
      [3, 'Compagno del Ranger', 'Ottieni una bestia fedele (taglia Media o minore, Sfida massima 1/4) che agisce su tuo ordine; PF e bonus crescono con il tuo livello.'],
      [7, 'Addestramento Straordinario', 'Azione bonus: ordini al compagno di usare Aiuto, Disimpegno o Scatto; i suoi attacchi contano come magici.'],
      [11, 'Furia Bestiale', 'Il compagno può attaccare due volte, o usa il suo Multiattacco.'],
      [15, 'Condividere Incantesimi', 'Gli incantesimi che lanci su di te hanno effetto anche sul compagno vicino.']
    ],
    'stregone/draconica': [
      [1, 'Antenato Draconico', 'Scegli un drago: impari il Draconico e raddoppi la competenza nelle prove di Carisma con i draghi.'],
      [1, 'Resilienza Draconica', '+1 PF massimo per livello; senza armatura hai CA 13 + mod. Destrezza.'],
      [6, 'Affinità Elementale', 'Aggiungi il mod. Carisma ai danni del tipo del tuo drago; con 1 punto stregoneria ottieni resistenza a quel danno per 1 ora.'],
      [14, 'Ali di Drago', 'Azione bonus: ti spuntano le ali e voli alla tua velocità.'],
      [18, 'Presenza Draconica', 'Con 5 punti stregoneria crei un\'aura di 18 m che affascina o spaventa (concentrazione, 1 minuto).']
    ],
    'stregone/selvaggia': [
      [1, 'Impulso di Magia Selvaggia', 'Dopo un incantesimo di 1° o più il DM può chiederti un d20: con 1 tiri sulla tabella degli effetti casuali.'],
      [1, 'Onde di Caos', 'Ottieni vantaggio a una prova, tiro per colpire o TS (1/riposo lungo, si ricarica quando scatta un\'Ondata).'],
      [6, 'Piegare la Fortuna', 'Reazione: con 2 punti stregoneria aggiungi o sottrai 1d4 a un tiro di un\'altra creatura.'],
      [14, 'Caos Controllato', 'Quando tiri sulla tabella ne tiri due e scegli quale tenere.'],
      [18, 'Bombardamento Magico', 'Se un dado di danno dà il massimo, ne ritiri uno e aggiungi il risultato (1/turno).']
    ],
    'warlock/fatato': [
      [1, 'Lista Ampliata degli Incantesimi', 'Il patrono aggiunge incantesimi alla tua lista (come Sonno e Passo Velato).'],
      [1, 'Presenza Fatata', 'Azione: le creature in un cubo di 3 m da te devono superare un TS su Saggezza o restano affascinate o spaventate (a tua scelta) fino alla fine del tuo prossimo turno (1/riposo breve o lungo).'],
      [6, 'Fuga Velata', 'Reazione quando subisci danni: ti teletrasporti di 18 m in uno spazio libero e diventi invisibile fino all\'inizio del tuo turno successivo o finché attacchi o lanci un incantesimo (1/riposo breve o lungo).'],
      [10, 'Difese Seducenti', 'Sei immune al charme e puoi rimandare l\'effetto al lanciatore.'],
      [14, 'Delirio Oscuro', 'Azione: affascini o spaventi una creatura immergendola in un\'illusione (1/riposo breve).']
    ],
    'warlock/immondo': [
      [1, 'Lista Ampliata degli Incantesimi', 'Il patrono aggiunge incantesimi alla tua lista (come Mani Brucianti e Comando).'],
      [1, 'Benedizione dell\'Oscuro', 'Quando riduci un nemico a 0 PF ottieni PF temporanei pari a mod. Carisma + livello da warlock.'],
      [6, 'Fortuna dell\'Oscuro', 'Aggiungi 1d10 a una prova di caratteristica o TS (1/riposo breve).'],
      [10, 'Resilienza Immonda', 'Dopo ogni riposo scegli un tipo di danno: hai resistenza (tranne magico o argento).'],
      [14, 'Scagliare all\'Inferno', 'Quando colpisci con un attacco con arma puoi mandare il bersaglio nei Nove Inferi fino alla fine del tuo prossimo turno; al ritorno subisce 10d10 danni psichici se non è un immondo (1/riposo lungo).']
    ],
    'warlock/antico': [
      [1, 'Lista Ampliata degli Incantesimi', 'Il patrono aggiunge incantesimi alla tua lista (come Risata Orrenda e Individuazione dei Pensieri).'],
      [1, 'Mente Risvegliata', 'Comunichi telepaticamente con una creatura entro 9 m che conosca almeno una lingua.'],
      [6, 'Interdizione Entropica', 'Reazione: imponi svantaggio a un attacco contro di te; se manca, hai vantaggio al tuo prossimo attacco contro quella creatura fino alla fine del tuo prossimo turno (1/riposo breve o lungo).'],
      [10, 'Scudo del Pensiero', 'I tuoi pensieri non si possono leggere con la telepatia o altri mezzi senza il tuo consenso; hai resistenza ai danni psichici e, quando ne subisci, l\'attaccante subisce lo stesso ammontare di danni psichici.'],
      [14, 'Creare Servitore', 'Azione: trasformi un umanoide incapacitato in un tuo servitore aberrante.']
    ]
  };
  /* Discipline Elementali del Monaco: [id, nome, livello richiesto, ki, descrizione] */
  D.DISC_MONACO = [
    ['cavalcare-vento', 'Cavalcare il Vento', 11, 4, 'Lanci Volare su te stesso.'],
    ['colpo-cenere', 'Colpo della Cenere Turbinante', 3, 2, 'Lanci Mani Brucianti.'],
    ['difesa-montagna', 'Difesa della Montagna Eterna', 17, 5, 'Lanci Pelle di Pietra su te stesso.'],
    ['fiamme-fenice', 'Fiamme della Fenice', 11, 4, 'Lanci Palla di Fuoco.'],
    ['fiume-fiamma', 'Fiume della Fiamma Famelica', 17, 5, 'Lanci Muro di Fuoco.'],
    ['forma-fiume', 'Forma del Fiume Fluente', 3, 1, 'Azione: scegli un\'area di acqua o ghiaccio (max 9 m per lato, entro 36 m) e trasformi acqua in ghiaccio o viceversa; puoi modellare il ghiaccio (cambi al massimo metà dell\'area), senza intrappolare o ferire creature.'],
    ['frusta-acqua', 'Frusta d\'Acqua', 3, 2, 'Azione: una creatura entro 9 m fa un TS su Destrezza; se fallisce subisce 3d10 contundenti (+1d10 per ogni ki extra) e la fai cadere prona o la tiri di 7,5 m verso di te; se lo supera, metà danni e nessun effetto.'],
    ['gong', 'Gong della Sommità', 6, 3, 'Lanci Frantumare.'],
    ['morsa-nord', 'Morsa del Vento del Nord', 6, 3, 'Lanci Blocca Persone.'],
    ['onda-terra', 'Onda della Terra Tumultuosa', 17, 6, 'Lanci Muro di Pietra.'],
    ['postura-nebbia', 'Postura della Nebbia', 11, 4, 'Lanci Forma Gassosa su te stesso.'],
    ['pugno-tuoni', 'Pugno dei Quattro Tuoni', 3, 2, 'Lanci Onda Tonante.'],
    ['pugno-aria', 'Pugno dell\'Aria Inviolabile', 3, 2, 'Azione: una creatura entro 9 m fa un TS su Forza; se fallisce subisce 3d10 contundenti (+1d10 per ogni ki extra), la spingi di 6 m e cade prona; se lo supera, metà danni e nessun effetto.'],
    ['soffio-inverno', 'Soffio dell\'Inverno', 17, 6, 'Lanci Cono di Freddo.'],
    ['spiriti-burrasca', 'Spiriti della Burrasca Impetuosa', 3, 2, 'Lanci Folata di Vento.'],
    ['zanne-serpente', 'Zanne del Serpente di Fuoco', 3, 1, 'Quando usi l\'azione Attacco: i pugni e i calci hanno +3 m di portata per quel turno e infliggono fuoco invece di contundenti; spendendo 1 ki quando un attacco colpisce, fa 1d10 fuoco extra.']
  ];
  D.discMonacoMax = (liv) => 1 + (liv >= 6) + (liv >= 11) + (liv >= 17);
  /* Manovre del Maestro di Battaglia: [id, nome, descrizione] (D = dado di superiorità) */
  D.MANOVRE = [
    ['adescante', 'Attacco Adescante', 'Dopo un colpo: +D ai danni; il bersaglio fa un TS su Saggezza o ha svantaggio ad attaccare chiunque altro fino alla fine del tuo prossimo turno.'],
    ['affondo', 'Attacco con Affondo', 'In un attacco in mischia: +1,5 m di portata; se colpisce, +D ai danni.'],
    ['finta', 'Attacco con Finta', 'Azione bonus: fingi contro una creatura entro 1,5 m; hai vantaggio al prossimo attacco contro di lei in questo turno e, se colpisce, +D ai danni.'],
    ['manovra', 'Attacco con Manovra', 'Dopo un colpo: +D ai danni; un alleato che ti vede o sente può usare la reazione per muoversi fino a metà velocità senza provocare attacchi di opportunità dal bersaglio.'],
    ['spazzata', 'Attacco con Spazzata', 'Dopo un colpo in mischia: un\'altra creatura entro 1,5 m dal bersaglio e alla tua portata subisce danni pari al dado (se il tiro per colpire la colpirebbe).'],
    ['spinta', 'Attacco con Spinta', 'Dopo un colpo: +D ai danni; se il bersaglio è Grande o più piccolo fa un TS su Forza o è spinto fino a 4,5 m.'],
    ['disarmante', 'Attacco Disarmante', 'Dopo un colpo: +D ai danni; il bersaglio fa un TS su Forza o lascia cadere un oggetto che scegli tu.'],
    ['minaccioso', 'Attacco Minaccioso', 'Dopo un colpo: +D ai danni; il bersaglio fa un TS su Saggezza o è spaventato fino alla fine del tuo prossimo turno.'],
    ['preciso', 'Attacco Preciso', 'Aggiungi D a un tuo tiro per colpire, prima o dopo averlo tirato (ma prima degli effetti).'],
    ['sbilanciante', 'Attacco Sbilanciante', 'Dopo un colpo: +D ai danni; se il bersaglio è Grande o più piccolo fa un TS su Forza o cade prono.'],
    ['comandante', 'Colpo del Comandante', 'Rinunci a un attacco e usi un\'azione bonus: un alleato che ti vede o sente usa la reazione per attaccare con +D ai danni.'],
    ['distraente', 'Colpo Distraente', 'Dopo un colpo: +D ai danni; il prossimo attacco di un altro contro il bersaglio ha vantaggio, se avviene prima del tuo prossimo turno.'],
    ['incoraggiamento', 'Incoraggiamento', 'Azione bonus: un alleato che ti vede o sente ottiene PF temporanei pari al dado + il tuo mod. Carisma.'],
    ['parata', 'Parata', 'Reazione quando una creatura ti ferisce con un attacco in mischia: riduci i danni del dado + il tuo mod. Destrezza.'],
    ['replica', 'Replica', 'Reazione quando una creatura ti manca in mischia: la attacchi in mischia e, se colpisci, aggiungi D ai danni.'],
    ['scarto', 'Scarto Elusivo', 'Quando ti muovi, tira il dado e aggiungi il risultato alla CA finché non smetti di muoverti.']
  ];
  D.manovreMax = (liv) => 3 + 2 * ((liv >= 7) + (liv >= 10) + (liv >= 15));
  D.TRATTI_SUB = T;
  D.CLASSI.forEach((c) => {
    if (!c.sottoclasse) return;
    c.sottoclasse.opzioni.forEach((o) => {
      const k = c.id + '/' + o.id;
      if (T[k]) o.tratti = T[k];
    });
  });
})(typeof window !== 'undefined' ? window : globalThis);
