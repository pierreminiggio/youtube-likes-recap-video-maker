import {Audio, delayRender, Video} from 'remotion';

export const Hello: React.FC = (props) => {
  delayRender()
  return (<>
    <Video src={props.vid} />
    <Audio src={props.sound} />
  </>);
}