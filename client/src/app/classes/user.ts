import { EaselObject } from './easel-object';

export interface VrUser {
    name: string;
    level: string;
    round: string;
    score: number;
    easel: EaselObject;
}

export interface RealUser extends VrUser {
    firstToPlay: boolean;
    turnToPlay: boolean;
}

export interface JoinedUser extends VrUser {
    guestPlayer: boolean;
}
