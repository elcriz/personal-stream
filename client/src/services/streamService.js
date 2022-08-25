import { format, formatDistance } from 'date-fns';
import Item from '../models/Item';

/**
 * Serialize a single item and add a relative date property.
 * @param {object} - Item
 * @returns Object<Item>
 */
function serializeItem({
  createdAt,
  updatedAt,
  ...item
}) {
  const getRelativeDate = timestamp => formatDistance(
    new Date(timestamp),
    new Date(),
    { addSuffix: true },
  );
  return {
    _id: item._id,
    ...new Item(item),
    dates: {
      created: format(new Date(createdAt), 'dd-MM-yyyy HH:mm'),
      updated: format(new Date(updatedAt), 'dd-MM-yyyy HH:mm'),
    },
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
        `/api/stream?${tag ? `tag=${tag}&` : ''}page=${page}&limit=${limit}`,
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
        `/api/stream/item/${id}`,
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
   * Retrieve a single item by its slug.
   * @param {string} slug
   * @returns Promise
   */
  retrieveItemBySlug: async (slug) => {
    try {
      const response = await fetch(
        `/api/stream/item/${slug}`,
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
        `/api/stream/tags`,
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      return await response.json();
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
        `/api/stream/item`,
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
   * Modify an existing item by its id.
   * @param {Object<Item>} body
   * @param {string} id
   * @param {string} _token
   * @returns Promise
   */
  modifyItem: async (body, id, _token) => {
    try {
      const response = await fetch(
        `/api/stream/item/${id}`,
        {
          method: 'PATCH',
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
   * Delete a single item by its id.
   * @param {string} id
   * @returns Promise
   */
  deleteItemById: async (id, _token) => {
    try {
      const response = await fetch(
        `/api/stream/item/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${_token}`,
          },
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
  }
};
