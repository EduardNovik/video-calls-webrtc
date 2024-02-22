"use client";
import "../../../styles/globals.css";
import React from "react";
import { useEffect, useRef } from "react";
import { cn } from "../lib/cn";
import { useMeetStore } from "../store/meet-store";
import { useWebRTC } from "../hooks/use-web-rtc";
import { CallControlButtons } from "./components/call-control-buttons";
import { useRouter } from "next/navigation";

const OnCall = () => {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const { state, updateMeetState } = useMeetStore();
  const screenShareRef = useRef<HTMLVideoElement | null>(null);
  const { shareScreen } = useWebRTC();
  const router = useRouter();

  useEffect(() => {
    if (remoteVideoRef.current && state.remoteStream instanceof MediaStream) {
      remoteVideoRef.current.srcObject = state.remoteStream;
    }
    if (localVideoRef.current && state.localStream instanceof MediaStream) {
      localVideoRef.current.srcObject = state.localStream;
    }
  }, [state.localStream, state.remoteStream]);

  useEffect(() => {
    if (localVideoRef.current) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      if (stream) {
        for (const track of stream.getVideoTracks()) {
          track.enabled = state.isCameraOn;
        }
        for (const track of stream.getAudioTracks()) {
          track.enabled = state.isMicOn;
        }
      }
    }
  }, [state.isCameraOn, state.isMicOn]);

  const onHoldToggleHandler = () => {
    updateMeetState({
      isOnHold: !state.isOnHold,
    });
    if (localVideoRef.current) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      for (const track of stream.getTracks()) {
        track.enabled = state.isOnHold;
      }
    }
  };

  const hangUpHandler = () => {
    updateMeetState({
      isCallActive: false,
    });
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      for (const track of stream.getTracks()) {
        track.enabled = false;
      }
    }
    router.push("/");
  };

  const shareDesktop = async () => {
    if (screenShareRef.current) {
      await shareScreen({ ref: screenShareRef.current });
    }
  };

  return (
    <div className="h-full w-full pt-20">
      <div className="relative flex 2xl:justify-center" ref={videoContainerRef}>
        <video
          disablePictureInPicture
          className={cn(
            "absolute left-2 top-2 aspect-video w-36 rounded-md border-[1px] border-[#9353d3] bg-black object-cover lg:w-60",
            state.isFullScreen && "w-96 rounded-md object-cover"
          )}
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
        />
        <video
          disablePictureInPicture
          className={cn(
            "aspect-video h-full w-full rounded-md bg-black object-cover",
            state.isFullScreen &&
              "aspect-video h-full w-full rounded-md bg-black object-cover"
          )}
          ref={remoteVideoRef}
          autoPlay
          playsInline
        />
        <video
          className={cn(
            "absolute bottom-0 right-0 h-60 w-96 rounded-md",
            state.isPresenting && " border-[1px] border-[#9353d3]"
          )}
          autoPlay
          playsInline
          ref={screenShareRef}
        />
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-4">
          <CallControlButtons
            ref={videoContainerRef}
            videoStreamToggleHandler={() =>
              updateMeetState({ isCameraOn: !state.isCameraOn })
            }
            audioStreamToggleHandler={() =>
              updateMeetState({ isMicOn: !state.isMicOn })
            }
            hangUpHandler={hangUpHandler}
            onHoldToggleHandler={onHoldToggleHandler}
            shareDesktop={shareDesktop}
          />
        </div>
      </div>
    </div>
  );
};

export default OnCall;
