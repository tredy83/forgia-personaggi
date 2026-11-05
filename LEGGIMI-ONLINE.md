# La Forgia degli Eroi – messa online con accesso riservato

L'app resta un sito statico (si pubblica su GitHub Pages), ma i personaggi non stanno più nel browser: sono salvati su **Firebase** (gratuito per questi volumi) e si vedono solo dopo il login.

- **Gestori**: vedono, modificano ed eliminano i personaggi di tutti, e creano gli accessi dei genitori.
- **Genitori**: vedono, modificano ed eliminano solo i personaggi che hanno creato loro.

Finché `firebase-config.js` contiene `null`, l'app funziona come prima, in modalità locale e senza login.

## 1. Crea il progetto Firebase (una volta sola)

1. Vai su <https://console.firebase.google.com> → **Aggiungi progetto** (es. `forgia-argini`). Google Analytics non serve.
2. **Build → Authentication → Inizia → Email/Password** → abilita il primo interruttore (non quello "link via email") → Salva.
3. **Build → Firestore Database → Crea database** → sede `eur3 (europe-west)` → *modalità di produzione*.
4. Nella scheda **Regole** di Firestore cancella tutto, incolla il contenuto del file `firestore.rules` e premi **Pubblica**.
5. **Impostazioni progetto (ingranaggio) → Le tue app → icona Web `</>`** → registra l'app (senza Hosting). Copia l'oggetto `firebaseConfig` e incollalo in `firebase-config.js` al posto di `null`:
   `window.FIREBASE_CONFIG = { apiKey: "...", authDomain: "...", projectId: "...", ... };`
   (Non sono segreti: la sicurezza sta nelle regole del punto 4.)

## 2. Crea il primo gestore (tu)

1. **Authentication → Utenti → Aggiungi utente**: email `redy@forgia.argini` (lo username è la parte prima della chiocciola; puoi scegliere un altro nome) e una password. Copia lo **UID** che compare accanto all'utente.
2. **Firestore Database → Avvia raccolta** → ID raccolta `utenti` → ID documento: incolla lo UID. Aggiungi i campi:
   - `nome` (stringa): `Redy Tieghi`
   - `username` (stringa): `redy`
   - `ruolo` (stringa): `gestore`
   - `attivo` (booleano): `true`
3. Da qui in poi gli altri account (altri gestori, genitori) li crei **dall'app**: pulsante **Accessi → Nuovo accesso**, scegliendo il ruolo **Gestore**. Ogni amministratore ha il suo username e la sua password (e può cambiarla dal proprio profilo). Finché l'app è solo per gli amministratori non creare accessi con ruolo *Genitore*.

## 3. Pubblica su GitHub Pages

1. Crea un repository (es. `forgia-personaggi`), carica **tutti i file di questa cartella** (compreso `firebase-config.js` già compilato), poi **Settings → Pages → Branch: main / root**.
2. L'indirizzo sarà `https://tredy83.github.io/forgia-personaggi/`.
3. In Firebase: **Authentication → Impostazioni → Domini autorizzati** → aggiungi `tredy83.github.io`.

## 4. Consigli di sicurezza

- Nella **Google Cloud Console → API e servizi → Credenziali**, limita la *chiave API* del browser ai referrer `https://tredy83.github.io/*`.
- Il **sito** (cioè il codice con i testi degli incantesimi) è pubblico per chi conosce l'indirizzo: sono protetti solo i **personaggi** e gli **account**. Chiunque potrebbe registrare un account Firebase con la chiave, ma senza il documento in `utenti` creato da un gestore non può leggere né scrivere nulla (lo garantiscono le regole).
- Lo username "mario.rossi" diventa internamente `mario.rossi@forgia.argini` (indirizzo finto). Per chi usa un indirizzo email vero come username è disponibile «Password dimenticata» tramite il pulsante *Invia reset password* nella pagina Accessi.
- Se un genitore dimentica la password e non ha email: **Authentication → Utenti → ⋮ → Reimposta password** nella console, oppure disattiva l'accesso e creane uno nuovo.
- Per sicurezza i dati dell'archivio locale di un account vengono cancellati dal dispositivo quando si preme **Esci**.


## 5. Bestiario del DM (solo gestori)

Il pulsante **Bestiario** (nella barra in alto, visibile solo ai gestori) apre il bestiario: ricerca per nome, filtri per tipo/taglia/grado di sfida, scheda completa del mostro, **carte da stampare** (fronte = statistiche, retro = immagine per i ragazzi) e **liste d'avventura** (scegli i mostri di un'avventura e stampa tutte le carte in un colpo solo). Il formato della carta (piccola 63×88, media 95×135, grande 190×135, foglio intero) viene scelto in automatico in base alla quantità di testo.

**Prima messa in funzione**
1. In Firebase → Firestore → **Regole** incolla di nuovo il contenuto aggiornato di `firestore.rules` (ci sono le regole per `mostri`, `mostriImg`, `mostriMeta`, `avventure`: tutte leggibili e scrivibili solo dai gestori) e premi **Pubblica**.
2. Accedi come gestore → **Bestiario → Dati e immagini → Importa mostri** e scegli il file `mostri-manuale-dei-mostri.json` (si consegna a parte: **non va caricato su GitHub**, così i testi del manuale non diventano pubblici). L'importazione scrive circa 11 blocchi di documenti in Firestore, una volta sola.
   Poi importa nello stesso modo `mostri-mordenkainen-multiverso.json` (*Mordenkainen presenta: Mostri del Multiverso*, 261 schede, circa 7 blocchi): l'importazione è **additiva**, i mostri già presenti e le avventure restano. Ogni scheda mostra manuale e pagina (carta piccola: «Man. Mostri · p. 168», le altre il titolo intero), e in Cerca c'è il filtro «Ogni manuale». Importare di nuovo lo stesso file aggiorna solo quei mostri.
   Nella scheda di un mostro che lancia incantesimi compare un avviso giallo «🔮 Questo mostro lancia incantesimi»: cliccandolo si stampano le sue carte incantesimo semplici (bianco e nero, 9 per foglio, senza retro, ritagliabili). Gli incantesimi sono riconosciuti dal testo del mostro: se uno non è tra quelli del programma, l'avviso lo elenca sotto («Non trovati…»).
3. **Carica immagine** (per singolo mostro) oppure **Carica più immagini**: il nome del file deve assomigliare al nome del mostro (es. `goblin.jpg`, `drago-rosso-antico.png`). Le immagini vengono ridotte nel browser (max 800 px) e salvate in Firestore, visibili solo ai gestori. Senza immagine la carta si può stampare comunque (retro con logo, bianco o nessun retro).
4. **Elenco senza immagine** dà la lista dei mostri ancora privi di figura, con il link di ricerca immagini per ciascuno.

**Attenzione**: le illustrazioni trovate in rete sono coperte da diritti d'autore. Vanno bene per l'uso privato in sala; non pubblicarle in un repository pubblico.

**Modalità locale** (senza Firebase): dati e immagini restano nel browser (IndexedDB) di quel dispositivo.

**Avventure e immagini**: nella scheda Cerca, sopra l'elenco, trovi le intestazioni «Selezionare per stampare» (caselle) e «Selezionare per aggiungere ad avventura» (＋). Dopo aver messo ＋ ai mostri premi **Avanti**: il sito chiede se creare una nuova avventura o aggiungere a una esistente (menu a tendina). I nomi delle avventure devono essere tutti diversi.

**Testi dei mostri**: vengono dalla lettura automatica (OCR) dei PDF, quindi possono contenere piccoli refusi; le cifre stampate in modo anomalo sul manuale sono state mantenute come stampate.

## 6. Campagna e Party Tracker (solo gestori)

- **Campagna**: nella scheda *Identità* di ogni personaggio c'è il campo facoltativo «Campagna». Mentre scrivi propone le campagne già esistenti (basta la «D» per vedere «Discesa nell'Avernus»); se non la compili resta vuoto. Nell'elenco personaggi c'è la colonna Campagna e la ricerca la considera.
- **Party Tracker** (pulsante nella barra dell'elenco): cerchi per campagna, nome del PG o nome del giocatore, selezioni i personaggi (o «Seleziona tutti quelli in elenco») e il foglio si compila da solo: livello, CA, PF, percezione passiva, attacchi e un unico riquadro **Note** (scurovisione, velocità, iniziativa, tiri salvezza, stile di combattimento, incantesimi con CD, risorse, privilegi e tratti utili al gioco; niente lingue).
- Le note di ogni PG si possono riscrivere (✎ Note) e si salvano sul personaggio; «Ripristina il testo automatico» le rigenera. Le note del gruppo (riquadro in alto) si ricordano solo su questo dispositivo.
- **Apri** e **⬆ Livello** portano alla scheda del PG e «← Personaggi» riporta al Party Tracker.
- Il foglio usa come fondo il party tracker cartaceo fornito dal DM (`party-sfondo.svg`, 8 PG per foglio) e ci scrive sopra i dati. Il nome della campagna compare in grande nel riquadro «Party notes».
- Stampa: A4 orizzontale, 8 PG per foglio; margini «nessuno» e «Grafica di sfondo» attiva.
- Nessuna modifica alle regole Firestore: il campo `campagna` viaggia nel documento del personaggio.

## 7. Incontri e iniziativa (solo gestori)

Sezione a parte, pulsante **Incontri** (accanto a Bestiario). Flusso: crei l'avventura e scegli i suoi mostri con ＋ (solo quali, senza quantità; premendo ✔ lo togli) → in Incontri scegli l'avventura, crei un incontro (nome unico, note libere) → spunti i mostri (in ordine alfabetico) che partecipano e indichi **quanti** sono in quell'incontro: entrano nella griglia con l'iniziativa già tirata (d20 + Destrezza, un solo tiro per tipo) → stampi la **griglia A4** (iniziativa fissa da 20 a −5, mostri già nella loro riga, righe vuote per i personaggi) e le **carte dei mostri** dell'incontro. Gli incontri sono salvati dentro l'avventura.

Nel **Bestiario → Cerca** puoi anche spuntare dei mostri e stampare direttamente le loro carte, senza avventura.

## Cosa NON è stato provato

Il collegamento reale a Firebase non si può provare senza il tuo progetto: la logica dell'app è stata verificata con un Firebase simulato, il Bestiario con Firestore vero non è ancora stato provato; le regole di sicurezza vanno provate con tre accessi di prova (gestore, genitore A, genitore B): il genitore B non deve vedere i personaggi del genitore A.

**Menu e Home**: in alto, al centro, le sezioni Personaggi · Party Tracker · Bestiario · Avventure · Incontri; a destra utente, Profilo, Account, Esci. Dopo il login si apre la Home «Che cosa vuoi fare?» (cliccando il logo ci torni).
