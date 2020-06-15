/* eslint-disable array-callback-return */
import { groupBy, keyBy, isEmpty, get, values, round, sumBy, orderBy, isNaN } from "lodash";
import { white } from "@edulastic/colors";
import { getProficiencyBand } from "../../../../common/util";

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
  masteryLevel: "masteryName",
  masteryScore: "fm"
};

const getFormattedName = name => {
  const nameArr = (name || "").trim().split(" ");
  const lName = nameArr.splice(nameArr.length - 1)[0];
  return nameArr.length ? `${lName}, ${nameArr.join(" ")}` : lName;
};

export const getFilterDropDownData = (arr, role) => {
  let schoolGrp;
  let teacherGrp;
  let schoolArr;
  let teacherArr;
  let keyArr;
  if (role !== "teacher") {
    schoolGrp = groupBy(arr.filter(item => !!item.schoolId), "schoolId");
    teacherGrp = groupBy(arr.filter(item => !!item.teacherId), "teacherId");

    keyArr = Object.keys(schoolGrp);
    schoolArr = keyArr.map(item => ({ key: item, title: schoolGrp[item][0].schoolName }));
    schoolArr.unshift({
      key: "all",
      title: "All"
    });

    keyArr = Object.keys(teacherGrp);
    teacherArr = keyArr.map(item => ({ key: item, title: teacherGrp[item][0].teacherName }));
    teacherArr.unshift({
      key: "all",
      title: "All"
    });
  }
  const groupGrp = groupBy(arr.filter(item => !!item.groupId), "groupId");
  keyArr = Object.keys(groupGrp);
  const groupArr = keyArr.map(item => ({ key: item, title: groupGrp[item][0].className }));
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
  }
  return [
    {
      key: "groupId",
      title: "Class",
      data: groupArr
    }
  ];
};

export const getMasteryDropDown = masteryScale => {
  const arr = [];
  if (Array.isArray(masteryScale)) {
    for (const item of masteryScale) {
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

  const rawSkillinfo = get(rawData, "data.result.skillInfo", []);
  const skillInfoMap = keyBy(rawSkillinfo.filter(item => !!item.standardId), "standardId");

  const rawStudInfo = get(rawData, "data.result.studInfo", []);
  const studInfoMap = keyBy(rawStudInfo, "studentId");

  const rawMetricInfo = get(rawData, "data.result.metricInfo", []);
  const enhancedRawMetricInfo = rawMetricInfo
    .filter(item => skillInfoMap[item.standardId])
    .map(item => {
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
        const groupIdsMap = keyBy(obj.groupIds);
        const uniqueGroupIds = values(groupIdsMap);
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

  const denormalizedEnhancedRawMetricInfo = [];
  enhancedRawMetricInfo
    .filter(i => i.groupIds)
    .map(item => {
      item.groupIds.map(_item => {
        const obj = {
          ...item,
          groupId: _item
        };
        denormalizedEnhancedRawMetricInfo.push(obj);
      });
    });

  const rawTeacherInfo = get(rawData, "data.result.teacherInfo", []);
  const teacherInfoMap = keyBy(rawTeacherInfo, "groupId");

  const finalDenormalizedData = denormalizedEnhancedRawMetricInfo.map(item => {
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
  const filteredDenormalizedData = denormalizedData.filter(item => {
    let schoolIdFlag;
    let teacherIdFlag;
    if (role !== "teacher") {
      schoolIdFlag = !!(item.schoolId === filters.schoolId || filters.schoolId === "all");
      teacherIdFlag = !!(item.teacherId === filters.teacherId || filters.teacherId === "all");
    }
    const groupIdFlag = !!(item.groupId === filters.groupId || filters.groupId === "all");
    const genderFlag = !!(item.gender === filters.gender || filters.gender === "all");
    const frlStatusFlag = !!(item.frlStatus === filters.frlStatus || filters.frlStatus === "all");
    const ellStatusFlag = !!(item.ellStatus === filters.ellStatus || filters.ellStatus === "all");
    const iepStatusFlag = !!(item.iepStatus === filters.iepStatus || filters.iepStatus === "all");
    const raceFlag = !!(item.race === filters.race || filters.race === "all");

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

export const getChartData = (filteredDenormalizedData, masteryScale, filters) => {
  if (isEmpty(filteredDenormalizedData) || isEmpty(masteryScale) || isEmpty(filters)) {
    return [];
  }

  const groupedStandardIds = groupBy(filteredDenormalizedData, "standardId");

  const keysArr = Object.keys(groupedStandardIds);

  const masteryMap = keyBy(masteryScale, "score");
  const masteryCountHelper = {};

  for (const item of masteryScale) {
    masteryCountHelper[item.score] = 0;
  }
  const arr = keysArr.map(item => {
    const obj = {};
    const totalStudents = groupedStandardIds[item].length;
    const tempMasteryCountHelper = { ...masteryCountHelper };

    for (const _item of groupedStandardIds[item]) {
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

    const masteryLabelInfo = {};

    Object.keys(tempMasteryCountHelper).map(_item => {
      if (masteryMap[_item]) {
        const masteryPercentage = round((tempMasteryCountHelper[_item] / totalStudents) * 100);
        masteryLabelInfo[masteryMap[_item].masteryLabel] = masteryMap[_item].masteryName;
        if (_item == 1) {
          obj[masteryMap[_item].masteryLabel] = -masteryPercentage;
        } else {
          obj[masteryMap[_item].masteryLabel] = masteryPercentage;
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
        const { maxScore = 0, totalScore = 0, fm = 0 } = currentValue;
        const totalMaxScore = total.totalMaxScore + maxScore;
        const totalTotalScore = total.totalTotalScore + totalScore;
        const totalFinalMastery = total.totalFinalMastery + fm;
        return {
          totalMaxScore,
          totalTotalScore,
          totalFinalMastery
        };
      },
      { totalMaxScore: 0, totalTotalScore: 0, totalFinalMastery: 0 }
    );

    let scorePercentUnrounded = (_item.totalTotalScore / _item.totalMaxScore) * 100;
    scorePercentUnrounded = !isNaN(scorePercentUnrounded) ? scorePercentUnrounded : 0;

    const rawScoreUnrounded = _item.totalTotalScore || 0;

    let fmUnrounded = _item.totalFinalMastery / groupedData[item].length;
    fmUnrounded = !isNaN(fmUnrounded) ? fmUnrounded : 0;
    const fm = fmUnrounded ? Number(fmUnrounded.toFixed(2)) : 0;

    const { masteryLevel = "N/A", masteryName = "N/A", color = white } = fm
      ? getProficiencyBand(Math.round(fm), masteryScale, "score")
      : {};

    const groupedStandardIds = groupBy(groupedData[item], "standardId");

    const standardsInfo = Object.keys(groupedStandardIds).map(__item => {
      let ___item = groupedStandardIds[__item].reduce(
        (total, currentValue) => {
          const { maxScore = 0, totalScore = 0, fm: _fm = 0 } = currentValue;
          const totalMaxScore = total.totalMaxScore + maxScore;
          const totalTotalScore = total.totalTotalScore + totalScore;
          const totalFinalMastery = total.totalFinalMastery + _fm;
          return {
            totalMaxScore,
            totalTotalScore,
            totalFinalMastery
          };
        },
        { totalMaxScore: 0, totalTotalScore: 0, totalFinalMastery: 0 }
      );

      let _scorePercentUnrounded = (___item.totalTotalScore / ___item.totalMaxScore) * 100;
      _scorePercentUnrounded = !isNaN(_scorePercentUnrounded) ? _scorePercentUnrounded : 0;

      let _rawScoreUnrounded = ___item.totalTotalScore / groupedStandardIds[__item].length;
      _rawScoreUnrounded = !isNaN(_rawScoreUnrounded) ? _rawScoreUnrounded : 0;

      let _fmUnrounded = ___item.totalFinalMastery / groupedStandardIds[__item].length;
      _fmUnrounded = !isNaN(_fmUnrounded) ? _fmUnrounded : 0;
      const _fm = _fmUnrounded ? Number(_fmUnrounded.toFixed(2)) : 0;

      const { masteryLevel: _masteryLevel = "N/A", masteryName: _masteryName = "N/A", color: _color = white } = _fm
        ? getProficiencyBand(Math.round(_fm), masteryScale, "score")
        : {};

      ___item = {
        ...___item,
        standardId: __item,
        standardName: groupedStandardIds[__item][0][idToLabel.standardId],
        scorePercentUnrounded: _scorePercentUnrounded,
        scorePercent: Math.round(Number(_scorePercentUnrounded)),

        rawScoreUnrounded: _rawScoreUnrounded,
        rawScore: Number(_rawScoreUnrounded.toFixed(2)),

        fmUnrounded: _fmUnrounded,
        fm: _fm,
        masteryLevel: _masteryLevel,
        masteryName: _masteryName,
        color: _color
      };

      return ___item;
    });

    const { testActivityId, assignmentId, groupId } = groupedData[item][0];
    _item = {
      ..._item,
      compareBy,
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
      _item.studentId = item;
    }

    return _item;
  });
  return arr;
};

const filterByMasteryLevel = (analysedData, masteryLevel) => {
  const filteredAnalysedData = analysedData.filter(item => {
    if (item.masteryName === masteryLevel || masteryLevel === "all") {
      return true;
    }
    return false;
  });
  return filteredAnalysedData;
};

export const getTableData = (filteredDenormalizedData, masteryScale, compareBy, masteryLevel) => {
  if (!filteredDenormalizedData || isEmpty(filteredDenormalizedData) || (!masteryScale || isEmpty(masteryScale))) {
    return [];
  }

  const groupedData = groupBy(filteredDenormalizedData.filter(item => !!item[compareBy]), compareBy);
  const analysedData = getAnalysedData(groupedData, compareBy, masteryScale);
  const filteredData = filterByMasteryLevel(analysedData, masteryLevel);
  return filteredData;
};

export const getLeastMasteryLevel = (scaleInfo = []) =>
  orderBy(scaleInfo, "score", ["desc"])[scaleInfo.length - 1] || { masteryLabel: "" };

export const getMasteryLevel = (score, scaleInfo) => {
  for (const obj of scaleInfo) {
    if (round(score) === obj.score) {
      return obj || getLeastMasteryLevel(scaleInfo);
    }
  }
  return getLeastMasteryLevel(scaleInfo);
};

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
