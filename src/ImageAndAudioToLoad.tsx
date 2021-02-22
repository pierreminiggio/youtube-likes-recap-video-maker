export default class ImageAndAudioToLoad {

  public image: string
  public audio: string
  public duration: number = 0

  public constructor(image: string, audio: string) {
    this.image = image
    this.audio = audio
  }
}