import React, { useState } from "react";

import { Button } from "../../components/Button";

import retakeSvg from "../../assests/retake-icon.svg";
import greaterThanSvg from "../../assests/greater-than.svg";
import playSvg from "../../assests/play-icon.svg";
import pauseSvg from "../../assests/pause-icon.svg";
import "../../App.css";
import "./VideoPreview.css";
import "../VideoRecorder.css";

const VideoPreview = ({
  currentRecording,
  handleUploadBlob,
  handleRetake,
  setShowPreviewVideo,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (
      currentRecording.previewRef &&
      currentRecording.previewRef.current &&
      currentRecording.previewRef.current.paused
    ) {
      currentRecording.previewRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (
      currentRecording.previewRef?.current &&
      !currentRecording.previewRef.current.paused
    ) {
      currentRecording.previewRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="video-preview-wrapper">
      <div className="video-recorder-logo">LOGO</div>
      <div key={currentRecording.id} className="video-recorder-video-wrapper">
        <video
          className="video-recorder-video"
          ref={currentRecording.previewRef}
          loop
          playsInline
        />
      </div>
      {!isPlaying ? (
        <div className="video-recorder-play-svg-wrapper" onClick={handlePlay}>
          <img src={playSvg} alt="play video" />
        </div>
      ) : (
        <div className="video-recorder-play-svg-wrapper" onClick={handlePause}>
          <img src={pauseSvg} alt="pause video" />
        </div>
      )}
      {currentRecording.status === "STOPPED" && (
        <div className="video-preview-record-buttons-wrapper">
          <Button
            className="video-recorder-pause-button"
            onClick={() => {
              setShowPreviewVideo(false);
              handleRetake();
            }}
          >
            <span className="video-recorder-pause-button-text">Retake</span>
            <span className="video-recorder-pause-button-svg-wrapper">
              <img src={retakeSvg} alt="retake recording" />
            </span>
          </Button>
          <Button
            className="video-recorder-upload-button"
            onClick={() => handleUploadBlob(currentRecording.id)}
          >
            <span className="dashboard-creating-video-button">Upload</span>
            <span className="dashboard-greater-than-svg-wrapper">
              <img
                className="dashboard-greater-than-svg-image"
                src={greaterThanSvg}
                alt="greater than"
              />
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
