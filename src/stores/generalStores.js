import {writable} from "svelte/store";

export const up = writable( true )
export const step = writable( 10 )
export const offset = writable ( 0 )
export const hidden = writable( true )
