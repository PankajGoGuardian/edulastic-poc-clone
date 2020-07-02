import { capitalize, groupBy, uniq, isEmpty } from "lodash";

// constants
import { testActivityStatus } from "@edulastic/constants";

export const INITIAL_FILTERS = {
  assessmentIds: [],
  status: "",
  classIds: [],
  grades: [],
  subjects: [],
  termId: "",
  testType: "",
  groupId: ""
};

export const PAGE_DETAIL = {
  studentPage: 1,
  studentPageSize: 50,
  assignmentPage: 1,
  assignmentPageSize: 10
};

// id for STATUS_LIST items correspond to
// testActivityStatus from @edulastic/constants
export const STATUS_LIST = [
  {
    id: "NOT STARTED",
    name: "NOT STARTED",
    color: "#E5E5E5"
  },
  {
    id: "START",
    name: "IN PROGRESS",
    color: "#BEDEFF"
  },
  {
    id: "SUBMITTED",
    name: "SUBMITTED",
    color: "#FFE9A8"
  },
  {
    id: "GRADED",
    name: "GRADED",
    color: "#DEF4E8"
  },
  {
    id: "ABSENT",
    name: "ABSENT",
    color: "#FDE0E9"
  }
];

export const getFormattedName = (...names) => {
  const nameArr = names.filter(n => n?.trim()).map(n => capitalize(n));
  const lName = nameArr.splice(nameArr.length - 1)[0];
  return nameArr.length ? `${lName}, ${nameArr.join(" ")}` : lName;
};

export const getUniqAssessments = (assessments = []) => {
  // group assignments by report key and title
  const assessmentGroups = groupBy(assessments, a => `${a.reportKey}_${a.title}`);
  const uniqAssessments = Object.keys(assessmentGroups).map(aId => {
    const classIds = [];
    const subjects = [];
    const grades = [];
    const assessmentIds = [];
    const assessment = assessmentGroups[aId][0];
    assessmentGroups[aId].forEach(a => {
      classIds.push(a.classId);
      subjects.push(...a.subjects);
      grades.push(...a.grades);
      assessmentIds.push(a._id);
    });
    return {
      id: assessment._id,
      name: assessment.title,
      termId: assessment.termId,
      classIds: uniq(classIds),
      subjects: uniq(subjects),
      grades: uniq(grades),
      assessmentIds: uniq(assessmentIds)
    };
  });
  return uniqAssessments;
};

export const curateFiltersData = (filtersData, filters) => {
  const { assessments = [] } = filtersData;
  const { termId } = filters;
  // TODO: raise query for filtering based on subjects, grades, or classIds in PRD
  const filteredAssessments = assessments.filter(a => !termId || a.termId === termId);
  const uniqAssessments = getUniqAssessments(filteredAssessments);
  return { ...filtersData, assessments: uniqAssessments };
};

// curate percentScore, status & lastActivityDAte for testActivity
const getCuratedTestActivity = taGroup => {
  const ta = taGroup[taGroup.length - 1];
  const { status, graded, startDate, endDate, score = 0, maxScore = 1 } = ta;
  const laDate = endDate || startDate || 0;
  if (status === testActivityStatus.START) {
    // TODO: check if partial score, can be returned, else query in PRD
    return { laDate, status: "START" };
  }
  if (status === testActivityStatus.SUBMITTED) {
    return {
      laDate,
      status: graded === "GRADED" ? "GRADED" : "SUBMITTED",
      percentScore: `${Math.round((100 * score) / maxScore)}%`
    };
  }
  if (status === testActivityStatus.ABSENT) {
    return { laDate, status: "ABSENT", percentScore: "0%" };
  }
};

// function to get paginated data when test-activity status filter is set
const getPaginatedData = (curatedData, assessmentsData, pagination) => {
  const { studentPage, assignmentPage, studentPageSize, assignmentPageSize } = pagination;
  const studentPos = (studentPage - 1) * studentPageSize;
  const assignmentPos = (assignmentPage - 1) * assignmentPageSize;

  // filter out empty rows
  curatedData = curatedData.filter(d => !isEmpty(d.assessments));
  // get student count and student paginated data
  const studentsCount = curatedData.length;
  curatedData = curatedData.slice(studentPos, studentPos + studentPageSize);

  // filter out empty columns
  const assessmentIds = uniq(curatedData.flatMap(d => Object.keys(d.assessments)));
  assessmentsData = assessmentsData.filter(a => assessmentIds.includes(a.id));
  // get assignment count and assignment paginated data
  const assignmentsCount = assessmentsData.length;
  assessmentsData = assessmentsData.slice(assignmentPos, assignmentPos + assignmentPageSize);

  return { curatedData, assessmentsData, assignmentsCount, studentsCount };
};

// function to get curated gradebook data
export const curateGradebookData = (gradebookData, pagination, status) => {
  const { students = [], assignments = [], testActivities = [], assignmentsCount, studentsCount } = gradebookData;

  // group test-activity by assignmentId
  const taGroups = groupBy(testActivities, "assignmentId");

  // curate student-class data
  const curatedData = students.map(student => {
    const { _id: sId, firstName, middleName, lastName, group, assessments = {} } = student;
    const { _id: classId, name: className } = group;
    let laDate = 0;
    // get formatted student name
    const studentName = getFormattedName(firstName, middleName, lastName);
    // update assessments for the curated student
    assignments.forEach(a => {
      // check for test-activity belonging to the curated student
      const taGroup = taGroups[a._id]?.filter(ta => ta.userId === sId && ta.groupId === classId);
      const taCurated = taGroup?.length && getCuratedTestActivity(taGroup);
      if (taCurated) {
        // update test-activity & last-activity date for the assignment-student-class combo
        if (!status || status === taCurated.status) {
          assessments[a._id] = { assignmentId: a._id, ...taCurated };
        }
        laDate = Math.max(laDate, taCurated.laDate);
      } else if (!status || status === "NOT STARTED") {
        // check for not started
        a.class?.forEach(c => {
          if (c._id === classId && (!c.specificStudents || (c.specificStudents && c.students?.includes(sId)))) {
            assessments[a._id] = { assignmentId: a._id, laDate: 0, status: "NOT STARTED", percentScore: " " };
          }
        });
      }
    });

    // return updated student data
    return { _id: sId, studentName, classId, className, laDate, assessments };
  });

  // group assignments by report key and title
  const assignmentsMap = {};
  const assignmentGroups = groupBy(assignments, a => `${a.reportKey}_${a.title}`);
  const assignmentsData = Object.keys(assignmentGroups).map(aId => {
    const assignment = assignmentGroups[aId][0];
    assignmentGroups[aId].forEach(a => {
      assignmentsMap[a._id] = assignment._id;
    });
    return assignment;
  });

  // re-curate student data for the grouped assignments
  curatedData.forEach(d => {
    const assessments = {};
    Object.entries(d.assessments).forEach(([k, v]) => {
      // store the latest test activity
      const prevLaDate = assessments[assignmentsMap[k]]?.laDate;
      const selectPrev = prevLaDate && prevLaDate > v.laDate;
      assessments[assignmentsMap[k]] = selectPrev ? assessments[assignmentsMap[k]] : v;
    });
    d.assessments = assessments;
  });

  const assessmentsData = assignmentsData.map(a => ({ id: a._id, name: a.title }));

  if (status) {
    return getPaginatedData(curatedData, assessmentsData, pagination);
  }

  return { curatedData, assessmentsData, assignmentsCount, studentsCount };
};
