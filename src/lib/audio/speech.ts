import { get, Writable } from "svelte/store";
import { speechEngine, speechStore } from "../stores/audioStores";

export class Speech {

  synth;
  voices:Array<SpeechSynthesisVoice>;

  constructor() {
    //this.synth = get(speechEngine);
    //this.populateVoiceList()
  }

  populateVoiceList() {
    this.voices = this.synth.getVoices().sort(function(a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if (aname < bname) return -1;
      else if (aname == bname) return 0;
      else return +1;
    });
  }

  speak(inputTxt:string) {
    this.synth = get(speechEngine)
    speechStore.update(store => ({ ...store, latestUtterance: inputTxt }))
    if (!this.voices) this.populateVoiceList()
    const utterThis = new SpeechSynthesisUtterance(inputTxt);
    if (this.synth.speaking) {
      console.log("speechSynthesis.speaking");
      return;
    }
    if (inputTxt !== "") {
      utterThis.onend = function(event) {
        console.log("SpeechSynthesisUtterance.onend");
      };
      utterThis.onerror = function(event) {
        console.error("SpeechSynthesisUtterance.onerror");
      };

      utterThis.voice = this.voices[21];
    }
    utterThis.pitch = 0.8 + (Math.random()*0.2);
    utterThis.rate = 0.9;
    utterThis.volume = 0.1;
    this.synth.speak(utterThis);
  }
}
