const init = async (width, height) => {
  // show which constraints are supported by browser
  // console.log(
  //   "supported: ",
  //   navigator.mediaDevices.getSupportedConstraints()
  // );
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        mandatory: {
          minWidth: width,
          minHeight: height,
          maxWidth: width,
          maxHeight: height,
        },
      },
      video: true,
      audio: false,
    });
    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    if (!capabilities.contrast) {
      console.log("nope.. ", capabilities);
      return stream;
    }
    track.applyConstraints({ advanced: [{ contrast: 100 }] });

    return track;
  } catch (err) {
    throw new Error(`error: ${err}`);
  }
};
const capture = (pixelFactor, num) => {
  const canvas = document.getElementById("canvas_main");
  const video = document.getElementById("video_main");
  const img = document.getElementById("img_main");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  console.log * ("w & h", video.videoWidth, video.videoHeight);
  canvas
    .getContext("2d")
    .drawImage(
      video,
      0,
      0,
      video.videoWidth / pixelFactor,
      video.videoHeight / pixelFactor
    );

  canvas.toBlob((blob) => {
    img.src = window.URL.createObjectURL(blob);
  });
  img.src = canvas.toDataURL("image/png");

  return img.src;
};

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  // var byteString = atob(dataURI.split(",")[1]);
  const byteString = Buffer.from(dataURI.split(",")[1], "base64");

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  //Old Code
  //write the ArrayBuffer to a blob, and you're done
  //var bb = new BlobBuilder();
  //bb.append(ab);
  //return bb.getBlob(mimeString);

  //New Code
  return new Blob([ab], { type: mimeString });
}

export { init, capture, dataURItoBlob };
