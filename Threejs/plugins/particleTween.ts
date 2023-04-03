import { Vector3 } from "three";
export class Tween implements ParticleTween {
  times: number[];
  values: THREE.Vector3 | number[];
  constructor(timeArray = [], valueArray = []) {
    this.times = timeArray || [];
    this.values = valueArray || [];
  }
  lerp(t: number) {
    var i = 0;
    var n = this.times.length;
    while (i < n && t > this.times[i]) {
      i++;
    }
    if (i == 0) {
      return this.values[0];
    }
    if (i == n) {
      return this.values[n - 1];
    }
    var p = (t - this.times[i - 1]) / (this.times[i] - this.times[i - 1]);
    if (this.values[0] instanceof Vector3) {
      return this.values[i - 1].clone().lerp(this.values[i], p);
    } // its a float
    else {
      return this.values[i - 1] + p * (this.values[i] - this.values[i - 1]);
    }
  }
}
