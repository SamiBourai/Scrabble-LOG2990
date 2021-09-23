export interface ChatCommand {
    word: string,
    line: string,
    column: number,
    direction: string,
}
//enum Direction { h,v}