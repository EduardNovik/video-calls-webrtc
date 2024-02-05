"use client";
import { useWebRTC } from "./hooks/use-web-rtc";

export default function Home() {
  const { createMeetingId, createMeeting } = useWebRTC();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Video calls</h1>
      <button onClick={createMeetingId}>Create meeting ID</button>
      <button onClick={createMeeting}>Create meeeting</button>
    </main>
  );
}
