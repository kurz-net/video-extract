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

  useEffect(() => {
    const interval = setInterval(videos.refetch, 100);
    return () => clearInterval(interval);
  }, []);

  const handleBulkCreateVidoes = async() => {
    const urls = await callModal("prompt","Please enter comma or line separated urls for bulk imports") as string;
    const bulkUrls = urls.split(/[,\n \r\n ]+/).map((url) => ({ url }));
    if (!bulkUrls[0]?.url) return;
    createManyVideo.mutate(bulkUrls);
  };

  const handleDeleteVideo = async(uuid: string, data?: string) => {
      const ok = await callModal("confirm", "Are You Sure?");
      if (!ok) return;
      deleteVideo.mutate({ videoUuid: uuid });
  };

  return (
    <>
      <div className="navbar bg-base-100 p-4">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">Video Extract</a>
        </div>
        <div className="navbar-end">
          <button
            onClick={handleBulkCreateVidoes}
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
