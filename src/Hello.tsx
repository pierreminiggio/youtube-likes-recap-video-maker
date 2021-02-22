import {Audio, Sequence, Video} from 'remotion';
import ImageAndAudioToLoad from './ImageAndAudioToLoad'
import VideoToLoad from './VideoToLoad';

export const Hello: React.FC<{
  vids: (ImageAndAudioToLoad|VideoToLoad)[],
  compositionWidth: number,
  compositionHeight: number
}> = props => {
  const vids = props.vids
  const compositionWidth: number = props.compositionWidth
  const compositionHeight: number = props.compositionHeight

  let start = 0

	return (
		<>
      {vids.map(vid => {
        console.log(vid)
        const sequence = <Sequence
          key={start}
          from={start}
          durationInFrames={vid.duration}
        >
          {vid instanceof VideoToLoad ?
            <>
              <Video src={vid.video} />
              <Audio src={vid.audio} />
            </> :
            <>
              <img src={vid.image} width={
                (compositionHeight / vid.imageSize?.height) * vid.imageSize?.width
              } height={
                compositionHeight
              } style={{
                marginLeft: ((compositionWidth - (compositionHeight / vid.imageSize?.height) * vid.imageSize?.width) / 2).toString() + 'px'
              }} />
              <Audio src={vid.audio} />
            </>
          }

        </Sequence>

        start += vid.duration + 1
        
        return sequence
      })}
		</>
	);
};
