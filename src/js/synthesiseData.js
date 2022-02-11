// functions to fill arrays for testing or otherwise

import Perlin from "./perlin.js";

export function noise(  size = 64, step = 0.01, initialOffset, fullRange = false ) {

    const noiseFunc = Perlin;
    let result = [];
    for ( let i=0; i<size; i++) {
        const s = (i * step) + initialOffset;
        let val = noiseFunc.get( s * (1/4) , s);
        if (!(fullRange)) val = (val / 2) + 0.5; // scale and offset to 0-1
       result.push(val);
        }
return result || [ 0 ]
}


