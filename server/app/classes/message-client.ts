import { ChatCommand } from './chat-command';
import { Letter } from './letters';
import { Objectifs } from './Objectifs';
import { Vec2 } from './vec2';
export interface MessageClient {
    gameName: string;
    guestPlayer?: { name: string; score?: number; easelLetters?: number };
    user?: { name: string; score?: number; easelLetters?: number };
    timeConfig?: { sec: number; min: number };
    aleatoryBonus?: boolean;
    gameAccepted?: boolean;
    message?: string;
    reason?: string;
    command?: ChatCommand;
    word?: Letter[];
    isValid?: boolean;
    gameStarted?: boolean;
    timer?: { sec: number; min: number; userTurn: boolean };
    arrayOfBonusBox?: Vec2[][];
    winner?: string;
    usedWords?: string;
    passTurn?: boolean;
    reserve?: string;
    reserveSize?: number;
    easel?: Letter[];
    modeLog2990?: boolean;
    objectifs?: Objectifs[];
    achivedObjectif?: Objectifs;
}
