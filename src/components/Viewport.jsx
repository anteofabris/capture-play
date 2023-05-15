import { Container, Row, Col } from "react-bootstrap";
import { capture } from "../functions/viewportFunctions";
import { playFilePattern } from "../playFilePattern";
import { playFileOnce } from "../playFileOnce";
import Canvas from "./Canvas";
import { useEffect } from "react";

const Viewport = ({
  stream,
  ascii,
  asciiValues,
  instruments,
  width,
  height,
  tempo,
}) => {
  const lowFreq = 27.5;
  const hiFreq = 4168;

  useEffect(() => {
    if (ascii !== "")
      playFileOnce(asciiValues, ascii, lowFreq, hiFreq, tempo, instruments);
  }, [ascii]);

  if (stream) {
    window.stream = stream;
    document.getElementById("video_main").srcObject = stream;
  }
  return (
    <Container>
      <video
        id="video_main"
        autoPlay
        loop
        src={stream}
        width={width}
        height={height}
        style={{}}
      />
      <canvas id="canvas_main" width={width} height={height} style={{}} />
      <img id="img_main" width={width} height={height} style={{}} />
    </Container>
  );
};

export default Viewport;
