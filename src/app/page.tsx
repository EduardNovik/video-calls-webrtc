"use client";
import { useWebRTC } from "./hooks/use-web-rtc";
import { useMeetStore } from "./store/meet-store";

export default function Home() {
  const { createMeetingId, createMeeting } = useWebRTC();
  const { state, updateMeetState } = useMeetStore();

  const createMeetingHandler = () => {
    console.log("Creating meeting ID");

    const createdMeetingId = createMeetingId();
    console.log(createdMeetingId);

    updateMeetState({
      meetId: createdMeetingId,
      isCallActive: true,
      isHost: true,
      isWaiting: true,
    });
  };

  return (
    <main className="flex flex-row min-h-screen gap-20 items-center justify-between p-24">
      <h1>Video calls</h1>
      <button onClick={createMeetingHandler}>Create meeting ID</button>
      <button onClick={createMeeting}>Create meeting</button>
    </main>
  );
}
