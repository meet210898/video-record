import React, { useEffect, useState } from "react";
import { useRecordWebcam } from "react-record-webcam";

import { Button } from "../components/Button";
import VideoPreview from "./VideoPreview/VideoPreview";

import startRecordingSvg from "../assests/start-recoding.svg";
import pauseRecordingSvg from "../assests/pause-icon.svg";
import resumeRecordingSvg from "../assests/play-icon.svg";
import stopRecordingSvg from "../assests/stop-icon.svg";
import cameraSwitchSvg from "../assests/camera-switch-icon.svg";
import "./VideoRecorder.css";

const VideoRecorder = () => {
  const {
    activeRecordings,
    clearAllRecordings,
    clearPreview,
    createRecording,
    devicesByType,
    openCamera,
    pauseRecording,
    resumeRecording,
    startRecording,
    stopRecording,
  } = useRecordWebcam();

  const [videoDeviceId, setVideoDeviceId] = useState("");
  const [audioDeviceId, setAudioDeviceId] = useState("");
  const [currentRecordingId, setCurrentRecordingId] = useState(null);
  const [showPreviewVideo, setShowPreviewVideo] = useState(false);

  useEffect(() => {
    if (devicesByType) {
      if (devicesByType.video && devicesByType.video.length > 0) {
        setVideoDeviceId(devicesByType.video[0].deviceId);
      }
      if (devicesByType.audio && devicesByType.audio.length > 0) {
        setAudioDeviceId(devicesByType.audio[0].deviceId);
      }
    }
  }, [devicesByType]);

  useEffect(() => {
    const startRecordingSetup = async () => {
      const recording = await createRecording(videoDeviceId, audioDeviceId);
      if (recording) {
        setCurrentRecordingId(recording.id);
        await openCamera(recording.id);
      }
    };
    startRecordingSetup();
  }, [createRecording, openCamera, videoDeviceId, audioDeviceId]);

  const handleUploadBlob = async (recordingId) => {
    const recording = activeRecordings.find((rec) => rec.id === recordingId);
    if (recording && recording.previewRef.current) {
      try {
        const videoElement = recording.previewRef.current;
        const blobUrl = videoElement.src;

        if (blobUrl.startsWith("blob:")) {
          const response = await fetch(blobUrl);
          const blob = await response.blob();
          console.log("Retrieved Blob:", blob);

          // // DOWNLOAD VIDEO FOR TESTING
          // const url = URL.createObjectURL(blob);
          // const anchor = document.createElement("a");
          // anchor.href = url;
          // anchor.download = "recording.mp4";
          // document.body.appendChild(anchor);
          // anchor.click();
          // anchor.remove();
          // URL.revokeObjectURL(url);

          const formData = new FormData();
          formData.append("video", blob, "recording.mp4");

          // API CALLING
          const uploadResponse = await fetch("API CALLING", {
            method: "POST",
            body: formData,
            // ADD HEADERS IF NEEDED
            // headers: {
            //   Authorization: "Bearer token",
            // }
          });

          if (uploadResponse.ok) {
            console.log("Video uploaded successfully!");
          } else {
            console.error("Failed to upload video:", uploadResponse.statusText);
          }
        } else {
          console.error("Expected a blob URL but got:", blobUrl);
        }
      } catch (error) {
        console.error("Error retrieving or uploading Blob:", error);
      }
    }
  };

  const handleRetake = async () => {
    if (currentRecordingId) {
      stopRecording(currentRecordingId);
    }

    clearAllRecordings();
    await clearPreview();

    const recording = await createRecording(videoDeviceId, audioDeviceId);
    if (recording) {
      setCurrentRecordingId(recording.id);
      await openCamera(recording.id);
    }
  };

  const handlePauseResume = async () => {
    if (currentRecordingId) {
      const recording = activeRecordings.find(
        (rec) => rec.id === currentRecordingId
      );
      if (recording) {
        if (recording.status === "RECORDING") {
          await pauseRecording(currentRecordingId);
        } else if (recording.status === "PAUSED") {
          await resumeRecording(currentRecordingId);
        }
      }
    }
  };

  const currentRecording = activeRecordings.find(
    (rec) => rec.id === currentRecordingId
  );

  return (
    <div className="video-recorder-wrapper">
      {!showPreviewVideo ? (
        <>
          {currentRecording && (
            <div className="video-recorder-wrap">
              <div className="video-recorder-logo">LOGO</div>
              <div
                key={currentRecording.id}
                className="video-recorder-video-wrapper"
              >
                <video
                  ref={currentRecording.webcamRef}
                  className="video-recorder-video"
                  loop
                  autoPlay
                  playsInline
                />
                <img
                  className="video-recorder-camera-switch-svg"
                  src={cameraSwitchSvg}
                  alt="camera switch"
                />
              </div>
              {currentRecording.status === "RECORDING" ||
              currentRecording.status === "PAUSED" ? (
                <div className="video-recorder-recoding-buttons-wrapper">
                  <Button
                    className="video-recorder-pause-button"
                    onClick={handlePauseResume}
                  >
                    <span className="video-recorder-pause-button-text">
                      {currentRecording.status === "PAUSED"
                        ? "Resume"
                        : "Pause"}
                    </span>
                    <span className="video-recorder-pause-button-svg-wrapper">
                      <img
                        src={
                          currentRecording.status === "PAUSED"
                            ? resumeRecordingSvg
                            : pauseRecordingSvg
                        }
                        alt="recording svg"
                      />
                    </span>
                  </Button>
                  <Button
                    className="video-recorder-pause-button"
                    onClick={() => {
                      stopRecording(currentRecording.id);
                      setShowPreviewVideo(true);
                    }}
                  >
                    <span className="video-recorder-pause-button-text">
                      Stop
                    </span>
                    <span className="video-recorder-pause-button-svg-wrapper">
                      <img src={stopRecordingSvg} alt="stop recording" />
                    </span>
                  </Button>
                </div>
              ) : (
                <div className="video-recorder-start-button-wrapper">
                  <Button
                    onClick={() => startRecording(currentRecording.id)}
                    className="video-recorder-start-button"
                  >
                    <span className="video-recorder-start-button-text">
                      Start Recording
                    </span>
                    <span className="video-recorder-start-button-svg-wrapper">
                      <img src={startRecordingSvg} alt="start recording" />
                    </span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <VideoPreview
          currentRecording={currentRecording}
          handleUploadBlob={handleUploadBlob}
          handleRetake={handleRetake}
          setShowPreviewVideo={setShowPreviewVideo}
        />
      )}
    </div>
  );
};

export default VideoRecorder;
