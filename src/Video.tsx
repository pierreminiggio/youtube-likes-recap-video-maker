import {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import {Hello} from './Hello';

const vidsToLoad = [
	{
		video: 'https://storage.miniggiodev.fr/test/1.webm',
		audio: 'https://storage.miniggiodev.fr/test/1.mp3'
	},
	{
		video: 'https://storage.miniggiodev.fr/test/17.webm',
		audio: 'https://storage.miniggiodev.fr/test/17.mp3'
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
