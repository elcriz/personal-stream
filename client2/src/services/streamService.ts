import { getReadableDate, getRelativeDate } from 'src/helpers/dateTimeHelper';
import Item, { ItemModel } from 'src/models/Item';

type IItemDates = {
  created: string;
  updated: string;
};

interface IItem extends ItemModel {
  _id: string;
  createdAt: string;
  updatedAt: string;
  dates: IItemDates;
  relativeDates: IItemDates;
}

export type ISerializedItem = Omit<IItem, 'createdAt' | 'updatedAt' | 'isValid'>;

/**
 * Serialize a single item and add a relative date property.
 */
function serializeItem({ createdAt, updatedAt, ...item }: IItem): ISerializedItem {
  return {
    _id: item._id,
    ...new Item(item),
    dates: {
      created: getReadableDate(createdAt),
      updated: getReadableDate(updatedAt),
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
   */
  retrieveItems: async (
    page: number,
    limit: number,
    tag: string | null,
  ): Promise<{
    amount: number;
    items: Array<ISerializedItem>;
  }> => {
    const response = await fetch(
      `/api/stream?${tag ? `tag=${tag}&` : ''}page=${page}&limit=${limit}`,
    );
    if (!response.ok) {
      throw response.status;
    }
    const { amount, items } = await response.json();
    return { amount, items: items.map(serializeItem) };
  },

  /**
   * Retrieve a single item by its id.
   */
  retrieveItemById: async (id: string) => {
    const response = await fetch(`/api/stream/item/${id}`);
    if (!response.ok) {
      throw response.status;
    }
    const item = await response.json();
    return serializeItem(item);
  },

  /**
   * Retrieve a single item by its slug.
   */
  retrieveItemBySlug: async (slug: string): Promise<ISerializedItem> => {
    const response = await fetch(`/api/stream/item/${slug}`);
    if (!response.ok) {
      throw response.status;
    }
    const item = await response.json();
    return serializeItem(item);
  },

  /**
   * Retrieve all tags currently in items.
   */
  retrieveAllTags: async (): Promise<string[]> => {
    const response = await fetch(`/api/stream/tags`);
    if (!response.ok) {
      throw response.status;
    }
    return await response.json();
  },

  /**
   * Create a new item.
   */
  createItem: async (body: ItemModel, _token: string): Promise<ISerializedItem> => {
    const response = await fetch(`/api/stream/item`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw response.status;
    }
    const item = await response.json();
    return serializeItem(item);
  },

  /**
   * Modify an existing item by its id.
   */
  modifyItem: async (body: ItemModel, id: string, _token: string): Promise<ISerializedItem> => {
    const response = await fetch(`/api/stream/item/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw response.status;
    }
    const item = await response.json();
    return serializeItem(item);
  },

  /**
   * Delete a single item by its id.
   */
  deleteItemById: async (id: string, _token: string): Promise<ISerializedItem> => {
    const response = await fetch(`/api/stream/item/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${_token}`,
      },
    });
    if (!response.ok) {
      throw response.status;
    }
    const item = await response.json();
    return serializeItem(item);
  },
};
