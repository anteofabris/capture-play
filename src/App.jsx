import * as Tone from "tone";
import { useEffect, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Viewport from "./components/Viewport";
import { init, capture, dataURItoBlob } from "./functions/viewportFunctions";
import { playFilePattern, stop } from "./playFilePattern";
import { getAscii } from "./functions/asciiFunctions";
import "./App.css";

class Instrument {
  constructor() {
    this.synth = new Tone.Synth({
      envelope: {
        attack: 0.7,
        attackCurve: "exponential",
        decayCurve: "exponential",
        sustain: 0,
        decay: 8,
      },
    }).toDestination();
  }

  play(freq, vol, msDelay) {
    const salt = Math.random();
    this.synth.volume.value = vol;
    this.synth.triggerAttackRelease(freq, 3);
  }

  playPattern(freqArr, vol, msDelay) {
    const defaultDelay = 0.5;
    this.synth.volume.value = vol;
    this.synth.triggerAttackRelease(freqArr[0], 3);
  }
  stop() {
    this.synth.triggerRelease(0);
  }
}

function buildInstruments(height) {
  const instruments = {};
  for (let i = 0; i < height; i++) {
    instruments[i] = new Instrument();
  }
  return instruments;
}
// const asciiValues = " .o*O0@"
const asciiValues = "@B0OQ#*qdoc/|()1{}[]I?i!l-_+~<>;:,\"^`'. "
  .split("")
  .reverse();
const width = 200;
const height = 80;
const pixelFactor = 1;
const tempo = 3;
const synths = buildInstruments(height);
function App() {
  const [stream, setStream] = useState("");
  const [ascii, setAscii] = useState("");
  const instruments = useRef(synths);
  const [globalTransport, setGlobalTransport] = useState(Tone.Transport);
  useEffect(() => {
    init(width, height)
      .then((res) => {
        console.log("streaming");
        setStream(res);
        window.stream = stream;
      })
      .catch((err) => console.log("err! ", err));
  }, []);

  const handleCapture = () => {
    // globalTransport.start();
    capture(pixelFactor);
    getAscii(width, height, asciiValues)
      .then((res) => {
        setAscii(res);
      })
      .catch((err) => console.log("err in app: ", err));
  };
  return (
    <div>
      <Button
        onClick={() => {
          // handleCapture();
          // globalTransport.stop(0);
          // globalTransport.clear(0);

          setInterval(() => handleCapture(), tempo * 1000);
        }}
      >
        Capture
      </Button>
      <Button
        onClick={() => {
          stop(instruments.current, globalTransport);
        }}
      >
        STOP
      </Button>
      <textarea
        id="textarea_main"
        onChange={() => {}}
        rows={height}
        cols={width}
        defaultValue={ascii}
        style={{
          float: "left",
          fontSize: "1em",
          color: "white",
        }}
      />

      <Viewport
        asciiValues={asciiValues}
        width={width}
        height={height}
        tempo={tempo}
        stream={stream}
        ascii={ascii}
        instruments={instruments.current}
        globalTransport={globalTransport}
        handleCapture={handleCapture}
      />
    </div>
  );
}

export default App;
