import * as Tone from "tone";
import { useEffect, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import Viewport from "./components/Viewport";
import { init, capture } from "./functions/viewportFunctions";
import { stop } from "./playFilePattern";
import { getAscii } from "./functions/asciiFunctions";
import "./App.css";

class Instrument {
  constructor() {
    this.synth = new Tone.MonoSynth({
      envelope: {
        attack: 0.1,
        attackCurve: "exponential",
        decayCurve: "linear",
        sustain: 0.1,
        decay: 0.1,
      },
    }).toDestination();
  }

  play(freq, vol, incomingNow) {
    const now = Tone.now();
    const salt = Math.random();
    this.synth.volume.value = vol;
    this.synth.triggerAttackRelease(freq, 1);
  }

  playPattern(freqArr, vol, msDelay) {
    const defaultDelay = 0.5;
    this.synth.volume.value = vol;
    this.synth.triggerAttackRelease(freqArr[0]);
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
// const asciiValues = " .co*OQ0@"
const asciiValues = "@B0OQ#*qdoc/|()1{}[]I?i!l-_+~<>;:,\"^`'. ".split("");
const width = 200;
const height = 80;
const pixelFactor = 1; // better way to do this directly in getUserMedia
const tempo = 9;
const dbRange = [-140, -48];
const synths = buildInstruments(height);
function App() {
  const [stream, setStream] = useState("");
  const [ascii, setAscii] = useState("");
  const instruments = useRef(synths);
  const [globalTransport, setGlobalTransport] = useState(Tone.Transport);
  useEffect(() => {
    init(width, height)
      .then((res) => {
        setStream(res);
        window.stream = stream;
      })
      .catch((err) => console.log("err! ", err));
  }, []);

  const handleCapture = () => {
    capture(pixelFactor);
    getAscii(width, height, asciiValues)
      .then((res) => {
        setAscii(res);
      })
      .catch((err) => console.log("err in app: ", err));
  };
  const handleImages = (num) => {
    capture(pixelFactor, num);
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
          handleCapture(); // immediately triggers first image
          setInterval(() => {
            handleCapture();
          }, tempo * 1000);
        }}
      >
        Capture
      </Button>
      <Button
        onClick={() => {
          const count = 0;
          handleImages(count); // immediately triggers first image
          setInterval(() => {
            count++;
            handleImages(count);
          }, tempo * 1000);
        }}
      >
        IMAGE
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
