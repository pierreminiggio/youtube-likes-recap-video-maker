export const Title: React.FC<{title: string;}> = ({title}) => {

  return (
    <div style={{
      color: '#FFF',
      backgroundColor: '#333',
      textShadow: '0px 0px 5px #000, 0px 0px 10px #EEE, 0px 0px 20px #000',
      textAlign: 'center',
      opacity: .8,
      fontSize: '100px',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0
    }}>{title}</div>
  )
}