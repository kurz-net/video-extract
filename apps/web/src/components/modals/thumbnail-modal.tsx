import { useState } from 'react';
import { trpc } from '../../utils/trpc';

interface ThumbnailModalProps {
	open: boolean;
	close: () => void;
}

const ThumbnailModal = ({ open, close = () => {} }: ThumbnailModalProps) => {
	const [videoURL, setVideoURL] = useState('');
	const [thumbImage, setThumbImage] = useState('');
	const createVideo = trpc.useMutation(['createVideo']);

	const handleCreateVideo = () => {
		let url = videoURL;
		if (url === '') return;
		createVideo.mutate({ url });
		setVideoURL('');
		setThumbImage('');
		close();
	};

	const handleKeyUp = () => {
		const url = videoURL;

		const pattern1 = 'https://www.youtube.com/watch?v=';
		const pattern2 = 'https://youtube.com/watch?v=';
		const pattern3 = 'https://www.youtu.be/';
		const pattern4 = 'https://youtu.be/';

		//condition to check if the entered url matches the pattern
		if (url.indexOf(pattern1) != -1 || url.indexOf(pattern2) != -1) {
			//get the unique youtube id
			let valid = url.split('watch?v=')[1]?.substring(0, 11);

			//get and set the image
			setThumbImage(`https://img.youtube.com/vi/${valid}/hqdefault.jpg`);
		} else if (url.indexOf(pattern3) != -1 || url.indexOf(pattern4) != -1) {
			//get the unique youtube id
			let valid = url.split('be/')[1]?.substring(0, 11);

			//get and set the image
			setThumbImage(`https://img.youtube.com/vi/${valid}/hqdefault.jpg`);
		}
	};

	return (
		<main
			className={`${
				open ? 'fixed' : 'hidden'
			} w-full h-screen z-50 transition-all`}
		>
			<div
				onClick={() => {
					setVideoURL('');
					setThumbImage('');
					close();
				}}
				className='w-full h-screen bg-black/30 absolute'
			></div>
			<div className='flex w-full justify-center mt-32 absolute z-50'>
				<div className='w-10/12 md:w-8/12 lg:w-5/12 shadow-md bg-white'>
					<input
						className='h-16 w-full border-b outline-none focus:outline-none px-4 text-lg'
						placeholder='Enter video url'
						onChange={e => setVideoURL(e.target.value)}
						onKeyUp={handleKeyUp}
						value={videoURL}
					/>
					{thumbImage && (
						<>
							<div className='h-[20rem] md:h-[25rem] lg:h-[30rem] relative overflow-hidden'>
								<img
									src={thumbImage}
									alt='image thumbnail'
									className='object-cover w-full h-full'
								/>
							</div>
							<div className='flex justify-center py-5'>
								<button className='btn btn-primary' onClick={handleCreateVideo}>
									Download Video
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</main>
	);
};

export default ThumbnailModal;
