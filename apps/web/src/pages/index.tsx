import { useEffect, useCallback } from "react"
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const videos = trpc.useQuery(["videos"]);
  const createVideo = trpc.useMutation(["createVideo"])

  let interval: NodeJS.Timer;
  useEffect(() => {
    if (!interval) return
    interval = setInterval(videos.refetch, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleCreateVideo = useCallback(() => {
    const url = prompt("YouTube URL")
    if (!url) return;
    createVideo.mutate({ url })
  }, [])

  return <>
    <div className="m-8">
      <h1 className="text-3xl">Videos</h1>
      <button className="my-4 px-4 py-2 border-4 border-gray-300" onClick={handleCreateVideo}>
        + add
      </button>
      {videos.isLoading && <div>Loading videos...</div>}
      {videos.data?.map(video => (
        <div key={video.uuid} className="my-4">
          {video.progress === 100 && <>
            <video
              className="mb-4"
              src={`http://localhost:5000/${video.uuid}.mp4`}
              controls
            />
          </>}
          <div>{video.title}</div>
          <div>{video.progress}% downloaded</div>
        </div>
      ))}
    </div>
  </>;
};

export default Home;
