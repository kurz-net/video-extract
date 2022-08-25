import { useEffect } from "react"
import type { NextPage } from "next";
import Link from "next/link"
import { trpc } from "../utils/trpc";
import { API_URL } from "../utils/config";

const Home: NextPage = () => {
  const videos = trpc.useQuery(["videos"]);
  const createVideo = trpc.useMutation(["createVideo"])
  const deleteVideo = trpc.useMutation(["deleteVideo"])

  useEffect(() => {
    const interval = setInterval(videos.refetch, 100)
    return () => clearInterval(interval)
  }, [])

  const handleCreateVideo = () => {
    const url = prompt("YouTube URL")
    if (!url) return;
    createVideo.mutate({ url })
  }

  const handleDeleteVideo = (uuid: string) => {
    const ok = confirm("Are you sure?")
    if (!ok) return;
    deleteVideo.mutate({ videoUuid: uuid })
  }

  return <>
    <div className="m-8">
      <h1 className="text-3xl">Videos</h1>
      <button className="my-4 px-4 py-2 border-2 rounded-lg" onClick={handleCreateVideo}>
        + add
      </button>
      {videos.isLoading && <div>Loading videos...</div>}
      {videos.data?.map(video => (
        <div key={video.uuid} className="my-4">
          {video.progress === 100 && <>
            <video
              className="mb-4"
              src={`${API_URL}${video.uuid}.mp4`}
              controls
            />
          </>}
          {video.progress === 100 ? (
            <div>
              <Link href={`/videos/${video.uuid}`}>
                <span className="underline cursor-pointer">{video.title}</span>
              </Link>
            </div>
          ) : <div>{video.title}</div>}
          <div>{video.progress}% downloaded</div>
          <div>{video._count.clips} clip/s</div>
          <div>
            <button className="underline" onClick={() => handleDeleteVideo(video.uuid)}>delete</button>
          </div>
        </div>
      ))}
    </div>
  </>;
};

export default Home;
