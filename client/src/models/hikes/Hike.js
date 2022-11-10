class Hike {
  constructor({
    dateTime,
    location,
    distance,
    elevationGain,
    durationMoving,
    durationStopped,
    speedMoving,
    speedOverall,
  } = {}) {
    this.dateTime = dateTime || `${new Date().toJSON().slice(0, 10)}T00:00+01:00`;
    this.location = location || '';
    this.distance = distance || 0;
    this.elevationGain = elevationGain || 0;
    this.durationMoving = durationMoving || 0;
    this.durationStopped = durationStopped || 0;
    this.speedMoving = speedMoving || 0;
    this.speedOverall = speedOverall || 0;
  }

  isValid() {
    return !!this.dateTime
      && !!this.location
      && this.distance !== undefined
      && this.durationMoving !== undefined
      && this.speedMoving !== undefined
      && this.speedOverall !== undefined
  }
}

export default Hike;
