import {
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  Monitor,
  MonitorOff,
  MonitorPause,
  MonitorPlay,
  Phone,
  Video,
  VideoOff,
} from "lucide-react";
import React, { forwardRef, useEffect } from "react";
import type { RefObject } from "react";

import { useMeetStore } from "../../store/meet-store";

import { CallControlButton } from "./call-control-button";

interface MeetOnCallControlsProps {
  videoStreamToggleHandler: () => void;
  audioStreamToggleHandler: () => void;
  hangUpHandler: () => void;
  onHoldToggleHandler: () => void;
  shareDesktop: () => void;
}

export const CallControlButtons = forwardRef(
  (props: MeetOnCallControlsProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const {
      videoStreamToggleHandler,
      audioStreamToggleHandler,
      hangUpHandler,
      onHoldToggleHandler,
      shareDesktop,
    } = props;
    const { state, updateMeetState } = useMeetStore();
    const forwardedDivRef = ref as RefObject<HTMLDivElement>;

    useEffect(() => {
      const handleFullscreenChange = () => {
        const isFullScreen = !!document.fullscreenElement;
        updateMeetState({ isFullScreen });
      };
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
      };
    }, [updateMeetState]);

    const fullScreenOpenHandler = () => {
      const containerDivElement = forwardedDivRef.current;
      if (containerDivElement) {
        void containerDivElement.requestFullscreen();
        updateMeetState({
          isCameraOn: state.isCameraOn,
          isMicOn: state.isMicOn,
          isCallActive: true,
        });
      }
    };
    const fullScreenCloseHandler = () => {
      void document.exitFullscreen();
      updateMeetState({
        isCameraOn: state.isCameraOn,
        isMicOn: state.isMicOn,
        isCallActive: true,
      });
    };

    return (
      <div className="flex gap-4">
        <CallControlButton
          iconOn={<Mic size={20} />}
          iconOff={<MicOff size={20} />}
          deviceState={state.isMicOn}
          stateField="isMicOn"
          onPressHandler={audioStreamToggleHandler}
        />
        <CallControlButton
          iconOn={<Video size={20} />}
          iconOff={<VideoOff size={20} />}
          deviceState={state.isCameraOn}
          stateField="isCameraOn"
          onPressHandler={videoStreamToggleHandler}
        />
        <CallControlButton
          iconOn={<Monitor size={20} />}
          iconOff={<MonitorOff size={20} />}
          deviceState={state.isPresenting}
          stateField="isPresenting"
          onPressHandler={shareDesktop}
        />
        <CallControlButton
          iconOn={<MonitorPlay size={20} />}
          iconOff={<MonitorPause size={20} />}
          deviceState={state.isOnHold}
          stateField="isOnHold"
          onPressHandler={onHoldToggleHandler}
        />
        <CallControlButton
          iconOn={<Minimize2 size={20} />}
          iconOff={<Maximize2 size={20} />}
          deviceState={state.isFullScreen}
          stateField="isFullScreen"
          onPressHandler={
            state.isFullScreen ? fullScreenCloseHandler : fullScreenOpenHandler
          }
        />
        <CallControlButton
          iconOn={<Phone size={20} />}
          iconOff={<Phone size={20} />}
          deviceState={state.isCallActive}
          stateField="isCallActive"
          onPressHandler={hangUpHandler}
          customStyles="bg-red-800"
        />
      </div>
    );
  }
);

CallControlButtons.displayName = "CallControlButtons";
