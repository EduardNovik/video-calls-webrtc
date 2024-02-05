"use client";
import { create } from "zustand";

import type { MeetState, MeetStoreState } from "../models/types";

export const useMeetStore = create<MeetStoreState>((set) => {
  const initializeState = () => ({
    meetId: "",
    isMicOn: false,
    isCameraOn: false,
    isFullScreen: false,
    isPresenting: false,
    isCallActive: false,
    isWaiting: false,
    isOnHold: false,
    isHost: false,
    localStream: null,
    remoteStream: null,
  });
  if (typeof window !== "undefined") {
    const storedMeetState = localStorage.getItem("meetState");
    const initialState = storedMeetState
      ? (JSON.parse(storedMeetState) as MeetState)
      : initializeState();
    return {
      state: initialState,
      updateMeetState: (data: Partial<MeetState>) => {
        set((previous) => {
          if (data.meetId && previous.state.meetId !== data.meetId) {
            const newState = {
              ...previous.state,
              ...data,
            };
            localStorage.setItem("meetState", JSON.stringify(newState));
            return { state: newState };
          }
          const newState = { ...previous.state, ...data };
          localStorage.setItem("meetState", JSON.stringify(newState));
          return { state: newState };
        });
      },
      clearMeeting: () => {
        localStorage.removeItem("meetState");
        set({
          state: {
            meetId: "",
            isMicOn: false,
            isCameraOn: false,
            isFullScreen: false,
            isPresenting: false,
            isCallActive: false,
            isWaiting: false,
            isOnHold: false,
            isHost: false,
            localStream: null,
            remoteStream: null,
          },
        });
      },
    };
  } else {
    // Return default initial state for server-side rendering
    return {
      state: initializeState(),
      updateMeetState: (data: Partial<MeetState>) => {},
      clearMeeting: () => {},
    };
  }
});
