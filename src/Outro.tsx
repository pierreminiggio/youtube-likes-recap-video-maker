import { useCurrentFrame } from 'remotion'

export const Outro: React.FC<{
  outroDuration: number
}> = props => {
  const frame = useCurrentFrame()
  const {outroDuration} = props

  const halfDuration = outroDuration / 2
  const fourthDuration = halfDuration / 2

  const topOffset = frame < fourthDuration ?
    (fourthDuration - frame) / fourthDuration :
    0

  const opacity = 1 - (frame >= halfDuration ?
    (frame - halfDuration) / halfDuration :
    0
  )

  return (
	<div
		style={{
      fontSize: 200,
      backgroundColor: 'black',
      color: 'white',
      width: '100%',
      height: '100%',
      textAlign: 'center'
		}}
	>
		<span style={{
      position: 'relative',
      top: (topOffset * -60 + 40) + '%',
      opacity
		}}
		>
			À demain !
		</span>
	</div>
)
};
