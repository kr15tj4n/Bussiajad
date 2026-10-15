<h1 align="center">
  <img src="icon-192.png" alt="Bussiajad Logo" width="96" height="96"><br>
  Bussiajad
</h1>

Veebirakendus, mis kuvab Tallinna busside nr **8** ja **8A** reaalajas väljumisajad peatusest **Oblika tee** mõlemas sõidusuunas (**Pirita** ja **Äigrumäe**).

---

## Peamised funktsioonid

- **Suuna valik (Pirita & Äigrumäe):** Päises asuv rippmenüü võimaldab mugavalt vahetada peatuse suunda:
  - **Pirita**: suunaga Väike-Õismäe / Viru keskus.
  - **Äigrumäe**: suunaga Äigrumäe.
- **Reaalajas väljumised (kuni 3 väljumist):** Kuvab kuni 3 järgmise bussi saabumiskellaajad (`HH:MM`), järelejäänud aja ("Nüüd" või "X min") ning graafikuhälbe nii koond- kui ka liinipõhises vaates.
- **Dünaamiline sihtkoha info:** Peatuse nime all kuvatakse aktiivse liinifiltri ja suuna sihtkoht.
- **Liikuma hakkamise meeldetuletus:** Jaluses olevast lülitist sisselülitatav teavitus:
  - Oranžikas toonis `Hakka liikuma HH:MM` (4 minutit enne bussi väljumist).
  - Punakas hoiatus `Oota järgmist bussi`, kui peatusesse kõndimiseks aega napib (alla 4 minuti).
- **Liinifilter:** Vahelehed liinide vahel valimiseks (`Liinid 8 & 8A`, `Liin 8`, `Liin 8A`), toetades ka otseteed URL-i parameetriga.
- **Automaatne uuendus ja loendur:** Andmed uuenevad automaatselt iga 15 sekundi järel; jaluses kuvatakse viimase uuenduse kellaaega (`HH:MM:SS`) ja sekundiloenduriga käsitsi värskenduse nuppu.
- **Graafikupõhine info:** Näitab bussi prognoositavat saabumisaega, hilinemist/ennatlikkust ja läbikriipsutatud plaanilist aega.
- **Silmasõbralik tume disain:** Kaasaegne klaasjas tume välimus (Glassmorphism), optimeeritud nii nutitelefonidele kui ka seinaekraanidele ja infotahvlitele.
- **PWA (Progressive Web App) tugi:** Paigaldatav rakendusena koduekraanile või arvutisse (võrguühenduseta kest, koduekraani otseteed, automaatne vahemälu).
- **Reaalajas kaardijälgimine:** Otseteed ja kaardinupud busside asukoha reaalajas jälgimiseks kaardil vastavalt valitud sõidusuunale.
- **Otseteed sõiduplaanidele:** Jaluses olevad kiirlingid valitud suuna ametlikele sõiduplaanidele (`8 · 8A`).

---

## Andmeallikas

Rakendus kuvab reaalaja andmeid otse Tallinna Transpordiameti ametlikust SIRI andmevoost (`transport.tallinn.ee`).

