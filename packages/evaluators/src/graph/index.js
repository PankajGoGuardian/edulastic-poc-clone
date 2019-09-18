import { GraphTypes } from "./constants";
import quadrantsEvaluator from "./quadrants";
import axisLabelsEvaluator from "./axisLabels";
import axisSegmentsEvaluator from "./axisSegments";

const evaluator = async ({ userResponse = [], validation }) => {
  const { graphType } = validation;

  switch (graphType) {
    case GraphTypes.AXIS_LABELS:
      return axisLabelsEvaluator({ userResponse, validation });
    case GraphTypes.AXIS_SEGMENTS:
      return axisSegmentsEvaluator({ userResponse, validation });
    case GraphTypes.QUADRANTS:
    case GraphTypes.FIRST_QUADRANT:
    default:
      return await quadrantsEvaluator({ userResponse, validation });
  }
};

export default evaluator;
