<h1 align="center">
  <img src="icon-192.png" alt="Bussiajad Logo" width="96" height="96"><br>
  Bussiajad
</h1>

Veebirakendus, mis kuvab Tallinna busside nr **8**, **8A** ja **48** reaalajas väljumisajad peatusest **Oblika tee** mõlemas sõidusuunas (**Pirita** ja **Äigrumäe**).

---

## Peamised funktsioonid

- **Suuna valik (`Pirita` & `Äigrumäe`):** Päises asuv rippmenüü võimaldab mugavalt vahetada peatuse sõidusuunda:
  - **Pirita**: suunaga Väike-Õismäe (liin 8), Viru keskus (liin 8A) ja Pirita keskus (liin 48).
  - **Äigrumäe**: suunaga Äigrumäe (liinid 8 ja 8A) ja Vesse (liin 48).
- **Reaalajas väljumised (kuni 3 väljumist):** Kuvab kuni 3 järgmise bussi saabumiskellaajad (`HH:MM`), järelejäänud aja ("Nüüd" või "X min") ning graafikuhälbe nii koond- kui ka liinipõhises vaates.
- **Dünaamiline sihtkoha info:** Peatuse nime all kuvatakse aktiivse liinifiltri ja suuna sihtkoht (nt `> Väike-Õismäe`, `> Viru keskus`, `> Pirita keskus` või `> Vesse`), mis pikema teksti korral skrollib sujuvalt.
- **Liikuma hakkamise meeldetuletus:** Jaluses olevast lülitist sisselülitatav teavitus:
  - Oranžikas toonis `Hakka liikuma HH:MM` (4 minutit enne bussi väljumist).
  - Punakas hoiatus `Oota järgmist bussi`, kui peatusesse kõndimiseks aega napib (alla 4 minuti).
- **Liinifilter:** Vahelehed liinide vahel valimiseks (`Kõik liinid`, `Liin 8`, `Liin 8A`, `Liin 48`), toetades ka otseteed URL-i parameetriga (`?filter=8`, `?filter=8A`, `?filter=48`).
- **Automaatne uuendus ja loendur:** Andmed uuenevad automaatselt iga 15 sekundi järel; jaluses kuvatakse viimase uuenduse kellaaega (`HH:MM:SS`) ja sekundiloenduriga käsitsi värskenduse nuppu.
- **Graafikupõhine info:** Näitab bussi prognoositavat saabumisaega, hilinemist/ennatlikkust ja läbikriipsutatud plaanilist aega.
- **Google Material Design 3 (M3) tume disain:** Kaasaegne Material You tonaalsete pindadega tume välimus ühtse liiniaktsendiga, optimeeritud nii nutitelefonidele kui ka seinaekraanidele ja infotahvlitele.
- **PWA (Progressive Web App) tugi:** Paigaldatav rakendusena koduekraanile või arvutisse (võrguühenduseta kest, koduekraani otseteed, automaatne vahemälu).
- **Reaalajas kaardijälgimine:** Otseteed ja kaardinupud busside asukoha reaalajas jälgimiseks kaardil vastavalt valitud sõidusuunale.
- **Otseteed sõiduplaanidele:** Jaluses olevad kiirlingid valitud suuna ametlikele sõiduplaanidele (`8 · 8A · 48`).

---

## Andmeallikas

Rakendus kuvab reaalaja andmeid otse Tallinna Transpordiameti ametlikust SIRI andmevoost (`transport.tallinn.ee`).

