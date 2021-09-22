export interface ChatCommand {
    word: string;
    line: number;
    column: number;
    direction: string;
}
//enum Direction { h,v}
