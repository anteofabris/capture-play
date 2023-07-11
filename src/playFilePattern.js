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
export function playFilePattern(
  file,
  lowFreq,
  hiFreq,
  tempo,
  contextInstruments,
  globalTransport,
  setCurrentShot,
  handleCapture
) {
  // get width
  let width = file.split("\n")[0].length;
  // create a matrix to build chords with
  function convertToMatrix(file) {
    return file
      .split("\n")
      .filter((item) => item.length > 1)
      .reverse(); // reverse so that first array corresponds with lowest note
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
    let sampleCount = 0;
    // const values = [" ", ".", ",", "/", "(", "*", "%", "&", "#", "@"]
    let values = "@B0OQ#*qdoc/|()1{}[]I?i!l-_+~<>;:,\"^`'. "
      .split("")
      // .reverse();
    // .split("").reverse().join(""); // if it's dark out, reverse it

    const volumes = createVolumeObj(values, [-120, -20], true);

    // globalTransport.start();
    const loop = new Tone.Loop(() => {
      // console.log("l:", sampleCount);

      for (let key in chordObj) {
        const volume = volumes[chordObj[key][sampleCount]];
        instr[key].play(pitches[key], volume, 0);
      }
      // oneImage()
      sampleCount++;
      if (sampleCount >= width) {
        // retake picture
        loop.stop(0);
        loop.dispose(0);
        globalTransport.stop(0);
        globalTransport.clear(0);
        // handleCapture();
        // location.reload()
        console.log("reset");
        sampleCount = 0;
      }
    }, tempo);
    loop.start(0);
    console.log("loop");
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
