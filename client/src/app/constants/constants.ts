import { Letter } from '@app/classes/letter';
import { GameTime } from '@app/classes/time';
import { Vec2 } from '@app/classes/vec2';
import { Pair } from './../classes/pair';

export const comparePositions = (a: Vec2, b: Vec2) => a.x === b.x && a.y === b.y;
export const ENTER = 13;
export const COMMA = 188;
// modal user-component
export const TIME_CHOICE: GameTime[] = [
    { min: 0, sec: 30 },
    { min: 1, sec: 0 },
    { min: 1, sec: 30 },
    { min: 2, sec: 0 },
    { min: 2, sec: 30 },
    { min: 3, sec: 0 },
    { min: 3, sec: 30 },
    { min: 4, sec: 0 },
    { min: 4, sec: 30 },
    { min: 5, sec: 0 },
];
export const MODES: string[] = ['Aléatoire', 'Normal'];
export const LVL_JV: string[] = ['Expert', 'Normal'];
export const EXPERT_NAMES: string[] = ['Tahanus-23000', 'WorldValidator', 'KoneQuePlacerSeulement'];
export const DEFAULT_TIME = 1;
export const DEFAULT_MODE = 1;
// user-service
export const FIRST_NAME = 'Bobby1234';
export const SECOND_NAME = 'Martin1234';
export const THIRD_NAME = 'VirtualPlayer1234';
export const FOURTH_NAME = 'Felix1234';
export const FIFTH_NAME = 'Emmanuel1234';
export const SIXTH_NAME = 'Halouf1234';
export const MAX_PLAYER = 3;
export const NUMBER_COMPARED = 20;
export const NUMBER_TO_COMPARE = 10;
export const MINUTE_TURN = 59;
export const VR_TIME_PASS_TURN = 20;
export const ONE_SECOND_MS = 1000;
export const TIME_OF_VR = 17;
export const ONE_MINUTE = 1;
export const ONE_SECOND = 1;
export const SIX_TURN = 6;
// word-point-service
export const BONUS_WORD_LENGTH = 7;
export const BONUS_POINTS_50 = 25;
export const MAX_LINES = 15;
export const MIN_LINES = 0;
export const UNDEFINED_INDEX = -1;
// grid-service
export const BOARD_WIDTH = 800;
export const BOARD_HEIGHT = 800;
export const NB_LETTER_HAND = 7;
export const HAND_POSITION_START = 4;
export const HAND_POSITION_END = 11;
export const CTX_PX = 15;
export const ADJUSTEMENT_TOPSPACE = 5;
export const H_ARROW = '→';
export const V_ARROW = '↓';
// play-area-comp
export const CANEVAS_WIDTH = 900;
export const CANEVAS_HEIGHT = 900;
export const NB_TILES = 15;
export const TOPSPACE = 25;
export const LEFTSPACE = 50;
// LETTERS
export const NOT_A_LETTER: Letter = { score: 0, charac: '1', img: 'no-image' };
export const A: Letter = { score: 1, charac: 'a', img: './assets/letter-A.png' };
export const B: Letter = { score: 3, charac: 'b', img: './assets/letter-b.png' };
export const C: Letter = { score: 3, charac: 'c', img: './assets/letter-c.png' };
export const D: Letter = { score: 2, charac: 'd', img: './assets/letter-d.png' };
export const E: Letter = { score: 1, charac: 'e', img: './assets/letter-e.png' };
export const F: Letter = { score: 4, charac: 'f', img: './assets/letter-f.png' };
export const G: Letter = { score: 2, charac: 'g', img: './assets/letter-g.png' };
export const H: Letter = { score: 4, charac: 'h', img: './assets/letter-h.png' };
export const I: Letter = { score: 1, charac: 'i', img: './assets/letter-i.png' };
export const J: Letter = { score: 8, charac: 'j', img: './assets/letter-j.png' };
export const K: Letter = { score: 10, charac: 'k', img: './assets/letter-k.png' };
export const L: Letter = { score: 1, charac: 'l', img: './assets/letter-l.png' };
export const M: Letter = { score: 2, charac: 'm', img: './assets/letter-m.png' };
export const N: Letter = { score: 1, charac: 'n', img: './assets/letter-n.png' };
export const O: Letter = { score: 1, charac: 'o', img: './assets/letter-o.png' };
export const P: Letter = { score: 3, charac: 'p', img: './assets/letter-p.png' };
export const Q: Letter = { score: 8, charac: 'q', img: './assets/letter-q.png' };
export const R: Letter = { score: 1, charac: 'r', img: './assets/letter-r.png' };
export const S: Letter = { score: 1, charac: 's', img: './assets/letter-s.png' };
export const T: Letter = { score: 1, charac: 't', img: './assets/letter-t.png' };
export const U: Letter = { score: 1, charac: 'u', img: './assets/letter-u.png' };
export const V: Letter = { score: 4, charac: 'v', img: './assets/letter-v.png' };
export const W: Letter = { score: 10, charac: 'w', img: './assets/letter-w.png' };
export const X: Letter = { score: 10, charac: 'x', img: './assets/letter-x.png' };
export const Y: Letter = { score: 10, charac: 'y', img: './assets/letter-y.png' };
export const Z: Letter = { score: 10, charac: 'z', img: './assets/letter-z.png' };

export const RESERVE_SIZE = 100;

// easel
export const EASEL_LENGTH = 7;
export const CLEAR_RECT_FIX = 5;
// userService
export const intervalId = 0;
// virtual-player- service
export const MAX_INDEX_NUMBER_EASEL = 6;
export const MAX_INDEX_NUMBER_PROBABILITY_ARRAY = 9;
export const ZERO_POINTS = 0;
export const SIX_POINTS = 6;
export const SEVEN_POINTS = 7;
export const TWELVE_POINTS = 12;
export const FIFTEEN = 15;
export const THIRTEEN_POINTS = 13;
export const EIGHTEEN_POINTS = 18;
export const INITIAL_BOX_X = 8;
export const INITIAL_BOX_Y = 8;
export const ASCI_CODE_A = 97;
export const WAIT_TIME_3_SEC = 3000;
export const DEFAULT_POS = -1;
export const NUMBER_RANGE_BOXES = 14;
export const FIVE = 5;

// grid

export const SWAP_BUTTON_RANGE_X = { min: 3, max: 85 };
export const SWAP_BUTTON_RANGE_Y = { min: 4, max: 29 };
export const EASEL_RANGE = { min: 264, max: 637 };

export const RANGE_Y: Pair = { min: 840, max: 887 };

// sidebar
export const COLUMN_RANGE = 16;
// the length of the command !placer and !echanger
export const PLACE_LENGTH = 7;
export const SWAP_LENGTH = 9;
export const SIX = 6;
export const SIX_LETTERS = 6;

// the index for cut the (!placer) and only keep the parameters
export const INDEX_OF_PLACE_PARAMETERS = 8;

// to get the line element of the command place. ex : !placer h12h mot => h
export const INDEX_0 = 0;
export const INDEX_LINE = 1;

// index for get the parameters. ex:  !placer h12h mot=> h12h
export const INDEX_PARAMETERS = 4;

// for get the column of the command when the column > 10. ex: !placer h12h mot => 12
export const FIRST_INDEX_2COLUMN = 1;
export const LAST_INDEX_2COLUMN = 3;

// for get the orientation of the command when the column > 10. ex: !placer h12h mot => h
export const FIRST_INDEX_2ORIENTATION = 3;
export const LAST_INDEX_2ORIENTATION = 4;

// for get the word of the command. ex: !placer h12h
export const INDEX_WORD = 4;
// for get the word of the command. ex: !placer h2h
export const INDEX_2WORD = 5;

// for get the column of the command when the column < 10. ex: !placer h2h mot => 2
export const FIRST_INDEX_COLUMN = 1;
export const LAST_INDEX_COLUMN = 2;

//  for get the orientation of the command when the column < 10. ex: !placer h1h mot => h
export const FIRST_INDEX_ORIENTATION = 2;
export const LAST_INDEX_ORIENTATION = 3;

// to be sure that the command !echanger is not given without parameters
export const MIN_SWAP_LENGTH = 8;
// for get the parametre of the command !echanger. ex: !echanger as => as
export const PARAMETERS_OF_SWAP = 10;
export const FOURTY = 40;

// reserve
export const ONE_LETTER = 1;
export const TWO_LETTER = 2;
export const THREE_LETTER = 3;

export const LETTERS_RESERVE_QTY = new Map<Letter, number>([
    [A, SWAP_LENGTH],
    [B, 2],
    [C, 2],
    [D, 3],
    [E, FIFTEEN],
    [F, 2],
    [G, 2],
    [H, 2],
    [I, MIN_SWAP_LENGTH],
    [J, 1],
    [K, 1],
    [L, INDEX_2WORD],
    [M, 3],
    [N, SIX],
    [O, SIX],
    [P, 2],
    [Q, 1],
    [R, SIX],
    [S, SIX],
    [T, SIX],
    [U, SIX],
    [V, 2],
    [W, 1],
    [X, 1],
    [Y, 1],
    [Z, 1],
]);
// modal user name validator
export const MAX_LENGTH = 15;
export const MIN_LENGTH = 8;
export const FIVE_SEC_MS = 5000;

export const LETTERS_OBJECT = new Map<string, Letter>([
    ['a', A],
    ['b', B],
    ['c', C],
    ['d', D],
    ['e', E],
    ['f', F],
    ['g', G],
    ['h', H],
    ['i', I],
    ['j', J],
    ['k', K],
    ['l', L],
    ['m', M],
    ['n', N],
    ['o', O],
    ['p', P],
    ['q', Q],
    ['r', R],
    ['s', S],
    ['t', T],
    ['u', U],
    ['v', V],
    ['w', W],
    ['x', X],
    ['y', Y],
    ['z', Z],
]);

export const FIRST_POSITION_BOARD = { x: 8, y: 8 } as Vec2;

// database Service constant

export const DATABASE_COLLECTION_CLASSIC = 'Score';
export const DATABASE_COLLECTION_LOG2990 = 'scoreLog2990';
