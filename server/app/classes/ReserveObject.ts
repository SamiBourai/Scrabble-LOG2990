import { Letter } from './letters';

export interface ReserveObject {
    letters: Map<Letter, number>;
    size: number;
}
