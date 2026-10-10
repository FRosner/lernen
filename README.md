# Lernen

Eine Sammlung kleiner, interaktiver Lernspiele und Lernhilfen für Kinder und Schüler. Alle Spiele laufen direkt im Webbrowser – auf dem Smartphone, Tablet oder Computer, ganz ohne Installation.

---

## Wie funktioniert das?

Dieses Projekt ist so aufgebaut, dass du neue Lernspiele oder Aufgaben ganz einfach mit Unterstützung deines **KI-Assistenten** erstellen und anpassen kannst:

1. **Wunsch äußern**: Sag dem Assistenten einfach, was du brauchst (z. B. *„Erstelle ein Spiel zum Uhrzeit-Lernen für die 2. Klasse“*).
2. **Ausprobieren**: Der Assistent erstellt die Seite und gibt dir einen Link, mit dem du das Spiel direkt auf deinem Gerät im Browser testen kannst.
3. **Anpassen**: Wenn dir etwas noch nicht gefällt (Farben, Aufgaben, Schriftgröße), sag es dem Assistenten.
4. **Veröffentlichen**: Wenn alles passt, sagst du einfach *„Bitte veröffentlichen“*, und das Spiel ist kurz darauf online verfügbar.

---

## Aufbau der Lernprojekte

Alle Inhalte liegen im Ordner `projekte/`:

```text
projekte/
  division/                     ← Ordner für das Lernprojekt
    title.txt                   ← Name für die Anzeige (z. B. "Division")
    klasse-2/                   ← Eine Version oder ein Schwierigkeitsgrad
      title.txt                 ← Name der Version (z. B. "Klasse 2")
      index.html                ← Das eigentliche Lernspiel
    klasse-2-und-3/             ← Weitere Version
      title.txt
      index.html
```

* **Projektname & Version**: Werden einfach als Text in die jeweilige `title.txt` geschrieben (Umlaute wie Ä, Ö, Ü sind natürlich erlaubt).
* **Dateien**: Jedes Spiel hat eine `index.html` als Startseite. Du kannst den Code und Inhalte frei auf mehrere Dateien aufteilen (z. B. eigene CSS-, JavaScript-, Bild- oder Ton-Dateien daneben oder in Unterordnern). Wichtig ist nur, relative Pfade zu verwenden.
* **Übersichten**: Das Inhaltsverzeichnis und die Menüs werden automatisch für dich erstellt.

---

## Wo finde ich die Spiele online?

Die veröffentlichten Spiele sind über deine GitHub-Pages-Adresse erreichbar:

* `https://<benutzer>.github.io/lernen/` – Gesamtübersicht aller Lernspiele
* `https://<benutzer>.github.io/lernen/division/` – Übersicht der Versionen eines Spiels
* `https://<benutzer>.github.io/lernen/division/klasse-2/` – Das eigentliche Lernspiel

---

## Für Entwickler (Technischer Hintergrund)

Das Repository benötigt ausschließlich **Python 3** (ohne zusätzliche Bibliotheken):

```sh
python3 -m unittest discover -s tests   # Prüft alle Projekte auf Vollständigkeit
python3 scripts/build.py                # Baut die fertige Webseite nach _site/
python3 -m http.server -d _site         # Startet eine lokale Vorschau unter http://localhost:8000
```

* Die Veröffentlichung erfolgt automatisch über GitHub Actions (`.github/workflows/pages.yml`), sobald Änderungen auf dem Haupt-Zweig (`main`) gespeichert werden.
* Eine genaue Anleitung für KI-Assistenten befindet sich in [`AGENTS.md`](AGENTS.md).
