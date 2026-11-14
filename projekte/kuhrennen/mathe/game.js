// Kuhrennen – Mathe
// Spiellogik, deterministischer Aufgaben-Generator, SVG-Kühe & Multiplayer-Synchronisation

(function (root) {
  "use strict";

  const ZIEL_SCHRITTE = 20;
  const SCHRITT_VOR = 1;
  const SCHRITT_ZURUECK = 0.25;

  // =========================================================================
  // 1. DETERMINISTISCHER ZUFALLSGENERATOR (damit alle exakt gleiche Aufgaben haben)
  // =========================================================================
  function createSeededRng(seed) {
    let a = (seed >>> 0) || 123456789;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function zufallMitRng(rng, min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
  }

  // =========================================================================
  // 2. AUFGABEN-KATALOG (wie bei Blitzaufgaben, aber mit deterministischem RNG)
  // =========================================================================
  const AUFGABEN_KATALOG = [
    {
      id: "einmaleins_und_durch",
      badge: "1 ×/÷ 1",
      titel: "1 mal 1 & 1 durch 1",
      beschreibung: "Multiplikation & Division (Faktoren 1 bis 9)",
      botZeitFaktor: 1.0,
      generiere(rng = Math.random) {
        const istMal = rng() < 0.5;
        const a = zufallMitRng(rng, 1, 9);
        const b = zufallMitRng(rng, 1, 9);

        if (istMal) {
          return {
            term: `${a} · ${b}`,
            loesung: a * b,
            operator: "·"
          };
        } else {
          const produkt = a * b;
          return {
            term: `${produkt} : ${b}`,
            loesung: a,
            operator: ":"
          };
        }
      }
    },
    {
      id: "plus_minus_1000",
      badge: "+ / −",
      titel: "Plus & Minus bis 1000",
      beschreibung: "Addition & Subtraktion (Ergebnis bis 1000)",
      botZeitFaktor: 3.0,
      generiere(rng = Math.random) {
        const istPlus = rng() < 0.5;
        const istKleinerRaum = rng() < 0.3;

        if (istKleinerRaum) {
          if (istPlus) {
            const c = zufallMitRng(rng, 0, 100);
            const a = zufallMitRng(rng, 0, c);
            const b = c - a;
            return {
              term: `${a} + ${b}`,
              loesung: c,
              operator: "+"
            };
          } else {
            const a = zufallMitRng(rng, 0, 100);
            const b = zufallMitRng(rng, 0, a);
            return {
              term: `${a} − ${b}`,
              loesung: a - b,
              operator: "−"
            };
          }
        }

        const istDidaktisch = rng() < 0.3;

        if (istPlus) {
          let a, b;
          if (istDidaktisch) {
            const variante = zufallMitRng(rng, 1, 5);
            if (variante === 1) {
              const h1 = zufallMitRng(rng, 1, 9);
              const h2 = zufallMitRng(rng, 1, 10 - h1);
              a = h1 * 100;
              b = h2 * 100;
            } else if (variante === 2) {
              const z1 = zufallMitRng(rng, 1, 98);
              const z2 = zufallMitRng(rng, 1, 99 - z1);
              a = z1 * 10;
              b = z2 * 10;
            } else if (variante === 3) {
              if (rng() < 0.5) {
                a = zufallMitRng(rng, 1, 99) * 10;
                b = 1000 - a;
              } else {
                const zielH = zufallMitRng(rng, 2, 9) * 100;
                a = zielH - zufallMitRng(rng, 1, 9) * 10;
                b = zielH - a;
              }
            } else if (variante === 4) {
              if (rng() < 0.5) {
                a = zufallMitRng(rng, 1, 9) * 100;
                b = zufallMitRng(rng, 1, 99);
              } else {
                a = zufallMitRng(rng, 1, 9) * 100 + zufallMitRng(rng, 1, 9) * 10;
                b = zufallMitRng(rng, 1, 9);
              }
            } else {
              if (rng() < 0.2) {
                a = 0;
                b = 0;
              } else {
                a = zufallMitRng(rng, 0, 1000);
                b = 1000 - a;
              }
            }
          } else {
            const c = zufallMitRng(rng, 0, 1000);
            a = zufallMitRng(rng, 0, c);
            b = c - a;
          }

          return {
            term: `${a} + ${b}`,
            loesung: a + b,
            operator: "+"
          };
        } else {
          let a, b;
          if (istDidaktisch) {
            const variante = zufallMitRng(rng, 1, 5);
            if (variante === 1) {
              const h1 = zufallMitRng(rng, 1, 10);
              const h2 = zufallMitRng(rng, 1, h1);
              a = h1 * 100;
              b = h2 * 100;
            } else if (variante === 2) {
              const z1 = zufallMitRng(rng, 2, 100);
              const z2 = zufallMitRng(rng, 1, z1);
              a = z1 * 10;
              b = z2 * 10;
            } else if (variante === 3) {
              if (rng() < 0.5) {
                a = 1000;
                b = zufallMitRng(rng, 1, 99) * 10;
              } else {
                a = zufallMitRng(rng, 2, 9) * 100;
                b = zufallMitRng(rng, 1, 9) * 10;
              }
            } else if (variante === 4) {
              if (rng() < 0.5) {
                const h = zufallMitRng(rng, 1, 9) * 100;
                const z = zufallMitRng(rng, 1, 9) * 10;
                const e = zufallMitRng(rng, 1, 9);
                a = h + z + e;
                b = e;
              } else {
                const h = zufallMitRng(rng, 1, 9) * 100;
                const z = zufallMitRng(rng, 1, 9) * 10;
                a = h + z;
                b = zufallMitRng(rng, 1, 9);
              }
            } else {
              if (rng() < 0.6) {
                a = zufallMitRng(rng, 1, 1000);
                b = a;
              } else {
                a = 1000;
                b = 0;
              }
            }
          } else {
            a = zufallMitRng(rng, 0, 1000);
            b = zufallMitRng(rng, 0, a);
          }

          return {
            term: `${a} − ${b}`,
            loesung: a - b,
            operator: "−"
          };
        }
      }
    }
  ];

  // Erzeugt deterministisch die n-te Aufgabe (0-basiert) für einen Seed & Aufgabentyp
  function generiereAufgabeFuerIndex(typId, seed, aufgabeIndex) {
    const typ = AUFGABEN_KATALOG.find((t) => t.id === typId) || AUFGABEN_KATALOG[0];
    // Eigener Sub-Seed pro Aufgaben-Index garantiert O(1)-Zugriff und 100% Gleichheit
    const indexSeed = ((seed >>> 0) + Math.imul(aufgabeIndex + 1, 0x9e3779b9)) >>> 0;
    const rng = createSeededRng(indexSeed);
    return typ.generiere(rng);
  }

  // =========================================================================
  // 3. SPIELREGELN: SCHRITTE & RANGLISTE
  // =========================================================================
  function berechneNeuePosition(aktuellePos, istRichtig) {
    if (istRichtig) {
      return Math.min(ZIEL_SCHRITTE, Math.round((aktuellePos + SCHRITT_VOR) * 100) / 100);
    } else {
      return Math.max(0, Math.round((aktuellePos - SCHRITT_ZURUECK) * 100) / 100);
    }
  }

  function formatiereSchritte(pos) {
    return Number.isInteger(pos) ? String(pos) : pos.toFixed(2).replace(/0$/, "").replace(".", ",");
  }

  function berechneRangliste(spielerListe, dauerMs) {
    const sortiert = [...spielerListe].sort((a, b) => {
      if (b.position !== a.position) return b.position - a.position;
      if (b.richtig !== a.richtig) return b.richtig - a.richtig;
      return a.fehler - b.fehler;
    });

    return sortiert.map((sp, idx) => {
      const versuche = sp.richtig + sp.fehler;
      const genauigkeit = versuche > 0 ? Math.round((sp.richtig / versuche) * 100) : 100;
      return {
        ...sp,
        platz: idx + 1,
        versuche,
        genauigkeit,
        dauerSek: Math.max(0.1, Math.round((dauerMs / 1000) * 10) / 10)
      };
    });
  }

  // =========================================================================
  // 4. NIEDLICHE SVG-KÜHE (6 DESIGNS)
  // =========================================================================
  const KUH_DESIGNS = [
    {
      id: "flecki",
      name: "Flecki",
      pitch: 1.0,
      bodyColor: "#ffffff",
      spotColor: "#1e293b",
      snoutColor: "#fbcfe8",
      hornColor: "#fde68a",
      accessory: "bell"
    },
    {
      id: "schoko",
      name: "Berta",
      pitch: 0.88,
      bodyColor: "#b45309",
      spotColor: "#78350f",
      snoutColor: "#fed7aa",
      hornColor: "#fef3c7",
      accessory: "bell"
    },
    {
      id: "lila",
      name: "Milka",
      pitch: 1.12,
      bodyColor: "#a855f7",
      spotColor: "#f3e8ff",
      snoutColor: "#f5d0fe",
      hornColor: "#fde68a",
      accessory: "star"
    },
    {
      id: "goldi",
      name: "Goldi",
      pitch: 1.05,
      bodyColor: "#facc15",
      spotColor: "#ca8a04",
      snoutColor: "#fef08a",
      hornColor: "#ffffff",
      accessory: "crown"
    },
    {
      id: "cool",
      name: "Rudi",
      pitch: 0.92,
      bodyColor: "#f8fafc",
      spotColor: "#0f172a",
      snoutColor: "#fda4af",
      hornColor: "#cbd5e1",
      accessory: "glasses"
    },
    {
      id: "bluemchen",
      name: "Rosalie",
      pitch: 1.18,
      bodyColor: "#fbcfe8",
      spotColor: "#ec4899",
      snoutColor: "#fce7f3",
      hornColor: "#fef08a",
      accessory: "flower"
    }
  ];

  // =========================================================================
  // 4b. ROBOTER-COMPUTERKÜHE (5 SCHWIERIGKEITSSTUFEN)
  // =========================================================================
  const BOT_STUFEN = [
    {
      id: "baby",
      cowId: "robo_baby",
      label: "Baby",
      baseName: "Baby-Bot",
      minTimeMs: 8000,
      maxTimeMs: 12000,
      accuracy: 0.70
    },
    {
      id: "leicht",
      cowId: "robo_leicht",
      label: "Leicht",
      baseName: "Blech-Berta",
      minTimeMs: 5000,
      maxTimeMs: 8000,
      accuracy: 0.80
    },
    {
      id: "mittel",
      cowId: "robo_mittel",
      label: "Mittel",
      baseName: "Cyber-Kuh",
      minTimeMs: 3500,
      maxTimeMs: 5500,
      accuracy: 0.88
    },
    {
      id: "schwer",
      cowId: "robo_schwer",
      label: "Schwer",
      baseName: "Mecha-Muh",
      minTimeMs: 2200,
      maxTimeMs: 3500,
      accuracy: 0.94
    },
    {
      id: "terminator",
      cowId: "robo_terminator",
      label: "Terminator",
      baseName: "Muh-minator",
      minTimeMs: 1200,
      maxTimeMs: 2200,
      accuracy: 0.99
    }
  ];

  function holeBotStufe(stufeId) {
    return BOT_STUFEN.find((s) => s.id === stufeId) || BOT_STUFEN[1];
  }

  function berechneBotAntwortZeitMs(stufeId, typId, rng = Math.random) {
    const stufe = holeBotStufe(stufeId);
    const typ = AUFGABEN_KATALOG.find((t) => t.id === typId) || AUFGABEN_KATALOG[0];
    const faktor = typ.botZeitFaktor || 1.0;
    const minMs = Math.round(stufe.minTimeMs * faktor);
    const maxMs = Math.round(stufe.maxTimeMs * faktor);
    return zufallMitRng(rng, minMs, maxMs);
  }

  function entscheideBotAntwort(stufeId, rng = Math.random) {
    const stufe = holeBotStufe(stufeId);
    return rng() < stufe.accuracy;
  }

  function erzeugeBotSpieler(botId, stufeId = "leicht") {
    const stufe = holeBotStufe(stufeId);
    return {
      id: botId,
      name: `${stufe.baseName} (${stufe.label})`,
      cowId: stufe.cowId,
      isHost: false,
      isBot: true,
      botDifficulty: stufe.id,
      position: 0,
      richtig: 0,
      fehler: 0
    };
  }

  function aktualisiereBotNamen(liste) {
    const anzahlProStufe = {};
    liste.forEach((sp) => {
      if (sp && sp.isBot) {
        anzahlProStufe[sp.botDifficulty] = (anzahlProStufe[sp.botDifficulty] || 0) + 1;
      }
    });

    const laufIndexProStufe = {};
    liste.forEach((sp) => {
      if (sp && sp.isBot) {
        const stufe = holeBotStufe(sp.botDifficulty);
        const gesamt = anzahlProStufe[sp.botDifficulty] || 1;
        sp.cowId = stufe.cowId;
        if (gesamt > 1) {
          laufIndexProStufe[sp.botDifficulty] = (laufIndexProStufe[sp.botDifficulty] || 0) + 1;
          sp.name = `${stufe.baseName} ${laufIndexProStufe[sp.botDifficulty]} (${stufe.label})`;
        } else {
          sp.name = `${stufe.baseName} (${stufe.label})`;
        }
      }
    });
    return liste;
  }

  function renderRobotCowSvg(cowId) {
    if (cowId === "robo_baby") {
      // 1. BABY-BOT: Süßes Pastell-Blech-Kälbchen mit Aufziehschlüssel, Propellerhut, Kuller-LEDs & Schnuller
      return `
        <svg viewBox="0 0 84 62" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <!-- Feder-Schwänzchen mit gelber Kugel -->
          <path d="M12 29 Q6 26 7 33 Q4 36 8 38" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
          <circle cx="7" cy="38" r="2.8" fill="#facc15" stroke="#0284c7" stroke-width="1.2"/>
          <!-- Aufziehschlüssel auf dem Rücken -->
          <line x1="25" y1="20" x2="25" y2="13" stroke="#94a3b8" stroke-width="2.5"/>
          <circle cx="22" cy="11" r="3" fill="none" stroke="#f59e0b" stroke-width="2"/>
          <circle cx="28" cy="11" r="3" fill="none" stroke="#f59e0b" stroke-width="2"/>
          <!-- Kleine Stützräder-Beine -->
          <rect x="18" y="42" width="5.5" height="12" rx="2" fill="#bae6fd" stroke="#0369a1" stroke-width="1.6"/>
          <rect x="27" y="43" width="5.5" height="11" rx="2" fill="#bae6fd" stroke="#0369a1" stroke-width="1.6"/>
          <rect x="43" y="42" width="5.5" height="12" rx="2" fill="#bae6fd" stroke="#0369a1" stroke-width="1.6"/>
          <rect x="51" y="43" width="5.5" height="11" rx="2" fill="#bae6fd" stroke="#0369a1" stroke-width="1.6"/>
          <circle cx="20.7" cy="55" r="2.4" fill="#38bdf8" stroke="#0369a1" stroke-width="1.2"/>
          <circle cx="45.7" cy="55" r="2.4" fill="#38bdf8" stroke="#0369a1" stroke-width="1.2"/>
          <!-- Runder Baby-Roboter-Körper -->
          <rect x="13" y="21" width="44" height="24" rx="11" fill="#e0f2fe" stroke="#0369a1" stroke-width="2"/>
          <rect x="20" y="25" width="24" height="15" rx="6" fill="#ffffff" stroke="#7dd3fc" stroke-width="1.4"/>
          <!-- Kleines Herz-Lämpchen auf dem Bauch -->
          <circle cx="32" cy="32.5" r="3.5" fill="#f472b6"/>
          <!-- Kopf -->
          <g>
            <!-- Bunter Propeller-Hut -->
            <path d="M51 14 Q59 7 67 14 Z" fill="#facc15" stroke="#0369a1" stroke-width="1.5"/>
            <line x1="59" y1="10" x2="59" y2="6" stroke="#0369a1" stroke-width="2"/>
            <ellipse cx="59" cy="6" rx="8" ry="1.8" fill="#ef4444" stroke="#991b1b" stroke-width="1"/>
            <!-- Kopfbasis -->
            <rect x="46" y="14" width="26" height="22" rx="9" fill="#e0f2fe" stroke="#0369a1" stroke-width="2"/>
            <!-- Große süße Kuller-LED-Augen -->
            <circle cx="55.5" cy="23" r="3.6" fill="#0f172a"/>
            <circle cx="66.5" cy="23" r="3.6" fill="#0f172a"/>
            <circle cx="55.5" cy="23" r="2.3" fill="#38bdf8"/>
            <circle cx="66.5" cy="23" r="2.3" fill="#38bdf8"/>
            <circle cx="54.7" cy="22" r="1" fill="#ffffff"/>
            <circle cx="65.7" cy="22" r="1" fill="#ffffff"/>
            <!-- Schnauze mit Schnuller -->
            <ellipse cx="62" cy="32" rx="10" ry="6" fill="#bae6fd" stroke="#0369a1" stroke-width="1.5"/>
            <circle cx="62" cy="33" r="3.4" fill="#f472b6" stroke="#be185d" stroke-width="1.2"/>
            <circle cx="62" cy="36.2" r="2.8" fill="none" stroke="#facc15" stroke-width="1.6"/>
          </g>
        </svg>
      `;
    }

    if (cowId === "robo_leicht") {
      // 2. BLECH-BERTA (LEICHT): Freundlicher Retro-Blechroboter mit Glühbirnen-Antenne & Nieten
      return `
        <svg viewBox="0 0 84 62" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <!-- Draht-Schwanz -->
          <polyline points="12,28 5,26 7,35 4,38" fill="none" stroke="#64748b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Ziehharmonika-Blechbeine -->
          <rect x="18" y="42" width="5.5" height="14" rx="1.5" fill="#94a3b8" stroke="#334155" stroke-width="1.8"/>
          <rect x="27" y="43" width="5.5" height="13" rx="1.5" fill="#94a3b8" stroke="#334155" stroke-width="1.8"/>
          <rect x="43" y="42" width="5.5" height="14" rx="1.5" fill="#94a3b8" stroke="#334155" stroke-width="1.8"/>
          <rect x="51" y="43" width="5.5" height="13" rx="1.5" fill="#94a3b8" stroke="#334155" stroke-width="1.8"/>
          <!-- Kastiger Blechkörper mit Kupfer-Platte und Nieten -->
          <rect x="12" y="20" width="46" height="25" rx="5" fill="#cbd5e1" stroke="#334155" stroke-width="2"/>
          <rect x="18" y="25" width="16" height="14" rx="2" fill="#d97706" stroke="#78350f" stroke-width="1.4"/>
          <circle cx="15.5" cy="23.5" r="1.2" fill="#475569"/>
          <circle cx="15.5" cy="41.5" r="1.2" fill="#475569"/>
          <circle cx="41" cy="24" r="1.2" fill="#475569"/>
          <circle cx="41" cy="41" r="1.2" fill="#475569"/>
          <!-- Zahnrad-Glocke am Hals -->
          <circle cx="54" cy="41" r="4.5" fill="#f59e0b" stroke="#78350f" stroke-width="1.6" stroke-dasharray="2.5 1.5"/>
          <circle cx="54" cy="41" r="1.6" fill="#334155"/>
          <!-- Kopf -->
          <g>
            <!-- Kleine Blech-Rohr-Hörner & Glühbirnen-Antenne -->
            <rect x="49" y="9" width="3.5" height="6" rx="1" fill="#94a3b8" stroke="#334155" stroke-width="1.4"/>
            <rect x="65" y="9" width="3.5" height="6" rx="1" fill="#94a3b8" stroke="#334155" stroke-width="1.4"/>
            <line x1="59" y1="14" x2="59" y2="7" stroke="#475569" stroke-width="2"/>
            <circle cx="59" cy="5.5" r="3.2" fill="#fde047" stroke="#ca8a04" stroke-width="1.4"/>
            <!-- Kastiger Blech-Kopf -->
            <rect x="46" y="14" width="26" height="22" rx="4" fill="#cbd5e1" stroke="#334155" stroke-width="2"/>
            <!-- Freundliche grüne LED-Augen -->
            <rect x="52" y="19.5" width="6.5" height="6" rx="1.2" fill="#0f172a"/>
            <rect x="62" y="19.5" width="6.5" height="6" rx="1.2" fill="#0f172a"/>
            <circle cx="55.2" cy="22.5" r="2" fill="#4ade80"/>
            <circle cx="65.2" cy="22.5" r="2" fill="#4ade80"/>
            <!-- Lautsprecher-Gitter-Schnauze -->
            <rect x="51" y="28" width="21" height="9" rx="3" fill="#94a3b8" stroke="#334155" stroke-width="1.6"/>
            <line x1="56" y1="29.8" x2="56" y2="35.2" stroke="#1e293b" stroke-width="1.5"/>
            <line x1="60" y1="29.8" x2="60" y2="35.2" stroke="#1e293b" stroke-width="1.5"/>
            <line x1="64" y1="29.8" x2="64" y2="35.2" stroke="#1e293b" stroke-width="1.5"/>
            <line x1="68" y1="29.8" x2="68" y2="35.2" stroke="#1e293b" stroke-width="1.5"/>
          </g>
        </svg>
      `;
    }

    if (cowId === "robo_mittel") {
      // 3. CYBER-KUH (MITTEL): Schnittige Chrom-Kuh mit blauem Laser-Visier & Energie-Kern
      return `
        <svg viewBox="0 0 84 62" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <!-- Cyber-Kabel-Schwanz mit blauem Leucht-Ende -->
          <path d="M12 27 Q3 24 5 35" fill="none" stroke="#1e293b" stroke-width="2.6" stroke-linecap="round"/>
          <circle cx="5" cy="36" r="2.6" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2"/>
          <!-- Hydraulik-Beine -->
          <rect x="18" y="42" width="5.5" height="14" rx="2" fill="#64748b" stroke="#0f172a" stroke-width="1.8"/>
          <rect x="27" y="43" width="5.5" height="13" rx="2" fill="#64748b" stroke="#0f172a" stroke-width="1.8"/>
          <rect x="43" y="42" width="5.5" height="14" rx="2" fill="#64748b" stroke="#0f172a" stroke-width="1.8"/>
          <rect x="51" y="43" width="5.5" height="13" rx="2" fill="#64748b" stroke="#0f172a" stroke-width="1.8"/>
          <!-- Chrom-Körper mit leuchtenden Cyber-Leiterbahnen -->
          <rect x="12" y="20" width="46" height="25" rx="9" fill="#94a3b8" stroke="#0f172a" stroke-width="2"/>
          <polyline points="17,32 25,32 29,26 39,26" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="22,38 34,38 38,34 44,34" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="39" cy="26" r="2.2" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.2"/>
          <!-- Leuchtender blauer Reaktor-Kern am Hals -->
          <circle cx="54" cy="40.5" r="4.5" fill="#0284c7" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="54" cy="40.5" r="2.3" fill="#7dd3fc"/>
          <!-- Kopf -->
          <g>
            <!-- Kantige Silber-Klingen-Hörner -->
            <polygon points="49,15 46,6 54,13" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.6"/>
            <polygon points="63,13 70,6 68,15" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.6"/>
            <!-- Kopfbasis -->
            <rect x="46" y="14" width="26" height="22" rx="7" fill="#94a3b8" stroke="#0f172a" stroke-width="2"/>
            <!-- Durchgehendes leuchtendes Cyber-Visier (fokussiert) -->
            <rect x="50" y="18.5" width="20" height="7" rx="3" fill="#0f172a" stroke="#0284c7" stroke-width="1.2"/>
            <rect x="52" y="20.2" width="16" height="3.5" rx="1.5" fill="#38bdf8"/>
            <line x1="50" y1="18.5" x2="70" y2="20" stroke="#0f172a" stroke-width="1.8"/>
            <!-- Metall-Schnauze mit blauen Lüftungsschlitzen -->
            <rect x="51" y="27.5" width="22" height="9.5" rx="4.5" fill="#475569" stroke="#0f172a" stroke-width="1.6"/>
            <rect x="56" y="30.5" width="3.5" height="3.5" rx="1" fill="#38bdf8"/>
            <rect x="65" y="30.5" width="3.5" height="3.5" rx="1" fill="#38bdf8"/>
          </g>
        </svg>
      `;
    }

    if (cowId === "robo_schwer") {
      // 4. MECHA-MUH (SCHWER): Dunkel gepanzerter Kampf-Bulle mit Düsen-Antrieb, Warnstreifen & glühenden Augen
      return `
        <svg viewBox="0 0 84 62" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <!-- Raketen-Düsen-Auspuff hinten mit Flamme -->
          <polygon points="11,26 2,22 5,29 1,34 11,33" fill="#f97316" stroke="#dc2626" stroke-width="1"/>
          <rect x="9" y="25" width="5" height="9" rx="1.5" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
          <!-- Schwere Panzer-Beine -->
          <rect x="18" y="42" width="6.5" height="14" rx="1.5" fill="#334155" stroke="#0f172a" stroke-width="1.8"/>
          <rect x="27" y="43" width="6.5" height="13" rx="1.5" fill="#334155" stroke="#0f172a" stroke-width="1.8"/>
          <rect x="43" y="42" width="6.5" height="14" rx="1.5" fill="#334155" stroke="#0f172a" stroke-width="1.8"/>
          <rect x="51" y="43" width="6.5" height="13" rx="1.5" fill="#334155" stroke="#0f172a" stroke-width="1.8"/>
          <!-- Dunkler Panzer-Körper mit Warnstreifen -->
          <rect x="12" y="19" width="46" height="26" rx="6" fill="#334155" stroke="#0f172a" stroke-width="2.2"/>
          <polygon points="18,22 26,22 22,32 14,32" fill="#facc15"/>
          <polygon points="29,22 37,22 33,32 25,32" fill="#facc15"/>
          <rect x="16" y="36" width="26" height="5" rx="2" fill="#1e293b" stroke="#f97316" stroke-width="1.2"/>
          <!-- Glühender Orange-Kern am Hals -->
          <circle cx="54" cy="41" r="4.5" fill="#ea580c" stroke="#0f172a" stroke-width="1.6"/>
          <circle cx="54" cy="41" r="2" fill="#fef08a"/>
          <!-- Kopf -->
          <g>
            <!-- Scharfe nach vorn gerichtete Stahl-Stierhörner -->
            <path d="M50 15 L44 5 L55 12 Z" fill="#cbd5e1" stroke="#0f172a" stroke-width="1.6"/>
            <path d="M64 13 L75 4 L70 15 Z" fill="#cbd5e1" stroke="#0f172a" stroke-width="1.6"/>
            <!-- Gepanzerter Kopf -->
            <rect x="46" y="13" width="26" height="23" rx="5" fill="#334155" stroke="#0f172a" stroke-width="2.2"/>
            <!-- Böse schräg gestellte, orange-rot glühende Augen -->
            <polygon points="51,18 59,21 59,24.5 51,23" fill="#f97316" stroke="#7c2d12" stroke-width="0.8"/>
            <polygon points="69,18 61,21 61,24.5 69,23" fill="#f97316" stroke="#7c2d12" stroke-width="0.8"/>
            <!-- Schwere Eisen-Schnauze mit goldenem Stier-Nasenring -->
            <rect x="51" y="27" width="22" height="10" rx="3.5" fill="#1e293b" stroke="#0f172a" stroke-width="1.8"/>
            <circle cx="57" cy="31.5" r="1.8" fill="#f97316"/>
            <circle cx="67" cy="31.5" r="1.8" fill="#f97316"/>
            <circle cx="62" cy="37.5" r="3.4" fill="none" stroke="#facc15" stroke-width="2"/>
          </g>
        </svg>
      `;
    }

    if (cowId === "robo_terminator") {
      // 5. MUH-MINATOR (TERMINATOR): Chrom-Schwarz-Endoskelett, roter Plasma-Reaktor, Laser-Hörner & rote Todes-Augen
      return `
        <svg viewBox="0 0 84 62" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <!-- Doppel-Laser-Flamme & Skorpion-Metallschwanz -->
          <polygon points="12,24 0,19 5,27 0,34 12,32" fill="#ef4444" stroke="#facc15" stroke-width="0.9"/>
          <polyline points="13,22 6,14 11,11" fill="none" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round"/>
          <circle cx="11" cy="11" r="2.2" fill="#ef4444"/>
          <!-- Krallen-Cyborg-Beine -->
          <rect x="18" y="42" width="6" height="14" rx="1" fill="#0f172a" stroke="#94a3b8" stroke-width="1.6"/>
          <rect x="27" y="43" width="6" height="13" rx="1" fill="#0f172a" stroke="#94a3b8" stroke-width="1.6"/>
          <rect x="43" y="42" width="6" height="14" rx="1" fill="#0f172a" stroke="#94a3b8" stroke-width="1.6"/>
          <rect x="51" y="43" width="6" height="13" rx="1" fill="#0f172a" stroke="#94a3b8" stroke-width="1.6"/>
          <!-- Schwarzes Titan-Chassis mit glühendem rotem Endoskelett-Brustkorb -->
          <rect x="12" y="19" width="46" height="26" rx="5" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
          <rect x="18" y="24" width="26" height="16" rx="3" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.5"/>
          <line x1="23" y1="24" x2="23" y2="40" stroke="#cbd5e1" stroke-width="2.2"/>
          <line x1="29" y1="24" x2="29" y2="40" stroke="#cbd5e1" stroke-width="2.2"/>
          <line x1="35" y1="24" x2="35" y2="40" stroke="#cbd5e1" stroke-width="2.2"/>
          <circle cx="31" cy="32" r="4" fill="#ef4444"/>
          <circle cx="31" cy="32" r="1.8" fill="#ffffff"/>
          <!-- Roter Plasma-Kern am Hals -->
          <polygon points="54,36 59,41 54,46 49,41" fill="#dc2626" stroke="#fecaca" stroke-width="1.3"/>
          <!-- Kopf (halb Chrom-Schädel, halb schwarzer Kampf-Cyborg) -->
          <g>
            <!-- Gezackte rote Laser-Klingen-Hörner -->
            <polygon points="48,14 42,2 51,7 55,13" fill="#ef4444" stroke="#0f172a" stroke-width="1.5"/>
            <polygon points="63,13 69,7 78,2 71,14" fill="#ef4444" stroke="#0f172a" stroke-width="1.5"/>
            <!-- Kopfbasis mit halb freigelegter Chrom-Platte -->
            <rect x="46" y="13" width="26" height="23" rx="4" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
            <path d="M59 14 L70 14 Q72 14 72 17 L72 28 L59 28 Z" fill="#94a3b8"/>
            <!-- Bedrohliche V-Augenbraue & stechend rote Terminator-Laser-Augen -->
            <polyline points="50,17 60,21.5 70,17" fill="none" stroke="#ef4444" stroke-width="2"/>
            <circle cx="54.5" cy="22" r="3" fill="#ef4444"/>
            <circle cx="65.5" cy="22" r="3" fill="#ef4444"/>
            <circle cx="54.5" cy="22" r="1.3" fill="#ffffff"/>
            <circle cx="65.5" cy="22" r="1.3" fill="#ffffff"/>
            <!-- Metallisches Endoskelett-Gebiss an der Schnauze -->
            <rect x="50" y="27.5" width="23" height="9.5" rx="2.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.6"/>
            <line x1="51" y1="32.2" x2="72" y2="32.2" stroke="#ef4444" stroke-width="1.4"/>
            <line x1="55" y1="28.5" x2="55" y2="36" stroke="#cbd5e1" stroke-width="1.6"/>
            <line x1="59.5" y1="28.5" x2="59.5" y2="36" stroke="#cbd5e1" stroke-width="1.6"/>
            <line x1="64" y1="28.5" x2="64" y2="36" stroke="#cbd5e1" stroke-width="1.6"/>
            <line x1="68.5" y1="28.5" x2="68.5" y2="36" stroke="#cbd5e1" stroke-width="1.6"/>
          </g>
        </svg>
      `;
    }

    return "";
  }

  function renderCowSvg(cowId) {
    if (typeof cowId === "string" && cowId.startsWith("robo_")) {
      const roboSvg = renderRobotCowSvg(cowId);
      if (roboSvg) return roboSvg;
    }

    const d = KUH_DESIGNS.find((k) => k.id === cowId) || KUH_DESIGNS[0];
    let extraSvg = "";

    if (d.accessory === "crown") {
      extraSvg = `<polygon points="48,12 52,4 57,10 62,4 66,12" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>`;
    } else if (d.accessory === "glasses") {
      extraSvg = `
        <rect x="52" y="21" width="9" height="6" rx="1.5" fill="#0f172a"/>
        <rect x="63" y="21" width="9" height="6" rx="1.5" fill="#0f172a"/>
        <line x1="61" y1="23" x2="63" y2="23" stroke="#0f172a" stroke-width="2"/>
      `;
    } else if (d.accessory === "flower") {
      extraSvg = `
        <circle cx="50" cy="14" r="4.5" fill="#ffffff" stroke="#f472b6" stroke-width="1.2"/>
        <circle cx="50" cy="14" r="2" fill="#facc15"/>
      `;
    } else if (d.accessory === "star") {
      extraSvg = `<circle cx="30" cy="30" r="5" fill="${d.spotColor}"/>`;
    }

    return `
      <svg viewBox="0 0 84 62" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Schwanz -->
        <path d="M12 28 Q4 24 6 36" fill="none" stroke="${d.spotColor}" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Beine -->
        <rect x="18" y="42" width="5.5" height="14" rx="2.5" fill="${d.bodyColor}" stroke="#1e293b" stroke-width="1.8"/>
        <rect x="27" y="43" width="5.5" height="13" rx="2.5" fill="${d.bodyColor}" stroke="#1e293b" stroke-width="1.8"/>
        <rect x="43" y="42" width="5.5" height="14" rx="2.5" fill="${d.bodyColor}" stroke="#1e293b" stroke-width="1.8"/>
        <rect x="51" y="43" width="5.5" height="13" rx="2.5" fill="${d.bodyColor}" stroke="#1e293b" stroke-width="1.8"/>
        <!-- Körper -->
        <rect x="12" y="20" width="46" height="26" rx="12" fill="${d.bodyColor}" stroke="#1e293b" stroke-width="2"/>
        <!-- Flecken -->
        <ellipse cx="24" cy="29" rx="7" ry="5.5" fill="${d.spotColor}"/>
        <ellipse cx="39" cy="36" rx="6" ry="4.5" fill="${d.spotColor}"/>
        <!-- Kuhglocke am Hals -->
        <circle cx="54" cy="41" r="4.2" fill="#facc15" stroke="#b45309" stroke-width="1.4"/>
        <!-- Kopf (schaut nach rechts Richtung Ziel!) -->
        <g>
          <!-- Hörner -->
          <path d="M51 16 Q48 9 53 10" fill="none" stroke="${d.hornColor}" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M64 16 Q68 9 62 10" fill="none" stroke="${d.hornColor}" stroke-width="3.5" stroke-linecap="round"/>
          <!-- Kopfbasis -->
          <rect x="46" y="14" width="26" height="22" rx="9" fill="${d.bodyColor}" stroke="#1e293b" stroke-width="2"/>
          <!-- Augen -->
          <circle cx="56" cy="23" r="2.3" fill="#0f172a"/>
          <circle cx="66" cy="23" r="2.3" fill="#0f172a"/>
          <!-- Rosa Schnauze -->
          <ellipse cx="62" cy="32" rx="11" ry="6.5" fill="${d.snoutColor}" stroke="#1e293b" stroke-width="1.6"/>
          <circle cx="59" cy="31.5" r="1.4" fill="#1e293b"/>
          <circle cx="66" cy="31.5" r="1.4" fill="#1e293b"/>
          ${extraSvg}
        </g>
      </svg>
    `;
  }

  // Export für automatisierte Tests
  const logicExports = {
    ZIEL_SCHRITTE,
    SCHRITT_VOR,
    SCHRITT_ZURUECK,
    AUFGABEN_KATALOG,
    KUH_DESIGNS,
    BOT_STUFEN,
    createSeededRng,
    generiereAufgabeFuerIndex,
    berechneNeuePosition,
    formatiereSchritte,
    berechneRangliste,
    holeBotStufe,
    berechneBotAntwortZeitMs,
    entscheideBotAntwort,
    erzeugeBotSpieler,
    aktualisiereBotNamen,
    renderCowSvg
  };
  root.KuhSpielLogik = logicExports;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = logicExports;
  }

  // Falls wir in einer reinen Test-Umgebung ohne DOM laufen, hier beenden
  if (typeof document === "undefined" || !document.getElementById("screen-home")) {
    return;
  }

  // =========================================================================
  // 5. BROWSER-UI & MULTIPLAYER-CONTROLLER
  // =========================================================================
  let eigenerName = localStorage.getItem("kuhrennen_player_name") || "Kuh-Profi";
  let eigeneKuhId = localStorage.getItem("kuhrennen_cow_id") || KUH_DESIGNS[0].id;
  let eigeneSpielerId = "host"; // "host" oder "p2", "p3", "p4"

  let aktiverTypId = AUFGABEN_KATALOG[0].id;
  let rundenSeed = 12345;
  let spielPhase = "home"; // "home" | "lobby" | "join" | "countdown" | "racing" | "ended"

  // Spieler-Liste in der Lobby & im Rennen:
  // [{ id, name, cowId, isHost, isBot, botDifficulty, position, richtig, fehler }]
  let spielerListe = [];
  let naechsteBotNummer = 1;

  // Eigener Renn-Zustand
  let aufgabeIndex = 0;
  let aktuelleAufgabe = null;
  let eingabePuffer = "";
  let rennStartZeit = 0;
  let rennUhrInterval = null;
  let countdownTimeouts = [];
  let botTimeouts = [];
  let aktuellerInviteLink = "";
  let aktuellerOfferCode = "";

  // DOM-Referenzen
  const screens = {
    home: document.getElementById("screen-home"),
    lobby: document.getElementById("screen-lobby"),
    join: document.getElementById("screen-join"),
    game: document.getElementById("screen-game"),
    end: document.getElementById("screen-end")
  };

  const elInputName = document.getElementById("input-player-name");
  const elHomeCowPicker = document.getElementById("home-cow-picker");
  const elLobbyCowPicker = document.getElementById("lobby-cow-picker");
  const elBtnCreateLobby = document.getElementById("btn-create-lobby");
  const elBtnGoJoin = document.getElementById("btn-go-join");

  // Lobby DOM
  const elBtnLeaveLobby = document.getElementById("btn-leave-lobby");
  const elLobbyRoleBadge = document.getElementById("lobby-role-badge");
  const elLobbyPlayerCount = document.getElementById("lobby-player-count");
  const elBtnOpenInvite = document.getElementById("btn-open-invite");
  const elLobbyPlayersList = document.getElementById("lobby-players-list");
  const elLobbyTypenContainer = document.getElementById("lobby-typen-container");
  const elBtnStartRace = document.getElementById("btn-start-race");
  const elGuestWaitingMsg = document.getElementById("guest-waiting-msg");

  // Invite Modal (Host)
  const elModalInvite = document.getElementById("modal-invite");
  const elBtnCloseInvite = document.getElementById("btn-close-invite");
  const elBtnCopyInviteLink = document.getElementById("btn-copy-invite-link");
  const elBtnCopyInviteCode = document.getElementById("btn-copy-invite-code");
  const elOutputOfferCode = document.getElementById("output-offer-code");
  const elInviteCopyFeedback = document.getElementById("invite-copy-feedback");
  const elInputAnswerCode = document.getElementById("input-answer-code");
  const elBtnPasteAnswer = document.getElementById("btn-paste-answer");
  const elInviteErrorMsg = document.getElementById("invite-error-msg");
  const elBtnConnectGuest = document.getElementById("btn-connect-guest");
  const elHostInviteQr = document.getElementById("host-invite-qr");
  const elHostQrLoading = document.getElementById("host-qr-loading");
  const elBtnScanAnswerQr = document.getElementById("btn-scan-answer-qr");
  const elHostQrScannerBox = document.getElementById("host-qr-scanner-box");
  const elHostQrVideo = document.getElementById("host-qr-video");
  const elHostQrStatus = document.getElementById("host-qr-status");
  const elBtnStopHostScan = document.getElementById("btn-stop-host-scan");

  // Join Screen (Guest)
  const elBtnCancelJoin = document.getElementById("btn-cancel-join");
  const elGuestStep1 = document.getElementById("guest-step-1");
  const elGuestStep2 = document.getElementById("guest-step-2");
  const elInputOfferCode = document.getElementById("input-offer-code");
  const elBtnPasteOffer = document.getElementById("btn-paste-offer");
  const elJoinErrorMsg = document.getElementById("join-error-msg");
  const elBtnProcessOffer = document.getElementById("btn-process-offer");
  const elOutputAnswerCode = document.getElementById("output-answer-code");
  const elBtnCopyAnswer = document.getElementById("btn-copy-answer");
  const elCopyAnswerFeedback = document.getElementById("copy-answer-feedback");
  const elBtnScanOfferQr = document.getElementById("btn-scan-offer-qr");
  const elGuestQrScannerBox = document.getElementById("guest-qr-scanner-box");
  const elGuestQrVideo = document.getElementById("guest-qr-video");
  const elGuestQrStatus = document.getElementById("guest-qr-status");
  const elBtnStopGuestScan = document.getElementById("btn-stop-guest-scan");
  const elGuestAnswerQr = document.getElementById("guest-answer-qr");

  // Game Screen
  const elOwnProgressText = document.getElementById("own-progress-text");
  const elGameCategoryBadge = document.getElementById("game-category-badge");
  const elGameTimerText = document.getElementById("game-timer-text");
  const elBtnAbortRace = document.getElementById("btn-abort-race");
  const elRaceTracksContainer = document.getElementById("race-tracks-container");
  const elFeedbackEffekt = document.getElementById("feedback-effekt");
  const elAufgabeNummerBadge = document.getElementById("aufgabe-nummer-badge");
  const elAufgabeTerm = document.getElementById("aufgabe-term");
  const elAntwortDisplay = document.getElementById("antwort-display");
  const elCountdownOverlay = document.getElementById("countdown-overlay");
  const elCountdownZahl = document.getElementById("countdown-zahl");
  const elAmpelRot = document.getElementById("ampel-rot");
  const elAmpelGelb = document.getElementById("ampel-gelb");
  const elAmpelGruen = document.getElementById("ampel-gruen");

  // End Screen
  const elConfettiContainer = document.getElementById("confetti-container");
  const elWinnerCowAvatar = document.getElementById("winner-cow-avatar");
  const elWinnerTitle = document.getElementById("winner-title");
  const elWinnerSubtitle = document.getElementById("winner-subtitle");
  const elResultsTableContainer = document.getElementById("results-table-container");
  const elHostEndActions = document.getElementById("host-end-actions");
  const elGuestEndWaiting = document.getElementById("guest-end-waiting");
  const elBtnRematch = document.getElementById("btn-rematch");
  const elBtnBackLobby = document.getElementById("btn-back-lobby");

  // =========================================================================
  // 6. NETZWERK-MANAGER INITIALISIEREN
  // =========================================================================
  const netzwerk = new root.KuhNetzwerk.KuhNetzwerkManager({
    onPeerConnected(peerId) {
      // Host: Neuer Mitspieler ist verbunden!
      window.soundManager.playCowbellOnly();
      const defaultCow = KUH_DESIGNS[(spielerListe.length) % KUH_DESIGNS.length].id;
      const num = peerId.replace("p", "");
      if (!spielerListe.some((s) => s.id === peerId)) {
        // Falls alle 4 Plätze durch Computerkühe belegt sind, letzte Computerkuh für den echten Mitspieler freigeben
        if (spielerListe.length >= 4) {
          for (let idx = spielerListe.length - 1; idx >= 0; idx--) {
            if (spielerListe[idx].isBot) {
              spielerListe.splice(idx, 1);
              break;
            }
          }
        }
        spielerListe.push({
          id: peerId,
          name: `Spieler ${num}`,
          cowId: defaultCow,
          isHost: false,
          isBot: false,
          position: 0,
          richtig: 0,
          fehler: 0
        });
        aktualisiereBotNamen(spielerListe);
      }
      elModalInvite.hidden = true;
      sendeLobbyUpdateAnAlle();
      aktualisiereLobbyAnsicht();
    },

    onPeerDisconnected(peerId) {
      spielerListe = spielerListe.filter((s) => s.id !== peerId);
      if (spielPhase === "lobby") {
        sendeLobbyUpdateAnAlle();
        aktualisiereLobbyAnsicht();
      } else if (spielPhase === "racing" || spielPhase === "countdown") {
        sendeRennUpdateAnAlle(null);
        aktualisiereRennbahnSpuren();
      }
    },

    onMessageFromPeer(peerId, msg) {
      // Host empfängt Nachricht von Mitspieler
      if (!msg || !msg.type) return;

      if (msg.type === "GUEST_PROFILE") {
        const sp = spielerListe.find((s) => s.id === peerId);
        if (sp) {
          sp.name = (msg.name || sp.name).slice(0, 16);
          sp.cowId = msg.cowId || sp.cowId;
          sendeLobbyUpdateAnAlle();
          aktualisiereLobbyAnsicht();
        }
      } else if (msg.type === "GUEST_STEP") {
        if (spielPhase !== "racing") return;
        const sp = spielerListe.find((s) => s.id === peerId);
        if (!sp) return;

        sp.position = msg.position;
        sp.richtig = msg.richtig;
        sp.fehler = msg.fehler;

        const eventInfo = {
          playerId: peerId,
          delta: msg.delta
        };

        zeigeSpurEvent(peerId, msg.delta);
        aktualisiereRennbahnPositionen();
        sendeRennUpdateAnAlle(eventInfo);

        // Prüfen, ob dieser Mitspieler das Ziel (20 Schritte) erreicht hat!
        if (sp.position >= ZIEL_SCHRITTE) {
          beendeRennenAlsHost(peerId);
        }
      }
    },

    onConnectedToHost() {
      // Mitspieler: Verbindung zum Spielleiter steht!
      window.soundManager.playCowbellOnly();
      netzwerk.sendToHost({
        type: "GUEST_PROFILE",
        name: holeEigenenNamen(),
        cowId: eigeneKuhId
      });
      zeigeScreen("lobby");
      aktualisiereLobbyAnsicht();
    },

    onMessageFromHost(msg) {
      if (!msg || !msg.type) return;

      if (msg.type === "LOBBY_STATE") {
        eigeneSpielerId = msg.yourId || eigeneSpielerId;
        spielerListe = msg.players || [];
        aktiverTypId = msg.categoryId || aktiverTypId;
        if (spielPhase !== "lobby") {
          stoppeLaufendeTimer();
          zeigeScreen("lobby");
        }
        aktualisiereLobbyAnsicht();
      } else if (msg.type === "START_RACE") {
        eigeneSpielerId = msg.yourId || eigeneSpielerId;
        spielerListe = msg.players || [];
        aktiverTypId = msg.categoryId || aktiverTypId;
        rundenSeed = msg.seed;
        starteRennAblaufMitCountdown();
      } else if (msg.type === "RACE_STATE") {
        spielerListe = msg.players || [];
        if (msg.event && msg.event.playerId !== eigeneSpielerId) {
          zeigeSpurEvent(msg.event.playerId, msg.event.delta);
        }
        aktualisiereRennbahnPositionen();
      } else if (msg.type === "RACE_FINISHED") {
        spielerListe = msg.players || [];
        zeigeSiegerehrung(msg.winnerId, msg.durationMs);
      }
    },

    onDisconnectedFromHost() {
      stoppeLaufendeTimer();
      alert("Die Verbindung zum Spielleiter wurde beendet.");
      zeigeScreen("home");
    }
  });

  // =========================================================================
  // 7. BILDSCHIRM-WECHSEL & SOUND-BUTTONS
  // =========================================================================
  function zeigeScreen(name) {
    spielPhase = name;
    Object.keys(screens).forEach((k) => {
      screens[k].hidden = k !== name;
    });
  }

  function aktualisiereAlleSoundButtons() {
    const aktiv = window.soundManager.isEnabled();
    const symbol = aktiv ? "🔊" : "🔇";
    const label = aktiv ? "Ton ausschalten" : "Ton einschalten";

    const mainToggle = document.getElementById("sound-toggle");
    if (mainToggle) {
      mainToggle.textContent = symbol;
      mainToggle.setAttribute("aria-label", label);
    }
    document.querySelectorAll(".header-sound").forEach((btn) => {
      btn.textContent = symbol;
      btn.setAttribute("aria-label", label);
    });
  }

  document.getElementById("sound-toggle").addEventListener("click", () => {
    window.soundManager.toggle();
    aktualisiereAlleSoundButtons();
  });

  document.querySelectorAll(".header-sound").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.soundManager.toggle();
      aktualisiereAlleSoundButtons();
    });
  });

  // =========================================================================
  // 8. SPIELER-PROFIL (NAME & KUH-DESIGN)
  // =========================================================================
  elInputName.value = eigenerName;
  elInputName.addEventListener("input", () => {
    eigenerName = elInputName.value.trim() || "Kuh-Profi";
    localStorage.setItem("kuhrennen_player_name", eigenerName);
  });

  function holeEigenenNamen() {
    const val = elInputName.value.trim();
    return val ? val.slice(0, 16) : "Kuh-Profi";
  }

  function waehleEigeneKuh(cowId, mitSound = true) {
    eigeneKuhId = cowId;
    localStorage.setItem("kuhrennen_cow_id", cowId);
    const design = KUH_DESIGNS.find((k) => k.id === cowId) || KUH_DESIGNS[0];
    if (mitSound) {
      window.soundManager.playMoo(design.pitch);
    }
    rendereKuhAuswahl();

    // Falls wir schon in der Lobby sind, sofort aktualisieren!
    if (spielPhase === "lobby") {
      if (netzwerk.role === "host") {
        const hostSp = spielerListe.find((s) => s.id === "host");
        if (hostSp) hostSp.cowId = cowId;
        sendeLobbyUpdateAnAlle();
        aktualisiereLobbyAnsicht();
      } else if (netzwerk.role === "guest") {
        netzwerk.sendToHost({
          type: "GUEST_PROFILE",
          name: holeEigenenNamen(),
          cowId
        });
      }
    }
  }

  function rendereKuhAuswahl() {
    elHomeCowPicker.innerHTML = "";
    KUH_DESIGNS.forEach((kuh) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `kuh-wahl-btn ${kuh.id === eigeneKuhId ? "aktiv" : ""}`;
      btn.setAttribute("aria-label", `Kuh ${kuh.name}`);
      btn.innerHTML = `
        <span class="kuh-wahl-icon">${renderCowSvg(kuh.id)}</span>
        <span class="kuh-wahl-name">${kuh.name}</span>
      `;
      btn.addEventListener("click", () => waehleEigeneKuh(kuh.id, true));
      elHomeCowPicker.appendChild(btn);
    });

    elLobbyCowPicker.innerHTML = "";
    KUH_DESIGNS.forEach((kuh) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `kuh-mini-btn ${kuh.id === eigeneKuhId ? "aktiv" : ""}`;
      btn.title = kuh.name;
      btn.innerHTML = renderCowSvg(kuh.id);
      btn.addEventListener("click", () => waehleEigeneKuh(kuh.id, true));
      elLobbyCowPicker.appendChild(btn);
    });
  }

  // =========================================================================
  // 9. LOBBY-VERWALTUNG (SPIELLEITER & MITSPIELER)
  // =========================================================================
  function oeffneHostLobby() {
    window.soundManager.init();
    window.soundManager.playClick();

    netzwerk.initHost();
    eigeneSpielerId = "host";
    spielerListe = [
      {
        id: "host",
        name: holeEigenenNamen(),
        cowId: eigeneKuhId,
        isHost: true,
        position: 0,
        richtig: 0,
        fehler: 0
      }
    ];
    zeigeScreen("lobby");
    aktualisiereLobbyAnsicht();
  }

  function sendeLobbyUpdateAnAlle() {
    if (netzwerk.role !== "host") return;
    spielerListe.forEach((sp) => {
      if (!sp.isHost && !sp.isBot) {
        netzwerk.sendToPeer(sp.id, {
          type: "LOBBY_STATE",
          yourId: sp.id,
          players: spielerListe,
          categoryId: aktiverTypId
        });
      }
    });
  }

  function waehleNaechsteStandardBotStufe() {
    const vorhandeneStufen = new Set(
      spielerListe.filter((s) => s.isBot).map((s) => s.botDifficulty)
    );
    const reihenfolge = ["baby", "leicht", "mittel", "schwer", "terminator"];
    for (let i = 0; i < reihenfolge.length; i++) {
      if (!vorhandeneStufen.has(reihenfolge[i])) {
        return reihenfolge[i];
      }
    }
    return "leicht";
  }

  function fuegeBotHinzu(wunschStufeId) {
    if (netzwerk.role !== "host" || spielerListe.length >= 4) return;
    const stufeId = wunschStufeId || waehleNaechsteStandardBotStufe();
    const botId = `bot_${naechsteBotNummer++}`;
    const neuerBot = erzeugeBotSpieler(botId, stufeId);
    spielerListe.push(neuerBot);
    aktualisiereBotNamen(spielerListe);

    window.soundManager.playRobotMoo(neuerBot.botDifficulty);
    sendeLobbyUpdateAnAlle();
    aktualisiereLobbyAnsicht();
  }

  function aendereBotStufe(botId, neueStufeId) {
    if (netzwerk.role !== "host") return;
    const sp = spielerListe.find((s) => s.id === botId && s.isBot);
    if (!sp) return;

    const stufe = holeBotStufe(neueStufeId);
    sp.botDifficulty = stufe.id;
    sp.cowId = stufe.cowId;
    aktualisiereBotNamen(spielerListe);

    window.soundManager.playRobotMoo(stufe.id);
    sendeLobbyUpdateAnAlle();
    aktualisiereLobbyAnsicht();
  }

  function entferneBot(botId) {
    if (netzwerk.role !== "host") return;
    window.soundManager.playClick();
    spielerListe = spielerListe.filter((s) => s.id !== botId);
    aktualisiereBotNamen(spielerListe);
    sendeLobbyUpdateAnAlle();
    aktualisiereLobbyAnsicht();
  }

  function aktualisiereLobbyAnsicht() {
    const istHost = netzwerk.role === "host";
    elLobbyRoleBadge.textContent = istHost ? "👑 Spielleiter" : "🐄 Mitspieler";
    elLobbyPlayerCount.textContent = String(spielerListe.length);

    // Einladen-Button nur für Host und solange < 4 echte Spieler
    const echteSpielerAnzahl = spielerListe.filter((s) => !s.isBot).length;
    elBtnOpenInvite.hidden = !istHost;
    elBtnOpenInvite.disabled = echteSpielerAnzahl >= 4;

    // 4 Startboxen rendern
    elLobbyPlayersList.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      const sp = spielerListe[i];
      const slot = document.createElement("div");

      if (sp && sp.isBot) {
        slot.className = `stall-slot belegt bot-slot bot-slot-${sp.botDifficulty}`;
        if (istHost) {
          const stufenButtonsHtml = BOT_STUFEN.map((st) => {
            const istAktiv = st.id === sp.botDifficulty;
            return `<button type="button" class="bot-stufe-btn stufe-${st.id} ${istAktiv ? "aktiv" : ""}" data-bot-id="${sp.id}" data-stufe="${st.id}" aria-pressed="${istAktiv}">${st.label}</button>`;
          }).join("");

          slot.innerHTML = `
            <div class="bot-slot-kopf">
              <div class="stall-links">
                <div class="stall-kuh-icon">${renderCowSvg(sp.cowId)}</div>
                <span class="stall-name">${escapeHtml(sp.name)}</span>
              </div>
              <button type="button" class="btn-bot-entfernen" title="Computerkuh entfernen" aria-label="${escapeHtml(sp.name)} entfernen">✕</button>
            </div>
            <div class="bot-stufen-leiste" role="group" aria-label="Schwierigkeit für ${escapeHtml(sp.name)}">
              ${stufenButtonsHtml}
            </div>
          `;

          const removeBtn = slot.querySelector(".btn-bot-entfernen");
          if (removeBtn) {
            removeBtn.addEventListener("click", () => entferneBot(sp.id));
          }
          slot.querySelectorAll(".bot-stufe-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
              const zielStufe = btn.getAttribute("data-stufe");
              aendereBotStufe(sp.id, zielStufe);
            });
          });
        } else {
          slot.innerHTML = `
            <div class="stall-links">
              <div class="stall-kuh-icon">${renderCowSvg(sp.cowId)}</div>
              <span class="stall-name">${escapeHtml(sp.name)}</span>
            </div>
            <span class="stall-status bot-status-badge">🤖 Roboter</span>
          `;
        }
      } else if (sp) {
        const istIch = sp.id === eigeneSpielerId;
        slot.className = `stall-slot belegt ${istIch ? "eigener" : ""}`;
        slot.innerHTML = `
          <div class="stall-links">
            <div class="stall-kuh-icon">${renderCowSvg(sp.cowId)}</div>
            <span class="stall-name">${escapeHtml(sp.name)}${istIch ? " (Du)" : ""}</span>
          </div>
          <span class="stall-status">${sp.isHost ? "👑 Spielleiter" : "✅ Bereit"}</span>
        `;
      } else {
        slot.className = `stall-slot leer ${istHost ? "leer-klickbar" : ""}`;
        if (istHost) {
          slot.innerHTML = `
            <div class="stall-links">
              <span class="stall-name">Startbox ${i + 1}: Frei</span>
            </div>
            <button type="button" class="btn-bot-hinzufuegen">🤖 + Computerkuh</button>
          `;
          const addBtn = slot.querySelector(".btn-bot-hinzufuegen");
          if (addBtn) {
            addBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              fuegeBotHinzu();
            });
          }
          slot.addEventListener("click", () => fuegeBotHinzu());
        } else {
          slot.innerHTML = `
            <div class="stall-links">
              <span class="stall-name">Startbox ${i + 1}: Frei</span>
            </div>
          `;
        }
      }
      elLobbyPlayersList.appendChild(slot);
    }

    // Aufgabentypen in der Lobby rendern
    elLobbyTypenContainer.innerHTML = "";
    AUFGABEN_KATALOG.forEach((typ) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `typ-karte ${typ.id === aktiverTypId ? "aktiv" : ""}`;
      btn.disabled = !istHost;
      btn.innerHTML = `
        <span class="typ-badge">${typ.badge}</span>
        <span class="typ-titel">${typ.titel}</span>
        <span class="typ-beschreibung">${typ.beschreibung}</span>
      `;
      if (istHost) {
        btn.addEventListener("click", () => {
          window.soundManager.playClick();
          aktiverTypId = typ.id;
          sendeLobbyUpdateAnAlle();
          aktualisiereLobbyAnsicht();
        });
      }
      elLobbyTypenContainer.appendChild(btn);
    });

    // Start-Button vs. Warte-Hinweis
    if (istHost) {
      elBtnStartRace.hidden = false;
      elGuestWaitingMsg.hidden = true;
      elBtnStartRace.textContent =
        spielerListe.length === 1
          ? "🚦 Übungsrennen alleine starten!"
          : `🚦 Rennen starten! (${spielerListe.length} Kühe)`;
    } else {
      elBtnStartRace.hidden = true;
      elGuestWaitingMsg.hidden = false;
    }

    rendereKuhAuswahl();
  }

  // =========================================================================
  // 10. WEBRTC EINLADUNGS-DIALOG (HOST) & BEITRITT (GUEST) + QR-CODES
  // =========================================================================
  const qrScanner = root.KuhQR ? new root.KuhQR.QRScanner() : null;

  function stoppeAlleQRScanner() {
    if (qrScanner) qrScanner.stop();
    if (elHostQrScannerBox) elHostQrScannerBox.hidden = true;
    if (elBtnScanAnswerQr) elBtnScanAnswerQr.hidden = false;
    if (elGuestQrScannerBox) elGuestQrScannerBox.hidden = true;
    if (elBtnScanOfferQr) elBtnScanOfferQr.hidden = false;
  }

  function zeichneQRCode(canvasEl, text) {
    if (!canvasEl || !root.KuhQR) return;
    try {
      root.KuhQR.renderToCanvas(canvasEl, text, { sizePx: 230, quietZone: 4 });
    } catch (_err) {
      // Falls Text zu lang für QR wäre, bleibt Fallback-Copy-Paste nutzbar
    }
  }

  async function verbindeMitAntwortCode(code) {
    elInviteErrorMsg.hidden = true;
    elBtnConnectGuest.disabled = true;
    elBtnConnectGuest.textContent = "⏳ Verbinde…";

    try {
      await netzwerk.acceptGuestAnswer(code);
    } catch (err) {
      elInviteErrorMsg.textContent = err.message || "Verbindung fehlgeschlagen.";
      elInviteErrorMsg.hidden = false;
    } finally {
      elBtnConnectGuest.disabled = false;
      elBtnConnectGuest.textContent = "✅ Mitspieler verbinden";
    }
  }

  async function oeffneEinladungsModal() {
    window.soundManager.playClick();
    stoppeAlleQRScanner();
    elInviteErrorMsg.hidden = true;
    elInviteCopyFeedback.hidden = true;
    elInputAnswerCode.value = "";
    elOutputOfferCode.value = "Erzeuge Einladungs-Code…";
    if (elHostInviteQr) elHostInviteQr.hidden = true;
    if (elHostQrLoading) elHostQrLoading.hidden = false;
    elModalInvite.hidden = false;

    try {
      const { offerCode, inviteLink } = await netzwerk.createHostInvite();
      aktuellerOfferCode = offerCode;
      aktuellerInviteLink = inviteLink;
      elOutputOfferCode.value = offerCode;
      if (elHostInviteQr) {
        zeichneQRCode(elHostInviteQr, inviteLink);
        elHostInviteQr.hidden = false;
      }
      if (elHostQrLoading) elHostQrLoading.hidden = true;
    } catch (err) {
      if (elHostQrLoading) elHostQrLoading.hidden = true;
      elInviteErrorMsg.textContent = err.message || "Fehler beim Erstellen der Einladung.";
      elInviteErrorMsg.hidden = false;
    }
  }

  async function kopiereInZwischenablage(text, feedbackEl, erfolgsText) {
    window.soundManager.playClick();
    try {
      await navigator.clipboard.writeText(text);
      feedbackEl.textContent = erfolgsText;
      feedbackEl.hidden = false;
    } catch (_e) {
      feedbackEl.textContent = "Bitte markiere den Code im Feld und kopiere ihn manuell.";
      feedbackEl.hidden = false;
    }
  }

  elBtnOpenInvite.addEventListener("click", oeffneEinladungsModal);
  elBtnCloseInvite.addEventListener("click", () => {
    window.soundManager.playClick();
    stoppeAlleQRScanner();
    elModalInvite.hidden = true;
  });

  elBtnScanAnswerQr.addEventListener("click", () => {
    if (!qrScanner) return;
    window.soundManager.playClick();
    elInviteErrorMsg.hidden = true;
    elBtnScanAnswerQr.hidden = true;
    elHostQrScannerBox.hidden = false;
    if (elHostQrStatus) elHostQrStatus.textContent = "⏳ Starte Kamera…";

    qrScanner.start(elHostQrVideo, {
      validate: (raw) => Boolean(root.KuhNetzwerk.extractCodeFromInput(raw)),
      onReady: () => {
        if (elHostQrStatus) elHostQrStatus.textContent = "📷 Kamera aktiv – halte den QR-Code in den Rahmen";
      },
      onDetect: (decodedText) => {
        stoppeAlleQRScanner();
        window.soundManager.playStepForward();
        elInputAnswerCode.value = decodedText.trim();
        verbindeMitAntwortCode(decodedText.trim());
      },
      onError: (err) => {
        stoppeAlleQRScanner();
        elInviteErrorMsg.textContent = err.message;
        elInviteErrorMsg.hidden = false;
      }
    });
  });

  elBtnStopHostScan.addEventListener("click", () => {
    window.soundManager.playClick();
    stoppeAlleQRScanner();
  });

  elBtnCopyInviteLink.addEventListener("click", () => {
    if (!aktuellerInviteLink) return;
    kopiereInZwischenablage(
      aktuellerInviteLink,
      elInviteCopyFeedback,
      "✅ Einladungs-Link kopiert! Schicke ihn jetzt deinem Mitspieler."
    );
  });

  elBtnCopyInviteCode.addEventListener("click", () => {
    if (!aktuellerOfferCode) return;
    kopiereInZwischenablage(
      aktuellerOfferCode,
      elInviteCopyFeedback,
      "✅ Einladungs-Code kopiert! Schicke ihn jetzt deinem Mitspieler."
    );
  });

  elBtnPasteAnswer.addEventListener("click", async () => {
    window.soundManager.playClick();
    try {
      const text = await navigator.clipboard.readText();
      if (text) elInputAnswerCode.value = text.trim();
    } catch (_e) {}
  });

  elBtnConnectGuest.addEventListener("click", () => {
    window.soundManager.playClick();
    const code = elInputAnswerCode.value.trim();
    if (!code) {
      elInviteErrorMsg.textContent = "Bitte füge zuerst den Antwort-Code vom Mitspieler ein.";
      elInviteErrorMsg.hidden = false;
      return;
    }
    verbindeMitAntwortCode(code);
  });

  // GUEST: Beitritts-Ablauf
  function oeffneJoinScreen(vorausgefuellterOfferCode = "") {
    window.soundManager.init();
    window.soundManager.playClick();
    stoppeAlleQRScanner();
    elJoinErrorMsg.hidden = true;
    elCopyAnswerFeedback.hidden = true;
    elGuestStep1.hidden = false;
    elGuestStep2.hidden = true;
    elInputOfferCode.value = vorausgefuellterOfferCode;
    zeigeScreen("join");

    if (vorausgefuellterOfferCode) {
      verarbeiteHostOffer(vorausgefuellterOfferCode);
    }
  }

  async function verarbeiteHostOffer(offerInput) {
    elJoinErrorMsg.hidden = true;
    elBtnProcessOffer.disabled = true;
    elBtnProcessOffer.textContent = "⏳ Erzeuge Antwort-Code…";

    try {
      const { answerCode } = await netzwerk.joinWithOffer(offerInput);
      elOutputAnswerCode.value = answerCode;
      zeichneQRCode(elGuestAnswerQr, answerCode);
      elGuestStep1.hidden = true;
      elGuestStep2.hidden = false;
    } catch (err) {
      elJoinErrorMsg.textContent =
        err.message || "Der Einladungs-Code konnte nicht gelesen werden.";
      elJoinErrorMsg.hidden = false;
    } finally {
      elBtnProcessOffer.disabled = false;
      elBtnProcessOffer.textContent = "Weiter → Antwort-Code erzeugen";
    }
  }

  elBtnScanOfferQr.addEventListener("click", () => {
    if (!qrScanner) return;
    window.soundManager.playClick();
    elJoinErrorMsg.hidden = true;
    elBtnScanOfferQr.hidden = true;
    elGuestQrScannerBox.hidden = false;
    if (elGuestQrStatus) elGuestQrStatus.textContent = "⏳ Starte Kamera…";

    qrScanner.start(elGuestQrVideo, {
      validate: (raw) => Boolean(root.KuhNetzwerk.extractCodeFromInput(raw)),
      onReady: () => {
        if (elGuestQrStatus) elGuestQrStatus.textContent = "📷 Kamera aktiv – halte den QR-Code in den Rahmen";
      },
      onDetect: (decodedText) => {
        stoppeAlleQRScanner();
        window.soundManager.playStepForward();
        elInputOfferCode.value = decodedText.trim();
        verarbeiteHostOffer(decodedText.trim());
      },
      onError: (err) => {
        stoppeAlleQRScanner();
        elJoinErrorMsg.textContent = err.message;
        elJoinErrorMsg.hidden = false;
      }
    });
  });

  elBtnStopGuestScan.addEventListener("click", () => {
    window.soundManager.playClick();
    stoppeAlleQRScanner();
  });

  elBtnGoJoin.addEventListener("click", () => oeffneJoinScreen(""));
  elBtnCancelJoin.addEventListener("click", () => {
    window.soundManager.playClick();
    stoppeAlleQRScanner();
    netzwerk.reset();
    zeigeScreen("home");
  });

  elBtnPasteOffer.addEventListener("click", async () => {
    window.soundManager.playClick();
    try {
      const text = await navigator.clipboard.readText();
      if (text) elInputOfferCode.value = text.trim();
    } catch (_e) {}
  });

  elBtnProcessOffer.addEventListener("click", () => {
    window.soundManager.playClick();
    const val = elInputOfferCode.value.trim();
    if (!val) {
      elJoinErrorMsg.textContent = "Bitte füge den Einladungs-Link oder Code vom Spielleiter ein.";
      elJoinErrorMsg.hidden = false;
      return;
    }
    verarbeiteHostOffer(val);
  });

  elBtnCopyAnswer.addEventListener("click", () => {
    kopiereInZwischenablage(
      elOutputAnswerCode.value,
      elCopyAnswerFeedback,
      "✅ Antwort-Code kopiert! Schicke ihn jetzt dem Spielleiter."
    );
  });

  // =========================================================================
  // 11. RENNEN STARTEN & 3-2-1-LOS! COUNTDOWN
  // =========================================================================
  function starteRennenAlsHost() {
    if (netzwerk.role !== "host") return;
    window.soundManager.init();
    window.soundManager.playClick();

    // Eigenen Namen aktualisieren
    const hostSp = spielerListe.find((s) => s.id === "host");
    if (hostSp) {
      hostSp.name = holeEigenenNamen();
      hostSp.cowId = eigeneKuhId;
    }

    // Alle Spieler auf Startposition 0 zurücksetzen
    spielerListe.forEach((sp) => {
      sp.position = 0;
      sp.richtig = 0;
      sp.fehler = 0;
    });

    // Zufälligen Seed für diese Runde bestimmen (alle rechnen dieselben Aufgaben!)
    rundenSeed = Math.floor(Math.random() * 2147483647) + 1;

    // An alle echten Mitspieler senden
    spielerListe.forEach((sp) => {
      if (!sp.isHost && !sp.isBot) {
        netzwerk.sendToPeer(sp.id, {
          type: "START_RACE",
          yourId: sp.id,
          players: spielerListe,
          categoryId: aktiverTypId,
          seed: rundenSeed
        });
      }
    });

    starteRennAblaufMitCountdown();
  }

  function stoppeLaufendeTimer() {
    clearInterval(rennUhrInterval);
    rennUhrInterval = null;
    countdownTimeouts.forEach((t) => clearTimeout(t));
    countdownTimeouts = [];
    botTimeouts.forEach((t) => clearTimeout(t));
    botTimeouts = [];
  }

  function starteBotSimulation() {
    if (netzwerk.role !== "host") return;
    spielerListe.forEach((sp) => {
      if (sp.isBot) {
        planeNaechstenBotSchritt(sp.id);
      }
    });
  }

  function planeNaechstenBotSchritt(botId) {
    if (spielPhase !== "racing" || netzwerk.role !== "host") return;
    const sp = spielerListe.find((s) => s.id === botId && s.isBot);
    if (!sp || sp.position >= ZIEL_SCHRITTE) return;

    const warteZeitMs = berechneBotAntwortZeitMs(sp.botDifficulty, aktiverTypId);
    const timeoutId = setTimeout(() => {
      if (spielPhase !== "racing" || netzwerk.role !== "host") return;
      const aktuelleSp = spielerListe.find((s) => s.id === botId && s.isBot);
      if (!aktuelleSp || aktuelleSp.position >= ZIEL_SCHRITTE) return;

      const istRichtig = entscheideBotAntwort(aktuelleSp.botDifficulty);
      aktuelleSp.position = berechneNeuePosition(aktuelleSp.position, istRichtig);
      const delta = istRichtig ? SCHRITT_VOR : -SCHRITT_ZURUECK;

      if (istRichtig) {
        aktuelleSp.richtig += 1;
      } else {
        aktuelleSp.fehler += 1;
      }

      zeigeSpurEvent(aktuelleSp.id, delta);
      aktualisiereRennbahnPositionen();
      sendeRennUpdateAnAlle({ playerId: aktuelleSp.id, delta });

      if (aktuelleSp.position >= ZIEL_SCHRITTE) {
        beendeRennenAlsHost(aktuelleSp.id);
      } else {
        planeNaechstenBotSchritt(aktuelleSp.id);
      }
    }, warteZeitMs);

    botTimeouts.push(timeoutId);
  }

  function starteRennAblaufMitCountdown() {
    stoppeLaufendeTimer();
    aufgabeIndex = 0;
    eingabePuffer = "";

    const typ = AUFGABEN_KATALOG.find((t) => t.id === aktiverTypId) || AUFGABEN_KATALOG[0];
    elGameCategoryBadge.textContent = typ.badge;
    elGameTimerText.textContent = "0:00";
    elOwnProgressText.textContent = `0 / ${ZIEL_SCHRITTE}`;

    zeigeScreen("game");
    spielPhase = "countdown";

    aktualisiereRennbahnSpuren();
    ladeAktuelleAufgabe();

    // Countdown-Overlay zeigen (3 - 2 - 1 - LOS!)
    elCountdownOverlay.hidden = false;
    setzeAmpel("rot", "3");
    window.soundManager.playCountdownTick(false);

    countdownTimeouts.push(
      setTimeout(() => {
        setzeAmpel("gelb", "2");
        window.soundManager.playCountdownTick(false);
      }, 850)
    );

    countdownTimeouts.push(
      setTimeout(() => {
        setzeAmpel("gelb", "1");
        window.soundManager.playCountdownTick(false);
      }, 1700)
    );

    countdownTimeouts.push(
      setTimeout(() => {
        setzeAmpel("gruen", "LOS! 🐄");
        window.soundManager.playCountdownTick(true);
      }, 2550)
    );

    countdownTimeouts.push(
      setTimeout(() => {
        elCountdownOverlay.hidden = true;
        spielPhase = "racing";
        rennStartZeit = Date.now();
        rennUhrInterval = setInterval(aktualisiereRennUhr, 200);
        starteBotSimulation();
      }, 3100)
    );
  }

  function setzeAmpel(phase, text) {
    elAmpelRot.className = `ampel-kreis ${phase === "rot" ? "rot-aktiv" : ""}`;
    elAmpelGelb.className = `ampel-kreis ${phase === "gelb" ? "gelb-aktiv" : ""}`;
    elAmpelGruen.className = `ampel-kreis ${phase === "gruen" ? "gruen-aktiv" : ""}`;
    elCountdownZahl.textContent = text;
  }

  function aktualisiereRennUhr() {
    if (spielPhase !== "racing") return;
    const sek = Math.floor((Date.now() - rennStartZeit) / 1000);
    const min = Math.floor(sek / 60);
    const restSek = sek % 60;
    elGameTimerText.textContent = `${min}:${restSek < 10 ? "0" : ""}${restSek}`;
  }

  // =========================================================================
  // 12. RENNSTEIG / SPUREN RENDERN & LIVE-ANIMATIONEN
  // =========================================================================
  function aktualisiereRennbahnSpuren() {
    elRaceTracksContainer.innerHTML = "";
    spielerListe.forEach((sp) => {
      const istIch = sp.id === eigeneSpielerId;
      const spur = document.createElement("div");
      spur.className = `rennbahn-spur ${istIch ? "eigene-spur" : ""}`;
      spur.setAttribute("data-player-id", sp.id);

      const prozent = Math.max(0, Math.min(100, (sp.position / ZIEL_SCHRITTE) * 100));

      spur.innerHTML = `
        <div class="spur-info">
          <span class="spur-spieler-name">${escapeHtml(sp.name)}${istIch ? " ★" : ""}</span>
          <span class="spur-schritte-badge" id="badge-pos-${sp.id}">${formatiereSchritte(sp.position)}/${ZIEL_SCHRITTE}</span>
        </div>
        <div class="spur-laufbereich">
          <div class="renn-kuh-wrapper" id="cow-wrap-${sp.id}" style="left: ${prozent}%">
            ${renderCowSvg(sp.cowId)}
          </div>
        </div>
        <div class="spur-ziellinie" aria-hidden="true"></div>
      `;
      elRaceTracksContainer.appendChild(spur);
    });
  }

  function aktualisiereRennbahnPositionen() {
    spielerListe.forEach((sp) => {
      const prozent = Math.max(0, Math.min(100, (sp.position / ZIEL_SCHRITTE) * 100));
      const wrap = document.getElementById(`cow-wrap-${sp.id}`);
      const badge = document.getElementById(`badge-pos-${sp.id}`);

      if (wrap) {
        wrap.style.left = `${prozent}%`;
      }
      if (badge) {
        badge.textContent = `${formatiereSchritte(sp.position)}/${ZIEL_SCHRITTE}`;
      }
      if (sp.id === eigeneSpielerId) {
        elOwnProgressText.textContent = `${formatiereSchritte(sp.position)} / ${ZIEL_SCHRITTE}`;
      }
    });
  }

  function zeigeSpurEvent(playerId, delta) {
    const wrap = document.getElementById(`cow-wrap-${playerId}`);
    if (!wrap) return;

    const istPlus = delta > 0;
    const animClass = istPlus ? "huepf-vor" : "stolper-zurueck";
    wrap.classList.remove("huepf-vor", "stolper-zurueck");
    void wrap.offsetWidth;
    wrap.classList.add(animClass);

    const pop = document.createElement("span");
    pop.className = `spur-event-pop ${istPlus ? "plus" : "minus"}`;
    pop.textContent = istPlus ? "+1 💨" : "−0,25 💫";
    wrap.appendChild(pop);

    setTimeout(() => {
      pop.remove();
    }, 850);
  }

  // =========================================================================
  // 13. AUFGABEN-STEUERUNG & ANTWORT PRÜFEN (+1 / -0,25)
  // =========================================================================
  function ladeAktuelleAufgabe() {
    aktuelleAufgabe = generiereAufgabeFuerIndex(aktiverTypId, rundenSeed, aufgabeIndex);
    elAufgabeNummerBadge.textContent = `Aufgabe #${aufgabeIndex + 1}`;
    elAufgabeTerm.textContent = aktuelleAufgabe.term;
    eingabePuffer = "";
    aktualisiereEingabeDisplay();
  }

  function aktualisiereEingabeDisplay() {
    if (eingabePuffer === "") {
      elAntwortDisplay.textContent = "?";
      elAntwortDisplay.classList.add("platzhalter");
    } else {
      elAntwortDisplay.textContent = eingabePuffer;
      elAntwortDisplay.classList.remove("platzhalter");
    }
  }

  function zeigeCockpitPartikel(istRichtig) {
    const partikel = document.createElement("div");
    partikel.className = `kaching-partikel ${istRichtig ? "plus" : "minus"}`;
    partikel.textContent = istRichtig ? "+1 Schritt 🐄💨" : "−0,25 Schritte 💫";
    elFeedbackEffekt.appendChild(partikel);
    setTimeout(() => partikel.remove(), 650);

    if (istRichtig) {
      elAufgabeTerm.classList.remove("erfolg-puls");
      void elAufgabeTerm.offsetWidth;
      elAufgabeTerm.classList.add("erfolg-puls");
    } else {
      elAntwortDisplay.classList.remove("fehler-shake");
      void elAntwortDisplay.offsetWidth;
      elAntwortDisplay.classList.add("fehler-shake");
    }
  }

  function pruefeAntwort() {
    if (spielPhase !== "racing" || !aktuelleAufgabe) return;
    if (eingabePuffer === "") return;

    const eingabeZahl = parseInt(eingabePuffer, 10);
    const eigenerSp = spielerListe.find((s) => s.id === eigeneSpielerId);
    if (!eigenerSp) return;

    const istRichtig = eingabeZahl === aktuelleAufgabe.loesung;
    const altePos = eigenerSp.position;
    eigenerSp.position = berechneNeuePosition(altePos, istRichtig);
    const delta = istRichtig ? SCHRITT_VOR : -SCHRITT_ZURUECK;

    if (istRichtig) {
      eigenerSp.richtig += 1;
      aufgabeIndex += 1;
      window.soundManager.playStepForward();
      zeigeCockpitPartikel(true);
      zeigeSpurEvent(eigeneSpielerId, delta);
      aktualisiereRennbahnPositionen();

      if (eigenerSp.position < ZIEL_SCHRITTE) {
        ladeAktuelleAufgabe();
      }
    } else {
      // Falsch: 0,25 Schritte zurück und dieselbe Aufgabe bleibt stehen!
      eigenerSp.fehler += 1;
      window.soundManager.playStumble();
      zeigeCockpitPartikel(false);
      zeigeSpurEvent(eigeneSpielerId, delta);
      aktualisiereRennbahnPositionen();

      setTimeout(() => {
        eingabePuffer = "";
        aktualisiereEingabeDisplay();
      }, 240);
    }

    // Netzwerk-Synchronisation
    if (netzwerk.role === "host") {
      sendeRennUpdateAnAlle({ playerId: eigeneSpielerId, delta });
      if (eigenerSp.position >= ZIEL_SCHRITTE) {
        beendeRennenAlsHost(eigeneSpielerId);
      }
    } else if (netzwerk.role === "guest") {
      netzwerk.sendToHost({
        type: "GUEST_STEP",
        position: eigenerSp.position,
        richtig: eigenerSp.richtig,
        fehler: eigenerSp.fehler,
        delta
      });
    }
  }

  function sendeRennUpdateAnAlle(eventObj) {
    if (netzwerk.role !== "host") return;
    netzwerk.broadcast({
      type: "RACE_STATE",
      players: spielerListe,
      event: eventObj
    });
  }

  function beendeRennenAlsHost(winnerId) {
    if (spielPhase === "ended") return;
    const dauerMs = Math.max(100, Date.now() - rennStartZeit);
    netzwerk.broadcast({
      type: "RACE_FINISHED",
      winnerId,
      durationMs: dauerMs,
      players: spielerListe
    });
    zeigeSiegerehrung(winnerId, dauerMs);
  }

  // =========================================================================
  // 14. SIEGEREHRUNG & STATISTIK
  // =========================================================================
  function zeigeSiegerehrung(winnerId, dauerMs) {
    stoppeLaufendeTimer();
    const rangliste = berechneRangliste(spielerListe, dauerMs);
    const sieger = rangliste.find((s) => s.id === winnerId) || rangliste[0];

    if (sieger && sieger.isBot && window.soundManager.playRobotFanfare) {
      window.soundManager.playRobotFanfare(sieger.botDifficulty);
    } else {
      window.soundManager.playFanfare();
    }
    zeigeScreen("end");

    const kroneEl = document.querySelector(".krone-badge");
    if (kroneEl) {
      kroneEl.textContent = sieger && sieger.isBot ? "🤖 Sieger-Roboter 🏆" : "🏆 Sieger-Kuh 🏆";
    }

    elWinnerCowAvatar.innerHTML = renderCowSvg(sieger.cowId);
    elWinnerTitle.textContent = `${sieger.name} gewinnt das Kuhrennen!`;
    elWinnerSubtitle.textContent = `${formatiereSchritte(sieger.position)} Schritte in ${sieger.dauerSek.toFixed(1).replace(".", ",")} Sekunden`;

    // Tabelle aufbauen
    const platzIcons = ["🥇 1.", "🥈 2.", "🥉 3.", "4."];
    const zeilenHtml = rangliste
      .map((sp, i) => {
        const icon = platzIcons[i] || `${sp.platz}.`;
        const istSieger = i === 0;
        return `
          <tr class="${istSieger ? "sieger-zeile" : ""}">
            <td>${icon}</td>
            <td>
              <div class="tab-kuh-zelle">
                <span class="tab-kuh-mini">${renderCowSvg(sp.cowId)}</span>
                <span>${escapeHtml(sp.name)}${sp.id === eigeneSpielerId ? " (Du)" : ""}</span>
              </div>
            </td>
            <td>${formatiereSchritte(sp.position)} / ${ZIEL_SCHRITTE}</td>
            <td>${sp.richtig} ✓ / ${sp.fehler} ✗</td>
            <td>${sp.genauigkeit} %</td>
          </tr>
        `;
      })
      .join("");

    elResultsTableContainer.innerHTML = `
      <table class="statistik-tabelle">
        <thead>
          <tr>
            <th>Platz</th>
            <th>Kuh & Name</th>
            <th>Ziel</th>
            <th>Aufgaben</th>
            <th>Genauigkeit</th>
          </tr>
        </thead>
        <tbody>
          ${zeilenHtml}
        </tbody>
      </table>
    `;

    const istHost = netzwerk.role === "host";
    elHostEndActions.hidden = !istHost;
    elGuestEndWaiting.hidden = istHost;

    erzeugeKonfetti();
  }

  function erzeugeKonfetti() {
    elConfettiContainer.innerHTML = "";
    const farben = ["#16a34a", "#facc15", "#2563eb", "#ec4899", "#f97316", "#a855f7"];
    for (let i = 0; i < 32; i++) {
      const teil = document.createElement("div");
      teil.className = "konfetti-teil";
      teil.style.left = `${Math.random() * 100}%`;
      teil.style.background = farben[i % farben.length];
      teil.style.animationDelay = `${Math.random() * 0.8}s`;
      teil.style.animationDuration = `${2.0 + Math.random() * 1.2}s`;
      elConfettiContainer.appendChild(teil);
    }
  }

  // =========================================================================
  // 15. EINGABE-STEUERUNG (ZIFFERNBLOCK & TASTATUR)
  // =========================================================================
  function tippeZiffer(ziffer) {
    if (spielPhase !== "racing") return;
    if (eingabePuffer.length < 4) {
      if (eingabePuffer === "0") {
        if (ziffer === "0") return;
        eingabePuffer = ziffer;
      } else {
        eingabePuffer += ziffer;
      }
      window.soundManager.playClick();
      aktualisiereEingabeDisplay();
    }
  }

  function loescheZiffer() {
    if (spielPhase !== "racing") return;
    if (eingabePuffer.length > 0) {
      window.soundManager.playClick();
      eingabePuffer = eingabePuffer.slice(0, -1);
      aktualisiereEingabeDisplay();
    }
  }

  document.querySelectorAll("[data-key]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-key");
      if (key >= "0" && key <= "9") {
        tippeZiffer(key);
      } else if (key === "backspace") {
        loescheZiffer();
      } else if (key === "enter") {
        pruefeAntwort();
      }
    });
  });

  window.addEventListener("keydown", (e) => {
    if (spielPhase !== "racing") return;

    if (e.key >= "0" && e.key <= "9") {
      tippeZiffer(e.key);
    } else if (e.key === "Backspace") {
      loescheZiffer();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pruefeAntwort();
    }
  });

  // =========================================================================
  // 16. BUTTON-EVENTS FÜR NAVIGATION & REVANCHE
  // =========================================================================
  elBtnCreateLobby.addEventListener("click", oeffneHostLobby);
  elBtnStartRace.addEventListener("click", starteRennenAlsHost);

  elBtnLeaveLobby.addEventListener("click", () => {
    window.soundManager.playClick();
    stoppeLaufendeTimer();
    netzwerk.reset();
    zeigeScreen("home");
  });

  elBtnAbortRace.addEventListener("click", () => {
    window.soundManager.playClick();
    stoppeLaufendeTimer();
    if (netzwerk.role === "host") {
      sendeLobbyUpdateAnAlle();
      zeigeScreen("lobby");
      aktualisiereLobbyAnsicht();
    } else {
      netzwerk.reset();
      zeigeScreen("home");
    }
  });

  elBtnRematch.addEventListener("click", () => {
    if (netzwerk.role === "host") {
      starteRennenAlsHost();
    }
  });

  elBtnBackLobby.addEventListener("click", () => {
    if (netzwerk.role === "host") {
      window.soundManager.playClick();
      sendeLobbyUpdateAnAlle();
      zeigeScreen("lobby");
      aktualisiereLobbyAnsicht();
    }
  });

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // =========================================================================
  // 17. AUTO-BEITRITT BEI EINLADUNGS-LINK (#invite=...)
  // =========================================================================
  function pruefeInviteHashBeimStart() {
    const hash = window.location.hash || "";
    const code = root.KuhNetzwerk.extractCodeFromInput(hash);
    if (code) {
      // Hash bereinigen, damit ein Neuladen nicht erneut denselben abgelaufenen Code nutzt
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      oeffneJoinScreen(code);
    }
  }

  // Initialisierung beim Laden
  rendereKuhAuswahl();
  aktualisiereAlleSoundButtons();
  pruefeInviteHashBeimStart();
})(typeof window !== "undefined" ? window : globalThis);
