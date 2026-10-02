import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))

import build  # noqa: E402


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


class BuildTest(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.tmp = Path(self._tmp.name)
        self.projekte = self.tmp / "projekte"
        self.site = self.tmp / "_site"

    def tearDown(self):
        self._tmp.cleanup()

    def test_builds_projects_versions_and_overviews(self):
        write(self.projekte / "division/klasse-2/index.html", "<title>Division &amp; 2</title>")
        write(self.projekte / "division/klasse-2/bild.svg", "<svg/>")
        write(self.projekte / "division/klasse-3/index.html", "<p>ohne Titel</p>")
        write(self.projekte / "division/leer/notiz.txt", "keine index.html")
        write(self.projekte / "nur-leer/x/notiz.txt", "")
        write(self.projekte / ".versteckt/v/index.html", "")

        projects = build.build(self.projekte, self.site)

        self.assertEqual([p.slug for p in projects], ["division"])
        self.assertEqual(
            [(v.slug, v.title) for v in projects[0].versions],
            [("klasse-2", "Division & 2"), ("klasse-3", "klasse-3")],
        )
        self.assertTrue((self.site / "division/klasse-2/index.html").is_file())
        self.assertTrue((self.site / "division/klasse-2/bild.svg").is_file())
        self.assertFalse((self.site / "division/leer").exists())
        self.assertFalse((self.site / "nur-leer").exists())
        self.assertTrue((self.site / ".nojekyll").is_file())

        root = (self.site / "index.html").read_text(encoding="utf-8")
        self.assertIn('<a href="division/">Division</a>', root)
        overview = (self.site / "division/index.html").read_text(encoding="utf-8")
        self.assertIn('<a href="klasse-2/">Division &amp; 2</a>', overview)
        self.assertIn('<a href="klasse-3/">klasse-3</a>', overview)

    def test_repository_projects_build(self):
        projects = build.build(build.ROOT / "projekte", self.site)
        self.assertTrue(projects)
        for project in projects:
            for version in project.versions:
                self.assertTrue((self.site / project.slug / version.slug / "index.html").is_file())


if __name__ == "__main__":
    unittest.main()
