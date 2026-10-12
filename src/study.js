// Study levels are cumulative: Intermediate builds on a compact beginner foundation; Advanced
// exposes the entire source catalog. The Lichess source names positions, not teaching difficulty,
// so depth and alphabetical order alone cannot identify the most useful practice lines.

export const BEGINNER_FAMILIES = new Set([
  'Italian Game', 'Scotch Game', 'Four Knights Game', 'Ruy Lopez', 'Vienna Game',
  "Queen's Gambit", 'London System', 'English Opening', "King's Indian Attack",
  'Sicilian Defense', 'French Defense', 'Caro-Kann Defense', 'Scandinavian Defense',
  'Slav Defense',
]);

export const INTERMEDIATE_FAMILIES = new Set([
  ...BEGINNER_FAMILIES, 'Alekhine Defense', 'Benoni Defense', 'Benko Gambit',
  'Catalan Opening', 'Grünfeld Defense',
  'Modern Defense', 'Nimzo-Indian Defense',
  "Queen's Indian Defense", 'Réti Opening', 'Semi-Slav Defense',
  'Three Knights Opening', 'Danish Gambit',
  "King's Gambit", "Petrov's Defense", 'Philidor Defense',
  'Pirc Defense', "King's Indian Defense", 'Dutch Defense',
]);

// These are teaching anchors, not a list of the shortest named variations. Each introduces a
// distinct common structure. Stable catalog IDs are checked by the tests after regeneration.
export const BEGINNER_ANCHORS = {
  'italian-game': [
    'italian-game-giuoco-pianissimo-3', 'italian-game-classical-variation-2',
    'italian-game-giuoco-pianissimo-normal',
  ],
  'scotch-game': ['scotch-game-classical-variation', 'scotch-game-mieses-variation'],
  'four-knights-game': [
    'four-knights-game-italian-variation-2', 'four-knights-game-scotch-variation-accepted',
    'four-knights-game-spanish-variation-classical-variation',
  ],
  'ruy-lopez': [
    'ruy-lopez-closed', 'ruy-lopez-exchange-variation-normal-variation',
    'ruy-lopez-berlin-defense-l-hermet-variation',
  ],
  'vienna-game': ['vienna-game-vienna-gambit-modern-variation'],
  'queen-s-gambit': [
    'queen-s-gambit-declined-orthodox-defense',
    'queen-s-gambit-accepted-classical-defense',
    'queen-s-gambit-declined-exchange-variation-positional-variation',
  ],
  'london-system': ['london-system-main-line', 'london-system-with-bd3', 'london-system-with-be2-2'],
  'english-opening': [
    'english-opening-symmetrical-variation-full-symmetry-line',
    'english-opening-king-s-english-variation-closed-system',
    'english-opening-anglo-indian-defense-2',
  ],
  'king-s-indian-attack': [
    'king-s-indian-attack-with-e6-2', 'king-s-indian-attack-with-bf5-2',
    'king-s-indian-attack-sicilian-variation-4',
  ],
  'sicilian-defense': [
    'sicilian-defense-closed-6', 'sicilian-defense-alapin-variation-barmen-defense-2',
    'sicilian-defense-open-4',
  ],
  'french-defense': [
    'french-defense-advance-variation-4',
    'french-defense-tarrasch-variation-open-system-2',
    'french-defense-classical-variation-3',
  ],
  'caro-kann-defense': [
    'caro-kann-defense-classical-variation',
    'caro-kann-defense-exchange-variation-4',
    'caro-kann-defense-advance-short-variation',
  ],
  'scandinavian-defense': [
    'scandinavian-defense-main-line-mieses-variation',
    'scandinavian-defense-valencian-variation-main-line',
  ],
  'slav-defense': [
    'slav-defense-exchange-variation-2',
    'slav-defense-quiet-variation-schallopp-defense-2',
    'slav-defense-chebanenko-variation-2',
  ],
};

// The Najdorf needs actual responses to 6.Be3, 6.Be2 and 6.Bg5. Its 5...a6 position alone is
// only a starting point. The Poisoned Pawn and Polugaevsky branches remain in Advanced.
export const INTERMEDIATE_ANCHORS = {
  're-ti-opening': ['re-ti-opening-anglo-slav-variation-2'],
  'three-knights-opening': ['three-knights-opening-schlechter-variation'],
  'sicilian-defense': [
    'sicilian-defense-najdorf-variation',
    'sicilian-defense-najdorf-variation-english-attack-2',
    'sicilian-defense-najdorf-variation-opocensky-variation-traditional-line',
    'sicilian-defense-najdorf-variation-traditional-line',
    'sicilian-defense-dragon-variation-yugoslav-attack-2',
    'sicilian-defense-lasker-pelikan-variation-sveshnikov-variation',
    'sicilian-defense-scheveningen-variation-modern-variation',
  ],
};

// [family name, reason] pairs shown in the library's recommendation grid.
export const RECOMMENDATIONS = [
  ['Italian Game', 'Natural development and clear attacking plans.'],
  ["Queen's Gambit", 'A principled introduction to positional chess.'],
  ['London System', 'A dependable setup that is easy to revisit.'],
  ['Caro-Kann Defense', 'A sound, structured answer to 1.e4.'],
  ['French Defense', 'Teaches pawn chains and counterplay.'],
  ['Sicilian Defense', 'Dynamic winning chances against 1.e4.'],
  ['Ruy Lopez', 'Classic strategic themes at every level.'],
  ["King's Indian Defense", 'Active kingside play against 1.d4.'],
];

export const STUDY_LEVELS = ['beginner', 'intermediate', 'advanced'];
export const DEFAULT_EXPANDED_FAMILY = 'italian-game';
export const SHORT_LINE_PLY = 8;
export const BEGINNER_MAX_PLY = 12;
export const INTERMEDIATE_MAX_PLY = 20;
export const LINE_LIMIT = { beginner: 3, intermediate: 14 };
const CUSTOM_FAMILY = 'custom-repertoire';
const PRACTICAL_BRANCH = /^(?:Main line|Classical|Normal|Closed|Open|Advance|Exchange|Quiet|Symmetrical|Fianchetto|Two Knights|Four Knights|Giuoco Pianissimo|King's English|Accepted|Declined|Tarrasch|Berlin|Orthodox|Panov|Slav|Catalan)\b/i;
const SHARP_SIDELINE = /\b(?:gambit|countergambit|trap|sacrifice|poisoned pawn|polugaevsky|goteborg|frankenstein|halloween)\b/i;
const NOT_BEGINNER = /\b(?:Najdorf|Sveshnikov|Dragon|Scheveningen|Marshall|Winawer|Botvinnik)\b/i;

export function expandedFamilies(savedExpanded) {
  return savedExpanded?.length ? savedExpanded : [DEFAULT_EXPANDED_FAMILY];
}

const branch = line => line.name.split(/[,:]/)[0].trim();
const segments = line => (line.name.match(/[,:]/g) || []).length;
const byCurriculum = (level, a, b) => {
  const target = level === 'beginner' ? 9 : 15;
  const score = line => (
    (PRACTICAL_BRANCH.test(branch(line)) ? 0 : 100) +
    segments(line) * 12 + Math.abs(line.moves.length - target) +
    (line.name === 'Main line' ? 0 : 2)
  );
  return score(a) - score(b) || a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
};

function curatedLines(opening, level, showShortLines) {
  const maxPly = level === 'beginner' ? BEGINNER_MAX_PLY : INTERMEDIATE_MAX_PLY;
  const minPly = showShortLines ? 1 : SHORT_LINE_PLY;
  const allowed = line => line.moves.length >= minPly && line.moves.length <= maxPly;
  const selected = [];
  const used = new Set();
  const groups = new Map();
  const add = (line, anchor = false) => {
    if (!line || used.has(line.id) || !allowed(line)) return;
    const group = branch(line);
    if (!anchor && (groups.get(group) || 0) >= (level === 'beginner' ? 1 : 2)) return;
    selected.push(line);
    used.add(line.id);
    groups.set(group, (groups.get(group) || 0) + 1);
  };
  const anchors = [
    ...(BEGINNER_FAMILIES.has(opening.name)
      ? level === 'beginner'
        ? BEGINNER_ANCHORS[opening.id] || []
        : curatedLines(opening, 'beginner', showShortLines).map(line => line.id)
      : []),
    ...(level === 'intermediate' ? INTERMEDIATE_ANCHORS[opening.id] || [] : []),
  ];
  for (const id of anchors) add(opening.lines.find(line => line.id === id), true);
  if (level === 'beginner' && selected.length) return selected.slice(0, LINE_LIMIT.beginner);
  const candidates = opening.lines
    .filter(line => allowed(line) && !SHARP_SIDELINE.test(line.name))
    .filter(line => level !== 'beginner' || !NOT_BEGINNER.test(line.name))
    .filter(line => PRACTICAL_BRANCH.test(branch(line)) && segments(line) <= (level === 'beginner' ? 1 : 2))
    .sort((a, b) => byCurriculum(level, a, b));
  for (const line of candidates) {
    if (selected.length >= LINE_LIMIT[level]) break;
    add(line);
  }
  return selected.slice(0, LINE_LIMIT[level]);
}

export function openingForLevel(opening, level, showShortLines) {
  if (opening.id === CUSTOM_FAMILY) {
    return { ...opening, lines: [...opening.lines], description: LINE_DESCRIPTION(opening.lines.length, level) };
  }
  if (level === 'advanced') {
    const lines = opening.lines.filter(line => showShortLines || line.moves.length >= SHORT_LINE_PLY || line.name === 'Main line');
    return { ...opening, lines, description: LINE_DESCRIPTION(lines.length, level) };
  }
  const allowed = level === 'beginner' ? BEGINNER_FAMILIES : INTERMEDIATE_FAMILIES;
  if (!allowed.has(opening.name)) return null;
  const lines = curatedLines(opening, level, showShortLines);
  return lines.length ? { ...opening, lines, description: LINE_DESCRIPTION(lines.length, level) } : null;
}

export function LINE_DESCRIPTION(count, level) {
  return count + ' ' + level + ' lines';
}

export function levelCatalogFor(openings, level, showShortLines) {
  return openings.map(opening => openingForLevel(opening, level, showShortLines)).filter(opening => opening?.lines.length);
}

export function missingFamilyReferences(openings) {
  const names = new Set(openings.map(opening => opening.name));
  const referenced = [...BEGINNER_FAMILIES, ...INTERMEDIATE_FAMILIES, ...RECOMMENDATIONS.map(([name]) => name)];
  return [...new Set(referenced)].filter(name => !names.has(name)).sort();
}

export function missingIdReferences(openings) {
  return openings.some(opening => opening.id === DEFAULT_EXPANDED_FAMILY) ? [] : [DEFAULT_EXPANDED_FAMILY];
}

export function missingAnchorReferences(openings) {
  const missing = [];
  for (const curriculum of [BEGINNER_ANCHORS, INTERMEDIATE_ANCHORS]) {
    for (const [familyId, anchors] of Object.entries(curriculum)) {
      const lines = openings.find(opening => opening.id === familyId)?.lines || [];
      for (const id of anchors) if (!lines.some(line => line.id === id)) missing.push(id);
    }
  }
  return [...new Set(missing)].sort();
}
