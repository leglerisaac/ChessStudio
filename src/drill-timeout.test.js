import { beforeAll, describe, expect, it, vi } from 'vitest';

// A prompt that ran out of time is already recorded as a failed attempt, so the move the app then
// reveals must not be counted as a second attempt (or credited as a correct one).
let app;
const handlers = {};
let store;

beforeAll(async () => {
  vi.useFakeTimers();
  store = new Map([['chessdrill-v2', JSON.stringify({ version:2, selected:['english-opening-main-line'], side:'white', level:'beginner', timerSeconds:2, expanded:[], stats:{}, positionStats:{}, lineRoles:{}, customLines:[] })]]);
  globalThis.localStorage = { getItem:key => (store.has(key) ? store.get(key) : null), setItem:(key, value) => store.set(key, String(value)), removeItem:key => store.delete(key) };
  globalThis.window = { setTimeout:(fn, ms) => setTimeout(fn, ms), scrollTo:() => {}, addEventListener:() => {}, removeEventListener:() => {} };
  globalThis.requestAnimationFrame = () => 0;
  app = { innerHTML:'' };
  globalThis.document = {
    addEventListener:(type, handler) => { handlers[type] = [...(handlers[type] || []), handler]; },
    querySelector:selector => (selector === '#app' ? app : null),
    createElement:() => ({ click:() => {}, style:{}, classList:{ add:() => {} } }),
    body:{ appendChild:() => {} },
    hidden:false,
  };
  globalThis.URL = { createObjectURL:() => 'blob:stub', revokeObjectURL:() => {} };
  await import('./main.js');
});

const action = dataset => handlers.click.forEach(handler => handler({ type:'click', target:{ closest:selector => (selector === '[data-action]' ? { dataset } : null) } }));
const square = name => handlers.click.forEach(handler => handler({ type:'click', target:{ closest:selector => (selector === '[data-square]' ? { dataset:{ square:name } } : null) } }));
const savedStats = () => JSON.parse(store.get('chessdrill-v2'));

describe('drill clock', () => {
  it('counts a timed-out prompt once, as a miss, when the revealed move is played', async () => {
    action({ action:'home' });
    action({ action:'start' });
    await vi.advanceTimersByTimeAsync(3500);
    expect(app.innerHTML).toContain('Time is up');
    square('c2');
    square('c4');
    await vi.advanceTimersByTimeAsync(3500);
    const saved = savedStats();
    expect(saved.stats['english-opening-main-line']).toEqual({ attempts:1, correct:0, completions:1 });
    const positions = Object.values(saved.positionStats);
    expect(positions).toHaveLength(1);
    expect(positions[0]).toMatchObject({ attempts:1, correct:0 });
  });
});
