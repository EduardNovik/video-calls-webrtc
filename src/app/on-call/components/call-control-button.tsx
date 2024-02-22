import React from "react";

import { Button } from "@nextui-org/button";
import { cn } from "../../lib/cn";

import type { MeetState } from "../../models/types";
import { useMeetStore } from "../../store/meet-store";

interface MeetControlButtonProps {
  iconOn: React.ReactNode;
  iconOff: React.ReactNode;
  deviceState: boolean;
  stateField: keyof MeetState;
  onPressHandler?: () => void;
  customStyles?: string;
}

export const CallControlButton = (props: MeetControlButtonProps) => {
  const { state, updateMeetState } = useMeetStore();
  const {
    iconOn,
    iconOff,
    deviceState,
    stateField,
    onPressHandler,
    customStyles,
  } = props;
  return (
    <Button
      variant="bordered"
      onPress={() => {
        updateMeetState({ [stateField]: !deviceState } as Partial<MeetState>);
        if (onPressHandler) {
          onPressHandler();
        }
      }}
      className={cn(
        `border-none h-14 p-0 cursor-pointer rounded-full bg-transparent text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#9353d3] focus-visible:border-black focus-visible:outline-black ${customStyles}`,
        state[stateField]
          ? "focus-visible:bg-transparent"
          : "bg-red-800 focus-visible:bg-red-800"
      )}
    >
      {state[stateField] ? iconOn : iconOff}
    </Button>
  );
};

CallControlButton.displayName = "CallControlButton";
