// Global static consts used around the code

// Display
export const TEXT_CHAR_LIMIT: number = 24;

// Sound
export const USING_SOUND_ENGINE: string  = 'Elementary';
export enum Sound {
    UNMOUNTED= 'UNMOUNTED',
    MOUNTING = 'MOUNTING',
    MOUNTED = 'MOUNTED',
    PAUSED = 'PAUSED',
    PLAYING = 'PLAYING',
    SUSPENDED = 'SUSPENDED',
    MAX_VOLUME = 0.8
}

