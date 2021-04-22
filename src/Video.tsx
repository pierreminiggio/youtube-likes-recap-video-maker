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

const month: number = 2//today.getMonth() + 1
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

const audioToSpeechEndPoint: string = 'https://gtts-api.miniggiodev.fr/'
const placeholderVideoTexts: CallableFunction[] = [
	(n: number) => 'Le contenu numero ' + n + ' d\'aujourd\'hui est de ',
	(n: number) => 'Contenu numero ' + n,
	(n: number) => 'La video d\'après est de ',
	(n: number) => 'Ensuite comme video numero ' + n + ', j\'ai vu une de la chaine ',
	(n: number) => 'La video suivante est de ',
]

let vidNumber: number = 0
const alreadyMentionnedChannels: string[] = []
for (const likeKey in likes) {
	vidNumber++

	const like: Like = likes[likeKey]
	const channelId: string = like.channel_id

	if (videoTakes[vidNumber] !== undefined) {
		const pickedvideoTakeNumber: number = Math.floor(random(randomKey + 'vid' + vidNumber) * videoTakes[vidNumber]) + 1
		contentsToLoad.push(VideoToLoad.makeFromURL(videoTakesStorage + (vidNumber.toString()) + '-' + (pickedvideoTakeNumber.toString()), like.title))
	} else {
		const pickedplaceHolderVideoNumber: number = Math.floor(random(randomKey + 'placeholder' + vidNumber) * placeholderVideoTexts.length)
		contentsToLoad.push(new ImageAndAudioToLoad(
			'data:image/jpeg;base64,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',
			audioToSpeechEndPoint + (placeholderVideoTexts[pickedplaceHolderVideoNumber])(vidNumber),
			like.title
		))
	}

	if (like.channel_video === null || alreadyMentionnedChannels.includes(channelId)) {
		contentsToLoad.push(new ImageAndAudioToLoad(like.channel_photo, like.channel_audio, like.title))
	} else {
		contentsToLoad.push(VideoToLoad.makeFromURL(like.channel_video, like.title))
	}

	if (! alreadyMentionnedChannels.includes(channelId)) {
		alreadyMentionnedChannels.push(channelId)
	}

	if (like.video_clip !== null) {
		contentsToLoad.push(VideoToLoad.makeFromURL(like.video_clip, like.title))
	} else {
		contentsToLoad.push(new ImageAndAudioToLoad(baseStorageUrl + '/no-clip.png', audioToSpeechEndPoint + 'zut,%20pas%20de%20clip', like.title))
	}
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

	if (! vidDuration) {
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
