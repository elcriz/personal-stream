import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import streamService from 'src/services/streamService';

interface TagsProps {
  className?: string;
  currentTag: string | null;
}

function Tags({ className, currentTag }: TagsProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchTags = () => {
    setIsFetching(true);

    streamService
      .retrieveAllTags()
      .then((retrievedTags) => {
        setIsFetching(false);
        setTags(retrievedTags);
      })
      .catch((error: Error) => {
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
}

export default Tags;
