import * as Tone from "tone";
import { useEffect, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import Viewport from "./components/Viewport";
import { init, capture } from "./functions/viewportFunctions";
import { stop } from "./playFilePattern";
import { getAscii } from "./functions/asciiFunctions";
import { getWeatherData } from "./functions/getWeatherData";
import { testWeatherData } from "../testWeatherData";
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

const normalize = (x, xRange, newRange) => {
  const a = newRange[0];
  const b = newRange[1];
  const minX = xRange[0];
  const maxX = xRange[1];
  const res = a + ((x - minX) * (b - a)) / (maxX - minX);
  return res;
};

const weatherData =
  testWeatherData[Math.round(Math.random() * (testWeatherData.length - 1))];
const asciiPool = "@B0OQ#*qdoc/|()1{}[]I?i!l-_+~<>;:,\"^`'. ".split("");
const visFactor = Math.round(
  normalize(weatherData.current.vis_km, [20, 0], [1, 5])
);
const asciiValues = asciiPool.filter((x, i) => i % visFactor === 0);
const tempo = normalize(weatherData.current.temp_c, [-60, 60], [1, 12]);
// const tempo = 9;
// const width = 600;
const width = Math.round(
  normalize(
    weatherData.forecast.forecastday[0].day.maxtemp_f,
    [-76, 140],
    [50, 200]
  )
);
// const height = 80;
const height = Math.round(
  normalize(
    weatherData.forecast.forecastday[0].day.mintemp_f,
    [-76, 140],
    [10, 80]
  )
);
console.log("manipulated data: ", {
  visibility: weatherData.current.vis_km,
  visFactor,
  weatherData,
  asciiValues,
  width,
  height,
  tempo,
});
const pixelFactor = 1; // better way to do this directly in getUserMedia
// const dbRange = [-140, -48];
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
    // get weather data
    // getWeatherData()
    //   .then((res) => setWeatherData(res))
    //   .catch((err) => console.log("err getting weather: ", err));
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
          let count = 0;
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
