import { describe, expect, it } from 'vitest';
import { OPENINGS } from './openings.js';
import { BEGINNER_ANCHORS, BEGINNER_FAMILIES, DEFAULT_EXPANDED_FAMILY, INTERMEDIATE_ANCHORS, INTERMEDIATE_FAMILIES, RECOMMENDATIONS, SHORT_LINE_PLY, STUDY_LEVELS, expandedFamilies, levelCatalogFor, missingAnchorReferences, missingFamilyReferences, missingIdReferences, openingForLevel } from './study.js';

// The study levels are a documented promise, so the tests pin the promised numbers themselves
// instead of reading them back out of the module under test.
const BEGINNER_LINES = 3;
const INTERMEDIATE_LINES = 14;

// Mirrors what main.js builds for imported PGN lines: a synthetic family outside the catalog.
const custom = {
  id:'custom-repertoire', name:'Custom repertoire', eco:'PGN', color:'white', description:'Your imported lines',
  lines:[{ id:'custom-imported', name:'Imported line', moves:['e4','e5','Nf3','Nc6','Bb5','a6','Ba4','Nf6','O-O','Be7','Re1','b5'] }],
};

describe('study-level catalog references', () => {
  it('references only families the shipped catalog still contains', () => {
    expect(missingFamilyReferences(OPENINGS)).toEqual([]);
  });
  it('flags a family reference the catalog no longer has', () => {
    expect(missingFamilyReferences([{ name:'Italian Game' }])).toContain('Ruy Lopez');
  });
  it('opens a family that exists on a fresh install', () => {
    expect(OPENINGS.some(opening => opening.id === DEFAULT_EXPANDED_FAMILY)).toBe(true);
    expect(missingIdReferences(OPENINGS)).toEqual([]);
  });
  it('flags a stale expanded-family id instead of silently expanding nothing', () => {
    expect(missingIdReferences([{ id:'some-other-family' }])).toEqual([DEFAULT_EXPANDED_FAMILY]);
  });
  it('keeps every curated teaching anchor in the shipped catalog', () => {
    expect(missingAnchorReferences(OPENINGS)).toEqual([]);
    expect(missingAnchorReferences([{ id:'sicilian-defense', lines:[] }])).toContain('sicilian-defense-najdorf-variation-english-attack-2');
  });
  it('falls back to a family the catalog actually has when nothing is saved', () => {
    for (const saved of [undefined, null, []]) {
      expect(expandedFamilies(saved)).toEqual([DEFAULT_EXPANDED_FAMILY]);
      expect(OPENINGS.some(opening => opening.id === expandedFamilies(saved)[0])).toBe(true);
    }
  });
  it('leaves a saved expanded selection alone', () => {
    expect(expandedFamilies(['ruy-lopez', 'sicilian-defense'])).toEqual(['ruy-lopez', 'sicilian-defense']);
  });
  it('keeps every beginner family inside the intermediate set', () => {
    for (const name of BEGINNER_FAMILIES) expect(INTERMEDIATE_FAMILIES.has(name)).toBe(true);
  });
  it('recommends only families the app can open at a known level', () => {
    for (const [name] of RECOMMENDATIONS) {
      expect(OPENINGS.some(opening => opening.name === name)).toBe(true);
      expect(BEGINNER_FAMILIES.has(name) || INTERMEDIATE_FAMILIES.has(name)).toBe(true);
    }
    expect(STUDY_LEVELS).toEqual(['beginner','intermediate','advanced']);
  });
});

describe('study-level line selection', () => {
  it('limits beginners to short, representative lines in foundational families', () => {
    const catalog = levelCatalogFor(OPENINGS, 'beginner', false);
    expect(catalog.length).toBeGreaterThan(0);
    expect(catalog.length).toBeLessThan(OPENINGS.length);
    for (const opening of catalog) {
      expect(BEGINNER_FAMILIES.has(opening.name)).toBe(true);
      expect(opening.lines.length).toBeLessThanOrEqual(BEGINNER_LINES);
      expect(opening.lines.every(line => line.moves.length >= 8 && line.moves.length <= 12)).toBe(true);
      expect(opening.description).toContain(String(opening.lines.length));
      expect(opening.description).toContain('beginner');
    }
  });
  it('includes every beginner line in Intermediate and caps the longer branches', () => {
    const catalog = levelCatalogFor(OPENINGS, 'intermediate', true);
    expect(catalog.length).toBeGreaterThan(0);
    for (const opening of catalog) {
      expect(opening.lines.length).toBeLessThanOrEqual(INTERMEDIATE_LINES);
      expect(opening.lines.every(line => line.moves.length <= 20)).toBe(true);
    }
    for (const opening of levelCatalogFor(OPENINGS, 'beginner', true)) {
      const next = catalog.find(candidate => candidate.id === opening.id);
      for (const line of opening.lines) expect(next.lines.map(item => item.id)).toContain(line.id);
    }
  });
  it('teaches the Najdorf main setup, English Attack, quiet 6.Be2, and 6.Bg5 at Intermediate', () => {
    const beginner = levelCatalogFor(OPENINGS, 'beginner', false).find(opening => opening.id === 'sicilian-defense');
    const intermediate = levelCatalogFor(OPENINGS, 'intermediate', false).find(opening => opening.id === 'sicilian-defense');
    const advanced = levelCatalogFor(OPENINGS, 'advanced', false).find(opening => opening.id === 'sicilian-defense');
    expect(beginner.lines.some(line => line.name.includes('Najdorf'))).toBe(false);
    for (const id of INTERMEDIATE_ANCHORS['sicilian-defense'].slice(0, 4)) {
      expect(intermediate.lines.map(line => line.id)).toContain(id);
    }
    const branches = intermediate.lines.filter(line => line.id.startsWith('sicilian-defense-najdorf-'));
    expect(branches.map(line => line.moves[10])).toEqual(expect.arrayContaining(['Be3','Be2','Bg5']));
    expect(intermediate.lines.some(line => /Poisoned Pawn|Polugaevsky/.test(line.name))).toBe(false);
    expect(advanced.lines.some(line => /Poisoned Pawn/.test(line.name))).toBe(true);
  });
  it('includes all declared teaching anchors in their levels', () => {
    for (const [level, curriculum] of [['beginner', BEGINNER_ANCHORS], ['intermediate', INTERMEDIATE_ANCHORS]]) {
      const catalog = levelCatalogFor(OPENINGS, level, false);
      for (const [family, ids] of Object.entries(curriculum)) {
        const actual = catalog.find(opening => opening.id === family)?.lines.map(line => line.id);
        for (const id of ids) expect(actual, family + ' at ' + level).toContain(id);
      }
    }
  });
  it('describes each family with the number of lines the level shows', () => {
    for (const level of STUDY_LEVELS) for (const showShortLines of [true, false]) {
      const catalog = levelCatalogFor(OPENINGS, level, showShortLines);
      expect(catalog.length).toBeGreaterThan(0);
      for (const opening of catalog) {
        expect(opening.description, opening.name + ' at ' + level).toContain(String(opening.lines.length));
        expect(opening.description, opening.name + ' at ' + level).toContain(level);
      }
    }
  });
  it('keeps every family at advanced level and hides only short sidelines', () => {
    const withShort = levelCatalogFor(OPENINGS, 'advanced', true);
    const withoutShort = levelCatalogFor(OPENINGS, 'advanced', false);
    expect(withShort).toHaveLength(OPENINGS.length);
    expect(withoutShort).toHaveLength(OPENINGS.length);
    const count = catalog => catalog.reduce((sum, opening) => sum + opening.lines.length, 0);
    expect(count(withoutShort)).toBeLessThan(count(withShort));
    for (const opening of withoutShort) for (const line of opening.lines) expect(line.moves.length >= SHORT_LINE_PLY || line.name === 'Main line').toBe(true);
  });
  it('drops families the chosen level does not cover', () => {
    const grob = OPENINGS.find(opening => opening.name === 'Grob Opening');
    expect(openingForLevel(grob, 'beginner', true)).toBeNull();
    expect(openingForLevel(grob, 'advanced', true).name).toBe('Grob Opening');
  });
  it('keeps the imported repertoire at every level, however long the imported lines are', () => {
    const short = { ...custom, lines:[{ id:'custom-short', name:'Imported line', moves:['e4','e5','Nf3','Nc6','Bc4'] }] };
    for (const level of STUDY_LEVELS) expect(openingForLevel(short, level, false)?.id).toBe('custom-repertoire');
    // The bypass is keyed on the synthetic id, not on the family name.
    expect(openingForLevel({ ...short, id:'not-imported' }, 'beginner', false)).toBeNull();
    expect(openingForLevel({ ...short, id:'not-imported' }, 'intermediate', false)).toBeNull();
    // This 12-ply import used to empty the family at beginner level, hiding the whole repertoire.
    for (const level of STUDY_LEVELS) expect(openingForLevel(custom, level, false).lines).toHaveLength(1);
  });
  it('does not cap the imported repertoire at the level line limits', () => {
    const many = { ...custom, lines:Array.from({ length:30 }, (_, i) => ({ id:'custom-' + i, name:'Imported line ' + i, moves:['e4','e5','Nf3','Nc6','Bb5','a6','Ba4','Nf6','O-O','Be7','Re1','b5'] })) };
    for (const level of STUDY_LEVELS) {
      const leveled = openingForLevel(many, level, false);
      expect(leveled?.id).toBe('custom-repertoire');
      expect(leveled.lines).toHaveLength(30);
    }
  });
  it('does not force a tiny generic main line into the guided levels', () => {
    const opening = { id:'italian-game', name:'Italian Game', lines:[
      { id:'line-main', name:'Main line', moves:['e4'] },
      { id:'line-classical', name:'Classical variation', moves:Array(10).fill('e4') },
    ] };
    expect(openingForLevel(opening, 'beginner', false).lines.map(line => line.id)).toEqual(['line-classical']);
    expect(openingForLevel(opening, 'advanced', false).lines.map(line => line.id)).toEqual(['line-main', 'line-classical']);
  });
});

