import {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import sound from './1.mp3';
import vid from './1.webm';
import {Hello} from './Hello';

export const RemotionVideo: React.FC = () => {
	const [handle] = useState(() => delayRender());
	const [vid1duration, setVid1Duration] = useState(0);

	const framesPerSecond = 59.94;

	useEffect(() => {
		const videoElement = document.createElement('video');
		videoElement.setAttribute('src', vid);
		videoElement.style.display = 'none';
		document.querySelector('body')?.appendChild(videoElement);
		videoElement.addEventListener(
			'loadeddata',
			() => {
				setVid1Duration(Math.floor(videoElement.duration * framesPerSecond));
			},
			false
		);
	}, [handle]);

	useEffect(() => {
		if (vid1duration > 0) {
			continueRender(handle);
		}
	}, [handle, vid1duration]);

	if (!vid1duration) {
		return null;
	}

	return (
		<>
			<Composition
				id="Hello"
				component={Hello}
				durationInFrames={vid1duration}
				fps={framesPerSecond}
				width={1920}
				height={1080}
				defaultProps={{
					vid,
					sound,
				}}
			/>
		</>
	);
};
