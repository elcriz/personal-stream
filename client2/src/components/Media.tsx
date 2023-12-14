import classnames from 'classnames';
import { useState } from 'react';

interface MediaProps {
  className?: string;
  images?: string[];
  videos?: string[];
  hasMultipleMedia?: boolean;
}

function Media({ className, images, videos, hasMultipleMedia }: MediaProps) {
  const [currentImage, setCurrentImage] = useState<string | undefined>(undefined);

  return (
    <aside
      className={classnames(className, 'media', {
        'media--multiple': hasMultipleMedia,
      })}
    >
      {images && images.length > 0 && (
        <div className="media__container">
          {images.map((image) => (
            <figure
              key={image}
              className="media__figure"
            >
              <button
                className="media__enlarge-button"
                type="button"
                onClick={() => {
                  setCurrentImage(image);
                }}
              >
                <img
                  className="media__image"
                  src={image}
                  loading="lazy"
                  alt=""
                />
              </button>
            </figure>
          ))}
        </div>
      )}
      {videos && videos.length > 0 && (
        <div className="media__container media-container--videos">
          {videos.map((youTubeId) => (
            <div
              key={youTubeId}
              className="media__video-container"
            >
              <iframe
                width="100%"
                src={`https://www.youtube.com/embed/${youTubeId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      )}
      {currentImage && (
        <div className="media__viewer">
          <img
            className="media__viewer-image"
            src={currentImage}
            loading="lazy"
            alt=""
          />
          <button
            className="button"
            type="button"
            onClick={() => {
              setCurrentImage(undefined);
            }}
          >
            Close
          </button>
        </div>
      )}
    </aside>
  );
}

export default Media;
