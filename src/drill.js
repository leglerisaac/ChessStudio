import { Chess } from 'chess.js';

export function linePositions(line) {
  const chess = new Chess();
  return line.moves.map((san, index) => {
    const fen = chess.fen();
    const turn = chess.turn();
    const move = chess.move(san);
    if (!move) throw new Error(`Invalid move ${san} in ${line.name}`);
    return { index, fen, turn, san, from: move.from, to: move.to, afterFen: chess.fen() };
  });
}

export function createDrill(line, color = line.repertoireColor) {
  const positions = linePositions(line);
  const userTurn = color === 'white' ? 'w' : 'b';
  const prompts = positions.filter(position => position.turn === userTurn);
  return { line, color, positions, prompts };
}

// Plies alternate White, Black, White, ... from the opening position, so a side only gets a move
// once the line reaches its own first ply. Kept free of chess.js because the drill pool is filtered
// on every render; the test suite pins it to createDrill.
export function isLinePlayable(line, color = line.repertoireColor) {
  return color === 'white' ? line.moves.length >= 1 : line.moves.length >= 2;
}

export function drillTitle(line) {
  const opening = String(line?.openingName || '').trim();
  const variation = String(line?.name || '').trim();
  if (!opening || variation.toLocaleLowerCase().startsWith(opening.toLocaleLowerCase())) return variation || opening;
  return variation ? `${opening}: ${variation}` : opening;
}

export function weightedPick(items, stats = {}, random = Math.random) {
  if (!items.length) return null;
  const weights = items.map(item => {
    const stat = stats[item.id] || { attempts: 0, correct: 0 };
    const accuracy = stat.attempts ? stat.correct / stat.attempts : 0;
    return 1 + (1 - accuracy) * 3 + Math.max(0, 3 - stat.attempts);
  });
  let cursor = random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < items.length; i += 1) {
    cursor -= weights[i];
    if (cursor <= 0) return items[i];
  }
  return items.at(-1);
}

export function eligibleSelectedLines(lines, selectedIds, eligibleIds) {
  return lines.filter(line => selectedIds.has(line.id) && eligibleIds.has(line.id));
}

export function theoryOptions(candidates, cursor) {
  const options = new Map();
  for (const line of candidates) {
    const san = line.moves[cursor];
    if (!san) continue;
    if (!options.has(san)) options.set(san, []);
    options.get(san).push(line);
  }
  return options;
}

export function chooseTheoryMove(options, difficulty = 'common', random = Math.random) {
  const entries = [...options.entries()];
  if (!entries.length) return null;
  const weights = entries.map(([, lines]) => difficulty === 'wild' ? 1 : difficulty === 'varied' ? Math.sqrt(lines.length) : lines.length);
  let cursor = random() * weights.reduce((sum, weight) => sum + weight, 0);
  for (let index = 0; index < entries.length; index += 1) {
    cursor -= weights[index];
    if (cursor <= 0) return { san:entries[index][0], candidates:entries[index][1] };
  }
  return { san:entries.at(-1)[0], candidates:entries.at(-1)[1] };
}

export function parseMove(chess, from, to, promotion = 'q') {
  const moves = chess.moves({ square: from, verbose: true });
  return moves.find(move => move.to === to && (!move.promotion || move.promotion === promotion)) || null;
}
