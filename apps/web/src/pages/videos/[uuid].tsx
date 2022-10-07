import { useRef, useState, useCallback, useReducer, MouseEventHandler } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { inferQueryOutput, trpc } from "../../utils/trpc";
import { API_URL } from "../../utils/config";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import callModal from "../components/modal/ViewModal";

function formatTime(time: number): string {
  const seconds = time % 60;
  const minutes = Math.floor(time / 60);
  const hours = Math.floor(time / 60 / 60);

  const hs = hours.toString().padStart(2, "0");
  const ms = minutes.toString().padStart(2, "0");
  const ss = seconds.toString().padStart(2, "0");

  return `${hs}:${ms}:${ss}`;
}

const Video: NextPage = () => {
  const router = useRouter();
  const { uuid } = router.query as { uuid: string };
  const context = trpc.useContext();
  const video = trpc.useQuery(["video", { uuid }]);
  const createClip = trpc.useMutation(["createClip"]);
  const videoEl = useRef<HTMLVideoElement>(null);

  const [startTime, setStartTime] = useState<number | undefined>();
  const [endTime, setEndTime] = useState<number | undefined>();

  const handleCreateClip = async () => {
    if (startTime === undefined || endTime === undefined) {
      await callModal("alert", "Start or end time is not defined");
      return;
    }
    if (startTime >= endTime) {
      await callModal("alert","The start time must be earlier than the end time!");
      return;
    }
    const data: string| null = await callModal("prompt", "video clip name") as string | null;
    await createClip.mutateAsync({ title: data || null, startTime, endTime, videoUuid: uuid });
    context.invalidateQueries(["video"]);
  };

  if (video.isFetched && !video.data) {
    return <div className="m-8 text-3xl">This video does not exist</div>;
  }
  return (
    <>
      <div>
      <div className="navbar bg-base-100 p-4">
        <div className="flex-1">
          <a role="button" href="/" className="btn btn-ghost btn-circle">
            <ArrowLeftIcon className="w-5 h-5" />
          </a>
          <a className="btn btn-ghost normal-case text-xl">
            {video.data?.title}
          </a>
        </div>
      </div>
      </div>
      <main className="m-8">
        {video.isLoading && <div>Loading video...</div>}
        {video.isFetched && (
          <>
            <div className="flex flex-wrap lg:flex-nowrap space-x-0 lg:space-x-8 space-y-8 lg:space-y-0">
              <div className="w-full space-y-4">
                <div className="w-full">
                  <video
                    ref={videoEl}
                    className="w-full"
                    src={`${API_URL}${video.data?.uuid}.mp4`}
                    controls
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    className="btn btn-ghost"
                    onClick={() =>
                      setStartTime(
                        Math.floor(videoEl.current?.currentTime || 0)
                      )
                    }
                  >
                    set start
                  </button>
                  <div className="flex items-center">
                    {startTime === undefined ? (
                      <span className="italic">not set</span>
                    ) : (
                      formatTime(startTime)
                    )}
                  </div>

                  <div className="flex items-center">
                    {endTime === undefined ? (
                      <span className="italic">not set</span>
                    ) : (
                      formatTime(endTime)
                    )}
                  </div>
                  <button
                    className="btn btn-ghost"
                    onClick={() =>
                      setEndTime(Math.floor(videoEl.current?.currentTime || 0))
                    }
                  >
                    set end
                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={
                      handleCreateClip as typeof handleCreateClip &
                        MouseEventHandler
                    }
                  >
                    create clip
                  </button>
                </div>
              </div>
              <div className="w-full space-y-4">
                <h2 className="text-2xl">Clips</h2>
                <div className="flex flex-col space-y-3">
                  {video.data?.clips.map((clip) => (
                    <VideoClipDisplay key={clip.uuid} clip={clip} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
};

type VideoClip = Exclude<inferQueryOutput<"video">, null>["clips"][number];

type VideoClipDisplayProps = {
  clip: VideoClip;
};
function VideoClipDisplay(props: VideoClipDisplayProps) {
  const { clip } = props;
  const context = trpc.useContext();

  const renameClip = trpc.useMutation(["renameClip"]);
  const handleRename = useCallback(
    async() => {
      const title = await callModal("prompt", `New video clip name, ${clip.title}`) as string | null;
      if (!title) return;
      await renameClip.mutateAsync({ title, clipUuid: clip.uuid });
      context.invalidateQueries(["video"]);
    },
    [clip]
  );

  const deleteClip = trpc.useMutation(["deleteClip"]);
  const handleDelete = useCallback(
    async() => {
      const ok = await callModal("confirm", "Do you really want to delete this clip?");
      if (!ok) return;
      await deleteClip.mutateAsync({ clipUuid: clip.uuid });
      context.invalidateQueries(["video"]);
    },
    [clip]
  );

  const handlePreview = async() => {
    await callModal("video", `${API_URL}${clip.uuid}.mp4`);
  }

  return (
    <>
      <div key={clip.uuid} className="flex justify-between">
        <div className="w-full">
          {!!clip.title ? (
            <span>{clip.title}</span>
          ) : (
            <span className="italic">No title</span>
          )}
        </div>
        <div className="w-full">
          {formatTime(clip.startTime)} - {formatTime(clip.endTime)} (
          {clip.endTime - clip.startTime}s)
        </div>
        <div className="w-full flex justify-end">
          {!clip.downloaded && <span>downloading...</span>}
          {clip.downloaded && (
            <div>
              <button className="btn btn-ghost" onClick={handlePreview}>
                view
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={
                  handleRename as typeof handleRename & MouseEventHandler
                }
              >
                rename
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={
                  handleDelete as typeof handleDelete & MouseEventHandler
                }
              >
                delete
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Video;
