import React, { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";


const App = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [alert, setAlert] = useState("");
  const [nightMode, setNightMode] = useState(false);
  const [facingMode, setFacingMode] = useState("environment"); // "user" for front camera

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const classIcons = {
    person: "🚶",
    car: "🚗",
    truck: "🚚",
    bus: "🚌",
    dog: "🐶",
    cat: "🐱",
    bicycle: "🚲",
    motorcycle: "🏍️",
    traffic_light: "🚦",
    fire_hydrant: "🔥💧",
    stop_sign: "🚗",
    parking_meter: "🅿️",
    bench: "🪑",
    bird: "🐦",
    horse: "🐴",
    sheep: "🐑",
    cow: "🐄",
    elephant: "🐘",
    bear: "🐻",
    zebra: "🦓",
    giraffe: "🦒",
    backpack: "🎒",
    umbrella: "🌂",
    handbag: "👜",
    tie: "👔",
    suitcase: "💼",
    frisbee: "🥏",
    skis: "🎿",
    snowboard: "🎿",
    sports_ball: "⚽",
    kite: "🪁",
    baseball_bat: "⚾",
    baseball_glove: "🥎",
    skateboard: "🛹",
    surfboard: "🏄",
    tennis_racket: "🎾",
    bottle: "🍾",
    wine_glass: "🍷",
    cup: "☕",
    fork: "🍴",
    knife: "🔪",
    spoon: "🥄",
    bowl: "🥣",
    banana: "🍌",
    apple: "🍎",
    sandwich: "🥪",
    orange: "🍊",
    broccoli: "🥦",
    carrot: "🥕",
    hot_dog: "🌭",
    pizza: "🍕",
    donut: "🍩",
    cake: "🍰",
    chair: "🪑",
    couch: "🛋️",
    potted_plant: "🪴",
    bed: "🛏️",
    toilet: "🚽",
    tv: "📺",
    laptop: "💻",
    mouse: "🖱️",
    remote: "🎮",
    keyboard: "⌨️",
    cell_phone: "📱",
    microwave: "📡",
    oven: "🔥",
    toaster: "🍞",
    sink: "🚰",
    refrigerator: "🧊",
    book: "📘",
    clock: "⏰",
    vase: "🏺",
    scissors: "✂️",
    teddy_bear: "🧸",
    hair_drier: "💨",
    toothbrush: "🪥",
  };

  useEffect(() => {
    cocoSsd.load().then(setModel);
  }, []);

  useEffect(() => {
    if (!model) return;
    const interval = setInterval(() => detectFrame(), 100);
    return () => clearInterval(interval);
  }, [model]);

  const detectFrame = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4 &&
      canvasRef.current
    ) {
      const video = webcamRef.current.video;
      const predictions = await model.detect(video);
      const ctx = canvasRef.current.getContext("2d");

      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      if (predictions.length > 0) {
        const names = predictions
          .map((p) => `${classIcons[p.class] || "🔹"} ${p.class}`)
          .join(", ");
        setAlert(`⚠️ Detected: ${names}`);
      } else {
        setAlert("✅ Clear path ahead");
      }

      predictions.forEach((pred) => {
        const [x, y, width, height] = pred.bbox;
        ctx.lineWidth = 2;
        ctx.shadowColor = "rgba(255, 0, 0, 0.5)";
        ctx.shadowBlur = 10;
        ctx.fillStyle =
          pred.class === "person"
            ? "rgba(255, 0, 0, 0.3)"
            : "rgba(0, 255, 0, 0.2)";
        ctx.fillRect(x, y, width, height);
        ctx.font = "16px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText(
          `${classIcons[pred.class] || "🔹"} ${pred.class}`,
          x,
          y > 10 ? y - 5 : y + 20
        );
      });
    }
  };

  return (
    <div className="app">
      <button
        className="toggle-button"
        onClick={() => setNightMode(!nightMode)}
      >
        Toggle Fog/Night Mode 🌫️
      </button>

      <button className="camera-toggle-button" onClick={toggleCamera}>
        Switch Camera 🔄
      </button>

      <h2 className="title">Safety Detection System</h2>

      <div className="webcam-wrapper">
        <Webcam
          ref={webcamRef}
          className={`webcam ${nightMode ? "night" : ""}`}
          audio={false}
          videoConstraints={{ facingMode }}
        />
        <canvas ref={canvasRef} className="canvas" />
      </div>

      <div className={`alert ${alert.includes("⚠️") ? "danger" : "safe"}`}>
        {alert}
      </div>
    </div>
  );
};

export default App;


