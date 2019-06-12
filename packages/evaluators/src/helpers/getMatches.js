import { isEqual, includes, difference, isString } from "lodash";
import { evaluatorTypes } from "@edulastic/constants";

const getMatches = (response, answer, compareFunction) =>
  response.filter((resp, index) => {
    const ans = isString(answer[index]) ? answer[index].trim() : answer[index];
    resp = isString(resp) ? resp.trim() : resp;
    switch (compareFunction) {
      case evaluatorTypes.INNER_DIFFERENCE:
        return difference(answer[index], resp).length === 0 && difference(resp, answer[index]).length === 0;

      case evaluatorTypes.IS_EQUAL:
        if (typeof answer[index] === "object" && answer[index].y) {
          return isEqual({ ...answer[index], y: +answer[index].y.toFixed(5) }, { ...resp, y: +resp.y.toFixed(5) });
        }
        return isEqual(ans, resp);

      default:
        return includes(ans, resp);
    }
  }).length;

export default getMatches;
