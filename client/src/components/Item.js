import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Navigate } from 'react-router-dom';
import classnames from 'classnames';
import ReactMarkdown from 'react-markdown';
import streamService from '../services/streamService';
import useAuth from '../hooks/useAuth';

const Item = ({
  className,
  item,
  shouldDisplayTags,
  isLoading,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const { _id, title, body, tags, relativeDates, images, videos } = item;
  const hasMedia = images.length > 0 || videos.length > 0;
  const auth = useAuth();

  const handleDelete = (event) => {
    event.preventDefault();
    if (window.confirm('Do you really want to delete this item?')) {
      setIsFetching(true);

      streamService.deleteItemById(_id)
        .then(() => {
          setIsFetching(false);
          setIsDeleted(true);
        })
        .catch((error) => {
          setIsFetching(false);
          console.error(error);
        });
    }
  };

  if (isDeleted) {
    return (
      <Navigate to="/" />
    );
  }

  return (
    <article
      className={classnames('item', className, {
        'is-loading': isLoading || isFetching,
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
      {auth.user.isAllowedToModify && (
        <ul className="item__actions">
          <li>
            <Link className="link" to={`/modify/${_id}`}>Edit</Link>
            </li>
          <li>
            <button
              className="link"
              type="button"
              disabled={isFetching}
              onClick={handleDelete}
            >
              Delete
            </button>
          </li>
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
