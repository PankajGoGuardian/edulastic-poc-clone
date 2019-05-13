import { FractionDigits } from "./constants";

class PolynomFunction {
  constructor(points) {
    this.points = points;
  }

  getYbyX(x) {
    let result = 0;
    for (let i = 0; i < this.points.length; i++) {
      let li = 1;
      for (let j = 0; j < this.points.length; j++) {
        if (i !== j) {
          li *= (x - this.points[j].x) / (this.points[i].x - this.points[j].x);
        }
      }
      result += this.points[i].y * li;
    }

    return result.toFixed(FractionDigits);
  }
}

export default PolynomFunction;
