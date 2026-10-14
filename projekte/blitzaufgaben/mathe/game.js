// Blitzaufgaben – Mathe
// Modulare Spiellogik mit 60-Sekunden-Timer, Kaching-Sound und Touch/Tastatur-Eingabe

(function () {
  "use strict";

  // Hilfsfunktion: Zufallszahl zwischen min und max (inklusive)
  function zufall(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * =========================================================================
   * MODULARER AUFGABEN-KATALOG
   * =========================================================================
   * Neue Aufgabentypen oder Schwierigkeitsgrade können hier einfach als
   * weiteres Objekt in der Liste ergänzt werden. Die Benutzeroberfläche
   * baut die Auswahlschaltflächen automatisch daraus auf!
   */
  const AUFGABEN_KATALOG = [
    {
      id: "einmaleins_und_durch",
      badge: "1 ×/÷ 1",
      titel: "1 mal 1 & 1 durch 1",
      beschreibung: "Multiplikation & Division (Faktoren unter 10)",
      rundenzeit: 60,
      generiere() {
        // Zufällig Multiplikation oder Division
        const istMal = Math.random() < 0.5;
        // Faktoren a und b unter 10 (1 bis 9)
        const a = zufall(1, 9);
        const b = zufall(1, 9);

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
      rundenzeit: 120, // 2 Minuten
      generiere() {
        const istPlus = Math.random() < 0.5;
        // 30% der Aufgaben haben ein Ergebnis zwischen 0 und 100
        const istKleinerRaum = Math.random() < 0.3;

        if (istKleinerRaum) {
          if (istPlus) {
            const c = zufall(0, 100);
            const a = zufall(0, c);
            const b = c - a;
            return {
              term: `${a} + ${b}`,
              loesung: c,
              operator: "+"
            };
          } else {
            const a = zufall(0, 100);
            const b = zufall(0, a);
            return {
              term: `${a} − ${b}`,
              loesung: a - b,
              operator: "−"
            };
          }
        }

        // Die restlichen 70%: Zahlenraum bis 1000 (davon 30% didaktischer Mix, 70% freie Zufallszahlen)
        const istDidaktisch = Math.random() < 0.3;

        if (istPlus) {
          let a, b;
          if (istDidaktisch) {
            const variante = zufall(1, 5);
            if (variante === 1) {
              // 1. Glatte Hunderter (z. B. 400 + 300)
              const h1 = zufall(1, 9);
              const h2 = zufall(1, 10 - h1);
              a = h1 * 100;
              b = h2 * 100;
            } else if (variante === 2) {
              // 2. Glatte Zehner (z. B. 340 + 50, 480 + 70)
              const z1 = zufall(1, 98);
              const z2 = zufall(1, 99 - z1);
              a = z1 * 10;
              b = z2 * 10;
            } else if (variante === 3) {
              // 3. Ergänzen auf glatte 100er oder 1000
              if (Math.random() < 0.5) {
                // Ergänzen auf 1000 (z. B. 650 + 350 = 1000)
                a = zufall(1, 99) * 10;
                b = 1000 - a;
              } else {
                // Ergänzen auf glatten Hunderter
                const zielH = zufall(2, 9) * 100;
                a = zielH - zufall(1, 9) * 10;
                b = zielH - a;
              }
            } else if (variante === 4) {
              // 4. Hunderter/Zehner mit Einern (z. B. 400 + 37, 560 + 8)
              if (Math.random() < 0.5) {
                a = zufall(1, 9) * 100;
                b = zufall(1, 99);
              } else {
                a = zufall(1, 9) * 100 + zufall(1, 9) * 10;
                b = zufall(1, 9);
              }
            } else {
              // 5. Grenzwerte 0 oder 1000 gezielt
              if (Math.random() < 0.2) {
                a = 0;
                b = 0;
              } else {
                // Ergebnis genau 1000
                a = zufall(0, 1000);
                b = 1000 - a;
              }
            }
          } else {
            // 70% Zufällig: Ergebnis c zwischen 0 und 1000
            const c = zufall(0, 1000);
            a = zufall(0, c);
            b = c - a;
          }

          return {
            term: `${a} + ${b}`,
            loesung: a + b,
            operator: "+"
          };
        } else {
          // Subtraktion: a - b = c mit 0 <= c <= 1000 (und 0 <= a <= 1000, 0 <= b <= a)
          let a, b;
          if (istDidaktisch) {
            const variante = zufall(1, 5);
            if (variante === 1) {
              // 1. Glatte Hunderter (z. B. 800 - 300, 1000 - 400)
              const h1 = zufall(1, 10);
              const h2 = zufall(1, h1);
              a = h1 * 100;
              b = h2 * 100;
            } else if (variante === 2) {
              // 2. Glatte Zehner (z. B. 680 - 50, 520 - 70)
              const z1 = zufall(2, 100);
              const z2 = zufall(1, z1);
              a = z1 * 10;
              b = z2 * 10;
            } else if (variante === 3) {
              // 3. Glatter Hunderter oder 1000 minus Zehner/Zahl (z. B. 1000 - 350, 600 - 40)
              if (Math.random() < 0.5) {
                a = 1000;
                b = zufall(1, 99) * 10;
              } else {
                a = zufall(2, 9) * 100;
                b = zufall(1, 9) * 10;
              }
            } else if (variante === 4) {
              // 4. Dreistellig minus Einer/Zehner glatt (z. B. 458 - 8 = 450, 635 - 30 = 605)
              if (Math.random() < 0.5) {
                const h = zufall(1, 9) * 100;
                const z = zufall(1, 9) * 10;
                const e = zufall(1, 9);
                a = h + z + e;
                b = e; // ergibt glatten Zehner
              } else {
                const h = zufall(1, 9) * 100;
                const z = zufall(1, 9) * 10;
                a = h + z;
                b = zufall(1, 9); // Einer abziehen
              }
            } else {
              // 5. Grenzwerte 0 oder 1000 gezielt
              if (Math.random() < 0.6) {
                // Ergebnis genau 0 (z. B. 450 - 450 = 0)
                a = zufall(1, 1000);
                b = a;
              } else {
                // Ergebnis genau 1000 (1000 - 0 = 1000)
                a = 1000;
                b = 0;
              }
            }
          } else {
            // 70% Zufällig: a in [0, 1000], b in [0, a]
            a = zufall(0, 1000);
            b = zufall(0, a);
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

  // =========================================================================
  // SPIEL-ZUSTAND
  // =========================================================================
  let aktiverTypId = AUFGABEN_KATALOG[0].id;
  let spielAktiv = false;
  let timerId = null;
  let endZeit = 0;
  let punkte = 0;
  let versuche = 0;
  let aktuelleAufgabe = null;
  let eingabePuffer = "";

  // DOM Elemente
  const elStartScreen = document.getElementById("screen-start");
  const elGameScreen = document.getElementById("screen-game");
  const elEndScreen = document.getElementById("screen-end");

  const elHeroBadge = document.getElementById("hero-badge");
  const elTypenContainer = document.getElementById("typen-container");
  const elBtnStart = document.getElementById("btn-start");
  const elSoundToggle = document.getElementById("sound-toggle");
  const elStartHighscore = document.getElementById("start-highscore");

  const elTimerText = document.getElementById("timer-text");
  const elTimerBar = document.getElementById("timer-bar");
  const elPunkteText = document.getElementById("punkte-text");
  const elAufgabeTerm = document.getElementById("aufgabe-term");
  const elAntwortDisplay = document.getElementById("antwort-display");
  const elFeedbackEffekt = document.getElementById("feedback-effekt");

  const elEndPunkte = document.getElementById("end-punkte");
  const elEndVersuche = document.getElementById("end-versuche");
  const elEndHighscoreBadge = document.getElementById("end-highscore-badge");
  const elEndHighscoreText = document.getElementById("end-highscore-text");
  const elBtnNeustart = document.getElementById("btn-neustart");
  const elBtnZurueckMenue = document.getElementById("btn-zurueck-menue");

  // =========================================================================
  // HIGHSCORE-VERWALTUNG (im Browser gespeichert)
  // =========================================================================
  function getHighscoreKey(typId) {
    return `blitz_highscore_${typId}`;
  }

  function ladeHighscore(typId) {
    const val = localStorage.getItem(getHighscoreKey(typId));
    return val ? parseInt(val, 10) : 0;
  }

  function speichereHighscore(typId, score) {
    const aktuell = ladeHighscore(typId);
    if (score > aktuell) {
      localStorage.setItem(getHighscoreKey(typId), score);
      return true; // Neuer Rekord!
    }
    return false;
  }

  function holeAktivenTyp() {
    return AUFGABEN_KATALOG.find((t) => t.id === aktiverTypId) || AUFGABEN_KATALOG[0];
  }

  function holeAktuelleRundenzeit() {
    return holeAktivenTyp().rundenzeit || 60;
  }

  function aktualisiereStartBildschirm() {
    const typ = holeAktivenTyp();
    const sek = typ.rundenzeit || 60;
    if (elHeroBadge) {
      elHeroBadge.textContent = sek === 120 ? "⚡ 2 Minuten ⚡" : "⚡ 1 Minute ⚡";
    }
    elBtnStart.textContent = `▶ Runde starten (${sek} s)`;
    aktualisiereStartHighscoreAnzeige();
  }

  function aktualisiereStartHighscoreAnzeige() {
    const hs = ladeHighscore(aktiverTypId);
    elStartHighscore.textContent = hs > 0 ? `Beste Leistung: ${hs} Aufgaben` : "Noch kein Rekord";
  }

  // =========================================================================
  // TYPAUSWAHL RENDERN
  // =========================================================================
  function initialisiereTypenAuswahl() {
    elTypenContainer.innerHTML = "";
    AUFGABEN_KATALOG.forEach((typ) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `typ-karte ${typ.id === aktiverTypId ? "aktiv" : ""}`;
      btn.setAttribute("data-id", typ.id);
      btn.innerHTML = `
        <span class="typ-badge">${typ.badge}</span>
        <span class="typ-titel">${typ.titel}</span>
        <span class="typ-beschreibung">${typ.beschreibung}</span>
      `;
      btn.addEventListener("click", () => {
        window.soundManager.playClick();
        aktiverTypId = typ.id;
        document.querySelectorAll(".typ-karte").forEach((k) => k.classList.remove("aktiv"));
        btn.classList.add("aktiv");
        aktualisiereStartBildschirm();
      });
      elTypenContainer.appendChild(btn);
    });
    aktualisiereStartBildschirm();
  }

  // =========================================================================
  // SOUND-STATUS ANZEIGE
  // =========================================================================
  function aktualisiereSoundButton() {
    const aktiv = window.soundManager.isEnabled();
    elSoundToggle.textContent = aktiv ? "🔊" : "🔇";
    elSoundToggle.setAttribute("aria-label", aktiv ? "Ton ausschalten" : "Ton einschalten");
    elSoundToggle.title = aktiv ? "Ton ausschalten" : "Ton einschalten";
  }

  elSoundToggle.addEventListener("click", () => {
    window.soundManager.toggle();
    aktualisiereSoundButton();
  });

  // =========================================================================
  // SPIELABLAUF
  // =========================================================================
  function starteSpiel() {
    window.soundManager.init();
    window.soundManager.playClick();

    spielAktiv = true;
    punkte = 0;
    versuche = 0;
    eingabePuffer = "";

    // Bildschirme umschalten
    elStartScreen.hidden = true;
    elEndScreen.hidden = true;
    elGameScreen.hidden = false;

    elPunkteText.textContent = "0";
    aktualisiereEingabeDisplay();

    // Timer initialisieren
    const rundenzeit = holeAktuelleRundenzeit();
    elTimerText.textContent = `${rundenzeit} s`;
    elTimerBar.style.width = "100%";
    elTimerBar.classList.remove("warnung");
    elTimerText.classList.remove("warnung");

    endZeit = Date.now() + rundenzeit * 1000;
    aktualisiereTimer();
    clearInterval(timerId);
    timerId = setInterval(aktualisiereTimer, 100);

    // Erste Aufgabe
    naechsteAufgabe();
  }

  function aktualisiereTimer() {
    if (!spielAktiv) return;

    const rundenzeit = holeAktuelleRundenzeit();
    const verbleibendMs = Math.max(0, endZeit - Date.now());
    const verbleibendSek = Math.ceil(verbleibendMs / 1000);
    const anteil = verbleibendMs / (rundenzeit * 1000);

    elTimerText.textContent = `${verbleibendSek} s`;
    elTimerBar.style.width = `${Math.max(0, Math.min(100, anteil * 100))}%`;

    if (verbleibendSek <= 10) {
      elTimerBar.classList.add("warnung");
      elTimerText.classList.add("warnung");
    } else {
      elTimerBar.classList.remove("warnung");
      elTimerText.classList.remove("warnung");
    }

    if (verbleibendMs <= 0) {
      beendeSpiel();
    }
  }

  function naechsteAufgabe() {
    const typ = holeAktivenTyp();
    aktuelleAufgabe = typ.generiere();
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

  function zeigeKachingEffekt() {
    // Schwebender Punkte-Effekt "+1"
    const partikel = document.createElement("div");
    partikel.className = "kaching-partikel";
    partikel.textContent = "+1 🪙";
    elFeedbackEffekt.appendChild(partikel);
    setTimeout(() => {
      partikel.remove();
    }, 700);

    // Schnelles Pulsieren der Aufgabe
    elAufgabeTerm.classList.remove("erfolg-puls");
    void elAufgabeTerm.offsetWidth; // Reflow erzwingen
    elAufgabeTerm.classList.add("erfolg-puls");
  }

  function zeigeFehlerEffekt() {
    elAntwortDisplay.classList.remove("fehler-shake");
    void elAntwortDisplay.offsetWidth; // Reflow erzwingen
    elAntwortDisplay.classList.add("fehler-shake");
  }

  function pruefeAntwort() {
    if (!spielAktiv || !aktuelleAufgabe) return;
    if (eingabePuffer === "") return;

    const eingabeZahl = parseInt(eingabePuffer, 10);
    versuche++;

    if (eingabeZahl === aktuelleAufgabe.loesung) {
      // RICHTIG!
      punkte++;
      elPunkteText.textContent = punkte;
      window.soundManager.playKaching();
      zeigeKachingEffekt();
      naechsteAufgabe();
    } else {
      // LEIDER FALSCH
      window.soundManager.playWrong();
      zeigeFehlerEffekt();
      // Eingabe nach kurzem Rütteln leeren
      setTimeout(() => {
        eingabePuffer = "";
        aktualisiereEingabeDisplay();
      }, 250);
    }
  }

  function beendeSpiel() {
    spielAktiv = false;
    clearInterval(timerId);

    window.soundManager.playFanfare();

    // Endbildschirm anzeigen
    elGameScreen.hidden = true;
    elEndScreen.hidden = false;

    elEndPunkte.textContent = punkte;
    elEndVersuche.textContent = `${versuche} Aufgaben versucht`;

    const neuerRekord = speichereHighscore(aktiverTypId, punkte);
    const aktuellerHighscore = ladeHighscore(aktiverTypId);

    if (neuerRekord && punkte > 0) {
      elEndHighscoreBadge.hidden = false;
      elEndHighscoreBadge.textContent = "🎉 Neuer Rekord! 🎉";
      elEndHighscoreText.textContent = `Du hast deine bisherige Bestleistung geknackt! Neuer Rekord: ${punkte}`;
    } else {
      elEndHighscoreBadge.hidden = true;
      elEndHighscoreText.textContent = `Dein bisheriger Rekord: ${aktuellerHighscore}`;
    }
  }

  // =========================================================================
  // EINGABESTEUERUNG (Tasten & Touch-Ziffernblock)
  // =========================================================================
  function tippeZiffer(ziffer) {
    if (!spielAktiv) return;
    if (eingabePuffer.length < 4) {
      // Führende Mehrfach-Nullen verhindern
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
    if (!spielAktiv) return;
    if (eingabePuffer.length > 0) {
      window.soundManager.playClick();
      eingabePuffer = eingabePuffer.slice(0, -1);
      aktualisiereEingabeDisplay();
    }
  }

  // Klick-Handler für On-Screen-Ziffernblock
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

  // Physische Tastatur-Eingaben
  window.addEventListener("keydown", (e) => {
    if (!spielAktiv) {
      if (e.key === "Enter" && !elStartScreen.hidden) {
        starteSpiel();
      }
      return;
    }

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
  // BUTTON EVENTS
  // =========================================================================
  elBtnStart.addEventListener("click", starteSpiel);
  elBtnNeustart.addEventListener("click", starteSpiel);

  elBtnZurueckMenue.addEventListener("click", () => {
    window.soundManager.playClick();
    elEndScreen.hidden = true;
    elGameScreen.hidden = true;
    elStartScreen.hidden = false;
    aktualisiereStartBildschirm();
  });

  // =========================================================================
  // INITIALISIERUNG
  // =========================================================================
  initialisiereTypenAuswahl();
  aktualisiereSoundButton();
})();
