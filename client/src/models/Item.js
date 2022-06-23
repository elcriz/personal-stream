class Item {
  constructor({
    title,
    body,
    tags,
    images,
    videos,
  } = {}) {
    this.title = title || '';
    this.body = body || '';
    this.tags = tags || [''];
    this.images = images || [];
    this.videos = videos || [];
  }

  isValid() {
    return !!this.title
      && !!this.body
      && this.tags.length > 0;
  }
}

export default Item;
