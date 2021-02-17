import {Audio, Sequence, Video} from 'remotion';
import VideoToLoad from './VideoToLoad';

export const Hello: React.FC<{
  vids: VideoToLoad[]
}> = props => {
  const vids = props.vids

  let start = 0

	return (
		<>
      {vids.map(vid => {
        const sequence = <Sequence
          key={start}
          from={start}
          durationInFrames={vid.duration}
        >
          <Video src={vid.video} />
          <Audio src={vid.audio} />
        </Sequence>

        start += vid.duration + 1
        
        return sequence
      })}
		</>
	);
};
