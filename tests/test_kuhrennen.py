import json
import re
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
KUHRENNEN_DIR = ROOT / "projekte" / "kuhrennen"
MATHE_DIR = KUHRENNEN_DIR / "mathe"
JSC_BIN = Path("/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc")


class KuhrennenProjectTest(unittest.TestCase):
    def test_project_and_version_titles(self):
        self.assertTrue((KUHRENNEN_DIR / "title.txt").is_file())
        self.assertEqual(
            (KUHRENNEN_DIR / "title.txt").read_text(encoding="utf-8").strip(),
            "Kuhrennen",
        )
        self.assertTrue((MATHE_DIR / "title.txt").is_file())
        self.assertEqual(
            (MATHE_DIR / "title.txt").read_text(encoding="utf-8").strip(),
            "Mathe",
        )

    def test_required_files_exist_and_use_relative_paths(self):
        for filename in ("index.html", "style.css", "audio.js", "webrtc.js", "game.js"):
            self.assertTrue((MATHE_DIR / filename).is_file(), f"{filename} fehlt")

        html = (MATHE_DIR / "index.html").read_text(encoding="utf-8")
        self.assertIn('<meta name="viewport" content="width=device-width, initial-scale=1', html)
        self.assertIn('href="style.css"', html)
        self.assertIn('src="audio.js"', html)
        self.assertIn('src="webrtc.js"', html)
        self.assertIn('src="game.js"', html)

        # Keine externen CDNs
        self.assertIsNone(re.search(r'(href|src)="https?://', html))

    def test_game_constants_and_mechanics_defined(self):
        game_js = (MATHE_DIR / "game.js").read_text(encoding="utf-8")
        self.assertIn("const ZIEL_SCHRITTE = 20;", game_js)
        self.assertIn("const SCHRITT_VOR = 1;", game_js)
        self.assertIn("const SCHRITT_ZURUECK = 0.25;", game_js)
        self.assertIn("einmaleins_und_durch", game_js)
        self.assertIn("plus_minus_1000", game_js)
        self.assertIn("createSeededRng", game_js)
        self.assertIn("generiereAufgabeFuerIndex", game_js)
        self.assertIn("berechneNeuePosition", game_js)
        self.assertIn("berechneRangliste", game_js)

    def test_serverless_webrtc_and_stun_configuration(self):
        webrtc_js = (MATHE_DIR / "webrtc.js").read_text(encoding="utf-8")
        self.assertIn("stun:stun.l.google.com:19302", webrtc_js)
        self.assertIn("CompressionStream", webrtc_js)
        self.assertIn("DecompressionStream", webrtc_js)
        self.assertIn("buildInviteLink", webrtc_js)
        self.assertIn("extractCodeFromInput", webrtc_js)

    def test_responsive_no_scroll_layout_rules(self):
        css = (MATHE_DIR / "style.css").read_text(encoding="utf-8")
        self.assertIn("100dvh", css)
        self.assertIn("overflow: hidden", css)
        self.assertIn("safe-area-inset", css)

    @unittest.skipUnless(JSC_BIN.is_file(), "JavaScriptCore (jsc) nicht verfügbar")
    def test_javascript_game_and_webrtc_logic(self):
        webrtc_path = str(MATHE_DIR / "webrtc.js")
        game_path = str(MATHE_DIR / "game.js")

        js_test_script = f"""
        load({json.dumps(webrtc_path)});
        load({json.dumps(game_path)});

        const L = globalThis.KuhSpielLogik;
        const N = globalThis.KuhNetzwerk;

        function assertEq(actual, expected, msg) {{
          if (actual !== expected) {{
            throw new Error(msg + ": expected " + expected + ", got " + actual);
          }}
        }}

        // 1. Schritt-Berechnung (+1 vor, -0.25 zurück, Start=0, Ziel=20)
        assertEq(L.berechneNeuePosition(0, false), 0, "Nicht unter 0 fallen");
        assertEq(L.berechneNeuePosition(0, true), 1, "1 Schritt vor ab 0");
        assertEq(L.berechneNeuePosition(5, false), 4.75, "0.25 Schritte zurück von 5");
        assertEq(L.berechneNeuePosition(4.75, false), 4.5, "0.25 Schritte zurück von 4.75");
        assertEq(L.berechneNeuePosition(4.5, true), 5.5, "1 Schritt vor von 4.5");
        assertEq(L.berechneNeuePosition(19.5, true), 20, "Deckelung bei 20 Schritten");

        // 2. Deterministische Aufgaben-Sequenz (100% gleich für alle Spieler mit gleichem Seed)
        for (let i = 0; i < 30; i++) {{
          const a1 = L.generiereAufgabeFuerIndex("einmaleins_und_durch", 987654, i);
          const a2 = L.generiereAufgabeFuerIndex("einmaleins_und_durch", 987654, i);
          assertEq(a1.term, a2.term, "Term muss bei gleichem Seed identisch sein");
          assertEq(a1.loesung, a2.loesung, "Lösung muss bei gleichem Seed identisch sein");

          const b1 = L.generiereAufgabeFuerIndex("plus_minus_1000", 555123, i);
          const b2 = L.generiereAufgabeFuerIndex("plus_minus_1000", 555123, i);
          assertEq(b1.term, b2.term, "Plus/Minus Term identisch");
          assertEq(b1.loesung, b2.loesung, "Plus/Minus Lösung identisch");
          if (b1.loesung < 0 || b1.loesung > 1000) {{
            throw new Error("Plus/Minus Lösung außerhalb [0, 1000]: " + b1.loesung);
          }}
        }}

        // 3. Ranglisten-Berechnung für 4 Spieler
        const rang = L.berechneRangliste([
          {{ id: "p2", name: "Anna", cowId: "lila", position: 18.75, richtig: 19, fehler: 1 }},
          {{ id: "host", name: "Max", cowId: "flecki", position: 20, richtig: 20, fehler: 0 }},
          {{ id: "p3", name: "Tom", cowId: "schoko", position: 14.5, richtig: 15, fehler: 2 }},
          {{ id: "p4", name: "Lisa", cowId: "goldi", position: 18.75, richtig: 20, fehler: 5 }}
        ], 45000);

        assertEq(rang[0].name, "Max", "Platz 1 ist bei 20 Schritten");
        assertEq(rang[0].platz, 1, "Platz 1 Nummer");
        assertEq(rang[0].genauigkeit, 100, "Max Genauigkeit 100%");
        assertEq(rang[1].name, "Lisa", "Bei gleicher Position (18.75) gewinnt mehr richtige Aufgaben");
        assertEq(rang[2].name, "Anna", "Platz 3");
        assertEq(rang[3].name, "Tom", "Platz 4");

        // 4. WebRTC Code-Extraktion (aus Link und aus Direkt-Code)
        const link = N.buildInviteLink("z.AbCdEf_123-456", "https://example.org/kuhrennen/mathe/");
        assertEq(
          N.extractCodeFromInput(link),
          "z.AbCdEf_123-456",
          "Extraktion aus komplettem Einladungs-Link"
        );
        assertEq(
          N.extractCodeFromInput("  u.XyZ987_654  "),
          "u.XyZ987_654",
          "Extraktion aus reinem Code"
        );

        print("ALL_JS_TESTS_PASSED");
        """

        proc = subprocess.run(
            [str(JSC_BIN), "-e", js_test_script],
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(proc.returncode, 0, f"JSC Fehler:\n{proc.stdout}\n{proc.stderr}")
        self.assertIn("ALL_JS_TESTS_PASSED", proc.stdout)


if __name__ == "__main__":
    unittest.main()
