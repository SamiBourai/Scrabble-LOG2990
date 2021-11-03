import { ChatCommand } from './chat-command';
import { Letter } from './letter';

export interface MessageServer {
    gameName: string;
    guestPlayer?: { name: string; score?: number; easelLetters?: number };
    user?: { name: string; score?: number; easelLetters?: number };
    reserve?: Letter[];
    timeConfig?: { sec: number; min: number };
    aleatoryBonus?: boolean;
    gameAccepted?: boolean;
    message?: string[];
    reason?: string;
    command?: ChatCommand;
    word?: Letter[];
    isValid?: boolean;
    gameStarted?: boolean;
    timer?: { sec: number; min: number; userTurn: boolean };
}
