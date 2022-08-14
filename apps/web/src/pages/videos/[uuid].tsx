import { useEffect, useRef, useState } from "react"
import { useRouter } from 'next/router'
import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";

function formatTime(time: number): string {
  const seconds = time % 60
  const minutes = Math.floor(time / 60)
  const hours = Math.floor(time / 60 / 60)
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

const Video: NextPage = () => {
  const router = useRouter()
  const { uuid } = router.query as { uuid: string }
  const video = trpc.useQuery(["video", { uuid }]);

  const videoEl = useRef<HTMLVideoElement>(null)


  const [startTime, setStartTime] = useState<number | undefined>()
  const [endTime, setEndTime] = useState<number | undefined>()
  const handleCreateClip = () => {
    if (!startTime || !endTime) return;
    if (startTime >= endTime) return
    const ts = videoEl.current?.currentTime
  }

  if (video.isFetched && !video.data) {
    return <div className="m-8 text-3xl">This video does not exist</div>
  }
  return (
    <div className="m-8">
      {video.isLoading ? <div>Loading video...</div>
      : (<>
        <h1 className="text-3xl">{video.data?.title}</h1>
        <div className="my-4">
          <video
            ref={videoEl}
            className="mb-4"
            src={`http://localhost:5000/${video.data?.uuid}.mp4`}
            controls
          />
        </div>
        <div className="my-4">
          <div>
            <button className="py-2 px-4 border-4 mr-4" onClick={() => setStartTime(Math.floor(videoEl.current?.currentTime || 0))}>set start</button>
            {startTime === undefined ? <span>no start time</span> : formatTime(startTime)}
          </div>
          <div>
            <button className="py-2 px-4 border-4 mr-4" onClick={() => setEndTime(Math.floor(videoEl.current?.currentTime || 0))}>set end</button>
            {endTime === undefined ? <span>no end time</span> : formatTime(endTime)}
          </div>
          <div>
            <button className="py-2 px-4 border-4" onClick={handleCreateClip}>create clip</button>
          </div>
        </div>
        <h2 className="text-2xl">Clips</h2>
        {video.data?.clips.map(clip => (<div>

        </div>))}
      </>)}
    </div>
  )
}

export default Video
