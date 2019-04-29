import { getDropDownTestIds } from "../../../../common/util";
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

const processGroupIds = orgDataArr => {
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

const processFilteredGroupIds = (orgDataArr, currentFilter) => {
  let byGroupId = groupBy(
    orgDataArr.filter((item, index) => {
      if (
        item.groupId &&
        (item.grade === currentFilter.grade || currentFilter.grade === "All") &&
        (item.subject === currentFilter.subject || currentFilter.subject === "All") &&
        (item.courseId === currentFilter.courseId || currentFilter.courseId === "All")
      ) {
        return true;
      }
    }),
    "groupId"
  );
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

const processSchoolIds = orgDataArr => {
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

const processTeacherIds = orgDataArr => {
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

export const getDropDownData = (SARFilterData, user) => {
  let schoolYear = processSchoolYear(user);

  const orgDataArr = get(SARFilterData, "data.result.orgData", []);
  const testDataArr = get(SARFilterData, "data.result.testData", []);

  // For Group Id
  let groupIdArr = processGroupIds(orgDataArr);

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

  // For Group Id
  let groupIdArr = processFilteredGroupIds(orgDataArr, currentFilter);

  let isPresent = groupIdArr.find((item, index) => item.key === currentFilter.groupId);
  if (!isPresent) {
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
    if (role !== "teacher") {
      if (
        item.termId === currentFilter.termId &&
        (item.subject === currentFilter.subject || currentFilter.subject === "All") &&
        (item.grade === currentFilter.grade || currentFilter.grade === "All") &&
        (item.courseId === currentFilter.courseId || currentFilter.courseId === "All") &&
        (item.groupId === currentFilter.groupId || currentFilter.groupId === "All") &&
        (item.schoolId === currentFilter.schoolId || currentFilter.schoolId === "All") &&
        (item.teacherId === currentFilter.teacherId || currentFilter.teacherId === "All") &&
        (item.assessmentType === currentFilter.assessmentType || currentFilter.assessmentType === "All")
      ) {
        return true;
      }
    } else {
      if (
        item.termId === currentFilter.termId &&
        (item.subject === currentFilter.subject || currentFilter.subject === "All") &&
        (item.grade === currentFilter.grade || currentFilter.grade === "All") &&
        (item.courseId === currentFilter.courseId || currentFilter.courseId === "All") &&
        (item.groupId === currentFilter.groupId || currentFilter.groupId === "All") &&
        (item.assessmentType === currentFilter.assessmentType || currentFilter.assessmentType === "All")
      ) {
        return true;
      }
    }
  });

  let groupIdMap = {};
  for (let item of filtered) {
    if (!groupIdMap[item.groupId]) {
      groupIdMap[item.groupId] = item;
    }
  }

  let arr = _dropDownData.testDataArr.filter((item, index) => (groupIdMap[item.groupId] ? true : false));
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
