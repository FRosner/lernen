/* ==========================================================================
   Mathe-Probeklausur Klasse 3: Zahlen bis 1000 & Kleines 1×1
   20 Aufgaben · 100 Punkte · Zufallsgenerator · Notenschlüssel 1–6
   ========================================================================== */

(function () {
  "use strict";

  // --- Helpers ---
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function sampleUnique(arr, count) {
    return shuffle(arr).slice(0, count);
  }

  function parseCleanInt(val) {
    if (val === undefined || val === null) return null;
    const s = String(val).trim();
    if (!/^-?\d+$/.test(s)) return null;
    return parseInt(s, 10);
  }

  // Convert number 1..999 to German number word (e.g. 743 -> "siebenhundertdreiundvierzig")
  function numberToGermanWord(n) {
    const ones = ["", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"];
    const tens = ["", "zehn", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"];
    const h = Math.floor(n / 100);
    const r = n % 100;
    let word = h > 0 ? ones[h] + "hundert" : "";
    if (r === 0) return word || "null";
    if (r === 1) return word + "eins";
    if (r >= 2 && r <= 9) return word + ones[r];
    if (r === 10) return word + "zehn";
    if (r === 11) return word + "elf";
    if (r === 12) return word + "zwölf";
    if (r === 16) return word + "sechzehn";
    if (r === 17) return word + "siebzehn";
    if (r >= 13 && r <= 19) return word + ones[r - 10] + "zehn";
    const z = Math.floor(r / 10);
    const e = r % 10;
    if (e === 0) return word + tens[z];
    return word + ones[e] + "und" + tens[z];
  }

  // Grade calculation according to user specification:
  // >= 95% -> 1, >= 81% -> 2, >= 66% -> 3, >= 51% -> 4, >= 26% -> 5, else 6
  function calculateGrade(pct) {
    if (pct >= 95) {
      return { grade: 1, word: "Sehr gut", stars: "⭐⭐⭐", praise: "Herausragend! Du bist ein echter Mathe-Profi!" };
    }
    if (pct >= 81) {
      return { grade: 2, word: "Gut", stars: "⭐⭐⭐", praise: "Tolle Leistung! Das hast du richtig gut gemacht!" };
    }
    if (pct >= 66) {
      return { grade: 3, word: "Befriedigend", stars: "⭐⭐", praise: "Gut gemacht! Viele Aufgaben sitzen schon sicher." };
    }
    if (pct >= 51) {
      return { grade: 4, word: "Ausreichend", stars: "⭐⭐", praise: "Du hast bestanden! Schau dir die Lösungen in Ruhe an." };
    }
    if (pct >= 26) {
      return { grade: 5, word: "Mangelhaft", stars: "⭐", praise: "Nicht aufgeben! Übe die Themen noch einmal Schritt für Schritt." };
    }
    return { grade: 6, word: "Ungenügend", stars: "⭐", praise: "Kopf hoch! Schau dir die Erklärungen an und probiere es gleich noch einmal." };
  }

  // --- SVG Renderers for Dienes Material ---
  function renderDienesSVG(h, z, e) {
    // Draw Hunderterplatten (squares with grid), Zehnerstangen (vertical rods), Einerwürfel (small cubes)
    const plateW = 46;
    const rodW = 10;
    const cubeW = 9;
    const hTotalW = h > 0 ? h * (plateW + 6) + 8 : 0;
    const zTotalW = z > 0 ? z * (rodW + 4) + 10 : 0;
    const eCols = Math.min(5, Math.max(1, e));
    const eTotalW = e > 0 ? eCols * (cubeW + 4) + 10 : 0;
    const totalW = Math.max(220, hTotalW + zTotalW + eTotalW + 20);
    const totalH = 74;

    let svg = `<svg viewBox="0 0 ${totalW} ${totalH}" width="100%" height="78" style="max-width:${totalW}px; overflow:visible;" aria-hidden="true">`;
    let curX = 8;

    // Hundreds plates
    for (let i = 0; i < h; i++) {
      const x = curX + i * (plateW + 6);
      const y = 14;
      // 3D depth
      svg += `<polygon points="${x},${y} ${x + 4},${y - 4} ${x + plateW + 4},${y - 4} ${x + plateW},${y}" fill="#93c5fd" stroke="#1e40af" stroke-width="1"/>`;
      svg += `<polygon points="${x + plateW},${y} ${x + plateW + 4},${y - 4} ${x + plateW + 4},${y + plateW - 4} ${x + plateW},${y + plateW}" fill="#3b82f6" stroke="#1e40af" stroke-width="1"/>`;
      svg += `<rect x="${x}" y="${y}" width="${plateW}" height="${plateW}" fill="#dbeafe" stroke="#1e40af" stroke-width="1.3"/>`;
      for (let g = 1; g < 5; g++) {
        const d = (plateW / 5) * g;
        svg += `<line x1="${x + d}" y1="${y}" x2="${x + d}" y2="${y + plateW}" stroke="#60a5fa" stroke-width="0.7"/>`;
        svg += `<line x1="${x}" y1="${y + d}" x2="${x + plateW}" y2="${y + d}" stroke="#60a5fa" stroke-width="0.7"/>`;
      }
    }
    curX += hTotalW;

    // Tens rods
    for (let i = 0; i < z; i++) {
      const x = curX + i * (rodW + 4);
      const y = 14;
      svg += `<rect x="${x}" y="${y}" width="${rodW}" height="${plateW}" fill="#bbf7d0" stroke="#15803d" stroke-width="1.2" rx="1"/>`;
      for (let g = 1; g < 10; g++) {
        const gy = y + (plateW / 10) * g;
        svg += `<line x1="${x}" y1="${gy}" x2="${x + rodW}" y2="${gy}" stroke="#22c55e" stroke-width="0.7"/>`;
      }
    }
    curX += zTotalW;

    // Ones cubes (arranged in rows of up to 5)
    for (let i = 0; i < e; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = curX + col * (cubeW + 4);
      const y = 46 - row * (cubeW + 5);
      svg += `<rect x="${x}" y="${y}" width="${cubeW}" height="${cubeW}" fill="#fef08a" stroke="#b45309" stroke-width="1.2" rx="1"/>`;
    }

    if (h === 0 && z === 0 && e === 0) {
      svg += `<text x="${totalW / 2}" y="42" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="700">Noch keine Blöcke gelegt (0)</text>`;
    }

    svg += `</svg>`;
    return svg;
  }

  // Simplified hand-drawing SVG for Task 2 (like Blatt 1, Nr. 3: Squares, Horizontal Lines, Dots)
  function renderSketchDienesSVG(h, z, e) {
    const sq = 32;
    const hW = h * (sq + 6) + 8;
    const zW = z > 0 ? 44 : 0;
    const totalW = Math.max(180, hW + zW + 14);
    const totalH = 54;
    let svg = `<svg viewBox="0 0 ${totalW} ${totalH}" width="100%" height="50" style="max-width:${totalW}px;">`;
    for (let i = 0; i < h; i++) {
      const x = 6 + i * (sq + 6);
      svg += `<rect x="${x}" y="10" width="${sq}" height="${sq}" fill="#ffffff" stroke="#334155" stroke-width="2" rx="2"/>`;
    }
    const zx = hW + 4;
    for (let i = 0; i < z; i++) {
      const extraGap = i >= 5 ? 3 : 0;
      const y = 8 + i * 3.3 + extraGap;
      svg += `<line x1="${zx}" y1="${y}" x2="${zx + 34}" y2="${y}" stroke="#334155" stroke-width="2" stroke-linecap="round"/>`;
    }
    const ey = 46;
    for (let i = 0; i < e; i++) {
      const extraGap = i >= 5 ? 4 : 0;
      const ex = zx + i * 4.2 + extraGap;
      svg += `<circle cx="${ex}" cy="${ey}" r="1.7" fill="#1e293b"/>`;
    }
    svg += `</svg>`;
    return svg;
  }

  // --- Generate All 20 Exam Tasks ---
  function generateExamTasks() {
    const tasks = [];

    // 1. Aufgabe 1: Zahlen der Darstellung entnehmen (Blatt 1, Nr. 1) - 4 Punkte
    const t1Items = [
      { h: randInt(2, 6), z: randInt(2, 6), e: randInt(2, 8) },
      { h: randInt(5, 8), z: randInt(1, 3), e: randInt(1, 6) }
    ];
    if (t1Items[0].h === t1Items[1].h) t1Items[1].h = (t1Items[0].h % 8) + 1;
    tasks.push({
      id: 1,
      type: "dienes_read",
      topic: "Stellenwerte & Zahldarstellungen",
      title: "Zahlen ablesen & Stellenwerttafel",
      points: 4,
      prompt: "Zähle die Hunderterplatten (H), Zehnerstangen (Z) und Einerwürfel (E). Trage sie in die Stellenwerttafel und als ganze Zahl ein.",
      items: t1Items,
      explanation: `Bei der ersten Darstellung sind es ${t1Items[0].h} H, ${t1Items[0].z} Z und ${t1Items[0].e} E → Zahl ${t1Items[0].h * 100 + t1Items[0].z * 10 + t1Items[0].e}. Bei der zweiten Darstellung sind es ${t1Items[1].h} H, ${t1Items[1].z} Z und ${t1Items[1].e} E → Zahl ${t1Items[1].h * 100 + t1Items[1].z * 10 + t1Items[1].e}.`
    });

    // 2. Aufgabe 2: Stelle die Zahlen unterschiedlich dar (Blatt 1, Nr. 3) - 4 Punkte
    const usedH2 = sampleUnique([2, 3, 4, 5], 4);
    const t2Items = usedH2.map((h) => ({
      h,
      z: randInt(2, 8),
      e: randInt(2, 9)
    }));
    tasks.push({
      id: 2,
      type: "represent_split",
      topic: "Zahldarstellungen & Zahlzerlegung",
      title: "Zahlen unterschiedlich darstellen",
      points: 4,
      prompt: "Lies das Geheimzeichen-Bild ab (Quadrat = Hunderter, Strich = Zehner, Punkt = Einer). Fülle die Stellenwertkarten und die Zerlegung aus.",
      items: t2Items,
      explanation: t2Items
        .map((it) => `${it.h * 100 + it.z * 10 + it.e} = ${it.h * 100} + ${it.z * 10} + ${it.e}`)
        .join(" · ")
    });

    // 3. Aufgabe 3: Zahlen selber mit Material legen - 4 Punkte
    const t3ZeroInTens = Math.random() < 0.65;
    const t3Items = [
      { h: randInt(2, 6), z: randInt(2, 6), e: randInt(2, 7) },
      t3ZeroInTens
        ? { h: randInt(3, 7), z: 0, e: randInt(2, 8) }
        : { h: randInt(3, 7), z: randInt(2, 7), e: 0 }
    ];
    tasks.push({
      id: 3,
      type: "dienes_build",
      topic: "Zahldarstellungen",
      title: "Zahlen mit Material selber legen",
      points: 4,
      prompt: "Lege die vorgegebene Zahl mit den + und − Knöpfen aus Hunderterplatten (H), Zehnerstangen (Z) und Einerwürfeln (E).",
      items: t3Items,
      explanation: `Für ${t3Items[0].h * 100 + t3Items[0].z * 10 + t3Items[0].e} brauchst du ${t3Items[0].h} H, ${t3Items[0].z} Z, ${t3Items[0].e} E. Für ${t3Items[1].h * 100 + t3Items[1].z * 10 + t3Items[1].e} brauchst du ${t3Items[1].h} H, ${t3Items[1].z} Z, ${t3Items[1].e} E (achte auf die Null!).`
    });

    // 4. Aufgabe 4: Im Zehnersystem bündeln und tauschen (Blatt 2, Nr. 4) - 6 Punkte
    const t4Left = [
      { z: randInt(2, 6), e: randInt(12, 19) },
      { z: randInt(1, 5), e: randInt(22, 29) },
      { z: randInt(3, 5), e: randInt(31, 39) }
    ].map((it) => {
      const total = it.z * 10 + it.e;
      return {
        mode: "ZE",
        givenZ: it.z,
        givenE: it.e,
        ansZ: Math.floor(total / 10),
        ansE: total % 10
      };
    });

    const t4Right = [
      { z: randInt(2, 5) * 10, e: randInt(2, 9) },
      { z: randInt(32, 68), e: randInt(1, 9) },
      { z: randInt(51, 86), e: randInt(12, 38) }
    ].map((it) => {
      const total = it.z * 10 + it.e;
      return {
        mode: "HZE",
        givenZ: it.z,
        givenE: it.e,
        ansH: Math.floor(total / 100),
        ansZ: Math.floor((total % 100) / 10),
        ansE: total % 10
      };
    });

    tasks.push({
      id: 4,
      type: "bundle_swap",
      topic: "Stellenwerte & Bündeln",
      title: "Im Zehnersystem bündeln und tauschen",
      points: 6,
      prompt: "Immer 10 Einer werden zu 1 Zehner, und 10 Zehner werden zu 1 Hunderter! Tausche um:",
      leftItems: t4Left,
      rightItems: t4Right,
      explanation:
        "Beispiel: 10 Einer = 1 Zehner und 10 Zehner = 1 Hunderter. Bei vielen Einern (z. B. 33 E) stecken 3 zusätzliche Zehner und 3 Einer darin."
    });

    // 5. Aufgabe 5: Zahlwörter lesen & in der Hundertertafel einkreisen (Blatt 1, Nr. 2) - 6 Punkte
    const hBase = pickOne([200, 300, 400, 600, 700, 800]);
    const w1 = hBase + randInt(2, 5) * 10 + randInt(2, 8); // e.g. 743
    const w2 = hBase + randInt(6, 9) * 10 + randInt(2, 9); // e.g. 784
    const w3 = pickOne([hBase + 11, hBase + 12, hBase + 17, hBase + randInt(2, 9)]); // e.g. 711 or 707
    const t5Targets = [w1, w2, w3].map((num) => ({
      num,
      word: numberToGermanWord(num)
    }));

    tasks.push({
      id: 5,
      type: "word_htafel",
      topic: "Hundertertafel & Zahldarstellungen",
      title: "Zahlwörter & Hundertertafel",
      points: 6,
      prompt: `Lies die 3 Zahlwörter, schreibe sie als Zahl auf und kreise die 3 Zahlen rechts in der Hundertertafel (${hBase + 1} bis ${hBase + 100}) durch Antippen ein!`,
      hBase,
      targets: t5Targets,
      explanation: t5Targets.map((t) => `${t.word} = ${t.num}`).join(", ")
    });

    // 6. Aufgabe 6: Fehlende Zahlen in Ausschnitten der Hundertertafel (Blatt 2, Nr. 5) - 6 Punkte
    // Each puzzle has 5 cells in a 10x10 grid; 1 cell is given, 4 cells are inputs.
    const p1Base = pickOne([100, 200, 300, 400]);
    const p1R = randInt(1, 6);
    const p1C = randInt(1, 5);
    const puzzle1 = {
      name: "Ausschnitt 1",
      rows: 2,
      cols: 3,
      cells: [
        { r: 0, c: 0, val: p1Base + p1R * 10 + p1C + 1, given: true },
        { r: 0, c: 1, val: p1Base + p1R * 10 + p1C + 2, given: false },
        { r: 0, c: 2, val: p1Base + p1R * 10 + p1C + 3, given: false },
        { r: 1, c: 1, val: p1Base + (p1R + 1) * 10 + p1C + 2, given: false },
        { r: 1, c: 2, val: p1Base + (p1R + 1) * 10 + p1C + 3, given: false }
      ]
    };

    const p2Base = pickOne([500, 600, 700]);
    const p2R = randInt(1, 5);
    const p2C = randInt(2, 7);
    const puzzle2 = {
      name: "Ausschnitt 2",
      rows: 3,
      cols: 2,
      cells: [
        { r: 0, c: 1, val: p2Base + p2R * 10 + p2C + 1, given: false },
        { r: 1, c: 1, val: p2Base + (p2R + 1) * 10 + p2C + 1, given: true },
        { r: 2, c: 0, val: p2Base + (p2R + 2) * 10 + p2C, given: false },
        { r: 2, c: 1, val: p2Base + (p2R + 2) * 10 + p2C + 1, given: false },
        { r: 0, c: 0, val: p2Base + p2R * 10 + p2C, given: false }
      ]
    };

    const p3Base = pickOne([700, 800, 900]);
    const p3R = randInt(1, 5);
    const p3C = randInt(1, 5);
    const puzzle3 = {
      name: "Ausschnitt 3",
      rows: 3,
      cols: 3,
      cells: [
        { r: 0, c: 1, val: p3Base + p3R * 10 + p3C + 1, given: false },
        { r: 1, c: 0, val: p3Base + (p3R + 1) * 10 + p3C, given: false },
        { r: 1, c: 1, val: p3Base + (p3R + 1) * 10 + p3C + 1, given: true },
        { r: 1, c: 2, val: p3Base + (p3R + 1) * 10 + p3C + 2, given: false },
        { r: 2, c: 1, val: p3Base + (p3R + 2) * 10 + p3C + 1, given: false }
      ]
    };

    tasks.push({
      id: 6,
      type: "htafel_puzzle",
      topic: "Hundertertafel",
      title: "Ausschnitte aus der Hundertertafel",
      points: 6,
      prompt: "Trage die fehlenden Zahlen in die Puzzleteile der Hundertertafel ein (nach rechts: +1, nach links: −1, nach unten: +10, nach oben: −10).",
      puzzles: [puzzle1, puzzle2, puzzle3],
      explanation: "In der Hundertertafel wird es nach rechts immer um 1 größer (+1), nach links um 1 kleiner (−1), nach unten um 10 größer (+10) und nach oben um 10 kleiner (−10)."
    });

    // 7. Aufgabe 7: Zahlenrätsel lösen (Blatt 2, Nr. 6) - 4 Punkte
    const r1StartH = randInt(5, 8);
    const r1StartZ = randInt(2, 7);
    const r1StartE = randInt(1, 4);
    const r1Start = r1StartH * 100 + r1StartZ * 10 + r1StartE;
    const r1SubH = randInt(2, r1StartH - 1);
    const r1AddE = randInt(3, 5);
    const r1Ans = r1Start - r1SubH * 100 + r1AddE;

    const r2OrigH = randInt(2, 7);
    const r2OrigZ = randInt(6, 9);
    const r2OrigE = randInt(4, 8);
    const r2Orig = r2OrigH * 100 + r2OrigZ * 10 + r2OrigE;
    const r2TakeZ = randInt(3, 5);
    const r2TakeE = randInt(2, 3);
    const r2Now = r2Orig - r2TakeZ * 10 - r2TakeE;

    tasks.push({
      id: 7,
      type: "number_riddles",
      topic: "Stellenwerte & Zahlenrätsel",
      title: "Zahlenrätsel knacken",
      points: 4,
      prompt: "Lies genau, was der Hund und die Schildkröte mit ihren Zahlen machen, und trage die gesuchte Zahl ein.",
      riddles: [
        {
          avatar: "🐶",
          text: `„Meine Zahl heißt <strong>${r1Start}</strong>. Ich nehme <strong>${r1SubH} Hunderter</strong> weg und lege <strong>${r1AddE} Einer</strong> dazu.“`,
          label: "Diese Zahl entsteht:",
          answer: r1Ans,
          explain: `${r1Start} − ${r1SubH * 100} + ${r1AddE} = ${r1Ans}`
        },
        {
          avatar: "🐢",
          text: `„Ich habe von meiner Zahl <strong>${r2TakeZ} Zehner</strong> und <strong>${r2TakeE} Einer</strong> weggenommen. Jetzt habe ich die Zahl <strong>${r2Now}</strong>.“`,
          label: "Diese Zahl war es vorher:",
          answer: r2Orig,
          explain: `Rückwärts rechnen: ${r2Now} + ${r2TakeZ * 10} + ${r2TakeE} = ${r2Orig}`
        }
      ],
      explanation: `Rätsel 1: ${r1Start} − ${r1SubH * 100} + ${r1AddE} = ${r1Ans}. Rätsel 2 (rückwärts): ${r2Now} + ${r2TakeZ * 10} + ${r2TakeE} = ${r2Orig}.`
    });

    // 8. Aufgabe 8: Zahlen mit dem Zahlenstrahl verbinden (Blatt 3, Nr. 1) - 5 Punkte
    const zsStart = pickOne([0, 200, 500]);
    const zsEnd = zsStart + 500;
    // Choose 5 distinct 10-multiples across the 500 range
    const offsets = [
      randInt(2, 9) * 10,
      randInt(11, 18) * 10,
      randInt(21, 29) * 10,
      randInt(30, 39) * 10,
      randInt(41, 49) * 10
    ];
    const zsNumbers = offsets.map((off) => zsStart + off);

    tasks.push({
      id: 8,
      type: "number_line_connect",
      topic: "Zahlenstrahl",
      title: "Zahlen am Zahlenstrahl verbinden",
      points: 5,
      prompt: "Klicke zuerst unten ein Zahlenkärtchen an und tippe danach oben auf den passenden Strich am Zahlenstrahl, um sie zu verbinden!",
      start: zsStart,
      end: zsEnd,
      numbers: zsNumbers,
      explanation: `Zwischen zwei Hundertern liegen immer 10 kleine Schritte zu je 10 (der etwas längere Strich in der Mitte ist der 50er-Strich). Die gesuchten Stellen sind ${zsNumbers.join(", ")}.`
    });

    // 9. Aufgabe 9: Nachbarzehner (NZ) & näheren Zehner markieren (Blatt 3, Nr. 2) - 4 Punkte
    const nzPool = [
      randInt(1, 8) * 100 + randInt(1, 8) * 10 + randInt(1, 4), // closer to lower NZ
      randInt(1, 8) * 100 + randInt(1, 8) * 10 + randInt(6, 9), // closer to upper NZ
      randInt(2, 8) * 100 + 90 + randInt(6, 9),                 // crosses hundred boundary (e.g. 697 -> 690 / 700)
      randInt(1, 8) * 100 + randInt(0, 8) * 10 + randInt(1, 4)
    ];
    const t9Items = nzPool.map((z) => {
      const low = Math.floor(z / 10) * 10;
      const high = low + 10;
      const closer = z - low < high - z ? "low" : "high";
      return { z, low, high, closer };
    });

    tasks.push({
      id: 9,
      type: "neighbor_tens",
      topic: "Zahlenstrahl & Nachbarzahlen",
      title: "Nachbarzehner (NZ) bestimmen & markieren",
      points: 4,
      prompt: "Trage den kleineren und den größeren Nachbarzehner (NZ) ein. Klicke außerdem auf „🖍️ näher“ bei dem Zehner, der näher an der Zahl liegt!",
      items: t9Items,
      explanation: t9Items
        .map((it) => `${it.z}: Nachbarzehner sind ${it.low} und ${it.high} (näher an ${it.closer === "low" ? it.low : it.high})`)
        .join(" · ")
    });

    // 10. Aufgabe 10: Nachbarhunderter (NH) & näheren Hunderter markieren (Blatt 3, Nr. 3) - 4 Punkte
    const nhPool = [
      randInt(1, 8) * 100 + randInt(55, 92), // closer to upper NH
      randInt(1, 8) * 100 + randInt(8, 44),  // closer to lower NH
      900 + randInt(55, 94),                 // 900 .. 1000
      randInt(1, 7) * 100 + randInt(12, 42)
    ];
    const t10Items = nhPool.map((z) => {
      const low = Math.floor(z / 100) * 100;
      const high = low + 100;
      const closer = z - low < high - z ? "low" : "high";
      return { z, low, high, closer };
    });

    tasks.push({
      id: 10,
      type: "neighbor_hundreds",
      topic: "Zahlenstrahl & Nachbarzahlen",
      title: "Nachbarhunderter (NH) bestimmen & markieren",
      points: 4,
      prompt: "Trage den kleineren und den größeren Nachbarhunderter (NH) ein. Markiere außerdem mit „🖍️ näher“ den Hunderter, der näher an der Zahl liegt!",
      items: t10Items,
      explanation: t10Items
        .map((it) => `${it.z}: Nachbarhunderter sind ${it.low} und ${it.high} (näher an ${it.closer === "low" ? it.low : it.high})`)
        .join(" · ")
    });

    // 11. Aufgabe 11: Zahlen vergleichen <, > oder = (Blatt 3, Nr. 4) - 6 Punkte
    const d1 = randInt(2, 4), d2 = randInt(6, 9), d3 = randInt(1, 5);
    const e1 = randInt(3, 8), e2 = randInt(1, 9);
    const f1 = randInt(4, 8), f2 = randInt(2, 7);
    const g1 = randInt(2, 9) * 100 + randInt(1, 8) * 10 + randInt(1, 9);
    const k1 = randInt(5, 8), k2 = randInt(2, 9);
    const m1 = randInt(6, 9), m2 = randInt(1, 5);

    const t11Pairs = [
      { a: d1 * 100 + d2 * 10 + d3, b: d2 * 100 + d1 * 10 + d3 },
      { a: e1 * 100 + f2 * 10 + e2, b: e1 * 100 + e2 * 10 + f2 === e1 * 100 + f2 * 10 + e2 ? e1 * 100 + f2 * 10 + e2 + 9 : e1 * 100 + e2 * 10 + f2 },
      { a: f1 * 100 + f2, b: f1 * 100 + f2 * 10 },
      { a: g1, b: g1 },
      { a: k1 * 100 + k2, b: k2 * 100 + k1 },
      { a: m1 * 100 + m1 * 10 + m2, b: m1 * 100 + m2 * 10 + m1 }
    ].map((p) => ({
      a: p.a,
      b: p.b,
      ans: p.a < p.b ? "<" : p.a > p.b ? ">" : "="
    }));

    tasks.push({
      id: 11,
      type: "compare_numbers",
      topic: "Stellenwerte & Größenvergleich",
      title: "Zahlen vergleichen: <, > oder = ?",
      points: 6,
      prompt: "Vergleiche zuerst die Hunderter, dann die Zehner und zuletzt die Einer. Wähle das passende Zeichen (<, = oder >)!",
      pairs: t11Pairs,
      explanation: t11Pairs.map((p) => `${p.a} ${p.ans} ${p.b}`).join(" · ")
    });

    // 12. Aufgabe 12: Zahlen auf dem Rechenstrich ungefähr eintragen (Blatt 4, Nr. 5 & 6) - 8 Punkte
    const line1Nums = pickOne([
      [200, 450, 750, 900],
      [150, 400, 650, 850],
      [250, 500, 750, 920]
    ]);
    const subStart = pickOne([250, 450, 650, 750]);
    const subEnd = subStart + 50;
    const line2Nums = [
      subStart + randInt(2, 6),
      subStart + randInt(13, 19),
      subStart + 25,
      subStart + randInt(38, 45)
    ];

    tasks.push({
      id: 12,
      type: "rechenstrich_approx",
      topic: "Rechenstrich",
      title: "Zahlen auf dem Rechenstrich eintragen",
      points: 8,
      prompt: "Wo liegen die Zahlen ungefähr? Wähle eine Zahl aus und tippe auf die passende Stelle am Rechenstrich!",
      lines: [
        {
          label: "Rechenstrich 1 (von 0 bis 1000):",
          start: 0,
          end: 1000,
          numbers: line1Nums
        },
        {
          label: `Rechenstrich 2 (Ausschnitt von ${subStart} bis ${subEnd}):`,
          start: subStart,
          end: subEnd,
          numbers: line2Nums
        }
      ],
      explanation: `Tipp beim Rechenstrich: Suche zuerst die Mitte (bei 0 bis 1000 ist die Mitte 500; bei ${subStart} bis ${subEnd} ist die Mitte ${subStart + 25}). Ordne die Zahlen dann passend links und rechts davon ein.`
    });

    // 13. Aufgabe 13: Eigenen Rechenstrich-Bereich wählen & Zahlen eintragen (Blatt 4, Nr. 7) - 5 Punkte
    const cStart = pickOne([100, 200, 300, 400, 600, 800]);
    const cEnd = cStart + 100;
    const cNums = [
      cStart + randInt(8, 15),
      cStart + randInt(32, 44),
      cStart + randInt(60, 72),
      cStart + randInt(88, 96)
    ];

    tasks.push({
      id: 13,
      type: "rechenstrich_custom",
      topic: "Rechenstrich",
      title: "Rechenstrich beschriften & Zahlen einordnen",
      points: 5,
      prompt: `Schau dir die 4 Zahlen an: ${cNums.join(", ")}. Trage zuerst links und rechts den passenden Start- und Endhunderter ein (z. B. 300 und 400) und setze dann die 4 Zahlen auf den Rechenstrich!`,
      expectedStart: cStart,
      expectedEnd: cEnd,
      numbers: cNums,
      explanation: `Alle vier Zahlen liegen zwischen den Nachbarhundertern ${cStart} und ${cEnd}. Die Mitte des Rechenstrichs ist ${cStart + 50}.`
    });

    // 14. Aufgabe 14: Zahlzerlegungen bis 1000 - 6 Punkte
    const z1H = randInt(3, 8), z1Z = randInt(2, 9), z1E = randInt(1, 9);
    const z1Num = z1H * 100 + z1Z * 10 + z1E;
    const z2H = randInt(2, 9), z2E = randInt(2, 9);
    const z2Num = z2H * 100 + z2E; // with zero in tens!

    const eHBase = randInt(2, 7) * 100;
    const eHTens = randInt(2, 8) * 10;
    const e1Given = eHBase + eHTens;
    const e1Target = eHBase + 100;
    const e1Ans = 100 - eHTens;

    const e2Given = randInt(2, 8) * 100 + randInt(1, 9) * 10;
    const e2Ans = 1000 - e2Given;

    const roof1 = pickOne([500, 600, 700, 800]);
    const floor1Given = randInt(1, Math.floor(roof1 / 100) - 2) * 100 + randInt(2, 8) * 10;
    const floor1Ans = roof1 - floor1Given;

    const roof2 = pickOne([750, 850, 950]);
    const floor2A = 400;
    const floor2B = randInt(2, 3) * 100 + randInt(1, 4) * 10;
    const floor2Ans = roof2 - floor2A - floor2B;

    tasks.push({
      id: 14,
      type: "decompositions",
      topic: "Zahlzerlegungen",
      title: "Zahlzerlegungen & Ergänzen bis 1000",
      points: 6,
      prompt: "Zerlege die Zahlen, ergänze zum nächsten Hunderter / bis 1000 und vervollständige die Zahlhäuser!",
      items: [
        { kind: "place_gap", label: `${z1Num} = ${z1H * 100} +`, after: `+ ${z1E}`, ans: z1Z * 10 },
        { kind: "place_sum", label: `${z2H * 100} + ${z2E} =`, after: "", ans: z2Num },
        { kind: "comp_h", label: `${e1Given} +`, after: `= ${e1Target}`, ans: e1Ans },
        { kind: "comp_1000", label: `${e2Given} +`, after: `= 1000`, ans: e2Ans },
        { kind: "house2", roof: roof1, givenText: `${floor1Given} +`, ans: floor1Ans },
        { kind: "house3", roof: roof2, givenText: `${floor2A} + ${floor2B} +`, ans: floor2Ans }
      ],
      explanation: `Lösungen: ${z1Z * 10}, ${z2Num}, ${e1Ans}, ${e2Ans}, sowie in den Zahlhäusern ${floor1Ans} (denn ${floor1Given} + ${floor1Ans} = ${roof1}) und ${floor2Ans} (denn ${floor2A} + ${floor2B} + ${floor2Ans} = ${roof2}).`
    });

    // 15. Aufgabe 15: Zahlenfolgen & Regel erkennen - 6 Punkte
    const s1Step = pickOne([20, 30, 40, 50]);
    const s1Start = randInt(12, 35) * 10;
    const seq1Nums = [0, 1, 2, 3, 4, 5, 6].map((i) => s1Start + i * s1Step);
    const seq1Rule = `Immer +${s1Step}`;

    const s2Step = pickOne([20, 30, 50]);
    const s2Start = randInt(65, 92) * 10;
    const seq2Nums = [0, 1, 2, 3, 4, 5, 6].map((i) => s2Start - i * s2Step);
    const seq2Rule = `Immer −${s2Step}`;

    const altPair = pickOne([
      { a: 10, b: 20, label: "Abwechselnd +10, +20" },
      { a: 20, b: 10, label: "Abwechselnd +20, +10" },
      { a: 50, b: -10, label: "Abwechselnd +50, −10" }
    ]);
    const seq3Nums = [randInt(20, 45) * 10];
    for (let i = 0; i < 6; i++) {
      const prev = seq3Nums[seq3Nums.length - 1];
      seq3Nums.push(prev + (i % 2 === 0 ? altPair.a : altPair.b));
    }

    tasks.push({
      id: 15,
      type: "number_sequences",
      topic: "Zahlenfolgen",
      title: "Zahlenfolgen fortsetzen & Regel erkennen",
      points: 6,
      prompt: "Setze jede Zahlenfolge um 2 Zahlen fort und wähle darunter die passende Regel aus!",
      sequences: [
        {
          given: seq1Nums.slice(0, 5),
          ans1: seq1Nums[5],
          ans2: seq1Nums[6],
          correctRule: seq1Rule,
          ruleOptions: shuffle([seq1Rule, `Immer +${s1Step + 10}`, `Immer −${s1Step}`, `Immer +100`])
        },
        {
          given: seq2Nums.slice(0, 5),
          ans1: seq2Nums[5],
          ans2: seq2Nums[6],
          correctRule: seq2Rule,
          ruleOptions: shuffle([seq2Rule, `Immer +${s2Step}`, `Immer −${s2Step + 10}`, `Immer −10`])
        },
        {
          given: seq3Nums.slice(0, 5),
          ans1: seq3Nums[5],
          ans2: seq3Nums[6],
          correctRule: altPair.label,
          ruleOptions: shuffle([
            altPair.label,
            "Immer +30",
            "Immer +15",
            "Abwechselnd +20, −20"
          ])
        }
      ],
      explanation: `Folge 1 (${seq1Rule}): ${seq1Nums[5]}, ${seq1Nums[6]} · Folge 2 (${seq2Rule}): ${seq2Nums[5]}, ${seq2Nums[6]} · Folge 3 (${altPair.label}): ${seq3Nums[5]}, ${seq3Nums[6]}.`
    });

    // 16. Aufgabe 16: Kleines 1×1 und Division (Klassisch) - 6 Punkte
    const multPairs = sampleUnique(
      [
        [3, 7], [4, 6], [4, 8], [6, 7], [6, 8], [6, 9],
        [7, 7], [7, 8], [7, 9], [8, 8], [8, 9], [9, 4]
      ],
      6
    );
    const t16Items = [
      { op: "·", a: multPairs[0][0], b: multPairs[0][1], ans: multPairs[0][0] * multPairs[0][1] },
      { op: "·", a: multPairs[1][0], b: multPairs[1][1], ans: multPairs[1][0] * multPairs[1][1] },
      { op: "·", a: multPairs[2][0], b: multPairs[2][1], ans: multPairs[2][0] * multPairs[2][1] },
      { op: ":", a: multPairs[3][0] * multPairs[3][1], b: multPairs[3][0], ans: multPairs[3][1] },
      { op: ":", a: multPairs[4][0] * multPairs[4][1], b: multPairs[4][0], ans: multPairs[4][1] },
      { op: ":", a: multPairs[5][0] * multPairs[5][1], b: multPairs[5][0], ans: multPairs[5][1] }
    ];

    tasks.push({
      id: 16,
      type: "mult_div_basic",
      topic: "Multiplikation & Division",
      title: "Kleines Einmaleins & Teilen",
      points: 6,
      prompt: "Rechne die Mal- und Geteiltaufgaben im Kopf aus:",
      items: t16Items,
      explanation: t16Items.map((it) => `${it.a} ${it.op} ${it.b} = ${it.ans}`).join(" · ")
    });

    // 17. Aufgabe 17: Lücken- und Umkehraufgaben zum 1×1 - 6 Punkte
    const gapPairs = sampleUnique(
      [
        [6, 7], [8, 9], [7, 5], [9, 6], [4, 8], [7, 9], [8, 6], [5, 9], [3, 8]
      ],
      6
    );
    const t17Items = [
      { mode: "missingA", op: "·", a: gapPairs[0][0], b: gapPairs[0][1], c: gapPairs[0][0] * gapPairs[0][1], ans: gapPairs[0][0] },
      { mode: "missingB", op: "·", a: gapPairs[1][0], b: gapPairs[1][1], c: gapPairs[1][0] * gapPairs[1][1], ans: gapPairs[1][1] },
      { mode: "missingA", op: ":", a: gapPairs[2][0] * gapPairs[2][1], b: gapPairs[2][0], c: gapPairs[2][1], ans: gapPairs[2][0] * gapPairs[2][1] },
      { mode: "missingB", op: ":", a: gapPairs[3][0] * gapPairs[3][1], b: gapPairs[3][0], c: gapPairs[3][1], ans: gapPairs[3][0] },
      { mode: "missingA", op: "·", a: gapPairs[4][0], b: gapPairs[4][1], c: gapPairs[4][0] * gapPairs[4][1], ans: gapPairs[4][0] },
      { mode: "missingB", op: ":", a: gapPairs[5][0] * gapPairs[5][1], b: gapPairs[5][0], c: gapPairs[5][1], ans: gapPairs[5][0] }
    ];

    tasks.push({
      id: 17,
      type: "mult_div_missing",
      topic: "Multiplikation & Division",
      title: "Lücken- und Umkehraufgaben im 1×1",
      points: 6,
      prompt: "Welche Zahl fehlt in der Lücke? Nutze die Umkehraufgabe als Hilfe!",
      items: t17Items,
      explanation: t17Items
        .map((it) => `${it.a} ${it.op} ${it.b} = ${it.c}`)
        .join(" · ")
    });

    // 18. Aufgabe 18: Aufgabenfamilie aus 3 Zahlen - 4 Punkte
    const famPair = pickOne([
      [6, 8], [7, 9], [6, 7], [8, 9], [4, 7], [6, 9], [7, 8]
    ]);
    const famA = famPair[0];
    const famB = famPair[1];
    const famP = famA * famB;

    tasks.push({
      id: 18,
      type: "fact_family",
      topic: "Multiplikation & Division",
      title: "Aufgabenfamilie (Tausch- & Umkehraufgaben)",
      points: 4,
      prompt: `Bilde aus den drei Zahlen ${famA}, ${famB} und ${famP} zwei verschiedene Malaufgaben und zwei verschiedene Geteiltaufgaben!`,
      numbers: [famA, famB, famP],
      a: famA,
      b: famB,
      p: famP,
      explanation: `Die 4 Aufgaben der Familie heißen: ${famA} · ${famB} = ${famP}, ${famB} · ${famA} = ${famP}, ${famP} : ${famA} = ${famB} und ${famP} : ${famB} = ${famA}.`
    });

    // 19. Aufgabe 19: Sachaufgabe zum 1×1 & Teilen - 3 Punkte
    const wp1Templates = [
      () => {
        const rows = randInt(6, 9);
        const perRow = randInt(7, 9);
        const total = rows * perRow;
        return {
          story: `Für das Schulfest werden in der Turnhalle <strong>${rows} Reihen</strong> mit Stühlen aufgestellt. In jeder Reihe stehen genau <strong>${perRow} Stühle</strong>. Wie viele Stühle stehen insgesamt in der Turnhalle?`,
          op: "·",
          a: rows,
          b: perRow,
          commutative: true,
          ans: total,
          correctSentence: `Es stehen insgesamt ${total} Stühle in der Turnhalle.`,
          options: shuffle([
            `Es stehen insgesamt ${total} Stühle in der Turnhalle.`,
            `Es stehen insgesamt ${rows + perRow} Stühle in der Turnhalle.`,
            `In jeder Reihe fehlen noch ${total} Stühle.`
          ])
        };
      },
      () => {
        const kids = randInt(6, 9);
        const each = randInt(6, 8);
        const total = kids * each;
        return {
          story: `Oma verteilt <strong>${total} Erdbeeren</strong> gerecht an <strong>${kids} Kinder</strong>. Jedes Kind bekommt gleich viele Erdbeeren. Wie viele Erdbeeren bekommt jedes Kind?`,
          op: ":",
          a: total,
          b: kids,
          commutative: false,
          ans: each,
          correctSentence: `Jedes Kind bekommt ${each} Erdbeeren.`,
          options: shuffle([
            `Jedes Kind bekommt ${each} Erdbeeren.`,
            `Jedes Kind bekommt ${total - kids} Erdbeeren.`,
            `Alle Kinder zusammen haben ${each} Erdbeeren.`
          ])
        };
      },
      () => {
        const boxes = randInt(7, 9);
        const perBox = randInt(6, 8);
        const total = boxes * perBox;
        return {
          story: `Der Sportlehrer kauft <strong>${boxes} Packungen</strong> Tischtennisbälle. In jeder Packung sind <strong>${perBox} Bälle</strong>. Wie viele Tischtennisbälle hat er insgesamt gekauft?`,
          op: "·",
          a: boxes,
          b: perBox,
          commutative: true,
          ans: total,
          correctSentence: `Er hat insgesamt ${total} Tischtennisbälle gekauft.`,
          options: shuffle([
            `Er hat insgesamt ${total} Tischtennisbälle gekauft.`,
            `Er hat insgesamt ${boxes + perBox} Tischtennisbälle gekauft.`,
            `Es sind ${total} Packungen in der Sporthalle.`
          ])
        };
      }
    ];
    const wp1 = pickOne(wp1Templates)();
    tasks.push({
      id: 19,
      type: "word_problem",
      topic: "Textaufgaben (1×1 & Teilen)",
      title: "Sachaufgabe: Malnehmen & Teilen",
      points: 3,
      prompt: "Lies die Sachaufgabe genau durch. Stelle die passende Rechnung auf, berechne das Ergebnis und wähle den richtigen Antwortsatz!",
      allowedOps: ["·", ":", "+", "−"],
      data: wp1,
      explanation: `Rechnung: ${wp1.a} ${wp1.op} ${wp1.b} = ${wp1.ans}. Antwortsatz: „${wp1.correctSentence}“`
    });

    // 20. Aufgabe 20: Sachaufgabe im Zahlenraum bis 1000 - 3 Punkte
    const wp2Templates = [
      () => {
        const goal = pickOne([500, 600, 700, 800]);
        const saved = randInt(2, Math.floor(goal / 100) - 2) * 100 + randInt(2, 8) * 10;
        const diff = goal - saved;
        return {
          story: `Für ein großes Klettergerüst auf dem Schulhof werden <strong>${goal} Euro</strong> benötigt. Beim Kuchenverkauf hat die 3. Klasse schon <strong>${saved} Euro</strong> eingenommen. Wie viel Euro fehlen noch?`,
          op: "−",
          a: goal,
          b: saved,
          commutative: false,
          ans: diff,
          correctSentence: `Es fehlen noch ${diff} Euro für das Klettergerüst.`,
          options: shuffle([
            `Es fehlen noch ${diff} Euro für das Klettergerüst.`,
            `Es fehlen noch ${goal + saved} Euro für das Klettergerüst.`,
            `Das Klettergerüst kostet nur ${diff} Euro.`
          ])
        };
      },
      () => {
        const morning = randInt(2, 4) * 100 + randInt(2, 6) * 10;
        const afternoon = randInt(2, 4) * 100 + randInt(1, 3) * 10;
        const sum = morning + afternoon;
        return {
          story: `Im Tierpark waren am Vormittag <strong>${morning} Besucher</strong>. Am Nachmittag kamen noch <strong>${afternoon} Besucher</strong> dazu. Wie viele Besucher waren an diesem Tag insgesamt im Tierpark?`,
          op: "+",
          a: morning,
          b: afternoon,
          commutative: true,
          ans: sum,
          correctSentence: `Insgesamt waren ${sum} Besucher im Tierpark.`,
          options: shuffle([
            `Insgesamt waren ${sum} Besucher im Tierpark.`,
            `Insgesamt waren ${ Math.abs(morning - afternoon) } Besucher im Tierpark.`,
            `Am Abend waren noch ${afternoon} Tiere im Park.`
          ])
        };
      },
      () => {
        const totalBooks = pickOne([650, 750, 850, 900]);
        const borrowed = randInt(2, 4) * 100 + 50;
        const left = totalBooks - borrowed;
        return {
          story: `In der Schulbücherei gibt es insgesamt <strong>${totalBooks} Bücher</strong>. Davon sind gerade <strong>${borrowed} Bücher</strong> an Kinder ausgeliehen. Wie viele Bücher stehen noch in den Regalen?`,
          op: "−",
          a: totalBooks,
          b: borrowed,
          commutative: false,
          ans: left,
          correctSentence: `Es stehen noch ${left} Bücher in den Regalen.`,
          options: shuffle([
            `Es stehen noch ${left} Bücher in den Regalen.`,
            `Es stehen noch ${totalBooks + borrowed} Bücher in den Regalen.`,
            `Die Kinder haben ${left} Bücher gelesen.`
          ])
        };
      }
    ];
    const wp2 = pickOne(wp2Templates)();
    tasks.push({
      id: 20,
      type: "word_problem",
      topic: "Textaufgaben (bis 1000)",
      title: "Sachaufgabe: Große Zahlen bis 1000",
      points: 3,
      prompt: "Lies die Sachaufgabe genau durch. Stelle die passende Rechnung auf, berechne das Ergebnis und wähle den richtigen Antwortsatz!",
      allowedOps: ["+", "−", "·", ":"],
      data: wp2,
      explanation: `Rechnung: ${wp2.a} ${wp2.op} ${wp2.b} = ${wp2.ans}. Antwortsatz: „${wp2.correctSentence}“`
    });

    return tasks;
  }

  // --- Initial Empty Answer State for Each Task ---
  function createInitialAnswers(tasks) {
    return tasks.map((t) => {
      switch (t.type) {
        case "dienes_read":
          return t.items.map(() => ({ th: "", tz: "", te: "", num: "" }));
        case "represent_split":
          return t.items.map(() => ({ ch: "", cz: "", ce: "", sh: "", sz: "", se: "" }));
        case "dienes_build":
          return t.items.map(() => ({ h: 0, z: 0, e: 0 }));
        case "bundle_swap":
          return {
            left: t.leftItems.map(() => ({ z: "", e: "" })),
            right: t.rightItems.map(() => ({ h: "", z: "", e: "" }))
          };
        case "word_htafel":
          return {
            written: t.targets.map(() => ""),
            circled: []
          };
        case "htafel_puzzle":
          return t.puzzles.map((p) => p.cells.map((c) => (c.given ? String(c.val) : "")));
        case "number_riddles":
          return t.riddles.map(() => "");
        case "number_line_connect":
          return {
            selectedCardIdx: 0,
            connections: {} // cardIdx -> value on number line
          };
        case "neighbor_tens":
        case "neighbor_hundreds":
          return t.items.map(() => ({ low: "", high: "", closer: "" }));
        case "compare_numbers":
          return t.pairs.map(() => "");
        case "rechenstrich_approx":
          return {
            activeChip: [0, 0],
            placed: t.lines.map(() => ({})) // num -> placedValue
          };
        case "rechenstrich_custom":
          return {
            startVal: "",
            endVal: "",
            activeChip: 0,
            placed: {} // idx -> ratio (0..1)
          };
        case "decompositions":
          return t.items.map(() => "");
        case "number_sequences":
          return t.sequences.map(() => ({ n1: "", n2: "", rule: "" }));
        case "mult_div_basic":
        case "mult_div_missing":
          return t.items.map(() => "");
        case "fact_family":
          return {
            mult: [
              { a: "", b: "", c: "" },
              { a: "", b: "", c: "" }
            ],
            div: [
              { a: "", b: "", c: "" },
              { a: "", b: "", c: "" }
            ]
          };
        case "word_problem":
          return { a: "", op: "", b: "", res: "", sentence: "" };
        default:
          return {};
      }
    });
  }

  // --- Check Task Completion Status ('none' | 'partial' | 'answered') ---
  function getTaskStatus(task, ans) {
    const filled = [];
    const pushStr = (v) => filled.push(v !== undefined && v !== null && String(v).trim() !== "");

    switch (task.type) {
      case "dienes_read":
        ans.forEach((it) => {
          pushStr(it.th); pushStr(it.tz); pushStr(it.te);
          pushStr(it.num);
        });
        break;
      case "represent_split":
        ans.forEach((it) => {
          pushStr(it.ch); pushStr(it.cz); pushStr(it.ce);
          pushStr(it.sh); pushStr(it.sz); pushStr(it.se);
        });
        break;
      case "dienes_build":
        ans.forEach((it) => filled.push(it.h > 0 || it.z > 0 || it.e > 0));
        break;
      case "bundle_swap":
        ans.left.forEach((it) => { pushStr(it.z); pushStr(it.e); });
        ans.right.forEach((it) => { pushStr(it.h); pushStr(it.z); pushStr(it.e); });
        break;
      case "word_htafel":
        ans.written.forEach(pushStr);
        for (let i = 0; i < task.targets.length; i++) {
          filled.push(ans.circled.length > i);
        }
        break;
      case "htafel_puzzle":
        task.puzzles.forEach((p, pi) => {
          p.cells.forEach((c, ci) => {
            if (!c.given) pushStr(ans[pi][ci]);
          });
        });
        break;
      case "number_riddles":
      case "compare_numbers":
      case "decompositions":
      case "mult_div_basic":
      case "mult_div_missing":
        ans.forEach(pushStr);
        break;
      case "number_line_connect":
        task.numbers.forEach((_, idx) => filled.push(ans.connections[idx] !== undefined));
        break;
      case "neighbor_tens":
      case "neighbor_hundreds":
        ans.forEach((it) => {
          pushStr(it.low); pushStr(it.high); pushStr(it.closer);
        });
        break;
      case "rechenstrich_approx":
        task.lines.forEach((ln, li) => {
          ln.numbers.forEach((num) => filled.push(ans.placed[li][num] !== undefined));
        });
        break;
      case "rechenstrich_custom":
        pushStr(ans.startVal);
        pushStr(ans.endVal);
        task.numbers.forEach((_, ni) => filled.push(ans.placed[ni] !== undefined));
        break;
      case "number_sequences":
        ans.forEach((it) => {
          pushStr(it.n1); pushStr(it.n2); pushStr(it.rule);
        });
        break;
      case "fact_family":
        ans.mult.forEach((m) => { pushStr(m.a); pushStr(m.b); pushStr(m.c); });
        ans.div.forEach((d) => { pushStr(d.a); pushStr(d.b); pushStr(d.c); });
        break;
      case "word_problem":
        pushStr(ans.a); pushStr(ans.op); pushStr(ans.b); pushStr(ans.res); pushStr(ans.sentence);
        break;
    }

    const trues = filled.filter(Boolean).length;
    if (trues === 0) return "none";
    if (trues === filled.length) return "answered";
    return "partial";
  }

  // --- Evaluate a Single Task (Exact Integer Points) ---
  function evaluateTask(task, ans) {
    let points = 0;

    switch (task.type) {
      case "dienes_read": {
        task.items.forEach((it, idx) => {
          const u = ans[idx];
          const hOk = parseCleanInt(u.th) === it.h;
          const zOk = parseCleanInt(u.tz) === it.z;
          const eOk = parseCleanInt(u.te) === it.e;
          if (hOk && zOk && eOk) points += 1;
          if (parseCleanInt(u.num) === it.h * 100 + it.z * 10 + it.e) points += 1;
        });
        break;
      }

      case "represent_split": {
        task.items.forEach((it, idx) => {
          const u = ans[idx];
          const cardsOk =
            parseCleanInt(u.ch) === it.h &&
            parseCleanInt(u.cz) === it.z &&
            parseCleanInt(u.ce) === it.e;
          const sumOk =
            parseCleanInt(u.sh) === it.h * 100 &&
            parseCleanInt(u.sz) === it.z * 10 &&
            parseCleanInt(u.se) === it.e;
          if (cardsOk && sumOk) points += 1;
        });
        break;
      }

      case "dienes_build": {
        task.items.forEach((it, idx) => {
          const u = ans[idx];
          if (u.h === it.h && u.z === it.z && u.e === it.e) points += 2;
        });
        break;
      }

      case "bundle_swap": {
        task.leftItems.forEach((it, idx) => {
          const u = ans.left[idx];
          if (parseCleanInt(u.z) === it.ansZ && parseCleanInt(u.e) === it.ansE) points += 1;
        });
        task.rightItems.forEach((it, idx) => {
          const u = ans.right[idx];
          if (
            parseCleanInt(u.h) === it.ansH &&
            parseCleanInt(u.z) === it.ansZ &&
            parseCleanInt(u.e) === it.ansE
          ) {
            points += 1;
          }
        });
        break;
      }

      case "word_htafel": {
        // 3 points for written numbers
        task.targets.forEach((t, idx) => {
          if (parseCleanInt(ans.written[idx]) === t.num) points += 1;
        });
        // 3 points for circling in the Hundertertafel
        const targetSet = new Set(task.targets.map((t) => t.num));
        let circleHits = 0;
        let circleWrong = 0;
        ans.circled.forEach((n) => {
          if (targetSet.has(n)) circleHits += 1;
          else circleWrong += 1;
        });
        points += Math.max(0, circleHits - circleWrong);
        break;
      }

      case "htafel_puzzle": {
        task.puzzles.forEach((p, pi) => {
          let rightCells = 0;
          p.cells.forEach((c, ci) => {
            if (!c.given && parseCleanInt(ans[pi][ci]) === c.val) {
              rightCells += 1;
            }
          });
          if (rightCells === 4) points += 2;
          else if (rightCells >= 2) points += 1;
        });
        break;
      }

      case "number_riddles": {
        task.riddles.forEach((r, idx) => {
          if (parseCleanInt(ans[idx]) === r.answer) points += 2;
        });
        break;
      }

      case "number_line_connect": {
        task.numbers.forEach((num, idx) => {
          if (ans.connections[idx] === num) points += 1;
        });
        break;
      }

      case "neighbor_tens":
      case "neighbor_hundreds": {
        task.items.forEach((it, idx) => {
          const u = ans[idx];
          if (
            parseCleanInt(u.low) === it.low &&
            parseCleanInt(u.high) === it.high &&
            u.closer === it.closer
          ) {
            points += 1;
          }
        });
        break;
      }

      case "compare_numbers": {
        task.pairs.forEach((p, idx) => {
          if (ans[idx] === p.ans) points += 1;
        });
        break;
      }

      case "rechenstrich_approx": {
        task.lines.forEach((ln, li) => {
          const span = ln.end - ln.start;
          const tol = span * 0.085; // 8.5% fair tolerance
          ln.numbers.forEach((num) => {
            const placedVal = ans.placed[li][num];
            if (placedVal !== undefined && Math.abs(placedVal - num) <= tol) {
              points += 1;
            }
          });
        });
        break;
      }

      case "rechenstrich_custom": {
        const startOk = parseCleanInt(ans.startVal) === task.expectedStart;
        const endOk = parseCleanInt(ans.endVal) === task.expectedEnd;
        if (startOk && endOk) points += 1;
        task.numbers.forEach((num, ni) => {
          const ratio = ans.placed[ni];
          const idealRatio = (num - task.expectedStart) / 100;
          if (ratio !== undefined && Math.abs(ratio - idealRatio) <= 0.085) {
            points += 1;
          }
        });
        break;
      }

      case "decompositions": {
        task.items.forEach((it, idx) => {
          if (parseCleanInt(ans[idx]) === it.ans) points += 1;
        });
        break;
      }

      case "number_sequences": {
        task.sequences.forEach((seq, idx) => {
          const u = ans[idx];
          if (parseCleanInt(u.n1) === seq.ans1 && parseCleanInt(u.n2) === seq.ans2) {
            points += 1;
          }
          if (u.rule === seq.correctRule) {
            points += 1;
          }
        });
        break;
      }

      case "mult_div_basic":
      case "mult_div_missing": {
        task.items.forEach((it, idx) => {
          if (parseCleanInt(ans[idx]) === it.ans) points += 1;
        });
        break;
      }

      case "fact_family": {
        const seenMult = new Set();
        ans.mult.forEach((m) => {
          const a = parseCleanInt(m.a);
          const b = parseCleanInt(m.b);
          const c = parseCleanInt(m.c);
          if (
            c === task.p &&
            ((a === task.a && b === task.b) || (a === task.b && b === task.a))
          ) {
            const key = `${a}*${b}=${c}`;
            if (!seenMult.has(key)) {
              seenMult.add(key);
              points += 1;
            }
          }
        });
        const seenDiv = new Set();
        ans.div.forEach((d) => {
          const a = parseCleanInt(d.a);
          const b = parseCleanInt(d.b);
          const c = parseCleanInt(d.c);
          if (
            a === task.p &&
            ((b === task.a && c === task.b) || (b === task.b && c === task.a))
          ) {
            const key = `${a}:${b}=${c}`;
            if (!seenDiv.has(key)) {
              seenDiv.add(key);
              points += 1;
            }
          }
        });
        break;
      }

      case "word_problem": {
        const d = task.data;
        const ua = parseCleanInt(ans.a);
        const ub = parseCleanInt(ans.b);
        const ures = parseCleanInt(ans.res);
        const opOk = ans.op === d.op;
        const numsOk = d.commutative
          ? (ua === d.a && ub === d.b) || (ua === d.b && ub === d.a)
          : ua === d.a && ub === d.b;
        if (opOk && numsOk) points += 1;
        if (ures === d.ans) points += 1;
        if (ans.sentence === d.correctSentence) points += 1;
        break;
      }
    }

    return { points, maxPoints: task.points };
  }

  // --- App State ---
  let examTasks = [];
  let userAnswers = [];
  let currentTaskIdx = 0;
  let isReviewMode = false;
  let timerSeconds = 0;
  let timerInterval = null;

  // --- DOM Elements ---
  const startScreen = document.getElementById("startScreen");
  const examScreen = document.getElementById("examScreen");
  const resultsScreen = document.getElementById("resultsScreen");
  const taskNav = document.getElementById("taskNav");
  const taskTabs = document.getElementById("taskTabs");
  const appFooter = document.getElementById("appFooter");

  const timerText = document.getElementById("timerText");
  const btnBackToResults = document.getElementById("btnBackToResults");
  const btnHeaderSubmit = document.getElementById("btnHeaderSubmit");

  const taskNumBadge = document.getElementById("taskNumBadge");
  const taskTitle = document.getElementById("taskTitle");
  const taskTopicTag = document.getElementById("taskTopicTag");
  const taskPoints = document.getElementById("taskPoints");
  const taskPrompt = document.getElementById("taskPrompt");
  const taskBody = document.getElementById("taskBody");

  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const btnFinish = document.getElementById("btnFinish");
  const footerStatus = document.getElementById("footerStatus");

  const confirmModal = document.getElementById("confirmModal");
  const modalMsg = document.getElementById("modalMsg");
  const modalBtnCancel = document.getElementById("modalBtnCancel");
  const modalBtnConfirm = document.getElementById("modalBtnConfirm");

  // --- Timer ---
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function startTimer() {
    stopTimer();
    timerSeconds = 0;
    timerText.textContent = "00:00";
    timerInterval = setInterval(() => {
      timerSeconds += 1;
      timerText.textContent = formatTime(timerSeconds);
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // --- Start New Exam ---
  function startNewExam() {
    examTasks = generateExamTasks();
    userAnswers = createInitialAnswers(examTasks);
    currentTaskIdx = 0;
    isReviewMode = false;

    startScreen.hidden = true;
    resultsScreen.hidden = true;
    examScreen.hidden = false;
    taskNav.hidden = false;
    appFooter.hidden = false;
    btnBackToResults.hidden = true;
    btnHeaderSubmit.hidden = false;

    startTimer();
    renderTabs();
    renderCurrentTask();
  }

  // --- Render 20 Navigation Tabs ---
  function renderTabs() {
    taskTabs.innerHTML = "";
    examTasks.forEach((task, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "task-tab-btn";
      btn.textContent = String(idx + 1);
      btn.title = `Aufgabe ${idx + 1}: ${task.title}`;

      if (idx === currentTaskIdx) {
        btn.classList.add("active");
      }

      if (isReviewMode) {
        const res = evaluateTask(task, userAnswers[idx]);
        if (res.points === res.maxPoints) btn.classList.add("review-good");
        else if (res.points > 0) btn.classList.add("review-partial");
        else btn.classList.add("review-bad");
      } else {
        const st = getTaskStatus(task, userAnswers[idx]);
        if (st === "answered") btn.classList.add("answered");
        else if (st === "partial") btn.classList.add("partial");
      }

      btn.addEventListener("click", () => {
        currentTaskIdx = idx;
        renderTabs();
        renderCurrentTask();
      });

      taskTabs.appendChild(btn);
    });
  }

  // --- Helper to render numeric input with review state ---
  function makeNumInput({ value, onChange, expected, sizeClass = "", placeholder = "" }) {
    const wrap = document.createElement("span");
    wrap.style.display = "inline-flex";
    wrap.style.alignItems = "center";

    const inp = document.createElement("input");
    inp.type = "text";
    inp.inputMode = "numeric";
    inp.autocomplete = "off";
    inp.className = `num-input ${sizeClass}`.trim();
    inp.value = value !== undefined && value !== null ? String(value) : "";
    inp.placeholder = placeholder;

    if (isReviewMode) {
      inp.disabled = true;
      const isOk =
        typeof expected === "function"
          ? expected(parseCleanInt(inp.value))
          : parseCleanInt(inp.value) === expected;
      inp.classList.add(isOk ? "input-correct" : "input-wrong");
      wrap.appendChild(inp);
      if (!isOk && expected !== null && typeof expected !== "function") {
        const hint = document.createElement("span");
        hint.className = "solution-hint";
        hint.textContent = String(expected);
        wrap.appendChild(hint);
      }
    } else {
      inp.addEventListener("input", () => {
        inp.value = inp.value.replace(/[^0-9]/g, "");
        onChange(inp.value);
        renderTabs();
      });
      wrap.appendChild(inp);
    }

    return wrap;
  }

  // --- Render Current Task ---
  function renderCurrentTask() {
    const task = examTasks[currentTaskIdx];
    const ans = userAnswers[currentTaskIdx];

    taskNumBadge.textContent = `Aufgabe ${task.id}`;
    taskTitle.textContent = task.title;
    taskTopicTag.textContent = task.topic;

    if (isReviewMode) {
      const ev = evaluateTask(task, ans);
      taskPoints.textContent = `${ev.points} / ${ev.maxPoints} Punkte`;
    } else {
      taskPoints.textContent = `${task.points} Punkte`;
    }

    taskPrompt.innerHTML = task.prompt;
    taskBody.innerHTML = "";
    taskBody.scrollTop = 0;

    // Footer buttons
    btnPrev.disabled = currentTaskIdx === 0;
    footerStatus.textContent = `Aufgabe ${currentTaskIdx + 1} von ${examTasks.length}`;

    if (currentTaskIdx === examTasks.length - 1) {
      btnNext.hidden = true;
      btnFinish.hidden = isReviewMode;
    } else {
      btnNext.hidden = false;
      btnFinish.hidden = true;
    }

    // Dispatch to specific task renderer
    switch (task.type) {
      case "dienes_read":
        renderTaskDienesRead(task, ans);
        break;
      case "represent_split":
        renderTaskRepresentSplit(task, ans);
        break;
      case "dienes_build":
        renderTaskDienesBuild(task, ans);
        break;
      case "bundle_swap":
        renderTaskBundleSwap(task, ans);
        break;
      case "word_htafel":
        renderTaskWordHtafel(task, ans);
        break;
      case "htafel_puzzle":
        renderTaskHtafelPuzzle(task, ans);
        break;
      case "number_riddles":
        renderTaskNumberRiddles(task, ans);
        break;
      case "number_line_connect":
        renderTaskNumberLineConnect(task, ans);
        break;
      case "neighbor_tens":
      case "neighbor_hundreds":
        renderTaskNeighbors(task, ans);
        break;
      case "compare_numbers":
        renderTaskCompareNumbers(task, ans);
        break;
      case "rechenstrich_approx":
        renderTaskRechenstrichApprox(task, ans);
        break;
      case "rechenstrich_custom":
        renderTaskRechenstrichCustom(task, ans);
        break;
      case "decompositions":
        renderTaskDecompositions(task, ans);
        break;
      case "number_sequences":
        renderTaskNumberSequences(task, ans);
        break;
      case "mult_div_basic":
        renderTaskMultDivBasic(task, ans);
        break;
      case "mult_div_missing":
        renderTaskMultDivMissing(task, ans);
        break;
      case "fact_family":
        renderTaskFactFamily(task, ans);
        break;
      case "word_problem":
        renderTaskWordProblem(task, ans);
        break;
    }

    // In review mode, append explanation banner
    if (isReviewMode && task.explanation) {
      const banner = document.createElement("div");
      banner.className = "review-banner";
      banner.innerHTML = `<strong>💡 Erklärung &amp; Lösungsweg:</strong> ${task.explanation}`;
      taskBody.appendChild(banner);
    }
  }

  // --- Task 1: Dienes Read ---
  function renderTaskDienesRead(task, ans) {
    const grid = document.createElement("div");
    grid.className = "panel-grid-2";

    task.items.forEach((it, idx) => {
      const u = ans[idx];
      const card = document.createElement("div");
      card.className = "task-card";

      const svgBox = document.createElement("div");
      svgBox.className = "dienes-svg-box";
      svgBox.innerHTML = renderDienesSVG(it.h, it.z, it.e);
      card.appendChild(svgBox);

      const bottomRow = document.createElement("div");
      bottomRow.style.display = "flex";
      bottomRow.style.alignItems = "center";
      bottomRow.style.justifyContent = "space-around";
      bottomRow.style.gap = "0.75rem";
      bottomRow.style.flexWrap = "wrap";

      // Stellenwerttafel
      const tbl = document.createElement("table");
      tbl.className = "stellenwerttafel";
      tbl.innerHTML = `<thead><tr><th>H</th><th>Z</th><th>E</th></tr></thead>`;
      const tbody = document.createElement("tbody");
      const tr = document.createElement("tr");
      [
        { k: "th", exp: it.h },
        { k: "tz", exp: it.z },
        { k: "te", exp: it.e }
      ].forEach((col) => {
        const td = document.createElement("td");
        td.appendChild(
          makeNumInput({
            value: u[col.k],
            onChange: (v) => (u[col.k] = v),
            expected: col.exp,
            sizeClass: "sm"
          })
        );
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
      tbl.appendChild(tbody);

      const numWrap = document.createElement("div");
      numWrap.style.display = "flex";
      numWrap.style.flexDirection = "column";
      numWrap.style.alignItems = "center";
      numWrap.style.gap = "0.25rem";
      const lbl = document.createElement("span");
      lbl.style.fontSize = "0.85rem";
      lbl.style.fontWeight = "800";
      lbl.style.color = "var(--ink-muted)";
      lbl.textContent = "Zahl:";
      numWrap.appendChild(lbl);
      numWrap.appendChild(
        makeNumInput({
          value: u.num,
          onChange: (v) => (u.num = v),
          expected: it.h * 100 + it.z * 10 + it.e,
          sizeClass: "lg"
        })
      );

      bottomRow.append(tbl, numWrap);
      card.appendChild(bottomRow);
      grid.appendChild(card);
    });

    taskBody.appendChild(grid);
  }

  // --- Task 2: Stelle die Zahlen unterschiedlich dar ---
  function renderTaskRepresentSplit(task, ans) {
    task.items.forEach((it, idx) => {
      const u = ans[idx];
      const row = document.createElement("div");
      row.className = "rep-row";

      const sketchBox = document.createElement("div");
      sketchBox.innerHTML = renderSketchDienesSVG(it.h, it.z, it.e);

      const cardsBox = document.createElement("div");
      cardsBox.className = "place-cards-box";
      cardsBox.append(
        makeNumInput({ value: u.ch, onChange: (v) => (u.ch = v), expected: it.h, sizeClass: "sm" }),
        makeNumInput({ value: u.cz, onChange: (v) => (u.cz = v), expected: it.z, sizeClass: "sm" }),
        makeNumInput({ value: u.ce, onChange: (v) => (u.ce = v), expected: it.e, sizeClass: "sm" })
      );

      const sumBox = document.createElement("div");
      sumBox.className = "hze-row";
      sumBox.append(
        document.createTextNode("= "),
        makeNumInput({ value: u.sh, onChange: (v) => (u.sh = v), expected: it.h * 100 }),
        document.createTextNode(" + "),
        makeNumInput({ value: u.sz, onChange: (v) => (u.sz = v), expected: it.z * 10 }),
        document.createTextNode(" + "),
        makeNumInput({ value: u.se, onChange: (v) => (u.se = v), expected: it.e, sizeClass: "sm" })
      );

      row.append(sketchBox, cardsBox, sumBox);
      taskBody.appendChild(row);
    });
  }

  // --- Task 3: Dienes Build ---
  function renderTaskDienesBuild(task, ans) {
    const grid = document.createElement("div");
    grid.className = "panel-grid-2";

    task.items.forEach((it, idx) => {
      const u = ans[idx];
      const targetNum = it.h * 100 + it.z * 10 + it.e;
      const card = document.createElement("div");
      card.className = "task-card";

      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.justifyContent = "center";
      header.style.alignItems = "center";
      header.innerHTML = `
        <span style="font-size:1.1rem; font-weight:900;">Lege die Zahl: <span style="color:var(--primary); font-size:1.35rem;">${targetNum}</span></span>
      `;
      card.appendChild(header);

      const svgBox = document.createElement("div");
      svgBox.className = "dienes-svg-box";
      if (isReviewMode) {
        const isOk = u.h === it.h && u.z === it.z && u.e === it.e;
        svgBox.style.borderColor = isOk ? "var(--good)" : "var(--bad)";
        svgBox.style.backgroundColor = isOk ? "var(--good-soft)" : "var(--bad-soft)";
      }
      svgBox.innerHTML = renderDienesSVG(u.h, u.z, u.e);
      card.appendChild(svgBox);

      const controls = document.createElement("div");
      controls.className = "builder-controls";

      [
        { key: "h", label: "Hunderter", color: "#1d4ed8" },
        { key: "z", label: "Zehner", color: "#15803d" },
        { key: "e", label: "Einer", color: "#b45309" }
      ].forEach((part) => {
        const grp = document.createElement("div");
        grp.className = "builder-group";

        const btnMinus = document.createElement("button");
        btnMinus.type = "button";
        btnMinus.className = "step-btn";
        btnMinus.textContent = "−";
        btnMinus.disabled = isReviewMode || u[part.key] <= 0;
        btnMinus.addEventListener("click", () => {
          if (u[part.key] > 0) {
            u[part.key] -= 1;
            renderTabs();
            renderCurrentTask();
          }
        });

        const countSpan = document.createElement("span");
        countSpan.style.color = part.color;
        countSpan.style.minWidth = "72px";
        countSpan.style.textAlign = "center";
        countSpan.textContent = part.label;

        const btnPlus = document.createElement("button");
        btnPlus.type = "button";
        btnPlus.className = "step-btn";
        btnPlus.textContent = "+";
        btnPlus.disabled = isReviewMode || u[part.key] >= 9;
        btnPlus.addEventListener("click", () => {
          if (u[part.key] < 9) {
            u[part.key] += 1;
            renderTabs();
            renderCurrentTask();
          }
        });

        grp.append(btnMinus, countSpan, btnPlus);
        controls.appendChild(grp);
      });

      card.appendChild(controls);
      grid.appendChild(card);
    });

    taskBody.appendChild(grid);
  }

  // --- Task 4: Bundle & Swap ---
  function renderTaskBundleSwap(task, ans) {
    const grid = document.createElement("div");
    grid.className = "panel-grid-2";

    const colLeft = document.createElement("div");
    colLeft.className = "task-card";
    task.leftItems.forEach((it, idx) => {
      const u = ans.left[idx];
      const row = document.createElement("div");
      row.className = "hze-row";
      row.style.justifyContent = "space-between";
      row.innerHTML = `<span style="min-width:110px;">${it.givenZ} Z &nbsp; ${it.givenE} E &nbsp;=</span>`;
      const rightPart = document.createElement("span");
      rightPart.className = "hze-row";
      rightPart.append(
        makeNumInput({ value: u.z, onChange: (v) => (u.z = v), expected: it.ansZ, sizeClass: "sm" }),
        document.createTextNode(" Z "),
        makeNumInput({ value: u.e, onChange: (v) => (u.e = v), expected: it.ansE, sizeClass: "sm" }),
        document.createTextNode(" E")
      );
      row.appendChild(rightPart);
      colLeft.appendChild(row);
    });

    const colRight = document.createElement("div");
    colRight.className = "task-card";
    task.rightItems.forEach((it, idx) => {
      const u = ans.right[idx];
      const row = document.createElement("div");
      row.className = "hze-row";
      row.style.justifyContent = "space-between";
      row.innerHTML = `<span style="min-width:105px;">${it.givenZ} Z &nbsp; ${it.givenE} E &nbsp;=</span>`;
      const rightPart = document.createElement("span");
      rightPart.className = "hze-row";
      rightPart.append(
        makeNumInput({ value: u.h, onChange: (v) => (u.h = v), expected: it.ansH, sizeClass: "sm" }),
        document.createTextNode(" H "),
        makeNumInput({ value: u.z, onChange: (v) => (u.z = v), expected: it.ansZ, sizeClass: "sm" }),
        document.createTextNode(" Z "),
        makeNumInput({ value: u.e, onChange: (v) => (u.e = v), expected: it.ansE, sizeClass: "sm" }),
        document.createTextNode(" E")
      );
      row.appendChild(rightPart);
      colRight.appendChild(row);
    });

    grid.append(colLeft, colRight);
    taskBody.appendChild(grid);
  }

  // --- Task 5: Zahlwörter & Hundertertafel ---
  function renderTaskWordHtafel(task, ans) {
    const layout = document.createElement("div");
    layout.className = "htafel-layout";

    const leftCol = document.createElement("div");
    leftCol.style.display = "flex";
    leftCol.style.flexDirection = "column";
    leftCol.style.gap = "0.6rem";

    task.targets.forEach((t, idx) => {
      const wRow = document.createElement("div");
      wRow.className = "word-row";
      const span = document.createElement("span");
      span.textContent = t.word;
      wRow.appendChild(span);
      wRow.appendChild(
        makeNumInput({
          value: ans.written[idx],
          onChange: (v) => (ans.written[idx] = v),
          expected: t.num,
          sizeClass: "lg"
        })
      );
      leftCol.appendChild(wRow);
    });

    const hintP = document.createElement("div");
    hintP.style.fontSize = "0.88rem";
    hintP.style.fontWeight = "700";
    hintP.style.color = "var(--ink-muted)";
    hintP.textContent = `Eingekreist in der Tafel: ${ans.circled.length} von ${task.targets.length} Zahlen`;
    leftCol.appendChild(hintP);

    // 10x10 Hundertertafel
    const rightCol = document.createElement("div");
    const grid = document.createElement("div");
    grid.className = "htafel-grid";
    const targetSet = new Set(task.targets.map((t) => t.num));

    for (let i = 1; i <= 100; i++) {
      const val = task.hBase + i;
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "htafel-cell";
      cell.textContent = String(val);

      const isCircled = ans.circled.includes(val);
      if (isCircled) cell.classList.add("circled");

      if (isReviewMode) {
        cell.disabled = true;
        if (isCircled && targetSet.has(val)) cell.classList.add("cell-correct");
        else if (!isCircled && targetSet.has(val)) cell.classList.add("cell-missed");
        else if (isCircled && !targetSet.has(val)) cell.classList.add("cell-wrong");
      } else {
        cell.addEventListener("click", () => {
          const pos = ans.circled.indexOf(val);
          if (pos >= 0) {
            ans.circled.splice(pos, 1);
          } else {
            ans.circled.push(val);
          }
          renderTabs();
          renderCurrentTask();
        });
      }

      grid.appendChild(cell);
    }

    rightCol.appendChild(grid);
    layout.append(leftCol, rightCol);
    taskBody.appendChild(layout);
  }

  // --- Task 6: Hundertertafel-Puzzleteile ---
  function renderTaskHtafelPuzzle(task, ans) {
    const wrap = document.createElement("div");
    wrap.className = "puzzle-grid-wrap";

    task.puzzles.forEach((p, pi) => {
      const card = document.createElement("div");
      card.className = "puzzle-card";

      const title = document.createElement("div");
      title.style.fontWeight = "800";
      title.style.fontSize = "0.9rem";
      title.style.color = "var(--ink-muted)";
      title.textContent = p.name;
      card.appendChild(title);

      const matrix = document.createElement("div");
      matrix.className = "puzzle-matrix";
      matrix.style.gridTemplateColumns = `repeat(${p.cols}, 58px)`;
      matrix.style.gridTemplateRows = `repeat(${p.rows}, 48px)`;

      for (let r = 0; r < p.rows; r++) {
        for (let c = 0; c < p.cols; c++) {
          const cellIndex = p.cells.findIndex((item) => item.r === r && item.c === c);
          const cellDiv = document.createElement("div");
          cellDiv.className = "puzzle-cell";

          if (cellIndex >= 0) {
            const cellData = p.cells[cellIndex];
            if (cellData.given) {
              cellDiv.classList.add("given");
              cellDiv.textContent = String(cellData.val);
            } else {
              cellDiv.classList.add("input-cell");
              cellDiv.appendChild(
                makeNumInput({
                  value: ans[pi][cellIndex],
                  onChange: (v) => (ans[pi][cellIndex] = v),
                  expected: cellData.val
                })
              );
            }
          }
          matrix.appendChild(cellDiv);
        }
      }

      card.appendChild(matrix);
      wrap.appendChild(card);
    });

    taskBody.appendChild(wrap);
  }

  // --- Task 7: Zahlenrätsel ---
  function renderTaskNumberRiddles(task, ans) {
    task.riddles.forEach((r, idx) => {
      const row = document.createElement("div");
      row.className = "riddle-row";

      const speech = document.createElement("div");
      speech.className = "speech-box";
      speech.innerHTML = `
        <div class="animal-avatar">${r.avatar}</div>
        <div class="speech-bubble">${r.text}</div>
      `;

      const answerBox = document.createElement("div");
      answerBox.className = "task-card";
      answerBox.style.alignItems = "center";
      answerBox.style.justifyContent = "center";
      answerBox.innerHTML = `<div style="font-weight:800; font-size:0.95rem;">${r.label}</div>`;
      answerBox.appendChild(
        makeNumInput({
          value: ans[idx],
          onChange: (v) => (ans[idx] = v),
          expected: r.answer,
          sizeClass: "lg"
        })
      );

      row.append(speech, answerBox);
      taskBody.appendChild(row);
    });
  }

  // --- Task 8: Zahlenstrahl Verbinden ---
  function renderTaskNumberLineConnect(task, ans) {
    const card = document.createElement("div");
    card.className = "zstrahl-card";

    // SVG Number line with clickable 10-ticks and connecting lines to the 5 number boxes
    const W = 860;
    const H = 195;
    const padX = 48;
    const lineY = 55;
    const lineW = W - padX * 2;
    const cardY = 140;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("class", "zstrahl-svg");

    const valToX = (v) => padX + ((v - task.start) / (task.end - task.start)) * lineW;
    const cardCenterX = (i) => padX + ((i + 0.5) / task.numbers.length) * lineW;

    // Main horizontal line
    const mainLine = document.createElementNS(svgNS, "line");
    mainLine.setAttribute("x1", String(padX));
    mainLine.setAttribute("y1", String(lineY));
    mainLine.setAttribute("x2", String(W - padX));
    mainLine.setAttribute("y2", String(lineY));
    mainLine.setAttribute("stroke", "#334155");
    mainLine.setAttribute("stroke-width", "2.5");
    svg.appendChild(mainLine);

    // Draw ticks every 10
    for (let v = task.start; v <= task.end; v += 10) {
      const x = valToX(v);
      const is100 = v % 100 === 0;
      const is50 = v % 100 === 50;
      const tickH = is100 ? 16 : is50 ? 11 : 6;

      const tick = document.createElementNS(svgNS, "line");
      tick.setAttribute("x1", String(x));
      tick.setAttribute("y1", String(lineY - tickH));
      tick.setAttribute("x2", String(x));
      tick.setAttribute("y2", String(lineY + tickH));
      tick.setAttribute("stroke", is100 ? "#0f172a" : "#475569");
      tick.setAttribute("stroke-width", is100 ? "2.4" : is50 ? "1.8" : "1.2");
      svg.appendChild(tick);

      if (is100) {
        const lbl = document.createElementNS(svgNS, "text");
        lbl.setAttribute("x", String(x));
        lbl.setAttribute("y", String(lineY - 22));
        lbl.setAttribute("text-anchor", "middle");
        lbl.setAttribute("font-size", "15");
        lbl.setAttribute("font-weight", "800");
        lbl.setAttribute("fill", "#1e293b");
        lbl.textContent = String(v);
        svg.appendChild(lbl);
      }

      // Click target for each 10-tick
      if (!isReviewMode) {
        const hit = document.createElementNS(svgNS, "rect");
        hit.setAttribute("x", String(x - 7));
        hit.setAttribute("y", String(lineY - 20));
        hit.setAttribute("width", "14");
        hit.setAttribute("height", "44");
        hit.setAttribute("fill", "transparent");
        hit.style.cursor = "pointer";
        hit.addEventListener("click", () => {
          ans.connections[ans.selectedCardIdx] = v;
          // Advance to next unconnected card automatically
          for (let step = 1; step <= task.numbers.length; step++) {
            const nxt = (ans.selectedCardIdx + step) % task.numbers.length;
            if (ans.connections[nxt] === undefined) {
              ans.selectedCardIdx = nxt;
              break;
            }
          }
          renderTabs();
          renderCurrentTask();
        });
        svg.appendChild(hit);
      }
    }

    // Draw existing connections (curved pen lines from card to tick)
    task.numbers.forEach((num, idx) => {
      const chosenVal = ans.connections[idx];
      const cx = cardCenterX(idx);

      if (chosenVal !== undefined) {
        const tx = valToX(chosenVal);
        const isCorrect = chosenVal === num;
        const strokeColor = isReviewMode
          ? isCorrect
            ? "#16a34a"
            : "#e11d48"
          : "#2563eb";

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute(
          "d",
          `M ${cx} ${cardY} C ${cx} ${lineY + 45}, ${tx} ${lineY + 45}, ${tx} ${lineY}`
        );
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", strokeColor);
        path.setAttribute("stroke-width", "3");
        svg.appendChild(path);

        const dot = document.createElementNS(svgNS, "circle");
        dot.setAttribute("cx", String(tx));
        dot.setAttribute("cy", String(lineY));
        dot.setAttribute("r", "5.5");
        dot.setAttribute("fill", strokeColor);
        svg.appendChild(dot);
      }

      // In review mode, if wrong or missing, show dashed green line to correct tick
      if (isReviewMode && chosenVal !== num) {
        const idealX = valToX(num);
        const pathIdeal = document.createElementNS(svgNS, "path");
        pathIdeal.setAttribute(
          "d",
          `M ${cx} ${cardY} C ${cx} ${lineY + 42}, ${idealX} ${lineY + 42}, ${idealX} ${lineY}`
        );
        pathIdeal.setAttribute("fill", "none");
        pathIdeal.setAttribute("stroke", "#16a34a");
        pathIdeal.setAttribute("stroke-width", "2.5");
        pathIdeal.setAttribute("stroke-dasharray", "5,4");
        svg.appendChild(pathIdeal);
      }
    });

    // Draw the 5 number cards inside the SVG bottom area
    task.numbers.forEach((num, idx) => {
      const cx = cardCenterX(idx);
      const boxW = 86;
      const boxH = 38;
      const isSelected = !isReviewMode && ans.selectedCardIdx === idx;
      const isConnected = ans.connections[idx] !== undefined;

      const g = document.createElementNS(svgNS, "g");
      if (!isReviewMode) {
        g.style.cursor = "pointer";
        g.addEventListener("click", () => {
          ans.selectedCardIdx = idx;
          renderCurrentTask();
        });
      }

      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", String(cx - boxW / 2));
      rect.setAttribute("y", String(cardY));
      rect.setAttribute("width", String(boxW));
      rect.setAttribute("height", String(boxH));
      rect.setAttribute("rx", "8");
      rect.setAttribute(
        "fill",
        isSelected ? "#5b4bc4" : isConnected ? "#eff6ff" : "#ffffff"
      );
      rect.setAttribute(
        "stroke",
        isSelected ? "#5b4bc4" : isConnected ? "#2563eb" : "#64748b"
      );
      rect.setAttribute("stroke-width", "2.5");
      g.appendChild(rect);

      const txt = document.createElementNS(svgNS, "text");
      txt.setAttribute("x", String(cx));
      txt.setAttribute("y", String(cardY + 25));
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("font-size", "17");
      txt.setAttribute("font-weight", "900");
      txt.setAttribute("fill", isSelected ? "#ffffff" : "#1e293b");
      txt.textContent = String(num);
      g.appendChild(txt);

      svg.appendChild(g);
    });

    card.appendChild(svg);

    const statusLine = document.createElement("div");
    statusLine.style.fontSize = "0.9rem";
    statusLine.style.fontWeight = "700";
    statusLine.style.color = "var(--ink-muted)";
    statusLine.style.textAlign = "center";
    if (!isReviewMode) {
      const currentNum = task.numbers[ans.selectedCardIdx];
      statusLine.innerHTML = `Ausgewähltes Kärtchen: <strong style="color:var(--primary);">${currentNum}</strong> – tippe oben auf den passenden Strich am Zahlenstrahl!`;
    }
    card.appendChild(statusLine);
    taskBody.appendChild(card);
  }

  // --- Task 9 & 10: Nachbarzehner (NZ) & Nachbarhunderter (NH) ---
  function renderTaskNeighbors(task, ans) {
    const isTens = task.type === "neighbor_tens";
    const colLabel = isTens ? "NZ" : "NH";

    const tbl = document.createElement("table");
    tbl.className = "nz-table";
    tbl.innerHTML = `
      <thead>
        <tr>
          <th>Kleinerer ${colLabel}</th>
          <th>Zahl (Z)</th>
          <th>Größerer ${colLabel}</th>
        </tr>
      </thead>
    `;
    const tbody = document.createElement("tbody");

    task.items.forEach((it, idx) => {
      const u = ans[idx];
      const tr = document.createElement("tr");

      // Low neighbor cell
      const tdLow = document.createElement("td");
      const wrapLow = document.createElement("div");
      wrapLow.className = `nz-cell-wrap ${u.closer === "low" ? "marked" : ""}`;
      wrapLow.appendChild(
        makeNumInput({
          value: u.low,
          onChange: (v) => (u.low = v),
          expected: it.low
        })
      );
      const btnLow = document.createElement("button");
      btnLow.type = "button";
      btnLow.className = `marker-btn ${u.closer === "low" ? "active" : ""}`;
      btnLow.textContent = "🖍️ näher";
      btnLow.disabled = isReviewMode;
      btnLow.addEventListener("click", () => {
        u.closer = u.closer === "low" ? "" : "low";
        renderTabs();
        renderCurrentTask();
      });
      wrapLow.appendChild(btnLow);
      tdLow.appendChild(wrapLow);

      // Middle Z cell
      const tdMid = document.createElement("td");
      tdMid.style.fontWeight = "900";
      tdMid.style.fontSize = "1.18rem";
      tdMid.style.background = "#f8fafc";
      tdMid.textContent = String(it.z);

      // High neighbor cell
      const tdHigh = document.createElement("td");
      const wrapHigh = document.createElement("div");
      wrapHigh.className = `nz-cell-wrap ${u.closer === "high" ? "marked" : ""}`;
      wrapHigh.appendChild(
        makeNumInput({
          value: u.high,
          onChange: (v) => (u.high = v),
          expected: it.high
        })
      );
      const btnHigh = document.createElement("button");
      btnHigh.type = "button";
      btnHigh.className = `marker-btn ${u.closer === "high" ? "active" : ""}`;
      btnHigh.textContent = "🖍️ näher";
      btnHigh.disabled = isReviewMode;
      btnHigh.addEventListener("click", () => {
        u.closer = u.closer === "high" ? "" : "high";
        renderTabs();
        renderCurrentTask();
      });
      wrapHigh.appendChild(btnHigh);
      tdHigh.appendChild(wrapHigh);

      tr.append(tdLow, tdMid, tdHigh);
      tbody.appendChild(tr);
    });

    tbl.appendChild(tbody);
    taskBody.appendChild(tbl);
  }

  // --- Task 11: Zahlen vergleichen (<, >, =) ---
  function renderTaskCompareNumbers(task, ans) {
    const grid = document.createElement("div");
    grid.className = "compare-grid";

    task.pairs.forEach((p, idx) => {
      const row = document.createElement("div");
      row.className = "compare-row";

      const spanA = document.createElement("span");
      spanA.style.minWidth = "48px";
      spanA.style.textAlign = "right";
      spanA.textContent = String(p.a);

      const grp = document.createElement("div");
      grp.className = "cmp-btn-group";
      if (isReviewMode) {
        const isOk = ans[idx] === p.ans;
        grp.style.borderColor = isOk ? "var(--good)" : "var(--bad)";
        grp.style.backgroundColor = isOk ? "var(--good-soft)" : "var(--bad-soft)";
      }

      ["<", "=", ">"].forEach((sym) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = `cmp-btn ${ans[idx] === sym ? "selected" : ""}`;
        b.textContent = sym;
        b.disabled = isReviewMode;
        b.addEventListener("click", () => {
          ans[idx] = sym;
          renderTabs();
          renderCurrentTask();
        });
        grp.appendChild(b);
      });

      const spanB = document.createElement("span");
      spanB.style.minWidth = "48px";
      spanB.style.textAlign = "left";
      spanB.textContent = String(p.b);

      row.append(spanA, grp, spanB);

      if (isReviewMode && ans[idx] !== p.ans) {
        const hint = document.createElement("span");
        hint.className = "solution-hint";
        hint.textContent = p.ans;
        row.appendChild(hint);
      }

      grid.appendChild(row);
    });

    taskBody.appendChild(grid);
  }

  // --- Task 12: Rechenstrich Approx ---
  function renderTaskRechenstrichApprox(task, ans) {
    task.lines.forEach((ln, li) => {
      const box = document.createElement("div");
      box.className = "rechenstrich-box";

      const chipBar = document.createElement("div");
      chipBar.className = "chip-bar";
      const lbl = document.createElement("span");
      lbl.style.fontWeight = "800";
      lbl.style.fontSize = "0.95rem";
      lbl.textContent = ln.label;
      chipBar.appendChild(lbl);

      ln.numbers.forEach((num, ni) => {
        const chip = document.createElement("button");
        chip.type = "button";
        const isPlaced = ans.placed[li][num] !== undefined;
        const isActive = !isReviewMode && ans.activeChip[li] === ni;
        chip.className = `num-chip ${isPlaced ? "placed" : ""} ${isActive ? "active" : ""}`;
        chip.textContent = isPlaced ? `✓ ${num}` : String(num);
        chip.disabled = isReviewMode;
        chip.addEventListener("click", () => {
          ans.activeChip[li] = ni;
          renderCurrentTask();
        });
        chipBar.appendChild(chip);
      });

      box.appendChild(chipBar);

      // Interactive SVG Rechenstrich
      const W = 820;
      const H = 98;
      const padX = 52;
      const lineY = 50;
      const lineW = W - padX * 2;
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.setAttribute("class", "rstrich-svg");

      const valToX = (v) => padX + ((v - ln.start) / (ln.end - ln.start)) * lineW;

      // Base line + endpoints
      svg.innerHTML = `
        <line x1="${padX}" y1="${lineY}" x2="${W - padX}" y2="${lineY}" stroke="#334155" stroke-width="3"/>
        <line x1="${padX}" y1="${lineY - 14}" x2="${padX}" y2="${lineY + 14}" stroke="#0f172a" stroke-width="3"/>
        <text x="${padX}" y="${lineY + 32}" text-anchor="middle" font-size="15" font-weight="800" fill="#0f172a">${ln.start}</text>
        <line x1="${W - padX}" y1="${lineY - 14}" x2="${W - padX}" y2="${lineY + 14}" stroke="#0f172a" stroke-width="3"/>
        <text x="${W - padX}" y="${lineY + 32}" text-anchor="middle" font-size="15" font-weight="800" fill="#0f172a">${ln.end}</text>
      `;

      // Placed marks
      const tol = (ln.end - ln.start) * 0.085;
      ln.numbers.forEach((num, ni) => {
        const placedVal = ans.placed[li][num];
        if (placedVal !== undefined) {
          const px = valToX(placedVal);
          const isOk = Math.abs(placedVal - num) <= tol;
          const color = isReviewMode ? (isOk ? "#16a34a" : "#e11d48") : "#2563eb";
          const yText = ni % 2 === 0 ? lineY - 20 : lineY + 30;

          const g = document.createElementNS(svgNS, "g");
          g.innerHTML = `
            <line x1="${px}" y1="${lineY - 13}" x2="${px}" y2="${lineY + 13}" stroke="${color}" stroke-width="3.2"/>
            <text x="${px}" y="${yText}" text-anchor="middle" font-size="15" font-weight="900" fill="${color}">${num}</text>
          `;
          svg.appendChild(g);
        }

        if (isReviewMode && (placedVal === undefined || Math.abs(placedVal - num) > tol)) {
          const idealX = valToX(num);
          const gIdeal = document.createElementNS(svgNS, "g");
          gIdeal.innerHTML = `
            <line x1="${idealX}" y1="${lineY - 11}" x2="${idealX}" y2="${lineY + 11}" stroke="#16a34a" stroke-width="2.5" stroke-dasharray="3,2"/>
            <text x="${idealX}" y="${lineY - 22}" text-anchor="middle" font-size="13" font-weight="800" fill="#15803d">(${num})</text>
          `;
          svg.appendChild(gIdeal);
        }
      });

      if (!isReviewMode) {
        svg.addEventListener("pointerdown", (ev) => {
          const rect = svg.getBoundingClientRect();
          const relX = ((ev.clientX - rect.left) / rect.width) * W;
          const clampedX = Math.max(padX + 6, Math.min(W - padX - 6, relX));
          const ratio = (clampedX - padX) / lineW;
          const val = Math.round(ln.start + ratio * (ln.end - ln.start));
          const currentNum = ln.numbers[ans.activeChip[li]];
          ans.placed[li][currentNum] = val;

          // Advance to next unplaced chip
          for (let s = 1; s <= ln.numbers.length; s++) {
            const nxt = (ans.activeChip[li] + s) % ln.numbers.length;
            if (ans.placed[li][ln.numbers[nxt]] === undefined) {
              ans.activeChip[li] = nxt;
              break;
            }
          }
          renderTabs();
          renderCurrentTask();
        });
      }

      box.appendChild(svg);
      taskBody.appendChild(box);
    });
  }

  // --- Task 13: Eigenen Rechenstrich-Bereich wählen (Blatt 4, Nr. 7) ---
  function renderTaskRechenstrichCustom(task, ans) {
    const box = document.createElement("div");
    box.className = "rechenstrich-box";

    const endpointsRow = document.createElement("div");
    endpointsRow.className = "hze-row";
    endpointsRow.style.justifyContent = "space-between";
    endpointsRow.append(
      document.createTextNode("Linker Start-Hunderter: "),
      makeNumInput({
        value: ans.startVal,
        onChange: (v) => (ans.startVal = v),
        expected: task.expectedStart
      }),
      document.createTextNode("Rechter End-Hunderter: "),
      makeNumInput({
        value: ans.endVal,
        onChange: (v) => (ans.endVal = v),
        expected: task.expectedEnd
      })
    );
    box.appendChild(endpointsRow);

    const chipBar = document.createElement("div");
    chipBar.className = "chip-bar";
    const lbl = document.createElement("span");
    lbl.style.fontWeight = "800";
    lbl.textContent = "Zahlen zum Eintragen:";
    chipBar.appendChild(lbl);

    task.numbers.forEach((num, ni) => {
      const chip = document.createElement("button");
      chip.type = "button";
      const isPlaced = ans.placed[ni] !== undefined;
      const isActive = !isReviewMode && ans.activeChip === ni;
      chip.className = `num-chip ${isPlaced ? "placed" : ""} ${isActive ? "active" : ""}`;
      chip.textContent = isPlaced ? `✓ ${num}` : String(num);
      chip.disabled = isReviewMode;
      chip.addEventListener("click", () => {
        ans.activeChip = ni;
        renderCurrentTask();
      });
      chipBar.appendChild(chip);
    });
    box.appendChild(chipBar);

    const W = 820;
    const H = 105;
    const padX = 52;
    const lineY = 52;
    const lineW = W - padX * 2;
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("class", "rstrich-svg");

    const leftLbl = ans.startVal || "?";
    const rightLbl = ans.endVal || "?";
    svg.innerHTML = `
      <line x1="${padX}" y1="${lineY}" x2="${W - padX}" y2="${lineY}" stroke="#334155" stroke-width="3"/>
      <line x1="${padX}" y1="${lineY - 14}" x2="${padX}" y2="${lineY + 14}" stroke="#0f172a" stroke-width="3"/>
      <text x="${padX}" y="${lineY + 32}" text-anchor="middle" font-size="16" font-weight="900" fill="#5b4bc4">${leftLbl}</text>
      <line x1="${W - padX}" y1="${lineY - 14}" x2="${W - padX}" y2="${lineY + 14}" stroke="#0f172a" stroke-width="3"/>
      <text x="${W - padX}" y="${lineY + 32}" text-anchor="middle" font-size="16" font-weight="900" fill="#5b4bc4">${rightLbl}</text>
    `;

    task.numbers.forEach((num, ni) => {
      const ratio = ans.placed[ni];
      const idealRatio = (num - task.expectedStart) / 100;
      if (ratio !== undefined) {
        const px = padX + ratio * lineW;
        const isOk = Math.abs(ratio - idealRatio) <= 0.085;
        const color = isReviewMode ? (isOk ? "#16a34a" : "#e11d48") : "#2563eb";
        const yText = ni % 2 === 0 ? lineY - 20 : lineY + 30;
        const g = document.createElementNS(svgNS, "g");
        g.innerHTML = `
          <line x1="${px}" y1="${lineY - 13}" x2="${px}" y2="${lineY + 13}" stroke="${color}" stroke-width="3.2"/>
          <text x="${px}" y="${yText}" text-anchor="middle" font-size="15" font-weight="900" fill="${color}">${num}</text>
        `;
        svg.appendChild(g);
      }
      if (isReviewMode && (ratio === undefined || Math.abs(ratio - idealRatio) > 0.085)) {
        const ix = padX + idealRatio * lineW;
        const gIdeal = document.createElementNS(svgNS, "g");
        gIdeal.innerHTML = `
          <line x1="${ix}" y1="${lineY - 11}" x2="${ix}" y2="${lineY + 11}" stroke="#16a34a" stroke-width="2.5" stroke-dasharray="3,2"/>
          <text x="${ix}" y="${lineY - 22}" text-anchor="middle" font-size="13" font-weight="800" fill="#15803d">(${num})</text>
        `;
        svg.appendChild(gIdeal);
      }
    });

    if (!isReviewMode) {
      svg.addEventListener("pointerdown", (ev) => {
        const rect = svg.getBoundingClientRect();
        const relX = ((ev.clientX - rect.left) / rect.width) * W;
        const clampedX = Math.max(padX + 6, Math.min(W - padX - 6, relX));
        ans.placed[ans.activeChip] = (clampedX - padX) / lineW;

        for (let s = 1; s <= task.numbers.length; s++) {
          const nxt = (ans.activeChip + s) % task.numbers.length;
          if (ans.placed[nxt] === undefined) {
            ans.activeChip = nxt;
            break;
          }
        }
        renderTabs();
        renderCurrentTask();
      });
    }

    box.appendChild(svg);
    taskBody.appendChild(box);
  }

  // --- Task 14: Zahlzerlegungen ---
  function renderTaskDecompositions(task, ans) {
    const grid = document.createElement("div");
    grid.className = "panel-grid-2";

    const eqCard = document.createElement("div");
    eqCard.className = "task-card";
    for (let i = 0; i < 4; i++) {
      const it = task.items[i];
      const row = document.createElement("div");
      row.className = "hze-row";
      row.style.justifyContent = "flex-start";
      const s1 = document.createElement("span");
      s1.textContent = it.label + " ";
      row.appendChild(s1);
      row.appendChild(
        makeNumInput({
          value: ans[i],
          onChange: (v) => (ans[i] = v),
          expected: it.ans
        })
      );
      if (it.after) {
        const s2 = document.createElement("span");
        s2.textContent = " " + it.after;
        row.appendChild(s2);
      }
      eqCard.appendChild(row);
    }

    const houseCard = document.createElement("div");
    houseCard.className = "task-card";
    houseCard.style.justifyContent = "space-around";

    [4, 5].forEach((idx) => {
      const it = task.items[idx];
      const house = document.createElement("div");
      house.className = "zahlhaus";
      house.innerHTML = `<div class="zahlhaus-roof">🏠 ${it.roof}</div>`;
      const floor = document.createElement("div");
      floor.className = "zahlhaus-floor";
      const s = document.createElement("span");
      s.textContent = it.givenText + " ";
      floor.appendChild(s);
      floor.appendChild(
        makeNumInput({
          value: ans[idx],
          onChange: (v) => (ans[idx] = v),
          expected: it.ans
        })
      );
      house.appendChild(floor);
      houseCard.appendChild(house);
    });

    grid.append(eqCard, houseCard);
    taskBody.appendChild(grid);
  }

  // --- Task 15: Zahlenfolgen ---
  function renderTaskNumberSequences(task, ans) {
    task.sequences.forEach((seq, idx) => {
      const u = ans[idx];
      const card = document.createElement("div");
      card.className = "seq-card";

      const itemsRow = document.createElement("div");
      itemsRow.className = "seq-items";

      seq.given.forEach((n) => {
        const box = document.createElement("span");
        box.className = "seq-num";
        box.textContent = String(n);
        const arr = document.createElement("span");
        arr.className = "seq-arrow";
        arr.textContent = "→";
        itemsRow.append(box, arr);
      });

      itemsRow.appendChild(
        makeNumInput({
          value: u.n1,
          onChange: (v) => (u.n1 = v),
          expected: seq.ans1
        })
      );
      const arrLast = document.createElement("span");
      arrLast.className = "seq-arrow";
      arrLast.textContent = "→";
      itemsRow.appendChild(arrLast);
      itemsRow.appendChild(
        makeNumInput({
          value: u.n2,
          onChange: (v) => (u.n2 = v),
          expected: seq.ans2
        })
      );

      card.appendChild(itemsRow);

      const ruleRow = document.createElement("div");
      ruleRow.className = "rule-pills";
      const rLbl = document.createElement("span");
      rLbl.style.fontSize = "0.88rem";
      rLbl.style.fontWeight = "800";
      rLbl.style.color = "var(--ink-muted)";
      rLbl.textContent = "Regel:";
      ruleRow.appendChild(rLbl);

      seq.ruleOptions.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `rule-btn ${u.rule === opt ? "selected" : ""}`;
        btn.textContent = opt;
        btn.disabled = isReviewMode;
        if (isReviewMode) {
          if (opt === seq.correctRule) {
            btn.style.borderColor = "var(--good)";
            btn.style.backgroundColor = "var(--good-soft)";
            btn.style.color = "#14532d";
          } else if (u.rule === opt && opt !== seq.correctRule) {
            btn.style.borderColor = "var(--bad)";
            btn.style.backgroundColor = "var(--bad-soft)";
          }
        } else {
          btn.addEventListener("click", () => {
            u.rule = opt;
            renderTabs();
            renderCurrentTask();
          });
        }
        ruleRow.appendChild(btn);
      });

      card.appendChild(ruleRow);
      taskBody.appendChild(card);
    });
  }

  // --- Task 16: Kleines 1x1 & Teilen ---
  function renderTaskMultDivBasic(task, ans) {
    const grid = document.createElement("div");
    grid.className = "compare-grid";

    task.items.forEach((it, idx) => {
      const row = document.createElement("div");
      row.className = "compare-row";
      row.style.justifyContent = "space-between";
      const lbl = document.createElement("span");
      lbl.textContent = `${it.a} ${it.op} ${it.b} =`;
      row.appendChild(lbl);
      row.appendChild(
        makeNumInput({
          value: ans[idx],
          onChange: (v) => (ans[idx] = v),
          expected: it.ans
        })
      );
      grid.appendChild(row);
    });

    taskBody.appendChild(grid);
  }

  // --- Task 17: Lücken- und Umkehraufgaben 1x1 ---
  function renderTaskMultDivMissing(task, ans) {
    const grid = document.createElement("div");
    grid.className = "compare-grid";

    task.items.forEach((it, idx) => {
      const row = document.createElement("div");
      row.className = "compare-row";
      row.style.justifyContent = "center";

      if (it.mode === "missingA") {
        row.appendChild(
          makeNumInput({
            value: ans[idx],
            onChange: (v) => (ans[idx] = v),
            expected: it.ans
          })
        );
        const s = document.createElement("span");
        s.textContent = `${it.op} ${it.b} = ${it.c}`;
        row.appendChild(s);
      } else {
        const s1 = document.createElement("span");
        s1.textContent = `${it.a} ${it.op}`;
        row.appendChild(s1);
        row.appendChild(
          makeNumInput({
            value: ans[idx],
            onChange: (v) => (ans[idx] = v),
            expected: it.ans
          })
        );
        const s2 = document.createElement("span");
        s2.textContent = `= ${it.c}`;
        row.appendChild(s2);
      }

      grid.appendChild(row);
    });

    taskBody.appendChild(grid);
  }

  // --- Task 18: Aufgabenfamilie ---
  function renderTaskFactFamily(task, ans) {
    const tri = document.createElement("div");
    tri.className = "family-triangle";
    tri.innerHTML = `
      <div style="font-size:0.9rem; font-weight:800; color:var(--primary);">Die 3 Familien-Zahlen:</div>
      <div class="family-balls">
        <div class="family-ball">${task.a}</div>
        <div class="family-ball" style="width:60px;height:60px;font-size:1.3rem;">${task.p}</div>
        <div class="family-ball">${task.b}</div>
      </div>
    `;
    taskBody.appendChild(tri);

    const grid = document.createElement("div");
    grid.className = "panel-grid-2";

    // 2 Malaufgaben
    const multCard = document.createElement("div");
    multCard.className = "task-card";
    multCard.innerHTML = `<div style="font-weight:800; color:var(--primary);">2 Malaufgaben (·)</div>`;
    ans.mult.forEach((m, idx) => {
      const row = document.createElement("div");
      row.className = "hze-row";
      const expA = idx === 0 ? task.a : task.b;
      const expB = idx === 0 ? task.b : task.a;
      row.append(
        makeNumInput({
          value: m.a,
          onChange: (v) => (m.a = v),
          expected: (val) => val === task.a || val === task.b,
          sizeClass: "sm"
        }),
        document.createTextNode(" · "),
        makeNumInput({
          value: m.b,
          onChange: (v) => (m.b = v),
          expected: (val) =>
            (val === task.a || val === task.b) && val !== parseCleanInt(m.a),
          sizeClass: "sm"
        }),
        document.createTextNode(" = "),
        makeNumInput({
          value: m.c,
          onChange: (v) => (m.c = v),
          expected: task.p
        })
      );
      if (isReviewMode) {
        const hint = document.createElement("span");
        hint.className = "solution-hint";
        hint.textContent = `${expA}·${expB}=${task.p}`;
        row.appendChild(hint);
      }
      multCard.appendChild(row);
    });

    // 2 Geteiltaufgaben
    const divCard = document.createElement("div");
    divCard.className = "task-card";
    divCard.innerHTML = `<div style="font-weight:800; color:var(--primary);">2 Geteiltaufgaben (:)</div>`;
    ans.div.forEach((d, idx) => {
      const row = document.createElement("div");
      row.className = "hze-row";
      const expB = idx === 0 ? task.a : task.b;
      const expC = idx === 0 ? task.b : task.a;
      row.append(
        makeNumInput({
          value: d.a,
          onChange: (v) => (d.a = v),
          expected: task.p
        }),
        document.createTextNode(" : "),
        makeNumInput({
          value: d.b,
          onChange: (v) => (d.b = v),
          expected: (val) => val === task.a || val === task.b,
          sizeClass: "sm"
        }),
        document.createTextNode(" = "),
        makeNumInput({
          value: d.c,
          onChange: (v) => (d.c = v),
          expected: (val) =>
            (val === task.a || val === task.b) && val !== parseCleanInt(d.b),
          sizeClass: "sm"
        })
      );
      if (isReviewMode) {
        const hint = document.createElement("span");
        hint.className = "solution-hint";
        hint.textContent = `${task.p}:${expB}=${expC}`;
        row.appendChild(hint);
      }
      divCard.appendChild(row);
    });

    grid.append(multCard, divCard);
    taskBody.appendChild(grid);
  }

  // --- Task 19 & 20: Sachaufgaben ---
  function renderTaskWordProblem(task, ans) {
    const d = task.data;

    const story = document.createElement("div");
    story.className = "story-box";
    story.innerHTML = `📖 ${d.story}`;
    taskBody.appendChild(story);

    const calcCard = document.createElement("div");
    calcCard.className = "task-card";
    calcCard.innerHTML = `<div style="font-weight:800; font-size:0.95rem;">1. Rechnung und Ergebnis:</div>`;

    const calcRow = document.createElement("div");
    calcRow.className = "hze-row";

    calcRow.appendChild(
      makeNumInput({
        value: ans.a,
        onChange: (v) => (ans.a = v),
        expected: (val) => (d.commutative ? val === d.a || val === d.b : val === d.a),
        placeholder: "Zahl"
      })
    );

    const opGroup = document.createElement("span");
    opGroup.style.display = "inline-flex";
    opGroup.style.gap = "0.25rem";
    task.allowedOps.forEach((opSym) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `op-select-btn ${ans.op === opSym ? "selected" : ""}`;
      b.textContent = opSym;
      b.disabled = isReviewMode;
      b.addEventListener("click", () => {
        ans.op = opSym;
        renderTabs();
        renderCurrentTask();
      });
      opGroup.appendChild(b);
    });
    calcRow.appendChild(opGroup);

    calcRow.appendChild(
      makeNumInput({
        value: ans.b,
        onChange: (v) => (ans.b = v),
        expected: (val) => (d.commutative ? val === d.a || val === d.b : val === d.b),
        placeholder: "Zahl"
      })
    );

    calcRow.appendChild(document.createTextNode(" = "));

    calcRow.appendChild(
      makeNumInput({
        value: ans.res,
        onChange: (v) => (ans.res = v),
        expected: d.ans,
        sizeClass: "lg",
        placeholder: "Ergebnis"
      })
    );

    calcCard.appendChild(calcRow);
    taskBody.appendChild(calcCard);

    const ansCard = document.createElement("div");
    ansCard.className = "task-card";
    ansCard.innerHTML = `<div style="font-weight:800; font-size:0.95rem;">2. Wähle den passenden Antwortsatz:</div>`;

    const optList = document.createElement("div");
    optList.className = "answer-options";
    d.options.forEach((sentence) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `answer-opt-btn ${ans.sentence === sentence ? "selected" : ""}`;
      btn.textContent = sentence;
      btn.disabled = isReviewMode;
      if (isReviewMode) {
        if (sentence === d.correctSentence) {
          btn.style.borderColor = "var(--good)";
          btn.style.backgroundColor = "var(--good-soft)";
          btn.style.color = "#14532d";
        } else if (ans.sentence === sentence && sentence !== d.correctSentence) {
          btn.style.borderColor = "var(--bad)";
          btn.style.backgroundColor = "var(--bad-soft)";
        }
      } else {
        btn.addEventListener("click", () => {
          ans.sentence = sentence;
          renderTabs();
          renderCurrentTask();
        });
      }
      optList.appendChild(btn);
    });

    ansCard.appendChild(optList);
    taskBody.appendChild(ansCard);
  }

  // --- Submit & Show Results Screen ---
  function openSubmitModal() {
    let answeredCount = 0;
    const openNums = [];
    examTasks.forEach((t, idx) => {
      const st = getTaskStatus(t, userAnswers[idx]);
      if (st === "answered") answeredCount += 1;
      else openNums.push(idx + 1);
    });

    if (openNums.length === 0) {
      modalMsg.innerHTML = `Du hast <strong>alle 20 Aufgaben</strong> vollständig bearbeitet! Möchtest du deine Klausur jetzt auswerten lassen?`;
    } else {
      modalMsg.innerHTML = `Du hast bisher <strong>${answeredCount} von 20 Aufgaben</strong> vollständig bearbeitet.<br><span style="font-size:0.88rem;">Noch nicht komplett ausgefüllt: Aufgabe ${openNums.join(", ")}</span>`;
    }
    confirmModal.hidden = false;
  }

  function finishExam() {
    confirmModal.hidden = true;
    stopTimer();
    isReviewMode = true;

    let totalPoints = 0;
    let maxTotal = 0;
    const evaluations = examTasks.map((t, idx) => {
      const ev = evaluateTask(t, userAnswers[idx]);
      totalPoints += ev.points;
      maxTotal += ev.maxPoints;
      return ev;
    });

    const pct = Math.round((totalPoints / maxTotal) * 100);
    const gradeInfo = calculateGrade(pct);

    document.getElementById("gradeNum").textContent = String(gradeInfo.grade);
    document.getElementById("gradeWord").textContent = gradeInfo.word;
    document.getElementById("scoreNum").textContent = `${totalPoints} / ${maxTotal}`;
    document.getElementById("scorePct").textContent = `${pct} % · ${gradeInfo.stars}`;
    document.getElementById("resultTime").textContent = `${formatTime(timerSeconds)} Min.`;
    document.getElementById("feedbackText").textContent = gradeInfo.praise;

    // Render Grade Scale Bar
    const scaleBar = document.getElementById("gradeScaleBar");
    const scaleSteps = [
      { g: 1, text: "Note 1: ab 95 %" },
      { g: 2, text: "Note 2: ab 81 %" },
      { g: 3, text: "Note 3: ab 66 %" },
      { g: 4, text: "Note 4: ab 51 %" },
      { g: 5, text: "Note 5: ab 26 %" },
      { g: 6, text: "Note 6: unter 26 %" }
    ];
    scaleBar.innerHTML = scaleSteps
      .map(
        (s) =>
          `<span class="grade-scale-item ${s.g === gradeInfo.grade ? "current-grade" : ""}">${s.text}</span>`
      )
      .join("");

    // Render 20-task breakdown
    const breakdown = document.getElementById("resultBreakdown");
    breakdown.innerHTML = "";
    examTasks.forEach((t, idx) => {
      const ev = evaluations[idx];
      const icon = ev.points === ev.maxPoints ? "✅" : ev.points > 0 ? "🟡" : "❌";
      const row = document.createElement("div");
      row.className = "breakdown-row";
      row.innerHTML = `
        <span>${icon} <strong>Aufg. ${t.id}:</strong> ${t.title}</span>
        <span style="white-space:nowrap;">${ev.points} / ${ev.maxPoints} P.</span>
      `;
      row.addEventListener("click", () => {
        showReviewAtTask(idx);
      });
      breakdown.appendChild(row);
    });

    examScreen.hidden = true;
    taskNav.hidden = true;
    appFooter.hidden = true;
    btnHeaderSubmit.hidden = true;
    btnBackToResults.hidden = true;
    resultsScreen.hidden = false;
  }

  function showReviewAtTask(idx) {
    currentTaskIdx = idx;
    resultsScreen.hidden = true;
    examScreen.hidden = false;
    taskNav.hidden = false;
    appFooter.hidden = false;
    btnHeaderSubmit.hidden = true;
    btnBackToResults.hidden = false;
    renderTabs();
    renderCurrentTask();
  }

  // --- Print / PDF Generator ---
  function renderPrintNumberLineSVG(task) {
    const W = 780;
    const H = 135;
    const padX = 44;
    const lineY = 38;
    const lineW = W - padX * 2;
    const cardY = 92;
    const valToX = (v) => padX + ((v - task.start) / (task.end - task.start)) * lineW;
    const cardCenterX = (i) => padX + ((i + 0.5) / task.numbers.length) * lineW;

    let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="125" style="display:block;">`;
    svg += `<line x1="${padX}" y1="${lineY}" x2="${W - padX}" y2="${lineY}" stroke="#0f172a" stroke-width="2.2"/>`;

    for (let v = task.start; v <= task.end; v += 10) {
      const x = valToX(v);
      const is100 = v % 100 === 0;
      const is50 = v % 100 === 50;
      const tickH = is100 ? 13 : is50 ? 9 : 5;
      svg += `<line x1="${x}" y1="${lineY - tickH}" x2="${x}" y2="${lineY + tickH}" stroke="#0f172a" stroke-width="${is100 ? 2.2 : is50 ? 1.5 : 1}"/>`;
      if (is100) {
        svg += `<text x="${x}" y="${lineY - 17}" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a">${v}</text>`;
      }
    }

    task.numbers.forEach((num, idx) => {
      const cx = cardCenterX(idx);
      const boxW = 76;
      const boxH = 32;
      svg += `<rect x="${cx - boxW / 2}" y="${cardY}" width="${boxW}" height="${boxH}" rx="6" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>`;
      svg += `<text x="${cx}" y="${cardY + 21}" text-anchor="middle" font-size="15" font-weight="900" fill="#0f172a">${num}</text>`;
    });

    svg += `</svg>`;
    return svg;
  }

  function renderPrintRechenstrichSVG(startLabel, endLabel, isBoxes = false) {
    const W = 760;
    const H = 68;
    const padX = 58;
    const lineY = 26;
    let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="62" style="display:block;">`;
    svg += `<line x1="${padX}" y1="${lineY}" x2="${W - padX}" y2="${lineY}" stroke="#0f172a" stroke-width="2.4"/>`;
    svg += `<line x1="${padX}" y1="${lineY - 11}" x2="${padX}" y2="${lineY + 11}" stroke="#0f172a" stroke-width="2.4"/>`;
    svg += `<line x1="${W - padX}" y1="${lineY - 11}" x2="${W - padX}" y2="${lineY + 11}" stroke="#0f172a" stroke-width="2.4"/>`;

    if (isBoxes) {
      svg += `<rect x="${padX - 30}" y="${lineY + 14}" width="60" height="24" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.8"/>`;
      svg += `<rect x="${W - padX - 30}" y="${lineY + 14}" width="60" height="24" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.8"/>`;
    } else {
      svg += `<text x="${padX}" y="${lineY + 29}" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a">${startLabel}</text>`;
      svg += `<text x="${W - padX}" y="${lineY + 29}" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a">${endLabel}</text>`;
    }

    svg += `</svg>`;
    return svg;
  }

  function buildPrintTaskBodyHTML(task) {
    const wBox = (cls = "") => `<span class="print-write-box ${cls}"></span>`;

    switch (task.type) {
      case "dienes_read": {
        return {
          prompt: "Zähle die Hunderterplatten (H), Zehnerstangen (Z) und Einerwürfel (E). Trage sie in die Stellenwerttafel und als Zahl ein.",
          body: `<div class="print-grid-2">${task.items
            .map(
              (it) => `
              <div class="print-card" style="text-align:center;">
                <div style="display:flex;justify-content:center;margin-bottom:4px;">${renderDienesSVG(it.h, it.z, it.e)}</div>
                <div style="display:flex;align-items:center;justify-content:space-around;gap:8px;">
                  <table class="stellenwerttafel" style="margin:0;">
                    <thead><tr><th>H</th><th>Z</th><th>E</th></tr></thead>
                    <tbody><tr><td>${wBox("sm")}</td><td>${wBox("sm")}</td><td>${wBox("sm")}</td></tr></tbody>
                  </table>
                  <div style="font-weight:800;font-size:9.5pt;">Zahl: ${wBox("lg")}</div>
                </div>
              </div>`
            )
            .join("")}</div>`,
          solution: task.items
            .map(
              (it, i) =>
                `<strong>Bild ${i + 1}:</strong> ${it.h} H | ${it.z} Z | ${it.e} E &rarr; Zahl: <strong>${it.h * 100 + it.z * 10 + it.e}</strong> (je 2 P.)`
            )
            .join("<br>")
        };
      }

      case "represent_split": {
        return {
          prompt: "Lies das Geheimzeichen-Bild ab (Quadrat = Hunderter, Strich = Zehner, Punkt = Einer). Fülle die Stellenwertkarten und die Zerlegung aus.",
          body: `<div style="display:flex;flex-direction:column;gap:5px;">${task.items
            .map(
              (it) => `
              <div class="print-card" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 8px;">
                <div style="flex:1;max-width:190px;">${renderSketchDienesSVG(it.h, it.z, it.e)}</div>
                <div style="border:1.5px solid #475569;border-radius:5px;padding:2px 5px;background:#fff;">
                  ${wBox("sm")}${wBox("sm")}${wBox("sm")}
                </div>
                <div style="font-weight:800;font-size:10pt;">
                  = ${wBox()} + ${wBox()} + ${wBox("sm")}
                </div>
              </div>`
            )
            .join("")}</div>`,
          solution: task.items
            .map(
              (it) =>
                `<strong>${it.h} | ${it.z} | ${it.e}</strong> &rarr; <strong>${it.h * 100} + ${it.z * 10} + ${it.e}</strong> (1 P.)`
            )
            .join("<br>")
        };
      }

      case "dienes_build": {
        return {
          prompt: "Zeichne die Zahl als Geheimzeichen: Quadrat (□) = 1 Hunderter, Strich (—) = 1 Zehner, Punkt (•) = 1 Einer.",
          body: `<div class="print-grid-2">${task.items
            .map((it) => {
              const num = it.h * 100 + it.z * 10 + it.e;
              return `
                <div class="print-card">
                  <div style="font-weight:900;font-size:10.5pt;text-align:center;">Zahl: <span style="font-size:12pt;">${num}</span></div>
                  <div class="print-draw-area">
                    <span class="print-draw-hint">□ Hunderter &nbsp; — Zehner &nbsp; • Einer</span>
                  </div>
                </div>`;
            })
            .join("")}</div>`,
          solution: task.items
            .map(
              (it) =>
                `<strong>${it.h * 100 + it.z * 10 + it.e}:</strong> ${it.h} Quadrate (H), ${it.z} Striche (Z), ${it.e} Punkte (E) (2 P.)`
            )
            .join("<br>")
        };
      }

      case "bundle_swap": {
        return {
          prompt: "Immer 10 Einer werden zu 1 Zehner, und 10 Zehner werden zu 1 Hunderter! Tausche um:",
          body: `<div class="print-grid-2">
            <div class="print-card" style="display:flex;flex-direction:column;gap:6px;">
              ${task.leftItems
                .map(
                  (it) => `
                  <div style="display:flex;justify-content:space-between;align-items:center;font-weight:800;">
                    <span>${it.givenZ} Z &nbsp; ${it.givenE} E &nbsp;=</span>
                    <span>${wBox("sm")} Z &nbsp; ${wBox("sm")} E</span>
                  </div>`
                )
                .join("")}
            </div>
            <div class="print-card" style="display:flex;flex-direction:column;gap:6px;">
              ${task.rightItems
                .map(
                  (it) => `
                  <div style="display:flex;justify-content:space-between;align-items:center;font-weight:800;">
                    <span>${it.givenZ} Z &nbsp; ${it.givenE} E &nbsp;=</span>
                    <span>${wBox("sm")} H &nbsp; ${wBox("sm")} Z &nbsp; ${wBox("sm")} E</span>
                  </div>`
                )
                .join("")}
            </div>
          </div>`,
          solution:
            task.leftItems
              .map((it) => `${it.givenZ} Z ${it.givenE} E = <strong>${it.ansZ} Z ${it.ansE} E</strong>`)
              .join(" · ") +
            "<br>" +
            task.rightItems
              .map((it) => `${it.givenZ} Z ${it.givenE} E = <strong>${it.ansH} H ${it.ansZ} Z ${it.ansE} E</strong>`)
              .join(" · ") +
            " (je 1 P.)"
        };
      }

      case "word_htafel": {
        let cells = "";
        for (let i = 1; i <= 100; i++) {
          cells += `<span>${task.hBase + i}</span>`;
        }
        return {
          prompt: `Lies die 3 Zahlwörter, schreibe sie als Zahl auf und kreise die 3 Zahlen rechts in der Hundertertafel (${task.hBase + 1} bis ${task.hBase + 100}) mit dem Stift ein!`,
          body: `<div class="print-grid-2" style="grid-template-columns: 1.15fr 1fr;">
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${task.targets
                .map(
                  (t) => `
                  <div class="print-card" style="display:flex;justify-content:space-between;align-items:center;font-weight:800;">
                    <span>„${t.word}“</span>
                    <span>= ${wBox("lg")}</span>
                  </div>`
                )
                .join("")}
            </div>
            <div>
              <div class="print-htafel">${cells}</div>
            </div>
          </div>`,
          solution:
            task.targets.map((t) => `${t.word} = <strong>${t.num}</strong>`).join("<br>") +
            "<br><em>(Je 1 P. für die Zahl + je 1 P. fürs Einkreisen in der Tafel)</em>"
        };
      }

      case "htafel_puzzle": {
        return {
          prompt: "Trage die fehlenden Zahlen in die Ausschnitte der Hundertertafel ein (rechts: +1, links: −1, unten: +10, oben: −10).",
          body: `<div class="print-grid-3">${task.puzzles
            .map((p) => {
              let gridHTML = `<div style="display:grid;grid-template-columns:repeat(${p.cols}, 44px);grid-template-rows:repeat(${p.rows}, 30px);gap:2px;justify-content:center;">`;
              for (let r = 0; r < p.rows; r++) {
                for (let c = 0; c < p.cols; c++) {
                  const found = p.cells.find((item) => item.r === r && item.c === c);
                  if (!found) {
                    gridHTML += `<div></div>`;
                  } else if (found.given) {
                    gridHTML += `<div style="border:1.5px solid #1e293b;background:#e2e8f0;font-weight:900;display:flex;align-items:center;justify-content:center;border-radius:3px;">${found.val}</div>`;
                  } else {
                    gridHTML += `<div style="border:1.5px solid #1e293b;background:#ffffff;border-radius:3px;"></div>`;
                  }
                }
              }
              gridHTML += `</div>`;
              return `<div class="print-card" style="text-align:center;">
                <div style="font-size:8.5pt;font-weight:800;color:#475569;margin-bottom:4px;">${p.name}</div>
                ${gridHTML}
              </div>`;
            })
            .join("")}</div>`,
          solution: task.puzzles
            .map((p) => {
              const vals = p.cells
                .slice()
                .sort((a, b) => a.r - b.r || a.c - b.c)
                .map((c) => (c.given ? `[${c.val}]` : `<strong>${c.val}</strong>`))
                .join(", ");
              return `${p.name}: ${vals} (2 P.)`;
            })
            .join("<br>")
        };
      }

      case "number_riddles": {
        return {
          prompt: "Lies genau, was der Hund und die Schildkröte mit ihren Zahlen machen, und trage die gesuchte Zahl ein.",
          body: `<div style="display:flex;flex-direction:column;gap:6px;">${task.riddles
            .map(
              (r) => `
              <div class="print-card" style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
                <div style="font-size:9.5pt;"><strong>${r.avatar}</strong> ${r.text}</div>
                <div style="white-space:nowrap;font-weight:800;font-size:9.5pt;">${r.label} ${wBox("lg")}</div>
              </div>`
            )
            .join("")}</div>`,
          solution: task.riddles
            .map((r, i) => `Rätsel ${i + 1}: <strong>${r.answer}</strong> (${r.explain}) (2 P.)`)
            .join("<br>")
        };
      }

      case "number_line_connect": {
        return {
          prompt: "Verbinde jedes Zahlenkärtchen mit einem Strich (Stift und Lineal) mit der genau passenden Stelle am Zahlenstrahl!",
          body: `<div class="print-card" style="padding:6px;">${renderPrintNumberLineSVG(task)}</div>`,
          solution: `Zahlen am Zahlenstrahl (${task.start} bis ${task.end}): <strong>${task.numbers.join(", ")}</strong> (je 1 P.)`
        };
      }

      case "neighbor_tens":
      case "neighbor_hundreds": {
        const isTens = task.type === "neighbor_tens";
        const colLabel = isTens ? "NZ (Nachbarzehner)" : "NH (Nachbarhunderter)";
        const unitWord = isTens ? "Zehner" : "Hunderter";
        return {
          prompt: `Trage den kleineren und den größeren ${colLabel} ein. Kreise außerdem den ${unitWord} ein, der näher an der Zahl liegt!`,
          body: `<table class="nz-table" style="font-size:9.5pt;">
            <thead>
              <tr>
                <th>Kleinerer ${isTens ? "NZ" : "NH"}</th>
                <th>Zahl (Z)</th>
                <th>Größerer ${isTens ? "NZ" : "NH"}</th>
              </tr>
            </thead>
            <tbody>
              ${task.items
                .map(
                  (it) => `
                  <tr>
                    <td>${wBox("lg")}</td>
                    <td style="font-weight:900;font-size:10.5pt;background:#f8fafc;">${it.z}</td>
                    <td>${wBox("lg")}</td>
                  </tr>`
                )
                .join("")}
            </tbody>
          </table>`,
          solution: task.items
            .map((it) => {
              const lowStr = it.closer === "low" ? `<u><strong>${it.low}</strong> (näher)</u>` : `${it.low}`;
              const highStr = it.closer === "high" ? `<u><strong>${it.high}</strong> (näher)</u>` : `${it.high}`;
              return `${it.z}: ${lowStr} und ${highStr} (1 P.)`;
            })
            .join("<br>")
        };
      }

      case "compare_numbers": {
        return {
          prompt: "Vergleiche die Zahlen und trage das passende Zeichen (<, > oder =) in das Kästchen ein!",
          body: `<div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;">
            ${task.pairs
              .map(
                (p) => `
                <div class="print-card" style="display:flex;align-items:center;justify-content:center;gap:6px;font-weight:900;font-size:10.5pt;">
                  <span>${p.a}</span> ${wBox("sm")} <span>${p.b}</span>
                </div>`
              )
              .join("")}
          </div>`,
          solution: task.pairs.map((p) => `<strong>${p.a} ${p.ans} ${p.b}</strong>`).join(" &nbsp;·&nbsp; ") + " (je 1 P.)"
        };
      }

      case "rechenstrich_approx": {
        return {
          prompt: "Wo liegen die 4 Zahlen ungefähr? Zeichne für jede Zahl einen Strich auf dem Rechenstrich ein und schreibe die Zahl daran!",
          body: `<div style="display:flex;flex-direction:column;gap:8px;">
            ${task.lines
              .map(
                (ln) => `
                <div class="print-card">
                  <div style="font-weight:800;font-size:9.5pt;margin-bottom:4px;">
                    ${ln.label} &nbsp; Trage ein: <strong>${ln.numbers.join(" · ")}</strong>
                  </div>
                  ${renderPrintRechenstrichSVG(ln.start, ln.end, false)}
                </div>`
              )
              .join("")}
          </div>`,
          solution: task.lines
            .map(
              (ln, i) =>
                `Strich ${i + 1} (${ln.start}–${ln.end}, Mitte ${ln.start + (ln.end - ln.start) / 2}): <strong>${ln.numbers.join(", ")}</strong> (je 1 P.)`
            )
            .join("<br>")
        };
      }

      case "rechenstrich_custom": {
        return {
          prompt: `Schau dir die 4 Zahlen an: ${task.numbers.join(", ")}. Trage zuerst links und rechts den passenden Start- und Endhunderter in die Kästchen ein und ordne dann die 4 Zahlen auf dem Rechenstrich ein!`,
          body: `<div class="print-card">
            <div style="font-weight:800;font-size:9.5pt;margin-bottom:4px;">
              Zahlen zum Eintragen: <strong>${task.numbers.join(" · ")}</strong>
            </div>
            ${renderPrintRechenstrichSVG("", "", true)}
          </div>`,
          solution: `Start-Hunderter: <strong>${task.expectedStart}</strong>, End-Hunderter: <strong>${task.expectedEnd}</strong> (1 P.) + 4 Zahlen passend eingezeichnet: <strong>${task.numbers.join(", ")}</strong> (4 P.)`
        };
      }

      case "decompositions": {
        const eqs = task.items.slice(0, 4);
        const houses = task.items.slice(4, 6);
        return {
          prompt: "Zerlege die Zahlen, ergänze zum nächsten Hunderter / bis 1000 und vervollständige die Zahlhäuser!",
          body: `<div class="print-grid-2">
            <div class="print-card" style="display:flex;flex-direction:column;gap:6px;font-weight:800;">
              ${eqs
                .map(
                  (it) => `<div>${it.label} ${wBox()} ${it.after || ""}</div>`
                )
                .join("")}
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              ${houses
                .map(
                  (it) => `
                  <div style="border:1.5px solid #1e293b;border-radius:6px;overflow:hidden;text-align:center;background:#fff;">
                    <div style="background:#e2e8f0;font-weight:900;padding:3px;border-bottom:1.5px solid #1e293b;">🏠 ${it.roof}</div>
                    <div style="padding:8px 4px;font-weight:800;font-size:9.5pt;">${it.givenText} ${wBox()}</div>
                  </div>`
                )
                .join("")}
            </div>
          </div>`,
          solution: task.items
            .map((it, idx) =>
              idx < 4
                ? `${it.label} <strong>${it.ans}</strong> ${it.after || ""}`
                : `🏠 ${it.roof}: ${it.givenText} <strong>${it.ans}</strong>`
            )
            .join(" &nbsp;·&nbsp; ") + " (je 1 P.)"
        };
      }

      case "number_sequences": {
        return {
          prompt: "Setze jede Zahlenfolge um 2 Zahlen fort und schreibe rechts die passende Regel auf (z. B. „+20“ oder „−50“)!",
          body: `<div style="display:flex;flex-direction:column;gap:6px;">
            ${task.sequences
              .map(
                (seq) => `
                <div class="print-card" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                  <div style="font-weight:800;font-size:10pt;">
                    ${seq.given.join(" &rarr; ")} &rarr; ${wBox()} &rarr; ${wBox()}
                  </div>
                  <div style="font-weight:800;font-size:9.5pt;">
                    Regel: <span class="print-write-line" style="min-width:125px;"></span>
                  </div>
                </div>`
              )
              .join("")}
          </div>`,
          solution: task.sequences
            .map(
              (seq, i) =>
                `Folge ${i + 1}: <strong>${seq.ans1}, ${seq.ans2}</strong> (1 P.) · Regel: <strong>${seq.correctRule}</strong> (1 P.)`
            )
            .join("<br>")
        };
      }

      case "mult_div_basic": {
        return {
          prompt: "Rechne die Mal- und Geteiltaufgaben im Kopf aus:",
          body: `<div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;">
            ${task.items
              .map(
                (it) => `
                <div class="print-card" style="display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:10.5pt;">
                  <span>${it.a} ${it.op} ${it.b} =</span> ${wBox()}
                </div>`
              )
              .join("")}
          </div>`,
          solution: task.items.map((it) => `${it.a} ${it.op} ${it.b} = <strong>${it.ans}</strong>`).join(" &nbsp;·&nbsp; ") + " (je 1 P.)"
        };
      }

      case "mult_div_missing": {
        return {
          prompt: "Welche Zahl fehlt in der Lücke? Nutze die Umkehraufgabe als Hilfe!",
          body: `<div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;">
            ${task.items
              .map((it) => {
                const eq =
                  it.mode === "missingA"
                    ? `${wBox()} ${it.op} ${it.b} = ${it.c}`
                    : `${it.a} ${it.op} ${wBox()} = ${it.c}`;
                return `<div class="print-card" style="text-align:center;font-weight:800;font-size:10.5pt;">${eq}</div>`;
              })
              .join("")}
          </div>`,
          solution: task.items
            .map((it) =>
              it.mode === "missingA"
                ? `<strong>${it.ans}</strong> ${it.op} ${it.b} = ${it.c}`
                : `${it.a} ${it.op} <strong>${it.ans}</strong> = ${it.c}`
            )
            .join(" &nbsp;·&nbsp; ") + " (je 1 P.)"
        };
      }

      case "fact_family": {
        return {
          prompt: `Bilde aus den drei Zahlen ${task.a}, ${task.b} und ${task.p} zwei verschiedene Malaufgaben und zwei verschiedene Geteiltaufgaben!`,
          body: `<div style="display:grid;grid-template-columns:auto 1fr 1fr;gap:10px;align-items:center;">
            <div class="print-card" style="text-align:center;padding:8px 12px;">
              <div style="font-size:8.5pt;font-weight:800;color:#475569;margin-bottom:4px;">Familien-Zahlen</div>
              <div style="font-size:12pt;font-weight:900;letter-spacing:2px;">${task.a} &nbsp;·&nbsp; ${task.p} &nbsp;·&nbsp; ${task.b}</div>
            </div>
            <div class="print-card" style="display:flex;flex-direction:column;gap:5px;font-weight:800;text-align:center;">
              <div style="font-size:9pt;color:#475569;">2 Malaufgaben (·)</div>
              <div>${wBox("sm")} · ${wBox("sm")} = ${wBox()}</div>
              <div>${wBox("sm")} · ${wBox("sm")} = ${wBox()}</div>
            </div>
            <div class="print-card" style="display:flex;flex-direction:column;gap:5px;font-weight:800;text-align:center;">
              <div style="font-size:9pt;color:#475569;">2 Geteiltaufgaben (:)</div>
              <div>${wBox()} : ${wBox("sm")} = ${wBox("sm")}</div>
              <div>${wBox()} : ${wBox("sm")} = ${wBox("sm")}</div>
            </div>
          </div>`,
          solution: `<strong>${task.a} · ${task.b} = ${task.p}</strong>, <strong>${task.b} · ${task.a} = ${task.p}</strong>, <strong>${task.p} : ${task.a} = ${task.b}</strong>, <strong>${task.p} : ${task.b} = ${task.a}</strong> (je 1 P.)`
        };
      }

      case "word_problem": {
        const d = task.data;
        return {
          prompt: "Lies die Sachaufgabe genau durch. Schreibe die passende Rechnung mit Ergebnis und einen vollständigen Antwortsatz auf!",
          body: `<div style="display:flex;flex-direction:column;gap:6px;">
            <div class="print-card" style="background:#f8fafc;font-size:9.8pt;">📖 ${d.story}</div>
            <div style="display:flex;align-items:center;gap:8px;font-weight:800;font-size:9.8pt;margin-top:2px;">
              <span>Rechnung:</span>
              <span class="print-write-line" style="flex:1;"></span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;font-weight:800;font-size:9.8pt;">
              <span>Antwort:</span>
              <span class="print-write-line" style="flex:1;"></span>
            </div>
          </div>`,
          solution: `Rechnung: <strong>${d.a} ${d.op} ${d.b} = ${d.ans}</strong> (2 P.: 1 P. Rechnung + 1 P. Ergebnis)<br>Antwortsatz: <em>„${d.correctSentence}“</em> (1 P.)`
        };
      }

      default:
        return { prompt: task.prompt, body: "", solution: task.explanation || "" };
    }
  }

  function printExamPDF() {
    const printTasks = generateExamTasks();
    const maxPoints = printTasks.reduce((sum, t) => sum + t.points, 0);
    const container = document.getElementById("printContainer");
    const rendered = printTasks.map((t) => ({
      task: t,
      ...buildPrintTaskBodyHTML(t)
    }));

    // Berechne die dynamische Notentabelle anhand des Standard-Notenschlüssels:
    // Note 1: ab 95%, Note 2: ab 81%, Note 3: ab 66%, Note 4: ab 51%, Note 5: ab 26%, Note 6: unter 26%
    const gradeThresholds = [
      { grade: 1, word: "Sehr gut", minPct: 95 },
      { grade: 2, word: "Gut", minPct: 81 },
      { grade: 3, word: "Befriedigend", minPct: 66 },
      { grade: 4, word: "Ausreichend", minPct: 51 },
      { grade: 5, word: "Mangelhaft", minPct: 26 },
      { grade: 6, word: "Ungenügend", minPct: 0 }
    ];

    const gradeRows = gradeThresholds.map((g, idx) => {
      const minPts = g.minPct === 0 ? 0 : Math.ceil((g.minPct / 100) * maxPoints);
      const prevMinPts =
        idx === 0 ? maxPoints + 1 : Math.ceil((gradeThresholds[idx - 1].minPct / 100) * maxPoints);
      const maxPts = prevMinPts - 1;
      const pctText = g.minPct === 0 ? "unter 26 %" : `ab ${g.minPct} %`;
      const ptsText = minPts === maxPts ? `${minPts} P.` : `${maxPts} – ${minPts} P.`;
      return {
        grade: g.grade,
        word: g.word,
        pctText,
        ptsText
      };
    });

    const gradeTableHTML = `
      <table class="print-grade-table">
        <thead>
          <tr>
            <th>Schulnote</th>
            <th>Bewertung</th>
            <th>Benötigte Punktzahl (von ${maxPoints} P.)</th>
            <th>Prozentanteil (Notenschlüssel)</th>
          </tr>
        </thead>
        <tbody>
          ${gradeRows
            .map(
              (r) => `
              <tr>
                <td><strong>Note ${r.grade}</strong></td>
                <td>${r.word}</td>
                <td><strong>${r.ptsText}</strong></td>
                <td>${r.pctText}</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;

    let html = `
      <!-- Kopfbogen der Klausur -->
      <div class="print-sheet-header">
        <div class="print-sheet-title-row">
          <h1 class="print-sheet-title">📐 Mathe-Probeklausur – Klasse 3</h1>
          <span class="print-sheet-sub">Zahlen bis 1000 &amp; Kleines 1×1 · ${printTasks.length} Aufgaben · ${maxPoints} Punkte</span>
        </div>
        <div class="print-meta-grid">
          <div class="print-meta-field"><span>Name:</span><span class="print-meta-line"></span></div>
          <div class="print-meta-field"><span>Datum:</span><span class="print-meta-line"></span></div>
          <div class="print-meta-field"><span>Klasse:</span><span class="print-meta-line"></span></div>
          <div class="print-meta-field"><span>Punkte:</span><span class="print-meta-line"></span><span>/ ${maxPoints}</span></div>
        </div>
      </div>
    `;

    // Alle 20 Aufgaben
    rendered.forEach(({ task, prompt, body }) => {
      html += `
        <section class="print-task">
          <div class="print-task-head">
            <h2 class="print-task-title">
              <span class="print-task-num">Aufgabe ${task.id}</span>
              ${task.title}
            </h2>
            <span class="print-points-box">____ / ${task.points} P.</span>
          </div>
          <p class="print-prompt">${prompt}</p>
          <div>${body}</div>
        </section>
      `;
    });

    // Auswertungs- & Notenschlüssel-Kasten am Ende der Klausur
    html += `
      <div class="print-Grading-box">
        <div style="display:flex;justify-content:space-between;align-items:center;font-weight:900;font-size:11pt;margin-bottom:6px;">
          <span>🎓 Gesamtauswertung &amp; Notentabelle</span>
          <span>Erreichte Punkte: _______ / ${maxPoints} Punkte &nbsp;&nbsp;|&nbsp;&nbsp; Schulnote: _______</span>
        </div>
        ${gradeTableHTML}
      </div>
    `;

    // Lösungsbogen auf neuer Seite am Ende
    html += `
      <div class="print-page-break">
        <div class="print-sheet-header" style="margin-bottom:10px;">
          <div class="print-sheet-title-row" style="border:none;margin:0;padding:0;">
            <h2 class="print-sheet-title" style="font-size:13.5pt;">✅ Lösungsbogen &amp; Punkteverteilung (zur Kontrolle)</h2>
            <span class="print-sheet-sub">Mathe-Probeklausur Klasse 3 · Gesamt: ${maxPoints} Punkte</span>
          </div>
        </div>
        <div class="print-solutions-grid">
          ${rendered
            .map(
              ({ task, solution }) => `
              <div class="print-sol-item">
                <div class="print-sol-head">
                  <span>Aufgabe ${task.id}: ${task.title}</span>
                  <span>${task.points} P.</span>
                </div>
                <div>${solution}</div>
              </div>`
            )
            .join("")}
        </div>
        <div class="print-Grading-box" style="margin-top:10px;">
          <div style="font-weight:900;font-size:10.5pt;margin-bottom:4px;">
            📊 Notentabelle zur Punkte-Umrechnung (maximal ${maxPoints} Punkte)
          </div>
          ${gradeTableHTML}
        </div>
      </div>
    `;

    container.innerHTML = html;
    window.print();
  }

  // --- Event Listeners ---
  document.getElementById("btnStartExam").addEventListener("click", startNewExam);
  document.getElementById("btnPrintExam").addEventListener("click", printExamPDF);
  document.getElementById("btnRestart").addEventListener("click", startNewExam);
  document.getElementById("btnReviewSolutions").addEventListener("click", () => showReviewAtTask(0));

  btnBackToResults.addEventListener("click", () => {
    examScreen.hidden = true;
    taskNav.hidden = true;
    appFooter.hidden = true;
    btnBackToResults.hidden = true;
    resultsScreen.hidden = false;
  });

  btnPrev.addEventListener("click", () => {
    if (currentTaskIdx > 0) {
      currentTaskIdx -= 1;
      renderTabs();
      renderCurrentTask();
    }
  });

  btnNext.addEventListener("click", () => {
    if (currentTaskIdx < examTasks.length - 1) {
      currentTaskIdx += 1;
      renderTabs();
      renderCurrentTask();
    }
  });

  btnFinish.addEventListener("click", openSubmitModal);
  btnHeaderSubmit.addEventListener("click", openSubmitModal);
  modalBtnCancel.addEventListener("click", () => (confirmModal.hidden = true));
  modalBtnConfirm.addEventListener("click", finishExam);
})();
