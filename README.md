# Web-sovellus: ReCraft/GreenCraft/Craftify

### Sovellus, jossa käyttäjät voivat löytää inspiraatiota sekä jakaa kierrätysmateriaaleista tehtäviä DIY-projekteja, uusiokäyttö- ja askarteluideoita. Se on suunnattu erityisesti ekologisesta elämäntyylistä kiinnostuneille askartelun ystäville, jotka haluavat hyödyntää jätteitä luovasti ja innovatiivisesti. Sovellus toimii myös inspiraation lähteenä esimerkiksi koulujen kuvataidetunneille ja askarteluprojekteihin, edistäen kestävää kehitystä ja luovuutta.

## Keskeiset ominaisuudet ja toiminnot: 

1. **Profiilitoiminto ja yhteisö:**
    - Käyttäjät voivat halutessaan **luoda profiilin**, jonka avulla voi helposti tykkäyksillä **tallentaa** omia suosikkeja **kommentoida** muiden julkaisuja sekä **seurata** toisten käyttäjien profiileja.
    - Profiilin luoneet käyttäjät voivat **lisätä** myös omia **projekteja sekä ideoita**.

2. **Projektin/idean lisääminen:**
    - Käyttäjä voi lisätä **projektin otsikon, kuvan, tarvittavat materiaalit ja vaiheittaiset ohjeet**. Projektiin voi lisätä **kategorian** ja **"tageja"**, esim. käyttötarkoituksen tai aihealueen mukaan ("kierrätys", "askartelu lapsille", "puukäsityöt", "ompelu")
    - Toisten käyttäjien on mahdollista tykätä ja kommentoida julkaisuja sekä kysyä tarvittaessa lisä ohjeita projektin kehittäjältä.

3. **Hakutoiminto:**
    - Käyttäjien on mahdollista **hakea** erilaisia **projekteja** ja **ideoita** esimerkiksi materiaalin, vaikeustason tai käyttötarkoituksen perusteella.

4. **Tykkäykset, kommentointi, sekä yhteisöllisyys**:
    - Käyttäjät voivat **kommentoida** sekä **jättää palautetta** projektiin. Kommenttikentässä voi myös **kysyä lisäohjeita sekä vinkkejä**. 

5. **Suosituimpien ja uusimpien projektien listaus:**
    - Etusivulla näkyvät esim. tykätyimmät, ajankohtaisimmat ja uusimmat projektit. Tämä antaa käyttäjille heti inspiraatiota ja tuo esille aktiivista yhteisön toimintaa.

6. **Turvallisuus:**
    - Käyttäjillä on **mahdollisuus poistaa omia** projektejaan, tykkäyksiään ja kommenttejaan.
    - Projektin luoja voi myös poistaa omasta julkaisustaan epäsoveliaita tai loukkaavia kommentteja.

## Tekniset vaatimukset: 

- **Frontend**: React + TypeScript + Tailwind CSS, responsiivinen käyttöliittymä, joka toimii myös mobiilissa.
- **Backend**: Node.js (Express) + TypeScript, RESTful-arkkitehtuuri.
- **Tietokanta**: MySQL, käyttäjien, projektien, materiaalien, kuvien, tykkäyksien sekä kommenttien tallentamiseen.
- **Autentikointi ja tietosuoja**: Käyttäjien kirjautumisen ja rekisteröitymisen varmistaminen (esim. JWT) luo luottamusta ja turvallisuutta.
- **Kuvien tallennus ja optimointi:** Sovellus tukee kuvien optimointia nopean latausajan takaamiseksi.
- **Versiohallinta**: Git ja GitHub, lähdekoodi dokumentoitu ja kommentoitu.

