import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Media = ({
  className,
  images,
  videos,
  hasMultipleMedia,
}) => {
  const [currentImage, setCurrentImage] = useState(undefined);

  return (
    <aside
      className={classnames(className, 'media', {
        'media--multiple': hasMultipleMedia,
      })}
    >
      {images.length > 0 && (
        <div className="media__container">
          {images.map(image => (
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
      {videos.length > 0 && (
        <div className="media__container media-container--videos">
          {[videos[0], videos[0]].map(youTubeId => (
            <div
              key={youTubeId}
              className="media__video-container"
            >
              <iframe
                width="100%"
                src={`https://www.youtube.com/embed/${youTubeId}`}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>
          ))}
        </div>
      )}
      {currentImage && (
        <div className="media__viewer">
          <div className="media__viewer-inner">
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
        </div>
      )}
    </aside>
  );
};

Media.propTypes = {
  className: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string),
  videos: PropTypes.arrayOf(PropTypes.string),
  hasMultipleMedia: PropTypes.bool.isRequired,
};

export default Media;
