import { map, forEach, find } from "lodash";
import next from "immer";
import { getProficiencyBand } from "../../common/utils/trend";

export const augmentWithBand = (metricInfo = [], bandInfo = []) =>
  map(metricInfo, metric => {
    return next(metric, draftMetric => {
      forEach(draftMetric.tests, (test, testId) => {
        draftMetric.tests[testId].proficiencyBand = getProficiencyBand(test.score, bandInfo);
      });
    });
  });

export const augmentWithStudentInfo = (metricInfo = [], orgData = []) =>
  map(metricInfo, student => {
    // get the related organisation
    const relatedOrg = find(orgData, org => org.groupId === student.groupId) || {};
    const { groupName = "N/A", schoolName = "N/A", teacherName = "N/A" } = relatedOrg;
    return { ...student, groupName, schoolName, teacherName };
  });
