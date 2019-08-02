import { useMemo } from "react";
import { augmentStandardMetaInfo, getDomains } from "../utils/transformers";

export const useGetStudentMasteryData = (metricInfo, skillInfo, scaleInfo) =>
  useMemo(() => {
    const standards = augmentStandardMetaInfo(metricInfo, skillInfo, scaleInfo);
    const domains = getDomains(standards, scaleInfo);

    return [standards, domains];
  }, [metricInfo, skillInfo, scaleInfo]);
