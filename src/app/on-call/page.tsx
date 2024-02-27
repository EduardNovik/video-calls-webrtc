"use client";
import "../../../styles/globals.css";
import React from "react";
import { useEffect, useRef } from "react";
import { cn } from "../lib/cn";
import { useMeetStore } from "../store/meet-store";
import { useWebRTC } from "../hooks/use-web-rtc";
import { CallControlButtons } from "./components/call-control-buttons";
import { CallControlButtonsMobile } from "./components/call-control-buttons-mobile";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";

const OnCall = () => {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const { state, updateMeetState } = useMeetStore();
  const screenShareRef = useRef<HTMLVideoElement | null>(null);
  const { shareScreen, closeMeeting } = useWebRTC();
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

  const handleCopyClick = () => {
    navigator.clipboard.writeText(state.meetId);
  };

  return (
    <div className="h-full w-full pt-20 gap-16 flex flex-col  ">
      <div
        className="relative flex 2xl:justify-center mb-4"
        ref={videoContainerRef}
      >
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
            "absolute left-2 top-24 w-36 lg:top-40 lg:w-60 rounded-md  aspect-video",
            state.isPresenting && " border-[1px] border-[#9353d3]"
          )}
          autoPlay
          playsInline
          ref={screenShareRef}
        />
        <div className="w-full bottom-[-65px] absolute sm:bottom-4 left-1/2 flex justify-center flex-wrap -translate-x-1/2 transform gap-4">
          <CallControlButtons
            ref={videoContainerRef}
            videoStreamToggleHandler={() =>
              updateMeetState({ isCameraOn: !state.isCameraOn })
            }
            audioStreamToggleHandler={() =>
              updateMeetState({ isMicOn: !state.isMicOn })
            }
            hangUpHandler={hangUpHandler}
            shareDesktop={shareDesktop}
          />
          <CallControlButtonsMobile
            videoStreamToggleHandler={() =>
              updateMeetState({ isCameraOn: !state.isCameraOn })
            }
            audioStreamToggleHandler={() =>
              updateMeetState({ isMicOn: !state.isMicOn })
            }
            hangUpHandler={hangUpHandler}
          />
        </div>
      </div>
      <div className="w-full sm:justify-start justify-center flex">
        <Popover placement="bottom">
          <PopoverTrigger>
            <Button
              onClick={handleCopyClick}
              className="w-fit mb-8 bg-[#9353d3] hover:scale-105 hover:bg-red-800 text-white text-md"
              variant="shadow"
            >
              Copy ID
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2 text-small font-bold">
              Call ID copied ✔
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default OnCall;
