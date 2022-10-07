import { useEffect, useState, useReducer } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { API_URL } from "../utils/config";
import callModal from "./components/modal/ViewModal";


const Home: NextPage = () => {
  const videos = trpc.useQuery(["videos"]);
  const createVideo = trpc.useMutation(["createVideo"]);
  const deleteVideo = trpc.useMutation(["deleteVideo"]);
  const createManyVideo = trpc.useMutation(["createManyVideo"]);
  const [urls, setUrls] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

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
    if (urls) {
      const bulkUrls = urls.split(/[,\n \r\n ]+/);
      createManyVideo.mutate(bulkUrls);
    }
    setUrls("");
    setOpenModal(false);
  };

  const handleDeleteVideo = async(uuid: string) => {
    const ok = await callModal("confirm", "Are You Sure");
    if (!ok) return;
    deleteVideo.mutate({ videoUuid: uuid });
  };

  return (
    <>
      <div>
        <input
          type="checkbox"
          checked={openModal}
          onChange={() => setOpenModal((prev) => !prev)}
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
              <button
                className="btn btn-ghost"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleBulkCreateVidoes}
              >
                Import
              </button>
            </div>
          </label>
        </label>
      </div>

      <div className="navbar bg-base-100 p-4">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">Video Extract</a>
        </div>
        <div className="navbar-end">
          <button
            onClick={() => setOpenModal((prev) => !prev)}
            className="btn modal-button btn-primary"
          >
            + video
          </button>
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