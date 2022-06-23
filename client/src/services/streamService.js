import { formatDistance } from 'date-fns';

/**
 * Serialize a single item and add a relative date property.
 * @param {object} - Item
 * @returns Object<Item>
 */
function serializeItem({
  createdAt,
  updatedAt,
  images,
  ...item
}) {
  const getRelativeDate = timestamp => formatDistance(
    new Date(timestamp),
    new Date(),
    { addSuffix: true },
  );
  return {
    ...item,
    images: images.map(url =>
      `${process.env.REACT_APP_API_ENDPOINT}proxy?url=${url}`,
    ),
    relativeDates: {
      created: getRelativeDate(createdAt),
      updated: getRelativeDate(updatedAt),
    },
  };
}

export default {
  /**
   * Retrieve all (paginated) items or any items tagged with a specific tag.
   * @param {number} page
   * @param {number} limit
   * @param {string} tag
   * @returns Promise
   */
  retrieveItems: async (page, limit, tag) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}stream?${tag ? `tag=${tag}&` : ''}page=${page}&limit=${limit}`,
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      const { amount, items } = await response.json();
      return { amount, items: items.map(serializeItem) };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieve a single item by its id.
   * @param {string} id
   * @returns Promise
   */
  retrieveItemById: async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}stream/item/${id}`,
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      const item = await response.json();
      return serializeItem(item);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new item.
   * @param {Object<Item>} body
   * @param {string} _token
   * @returns Promise
   */
  createItem: async (body, _token) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}stream/item`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${_token}`,
          },
          body: JSON.stringify(body),
        },
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      const item = await response.json();
      return serializeItem(item);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieve all tags crrently in items.
   * @returns Promise
   */
  retrieveAllTags: async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}stream/tags`,
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
