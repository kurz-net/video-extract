import { useEffect, useRef } from "react"
import { useRouter } from 'next/router'
import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";

const Video: NextPage = () => {
  const router = useRouter()
  const { uuid } = router.query as { uuid: string }
  const video = trpc.useQuery(["video", { uuid }]);
  if (video.isFetched && !video.data) {
    return <div className="m-8 text-3xl">This video does not exist</div>
  }

  const videoEl = useRef<HTMLVideoElement>(null)

  const handleClick = () => {
    const ts = videoEl.current?.currentTime
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
        <div>
          <button onClick={handleClick}>print</button>
        </div>
      </>)}
    </div>
  )
}

export default Video
