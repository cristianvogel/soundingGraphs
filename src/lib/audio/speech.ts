import { get } from "svelte/store";
import { speechSynthesis, speechState } from "../stores/audioStores";
import type { MappedVoice } from "../../types/audio";

export class Speech {

  voices: Array<SpeechSynthesisVoice>
  private speechVolume:number = 0.3
  speaking: boolean = false
  private wordCount = 0
  private currentVoice: SpeechSynthesisVoice
  private utterance: SpeechSynthesisUtterance


  constructor() {
    // weirdly cannot instantiate SpeechSynthesis in constructor without problems
  }

  private initSpeechUtterance(inputText: string): SpeechSynthesisUtterance {
    const utterance = new SpeechSynthesisUtterance(inputText)
    utterance.onstart = (event) => this.readyToSpeak();
    utterance.onend = (event) => this.readyToSpeak();
    utterance.onerror = function(event) {
      console.error("SpeechSynthesisUtterance.onerror");
    }
    return utterance
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

    if (get(speechSynthesis).speaking) {
      console.log("speechSynthesis.speaking");
      this.speaking = true;
    }

    if (!this.speaking && inputText !== "") {
      const utterance = this.initSpeechUtterance(inputText);
      utterance.text = inputText
      utterance.voice = this.currentVoice
      utterance.pitch = 0.8 + (Math.random()*0.2);
      utterance.rate = 0.9
      if (utterance.volume !== this.speechVolume) utterance.volume = this.speechVolume
      this.wordCount++
      this.updateSpeechStore(inputText)
      console.log(`Uttering ${inputText} at volume ${this.speechVolume}`)
      get(speechSynthesis).speak(utterance)
    }
  }


  private readyToSpeak() {
    this.speaking = false;
  }

  private updateSpeechStore(inputText: string) {
    speechState.update(store => ({
      ...store,
      latestUtterance: inputText,
      currentVoice: this.currentVoice,
      wordCount: this.wordCount
    }));
  }

  getVoicesList():Map<string,MappedVoice>{
    let voicesMap = new Map();
    this.voices.map( ( v, i)  => {
        voicesMap.set( v.name, { index: i, language: v.lang, voice: v } );
      }
     )
    return voicesMap
  }

  setCurrentVoice( name:string){
    const vox:SpeechSynthesisVoice = this.getVoicesList().get(name).voice
    this.currentVoice = vox ? vox : this.currentVoice
  }

  setVolume( newVolume?:number ){
    if ( newVolume !== this.speechVolume  ) this.speechVolume = newVolume
  }
}
