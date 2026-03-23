// ============================================================
// Session Runner — handles active workout logic & timers
// ============================================================

const Session = (() => {
  let _state = null;      // current session state
  let _timer = null;      // interval handle
  let _onUpdate  = null;  // callback(state)
  let _onComplete = null; // callback(sessionRecord)

  // ── Build a flat "queue" of steps from a routine ─────────
  function buildQueue(routine) {
    const queue = [];
    const ex = routine.exercises || [];

    if (routine.type === 'emom') {
      // EMOM: each minute is one "block"; exercises cycle round-robin
      const rounds = routine.emomMinutes || 10;
      for (let r = 0; r < rounds; r++) {
        const exIdx = r % ex.length;
        const e = ex[exIdx];
        queue.push({
          kind: 'exercise',
          label: `Min ${r + 1} / ${rounds}`,
          exerciseId: e.exerciseId,
          reps: e.reps || null,
          duration: 60,
          round: r + 1,
          index: exIdx
        });
      }
    } else if (routine.type === 'circuit') {
      const rounds = routine.rounds || 3;
      const rest   = routine.restBetweenRounds || 60;
      for (let r = 0; r < rounds; r++) {
        ex.forEach((e, i) => {
          queue.push({
            kind: 'exercise',
            label: `Round ${r + 1}/${rounds} — Ex ${i + 1}/${ex.length}`,
            exerciseId: e.exerciseId,
            reps: e.reps || null,
            duration: e.time || 40,
            round: r + 1,
            index: i
          });
          if (i < ex.length - 1) {
            queue.push({
              kind: 'rest',
              label: 'Rest',
              duration: routine.restBetweenExercises || 15,
              round: r + 1,
              index: i
            });
          }
        });
        if (r < rounds - 1) {
          queue.push({
            kind: 'rest',
            label: `Round Rest (${rest}s)`,
            duration: rest,
            round: r + 1,
            index: -1,
            isRoundRest: true
          });
        }
      }
    } else {
      // rep-based: each exercise is a step; sets handled manually
      ex.forEach((e, i) => {
        const sets = e.sets || 3;
        for (let s = 0; s < sets; s++) {
          queue.push({
            kind: 'exercise',
            label: `Set ${s + 1}/${sets}`,
            exerciseId: e.exerciseId,
            reps: e.reps || null,
            duration: 0, // user-controlled, tap to advance
            round: s + 1,
            index: i
          });
          if (s < sets - 1) {
            queue.push({
              kind: 'rest',
              label: 'Rest between sets',
              duration: e.restTime || routine.restTime || 60,
              round: s + 1,
              index: i
            });
          }
        }
        if (i < ex.length - 1 && routine.restBetweenExercises) {
          queue.push({
            kind: 'rest',
            label: `Rest before next exercise`,
            duration: routine.restBetweenExercises,
            round: 0,
            index: i
          });
        }
      });
    }
    return queue;
  }

  // ── Start a session ───────────────────────────────────────
  function start(routine, onUpdate, onComplete) {
    stop();
    _onUpdate  = onUpdate;
    _onComplete = onComplete;
    const queue = buildQueue(routine);

    _state = {
      routine,
      queue,
      step: 0,
      timeLeft: queue[0] ? queue[0].duration : 0,
      running: false,
      startedAt: new Date().toISOString(),
      log: [],       // { exerciseId, reps, setNum, ts }
      paused: false
    };
    _notify();
  }

  // ── Play / Pause ─────────────────────────────────────────
  function play() {
    if (!_state) return;
    _state.running = true;
    _state.paused  = false;
    const step = _state.queue[_state.step];
    if (!step) return;

    // Rep-based with no timer — don't auto-advance
    if (step.kind === 'exercise' && step.duration === 0) {
      _notify();
      return;
    }

    clearInterval(_timer);
    _timer = setInterval(() => {
      if (_state.timeLeft > 0) {
        _state.timeLeft--;
        _notify();
      } else {
        advance();
      }
    }, 1000);
    _notify();
  }

  function pause() {
    if (!_state) return;
    _state.running = false;
    _state.paused  = true;
    clearInterval(_timer);
    _notify();
  }

  function togglePause() {
    if (!_state) return;
    _state.paused ? play() : pause();
  }

  // ── Advance to next step ──────────────────────────────────
  function advance(logEntry = null) {
    if (!_state) return;
    clearInterval(_timer);

    // Log current step if exercise
    const cur = _state.queue[_state.step];
    if (cur && cur.kind === 'exercise') {
      _state.log.push({
        exerciseId: cur.exerciseId,
        reps: logEntry ? logEntry.reps : cur.reps,
        setNum: cur.round,
        ts: new Date().toISOString()
      });
    }

    _state.step++;
    if (_state.step >= _state.queue.length) {
      _finish();
      return;
    }

    const next = _state.queue[_state.step];
    _state.timeLeft = next.duration;
    _state.running  = false;

    // Auto-play rests and timed exercises
    if (next.kind === 'rest' || (next.kind === 'exercise' && next.duration > 0)) {
      play();
    } else {
      _notify();
    }
  }

  function _finish() {
    clearInterval(_timer);
    const record = {
      routineId:   _state.routine.id,
      routineName: _state.routine.name,
      date:        _state.startedAt,
      duration:    Math.floor((Date.now() - new Date(_state.startedAt).getTime()) / 1000),
      log:         _state.log,
      completed:   true
    };
    DB.saveSession(record).then(() => {
      if (_onComplete) _onComplete(record);
    });
    _state = null;
  }

  function stop() {
    clearInterval(_timer);
    _state = null;
  }

  function _notify() {
    if (_onUpdate && _state) _onUpdate({ ..._state });
  }

  // ── Getters ───────────────────────────────────────────────
  function getState() { return _state ? { ..._state } : null; }

  function currentStep() {
    if (!_state) return null;
    return _state.queue[_state.step] || null;
  }

  function progress() {
    if (!_state) return 0;
    return _state.step / Math.max(1, _state.queue.length);
  }

  return { start, play, pause, togglePause, advance, stop, getState, currentStep, progress };
})();
