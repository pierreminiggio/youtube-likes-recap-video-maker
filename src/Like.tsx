export default class Like {

  public channel_audio: string
  public channel_country: string
  public channel_id: string
  public channel_name: string
  public channel_photo: string
  public channel_video: string|null
  public id: number
  public title: string
  public youtube_id: string

  public constructor(
    channel_audio: string,
    channel_country: string,
    channel_id: string,
    channel_name: string,
    channel_photo: string,
    channel_video: string|null,
    id: number,
    title: string,
    youtube_id: string
  ) {
    this.channel_audio = channel_audio
    this.channel_country = channel_country
    this.channel_id = channel_id
    this.channel_name = channel_name
    this.channel_photo = channel_photo
    this.channel_video = channel_video
    this.id = id
    this.title = title
    this.youtube_id = youtube_id
  }
}
