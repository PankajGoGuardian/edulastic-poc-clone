import { get, isEmpty } from "lodash";

export const isFeatureAccessibleToUser = props => {
  // Please do not add more logic to this
  let {
    features,
    inputFeatures = [],
    operation = "AND",
    gradeSubject = { grades: [], subjects: [] },
    groupId,
    groupList
  } = props;
  let featureFlag = null;
  if (typeof inputFeatures === "string") {
    featureFlag = features[inputFeatures] ? true : false;
  } else if (Array.isArray(inputFeatures)) {
    if (operation === "AND") {
      for (let item of inputFeatures) {
        if (!features[item]) {
          featureFlag = false;
          break;
        }
      }
      featureFlag = featureFlag === null && inputFeatures.length > 0 ? true : false;
    } else if (operation === "OR") {
      featureFlag = false;
      for (let item of inputFeatures) {
        if (features[item]) {
          featureFlag = true;
          break;
        }
      }
    }
  }
  let gradeSubjectFlag = false;
  const premiumGradeSubject = get(features, "premiumGradeSubject", undefined);
  if (premiumGradeSubject) {
    gradeSubject = getGradeSubject(groupId, groupList) || gradeSubject;
    const feat = features.premiumGradeSubject.find(
      item => item.grade.toLowerCase() === "all" && item.subject.toLowerCase() === "all"
    );
    const { grades = [], subjects = [] } = gradeSubject;
    if (feat) {
      gradeSubjectFlag = true;
    } else if (!isEmpty(grades) && !isEmpty(subjects)) {
      const gradesIncludesAll = grades.includes("all") || grades.includes("All");
      const subjectsIncludesAll = subjects.includes("all") || subjects.includes("All");
      const feat = features.premiumGradeSubject.find(
        item =>
          (grades.includes(item.grade) || gradesIncludesAll || (item.grade && item.grade.toLowerCase() === "all")) &&
          (subjects.includes(item.subject) ||
            subjectsIncludesAll ||
            (item.subject && item.subject.toLowerCase() === "all"))
      );
      if (feat) {
        gradeSubjectFlag = true;
      }
    }
  }
  return featureFlag || gradeSubjectFlag;
};

const getGradeSubject = (groupId, groupList) => {
  if (groupId) {
    const currentGroup = groupList.filter(group => group._id === groupId);
    if (!isEmpty(currentGroup)) {
      const groupGrades = currentGroup[0].grade;
      const groupSubjects = [currentGroup[0].subject];
      return { grades: groupGrades, subjects: groupSubjects };
    }
  }
};
