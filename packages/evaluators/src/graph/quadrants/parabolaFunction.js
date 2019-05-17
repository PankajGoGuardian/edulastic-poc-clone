import { FractionDigits } from "./constants";

class ParabolaFunction {
  constructor(points) {
    this.startX = +points.startX;
    this.startY = +points.startY;
    this.endX = +points.endX;
    this.endY = +points.endY;
  }

  getKoefA() {
    return ((this.endY - this.startY) / ((this.endX - this.startX) * (this.endX - this.startX))).toFixed(
      FractionDigits
    );
  }

  getDirection() {
    const comp = (this.endY - this.startY) * (this.endX - this.startX);
    return comp > 0 ? 1 : comp < 0 ? -1 : 0;
  }
}

export default ParabolaFunction;
