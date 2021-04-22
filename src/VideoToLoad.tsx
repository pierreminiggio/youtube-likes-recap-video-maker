export default class VideoToLoad {

  public video: string
  public duration: number = 0
  public title: string|null = null

  public constructor(video: string, title: string|null = null) {
    this.video = video
    this.title = title
  }

  public static makeFromURL(url: string, title: string|null = null): VideoToLoad {
    return new VideoToLoad(url + '.webm', title)
  }
}