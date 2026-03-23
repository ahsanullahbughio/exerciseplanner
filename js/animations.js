// ============================================================
// Exercise Animation Engine — Canvas-based stick figure animations
// ============================================================

const ANIM = (() => {
  // Body scale factor (canvas units)
  const S = 1;

  // ── Pose keyframes by animType ───────────────────────────
  // Each pose: { head, neck, ls, rs, le, re, lw, rw, hip, lh, rh, lk, rk, la, ra, obj }
  // All coords in [-1, 1] normalised space; canvas maps to actual pixels

  const POSES = {
    // Standing neutral
    stand: {
      head: [0,-1.75], neck: [0,-1.4],
      ls: [-0.3,-1.15], rs: [0.3,-1.15],
      le: [-0.45,-0.75], re: [0.45,-0.75],
      lw: [-0.4,-0.3], rw: [0.4,-0.3],
      hip: [0,-0.55],
      lh: [-0.15,-0.55], rh: [0.15,-0.55],
      lk: [-0.18,0.2], rk: [0.18,0.2],
      la: [-0.18,0.95], ra: [0.18,0.95]
    },
    // Hip hinge (swing bottom)
    hinge: {
      head: [0.2,-0.7], neck: [0,-0.45],
      ls: [-0.25,-0.3], rs: [0.25,-0.3],
      le: [-0.1,0.15], re: [0.1,0.15],
      lw: [-0.05,0.55], rw: [0.05,0.55],
      hip: [0,-0.4],
      lh: [-0.15,-0.4], rh: [0.15,-0.4],
      lk: [-0.25,0.3], rk: [0.25,0.3],
      la: [-0.2,0.95], ra: [0.2,0.95],
      obj: [0,0.65]
    },
    // Swing top (arms at shoulder)
    swingTop: {
      head: [0,-1.75], neck: [0,-1.4],
      ls: [-0.35,-1.15], rs: [0.35,-1.15],
      le: [-0.5,-0.7], re: [0.5,-0.7],
      lw: [-0.55,-0.25], rw: [0.55,-0.25],
      hip: [0,-0.55],
      lh: [-0.15,-0.55], rh: [0.15,-0.55],
      lk: [-0.18,0.2], rk: [0.18,0.2],
      la: [-0.18,0.95], ra: [0.18,0.95],
      obj: [0,-0.2]
    },
    // Overhead press (arms up)
    overhead: {
      head: [0,-1.75], neck: [0,-1.4],
      ls: [-0.35,-1.2], rs: [0.35,-1.2],
      le: [-0.35,-1.6], re: [0.35,-1.6],
      lw: [-0.2,-1.95], rw: [0.2,-1.95],
      hip: [0,-0.55],
      lh: [-0.15,-0.55], rh: [0.15,-0.55],
      lk: [-0.18,0.2], rk: [0.18,0.2],
      la: [-0.18,0.95], ra: [0.18,0.95],
      obj: [0,-2.05]
    },
    // Rack position
    rack: {
      head: [0,-1.75], neck: [0,-1.4],
      ls: [-0.35,-1.15], rs: [0.35,-1.15],
      le: [-0.1,-0.85], re: [0.1,-0.85],
      lw: [-0.15,-0.6], rw: [0.15,-0.6],
      hip: [0,-0.55],
      lh: [-0.15,-0.55], rh: [0.15,-0.55],
      lk: [-0.18,0.2], rk: [0.18,0.2],
      la: [-0.18,0.95], ra: [0.18,0.95],
      obj: [0.05,-0.55]
    },
    // Deep squat
    squat: {
      head: [0,-1.2], neck: [0,-0.9],
      ls: [-0.35,-0.65], rs: [0.35,-0.65],
      le: [-0.5,-0.25], re: [0.5,-0.25],
      lw: [-0.45,0.1], rw: [0.45,0.1],
      hip: [0,0.3],
      lh: [-0.2,0.3], rh: [0.2,0.3],
      lk: [-0.45,0.7], rk: [0.45,0.7],
      la: [-0.25,0.95], ra: [0.25,0.95]
    },
    // Goblet squat
    gobletSquat: {
      head: [0,-1.15], neck: [0,-0.85],
      ls: [-0.3,-0.6], rs: [0.3,-0.6],
      le: [-0.45,-0.25], re: [0.45,-0.25],
      lw: [-0.2,0.0], rw: [0.2,0.0],
      hip: [0,0.3],
      lh: [-0.2,0.3], rh: [0.2,0.3],
      lk: [-0.45,0.7], rk: [0.45,0.7],
      la: [-0.25,0.95], ra: [0.25,0.95],
      obj: [0,-0.1]
    },
    // Plank
    plank: {
      head: [0.8,-0.35], neck: [0.6,-0.3],
      ls: [0.4,-0.1], rs: [0.4,0.1],
      le: [0.15,-0.1], re: [0.15,0.1],
      lw: [-0.1,-0.1], rw: [-0.1,0.1],
      hip: [-0.25,-0.05],
      lh: [-0.25,-0.1], rh: [-0.25,0.1],
      lk: [-0.65,-0.05], rk: [-0.65,0.05],
      la: [-1.0,-0.05], ra: [-1.0,0.05]
    },
    // Row start (bent over)
    rowBent: {
      head: [0.15,-0.5], neck: [0,-0.35],
      ls: [-0.2,-0.2], rs: [0.25,-0.2],
      le: [-0.25,0.2], re: [0.1,0.2],
      lw: [-0.2,0.55], rw: [0.45,0.2],
      hip: [0,-0.35],
      lh: [-0.15,-0.35], rh: [0.15,-0.35],
      lk: [-0.18,0.25], rk: [0.18,0.25],
      la: [-0.18,0.95], ra: [0.18,0.95],
      obj: [0.5,0.3]
    },
    // Row pulled
    rowPull: {
      head: [0.15,-0.5], neck: [0,-0.35],
      ls: [-0.2,-0.2], rs: [0.25,-0.2],
      le: [-0.25,0.2], re: [0.55,-0.1],
      lw: [-0.2,0.55], rw: [0.3,0.15],
      hip: [0,-0.35],
      lh: [-0.15,-0.35], rh: [0.15,-0.35],
      lk: [-0.18,0.25], rk: [0.18,0.25],
      la: [-0.18,0.95], ra: [0.18,0.95],
      obj: [0.35,0.1]
    },
    // Lunge front
    lungeDown: {
      head: [0,-1.5], neck: [0,-1.2],
      ls: [-0.3,-0.95], rs: [0.3,-0.95],
      le: [-0.45,-0.55], re: [0.45,-0.55],
      lw: [-0.4,-0.15], rw: [0.4,-0.15],
      hip: [0,-0.25],
      lh: [-0.15,-0.25], rh: [0.15,-0.25],
      lk: [0.35,0.35], rk: [-0.25,0.35],
      la: [0.4,0.95], ra: [-0.15,0.95]
    },
    // Push-up up
    pushupUp: {
      head: [0.6,-0.2], neck: [0.4,-0.1],
      ls: [0.2,0.05], rs: [0.2,-0.25],
      le: [-0.1,0.05], re: [-0.1,-0.25],
      lw: [-0.35,0.05], rw: [-0.35,-0.25],
      hip: [-0.4,-0.1],
      lh: [-0.4,-0.05], rh: [-0.4,-0.15],
      lk: [-0.75,-0.05], rk: [-0.75,-0.15],
      la: [-1.05,-0.05], ra: [-1.05,-0.15]
    },
    // Push-up down
    pushupDown: {
      head: [0.6,-0.1], neck: [0.4,0.0],
      ls: [0.2,0.1], rs: [0.2,-0.1],
      le: [0.05,0.2], re: [0.05,-0.2],
      lw: [-0.35,0.05], rw: [-0.35,-0.05],
      hip: [-0.4,-0.0],
      lh: [-0.4,-0.05], rh: [-0.4,0.05],
      lk: [-0.75,-0.05], rk: [-0.75,0.05],
      la: [-1.05,-0.05], ra: [-1.05,0.05]
    },
    // Jumping jack open
    jackOpen: {
      head: [0,-1.75], neck: [0,-1.4],
      ls: [-0.7,-1.0], rs: [0.7,-1.0],
      le: [-0.8,-0.6], re: [0.8,-0.6],
      lw: [-0.7,-0.25], rw: [0.7,-0.25],
      hip: [0,-0.55],
      lh: [-0.15,-0.55], rh: [0.15,-0.55],
      lk: [-0.4,0.2], rk: [0.4,0.2],
      la: [-0.55,0.85], ra: [0.55,0.85]
    },
    // High knee
    highKnee: {
      head: [0,-1.75], neck: [0,-1.4],
      ls: [-0.3,-1.15], rs: [0.3,-1.15],
      le: [-0.5,-0.65], re: [0.5,-0.65],
      lw: [-0.6,-0.2], rw: [0.6,-0.2],
      hip: [0,-0.55],
      lh: [-0.15,-0.55], rh: [0.15,-0.55],
      lk: [0.1,0.0], rk: [0.2,0.5],
      la: [-0.18,0.95], ra: [0.2,0.95]
    }
  };

  // ── Interpolation helper ─────────────────────────────────
  function lerp(a, b, t) { return a + (b - a) * t; }

  function lerpPose(p1, p2, t) {
    const result = {};
    const keys = Object.keys(p1);
    for (const k of keys) {
      if (p2[k]) {
        result[k] = [lerp(p1[k][0], p2[k][0], t), lerp(p1[k][1], p2[k][1], t)];
      } else {
        result[k] = p1[k];
      }
    }
    return result;
  }

  function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

  // ── Draw stick figure ─────────────────────────────────────
  function drawFigure(ctx, pose, cx, cy, scale, color = '#ffffff', objColor = '#ff6b35') {
    const p = (pt) => [cx + pose[pt][0] * scale, cy + pose[pt][1] * scale];

    ctx.strokeStyle = color;
    ctx.lineWidth   = scale * 0.07;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';

    const line = (a, b) => {
      ctx.beginPath();
      ctx.moveTo(...p(a));
      ctx.lineTo(...p(b));
      ctx.stroke();
    };

    // Torso
    ctx.strokeStyle = color;
    line('neck','hip');

    // Head
    const headPos = p('head');
    ctx.beginPath();
    ctx.arc(headPos[0], headPos[1], scale * 0.13, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Arms
    line('neck','ls'); line('ls','le'); line('le','lw');
    line('neck','rs'); line('rs','re'); line('re','rw');

    // Legs
    line('hip','lh'); line('lh','lk'); line('lk','la');
    line('hip','rh'); line('rh','rk'); line('rk','ra');

    // Equipment/object if present
    if (pose.obj) {
      const op = [cx + pose.obj[0] * scale, cy + pose.obj[1] * scale];
      ctx.beginPath();
      ctx.arc(op[0], op[1], scale * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = objColor;
      ctx.fill();
      ctx.strokeStyle = objColor;
      ctx.lineWidth = scale * 0.05;
      // Handle line from wrists to object
      const rw = p('rw');
      ctx.beginPath();
      ctx.moveTo(rw[0], rw[1]);
      ctx.lineTo(op[0], op[1]);
      ctx.stroke();
    }
  }

  // ── Draw ground line ─────────────────────────────────────
  function drawGround(ctx, cx, cy, scale) {
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(cx - scale * 1.5, cy + scale * 1.05);
    ctx.lineTo(cx + scale * 1.5, cy + scale * 1.05);
    ctx.stroke();
  }

  // ── Draw label ───────────────────────────────────────────
  function drawLabel(ctx, text, cx, cy, scale) {
    ctx.fillStyle = 'rgba(255,107,53,0.9)';
    ctx.font      = `bold ${Math.max(12, scale * 0.18)}px 'Inter', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(text, cx, cy + scale * 1.25);
  }

  // ── Animation sequences ──────────────────────────────────
  const SEQUENCES = {
    kb_swing:        [['hinge',0], ['stand',0.45], ['swingTop',0.7], ['stand',1.0]],
    kb_swing_one:    [['hinge',0], ['stand',0.45], ['swingTop',0.7], ['stand',1.0]],
    kb_clean:        [['hinge',0], ['stand',0.4], ['rack',0.65], ['stand',1.0]],
    kb_press:        [['rack',0], ['overhead',0.5], ['rack',1.0]],
    kb_snatch:       [['hinge',0], ['stand',0.35], ['overhead',0.6], ['stand',1.0]],
    goblet_squat:    [['gobletSquat',0], ['stand',0.5], ['gobletSquat',1.0]],
    kb_deadlift:     [['hinge',0], ['stand',0.5], ['hinge',1.0]],
    kb_row:          [['rowBent',0], ['rowPull',0.5], ['rowBent',1.0]],
    db_row:          [['rowBent',0], ['rowPull',0.5], ['rowBent',1.0]],
    kb_windmill:     [['stand',0], ['overhead',0.3], ['rowBent',0.6], ['overhead',0.8], ['stand',1.0]],
    kb_halo:         [['stand',0], ['jackOpen',0.25], ['overhead',0.5], ['stand',0.75], ['jackOpen',1.0]],
    kb_thruster:     [['gobletSquat',0], ['stand',0.4], ['overhead',0.6], ['stand',1.0]],
    kb_figure8:      [['hinge',0], ['squat',0.33], ['hinge',0.66], ['squat',1.0]],
    kb_around:       [['stand',0], ['jackOpen',0.25], ['stand',0.5], ['jackOpen',0.75], ['stand',1.0]],
    kb_carry:        [['stand',0], ['stand',1.0]],
    front_squat:     [['rack',0], ['squat',0.5], ['rack',1.0]],
    back_squat:      [['stand',0], ['squat',0.5], ['stand',1.0]],
    turkish_getup:   [['plank',0], ['squat',0.33], ['stand',0.66], ['overhead',1.0]],
    db_curl:         [['stand',0], ['rack',0.5], ['stand',1.0]],
    db_press:        [['rack',0], ['overhead',0.5], ['rack',1.0]],
    lateral_raise:   [['stand',0], ['jackOpen',0.5], ['stand',1.0]],
    rdl:             [['stand',0], ['hinge',0.5], ['stand',1.0]],
    lunge:           [['stand',0], ['lungeDown',0.5], ['stand',1.0]],
    db_press_chest:  [['pushupDown',0], ['pushupUp',0.5], ['pushupDown',1.0]],
    deadlift:        [['hinge',0], ['stand',0.5], ['hinge',1.0]],
    ohp:             [['rack',0], ['overhead',0.5], ['rack',1.0]],
    pushup:          [['pushupUp',0], ['pushupDown',0.5], ['pushupUp',1.0]],
    bw_squat:        [['stand',0], ['squat',0.5], ['stand',1.0]],
    plank:           [['plank',0], ['plank',1.0]],
    burpee:          [['stand',0], ['plank',0.25], ['pushupDown',0.4], ['pushupUp',0.55], ['squat',0.75], ['stand',1.0]],
    mountain_climbers:[['plank',0], ['highKnee',0.33], ['plank',0.66], ['highKnee',1.0]],
    pullup:          [['stand',0], ['overhead',0.5], ['stand',1.0]],
    jump_squat:      [['squat',0], ['stand',0.4], ['overhead',0.55], ['squat',1.0]],
    jumping_jacks:   [['stand',0], ['jackOpen',0.5], ['stand',1.0]],
    high_knees:      [['stand',0], ['highKnee',0.5], ['stand',1.0]],
    arm_circles:     [['stand',0], ['jackOpen',0.33], ['overhead',0.66], ['stand',1.0]],
    hip_circles:     [['stand',0], ['squat',0.33], ['lungeDown',0.66], ['stand',1.0]],
    leg_swings:      [['stand',0], ['lungeDown',0.33], ['highKnee',0.66], ['stand',1.0]],
    inchworm:        [['stand',0], ['hinge',0.25], ['plank',0.5], ['hinge',0.75], ['stand',1.0]],
    worlds_greatest: [['lungeDown',0], ['rowBent',0.33], ['overhead',0.66], ['stand',1.0]],
    hip_hinge:       [['stand',0], ['hinge',0.5], ['stand',1.0]],
    cat_cow:         [['plank',0], ['pushupDown',0.5], ['plank',1.0]],
    thoracic_rot:    [['plank',0], ['rowBent',0.5], ['plank',1.0]]
  };

  // ── Active animation instances ────────────────────────────
  const _instances = new Map();

  function startAnimation(canvas, animType, label = '') {
    stopAnimation(canvas.id);
    const ctx   = canvas.getContext('2d');
    const seq   = SEQUENCES[animType] || SEQUENCES['kb_swing'];
    let   start = null;
    const duration = 2200; // ms per full cycle

    function frame(ts) {
      if (!start) start = ts;
      const elapsed = (ts - start) % duration;
      const t       = elapsed / duration;

      // Find which segment we're in
      let from = seq[0][0], to = seq[0][0], segT = 0;
      for (let i = 0; i < seq.length - 1; i++) {
        if (t >= seq[i][1] && t <= seq[i+1][1]) {
          const segDur = seq[i+1][1] - seq[i][1];
          segT = (t - seq[i][1]) / segDur;
          from = seq[i][0];
          to   = seq[i+1][0];
          break;
        }
      }
      // Past last keyframe
      if (t > seq[seq.length - 1][1]) {
        from = seq[seq.length - 1][0];
        to   = seq[0][0];
        segT = (t - seq[seq.length-1][1]) / (1 - seq[seq.length-1][1]);
      }

      const pose  = lerpPose(POSES[from] || POSES.stand, POSES[to] || POSES.stand, easeInOut(segT));
      const w = canvas.width, h = canvas.height;
      const scale = Math.min(w, h) * 0.28;
      const cx = w * 0.5, cy = h * 0.55;

      ctx.clearRect(0, 0, w, h);
      drawGround(ctx, cx, cy, scale);
      drawFigure(ctx, pose, cx, cy, scale);
      if (label) drawLabel(ctx, label, cx, cy, scale);

      _instances.set(canvas.id, requestAnimationFrame(frame));
    }
    _instances.set(canvas.id, requestAnimationFrame(frame));
  }

  function stopAnimation(canvasId) {
    if (_instances.has(canvasId)) {
      cancelAnimationFrame(_instances.get(canvasId));
      _instances.delete(canvasId);
    }
  }

  function stopAll() {
    _instances.forEach((id) => cancelAnimationFrame(id));
    _instances.clear();
  }

  return { startAnimation, stopAnimation, stopAll };
})();
