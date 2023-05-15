import * as Tone from "tone";
import { capture } from "./functions/viewportFunctions";
const createVolumeObj = (characterArray, rangeArray, leftToRight) => {
  if (!leftToRight) characterArray = characterArray.reverse();
  const lv = rangeArray[0];
  const hv = rangeArray[1];
  let result = { " ": -Infinity };
  const hvZero = hv - lv;
  const interval = hvZero / (characterArray.length - 1);
  for (let i = 0; i < characterArray.length; i++) {
    result[characterArray[i]] = interval * (i + 1) + lv;
  }
  return result;
};

const logNormalize = (x, xRange, newRange) => {
  const minX = xRange[0];
  const maxX = xRange[1];
  const a = newRange[0];
  const b = newRange[1];
  const res = a + ((x - minX) * (b - a)) / (maxX - minX);
  return res;
};

// const values = [' ', '.', ',', '/', '(', '*', '%', '&', '#', '@']

// turn input .txt file into a matrix - array of arrays with length of image width (user inputs this manually)
// for matrix length, scale audible hearing range from 20 - 20,000 hz or input range

// inputs: textFile, imageWidth, lowFreq, hiFreq, tempo multiplier (x * 1ms), invertedBool,

//create instruments
// function collectInstruments(obj) {
//   const instruments = {};
//   for (let k in obj) {
//     instruments[k] = new Instrument();
//   }
//   return instruments;
// }
export function playFileOnce(
  asciiValues,
  file,
  lowFreq,
  hiFreq,
  tempo,
  contextInstruments,
  setIsPlayable
) {
  // get width
  let width = file.split("\n")[0].length;
  // create a matrix to build chords with
  function convertToMatrix(file) {
    return file
      .split("\n")
      .filter((item) => item.length > 1)
      .reverse(); // reversed so that first array corresponds with lowest note
  }
  function createPitchMap(matrix) {
    const pitchMap = {};
    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i].length === width) pitchMap[i] = matrix[i].split("");
    }
    return pitchMap;
  }

  function createNormalizedValuesObject(lf, hf, length) {
    // ratios are the same, so
    const returnObj = { 0: lf };
    const hfZero = hf - lf;
    for (let i = 1; i < length; i++) {
      const ratioIncrease = returnObj[i - 1] * 1.05945946;
      // logNormalize(i, [0, length], [lf, hf])
      returnObj[i] = ratioIncrease;
    }
    return returnObj;
  }

  function playImage(length, chordObj, pitches, instr) {
    console.log("one play: ", { length, chordObj, pitches, instr });

    // const interval = setInterval(() => {
    //   for (let key in chordObj) {
    //     const volume = volumes[chordObj[key][sampleCount]];
    //     instr[key].play(pitches[key], volume, 0);
    //   }
    //   sampleCount++;
    //   if (sampleCount === width) {
    //     for (let k in instr) {
    //       instr[k].stop();
    //     }
    //     clearInterval(interval);
    //   }
    // }, (tempo * 1000) / width);

    const volumes = createVolumeObj(asciiValues, [-120, -20], true);
    let sampleCount = width - 1;
    const playLoop = (sampleCount) => {
        console.log('l:', sampleCount)
      for (let key in chordObj) {
        const volume = volumes[chordObj[key][sampleCount]];
        instr[key].play(pitches[key], volume, 0);
      }
      sampleCount--;
      if (sampleCount === 0) {
        for (let key in instr) {
          instr[key].stop();
        }
        return;
      }
      return setTimeout(() => {
        playLoop(sampleCount - 1);
      }, (tempo * 1000) / width);
    };
    playLoop(sampleCount);
  }
  // globalTransport.start();
  const matrix = convertToMatrix(file);
  const pitchMap = createPitchMap(matrix); // this gets played
  const pitches = createNormalizedValuesObject(lowFreq, hiFreq, matrix.length);
  playImage(matrix.length, pitchMap, pitches, contextInstruments);
}

export function stop(instruments, globalTransport) {
  console.log("ok..", instruments);
  for (let k in instruments) {
    instruments[k].stop();
  }
  globalTransport.stop();
}
