import { useState, useRef, useEffect } from "react";

// eslint-disable-next-line no-unused-vars
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { drawRect, getDistance } from "../js/rectangles";

const Cam = ({ id = 1 }) => {
  const [coco, setCoco] = useState(false);

  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState();
  const [resolution, setResolution] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [distance, setDistance] = useState();
  const webcamRef = useRef();
  const canvasRef = useRef();

  const style = {
    position: "absolute",
    zIndex: 0,
    ...resolution,
    top: 0,
    left: 0,
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    setDeviceId(e.target.value);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const {
        video,
        video: { videoWidth, videoHeight },
      } = webcamRef.current;
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const obj = await net.detect(video);
      if (obj.length > 0) {
        const found = obj.filter((o) => o.class === "person");
        const xyFound = found.map((f) => {
          return {
            x: f.bbox[2] - f.bbox[0],
            y: f.bbox[3] - f.bbox[1],
          };
        });
        setDistance(getDistance(xyFound, resolution));
      } else {
        setDistance();
      }

      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);
    }
  };

  useEffect(() => {
    setResolution({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerWidth, window.innerHeight]);

  useEffect(() => {
    cocossd.load().then((res) => {
      setCoco(res);
    });
    navigator.mediaDevices.enumerateDevices().then((res) => {
      const webcams = res.filter(({ kind }) => kind === "videoinput");
      setDevices(webcams);
      if (!webcams.map((w) => w.deviceId).includes(deviceId)) {
        setDeviceId(webcams[0].deviceId);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let detectInterval;
    if (coco) {
      detectInterval = setInterval(() => {
        detect(coco);
      }, 300);
    } else {
      clearInterval(detectInterval);
    }

    return () => {
      clearInterval(detectInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coco]);

  return (
    <>
      <div style={style}>
        <p
          className="control"
          style={{ position: "absolute", top: 0, right: 0, zIndex: 20 }}
        >
          <span className="select">
            <select
              onChange={handleChange}
              style={{
                backgroundColor: "transparent",
                color: "cyan",
                border: "solid 2px cyan",
                fontWeight: "bolder",
              }}
            >
              {devices.map((d, i) => (
                <option
                  key={i}
                  selected={deviceId === d.deviceId}
                  value={d.deviceId}
                >
                  {d.label.split("(")[0]}
                </option>
              ))}
            </select>
          </span>
        </p>

        <Webcam
          ref={webcamRef}
          style={{ position: "absolute", top: 0 }}
          videoConstraints={{
            deviceId,
            ...resolution,
          }}
        />

        <canvas ref={canvasRef} style={{ position: "absolute", top: 0 }} />

        {distance && (
          <p
            style={{
              position: "absolute",
              bottom: 0,
              left: "0.25em",
              textTransform: "capitalize",
              backgroundColor: "transparent",
              fontFamily: "monospace",
              zIndex: 30,
              color: distance < 2 ? "orange" : "lime",
              fontSize: "2em",
              fontWeight: "bolder",
              WebkitTextStroke: "1px white",
            }}
          >
            Distance: {distance}
          </p>
        )}
      </div>
    </>
  );
};

export default Cam;
