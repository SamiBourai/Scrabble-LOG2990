import { MousePosition } from '@app/classes/mouse-position';
import { Vec2 } from '@app/classes/vec2';
import { BOARD_WIDTH, FIVE, HAND_POSITION_START, LEFTSPACE, NB_TILES, SEVEN_POINTS, SIX } from './constants';

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

export const DEFAULT_RED_BOX: Vec2[] = [
    { x: 0, y: 0 },
    { x: 7, y: 0 },
    { x: 14, y: 0 },
    { x: 0, y: 7 },
    { x: 14, y: 7 },
    { x: 0, y: 14 },
    { x: 7, y: 14 },
    { x: 14, y: 14 },
];
export const DEFAULT_AZUR_BOX: Vec2[] = [
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
export const DEFAULT_BLUE_BOX: Vec2[] = [
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
export const DEFAULT_PINK_BOX: Vec2[] = [
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
const NINE = 9;
const TEN = 10;
const ELEVEN = 11;
const EIGHT = 8;
export const EASEL_POSITIONS: MousePosition[] = [
    {
        letterRange: { min: LEFTSPACE + HAND_POSITION_START * (BOARD_WIDTH / NB_TILES), max: LEFTSPACE + FIVE * (BOARD_WIDTH / NB_TILES) },
        index: 0,
        isClicked: false,
    },
    {
        letterRange: { min: LEFTSPACE + FIVE * (BOARD_WIDTH / NB_TILES), max: LEFTSPACE + SIX * (BOARD_WIDTH / NB_TILES) },
        index: 1,
        isClicked: false,
    },
    {
        letterRange: { min: LEFTSPACE + SIX * (BOARD_WIDTH / NB_TILES), max: LEFTSPACE + SEVEN_POINTS * (BOARD_WIDTH / NB_TILES) },
        index: 2,
        isClicked: false,
    },
    {
        letterRange: { min: LEFTSPACE + SEVEN_POINTS * (BOARD_WIDTH / NB_TILES), max: LEFTSPACE + EIGHT * (BOARD_WIDTH / NB_TILES) },
        index: 3,
        isClicked: false,
    },
    {
        letterRange: { min: LEFTSPACE + EIGHT * (BOARD_WIDTH / NB_TILES), max: LEFTSPACE + NINE * (BOARD_WIDTH / NB_TILES) },
        index: 4,
        isClicked: false,
    },
    {
        letterRange: { min: LEFTSPACE + NINE * (BOARD_WIDTH / NB_TILES), max: LEFTSPACE + TEN * (BOARD_WIDTH / NB_TILES) },
        index: 5,
        isClicked: false,
    },
    {
        letterRange: { min: LEFTSPACE + TEN * (BOARD_WIDTH / NB_TILES), max: LEFTSPACE + ELEVEN * (BOARD_WIDTH / NB_TILES) },
        index: 6,
        isClicked: false,
    },
];

export const ALL_BONUS_BOX: Vec2[] = [
    { x: 0, y: 0 },
    { x: 7, y: 0 },
    { x: 14, y: 0 },
    { x: 0, y: 7 },
    { x: 14, y: 7 },
    { x: 0, y: 14 },
    { x: 7, y: 14 },
    { x: 14, y: 14 },
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
