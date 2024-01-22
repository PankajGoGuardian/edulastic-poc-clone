import { createAction } from 'redux-starter-kit'
import { keyBy, cloneDeep } from 'lodash'
import { produce } from 'immer'
import { testActivityStatus } from '@edulastic/constants'
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
  SET_ALL_TESTACTIVITIES_FOR_STUDENT,
  UPDATE_SUBMITTED_STUDENTS,
  TOGGLE_VIEW_PASSWORD_MODAL,
  UPDATE_PASSWORD_DETAILS,
  RECEIVE_STUDENT_RESPONSE_SUCCESS,
  RESPONSE_ENTRY_SCORE_SUCCESS,
  UPDATE_PAUSE_STATUS_ACTION,
  SET_UPDATED_ACTIVITY_IN_ENTITY,
  RELOAD_LCB_DATA_IN_STUDENT_VIEW,
} from '../constants/actions'
import {
  transformGradeBookResponse,
  getMaxScoreOfQid,
  getResponseTobeDisplayed,
} from '../../ClassBoard/Transformer'

export const REALTIME_GRADEBOOK_TEST_ACTIVITY_ADD =
  '[gradebook] realtime test activity add'
export const REALTIME_GRADEBOOK_TEST_ACTIVITY_SUBMIT =
  '[gradebook] realtime test activity submit'
export const GRADEBOOK_TEST_ITEM_ADD = '[gradebook] test item add'

export const REALTIME_GRADEBOOK_TEST_QUESTION_REMOVE =
  '[gradebook] realtime test question remove'
export const REALTIME_GRADEBOOK_TEST_QUESTION_ADD_MAXSCORE =
  '[gradebook] realtime test question add max score'
export const REALTIME_GRADEBOOK_REDIRECT =
  '[gradebook] realtime assignment redirect'

export const REALTIME_GRADEBOOK_CLOSE_ASSIGNMENT =
  '[gradebook] realtime close assignment'
export const REALTIME_GRADEBOOK_UPDATE_ASSIGNMENT =
  '[gradebook] realtime gradebook update assignment'
export const SET_PROGRESS_STATUS = '[gradebook] set progress status'
export const LCB_ACTION_PROGRESS = '[gradebook] action progress tatus'
export const SET_ADDED_STUDENTS = '[gradebook] action added students'
export const UPDATE_SERVER_TIME = '[gradebook] update server time'
/**
 * force rerendering the components that depends on
 * additional data thus checking
 * due date / open date to recalculate the status of the assignment
 */
export const RECALCULATE_ADDITIONAL_DATA =
  '[gradebook] recalculate additional data'
/**
 * in student view , setting correct/wrong/partially correct/not graded filter
 */
export const SET_STUDENT_VIEW_FILTER = '[gradebook] set studentview filter'
export const SET_SHOW_ALL_STUDENTS = '[gradebook]] set show all students filter'
export const SET_PAGE_NUMBER = '[lcb] set page number action'
export const SET_LCB_QUESTION_LOADER_STATE =
  '[lcb] set lcb question loader state'
export const SET_QUESTION_ID_TO_SCROLL = '[lcb] set question id to scroll'
export const UPDATE_ADDITIONAL_DATA = '[lcb] update additional data'
export const SET_INTERVENTIONS_DATA = '[lcb] update interventions data in uta'

export const realtimeGradebookActivityAddAction = createAction(
  REALTIME_GRADEBOOK_TEST_ACTIVITY_ADD
)
export const realtimeGradebookActivitySubmitAction = createAction(
  REALTIME_GRADEBOOK_TEST_ACTIVITY_SUBMIT
)
export const gradebookTestItemAddAction = createAction(GRADEBOOK_TEST_ITEM_ADD)
export const realtimeGradebookQuestionsRemoveAction = createAction(
  REALTIME_GRADEBOOK_TEST_QUESTION_REMOVE
)
export const realtimeGradebookQuestionAddMaxScoreAction = createAction(
  REALTIME_GRADEBOOK_TEST_QUESTION_ADD_MAXSCORE
)

export const realtimeGradebookRedirectAction = createAction(
  REALTIME_GRADEBOOK_REDIRECT
)
export const realtimeGradebookCloseAction = createAction(
  REALTIME_GRADEBOOK_CLOSE_ASSIGNMENT
)
export const realtimeUpdateAssignmentAction = createAction(
  REALTIME_GRADEBOOK_UPDATE_ASSIGNMENT
)
export const recalculateAdditionalDataAction = createAction(
  RECALCULATE_ADDITIONAL_DATA
)
export const setPageNumberAction = createAction(SET_PAGE_NUMBER)
export const setLcbQuestionLoaderStateAcion = createAction(
  SET_LCB_QUESTION_LOADER_STATE
)
export const setQuestionIdToScrollAction = createAction(
  SET_QUESTION_ID_TO_SCROLL
)

export const setStudentViewFilterAction = createAction(SET_STUDENT_VIEW_FILTER)
export const setProgressStatusAction = createAction(SET_PROGRESS_STATUS)
export const setLcbActionProgress = createAction(LCB_ACTION_PROGRESS)
export const setShowAllStudentsAction = createAction(SET_SHOW_ALL_STUDENTS)
export const setAddedStudentsAction = createAction(SET_ADDED_STUDENTS)
export const updateServerTimeAction = createAction(UPDATE_SERVER_TIME)
export const updateAdditionalDataAction = createAction(UPDATE_ADDITIONAL_DATA)
export const setInterventionDataInUtaAction = createAction(
  SET_INTERVENTIONS_DATA
)

const initialState = {
  entities: [],
  removedStudents: [],
  addedStudents: [],
  classStudents: [],
  currentTestActivityId: '',
  allTestActivitiesForStudent: [],
  error: null,
  loading: false,
  presentationMode: false,
  viewPassword: false,
  studentViewFilter: null,
  isShowAllStudents: false,
  actionInProgress: false,
  pageNumber: 1,
  isQuestionsLoading: false,
  questionId: '',
}

const reducer = (state = initialState, { type, payload }) => {
  let nextState
  switch (type) {
    case RELOAD_LCB_DATA_IN_STUDENT_VIEW:
    case RECEIVE_TESTACTIVITY_REQUEST:
      return {
        ...state,
        loading: payload.loader,
        assignmentId: payload.assignmentId,
        classId: payload.classId,
      }
    case RECEIVE_TESTACTIVITY_SUCCESS:
      return {
        ...state,
        loading: false,
        data: payload.gradebookData,
        entities: payload.entities,
        additionalData: payload.additionalData,
        removedStudents: payload.gradebookData.exStudents,
        addedStudents: [],
      }

    case RECALCULATE_ADDITIONAL_DATA:
      return {
        ...state,
        entities: state.entities.map((x) => {
          if (x.status != 'notStarted') {
            return x
          }
          if (
            state?.data?.status === 'DONE' ||
            state?.additionalData?.endDate < Date.now()
          ) {
            return { ...x, status: 'absent', present: false }
          }
          return x
        }),
        /**
         * justified use of cloneDeep because,
         * I just want to rerender the components
         * that depends on the additional data
         * to recheck the assignment start date / due date
         */
        additionalData: cloneDeep(state.additionalData),
      }
    case SET_CURRENT_TESTACTIVITY:
      return {
        ...state,
        currentTestActivityId: payload,
      }

    case SET_ALL_TESTACTIVITIES_FOR_STUDENT:
      return {
        ...state,
        allTestActivitiesForStudent: payload,
      }
    case UPDATE_PAUSE_STATUS_ACTION: {
      const { result, isPaused } = payload
      const updatedUtas = keyBy(result)
      return {
        ...state,
        entities: state.entities.map((item) => {
          if (updatedUtas[item.testActivityId]) {
            return {
              ...item,
              isPaused,
              ...(isPaused
                ? {}
                : { pauseReason: undefined, tabNavigationCounter: null }),
            }
          }
          return item
        }),
      }
    }
    case RESPONSE_ENTRY_SCORE_SUCCESS:
      return produce(state, (_st) => {
        const userId = payload?.testActivity?.userId
        const testActivityId = payload?.testActivity?._id
        const attempt = _st.data.recentTestActivitiesGrouped[userId]?.find(
          (x) => x._id === testActivityId
        )
        if (attempt) {
          if (payload.testActivity?.score) {
            attempt.score = payload.testActivity?.score
          }
          if (payload.testActivity?.maxScore) {
            attempt.maxScore = payload.testActivity?.maxScore
          }
        }
      })
    case REALTIME_GRADEBOOK_TEST_ACTIVITY_ADD: {
      const entity = payload
      nextState = produce(state, (_st) => {
        if (
          !state.allTestActivitiesForStudent.includes(entity.testActivityId)
        ) {
          _st.allTestActivitiesForStudent.push(entity.testActivityId)
        }

        const index = _st.entities.findIndex(
          (x) => x.studentId === entity.studentId
        )
        if (index != -1) {
          if (_st.entities[index].testActivityId) {
            _st.currentTestActivityId = _st.entities[index].testActivityId
          }
          if (
            _st.entities[index].testActivityId != entity.testActivityId &&
            _st.entities[index].testActivityId
          ) {
            // a new attempt being added through realtime
            // handling for showing recent attempts
            const { studentId } = entity
            const {
              score,
              _score,
              maxScore,
              number,
              testActivityId,
            } = _st.entities[index]
            const oldAttempt = {
              _id: testActivityId,
              score: score || _score || 0,
              maxScore,
              number: number || 1,
            }
            _st.data.recentTestActivitiesGrouped[studentId] =
              _st.data.recentTestActivitiesGrouped[studentId] || []
            _st.data.recentTestActivitiesGrouped[studentId].unshift(oldAttempt)
            _st.data.recentTestActivitiesGrouped[
              studentId
            ] = _st.data.recentTestActivitiesGrouped[studentId].slice(0, 2)
            _st.entities[index].questionActivities = _st.entities[
              index
            ].questionActivities.map((x) => ({
              _id: x._id,
              weight: x.weight,
              notStarted: true,
              disabled: x.disabled,
              testItemId: x.testItemId,
              qids: x.qids,
              qLabel: x.qLabel,
              barLabel: x.barLabel,
            }))
          }
          _st.entities[index].testActivityId = entity.testActivityId
          _st.entities[index].status = 'inProgress'
          _st.entities[index].UTASTATUS = 0
          _st.entities[index].score = 0
          const isAutoselectItems = _st.entities[index].questionActivities.some(
            (a) => !a._id
          )
          if (isAutoselectItems) {
            const allItems = entity.itemsToDeliverInGroup
              .flatMap((g) => g.items)
              .map((id) => {
                const item = state.data.testItemsData.find(
                  (ti) => ti._id === id
                )
                if (item) return item
                return {
                  _id: id,
                  itemLevelScoring: true,
                }
              })
            const entityDataGenerated = transformGradeBookResponse({
              ..._st.data,
              testItemsData: allItems,
              ts: _st.additionalData.ts,
            }).find((e) => e.studentId === entity.studentId)

            _st.entities[index].questionActivities =
              entityDataGenerated.questionActivities
          }
        } else {
          console.warn(
            `can't find any testactivity for studentId ${entity.studentId}`
          )
        }
      })
      return nextState
    }
    case REALTIME_GRADEBOOK_UPDATE_ASSIGNMENT:
      return produce(state, (_state) => {
        const { status, ...otherProps } = payload
        if (status) {
          if (_state.data.status === 'NOT OPEN' && status === 'IN PROGRESS') {
            _state.additionalData.canCloseClass = [
              _state.additionalData.classId,
            ]
          }
          _state.data.status = status
        }
        Object.assign(_state.additionalData, otherProps)
        _state.entities = state.entities.map((x) => {
          if (x.status != 'notStarted') {
            return x
          }
          if (
            _state?.data?.status === 'DONE' ||
            _state?.additionalData?.endDate < Date.now()
          ) {
            return { ...x, status: 'absent', present: false }
          }
          return x
        })
      })

    case REALTIME_GRADEBOOK_TEST_ACTIVITY_SUBMIT:
      nextState = produce(state, (_st) => {
        const { testActivityId, graded } = payload
        const entityIndex = _st.entities.findIndex(
          (x) => x.testActivityId === testActivityId
        )
        if (entityIndex != -1) {
          _st.entities[entityIndex].status = 'submitted'
          _st.entities[entityIndex].graded = graded
          for (const qAct of _st.entities[entityIndex].questionActivities) {
            if (qAct.notStarted) {
              qAct.skipped = true
              qAct.notStarted = undefined
              qAct.score = 0
            }
          }
        }
      })
      return nextState

    case REALTIME_GRADEBOOK_TEST_QUESTION_REMOVE:
      nextState = produce(state, (_st) => {
        /**
         * @type string[]
         */
        const removedQuestions = payload
        const questionIdsMaxScore = {}
        for (const { qid, testItemId } of removedQuestions) {
          questionIdsMaxScore[`${testItemId}_${qid}`] = getMaxScoreOfQid(
            qid,
            _st.data.testItemsData
          )(testItemId)
        }
        for (const _entity of _st.entities) {
          const matchingQids = _entity.questionActivities.filter((x) =>
            removedQuestions.some(
              (r) => r.qid === x._id && r.testItemId === x.testItemId
            )
          )
          _entity.maxScore -= matchingQids.reduce(
            (prev, qid, testItemId) =>
              prev + (questionIdsMaxScore[`${testItemId}_${qid}`] || 0),
            0
          )
          _entity.questionActivities = _entity.questionActivities.filter(
            (x) =>
              !removedQuestions.some(
                (r) => r.qid === x._id && r.testItemId === x.testItemId
              )
          )
        }
      })
      return nextState
    case REALTIME_GRADEBOOK_TEST_QUESTION_ADD_MAXSCORE:
      nextState = produce(state, (_st) => {
        const questionIdsMaxScore = {}
        for (const { qid, maxScore } of payload) {
          questionIdsMaxScore[qid] = maxScore
        }
        const questionIds = payload.map((x) => x.qid)
        for (const _entity of _st.entities) {
          const matchingQids = _entity.questionActivities.filter((x) =>
            questionIds.includes(x._id)
          )
          _entity.maxScore += matchingQids.reduce(
            (prev, qid) => prev + (questionIdsMaxScore[qid] || 0),
            0
          )
        }
      })
      return nextState
    case GRADEBOOK_TEST_ITEM_ADD:
      nextState = produce(state, (_st) => {
        for (const {
          testActivityId,
          score,
          maxScore,
          ...questionItem
        } of payload) {
          const entityIndex = _st.entities.findIndex(
            (x) => x.testActivityId === testActivityId
          )

          if (entityIndex != -1) {
            const itemIndex = _st.entities[
              entityIndex
            ].questionActivities.findIndex(
              (x) =>
                x._id == questionItem._id ||
                (!x._id && x.testItemId === questionItem.testItemId)
            )
            if (itemIndex == -1) {
              _st.entities[entityIndex].questionActivities.push(questionItem)
            } else if (!maxScore && (score || score === 0)) {
              delete _st.entities[entityIndex].questionActivities[itemIndex]
                .notStarted
              const oldQAct =
                _st.entities[entityIndex].questionActivities[itemIndex]
              _st.entities[entityIndex].questionActivities[itemIndex] = {
                ...oldQAct,
                ...questionItem,
                score,
              }
            } else {
              delete _st.entities[entityIndex].questionActivities[itemIndex]
                .notStarted
              const oldQAct =
                _st.entities[entityIndex].questionActivities[itemIndex]
              if (oldQAct.timeSpent) {
                questionItem.timeSpent =
                  (questionItem.timeSpent || 0) + oldQAct.timeSpent
              }
              _st.entities[entityIndex].questionActivities[itemIndex] = {
                ...oldQAct,
                ...questionItem,
                score,
                maxScore,
                responseToDisplay: getResponseTobeDisplayed(
                  _st.data.testItemsDataKeyed[questionItem.testItemId],
                  questionItem.userResponse,
                  questionItem._id
                ),
              }
            }
            if (score || score === 0) {
              _st.entities[entityIndex].score = _st.entities[
                entityIndex
              ].questionActivities.reduce((acc, x) => acc + (x.score || 0), 0)
            }
          } else {
            console.warn(
              `can't find any testactivity for testActivityId ${testActivityId}`
            )
          }
        }
      })
      return nextState
    case REALTIME_GRADEBOOK_REDIRECT: {
      const { students } = payload
      nextState = produce(state, (_st) => {
        if (students.length > 0) {
          const studentIndexes = students
            .map((studentId) =>
              _st.entities.findIndex((x) => x.studentId === studentId)
            )
            .filter((x) => x > -1)
          for (const index of studentIndexes) {
            _st.entities[index].status = 'redirected'
            _st.entities[index].redirected = true
          }
        }
      })
      return nextState
    }
    case RECEIVE_TESTACTIVITY_ERROR:
      return { ...state, loading: false, error: payload.error }

    case UPDATE_ASSIGNMENT_STATUS:
      return {
        ...state,
        data: {
          ...state.data,
          status: payload,
        },
      }
    case TOGGLE_PRESENTATION_MODE:
      return {
        ...state,
        presentationMode: !state.presentationMode,
      }
    case TOGGLE_VIEW_PASSWORD_MODAL:
      return {
        ...state,
        viewPassword: !state.viewPassword,
      }
    case UPDATE_PASSWORD_DETAILS: {
      const {
        assignmentPassword = state?.additionalData?.assignmentPassword,
        passwordExpireTime = state?.additionalData?.passwordExpireTime,
        passwordExpireIn = state?.additionalData?.passwordExpireIn,
        ts = state?.additionalData?.ts,
      } = payload
      return {
        ...state,
        additionalData: {
          ...state.additionalData,
          assignmentPassword,
          passwordExpireTime,
          passwordExpireIn,
          ts,
        },
      }
    }
    case UPDATE_SERVER_TIME: {
      return {
        ...state,
        additionalData: {
          ...state.additionalData,
          ts: payload,
        },
      }
    }
    case UPDATE_OPEN_ASSIGNMENTS:
      return {
        ...state,
        data: {
          ...state.data,
          status: 'IN PROGRESS',
        },
        additionalData: {
          ...state.additionalData,
          canOpenClass:
            state.additionalData?.canOpenClass?.filter(
              (item) => item !== payload.classId
            ) || [],
          open: true,
        },
      }

    case SET_IS_PAUSED:
      return {
        ...state,
        additionalData: {
          ...state.additionalData,
          isPaused: payload,
        },
      }
    case UPDATE_CLOSE_ASSIGNMENTS:
      return {
        ...state,
        additionalData: {
          ...state.additionalData,
          canCloseClass:
            state?.additionalData?.canCloseClass?.filter(
              (item) => item !== payload.classId
            ) || [],
          // closed: true,
          classesCanBeMarked: [
            ...(state?.additionalData?.classesCanBeMarked || []),
            payload.classId,
          ],
        },
      }
    case REALTIME_GRADEBOOK_CLOSE_ASSIGNMENT:
      return {
        ...state,
        additionalData: {
          ...state.additionalData,
          closed: true,
        },
      }
    case UPDATE_REMOVED_STUDENTS_LIST: {
      const updatedStudents = state.entities.map((item) => {
        if (payload.includes(item.studentId)) {
          return {
            ...item,
            status: 'absent',
            isPaused: false,
            UTASTATUS: testActivityStatus.ABSENT,
          }
        }
        return item
      })
      return {
        ...state,
        entities: updatedStudents,
      }
    }
    case UPDATE_SUBMITTED_STUDENTS: {
      const updatedActivityByUserId = keyBy(payload, 'userId')
      const updatedStudents = state.entities.map((item) => {
        const updatedActivity = updatedActivityByUserId[item.studentId]
        if (updatedActivity) {
          return {
            ...item,
            status: 'submitted',
            UTASTATUS: updatedActivity.status,
            graded: updatedActivity.gradedAll ? 'GRADED' : 'IN GRADING',
            score: updatedActivity.score,
            testActivityId: updatedActivity._id,
            isPaused: false,
            questionActivities: item.questionActivities.map((qAct) => ({
              ...qAct,
              ...(qAct.notStarted
                ? { skipped: true, score: 0, notStarted: undefined }
                : {}),
            })),
          }
        }
        return item
      })
      return {
        ...state,
        entities: updatedStudents,
      }
    }
    case UPDATE_STUDENTS_LIST:
      return {
        ...state,
        entities: state.entities.map((item) => {
          if (payload.includes(item.studentId)) {
            return {
              ...item,
              isAssigned: false,
            }
          }
          return item
        }),
      }
    case UPDATE_CLASS_STUDENTS_LIST:
      return {
        ...state,
        classStudents: payload,
      }
    case SET_STUDENT_VIEW_FILTER:
      return {
        ...state,
        studentViewFilter: payload,
      }
    case RECEIVE_STUDENT_RESPONSE_SUCCESS:
      return {
        ...state,
        entities: state.entities.map((entity) => {
          if (
            payload.testActivity.userId === entity.studentId &&
            entity.testActivityId === payload.testActivity._id
          ) {
            return {
              ...entity,
              graded: payload?.testActivity?.graded || entity.graded,
              score: payload?.testActivity?.score || entity.score,
              questionActivities: payload.questionActivities,
            }
          }
          return entity
        }),
      }
    case SET_ADDED_STUDENTS:
      return {
        ...state,
        addedStudents: [...state.addedStudents, ...payload],
      }
    case SET_PROGRESS_STATUS:
      return {
        ...state,
        loading: payload,
      }
    case LCB_ACTION_PROGRESS:
      return {
        ...state,
        actionInProgress: payload,
      }
    case SET_SHOW_ALL_STUDENTS:
      return {
        ...state,
        isShowAllStudents: payload,
      }
    case SET_UPDATED_ACTIVITY_IN_ENTITY:
      return {
        ...state,
        entities: state.entities.map((item) => {
          const { oldActivityId, newActivityId } = payload
          if (item.testActivityId === oldActivityId) {
            return {
              ...item,
              testActivityId: newActivityId,
            }
          }
          return item
        }),
      }
    case SET_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: payload || state.pageNumber + 1,
      }
    case SET_LCB_QUESTION_LOADER_STATE:
      return {
        ...state,
        isQuestionsLoading: payload,
      }
    case SET_QUESTION_ID_TO_SCROLL:
      return {
        ...state,
        questionId: payload,
      }
    case UPDATE_ADDITIONAL_DATA:
      return {
        ...state,
        additionalData: {
          ...state.additionalData,
          ...payload,
        },
      }
    case SET_INTERVENTIONS_DATA:
      return {
        ...state,
        entities: state.entities.map((entity) => {
          if (entity.testActivityId === payload.testActivityId) {
            const { interventions = [] } = entity
            return {
              ...entity,
              interventions: [...interventions, payload.intervention],
            }
          }
          return entity
        }),
      }
    default:
      return state
  }
}

export default reducer
