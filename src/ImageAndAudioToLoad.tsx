import Size from "./Size"

export default class ImageAndAudioToLoad {

  public image: string
  public imageSize: Size|null = null
  public audio: string
  public duration: number = 0
  public title: string|null = null

  public constructor(image: string, audio: string, title: string|null = null) {
    this.image = image
    this.audio = audio
    this.title = title
  }
}