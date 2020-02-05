import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { message } from "antd";
import { call, put, all, takeLatest, select } from "redux-saga/effects";
import { push } from "react-router-redux";
import pdfjs from "pdfjs-dist";
import { get, without } from "lodash";

import { testsApi, testItemsApi, fileApi } from "@edulastic/api";
import { aws, roleuser, test as testConstant } from "@edulastic/constants";
import { helpers } from "@edulastic/common";
import { uploadToS3 } from "../src/utils/upload";
import {
  createBlankTest,
  getTestEntitySelector,
  setTestDataAction,
  getReleaseScorePremiumSelector
} from "../TestPage/ducks";
import { getUserSelector, getUserRole } from "../src/selectors/user";

export const CREATE_ASSESSMENT_REQUEST = "[assessmentPage] create assessment request";
export const CREATE_ASSESSMENT_SUCCESS = "[assessmentPage] create assessment success";
export const CREATE_ASSESSMENT_ERROR = "[assessmentPage] create assessment error";
export const SET_PERCENT_LOADED = "[assessmentPage] set assessment uploaded";
export const UPLOAD_TO_DRIVE_REQUEST = "[assesmentPage] upload to drive request";

export const createAssessmentRequestAction = createAction(CREATE_ASSESSMENT_REQUEST);
export const createAssessmentSuccessAction = createAction(CREATE_ASSESSMENT_SUCCESS);
export const createAssessmentErrorAction = createAction(CREATE_ASSESSMENT_ERROR);
export const setPercentUploadedAction = createAction(SET_PERCENT_LOADED);
export const uploadToDriveAction = createAction(UPLOAD_TO_DRIVE_REQUEST);

const initialState = {
  creating: false,
  error: undefined,
  percentageUpload: 0,
  fileName: null,
  fileSize: 0
};

const initialTestState = createBlankTest();

const createAssessmentRequest = (state, { payload: { file = {} } }) => {
  state.creating = true;
  state.error = undefined;
  state.fileName = file.name || null;
  state.fileSize = file.size || 0;
};

const createAssessmentSuccess = state => {
  state.creating = false;
  state.percentageUpload = 0;
};

const createAssessmentError = (state, { payload: { error } }) => {
  state.creating = false;
  state.error = error;
  state.percentageUpload = 0;
  state.fileName = null;
  state.fileSize = 0;
};

const setPercentageLoaded = (state, { payload }) => {
  state.percentageUpload = payload;
};

export const reducer = createReducer(initialState, {
  [CREATE_ASSESSMENT_REQUEST]: createAssessmentRequest,
  [CREATE_ASSESSMENT_SUCCESS]: createAssessmentSuccess,
  [CREATE_ASSESSMENT_ERROR]: createAssessmentError,
  [SET_PERCENT_LOADED]: setPercentageLoaded,
  [UPLOAD_TO_DRIVE_REQUEST]: state => {
    state.creating = true;
  }
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
      fileURI = yield call(
        uploadToS3,
        payload.file,
        aws.s3Folders.DOCS,
        null,
        payload.progressCallback,
        payload.cancelUpload
      );
    } else if (payload.fileURI) {
      fileURI = payload.fileURI;
    }
  } catch (error) {
    const errorMessage = error.message || "Upload PDF is failing";
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
    } else {
      pageStructure = defaultPageStructure;
    }

    if (payload.assessmentId) {
      const assessment = yield select(getTestEntitySelector);
      const { scoring } = assessment;
      const assessmentPageStructure = get(assessment, "pageStructure", [])
        .filter(page => page.URL === "blank" || payload.isAddPdf) // delete old pdf
        .concat(pageStructure)
        .map((page, index) => ({
          ...page,
          _id: undefined
        }));
      const newPageStructure = assessmentPageStructure.length ? assessmentPageStructure : defaultPageStructure;
      const updatedAssessment = {
        ...assessment,
        testItems: [],
        isDocBased: true,
        docUrl: fileURI,
        annotations: [],
        updatedDate: undefined,
        createdDate: undefined,
        assignments: undefined,
        authors: undefined,
        createdBy: undefined,
        passages: undefined,
        isUsed: undefined,
        scoring: undefined,
        sharedType: undefined,
        pageStructure: newPageStructure
      };

      updatedAssessment.testItems =
        assessment.testItems &&
        assessment.testItems.map(o => ({
          itemId: o._id,
          maxScore: scoring[o._id] || helpers.getPoints(o),
          questions: o.data
            ? helpers.getQuestionLevelScore(o, o.data.questions, helpers.getPoints(o), scoring[o._id])
            : {}
        }));

      const updatePayload = {
        id: assessment._id,
        data: updatedAssessment
      };

      const newTest = yield call(testsApi.update, updatePayload);

      yield put(setTestDataAction({ docUrl: fileURI, pageStructure: newPageStructure, version: newTest.version }));
      yield put(createAssessmentSuccessAction());
      yield put(push(`/author/assessments/${assessment._id}`));
    } else {
      const userRole = yield select(getUserRole);
      const isReleaseScorePremium = yield select(getReleaseScorePremiumSelector);
      const isAdmin = userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN;
      const releaseScore =
        userRole === roleuser.TEACHER && isReleaseScorePremium
          ? testConstant.releaseGradeLabels.WITH_RESPONSE
          : testConstant.releaseGradeLabels.DONT_RELEASE;
      const { user } = yield select(getUserSelector);
      const name = without([user.firstName, user.lastName], undefined, null, "").join(" ");
      const item = {
        itemId: testItem._id,
        maxScore: testItem.maxScore,
        questions: {}
      };
      const newAssessment = {
        ...initialTestState,
        title: undefined,
        createdBy: {
          id: user._id,
          name
        },
        isDocBased: true,
        itemGroups: [{ ...initialTestState.itemGroups[0], items: [item] }],
        docUrl: fileURI,
        releaseScore,
        assignments: undefined,
        pageStructure: pageStructure.length ? pageStructure : defaultPageStructure,
        ...(isAdmin ? { testType: testConstant.type.COMMON } : {})
      };
      if (newAssessment.passwordPolicy !== testConstant.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC) {
        delete newAssessment.assignmentPassword;
      }
      if (newAssessment.passwordPolicy !== testConstant.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC) {
        delete newAssessment.passwordExpireIn;
      }
      const assessment = yield call(testsApi.create, newAssessment);
      yield put(createAssessmentSuccessAction());
      yield put(push(`/author/assessments/${assessment._id}`));
    }
  } catch (error) {
    let errorMessage;
    if (error.code === 1) {
      errorMessage = "Password protected PDF files are not supported";
    } else {
      errorMessage = "Create assessment is failing";
    }
    yield call(message.error, errorMessage);
    yield put(createAssessmentErrorAction({ error: errorMessage }));
  }
}

function* uploadToDriveSaga({ payload }) {
  try {
    //TODO call the new api and create test
    const { token, id, name, size, mimeType } = payload;
    const res = yield call(fileApi.uploadFromDrive, { token, id, name, folderName: "doc_based", size, mimeType });
    const fileURI = res.Location;
    yield put(createAssessmentRequestAction({ fileURI }));
  } catch (err) {
    yield call(message.error, "Upload failed!");
  }
}

export function* watcherSaga() {
  yield all([
    yield takeLatest(CREATE_ASSESSMENT_REQUEST, createAssessmentSaga),
    yield takeLatest(UPLOAD_TO_DRIVE_REQUEST, uploadToDriveSaga)
  ]);
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

export const fileInfoSelector = createSelector(
  getStateSelector,
  state => ({ fileName: state.fileName, fileSize: state.fileSize })
);
