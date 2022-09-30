import { useEffect, useState, useRef } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { trpc } from '../utils/trpc';
import { API_URL } from '../utils/config';
import { ThumbnailModal } from '../components';

const Home: NextPage = () => {
	const videos = trpc.useQuery(['videos']);
	const deleteVideo = trpc.useMutation(['deleteVideo']);

	const videoRef = useRef<HTMLVideoElement>(null);

	const [open, setOpen] = useState(false);
	const [autoPlay, setAutoPlay] = useState(false);

	useEffect(() => {
		const video = videoRef.current;
		video?.play();
		const interval = setInterval(videos.refetch, 100);
		return () => clearInterval(interval);
	}, []);

	const handleCreateVideo = () => {
		setOpen(true);
	};

	const handleDeleteVideo = (uuid: string) => {
		const ok = confirm('Are you sure?');
		if (!ok) return;
		deleteVideo.mutate({ videoUuid: uuid });
	};

	const showVideoOnHover = (event: React.MouseEvent<HTMLDivElement>) => {
		setAutoPlay(true);
	};

	const hideVideoOnLeave = (event: React.MouseEvent<HTMLDivElement>) => {
		setAutoPlay(false);
	};

	return (
		<>
			<ThumbnailModal open={open} close={() => setOpen(false)} />
			<div className='navbar bg-base-100 p-4'>
				<div className='flex-1'>
					<a className='btn btn-ghost normal-case text-xl'>Video Extract</a>
				</div>
				<div className='navbar-end'>
					<button className='btn btn-primary' onClick={handleCreateVideo}>
						+ video
					</button>
				</div>
			</div>
			<main className='m-8'>
				{videos.isLoading && <div>Loading videos...</div>}
				<div className='w-full grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{videos.data?.map(video => (
						<div
							key={video.uuid}
							className='card w-full bg-base-100 shadow-xl'
							onMouseOver={showVideoOnHover}
							onMouseOut={hideVideoOnLeave  }
						>
							<figure>
								{video.progress === 100 && (
									<>
										<img
											src={`https://img.youtube.com/vi/${video.originUrl
												.split('v=')[1]
												?.substring(0, 11)}/hqdefault.jpg`}
											className={`w-full h-80 mb-4 rounded-tl-2xl rounded-tr-2xl z-20 ${
												autoPlay ? 'hover:scale-110 hover:opacity-0' : ''
											} transition-all delay-500 hover:z-0`}
											alt='thumbnail'
										/>
										{autoPlay && (
											<video
												className='mb-4 h-72 absolute'
												src={`${API_URL}${video.uuid}.mp4`}
												ref={videoRef}
												playsInline
												autoPlay
												loop
												disablePictureInPicture
												muted
											/>
										)}
									</>
								)}
							</figure>
							<div className='card-body'>
								<h2 className='card-title'>
									{video.progress === 100 && <span>{video.title}</span>}
									{video.progress < 100 && (
										<span className='italic'>Unknown</span>
									)}
								</h2>
								<p>
									{video.progress}% downloaded
									<br />
									{video._count.clips} clip/s
								</p>
								<div className='card-actions justify-end'>
									{video.progress === 100 && (
										<>
											<button
												className='btn btn-ghost'
												onClick={() => handleDeleteVideo(video.uuid)}
											>
												delete
											</button>
											<a
												role='button'
												href={`/videos/${video.uuid}`}
												className='btn btn-ghost'
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
