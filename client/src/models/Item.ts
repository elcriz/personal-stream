export interface ItemModel {
  title: string;
  slug: string;
  body: string;
  tags: string[];
  images: string[];
  videos: string[];
  mediaPosition: string;
  hasMedia?: boolean;
  hasMultipleMedia?: boolean;
  isValid?: () => boolean;
}

class Item implements ItemModel {
  title: string;
  slug: string;
  body: string;
  tags: string[];
  images: string[];
  videos: string[];
  mediaPosition: string;
  hasMedia: boolean;
  hasMultipleMedia: boolean;

  constructor({ title, slug, body, tags, images, videos, mediaPosition } = {} as ItemModel) {
    this.title = title || '';
    this.slug = slug || '';
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
    return !!this.title && !!this.body && this.tags.length > 0;
  }
}

export default Item;
