/* ==========================================================================
   Sachkunde-Illustrationen (Inline-SVGs, 100 % offline, kindgerecht & scharf)
   ========================================================================== */

window.SachkundeArt = (function () {
  function escapeSvgText(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* 1. Aufbau einer Getreidepflanze (Aufgabe 1) */
  function getGrainPlantSVG() {
    // 6 nummerierte Punkte:
    // Links:  1 = Grannen (oben), 2 = Blatt (mitte), 3 = Wurzel (unten)
    // Rechts: 4 = Ähre (oben), 5 = Halmknoten (mitte), 6 = Halm (unten)
    return `
      <svg class="diagram-svg" viewBox="0 0 360 400" role="img" aria-label="Zeichnung einer Getreidepflanze mit sechs nummerierten Stellen zum Beschriften">
        <defs>
          <linearGradient id="grainSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f3f9fd"/>
            <stop offset="100%" stop-color="#fcf8ec"/>
          </linearGradient>
          <linearGradient id="grainSoil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#9e6d40"/>
            <stop offset="100%" stop-color="#6e4726"/>
          </linearGradient>
          <linearGradient id="wheatGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f6cc5e"/>
            <stop offset="100%" stop-color="#c98520"/>
          </linearGradient>
          <linearGradient id="stemGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#b49c45"/>
            <stop offset="50%" stop-color="#dfc35f"/>
            <stop offset="100%" stop-color="#9b8233"/>
          </linearGradient>
        </defs>

        <!-- Hintergrund Himmel & Erde -->
        <rect x="18" y="8" width="324" height="384" rx="18" fill="url(#grainSky)" stroke="#e2d7c0" stroke-width="2"/>
        <path d="M18 304 Q100 297 180 303 Q260 309 342 302 L342 374 Q342 392 324 392 L36 392 Q18 392 18 374 Z" fill="url(#grainSoil)"/>
        <!-- Kleine Steinchen im Boden -->
        <ellipse cx="98" cy="336" rx="5" ry="3" fill="#7c522d" opacity="0.7"/>
        <ellipse cx="262" cy="356" rx="6" ry="3.5" fill="#5e3c1f" opacity="0.65"/>
        <ellipse cx="230" cy="322" rx="4" ry="2.5" fill="#b48456" opacity="0.6"/>
        <ellipse cx="112" cy="368" rx="4.5" ry="2.5" fill="#5e3c1f" opacity="0.6"/>

        <!-- Grasbüschel auf der Bodenlinie -->
        <path d="M150 304 Q144 291 138 287 M154 304 Q152 292 156 284 M206 304 Q212 290 218 286 M202 304 Q205 293 200 286" stroke="#5b9647" stroke-width="2.5" stroke-linecap="round" fill="none"/>

        <!-- Büschelwurzeln (Wurzel) -->
        <g stroke="#e6cfa5" stroke-width="2.4" stroke-linecap="round" fill="none">
          <path d="M180 305 Q172 332 150 356 Q142 365 130 374"/>
          <path d="M180 305 Q162 325 134 342 Q122 348 112 356"/>
          <path d="M180 305 Q176 340 168 376"/>
          <path d="M180 305 Q186 340 194 378"/>
          <path d="M180 305 Q198 330 220 358 Q232 370 242 376"/>
          <path d="M180 305 Q204 322 234 338"/>
          <!-- Feine Nebenwurzeln -->
          <path d="M155 349 Q142 352 135 360" stroke-width="1.6"/>
          <path d="M162 328 Q148 328 140 332" stroke-width="1.6"/>
          <path d="M192 348 Q206 355 215 366" stroke-width="1.6"/>
          <path d="M206 325 Q220 326 228 322" stroke-width="1.6"/>
          <path d="M174 352 Q165 362 158 372" stroke-width="1.6"/>
        </g>

        <!-- Langer Halm -->
        <rect x="176" y="132" width="8" height="174" rx="3" fill="url(#stemGrad)"/>

        <!-- Zwei deutliche Halmknoten -->
        <g>
          <rect x="173" y="191" width="14" height="8" rx="4" fill="#9a7d2b" stroke="#755c18" stroke-width="1.3"/>
          <rect x="173" y="250" width="14" height="8" rx="4" fill="#9a7d2b" stroke="#755c18" stroke-width="1.3"/>
        </g>

        <!-- Lange schmale Blätter -->
        <!-- Linkes Blatt (am unteren Knoten entspringend, schön geschwungen) -->
        <path d="M176 254 C150 236 122 224 96 228 C118 214 148 218 176 244 Z" fill="#6ca346" stroke="#46732a" stroke-width="1.5"/>
        <path d="M174 249 C148 232 124 224 102 226" stroke="#8dc265" stroke-width="1.2" fill="none"/>
        <!-- Rechtes Blatt (am oberen Knoten entspringend) -->
        <path d="M184 196 C210 176 238 164 264 170 C240 156 210 160 184 186 Z" fill="#77b04e" stroke="#46732a" stroke-width="1.5"/>
        <path d="M186 191 C212 173 234 166 256 168" stroke="#9cd173" stroke-width="1.2" fill="none"/>

        <!-- Grannen (feine lange Härchen oben an der Ähre) -->
        <g stroke="#c48a20" stroke-width="1.7" stroke-linecap="round" fill="none">
          <path d="M172 68 Q162 40 156 16"/>
          <path d="M176 62 Q170 36 168 12"/>
          <path d="M180 58 Q180 32 180 10"/>
          <path d="M184 62 Q190 36 192 12"/>
          <path d="M188 68 Q198 40 204 16"/>
          <path d="M168 82 Q154 54 146 28"/>
          <path d="M192 82 Q206 54 214 28"/>
          <path d="M167 98 Q152 72 142 46"/>
          <path d="M193 98 Q208 72 218 46"/>
        </g>

        <!-- Ähre (geschichtete goldene Ährchen) -->
        <g fill="url(#wheatGold)" stroke="#9a6412" stroke-width="1.4">
          <ellipse cx="174" cy="126" rx="7.5" ry="11" transform="rotate(-18 174 126)"/>
          <ellipse cx="186" cy="126" rx="7.5" ry="11" transform="rotate(18 186 126)"/>
          <ellipse cx="173" cy="113" rx="7.5" ry="11.5" transform="rotate(-20 173 113)"/>
          <ellipse cx="187" cy="113" rx="7.5" ry="11.5" transform="rotate(20 187 113)"/>
          <ellipse cx="173" cy="99" rx="7.5" ry="11.5" transform="rotate(-18 173 99)"/>
          <ellipse cx="187" cy="99" rx="7.5" ry="11.5" transform="rotate(18 187 99)"/>
          <ellipse cx="174" cy="86" rx="7" ry="11" transform="rotate(-16 174 86)"/>
          <ellipse cx="186" cy="86" rx="7" ry="11" transform="rotate(16 186 86)"/>
          <ellipse cx="175" cy="73" rx="6.5" ry="10" transform="rotate(-12 175 73)"/>
          <ellipse cx="185" cy="73" rx="6.5" ry="10" transform="rotate(12 185 73)"/>
          <ellipse cx="180" cy="61" rx="6" ry="10"/>
        </g>

        <!-- Hinweislinien & Nummern-Pins (1-3 links, 4-6 rechts) -->
        <g class="leader-lines" stroke="#334155" stroke-width="2" stroke-dasharray="4 3" fill="none">
          <!-- 1: Grannen -->
          <path d="M36 56 L112 56 L158 34"/>
          <!-- 2: Blatt -->
          <path d="M36 206 L94 206 L124 222"/>
          <!-- 3: Wurzel -->
          <path d="M36 346 L110 346 L146 348"/>
          <!-- 4: Ähre -->
          <path d="M324 56 L248 56 L195 92"/>
          <!-- 5: Halmknoten -->
          <path d="M324 195 L252 195 L190 195"/>
          <!-- 6: Halm -->
          <path d="M324 346 L256 346 L186 280"/>
        </g>

        <!-- Zielpunkte auf der Pflanze -->
        <g fill="#2e6f40" stroke="#ffffff" stroke-width="2">
          <circle cx="158" cy="34" r="5"/>
          <circle cx="124" cy="222" r="5"/>
          <circle cx="146" cy="348" r="5"/>
          <circle cx="195" cy="92" r="5"/>
          <circle cx="190" cy="195" r="5"/>
          <circle cx="186" cy="280" r="5"/>
        </g>

        <!-- Nummerierte Badges an den Linien-Enden -->
        ${[
          { n: "1", x: 34, y: 56 },
          { n: "2", x: 34, y: 206 },
          { n: "3", x: 34, y: 346 },
          { n: "4", x: 326, y: 56 },
          { n: "5", x: 326, y: 195 },
          { n: "6", x: 326, y: 346 }
        ]
          .map(
            (b) => `
          <g>
            <circle cx="${b.x}" cy="${b.y}" r="14" fill="#2e6f40" stroke="#ffffff" stroke-width="2.5"/>
            <text x="${b.x}" y="${b.y + 5}" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800" font-family="system-ui, sans-serif">${b.n}</text>
          </g>`
          )
          .join("")}
      </svg>
    `;
  }

  /* 2. Einzel-Illustrationen der 5 Getreidesorten (Aufgabe 2) */
  function getGrainVarietySVG(type) {
    if (type === "weizen") {
      // Kompakte, dicke goldene Ähre ohne lange Grannen
      return `
        <svg class="variety-svg" viewBox="0 0 120 140" role="img" aria-label="Getreidesorte mit dicker, kompakter Ähre ohne lange Grannen">
          <rect x="4" y="4" width="112" height="132" rx="14" fill="#fdf8ec" stroke="#eadcc2" stroke-width="2"/>
          <rect x="57" y="92" width="6" height="40" rx="2" fill="#c9a544"/>
          <g fill="#efc048" stroke="#9f6c16" stroke-width="1.3">
            <ellipse cx="54" cy="90" rx="7.5" ry="10.5" transform="rotate(-16 54 90)"/>
            <ellipse cx="66" cy="90" rx="7.5" ry="10.5" transform="rotate(16 66 90)"/>
            <ellipse cx="53" cy="76" rx="8" ry="11" transform="rotate(-18 53 76)"/>
            <ellipse cx="67" cy="76" rx="8" ry="11" transform="rotate(18 67 76)"/>
            <ellipse cx="53" cy="62" rx="8" ry="11" transform="rotate(-16 53 62)"/>
            <ellipse cx="67" cy="62" rx="8" ry="11" transform="rotate(16 67 62)"/>
            <ellipse cx="54" cy="48" rx="7.5" ry="10.5" transform="rotate(-14 54 48)"/>
            <ellipse cx="66" cy="48" rx="7.5" ry="10.5" transform="rotate(14 66 48)"/>
            <ellipse cx="56" cy="36" rx="6.5" ry="9.5" transform="rotate(-10 56 36)"/>
            <ellipse cx="64" cy="36" rx="6.5" ry="9.5" transform="rotate(10 64 36)"/>
            <ellipse cx="60" cy="26" rx="6" ry="9"/>
          </g>
        </svg>`;
    }

    if (type === "roggen") {
      // Lange, schlanke, leicht geneigte Ähre mit mittellangen Grannen
      return `
        <svg class="variety-svg" viewBox="0 0 120 140" role="img" aria-label="Getreidesorte mit langer, schmaler, leicht gebogener Ähre und mittellangen Grannen">
          <rect x="4" y="4" width="112" height="132" rx="14" fill="#f7f9ef" stroke="#dce4c9" stroke-width="2"/>
          <path d="M56 132 Q58 106 60 88" stroke="#9aa354" stroke-width="5" stroke-linecap="round" fill="none"/>
          <g transform="rotate(9 60 82)">
            <!-- Mittellange Grannen -->
            <g stroke="#8e9444" stroke-width="1.3" stroke-linecap="round">
              <path d="M55 24 L50 8"/><path d="M60 20 L60 5"/><path d="M65 24 L70 8"/>
              <path d="M53 38 L45 18"/><path d="M67 38 L75 18"/>
              <path d="M53 54 L44 34"/><path d="M67 54 L76 34"/>
              <path d="M53 70 L45 52"/><path d="M67 70 L75 52"/>
            </g>
            <g fill="#c9cb72" stroke="#7d8335" stroke-width="1.2">
              <ellipse cx="56" cy="84" rx="4.5" ry="9" transform="rotate(-12 56 84)"/>
              <ellipse cx="64" cy="84" rx="4.5" ry="9" transform="rotate(12 64 84)"/>
              <ellipse cx="56" cy="72" rx="4.5" ry="9" transform="rotate(-12 56 72)"/>
              <ellipse cx="64" cy="72" rx="4.5" ry="9" transform="rotate(12 64 72)"/>
              <ellipse cx="56" cy="60" rx="4.5" ry="9" transform="rotate(-12 56 60)"/>
              <ellipse cx="64" cy="60" rx="4.5" ry="9" transform="rotate(12 64 60)"/>
              <ellipse cx="56" cy="48" rx="4.5" ry="8.5" transform="rotate(-12 56 48)"/>
              <ellipse cx="64" cy="48" rx="4.5" ry="8.5" transform="rotate(12 64 48)"/>
              <ellipse cx="56" cy="37" rx="4" ry="8" transform="rotate(-10 56 37)"/>
              <ellipse cx="64" cy="37" rx="4" ry="8" transform="rotate(10 64 37)"/>
              <ellipse cx="60" cy="27" rx="4" ry="7.5"/>
            </g>
          </g>
        </svg>`;
    }

    if (type === "gerste") {
      // Ähre mit auffällig SEHR LANGEN Grannen (wie ein langer Bart!)
      return `
        <svg class="variety-svg" viewBox="0 0 120 140" role="img" aria-label="Getreidesorte mit besonders langen Grannen an der Ähre">
          <rect x="4" y="4" width="112" height="132" rx="14" fill="#fef7eb" stroke="#edd8b4" stroke-width="2"/>
          <rect x="57.5" y="102" width="5" height="30" rx="2" fill="#c79e3e"/>
          <!-- Sehr lange auffällige Grannen -->
          <g stroke="#c0801a" stroke-width="1.5" stroke-linecap="round" fill="none">
            <path d="M53 96 Q36 52 28 10"/>
            <path d="M54 84 Q42 44 38 9"/>
            <path d="M55 72 Q48 38 48 8"/>
            <path d="M58 64 Q56 34 56 7"/>
            <path d="M62 64 Q64 34 64 7"/>
            <path d="M65 72 Q72 38 72 8"/>
            <path d="M66 84 Q78 44 82 9"/>
            <path d="M67 96 Q84 52 92 10"/>
          </g>
          <g fill="#f0bd42" stroke="#9e6612" stroke-width="1.2">
            <ellipse cx="55" cy="96" rx="6" ry="9" transform="rotate(-14 55 96)"/>
            <ellipse cx="65" cy="96" rx="6" ry="9" transform="rotate(14 65 96)"/>
            <ellipse cx="55" cy="84" rx="6" ry="9" transform="rotate(-14 55 84)"/>
            <ellipse cx="65" cy="84" rx="6" ry="9" transform="rotate(14 65 84)"/>
            <ellipse cx="55" cy="72" rx="5.5" ry="8.5" transform="rotate(-12 55 72)"/>
            <ellipse cx="65" cy="72" rx="5.5" ry="8.5" transform="rotate(12 65 72)"/>
            <ellipse cx="60" cy="61" rx="5.5" ry="8.5"/>
          </g>
        </svg>`;
    }

    if (type === "hafer") {
      // Lockere, verzweigte Rispe mit hängenden Körner-Glöckchen
      return `
        <svg class="variety-svg" viewBox="0 0 120 140" role="img" aria-label="Getreidesorte mit luftiger, verzweigter Rispe und hängenden Körnern">
          <rect x="4" y="4" width="112" height="132" rx="14" fill="#f5faf4" stroke="#cfe3ce" stroke-width="2"/>
          <!-- Mittelhalm & feine Ästchen der Rispe -->
          <g stroke="#7d9d47" stroke-width="2.2" stroke-linecap="round" fill="none">
            <path d="M60 132 L60 24"/>
            <path d="M60 88 Q40 82 26 94"/>
            <path d="M60 88 Q80 82 94 94"/>
            <path d="M60 66 Q42 58 28 70"/>
            <path d="M60 66 Q78 58 92 70"/>
            <path d="M60 44 Q46 38 36 48"/>
            <path d="M60 44 Q74 38 84 48"/>
          </g>
          <!-- Hängende Körner / Ährchen -->
          <g fill="#e5c75d" stroke="#8f7822" stroke-width="1.2">
            <ellipse cx="24" cy="100" rx="4.5" ry="8" transform="rotate(14 24 100)"/>
            <ellipse cx="40" cy="91" rx="4.2" ry="7.5" transform="rotate(8 40 91)"/>
            <ellipse cx="96" cy="100" rx="4.5" ry="8" transform="rotate(-14 96 100)"/>
            <ellipse cx="80" cy="91" rx="4.2" ry="7.5" transform="rotate(-8 80 91)"/>
            <ellipse cx="26" cy="76" rx="4.5" ry="8" transform="rotate(14 26 76)"/>
            <ellipse cx="44" cy="68" rx="4" ry="7.2" transform="rotate(6 44 68)"/>
            <ellipse cx="94" cy="76" rx="4.5" ry="8" transform="rotate(-14 94 76)"/>
            <ellipse cx="76" cy="68" rx="4" ry="7.2" transform="rotate(-6 76 68)"/>
            <ellipse cx="35" cy="54" rx="4.2" ry="7.5" transform="rotate(12 35 54)"/>
            <ellipse cx="85" cy="54" rx="4.2" ry="7.5" transform="rotate(-12 85 54)"/>
            <ellipse cx="60" cy="24" rx="4.5" ry="8"/>
          </g>
        </svg>`;
    }

    // Mais: großer gelber Kolben mit grünen Hüllblättern
    return `
      <svg class="variety-svg" viewBox="0 0 120 140" role="img" aria-label="Getreidesorte mit dickem gelbem Kolben und grünen Hüllblättern">
        <rect x="4" y="4" width="112" height="132" rx="14" fill="#fefbe8" stroke="#ebe1a7" stroke-width="2"/>
        <!-- Maisfäden oben -->
        <g stroke="#b87c2a" stroke-width="1.6" stroke-linecap="round" fill="none">
          <path d="M56 26 Q52 16 46 12"/>
          <path d="M60 24 Q60 14 60 10"/>
          <path d="M64 26 Q68 16 74 12"/>
        </g>
        <!-- Gelber Kolben -->
        <rect x="42" y="24" width="36" height="86" rx="17" fill="#facc15" stroke="#b45309" stroke-width="1.8"/>
        <!-- Maiskörner-Reihen -->
        <g fill="#fde047" stroke="#ca8a04" stroke-width="1">
          ${[34, 45, 56, 67, 78, 89]
            .map(
              (y) => `
            <rect x="46" y="${y}" width="8" height="8.5" rx="3"/>
            <rect x="56" y="${y}" width="8" height="8.5" rx="3"/>
            <rect x="66" y="${y}" width="8" height="8.5" rx="3"/>`
            )
            .join("")}
        </g>
        <!-- Grüne Hüllblätter links & rechts -->
        <path d="M58 128 C34 118 22 92 26 56 C38 74 44 98 54 114 Z" fill="#4d9a43" stroke="#2d6627" stroke-width="1.6"/>
        <path d="M62 128 C86 118 98 92 94 56 C82 74 76 98 66 114 Z" fill="#5cb04f" stroke="#2d6627" stroke-width="1.6"/>
        <path d="M50 124 L60 132 L70 124 L65 110 L55 110 Z" fill="#3c7e34"/>
      </svg>`;
  }

  /* 3. Landkarte: Die Reise der Kartoffel (Aufgabe 9) */
  function getPotatoMapSVG(slotValues, activeSlotId, reviewStatuses) {
    const vals = slotValues || {};
    const rev = reviewStatuses || {};

    // 8 Marker: A, B, C (Kontinente & Meer) + 1..5 (Stationen auf der Reise)
    const geoPins = [
      { id: "m_sa", code: "A", x: 215, y: 318, placeholder: "Kontinent A" },
      { id: "m_atl", code: "B", x: 386, y: 292, placeholder: "Ozean B" },
      { id: "m_eu", code: "C", x: 758, y: 54, placeholder: "Kontinent C" }
    ];

    const routePins = [
      { id: "m_peru", num: "1", x: 142, y: 258, labelDx: 0, labelDy: -26 },
      { id: "m_esp", num: "2", x: 562, y: 248, labelDx: -6, labelDy: 28 },
      { id: "m_eng", num: "3", x: 590, y: 122, labelDx: -18, labelDy: -26 },
      { id: "m_fra", num: "4", x: 646, y: 196, labelDx: 4, labelDy: 28 },
      { id: "m_deu", num: "5", x: 752, y: 146, labelDx: 14, labelDy: -26 }
    ];

    function pinStyle(id, isGeo) {
      const status = rev[id];
      const isActive = activeSlotId === id;
      const filled = Boolean(vals[id]);
      if (status === "good") return { bg: "#16a34a", stroke: "#ffffff", text: "#ffffff", pillBg: "#dcfce7", pillBorder: "#16a34a", pillText: "#14532d" };
      if (status === "bad") return { bg: "#dc2626", stroke: "#ffffff", text: "#ffffff", pillBg: "#fee2e2", pillBorder: "#dc2626", pillText: "#7f1d1d" };
      if (isActive) return { bg: "#d97706", stroke: "#fef3c7", text: "#ffffff", pillBg: "#fef3c7", pillBorder: "#d97706", pillText: "#78350f" };
      if (filled) return { bg: "#2e6f40", stroke: "#ffffff", text: "#ffffff", pillBg: "#eef8f0", pillBorder: "#2e6f40", pillText: "#1b4332" };
      return isGeo
        ? { bg: "#0369a1", stroke: "#ffffff", text: "#ffffff", pillBg: "#ffffff", pillBorder: "#0369a1", pillText: "#0c4a6e" }
        : { bg: "#b45309", stroke: "#ffffff", text: "#ffffff", pillBg: "#ffffff", pillBorder: "#b45309", pillText: "#78350f" };
    }

    const shortLabel = (val) => {
      if (!val) return "";
      if (val.length <= 16) return val;
      if (val.startsWith("Deutschland")) return "Deutschland";
      return val.slice(0, 15) + "…";
    };

    return `
      <svg class="map-svg" viewBox="0 0 920 400" role="img" aria-label="Landkarte zur Reise der Kartoffel von Südamerika über den Atlantik nach Europa mit 8 anklickbaren Stellen">
        <defs>
          <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#cbe7fa"/>
            <stop offset="100%" stop-color="#a5d5f5"/>
          </linearGradient>
          <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#e9efd0"/>
            <stop offset="100%" stop-color="#d4dfb0"/>
          </linearGradient>
          <marker id="routeArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
            <path d="M0 1 L10 5 L0 9 z" fill="#b91c1c"/>
          </marker>
        </defs>

        <!-- Meer -->
        <rect x="2" y="2" width="916" height="396" rx="18" fill="url(#oceanGrad)" stroke="#7fb7dc" stroke-width="2.5"/>

        <!-- Sanfte Wellenlinien im Atlantik -->
        <g stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.45" fill="none">
          <path d="M310 110 Q325 104 340 110 Q355 116 370 110"/>
          <path d="M420 155 Q435 149 450 155 Q465 161 480 155"/>
          <path d="M300 345 Q315 339 330 345 Q345 351 360 345"/>
          <path d="M440 340 Q455 334 470 340 Q485 346 500 340"/>
        </g>

        <!-- Nord- und Mittelamerika (Orientierung links oben) -->
        <path d="M2 2 L240 2 C230 38 205 64 172 82 C142 98 118 118 112 142 C108 158 124 170 144 176 L116 184 C88 170 52 146 2 128 Z" fill="#eef1dc" stroke="#a7b887" stroke-width="2"/>

        <!-- Südamerika (links) -->
        <path d="M138 176 C168 170 210 184 246 206 C282 228 294 258 276 292 C258 326 232 362 204 396 L168 396 C158 364 142 332 122 296 C106 266 106 212 138 176 Z" fill="url(#landGrad)" stroke="#8fa668" stroke-width="2.4"/>

        <!-- Anden-Gebirge in Südamerika -->
        <g fill="#b5895a" stroke="#7c5630" stroke-width="1.3">
          <polygon points="122,226 134,204 146,226"/>
          <polygon points="118,256 132,230 146,256"/>
          <polygon points="128,288 142,262 156,288"/>
          <polygon points="140,320 154,296 168,320"/>
          <polygon points="154,352 166,330 178,352"/>
        </g>

        <!-- Nordafrika (Orientierung rechts unten) -->
        <path d="M510 318 C578 302 666 308 756 322 C822 332 872 342 918 334 L918 398 L502 398 C494 370 496 334 510 318 Z" fill="#efe6ca" stroke="#c0ae7a" stroke-width="2"/>

        <!-- Europa (großzügig & klar erkennbar dargestellt) -->
        <!-- Großbritannien / England (Insel) -->
        <path d="M566 86 C582 70 606 74 614 96 C622 118 628 136 614 148 C596 156 574 152 562 142 C558 124 554 102 566 86 Z" fill="url(#landGrad)" stroke="#8fa668" stroke-width="2.2"/>
        <!-- Irland (kleine Nebeninsel) -->
        <ellipse cx="536" cy="118" rx="15" ry="18" fill="url(#landGrad)" stroke="#8fa668" stroke-width="1.8"/>

        <!-- Festland-Europa (Spanien, Frankreich, Deutschland/Preußen, Italien, Osten) -->
        <path d="
          M524 226
          C540 206 584 204 606 206
          C614 190 618 166 638 156
          C662 146 688 142 706 124
          C722 108 740 82 770 80
          C806 78 858 70 918 60
          L918 266
          C880 264 850 256 822 246
          C802 256 792 276 776 286
          C758 278 752 258 742 242
          C726 254 718 276 704 288
          C692 276 688 250 676 238
          C650 242 628 242 608 258
          C588 278 548 286 522 274
          C512 258 514 238 524 226 Z"
          fill="url(#landGrad)" stroke="#8fa668" stroke-width="2.4"/>

        <!-- Skandinavien (Orientierung ganz oben rechts) -->
        <path d="M686 2 L846 2 C830 28 796 52 762 62 C730 68 696 56 682 34 C676 22 678 10 686 2 Z" fill="#e6ecd0" stroke="#9eb17a" stroke-width="1.8"/>

        <!-- Dezente Ländergrenzen in Europa zur Orientierung -->
        <g stroke="#7d9458" stroke-width="1.6" stroke-dasharray="4 4" fill="none" opacity="0.75">
          <!-- Pyrenäen (Spanien / Frankreich) -->
          <path d="M598 206 Q616 224 624 246"/>
          <!-- Rhein / Grenze Frankreich / Deutschland -->
          <path d="M694 136 Q698 174 690 218"/>
          <!-- Ostgrenze Deutschland / Preußen -->
          <path d="M806 84 Q814 138 802 192"/>
          <!-- Südgrenze Deutschland -->
          <path d="M692 196 Q748 202 802 190"/>
        </g>

        <!-- Kompassrose unten links im Meer -->
        <g transform="translate(58 342)" opacity="0.78">
          <circle cx="0" cy="0" r="24" fill="#ffffff" fill-opacity="0.7" stroke="#4c7a9c" stroke-width="1.6"/>
          <polygon points="0,-20 5,-4 0,-8 -5,-4" fill="#b91c1c"/>
          <polygon points="0,20 5,4 0,8 -5,4" fill="#4c7a9c"/>
          <polygon points="20,0 4,5 8,0 4,-5" fill="#4c7a9c"/>
          <polygon points="-20,0 -4,5 -8,0 -4,-5" fill="#4c7a9c"/>
          <text x="0" y="-27" text-anchor="middle" font-size="11" font-weight="800" fill="#1e3a5f" font-family="system-ui, sans-serif">N</text>
        </g>

        <!-- Reiseroute mit Pfeilen -->
        <g fill="none" stroke="#b91c1c" stroke-width="3.2" stroke-dasharray="8 6" stroke-linecap="round">
          <!-- 1 (Peru) -> 2 (Spanien) über den Atlantik -->
          <path d="M160 250 C268 186 418 190 540 242" marker-end="url(#routeArrow)"/>
          <!-- 2 (Spanien) -> 3 (England) -->
          <path d="M558 228 C548 192 558 164 576 142" marker-end="url(#routeArrow)"/>
          <!-- 2 (Spanien) -> 4 (Frankreich) -->
          <path d="M582 238 C604 226 618 216 632 206" marker-end="url(#routeArrow)"/>
          <!-- 4 (Frankreich) -> 5 (Deutschland/Preußen) -->
          <path d="M664 186 C692 174 714 164 734 154" marker-end="url(#routeArrow)"/>
          <!-- 3 (England) -> 5 (Deutschland/Preußen) leichte Nebenroute -->
          <path d="M612 126 C654 124 696 130 732 140" stroke-width="2.2" opacity="0.65"/>
        </g>

        <!-- Kleines historisches Segelschiff auf dem Atlantik -->
        <g transform="translate(364 196)">
          <path d="M-22 10 L22 10 L15 21 L-15 21 Z" fill="#7c4a21" stroke="#4e2c11" stroke-width="1.6"/>
          <line x1="0" y1="10" x2="0" y2="-20" stroke="#4e2c11" stroke-width="2.4"/>
          <path d="M2 -18 Q20 -8 16 6 L2 6 Z" fill="#fffbeb" stroke="#b45309" stroke-width="1.4"/>
          <path d="M-2 -14 Q-16 -6 -13 6 L-2 6 Z" fill="#fef3c7" stroke="#b45309" stroke-width="1.3"/>
          <polygon points="0,-20 12,-16 0,-12" fill="#dc2626"/>
        </g>

        <!-- Kontinent- & Meer-Marker (A, B, C) -->
        ${geoPins
          .map((p) => {
            const st = pinStyle(p.id, true);
            const val = vals[p.id];
            const txt = val ? `${p.code}: ${shortLabel(val)}` : `${p.code}: ?`;
            const w = Math.max(76, txt.length * 8.2 + 20);
            return `
              <g class="map-hotspot" data-map-slot="${p.id}" style="cursor:pointer;">
                <rect x="${p.x - w / 2}" y="${p.y - 16}" width="${w}" height="32" rx="16"
                      fill="${st.pillBg}" stroke="${st.pillBorder}" stroke-width="${activeSlotId === p.id ? 3.5 : 2.2}"/>
                <text x="${p.x}" y="${p.y + 5}" text-anchor="middle" fill="${st.pillText}"
                      font-size="13.5" font-weight="800" font-family="system-ui, sans-serif">${escapeSvgText(txt)}</text>
              </g>`;
          })
          .join("")}

        <!-- Nummerierte Reise-Stationen (1 bis 5) -->
        ${routePins
          .map((p) => {
            const st = pinStyle(p.id, false);
            const val = vals[p.id];
            const lbl = shortLabel(val);
            const lw = lbl ? Math.max(74, lbl.length * 7.8 + 16) : 0;
            const lx = Math.min(Math.max(p.x + p.labelDx, lw / 2 + 8), 912 - lw / 2);
            const ly = p.y + p.labelDy;
            return `
              <g class="map-hotspot" data-map-slot="${p.id}" style="cursor:pointer;">
                ${
                  activeSlotId === p.id
                    ? `<circle cx="${p.x}" cy="${p.y}" r="22" fill="none" stroke="#d97706" stroke-width="3" stroke-dasharray="4 3"/>`
                    : ""
                }
                <circle cx="${p.x}" cy="${p.y}" r="16" fill="${st.bg}" stroke="${st.stroke}" stroke-width="2.8"/>
                <text x="${p.x}" y="${p.y + 5.5}" text-anchor="middle" fill="${st.text}"
                      font-size="15" font-weight="900" font-family="system-ui, sans-serif">${p.num}</text>
                ${
                  lbl
                    ? `<rect x="${lx - lw / 2}" y="${ly - 12}" width="${lw}" height="24" rx="12"
                             fill="${st.pillBg}" stroke="${st.pillBorder}" stroke-width="1.8"/>
                       <text x="${lx}" y="${ly + 4.5}" text-anchor="middle" fill="${st.pillText}"
                             font-size="12" font-weight="800" font-family="system-ui, sans-serif">${escapeSvgText(lbl)}</text>`
                    : ""
                }
              </g>`;
          })
          .join("")}
      </svg>
    `;
  }

  /* 4. Aufbau der Kartoffelpflanze (Aufgabe 10) */
  function getPotatoPlantSVG() {
    // 7 nummerierte Stellen:
    // Links:  1 = Blüte (oben), 2 = Stängel (mitte), 3 = Mutterknolle (unten)
    // Rechts: 4 = Beere (giftig), 5 = Blätter, 6 = Wurzel, 7 = neue Knollen
    return `
      <svg class="diagram-svg" viewBox="0 0 380 410" role="img" aria-label="Zeichnung einer Kartoffelpflanze über und unter der Erde mit sieben nummerierten Stellen zum Beschriften">
        <defs>
          <linearGradient id="potSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f2f9fd"/>
            <stop offset="100%" stop-color="#fbf7ec"/>
          </linearGradient>
          <linearGradient id="potSoil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#9b693c"/>
            <stop offset="100%" stop-color="#653f1e"/>
          </linearGradient>
          <radialGradient id="newPotato" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#f3d08b"/>
            <stop offset="100%" stop-color="#c38c3e"/>
          </radialGradient>
          <radialGradient id="motherPotato" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#9e744c"/>
            <stop offset="100%" stop-color="#5e3e22"/>
          </radialGradient>
        </defs>

        <!-- Hintergrund Himmel & Erde -->
        <rect x="18" y="8" width="344" height="394" rx="18" fill="url(#potSky)" stroke="#e2d7c0" stroke-width="2"/>
        <path d="M18 224 Q105 216 190 223 Q275 230 362 222 L362 384 Q362 402 344 402 L36 402 Q18 402 18 384 Z" fill="url(#potSoil)"/>

        <!-- Bodenstruktur -->
        <ellipse cx="98" cy="252" rx="6" ry="3.5" fill="#774c27" opacity="0.65"/>
        <ellipse cx="294" cy="296" rx="5.5" ry="3" fill="#593619" opacity="0.65"/>
        <ellipse cx="106" cy="368" rx="5" ry="3" fill="#593619" opacity="0.65"/>

        <!-- Feine Wurzeln (unter der Erde) -->
        <g stroke="#e7cfa6" stroke-width="2.1" stroke-linecap="round" fill="none">
          <path d="M190 278 Q174 316 158 358 Q150 374 140 388"/>
          <path d="M190 278 Q186 330 184 388"/>
          <path d="M190 278 Q206 322 214 384"/>
          <path d="M190 256 Q220 264 252 276 Q268 282 282 292"/>
          <path d="M190 258 Q154 266 124 282"/>
          <path d="M220 264 Q236 254 248 250" stroke-width="1.5"/>
          <path d="M242 273 Q252 286 258 298" stroke-width="1.5"/>
          <path d="M168 332 Q154 338 144 346" stroke-width="1.5"/>
        </g>

        <!-- Unterirdische Ausläufer zu den neuen Knollen -->
        <g stroke="#d5be90" stroke-width="3" stroke-linecap="round" fill="none">
          <path d="M190 266 Q222 294 250 318"/>
          <path d="M194 280 Q232 326 266 348"/>
          <path d="M186 276 Q150 310 128 338"/>
          <path d="M192 294 Q206 334 222 364"/>
        </g>

        <!-- Mutterknolle (dunkler, leicht schrumpelig in der Mitte) -->
        <g>
          <ellipse cx="190" cy="288" rx="22" ry="15" fill="url(#motherPotato)" stroke="#472c14" stroke-width="1.8"/>
          <path d="M177 284 Q186 289 196 284 M180 293 Q191 296 202 291" stroke="#472c14" stroke-width="1.2" fill="none" opacity="0.65"/>
        </g>

        <!-- Neue Knollen (hell-goldbraun, prall) -->
        <g>
          <g transform="rotate(-14 126 340)">
            <ellipse cx="126" cy="340" rx="20" ry="14" fill="url(#newPotato)" stroke="#8c5b1f" stroke-width="1.7"/>
            <circle cx="118" cy="338" r="1.4" fill="#8c5b1f"/><circle cx="132" cy="343" r="1.4" fill="#8c5b1f"/>
          </g>
          <g transform="rotate(12 252 316)">
            <ellipse cx="252" cy="316" rx="18" ry="12.5" fill="url(#newPotato)" stroke="#8c5b1f" stroke-width="1.7"/>
            <circle cx="246" cy="314" r="1.3" fill="#8c5b1f"/><circle cx="258" cy="319" r="1.3" fill="#8c5b1f"/>
          </g>
          <g transform="rotate(-8 268 352)">
            <ellipse cx="268" cy="352" rx="22" ry="15" fill="url(#newPotato)" stroke="#8c5b1f" stroke-width="1.7"/>
            <circle cx="260" cy="349" r="1.5" fill="#8c5b1f"/><circle cx="275" cy="354" r="1.5" fill="#8c5b1f"/>
          </g>
          <g transform="rotate(6 220 368)">
            <ellipse cx="220" cy="368" rx="17" ry="12" fill="url(#newPotato)" stroke="#8c5b1f" stroke-width="1.7"/>
            <circle cx="215" cy="366" r="1.3" fill="#8c5b1f"/>
          </g>
        </g>

        <!-- Hauptstängel (aus der Mutterknolle nach oben) -->
        <g stroke="#3c7d36" stroke-linecap="round" fill="none">
          <path d="M190 274 L190 88" stroke-width="7"/>
          <path d="M190 198 Q166 172 138 158" stroke-width="4"/>
          <path d="M190 166 Q220 156 254 148" stroke-width="4"/>
          <path d="M190 132 Q162 110 136 96" stroke-width="3.6"/>
          <path d="M190 120 Q216 96 238 78" stroke-width="3.4"/>
          <path d="M190 92 Q168 72 150 60" stroke-width="3"/>
          <path d="M190 92 Q196 68 202 50" stroke-width="3"/>
        </g>

        <!-- Gefiederte Kartoffelblätter -->
        <g fill="#4ea145" stroke="#2c6326" stroke-width="1.4">
          <!-- Linke Blattgruppe -->
          <ellipse cx="144" cy="160" rx="16" ry="9" transform="rotate(-18 144 160)"/>
          <ellipse cx="122" cy="152" rx="15" ry="8.5" transform="rotate(-8 122 152)"/>
          <ellipse cx="162" cy="144" rx="13" ry="7.5" transform="rotate(-30 162 144)"/>
          <ellipse cx="136" cy="106" rx="15" ry="8.5" transform="rotate(-22 136 106)"/>
          <ellipse cx="158" cy="116" rx="12" ry="7" transform="rotate(-10 158 116)"/>
          <!-- Rechte Blattgruppe (deutlich für Pin 5) -->
          <ellipse cx="228" cy="158" rx="16" ry="9" transform="rotate(14 228 158)"/>
          <ellipse cx="258" cy="148" rx="18" ry="10" transform="rotate(8 258 148)"/>
          <ellipse cx="242" cy="134" rx="14" ry="8" transform="rotate(-12 242 134)"/>
          <ellipse cx="218" cy="182" rx="14" ry="8" transform="rotate(24 218 182)"/>
        </g>

        <!-- Giftige grüne Kartoffelbeeren (Früchte) rechts oben -->
        <g>
          <path d="M236 78 Q246 72 252 68" stroke="#3c7d36" stroke-width="2.4" fill="none"/>
          <circle cx="240" cy="76" r="10.5" fill="#65a30d" stroke="#365314" stroke-width="1.8"/>
          <circle cx="236.5" cy="72.5" r="2.8" fill="#bef264" opacity="0.8"/>
          <circle cx="256" cy="68" r="9.5" fill="#84cc16" stroke="#365314" stroke-width="1.8"/>
          <circle cx="253" cy="64.8" r="2.4" fill="#d9f99d" opacity="0.8"/>
          <!-- Kleines Warndreieck neben den Beeren -->
          <polygon points="274,45 284,62 264,62" fill="#facc15" stroke="#b91c1c" stroke-width="1.6"/>
          <text x="274" y="59.5" text-anchor="middle" font-size="11" font-weight="900" fill="#991b1b" font-family="system-ui, sans-serif">!</text>
        </g>

        <!-- Hübsche weiß-violette Kartoffelblüten oben links -->
        ${[
          { cx: 146, cy: 58, s: 1 },
          { cx: 204, cy: 44, s: 0.88 }
        ]
          .map(
            (f) => `
          <g transform="translate(${f.cx} ${f.cy}) scale(${f.s})">
            <g fill="#f3e8ff" stroke="#7e22ce" stroke-width="1.4">
              <ellipse cx="0" cy="-12" rx="7" ry="10"/>
              <ellipse cx="11.5" cy="-3.5" rx="7" ry="10" transform="rotate(72 11.5 -3.5)"/>
              <ellipse cx="7" cy="10" rx="7" ry="10" transform="rotate(144 7 10)"/>
              <ellipse cx="-7" cy="10" rx="7" ry="10" transform="rotate(-144 -7 10)"/>
              <ellipse cx="-11.5" cy="-3.5" rx="7" ry="10" transform="rotate(-72 -11.5 -3.5)"/>
            </g>
            <circle cx="0" cy="0" r="5.5" fill="#facc15" stroke="#b45309" stroke-width="1.2"/>
          </g>`
          )
          .join("")}

        <!-- Hinweislinien (1-3 links, 4-7 rechts) -->
        <g stroke="#334155" stroke-width="2" stroke-dasharray="4 3" fill="none">
          <!-- 1: Blüte -->
          <path d="M36 62 L106 62 L132 58"/>
          <!-- 2: Stängel -->
          <path d="M36 192 L112 192 L185 192"/>
          <!-- 3: Mutterknolle -->
          <path d="M36 318 L112 318 L168 292"/>
          <!-- 4: Beere (giftig) -->
          <path d="M344 58 L284 58 L256 68"/>
          <!-- 5: Blätter -->
          <path d="M344 152 L292 152 L268 148"/>
          <!-- 6: Wurzel -->
          <path d="M344 262 L286 262 L252 274"/>
          <!-- 7: neue Knollen -->
          <path d="M344 358 L296 358 L280 352"/>
        </g>

        <!-- Zielpunkte -->
        <g fill="#2e6f40" stroke="#ffffff" stroke-width="2">
          <circle cx="132" cy="58" r="5"/>
          <circle cx="185" cy="192" r="5"/>
          <circle cx="168" cy="292" r="5"/>
          <circle cx="256" cy="68" r="5"/>
          <circle cx="268" cy="148" r="5"/>
          <circle cx="252" cy="274" r="5"/>
          <circle cx="280" cy="352" r="5"/>
        </g>

        <!-- Nummern-Badges -->
        ${[
          { n: "1", x: 34, y: 62 },
          { n: "2", x: 34, y: 192 },
          { n: "3", x: 34, y: 318 },
          { n: "4", x: 346, y: 58 },
          { n: "5", x: 346, y: 152 },
          { n: "6", x: 346, y: 262 },
          { n: "7", x: 346, y: 358 }
        ]
          .map(
            (b) => `
          <g>
            <circle cx="${b.x}" cy="${b.y}" r="14" fill="#7c4d25" stroke="#ffffff" stroke-width="2.5"/>
            <text x="${b.x}" y="${b.y + 5}" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800" font-family="system-ui, sans-serif">${b.n}</text>
          </g>`
          )
          .join("")}
      </svg>
    `;
  }

  return {
    getGrainPlantSVG,
    getGrainVarietySVG,
    getPotatoMapSVG,
    getPotatoPlantSVG
  };
})();
