import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { message } from "antd";
import { call, put, all, takeLatest, select } from "redux-saga/effects";
import { push } from "react-router-redux";
import pdfjs from "pdfjs-dist";
import { get, without } from "lodash";
import moment from "moment";

import { testsApi, testItemsApi } from "@edulastic/api";
import { aws } from "@edulastic/constants";
import { uploadToS3 } from "../src/utils/upload";
import { createBlankTest, getTestEntitySelector, setTestDataAction } from "../TestPage/ducks";
import { getUserSelector } from "../src/selectors/user";

export const CREATE_ASSESSMENT_REQUEST = "[assessmentPage] create assessment request";
export const CREATE_ASSESSMENT_SUCCESS = "[assessmentPage] create assessment success";
export const CREATE_ASSESSMENT_ERROR = "[assessmentPage] create assessment error";
export const SET_PERCENT_LOADED = "[assessmentPage] set assessment uploaded";

export const createAssessmentRequestAction = createAction(CREATE_ASSESSMENT_REQUEST);
export const createAssessmentSuccessAction = createAction(CREATE_ASSESSMENT_SUCCESS);
export const createAssessmentErrorAction = createAction(CREATE_ASSESSMENT_ERROR);
export const setPercentUploadedAction = createAction(SET_PERCENT_LOADED);

const initialState = {
  creating: false,
  error: undefined,
  percentageUpload: 0
};

const initialTestState = createBlankTest();

const createAssessmentRequest = state => ({
  ...state,
  creating: true,
  error: undefined
});

const createAssessmentSuccess = state => ({
  ...state,
  creating: false,
  percentageUpload: 0
});

const createAssessmentError = (state, { payload: { error } }) => ({
  ...state,
  creating: false,
  error
});

const setPercentageLoaded = (state, { payload }) => {
  state.percentageUpload = payload;
};

export const reducer = createReducer(initialState, {
  [CREATE_ASSESSMENT_REQUEST]: createAssessmentRequest,
  [CREATE_ASSESSMENT_SUCCESS]: createAssessmentSuccess,
  [CREATE_ASSESSMENT_ERROR]: createAssessmentError,
  [SET_PERCENT_LOADED]: setPercentageLoaded
});

const defaultTestItem = {
  isDocBased: true,
  itemLevelScoring: false,
  columns: [],
  data: {
    questions: [],
    resources: []
  },
  rows: [
    {
      tabs: [],
      dimension: "100%",
      widgets: []
    }
  ]
};

const defaultPageStructure = [
  {
    URL: "blank",
    pageNo: 1
  }
];

function* createAssessmentSaga({ payload }) {
  let fileURI = "";
  let testItem;
  let amountOfPDFPages = 0;
  let pageStructure = [];

  try {
    if (payload.file) {
      fileURI = yield call(uploadToS3, payload.file, aws.s3Folders.DOCS, null, payload.progressCallback);
    }
  } catch (error) {
    const errorMessage = "Upload PDF is failing";
    yield call(message.error, errorMessage);
    yield put(createAssessmentErrorAction({ error: errorMessage }));
    return;
  }
  try {
    if (!payload.assessmentId) {
      testItem = yield call(testItemsApi.create, defaultTestItem);
    }
  } catch (error) {
    const errorMessage = "Create test item is failing";
    yield call(message.error, errorMessage);
    yield put(createAssessmentErrorAction({ error: errorMessage }));
    return;
  }

  try {
    if (fileURI) {
      const pdfLoadingTask = pdfjs.getDocument(fileURI);

      const { numPages } = yield pdfLoadingTask.promise;
      amountOfPDFPages = numPages;

      pageStructure = new Array(amountOfPDFPages)
        .fill({
          URL: fileURI
        })
        .map((page, index) => ({
          ...page,
          pageNo: index + 1
        }));
    }

    if (payload.assessmentId) {
      const assessment = yield select(getTestEntitySelector);

      const assessmentPageStructure = get(assessment, "pageStructure", [])
        .filter(page => page.URL === "blank") // delete old pdf
        .concat(pageStructure)
        .map((page, index) => ({
          ...page,
          _id: undefined
        }));

      const newPageStructure = assessmentPageStructure.length ? assessmentPageStructure : defaultPageStructure;

      const updatedAssessment = {
        ...assessment,
        isDocBased: true,
        docUrl: fileURI,
        annotations: [],
        updatedDate: undefined,
        createdDate: undefined,
        assignments: undefined,
        pageStructure: newPageStructure
      };

      const updatePayload = {
        id: assessment._id,
        data: updatedAssessment
      };

      yield call(testsApi.update, updatePayload);

      yield put(setTestDataAction({ docUrl: fileURI, pageStructure: newPageStructure }));
      yield put(createAssessmentSuccessAction());
      yield put(push(`/author/assessments/${assessment._id}`));
    } else {
      const { user } = yield select(getUserSelector);
      const name = without([user.firstName, user.lastName], undefined, null, "").join(" ");
      const item = {
        itemId: testItem._id,
        maxScore: testItem.maxScore,
        questions: {}
      };
      const newAssessment = {
        ...initialTestState,
        title: `Untitled Test - ${moment().format("MM/DD/YYYY HH:mm")}`,
        createdBy: {
          id: user._id,
          name
        },
        isDocBased: true,
        testItems: [item],
        docUrl: fileURI,
        releaseScore: "DONT_RELEASE",
        assignments: undefined,
        pageStructure: pageStructure.length ? pageStructure : defaultPageStructure
      };
      if (newAssessment.requirePassword === false) {
        delete newAssessment.assignmentPassword;
      }
      const assessment = yield call(testsApi.create, newAssessment);
      yield put(createAssessmentSuccessAction());
      yield put(push(`/author/assessments/${assessment._id}`));
    }
  } catch (error) {
    const errorMessage = "Create assessment is failing";
    yield call(message.error, errorMessage);
    yield put(createAssessmentErrorAction({ error: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeLatest(CREATE_ASSESSMENT_REQUEST, createAssessmentSaga)]);
}

const getStateSelector = state => state.assessmentCreate;

export const getAssessmentCreatingSelector = createSelector(
  getStateSelector,
  state => state.creating
);

export const getAssessmentErrorSelector = createSelector(
  getStateSelector,
  state => state.error
);

export const percentageUploadedSelector = createSelector(
  getStateSelector,
  state => state.percentageUpload
);
