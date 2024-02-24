import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import React from "react";

import { useMeetStore } from "../../store/meet-store";

import { CallControlButton } from "./call-control-button";

interface CallControlButtonsMobileProps {
  videoStreamToggleHandler: () => void;
  audioStreamToggleHandler: () => void;
  hangUpHandler: () => void;
  wrapperStyles?: string;
}

export const CallControlButtonsMobile = (
  props: CallControlButtonsMobileProps
) => {
  const {
    videoStreamToggleHandler,
    audioStreamToggleHandler,
    hangUpHandler,
    wrapperStyles,
  } = props;
  const { state } = useMeetStore();
  return (
    <div
      className={`flex sm:hidden gap-2 flex-wrap justify-center ${wrapperStyles}`}
    >
      <CallControlButton
        iconOn={<Mic size={20} />}
        iconOff={<MicOff size={20} />}
        deviceState={state.isMicOn}
        stateField="isMicOn"
        onPressHandler={audioStreamToggleHandler}
        customStyles="sm:min-w-unit-3xl"
      />
      <CallControlButton
        iconOn={<Video size={20} />}
        iconOff={<VideoOff size={20} />}
        deviceState={state.isCameraOn}
        stateField="isCameraOn"
        onPressHandler={videoStreamToggleHandler}
        customStyles="sm:min-w-unit-3xl"
      />
      <CallControlButton
        iconOn={<Phone size={20} />}
        iconOff={<Phone size={20} />}
        deviceState={state.isCallActive}
        stateField="isCallActive"
        onPressHandler={hangUpHandler}
        customStyles="sm:min-w-unit-3xl bg-red-800"
      />
    </div>
  );
};

CallControlButtonsMobile.displayName = "CallControlButtonsMobile";
