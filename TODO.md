# TODO & Roadmap

Dit document bevat de toekomstplannen en ideeën voor de Zinsontledingstrainer, gebaseerd op didactisch onderzoek.

## 🚀 Laaghangend Fruit (Korte termijn)

Deze functies zijn relatief eenvoudig te implementeren binnen de huidige architectuur (zonder backend) en verhogen de didactische waarde en motivatie aanzienlijk.

### 1. Gamification & Motivatie
*   **Confetti-effect:** Voeg een feestelijke animatie toe (bv. `canvas-confetti`) wanneer een zin of sessie foutloos wordt afgerond.
*   **Streak-systeem:** Houd in `localStorage` bij hoeveel dagen achter elkaar de leerling heeft geoefend of hoeveel zinnen achter elkaar goed zijn. Toon dit visueel (bv. een vlammetje 🔥).
*   **Badges (Lokaal):** Geef virtuele badges voor mijlpalen (bv. "PV Meester" na 10x PV goed).

### 2. Verbeterde Feedback (Formatief)
*   **Slimme Hint-knop:** In plaats van direct het antwoord te tonen, een knop "Geef hint" toevoegen.
    *   *Logica:* Als de PV ontbreekt, toon: "Tip: Zoek eerst het werkwoord dat verandert als je de zin van tijd verandert."
*   **Specifieke foutmeldingen:** In plaats van alleen rood kleuren, een tooltip tonen bij een fout. Bijv. als een LV in het vakje OND wordt gesleept: "Dit zinsdeel begint niet met een voorzetsel, maar is dit wel wie de handeling uitvoert?"

### 3. UX & Toegankelijkheid
*   **Dyslexie-modus:** Een schakelaar in de instellingen om het lettertype te veranderen naar een dyslexie-vriendelijk font (zoals OpenDyslexic of een zwaardere sans-serif met meer spatiëring).
*   **Dark Mode:** Ondersteuning voor systeemvoorkeuren (licht/donker) voor prettiger gebruik in de avonduren.

### 4. Didactische Verdieping (Inductief)
*   **"Kijk terug"-functie:** Na het afronden van een sessie, de mogelijkheid om gemaakte fouten nog eens rustig te bekijken met de juiste analyse ernaast (reflectie).
*   **Theorie-referentie:** Een klein (?) icoontje bij elke rol in de toolbar. Bij hover/klik verschijnt de definitie/regel (bv. "Onderwerp: Wie of wat + gezegde?").

---

## 🏗️ Architectuur & Lange termijn

### Samengestelde Zinnen (Complexe Zinnen)
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

### Backend & Integratie
*   Koppeling met ELO's (Magister/SOM) via LTI.
*   Centrale database voor voortgangsanalyse door docenten.
