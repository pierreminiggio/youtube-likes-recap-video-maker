import {Audio, Sequence, Video} from 'remotion';
import ImageAndAudioToLoad from './ImageAndAudioToLoad'
import VideoToLoad from './VideoToLoad';
import {Title} from './Title'
import { Outro } from './Outro';

function instanceOfVideoToLoad(object: any): object is VideoToLoad {
	return 'video' in object
}

export const Hello: React.FC<{
  vids: (ImageAndAudioToLoad|VideoToLoad)[],
  compositionWidth: number,
  compositionHeight: number,
  outroDuration: number
}> = props => {
  const {vids, compositionWidth, compositionHeight, outroDuration} = props

  let start = 0

	return (
		<>
			{vids.map((vid: ImageAndAudioToLoad|VideoToLoad) => {
        const sequence = (
	<Sequence
		key={start}
		from={start}
		durationInFrames={vid.duration}
	>
		{instanceOfVideoToLoad(vid) ?
			<>
				<Video src={vid.video} />
				{vid.title ? <Title title={vid.title} /> : <></>}
			</> :
			<>
				<img
					src={vid.image} width={
                (compositionHeight / vid.imageSize?.height) * vid.imageSize?.width
              } height={
                compositionHeight
              }
					style={{
                marginLeft: ((compositionWidth - (compositionHeight / vid.imageSize?.height) * vid.imageSize?.width) / 2).toString() + 'px'
					}} />
				<Audio src={vid.audio} />
				{vid.title ? <Title title={vid.title} /> : <></>}
			</>
          }

	</Sequence>
)

        start += vid.duration + 1
        
        return sequence
      })}
			<Sequence
				key={start}
				from={start}
				durationInFrames={outroDuration}
			>
				<Outro outroDuration={outroDuration}/>
			</Sequence>
		</>
	);
};
