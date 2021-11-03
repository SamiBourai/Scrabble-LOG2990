export interface Game {
    clientName: string;
    gameName: string;
    socketId?: string;
    gameTime: { min: number; sec: number };
    aleatoryBonus: boolean;
}
