export interface Game {
    clientName?: string;
    gameName: string;
    gameTime?: { min: number; sec: number };
    socketId?: string;
    joinedUserName?: string;
    aleatoryBonus?: boolean;
}
