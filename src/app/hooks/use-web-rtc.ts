"use client";
import { useMeetStore } from "../store/meet-store";
import { database } from "../firebase/firebase";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

let pc: RTCPeerConnection;

if (typeof window !== "undefined" && window.RTCPeerConnection) {
  pc = new window.RTCPeerConnection(servers);
}

export const useWebRTC = () => {
  const { state, updateMeetState } = useMeetStore();

  const closeMeeting = () => {
    pc.close();
  };

  const createMeetingId = () => {
    return database.collection("meetings").doc().id;
  };

  const userVideoCamPermission = async () => {
    const constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: true,
    };
    const localStream = await navigator.mediaDevices.getUserMedia(constraints);
    const remoteStream = new MediaStream();

    for (const track of localStream.getTracks()) {
      pc.addTrack(track, localStream);
    }

    for (const videoTrack of localStream.getVideoTracks()) {
      videoTrack.enabled = state.isCameraOn;
    }

    for (const audioTrack of localStream.getAudioTracks()) {
      audioTrack.enabled = state.isMicOn;
    }

    pc.ontrack = (event) => {
      for (const track of event.streams[0].getTracks()) {
        remoteStream.addTrack(track);
      }
    };

    updateMeetState({
      localStream,
      remoteStream,
    });
  };

  const shareScreen = async ({ ref }: { ref: HTMLVideoElement }) => {
    const streamRef = ref;
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const localSenders = pc.getSenders();
      const localVideoSender = localSenders.find(
        (sender) => sender.track?.kind === "video"
      );

      if (localVideoSender) {
        const localVideoTrack = localVideoSender.track;

        const originalLocalStream = localVideoTrack
          ? new MediaStream([localVideoTrack])
          : new MediaStream();

        await localVideoSender.replaceTrack(screenStream.getVideoTracks()[0]);
        if ("srcObject" in streamRef) {
          streamRef.srcObject = screenStream;
          updateMeetState({ isPresenting: true });
        }
        screenStream.getVideoTracks()[0].addEventListener("ended", () => {
          void localVideoSender.replaceTrack(
            originalLocalStream.getVideoTracks()[0]
          );
          if ("srcObject" in streamRef) {
            streamRef.srcObject = null;
            updateMeetState({ isPresenting: false });
          }
        });
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  const createMeeting = async (id: string) => {
    await userVideoCamPermission();

    const meetDocument = database.collection("meetings").doc(id);
    const offerCandidates = meetDocument.collection("offerCandidates");
    const answerCandidates = meetDocument.collection("answerCandidates");

    pc.onicecandidate = async (event) => {
      event.candidate && (await offerCandidates.add(event.candidate.toJSON()));
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    console.log("Creating meeting");
    console.log(meetDocument);
    await meetDocument.set({ offer });

    meetDocument.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(
          data.answer as RTCSessionDescriptionInit
        );
        void pc.setRemoteDescription(answerDescription);
      }
    });

    answerCandidates.onSnapshot((snapshot) => {
      for (const change of snapshot.docChanges()) {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          void pc.addIceCandidate(candidate);
        }
      }
    });
  };

  const joinMeeting = async (id: string) => {
    await userVideoCamPermission();
    const meetDocument = database.collection("meetings").doc(id);
    const answerCandidates = meetDocument.collection("answerCandidates");
    const offerCandidates = meetDocument.collection("offerCandidates");

    pc.onicecandidate = async (event) => {
      event.candidate && (await answerCandidates.add(event.candidate.toJSON()));
    };

    const callDataSnapshot = await meetDocument.get();
    const callData = callDataSnapshot.data();

    const offerDescription = callData?.offer as
      | RTCSessionDescriptionInit
      | undefined;

    if (offerDescription) {
      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );
    }

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await meetDocument.update({ answer });
    offerCandidates.onSnapshot((snapshot) => {
      for (const change of snapshot.docChanges()) {
        if (change.type === "added") {
          const data = change.doc.data();
          void pc.addIceCandidate(new RTCIceCandidate(data));
        }
      }
    });
  };

  return {
    createMeeting,
    joinMeeting,
    createMeetingId,
    userVideoCamPermission,
    closeMeeting,
    shareScreen,
  };
};
