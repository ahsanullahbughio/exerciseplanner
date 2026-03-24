// ============================================================
// Exercise Animation Engine — Real images from free-exercise-db
// Cycles between 2 JPG frames per exercise at 1.4s interval
// Source: github.com/yuhonas/free-exercise-db (public domain)
// ============================================================

const ANIM = (() => {
  const BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

  // ── Map our exercise IDs → free-exercise-db folder names ──
  const DB_ID = {
    // ── Kettlebell ──────────────────────────────────────────
    'kb-swing-two':        'One-Arm_Kettlebell_Swings',
    'kb-swing-one':        'One-Arm_Kettlebell_Swings',
    'kb-clean':            'One-Arm_Kettlebell_Clean',
    'kb-press':            'Alternating_Kettlebell_Press',
    'kb-snatch':           'One-Arm_Kettlebell_Snatch',
    'kb-goblet-squat':     'Goblet_Squat',
    'kb-turkish-getup':    'Kettlebell_Turkish_Get-Up_Lunge_style',
    'kb-deadlift':         'Kettlebell_One-Legged_Deadlift',
    'kb-row':              'One-Arm_Kettlebell_Row',
    'kb-windmill':         'Kettlebell_Windmill',
    'kb-halo':             null,
    'kb-thruster':         'Kettlebell_Thruster',
    'kb-figure8':          null,
    'kb-around-body':      null,
    'kb-front-squat':      'Front_Squats_With_Two_Kettlebells',
    'kb-suitcase-carry':   null,
    'kb-sumo-deadlift':    null,
    'kb-lateral-lunge':    null,
    'kb-bottoms-up-press': null,
    'kb-push-press':       'One-Arm_Kettlebell_Push_Press',
    'kb-renegade-row':     'Alternating_Renegade_Row',
    'kb-double-clean':     'Two-Arm_Kettlebell_Clean',

    // ── Dumbbell ────────────────────────────────────────────
    'db-bicep-curl':          'Dumbbell_Bicep_Curl',
    'db-hammer-curl':         'Hammer_Curls',
    'db-shoulder-press':      'Dumbbell_Shoulder_Press',
    'db-lateral-raise':       null,
    'db-rdl':                 'Stiff-Legged_Dumbbell_Deadlift',
    'db-lunge':               'Dumbbell_Lunges',
    'db-chest-press':         'Dumbbell_Bench_Press',
    'db-row':                 'Bent_Over_Two-Dumbbell_Row',
    'db-incline-press':       'Incline_Dumbbell_Press',
    'db-chest-fly':           null,
    'db-tricep-extension':    'Standing_Dumbbell_Triceps_Extension',
    'db-front-raise':         'Front_Dumbbell_Raise',
    'db-step-up':             null,
    'db-shrug':               null,
    'db-tricep-kickback':     null,
    'db-sumo-squat':          'Dumbbell_Squat',
    'db-concentration-curl':  'Seated_Dumbbell_Curl',

    // ── Barbell ─────────────────────────────────────────────
    'barbell-squat':            'Barbell_Squat',
    'barbell-deadlift':         'Barbell_Deadlift',
    'barbell-ohp':              'Barbell_Shoulder_Press',
    'barbell-bench':            'Wide-Grip_Barbell_Bench_Press',
    'barbell-row':              'Bent_Over_Barbell_Row',
    'barbell-front-squat':      'Front_Barbell_Squat',
    'barbell-rdl':              'Romanian_Deadlift',
    'barbell-lunge':            'Barbell_Lunge',
    'barbell-curl':             'Barbell_Curl',
    'barbell-close-grip-bench': 'Close-Grip_Barbell_Bench_Press',
    'barbell-sumo-deadlift':    'Sumo_Deadlift',
    'barbell-hip-thrust':       null,
    'barbell-incline-bench':    null,
    'barbell-rack-pull':        'Rack_Pulls',

    // ── Bodyweight ──────────────────────────────────────────
    'bw-pushup':            'Pushups',
    'bw-squat':             null,
    'bw-plank':             'Plank',
    'bw-burpee':            null,
    'bw-mountain-climbers': 'Mountain_Climbers',
    'bw-pullup':            'Pullups',
    'bw-jump-squat':        null,
    'bw-lunge':             'Elevated_Back_Lunge',
    'bw-tricep-dips':       null,
    'bw-incline-pushup':    'Incline_Push-Up',
    'bw-decline-pushup':    'Decline_Push-Up',
    'bw-diamond-pushup':    'Push-Ups_-_Close_Triceps_Position',
    'bw-inverted-row':      'Inverted_Row',
    'bw-pike-pushup':       null,
    'bw-pistol-squat':      'Kettlebell_Pistol_Squat',
    'bw-box-jump':          null,
    'bw-dips':              null,
    'bw-hollow-body':       null,
    'bw-hip-thrust':        null,
    'bw-nordic-curl':       null,

    // ── Warmup ──────────────────────────────────────────────
    'wu-jumping-jacks':     null,
    'wu-high-knees':        null,
    'wu-arm-circles':       null,
    'wu-hip-circles':       null,
    'wu-leg-swings':        null,
    'wu-inchworm':          'Inchworm',
    'wu-worlds-greatest':   null,
    'wu-hip-hinge':         null,
    'wu-cat-cow':           null,
    'wu-thoracic-rotation': null,
  };

  // Active animation timers keyed by element ID
  const _timers = {};
  let _idCounter = 0;

  function _url(dbId, frame) {
    return `${BASE}${dbId}/${frame}.jpg`;
  }

  // ── Public API ───────────────────────────────────────────

  /**
   * Start animating an <img> element with exercise images.
   * @param {HTMLImageElement} el   - target <img> element
   * @param {string}           exId - our exercise id (e.g. 'kb-swing-two')
   */
  function startAnimation(el, exId) {
    if (!el) return;

    // Ensure the element has an ID we can track
    if (!el.id) el.id = 'anim_' + (++_idCounter);
    const elId = el.id;
    stopAnimation(elId);

    const dbId = DB_ID[exId] || null;

    if (!dbId) {
      _placeholder(el);
      return;
    }

    // Show first frame immediately
    el.src              = _url(dbId, 0);
    el.style.objectFit  = 'contain';
    el.style.background = '#0d0d1a';

    // Preload frame 1
    const f1 = new Image();
    f1.src = _url(dbId, 1);

    let frame = 1;
    _timers[elId] = setInterval(() => {
      if (el.parentNode) {
        el.src = _url(dbId, frame);
        frame  = frame === 0 ? 1 : 0;
      } else {
        stopAnimation(elId);
      }
    }, 1400);
  }

  function stopAnimation(idOrEl) {
    const id = typeof idOrEl === 'string' ? idOrEl : (idOrEl && idOrEl.id);
    if (id && _timers[id]) {
      clearInterval(_timers[id]);
      delete _timers[id];
    }
  }

  function stopAll() {
    Object.values(_timers).forEach(clearInterval);
    Object.keys(_timers).forEach(k => delete _timers[k]);
  }

  function _placeholder(el) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <rect width="200" height="200" fill="#0d0d1a" rx="8"/>
      <text x="100" y="115" font-size="64" text-anchor="middle" dominant-baseline="middle">💪</text>
    </svg>`;
    el.src              = 'data:image/svg+xml,' + encodeURIComponent(svg);
    el.style.objectFit  = 'contain';
    el.style.background = '#0d0d1a';
  }

  return { startAnimation, stopAnimation, stopAll };
})();
