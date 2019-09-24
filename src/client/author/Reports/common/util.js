import { partialRight, ceil, groupBy, sumBy, includes, filter, map, orderBy, round, find, indexOf } from "lodash";
import next from "immer";

export const testTypeHashMap = {
  common: "common",
  class: "class",
  "common assessment": "common",
  assessment: "class"
};

export const percentage = (numerator, denominator, ceilCalculation = false) => {
  if (numerator == 0 && denominator == 0) {
    return 0;
  }

  const calculatedPercentage = (numerator / denominator) * 100;
  return ceilCalculation ? ceil(calculatedPercentage) : calculatedPercentage;
};

export const ceilingPercentage = partialRight(percentage, true);

export const stringCompare = (a_string = "", b_string = "") =>
  (a_string || "").toLowerCase().localeCompare((b_string || "").toLowerCase());

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
  ceilingPercentage(
    sumBy(metrics, item => parseFloat(item.totalScore)),
    sumBy(metrics, item => parseFloat(item.maxScore))
  );

export const filterAccordingToRole = (columns, role) =>
  filter(columns, column => !includes(column.hiddenFromRole, role));

export const addColors = (data = [], selectedData, xDataKey, scoreKey = "avgScore") => {
  return map(data, item =>
    next(item, draft => {
      draft.fill =
        includes(selectedData, item[xDataKey]) || !selectedData.length ? getHSLFromRange1(item[scoreKey]) : "#cccccc";
    })
  );
};

export const getLeastProficiencyBand = (bandInfo = []) =>
  orderBy(bandInfo, "threshold", ["desc"])[bandInfo.length - 1] || {};

export const getProficiencyBand = (score, bandInfo, field = "threshold") => {
  const bandInfoWithColor = map(orderBy(bandInfo, "threshold"), (band, index) => {
    return {
      ...band,
      color: band.color ? band.color : getHSLFromRange1(round((100 / (bandInfo.length - 1)) * index))
    };
  });
  const orderedScaleInfo = orderBy(bandInfoWithColor, "threshold", ["desc"]);
  return find(orderedScaleInfo, info => ceil(score) >= info[field]) || getLeastProficiencyBand(orderedScaleInfo);
};

export const toggleItem = (items, item) =>
  next(items, draftState => {
    let index = indexOf(items, item);
    if (-1 < index) {
      draftState.splice(index, 1);
    } else {
      draftState.push(item);
    }
  });

export const convertTableToCSV = refComponent => {
  const rows = refComponent.querySelectorAll("tr");
  let csv = [];
  let csvRawData = [];
  for (let i = 0; i < rows.length; i++) {
    let row = [],
      cols = rows[i].querySelectorAll("td, th");
    for (let j = 0; j < cols.length; j++) {
      let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, " ").replace(/(\s+)/gm, " ");
      data = data.replace(/"/g, '""');
      row.push('"' + data + '"');
    }
    csv.push(row.join(","));
    csvRawData.push(row);
  }
  return {
    csvText: csv.join("\n"),
    csvRawData
  };
};

export const downloadCSV = (filename, data) => {
  let link = document.createElement("a");
  link.style.display = "none";
  link.setAttribute("target", "_blank");
  link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(data));
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
