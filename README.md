# Green Oasis Gabella — anteprima di sito

Anteprima **non ufficiale** di un sito per il Green Oasis Gabella (Suio Terme, Castelforte LT), proposta di Antonio Simeone, novembre 2026.
Pubblicata su GitHub Pages: https://totosimeone-svg.github.io/green-oasis-gabella/ (con `noindex`: non è il sito ufficiale e non va indicizzata).

## Che cos'è

Una pagina sola, «Una giornata all'Oasi»: scorrendo, la luce della pagina passa dal mattino alla notte (colori di fondo, bagliori, sole e luna,
un orologio da 08:00 a 23:00) attraverso quattro capitoli con foto a tutto schermo. Seguono alloggi, momenti, famiglia, voci degli ospiti,
il luogo, come arrivare, info utili e contatti. Niente framework, niente build, niente cookie, niente analytics, niente moduli.

- `index.html` — la pagina (testi, struttura, Open Graph, schema.org `BedAndBreakfast`).
- `assets/css/style.css` — stile e movimento (`@property` + `animation-timeline: scroll()/view()`; fasi statiche per `prefers-reduced-motion` e senza JavaScript).
- `assets/js/main.js` — orologio, cambio foto nei capitoli, comparse, parallasse al mouse; se il browser non ha le animazioni legate allo scroll, interpola lui le variabili (IntersectionObserver + requestAnimationFrame).
- `assets/img/` — foto in WebP a 640/1080/1600/2400 px (`srcset`), `favicon.svg`, `apple-touch-icon.png`, `og.jpg` (1200×630 per l'anteprima su WhatsApp).

## Come si aggiorna

1. Modificare `index.html`, il CSS o il JS (tutto in italiano, percorsi relativi).
2. `git commit` con messaggio in italiano, poi `git push origin main`: GitHub Pages ricompila in meno di un minuto.
3. Controllare con `curl -sI https://totosimeone-svg.github.io/green-oasis-gabella/` e con `tidy -q -e index.html`.

Per rifare le immagini partendo dagli originali (che **non** sono nel repo): Pillow, ridimensionamento LANCZOS, WebP qualità 80 (`method=6`),
larghezze 640/1080/1600/2400 senza mai ingrandire; le foto `10` e `11` sono ritagliate in 4:3.

## Fonti dei dati

Ogni dato della pagina viene dal dossier `../ricerca/DOSSIER.md` (ricerca del 12/11/2026 su Google Maps, Booking, Facebook, Instagram, TikTok,
Comune di Castelforte, Telegolfo, italia.it, visure). Voti, distanze e regole sono quelli rilevati quel giorno: vanno riletti prima di ogni uso.
Le citazioni degli ospiti sono testuali, con nome puntato, piattaforma e periodo come nel dossier. Non ci sono prezzi, orari della piscina,
capienze per gli eventi o altre informazioni non trovate.

## Foto usate e provenienza

Tutte dalla scheda Google Maps della struttura, sezione «Foto › Dal proprietario» (vedi `../foto/FONTI.md` con gli URL d'origine).
Le `01`–`08` sono del servizio fotografico professionale del 2023; le altre sono foto del proprietario 2020–2024.

| Foto | Dove è usata |
|---|---|
| `01` piscina di notte | capitolo Notte; immagine Open Graph |
| `02` piscina di notte, palme | convertita, non ancora in pagina |
| `03` prato con le luci sospese | capitolo Sera; scheda «Eventi e feste» |
| `04` gazebo-bar di giorno | capitolo Mattina |
| `05` gazebo, palme e monti | apertura (hero) |
| `06` cocktail con vista piscina | capitolo Pomeriggio |
| `07` aperitivo a bordo piscina | capitolo Pomeriggio; scheda «La cena dello chef Domenico» |
| `08` gazebo di sera | capitolo Sera |
| `10`, `11` interno dello chalet | scheda Chalet Superior (ritagliate in 4:3) |
| `12` chalet di notte | capitolo Notte; scheda Chalet Superior |
| `13` idromassaggio con luci rosa | capitolo Notte; scheda «Notte romantica» |
| `14`, `15`, `16` idromassaggi con luci | convertite, non ancora in pagina |
| `17` suite con luce viola | convertita, non ancora in pagina (1024 px) |
| `18` Suite Deluxe | scheda Suite Deluxe (1024 px) |
| `19` esterno dello chalet | scheda Chalet Superior (1024 px) |
| `20` camera con i cigni di asciugamani | sezione La famiglia |
| `21`, `22`, `23` forno a legna, bagno, camera in pietra | convertite, non ancora in pagina |

Mai usate: `09` e `24` (volti riconoscibili, servirebbe una liberatoria) e `25`–`29` (foto di visitatori, diritti loro).

## Cosa manca per il sito vero

- **Prenotazione diretta**: oggi ogni «Prenota» porta a Booking; serve un motore con disponibilità e prezzi.
- **Versione inglese** (circa il 19% delle recensioni Booking non è in italiano).
- **Foto delle camere mancanti**: Junior Suite Familiare e Monolocale non hanno foto certe; Suite Deluxe solo a 1024 px. Chiedere gli originali del servizio 2023, il logo vettoriale e i video.
- **Liberatorie e crediti**: nome del fotografo e licenza d'uso delle foto; liberatorie per le persone riconoscibili.
- **Menù, orari e prezzi del ristorante**, se il ristorante è aperto agli esterni, prezzi di massaggi ed extra, capienza per gli eventi.
- **Dati da confermare con la famiglia**: che il numero 340 962 9050 sia su WhatsApp; i metri quadri dello Chalet (fonti discordanti: 34 o 45); l'ultimo tratto di strada e un video del percorso.
- **Dominio proprio**, correzione del campo «sito web» della scheda Google (oggi punta a un affiliato) e rimozione del `noindex` quando il sito diventa ufficiale.
