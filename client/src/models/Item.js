class Item {
  constructor({
    title,
    body,
    tags,
    images,
    videos,
    mediaPosition,
  } = {}) {
    this.title = title || '';
    this.body = body || '';
    this.tags = tags || [''];
    this.images = images || [];
    this.videos = videos || [];
    this.mediaPosition = mediaPosition || 'top';

    // Custom properties
    this.hasMedia = this.images.length > 0 || this.videos.length > 0;
    this.hasMultipleMedia = this.images.length > 1 || this.videos.length > 1;
  }

  isValid() {
    return !!this.title
      && !!this.body
      && this.tags.length > 0;
  }
}

export default Item;
