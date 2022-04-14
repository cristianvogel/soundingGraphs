import {Writable, writable} from "svelte/store";
import type Elementary from "../audio/audioEngine";

type AudioStore = {
  context: AudioContext
  contextState: AudioContextState
  elementaryReady: boolean,
  sampleRate: number
}

type SpeechState = {
  volume: number;
  errorCode?: SpeechSynthesisErrorCode,
  wordCount: number,
  isActive: boolean,
  latestUtterance: string,
  currentVoice: SpeechSynthesisVoice,
  speaking: boolean
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
export const speechSynthesis: Writable<SpeechSynthesis> = writable()
export const speechState: Writable<SpeechState> = writable(
  {
    wordCount: 0,
    isActive: true,
    latestUtterance: '',
    currentVoice: undefined,
    speaking: false,
    volume: 0.3
  }
)
