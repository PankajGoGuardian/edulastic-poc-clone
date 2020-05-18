import { capitalize, keyBy, groupBy, uniq } from "lodash";

// id for STATUS_LIST items (if present)
// correspond to testActivityStatus from @edulastic/constants
export const STATUS_LIST = [
  {
    id: "NOT STARTED",
    name: "NOT STARTED",
    color: "#B1B1B1"
  },
  {
    id: "START",
    name: "IN PROGRESS",
    color: "#7BC0DF"
  },
  {
    id: "SUBMITTED",
    name: "SUBMITTED",
    color: "#ECAB28"
  },
  {
    id: "GRADED",
    name: "GRADED",
    color: "#00AD50"
  },
  {
    id: "ABSENT",
    name: "ABSENT",
    color: "#F35F5F"
  }
];

export const getFormattedName = (...names) => {
  const nameArr = names.filter(n => n?.trim()).map(n => capitalize(n));
  const lName = nameArr.splice(nameArr.length - 1)[0];
  return nameArr.length ? lName + ", " + nameArr.join(" ") : lName;
};

export const getUniqAssessments = (assessments = []) => {
  const assessmentGroups = groupBy(assessments, "_id");
  const uniqAssessments = Object.keys(assessmentGroups).map(aId => {
    const classIds = [],
      subjects = [],
      grades = [];
    const assessment = assessmentGroups[aId][0];
    assessmentGroups[aId].forEach(a => {
      classIds.push(a.classId);
      subjects.push(...a.subjects);
      grades.push(...a.grades);
    });
    return {
      id: assessment._id,
      name: assessment.title,
      termId: assessment.termId,
      classIds: uniq(classIds),
      subjects: uniq(subjects),
      grades: uniq(grades)
    };
  });
  return uniqAssessments;
};

export const curateFiltersData = (filtersData, filters) => {
  const { assessments = [] } = filtersData;
  const { termId } = filters;
  // TODO: raise query for filtering based on subjects, grades, or classIds in PRD
  const filteredAssessments = assessments.filter(a => !termId || a.termId === termId);
  return { ...filtersData, assessments: filteredAssessments };
};

// curate percentScore, status & lastActivityDAte for testActivity
const getCuratedTestActivity = taGroup => {
  const ta = taGroup[taGroup.length - 1];
  const { status, graded, startDate, endDate, score = 0, maxScore = 1 } = ta;
  const laDate = endDate || startDate;
  if (status === 0) {
    // TODO: check if partial score, can be returned, else query in PRD
    return { laDate, status: "IN PROGRESS" };
  } else if (status === 1) {
    return {
      laDate,
      status: graded === "GRADED" ? "GRADED" : "SUBMITTED",
      percentScore: `${Math.round((100 * score) / maxScore)}%`
    };
  } else if (status === 2) {
    return { laDate, status: "ABSENT", percentScore: "0%" };
  }
};

// function to get curated gradebook data
export const curateGradebookData = gradebookData => {
  const { students = [], assignments = [], testActivities = [] } = gradebookData;

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
        assessments[a._id] = taCurated;
        laDate = Math.max(laDate, taCurated.laDate);
      } else {
        // check for not started
        a.class?.forEach(c => {
          if (c._id === classId && (!c.specificStudents || (c.specificStudents && c.students?.includes(sId)))) {
            assessments[a._id] = { laDate: 0, status: "NOT STARTED", percentScore: " " };
          }
        });
      }
    });

    // return updated student data
    return { _id: sId, studentName, classId, className, laDate, assessments };
  });

  const assessmentsData = assignments.map(a => ({ id: a._id, name: a.title }));

  return [curatedData, assessmentsData];
};
