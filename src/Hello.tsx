import {Audio, Video} from 'remotion';

export const Hello: React.FC = (props) => {
  return (<>
    <Video src={props.vid} />
    <Audio src={props.sound} />
  </>);
}