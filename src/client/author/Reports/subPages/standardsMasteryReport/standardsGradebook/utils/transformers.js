import { groupBy, keyBy, isEmpty, get, values, round, sumBy, orderBy } from "lodash";
import { getProficiencyBand } from "../../../../common/util";
import { white } from "@edulastic/colors";

export const idToLabel = {
  standardId: "standard",
  schoolId: "schoolName",
  studentId: "studentName",
  groupId: "className",
  teacherId: "teacherName",
  race: "race",
  gender: "gender",
  frlStatus: "frlStatus",
  ellStatus: "ellStatus",
  iepStatus: "iepStatus"
};

export const idToName = {
  standardId: "Standard",
  schoolId: "School",
  studentId: "Student",
  groupId: "Class",
  teacherId: "Teacher",
  race: "Race",
  gender: "Gender",
  frlStatus: "FRL Status",
  ellStatus: "ELL Status",
  iepStatus: "IEP Status"
};

export const analyseByToName = {
  "score(%)": "Score (%)",
  rawScore: "Raw Score",
  masteryLevel: "Mastery Level",
  masteryScore: "Mastery Score"
};

export const analyseByToKeyToRender = {
  "score(%)": "scorePercent",
  rawScore: "rawScore",
  masteryLevel: "masteryLevel",
  masteryScore: "fm"
};

const getFormattedName = name => {
  const nameArr = (name || "").trim().split(" ");
  const lName = nameArr.splice(nameArr.length - 1)[0];
  return nameArr.length ? lName + ", " + nameArr.join(" ") : lName;
};

export const getFilterDropDownData = (arr, role) => {
  let schoolGrp, teacherGrp, groupGrp;
  let schoolArr, teacherArr, groupArr;
  let keyArr;
  if (role !== "teacher") {
    schoolGrp = groupBy(arr.filter(item => (item.schoolId ? true : false)), "schoolId");
    teacherGrp = groupBy(arr.filter(item => (item.teacherId ? true : false)), "teacherId");

    keyArr = Object.keys(schoolGrp);
    schoolArr = keyArr.map(item => {
      return { key: item, title: schoolGrp[item][0].schoolName };
    });
    schoolArr.unshift({
      key: "all",
      title: "All"
    });

    keyArr = Object.keys(teacherGrp);
    teacherArr = keyArr.map((item, index) => {
      return { key: item, title: teacherGrp[item][0].teacherName };
    });
    teacherArr.unshift({
      key: "all",
      title: "All"
    });
  }
  groupGrp = groupBy(arr.filter((item, index) => (item.groupId ? true : false)), "groupId");
  keyArr = Object.keys(groupGrp);
  groupArr = keyArr.map((item, index) => {
    return { key: item, title: groupGrp[item][0].className };
  });
  groupArr.unshift({
    key: "all",
    title: "All"
  });

  if (role !== "teacher") {
    return [
      {
        key: "schoolId",
        title: "School",
        data: schoolArr
      },
      {
        key: "teacherId",
        title: "Teacher",
        data: teacherArr
      },
      {
        key: "groupId",
        title: "Class",
        data: groupArr
      }
    ];
  } else {
    return [
      {
        key: "groupId",
        title: "Class",
        data: groupArr
      }
    ];
  }
};

export const getMasteryDropDown = masteryScale => {
  let arr = [];
  if (Array.isArray(masteryScale)) {
    for (let item of masteryScale) {
      arr.push({
        key: item.masteryName,
        title: item.masteryName
      });
    }
  }
  arr.unshift({
    key: "all",
    title: "All"
  });
  return arr;
};

export const getDenormalizedData = rawData => {
  if (isEmpty(rawData)) {
    return [];
  }

  let rawSkillinfo = get(rawData, "data.result.skillInfo", []);
  let skillInfoMap = keyBy(rawSkillinfo.filter((item, index) => (item.standardId ? true : false)), "standardId");

  let rawStudInfo = get(rawData, "data.result.studInfo", []);
  let studInfoMap = keyBy(rawStudInfo, "studentId");

  let rawMetricInfo = get(rawData, "data.result.metricInfo", []);
  let enhancedRawMetricInfo = rawMetricInfo
    .filter(item => skillInfoMap[item.standardId])
    .map((item, index) => {
      let obj = {
        ...item
      };
      if (studInfoMap[item.studentId]) {
        obj = {
          ...obj,
          ...studInfoMap[item.studentId],
          [idToLabel.studentId]: getFormattedName(
            `${studInfoMap[item.studentId].firstName || ""} ${studInfoMap[item.studentId].lastName || ""}`
          ),
          groupIds: studInfoMap[item.studentId].groupIds.split(",")
        };
        let groupIdsMap = keyBy(obj.groupIds);
        let uniqueGroupIds = values(groupIdsMap);
        obj.groupIds = uniqueGroupIds;
      }
      if (skillInfoMap[item.standardId]) {
        obj = {
          ...obj,
          ...skillInfoMap[item.standardId]
        };
      }
      return obj;
    });

  let denormalizedEnhancedRawMetricInfo = [];
  enhancedRawMetricInfo
    .filter(i => i.groupIds)
    .map((item, index) => {
      item.groupIds.map((_item, index) => {
        let obj = {
          ...item,
          groupId: _item
        };
        denormalizedEnhancedRawMetricInfo.push(obj);
      });
    });

  let rawTeacherInfo = get(rawData, "data.result.teacherInfo", []);
  let teacherInfoMap = keyBy(rawTeacherInfo, "groupId");

  let finalDenormalizedData = denormalizedEnhancedRawMetricInfo.map((item, index) => {
    let obj = {
      ...item
    };
    if (teacherInfoMap[item.groupId]) {
      obj = {
        ...obj,
        ...teacherInfoMap[item.groupId]
      };
    }
    return obj;
  });

  return finalDenormalizedData;
};

export const getFilteredDenormalizedData = (denormalizedData, filters, role) => {
  let filteredDenormalizedData = denormalizedData.filter((item, index) => {
    let schoolIdFlag;
    let teacherIdFlag;
    if (role !== "teacher") {
      schoolIdFlag = item.schoolId === filters.schoolId || filters.schoolId === "all" ? true : false;
      teacherIdFlag = item.teacherId === filters.teacherId || filters.teacherId === "all" ? true : false;
    }
    let groupIdFlag = item.groupId === filters.groupId || filters.groupId === "all" ? true : false;
    let genderFlag = item.gender === filters.gender || filters.gender === "all" ? true : false;
    let frlStatusFlag = item.frlStatus === filters.frlStatus || filters.frlStatus === "all" ? true : false;
    let ellStatusFlag = item.ellStatus === filters.ellStatus || filters.ellStatus === "all" ? true : false;
    let iepStatusFlag = item.iepStatus === filters.iepStatus || filters.iepStatus === "all" ? true : false;
    let raceFlag = item.race === filters.race || filters.race === "all" ? true : false;

    if (
      role === "teacher" &&
      groupIdFlag &&
      genderFlag &&
      frlStatusFlag &&
      ellStatusFlag &&
      iepStatusFlag &&
      raceFlag
    ) {
      return true;
    }
    if (
      role !== "teacher" &&
      schoolIdFlag &&
      teacherIdFlag &&
      groupIdFlag &&
      genderFlag &&
      frlStatusFlag &&
      ellStatusFlag &&
      iepStatusFlag &&
      raceFlag
    ) {
      return true;
    }
    return false;
  });
  return filteredDenormalizedData
    .sort((a, b) => a.standard.localeCompare(b.standard))
    .sort((a, b) => a[idToLabel.studentId].toLowerCase().localeCompare(b[idToLabel.studentId].toLowerCase()));
};

export const getChartData = (filteredDenormalizedData, masteryScale, filters, role) => {
  if (isEmpty(filteredDenormalizedData) || isEmpty(masteryScale) || isEmpty(filters)) {
    return [];
  }

  let groupedStandardIds = groupBy(filteredDenormalizedData, "standardId");

  let keysArr = Object.keys(groupedStandardIds);

  const masteryMap = keyBy(masteryScale, "score");
  const masteryCountHelper = {};

  for (let item of masteryScale) {
    masteryCountHelper[item.score] = 0;
  }

  let arr = keysArr.map((item, index) => {
    let obj = {};
    let totalStudents = groupedStandardIds[item].length;
    let tempMasteryCountHelper = { ...masteryCountHelper };

    for (let _item of groupedStandardIds[item]) {
      if (tempMasteryCountHelper[Math.round(_item.fm)]) {
        tempMasteryCountHelper[Math.round(_item.fm)]++;
      } else {
        tempMasteryCountHelper[Math.round(_item.fm)] = 1;
      }
    }

    obj.totalStudents = totalStudents;
    obj.standardId = item;
    obj.standard = groupedStandardIds[item][0].standard;
    obj.standardName = groupedStandardIds[item][0].standardName;

    let masteryLabelInfo = {};

    Object.keys(tempMasteryCountHelper).map(item => {
      if (masteryMap[item]) {
        let masteryPercentage = round((tempMasteryCountHelper[item] / totalStudents) * 100);
        masteryLabelInfo[masteryMap[item].masteryLabel] = masteryMap[item].masteryName;
        if (item == 1) {
          obj[masteryMap[item].masteryLabel] = -masteryPercentage;
        } else {
          obj[masteryMap[item].masteryLabel] = masteryPercentage;
        }
      }
    });
    obj.masteryLabelInfo = masteryLabelInfo;

    return obj;
  });

  return arr;
};

const getAnalysedData = (groupedData, compareBy, masteryScale) => {
  const arr = Object.keys(groupedData).map(item => {
    let _item = groupedData[item].reduce(
      (total, currentValue) => {
        let { maxScore = 0, totalScore = 0, fm = 0 } = currentValue;
        return {
          totalMaxScore: (total.totalMaxScore += maxScore),
          totalTotalScore: (total.totalTotalScore += totalScore),
          totalFinalMastery: (total.totalFinalMastery += fm)
        };
      },
      { totalMaxScore: 0, totalTotalScore: 0, totalFinalMastery: 0 }
    );
    
    let scorePercentUnrounded = (_item.totalTotalScore / _item.totalMaxScore) * 100;
    scorePercentUnrounded = !isNaN(scorePercentUnrounded) ? scorePercentUnrounded : 0;

    let rawScoreUnrounded = _item.totalTotalScore || 0;

    let fmUnrounded = _item.totalFinalMastery / groupedData[item].length;
    fmUnrounded = !isNaN(fmUnrounded) ? fmUnrounded : 0;
    let fm = fmUnrounded ? Number(fmUnrounded.toFixed(2)) : 0;

    const { masteryLevel = "N/A", masteryName = "N/A", color = white } = fm
      ? getProficiencyBand(Math.round(fm), masteryScale, "score")
      : {};

    let groupedStandardIds = groupBy(groupedData[item], "standardId");

    let standardsInfo = Object.keys(groupedStandardIds).map((__item, index) => {
      let ___item = groupedStandardIds[__item].reduce(
        (total, currentValue) => {
          let { maxScore = 0, totalScore = 0, fm = 0 } = currentValue;
          return {
            totalMaxScore: (total.totalMaxScore += maxScore),
            totalTotalScore: (total.totalTotalScore += totalScore),
            totalFinalMastery: (total.totalFinalMastery += fm)
          };
        },
        { totalMaxScore: 0, totalTotalScore: 0, totalFinalMastery: 0 }
      );

      let scorePercentUnrounded = (___item.totalTotalScore / ___item.totalMaxScore) * 100;
      scorePercentUnrounded = !isNaN(scorePercentUnrounded) ? scorePercentUnrounded : 0;

      let rawScoreUnrounded = ___item.totalTotalScore / groupedStandardIds[__item].length;
      rawScoreUnrounded = !isNaN(rawScoreUnrounded) ? rawScoreUnrounded : 0;

      let fmUnrounded = ___item.totalFinalMastery / groupedStandardIds[__item].length;
      fmUnrounded = !isNaN(fmUnrounded) ? fmUnrounded : 0;
      let fm = fmUnrounded ? Number(fmUnrounded.toFixed(2)) : 0;

      const { masteryLevel = "N/A", masteryName = "N/A", color = white } = fm
        ? getProficiencyBand(Math.round(fm), masteryScale, "score")
        : {};

      ___item = {
        ...___item,
        standardId: __item,
        standardName: groupedStandardIds[__item][0][idToLabel["standardId"]],
        scorePercentUnrounded,
        scorePercent: Math.round(Number(scorePercentUnrounded)),

        rawScoreUnrounded: rawScoreUnrounded,
        rawScore: Number(rawScoreUnrounded.toFixed(2)),

        fmUnrounded,
        fm,
        masteryLevel,
        masteryName,
        color
      };

      return ___item;
    });

    const { testActivityId, assignmentId, groupId } = groupedData[item][0];
    _item = {
      ..._item,
      compareBy: compareBy,
      compareByLabel: groupedData[item][0][idToLabel[compareBy]],
      compareByName: idToName[compareBy],
      scorePercentUnrounded,
      scorePercent: Math.round(Number(scorePercentUnrounded)),

      rawScoreUnrounded,
      rawScore: Number(rawScoreUnrounded.toFixed(2)),

      fmUnrounded,
      fm,
      masteryLevel,
      masteryName,
      color,
      sisId: groupedData[item][0].sisId,
      standardsInfo,
      testActivityId,
      assignmentId,
      groupId
    };

    if (_item.compareBy === "studentId") {
      _item["studentId"] = item;
    }

    return _item;
  });
  return arr;
};

const filterByMasteryLevel = (analysedData, masteryLevel) => {
  let filteredAnalysedData = analysedData.filter(item => {
    if (item.masteryName === masteryLevel || masteryLevel === "all") {
      return true;
    } else {
      return false;
    }
  });
  return filteredAnalysedData;
};

export const getTableData = (filteredDenormalizedData, masteryScale, compareBy, masteryLevel) => {
  if (!filteredDenormalizedData || isEmpty(filteredDenormalizedData) || (!masteryScale || isEmpty(masteryScale))) {
    return [];
  }

  let groupedData = groupBy(filteredDenormalizedData.filter(item => (item[compareBy] ? true : false)), compareBy);
  let analysedData = getAnalysedData(groupedData, compareBy, masteryScale);
  let filteredData = filterByMasteryLevel(analysedData, masteryLevel);
  return filteredData;
};

export const getMasteryLevel = (score, scaleInfo) => {
  for (const obj of scaleInfo) {
    if (round(score) === obj.score) {
      return obj || getLeastMasteryLevel(scaleInfo);
    }
  }
  return getLeastMasteryLevel(scaleInfo);
};

export const getLeastMasteryLevel = (scaleInfo = []) =>
  orderBy(scaleInfo, "score", ["desc"])[scaleInfo.length - 1] || { masteryLabel: "" };

export const groupedByStandard = (metricInfo = [], maxScore, scaleInfo = []) => {
  const standards = groupBy(metricInfo, "standardId");
  return Object.keys(standards).map(standardId => {
    const standardData = standards[standardId] || [];

    const masteryScore = (sumBy(standardData, "fm") / standardData.length).toFixed(2);
    const score = round((sumBy(standardData, "totalScore") / sumBy(standardData, "maxScore")) * 100);
    const rawScore = `${sumBy(standardData, "totalScore").toFixed(2)} / ${sumBy(standardData, "maxScore")}`;
    const masteryLevel = getMasteryLevel(masteryScore, scaleInfo).masteryLabel;

    return {
      standardId,
      masteryScore,
      diffMasteryScore: maxScore - round(masteryScore, 2),
      score,
      rawScore,
      masteryLevel,
      records: standardData
    };
  });
};
