import {
  getDropDownTestIds,
  processClassAndGroupIds,
  processFilteredClassAndGroupIds,
  processSchoolIds,
  processTeacherIds
} from "../../../../common/util";
import { get, groupBy } from "lodash";

const processSchoolYear = user => {
  let schoolYear = [];
  let arr = get(user, "orgData.terms", []);
  if (arr.length) {
    schoolYear = arr.map((item, index) => {
      return { key: item._id, title: item.name };
    });
  }
  return schoolYear;
};

const processCourseIds = orgDataArr => {
  let byCourseId = groupBy(orgDataArr.filter((item, index) => (item.courseId ? true : false)), "courseId");
  let courseIdArr = Object.keys(byCourseId).map((item, index) => {
    return {
      key: byCourseId[item][0].courseId,
      title: byCourseId[item][0].courseName
    };
  });
  courseIdArr.unshift({
    key: "All",
    title: "All Courses"
  });

  return courseIdArr;
};

export const getDropDownData = (SARFilterData, user) => {
  let schoolYear = processSchoolYear(user);

  const orgDataArr = get(SARFilterData, "data.result.orgData", []);
  const testDataArr = get(SARFilterData, "data.result.testData", []);

  // for class id & group id
  let [classIdArr, groupIdArr] = processClassAndGroupIds(orgDataArr);

  // For Course Id
  let courseIdArr = processCourseIds(orgDataArr);

  // Only For district admin
  // For School Id
  let schoolIdArr = processSchoolIds(orgDataArr);

  // For Teacher Id
  let teacherIdArr = processTeacherIds(orgDataArr);

  let testIdArr = getDropDownTestIds(testDataArr);

  return {
    orgDataArr: orgDataArr,
    testDataArr: testDataArr,

    schoolYear: schoolYear,
    classes: classIdArr,
    groups: groupIdArr,
    courses: courseIdArr,
    schools: schoolIdArr,
    teachers: teacherIdArr,

    testIdArr: testIdArr
  };
};

export const filteredDropDownData = (SARFilterData, user, currentFilter) => {
  let schoolYear = processSchoolYear(user);

  const orgDataArr = get(SARFilterData, "data.result.orgData", []);
  const testDataArr = get(SARFilterData, "data.result.testData", []);

  // for class id & group id
  let [classIdArr, groupIdArr] = processFilteredClassAndGroupIds(orgDataArr, currentFilter);

  if (!classIdArr.find(item => item.key === currentFilter.classId)) {
    currentFilter.classId = classIdArr[0];
  }
  if (!groupIdArr.find(item => item.key === currentFilter.groupId)) {
    currentFilter.groupId = groupIdArr[0];
  }

  // For Course Id
  let courseIdArr = processCourseIds(orgDataArr);

  // Only For district admin
  // For School Id
  let schoolIdArr = processSchoolIds(orgDataArr);

  // For Teacher Id
  let teacherIdArr = processTeacherIds(orgDataArr);

  let testIdArr = getDropDownTestIds(testDataArr);

  return {
    orgDataArr: orgDataArr,
    testDataArr: testDataArr,

    schoolYear: schoolYear,
    classes: classIdArr,
    groups: groupIdArr,
    courses: courseIdArr,
    schools: schoolIdArr,
    teachers: teacherIdArr,

    testIdArr: testIdArr,

    currentFilter
  };
};

export const processTestIds = (_dropDownData, currentFilter, urlTestId, role) => {
  if (!(_dropDownData.testDataArr && _dropDownData.testDataArr.length)) {
    let finalTestIds = [];
    return { testIds: finalTestIds, validTestId: { key: "", title: "" } };
  }

  let filtered = _dropDownData.orgDataArr.filter((item, index) => {
    const checkForClassAndGroup =
      item.groupType === "class"
        ? item.groupId === currentFilter.classId || currentFilter.classId === "All"
        : item.groupId === currentFilter.groupId || currentFilter.groupId === "All";
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
        (item.assessmentType === currentFilter.assessmentType || currentFilter.assessmentType === "All") &&
        checkForGrades &&
        checkForClassAndGroup
      ) {
        return true;
      }
    } else if (
      item.termId === currentFilter.termId &&
      (item.subject === currentFilter.subject || currentFilter.subject === "All") &&
      (item.courseId === currentFilter.courseId || currentFilter.courseId === "All") &&
      (item.assessmentType === currentFilter.assessmentType || currentFilter.assessmentType === "All") &&
      checkForGrades &&
      checkForClassAndGroup
    ) {
      return true;
    }
  });

  let groupIdMap = {};
  for (let item of filtered) {
    if (!groupIdMap[item.groupId]) {
      groupIdMap[item.groupId] = item;
    }
  }
  _dropDownData.testDataArr.sort((a, b) => {
    return b.assessmentDate - a.assessmentDate;
  });
  let arr = _dropDownData.testDataArr.filter(item => groupIdMap[item.groupId]);
  let finalTestIds = [];
  let makeUniqueMap = {};
  for (let item of arr) {
    if (!makeUniqueMap[item.testId]) {
      finalTestIds.push({ key: item.testId, title: item.testName });
      makeUniqueMap[item.testId] = true;
    }
  }

  const validTestId = finalTestIds.find((item, index) => urlTestId === item.key);
  return { testIds: finalTestIds, validTestId: validTestId ? validTestId.key : "" };
};
