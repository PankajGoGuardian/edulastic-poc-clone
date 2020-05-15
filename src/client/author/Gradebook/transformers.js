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
const curateTestActivities = tas => {
  const ta = tas[tas.length - 1];
  const { status, graded, endDate, score = 0, maxScore = 1 } = ta;
  if (status === 0) {
    // TODO: check if partial score, can be returned, else query in PRD
    return { laDate: endDate, status: "IN PROGRESS" };
  } else if (status === 1) {
    return {
      laDate: endDate,
      status: graded === "GRADED" ? "GRADED" : "SUBMITTED",
      percentScore: `${Math.round(score / maxScore)}%`
    };
  } else if (status === 2) {
    return { laDate: endDate, status: "ABSENT", percentScore: "0%" };
  }
};

const getStudentsMap = (students = []) => {
  const studentsMap = groupBy(students, "_id");
  Object.keys(studentsMap).forEach(_id => {
    // get formatted student name
    const { firstName, middleName, lastName } = studentsMap[_id][0];
    const studentName = getFormattedName(firstName, middleName, lastName);
    // club all groupIds
    const groupIds = [];
    studentsMap[_id].forEach(s => groupIds.push(s.group._id));
    // update studentsMap
    studentsMap[_id] = {
      _id,
      studentName,
      groupIds: uniq(groupIds)
    };
  });
  return studentsMap;
};

export const curateGradebookData = (gradebookData, filtersData) => {
  const { students = [], assignments = [], testActivities = [] } = gradebookData;
  const { classes = [] } = filtersData;

  const taGroups = groupBy(testActivities, "assignmentId");
  const studentsMap = getStudentsMap(students);

  const curatedDataMap = {};
  // aggregate student data for all assignments based on studentId & classId
  Object.values(studentsMap).map(s =>
    assignments.forEach(a => {
      const taGroup = taGroups[(a?._id)]?.filter(ta => ta.userId === s._id);
      if (taGroup) {
        const taClassGroups = groupBy(taGroup, "groupId");
        Object.keys(taClassGroups).forEach(cId => {
          const key = JSON.stringify([s._id, cId]);
          // calculate percent score and status for assignment
          const taCurated = curateTestActivities(taClassGroups[cId]);
          // store aggregated data uniquely for student & class combination
          if (curatedDataMap[key]) {
            curatedDataMap[key][a._id] = taCurated;
          } else {
            curatedDataMap[key] = { [a._id]: taCurated };
          }
        });
      } else {
        // check for not started
        a.class?.forEach(({ _id: cId, students: sIds }) => {
          const key = JSON.stringify([s._id, cId]);
          if (s.groupIds.includes(cId) || sIds.includes(s._id)) {
            curatedDataMap[key] = { [a._id]: { status: "NOT STARTED", laDate: 0, percentScore: " " } };
          }
        });
      }
    })
  );

  const curatedData = Object.keys(curatedDataMap).map(key => {
    const [sId, cId] = JSON.parse(key);
    // get laDate in curatedDataMap
    let laDate = 0;
    Object.keys(curatedDataMap[key]).forEach(aId => (laDate = Math.max(curatedDataMap[key][aId].laDate, laDate)));
    // return curated data
    return {
      ...studentsMap[sId],
      lastActivityDate: laDate,
      className: classes.find(c => c.id === cId)?.name,
      assessments: curatedDataMap[key]
    };
  });
  const assessmentsData = assignments.map(a => ({ id: a._id, name: a.title }));

  return [curatedData, assessmentsData];
};
