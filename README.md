# Bussiajad 🚌

Tallinna bussi nr **8** reaalaja väljumiste kiirvaade peatusest **Oblika tee** (suund Väike-Õismäe).

Rakendus kasutab `transport.tallinn.ee` ametlikku SIRI reaalaja andmevoogu ning uuendab väljumisaegu ja saabumisloendurit automaatselt iga 15 sekundi järel.

---

## Omadused
- **Reaalajas väljumised:** Järgmise kahe bussi saabumisajad (kellaaeg `HH:MM` ja loendur `X min pärast`).
- **Automaatne uuendus:** Taustapäringud iga 15 sekundi järel ilma lehte värskendamata.
- **Graafikuhälvete kuvamine:** Näitab hilinemist või enneaegsust võrreldes ametliku sõiduplaaniga.
- **Modernne Dark-mode disain:** Kohandatud Tailwind CSS klaasjas (glassmorphism) disain, mis sobib nii nutitelefoni kui ka seinaekraanile.
- **Vigade ja öise aja käsitlemine:** Puhas teade, kui liin parajasti ei sõida või ühendus puudub.

---

## Käivitamine

### 1. Nõuded
- Python 3.10+
- Flask ja Requests (virtualenv on juba seadistatud kaustas `.venv`)

### 2. Rakenduse käivitamine
```bash
# Virtuaalkeskkonna abil käivitamine:
.venv/bin/python3 app.py
```
või tavalise pythoniga:
```bash
python3 app.py
```

### 3. Ava veebibrauseris
Ava brauser aadressil:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## GitHub Pages / Staatiline versioon (`bussiajad.html`)

Rakendus töötab ka **täiesti ilma Pythoni ja backendita**, kuna `transport.tallinn.ee` toetab otse CORS päringuid brauserist (`Access-Control-Allow-Origin: *`).

- Fail [bussiajad.html](file:///home/kristjan/Scripts/Bussiajad/bussiajad.html) sisaldab kõike ühes failis (HTML, Tailwind CSS, JavaScript).
- **GitHub Pages seadistus:**
  - Nimeta fail `index.html`-iks repositooriumi juurkaustas või kopeeri `bussiajad.html`.
  - Luba GitHub repos Settings -> Pages all GitHub Pages (haru `main`).
  - Leht töötab automaatselt veebis ilma ühegi serverita!

---

## API Lõpp-punktid (Flaski versioonis)- `GET /`: Veebiliidese avaleht
- `GET /api/departures`: Tagastab JSON formaadis reaalaja väljumiste andmed:
  ```json
  {
    "success": true,
    "updated_at": "14:02:15",
    "departures": [
      {
        "time": "14:08",
        "scheduled_time": "14:08",
        "destination": "Väike-Õismäe",
        "remaining_seconds": 350,
        "remaining_minutes": 6,
        "remaining_text": "6 min pärast",
        "is_realtime": true,
        "delay_minutes": 0,
        "delay_text": "Graafikus"
      }
    ]
  }
  ```
