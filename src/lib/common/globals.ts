// Global static consts used around the code

export const TEXT_CHAR_LIMIT: number = 24;

// Sound
export const USING_SOUND_ENGINE: string  = 'Elementary';
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
    RANDOM = 'RANDOM_WAVE',
    FOUR_REV = 'FOUR_REV',
    FOUR_EXPO = 'FOUR_EXPO',
    FAST_BOW = 'FAST_BOW',
    GEOMETRIC = 'GEOMETRIC_RND',
}



