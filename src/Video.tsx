import {Composition} from 'remotion';
import {Hello} from './Hello';
import vid from './1.webm'
import sound from './1.mp3'
//console.log(vid)

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="Hello"
				component={Hello}
				durationInFrames={150}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					vid: vid,
				  sound: sound
				}}
			/>
		</>
	);
};
