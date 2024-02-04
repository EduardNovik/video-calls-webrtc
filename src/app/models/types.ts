export interface MeetState {
  meetId: string;
  isMicOn: boolean;
  isCameraOn: boolean;
  isFullScreen: boolean;
  isPresenting: boolean;
  isCallActive: boolean;
  isWaiting: boolean;
  isOnHold: boolean;
  isHost: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

export interface MeetStoreState {
  state: MeetState;
  updateMeetState: (data: Partial<MeetState>) => void;
  clearMeeting: () => void;
}
