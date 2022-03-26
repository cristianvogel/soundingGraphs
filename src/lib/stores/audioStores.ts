import {Writable, writable} from "svelte/store";
import type Elementary from "../audio/audioEngine";

type AudioStore = {
  context: AudioContext
  contextState: AudioContextState
  elementaryReady: boolean
}

//audio
export const audioEngine: Writable<Elementary> = writable()
export const audioStore: Writable<AudioStore> = writable(
  { context: null, contextState: 'suspended', elementaryReady: false }
)
