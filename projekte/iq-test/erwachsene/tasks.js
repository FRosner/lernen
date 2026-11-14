// Wissenschaftlich fundierter Aufgabenkatalog (20 Items)
// Kategorien:
// 1. Matrizen & Fluide visuelle Logik (Items 1-5)
// 2. Zahlen- & Sequenzlogik (Items 6-10)
// 3. Räumliche Kognition & Rotation (Items 11-15)
// 4. Deduktion & relationales Schließen (Items 16-20)

const TASKS = [
  // --- 1. MATRIZEN (Visuelle Logik) ---
  {
    id: 1,
    category: 'matrices',
    categoryName: 'Fluide visuelle Logik',
    difficulty: 'Einstieg',
    title: 'Matrix 1: Zeiger-Rotation',
    prompt: 'Welche Figur ergänzt das Fragezeichen logisch?',
    renderVisual(container) {
      container.innerHTML = `
        <svg viewBox="0 0 320 320" class="task-svg" aria-label="3x3 Matrix mit rotierendem Zeiger">
          <!-- Gitter 3x3 -->
          <rect x="10" y="10" width="300" height="300" rx="12" fill="var(--card-bg)" stroke="var(--border)" stroke-width="2"/>
          <line x1="110" y1="10" x2="110" y2="310" stroke="var(--border)" stroke-width="2"/>
          <line x1="210" y1="10" x2="210" y2="310" stroke="var(--border)" stroke-width="2"/>
          <line x1="10" y1="110" x2="310" y2="110" stroke="var(--border)" stroke-width="2"/>
          <line x1="10" y1="210" x2="310" y2="210" stroke="var(--border)" stroke-width="2"/>

          <!-- Zeile 1: 0°, 45°, 90° -->
          ${svgClock(60, 60, 0)}
          ${svgClock(160, 60, 45)}
          ${svgClock(260, 60, 90)}

          <!-- Zeile 2: 135°, 180°, 225° -->
          ${svgClock(60, 160, 135)}
          ${svgClock(160, 160, 180)}
          ${svgClock(260, 160, 225)}

          <!-- Zeile 3: 270°, 315°, ? -->
          ${svgClock(60, 260, 270)}
          ${svgClock(160, 260, 315)}
          <text x="260" y="275" font-size="44" font-weight="bold" fill="var(--primary)" text-anchor="middle">?</text>
        </svg>
      `;
    },
    options: [
      { text: 'A', svg: svgOptionClock(0) },
      { text: 'B', svg: svgOptionClock(45) },
      { text: 'C', svg: svgOptionClock(90) },
      { text: 'D', svg: svgOptionClock(180) },
    ],
    correctIndex: 0,
    explanation: 'Der Zeiger rotiert in jedem Schritt um 45° im Uhrzeigersinn. Nach 270° und 315° folgt eine Drehung um weitere 45° auf 360° bzw. 0° (senkrecht nach oben, 12 Uhr).'
  },

  {
    id: 2,
    category: 'matrices',
    categoryName: 'Fluide visuelle Logik',
    difficulty: 'Mittel',
    title: 'Matrix 2: Formen & Füllungen',
    prompt: 'Jede Zeile und Spalte folgt einer festen Gesetzmäßigkeit. Welches Symbol gehört ins freie Feld?',
    renderVisual(container) {
      container.innerHTML = `
        <svg viewBox="0 0 320 320" class="task-svg" aria-label="3x3 Matrix mit Formen und Füllungen">
          <rect x="10" y="10" width="300" height="300" rx="12" fill="var(--card-bg)" stroke="var(--border)" stroke-width="2"/>
          <line x1="110" y1="10" x2="110" y2="310" stroke="var(--border)" stroke-width="2"/>
          <line x1="210" y1="10" x2="210" y2="310" stroke="var(--border)" stroke-width="2"/>
          <line x1="10" y1="110" x2="310" y2="110" stroke="var(--border)" stroke-width="2"/>
          <line x1="10" y1="210" x2="310" y2="210" stroke="var(--border)" stroke-width="2"/>

          <!-- Zeile 1: Dreieck weiß, Quadrat schraffiert, Kreis voll -->
          ${svgShape(60, 60, 'triangle', 'white')}
          ${svgShape(160, 60, 'square', 'hatched')}
          ${svgShape(260, 60, 'circle', 'black')}

          <!-- Zeile 2: Quadrat voll, Kreis weiß, Dreieck schraffiert -->
          ${svgShape(60, 160, 'square', 'black')}
          ${svgShape(160, 160, 'circle', 'white')}
          ${svgShape(260, 160, 'triangle', 'hatched')}

          <!-- Zeile 3: Kreis schraffiert, Dreieck voll, ? -->
          ${svgShape(60, 260, 'circle', 'hatched')}
          ${svgShape(160, 260, 'triangle', 'black')}
          <text x="260" y="275" font-size="44" font-weight="bold" fill="var(--primary)" text-anchor="middle">?</text>
        </svg>
      `;
    },
    options: [
      { text: 'A', svg: svgOptionShape('square', 'white') },
      { text: 'B', svg: svgOptionShape('square', 'black') },
      { text: 'C', svg: svgOptionShape('circle', 'white') },
      { text: 'D', svg: svgOptionShape('triangle', 'white') },
    ],
    correctIndex: 0,
    explanation: 'Sowohl in jeder Zeile als auch in jeder Spalte kommt jede Grundform (Kreis, Quadrat, Dreieck) und jede Füllung (weiß, schraffiert, schwarz) genau einmal vor (lateinisches Quadrat). In der 3. Zeile fehlt das Quadrat mit weißer Füllung.'
  },

  {
    id: 3,
    category: 'matrices',
    categoryName: 'Fluide visuelle Logik',
    difficulty: 'Gehoben',
    title: 'Matrix 3: Überlagerung & Differenz (XOR-Logik)',
    prompt: 'Die 3. Spalte entsteht durch logische Verknüpfung der ersten beiden Felder. Welches Muster passt?',
    renderVisual(container) {
      container.innerHTML = `
        <svg viewBox="0 0 320 320" class="task-svg" aria-label="3x3 Matrix mit XOR Überlagerung">
          <rect x="10" y="10" width="300" height="300" rx="12" fill="var(--card-bg)" stroke="var(--border)" stroke-width="2"/>
          <line x1="110" y1="10" x2="110" y2="310" stroke="var(--border)" stroke-width="2"/>
          <line x1="210" y1="10" x2="210" y2="310" stroke="var(--border)" stroke-width="2"/>
          <line x1="10" y1="110" x2="310" y2="110" stroke="var(--border)" stroke-width="2"/>
          <line x1="10" y1="210" x2="310" y2="210" stroke="var(--border)" stroke-width="2"/>

          <!-- Zeile 1: Vertikal + Oben-Horiz -> Vertikal + Unten-Horiz -> Oben + Unten Horiz (Vertikal löscht sich) -->
          ${svgLines(60, 60, ['v', 'top'])}
          ${svgLines(160, 60, ['v', 'bot'])}
          ${svgLines(260, 60, ['top', 'bot'])}

          <!-- Zeile 2: Links + Rechts Vertikal -> Links Vertikal + Horizontal Mitte -> Rechts Vertikal + Horizontal Mitte -->
          ${svgLines(60, 160, ['left', 'right'])}
          ${svgLines(160, 160, ['left', 'hmid'])}
          ${svgLines(260, 160, ['right', 'hmid'])}

          <!-- Zeile 3: Diag1 + Kreis -> Diag2 + Kreis -> ? (Kreis löscht sich, Diag1 + Diag2 bleiben = X) -->
          ${svgLines(60, 260, ['d1', 'c'])}
          ${svgLines(160, 260, ['d2', 'c'])}
          <text x="260" y="275" font-size="44" font-weight="bold" fill="var(--primary)" text-anchor="middle">?</text>
        </svg>
      `;
    },
    options: [
      { text: 'A', svg: svgOptionLines(['d1', 'd2']) },
      { text: 'B', svg: svgOptionLines(['c', 'd1']) },
      { text: 'C', svg: svgOptionLines(['c']) },
      { text: 'D', svg: svgOptionLines(['d1', 'd2', 'c']) },
    ],
    correctIndex: 0,
    explanation: 'Regel: Exklusives ODER (XOR). Elemente, die in beiden ersten Spalten vorkommen, löschen sich gegenseitig aus. Elemente, die nur in einer Spalte vorkommen, bleiben erhalten. Der Kreis in Zeile 3 verschwindet, die beiden unterschiedlichen Diagonalen bilden zusammen ein „X“.'
  },

  {
    id: 4,
    category: 'matrices',
    categoryName: 'Fluide visuelle Logik',
    difficulty: 'Gehoben',
    title: 'Matrix 4: Punkt-Dynamik',
    prompt: 'Zwei Punkte wandern nach festen Regeln durch das Quadrat. Wo befinden sich die Punkte im Zielfeld?',
    renderVisual(container) {
      container.innerHTML = `
        <svg viewBox="0 0 320 320" class="task-svg" aria-label="3x3 Matrix mit zwei wandernden Punkten">
          <rect x="10" y="10" width="300" height="300" rx="12" fill="var(--card-bg)" stroke="var(--border)" stroke-width="2"/>
          <line x1="110" y1="10" x2="110" y2="310" stroke="var(--border)" stroke-width="2"/>
          <line x1="210" y1="10" x2="210" y2="310" stroke="var(--border)" stroke-width="2"/>
          <line x1="10" y1="110" x2="310" y2="110" stroke="var(--border)" stroke-width="2"/>
          <line x1="10" y1="210" x2="310" y2="210" stroke="var(--border)" stroke-width="2"/>

          <!-- Zeile 1: Blau startet oben-links (CW), Rot unten-rechts (CCW) -->
          ${svgDotBox(60, 60, 'TL', 'BR')}
          ${svgDotBox(160, 60, 'TR', 'TR')}
          ${svgDotBox(260, 60, 'BR', 'TL')}

          <!-- Zeile 2 -->
          ${svgDotBox(60, 160, 'BL', 'BL')}
          ${svgDotBox(160, 160, 'TL', 'BR')}
          ${svgDotBox(260, 160, 'TR', 'TR')}

          <!-- Zeile 3: Blau startet BR (geht nach BL -> TL), Rot startet TL (geht nach BL -> BR) -->
          ${svgDotBox(60, 260, 'BR', 'TL')}
          ${svgDotBox(160, 260, 'BL', 'BL')}
          <text x="260" y="275" font-size="44" font-weight="bold" fill="var(--primary)" text-anchor="middle">?</text>
        </svg>
      `;
    },
    options: [
      { text: 'A', svg: svgOptionDotBox('TL', 'BR') },
      { text: 'B', svg: svgOptionDotBox('TR', 'BL') },
      { text: 'C', svg: svgOptionDotBox('BL', 'TR') },
      { text: 'D', svg: svgOptionDotBox('TL', 'TL') },
    ],
    correctIndex: 0,
    explanation: 'Der blaue (gefüllte) Punkt wandert pro Zelle um 1 Ecke im Uhrzeigersinn (in Zeile 3: Unten-Rechts → Unten-Links → Oben-Links). Der rote (gemusterte/hohle) Punkt wandert gegen den Uhrzeigersinn (in Zeile 3: Oben-Links → Unten-Links → Unten-Rechts). Im gesuchten Feld ist Blau oben-links und Rot unten-rechts.'
  },

  {
    id: 5,
    category: 'matrices',
    categoryName: 'Fluide visuelle Logik',
    difficulty: 'Schwer',
    title: 'Matrix 5: Topologische Schachtelung',
    prompt: 'Welche Figur vervollständigt die Schachtelungsreihe folgerichtig?',
    renderVisual(container) {
      container.innerHTML = `
        <svg viewBox="0 0 320 320" class="task-svg" aria-label="3x3 Matrix mit ineinander geschachtelten Formen">
          <rect x="10" y="10" width="300" height="300" rx="12" fill="var(--card-bg)" stroke="var(--border)" stroke-width="2"/>
          <line x1="110" y1="10" x2="110" y2="310" stroke="var(--border)" stroke-width="2"/>
          <line x1="210" y1="10" x2="210" y2="310" stroke="var(--border)" stroke-width="2"/>
          <line x1="10" y1="110" x2="310" y2="110" stroke="var(--border)" stroke-width="2"/>
          <line x1="10" y1="210" x2="310" y2="210" stroke="var(--border)" stroke-width="2"/>

          <!-- Zeile 1: Außen Kreis/Innen 3-Eck -> Außen 3-Eck/Innen 4-Eck -> Außen 4-Eck/Innen 5-Eck -->
          ${svgNest(60, 60, 'circle', 3)}
          ${svgNest(160, 60, 'poly3', 4)}
          ${svgNest(260, 60, 'poly4', 5)}

          <!-- Zeile 2: Außen 4-Eck/Innen 5-Eck -> Außen 5-Eck/Innen 6-Eck -> Außen 6-Eck/Innen Kreis -->
          ${svgNest(60, 160, 'poly4', 5)}
          ${svgNest(160, 160, 'poly5', 6)}
          ${svgNest(260, 160, 'poly6', 'circle')}

          <!-- Zeile 3: Außen 5-Eck/Innen 3-Eck -> Außen 3-Eck/Innen 4-Eck -> ? (Außen 4-Eck/Innen 5-Eck) -->
          ${svgNest(60, 260, 'poly5', 3)}
          ${svgNest(160, 260, 'poly3', 4)}
          <text x="260" y="275" font-size="44" font-weight="bold" fill="var(--primary)" text-anchor="middle">?</text>
        </svg>
      `;
    },
    options: [
      { text: 'A', svg: svgOptionNest('poly4', 5) },
      { text: 'B', svg: svgOptionNest('poly5', 4) },
      { text: 'C', svg: svgOptionNest('poly4', 6) },
      { text: 'D', svg: svgOptionNest('circle', 5) },
    ],
    correctIndex: 0,
    explanation: 'Zwei zusammenhängende Regeln: 1. Die innere Form der vorherigen Zelle wird zur äußeren Hülle der nächsten Zelle (3-Eck → 4-Eck als Hülle). 2. Die neue innere Form erhält eine Kante mehr (+1 Eck: von 4-Eck zu 5-Eck). Die gesuchte Figur hat außen ein Quadrat (4-Eck) und innen ein Fünfeck.'
  },

  // --- 2. ZAHLEN- & SEQUENZLOGIK ---
  {
    id: 6,
    category: 'sequences',
    categoryName: 'Numerische & Symbolische Logik',
    difficulty: 'Einstieg',
    title: 'Zahlenreihe 1: Dynamische Differenz',
    prompt: 'Welche Zahl setzt die Zahlenreihe logisch fort?',
    renderVisual(container) {
      container.innerHTML = `
        <div class="seq-card">
          <div class="seq-nums">
            <span class="num-box">4</span>
            <span class="op">→</span>
            <span class="num-box">7</span>
            <span class="op">→</span>
            <span class="num-box">12</span>
            <span class="op">→</span>
            <span class="num-box">19</span>
            <span class="op">→</span>
            <span class="num-box">28</span>
            <span class="op">→</span>
            <span class="num-box target">?</span>
          </div>
        </div>
      `;
    },
    options: [
      { text: '37' },
      { text: '39' },
      { text: '41' },
      { text: '43' },
    ],
    correctIndex: 1,
    explanation: 'Die Abstände zwischen den Zahlen wachsen jeweils um 2 (Folge ungerader Zahlen): +3, +5, +7, +9. Der nächste Schritt muss daher +11 lauten: 28 + 11 = 39.'
  },

  {
    id: 7,
    category: 'sequences',
    categoryName: 'Numerische & Symbolische Logik',
    difficulty: 'Mittel',
    title: 'Zahlenreihe 2: Exponentielles Wachstum',
    prompt: 'Bestimme die fehlende Zahl am Ende der Sequenz:',
    renderVisual(container) {
      container.innerHTML = `
        <div class="seq-card">
          <div class="seq-nums">
            <span class="num-box">3</span>
            <span class="op">→</span>
            <span class="num-box">5</span>
            <span class="op">→</span>
            <span class="num-box">9</span>
            <span class="op">→</span>
            <span class="num-box">17</span>
            <span class="op">→</span>
            <span class="num-box">33</span>
            <span class="op">→</span>
            <span class="num-box target">?</span>
          </div>
        </div>
      `;
    },
    options: [
      { text: '49' },
      { text: '61' },
      { text: '65' },
      { text: '67' },
    ],
    correctIndex: 2,
    explanation: 'Die Differenzen verdoppeln sich in jedem Schritt: +2, +4, +8, +16. Der nächste Zuwachs ist demnach +32: 33 + 32 = 65 (äquivalent zu: ×2 - 1).'
  },

  {
    id: 8,
    category: 'sequences',
    categoryName: 'Numerische & Symbolische Logik',
    difficulty: 'Gehoben',
    title: 'Zahlenreihe 3: Alternierende Doppelreihe',
    prompt: 'Zwei unabhängige Rechenmuster sind miteinander verschränkt. Welche beiden Zahlen folgen am Ende?',
    renderVisual(container) {
      container.innerHTML = `
        <div class="seq-card">
          <div class="seq-nums">
            <span class="num-box c1">2</span>
            <span class="num-box c2">25</span>
            <span class="num-box c1">4</span>
            <span class="num-box c2">22</span>
            <span class="num-box c1">8</span>
            <span class="num-box c2">18</span>
            <span class="num-box c1">16</span>
            <span class="num-box c2">13</span>
            <span class="num-box c1 target">?₁</span>
            <span class="num-box c2 target">?₂</span>
          </div>
        </div>
      `;
    },
    options: [
      { text: '32 und 7' },
      { text: '32 und 8' },
      { text: '24 und 9' },
      { text: '30 und 6' },
    ],
    correctIndex: 0,
    explanation: 'Reihe 1 (ungerade Positionen: 2, 4, 8, 16) verdoppelt sich stets (×2) → nächste Zahl ist 32. Reihe 2 (gerade Positionen: 25, 22, 18, 13) zieht zunehmend größere Zahlen ab (-3, -4, -5) → nächste Zahl ist 13 - 6 = 7. Die gesuchte Kombination lautet: 32 und 7.'
  },

  {
    id: 9,
    category: 'sequences',
    categoryName: 'Numerische & Symbolische Logik',
    difficulty: 'Gehoben',
    title: 'Zahlenmatrix: Relationale Dreiecke',
    prompt: 'In jedem Dreieck stehen die Eckzahlen in einer festen mathematischen Beziehung zur Innenzahl. Welche Zahl gehört in das dritte Dreieck?',
    renderVisual(container) {
      container.innerHTML = `
        <div class="tri-container">
          ${svgNumberTriangle(3, 4, 5, 35)}
          ${svgNumberTriangle(2, 6, 7, 56)}
          ${svgNumberTriangle(4, 5, 8, '?')}
        </div>
      `;
    },
    options: [
      { text: '64' },
      { text: '72' },
      { text: '80' },
      { text: '96' },
    ],
    correctIndex: 1,
    explanation: 'Regel für die Innenzahl: Addiere die oberen beiden Ecken und multipliziere das Ergebnis mit der unteren Zahl: (ObenLinks + ObenRechts) × Unten. Dreieck 1: (3 + 4) × 5 = 35. Dreieck 2: (2 + 6) × 7 = 56. Dreieck 3: (4 + 5) × 8 = 9 × 8 = 72.'
  },

  {
    id: 10,
    category: 'sequences',
    categoryName: 'Numerische & Symbolische Logik',
    difficulty: 'Schwer',
    title: 'Zahlenreihe 4: Nicht-lineare Transformation',
    prompt: 'Welche Zahl schließt diese anspruchsvolle Folge ab?',
    renderVisual(container) {
      container.innerHTML = `
        <div class="seq-card">
          <div class="seq-nums">
            <span class="num-box">64</span>
            <span class="op">→</span>
            <span class="num-box">32</span>
            <span class="op">→</span>
            <span class="num-box">48</span>
            <span class="op">→</span>
            <span class="num-box">24</span>
            <span class="op">→</span>
            <span class="num-box">36</span>
            <span class="op">→</span>
            <span class="num-box">18</span>
            <span class="op">→</span>
            <span class="num-box target">?</span>
          </div>
        </div>
      `;
    },
    options: [
      { text: '21' },
      { text: '24' },
      { text: '27' },
      { text: '30' },
    ],
    correctIndex: 2,
    explanation: 'Abwechselnde Operation: Halbieren (:2) und anschließende Multiplikation mit 1,5 (oder +50%). 64 : 2 = 32; 32 × 1,5 = 48; 48 : 2 = 24; 24 × 1,5 = 36; 36 : 2 = 18; 18 × 1,5 = 27.'
  },

  // --- 3. RÄUMLICHE KOGNITION (Spatial Reasoning) ---
  {
    id: 11,
    category: 'spatial',
    categoryName: 'Räumliche Kognition & Rotation',
    difficulty: 'Mittel',
    title: 'Räumliches Denken 1: Würfelnetz',
    prompt: 'Welcher der vier Würfel kann durch Zusammenfalten dieses Würfelnetzes entstehen?',
    renderVisual(container) {
      container.innerHTML = `
        <div class="spatial-wrap">
          <div class="net-view">
            <svg viewBox="0 0 160 200" class="net-svg" aria-label="Würfelnetz">
              <!-- Kreuz-Netz: Oben (Kreis), Mitte (Quadrat), Links (Stern), Rechts (Kreuz), Unten (Dreieck), Ganz unten (Welle) -->
              ${svgNetCell(40, 0, 'circle')}
              ${svgNetCell(0, 40, 'star')}
              ${svgNetCell(40, 40, 'square')}
              ${svgNetCell(80, 40, 'cross')}
              ${svgNetCell(40, 80, 'triangle')}
              ${svgNetCell(40, 120, 'wave')}
            </svg>
            <div class="hint-label">Vorgegebenes Würfelnetz</div>
          </div>
        </div>
      `;
    },
    options: [
      { text: 'A', svg: svgCubeOption('circle', 'square', 'star', false) }, // Kreis oben, Quadrat vorn, Stern rechts -> Aber Stern ist links vom Quadrat! Beim Falten müsste Stern links liegen!
      { text: 'B', svg: svgCubeOption('circle', 'triangle', 'square', false) }, // Kreis und Dreieck liegen sich gegenüber! Unmöglich zusammen sichtbar.
      { text: 'C', svg: svgCubeOption('star', 'cross', 'square', false) }, // Stern und Kreuz liegen sich gegenüber! Unmöglich zusammen sichtbar.
      { text: 'D', svg: svgCubeOption('circle', 'square', 'cross', true) }, // Kreis oben, Quadrat vorn, Kreuz rechts -> Exakt übereinstimmend!
    ],
    correctIndex: 3,
    explanation: 'Wichtiges Ausschlusskriterium beim Würfelfalten: Gegenüberliegende Flächen können niemals gleichzeitig an derselben Ecke sichtbar sein. 1. Kreis und Dreieck liegen gegenüber (schließt B aus). 2. Stern und Kreuz liegen gegenüber (schließt C aus). 3. Wenn Kreis oben und Quadrat vorne liegt, befindet sich das Kreuz rechts und der Stern links (schließt A aus, da dort der Stern rechts liegt). Würfel D ist geometrisch korrekt.'
  },

  {
    id: 12,
    category: 'spatial',
    categoryName: 'Räumliche Kognition & Rotation',
    difficulty: 'Gehoben',
    title: 'Räumliches Denken 2: Mental Rotation',
    prompt: 'Welche Figur stellt exakt denselben 3D-Körper dar, lediglich im Raum gedreht (keine Spiegelung)?',
    renderVisual(container) {
      container.innerHTML = `
        <div class="spatial-wrap">
          <div class="base-figure">
            <svg viewBox="0 0 120 120" class="iso-svg">
              ${svgLBlock(60, 60, 0, false)}
            </svg>
            <div class="hint-label">Ausgangsfigur</div>
          </div>
        </div>
      `;
    },
    options: [
      { text: 'A', svg: svgOptionLBlock(90, false) },  // Echte Drehung um 90°
      { text: 'B', svg: svgOptionLBlock(0, true) },    // Gespiegelt
      { text: 'C', svg: svgOptionLBlock(90, true) },   // Gespiegelt + gedreht
      { text: 'D', svg: svgOptionLBlock(180, true) },  // Gespiegelt
    ],
    correctIndex: 0,
    explanation: 'Chiralität (Händigkeit): Die Ausgangsfigur besitzt einen nach rechts abknickenden Schenkel. Optionen B, C und D sind spiegelverkehrte Enantiomere (wie ein linker zu einem rechten Handschuh) und können durch reine Drehung im Raum niemals erreicht werden. Nur Option A ist die echte, ungespiegelte Drehung.'
  },

  {
    id: 13,
    category: 'spatial',
    categoryName: 'Räumliche Kognition & Rotation',
    difficulty: 'Mittel',
    title: 'Räumliches Denken 3: Faltung & Lochung',
    prompt: 'Ein quadratisches Blatt Papier wird zweimal gefaltet und an der markierten Ecke gelocht. Wie sieht das komplett entfaltete Blatt aus?',
    renderVisual(container) {
      container.innerHTML = `
        <div class="fold-steps">
          <div class="step-box">
            <div class="step-num">1. Falten nach rechts</div>
            <svg viewBox="0 0 80 80" class="fold-svg">
              <rect x="10" y="10" width="60" height="60" fill="none" stroke="var(--border)" stroke-width="2"/>
              <line x1="40" y1="10" x2="40" y2="70" stroke="var(--primary)" stroke-dasharray="3,3" stroke-width="2"/>
              <path d="M25 40 L45 40 M38 35 L45 40 L38 45" fill="none" stroke="var(--primary)" stroke-width="2"/>
            </svg>
          </div>
          <div class="step-box">
            <div class="step-num">2. Falten nach unten</div>
            <svg viewBox="0 0 80 80" class="fold-svg">
              <rect x="40" y="10" width="30" height="60" fill="var(--card-bg)" stroke="var(--border)" stroke-width="2"/>
              <line x1="40" y1="40" x2="70" y2="40" stroke="var(--primary)" stroke-dasharray="3,3" stroke-width="2"/>
              <path d="M55 25 L55 45 M50 38 L55 45 L60 38" fill="none" stroke="var(--primary)" stroke-width="2"/>
            </svg>
          </div>
          <div class="step-box">
            <div class="step-num">3. Lochung in Innenkante</div>
            <svg viewBox="0 0 80 80" class="fold-svg">
              <rect x="40" y="40" width="30" height="30" fill="var(--card-bg)" stroke="var(--border)" stroke-width="2"/>
              <!-- Loch an der geschlossenen Ecke (40, 40 = ursprüngliche Papiermitte) -->
              <circle cx="43" cy="43" r="5" fill="var(--danger)"/>
            </svg>
          </div>
        </div>
      `;
    },
    options: [
      { text: 'A: 1 Loch im Zentrum', desc: 'Genau 1 Loch in der Mitte des Blattes' },
      { text: 'B: 4 Löcher in den Ecken', desc: '4 Löcher in den äußeren Papierecken' },
      { text: 'C: 4 Löcher um die Mitte', desc: '4 Löcher symmetrisch um das Zentrum' },
      { text: 'D: 2 Löcher an den Rändern', desc: '2 Löcher mittig an den Außenkanten' },
    ],
    correctIndex: 0,
    explanation: 'Die gelochte Ecke (oben-links des gefalteten Viertels) entspricht dem absoluten Mittelpunkt des ursprünglichen Papierbogens, wo alle 4 Lagen zusammenlaufen. Beim Entfalten entsteht daher exakt 1 zentriertes Loch in der Mitte des gesamten Blattes.'
  },

  {
    id: 14,
    category: 'spatial',
    categoryName: 'Räumliche Kognition & Rotation',
    difficulty: 'Gehoben',
    title: 'Räumliches Denken 4: Verdeckte Bausteine',
    prompt: 'Aus wie vielen Einheitswürfeln besteht dieses lückenlose Bauwerk insgesamt (auch verdeckte Würfel mitzählen)?',
    renderVisual(container) {
      container.innerHTML = `
        <div class="spatial-wrap">
          <svg viewBox="0 0 200 180" class="block-svg" aria-label="3D Würfel-Treppe">
            ${svgCubeStack()}
          </svg>
          <div class="hint-label">Grundfläche 3×3, lückenlos auf dem Boden stehend</div>
        </div>
      `;
    },
    options: [
      { text: '12' },
      { text: '13' },
      { text: '14' },
      { text: '15' },
    ],
    correctIndex: 2,
    explanation: 'Säulenhöhen von hinten nach vorne zeilenweise addiert: Hintere Reihe: 3 + 2 + 1 = 6 Würfel. Mittlere Reihe: 2 + 2 + 1 = 5 Würfel. Vordere Reihe: 1 + 1 + 1 = 3 Würfel. Gesamtzahl: 6 + 5 + 3 = 14 Würfel.'
  },

  {
    id: 15,
    category: 'spatial',
    categoryName: 'Räumliche Kognition & Rotation',
    difficulty: 'Schwer',
    title: 'Räumliches Denken 5: Orthogonale Projektion',
    prompt: 'Welcher Grundriss (Blick von oben senkrecht nach unten) gehört zu dieser Figur?',
    renderVisual(container) {
      container.innerHTML = `
        <div class="spatial-wrap">
          <svg viewBox="0 0 180 160" class="block-svg">
            ${svgOrthoFigure()}
          </svg>
          <div class="hint-label">Blickrichtung: Senkrecht von oben ⬇</div>
        </div>
      `;
    },
    options: [
      { text: 'A', svg: svgPlanView([[1, 1, 0], [1, 0, 0], [1, 1, 1]]) },
      { text: 'B', svg: svgPlanView([[1, 1, 1], [0, 1, 0], [0, 1, 1]]) },
      { text: 'C', svg: svgPlanView([[1, 0, 1], [1, 1, 1], [0, 0, 1]]) },
      { text: 'D', svg: svgPlanView([[1, 1, 1], [1, 0, 0], [1, 1, 0]]) },
    ],
    correctIndex: 0,
    explanation: 'Bei der orthogonalen Projektion von oben zählt jedes Feld als belegt, auf dem sich in beliebiger Höhe mindestens ein Würfel befindet. Der Umriss ergibt in Zeile 1 zwei Blöcke links, in Zeile 2 einen Block ganz links, und in Zeile 3 eine durchgehende 3er-Basis (Option A).'
  },

  // --- 4. DEDUKTION & RELATIONALE LOGIK ---
  {
    id: 16,
    category: 'deduction',
    categoryName: 'Deduktives & Relationales Schließen',
    difficulty: 'Einstieg',
    title: 'Logische Waage: Äquivalenzrechnung',
    prompt: 'Wie viele Kreise sind nötig, um zwei Dreiecke exakt auszubalancieren?',
    renderVisual(container) {
      container.innerHTML = `
        <div class="scales-wrap">
          <div class="scale-item">
            <span class="scale-label">Waage 1:</span>
            <span class="eq-sym">1 Quadrat (■)</span>
            <span class="eq-op">=</span>
            <span class="eq-sym">2 Kreise (●●)</span>
          </div>
          <div class="scale-item">
            <span class="scale-label">Waage 2:</span>
            <span class="eq-sym">1 Dreieck (▲)</span>
            <span class="eq-op">=</span>
            <span class="eq-sym">2 Quadrate + 1 Kreis (■■●)</span>
          </div>
        </div>
      `;
    },
    options: [
      { text: '8 Kreise' },
      { text: '9 Kreise' },
      { text: '10 Kreise' },
      { text: '12 Kreise' },
    ],
    correctIndex: 2,
    explanation: 'Substitution: 1 Quadrat = 2 Kreise. Einsetzen in Waage 2: 1 Dreieck = 2×(2 Kreise) + 1 Kreis = 4 + 1 = 5 Kreise. Gesucht sind 2 Dreiecke: 2 × 5 Kreise = 10 Kreise.'
  },

  {
    id: 17,
    category: 'deduction',
    categoryName: 'Deduktives & Relationales Schließen',
    difficulty: 'Mittel',
    title: 'Relationale Reihenfolge: Logischer Einlauf',
    prompt: 'Fünf Läufer erreichen das Ziel. Wer hat den Lauf gewonnen?',
    renderVisual(container) {
      container.innerHTML = `
        <div class="clues-card">
          <ul class="clues-list">
            <li>Clara kam vor Anna ins Ziel.</li>
            <li>Anna kam vor Ben ins Ziel.</li>
            <li>David erreichte direkt nach Ben das Ziel.</li>
            <li>Eva lief als Erste noch vor Clara über die Ziellinie.</li>
          </ul>
        </div>
      `;
    },
    options: [
      { text: 'Anna' },
      { text: 'Ben' },
      { text: 'Clara' },
      { text: 'Eva' },
    ],
    correctIndex: 3,
    explanation: 'Die Aussagen ergeben eine eindeutige lineare Ordnungsrelation: Clara < Anna < Ben < David. Da Eva noch vor Clara ins Ziel kam, lautet die vollständige Reihenfolge: Eva → Clara → Anna → Ben → David. Eva ist Erste und hat den Lauf gewonnen.'
  },

  {
    id: 18,
    category: 'deduction',
    categoryName: 'Deduktives & Relationales Schließen',
    difficulty: 'Gehoben',
    title: 'Formaler Syllogismus: Zwingende Folgerung',
    prompt: 'Welche Aussage lässt sich aus den Prämissen zwingend logisch ableiten?',
    renderVisual(container) {
      container.innerHTML = `
        <div class="clues-card">
          <div class="premise-box">
            <p><strong>Prämisse 1:</strong> Alle Mitglieder des Forscherteams beherrschen Statistik.</p>
            <p><strong>Prämisse 2:</strong> Einige Biologen sind Mitglieder des Forscherteams.</p>
            <p><strong>Prämisse 3:</strong> Niemand, der Statistik beherrscht, akzeptiert ungeprüfte Gerüchte.</p>
          </div>
        </div>
      `;
    },
    options: [
      { text: 'Alle Biologen beherrschen Statistik.' },
      { text: 'Einige Biologen akzeptieren keine ungeprüften Gerüchte.' },
      { text: 'Alle Personen, die keine Gerüchte akzeptieren, sind Forscher.' },
      { text: 'Kein Biologe akzeptiert ungeprüfte Gerüchte.' },
    ],
    correctIndex: 1,
    explanation: 'Nach Prämisse 2 gibt es Biologen im Forscherteam. Diese spezifischen Biologen beherrschen laut Prämisse 1 ausnahmslos Statistik. Da laut Prämisse 3 jede Person, die Statistik beherrscht, ungeprüfte Gerüchte ablehnt, folgt zwingend: Diese Gruppe von Biologen akzeptiert keine ungeprüften Gerüchte.'
  },

  {
    id: 19,
    category: 'deduction',
    categoryName: 'Deduktives & Relationales Schließen',
    difficulty: 'Gehoben',
    title: 'Symbol-Arithmetik: Priorität & Substitution',
    prompt: 'Ermittle das korrekte mathematische Endergebnis der vierten Gleichung:',
    renderVisual(container) {
      container.innerHTML = `
        <div class="clues-card math-system">
          <div class="math-row">
            <span>▲ + ▲ + ▲</span> <span>=</span> <span>15</span>
          </div>
          <div class="math-row">
            <span>■ + ■ + ▲</span> <span>=</span> <span>21</span>
          </div>
          <div class="math-row">
            <span>● × ■ − ▲</span> <span>=</span> <span>27</span>
          </div>
          <div class="math-row target-row">
            <span>■ + ● × ▲</span> <span>=</span> <span class="highlight-q">?</span>
          </div>
        </div>
      `;
    },
    options: [
      { text: '28' },
      { text: '40' },
      { text: '60' },
      { text: '65' },
    ],
    correctIndex: 0,
    explanation: 'Schrittweise Auflösung: 1. 3×▲ = 15 ⇒ ▲ = 5. 2. 2×■ + 5 = 21 ⇒ 2×■ = 16 ⇒ ■ = 8. 3. ● × 8 − 5 = 27 ⇒ ● × 8 = 32 ⇒ ● = 4. 4. Berechnung: ■ + (● × ▲) = 8 + (4 × 5) = 8 + 20 = 28 (Punktrechnung vor Strichrechnung beachten!).'
  },

  {
    id: 20,
    category: 'deduction',
    categoryName: 'Deduktives & Relationales Schließen',
    difficulty: 'Schwer',
    title: 'Wahrheitsrätsel: Der Wahrheitssprecher',
    prompt: 'Vier Personen machen Aussagen über einen Tresorcode. Genau EINE Person sagt die Wahrheit, drei lügen. Wer sagt die Wahrheit?',
    renderVisual(container) {
      container.innerHTML = `
        <div class="clues-card">
          <ul class="dialogue-list">
            <li><strong>Alex:</strong> „Bea hat den Code geknackt.“</li>
            <li><strong>Bea:</strong> „Dan hat den Code geknackt.“</li>
            <li><strong>Chris:</strong> „Ich habe den Code nicht geknackt.“</li>
            <li><strong>Dan:</strong> „Bea lügt, als sie behauptete, ich hätte den Code geknackt.“</li>
          </ul>
        </div>
      `;
    },
    options: [
      { text: 'Alex' },
      { text: 'Bea' },
      { text: 'Chris' },
      { text: 'Dan' },
    ],
    correctIndex: 3,
    explanation: 'Aussagenlogischer Widerspruch: Beas Aussage („Dan war es“) und Dans Aussage („Bea lügt, ich war es nicht“) stehen im direkten kontradiktorischen Widerspruch. Genau eine dieser beiden Aussagen MUSS wahr sein, die andere falsch. Da insgesamt nur eine einzige Person die Wahrheit sagt, MÜSSEN alle anderen Personen (Alex und Chris) lügen! Weil Chris lügt („Ich war es nicht“), war in Wirklichkeit Chris der Täter. Folglich hatte Dan mit seiner Feststellung vollkommen recht, dass Beas Beschuldigung eine Lüge war. Dan sagt die Wahrheit.'
  }
];

// --- HILFSFUNKTIONEN FÜR SVG-GRAFIKEN ---

function svgClock(cx, cy, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  const x2 = cx + 28 * Math.cos(rad);
  const y2 = cy + 28 * Math.sin(rad);
  return `
    <circle cx="${cx}" cy="${cy}" r="32" fill="var(--shape-bg)" stroke="var(--border)" stroke-width="2"/>
    <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="var(--primary)" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="4" fill="var(--primary)"/>
  `;
}

function svgOptionClock(deg) {
  return `<svg viewBox="0 0 80 80" class="opt-svg">${svgClock(40, 40, deg)}</svg>`;
}

function svgShape(cx, cy, type, fillType, size = 100) {
  let fill = fillType === 'white' ? 'var(--card-bg)' : (fillType === 'black' ? 'var(--primary)' : 'url(#hatch)');
  let stroke = 'var(--primary)';
  let shape = '';
  if (type === 'circle') {
    shape = `<circle cx="${cx}" cy="${cy}" r="26" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
  } else if (type === 'square') {
    shape = `<rect x="${cx - 24}" y="${cy - 24}" width="48" height="48" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
  } else if (type === 'triangle') {
    shape = `<polygon points="${cx},${cy - 28} ${cx + 28},${cy + 24} ${cx - 28},${cy + 24}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
  }
  return `
    <defs>
      <pattern id="hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="8" stroke="var(--primary)" stroke-width="2.5"/>
      </pattern>
    </defs>
    ${shape}
  `;
}

function svgOptionShape(type, fillType) {
  return `<svg viewBox="0 0 80 80" class="opt-svg">${svgShape(40, 40, type, fillType, 80)}</svg>`;
}

function svgLines(cx, cy, lines) {
  let content = '';
  const s = 'stroke="var(--primary)" stroke-width="3.5" stroke-linecap="round"';
  if (lines.includes('v')) content += `<line x1="${cx}" y1="${cy-30}" x2="${cx}" y2="${cy+30}" ${s}/>`;
  if (lines.includes('top')) content += `<line x1="${cx-30}" y1="${cy-25}" x2="${cx+30}" y2="${cy-25}" ${s}/>`;
  if (lines.includes('bot')) content += `<line x1="${cx-30}" y1="${cy+25}" x2="${cx+30}" y2="${cy+25}" ${s}/>`;
  if (lines.includes('left')) content += `<line x1="${cx-25}" y1="${cy-30}" x2="${cx-25}" y2="${cy+30}" ${s}/>`;
  if (lines.includes('right')) content += `<line x1="${cx+25}" y1="${cy-30}" x2="${cx+25}" y2="${cy+30}" ${s}/>`;
  if (lines.includes('hmid')) content += `<line x1="${cx-30}" y1="${cy}" x2="${cx+30}" y2="${cy}" ${s}/>`;
  if (lines.includes('d1')) content += `<line x1="${cx-26}" y1="${cy+26}" x2="${cx+26}" y2="${cy-26}" ${s}/>`;
  if (lines.includes('d2')) content += `<line x1="${cx-26}" y1="${cy-26}" x2="${cx+26}" y2="${cy+26}" ${s}/>`;
  if (lines.includes('c')) content += `<circle cx="${cx}" cy="${cy}" r="18" fill="none" ${s}/>`;
  return content;
}

function svgOptionLines(lines) {
  return `
    <svg viewBox="0 0 80 80" class="opt-svg">
      <rect x="5" y="5" width="70" height="70" rx="8" fill="var(--card-bg)" stroke="var(--border)" stroke-width="1.5"/>
      ${svgLines(40, 40, lines)}
    </svg>
  `;
}

function svgDotBox(cx, cy, p1, p2) {
  function pos(p) {
    if (p === 'TL') return [cx - 24, cy - 24];
    if (p === 'TR') return [cx + 24, cy - 24];
    if (p === 'BR') return [cx + 24, cy + 24];
    if (p === 'BL') return [cx - 24, cy + 24];
    return [cx, cy];
  }
  const [x1, y1] = pos(p1);
  const [x2, y2] = pos(p2);
  return `
    <rect x="${cx - 34}" y="${cy - 34}" width="68" height="68" rx="8" fill="var(--shape-bg)" stroke="var(--border)" stroke-width="1.5"/>
    <circle cx="${x1}" cy="${y1}" r="7" fill="var(--primary)"/>
    <circle cx="${x2}" cy="${y2}" r="7" fill="none" stroke="var(--danger)" stroke-width="3"/>
  `;
}

function svgOptionDotBox(p1, p2) {
  return `<svg viewBox="0 0 80 80" class="opt-svg">${svgDotBox(40, 40, p1, p2)}</svg>`;
}

function svgNest(cx, cy, outer, inner) {
  function drawShape(type, size, isInner) {
    const fill = isInner ? 'var(--primary)' : 'var(--card-bg)';
    const stroke = 'var(--primary)';
    if (type === 'circle') return `<circle cx="${cx}" cy="${cy}" r="${size}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`;
    if (type === 'poly3' || type === 3) return `<polygon points="${cx},${cy - size} ${cx + size*0.9},${cy + size*0.7} ${cx - size*0.9},${cy + size*0.7}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`;
    if (type === 'poly4' || type === 4) return `<rect x="${cx - size*0.8}" y="${cy - size*0.8}" width="${size*1.6}" height="${size*1.6}" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`;
    if (type === 'poly5' || type === 5) {
      let pts = [];
      for (let i = 0; i < 5; i++) {
        let a = (i * 72 - 90) * Math.PI / 180;
        pts.push(`${cx + size * Math.cos(a)},${cy + size * Math.sin(a)}`);
      }
      return `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`;
    }
    if (type === 'poly6' || type === 6) {
      let pts = [];
      for (let i = 0; i < 6; i++) {
        let a = (i * 60) * Math.PI / 180;
        pts.push(`${cx + size * Math.cos(a)},${cy + size * Math.sin(a)}`);
      }
      return `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`;
    }
    return '';
  }
  return `
    ${drawShape(outer, 32, false)}
    ${drawShape(inner, 14, true)}
  `;
}

function svgOptionNest(outer, inner) {
  return `<svg viewBox="0 0 80 80" class="opt-svg">${svgNest(40, 40, outer, inner)}</svg>`;
}

function svgNumberTriangle(a, b, c, center) {
  return `
    <div class="tri-item">
      <svg viewBox="0 0 140 130" class="tri-svg">
        <polygon points="70,15 130,115 10,115" fill="var(--card-bg)" stroke="var(--primary)" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="70" cy="15" r="16" fill="var(--primary)" />
        <text x="70" y="21" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">${a}</text>
        <circle cx="10" cy="115" r="16" fill="var(--primary)" />
        <text x="10" y="121" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">${b}</text>
        <circle cx="130" cy="115" r="16" fill="var(--primary)" />
        <text x="130" y="121" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">${c}</text>
        <text x="70" y="86" font-size="24" font-weight="bold" fill="var(--primary-dark)" text-anchor="middle">${center}</text>
      </svg>
    </div>
  `;
}

function svgNetCell(x, y, sym) {
  let s = '';
  if (sym === 'circle') s = `<circle cx="${x+20}" cy="${y+20}" r="11" fill="var(--primary)"/>`;
  if (sym === 'square') s = `<rect x="${x+10}" y="${y+10}" width="20" height="20" fill="var(--primary)"/>`;
  if (sym === 'cross') s = `<line x1="${x+10}" y1="${y+20}" x2="${x+30}" y2="${y+20}" stroke="var(--primary)" stroke-width="4"/><line x1="${x+20}" y1="${y+10}" x2="${x+20}" y2="${y+30}" stroke="var(--primary)" stroke-width="4"/>`;
  if (sym === 'star') s = `<polygon points="${x+20},${y+7} ${x+24},${y+16} ${x+33},${y+17} ${x+26},${y+23} ${x+29},${y+32} ${x+20},${y+27} ${x+11},${y+32} ${x+14},${y+23} ${x+7},${y+17} ${x+16},${y+16}" fill="var(--primary)"/>`;
  if (sym === 'triangle') s = `<polygon points="${x+20},${y+8} ${x+32},${y+30} ${x+8},${y+30}" fill="var(--primary)"/>`;
  if (sym === 'wave') s = `<circle cx="${x+20}" cy="${y+20}" r="8" fill="none" stroke="var(--primary)" stroke-width="3"/>`;
  return `
    <rect x="${x}" y="${y}" width="40" height="40" fill="var(--card-bg)" stroke="var(--border)" stroke-width="2"/>
    ${s}
  `;
}

function svgCubeOption(top, front, right, isCorrect) {
  return `
    <svg viewBox="0 0 100 100" class="cube-svg">
      <!-- Isometrischer Würfel -->
      <!-- Oben -->
      <polygon points="50,15 85,35 50,55 15,35" fill="var(--cube-top)" stroke="var(--cube-edge)" stroke-width="2"/>
      <!-- Links/Vorne -->
      <polygon points="15,35 50,55 50,90 15,70" fill="var(--cube-left)" stroke="var(--cube-edge)" stroke-width="2"/>
      <!-- Rechts -->
      <polygon points="50,55 85,35 85,70 50,90" fill="var(--cube-right)" stroke="var(--cube-edge)" stroke-width="2"/>
      
      <!-- Symbole auf Flächen -->
      <text x="50" y="40" font-size="14" font-weight="bold" fill="var(--primary)" text-anchor="middle">${top === 'circle' ? '●' : (top === 'star' ? '★' : '▲')}</text>
      <text x="32" y="68" font-size="14" font-weight="bold" fill="var(--primary)" text-anchor="middle">${front === 'square' ? '■' : (front === 'triangle' ? '▲' : '✚')}</text>
      <text x="68" y="68" font-size="14" font-weight="bold" fill="var(--primary)" text-anchor="middle">${right === 'cross' ? '✚' : (right === 'star' ? '★' : '■')}</text>
    </svg>
  `;
}

function svgLBlock(cx, cy, rot, mirrored) {
  const trans = `translate(${cx}, ${cy}) rotate(${rot}) scale(${mirrored ? -1 : 1}, 1) translate(-48, -37)`;
  return `
    <g transform="${trans}">
      <rect x="15" y="15" width="22" height="22" fill="#4a7bf7" stroke="#1d3f9e" stroke-width="1.5"/>
      <rect x="37" y="15" width="22" height="22" fill="#3b6ee8" stroke="#1d3f9e" stroke-width="1.5"/>
      <rect x="59" y="15" width="22" height="22" fill="#2d5ed6" stroke="#1d3f9e" stroke-width="1.5"/>
      <rect x="59" y="37" width="22" height="22" fill="#ff7043" stroke="#b03209" stroke-width="1.5"/>
    </g>
  `;
}

function svgOptionLBlock(rot, mirrored) {
  return `<svg viewBox="0 0 80 80" class="opt-svg">${svgLBlock(40, 40, rot, mirrored)}</svg>`;
}

function svgCubeStack() {
  // Isometrische Treppe aus 14 Würfeln
  return `
    <g transform="translate(100, 30)">
      <!-- Reihe 1 (Höhe 3, 2, 1) -->
      ${isoCube(0, -20, 0)} ${isoCube(0, -20, 1)} ${isoCube(0, -20, 2)}
      ${isoCube(25, -6, 0)} ${isoCube(25, -6, 1)}
      ${isoCube(50, 8, 0)}
      
      <!-- Reihe 2 (Höhe 2, 2, 1) -->
      ${isoCube(-25, -6, 0)} ${isoCube(-25, -6, 1)}
      ${isoCube(0, 8, 0)} ${isoCube(0, 8, 1)}
      ${isoCube(25, 22, 0)}
      
      <!-- Reihe 3 (Höhe 1, 1, 1) -->
      ${isoCube(-50, 8, 0)}
      ${isoCube(-25, 22, 0)}
      ${isoCube(0, 36, 0)}
    </g>
  `;
}

function isoCube(x, y, level) {
  const cy = y - level * 20;
  return `
    <g transform="translate(${x}, ${cy})">
      <polygon points="0,-12 20,0 0,12 -20,0" fill="#a4c2f4" stroke="#3c78d8" stroke-width="1.2"/>
      <polygon points="-20,0 0,12 0,32 -20,20" fill="#6d9eeb" stroke="#3c78d8" stroke-width="1.2"/>
      <polygon points="0,12 20,0 20,20 0,32" fill="#3c78d8" stroke="#1c4587" stroke-width="1.2"/>
    </g>
  `;
}

function svgOrthoFigure() {
  // Grundriss [[1, 1, 0], [1, 0, 0], [1, 1, 1]] auf 3x3-Basis
  // +c = (+20, +12), +r = (-20, +12), Boden bei y+20
  let base = '';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const bx = (c - r) * 20;
      const by = (c + r) * 12 + 20;
      base += `<polygon points="${bx},${by - 12} ${bx + 20},${by} ${bx},${by + 12} ${bx - 20},${by}" fill="none" stroke="var(--border)" stroke-width="1" stroke-dasharray="2,2"/>`;
    }
  }
  return `
    <g transform="translate(90, 48)">
      ${base}
      ${isoCube(0, 0, 0)} ${isoCube(0, 0, 1)}
      ${isoCube(20, 12, 0)}
      ${isoCube(-20, 12, 0)}
      ${isoCube(-40, 24, 0)}
      ${isoCube(-20, 36, 0)}
      ${isoCube(0, 48, 0)} ${isoCube(0, 48, 1)}
    </g>
  `;
}

function svgPlanView(grid) {
  let cells = '';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let active = grid[r][c];
      cells += `
        <rect x="${15 + c * 20}" y="${15 + r * 20}" width="19" height="19" rx="2"
          fill="${active ? 'var(--primary)' : 'var(--card-bg)'}"
          stroke="var(--border)" stroke-width="1.5"/>
      `;
    }
  }
  return `
    <svg viewBox="0 0 90 90" class="plan-svg">
      ${cells}
    </svg>
  `;
}
