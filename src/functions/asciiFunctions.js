import wavesCrashing from "../assets/wavesCrashing.jpeg";
const getAscii = async (width, height, asciiValues) => {
  // convert to grayscale
  const grayScales = convertToGrayScales(
    document.getElementById("canvas_main"),
    width,
    height
  );
  // draw the ascii
  // return the drawing
  const result = drawAscii(grayScales, width, asciiValues);
  return result;
};

const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;

const convertToGrayScales = (canvas, width, height) => {
  const context = canvas.getContext("2d");
  const imageData = context.getImageData(0, 0, width, height);

  const grayScales = [];
  // increment i by pixel order
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];

    const grayScale = toGrayScale(r, g, b);
    imageData.data[i] =
      imageData.data[i + 1] =
      imageData.data[i + 2] =
        grayScale;

    grayScales.push(grayScale);
  }

  context.putImageData(imageData, 0, 0);
  return grayScales;
};

const grayRamp = "@B0OQ#*qdoc/|()1{}[]I?i!l-_+~<>;:,\"^`'. "
  .split("")
  .reverse()
  .join("");
// "@#&%*(/., ".split('').reverse().join('');
const rampLength = grayRamp.length;

// the grayScale value is an integer ranging from 0 (black) to 255 (white)
const getCharacterForGrayScale = (grayScale, asciiValues) =>
  asciiValues[Math.ceil(((asciiValues.length - 1) * grayScale) / 255)];

const drawAscii = (grayScales, width, asciiValues) => {
  const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
    let nextChars = getCharacterForGrayScale(grayScale, asciiValues);

    if ((index + 1) % width === 0) {
      nextChars += "\n";
    }

    return asciiImage + nextChars;
  }, "");
  return ascii;
};

export { getAscii };
