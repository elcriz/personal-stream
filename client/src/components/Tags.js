import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import streamService from 'services/streamService';

const Tags = ({ className, currentTag }) => {
  const [tags, setTags] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchTags = () => {
    setIsFetching(true);

    streamService
      .retrieveAllTags()
      .then((data) => {
        setIsFetching(false);
        setTags(data);
      })
      .catch((error) => {
        setIsFetching(false);
        console.error(error);
      });
  };

  useEffect(() => {
    fetchTags();
  }, []);

  if (tags.length === 0) {
    return null;
  }

  return (
    <nav
      className={classNames(className, 'tags', {
        'is-loading': isFetching,
      })}
    >
      <Link
        className={classNames('tag', {
          'is-current': currentTag === null,
        })}
        to="/"
      >
        All
      </Link>
      {tags.map((tag, tagIndex) => (
        <Link
          key={tagIndex}
          className={classNames('tag', {
            'is-current': tag === currentTag,
          })}
          to={`/?tag=${tag}`}
        >
          {tag}
        </Link>
      ))}
    </nav>
  );
};

Tags.propTypes = {
  className: PropTypes.string,
  currentTag: PropTypes.string,
};

export default Tags;
