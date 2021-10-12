import { Vec2 } from './vec2';

export interface ChatCommand {
    word: string;
    position: Vec2;
    direction: string;
}
