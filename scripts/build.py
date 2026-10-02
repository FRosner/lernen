#!/usr/bin/env python3
"""Baut die statische Webseite aus allen Lernprojekten.

Erwartete Struktur:

    projekte/
      <projekt>/
        <version>/
          index.html   (plus beliebige weitere Dateien, z. B. Bilder)

Ergebnis (Standard: ``_site/``):

    _site/
      index.html                      Übersicht aller Projekte
      <projekt>/index.html            Übersicht aller Versionen eines Projekts
      <projekt>/<version>/index.html  die eigentliche Lernseite
"""

from __future__ import annotations

import argparse
import shutil
import sys
from dataclasses import dataclass, field
from html import escape
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


@dataclass
class Version:
    slug: str
    title: str


@dataclass
class Project:
    slug: str
    title: str
    versions: list[Version] = field(default_factory=list)


class _TitleParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._in_title = False
        self.title = ""

    def handle_starttag(self, tag, attrs):
        if tag == "title" and not self.title:
            self._in_title = True

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data


def read_title(html_file: Path) -> str:
    parser = _TitleParser()
    parser.feed(html_file.read_text(encoding="utf-8"))
    return " ".join(parser.title.split())


def _read_title_file(dir_path: Path) -> str | None:
    title_file = dir_path / "title.txt"
    if title_file.is_file():
        content = title_file.read_text(encoding="utf-8").strip()
        if content:
            return content
    return None


def _visible_dirs(path: Path) -> list[Path]:
    return sorted(
        p for p in path.iterdir() if p.is_dir() and not p.name.startswith((".", "_"))
    )


def discover(projects_dir: Path) -> list[Project]:
    projects = []
    for project_dir in _visible_dirs(projects_dir):
        project_title = _read_title_file(project_dir) or project_dir.name.replace("-", " ").title()
        project = Project(slug=project_dir.name, title=project_title)
        for version_dir in _visible_dirs(project_dir):
            index = version_dir / "index.html"
            if not index.is_file():
                print(f"Warnung: {index} fehlt, Version wird übersprungen.", file=sys.stderr)
                continue
            version_title = _read_title_file(version_dir)
            if not version_title:
                html_title = read_title(index)
                if html_title:
                    for sep in (" – ", " - ", ": "):
                        prefix = f"{project_title}{sep}"
                        if html_title.startswith(prefix):
                            html_title = html_title[len(prefix):].strip()
                            break
                    if html_title.casefold() != project_title.casefold():
                        version_title = html_title
            if not version_title:
                version_title = version_dir.name
            project.versions.append(Version(slug=version_dir.name, title=version_title))
        if project.versions:
            projects.append(project)
        else:
            print(f"Warnung: Projekt {project_dir} hat keine Versionen.", file=sys.stderr)
    return projects


def _page(title: str, heading: str, items: list[tuple[str, str]], back: str | None = None) -> str:
    links = "\n".join(
        f'      <li><a href="{escape(href)}">{escape(label)}</a></li>' for href, label in items
    )
    back_link = f'    <p><a href="{escape(back)}">&larr; Zurück</a></p>\n' if back else ""
    return f"""<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{escape(title)}</title>
    <style>
      body {{ font-family: system-ui, sans-serif; max-width: 40rem; margin: 2rem auto; padding: 0 1rem; }}
      li {{ margin: 0.5rem 0; font-size: 1.2rem; }}
    </style>
  </head>
  <body>
{back_link}    <h1>{escape(heading)}</h1>
    <ul>
{links}
    </ul>
  </body>
</html>
"""


def build(projects_dir: Path, out_dir: Path) -> list[Project]:
    projects = discover(projects_dir)
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True)

    for project in projects:
        project_out = out_dir / project.slug
        for version in project.versions:
            shutil.copytree(projects_dir / project.slug / version.slug, project_out / version.slug)
        (project_out / "index.html").write_text(
            _page(
                project.title,
                project.title,
                [(f"{v.slug}/", v.title) for v in project.versions],
                back="../",
            ),
            encoding="utf-8",
        )

    (out_dir / "index.html").write_text(
        _page("Lernen", "Lernprojekte", [(f"{p.slug}/", p.title) for p in projects]),
        encoding="utf-8",
    )
    (out_dir / ".nojekyll").touch()
    return projects


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--projekte", type=Path, default=ROOT / "projekte")
    parser.add_argument("--ausgabe", type=Path, default=ROOT / "_site")
    args = parser.parse_args()
    projects = build(args.projekte, args.ausgabe)
    for project in projects:
        print(f"{project.slug}: {', '.join(v.slug for v in project.versions)}")
    print(f"Fertig: {args.ausgabe}")


if __name__ == "__main__":
    main()
