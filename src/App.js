import React, { useState } from "react";

import { Button } from "./components/Button";
import VideoRecorder from "./VideoRecorder/VideoRecorder";

import greaterThanSvg from "./assests/greater-than.svg";
import videoImage from "./assests/video-record-img-1.png";
import "./App.css";

export default function App() {
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);

  return (
    <>
      {!showVideoRecorder ? (
        <div className="dashboard-video-wrapper">
          <div className="logo">LOGO</div>
          <div className="create-video-text">
            Create a video wish for your loved ones
          </div>
          <img src={videoImage} alt="create-video" width="100%" />
          <div className="dashboard-text-wrapper">
            <p className="dashboard-text">Let them know how much love them.</p>
            <p className="dashboard-text">
              express your emotions for your loved ones
            </p>
          </div>
          <div className="dashboard-creating-video-button-wrapper">
            <Button
              className="dashboard-button"
              onClick={() => {
                setShowVideoRecorder(true);
              }}
            >
              <span className="dashboard-creating-video-button">
                Start Creating Video
              </span>
              <span className="dashboard-greater-than-svg-wrapper">
                <img
                  className="dashboard-greater-than-svg-image"
                  src={greaterThanSvg}
                  alt="greater than"
                />
              </span>
            </Button>
          </div>
        </div>
      ) : (
        <VideoRecorder />
      )}
    </>
  );
}
