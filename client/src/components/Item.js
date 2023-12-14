import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import useAuth from 'hooks/useAuth';
import streamService from 'services/streamService';
import Media from 'components/Media';

const Item = ({ className, item, shouldRenderOptions, isLoading }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const { _id, title, slug, body, tags, dates, relativeDates, hasMedia, mediaPosition, ...media } =
    item;
  const auth = useAuth();

  const handleDelete = (event) => {
    event.preventDefault();

    if (window.confirm('Do you really want to delete this item?')) {
      setIsFetching(true);

      streamService
        .deleteItemById(_id, auth.user.token)
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
    return <Navigate to="/" />;
  }

  return (
    <article
      className={classnames('item', className, {
        'is-loading': isLoading || isFetching,
      })}
    >
      <header>
        <h2>
          <Link to={`/${slug}`}>{title}</Link>
        </h2>
        <div className="item__meta">
          <div
            className="item__timestamp"
            title={dates.created}
          >
            {relativeDates.created}
          </div>
        </div>
      </header>
      <div
        className={classnames('item__body', {
          'item__body--media-at-bottom': hasMedia && mediaPosition === 'bottom',
        })}
      >
        {body && (
          <div>
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>
        )}
        {hasMedia && (
          <Media
            className="item__media"
            {...media}
          />
        )}
      </div>
      {shouldRenderOptions && tags.length > 0 && (
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
      {shouldRenderOptions && auth.user.isAllowedToModify && (
        <ul className="item__actions">
          <li>
            <Link
              className="link"
              to={`/modify/${_id}`}
            >
              Edit
            </Link>
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
  shouldRenderOptions: true,
  isLoading: false,
};

Item.propTypes = {
  className: PropTypes.string,
  item: PropTypes.object.isRequired,
  shouldRenderOptions: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
};

export default Item;
