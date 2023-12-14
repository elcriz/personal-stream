import { getHoursFromMinutes, getReadableDate, getRelativeDate } from 'src/helpers/dateTimeHelper';
import Hike, { HikeModel } from 'src/models/hikes/Hike';

interface IHike extends HikeModel {
  _id: string;
  createdAt: string;
  updatedAt: string;
  duration: {
    moving: number;
    stopped: number;
  };
  speed: {
    moving: number;
    overall: number;
  };
}

export interface ISerializedHike
  extends Omit<IHike, 'isValid' | 'createdAt' | 'updatedAt' | 'duration' | 'speed'> {
  dates: {
    hiked: string;
    created: string;
    updated: string;
  };
  relativeDates: {
    hiked: string;
    created: string;
    updated: string;
  };
  hours: {
    moved: string;
    stopped: string;
  };
}

function serializeHikeToPlatform({
  createdAt,
  updatedAt,
  duration,
  speed,
  ...hike
}: IHike): ISerializedHike {
  return {
    _id: hike._id,
    ...new Hike({
      ...hike,
      durationMoving: duration.moving,
      durationStopped: duration.stopped,
      speedMoving: speed.moving,
      speedOverall: speed.overall,
    }),
    dates: {
      hiked: getReadableDate(hike.dateTime),
      created: getReadableDate(createdAt),
      updated: getReadableDate(updatedAt),
    },
    relativeDates: {
      hiked: getRelativeDate(hike.dateTime),
      created: getRelativeDate(createdAt),
      updated: getRelativeDate(updatedAt),
    },
    hours: {
      moved: getHoursFromMinutes(duration.moving),
      stopped: getHoursFromMinutes(duration.stopped),
    },
  };
}

function serializeHikeToApi({
  distance = 0,
  elevationGain = 0,
  durationMoving = 0,
  durationStopped = 0,
  speedMoving = 0,
  speedOverall = 0,
  ...hike
}): HikeModel {
  return new Hike({
    ...hike,
    distance,
    elevationGain,
    durationMoving,
    durationStopped,
    speedMoving,
    speedOverall,
  } as HikeModel);
}

export default {
  /**
   * Retrieve hikes.
   */
  retrieveHikes: async (
    _token: string,
    period: number[],
    sortBy: string,
    isAscending = false,
  ): Promise<{
    filteredAmount: number;
    amount: number;
    totals: number;
    hikes: ISerializedHike[];
  }> => {
    let params = `?sortBy=${sortBy}&order=${isAscending ? 'asc' : 'desc'}&year=${period[0]}`;
    if (period.length > 1) {
      params += `&month=${period[1] + 1}`;
    }
    const response = await fetch(`/api/hikes${params}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${_token}`,
      },
    });
    if (!response.ok) {
      throw response.status;
    }
    const { hikes, ...data } = await response.json();
    return { ...data, hikes: hikes.map(serializeHikeToPlatform) };
  },

  /**
   * Create a new hike.
   * @param {Object<Item>} body
   * @param {string} _token
   * @returns Promise
   */
  createHike: async (body: HikeModel, _token: string): Promise<ISerializedHike> => {
    const response = await fetch('/api/hikes', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify(serializeHikeToApi(body)),
    });
    if (!response.ok) {
      throw response.status;
    }
    const hike: IHike = await response.json();
    return serializeHikeToPlatform(hike);
  },
};
