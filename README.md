# lernen

Sammlung kleiner Lernprojekte als statische HTML-Seiten, veröffentlicht über GitHub Pages.

## Aufbau

```
projekte/
  division/                     ← ein Lernprojekt = ein Ordner
    title.txt                   ← optional: Name des Projekts (z. B. "Division")
    klasse-2/                   ← eine Version des Projekts
      title.txt                 ← optional: Name der Version (z. B. "Klasse 2")
      index.html                ← die eigentliche Lernseite
    klasse-2-und-3/index.html
```

- Jedes **Projekt** ist ein Ordner in `projekte/`. Der Anzeigename kann über eine optionale `title.txt` im Projektordner festgelegt werden (Fallback: Ordnername).
- Jede **Version** ist ein Unterordner mit einer `index.html`. Der Anzeigename der Version wird bevorzugt aus einer optionalen `title.txt` im Versionsordner gelesen. Existiert diese nicht, wird der `<title>` aus der HTML-Datei (ggf. bereinigt um den Projektnamen) oder der Ordnername verwendet. Weitere Dateien (Bilder, Sounds …) können daneben liegen und werden mit ausgeliefert.
- Ordner, die mit `.` oder `_` beginnen, werden ignoriert. Für Ordnernamen am besten nur Kleinbuchstaben, Ziffern und `-` verwenden (keine Leerzeichen oder `+`), damit die Adressen sauber bleiben.

Die veröffentlichte Seite hat dann diese Adressen:

- `https://<benutzer>.github.io/lernen/` – Übersicht aller Projekte
- `https://<benutzer>.github.io/lernen/division/` – Übersicht aller Versionen
- `https://<benutzer>.github.io/lernen/division/klasse-2/` – die Lernseite

## Neues Projekt / neue Version anlegen

1. Ordner `projekte/<projekt>/<version>/` anlegen.
2. Darin eine `index.html` erstellen (z. B. eine bestehende Version kopieren).
3. Committen und nach `main` pushen – der Rest passiert automatisch.

## Lokal bauen und testen

Benötigt nur Python 3 (keine weiteren Abhängigkeiten):

```sh
python3 -m unittest discover -s tests   # Tests
python3 scripts/build.py                # baut die Seite nach _site/
python3 -m http.server -d _site         # Vorschau unter http://localhost:8000
```

## Einmalige Einstellung in GitHub

Damit der Workflow `.github/workflows/pages.yml` veröffentlichen darf:

1. Im Repository auf **Settings → Pages** gehen.
2. Unter **Build and deployment → Source** den Eintrag **GitHub Actions** auswählen.

Danach wird bei jedem Push auf `main` automatisch neu veröffentlicht (oder manuell über **Actions → GitHub Pages → Run workflow**). Pull Requests werden nur gebaut und getestet, nicht veröffentlicht.
