import { FractionDigits } from "./constants";

class LogarithmFunction {
  constructor(points) {
    this.startX = +points.startX;
    this.startY = +points.startY;
    this.endX = +points.endX;
    this.endY = +points.endY;
  }

  getBC() {
    const b = this.endY - this.startY;
    const c = this.endX - this.startX >= 0 ? this.endX - this.startX : 1 / (this.startX - this.endX);

    return (b / c).toFixed(FractionDigits);
  }
}

export default LogarithmFunction;
