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
*   **Focus Oefenen**: Specifiek trainen op zinnen die een Lijdend Voorwerp, Meewerkend Voorwerp, Voorzetselvoorwerp of Bijzin bevatten.
*   **Optionele onderdelen**: De volgende onderdelen kunnen aan/uit worden gezet (zinnen die deze bevatten worden verborgen als de optie uit staat, tenzij er een Focus is geselecteerd):
    *   *Bijstelling*
    *   *Bijvoeglijke Bepaling* (benoemen op woordniveau binnen een zinsdeel)
    *   *Voorzetselvoorwerp*

### Feedback
De applicatie geeft directe, formatieve feedback:
*   **Slimme Hints**: De knop "Geef Hint" analyseert wat de leerling nog mist (eerst PV, dan OND, etc.).
*   **Specifieke Foutmeldingen**: Als een leerling een fout maakt (bijv. LV op de plek van OND), krijgt hij een specifieke uitleg *waarom* dat niet klopt, in plaats van alleen "Fout".
*   **Antwoordmodel**: De knop "Toon antwoord" laat de volledige uitwerking zien.

## Nieuwe Zinnen Toevoegen (Content Management)

Alle zinnen staan in het bestand `constants.ts` in de lijst `SENTENCES`. Om een nieuwe zin toe te voegen, voeg je een nieuw object toe aan deze lijst.

### Datastructuur
Een zin ziet er in de code als volgt uit:

```typescript
{
  id: 101,                        // Uniek nummer (oplopend)
  label: "Zin 101: Korte titel",  // Zichtbaar in het dropdown menu
  predicateType: 'WG',            // Of 'NG' (Naamwoordelijk)
  level: 2,                       // 1 (Basis), 2 (Middel), 3 (Hoog)
  tokens: [                       // De lijst met woorden
    { 
      id: "s101t1",               // Uniek ID per woord (zinID + woordID)
      text: "Gisteren",           // Het woord zelf
      role: "bwb"                 // De grammaticale rol (zie types.ts)
    },
    { 
      id: "s101t2", 
      text: "zag", 
      role: "pv" 
    },
    { 
      id: "s101t3", 
      text: "ik", 
      role: "ow" 
    },
    { 
      id: "s101t4", 
      text: "een", 
      role: "lv" 
    },
    { 
      id: "s101t5", 
      text: "rode", 
      role: "lv", 
      subRole: "bijv_bep"         // Optioneel: Woord is een BB binnen het zinsdeel
    },
    { 
      id: "s101t6", 
      text: "auto.", 
      role: "lv" 
    }
  ]
}
```

### Belangrijke Regels & Trucs

1.  **Aaneengesloten zinsdelen:**
    De app ziet opeenvolgende woorden met dezelfde `role` (bijv. drie keer `"lv"`) automatisch als één zinsdeel.

2.  **De `newChunk` regel (Cruciaal!):**
    Soms staan er twee *verschillende* zinsdelen naast elkaar die *toevallig* dezelfde rol hebben. Bijvoorbeeld twee Bijwoordelijke Bepalingen: *"Gisteren (BWB) in de tuin (BWB)..."*.
    Om te voorkomen dat de app deze samenvoegt, moet je bij het **eerste woord van het tweede zinsdeel** de eigenschap `newChunk: true` toevoegen.
    
    *Voorbeeld:*
    ```typescript
    { text: "Gisteren", role: "bwb" },
    { text: "in", role: "bwb", newChunk: true }, // Forceer een knip hier!
    { text: "de", role: "bwb" },
    { text: "tuin", role: "bwb" },
    ```

3.  **Samengestelde Zinnen:**
    Voor zinnen met een bijzin (Opgave C) gebruiken we de rol `"bijzin"`. Alle woorden van de bijzin krijgen `role: "bijzin"`. De hoofdzin wordt normaal ontleed.

4.  **Beschikbare Rollen (`RoleKey`):**
    *   `pv` (Persoonsvorm)
    *   `ow` (Onderwerp)
    *   `wg` (Werkwoordelijk Gezegde - rest)
    *   `ng` (Naamwoordelijk Gezegde - rest, bij koppelwerkwoord)
    *   `lv` (Lijdend Voorwerp)
    *   `mv` (Meewerkend Voorwerp)
    *   `vv` (Voorzetselvoorwerp)
    *   `bwb` (Bijwoordelijke Bepaling)
    *   `bijst` (Bijstelling)
    *   `bijzin` (Voor complete bijzinnen)
    *   `nwd` (Naamwoordelijk deel, gebruik hiervoor de key `nwd`, de app toont dit als NG)

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
*   **`constants.ts`**: De database met zinnen (`SENTENCES`), rollen (`ROLES`) en feedbackregels.
*   **`types.ts`**: TypeScript definities.
*   **`components/`**: UI componenten (`DropZone`, `WordChip`).

## Toekomstvisie: Samengestelde Zinnen (Volledig)

In de huidige versie worden bijzinnen als één blok ("Bijzin") behandeld. Om in de toekomst volledige ontleding *binnen* de bijzin mogelijk te maken, moet de datastructuur worden aangepast.

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
