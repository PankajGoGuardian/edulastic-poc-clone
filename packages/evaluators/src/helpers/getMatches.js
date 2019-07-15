import { isEqual, includes, difference, isString } from "lodash";
import { evaluatorTypes } from "@edulastic/constants";

const getMatches = (response, answer, compareFunction) => {
  return response.filter((resp, index) => {
    const singleAns = isString(answer[index]) ? answer[index].trim() : answer[index];
    const arrayAns = answer.map(ans => (isString(ans) ? ans.trim() : ans));
    resp = isString(resp) ? resp.trim() : resp;
    switch (compareFunction) {
      case evaluatorTypes.INNER_DIFFERENCE:
        return difference(answer[index], resp).length === 0 && difference(resp, answer[index]).length === 0;

      case evaluatorTypes.IS_EQUAL:
        if (answer[index] && typeof answer[index] === "object" && answer[index].y) {
          return isEqual({ ...answer[index], y: +answer[index].y.toFixed(5) }, { ...resp, y: +resp.y.toFixed(5) });
        }
        return isEqual(singleAns, resp);

      default:
        return includes(arrayAns, resp);
    }
  }).length;
};

export default getMatches;
