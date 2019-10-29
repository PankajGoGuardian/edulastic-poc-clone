import { createAction } from "redux-starter-kit";
import { uniqBy, keyBy, cloneDeep } from "lodash";
import { produce } from "immer";
import {
  RECEIVE_TESTACTIVITY_REQUEST,
  RECEIVE_TESTACTIVITY_SUCCESS,
  RECEIVE_TESTACTIVITY_ERROR,
  UPDATE_ASSIGNMENT_STATUS,
  TOGGLE_PRESENTATION_MODE,
  UPDATE_OPEN_ASSIGNMENTS,
  UPDATE_CLOSE_ASSIGNMENTS,
  SET_IS_PAUSED,
  SET_CURRENT_TESTACTIVITY,
  UPDATE_REMOVED_STUDENTS_LIST,
  UPDATE_STUDENTS_LIST,
  UPDATE_CLASS_STUDENTS_LIST,
  SET_STUDENTS_GRADEBOOK,
  SET_ALL_TESTACTIVITIES_FOR_STUDENT,
  UPDATE_SUBMITTED_STUDENTS
} from "../constants/actions";
import { transformGradeBookResponse, getMaxScoreOfQid } from "../../ClassBoard/Transformer";
import { createFakeData } from "../../ClassBoard/utils";

export const REALTIME_GRADEBOOK_TEST_ACTIVITY_ADD = "[gradebook] realtime test activity add";
export const REALTIME_GRADEBOOK_TEST_ACTIVITY_SUBMIT = "[gradebook] realtime test activity submit";
export const GRADEBOOK_TEST_ITEM_ADD = "[gradebook] test item add";

export const REALTIME_GRADEBOOK_TEST_QUESTION_REMOVE = "[gradebook] realtime test question remove";
export const REALTIME_GRADEBOOK_TEST_QUESTION_ADD_MAXSCORE = "[gradebook] realtime test question add max score";
export const REALTIME_GRADEBOOK_REDIRECT = "[gradebook] realtime assignment redirect";

export const REALTIME_GRADEBOOK_CLOSE_ASSIGNMENT = "[gradebook] realtime close assignment";
export const REALTIME_GRADEBOOK_UPDATE_ASSIGNMENT = "[gradebook] realtime gradebook update assignment";
/**
 * force rerendering the components that depends on
 * additional data thus checking
 * due date / open date to recalculate the status of the assignment
 */
export const RECALCULATE_ADDITIONAL_DATA = "[gradebook] recalculate additional data";

export const realtimeGradebookActivityAddAction = createAction(REALTIME_GRADEBOOK_TEST_ACTIVITY_ADD);
export const realtimeGradebookActivitySubmitAction = createAction(REALTIME_GRADEBOOK_TEST_ACTIVITY_SUBMIT);
export const gradebookTestItemAddAction = createAction(GRADEBOOK_TEST_ITEM_ADD);
export const realtimeGradebookQuestionsRemoveAction = createAction(REALTIME_GRADEBOOK_TEST_QUESTION_REMOVE);
export const realtimeGradebookQuestionAddMaxScoreAction = createAction(REALTIME_GRADEBOOK_TEST_QUESTION_ADD_MAXSCORE);

export const realtimeGradebookRedirectAction = createAction(REALTIME_GRADEBOOK_REDIRECT);
export const realtimeGradebookCloseAction = createAction(REALTIME_GRADEBOOK_CLOSE_ASSIGNMENT);
export const realtimeUpdateAssignmentAction = createAction(REALTIME_GRADEBOOK_UPDATE_ASSIGNMENT);
export const recalculateAdditionalDataAction = createAction(RECALCULATE_ADDITIONAL_DATA);

const initialState = {
  entities: [],
  removedStudents: [],
  classStudents: [],
  currentTestActivityId: "",
  allTestActivitiesForStudent: [],
  error: null,
  loading: false,
  presentationMode: false
};

const reducer = (state = initialState, { type, payload }) => {
  let nextState;
  switch (type) {
    case RECEIVE_TESTACTIVITY_REQUEST:
      return { ...state, loading: true, assignmentId: payload.assignmentId, classId: payload.classId };
    case RECEIVE_TESTACTIVITY_SUCCESS:
      return {
        ...state,
        loading: false,
        data: payload.gradebookData,
        entities: transformGradeBookResponse(payload.gradebookData),
        additionalData: payload.additionalData,
        removedStudents: payload.gradebookData.exStudents
      };

    case RECALCULATE_ADDITIONAL_DATA:
      return {
        ...state,
        /**
         * justified use of cloneDeep because,
         * I just want to rerender the components
         * that depends on the additional data
         * to recheck the assignment start date / due date
         */
        additionalData: cloneDeep(state.additionalData)
      };
    case SET_CURRENT_TESTACTIVITY:
      return {
        ...state,
        currentTestActivityId: payload
      };

    case SET_ALL_TESTACTIVITIES_FOR_STUDENT:
      return {
        ...state,
        allTestActivitiesForStudent: payload
      };
    case REALTIME_GRADEBOOK_TEST_ACTIVITY_ADD:
      let entity = payload;
      nextState = produce(state, _st => {
        if (!state.allTestActivitiesForStudent.includes(entity.testActivityId)) {
          _st.allTestActivitiesForStudent.push(entity.testActivityId);
        }

        const index = _st.entities.findIndex(x => x.studentId === entity.studentId);
        if (index != -1) {
          _st.entities[index].status = "inProgress";
          _st.entities[index].score = 0;
          if (_st.entities[index].testActivityId) {
            _st.currentTestActivityId = _st.entities[index].testActivityId;
          }
          _st.entities[index].testActivityId = entity.testActivityId;
        } else {
          console.warn(`can't find any testactivity for studentId ${entity.studentId}`);
        }
      });
      return nextState;

    case REALTIME_GRADEBOOK_UPDATE_ASSIGNMENT:
      return produce(state, _state => {
        const { status, ...otherProps } = payload;
        if (status) {
          if (_state.data.status === "NOT OPEN" && status === "IN PROGRESS") {
            _state.additionalData.canCloseClass = [_state.additionalData.classId];
          }
          _state.data.status = status;
        }
        Object.assign(_state.additionalData, otherProps);
      });

    case REALTIME_GRADEBOOK_TEST_ACTIVITY_SUBMIT:
      nextState = produce(state, _st => {
        const { testActivityId } = payload;
        const entityIndex = _st.entities.findIndex(x => x.testActivityId === testActivityId);
        if (entityIndex != -1) {
          _st.entities[entityIndex].status = "submitted";
          for (let qAct of _st.entities[entityIndex].questionActivities) {
            if (qAct.notStarted) {
              qAct.skipped = true;
              qAct.notStarted = undefined;
              qAct.score = 0;
            }
          }
        }
      });
      return nextState;

    case REALTIME_GRADEBOOK_TEST_QUESTION_REMOVE:
      nextState = produce(state, _st => {
        /**
         * @type string[]
         */
        const questionIds = payload;
        let questionIdsMaxScore = {};
        for (let qid of questionIds) {
          questionIdsMaxScore[qid] = getMaxScoreOfQid(qid, _st.data.testItemsData);
        }
        for (let entity of _st.entities) {
          const matchingQids = entity.questionActivities.filter(x => questionIds.includes(x._id));
          entity.maxScore -= matchingQids.reduce((prev, qid) => prev + (questionIdsMaxScore[qid] || 0), 0);
          entity.questionActivities = entity.questionActivities.filter(x => !questionIds.includes(x._id));
        }
      });
      return nextState;
    case REALTIME_GRADEBOOK_TEST_QUESTION_ADD_MAXSCORE:
      nextState = produce(state, _st => {
        let questionIdsMaxScore = {};
        for (let { qid, maxScore } of payload) {
          questionIdsMaxScore[qid] = maxScore;
        }
        const questionIds = payload.map(x => x.qid);
        for (let entity of _st.entities) {
          const matchingQids = entity.questionActivities.filter(x => questionIds.includes(x._id));
          entity.maxScore += matchingQids.reduce((prev, qid) => prev + (questionIdsMaxScore[qid] || 0), 0);
        }
      });
      return nextState;
    case GRADEBOOK_TEST_ITEM_ADD:
      nextState = produce(state, _st => {
        for (const { testActivityId, score, maxScore, ...questionItem } of payload) {
          const entityIndex = _st.entities.findIndex(x => x.testActivityId === testActivityId);
          if (entityIndex != -1) {
            const itemIndex = _st.entities[entityIndex].questionActivities.findIndex(x => x._id == questionItem._id);
            if (itemIndex == -1) {
              _st.entities[entityIndex].questionActivities.push(questionItem);
            } else {
              if (!maxScore && (score || score === 0)) {
                delete _st.entities[entityIndex].questionActivities[itemIndex].notStarted;
                const oldQAct = _st.entities[entityIndex].questionActivities[itemIndex];
                _st.entities[entityIndex].questionActivities[itemIndex] = { ...oldQAct, ...questionItem, score };
              } else {
                delete _st.entities[entityIndex].questionActivities[itemIndex].notStarted;
                const oldQAct = _st.entities[entityIndex].questionActivities[itemIndex];
                if (oldQAct.timeSpent) {
                  questionItem.timeSpent = (questionItem.timeSpent || 0) + oldQAct.timeSpent;
                }
                _st.entities[entityIndex].questionActivities[itemIndex] = {
                  ...oldQAct,
                  ...questionItem,
                  score,
                  maxScore
                };
              }
            }
            if (score || score === 0) {
              _st.entities[entityIndex].score = _st.entities[entityIndex].questionActivities.reduce(
                (acc, x) => acc + (x.score || 0),
                0
              );
            }
          } else {
            console.warn(`can't find any testactivity for testActivityId ${testActivityId}`);
          }
        }
      });
      return nextState;
    case REALTIME_GRADEBOOK_REDIRECT:
      const { specificStudents, students } = payload;
      nextState = produce(state, _st => {
        if (specificStudents && students.length > 0) {
          const studentIndexes = students
            .map(studentId => _st.entities.findIndex(x => x.studentId === studentId))
            .filter(x => x > -1);
          for (let index of studentIndexes) {
            _st.entities[index].status = "redirected";
            _st.entities[index].redirected = true;
            _st.entities[index].score = 0;
            _st.entities[index].testActivityId = undefined;
            _st.entities[index].questionActivities = _st.entities[index].questionActivities.map(({ _id }) => ({
              _id,
              notStarted: true
            }));
          }
        }
      });
      return nextState;
    case RECEIVE_TESTACTIVITY_ERROR:
      return { ...state, loading: false, error: payload.error };

    case UPDATE_ASSIGNMENT_STATUS:
      return {
        ...state,
        data: {
          ...state.data,
          status: payload
        }
      };
    case TOGGLE_PRESENTATION_MODE:
      return {
        ...state,
        presentationMode: !state.presentationMode
      };
    case UPDATE_OPEN_ASSIGNMENTS:
      return {
        ...state,
        data: {
          ...state.data,
          status: "IN PROGRESS"
        },
        additionalData: {
          ...state.additionalData,
          canOpenClass: state.additionalData.canOpenClass.filter(item => item !== payload.classId)
        }
      };

    case SET_IS_PAUSED:
      return {
        ...state,
        additionalData: {
          ...state.additionalData,
          isPaused: payload
        }
      };
    case UPDATE_CLOSE_ASSIGNMENTS:
      return {
        ...state,
        additionalData: {
          ...state.additionalData,
          canCloseClass: state.additionalData.canCloseClass.filter(item => item !== payload.classId),
          closed: true,
          classesCanBeMarked: [...state.additionalData.classesCanBeMarked, payload.classId]
        }
      };
    case REALTIME_GRADEBOOK_CLOSE_ASSIGNMENT:
      return {
        ...state,
        additionalData: {
          ...state.additionalData,
          closed: true
        }
      };
    case UPDATE_REMOVED_STUDENTS_LIST: {
      const updatedStudents = state.entities.map(item => {
        if (payload.includes(item.studentId)) {
          return { ...item, status: "absent" };
        }
        return item;
      });
      return {
        ...state,
        entities: updatedStudents
      };
    }
    case UPDATE_SUBMITTED_STUDENTS: {
      const updatedActivityByUserId = keyBy(payload, "userId");
      const updatedStudents = state.entities.map(item => {
        const updatedActivity = updatedActivityByUserId[item.studentId];
        if (updatedActivity) {
          return {
            ...item,
            status: "submitted",
            graded: updatedActivity.gradedAll,
            score: updatedActivity.score,
            testActivityId: updatedActivity._id
          };
        }
        return item;
      });
      return {
        ...state,
        entities: updatedStudents
      };
    }
    case UPDATE_STUDENTS_LIST:
      return {
        ...state,
        removedStudents: [...state.removedStudents, ...payload]
      };
    case UPDATE_CLASS_STUDENTS_LIST:
      return {
        ...state,
        classStudents: payload
      };
    case SET_STUDENTS_GRADEBOOK:
      //take out newly added students from class students
      const pickClassStudentsObj = state.classStudents.filter(item => payload.includes(item._id));

      //create presenttation data  for new students
      const fakeData = createFakeData(pickClassStudentsObj.length);

      //map students data as per test activity api students object structure
      const studentsData = pickClassStudentsObj.map((student, index) => ({
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        ...fakeData[index]
      }));

      const activeStudents = state.data.students.filter(item => !state.removedStudents.includes(item.studentId));
      const dataToTransform = {
        ...state.data,
        students: [...activeStudents, ...studentsData]
      };

      return {
        ...state,
        //update if removed students are added again
        removedStudents: state.removedStudents.filter(item => !payload.includes(item)),
        data: {
          ...state.data,
          //merge newly added student to gradebook entity and student object
          students: [...activeStudents, ...studentsData]
        },
        entities: uniqBy(transformGradeBookResponse(dataToTransform), "studentId")
      };
    default:
      return state;
  }
};

export default reducer;
