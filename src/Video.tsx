import {Composition, continueRender, delayRender} from 'remotion';
import {Hello} from './Hello';
import vid from './1.webm'
import sound from './1.mp3'
import { useEffect, useState } from 'react';

export const RemotionVideo: React.FC = () => {

	const [handle] = useState(() => delayRender());
	const [vid1duration, setVid1Duration] = useState([]);

	const framesPerSecond: number = 60

	let numberOfFrames: number = 1
	useEffect(() => {
			
		const videoElement = document.createElement('video')
		videoElement.setAttribute('src', vid)
		videoElement.style.display = 'none'
		console.log(document.querySelector('body'))
		document.querySelector('body')?.appendChild(videoElement)
		videoElement.addEventListener('loadeddata', () => {
			console.log(parseInt(videoElement.duration * framesPerSecond))
			setVid1Duration(parseInt(videoElement.duration * framesPerSecond))
	 }, false);
		continueRender(handle);
	}, [handle]);

	if (Number.isInteger(vid1duration)) {
		numberOfFrames = vid1duration
	}

	return (
		<>
			<Composition
				id="Hello"
				component={Hello}
				durationInFrames={numberOfFrames}
				fps={framesPerSecond}
				width={1920}
				height={1080}
				defaultProps={{
					vid: vid,
				  sound: sound
				}}
			/>
		</>
	);
};
