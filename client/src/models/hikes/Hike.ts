export interface HikeModel {
  dateTime: string;
  location: string;
  distance: number;
  elevationGain: number;
  durationMoving: number;
  durationStopped: number;
  speedMoving: number;
  speedOverall: number;
  isValid: () => boolean;
}

class Hike implements HikeModel {
  dateTime;
  location;
  distance;
  elevationGain;
  durationMoving;
  durationStopped;
  speedMoving;
  speedOverall;

  constructor(
    {
      dateTime,
      location,
      distance,
      elevationGain,
      durationMoving,
      durationStopped,
      speedMoving,
      speedOverall,
    } = {} as HikeModel,
  ) {
    this.dateTime = dateTime || `${new Date().toJSON().slice(0, 10)}T00:00+01:00`;
    this.location = location || '';
    this.distance = distance;
    this.elevationGain = elevationGain;
    this.durationMoving = durationMoving;
    this.durationStopped = durationStopped;
    this.speedMoving = speedMoving;
    this.speedOverall = speedOverall;
  }

  isValid() {
    return (
      !!this.dateTime &&
      !!this.location &&
      this.distance !== undefined &&
      !isNaN(Number(this.distance)) &&
      this.durationMoving !== undefined &&
      !isNaN(Number(this.durationMoving)) &&
      this.durationStopped !== undefined &&
      !isNaN(Number(this.durationStopped)) &&
      this.speedMoving !== undefined &&
      !isNaN(Number(this.speedMoving)) &&
      this.speedOverall !== undefined &&
      !isNaN(Number(this.speedOverall))
    );
  }
}

export default Hike;
