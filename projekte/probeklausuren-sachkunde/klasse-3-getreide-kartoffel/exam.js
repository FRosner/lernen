/* ==========================================================================
   Sachkunde-Probeklausur Klasse 3: Getreide & Die Reise der Kartoffel
   15 Aufgaben · 100 Punkte (50 Getreide + 50 Kartoffel) · 45 Min. Countdown
   ========================================================================== */

(function () {
  "use strict";

  const EXAM_DURATION_SECONDS = 45 * 60; // 45 Minuten

  /* ------------------------------------------------------------------------
     Aufgabendefinitionen (15 Aufgaben = 100 Punkte)
     ------------------------------------------------------------------------ */
  const TASKS = [
    /* ===================== TEIL A: GETREIDE (50 Punkte) ===================== */
    {
      id: "t1",
      num: 1,
      topic: "grain",
      topicLabel: "Getreide",
      type: "diagram",
      typeLabel: "Bild beschriften",
      title: "Aufbau einer Getreidepflanze",
      prompt: "Beschrifte die 6 nummerierten Teile der Getreidepflanze mit den Wörtern aus dem Wortkasten.",
      points: 6,
      badgeClass: "",
      svgFn: () => window.SachkundeArt.getGrainPlantSVG(),
      wordBank: ["Halm", "Ähre", "Wurzel", "Grannen", "Halmknoten", "Blatt"],
      leftSlots: [
        { id: "g1", badge: "1", answer: "Grannen" },
        { id: "g2", badge: "2", answer: "Blatt" },
        { id: "g3", badge: "3", answer: "Wurzel" }
      ],
      rightSlots: [
        { id: "g4", badge: "4", answer: "Ähre" },
        { id: "g5", badge: "5", answer: "Halmknoten" },
        { id: "g6", badge: "6", answer: "Halm" }
      ]
    },
    {
      id: "t2",
      num: 2,
      topic: "grain",
      topicLabel: "Getreide",
      type: "varieties",
      typeLabel: "Bild beschriften",
      title: "Getreidesorten erkennen",
      prompt: "Ordne jedem Bild die richtige Getreidesorte aus dem Wortkasten zu.",
      points: 5,
      wordBank: ["Weizen", "Roggen", "Gerste", "Hafer", "Mais"],
      items: [
        {
          id: "v_gerste",
          badge: "1",
          art: "gerste",
          clue: "Ähre mit besonders langen Grannen wie ein Bart",
          answer: "Gerste"
        },
        {
          id: "v_hafer",
          badge: "2",
          art: "hafer",
          clue: "Keine Ähre, sondern eine luftige, verzweigte Rispe",
          answer: "Hafer"
        },
        {
          id: "v_weizen",
          badge: "3",
          art: "weizen",
          clue: "Dicke, kompakte goldene Ähre ohne lange Grannen",
          answer: "Weizen"
        },
        {
          id: "v_mais",
          badge: "4",
          art: "mais",
          clue: "Dicker gelber Kolben mit grünen Hüllblättern",
          answer: "Mais"
        },
        {
          id: "v_roggen",
          badge: "5",
          art: "roggen",
          clue: "Lange, schmale, leicht gebogene Ähre mit mittellangen Grannen",
          answer: "Roggen"
        }
      ]
    },
    {
      id: "t3",
      num: 3,
      topic: "grain",
      topicLabel: "Getreide",
      type: "mc",
      typeLabel: "Multiple Choice",
      title: "Wissen rund um die Getreidepflanze",
      prompt: "Wähle bei jeder Frage die richtige Antwort aus.",
      points: 6,
      questions: [
        {
          id: "q3a",
          text: "a) Welches Getreide hat keine Ähre, sondern eine Rispe?",
          mode: "single",
          points: 2,
          options: ["Weizen", "Hafer", "Gerste", "Roggen"],
          correct: [1]
        },
        {
          id: "q3b",
          text: "b) Wozu sind die Halmknoten am Getreidehalm wichtig?",
          mode: "single",
          points: 2,
          singleCol: true,
          options: [
            "Sie machen den Halm stabil und helfen ihm, sich nach Wind oder Regen wieder aufzurichten.",
            "Darin speichert die Pflanze Wasser für den ganzen Winter.",
            "An den Knoten wachsen die fertigen Brote.",
            "Sie vertreiben hungrige Vögel vom Feld."
          ],
          correct: [0]
        },
        {
          id: "q3c",
          text: "c) Woran erkennst du Gerste auf dem Feld besonders leicht?",
          mode: "single",
          points: 2,
          singleCol: true,
          options: [
            "An ihren großen gelben Kolben.",
            "An ihren blauen Blüten.",
            "An ihren auffällig langen Grannen an der Ähre.",
            "Daran, dass ihre Körner unter der Erde wachsen."
          ],
          correct: [2]
        }
      ]
    },
    {
      id: "t4",
      num: 4,
      topic: "grain",
      topicLabel: "Getreide",
      type: "mc",
      typeLabel: "Multiple Choice",
      title: "Produkte aus Getreide",
      prompt: "Was wird aus Getreide gemacht? Achte darauf, ob eine oder mehrere Antworten gefragt sind.",
      points: 6,
      questions: [
        {
          id: "q4a",
          text: "a) Welche Lebensmittel werden aus Getreide hergestellt?",
          hint: "Wähle alle 3 richtigen Antworten!",
          mode: "multi",
          points: 3,
          options: [
            "Brötchen und Mischbrot",
            "Apfelmus",
            "Haferflocken fürs Müsli",
            "Pommes frites",
            "Popcorn und Cornflakes (aus Mais)"
          ],
          correct: [0, 2, 4]
        },
        {
          id: "q4b",
          text: "b) Für helle Brötchen, Nudeln und Kuchen nimmt man meistens …",
          mode: "single",
          points: 1,
          options: ["Weizen", "Hafer", "Gerste", "Mais"],
          correct: [0]
        },
        {
          id: "q4c",
          text: "c) Für dunkles, kräftiges Bauernbrot und Schwarzbrot nimmt man oft …",
          mode: "single",
          points: 1,
          options: ["Mais", "Roggen", "Hafer", "Gerste"],
          correct: [1]
        },
        {
          id: "q4d",
          text: "d) Woraus werden Malzkaffee und auch viel Tierfutter hergestellt?",
          mode: "single",
          points: 1,
          options: ["Gerste", "Kartoffelblüten", "Apfelkernen", "Zuckerwatte"],
          correct: [0]
        }
      ]
    },
    {
      id: "t5",
      num: 5,
      topic: "grain",
      topicLabel: "Getreide",
      type: "cloze",
      typeLabel: "Lückentext",
      title: "Vom Korn zum Brot",
      prompt: "Setze die passenden Wörter aus dem Wortkasten in die Lücken ein.",
      points: 7,
      wordBank: ["Mehl", "Ernte", "Stroh", "Aussaat", "Mühle", "Körner", "Mähdrescher"],
      segments: [
        "Zuerst bereitet der Bauer das Feld vor und übernimmt die ",
        { id: "c5_1", answer: "Aussaat" },
        " der Getreidekörner. Mit Sonne, Regen und guter Erde wachsen daraus hohe Pflanzen mit reifen Ähren. Im Sommer beginnt die ",
        { id: "c5_2", answer: "Ernte" },
        ": Ein großer ",
        { id: "c5_3", answer: "Mähdrescher" },
        " schneidet die Halme ab und trennt die ",
        { id: "c5_4", answer: "Körner" },
        " vom ",
        { id: "c5_5", answer: "Stroh" },
        ". Danach werden die Körner in der ",
        { id: "c5_6", answer: "Mühle" },
        " ganz fein zu ",
        { id: "c5_7", answer: "Mehl" },
        " gemahlen. Zum Schluss backt der Bäcker daraus Teig für frisches Brot und Brötchen."
      ]
    },
    {
      id: "t6",
      num: 6,
      topic: "grain",
      topicLabel: "Getreide",
      type: "binary",
      typeLabel: "Multiple Choice",
      title: "Getreideernte: Früher oder heute?",
      prompt: "Entscheide bei jeder Aussage: War das früher so oder ist das heute so?",
      points: 6,
      choices: [
        { value: "frueher", label: "🌾 Früher" },
        { value: "heute", label: "🚜 Heute" }
      ],
      statements: [
        { id: "b6_1", text: "Die Bauern mähten das Getreide mühsam von Hand mit der Sense.", answer: "frueher" },
        { id: "b6_2", text: "Ein einziger Mähdrescher schafft an einem Tag die Arbeit vieler Menschen.", answer: "heute" },
        { id: "b6_3", text: "Auf der Tenne wurden die Körner mit dem Dreschflegel aus den Ähren geschlagen.", answer: "frueher" },
        { id: "b6_4", text: "Wind- und Wassermühlen nutzten Wind oder Wasser, um das Korn zu mahlen.", answer: "frueher" },
        { id: "b6_5", text: "Moderne Elektromühlen und große Bäckereien arbeiten mit schnellen Maschinen.", answer: "heute" },
        { id: "b6_6", text: "Pferde oder Ochsen zogen den schweren Pflug langsam über den Acker.", answer: "frueher" }
      ]
    },
    {
      id: "t7",
      num: 7,
      topic: "grain",
      topicLabel: "Getreide",
      type: "reading",
      typeLabel: "Textaufgabe",
      title: "Lesetext: Getreideernte damals und heute",
      prompt: "Lies den kurzen Sachtext aufmerksam durch und beantworte die Fragen in Stichworten oder kurzen Sätzen.",
      points: 7,
      passageTitle: "📖 Opa Karl erzählt von der Ernte",
      passageText:
        "Opa Karl erzählt seiner Enkelin Mia: „Als ich ein Kind war, brauchten wir für die Getreideernte das ganze Dorf. Alle halfen mit! Zuerst wurde das Getreide mit der scharfen Sense geschnitten und zu Garben zusammengebunden. Später schlugen die Bauern die Körner mit hölzernen Dreschflegeln aus den Ähren. Das war sehr anstrengend und dauerte viele Tage. Heute fährt mein Nachbar mit einem einzigen Mähdrescher über das Feld. Die große Maschine mäht, drischt und reinigt die Körner in einem Arbeitsgang. Das leere Stroh bleibt auf dem Feld liegen und wird später als Einstreu für Tiere im Stall verwendet.“",
      questions: [
        {
          id: "r7a",
          text: "a) Welche zwei alten Werkzeuge benutzten die Bauern früher zum Schneiden und Ausklopfen?",
          placeholder: "z. B. Sie benutzten ...",
          points: 2,
          mode: "all",
          modelAnswer: "Die Sense (zum Schneiden) und den Dreschflegel (zum Ausklopfen der Körner).",
          criteria: [
            { label: "Sense", points: 1, keywords: ["sense", "sensen"] },
            { label: "Dreschflegel", points: 1, keywords: ["dreschflegel", "flegel", "dreschfl"] }
          ]
        },
        {
          id: "r7b",
          text: "b) Welche drei Arbeitsschritte erledigt der Mähdrescher heute gleichzeitig?",
          placeholder: "Nenne alle drei Schritte aus dem Text ...",
          points: 3,
          mode: "all",
          modelAnswer: "Er mäht (schneidet), drischt (trennt die Körner) und reinigt die Körner.",
          criteria: [
            { label: "mähen / schneiden", points: 1, keywords: ["maeht", "maehen", "maht", "schneidet", "schneiden"] },
            { label: "dreschen", points: 1, keywords: ["drischt", "dreschen", "trennt", "trennen", "ausklopf"] },
            { label: "reinigen", points: 1, keywords: ["reinigt", "reinigen", "saeubert", "saeubern", "sauber"] }
          ]
        },
        {
          id: "r7c",
          text: "c) Wofür wird das leere Stroh nach der Ernte verwendet?",
          placeholder: "Schreibe deine Antwort auf ...",
          points: 2,
          mode: "all",
          modelAnswer: "Als Einstreu für Tiere im Stall.",
          criteria: [
            { label: "Einstreu", points: 1, keywords: ["einstreu", "streu", "unterlage", "bett", "lager"] },
            { label: "Tiere / Stall", points: 1, keywords: ["tier", "tiere", "tieren", "stall", "kuehe", "pferde", "vieh"] }
          ]
        }
      ]
    },
    {
      id: "t8",
      num: 8,
      topic: "grain",
      topicLabel: "Getreide",
      type: "reading",
      typeLabel: "Textaufgabe",
      title: "Lesetext: Warum Hafer und Mais besonders sind",
      prompt: "Lies den Text genau und beantworte die vier kurzen Fragen dazu.",
      points: 7,
      passageTitle: "📖 Zwei besondere Getreidearten",
      passageText:
        "Nicht jedes Getreide sieht gleich aus. Der Hafer hat zum Beispiel gar keine feste Ähre, sondern eine luftige Rispe, an der die Körner wie kleine Glöckchen hängen. Aus Hafer werden vor allem gesunde Haferflocken für das Frühstücksmüsli und kräftiges Futter für Pferde hergestellt. Auch der Mais gehört zu den Getreidearten, obwohl er viel größer wird als Weizen oder Roggen. Seine gelben Körner sitzen dicht an dicht an einem dicken Kolben, der von grünen Blättern geschützt wird. Aus Mais entstehen nicht nur knuspriges Popcorn und Cornflakes, sondern auch Maismehl und Tierfutter.",
      questions: [
        {
          id: "r8a",
          text: "a) Wie heißt der luftige Blütenstand beim Hafer?",
          placeholder: "Ein Wort genügt ...",
          points: 1,
          mode: "all",
          modelAnswer: "Rispe.",
          criteria: [
            { label: "Rispe", points: 1, keywords: ["rispe", "rispen"] }
          ]
        },
        {
          id: "r8b",
          text: "b) Nenne zwei Dinge, die laut Text aus Hafer hergestellt werden.",
          placeholder: "z. B. ... und ...",
          points: 2,
          mode: "all",
          modelAnswer: "Haferflocken (fürs Müsli) und Pferdefutter.",
          criteria: [
            { label: "Haferflocken / Müsli", points: 1, keywords: ["haferflocken", "flocken", "muesli", "musli"] },
            { label: "Pferdefutter / Futter", points: 1, keywords: ["pferdefutter", "futter", "pferd", "pferde"] }
          ]
        },
        {
          id: "r8c",
          text: "c) Wo sitzen die gelben Körner beim Mais, und was schützt sie?",
          placeholder: "Nenne beides ...",
          points: 2,
          mode: "all",
          modelAnswer: "Sie sitzen an einem dicken Kolben und werden von grünen Blättern geschützt.",
          criteria: [
            { label: "Kolben", points: 1, keywords: ["kolben", "maiskolben"] },
            { label: "grüne Blätter", points: 1, keywords: ["blaetter", "blaettern", "blatter", "blattern", "blatt", "huellblaetter"] }
          ]
        },
        {
          id: "r8d",
          text: "d) Nenne zwei Produkte aus Mais, die im Text stehen.",
          placeholder: "Nenne zwei verschiedene Produkte ...",
          points: 2,
          mode: "anyN",
          modelAnswer: "Zum Beispiel Popcorn, Cornflakes, Maismehl oder Tierfutter (zwei davon reichen).",
          criteria: [
            { label: "Popcorn", points: 1, keywords: ["popcorn", "popkorn"] },
            { label: "Cornflakes", points: 1, keywords: ["cornflakes", "kornflakes", "flakes"] },
            { label: "Maismehl", points: 1, keywords: ["maismehl", "mehl"] },
            { label: "Tierfutter", points: 1, keywords: ["tierfutter", "futter"] }
          ]
        }
      ]
    },

    /* ===================== TEIL B: KARTOFFEL (50 Punkte) ===================== */
    {
      id: "t9",
      num: 9,
      topic: "potato",
      topicLabel: "Kartoffel",
      type: "map",
      typeLabel: "Landkarte beschriften",
      title: "Landkarte: Die Reise der Kartoffel",
      prompt: "Beschrifte zuerst die 8 Stellen (A–C und 1–5) auf der Landkarte mit dem Wortkasten und bringe dann die 4 Reiseschritte in die richtige Reihenfolge.",
      points: 12,
      wordBank: [
        "Europa",
        "Spanien",
        "Atlantik",
        "Peru (Anden)",
        "Deutschland (Preußen)",
        "Südamerika",
        "Frankreich",
        "England"
      ],
      geoSlots: [
        { id: "m_sa", badge: "A", hint: "Kontinent A", answer: "Südamerika" },
        { id: "m_atl", badge: "B", hint: "Ozean B", answer: "Atlantik" },
        { id: "m_eu", badge: "C", hint: "Kontinent C", answer: "Europa" }
      ],
      routeSlots: [
        { id: "m_peru", badge: "1", hint: "Start ①", answer: "Peru (Anden)" },
        { id: "m_esp", badge: "2", hint: "Station ②", answer: "Spanien" },
        { id: "m_eng", badge: "3", hint: "Station ③", answer: "England" },
        { id: "m_fra", badge: "4", hint: "Station ④", answer: "Frankreich" },
        { id: "m_deu", badge: "5", hint: "Station ⑤", answer: "Deutschland (Preußen)" }
      ],
      orderItems: [
        { id: "ord_1", text: "Die Inkas bauen die Kartoffel in den Anden (Südamerika) an." },
        { id: "ord_2", text: "Spanische Seefahrer bringen die Kartoffel per Schiff über den Atlantik nach Spanien." },
        { id: "ord_3", text: "Sir Francis Drake bringt die Knolle nach England, und sie wandert weiter durch Europa." },
        { id: "ord_4", text: "Friedrich der Große sorgt mit dem Kartoffelbefehl dafür, dass sie in Preußen gegessen wird." }
      ],
      initialOrder: ["ord_2", "ord_4", "ord_1", "ord_3"]
    },
    {
      id: "t10",
      num: 10,
      topic: "potato",
      topicLabel: "Kartoffel",
      type: "diagram",
      typeLabel: "Bild beschriften",
      title: "Aufbau der Kartoffelpflanze",
      prompt: "Beschrifte die 7 nummerierten Teile der Kartoffelpflanze mit den Wörtern aus dem Wortkasten.",
      points: 7,
      badgeClass: "badge-potato",
      svgFn: () => window.SachkundeArt.getPotatoPlantSVG(),
      wordBank: ["Wurzel", "Blüte", "neue Knollen", "Stängel", "Beere (giftig)", "Mutterknolle", "Blätter"],
      leftSlots: [
        { id: "p1", badge: "1", answer: "Blüte" },
        { id: "p2", badge: "2", answer: "Stängel" },
        { id: "p3", badge: "3", answer: "Mutterknolle" }
      ],
      rightSlots: [
        { id: "p4", badge: "4", answer: "Beere (giftig)" },
        { id: "p5", badge: "5", answer: "Blätter" },
        { id: "p6", badge: "6", answer: "Wurzel" },
        { id: "p7", badge: "7", answer: "neue Knollen" }
      ]
    },
    {
      id: "t11",
      num: 11,
      topic: "potato",
      topicLabel: "Kartoffel",
      type: "mc",
      typeLabel: "Multiple Choice",
      title: "Knolle oder Wurzel – und was ist giftig?",
      prompt: "Beantworte die Fragen zur Kartoffelpflanze. Achte genau auf die Hinweise!",
      points: 6,
      questions: [
        {
          id: "q11a",
          text: "a) Die Kartoffel wächst unter der Erde. Ist sie deshalb eine Wurzel?",
          mode: "single",
          points: 2,
          singleCol: true,
          options: [
            "Nein, die Kartoffel ist eine Knolle (ein verdickter unterirdischer Spross), keine Wurzel.",
            "Ja, alles was unter der Erde wächst, ist immer eine Wurzel.",
            "Nein, sie ist ein Getreidekorn.",
            "Nein, sie ist eine grüne Beere."
          ],
          correct: [0]
        },
        {
          id: "q11b",
          text: "b) Welche Teile der Kartoffelpflanze sind GIFTIG und dürfen nicht gegessen werden?",
          hint: "Wähle alle 3 richtigen Antworten!",
          mode: "multi",
          points: 3,
          options: [
            "Die grünen Beeren (Früchte)",
            "Die geschälte, gekochte gelbe Kartoffelknolle",
            "Die grünen Blätter und Stängel",
            "Grüne Stellen und Keime an der Kartoffel",
            "Kartoffelpüree aus gekochten Kartoffeln"
          ],
          correct: [0, 2, 3]
        },
        {
          id: "q11c",
          text: "c) Warum isst man Kartoffeln nicht roh, sondern gekocht, gebraten oder gebacken?",
          mode: "single",
          points: 1,
          singleCol: true,
          options: [
            "Rohe Kartoffeln sind schwer verdaulich und enthalten ungesunde Stoffe, die beim Erhitzen verschwinden.",
            "Weil gekochte Kartoffeln zu Mehl zerfallen.",
            "Weil rohe Kartoffeln sonst wegrollen."
          ],
          correct: [0]
        }
      ]
    },
    {
      id: "t12",
      num: 12,
      topic: "potato",
      topicLabel: "Kartoffel",
      type: "cloze",
      typeLabel: "Lückentext",
      title: "Die Inkas und die Reise über das Meer",
      prompt: "Setze die passenden Wörter aus dem Wortkasten in die Lücken ein.",
      points: 6,
      wordBank: ["Europa", "Anden", "Schiffen", "Inkas", "Südamerika", "spanische"],
      segments: [
        "Vor vielen tausend Jahren bauten die ",
        { id: "c12_1", answer: "Inkas" },
        " die Kartoffel hoch im Gebirge der ",
        { id: "c12_2", answer: "Anden" },
        " in ",
        { id: "c12_3", answer: "Südamerika" },
        " an. Für sie war die Knolle ein sehr wichtiges Nahrungsmittel. Im 16. Jahrhundert kamen ",
        { id: "c12_4", answer: "spanische" },
        " Seefahrer in das Land und entdeckten die unbekannte Pflanze. Sie nahmen Kartoffeln auf ihren ",
        { id: "c12_5", answer: "Schiffen" },
        " mit über den Atlantik nach ",
        { id: "c12_6", answer: "Europa" },
        "."
      ]
    },
    {
      id: "t13",
      num: 13,
      topic: "potato",
      topicLabel: "Kartoffel",
      type: "mc",
      typeLabel: "Multiple Choice",
      title: "Bekannte Personen auf der Reise der Kartoffel",
      prompt: "Wähle bei jeder Frage die richtige Antwort aus.",
      points: 6,
      questions: [
        {
          id: "q13a",
          text: "a) Welcher berühmte englische Seefahrer soll die Kartoffel nach England gebracht haben?",
          mode: "single",
          points: 2,
          options: [
            "Sir Francis Drake",
            "König Friedrich der Große",
            "Ein Inka-Bauer",
            "Opa Karl"
          ],
          correct: [0]
        },
        {
          id: "q13b",
          text: "b) Wie nannten die Menschen König Friedrich den Großen von Preußen auch?",
          mode: "single",
          points: 2,
          options: [
            "Kartoffel-König",
            "Alter Fritz",
            "Sir Francis",
            "Großer Seefahrer"
          ],
          correct: [1]
        },
        {
          id: "q13c",
          text: "c) Was war der „Kartoffelbefehl“ von Friedrich dem Großen?",
          mode: "single",
          points: 2,
          singleCol: true,
          options: [
            "Ein Verbot, Kartoffeln nach Europa zu bringen.",
            "Ein altes Rezept für Pommes frites.",
            "Eine Anordnung an die Bauern, Kartoffeln anzubauen, damit die Menschen bei Hungersnöten genug zu essen hatten.",
            "Der Befehl, nur noch die grünen Kartoffelblüten zu pflücken."
          ],
          correct: [2]
        }
      ]
    },
    {
      id: "t14",
      num: 14,
      topic: "potato",
      topicLabel: "Kartoffel",
      type: "cloze",
      typeLabel: "Lückentext",
      title: "Warum wollte anfangs niemand die Kartoffel essen?",
      prompt: "Fülle den Lückentext mit den Wörtern aus dem Wortkasten aus.",
      points: 6,
      wordBank: ["Knolle", "giftig", "Blüten", "Bauchschmerzen", "Zierpflanze", "Beeren"],
      segments: [
        "Als die Kartoffel nach Europa kam, waren die Menschen sehr misstrauisch. Weil ihre weißen und violetten ",
        { id: "c14_1", answer: "Blüten" },
        " so hübsch aussahen, pflanzten reiche Leute sie zuerst nur als ",
        { id: "c14_2", answer: "Zierpflanze" },
        " in ihren Gärten. Manche Menschen wussten nicht, welchen Teil man isst, und probierten die grünen ",
        { id: "c14_3", answer: "Beeren" },
        " über der Erde. Doch diese sind ",
        { id: "c14_4", answer: "giftig" },
        " und sorgten für schlimme ",
        { id: "c14_5", answer: "Bauchschmerzen" },
        "! Erst später lernten die Menschen, dass die gekochte ",
        { id: "c14_6", answer: "Knolle" },
        " unter der Erde köstlich schmeckt und lange satt macht."
      ]
    },
    {
      id: "t15",
      num: 15,
      topic: "potato",
      topicLabel: "Kartoffel",
      type: "reading",
      typeLabel: "Textaufgabe",
      title: "Lesetext: Die schlaue List des „Alten Fritz“",
      prompt: "Lies die Geschichte über König Friedrich den Großen und beantworte die drei Fragen dazu.",
      points: 7,
      passageTitle: "📖 Die bewachten Kartoffelfelder",
      passageText:
        "In Preußen gab es oft schlechte Getreideernten und die Menschen litten Hunger. König Friedrich der Große – auch „Alter Fritz“ genannt – wusste, dass die Kartoffel viele Menschen satt machen konnte. Doch die Bauern glaubten ihm nicht und wollten die fremde Knolle nicht anbauen. Da hatte der König eine schlaue Idee: Er ließ vor Berlin große Kartoffelfelder anlegen und stellte Soldaten als Wachen rund um die Felder auf. Den Soldaten befahl er heimlich, nachts besonders unaufmerksam zu sein und wegzuschauen. Die Bauern dachten sofort: „Wenn der König diese Pflanzen von Soldaten bewachen lässt, müssen sie sehr wertvoll sein!“ In der Nacht schlichen sie sich auf die Felder, stahlen die Kartoffeln und pflanzten sie auf ihren eigenen Äckern an – genau so, wie es der König gewollt hatte.",
      questions: [
        {
          id: "r15a",
          text: "a) Warum wollte König Friedrich der Große unbedingt, dass die Bauern Kartoffeln anbauen?",
          placeholder: "Schreibe den Grund aus dem Text auf ...",
          points: 2,
          mode: "anyOne",
          modelAnswer: "Weil es oft schlechte Getreideernten gab, die Menschen Hunger litten und die Kartoffel viele Menschen satt machen konnte.",
          criteria: [
            {
              label: "gegen Hunger / schlechte Ernte / satt machen",
              points: 2,
              keywords: [
                "hunger",
                "hungersnot",
                "verhungern",
                "satt",
                "schlechte ernte",
                "getreideernte",
                "genug zu essen",
                "nahrung",
                "ernaehren",
                "essen"
              ]
            }
          ]
        },
        {
          id: "r15b",
          text: "b) Welche schlaue List nutzte der König mit seinen Soldaten? (Was taten sie, und was sollten sie nachts heimlich tun?)",
          placeholder: "Nenne beide Teile der List ...",
          points: 2,
          mode: "all",
          modelAnswer: "Er ließ die Felder von Soldaten bewachen, aber befahl ihnen heimlich, nachts unaufmerksam zu sein und wegzuschauen.",
          criteria: [
            { label: "Soldaten bewachten die Felder", points: 1, keywords: ["soldat", "soldaten", "wache", "wachen", "bewach", "aufpass"] },
            {
              label: "nachts wegschauen / unaufmerksam sein",
              points: 1,
              keywords: ["wegschau", "wegseh", "unaufmerksam", "nicht aufpass", "schlaf", "stehlen lass", "klauen lass", "augen zu", "ignorier", "nicht hinguck", "wegzuschau"]
            }
          ]
        },
        {
          id: "r15c",
          text: "c) Was dachten die Bauern wegen der Wachen, und was taten sie dann in der Nacht?",
          placeholder: "Was dachten sie? Was machten sie mit den Kartoffeln?",
          points: 3,
          mode: "all",
          modelAnswer: "Sie dachten, die Kartoffeln sind sehr wertvoll. Nachts stahlen sie die Kartoffeln und pflanzten sie auf ihren eigenen Äckern an.",
          criteria: [
            { label: "hielten sie für wertvoll / besonders", points: 1, keywords: ["wertvoll", "kostbar", "teuer", "besonders", "schatz", "wichtig", "gut", "lecker", "edel"] },
            { label: "stahlen / klauten die Kartoffeln", points: 1, keywords: ["stahlen", "stehlen", "gestohlen", "klauten", "klauen", "geklaut", "nahmen", "holten", "raubten"] },
            { label: "pflanzten sie auf eigenen Feldern an", points: 1, keywords: ["pflanz", "anbau", "bauten", "saeten", "acker", "aecker", "eigen"] }
          ]
        }
      ]
    }
  ];

  /* ------------------------------------------------------------------------
     App-Zustand
     ------------------------------------------------------------------------ */
  const state = {
    mode: "start", // "start" | "exam" | "results" | "review"
    currentIdx: 0,
    remainingSeconds: EXAM_DURATION_SECONDS,
    timerId: null,
    finishedByTimeout: false,
    answers: {},
    ui: {
      activeSlotId: null,
      selectedWord: null
    },
    evaluation: null
  };

  /* ------------------------------------------------------------------------
     DOM-Elemente
     ------------------------------------------------------------------------ */
  const el = {
    headerSub: document.getElementById("headerSub"),
    timerBadge: document.getElementById("timerBadge"),
    timerText: document.getElementById("timerText"),
    btnBackToResults: document.getElementById("btnBackToResults"),
    btnHeaderSubmit: document.getElementById("btnHeaderSubmit"),
    taskNav: document.getElementById("taskNav"),
    taskTabs: document.getElementById("taskTabs"),

    startScreen: document.getElementById("startScreen"),
    examScreen: document.getElementById("examScreen"),
    resultsScreen: document.getElementById("resultsScreen"),
    examFooter: document.getElementById("examFooter"),

    btnStartExam: document.getElementById("btnStartExam"),
    taskNumBadge: document.getElementById("taskNumBadge"),
    taskTitle: document.getElementById("taskTitle"),
    taskTopicTag: document.getElementById("taskTopicTag"),
    taskTypeTag: document.getElementById("taskTypeTag"),
    taskPoints: document.getElementById("taskPoints"),
    taskPrompt: document.getElementById("taskPrompt"),
    reviewBanner: document.getElementById("reviewBanner"),
    taskBody: document.getElementById("taskBody"),

    btnPrevTask: document.getElementById("btnPrevTask"),
    btnNextTask: document.getElementById("btnNextTask"),
    btnFooterSubmit: document.getElementById("btnFooterSubmit"),
    footerProgress: document.getElementById("footerProgress"),

    resultBadge: document.getElementById("resultBadge"),
    resultsHeading: document.getElementById("resultsHeading"),
    resultsSub: document.getElementById("resultsSub"),
    gradeMedallion: document.getElementById("gradeMedallion"),
    gradeNumber: document.getElementById("gradeNumber"),
    gradeWord: document.getElementById("gradeWord"),
    statPoints: document.getElementById("statPoints"),
    statPercent: document.getElementById("statPercent"),
    statTime: document.getElementById("statTime"),
    statGrain: document.getElementById("statGrain"),
    statPotato: document.getElementById("statPotato"),
    barGrain: document.getElementById("barGrain"),
    barPotato: document.getElementById("barPotato"),
    resultsTaskGrid: document.getElementById("resultsTaskGrid"),
    btnReviewFirst: document.getElementById("btnReviewFirst"),
    btnRestart: document.getElementById("btnRestart"),

    submitDialog: document.getElementById("submitDialog"),
    submitDialogText: document.getElementById("submitDialogText"),
    btnCancelSubmit: document.getElementById("btnCancelSubmit"),
    btnConfirmSubmit: document.getElementById("btnConfirmSubmit"),

    timeoutDialog: document.getElementById("timeoutDialog"),
    btnCloseTimeout: document.getElementById("btnCloseTimeout")
  };

  /* ------------------------------------------------------------------------
     Hilfsfunktionen
     ------------------------------------------------------------------------ */
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatTime(totalSec) {
    const s = Math.max(0, Math.floor(totalSec));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function initAnswers() {
    const ans = {};
    for (const task of TASKS) {
      if (task.type === "diagram") {
        ans[task.id] = {};
      } else if (task.type === "varieties") {
        ans[task.id] = {};
      } else if (task.type === "cloze") {
        ans[task.id] = {};
      } else if (task.type === "map") {
        ans[task.id] = {
          slots: {},
          order: task.initialOrder.slice(),
          orderTouched: false
        };
      } else if (task.type === "mc") {
        ans[task.id] = {};
        for (const q of task.questions) {
          ans[task.id][q.id] = q.mode === "multi" ? [] : null;
        }
      } else if (task.type === "binary") {
        ans[task.id] = {};
      } else if (task.type === "reading") {
        ans[task.id] = {};
        for (const q of task.questions) {
          ans[task.id][q.id] = "";
        }
      }
    }
    state.answers = ans;
  }

  /* Prüft, ob ein Kind an einer Aufgabe bereits etwas eingetragen hat */
  function isTaskAnswered(task) {
    const a = state.answers[task.id];
    if (!a) return false;
    if (task.type === "diagram" || task.type === "varieties" || task.type === "cloze" || task.type === "binary") {
      return Object.values(a).some((v) => v !== null && v !== undefined && v !== "");
    }
    if (task.type === "map") {
      return Object.values(a.slots).some((v) => Boolean(v)) || a.orderTouched;
    }
    if (task.type === "mc") {
      return task.questions.some((q) => {
        const val = a[q.id];
        return q.mode === "multi" ? Array.isArray(val) && val.length > 0 : val !== null && val !== undefined;
      });
    }
    if (task.type === "reading") {
      return task.questions.some((q) => String(a[q.id] || "").trim().length > 0);
    }
    return false;
  }

  /* ------------------------------------------------------------------------
     Fehlertolerante deutsche Stichwort-Auswertung (für Textaufgaben)
     ------------------------------------------------------------------------ */
  function normalizeDe(str) {
    return String(str || "")
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function simplifyUmlauts(str) {
    return str.replace(/ae/g, "a").replace(/oe/g, "o").replace(/ue/g, "u");
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const dp = new Array(n + 1);
    for (let j = 0; j <= n; j++) dp[j] = j;
    for (let i = 1; i <= m; i++) {
      let prev = dp[0];
      dp[0] = i;
      for (let j = 1; j <= n; j++) {
        const temp = dp[j];
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
        prev = temp;
      }
    }
    return dp[n];
  }

  function matchesKeyword(userText, rawKeyword) {
    const normUser = normalizeDe(userText);
    if (!normUser) return false;
    const normKw = normalizeDe(rawKeyword);
    if (!normKw) return false;

    // 1. Direkter Teilstring-Treffer (erkennt auch Zusammensetzungen wie "Maiskolben")
    if (normUser.includes(normKw)) return true;

    // 2. Umlaut-vereinfachter Teilstring-Treffer (z. B. "Mahdrescher" / "Blatter")
    const simpUser = simplifyUmlauts(normUser);
    const simpKw = simplifyUmlauts(normKw);
    if (simpUser.includes(simpKw)) return true;

    // 3. Leichte Tippfehler-Toleranz für Einzelwörter (für 3. Klasse!)
    if (!simpKw.includes(" ") && simpKw.length >= 5) {
      const maxDist = simpKw.length >= 8 ? 2 : 1;
      const tokens = simpUser.split(" ");
      for (const tok of tokens) {
        if (tok.length < 4) continue;
        if (Math.abs(tok.length - simpKw.length) <= maxDist && levenshtein(tok, simpKw) <= maxDist) {
          return true;
        }
        // Prüfe Wortanfang (z. B. "dreschflegln" gegen Stamm "dreschflegel")
        if (tok.length > simpKw.length) {
          const pref = tok.slice(0, simpKw.length);
          if (levenshtein(pref, simpKw) <= maxDist) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function evaluateReadingQuestion(q, rawAnswer) {
    const answerText = String(rawAnswer || "").trim();
    const critResults = q.criteria.map((c) => {
      const hit = c.keywords.some((kw) => matchesKeyword(answerText, kw));
      return { label: c.label, hit, points: c.points };
    });

    let earned = 0;
    if (q.mode === "anyOne") {
      earned = critResults.some((r) => r.hit) ? q.points : 0;
    } else if (q.mode === "anyN") {
      const hits = critResults.filter((r) => r.hit).length;
      earned = Math.min(q.points, hits);
    } else {
      earned = critResults.reduce((sum, r) => sum + (r.hit ? r.points : 0), 0);
    }
    earned = Math.min(q.points, Math.max(0, earned));

    return {
      earned,
      max: q.points,
      criteria: critResults,
      answerText,
      modelAnswer: q.modelAnswer
    };
  }

  /* ------------------------------------------------------------------------
     Gesamtauswertung & Standard-Notenschlüssel (AGENTS.md)
     ------------------------------------------------------------------------ */
  function calculateGrade(percent) {
    if (percent >= 95) return { num: 1, word: "Sehr gut", tone: "good", msg: "Herausragend! Du kennst dich bei Getreide und der Reise der Kartoffel richtig super aus!" };
    if (percent >= 81) return { num: 2, word: "Gut", tone: "good", msg: "Klasse gemacht! Du hast sehr viel gewusst und sicher gelöst." };
    if (percent >= 66) return { num: 3, word: "Befriedigend", tone: "good", msg: "Gut gemacht! Ein paar Kleinigkeiten kannst du in der Übersicht noch einmal anschauen." };
    if (percent >= 51) return { num: 4, word: "Ausreichend", tone: "warn", msg: "Geschafft! Schau dir die markierten Lösungen in Ruhe an – beim nächsten Mal klappt es noch besser." };
    if (percent >= 26) return { num: 5, word: "Mangelhaft", tone: "bad", msg: "Ein guter Anfang! Geh die Aufgaben gemeinsam durch und probiere die Probeklausur einfach noch einmal." };
    return { num: 6, word: "Ungenügend", tone: "bad", msg: "Kein Problem – genau dafür üben wir! Schau dir die Lösungen an und starte gleich noch einen Versuch." };
  }

  function evaluateExam() {
    let totalEarned = 0;
    let totalMax = 0;
    let grainEarned = 0;
    let grainMax = 0;
    let potatoEarned = 0;
    let potatoMax = 0;
    const perTask = {};

    for (const task of TASKS) {
      let earned = 0;
      const details = {};

      if (task.type === "diagram") {
        const allSlots = [...task.leftSlots, ...task.rightSlots];
        const a = state.answers[task.id] || {};
        for (const s of allSlots) {
          const ok = a[s.id] === s.answer;
          details[s.id] = ok ? "good" : "bad";
          if (ok) earned += 1;
        }
      } else if (task.type === "varieties") {
        const a = state.answers[task.id] || {};
        for (const item of task.items) {
          const ok = a[item.id] === item.answer;
          details[item.id] = ok ? "good" : "bad";
          if (ok) earned += 1;
        }
      } else if (task.type === "cloze") {
        const a = state.answers[task.id] || {};
        for (const seg of task.segments) {
          if (typeof seg === "object") {
            const ok = a[seg.id] === seg.answer;
            details[seg.id] = ok ? "good" : "bad";
            if (ok) earned += 1;
          }
        }
      } else if (task.type === "map") {
        const a = state.answers[task.id];
        const allSlots = [...task.geoSlots, ...task.routeSlots];
        details.slots = {};
        for (const s of allSlots) {
          const ok = a.slots[s.id] === s.answer;
          details.slots[s.id] = ok ? "good" : "bad";
          if (ok) earned += 1;
        }
        details.order = [];
        for (let i = 0; i < task.orderItems.length; i++) {
          const expectedId = task.orderItems[i].id;
          const ok = a.order[i] === expectedId;
          details.order.push(ok ? "good" : "bad");
          if (ok) earned += 1;
        }
      } else if (task.type === "mc") {
        const a = state.answers[task.id];
        for (const q of task.questions) {
          const val = a[q.id];
          if (q.mode === "single") {
            const ok = val === q.correct[0];
            const pts = ok ? q.points : 0;
            earned += pts;
            details[q.id] = { earned: pts, max: q.points };
          } else {
            const selected = Array.isArray(val) ? val : [];
            let hits = 0;
            let wrong = 0;
            for (const idx of selected) {
              if (q.correct.includes(idx)) hits++;
              else wrong++;
            }
            const pts = Math.max(0, Math.min(q.points, hits - wrong));
            earned += pts;
            details[q.id] = { earned: pts, max: q.points };
          }
        }
      } else if (task.type === "binary") {
        const a = state.answers[task.id];
        for (const st of task.statements) {
          const ok = a[st.id] === st.answer;
          details[st.id] = ok ? "good" : "bad";
          if (ok) earned += 1;
        }
      } else if (task.type === "reading") {
        const a = state.answers[task.id];
        for (const q of task.questions) {
          const res = evaluateReadingQuestion(q, a[q.id]);
          earned += res.earned;
          details[q.id] = res;
        }
      }

      const status = earned === task.points ? "good" : earned > 0 ? "partial" : "bad";
      perTask[task.id] = { earned, max: task.points, status, details };

      totalEarned += earned;
      totalMax += task.points;
      if (task.topic === "grain") {
        grainEarned += earned;
        grainMax += task.points;
      } else {
        potatoEarned += earned;
        potatoMax += task.points;
      }
    }

    const percent = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;
    const grade = calculateGrade(percent);
    const usedSeconds = EXAM_DURATION_SECONDS - state.remainingSeconds;

    return {
      totalEarned,
      totalMax,
      percent,
      grade,
      usedSeconds,
      grainEarned,
      grainMax,
      potatoEarned,
      potatoMax,
      perTask
    };
  }

  /* ------------------------------------------------------------------------
     Timer (45-Minuten-Countdown)
     ------------------------------------------------------------------------ */
  function updateTimerDisplay() {
    el.timerText.textContent = formatTime(state.remainingSeconds);
    el.timerBadge.classList.remove("timer-warn", "timer-danger");
    if (state.mode === "exam") {
      if (state.remainingSeconds <= 60) {
        el.timerBadge.classList.add("timer-danger");
      } else if (state.remainingSeconds <= 5 * 60) {
        el.timerBadge.classList.add("timer-warn");
      }
    }
  }

  function startTimer() {
    stopTimer();
    updateTimerDisplay();
    state.timerId = window.setInterval(() => {
      if (state.mode !== "exam") return;
      state.remainingSeconds -= 1;
      if (state.remainingSeconds <= 0) {
        state.remainingSeconds = 0;
        updateTimerDisplay();
        finishExam(true);
      } else {
        updateTimerDisplay();
      }
    }, 1000);
  }

  function stopTimer() {
    if (state.timerId !== null) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  /* ------------------------------------------------------------------------
     Bildschirm-Wechsel & Navigation
     ------------------------------------------------------------------------ */
  function showScreen(mode) {
    state.mode = mode;
    el.startScreen.hidden = mode !== "start";
    el.examScreen.hidden = mode !== "exam" && mode !== "review";
    el.resultsScreen.hidden = mode !== "results";

    const showNav = mode === "exam" || mode === "review";
    el.taskNav.hidden = !showNav;
    el.examFooter.hidden = !showNav;

    el.btnHeaderSubmit.hidden = mode !== "exam";
    el.btnBackToResults.hidden = mode !== "review";

    if (mode === "start") {
      el.headerSub.textContent = "Getreide & Die Reise der Kartoffel · 15 Aufgaben · 45 Min.";
    } else if (mode === "exam") {
      el.headerSub.textContent = "Klassenarbeit läuft · 15 Aufgaben · 100 Punkte";
    } else if (mode === "results") {
      el.headerSub.textContent = "Auswertung · Getreide & Die Reise der Kartoffel";
    } else if (mode === "review") {
      el.headerSub.textContent = "Korrektur-Ansicht · Lösungen im Überblick";
    }

    updateTimerDisplay();
  }

  function renderTabs() {
    el.taskTabs.innerHTML = "";
    TASKS.forEach((task, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "task-tab";
      btn.textContent = String(task.num);
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", idx === state.currentIdx ? "true" : "false");
      btn.title = `Aufgabe ${task.num}: ${task.title}`;

      if (idx === state.currentIdx) {
        btn.classList.add("is-current");
      }

      if (state.mode === "review" && state.evaluation) {
        const res = state.evaluation.perTask[task.id];
        btn.classList.add(`is-review-${res.status}`);
      } else if (isTaskAnswered(task)) {
        btn.classList.add("is-answered");
      }

      btn.addEventListener("click", () => {
        goToTask(idx);
      });
      el.taskTabs.appendChild(btn);
    });
  }

  function goToTask(idx) {
    state.currentIdx = Math.max(0, Math.min(TASKS.length - 1, idx));
    state.ui.activeSlotId = null;
    state.ui.selectedWord = null;
    renderTabs();
    renderCurrentTask();
    el.taskBody.scrollTop = 0;
  }

  /* ------------------------------------------------------------------------
     Wortkasten-Interaktion (intuitiv in beide Richtungen!)
     ------------------------------------------------------------------------ */
  function getSlotIdsForTask(task) {
    if (task.type === "diagram") {
      return [...task.leftSlots, ...task.rightSlots].map((s) => s.id);
    }
    if (task.type === "varieties") {
      return task.items.map((i) => i.id);
    }
    if (task.type === "cloze") {
      return task.segments.filter((s) => typeof s === "object").map((s) => s.id);
    }
    if (task.type === "map") {
      return [...task.geoSlots, ...task.routeSlots].map((s) => s.id);
    }
    return [];
  }

  function getSlotMap(task) {
    if (task.type === "map") return state.answers[task.id].slots;
    return state.answers[task.id];
  }

  function findNextEmptySlot(task, afterSlotId) {
    const ids = getSlotIdsForTask(task);
    const map = getSlotMap(task);
    const startIdx = afterSlotId ? ids.indexOf(afterSlotId) + 1 : 0;
    for (let i = startIdx; i < ids.length; i++) {
      if (!map[ids[i]]) return ids[i];
    }
    for (let i = 0; i < startIdx; i++) {
      if (!map[ids[i]]) return ids[i];
    }
    return null;
  }

  function handleWordChipClick(task, word) {
    if (state.mode !== "exam") return;
    const map = getSlotMap(task);

    // Falls Wort bereits benutzt ist, nichts tun (erst Feld antippen zum Entfernen)
    if (Object.values(map).includes(word)) return;

    if (state.ui.activeSlotId) {
      map[state.ui.activeSlotId] = word;
      const next = findNextEmptySlot(task, state.ui.activeSlotId);
      state.ui.activeSlotId = next;
      state.ui.selectedWord = null;
    } else if (state.ui.selectedWord === word) {
      state.ui.selectedWord = null;
    } else {
      state.ui.selectedWord = word;
    }

    renderTabs();
    renderCurrentTask();
  }

  function handleSlotClick(task, slotId) {
    if (state.mode !== "exam") return;
    const map = getSlotMap(task);

    if (state.ui.selectedWord) {
      // Falls das gewählte Wort schon woanders steht, dort entfernen
      for (const k of Object.keys(map)) {
        if (map[k] === state.ui.selectedWord) delete map[k];
      }
      map[slotId] = state.ui.selectedWord;
      state.ui.selectedWord = null;
      state.ui.activeSlotId = null;
    } else if (map[slotId]) {
      // Gefülltes Feld antippen -> Wort zurück in den Wortkasten & Feld aktivieren
      delete map[slotId];
      state.ui.activeSlotId = slotId;
    } else {
      // Leeres Feld antippen -> Feld aktivieren
      state.ui.activeSlotId = state.ui.activeSlotId === slotId ? null : slotId;
    }

    renderTabs();
    renderCurrentTask();
  }

  function renderWordBank(task) {
    const isReview = state.mode === "review";
    const map = getSlotMap(task);
    const usedWords = new Set(Object.values(map).filter(Boolean));

    const box = document.createElement("div");
    box.className = "word-bank-box";

    const label = document.createElement("div");
    label.className = "word-bank-label";
    label.innerHTML = `
      <span>📦 Wortkasten</span>
      <span class="word-bank-hint">${
        isReview
          ? "Korrektur-Ansicht"
          : "Tippe ein Wort an und dann ein Feld (oder erst das Feld, dann das Wort). Zum Entfernen das Feld erneut antippen."
      }</span>
    `;
    box.appendChild(label);

    const chips = document.createElement("div");
    chips.className = "word-bank-chips";

    for (const word of task.wordBank) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "word-chip";
      btn.textContent = word;
      const isUsed = usedWords.has(word);
      if (isUsed) btn.classList.add("is-used");
      if (state.ui.selectedWord === word) btn.classList.add("is-selected");
      btn.disabled = isReview || isUsed;
      btn.addEventListener("click", () => handleWordChipClick(task, word));
      chips.appendChild(btn);
    }

    box.appendChild(chips);
    return box;
  }

  function createSlotButton(task, slot, badgeClass, reviewStatus) {
    const isReview = state.mode === "review";
    const map = getSlotMap(task);
    const val = map[slot.id] || "";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "slot-btn";
    if (state.ui.activeSlotId === slot.id && !isReview) btn.classList.add("is-active");
    if (val && !isReview) btn.classList.add("is-filled");
    if (isReview) {
      btn.classList.add(reviewStatus === "good" ? "is-good" : "is-bad");
      btn.disabled = true;
    }

    const badge = document.createElement("span");
    badge.className = `slot-badge ${badgeClass || ""}`;
    badge.textContent = slot.badge;
    btn.appendChild(badge);

    const textWrap = document.createElement("span");
    textWrap.className = "slot-text-wrap";

    const valSpan = document.createElement("span");
    valSpan.className = "slot-value";
    valSpan.textContent = val || (slot.hint ? `${slot.hint} …` : "Wort wählen …");
    textWrap.appendChild(valSpan);

    if (isReview && reviewStatus !== "good") {
      const fix = document.createElement("span");
      fix.className = "slot-correction";
      fix.textContent = `✓ Richtig: ${slot.answer}`;
      textWrap.appendChild(fix);
    }

    btn.appendChild(textWrap);
    btn.addEventListener("click", () => handleSlotClick(task, slot.id));
    return btn;
  }

  /* ------------------------------------------------------------------------
     Render-Funktionen je Aufgabentyp
     ------------------------------------------------------------------------ */
  function renderCurrentTask() {
    const task = TASKS[state.currentIdx];
    const isReview = state.mode === "review";
    const taskEval = isReview && state.evaluation ? state.evaluation.perTask[task.id] : null;

    el.taskNumBadge.textContent = `Aufgabe ${task.num}`;
    el.taskTitle.textContent = task.title;
    el.taskTopicTag.textContent = task.topic === "grain" ? "🌾 Getreide" : "🥔 Kartoffel";
    el.taskTopicTag.className = `task-topic-tag ${task.topic === "grain" ? "tag-grain" : "tag-potato"}`;
    el.taskTypeTag.textContent = task.typeLabel;
    el.taskPoints.textContent = isReview && taskEval
      ? `${taskEval.earned} / ${task.points} Punkte`
      : `${task.points} Punkte`;
    el.taskPrompt.textContent = task.prompt;

    if (isReview && taskEval) {
      el.reviewBanner.hidden = false;
      el.reviewBanner.className = `review-banner is-${taskEval.status}`;
      if (taskEval.status === "good") {
        el.reviewBanner.textContent = `✅ Volle Punktzahl! Du hast alle ${task.points} Punkte geholt.`;
      } else if (taskEval.status === "partial") {
        el.reviewBanner.textContent = `⭐ Teilweise richtig: ${taskEval.earned} von ${task.points} Punkten. Unten siehst du die genauen Lösungen.`;
      } else {
        el.reviewBanner.textContent = `💡 0 von ${task.points} Punkten. Schau dir unten die richtige Lösung an!`;
      }
    } else {
      el.reviewBanner.hidden = true;
    }

    // Fußzeile aktualisieren
    el.footerProgress.textContent = `Aufgabe ${task.num} von ${TASKS.length}`;
    el.btnPrevTask.disabled = state.currentIdx === 0;

    const isLast = state.currentIdx === TASKS.length - 1;
    if (isReview) {
      el.btnNextTask.hidden = false;
      el.btnNextTask.disabled = isLast;
      el.btnFooterSubmit.hidden = true;
    } else {
      el.btnNextTask.hidden = isLast;
      el.btnNextTask.disabled = false;
      el.btnFooterSubmit.hidden = !isLast;
    }

    // Aufgaben-Inhalt rendern
    el.taskBody.innerHTML = "";
    if (task.type === "diagram") {
      renderDiagramTask(task, taskEval);
    } else if (task.type === "varieties") {
      renderVarietiesTask(task, taskEval);
    } else if (task.type === "map") {
      renderMapTask(task, taskEval);
    } else if (task.type === "cloze") {
      renderClozeTask(task, taskEval);
    } else if (task.type === "mc") {
      renderMcTask(task, taskEval);
    } else if (task.type === "binary") {
      renderBinaryTask(task, taskEval);
    } else if (task.type === "reading") {
      renderReadingTask(task, taskEval);
    }
  }

  /* Typ 1: Pflanzen-Diagramm beschriften (Aufgaben 1 & 10) */
  function renderDiagramTask(task, taskEval) {
    el.taskBody.appendChild(renderWordBank(task));

    const layout = document.createElement("div");
    layout.className = "diagram-layout";

    const leftCol = document.createElement("div");
    leftCol.className = "diagram-slots-col";
    for (const s of task.leftSlots) {
      const st = taskEval ? taskEval.details[s.id] : null;
      leftCol.appendChild(createSlotButton(task, s, task.badgeClass, st));
    }

    const fig = document.createElement("div");
    fig.className = "diagram-figure";
    fig.innerHTML = task.svgFn();

    const rightCol = document.createElement("div");
    rightCol.className = "diagram-slots-col";
    for (const s of task.rightSlots) {
      const st = taskEval ? taskEval.details[s.id] : null;
      rightCol.appendChild(createSlotButton(task, s, task.badgeClass, st));
    }

    layout.appendChild(leftCol);
    layout.appendChild(fig);
    layout.appendChild(rightCol);
    el.taskBody.appendChild(layout);
  }

  /* Typ 2: Getreidesorten zuordnen (Aufgabe 2) */
  function renderVarietiesTask(task, taskEval) {
    el.taskBody.appendChild(renderWordBank(task));

    const grid = document.createElement("div");
    grid.className = "varieties-grid";

    for (const item of task.items) {
      const card = document.createElement("div");
      card.className = "variety-card";

      const artWrap = document.createElement("div");
      artWrap.innerHTML = window.SachkundeArt.getGrainVarietySVG(item.art);
      card.appendChild(artWrap);

      const clue = document.createElement("div");
      clue.className = "variety-clue";
      clue.textContent = item.clue;
      card.appendChild(clue);

      const st = taskEval ? taskEval.details[item.id] : null;
      card.appendChild(createSlotButton(task, item, "", st));

      grid.appendChild(card);
    }

    el.taskBody.appendChild(grid);
  }

  /* Typ 3: Landkarte + Reihenfolge (Aufgabe 9) */
  function renderMapTask(task, taskEval) {
    const isReview = state.mode === "review";
    const ans = state.answers[task.id];

    const wrap = document.createElement("div");
    wrap.className = "map-task-layout";

    wrap.appendChild(renderWordBank(task));

    const topGrid = document.createElement("div");
    topGrid.className = "map-top-grid";

    // Landkarte SVG (mit direkt anklickbaren Markern!)
    const mapWrap = document.createElement("div");
    mapWrap.className = "map-canvas-wrap";
    mapWrap.innerHTML = window.SachkundeArt.getPotatoMapSVG(
      ans.slots,
      isReview ? null : state.ui.activeSlotId,
      taskEval ? taskEval.details.slots : null
    );
    if (!isReview) {
      mapWrap.querySelectorAll("[data-map-slot]").forEach((node) => {
        node.addEventListener("click", () => {
          handleSlotClick(task, node.getAttribute("data-map-slot"));
        });
      });
    }
    topGrid.appendChild(mapWrap);

    // 8 Beschriftungs-Felder neben / unter der Karte
    const slotsPanel = document.createElement("div");
    slotsPanel.className = "map-slots-panel";

    const geoTitle = document.createElement("div");
    geoTitle.className = "map-group-title";
    geoTitle.textContent = "Kontinente & Meer (A–C)";
    slotsPanel.appendChild(geoTitle);

    const geoGrid = document.createElement("div");
    geoGrid.className = "map-slots-grid";
    for (const s of task.geoSlots) {
      const st = taskEval ? taskEval.details.slots[s.id] : null;
      geoGrid.appendChild(createSlotButton(task, s, "badge-water", st));
    }
    slotsPanel.appendChild(geoGrid);

    const routeTitle = document.createElement("div");
    routeTitle.className = "map-group-title";
    routeTitle.textContent = "Stationen auf der Route (1–5)";
    slotsPanel.appendChild(routeTitle);

    const routeGrid = document.createElement("div");
    routeGrid.className = "map-slots-grid";
    for (const s of task.routeSlots) {
      const st = taskEval ? taskEval.details.slots[s.id] : null;
      routeGrid.appendChild(createSlotButton(task, s, "badge-route", st));
    }
    slotsPanel.appendChild(routeGrid);

    topGrid.appendChild(slotsPanel);
    wrap.appendChild(topGrid);

    // Teil B: Reihenfolge der Reise (4 Schritte, 4 Punkte)
    const orderSec = document.createElement("div");
    orderSec.className = "order-section";

    const orderTitle = document.createElement("div");
    orderTitle.className = "order-section-title";
    orderTitle.textContent = "Teil 2 (4 Punkte): Bringe die 4 Schritte der Reise in die richtige Reihenfolge (1 = zuerst, 4 = zuletzt):";
    orderSec.appendChild(orderTitle);

    const orderList = document.createElement("div");
    orderList.className = "order-list";

    const itemById = {};
    task.orderItems.forEach((it, idx) => {
      itemById[it.id] = { ...it, correctPos: idx + 1 };
    });

    ans.order.forEach((itemId, idx) => {
      const item = itemById[itemId];
      const row = document.createElement("div");
      row.className = "order-item";

      if (isReview && taskEval) {
        row.classList.add(taskEval.details.order[idx] === "good" ? "is-good" : "is-bad");
      }

      const pos = document.createElement("span");
      pos.className = "order-pos";
      pos.textContent = `${idx + 1}.`;
      row.appendChild(pos);

      const text = document.createElement("div");
      text.className = "order-text";
      text.textContent = item.text;
      if (isReview && taskEval && taskEval.details.order[idx] !== "good") {
        const hint = document.createElement("div");
        hint.className = "slot-correction";
        hint.textContent = `✓ Richtiger Platz: ${item.correctPos}.`;
        text.appendChild(hint);
      }
      row.appendChild(text);

      if (!isReview) {
        const ctrls = document.createElement("div");
        ctrls.className = "order-controls";

        const up = document.createElement("button");
        up.type = "button";
        up.className = "order-move-btn";
        up.textContent = "▲";
        up.setAttribute("aria-label", "Einen Platz nach oben schieben");
        up.disabled = idx === 0;
        up.addEventListener("click", () => {
          const arr = ans.order;
          [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
          ans.orderTouched = true;
          renderTabs();
          renderCurrentTask();
        });

        const down = document.createElement("button");
        down.type = "button";
        down.className = "order-move-btn";
        down.textContent = "▼";
        down.setAttribute("aria-label", "Einen Platz nach unten schieben");
        down.disabled = idx === ans.order.length - 1;
        down.addEventListener("click", () => {
          const arr = ans.order;
          [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
          ans.orderTouched = true;
          renderTabs();
          renderCurrentTask();
        });

        ctrls.appendChild(up);
        ctrls.appendChild(down);
        row.appendChild(ctrls);
      }

      orderList.appendChild(row);
    });

    orderSec.appendChild(orderList);
    wrap.appendChild(orderSec);

    el.taskBody.appendChild(wrap);
  }

  /* Typ 4: Lückentext mit Wortkasten (Aufgaben 5, 12, 14) */
  function renderClozeTask(task, taskEval) {
    const isReview = state.mode === "review";
    const ans = state.answers[task.id];

    // Wenn noch nichts aktiv ist, automatisch erste freie Lücke hervorheben
    if (!isReview && !state.ui.activeSlotId && !state.ui.selectedWord) {
      state.ui.activeSlotId = findNextEmptySlot(task, null);
    }

    el.taskBody.appendChild(renderWordBank(task));

    const card = document.createElement("div");
    card.className = "cloze-card";

    for (const seg of task.segments) {
      if (typeof seg === "string") {
        card.appendChild(document.createTextNode(seg));
      } else {
        const val = ans[seg.id] || "";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cloze-blank";
        btn.textContent = val || "________";

        if (!isReview) {
          if (state.ui.activeSlotId === seg.id) btn.classList.add("is-active");
          if (val) btn.classList.add("is-filled");
          btn.addEventListener("click", () => handleSlotClick(task, seg.id));
        } else {
          const ok = taskEval && taskEval.details[seg.id] === "good";
          btn.classList.add(ok ? "is-good" : "is-bad");
          btn.disabled = true;
        }

        card.appendChild(btn);

        if (isReview && taskEval && taskEval.details[seg.id] !== "good") {
          const fix = document.createElement("span");
          fix.className = "cloze-fix";
          fix.textContent = `✓ ${seg.answer}`;
          card.appendChild(fix);
        }
      }
    }

    el.taskBody.appendChild(card);
  }

  /* Typ 5: Multiple Choice (Aufgaben 3, 4, 11, 13) */
  function renderMcTask(task, taskEval) {
    const isReview = state.mode === "review";
    const ans = state.answers[task.id];

    const list = document.createElement("div");
    list.className = "mc-list";

    for (const q of task.questions) {
      const block = document.createElement("div");
      block.className = "mc-block";

      const head = document.createElement("div");
      head.className = "mc-question-row";
      const qTitle = document.createElement("div");
      qTitle.className = "mc-question";
      qTitle.textContent = q.text;
      head.appendChild(qTitle);

      const meta = document.createElement("span");
      meta.className = "mc-subhint";
      if (isReview && taskEval) {
        meta.textContent = `${taskEval.details[q.id].earned} / ${q.points} Pkt.`;
      } else if (q.hint) {
        meta.textContent = `${q.hint} · ${q.points} Pkt.`;
      } else {
        meta.textContent = `${q.points} ${q.points === 1 ? "Punkt" : "Punkte"}`;
      }
      head.appendChild(meta);
      block.appendChild(head);

      const grid = document.createElement("div");
      grid.className = `mc-options-grid${q.singleCol ? " cols-1" : ""}`;

      q.options.forEach((optText, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mc-option";

        const isSelected = q.mode === "multi"
          ? Array.isArray(ans[q.id]) && ans[q.id].includes(idx)
          : ans[q.id] === idx;
        const isCorrect = q.correct.includes(idx);

        if (!isReview) {
          if (isSelected) btn.classList.add("is-selected");
        } else {
          btn.disabled = true;
          if (isSelected && isCorrect) btn.classList.add("is-good");
          else if (isSelected && !isCorrect) btn.classList.add("is-bad");
          else if (!isSelected && isCorrect) btn.classList.add("is-missed");
        }

        const marker = document.createElement("span");
        marker.className = `mc-marker${q.mode === "multi" ? " is-square" : ""}`;
        if (isReview) {
          if (isSelected && isCorrect) marker.textContent = "✓";
          else if (isSelected && !isCorrect) marker.textContent = "✕";
          else if (!isSelected && isCorrect) marker.textContent = "✓";
        } else if (isSelected) {
          marker.textContent = "✓";
        }

        const label = document.createElement("span");
        label.textContent = optText;

        btn.appendChild(marker);
        btn.appendChild(label);

        if (!isReview) {
          btn.addEventListener("click", () => {
            if (q.mode === "single") {
              ans[q.id] = idx;
            } else {
              const arr = Array.isArray(ans[q.id]) ? ans[q.id].slice() : [];
              const pos = arr.indexOf(idx);
              if (pos >= 0) arr.splice(pos, 1);
              else arr.push(idx);
              ans[q.id] = arr;
            }
            renderTabs();
            renderCurrentTask();
          });
        }

        grid.appendChild(btn);
      });

      block.appendChild(grid);
      list.appendChild(block);
    }

    el.taskBody.appendChild(list);
  }

  /* Typ 5b: Früher oder Heute (Aufgabe 6) */
  function renderBinaryTask(task, taskEval) {
    const isReview = state.mode === "review";
    const ans = state.answers[task.id];

    const list = document.createElement("div");
    list.className = "binary-list";

    task.statements.forEach((st, idx) => {
      const row = document.createElement("div");
      row.className = "binary-row";

      const txt = document.createElement("div");
      txt.className = "binary-statement";
      txt.textContent = `${idx + 1}. ${st.text}`;
      row.appendChild(txt);

      const btns = document.createElement("div");
      btns.className = "binary-btns";

      for (const ch of task.choices) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "binary-choice";
        btn.textContent = ch.label;

        const isSelected = ans[st.id] === ch.value;
        const isCorrect = st.answer === ch.value;

        if (!isReview) {
          if (isSelected) btn.classList.add("is-selected");
          btn.addEventListener("click", () => {
            ans[st.id] = ch.value;
            renderTabs();
            renderCurrentTask();
          });
        } else {
          btn.disabled = true;
          if (isSelected && isCorrect) btn.classList.add("is-good");
          else if (isSelected && !isCorrect) btn.classList.add("is-bad");
          else if (!isSelected && isCorrect) btn.classList.add("is-missed");
        }

        btns.appendChild(btn);
      }

      row.appendChild(btns);
      list.appendChild(row);
    });

    el.taskBody.appendChild(list);
  }

  /* Typ 6: Lesetext + offene Textaufgaben (Aufgaben 7, 8, 15) */
  function renderReadingTask(task, taskEval) {
    const isReview = state.mode === "review";
    const ans = state.answers[task.id];

    const layout = document.createElement("div");
    layout.className = "reading-layout";

    // Lesetext links
    const passage = document.createElement("article");
    passage.className = "reading-passage";
    passage.innerHTML = `
      <div class="reading-passage-title">${escapeHtml(task.passageTitle)}</div>
      <p class="reading-passage-text">${escapeHtml(task.passageText)}</p>
    `;
    layout.appendChild(passage);

    // Fragen rechts
    const qCol = document.createElement("div");
    qCol.className = "text-questions-col";

    for (const q of task.questions) {
      const card = document.createElement("div");
      card.className = "text-q-card";

      const head = document.createElement("div");
      head.className = "text-q-head";

      const lbl = document.createElement("label");
      lbl.className = "text-q-label";
      lbl.setAttribute("for", `input_${q.id}`);
      lbl.textContent = q.text;
      head.appendChild(lbl);

      const pts = document.createElement("span");
      pts.className = "text-q-pts";
      if (isReview && taskEval) {
        const qRes = taskEval.details[q.id];
        pts.textContent = `${qRes.earned} / ${qRes.max} Pkt.`;
      } else {
        pts.textContent = `${q.points} ${q.points === 1 ? "Punkt" : "Punkte"}`;
      }
      head.appendChild(pts);
      card.appendChild(head);

      const textarea = document.createElement("textarea");
      textarea.id = `input_${q.id}`;
      textarea.className = "text-q-input";
      textarea.rows = 2;
      textarea.placeholder = q.placeholder || "Schreibe deine Antwort hier hinein ...";
      textarea.value = ans[q.id] || "";
      textarea.disabled = isReview;

      if (!isReview) {
        textarea.addEventListener("input", (ev) => {
          ans[q.id] = ev.target.value;
          renderTabs();
        });
      }
      card.appendChild(textarea);

      if (isReview && taskEval) {
        const qRes = taskEval.details[q.id];
        const status = qRes.earned === qRes.max ? "good" : qRes.earned > 0 ? "partial" : "bad";
        const revBox = document.createElement("div");
        revBox.className = `text-review-box is-${status}`;

        const chipsHtml = qRes.criteria
          .map(
            (c) =>
              `<span class="crit-chip ${c.hit ? "hit" : "miss"}">${c.hit ? "✓" : "✕"} ${escapeHtml(c.label)}</span>`
          )
          .join("");

        revBox.innerHTML = `
          <div><strong>Musterlösung:</strong> ${escapeHtml(qRes.modelAnswer)}</div>
          <div class="criteria-chips">${chipsHtml}</div>
        `;
        card.appendChild(revBox);
      }

      qCol.appendChild(card);
    }

    layout.appendChild(qCol);
    el.taskBody.appendChild(layout);
  }

  /* ------------------------------------------------------------------------
     Abgabe & Ergebnis-Bildschirm
     ------------------------------------------------------------------------ */
  function openSubmitDialog() {
    const unanswered = TASKS.filter((t) => !isTaskAnswered(t));
    if (unanswered.length === 0) {
      el.submitDialogText.textContent =
        "Super! Du hast alle 15 Aufgaben bearbeitet. Möchtest du deine Probeklausur jetzt abgeben und auswerten lassen?";
    } else {
      const nums = unanswered.map((t) => `Aufgabe ${t.num}`).join(", ");
      el.submitDialogText.textContent =
        `Du hast ${TASKS.length - unanswered.length} von ${TASKS.length} Aufgaben bearbeitet. Noch offen: ${nums}. Möchtest du trotzdem schon abgeben?`;
    }

    if (typeof el.submitDialog.showModal === "function") {
      el.submitDialog.showModal();
    } else {
      finishExam(false);
    }
  }

  function finishExam(byTimeout) {
    stopTimer();
    state.finishedByTimeout = Boolean(byTimeout);
    state.evaluation = evaluateExam();
    renderResults();
    showScreen("results");

    if (byTimeout && typeof el.timeoutDialog.showModal === "function") {
      el.timeoutDialog.showModal();
    }
  }

  function renderResults() {
    const ev = state.evaluation;
    if (!ev) return;

    el.resultBadge.textContent = state.finishedByTimeout
      ? "⏰ Zeit abgelaufen · Ausgewertet"
      : "✅ Probeklausur ausgewertet";
    el.resultsHeading.textContent = `Note ${ev.grade.num} – ${ev.grade.word}!`;
    el.resultsSub.textContent = ev.grade.msg;

    el.gradeNumber.textContent = String(ev.grade.num);
    el.gradeWord.textContent = ev.grade.word;
    el.gradeMedallion.className = "grade-medallion";
    if (ev.grade.tone === "warn") el.gradeMedallion.classList.add("grade-warn");
    if (ev.grade.tone === "bad") el.gradeMedallion.classList.add("grade-bad");

    el.statPoints.textContent = `${ev.totalEarned} / ${ev.totalMax}`;
    el.statPercent.textContent = `${ev.percent} % erreicht`;
    el.statTime.textContent = formatTime(ev.usedSeconds);

    el.statGrain.textContent = `${ev.grainEarned} / ${ev.grainMax} Pkt.`;
    el.statPotato.textContent = `${ev.potatoEarned} / ${ev.potatoMax} Pkt.`;
    el.barGrain.style.width = `${Math.round((ev.grainEarned / ev.grainMax) * 100)}%`;
    el.barPotato.style.width = `${Math.round((ev.potatoEarned / ev.potatoMax) * 100)}%`;

    el.resultsTaskGrid.innerHTML = "";
    TASKS.forEach((task, idx) => {
      const res = ev.perTask[task.id];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `res-task-btn is-${res.status}`;
      btn.innerHTML = `
        <span class="res-task-info">
          <span class="res-task-num">Aufgabe ${task.num} · ${task.topic === "grain" ? "🌾" : "🥔"} ${escapeHtml(task.typeLabel)}</span>
          <span class="res-task-name">${escapeHtml(task.title)}</span>
        </span>
        <span class="res-task-score">${res.earned}/${res.max}</span>
      `;
      btn.addEventListener("click", () => {
        showScreen("review");
        goToTask(idx);
      });
      el.resultsTaskGrid.appendChild(btn);
    });
  }

  /* ------------------------------------------------------------------------
     Start & Neustart
     ------------------------------------------------------------------------ */
  function startNewExam() {
    initAnswers();
    state.currentIdx = 0;
    state.remainingSeconds = EXAM_DURATION_SECONDS;
    state.finishedByTimeout = false;
    state.evaluation = null;
    state.ui.activeSlotId = null;
    state.ui.selectedWord = null;

    showScreen("exam");
    goToTask(0);
    startTimer();
  }

  /* ------------------------------------------------------------------------
     Event-Listener verbinden
     ------------------------------------------------------------------------ */
  el.btnStartExam.addEventListener("click", startNewExam);

  el.btnPrevTask.addEventListener("click", () => {
    if (state.currentIdx > 0) goToTask(state.currentIdx - 1);
  });

  el.btnNextTask.addEventListener("click", () => {
    if (state.currentIdx < TASKS.length - 1) goToTask(state.currentIdx + 1);
  });

  el.btnHeaderSubmit.addEventListener("click", openSubmitDialog);
  el.btnFooterSubmit.addEventListener("click", openSubmitDialog);

  el.btnCancelSubmit.addEventListener("click", () => {
    el.submitDialog.close();
  });

  el.btnConfirmSubmit.addEventListener("click", () => {
    el.submitDialog.close();
    finishExam(false);
  });

  el.btnCloseTimeout.addEventListener("click", () => {
    el.timeoutDialog.close();
  });

  el.btnBackToResults.addEventListener("click", () => {
    showScreen("results");
  });

  el.btnReviewFirst.addEventListener("click", () => {
    showScreen("review");
    goToTask(0);
  });

  el.btnRestart.addEventListener("click", () => {
    stopTimer();
    state.remainingSeconds = EXAM_DURATION_SECONDS;
    showScreen("start");
  });

  // Initialisierung
  initAnswers();
  showScreen("start");
})();
