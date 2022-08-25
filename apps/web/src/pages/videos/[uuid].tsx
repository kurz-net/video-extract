import { useRef, useState, useCallback } from "react"
import { useRouter } from 'next/router'
import type { NextPage } from "next";
import { inferQueryOutput, trpc } from "../../utils/trpc";

type VideoClip = Exclude<inferQueryOutput<"video">, null>["clips"][number]

function formatTime(time: number): string {
  const seconds = time % 60
  const minutes = Math.floor(time / 60)
  const hours = Math.floor(time / 60 / 60)

  const hs = hours.toString().padStart(2, "0")
  const ms = minutes.toString().padStart(2, "0")
  const ss = seconds.toString().padStart(2, "0")

  return `${hs}:${ms}:${ss}`
}

const Video: NextPage = () => {
  const router = useRouter()
  const { uuid } = router.query as { uuid: string }
  const video = trpc.useQuery(["video", { uuid }]);
  const createClip = trpc.useMutation(["createClip"])

  const videoEl = useRef<HTMLVideoElement>(null)

  const [startTime, setStartTime] = useState<number | undefined>()
  const [endTime, setEndTime] = useState<number | undefined>()
  const handleCreateClip = useCallback(() => {
    if (startTime === undefined || endTime === undefined) {
      alert("Start or end time is not defined")
      return;
    }
      if (startTime >= endTime) {
      alert("The start time must be earlier than the end time!")
      return;
    }
    const title = prompt("video clip name")
    createClip.mutate({ title, startTime, endTime, videoUuid: uuid })
  }, [])

  if (video.isFetched && !video.data) {
    return <div className="m-8 text-3xl">This video does not exist</div>
  }
  return (
    <div className="m-8">
      <a href="/" className="underline">back</a>
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
          <div className="flex">
            <button className="py-2 px-4 border-2 rounded-lg mr-4" onClick={() => setStartTime(Math.floor(videoEl.current?.currentTime || 0))}>set start</button>
            <div className="mr-4 flex items-center">
              {startTime === undefined ? <span>no start time</span> : formatTime(startTime)}
            </div>

            <div className="mr-4 flex items-center">
              {endTime === undefined ? <span>no end time</span> : formatTime(endTime)}
            </div>
            <button className="py-2 px-4 border-2 rounded-lg mr-4" onClick={() => setEndTime(Math.floor(videoEl.current?.currentTime || 0))}>set end</button>

            <button className="py-2 px-4 rounded-lg border-2" onClick={handleCreateClip}>create clip</button>
          </div>
        </div>
        <h2 className="text-2xl">Clips</h2>
        {video.data?.clips.map(clip => <VideoClipDisplay key={clip.uuid} clip={clip} />)}
      </>)}
    </div>
  )
}

type VideoClipDisplayProps = {
  clip: VideoClip
}
function VideoClipDisplay(props: VideoClipDisplayProps) {
  const { clip } = props

  const renameClip = trpc.useMutation(["renameClip"])
  const handleRename = useCallback(() => {
    const title = prompt("New video clip name", clip.title)
    renameClip.mutate({ title, clipUuid: clip.uuid })
  }, [clip])

  return (
    <div key={clip.uuid} className="flex my-2">
      <div>
        {!!clip.title ? <span>{clip.title}</span> : <span className="italic">No title</span>}
      </div>
      <div className="mx-2">|</div>
      <div>
        {formatTime(clip.startTime)} - {formatTime(clip.endTime)} ({clip.endTime-clip.startTime}s)
      </div>
      <div className="mx-2">|</div>
      <div>
        {!clip.downloaded && <span>downloading...</span>}
        {clip.downloaded && <div>
          <a className="underline" target="_blank" href={`http://localhost:5000/${clip.uuid}.mp4`}>download</a>
          <button className="underline ml-2" onClick={handleRename}>rename</button>
        </div>}
      </div>
    </div>
  )
}

export default Video
