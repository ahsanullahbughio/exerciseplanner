// ============================================================
// EXERCISE LIBRARY — all exercises with animation definitions
// ============================================================

const EXERCISE_LIBRARY = [
  // ─── KETTLEBELL ───────────────────────────────────────────
  {
    id: 'kb-swing-two',
    name: 'Kettlebell Swing (Two-Hand)',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['glutes','hamstrings','back','core','shoulders'],
    defaultReps: 15,
    defaultTime: 40,
    description: 'Hinge at hips explosively to swing KB to shoulder height. Drive hips forward powerfully.',
    cues: ['Hip hinge, not squat','Squeeze glutes at top','Arms guide the bell','Shoulders packed'],
    animType: 'kb_swing',
    difficulty: 'beginner'
  },
  {
    id: 'kb-swing-one',
    name: 'Kettlebell Swing (Single-Hand)',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['glutes','hamstrings','back','core','shoulders'],
    defaultReps: 10,
    defaultTime: 40,
    description: 'Single-arm version of the KB swing. Alternate arms or complete all reps on one side.',
    cues: ['Same hinge pattern','Counter-rotate core','Switch hands at top','Equal reps both sides'],
    animType: 'kb_swing_one',
    difficulty: 'intermediate'
  },
  {
    id: 'kb-clean',
    name: 'Kettlebell Clean',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['glutes','hamstrings','back','biceps','core'],
    defaultReps: 8,
    defaultTime: 45,
    description: 'Pull KB from between legs to rack position at shoulder. Forearm stays close to body.',
    cues: ['Pull KB close','Thread the arm','Soft rack landing','Hike back to start'],
    animType: 'kb_clean',
    difficulty: 'intermediate'
  },
  {
    id: 'kb-press',
    name: 'Kettlebell Press',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['shoulders','triceps','core'],
    defaultReps: 8,
    defaultTime: 40,
    description: 'Press KB overhead from rack position. Pack shoulder, tighten core.',
    cues: ['Tight core','Push floor away','Elbow leads','Pack shoulder at top'],
    animType: 'kb_press',
    difficulty: 'intermediate'
  },
  {
    id: 'kb-snatch',
    name: 'Kettlebell Snatch',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['glutes','hamstrings','back','shoulders','core'],
    defaultReps: 5,
    defaultTime: 50,
    description: 'One-movement explosive pull from between legs to locked-out overhead position.',
    cues: ['Pull KB close to body','Punch through at top','Loose grip on hike','Lock arm at top'],
    animType: 'kb_snatch',
    difficulty: 'advanced'
  },
  {
    id: 'kb-goblet-squat',
    name: 'Kettlebell Goblet Squat',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['quads','glutes','core','upper back'],
    defaultReps: 12,
    defaultTime: 45,
    description: 'Hold KB at chest with both hands, squat deep keeping torso upright.',
    cues: ['Chest up','Knees track toes','Sit between heels','Drive up through heels'],
    animType: 'goblet_squat',
    difficulty: 'beginner'
  },
  {
    id: 'kb-turkish-getup',
    name: 'Turkish Get-Up',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['shoulders','core','glutes','hips','triceps'],
    defaultReps: 3,
    defaultTime: 90,
    description: 'Complex movement from lying to standing while holding KB overhead. Ultimate shoulder stability.',
    cues: ['Eyes on KB always','Create shoulder packed','Press floor away','Slow and controlled'],
    animType: 'turkish_getup',
    difficulty: 'advanced'
  },
  {
    id: 'kb-deadlift',
    name: 'Kettlebell Deadlift',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['glutes','hamstrings','back','core'],
    defaultReps: 12,
    defaultTime: 40,
    description: 'Hip-hinge pattern lifting KB from floor. Foundation of all KB ballistic moves.',
    cues: ['Flat back','Push floor away','Hips and shoulders rise together','Lock out at top'],
    animType: 'kb_deadlift',
    difficulty: 'beginner'
  },
  {
    id: 'kb-row',
    name: 'Kettlebell Row',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['lats','rhomboids','biceps','core'],
    defaultReps: 10,
    defaultTime: 40,
    description: 'Single-arm row with KB. Hinge at hips, drive elbow toward ceiling.',
    cues: ['Brace core','Elbow close to body','Pull to hip not armpit','Squeeze at top'],
    animType: 'kb_row',
    difficulty: 'beginner'
  },
  {
    id: 'kb-windmill',
    name: 'Kettlebell Windmill',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['core','obliques','shoulders','hamstrings','glutes'],
    defaultReps: 5,
    defaultTime: 60,
    description: 'Press KB overhead, hinge sideways to touch floor. Elite hip and shoulder mobility.',
    cues: ['Eyes on KB','Rotate hips not spine','Slow descent','Push KB to ceiling'],
    animType: 'kb_windmill',
    difficulty: 'advanced'
  },
  {
    id: 'kb-halo',
    name: 'Kettlebell Halo',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['shoulders','upper back','core','rotator cuff'],
    defaultReps: 10,
    defaultTime: 30,
    description: 'Circle KB around head. Great shoulder mobility warm-up exercise.',
    cues: ['Keep elbows in','Stable core','Circle tight to head','Alternate directions'],
    animType: 'kb_halo',
    difficulty: 'beginner'
  },
  {
    id: 'kb-thruster',
    name: 'Kettlebell Thruster',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['quads','glutes','shoulders','triceps','core'],
    defaultReps: 8,
    defaultTime: 50,
    description: 'Combine front squat into overhead press in one fluid movement.',
    cues: ['Drive from heels','Use leg power for press','Full depth squat','Lock out overhead'],
    animType: 'kb_thruster',
    difficulty: 'intermediate'
  },
  {
    id: 'kb-figure8',
    name: 'Kettlebell Figure 8',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['core','obliques','glutes','back'],
    defaultReps: 10,
    defaultTime: 40,
    description: 'Pass KB in figure 8 pattern between legs. Great for grip and core.',
    cues: ['Hip hinge position','Smooth hand-off','Tight core','Drive hips with each pass'],
    animType: 'kb_figure8',
    difficulty: 'beginner'
  },
  {
    id: 'kb-around-body',
    name: 'KB Around the Body Pass',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['core','grip','shoulders'],
    defaultReps: 10,
    defaultTime: 30,
    description: 'Pass KB around body in circular motion. Alternates direction each set.',
    cues: ['Upright posture','Smooth transfer','Tight grip','Alternate direction'],
    animType: 'kb_around',
    difficulty: 'beginner'
  },
  {
    id: 'kb-front-squat',
    name: 'Kettlebell Front Squat',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['quads','glutes','core','upper back'],
    defaultReps: 8,
    defaultTime: 45,
    description: 'Double KB front squat in rack position. Demands upright torso and strong core.',
    cues: ['Elbows high','Chest up','Deep squat','Drive through heels'],
    animType: 'front_squat',
    difficulty: 'intermediate'
  },
  {
    id: 'kb-suitcase-carry',
    name: 'Kettlebell Suitcase Carry',
    category: 'kettlebell',
    equipment: ['kettlebell'],
    muscles: ['core','obliques','glutes','grip','traps'],
    defaultReps: 0,
    defaultTime: 30,
    description: 'Walk with KB in one hand at side. Resist lateral lean — core anti-lateral flexion.',
    cues: ['Shoulder packed','Resist lean','Tall posture','Steady pace'],
    animType: 'kb_carry',
    difficulty: 'beginner'
  },

  // ─── DUMBBELL ────────────────────────────────────────────
  {
    id: 'db-bicep-curl',
    name: 'Dumbbell Bicep Curl',
    category: 'dumbbell',
    equipment: ['dumbbell'],
    muscles: ['biceps','brachialis'],
    defaultReps: 12,
    defaultTime: 40,
    description: 'Curl DBs from hanging position to shoulders. Control the eccentric.',
    cues: ['Elbows pinned to sides','Full range of motion','Squeeze at top','Slow on the way down'],
    animType: 'db_curl',
    difficulty: 'beginner'
  },
  {
    id: 'db-hammer-curl',
    name: 'Hammer Curl',
    category: 'dumbbell',
    equipment: ['dumbbell'],
    muscles: ['biceps','brachialis','forearms'],
    defaultReps: 12,
    defaultTime: 40,
    description: 'Neutral grip curl. Great for overall arm and forearm development.',
    cues: ['Thumbs up grip','Don\'t swing','Full extension','Controlled tempo'],
    animType: 'db_curl',
    difficulty: 'beginner'
  },
  {
    id: 'db-shoulder-press',
    name: 'Dumbbell Shoulder Press',
    category: 'dumbbell',
    equipment: ['dumbbell'],
    muscles: ['shoulders','triceps','traps'],
    defaultReps: 10,
    defaultTime: 45,
    description: 'Press DBs overhead from shoulder height. Full lockout at top.',
    cues: ['Neutral spine','Don\'t arch lower back','Full lockout','Control descent'],
    animType: 'db_press',
    difficulty: 'beginner'
  },
  {
    id: 'db-lateral-raise',
    name: 'Lateral Raise',
    category: 'dumbbell',
    equipment: ['dumbbell'],
    muscles: ['lateral deltoids'],
    defaultReps: 15,
    defaultTime: 40,
    description: 'Raise DBs to side at shoulder height. Slight forward lean for lateral head.',
    cues: ['Slight elbow bend','Lead with elbows','Don\'t shrug','Slow and controlled'],
    animType: 'lateral_raise',
    difficulty: 'beginner'
  },
  {
    id: 'db-rdl',
    name: 'DB Romanian Deadlift',
    category: 'dumbbell',
    equipment: ['dumbbell'],
    muscles: ['hamstrings','glutes','back'],
    defaultReps: 10,
    defaultTime: 45,
    description: 'Hip hinge with DBs. Feel hamstring stretch at bottom.',
    cues: ['Soft knee bend','Hip hinge not squat','Back flat','Drive hips forward'],
    animType: 'rdl',
    difficulty: 'beginner'
  },
  {
    id: 'db-lunge',
    name: 'Dumbbell Lunge',
    category: 'dumbbell',
    equipment: ['dumbbell'],
    muscles: ['quads','glutes','hamstrings','balance'],
    defaultReps: 10,
    defaultTime: 45,
    description: 'Walking or stationary lunges with dumbbells. Front knee tracks toes.',
    cues: ['Knee over ankle','Chest up','Back knee near floor','Push through front heel'],
    animType: 'lunge',
    difficulty: 'beginner'
  },
  {
    id: 'db-chest-press',
    name: 'DB Chest Press',
    category: 'dumbbell',
    equipment: ['dumbbell','bench'],
    muscles: ['chest','triceps','front deltoids'],
    defaultReps: 10,
    defaultTime: 45,
    description: 'Press DBs from chest to lockout. Greater range of motion than barbell.',
    cues: ['Arch naturally','Retract shoulder blades','Control the descent','Elbows at 45°'],
    animType: 'db_press_chest',
    difficulty: 'beginner'
  },
  {
    id: 'db-row',
    name: 'DB Bent-Over Row',
    category: 'dumbbell',
    equipment: ['dumbbell'],
    muscles: ['lats','rhomboids','biceps'],
    defaultReps: 10,
    defaultTime: 40,
    description: 'Bent-over position, row DBs to hips. Strong lat contraction.',
    cues: ['Hinge at hips','Elbows close','Pull to hips','Squeeze lats at top'],
    animType: 'db_row',
    difficulty: 'beginner'
  },

  // ─── BARBELL / WEIGHTS ───────────────────────────────────
  {
    id: 'barbell-squat',
    name: 'Barbell Back Squat',
    category: 'barbell',
    equipment: ['barbell'],
    muscles: ['quads','glutes','hamstrings','core'],
    defaultReps: 5,
    defaultTime: 60,
    description: 'King of leg exercises. Bar on traps, squat to depth.',
    cues: ['Big air breath','Knees out','Break at hips and knees','Drive through heels'],
    animType: 'back_squat',
    difficulty: 'intermediate'
  },
  {
    id: 'barbell-deadlift',
    name: 'Barbell Deadlift',
    category: 'barbell',
    equipment: ['barbell'],
    muscles: ['glutes','hamstrings','back','core','grip'],
    defaultReps: 5,
    defaultTime: 60,
    description: 'Pick heavy thing up. Most powerful posterior chain movement.',
    cues: ['Bar over mid-foot','Hip hinge setup','Chest up, lats tight','Drive through floor'],
    animType: 'deadlift',
    difficulty: 'intermediate'
  },
  {
    id: 'barbell-ohp',
    name: 'Overhead Press',
    category: 'barbell',
    equipment: ['barbell'],
    muscles: ['shoulders','triceps','core','upper back'],
    defaultReps: 5,
    defaultTime: 60,
    description: 'Press barbell from shoulders to full overhead lockout.',
    cues: ['Tight core','Bar path straight','Full lockout','Bring head through at top'],
    animType: 'ohp',
    difficulty: 'intermediate'
  },

  // ─── BODYWEIGHT ──────────────────────────────────────────
  {
    id: 'bw-pushup',
    name: 'Push-Up',
    category: 'bodyweight',
    equipment: [],
    muscles: ['chest','triceps','front deltoids','core'],
    defaultReps: 15,
    defaultTime: 40,
    description: 'Classic push-up. Maintain plank position throughout.',
    cues: ['Rigid body','Elbows at 45°','Full range','Squeeze glutes'],
    animType: 'pushup',
    difficulty: 'beginner'
  },
  {
    id: 'bw-squat',
    name: 'Bodyweight Squat',
    category: 'bodyweight',
    equipment: [],
    muscles: ['quads','glutes','hamstrings'],
    defaultReps: 20,
    defaultTime: 40,
    description: 'Air squat. Great warm-up and conditioning exercise.',
    cues: ['Chest up','Knees track toes','Hip crease below knee','Drive through heels'],
    animType: 'bw_squat',
    difficulty: 'beginner'
  },
  {
    id: 'bw-plank',
    name: 'Plank',
    category: 'bodyweight',
    equipment: [],
    muscles: ['core','shoulders','glutes'],
    defaultReps: 0,
    defaultTime: 45,
    description: 'Isometric core exercise. Maintain rigid plank position.',
    cues: ['Neutral spine','Don\'t let hips sag','Squeeze glutes','Breathe steadily'],
    animType: 'plank',
    difficulty: 'beginner'
  },
  {
    id: 'bw-burpee',
    name: 'Burpee',
    category: 'bodyweight',
    equipment: [],
    muscles: ['full body','cardio'],
    defaultReps: 10,
    defaultTime: 50,
    description: 'Full-body conditioning. Squat, plank, push-up, jump sequence.',
    cues: ['Controlled descent','Jump feet back together','Full extension on jump','Land softly'],
    animType: 'burpee',
    difficulty: 'intermediate'
  },
  {
    id: 'bw-mountain-climbers',
    name: 'Mountain Climbers',
    category: 'bodyweight',
    equipment: [],
    muscles: ['core','cardio','hip flexors'],
    defaultReps: 20,
    defaultTime: 40,
    description: 'Plank position, drive knees alternately to chest. Great core/cardio combo.',
    cues: ['Hips level','Shoulders over wrists','Drive knee to chest','Fast and controlled'],
    animType: 'mountain_climbers',
    difficulty: 'beginner'
  },
  {
    id: 'bw-pullup',
    name: 'Pull-Up',
    category: 'bodyweight',
    equipment: ['pull-up bar'],
    muscles: ['lats','biceps','upper back'],
    defaultReps: 8,
    defaultTime: 45,
    description: 'Dead hang to chin over bar. Supreme upper body pulling.',
    cues: ['Full dead hang','Pull elbows to floor','Chin over bar','Controlled descent'],
    animType: 'pullup',
    difficulty: 'intermediate'
  },
  {
    id: 'bw-jump-squat',
    name: 'Jump Squat',
    category: 'bodyweight',
    equipment: [],
    muscles: ['quads','glutes','calves','cardio'],
    defaultReps: 15,
    defaultTime: 40,
    description: 'Explosive squat jump. Land softly, immediately into next rep.',
    cues: ['Squat first','Explode up','Soft landing','Absorb through hips and knees'],
    animType: 'jump_squat',
    difficulty: 'intermediate'
  },
  {
    id: 'bw-lunge',
    name: 'Bodyweight Lunge',
    category: 'bodyweight',
    equipment: [],
    muscles: ['quads','glutes','hamstrings','balance'],
    defaultReps: 12,
    defaultTime: 40,
    description: 'Alternating forward lunge. Great for unilateral leg strength.',
    cues: ['Upright torso','Knee tracks toes','Back knee near floor','Push through front heel'],
    animType: 'lunge',
    difficulty: 'beginner'
  },

  // ─── WARMUP ──────────────────────────────────────────────
  {
    id: 'wu-jumping-jacks',
    name: 'Jumping Jacks',
    category: 'warmup',
    equipment: [],
    muscles: ['full body','cardio'],
    defaultReps: 30,
    defaultTime: 40,
    description: 'Classic full-body warm-up. Gets heart rate up and blood moving.',
    cues: ['Arms fully extend overhead','Land softly','Steady rhythm','Breathe'],
    animType: 'jumping_jacks',
    difficulty: 'beginner'
  },
  {
    id: 'wu-high-knees',
    name: 'High Knees',
    category: 'warmup',
    equipment: [],
    muscles: ['hip flexors','cardio','core'],
    defaultReps: 30,
    defaultTime: 40,
    description: 'Run in place driving knees to hip height. Great cardio warm-up.',
    cues: ['Drive knees high','Arms pump','Stay on balls of feet','Upright torso'],
    animType: 'high_knees',
    difficulty: 'beginner'
  },
  {
    id: 'wu-arm-circles',
    name: 'Arm Circles',
    category: 'warmup',
    equipment: [],
    muscles: ['shoulders','rotator cuff'],
    defaultReps: 20,
    defaultTime: 30,
    description: 'Circle arms forward and backward. Warms up shoulders and rotator cuff.',
    cues: ['Start small circles','Progressively larger','Both directions','Keep arms straight'],
    animType: 'arm_circles',
    difficulty: 'beginner'
  },
  {
    id: 'wu-hip-circles',
    name: 'Hip Circles',
    category: 'warmup',
    equipment: [],
    muscles: ['hips','lower back','core'],
    defaultReps: 10,
    defaultTime: 30,
    description: 'Rotate hips in large circles. Lubricates hip joints.',
    cues: ['Large circles','Both directions','Hands on hips','Knees slightly bent'],
    animType: 'hip_circles',
    difficulty: 'beginner'
  },
  {
    id: 'wu-leg-swings',
    name: 'Leg Swings',
    category: 'warmup',
    equipment: [],
    muscles: ['hip flexors','hamstrings','adductors'],
    defaultReps: 15,
    defaultTime: 30,
    description: 'Swing leg forward/backward and side-to-side. Dynamic hip mobility.',
    cues: ['Hold support for balance','Relaxed leg swing','Full range','Both directions'],
    animType: 'leg_swings',
    difficulty: 'beginner'
  },
  {
    id: 'wu-inchworm',
    name: 'Inchworm',
    category: 'warmup',
    equipment: [],
    muscles: ['hamstrings','core','shoulders','spine'],
    defaultReps: 8,
    defaultTime: 45,
    description: 'Fold forward, walk hands out to plank, walk feet to hands, stand. Full body activation.',
    cues: ['Straight legs on walk-out','Hold plank briefly','Walk feet to hands','Control movement'],
    animType: 'inchworm',
    difficulty: 'beginner'
  },
  {
    id: 'wu-worlds-greatest',
    name: "World's Greatest Stretch",
    category: 'warmup',
    equipment: [],
    muscles: ['hips','thoracic spine','hamstrings','chest'],
    defaultReps: 5,
    defaultTime: 45,
    description: 'Lunge with thoracic rotation. Best single exercise for full-body mobility.',
    cues: ['Deep lunge','Elbow to floor first','Rotate to sky','Keep back knee floating'],
    animType: 'worlds_greatest',
    difficulty: 'beginner'
  },
  {
    id: 'wu-hip-hinge',
    name: 'Hip Hinge Drill',
    category: 'warmup',
    equipment: [],
    muscles: ['hamstrings','glutes','lower back'],
    defaultReps: 15,
    defaultTime: 30,
    description: 'Practice the hip hinge pattern. Foundation of all KB ballistics.',
    cues: ['Push hips back','Soft knee bend','Feel hamstring tension','Flat back'],
    animType: 'hip_hinge',
    difficulty: 'beginner'
  },
  {
    id: 'wu-cat-cow',
    name: 'Cat-Cow',
    category: 'warmup',
    equipment: [],
    muscles: ['spine','core','back'],
    defaultReps: 10,
    defaultTime: 30,
    description: 'On hands and knees, alternate between arching and rounding spine.',
    cues: ['Slow and deliberate','Full range of motion','Breathe with movement','Exhale on cat'],
    animType: 'cat_cow',
    difficulty: 'beginner'
  },
  {
    id: 'wu-thoracic-rotation',
    name: 'Thoracic Rotation',
    category: 'warmup',
    equipment: [],
    muscles: ['thoracic spine','lats','core'],
    defaultReps: 10,
    defaultTime: 30,
    description: 'Quadruped thoracic rotation. Open up mid-back for pressing and swinging.',
    cues: ['Hand behind head','Rotate elbow to sky','Keep hips still','Breathe into rotation'],
    animType: 'thoracic_rot',
    difficulty: 'beginner'
  }
];

// Category metadata
const CATEGORIES = {
  kettlebell: { label: 'Kettlebell', icon: '🔔', color: '#ff6b35' },
  dumbbell:   { label: 'Dumbbell',  icon: '🏋️', color: '#00d4ff' },
  barbell:    { label: 'Barbell',   icon: '💪', color: '#a855f7' },
  bodyweight: { label: 'Bodyweight',icon: '🤸', color: '#00ff88' },
  warmup:     { label: 'Warmup',    icon: '🔥', color: '#ffd700' }
};

// Get exercises by category
function getExercisesByCategory(category) {
  if (!category || category === 'all') return EXERCISE_LIBRARY;
  return EXERCISE_LIBRARY.filter(e => e.category === category);
}

// Get exercise by id
function getExerciseById(id) {
  return EXERCISE_LIBRARY.find(e => e.id === id);
}

// Search exercises
function searchExercises(query) {
  const q = query.toLowerCase();
  return EXERCISE_LIBRARY.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.muscles.some(m => m.toLowerCase().includes(q)) ||
    e.category.toLowerCase().includes(q)
  );
}
