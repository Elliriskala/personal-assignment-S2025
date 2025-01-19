# Web-sovellus: TravelTime!

## Kuvaus:

### Web-sovellus, jossa käyttäjät voivat jakaa matkakokemuksiaan, valokuvia ja tarinoita ympäri maailmaa. Sovellus toimii eräänlaisena **matkapäiväkirjana**, jossa käyttäjät voivat tallentaa muistoja, löytää inspiraatiota muilta matkaajilta sekä jakaa omia vinkkejään ja suosituksiaan eri matkakohteista. Sen avulla luodaan yhteisö, jossa matkailijat voivat **opastaa** ja **inspiroida** toisiaan, sekä löytää **piilotettuja helmiä** eri puolilta maailmaa.

### Matkustaminen ei ole vain määränpää, vaan koko matka — TravelTime auttaa tallentamaan nämä hetket ja jakamaan ne muiden kanssa.

## Keskeiset ominaisuudet ja toiminnot:

1. **Profiilitoiminto ja yhteisö:**

   - Käyttäjät voivat **luoda henkilökohtaisen profiilin**, johon he voivat lisätä matkakuvia, tarinoita ja matkasuosituksia.
   - Käyttäjät voivat **seurata** toisten matkailijoiden profiileja ja nähdä heidän matkapostauksensa.
   - **Tykkäykset ja kommentointi:** Käyttäjät voivat tykkäyksillä **tallentaa** suosikkikohteita, **kommentoida** muiden julkaisuja ja keskustella matkakohteista.

2. **Matkakokemuksen lisääminen:**

   - Käyttäjät voivat lisätä **matkakuvia, kohteen sijainnin sekä kuvauksen matkasta** (esim. vinkkejä, parhaita muistoja, aktiviteetteja ja suosikkipaikkoja tms.).
   - **Geolokaatio ja kartta**: Sovellus käyttää geotunnistamista, jolloin matkakuvat saavat tarkat sijainnit, jotka näkyvät interaktiivisella kartalla esim. Google Mapsin tai Leaflet.js:n avulla.

3. **Hakutoiminto:**

   - Käyttäjät voivat etsiä **matkakuvia ja -tarinoita** eri kriteerien mukaan, kuten **maan, kaupungin tai aihetunnisteen** perusteella (esim. "kaupunkilomat", "seikkailumatkat", "rantalomat").
   - Etusivulla näkyy **suosituimmat julkaisut ja uudet postaukset**, jotka auttavat käyttäjiä löytämään inspiroivia kohteita.

4. **Yhteisöllisyys ja vuorovaikutus**:

   - **Kommentointi ja palautteen jättäminen**: Käyttäjät voivat keskustella ja jättää palautetta muiden matkapostauksiin, jakaa kokemuksia ja vinkkejä.
   - **Suosikkipaikat**: Käyttäjät voivat tallentaa ja jakaa omia suosikkipaikkojaan.

5. **Turvallisuus ja yksityisyys:**
   - Käyttäjillä on **mahdollisuus poistaa omia** matkakokemuksiaan, kuviaan, kommenttejaan ja tykkäyksiään.
   - Kommenttien hallinta: Projektin luoja voi poistaa epäsoveliaita tai loukkaavia kommentteja omista julkaisuistaan.

## Tekniset vaatimukset:

- **Frontend**: 
    - React + TypeScript + Tailwind CSS 
    - Käyttöliittymä: Responsiivinen ja visuaalisesti miellyttävä käyttöliittymä, joka mahdollistaa helpon selaamisen ja kuvien katselun mobiililaitteilla ja työpöytäkoneilla.

- **Backend**: 
    - Node.js (Express) + TypeScript
    - API: RESTful-arkkitehtuuri, joka takaa joustavan ja skaalautuvan palvelinpuolen logiikan.

- **Tietokanta**: 
    - MySQL: Tietokannan avulla käyttäjien, matkakokemusten, kuvien, tykkäyksien ja kommenttien hallinta.

- **Geolokaatio ja kartta**:
    - Google Maps API tai Leaflet.js kartan ja geolokaatio-ominaisuuksien tukemiseksi paikkojen sijainnin näyttämiseen.

- **Autentikointi ja tietosuoja**: 
    - **JWT**-pohjainen käyttäjien kirjautuminen ja rekisteröinti.
 
- **Versiohallinta**:
    - GitHub, lähdekoodi dokumentoitu ja kommentoitu.
