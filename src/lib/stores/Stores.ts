import {Writable, writable} from "svelte/store";
import type Elementary from "../../script/audioEngine";

type AudioStore = {
  context: AudioContext
  contextState: AudioContextState
  elementaryReady: boolean
}

//display
export const tableViewState: () => Writable<boolean> = function () {return writable(true)}

//audio
export const audioEngine: Writable<Elementary> = writable()

export const audioStore: Writable<AudioStore> = writable(
  { context: null, contextState: 'suspended', elementaryReady: false }
)

