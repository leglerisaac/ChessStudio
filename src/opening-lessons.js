import { Chess } from 'chess.js';

// Deliberately small, annotated paths through the existing opening catalog.
// A lesson teaches one useful setup; the repertoire contains its alternatives.
export const OPENING_LESSONS = [
  {
    id: 'italian', openingId: 'italian-game', name: 'Italian Game', color: 'white', level: 'Beginner',
    tagline: 'Develop quickly, aim at f7, and prepare a central push.',
    goal: 'Put your bishop on an active diagonal, get your king safe, then prepare d4 when your pieces support it.',
    plan: 'Develop Nf3 and Bc4, support the center with c3 and d3, and castle before opening the position.',
    break: 'White often prepares d4 with c3. Black can challenge the center with ...d5 when ready.',
    watch: 'An early attack on f7 is tempting. Make sure the rest of your pieces can join before sacrificing material.',
    moves: [
      ['e4', 'Claim central space and open lines for your bishop and queen.'],
      ['e5', 'Black matches your central pawn and frees the dark-squared bishop.'],
      ['Nf3', 'Develop with a threat to the e5 pawn.'],
      ['Nc6', 'Black defends e5 while developing a knight.'],
      ['Bc4', 'The bishop develops to an active diagonal and points at f7, a sensitive square near Black’s king.'],
      ['Bc5', 'Black develops symmetrically and also looks toward f2.'],
      ['c3', 'Prepare d4 while giving the bishop a retreat square on c2 if needed.'],
      ['Nf6', 'Black develops and increases pressure on e4.'],
      ['d3', 'Support e4 so you can finish development without immediately opening the center.'],
      ['d6', 'Black supports e5 and makes room for the light-squared bishop.'],
      ['O-O', 'Get the king safe and bring a rook closer to the central files.'],
      ['O-O', 'Both kings are safe. Now improve your pieces and look for a well-timed d4.'],
    ],
    quizzes: [
      { at: 4, prompt: 'Which bishop move starts the Italian Game and eyes f7?', options: ['Bc4', 'Bb5', 'd4'], hint: 'Look at the diagonal from f1 toward Black’s king.', explanation: 'Bc4 develops the bishop with direct pressure on f7. Bb5 is the Ruy Lopez, another sound opening with a different plan.' },
      { at: 6, prompt: 'How do you prepare a later d4 push without moving the d-pawn yet?', options: ['c3', 'd3', 'Nc3'], hint: 'Use the c-pawn to support the square d4.', explanation: 'c3 supports d4 and is a typical way to build an Italian center. d3 is useful soon, but it does not support d4.' },
    ],
  },
  {
    id: 'ruy-lopez', openingId: 'ruy-lopez', name: 'Ruy Lopez', color: 'white', level: 'Beginner',
    tagline: 'Pressure the defender of e5 and build a patient center.',
    goal: 'Keep the e5 pawn under pressure while you castle, defend e4, and prepare c3 followed by d4.',
    plan: 'Play Bb5, retreat the bishop when attacked, castle, and use Re1 and c3 to support your center.',
    break: 'White aims for d4. Black often gains space with ...b5 and may later challenge the center with ...d5.',
    watch: 'Bb5 does not win the e5 pawn immediately. After Bxc6, Black can often recapture and defend the center.',
    moves: [
      ['e4', 'Take central space and open the king bishop.'],
      ['e5', 'Black answers in the center.'],
      ['Nf3', 'Attack e5 while developing.'],
      ['Nc6', 'Black protects e5 with a developing move.'],
      ['Bb5', 'Pin pressure on the knight that defends e5. This long-term pressure defines the Ruy Lopez.'],
      ['a6', 'Black asks the bishop to decide whether to exchange or retreat.'],
      ['Ba4', 'Keep the bishop and preserve the pressure on c6.'],
      ['Nf6', 'Black attacks e4 while developing a knight.'],
      ['O-O', 'Castle first; there is no need to chase a pawn with the king in the center.'],
      ['Be7', 'Black develops the bishop and prepares to castle.'],
      ['Re1', 'Protect e4 and prepare to expand with c3 and d4.'],
      ['b5', 'Black gains space and asks your bishop to retreat again.'],
      ['Bb3', 'Keep the bishop’s diagonal alive toward f7.'],
      ['d6', 'Black reinforces e5.'],
      ['c3', 'Support d4 and give your bishop a safe retreat on c2.'],
      ['O-O', 'Black castles; both sides now have time to improve pieces before the center opens.'],
    ],
    quizzes: [
      { at: 4, prompt: 'Which move pressures the knight defending e5?', options: ['Bb5', 'Bc4', 'd4'], hint: 'Move your bishop toward the knight on c6.', explanation: 'Bb5 creates long-term pressure on c6 and e5. Bc4 would lead to Italian Game ideas.' },
      { at: 10, prompt: 'After castling, how do you defend e4 and prepare central expansion?', options: ['Re1', 'd4', 'h3'], hint: 'Bring a rook behind the e-pawn.', explanation: 'Re1 reinforces e4. You can later use c3 and d4 to challenge Black’s center.' },
    ],
  },
  {
    id: 'queens-gambit', openingId: 'queen-s-gambit', name: 'Queen’s Gambit Declined', color: 'white', level: 'Beginner',
    tagline: 'Challenge the d5 pawn, then grow a healthy center.',
    goal: 'Use c4 to pressure Black’s center, develop naturally, and prepare e4 when your pieces are ready.',
    plan: 'Pressure d5 with c4 and Nc3. Develop your queen bishop before e3, then finish development and look for e4.',
    break: 'White seeks e4. Black typically challenges with ...c5 or ...e5 after completing development.',
    watch: 'The c4 pawn is not the whole story. Development and control of d5 matter more than trying to win it back at any cost.',
    moves: [
      ['d4', 'Take central space and open the queen bishop.'],
      ['d5', 'Black claims an equal share of the center.'],
      ['c4', 'Attack d5 from the side. Black must decide how to support or exchange the central pawn.'],
      ['e6', 'The Queen’s Gambit Declined: Black reinforces d5, but temporarily blocks the c8 bishop.'],
      ['Nc3', 'Develop and add another attacker to d5.'],
      ['Nf6', 'Black develops and pressures e4.'],
      ['Nf3', 'Develop while supporting d4.'],
      ['Be7', 'Black prepares to castle.'],
      ['Bf4', 'Get the queen bishop outside the pawn chain before e3 closes its diagonal.'],
      ['O-O', 'Black moves the king to safety.'],
      ['e3', 'Support d4 and open the diagonal for your king bishop.'],
      ['c6', 'Black reinforces d5 and builds a solid pawn structure.'],
    ],
    quizzes: [
      { at: 2, prompt: 'Which pawn move challenges the d5 pawn from the side?', options: ['c4', 'e3', 'Nc3'], hint: 'Advance the pawn beside your d-pawn.', explanation: 'c4 immediately asks Black how to maintain the d5 pawn and starts the Queen’s Gambit.' },
      { at: 8, prompt: 'Which move develops your queen bishop before e3 closes its route?', options: ['Bf4', 'e3', 'g3'], hint: 'The bishop on c1 can move along the c1–f4 diagonal.', explanation: 'Bf4 activates the bishop before building the e3–d4 pawn chain.' },
    ],
  },
  {
    id: 'london', openingId: 'london-system', name: 'London System', color: 'white', level: 'Beginner',
    tagline: 'Build a familiar structure while watching what Black does.',
    goal: 'Develop your dark-squared bishop early, support d4 with e3, and adjust your pawn breaks to Black’s setup.',
    plan: 'Set up d4, Nf3, Bf4, and e3, then develop the king bishop and castle. Consider c3 for support or c4 for space.',
    break: 'White can choose c4 or e4 when prepared; Black may contest d4 with ...c5.',
    watch: 'A system is a starting structure, not an automatic move order. If Black threatens your center, respond to that position.',
    moves: [
      ['d4', 'Take central space and open the queen bishop.'],
      ['Nf6', 'Black develops and keeps several pawn structures available.'],
      ['Nf3', 'Support d4 and prevent some early central counterplay.'],
      ['g6', 'Black prepares to fianchetto the king bishop.'],
      ['Bf4', 'Develop the bishop outside your future e3 pawn chain.'],
      ['Bg7', 'Black puts the bishop on the long diagonal.'],
      ['e3', 'Support d4 and free the f1 bishop. The c1 bishop is already active.'],
      ['d6', 'Black supports an eventual ...e5 and keeps the center flexible.'],
      ['Bd3', 'Aim at h7 and make castling easy; check Black’s threats before following the setup.'],
    ],
    quizzes: [
      { at: 4, prompt: 'Which bishop move is the signature early London development?', options: ['Bf4', 'Bg5', 'e3'], hint: 'Develop the c1 bishop before e3.', explanation: 'Bf4 develops the bishop before the e-pawn closes its diagonal. It is a common London setup, not a rule for every position.' },
      { at: 6, prompt: 'How do you support d4 and free the other bishop?', options: ['e3', 'c4', 'Nc3'], hint: 'Move the pawn in front of your king bishop one square.', explanation: 'e3 keeps d4 supported and opens f1–d3 while the c1 bishop is already outside the pawn chain.' },
    ],
  },
  {
    id: 'sicilian', openingId: 'sicilian-defense', name: 'Sicilian Defense', color: 'black', level: 'Intermediate',
    tagline: 'Fight for d4 from the flank and accept an unbalanced game.',
    goal: 'Challenge White’s center with the c-pawn, develop quickly, and prepare a safe moment for the ...d5 break.',
    plan: 'Play ...c5 against e4, exchange on d4 in the Open Sicilian, and develop with ...Nf6 while keeping an eye on e4.',
    break: 'Black’s thematic equalizing break is ...d5, but only when it works tactically. ...b5 can gain queenside space.',
    watch: 'White often has more central space and can attack the king. Finish development before grabbing side pawns.',
    moves: [
      ['e4', 'White occupies the center.'],
      ['c5', 'Attack d4 from the flank instead of mirroring White with ...e5.'],
      ['Nf3', 'White develops and prepares d4.'],
      ['d6', 'Control e5 and key central squares before the position opens.'],
      ['d4', 'White challenges the center and offers an exchange.'],
      ['cxd4', 'Exchange the c-pawn for White’s d-pawn and open the c-file.'],
      ['Nxd4', 'White recaptures with a developed knight.'],
      ['Nf6', 'Develop while attacking the e4 pawn.'],
      ['Nc3', 'White protects e4.'],
      ['a6', 'The Najdorf setup controls b5 and leaves Black flexible about the next central and queenside moves.'],
    ],
    quizzes: [
      { at: 1, prompt: 'Which move attacks d4 from the flank against 1.e4?', options: ['c5', 'e5', 'e6'], hint: 'Use the c-pawn to challenge White’s central plans.', explanation: '...c5 is the Sicilian Defense. It fights for d4 while creating an asymmetrical position.' },
      { at: 5, prompt: 'After White plays d4, which move exchanges the c-pawn for the d-pawn?', options: ['cxd4', 'Nf6', 'e6'], hint: 'Capture the newly advanced pawn.', explanation: '...cxd4 trades a flank pawn for White’s central d-pawn and opens the c-file.' },
    ],
  },
  {
    id: 'najdorf', openingId: 'sicilian-defense', name: 'Sicilian Najdorf: English Attack', color: 'black', level: 'Intermediate',
    tagline: 'Meet 6.Be3 with central space and active development.',
    goal: 'Understand why ...a6 is flexible, when ...e5 gains time, and how ...Be6 prepares Black’s counterplay.',
    plan: 'Secure b5 with ...a6, meet Be3 with ...e5, chase the d4 knight to b3, and develop the c8 bishop to e6.',
    break: 'Look for ...d5 after development. White often aims for g4 and queenside castling, so queenside play must be timely.',
    watch: 'The ...e5 pawn leaves d5 sensitive. Avoid automatic pawn pushes when White can exploit that square.',
    moves: [
      ['e4', 'White occupies the center.'],
      ['c5', 'Attack d4 from the flank instead of mirroring White with ...e5.'],
      ['Nf3', 'White develops and prepares d4.'],
      ['d6', 'Control e5 and key central squares before the position opens.'],
      ['d4', 'White challenges the center and offers an exchange.'],
      ['cxd4', 'Exchange the c-pawn for White’s d-pawn and open the c-file.'],
      ['Nxd4', 'White recaptures with a developed knight.'],
      ['Nf6', 'Develop while attacking the e4 pawn.'],
      ['Nc3', 'White protects e4.'],
      ['a6', 'The Najdorf setup controls b5 and leaves Black flexible about the next central and queenside moves.'],
      ['Be3', 'White reinforces d4 and can follow with f3, Qd2, queenside castling, and a kingside pawn storm.'],
      ['e5', 'Gain space with tempo against the d4 knight. The knight must retreat, but Black accepts a sensitive d5 square.'],
      ['Nb3', 'White preserves the knight and may later use d5 as an outpost.'],
      ['Be6', 'Develop with an eye on d5 and prepare to finish development. Black needs active play before White’s attack arrives.'],
      ['f3', 'White supports e4 and prepares Qd2 and queenside castling; Black should watch for a kingside pawn advance.'],
    ],
    quizzes: [
      { at: 11, prompt: 'After 6.Be3, how can Black gain space while attacking the d4 knight?', options: ['e5', 'e6', 'g6'], hint: 'Move the e-pawn two squares while the knight is still on d4.', explanation: '...e5 gains a tempo on the knight and claims central space. It also weakens d5, so Black must develop actively.' },
      { at: 13, prompt: 'After the knight retreats to b3, which developing move contests d5?', options: ['Be6', 'Be7', 'Nc6'], hint: 'Bring out the bishop from c8.', explanation: '...Be6 develops the bishop to watch d5 and supports Black’s central plan before White organizes an attack.' },
    ],
  },
  {
    id: 'french', openingId: 'french-defense', name: 'French Defense', color: 'black', level: 'Beginner',
    tagline: 'Build a firm center, then attack its pawn-chain base.',
    goal: 'Support ...d5, invite White to commit the center, and challenge d4 with ...c5.',
    plan: 'Prepare ...d5 with ...e6. When White advances e5, attack the base of the chain at d4.',
    break: 'The main break is ...c5 against d4; ...f6 can later challenge e5 if your king is safe.',
    watch: 'The bishop on c8 can become cramped behind e6. Plan a route for it rather than moving only pawns.',
    moves: [
      ['e4', 'White claims space in the center.'],
      ['e6', 'Prepare ...d5 without allowing an immediate pawn exchange on e5.'],
      ['d4', 'White builds a broad pawn center.'],
      ['d5', 'Challenge e4 and ask White to exchange, defend, or advance.'],
      ['Nc3', 'White defends e4 and develops.'],
      ['Nf6', 'Develop and attack e4 again.'],
      ['e5', 'White gains space and pushes the black knight.'],
      ['Nfd7', 'Retreat the attacked knight while leaving the d4 pawn as a target.'],
      ['f4', 'White supports e5 and claims more kingside space.'],
      ['c5', 'Strike at d4, the base of White’s pawn chain.'],
      ['Nf3', 'White develops and adds support to d4.'],
      ['Nc6', 'Black increases pressure on d4 while developing.'],
    ],
    quizzes: [
      { at: 3, prompt: 'After ...e6 and d4, which move immediately challenges White’s center?', options: ['d5', 'c5', 'Nf6'], hint: 'Put a pawn opposite White’s e4 pawn.', explanation: '...d5 directly attacks e4 and is the central idea behind the French Defense.' },
      { at: 9, prompt: 'Against White’s e5–d4 pawn chain, which pawn break attacks its base?', options: ['c5', 'f6', 'b6'], hint: 'The base of the chain is the pawn on d4.', explanation: '...c5 attacks d4. ...f6 may challenge e5 later, but ...c5 pressures the chain’s base right now.' },
    ],
  },
  {
    id: 'caro-kann', openingId: 'caro-kann-defense', name: 'Caro-Kann Defense', color: 'black', level: 'Beginner',
    tagline: 'Challenge e4 with a solid center and an active bishop.',
    goal: 'Support ...d5 with ...c6 and develop your light-squared bishop before ...e6 locks it in.',
    plan: 'Set up ...c6 and ...d5. Against the Advance Variation, develop the c8 bishop to f5 and then reinforce the center.',
    break: 'Black often plays ...c5 to challenge White’s d4 pawn after completing development.',
    watch: 'Do not let a comfortable pawn structure hide a lack of development. The bishop on f5 may need a retreat square.',
    moves: [
      ['e4', 'White takes central space.'],
      ['c6', 'Prepare ...d5 with pawn support rather than moving the d-pawn alone.'],
      ['d4', 'White builds a two-pawn center.'],
      ['d5', 'Challenge the e4 pawn.'],
      ['e5', 'White gains space and closes the central pawn chain.'],
      ['Bf5', 'Develop the light-squared bishop before playing ...e6.'],
      ['c3', 'White reinforces d4 and prepares a stable center.'],
      ['e6', 'Support d5 now that the c8 bishop has escaped the pawn chain.'],
      ['Be2', 'White develops and prepares to castle. Look for ...c5 when Black is ready.'],
    ],
    quizzes: [
      { at: 1, prompt: 'How does Black support a coming ...d5 against 1.e4?', options: ['c6', 'e6', 'd5'], hint: 'Move the c-pawn one square first.', explanation: '...c6 supports ...d5 while keeping the light-squared bishop’s diagonal open.' },
      { at: 5, prompt: 'Before ...e6 closes the bishop’s route, where does the c8 bishop go?', options: ['Bf5', 'Bg4', 'Nd7'], hint: 'Develop the light-squared bishop outside the pawn chain.', explanation: '...Bf5 activates the bishop before ...e6. Later ...c5 can challenge White’s d4 pawn.' },
    ],
  },
  {
    id: 'kings-indian', openingId: 'king-s-indian-defense', name: 'King’s Indian Defense', color: 'black', level: 'Intermediate',
    tagline: 'Let White take space, then counterattack its center.',
    goal: 'Fianchetto the king bishop, castle, and strike at White’s broad center with ...e5.',
    plan: 'Develop ...Nf6, ...g6, and ...Bg7. After ...d6 and castling, challenge the center with ...e5.',
    break: 'The main central breaks are ...e5 and ...c5; ...f5 can follow in some closed structures.',
    watch: 'White has more space. If you delay a central break too long, that space can become a lasting advantage.',
    moves: [
      ['d4', 'White claims central space.'],
      ['Nf6', 'Develop a knight and prevent an unchallenged e4 push.'],
      ['c4', 'White expands the center.'],
      ['g6', 'Prepare to place the bishop on the long diagonal.'],
      ['Nc3', 'White develops and strengthens d5 and e4.'],
      ['Bg7', 'The bishop pressures the long diagonal from a safe square.'],
      ['e4', 'White builds a large center.'],
      ['d6', 'Control e5 and prepare to challenge that center.'],
      ['Nf3', 'White develops and guards e5.'],
      ['O-O', 'Black castles before central tension rises.'],
      ['Be2', 'White prepares to castle as well.'],
      ['e5', 'Strike at the center instead of letting White’s space remain uncontested.'],
      ['O-O', 'White castles. Both sides now choose plans based on the pawn structure.'],
      ['Nc6', 'Develop and increase pressure on d4.'],
    ],
    quizzes: [
      { at: 3, prompt: 'Which move prepares the king bishop’s fianchetto?', options: ['g6', 'e6', 'd5'], hint: 'Make room for the bishop on g7.', explanation: '...g6 prepares ...Bg7, where the bishop influences the center from the long diagonal.' },
      { at: 11, prompt: 'After castling, how does Black challenge White’s large center?', options: ['e5', 'c5', 'a6'], hint: 'Push the e-pawn to meet White’s central pawns.', explanation: '...e5 is the central break in this illustrative King’s Indian setup. ...c5 is another thematic option in different positions.' },
    ],
  },
];

export function lessonPosition(lesson, ply = 0) {
  const chess = new Chess();
  for (const [san] of lesson.moves.slice(0, ply)) chess.move(san);
  return chess;
}

export function matchingLessonLine(lesson, openings) {
  const opening = openings.find(item => item.id === lesson.openingId);
  const sequence = lesson.moves.map(([san]) => san);
  const line = opening?.lines.filter(candidate => sequence.every((san, index) => candidate.moves[index] === san))
    .sort((a, b) => a.moves.length - b.moves.length)[0];
  return line ? { ...line, openingId:opening.id, openingName:opening.name, repertoireColor:opening.color } : null;
}

export function openingLessonReason(line, ply) {
  const lesson = OPENING_LESSONS.find(item => item.openingId === line.openingId && item.moves.length > ply &&
    item.moves.slice(0, ply + 1).every(([san], index) => line.moves[index] === san));
  return lesson?.moves[ply]?.[1] || null;
}

