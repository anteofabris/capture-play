const createVolumeObj = (characterArray, rangeArray, leftToRight) => {
  if (!leftToRight) characterArray = characterArray.reverse; // .reverse() for inverse vol
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

export function playFileOnce(
  asciiValues,
  file,
  lowFreq,
  hiFreq,
  tempo,
  contextInstruments
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
      returnObj[i] = ratioIncrease;
    }
    return returnObj;
  }

  function playImage(length, chordObj, pitches, instr) {
    const volumes = createVolumeObj(asciiValues, [-20, -120], true);
    let sampleCount = width - 1;
    const playLoop = (sampleCount) => {
      for (let key in chordObj) {
        const volume = volumes[chordObj[key][sampleCount]];
        instr[key].play(pitches[key], volume, 0);
      }
      sampleCount--;
      if (sampleCount === 0) {
        console.log("done");
        return;
      }
      return setTimeout(() => {
        playLoop(sampleCount - 1);
      }, (tempo * 1000) / width); // larger increments to make seamless loop
    };
    console.log("playing");
    playLoop(sampleCount);
  }
  const matrix = convertToMatrix(file);
  const pitchMap = createPitchMap(matrix);
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
