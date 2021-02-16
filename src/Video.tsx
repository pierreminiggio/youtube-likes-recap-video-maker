import {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import sound from './1.mp3';
import vid from './1.webm';
import sound17 from './17.mp3';
import vid17 from './17.webm';
import {Hello} from './Hello';

const vidsToLoad = [
	{
		video: vid,
		audio: sound
	},
	{
		video: vid17,
		audio: sound17
	}
]

export const RemotionVideo: React.FC = () => {
	const [handle] = useState(() => delayRender());
	const [vidDuration, setVidDuration] = useState(0);

	const framesPerSecond: number = 59.94;

	useEffect(() => {

		const promises: Promise<number>[] = []

		vidsToLoad.forEach(vidToLoad => {
			promises.push(new Promise(resolve => {
				const videoElement = document.createElement('video');
				videoElement.setAttribute('src', vidToLoad.video);
				videoElement.style.display = 'none';
				document.querySelector('body')?.appendChild(videoElement);
				videoElement.addEventListener(
					'loadeddata',
					() => {
						const duration: number = Math.floor(videoElement.duration * framesPerSecond)
						vidToLoad.duration = duration
						resolve(duration);
					},
					false
				);
			}))
		})
		
		Promise.all(promises).then(durations => {
			let totalDuration: number = 0
			durations.forEach(duration => {
				totalDuration += duration
			})
			setVidDuration(totalDuration)
		})

	}, [handle]);

	useEffect(() => {
		if (vidDuration > 0) {
			continueRender(handle);
		}
	}, [handle, vidDuration]);

	if (!vidDuration) {
		return null;
	}

	return (
		<>
			<Composition
				id="Hello"
				component={Hello}
				durationInFrames={vidDuration}
				fps={framesPerSecond}
				width={1920}
				height={1080}
				defaultProps={{
					vids: vidsToLoad
				}}
			/>
		</>
	);
};
