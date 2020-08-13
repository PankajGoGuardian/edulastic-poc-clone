import { get, groupBy, isEmpty } from "lodash";
import { roleuser } from "@edulastic/constants";
import {
  getDropDownTestIds,
  processClassAndGroupIds,
  processFilteredClassAndGroupIds,
  processSchoolIds,
  processTeacherIds
} from "../../../../common/util";

const processSchoolYear = user => {
  let schoolYear = [];
  const arr = get(user, "orgData.terms", []);
  if (arr.length) {
    schoolYear = arr.map(item => ({ key: item._id, title: item.name }));
  }
  return schoolYear;
};

const processCourseIds = orgDataArr => {
  const byCourseId = groupBy(orgDataArr.filter(item => !!item.courseId), "courseId");
  const courseIdArr = Object.keys(byCourseId).map(item => ({
    key: byCourseId[item][0].courseId,
    title: byCourseId[item][0].courseName
  }));
  courseIdArr.unshift({
    key: "All",
    title: "All Courses"
  });

  return courseIdArr;
};

export const getDropDownData = (SARFilterData, user) => {
  const schoolYear = processSchoolYear(user);

  const orgDataArr = get(SARFilterData, "data.result.orgData", []);
  const testDataArr = get(SARFilterData, "data.result.testData", []);

  // for class id & group id
  const [classIdArr, groupIdArr] = processClassAndGroupIds(orgDataArr);

  // For Course Id
  const courseIdArr = processCourseIds(orgDataArr);

  // Only For district admin
  // For School Id
  const schoolIdArr = processSchoolIds(orgDataArr);

  // For Teacher Id
  const teacherIdArr = processTeacherIds(orgDataArr);

  const testIdArr = getDropDownTestIds(testDataArr);

  return {
    orgDataArr,
    testDataArr,

    schoolYear,
    classes: classIdArr,
    groups: groupIdArr,
    courses: courseIdArr,
    schools: schoolIdArr,
    teachers: teacherIdArr,

    testIdArr
  };
};

export const filteredDropDownData = (SARFilterData, user, currentFilter) => {
  const schoolYear = processSchoolYear(user);

  const orgDataArr = get(SARFilterData, "data.result.orgData", []);
  const testDataArr = get(SARFilterData, "data.result.testData", []);

  // for class id & group id
  const [classIdArr, groupIdArr] = processFilteredClassAndGroupIds(orgDataArr, currentFilter);

  if (!classIdArr.find(item => item.key === currentFilter.classId)) {
    currentFilter.classId = classIdArr[0];
  }
  if (!groupIdArr.find(item => item.key === currentFilter.groupId)) {
    currentFilter.groupId = groupIdArr[0];
  }

  // For Course Id
  const courseIdArr = processCourseIds(orgDataArr);

  // Only For district admin
  // For School Id
  let schoolIdArr = processSchoolIds(orgDataArr);
  if (user.role === roleuser.SCHOOL_ADMIN) {
    schoolIdArr = get(user, "orgData.schools", []).map(({ _id, name }) => ({ key: _id, title: name }));
    schoolIdArr.unshift({ key: "All", title: "All Schools" });
  }

  // For Teacher Id
  const teacherIdArr = processTeacherIds(orgDataArr);

  const testIdArr = getDropDownTestIds(testDataArr);

  return {
    orgDataArr,
    testDataArr,

    schoolYear,
    classes: classIdArr,
    groups: groupIdArr,
    courses: courseIdArr,
    schools: schoolIdArr,
    teachers: teacherIdArr,

    testIdArr,

    currentFilter
  };
};

export const processTestIds = (_dropDownData, currentFilter, urlTestId, role, user) => {
  if (!(_dropDownData.testDataArr && _dropDownData.testDataArr.length)) {
    const finalTestIds = [];
    return { testIds: finalTestIds, validTestId: { key: "", title: "" } };
  }

  let filteredOrgData = _dropDownData.orgDataArr;
  if (role === roleuser.SCHOOL_ADMIN) {
    const schoolIds = get(user, "orgData.schools", []).map(school => school._id);
    filteredOrgData = _dropDownData.orgDataArr.filter(school => schoolIds.includes(school.schoolId));
  }

  const filtered = filteredOrgData.filter(item => {
    const checkForClassAndGroup =
      item.groupType === "class"
        ? item.groupId === currentFilter.classId || currentFilter.classId === "All"
        : !isEmpty(currentFilter.groupId);
    // keep all custom groups to get all tests assigned to any one group NOTE: its always true
    const checkForGrades =
      (item.grades || "")
        .split(",")
        .filter(g => g.length)
        .includes(currentFilter.grade) || currentFilter.grade === "All";
    if (role !== "teacher") {
      if (
        item.termId === currentFilter.termId &&
        (item.subject === currentFilter.subject || currentFilter.subject === "All") &&
        (item.courseId === currentFilter.courseId || currentFilter.courseId === "All") &&
        (item.schoolId === currentFilter.schoolId || currentFilter.schoolId === "All") &&
        (item.teacherId === currentFilter.teacherId || currentFilter.teacherId === "All") &&
        checkForGrades &&
        checkForClassAndGroup
      ) {
        return true;
      }
    } else if (
      item.termId === currentFilter.termId &&
      (item.subject === currentFilter.subject || currentFilter.subject === "All") &&
      (item.courseId === currentFilter.courseId || currentFilter.courseId === "All") &&
      checkForGrades &&
      checkForClassAndGroup
    ) {
      return true;
    }
    return false;
  });

  const groupIdMap = {};
  for (const item of filtered) {
    if (!groupIdMap[item.groupId]) {
      groupIdMap[item.groupId] = item;
    }
  }
  _dropDownData.testDataArr.sort((a, b) => b.assessmentDate - a.assessmentDate);
  const arr = _dropDownData.testDataArr.filter(
    item =>
      (item.assessmentType === currentFilter.assessmentType || currentFilter.assessmentType === "All") &&
      groupIdMap[item.groupId]
  );
  const finalTestIds = [];
  const makeUniqueMap = {};
  for (const item of arr) {
    if (!makeUniqueMap[item.testId]) {
      finalTestIds.push({ key: item.testId, title: item.testName });
      makeUniqueMap[item.testId] = true;
    }
  }

  const validTestId = finalTestIds.find(item => urlTestId === item.key);
  return { testIds: finalTestIds, validTestId: validTestId ? validTestId.key : "" };
};

export const transformMetricForStudentGroups = (groups, metricInfo) => {
  const studentGroupsMap = {};
  groups.forEach(group => {
    if (group.groupType === "custom") {
      if (group.students) {
        group.students.forEach(id => {
          if (!studentGroupsMap[id]) {
            studentGroupsMap[id] = [];
          }
          studentGroupsMap[id].push({
            groupId: group.groupId,
            groupName: group.groupName
          });
        });
      }
    }
  });
  // filter student based on student groups and replace group info with student group info in meticInfo
  const metics = [];
  metricInfo.forEach(info => {
    if (studentGroupsMap[info.studentId]) {
      metics.push(
        ...studentGroupsMap[info.studentId].map(({ groupId, groupName }) => ({ ...info, groupId, groupName }))
      );
    }
  });
  return metics;
};
