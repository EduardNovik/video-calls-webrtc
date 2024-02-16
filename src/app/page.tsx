"use client";
import "../../styles/globals.css";
import { useWebRTC } from "./hooks/use-web-rtc";
import { useMeetStore } from "./store/meet-store";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import { ThemeSwitcher } from "./components/theme-switcher";

export default function Home() {
  const [inputData, setInputData] = useState("");
  const { createMeetingId, createMeeting } = useWebRTC();
  const { updateMeetState } = useMeetStore();
  const router = useRouter();

  const createMeetingHandler = async () => {
    const createdMeetingId = createMeetingId();
    console.log(createdMeetingId);

    updateMeetState({
      meetId: createdMeetingId,
      isCallActive: true,
      isHost: true,
      isWaiting: true,
    });

    await createMeeting();

    router.push("/on-call");
  };

  const joinMeetingHandler = async () => {
    updateMeetState({
      meetId: inputData,
      isCallActive: true,
      isHost: true,
      isWaiting: true,
    });

    await createMeeting();

    router.push("/on-call");
  };

  return (
    <main className="min-h-screen flex flex-col p-10 items-center custom-bg object-scale-down  ">
      <div className="flex justify-end w-full">
        <ThemeSwitcher />
      </div>
      <h1 className="text-6xl text-slate-800 my-20 drop-shadow-xl">
        Video Calls
      </h1>
      <Button
        className="w-1/2 lg:w-1/3 mb-8 bg-red-800 hover:-translate-y-1 hover:scale-105 hover:bg-[#9353d3] "
        variant="shadow"
        onClick={createMeetingHandler}
      >
        New Call
      </Button>

      <div className="flex flex-row justify-between items-center w-1/2 lg:w-1/3 mb-8">
        <span className=" border-slate-500 w-[40%] border-t-1" />
        <p className="text-2xl text-slate-800 ">OR</p>
        <span className=" border-slate-500 w-[40%] border-t-1" />
      </div>

      <div className="w-1/2 lg:w-1/3 mb-4">
        <Input
          type="text"
          label="Meeting ID"
          labelPlacement="inside"
          className="placeholder:text-slate-800"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />
      </div>
      <Button
        className="w-1/2 lg:w-1/3 p-4 bg-transparent border-[1px] border-red-800 text-red-800 hover:bg-red-800 hover:text-white"
        variant="shadow"
        onClick={joinMeetingHandler}
      >
        Join Call
      </Button>
    </main>
  );
}
