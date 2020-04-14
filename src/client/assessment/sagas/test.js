import { testActivityApi, testsApi, assignmentApi, attchmentApi as attachmentApi } from "@edulastic/api";
import { takeEvery, call, all, put, select, take } from "redux-saga/effects";
import { Modal, message } from "antd";
import { push } from "react-router-redux";
import { keyBy as _keyBy, groupBy, get, flatten, cloneDeep } from "lodash";
import produce from "immer";
import { test as testContants } from "@edulastic/constants";
import { ShuffleChoices } from "../utils/test";
import { getCurrentGroupWithAllClasses } from "../../student/Login/ducks";
import { markQuestionLabel } from "../Transformer";
import {
  LOAD_TEST,
  LOAD_TEST_ITEMS,
  SET_TEST_ID,
  FINISH_TEST,
  LOAD_PREVIOUS_RESPONSES,
  LOAD_ANSWERS,
  SET_TEST_ACTIVITY_ID,
  LOAD_SCRATCH_PAD,
  LOAD_TEST_LEVEL_USER_WORK,
  SET_TEST_LOADING_STATUS,
  GET_ASSIGNMENT_PASSWORD,
  TEST_ACTIVITY_LOADING,
  SET_TEST_LOADING_ERROR,
  LOAD_PREVIOUS_ANSWERS,
  ADD_ITEM_EVALUATION,
  LOAD_PREVIOUS_RESPONSES_REQUEST,
  REMOVE_PREVIOUS_ANSWERS,
  CLEAR_USER_WORK
} from "../constants/actions";
import { loadQuestionsAction } from "../actions/questions";
import { loadBookmarkAction } from "../sharedDucks/bookmark";
import { setPasswordValidateStatusAction, setPasswordStatusAction } from "../actions/test";
import { setShuffledOptions } from "../actions/shuffledOptions";
import { SET_RESUME_STATUS } from "../../student/Assignments/ducks";
import { CLEAR_ITEM_EVALUATION, CHANGE_VIEW } from "../../author/src/constants/actions";
import { addAutoselectGroupItems } from "../../author/TestPage/ducks";
import { PREVIEW } from "../constants/constantsForQuestions";

const { ITEM_GROUP_DELIVERY_TYPES } = testContants;

const modifyTestDataForPreview = test =>
  produce(test, draft => {
    const { itemGroups } = draft;
    for (const group of itemGroups) {
      if (group.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM && group.deliverItemsCount) {
        group.items = group.items.filter((_, i) => i < group.deliverItemsCount);
      }
    }
  });

const getQuestions = (testItems = []) => {
  const allQuestions = [];

  testItems.forEach(item => {
    if (item.data) {
      const { questions = [], resources = [] } = item.data;
      allQuestions.push(...questions, ...resources);
    }
  });

  return allQuestions;
};

function* loadTest({ payload }) {
  const {
    testActivityId,
    testId,
    preview = false,
    demo = false,
    test: testData = {},
    groupId: groupIdFromUrl,
    isShowStudentWork = false,
    playlistId,
    currentAssignmentId
  } = payload;
  try {
    // if the assessment player is loaded for showing student work
    // we shouldn't be removing evaluation and answers from store.
    if (!isShowStudentWork) {
      yield put({
        type: CLEAR_ITEM_EVALUATION
      });

      yield put({
        type: REMOVE_PREVIOUS_ANSWERS
      });
    }
    yield put({
      type: SET_TEST_LOADING_STATUS,
      payload: true
    });
    yield put({
      type: TEST_ACTIVITY_LOADING,
      payload: true
    });
    yield put(setPasswordValidateStatusAction(false));

    yield put({
      type: SET_TEST_ID,
      payload: {
        testId
      }
    });

    // for urls that doesnt have groupId, fallback
    const groupId = groupIdFromUrl || (yield select(getCurrentGroupWithAllClasses));

    // if !preivew, need to load previous responses as well!
    const getTestActivity = !preview ? call(testActivityApi.getById, testActivityId, groupId) : false;
    const testRequest = !demo
      ? call(preview ? testsApi.getById : testsApi.getByIdMinimal, testId, {
          validation: true,
          data: true,
          groupId,
          testActivityId,
          ...(playlistId ? { playlistId } : {}),
          ...(currentAssignmentId ? { assignmentId: currentAssignmentId } : {})
        }) // when preview(author side) use normal non cached api
      : call(testsApi.getPublicTest, testId);
    const [testActivity] = yield all([getTestActivity]);
    if (!preview) {
      const isFromSummary = yield select(state => get(state, "router.location.state.fromSummary", false));
      let passwordValidated =
        testActivity.assignmentSettings.passwordPolicy === testContants.passwordPolicy.REQUIRED_PASSWORD_POLICY_OFF ||
        isFromSummary;
      if (passwordValidated) {
        yield put(setPasswordValidateStatusAction(true));
      }

      yield put({
        type: CHANGE_VIEW,
        payload: {
          view: PREVIEW
        }
      });

      yield put({
        type: TEST_ACTIVITY_LOADING,
        payload: false
      });
      while (!passwordValidated) {
        try {
          const { payload: _payload } = yield take(GET_ASSIGNMENT_PASSWORD);
          const response = yield call(assignmentApi.validateAssignmentPassword, {
            assignmentId: testActivity.testActivity.assignmentId,
            password: _payload,
            groupId
          });
          if (response === "successful") {
            passwordValidated = true;
          } else if (response === "unsuccessful") {
            yield put(setPasswordStatusAction("You have entered an invalid password"));
          } else {
            yield put(setPasswordStatusAction("validation failed"));
          }
        } catch (err) {
          if (err?.status === 403) {
            yield put(setPasswordStatusAction(err.data.message));
          } else {
            yield put(setPasswordStatusAction("validation failed"));
          }
          console.log(err);
        }
      }
      yield put(setPasswordStatusAction(""));
    }
    const isAuthorReview = Object.keys(testData).length > 0;
    let [test] = isAuthorReview ? [cloneDeep(testData)] : yield all([testRequest]);
    if (
      preview &&
      test.itemGroups.some(
        (group = {}) => group.type === testContants.ITEM_GROUP_TYPES.AUTOSELECT && !group.items?.length
      )
    ) {
      test = yield addAutoselectGroupItems({ payload: test, preview });
    }
    if (preview && test.itemGroups?.some(group => group.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM)) {
      // for all limited random group update items as per number of delivery items count
      test = modifyTestDataForPreview(test);
    }
    test.testItems = test.itemGroups.flatMap(itemGroup => itemGroup.items || []);
    if (
      testActivity?.assignmentSettings?.questionsDelivery ===
        testContants.redirectPolicy.QuestionDelivery.SKIPPED_AND_WRONG &&
      testActivity.itemsToBeExcluded?.length
    ) {
      // mutating to filter the excluded items as the settings is to show SKIPPED AND WRONG
      test.testItems = test.testItems.filter(item => !testActivity.itemsToBeExcluded.includes(item._id));
    }
    // eslint-disable-next-line prefer-const
    let { testItems, passages, testType } = test;
    const settings = {
      // graphing calculator is not present for EDULASTIC so defaulting to DESMOS for now, below work around should be removed once EDULASTIC calculator is built
      calcProvider:
        testActivity?.testActivity?.calcType === testContants.calculatorTypes.GRAPHING ||
        test.calcType === testContants.calculatorTypes.GRAPHING
          ? "DESMOS"
          : testActivity?.calculatorProvider,
      calcType: testActivity?.assignmentSettings?.calcType || test.calcType || testContants.calculatorTypes.NONE,
      maxAnswerChecks: testActivity?.assignmentSettings?.maxAnswerChecks || 0,
      passwordPolicy:
        testActivity?.assignmentSettings?.passwordPolicy || testContants.passwordPolicy.REQUIRED_PASSWORD_POLICY_OFF,
      showPreviousAttempt: testActivity?.assignmentSettings?.showPreviousAttempt || "NONE",
      testType: testActivity?.assignmentSettings?.testType,
      playerSkinType: testActivity?.assignmentSettings?.playerSkinType,
      showMagnifier: testActivity?.assignmentSettings?.showMagnifier,
      endDate: testActivity?.assignmentSettings?.endDate,
      closePolicy: testActivity?.assignmentSettings?.closePolicy,
      timedAssignment: testActivity?.assignmentSettings?.timedAssignment,
      allowedTime: testActivity?.assignmentSettings?.allowedTime,
      pauseAllowed: testActivity?.assignmentSettings?.pauseAllowed
    };

    const answerCheckByItemId = {};
    (testActivity.questionActivities || []).forEach(item => {
      answerCheckByItemId[item.testItemId] = item.answerChecksUsedForItem;
    });

    // if testActivity is present.
    if (!preview) {
      let allAnswers = {};
      let allPrevAnswers = {};
      let allEvaluation = {};

      const { testActivity: activity, questionActivities = [], previousQuestionActivities = [] } = testActivity;
      // load bookmarks
      const qActivitiesGroupedByTestItem = groupBy(questionActivities, "testItemId");
      const bookmarks = {};
      for (const _id of Object.keys(qActivitiesGroupedByTestItem)) {
        const isBookmarked = qActivitiesGroupedByTestItem[_id].some(item => item.bookmarked);
        bookmarks[_id] = isBookmarked;
      }
      yield put(loadBookmarkAction(bookmarks));

      let shuffles;
      if (activity.shuffleAnswers) {
        [testItems, shuffles] = ShuffleChoices(testItems, questionActivities);
        yield put(setShuffledOptions(shuffles));
      }
      yield put({
        type: SET_TEST_ACTIVITY_ID,
        payload: { testActivityId }
      });

      let lastAttemptedQuestion = questionActivities[0] || {};
      const previousQActivitiesById = groupBy(previousQuestionActivities, "testItemId");
      const scratchPadData = {};
      const prevScratchPadData = {};
      previousQuestionActivities.forEach(item => {
        allPrevAnswers = {
          ...allPrevAnswers,
          [item.qid]: item.userResponse
        };
        allEvaluation = {
          ...allEvaluation,
          [item.qid]: item.evaluation
        };
        if (item.scratchPad) {
          prevScratchPadData[item.testItemId] = item.scratchPad;
        }
      });

      yield put({
        type: ADD_ITEM_EVALUATION,
        payload: {
          ...allEvaluation
        }
      });
      yield put({
        type: LOAD_PREVIOUS_ANSWERS,
        payload: allPrevAnswers
      });

      yield put({
        type: LOAD_PREVIOUS_RESPONSES,
        payload: previousQActivitiesById
      });

      const testItemIds = testItems.map(i => i._id);
      const { attachments = [] } = yield call(attachmentApi.loadAllAttachments, {
        referrerId: testActivityId
      });

      attachments.forEach(attachment => {
        scratchPadData[attachment.referrerId2] = attachment.data;
      });

      questionActivities.forEach(item => {
        allAnswers = {
          ...allAnswers,
          [item.qid]: item.userResponse
        };
        if (item.scratchPad) {
          scratchPadData[item.testItemId] = {
            ...item.scratchPad,
            ...scratchPadData[item.testItemId]
          };
        }
        // land on the testItems which is next to testItem that is attempted and has the highest index
        // https://snapwiz.atlassian.net/browse/EV-7530 check the comments.
        if (testItemIds.indexOf(item.testItemId) > testItemIds.indexOf(lastAttemptedQuestion.testItemId)) {
          lastAttemptedQuestion = item;
        }
      });
      if (Object.keys(scratchPadData).length) {
        yield put({
          type: LOAD_SCRATCH_PAD,
          payload: scratchPadData
        });
      }

      const testUserWork = get(activity, "userWork");
      if (testUserWork) {
        yield put({
          type: LOAD_TEST_LEVEL_USER_WORK,
          payload: { [testActivityId]: testUserWork }
        });
      }

      // get currentItem index;
      let lastAttendedQuestion = 0;
      if (lastAttemptedQuestion && lastAttemptedQuestion.testItemId) {
        test.testItems.forEach((item, index) => {
          if (item._id === lastAttemptedQuestion.testItemId) {
            lastAttendedQuestion = index;
          }
        });
      }
      if (lastAttendedQuestion !== test.testItems.length - 1) {
        lastAttendedQuestion++;
      }
      // load previous responses
      yield put({
        type: LOAD_ANSWERS,
        payload: allAnswers
      });

      // only load from previous attempted if resuming from assignments page
      const loadFromLast = yield select(state => state.test && state.test.resume);

      // carryForward the prev locaation state in case of playlist flow
      const prevLocationState = yield select(state => state?.router?.location?.state) || {};

      // move to last attended question
      if (loadFromLast && testType !== testContants.type.TESTLET) {
        yield put(push({ pathname: `${lastAttendedQuestion}`, state: prevLocationState }));
        yield put({
          type: SET_RESUME_STATUS,
          payload: false
        });
      }
    }
    if (!isShowStudentWork) markQuestionLabel(testItems);
    let questions = getQuestions(testItems);
    if (test.passages) {
      const passageItems = test.passages.map(passage => passage.data || []);
      questions = [...flatten(passageItems), ...questions];
    }
    yield put(loadQuestionsAction(_keyBy(questions, "id")));

    // test items are put into store after shuffling questions sometimes..
    // hence dont frigging move this, and this better stay at the end!

    yield put({
      type: LOAD_TEST_ITEMS,
      payload: {
        passages,
        items: testItems,
        title: test.title,
        testType: settings.testType || test.testType,
        playerSkinType: settings.playerSkinType || test.playerSkinType,
        testletConfig: test.testletConfig,
        annotations: test.annotations,
        docUrl: test.docUrl,
        isDocBased: test.isDocBased,
        pageStructure: test.pageStructure,
        freeFormNotes: test.freeFormNotes,
        settings,
        answerCheckByItemId,
        showMagnifier: settings.showMagnifier || test.showMagnifier
      }
    });
    yield put(setPasswordValidateStatusAction(true));

    yield put({
      type: SET_TEST_LOADING_STATUS,
      payload: false
    });
  } catch (err) {
    if (err.status === 403 && preview) {
      yield call(message.error, "You can no longer use this as sharing access has been revoked by author.");
      Modal.destroyAll();
    }
    yield put({
      type: SET_TEST_LOADING_ERROR
    });
    console.error(err);
  }
}

// load users previous responses for a particular test
function* loadPreviousResponses(payload) {
  try {
    const { previousQuestionActivities } = payload;
    yield put({
      type: LOAD_PREVIOUS_RESPONSES,
      payload: { previousQuestionActivities }
    });
  } catch (err) {
    console.log(err);
  }
}

function* submitTest({ payload }) {
  try {
    const [classId, preventRouteChange] =
      typeof payload === "string" ? [payload] : [payload.groupId, payload.preventRouteChange];
    const testActivityId = yield select(state => state.test && state.test.testActivityId) || payload.testActivityId;
    const groupId = classId || (yield select(getCurrentGroupWithAllClasses));
    if (testActivityId === "test") {
      return;
    }
    yield testActivityApi.submit(testActivityId, groupId);
    yield put({
      type: SET_TEST_ACTIVITY_ID,
      payload: { testActivityId: "" }
    });
    yield put({
      type: CLEAR_USER_WORK
    });
    if (navigator.userAgent.includes("SEB")) {
      return yield put(push("/student/seb-quit-confirm"));
    }
    const prevLocationState = yield select(state => state?.router?.location?.state);
    if (prevLocationState?.playlistRecommendationsFlow) {
      return yield put(
        push({
          pathname: `/home/playlist/${prevLocationState?.playlistId}/recommendations`,
          state: { currentGroupId: groupId }
        })
      );
    }
    if (prevLocationState?.playlistAssignmentFlow) {
      return yield put(
        push({ pathname: `/home/playlist/${prevLocationState?.playlistId}`, state: { currentGroupId: groupId } })
      );
    }
    if (preventRouteChange) return;
    return yield put(push("/home/grades"));
  } catch (err) {
    if (err.status === 403) {
      console.log(err);
      if (err?.data?.message === "assignment already submitted") {
        return yield put(push("/home/grades"));
      } else {
        yield put(push("/home/assignments"));
        yield put({
          type: SET_TEST_ACTIVITY_ID,
          payload: { testActivityId: "" }
        });
        yield call(message.error, err.data);
      }
    }
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(LOAD_TEST, loadTest),
    yield takeEvery(FINISH_TEST, submitTest),
    yield takeEvery(LOAD_PREVIOUS_RESPONSES_REQUEST, loadPreviousResponses)
  ]);
}
