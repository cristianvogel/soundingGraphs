import {Writable, writable} from "svelte/store";
import type Elementary from "../audio/audioEngine";

type AudioStore = {
  context: AudioContext
  contextState: AudioContextState
  elementaryReady: boolean,
  sampleRate: number
}

type SpeechStore = {
  errorCode?: SpeechSynthesisErrorCode,
  wordCount: number,
  isActive: boolean,
  latestUtterance: string
}

//audio
export const audioEngine: Writable<Elementary> = writable()
export const audioStore: Writable<AudioStore> = writable(
  { context: null,
    contextState: 'suspended',
    elementaryReady: false,
    sampleRate: 44100
  }
)

//speech
export const speechEngine: Writable<SpeechSynthesis> = writable( )
export const speechStore: Writable<SpeechStore> = writable(
  { wordCount: 0, isActive: true, latestUtterance: '' }
)
