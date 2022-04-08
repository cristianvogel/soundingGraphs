/**
 * Routines to correctly load samples from local assets through
 * the AudioContext buffer creation method which instantiates
 * audio buffers for use in the Elementary virtual file system
 * Additionally, the loaded buffers are available here in typed Arrays
 */

import AudioEngine from "./audioEngine";
import type { AudioFileName, MonoSampleFile, SampleBuffer } from "../../types/audio";
import type { MonoWaveTable } from "../../types/audio";
import { addControlWave, ControlWaves } from "./control";

export const MonoSamples : Map<String, MonoSampleFile> = new Map()

export async function asSamplesFile  ( {url, category, tag = url}: AudioFileName ) : Promise<SampleBuffer>  {
  const { context, status, sampleRate } = AudioEngine.getBaseContextInfo();
  if (!context) { console.log ( `Sample file loading bad context: ${status}`) }

  const source = context.createBufferSource();
  const res = await fetch(url);

  await context.decodeAudioData(await res.arrayBuffer(), function(buffer) {
      source.buffer = buffer
      source.connect(context.destination);
    },
    function(e: DOMException) {
      console.log("Error with decoding audio data " + e.message);
      return e.code
    });

  const samples = source.buffer.getChannelData(0)

  switch (category) {
    case "wavetable":
      addControlWave({ samples: samples, sampleRate: sampleRate, lengthInSamples: samples.length, name: tag });
      break;
    case "sample":
      addMonoSample({ samples: samples, sampleRate: sampleRate, lengthInSamples: samples.length, name: tag });
      break;
    case "multisample":
      break;
  }
  return samples
}

export function addMonoSample( wt: MonoSampleFile ) {
  MonoSamples.set( wt.name || wt.metadata.tag, wt)
}
