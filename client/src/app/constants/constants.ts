import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';

export const comparePositions = (a: Vec2, b: Vec2) => a.x === b.x && a.y === b.y;

// user-service
export const NUMBER_COMPARED = 20;
export const NUMBER_TO_COMPARE = 10;
export const MINUTE_TURN = 59;
export const VR_TIME_PASS_TURN = 20;
export const ONE_SECOND_MS = 1000;
export const TIME_OF_VR = 17;
export const ONE_MINUTE = 1;
export const ONE_SECOND = 1;
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

// play-area-comp
export const CANEVAS_WIDTH = 900;
export const CANEVAS_HEIGHT = 900;
export const NB_TILES = 15;
export const TOPSPACE = 25;
export const LEFTSPACE = 50;

// LETTERS
export const NOT_A_LETTER: Letter = { score: 0, charac: '1', img: 'no-image' };
export const A: Letter = { score: 1, charac: 'a', img: '../../assets/letter-A.png' };
export const B: Letter = { score: 3, charac: 'b', img: '../../assets/letter-b.png' };
export const C: Letter = { score: 3, charac: 'c', img: '../../assets/letter-c.png' };
export const D: Letter = { score: 2, charac: 'd', img: '../../assets/letter-d.png' };
export const E: Letter = { score: 1, charac: 'e', img: '../../assets/letter-e.png' };
export const F: Letter = { score: 4, charac: 'f', img: '../../assets/letter-f.png' };
export const G: Letter = { score: 2, charac: 'g', img: '../../assets/letter-g.png' };
export const H: Letter = { score: 4, charac: 'h', img: '../../assets/letter-h.png' };
export const I: Letter = { score: 1, charac: 'i', img: '../../assets/letter-i.png' };
export const J: Letter = { score: 8, charac: 'j', img: '../../assets/letter-j.png' };
export const K: Letter = { score: 10, charac: 'k', img: '../../assets/letter-k.png' };
export const L: Letter = { score: 1, charac: 'l', img: '../../assets/letter-l.png' };
export const M: Letter = { score: 2, charac: 'm', img: '../../assets/letter-m.png' };
export const N: Letter = { score: 1, charac: 'n', img: '../../assets/letter-n.png' };
export const O: Letter = { score: 1, charac: 'o', img: '../../assets/letter-o.png' };
export const P: Letter = { score: 3, charac: 'p', img: '../../assets/letter-p.png' };
export const Q: Letter = { score: 8, charac: 'q', img: '../../assets/letter-q.png' };
export const R: Letter = { score: 1, charac: 'r', img: '../../assets/letter-r.png' };
export const S: Letter = { score: 1, charac: 's', img: '../../assets/letter-s.png' };
export const T: Letter = { score: 1, charac: 't', img: '../../assets/letter-t.png' };
export const U: Letter = { score: 1, charac: 'u', img: '../../assets/letter-u.png' };
export const V: Letter = { score: 4, charac: 'v', img: '../../assets/letter-v.png' };
export const W: Letter = { score: 10, charac: 'w', img: '../../assets/letter-w.png' };
export const X: Letter = { score: 10, charac: 'x', img: '../../assets/letter-x.png' };
export const Y: Letter = { score: 10, charac: 'y', img: '../../assets/letter-y.png' };
export const Z: Letter = { score: 10, charac: 'z', img: '../../assets/letter-z.png' };

// easel
export const EASEL_LENGTH = 7;
export const CLEAR_RECT_FIX = 5;

// userService
export const intervalId = 0;
// play-area

// virtual-player- service
export const MAX_INDEX_NUMBER_EASEL = 6;
export const MAX_INDEX_NUMBER_PROBABILITY_ARRAY = 9;
export const ZERO_POINTS = 0;
export const SIX_POINTS = 6;
export const SEVEN_POINTS = 7;
export const TWELVE_POINTS = 12;
export const THIRTEEN_POINTS = 13;
export const EIGHTEEN_POINTS = 18;
export const INITIAL_BOX_X = 8;
export const INITIAL_BOX_Y = 8;
export const ASCI_CODE_A = 97;
export const WAIT_TIME_3_SEC = 3000;
export const DEFAULT_POS = -1;
export const NUMBER_RANGE_BOXES = 14;

// grid
export const RED_BOX: Vec2[] = [
    { x: 0, y: 0 },
    { x: 7, y: 0 },
    { x: 14, y: 0 },
    { x: 0, y: 7 },
    { x: 14, y: 7 },
    { x: 0, y: 14 },
    { x: 7, y: 14 },
    { x: 14, y: 14 },
];
export const AZUR_BOX: Vec2[] = [
    { x: 3, y: 0 },
    { x: 11, y: 0 },
    { x: 6, y: 2 },
    { x: 8, y: 2 },
    { x: 0, y: 3 },
    { x: 7, y: 3 },
    { x: 14, y: 3 },
    { x: 2, y: 6 },
    { x: 6, y: 6 },
    { x: 8, y: 6 },
    { x: 12, y: 6 },
    { x: 3, y: 7 },
    { x: 11, y: 7 },
    { x: 2, y: 8 },
    { x: 6, y: 8 },
    { x: 8, y: 8 },
    { x: 12, y: 8 },
    { x: 0, y: 11 },
    { x: 7, y: 11 },
    { x: 14, y: 11 },
    { x: 6, y: 12 },
    { x: 8, y: 12 },
    { x: 3, y: 14 },
    { x: 11, y: 14 },
];
export const BLUE_BOX: Vec2[] = [
    { x: 5, y: 1 },
    { x: 9, y: 1 },
    { x: 1, y: 5 },
    { x: 5, y: 5 },
    { x: 9, y: 5 },
    { x: 13, y: 5 },
    { x: 1, y: 9 },
    { x: 5, y: 9 },
    { x: 9, y: 9 },
    { x: 13, y: 9 },
    { x: 5, y: 13 },
    { x: 9, y: 13 },
];
export const PINK_BOX: Vec2[] = [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 3 },
    { x: 4, y: 4 },
    { x: 13, y: 1 },
    { x: 12, y: 2 },
    { x: 11, y: 3 },
    { x: 10, y: 4 },
    { x: 1, y: 13 },
    { x: 2, y: 12 },
    { x: 3, y: 11 },
    { x: 4, y: 10 },
    { x: 13, y: 13 },
    { x: 12, y: 12 },
    { x: 11, y: 11 },
    { x: 10, y: 10 },
];

// sidebar

// the length of the command !placer and !echanger
export const PLACE_LENGTH = 7;
export const SWAP_LENGTH = 9;
export const SIX = 6;

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
