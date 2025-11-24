# Zinsontledingstrainer

De **Zinsontledingstrainer** is een interactieve, educatieve webapplicatie waarmee leerlingen het ontleden van zinnen kunnen oefenen. De applicatie is didactisch opgebouwd en ondersteunt het splitsen van zinnen in zinsdelen (chunking) gevolgd door het benoemen ervan.

## Functionaliteiten

### Het Oefenproces
De app hanteert een **twee-stappen** didactiek:
1.  **Stap 1: Verdelen**: De leerling klikt tussen de woorden om de zin in de juiste zinsdelen te knippen.
2.  **Stap 2: Benoemen**: De leerling sleept de juiste termen (zoals Persoonsvorm, Onderwerp, Lijdend Voorwerp) naar de gemaakte zinsdelen.

### Oefenmodi
*   **Vrij oefenen**: De leerling kan specifiek één zin uit de lijst kiezen om te oefenen.
*   **Oefensessie**: De leerling start een sessie met een zelfgekozen aantal zinnen (bijv. 10 willekeurige zinnen). Aan het einde volgt een resultatenscherm met een percentuele score en een foutenanalyse.

### Instellingen & Differentiatie
Op het startscherm kan de training op maat worden gemaakt:
*   **Moeilijkheidsgraad**: Filter zinnen op niveau (Basis, Middel, Hoog).
*   **Type Gezegde**: Oefen alleen met Werkwoordelijk Gezegde (WG), Naamwoordelijk Gezegde (NG), of allebei.
*   **Optionele onderdelen**: De volgende onderdelen kunnen aan/uit worden gezet:
    *   *Bijstelling*
    *   *Bijvoeglijke Bepaling* (benoemen op woordniveau binnen een zinsdeel)
    *   *Voorzetselvoorwerp*

### Feedback
De applicatie geeft directe feedback na het controleren:
*   Zijn de zinsdelen correct geknipt?
*   Zijn de juiste namen aan de zinsdelen gegeven?
*   Zijn eventuele sub-rollen (zoals bijvoeglijke bepalingen) correct geplaatst?
*   De knop "Toon antwoord" laat de volledige uitwerking zien (dit levert 0 punten op in een sessie).

## Installatie & Gebruik Lokaal

1.  Installeer dependencies:
    ```bash
    npm install
    ```
2.  Start de development server:
    ```bash
    npm run dev
    ```
3.  Open de lokale link (meestal `http://localhost:5173`).

## Deployment op GitHub Pages

Deze app gebruikt **Vite** en **TypeScript**. Webbrowsers kunnen dit niet direct lezen. Je moet de app eerst **bouwen** en dan de `dist` map publiceren.

**Methode 1: Automatisch (Aanbevolen)**
1.  Zorg dat je git repo gekoppeld is.
2.  Draai het commando:
    ```bash
    npm run deploy
    ```
3.  Dit bouwt de app en pusht de `dist` folder naar een `gh-pages` branch.
4.  Ga in GitHub naar **Settings > Pages** en zet 'Source' op de `gh-pages` branch.

**Methode 2: Handmatig**
1.  Bouw de app:
    ```bash
    npm run build
    ```
2.  Er verschijnt een `dist` map.
3.  Upload **alleen de inhoud van de `dist` map** naar je webhosting of GitHub Pages root.

## Bestandsstructuur

*   **`index.html`**: De entrypoint voor Vite (verwijst naar `index.tsx`).
*   **`App.tsx`**: De hoofdcomponent met navigatie, state en logica.
*   **`constants.ts`**: De database met zinnen (`SENTENCES`) en rollen (`ROLES`).
*   **`types.ts`**: TypeScript definities.
*   **`components/`**: UI componenten (`DropZone`, `WordChip`).

## Toekomstvisie: Samengestelde Zinnen

Om in de toekomst samengestelde zinnen (hoofd- en bijzinnen) te ondersteunen, moet de datastructuur worden aangepast.

**Architectuurplan:**
De structuur evolueert van `Sentence -> Tokens[]` naar `Sentence -> Clause[] -> Tokens[]`.

**Voorgestelde Interfaces:**
```typescript
interface Clause {
  id: string;
  type: 'hoofdzin' | 'bijzin';
  tokens: Token[];
  // Elke clause wordt onafhankelijk ontleed (PV, OW, etc.) binnen zijn eigen context.
}

interface ComplexSentence extends Sentence {
  clauses: Clause[];
  conjunctions: Token[]; // Voegwoorden die clauses verbinden
}
```

**UI Wijzigingen:**
1.  **Stap 0 (Nieuw)**: Zin splitsen in deelzinnen (Clauses). Sleep een scheidingslijn tussen clauses.
2.  **Stap 1 & 2**: De huidige stappen (verdelen en benoemen) uitvoeren per clause (bijv. via tabbladen of onder elkaar).
