import {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender, random} from 'remotion';
import {Hello} from './Hello';
import Like from './Like'
import VideoToLoad from './VideoToLoad'

const baseStorageUrl: string = 'https://storage.miniggiodev.fr/youtube-likes-recap'
const vidsToLoad: VideoToLoad[] = []

const intros: number[] = [1, 2, 3, 4, 5, 6, 7]
const twoPartsIntro: number[] = [5]

const today: Date = new Date()
const randomKey: string = today.getFullYear() + '' + today.getMonth() + '' + today.getDate()

const introVideoStorage: string = baseStorageUrl + '/intro/'
const pickedIntro: number = intros[Math.floor(random(randomKey + 'intro') * intros.length)]
const isTwoPartIntro: boolean = twoPartsIntro.includes(pickedIntro)

const introVideoUrl: string = isTwoPartIntro ?
	(introVideoStorage + '/' + pickedIntro + '-1') :
	(introVideoStorage + '/' + pickedIntro)

vidsToLoad.push(VideoToLoad.makeFromURL(introVideoUrl))

const day: number = 17//today.getDate()
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
	(yearVideoStorage + '/' + year + '-' + (Math.floor(random(randomKey + '' + year) * yearTakes) + 1)) :
	(yearVideoStorage + '/' + year)

vidsToLoad.push(VideoToLoad.makeFromURL(yearVideoUrl))

if (isTwoPartIntro) {
	vidsToLoad.push(VideoToLoad.makeFromURL(introVideoStorage + '/' + pickedIntro + '-2'))
}

const videoTakesStorage: string = baseStorageUrl + '/video/'
const videoTakes: {[key: number]: number} = {
	1: 1,
	2: 1,
	3: 1,
	4: 1
}

const likes: {[key: number]: Like} = require('../likes.json')

let vidNumber: number = 0
const alreadyMentionnedChannels: string[] = []
for (const likeKey in likes) {
	vidNumber++
	if (videoTakes[vidNumber] !== undefined) {
		const pickedvideoTakeNumber: number = Math.floor(random(randomKey + 'vid' + vidNumber) * videoTakes[vidNumber]) + 1
		vidsToLoad.push(VideoToLoad.makeFromURL(videoTakesStorage + (vidNumber.toString()) + '-' + (pickedvideoTakeNumber.toString())))
	} else {
		//TODO FIND PLACEHOLDER IF NEEDED
	}

	const like: Like = likes[likeKey]
	const channelId: string = like.channel_id

	if (alreadyMentionnedChannels.includes(channelId)) {
		continue
	}


	if (like.channel_video !== null) {
		vidsToLoad.push(VideoToLoad.makeFromURL(like.channel_video))
	} else {
		//TODO insert image + audio instead
	}
	
	alreadyMentionnedChannels.push(channelId)
	console.log(like)
}

export const RemotionVideo: React.FC<{

}> = () => {

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
