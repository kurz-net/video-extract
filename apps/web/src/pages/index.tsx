import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { API_URL } from "../utils/config";
import dynamic from "next/dynamic";
import { handleModalProps, useModalStore } from "./components/modal/modalStore";
const ViewModal = dynamic(() => import("./components/modal/ViewModal"), {
  ssr: false,
});

const Home: NextPage = () => {
  const videos = trpc.useQuery(["videos"]);
  const createVideo = trpc.useMutation(["createVideo"]);
  const deleteVideo = trpc.useMutation(["deleteVideo"]);
  const createManyVideo = trpc.useMutation(["createManyVideo"]);
  const [urls, setUrls] = useState<string>("");

  const { alert, isModalOpen } = useModalStore((state) => state);
  const [videoID, setVideoID] = useState<string | undefined>("");

  useEffect(() => {
    const interval = setInterval(videos.refetch, 100);
    return () => clearInterval(interval);
  }, []);

  const handleCreateVideo = () => {
    const url = prompt("YouTube URL nnnn");
    if (!url) return;
    createVideo.mutate({ url });
  };

  const handleBulkCreateVidoes = () => {
    const bulkUrls = urls.split(/[,\n \r\n ]+/).map((url) => ({ url }));
    if (!bulkUrls[0]?.url) return;
    createManyVideo.mutate(bulkUrls);
    setUrls("");
  };

  const handleDeleteVideo = (uuid: string, data?: string) => {
    if (!isModalOpen && !data) {
      setVideoID(uuid);
      handleModalProps({ alert: "confirm", message: "Are You Sure" });
    } else {
      const ok = data;
      if (!ok) return;
      deleteVideo.mutate({ videoUuid: uuid });
    }
  };

  const handleModalPropFunction = (data?: string) => {
    data && videoID && alert === "confirm" && handleDeleteVideo(videoID, data);
  };

  return (
    <>
      <ViewModal func={handleModalPropFunction} />
      <div>
        <input
          type="checkbox"
          id="createVideo-modal"
          className="modal-toggle"
        />
        <label htmlFor="createVideo-modal" className="modal cursor-pointer">
          <label className="modal-box relative">
            <h3 className="text-lg font-bold">Youtube URL Import</h3>
            <p className="py-4 text-sm">
              Please enter comma or line separated urls for bulk imports
            </p>

            <form className="form-control">
              <textarea
                className="textarea textarea-bordered"
                placeholder="https://wwww..."
                onChange={(e) => setUrls(e.target.value)}
              />
            </form>

            <div className="modal-action flex justify-end">
              <label htmlFor="createVideo-modal" className="btn btn-ghost">
                Cancel
              </label>
              <label
                className="btn btn-primary"
                htmlFor="createVideo-modal"
                onClick={handleBulkCreateVidoes}
              >
                Import
              </label>
            </div>
          </label>
        </label>
      </div>

      <div className="navbar bg-base-100 p-4">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">Video Extract</a>
        </div>
        <div className="navbar-end">
          <label
            htmlFor="createVideo-modal"
            className="btn modal-button btn-primary"
          >
            + video
          </label>
        </div>
      </div>
      <main className="m-8">
        {videos.isLoading && <div>Loading videos...</div>}
        <div className="w-full grid grid-cols-3 gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {videos.data?.map((video) => (
            <div key={video.uuid} className="card w-full bg-base-100 shadow-xl">
              <figure>
                {video.progress === 100 && (
                  <>
                    <video
                      className="mb-4"
                      src={`${API_URL}${video.uuid}.mp4`}
                      controls
                    />
                  </>
                )}
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  {video.progress === 100 && <span>{video.title}</span>}
                  {video.progress < 100 && (
                    <span className="italic">Unknown</span>
                  )}
                </h2>
                <p>
                  {video.progress}% downloaded
                  <br />
                  {video._count.clips} clip/s
                </p>
                <div className="card-actions justify-end">
                  {video.progress === 100 && (
                    <>
                      <button
                        className="btn btn-ghost"
                        onClick={() => handleDeleteVideo(video.uuid)}
                      >
                        delete
                      </button>
                      <a
                        role="button"
                        href={`/videos/${video.uuid}`}
                        className="btn btn-ghost"
                      >
                        view
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
