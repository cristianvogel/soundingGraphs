// Global static consts used around the code

// Display
import * as path from "path";

export const TEXT_CHAR_LIMIT: number = 24;

// Sound
export const USING_SOUND_ENGINE: string  = 'Elementary';
const TABLES_LENGTH = 512

export enum Sound {
    UNMOUNTED= 'UNMOUNTED',
    MOUNTING = 'MOUNTING',
    MOUNTED = 'MOUNTED',
    PAUSED = 'PAUSED',
    PLAYING = 'PLAYING',
    MAX_VOLUME = 0.8
}

export enum FSM_STATE_ACTORS {
    MUTE = 'Mute',
    STATE_CHANGE = 'StateChange',
    PING = 'Ping',
    SONIFY_BUTTON = 'SonifyButton'
}

export const PATH_WAVETABLES = '/waves'

let expAttack = Array.from({length: TABLES_LENGTH-1}).map((_,i) => 1 / (i+1))
expAttack.push(0)
let randomWave = Array.from({length: TABLES_LENGTH-1}).map((_,i) => Math.random())
randomWave.push(0)

export const ControlWaves = {
    EXP_ATTACK: expAttack,
    RANDOM: randomWave
}
