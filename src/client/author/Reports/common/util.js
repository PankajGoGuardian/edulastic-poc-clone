import { partialRight, ceil, groupBy, sumBy } from "lodash";

export const percentage = (numerator, denominator, ceilCalculation = false) => {
  const calculatedPercentage = (numerator / denominator) * 100;
  return ceilCalculation ? ceil(calculatedPercentage) : calculatedPercentage;
};

export const ceilingPercentage = partialRight(percentage, true);

export const getVariance = arr => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += Number(arr[i]);
  }
  let mean = sum / arr.length;

  sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += Math.pow(arr[i] - mean, 2);
  }

  let variance = Number((sum / arr.length).toFixed(2));
  return variance;
};
export const getStandardDeviation = variance => {
  return Number(Math.sqrt(variance, 2).toFixed(2));
};

export const getHSLFromRange1 = (val, light = 79) => {
  return `hsla(${val}, 100%, ${light}%, 1)`;
};

export const getHSLFromRange2 = (val, light = 48) => {
  let tmp = val / 2;
  return getHSLFromRange1(tmp, light);
};

export const isMobileScreen = () => {
  return window.matchMedia("only screen and (max-width: 1033px) and (min-width : 1px)").matches;
};

export const getNavigationTabLinks = (list, id) => {
  for (let item of list) {
    item.location += id;
  }
};

export const getDropDownTestIds = arr => {
  let sortedArr = [...arr];
  sortedArr.sort((a, b) => {
    return a - b;
  });

  let _arr = sortedArr.map((data, index) => {
    return { key: data.testId, title: data.testName };
  });

  return _arr;
};

export const filterData = (data, filter) => {
  let filteredData = data.filter((item, index) => {
    if (
      (item.gender.toLowerCase() === filter.gender.toLowerCase() || filter.gender === "all") &&
      (item.frlStatus.toLowerCase() === filter.frlStatus.toLowerCase() || filter.frlStatus === "all") &&
      (item.ellStatus.toLowerCase() === filter.ellStatus.toLowerCase() || filter.ellStatus === "all") &&
      (item.iepStatus.toLowerCase() === filter.iepStatus.toLowerCase() || filter.iepStatus === "all") &&
      (item.race.toLowerCase() === filter.race.toLowerCase() || filter.race === "all")
    ) {
      return true;
    }
    return false;
  });
  return filteredData;
};

export const processGroupIds = orgDataArr => {
  let byGroupId = groupBy(orgDataArr.filter((item, index) => (item.groupId ? true : false)), "groupId");
  let groupIdArr = Object.keys(byGroupId).map((item, index) => {
    return {
      key: byGroupId[item][0].groupId,
      title: byGroupId[item][0].groupName
    };
  });
  groupIdArr.unshift({
    key: "All",
    title: "All Classes"
  });

  return groupIdArr;
};

export const processSchoolIds = orgDataArr => {
  let bySchoolId = groupBy(orgDataArr.filter((item, index) => (item.schoolId ? true : false)), "schoolId");
  let schoolIdArr = Object.keys(bySchoolId).map((item, index) => {
    return {
      key: bySchoolId[item][0].schoolId,
      title: bySchoolId[item][0].schoolName
    };
  });
  schoolIdArr.unshift({
    key: "All",
    title: "All Schools"
  });

  return schoolIdArr;
};

export const processTeacherIds = orgDataArr => {
  let byTeacherId = groupBy(orgDataArr.filter((item, index) => (item.teacherId ? true : false)), "teacherId");
  let teacherIdArr = Object.keys(byTeacherId).map((item, index) => {
    return {
      key: byTeacherId[item][0].teacherId,
      title: byTeacherId[item][0].teacherName
    };
  });
  teacherIdArr.unshift({
    key: "All",
    title: "All Teachers"
  });

  return teacherIdArr;
};

export const getOverallScore = (metrics = []) =>
  ceilingPercentage(sumBy(metrics, "totalScore"), sumBy(metrics, "maxScore"));
