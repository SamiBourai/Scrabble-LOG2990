import { Vec2 } from '@app/classes/vec2';

// grid-service
export const DEFAULT_WIDTH = 600;
export const DEFAULT_HEIGHT = 600;
export const NB_LETTER_HAND = 7;
export const HAND_POSITION_START = 4;
export const HAND_POSITION_END = 11;
export const CTX_PX = 15;

// play-area-comp
export const WIDTH = 800;
export const HEIGHT = 800;
export const BOX = 15;
export const TOPSPACE = 50;
export const LEFTSPACE = 100;

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
    { x: 7, y: 7 },
];
