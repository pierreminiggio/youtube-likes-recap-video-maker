export default class VideoToLoad {

  public video: string
  public audio: string
  public duration: number = 0

  public constructor(video: string, audio: string) {
    this.video = video
    this.audio = audio
  }

  public static makeFromURL(url: string): VideoToLoad {
    return new VideoToLoad(url + '.webm', url + '.mp3')
  }
}