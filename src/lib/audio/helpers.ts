// audio related helper functions
import AudioEngine from "./audioEngine";

export function secToSamp ( periodInSecond ) {
  const sr = AudioEngine.getBaseContextInfo().sampleRate
  return ( periodInSecond * sr )
}

/**
 * Calculate the length, in ms, of one given subdivision at the specificed BPM
 * @param {number} tempo tempo in Beats Per Minute
 * @param {number} subDiv subdivision for which the length is sought, defaults to 16:th note
 * @returns the length of one subdivision in ms
 */
export function tempoToMs (tempo: number, subDiv = 16)  {
  const beatLen = 1 / (tempo / 60);
  return ((beatLen * 4) / subDiv) * 1000;
};

export function sampToMs ( samples: number ) {
  const sr = AudioEngine.getBaseContextInfo().sampleRate || 44100
  return ((1000/sr) * samples)
}
export function bpmToHz (tempo: number, subDiv = 16)  {
  return (tempo / (60 * 4)) * subDiv;
};

export function msToHz (ms: number) {
  return ( 1 / ( ms / 1000) )
}
export function noteToMidi (n: string)  {
  let notes = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let [_, name, octave] = n.match(
    /(?<name>\w?#?)(?<octave>\d)/
  ) as RegExpMatchArray;
  if (notes.indexOf(name) < 0) return -1;
  return 12 * Number(octave) + notes.indexOf(name);
};

export function midiToFrequency (m: number)  {
  if (m < 0) {
    return 0;
  }
  return 440 * Math.pow(2, (m - 69) / 12);
};

export function range (n: number, start: number = 0) {
 return [ ...Array.from( Array(n).keys() ).map( (k) => k + start) ];
}

/**
 * Generates a scale of the desired length from a scale of note names
 *
 * @param scale an array of note names, e.g. `["a3", "c#4"]`
 * @param numNotes the length of the resulting array
 * @param octave the starting octave
 * @param octaveBreak specifies an offset into the scale array where it should increase the octave.
 *
 * @example
 * // returns [440, 660, 880, 1760]
 * makeScale(["a, e"], 4, 4)
 * @example
 * // returns [55, 65.4, 82.4, 110, 130.8, 164.8, 220]
 * makeScale("a,c,e".split(","), 7, 3, 1)
 * @returns an array of frequency values
 */
export function makeScale (
  scale: string[],
  numNotes = scale.length,
  octave = 4,
  octaveBreak = 0,
)  {
  const noteNames = range(numNotes).map(
    (i) =>
      `${scale[i % scale.length]}${
        Math.floor((i - octaveBreak) / scale.length) + octave
      }`,
  );
  return noteNames.flat().map(noteToMidi).map(midiToFrequency);
};
