// ============================================================
// Main Application Controller
// ============================================================

// ── Page routing ─────────────────────────────────────────
const pages = ['dashboard','exercises','routines','builder','session','history'];
let currentPage = 'dashboard';

function showPage(name) {
  pages.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) el.classList.toggle('active', p === name);
  });
  document.querySelectorAll('.nav-item').forEach(n =>
    n.classList.toggle('active', n.dataset.page === name)
  );
  currentPage = name;
  ANIM.stopAll();

  if (name === 'dashboard')  renderDashboard();
  if (name === 'exercises')  renderExercises();
  if (name === 'routines')   renderRoutines();
  if (name === 'history')    renderHistory();
}

// ── Dashboard ────────────────────────────────────────────
async function renderDashboard() {
  const [routines, sessions] = await Promise.all([DB.getRoutines(), DB.getSessions()]);
  const recentSessions = sessions.slice(0, 3);
  const weekSessions   = sessions.filter(s => {
    const d = new Date(s.date);
    const now = new Date();
    return (now - d) < 7 * 86400000;
  });

  document.getElementById('stat-routines').textContent  = routines.length;
  document.getElementById('stat-sessions').textContent  = weekSessions.length;

  const totalMins = sessions.reduce((a, s) => a + Math.round((s.duration || 0) / 60), 0);
  document.getElementById('stat-minutes').textContent = totalMins;

  const recentEl = document.getElementById('recent-sessions');
  if (recentSessions.length === 0) {
    recentEl.innerHTML = `<div class="empty-state"><span>No sessions yet</span><p>Start your first workout!</p></div>`;
  } else {
    recentEl.innerHTML = recentSessions.map(s => `
      <div class="session-card">
        <div class="session-info">
          <strong>${s.routineName || 'Workout'}</strong>
          <span>${formatDate(s.date)}</span>
        </div>
        <div class="session-meta">
          <span class="badge">${Math.round((s.duration || 0) / 60)} min</span>
          <span class="badge">${(s.log || []).length} sets</span>
        </div>
      </div>
    `).join('');
  }

  // Quick start buttons
  const quickStart = document.getElementById('quick-routines');
  if (routines.length === 0) {
    quickStart.innerHTML = `<div class="empty-state"><span>No routines yet</span><p>Build your first routine</p></div>`;
  } else {
    quickStart.innerHTML = routines.slice(0, 4).map(r => `
      <button class="routine-quick-btn" onclick="startSession('${r.id}')">
        <span class="routine-type-badge type-${r.type}">${r.type.toUpperCase()}</span>
        <strong>${r.name}</strong>
        <span class="ex-count">${(r.exercises || []).length} exercises</span>
      </button>
    `).join('');
  }
}

// ── Exercise Library ─────────────────────────────────────
let exFilter = 'all', exSearch = '';

function renderExercises() {
  const list = exSearch ? searchExercises(exSearch) : getExercisesByCategory(exFilter);
  const grid = document.getElementById('exercise-grid');

  grid.innerHTML = list.map(ex => `
    <div class="exercise-card" onclick="showExerciseDetail('${ex.id}')">
      <canvas class="ex-thumb" id="thumb-${ex.id}" width="120" height="100"></canvas>
      <div class="ex-info">
        <div class="ex-cat" style="color:${CATEGORIES[ex.category]?.color || '#fff'}">
          ${CATEGORIES[ex.category]?.icon || ''} ${CATEGORIES[ex.category]?.label || ex.category}
        </div>
        <strong>${ex.name}</strong>
        <div class="ex-muscles">${ex.muscles.slice(0,3).join(' · ')}</div>
        <div class="diff-badge diff-${ex.difficulty}">${ex.difficulty}</div>
      </div>
    </div>
  `).join('');

  // Start thumb animations (staggered for performance)
  list.forEach((ex, i) => {
    setTimeout(() => {
      const c = document.getElementById('thumb-' + ex.id);
      if (c) ANIM.startAnimation(c, ex.animType);
    }, i * 30);
  });
}

function showExerciseDetail(id) {
  const ex = getExerciseById(id);
  if (!ex) return;
  const modal = document.getElementById('modal-exercise');
  document.getElementById('modal-ex-name').textContent     = ex.name;
  document.getElementById('modal-ex-category').textContent = `${CATEGORIES[ex.category]?.icon} ${CATEGORIES[ex.category]?.label}`;
  document.getElementById('modal-ex-desc').textContent     = ex.description;
  document.getElementById('modal-ex-muscles').textContent  = ex.muscles.join(', ');
  document.getElementById('modal-ex-cues').innerHTML = ex.cues.map(c => `<li>${c}</li>`).join('');

  ANIM.stopAnimation('modal-ex-canvas');
  modal.classList.add('open');
  setTimeout(() => {
    const c = document.getElementById('modal-ex-canvas');
    if (c) ANIM.startAnimation(c, ex.animType, ex.name);
  }, 50);
}

function closeExerciseModal() {
  document.getElementById('modal-exercise').classList.remove('open');
  ANIM.stopAnimation('modal-ex-canvas');
}

// ── Routine Builder ───────────────────────────────────────
let _builderRoutine = null;

function openBuilder(routineId = null) {
  if (routineId) {
    DB.getRoutine(routineId).then(r => {
      _builderRoutine = JSON.parse(JSON.stringify(r));
      renderBuilder();
      showPage('builder');
    });
  } else {
    _builderRoutine = {
      name: '',
      type: 'circuit',
      exercises: [],
      rounds: 3,
      restBetweenExercises: 20,
      restBetweenRounds: 60,
      emomMinutes: 10,
      restTime: 60
    };
    renderBuilder();
    showPage('builder');
  }
}

function renderBuilder() {
  const r = _builderRoutine;
  document.getElementById('builder-name').value = r.name || '';
  document.getElementById('builder-type').value = r.type || 'circuit';
  updateBuilderTypeFields();
  renderBuilderExercises();
}

function updateBuilderTypeFields() {
  const type = document.getElementById('builder-type').value;
  document.getElementById('field-rounds').style.display        = type === 'circuit' ? '' : 'none';
  document.getElementById('field-emom').style.display          = type === 'emom' ? '' : 'none';
  document.getElementById('field-rest-rounds').style.display   = type === 'circuit' ? '' : 'none';
  document.getElementById('field-rest-exercises').style.display = type !== 'reps' ? '' : 'none';
  document.getElementById('field-rest-sets').style.display     = type === 'reps' ? '' : 'none';

  if (_builderRoutine) {
    _builderRoutine.type = type;
    const rounds = document.getElementById('builder-rounds');
    if (rounds) rounds.value = _builderRoutine.rounds || 3;
    const emom = document.getElementById('builder-emom-minutes');
    if (emom) emom.value = _builderRoutine.emomMinutes || 10;
  }
}

function renderBuilderExercises() {
  const container = document.getElementById('builder-exercises');
  const r = _builderRoutine;
  const type = r.type;

  if (!r.exercises.length) {
    container.innerHTML = `<div class="empty-state">
      <span>No exercises added</span>
      <p>Click "Add Exercise" to build your routine</p>
    </div>`;
    return;
  }

  container.innerHTML = r.exercises.map((e, i) => {
    const ex = getExerciseById(e.exerciseId);
    const name = ex ? ex.name : 'Unknown';
    return `
      <div class="builder-exercise-row" draggable="true" ondragstart="dragStart(${i})" ondragover="dragOver(event,${i})" ondrop="dragDrop(${i})">
        <div class="drag-handle">⠿</div>
        <canvas class="builder-thumb" id="bthumb-${i}" width="60" height="50"></canvas>
        <div class="builder-ex-name">
          <strong>${name}</strong>
          <span style="color:${CATEGORIES[ex?.category]?.color || '#888'}">${CATEGORIES[ex?.category]?.label || ''}</span>
        </div>
        <div class="builder-ex-params">
          ${type === 'reps' ? `
            <label>Sets<input type="number" min="1" max="20" value="${e.sets||3}" onchange="updateExParam(${i},'sets',+this.value)"></label>
            <label>Reps<input type="number" min="1" max="100" value="${e.reps||10}" onchange="updateExParam(${i},'reps',+this.value)"></label>
            <label>Rest(s)<input type="number" min="0" max="300" value="${e.restTime||60}" onchange="updateExParam(${i},'restTime',+this.value)"></label>
          ` : type === 'emom' ? `
            <label>Reps<input type="number" min="1" max="50" value="${e.reps||10}" onchange="updateExParam(${i},'reps',+this.value)"></label>
          ` : `
            <label>Time(s)<input type="number" min="5" max="300" value="${e.time||40}" onchange="updateExParam(${i},'time',+this.value)"></label>
            <label>Reps<input type="number" min="0" max="100" value="${e.reps||0}" placeholder="—" onchange="updateExParam(${i},'reps',+this.value||null)"></label>
          `}
        </div>
        <button class="btn-icon remove-btn" onclick="removeExFromBuilder(${i})" title="Remove">✕</button>
      </div>
    `;
  }).join('');

  // Start small thumb animations
  r.exercises.forEach((e, i) => {
    const ex = getExerciseById(e.exerciseId);
    if (ex) {
      setTimeout(() => {
        const c = document.getElementById('bthumb-' + i);
        if (c) ANIM.startAnimation(c, ex.animType);
      }, i * 40);
    }
  });
}

function updateExParam(i, param, val) {
  if (_builderRoutine && _builderRoutine.exercises[i]) {
    _builderRoutine.exercises[i][param] = val;
  }
}

let _dragFrom = null;
function dragStart(i) { _dragFrom = i; }
function dragOver(e, i) { e.preventDefault(); }
function dragDrop(i) {
  if (_dragFrom === null || _dragFrom === i) return;
  const arr = _builderRoutine.exercises;
  const [item] = arr.splice(_dragFrom, 1);
  arr.splice(i, 0, item);
  _dragFrom = null;
  renderBuilderExercises();
}

function removeExFromBuilder(i) {
  _builderRoutine.exercises.splice(i, 1);
  renderBuilderExercises();
}

// Exercise picker modal
let _pickerCallback = null;
function openExercisePicker(callback) {
  _pickerCallback = callback;
  renderPickerList('all', '');
  document.getElementById('modal-picker').classList.add('open');
}

function renderPickerList(cat, search) {
  const list = search ? searchExercises(search) : getExercisesByCategory(cat);
  const container = document.getElementById('picker-list');
  container.innerHTML = list.map(ex => `
    <div class="picker-item" onclick="pickExercise('${ex.id}')">
      <span style="color:${CATEGORIES[ex.category]?.color}">${CATEGORIES[ex.category]?.icon}</span>
      <span><strong>${ex.name}</strong></span>
      <span class="ex-muscles">${ex.muscles.slice(0,2).join(', ')}</span>
    </div>
  `).join('');
}

function pickExercise(id) {
  document.getElementById('modal-picker').classList.remove('open');
  if (_pickerCallback) _pickerCallback(id);
}

function addExToBuilder() {
  openExercisePicker((exId) => {
    const ex = getExerciseById(exId);
    if (!ex) return;
    _builderRoutine.exercises.push({
      exerciseId: exId,
      reps: ex.defaultReps || 10,
      sets: 3,
      time: ex.defaultTime || 40,
      restTime: 60
    });
    renderBuilderExercises();
  });
}

async function saveRoutine() {
  const name = document.getElementById('builder-name').value.trim();
  if (!name) { alert('Please give your routine a name.'); return; }
  if (!_builderRoutine.exercises.length) { alert('Add at least one exercise.'); return; }

  _builderRoutine.name = name;
  _builderRoutine.type = document.getElementById('builder-type').value;
  _builderRoutine.rounds = +(document.getElementById('builder-rounds')?.value || 3);
  _builderRoutine.emomMinutes = +(document.getElementById('builder-emom-minutes')?.value || 10);
  _builderRoutine.restBetweenExercises = +(document.getElementById('builder-rest-ex')?.value || 20);
  _builderRoutine.restBetweenRounds = +(document.getElementById('builder-rest-rounds')?.value || 60);
  _builderRoutine.restTime = +(document.getElementById('builder-rest-sets')?.value || 60);

  await DB.saveRoutine(_builderRoutine);
  showPage('routines');
}

// ── Routines list ─────────────────────────────────────────
async function renderRoutines() {
  const routines = await DB.getRoutines();
  const container = document.getElementById('routines-list');

  if (!routines.length) {
    container.innerHTML = `<div class="empty-state large">
      <div class="empty-icon">📋</div>
      <strong>No routines yet</strong>
      <p>Create your first workout routine to get started</p>
      <button class="btn-primary" onclick="openBuilder()">Create Routine</button>
    </div>`;
    return;
  }

  container.innerHTML = routines.map(r => `
    <div class="routine-card">
      <div class="routine-header">
        <div>
          <span class="routine-type-badge type-${r.type}">${r.type.toUpperCase()}</span>
          <h3>${r.name}</h3>
        </div>
        <div class="routine-actions">
          <button class="btn-icon" onclick="openBuilder('${r.id}')" title="Edit">✏️</button>
          <button class="btn-icon danger" onclick="deleteRoutine('${r.id}')" title="Delete">🗑️</button>
        </div>
      </div>
      <div class="routine-ex-preview">
        ${(r.exercises || []).slice(0, 6).map(e => {
          const ex = getExerciseById(e.exerciseId);
          return ex ? `<span class="ex-tag" style="border-color:${CATEGORIES[ex.category]?.color}33">${ex.name}</span>` : '';
        }).join('')}
        ${(r.exercises || []).length > 6 ? `<span class="ex-tag">+${r.exercises.length - 6} more</span>` : ''}
      </div>
      <div class="routine-stats">
        <span>${(r.exercises || []).length} exercises</span>
        ${r.type === 'circuit' ? `<span>${r.rounds || 3} rounds</span>` : ''}
        ${r.type === 'emom' ? `<span>${r.emomMinutes || 10} min EMOM</span>` : ''}
        ${r.type === 'reps' ? `<span>Strength style</span>` : ''}
      </div>
      <button class="btn-primary btn-start-routine" onclick="startSession('${r.id}')">
        ▶ Start Workout
      </button>
    </div>
  `).join('');
}

async function deleteRoutine(id) {
  if (!confirm('Delete this routine?')) return;
  await DB.deleteRoutine(id);
  renderRoutines();
}

// ── Session Runner ────────────────────────────────────────
let _sessionAnimCanvas = null;

async function startSession(routineId) {
  const routine = await DB.getRoutine(routineId);
  if (!routine) return;

  showPage('session');
  renderSessionUI(routine);

  Session.start(routine,
    (state) => updateSessionDisplay(state),
    (record) => onSessionComplete(record)
  );

  // Auto-start first step
  setTimeout(() => Session.play(), 500);
}

function renderSessionUI(routine) {
  document.getElementById('session-routine-name').textContent = routine.name;
  document.getElementById('session-type-badge').textContent   = routine.type.toUpperCase();
  document.getElementById('session-type-badge').className = `routine-type-badge type-${routine.type}`;
}

function updateSessionDisplay(state) {
  const step = state.queue[state.step];
  if (!step) return;

  // Progress bar
  const pct = Math.round((state.step / Math.max(1, state.queue.length)) * 100);
  document.getElementById('session-progress-bar').style.width = pct + '%';
  document.getElementById('session-progress-text').textContent = `${state.step + 1} / ${state.queue.length}`;

  // Step label
  document.getElementById('session-step-label').textContent = step.label || '';

  // Is rest
  const isRest = step.kind === 'rest';
  document.getElementById('session-rest-overlay').classList.toggle('visible', isRest);

  if (!isRest) {
    const ex = getExerciseById(step.exerciseId);
    if (ex) {
      document.getElementById('session-ex-name').textContent  = ex.name;
      document.getElementById('session-ex-cat').textContent   = `${CATEGORIES[ex.category]?.icon} ${CATEGORIES[ex.category]?.label}`;
      document.getElementById('session-ex-cat').style.color   = CATEGORIES[ex.category]?.color || '#fff';
      document.getElementById('session-ex-desc').textContent  = ex.description;
      document.getElementById('session-cues').innerHTML = ex.cues.map(c => `<li>${c}</li>`).join('');

      // Reps display
      const repsEl = document.getElementById('session-reps-display');
      if (step.reps) {
        repsEl.textContent = step.reps + ' reps';
        repsEl.style.display = '';
      } else {
        repsEl.style.display = 'none';
      }

      // Start big animation
      const canvas = document.getElementById('session-anim-canvas');
      ANIM.startAnimation(canvas, ex.animType, ex.name);
    }
  } else {
    // Rest: show next exercise preview
    const nextEx = state.queue.slice(state.step + 1).find(s => s.kind === 'exercise');
    if (nextEx) {
      const ex = getExerciseById(nextEx.exerciseId);
      document.getElementById('rest-next-name').textContent = ex ? `Next: ${ex.name}` : 'Next exercise coming up';
    } else {
      document.getElementById('rest-next-name').textContent = 'Almost done!';
    }
  }

  // Timer
  const timeEl = document.getElementById('session-timer');
  if (step.duration > 0) {
    timeEl.textContent = formatTime(state.timeLeft);
    timeEl.style.display = '';
    updateTimerRing(state.timeLeft, step.duration);
  } else {
    timeEl.style.display = 'none';
  }

  // Controls
  document.getElementById('btn-session-pause').textContent = (state.paused || !state.running) ? '▶' : '⏸';
  document.getElementById('btn-session-pause').title = (state.paused || !state.running) ? 'Play' : 'Pause';
}

function updateTimerRing(left, total) {
  const ring = document.getElementById('timer-ring-progress');
  if (!ring) return;
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  const pct    = total > 0 ? left / total : 0;
  ring.style.strokeDashoffset = circ * (1 - pct);
}

function onSessionComplete(record) {
  ANIM.stopAll();
  const totalSets = (record.log || []).length;
  const mins = Math.round(record.duration / 60);
  document.getElementById('session-complete-overlay').classList.add('visible');
  document.getElementById('complete-summary').innerHTML = `
    <div class="complete-stat"><span>${mins}</span><label>minutes</label></div>
    <div class="complete-stat"><span>${totalSets}</span><label>sets done</label></div>
  `;
}

function sessionDone() {
  Session.stop();
  document.getElementById('session-complete-overlay').classList.remove('visible');
  showPage('history');
}

// ── History ───────────────────────────────────────────────
async function renderHistory() {
  const sessions = await DB.getSessions();
  const container = document.getElementById('history-list');

  if (!sessions.length) {
    container.innerHTML = `<div class="empty-state large">
      <div class="empty-icon">📊</div>
      <strong>No workouts recorded</strong>
      <p>Complete a workout to see your history here</p>
    </div>`;
    return;
  }

  // Group by week
  container.innerHTML = sessions.map(s => {
    const log = s.log || [];
    const uniqueEx = [...new Set(log.map(l => l.exerciseId))];
    return `
      <div class="history-card">
        <div class="history-header">
          <div>
            <strong>${s.routineName || 'Workout'}</strong>
            <span class="history-date">${formatDate(s.date)}</span>
          </div>
          <div class="history-meta">
            <span class="badge">${Math.round((s.duration || 0) / 60)} min</span>
            <button class="btn-icon danger" onclick="deleteSession('${s.id}')">🗑️</button>
          </div>
        </div>
        <div class="history-stats">
          <span>${log.length} total sets</span>
          <span>${uniqueEx.length} exercises</span>
        </div>
        <div class="history-log">
          ${uniqueEx.slice(0,5).map(exId => {
            const ex = getExerciseById(exId);
            const sets = log.filter(l => l.exerciseId === exId);
            return ex ? `<span class="log-tag">${ex.name} × ${sets.length}</span>` : '';
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

async function deleteSession(id) {
  if (!confirm('Delete this session record?')) return;
  await DB.deleteSession(id);
  renderHistory();
}

// ── Utilities ─────────────────────────────────────────────
function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Nav
  document.querySelectorAll('.nav-item').forEach(n => {
    n.addEventListener('click', () => {
      const page = n.dataset.page;
      if (page === 'builder') { openBuilder(); } else { showPage(page); }
    });
  });

  // Exercise filter tabs
  document.querySelectorAll('.ex-filter-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.ex-filter-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      exFilter = t.dataset.cat;
      renderExercises();
    });
  });

  // Exercise search
  document.getElementById('ex-search').addEventListener('input', (e) => {
    exSearch = e.target.value;
    renderExercises();
  });

  // Picker filter
  document.querySelectorAll('.picker-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.picker-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      renderPickerList(t.dataset.cat, document.getElementById('picker-search').value);
    });
  });
  document.getElementById('picker-search').addEventListener('input', (e) => {
    const activeCat = document.querySelector('.picker-tab.active')?.dataset.cat || 'all';
    renderPickerList(activeCat, e.target.value);
  });

  // Builder type change
  document.getElementById('builder-type').addEventListener('change', updateBuilderTypeFields);

  // Session controls
  document.getElementById('btn-session-pause').addEventListener('click', () => Session.togglePause());
  document.getElementById('btn-session-next').addEventListener('click', () => Session.advance());
  document.getElementById('btn-session-stop').addEventListener('click', () => {
    if (confirm('End workout early?')) {
      Session.stop();
      showPage('dashboard');
    }
  });

  // Load dashboard
  openDB().then(() => showPage('dashboard'));
});
