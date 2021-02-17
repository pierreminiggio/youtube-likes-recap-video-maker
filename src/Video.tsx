import {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import {Hello} from './Hello';
import VideoToLoad from './VideoToLoad'

const baseStorageUrl: string = 'https://storage.miniggiodev.fr/youtube-likes-recap'
const vidsToLoad: VideoToLoad[] = []

const intros: number[] = [1, 2, 3, 4, 5, 6, 7]
const twoPartsIntro: number[] = [5]

const introVideoStorage: string = baseStorageUrl + '/intro/'
const pickedIntro: number = intros[Math.floor(Math.random() * intros.length)]
const isTwoPartIntro: boolean = twoPartsIntro.includes(pickedIntro)

const introVideoUrl: string = isTwoPartIntro ?
	(introVideoStorage + '/' + pickedIntro + '-1') :
	(introVideoStorage + '/' + pickedIntro)

vidsToLoad.push(VideoToLoad.makeFromURL(introVideoUrl))

const today: Date = new Date()
const day: number = today.getDate()
const dayVideoUrl: string = baseStorageUrl + '/number/' + day
vidsToLoad.push(VideoToLoad.makeFromURL(dayVideoUrl))

const month: number = today.getMonth() + 1
const monthVideoUrl: string = baseStorageUrl + '/month/' + month
vidsToLoad.push(VideoToLoad.makeFromURL(monthVideoUrl))

const multipleTakesYear: {[key: number]: number} = {
	2021: 2
}

const yearVideoStorage: string = baseStorageUrl + '/year/'
const year: number = today.getFullYear()
const yearTakes: number|undefined = multipleTakesYear[year]

const yearVideoUrl: string = yearTakes ?
	(yearVideoStorage + '/' + year + '-' + (Math.floor(Math.random() * yearTakes) + 1)) :
	(yearVideoStorage + '/' + year)

vidsToLoad.push(VideoToLoad.makeFromURL(yearVideoUrl))

const videoTakes: {[key: number]: number} = {
	1: 1,
	2: 1,
	3: 1,
	4: 1
}

export const RemotionVideo: React.FC<{
  propOne: string;
  propTwo: number;
}> = (propOne, propTwo) => {
	console.log(propOne)
	console.log(propTwo)
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
