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
    }
  ];

  // =========================================================================
  // SPIEL-ZUSTAND
  // =========================================================================
  const RUNDENZEIT_SEKUNDEN = 60;

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
        aktualisiereStartHighscoreAnzeige();
      });
      elTypenContainer.appendChild(btn);
    });
    aktualisiereStartHighscoreAnzeige();
  }

  function holeAktivenTyp() {
    return AUFGABEN_KATALOG.find((t) => t.id === aktiverTypId) || AUFGABEN_KATALOG[0];
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
  // SPIELABLAUF (60 SEKUNDEN SPRINT)
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
    endZeit = Date.now() + RUNDENZEIT_SEKUNDEN * 1000;
    aktualisiereTimer();
    clearInterval(timerId);
    timerId = setInterval(aktualisiereTimer, 100);

    // Erste Aufgabe
    naechsteAufgabe();
  }

  function aktualisiereTimer() {
    if (!spielAktiv) return;

    const verbleibendMs = Math.max(0, endZeit - Date.now());
    const verbleibendSek = Math.ceil(verbleibendMs / 1000);
    const anteil = verbleibendMs / (RUNDENZEIT_SEKUNDEN * 1000);

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
    elAufgabeTerm.textContent = `${aktuelleAufgabe.term} =`;
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

  function ueberspringeAufgabe() {
    if (!spielAktiv) return;
    window.soundManager.playClick();
    versuche++;
    naechsteAufgabe();
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
    if (eingabePuffer.length < 3) {
      // Nicht mehr als 3 Stellen nötig für 1x1 Ergebnisse
      window.soundManager.playClick();
      eingabePuffer += ziffer;
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
      } else if (key === "skip") {
        ueberspringeAufgabe();
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
    } else if (e.key.toLowerCase() === "s") {
      // Taste 's' für Überspringen
      ueberspringeAufgabe();
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
    aktualisiereStartHighscoreAnzeige();
  });

  // =========================================================================
  // INITIALISIERUNG
  // =========================================================================
  initialisiereTypenAuswahl();
  aktualisiereSoundButton();
})();
