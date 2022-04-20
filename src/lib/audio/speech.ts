import { get } from "svelte/store";
import { speechSynthesis, speechState } from "../stores/audioStores";
import { EPSILON } from "../common/globals";

const _ = null

export class Speech {

  voices: Array<SpeechSynthesisVoice>
  private speechVolume:number = 0.3
  speaking: boolean = false
  private wordCount = 0
  private currentVoice: SpeechSynthesisVoice

  constructor() {
    // weirdly cannot instantiate SpeechSynthesis in constructor without problems
  }

  populateVoiceList() {
    this.voices = get(speechSynthesis).getVoices().sort(function(a, b) {
      const nameA = a.name.toUpperCase(), nameB = b.name.toUpperCase();
      if (nameA < nameB) return -1;
      else if (nameA == nameB) return 0;
      else return +1;
    });
  }

  speak(inputText:string) {
    //todo: implement voices user selectable list
    if (!get(speechSynthesis)) return
    if (!this.voices) this.populateVoiceList()
    if (get(speechSynthesis).speaking) this.speaking = true
    this.utter(inputText);
  }

  private initSpeechUtterance(inputText: string): SpeechSynthesisUtterance {
    const utterance = new SpeechSynthesisUtterance(inputText)
    utterance.onend = (event) => this.unblockSpeech();
    utterance.onerror = function(event) {
      console.error("SpeechSynthesisUtterance.onerror");
    }
    return utterance
  }

  private utter(inputText: string) {
    this.setVolume()
    if ((!this.speaking) && (inputText !== "") && (this.speechVolume > EPSILON)) {
      const utterance = this.initSpeechUtterance(inputText);
      utterance.text = inputText;
      utterance.voice = this.currentVoice;
      utterance.pitch = 0.8 + (Math.random()*0.2)
      utterance.rate = 0.9 + (Math.random()*0.2)
      utterance.volume = get(speechState).volume;
      this.wordCount++;
      console.log(`Uttering ${inputText} at volume ${utterance.volume}`);
      get(speechSynthesis).speak(utterance);
      this.updateSpeechStore(inputText);
    }
  }

  private unblockSpeech() {
    this.speechVolume = get(speechState).volume
    this.speaking = false;
  }

  private updateSpeechStore(inputText?: string, speaking?: boolean, volume?: 0) {
    speechState.update(store => ({
      ...store,
      latestUtterance: inputText,
      currentVoice: this.currentVoice,
      wordCount: this.wordCount,
      speaking: this.speaking || speaking,
      volume: volume || this.speechVolume
    }));
  }

  setVolume( newVolume?:number ){
    // Speech API is buggy, this needs rounding to work
    const v =  ( newVolume || get(speechState).volume || 0)
    //console.log( `Set voice volume to ${v}`)
    this.speechVolume = Number( v.toPrecision(2))
    this.updateSpeechStore();
  }

  muteVoice() {
    this.speechVolume = 0;
    this.updateSpeechStore();
  }

  // todo:
  // getVoicesList():Map<string,MappedVoice>{
  //   let voicesMap = new Map();
  //   this.voices.map( ( v, i)  => {
  //       voicesMap.set( v.name, { index: i, language: v.lang, voice: v } );
  //     }
  //    )
  //   return voicesMap
  // }
  //
  // setCurrentVoice( name:string){
  //   const vox:SpeechSynthesisVoice = this.getVoicesList().get(name).voice
  //   this.currentVoice = vox ? vox : this.currentVoice
  // }

}
