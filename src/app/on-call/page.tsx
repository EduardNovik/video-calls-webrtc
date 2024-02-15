import React from "react";

const OnCall = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl mb-4">Ongoing Call</h2>
      <div className="flex gap-10">
        <video className="w-1/2" controls muted>
          {/* Source or stream for the local video */}
        </video>
        <video className="w-1/2" controls>
          {/* Source or stream for the remote video */}
        </video>
      </div>
      <div className="mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
          End Call
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md">
          Toggle Audio
        </button>
      </div>
    </div>
  );
};

export default OnCall;
