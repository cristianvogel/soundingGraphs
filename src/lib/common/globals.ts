// Global static consts used around the code

import { expoOut } from "svelte/easing";

export const TEXT_CHAR_LIMIT:number = 24
export const EPSILON:number = 1.0e-4

// Sound
export const USING_SOUND_ENGINE:string  = 'Elementary'
export const DEFAULT_TABLE_LENGTH = 512

export enum Sound {
    UNMOUNTED= 'UNMOUNTED',
    MOUNTING = 'MOUNTING',
    MOUNTED = 'MOUNTED',
    PAUSED = 'PAUSED',
    PLAYING = 'PLAYING',
    MAX_VOLUME = 2.0
}

export enum Waves {
    EXP = 'EXP_ATTACK',
    PERLIN = 'PERLIN_WAVE',
    RANDOM_GAUSS = 'RANDOM_GAUSS',
    FOUR_REV = 'FOUR_REV',
    FOUR_EXPO = 'FOUR_EXPO',
    FAST_BOW = 'FAST_BOW',
    GEOMETRIC = 'GEOMETRIC_RND',
    REV_EXP = 'REV_EXP',
}

export enum GraphScrubKeys {
    ROW = 'Row',
    POINT = 'Value'
}

