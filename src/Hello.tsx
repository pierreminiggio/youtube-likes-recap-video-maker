import {Audio, Sequence, Video} from 'remotion';

export const Hello: React.FC = (props) => {
  const vids = props.vids

  let start = 0

	return (
		<>
      {vids.map(vid => {
        const sequence = <Sequence
          from={start}
          to={vid.duration}
        >
          <Video src={vid.video} />
          <Audio src={vid.audio} />
        </Sequence>

        start += vid.duration
        
        return sequence
      })}
		</>
	);
};
