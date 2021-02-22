import {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender, random} from 'remotion';
import {Hello} from './Hello';
import ImageAndAudioToLoad from './ImageAndAudioToLoad'
import Like from './Like'
import Size from './Size'
import VideoToLoad from './VideoToLoad'

const baseStorageUrl: string = 'https://storage.miniggiodev.fr/youtube-likes-recap'
const contentsToLoad: (ImageAndAudioToLoad|VideoToLoad)[] = []

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

contentsToLoad.push(VideoToLoad.makeFromURL(introVideoUrl))

const day: number = 17//today.getDate()
const dayVideoUrl: string = baseStorageUrl + '/number/' + day
contentsToLoad.push(VideoToLoad.makeFromURL(dayVideoUrl))

const month: number = today.getMonth() + 1
const monthVideoUrl: string = baseStorageUrl + '/month/' + month
contentsToLoad.push(VideoToLoad.makeFromURL(monthVideoUrl))

const multipleTakesYear: {[key: number]: number} = {
	2021: 2
}

const yearVideoStorage: string = baseStorageUrl + '/year/'
const year: number = today.getFullYear()
const yearTakes: number|undefined = multipleTakesYear[year]

const yearVideoUrl: string = yearTakes ?
	(yearVideoStorage + '/' + year + '-' + (Math.floor(random(randomKey + '' + year) * yearTakes) + 1)) :
	(yearVideoStorage + '/' + year)

contentsToLoad.push(VideoToLoad.makeFromURL(yearVideoUrl))

if (isTwoPartIntro) {
	contentsToLoad.push(VideoToLoad.makeFromURL(introVideoStorage + '/' + pickedIntro + '-2'))
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
		contentsToLoad.push(VideoToLoad.makeFromURL(videoTakesStorage + (vidNumber.toString()) + '-' + (pickedvideoTakeNumber.toString())))
	} else {
		//TODO FIND PLACEHOLDER IF NEEDED
	}

	const like: Like = likes[likeKey]
	const channelId: string = like.channel_id

	if (alreadyMentionnedChannels.includes(channelId)) {
		continue
	}


	if (like.channel_video !== null) {
		contentsToLoad.push(VideoToLoad.makeFromURL(like.channel_video))
	} else {
		contentsToLoad.push(new ImageAndAudioToLoad(like.channel_photo, like.channel_audio))
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

		const durationPromises: Promise<number>[] = []
		const imageSizePromises: Promise<{}>[] = []
		const createImageSizePromise: CallableFunction = function (imageAndAudio: ImageAndAudioToLoad): Promise<{}> {
			return new Promise(resolve => {
				const imageElement: HTMLImageElement = document.createElement('img')
				imageElement.style.display = 'none'
				document.querySelector('body')?.appendChild(imageElement)
				imageElement.onload = function() {
					imageAndAudio.imageSize = new Size(this.width, this.height)
					resolve({});
				}
				imageElement.src = imageAndAudio.image;
			})
		}

		contentsToLoad.forEach(vidToLoad => {
			if (vidToLoad instanceof ImageAndAudioToLoad) {
				imageSizePromises.push(createImageSizePromise(vidToLoad))
			}
			durationPromises.push(new Promise(resolve => {
				const videoElement: HTMLVideoElement|HTMLAudioElement = document.createElement(vidToLoad instanceof VideoToLoad ? 'video' : 'audio')
				videoElement.setAttribute('src', vidToLoad instanceof VideoToLoad ? vidToLoad.video : vidToLoad.audio)
				videoElement.style.display = 'none'
				document.querySelector('body')?.appendChild(videoElement)
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

		const resolveVidDurations: CallableFunction = () => {
			Promise.all(durationPromises).then(durations => {
				let totalDuration: number = 0
				durations.forEach(duration => {
					totalDuration += duration
				})
				setVidDuration(totalDuration)
			})
		}

		if (imageSizePromises.length === 0) {
			resolveVidDurations()
		} else {
			Promise.all(imageSizePromises).then(() => resolveVidDurations())
		}

	}, [handle]);

	useEffect(() => {
		if (vidDuration > 0) {
			continueRender(handle);
		}
	}, [handle, vidDuration]);

	if (!vidDuration) {
		return null;
	}

	const compositionWidth: number = 1920
	const compositionHeight: number = 1080

	return (
		<>
			<Composition
				id="Hello"
				component={Hello}
				durationInFrames={vidDuration}
				fps={framesPerSecond}
				width={compositionWidth}
				height={compositionHeight}
				defaultProps={{
					vids: contentsToLoad,
					compositionWidth: compositionWidth,
					compositionHeight: compositionHeight
				}}
			/>
		</>
	);
};
