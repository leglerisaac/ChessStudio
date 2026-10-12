import { describe, expect, it, vi } from 'vitest';
import { OPENINGS } from './openings.js';
import { OPENING_LESSONS, lessonPosition, matchingLessonLine, openingLessonReason } from './opening-lessons.js';
import { handleLessonAction } from './opening-lessons-ui.js';

describe('guided opening lessons', () => {
  it('teaches legal lines and asks legal, side-correct recall questions', () => {
    expect(OPENING_LESSONS.length).toBeGreaterThanOrEqual(8);
    for (const lesson of OPENING_LESSONS) {
      const chess = lessonPosition(lesson, lesson.moves.length);
      expect(chess.history()).toEqual(lesson.moves.map(([san]) => san));
      expect(lesson.quizzes).toHaveLength(2);
      for (const quiz of lesson.quizzes) {
        const position = lessonPosition(lesson, quiz.at);
        const correct = lesson.moves[quiz.at][0];
        expect(position.turn()).toBe(lesson.color === 'white' ? 'w' : 'b');
        expect(quiz.options).toContain(correct);
        expect(new Set(quiz.options).size).toBe(quiz.options.length);
        for (const move of quiz.options) expect(position.moves()).toContain(move);
      }
    }
  });

  it('hands every lesson to the same opening line in the repertoire', () => {
    for (const lesson of OPENING_LESSONS) {
      const line = matchingLessonLine(lesson, OPENINGS);
      expect(line, lesson.name).not.toBeNull();
      expect(line.repertoireColor).toBe(lesson.color);
      expect(line.moves.slice(0, lesson.moves.length)).toEqual(lesson.moves.map(([san]) => san));
      expect(openingLessonReason(line,lesson.quizzes[0].at)).toBe(lesson.moves[lesson.quizzes[0].at][1]);
    }
  });
  it('explains the deeper Najdorf moves rather than stopping at the general Sicilian setup', () => {
    const najdorf = OPENING_LESSONS.find(lesson => lesson.id === 'najdorf');
    const line = matchingLessonLine(najdorf, OPENINGS);
    expect(line.id).toBe('sicilian-defense-najdorf-variation-english-attack-2');
    expect(openingLessonReason(line, 11)).toContain('d5');
    expect(openingLessonReason(line, 13)).toContain('d5');
  });

  it('moves from a lesson through recall into the matching drill and saves completion', () => {
    vi.stubGlobal('window', { scrollTo:vi.fn() });
    try {
      const state = { screen:'dashboard', selected:new Set(), expanded:new Set(), lessonCompleted:{}, lessonFilter:'all' };
      const render = vi.fn(), save = vi.fn(), startSession = vi.fn();
      const context = { state, render, save, startSession, openings:() => OPENINGS };
      const act = (action, id) => handleLessonAction({ dataset:{ action, id } }, context);
      expect(act('lessons')).toBe(true);
      expect(state.screen).toBe('lessons');
      act('open-lesson','italian');
      expect(state.screen).toBe('lesson');
      act('lesson-step', String(OPENING_LESSONS[0].moves.length));
      act('lesson-next');
      expect(state.lesson.mode).toBe('quiz');
      act('lesson-answer','Bb5');
      expect(state.lesson.answered).toBe(false);
      act('lesson-answer','Bc4');
      expect(state.lesson.answered).toBe(true);
      act('lesson-quiz-next');
      act('lesson-answer','c3');
      act('lesson-quiz-next');
      expect(state.lesson.mode).toBe('done');
      expect(state.lesson.firstTry).toBe(1);
      expect(state.lessonCompleted.italian).toBeGreaterThan(0);
      expect(save).toHaveBeenCalled();
      act('lesson-drill');
      expect(state.selected.has(startSession.mock.lastCall[1].id)).toBe(true);
      expect(startSession.mock.lastCall[1].openingName).toBe('Italian Game');
    } finally { vi.unstubAllGlobals(); }
  });
});

