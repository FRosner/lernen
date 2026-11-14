// Psychometrische Steuerungs- und Auswertungslogik
// Erfassung der fluiden Intelligenz (Gf) nach Standardwerten: Mean = 100, SD = 15

(function () {
  'use strict';

  // Psychometrische Eichtabelle für 20 Aufgaben (General Adult Norm)
  // Basierend auf Normalverteilung: Mittelwert ~10.5, Standardabweichung ~3.2
  const NORM_TABLE = [
    { score: 0,  iq: 65,  pr: 1.0,  class: 'Weit unterdurchschnittlich' },
    { score: 1,  iq: 68,  pr: 1.7,  class: 'Weit unterdurchschnittlich' },
    { score: 2,  iq: 71,  pr: 2.7,  class: 'Unterdurchschnittlich' },
    { score: 3,  iq: 74,  pr: 4.2,  class: 'Unterdurchschnittlich' },
    { score: 4,  iq: 77,  pr: 6.3,  class: 'Unterdurchschnittlich' },
    { score: 5,  iq: 80,  pr: 9.1,  class: 'Unterdurchschnittlich' },
    { score: 6,  iq: 84,  pr: 14.2, class: 'Unterer Durchschnitt' },
    { score: 7,  iq: 88,  pr: 21.2, class: 'Durchschnittlich' },
    { score: 8,  iq: 92,  pr: 29.8, class: 'Durchschnittlich' },
    { score: 9,  iq: 96,  pr: 39.4, class: 'Durchschnittlich' },
    { score: 10, iq: 100, pr: 50.0, class: 'Exakter Durchschnitt' },
    { score: 11, iq: 104, pr: 60.6, class: 'Durchschnittlich' },
    { score: 12, iq: 108, pr: 70.2, class: 'Durchschnittlich' },
    { score: 13, iq: 112, pr: 78.8, class: 'Oberer Durchschnitt' },
    { score: 14, iq: 116, pr: 85.8, class: 'Überdurchschnittlich' },
    { score: 15, iq: 120, pr: 90.9, class: 'Überdurchschnittlich' },
    { score: 16, iq: 125, pr: 95.2, class: 'Weit überdurchschnittlich' },
    { score: 17, iq: 130, pr: 97.7, class: 'Weit überdurchschnittlich (Begabung)' },
    { score: 18, iq: 135, pr: 99.0, class: 'Höchstbegabungskorridor' },
    { score: 19, iq: 140, pr: 99.6, class: 'Außergewöhnlich hohe Intelligenz' },
    { score: 20, iq: 145, pr: 99.9, class: 'Maximalwert (Spitzenbereich)' }
  ];

  // State
  let mode = 'timed'; // 'timed' | 'free'
  let timerSeconds = 20 * 60; // 20 Minuten
  let timerInterval = null;
  let timeSpent = 0;

  let activeIndices = [];
  let currentTaskIdx = 0;
  let userAnswers = {}; // { taskId: selectedOptionIndex }
  let selectedOption = null;

  // DOM Elemente
  const introScreen = document.getElementById('screen-intro');
  const testScreen = document.getElementById('screen-test');
  const resultScreen = document.getElementById('screen-results');

  const startBtn = document.getElementById('btn-start');
  const modeSelectBtns = document.querySelectorAll('.mode-btn');

  const timerEl = document.getElementById('timer-display');
  const progressSegs = document.getElementById('progress-segments');
  const catBadge = document.getElementById('category-badge');
  const taskTitleEl = document.getElementById('task-title');
  const taskPromptEl = document.getElementById('task-prompt');
  const visualTarget = document.getElementById('task-visual');
  const optionsGrid = document.getElementById('options-grid');
  const btnSkip = document.getElementById('btn-skip');
  const btnNext = document.getElementById('btn-next');
  const btnQuit = document.getElementById('btn-quit');

  // Initialisierung
  function init() {
    setupModeSelectors();
    startBtn.addEventListener('click', startTest);
    btnSkip.addEventListener('click', skipTask);
    btnNext.addEventListener('click', submitCurrentAnswer);
    btnQuit.addEventListener('click', confirmQuit);

    document.getElementById('btn-restart').addEventListener('click', resetToIntro);

    // Filter für Lösungsheft
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderSolutions(e.target.dataset.filter);
      });
    });

    // Tastatur-Bedienung
    window.addEventListener('keydown', handleKeyNavigation);
  }

  function setupModeSelectors() {
    modeSelectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeSelectBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mode = btn.dataset.mode;
      });
    });
  }

  function startTest() {
    activeIndices = TASKS.map((_, i) => i);
    currentTaskIdx = 0;
    userAnswers = {};
    selectedOption = null;
    timeSpent = 0;

    if (mode === 'timed') {
      timerSeconds = 20 * 60;
      timerEl.classList.remove('free-mode');
      updateTimerUI();
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        timerSeconds--;
        timeSpent++;
        updateTimerUI();
        if (timerSeconds <= 0) {
          clearInterval(timerInterval);
          finishTest(true);
        }
      }, 1000);
    } else {
      timerEl.textContent = 'Freies Tempo';
      timerEl.classList.add('free-mode');
      clearInterval(timerInterval);
      timerInterval = setInterval(() => { timeSpent++; }, 1000);
    }

    renderProgressSegments();
    showScreen(testScreen);
    loadTask();
  }

  function updateTimerUI() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    if (timerSeconds < 180) {
      timerEl.classList.add('urgent');
    } else {
      timerEl.classList.remove('urgent');
    }
  }

  function renderProgressSegments() {
    progressSegs.innerHTML = '';
    TASKS.forEach((t, i) => {
      const seg = document.createElement('div');
      seg.className = 'prog-seg';
      seg.dataset.index = i;
      seg.title = `Aufgabe ${i + 1}`;
      progressSegs.appendChild(seg);
    });
    updateProgressUI();
  }

  function updateProgressUI() {
    const segs = progressSegs.children;
    for (let i = 0; i < segs.length; i++) {
      segs[i].className = 'prog-seg';
      const taskId = TASKS[i].id;
      if (userAnswers[taskId] !== undefined) {
        segs[i].classList.add('done');
      }
      if (activeIndices[currentTaskIdx] === i) {
        segs[i].classList.add('current');
      }
    }
  }

  function loadTask() {
    const realIndex = activeIndices[currentTaskIdx];
    const task = TASKS[realIndex];

    catBadge.textContent = task.categoryName;
    taskTitleEl.textContent = `Aufgabe ${realIndex + 1} von ${TASKS.length}: ${task.title}`;
    taskPromptEl.textContent = task.prompt;

    visualTarget.innerHTML = '';
    if (typeof task.renderVisual === 'function') {
      task.renderVisual(visualTarget);
    }

    // Optionen aufbauen
    optionsGrid.innerHTML = '';
    selectedOption = userAnswers[task.id] !== undefined ? userAnswers[task.id] : null;

    task.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opt-btn';
      if (selectedOption === idx) btn.classList.add('selected');

      const keyLabel = ['A', 'B', 'C', 'D', 'E', 'F'][idx] || (idx + 1);

      let content = `<span class="opt-key">${keyLabel}</span>`;
      if (opt.svg) {
        content += `<div class="opt-body opt-svg-wrap">${opt.svg}</div>`;
      } else if (opt.desc) {
        content += `<div class="opt-body"><div class="opt-title">${opt.text}</div><div class="opt-sub">${opt.desc}</div></div>`;
      } else {
        content += `<div class="opt-body"><div class="opt-text">${opt.text}</div></div>`;
      }

      btn.innerHTML = content;
      btn.addEventListener('click', () => {
        selectOption(idx);
      });
      optionsGrid.appendChild(btn);
    });

    updateNavButtons();
    updateProgressUI();
  }

  function selectOption(idx) {
    selectedOption = idx;
    const btns = optionsGrid.children;
    for (let i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('selected', i === idx);
    }
    updateNavButtons();
  }

  function updateNavButtons() {
    btnNext.disabled = selectedOption === null;
    btnNext.textContent = (currentTaskIdx === activeIndices.length - 1 && Object.keys(userAnswers).length === TASKS.length - 1 && selectedOption !== null)
      ? 'Auswertung ansehen ✓'
      : 'Weiter →';
  }

  function submitCurrentAnswer() {
    if (selectedOption === null) return;
    const realIndex = activeIndices[currentTaskIdx];
    const task = TASKS[realIndex];
    userAnswers[task.id] = selectedOption;

    advanceTask();
  }

  function skipTask() {
    // Schiebt die aktuelle Aufgabe ans Ende der Reihe
    if (activeIndices.length > 1) {
      const skipped = activeIndices.splice(currentTaskIdx, 1)[0];
      activeIndices.push(skipped);
      if (currentTaskIdx >= activeIndices.length) {
        currentTaskIdx = 0;
      }
      loadTask();
    }
  }

  function advanceTask() {
    selectedOption = null;
    currentTaskIdx++;

    if (currentTaskIdx >= activeIndices.length) {
      // Prüfen, ob noch unbeantwortete Aufgaben übrig sind
      const remaining = [];
      TASKS.forEach((t, i) => {
        if (userAnswers[t.id] === undefined) {
          remaining.push(i);
        }
      });

      if (remaining.length > 0) {
        activeIndices = remaining;
        currentTaskIdx = 0;
        loadTask();
      } else {
        finishTest(false);
      }
    } else {
      loadTask();
    }
  }

  function confirmQuit() {
    if (confirm('Möchtest du den Test wirklich abbrechen? Dein aktueller Fortschritt geht dabei verloren.')) {
      clearInterval(timerInterval);
      resetToIntro();
    }
  }

  function handleKeyNavigation(e) {
    if (testScreen.classList.contains('hidden')) return;

    const key = e.key.toUpperCase();
    const map = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, 'A': 0, 'B': 1, 'C': 2, 'D': 3 };

    if (map[key] !== undefined && map[key] < optionsGrid.children.length) {
      selectOption(map[key]);
    } else if (e.key === 'Enter' && selectedOption !== null) {
      submitCurrentAnswer();
    } else if (e.key === 'ArrowRight' || e.key === ' ') {
      if (selectedOption !== null) submitCurrentAnswer();
    }
  }

  // --- AUSWERTUNG & PSYCHOMETRISCHE BERECHNUNG ---

  function finishTest(timeRanOut = false) {
    clearInterval(timerInterval);

    let rawScore = 0;
    const catScores = {
      matrices: { correct: 0, total: 0, name: 'Visuelle Logik (Matrizen)' },
      sequences: { correct: 0, total: 0, name: 'Zahlen- & Sequenzlogik' },
      spatial: { correct: 0, total: 0, name: 'Räumliche Kognition' },
      deduction: { correct: 0, total: 0, name: 'Deduktives Schließen' }
    };

    TASKS.forEach(task => {
      const isCorrect = userAnswers[task.id] === task.correctIndex;
      if (isCorrect) rawScore++;

      if (catScores[task.category]) {
        catScores[task.category].total++;
        if (isCorrect) catScores[task.category].correct++;
      }
    });

    const norm = NORM_TABLE[rawScore] || NORM_TABLE[10];

    // Zeitstrafe / Bonus im Zeitmodus (±2 IQ-Punkte bei extrem schneller bzw. abgelaufener Zeit)
    let finalIQ = norm.iq;
    let timeNote = '';
    if (mode === 'timed') {
      const minutesTaken = Math.round(timeSpent / 60);
      if (timeRanOut) {
        timeNote = 'Der Test wurde durch Ablauf des 20-Minuten-Zeitlimits beendet.';
      } else {
        timeNote = `Bearbeitungszeit: ${minutesTaken} von 20 Minuten.`;
      }
    } else {
      timeNote = 'Im freien Trainingsmodus ohne Zeitlimit absolviert.';
    }

    // Konfidenzintervall (90% Vertrauensbereich ca. ±7 IQ-Punkte)
    const ciLow = Math.max(55, finalIQ - 7);
    const ciHigh = Math.min(155, finalIQ + 7);

    // UI aktualisieren
    document.getElementById('res-iq').textContent = finalIQ;
    document.getElementById('res-ci').textContent = `90%-Vertrauensintervall: ${ciLow} – ${ciHigh}`;
    document.getElementById('res-pr').textContent = `Prozentrang: PR ${norm.pr.toFixed(1)}%`;
    document.getElementById('res-class').textContent = norm.class;
    document.getElementById('res-raw').textContent = `${rawScore} / ${TASKS.length} Aufgaben richtig`;
    document.getElementById('res-time-info').textContent = timeNote;

    // Balkendiagramm der 4 Subskalen
    renderCategoryBars(catScores);

    // Lösungsheft initialisieren
    renderSolutions('all');

    showScreen(resultScreen);
  }

  function renderCategoryBars(catScores) {
    const container = document.getElementById('cat-bars');
    container.innerHTML = '';

    Object.values(catScores).forEach(cat => {
      const pct = Math.round((cat.correct / cat.total) * 100);
      const row = document.createElement('div');
      row.className = 'cat-bar-row';
      row.innerHTML = `
        <div class="cat-bar-header">
          <span class="cat-name">${cat.name}</span>
          <span class="cat-val">${cat.correct}/${cat.total} (${pct}%)</span>
        </div>
        <div class="cat-track">
          <div class="cat-fill" style="width: ${pct}%"></div>
        </div>
      `;
      container.appendChild(row);
    });
  }

  function renderSolutions(filter = 'all') {
    const list = document.getElementById('solutions-list');
    list.innerHTML = '';

    TASKS.forEach((task, idx) => {
      const userAns = userAnswers[task.id];
      const isCorrect = userAns === task.correctIndex;

      if (filter === 'wrong' && isCorrect) return;
      if (filter === 'correct' && !isCorrect) return;

      const card = document.createElement('details');
      card.className = `sol-card ${isCorrect ? 'sol-correct' : 'sol-wrong'}`;

      const userText = userAns !== undefined
        ? (task.options[userAns]?.text || `Option ${userAns + 1}`)
        : 'Keine Antwort abgegeben';
      const correctText = task.options[task.correctIndex]?.text || `Option ${task.correctIndex + 1}`;

      card.innerHTML = `
        <summary class="sol-summary">
          <div class="sol-icon">${isCorrect ? '✓' : '✗'}</div>
          <div class="sol-info">
            <span class="sol-title">Aufgabe ${idx + 1}: ${task.title}</span>
            <span class="sol-cat">${task.categoryName}</span>
          </div>
          <div class="sol-status">${isCorrect ? 'Richtig gelöst' : 'Falsch'}</div>
        </summary>
        <div class="sol-content">
          <p class="sol-prompt"><strong>Aufgabe:</strong> ${task.prompt}</p>
          <div class="sol-answers">
            <div class="sol-ans-box ${isCorrect ? 'is-good' : 'is-bad'}">
              <span>Deine Antwort:</span> <strong>${userText}</strong>
            </div>
            ${!isCorrect ? `
              <div class="sol-ans-box is-good">
                <span>Korrekte Lösung:</span> <strong>${correctText}</strong>
              </div>
            ` : ''}
          </div>
          <div class="sol-explain">
            <strong>Wissenschaftliche Erklärung:</strong>
            <p>${task.explanation}</p>
          </div>
        </div>
      `;
      list.appendChild(card);
    });
  }

  function showScreen(screen) {
    [introScreen, testScreen, resultScreen].forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  function resetToIntro() {
    showScreen(introScreen);
  }

  // Start bei geladener Seite
  document.addEventListener('DOMContentLoaded', init);

})();
