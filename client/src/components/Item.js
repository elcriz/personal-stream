import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import ReactMarkdown from 'react-markdown';

const Item = ({
  className,
  item,
  shouldDisplayTags,
  isLoading,
}) => {
  const { _id, title, body, tags, relativeDates, images, videos } = item;
  const hasMedia = images.length > 0 || videos.length > 0;

  return (
    <article
      className={classnames('item', className, {
        'is-loading': isLoading,
      })}
    >
      <header>
        <h2>
          <Link to={`/${_id}`}>{title}</Link>
        </h2>
        <div className="item__meta">
          <div className="item__timestamp">
            {relativeDates.created}
          </div>
        </div>
      </header>
      <div className="item__body">
        {body && (
          <div className={hasMedia ? 'with-media' : undefined}>
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>
        )}
        {hasMedia && (
          <aside className="item__media">
            {images.length > 0 && (
              <figure className="item__image">
                <img src={images[0]} alt="" />
              </figure>
            )}
          </aside>
        )}
      </div>
      {shouldDisplayTags && tags.length > 0 && (
        <ul className="item__tags tags">
          {tags.map((tag, tagIndex) => (
            <Link
              key={tagIndex}
              className="tag"
              to={`/?tag=${tag}`}
            >
              {tag}
            </Link>
          ))}
        </ul>
      )}
    </article>
  );
};

Item.defaultProps = {
  item: {},
  shouldDisplayTags: true,
  isLoading: false,
};

Item.propTypes = {
  className: PropTypes.string,
  item: PropTypes.object.isRequired,
  shouldDisplayTags: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
}

export default Item;
