import { useEffect, useState, FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Canvas from 'src/components/Canvas';
import Field from 'src/components/Field';
import ItemsList from 'src/components/ItemsList';
import useAuth from 'src/hooks/useAuth';
import Item from 'src/models/Item';
import streamService from 'src/services/streamService';

function AddOrModify() {
  const [tags, setTags] = useState<string[]>([]);
  const [item, setItem] = useState<Item>(new Item());
  const [error, setError] = useState('');
  const [isProcessed, setisProcessed] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const auth = useAuth();

  const handleChange = (newValue: string | string[], property: string) => {
    setItem(
      (previous) =>
        new Item({
          ...previous,
          [property]: newValue,
        }),
    );
  };

  const fetchItem = async () => {
    if (id) {
      setError('');
      setIsFetching(true);

      return await streamService
        .retrieveItemById(id)
        .then((retrievedItem) => {
          setIsFetching(false);
          setItem(new Item(retrievedItem));
        })
        .catch(() => {
          setError('Item could not be found.');
          setIsFetching(false);
        });
    }
  };

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (auth.user.token && isValid) {
      setIsSubmitting(true);

      const addOrModify = id
        ? streamService.modifyItem(item, id, auth.user.token)
        : streamService.createItem(item, auth.user.token);

      addOrModify
        .then(() => {
          setIsSubmitting(false);
          setisProcessed(true);
        })
        .catch((error: Error) => {
          console.log(error);
          setIsSubmitting(false);
          setError(`${id ? 'Editing' : 'Adding new'} item failed`);
        });
    }
  };

  useEffect(() => {
    setIsValid(item.isValid() && auth.user.isAllowedToAdd && auth.user.isAllowedToModify);
  }, [item]);

  useEffect(() => {
    if (!id) {
      fetchTags();
      return;
    }
    fetchItem().then(() => {
      fetchTags();
    });
  }, []);

  if (isProcessed) {
    return <Navigate to="/" />;
  }

  return (
    <Canvas size="wide">
      <form
        className="form"
        onSubmit={handleSubmit}
      >
        <h2 className="form__heading">{id ? 'Edit' : 'Add new'} item</h2>
        <Field
          id="title"
          className="form__field"
          type="text"
          label="Title"
          value={item.title}
          placeholder="Item title"
          disabled={isSubmitting}
          onChange={handleChange}
        />
        <Field
          id="body"
          className="form__field"
          type="body"
          label="Body (markdown allowed)"
          value={item.body}
          placeholder="Item body"
          disabled={isSubmitting}
          onChange={handleChange}
        >
          <div className="form__preview">
            <ReactMarkdown>{item.body || 'Preview comes here...'}</ReactMarkdown>
          </div>
        </Field>
        {!isFetching && (
          <>
            <ItemsList
              id="tags"
              label="Tags"
              singleItemLabel="tag"
              options={tags}
              defaultValues={id ? item.tags : ['']}
              disabled={isSubmitting}
              onChange={handleChange}
            />
            <ItemsList
              id="images"
              label="Images"
              singleItemLabel="image"
              defaultValues={item.images.length > 0 ? item.images : ['']}
              disabled={isSubmitting}
              onChange={handleChange}
            />
            <ItemsList
              id="videos"
              label="YouTube video IDs"
              singleItemLabel="video"
              defaultValues={item.videos.length > 0 ? item.videos : ['']}
              disabled={isSubmitting}
              onChange={handleChange}
            />
          </>
        )}
        <Field
          id="mediaPosition"
          label="Media position"
          type="radio"
          options={['Top', 'Bottom']}
          value={item.mediaPosition}
          disabled={isSubmitting}
          onChange={(newValue, property) => {
            handleChange(newValue.toLowerCase(), property);
          }}
        />
        <div className="form__buttons">
          <button
            className="button"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            {id ? 'Edit' : 'Add'} item
          </button>
          {id && (
            <button
              className="button button--secondary"
              type="button"
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </button>
          )}
        </div>
        {error && <div className="form__error error">{error}</div>}
      </form>
    </Canvas>
  );
}

export default AddOrModify;
