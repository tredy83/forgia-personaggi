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

## Cosa NON è stato provato

Il collegamento reale a Firebase non si può provare senza il tuo progetto: la logica dell'app è stata verificata con un Firebase simulato, e le regole di sicurezza vanno provate con tre accessi di prova (gestore, genitore A, genitore B): il genitore B non deve vedere i personaggi del genitore A.
