import {writable} from "svelte/store";


export const __tableViewState = () => writable( true )
export const __columnColour = ( value = {} ) => writable( value )
