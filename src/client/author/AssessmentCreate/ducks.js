import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { call, put, all, takeLatest, select } from 'redux-saga/effects'
import nanoid from 'nanoid'
import { push } from 'react-router-redux'
import produce from 'immer'
import { get, without, omit } from 'lodash'

import {
  testsApi,
  testItemsApi,
  fileApi,
  getVQUsageCountApi,
} from '@edulastic/api'
import {
  aws,
  roleuser,
  test as testConstant,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import { helpers, notification } from '@edulastic/common'
import {
  VQ_QUOTA_EXHAUSTED,
  docBasedAssessment,
  testCategoryTypes,
} from '@edulastic/constants/const/test'
import { uploadToS3 } from '../src/utils/upload'
import {
  createBlankTest,
  getTestEntitySelector,
  setTestDataAction,
  getReleaseScorePremiumSelector,
  NewGroup,
  receiveTestByIdAction,
} from '../TestPage/ducks'
import {
  getUserSelector,
  getUserRole,
  vqQuotaForDistrictSelector,
} from '../src/selectors/user'
import { setUserFeaturesAction } from '../../student/Login/ducks'
import { videoQuizActions } from '../VideoLibrary/ducks'
import changeViewAction from '../src/actions/view'

const pdfjs = require('pdfjs-dist')

pdfjs.GlobalWorkerOptions.workerSrc =
  '//cdn.jsdelivr.net/npm/pdfjs-dist@2.1.266/build/pdf.worker.min.js'

export const CREATE_ASSESSMENT_REQUEST =
  '[assessmentPage] create assessment request'
export const CREATE_ASSESSMENT_SUCCESS =
  '[assessmentPage] create assessment success'
export const CREATE_ASSESSMENT_ERROR =
  '[assessmentPage] create assessment error'
export const SET_PERCENT_LOADED = '[assessmentPage] set assessment uploaded'
export const UPLOAD_TO_DRIVE_REQUEST = '[assesmentPage] upload to drive request'

export const createAssessmentRequestAction = createAction(
  CREATE_ASSESSMENT_REQUEST
)
export const createAssessmentSuccessAction = createAction(
  CREATE_ASSESSMENT_SUCCESS
)
export const createAssessmentErrorAction = createAction(CREATE_ASSESSMENT_ERROR)
export const setPercentUploadedAction = createAction(SET_PERCENT_LOADED)
export const uploadToDriveAction = createAction(UPLOAD_TO_DRIVE_REQUEST)

const initialState = {
  creating: false,
  error: undefined,
  percentageUpload: 0,
  fileName: null,
  fileSize: 0,
}

const initialTestState = createBlankTest()

const createAssessmentRequest = (
  state,
  {
    payload: {
      file: { name: fileName = null, size: fileSize = 0 } = {},
      videoUrl,
    },
  }
) => {
  state.creating = true
  state.error = undefined

  if (videoUrl) {
    state.videoUrl = videoUrl
  } else {
    state.fileName = fileName
    state.fileSize = fileSize
  }
}

const createAssessmentSuccess = (state) => {
  state.creating = false
  state.percentageUpload = 0
}

const createAssessmentError = (state, { payload: { error } }) => {
  state.creating = false
  state.error = error
  state.percentageUpload = 0
  state.fileName = null
  state.fileSize = 0
}

const setPercentageLoaded = (state, { payload }) => {
  state.percentageUpload = payload
}

export const reducer = createReducer(initialState, {
  [CREATE_ASSESSMENT_REQUEST]: createAssessmentRequest,
  [CREATE_ASSESSMENT_SUCCESS]: createAssessmentSuccess,
  [CREATE_ASSESSMENT_ERROR]: createAssessmentError,
  [SET_PERCENT_LOADED]: setPercentageLoaded,
  [UPLOAD_TO_DRIVE_REQUEST]: (state) => {
    state.creating = true
  },
})

const defaultTestItem = {
  isDocBased: true,
  itemLevelScoring: false,
  columns: [],
  data: {
    questions: [],
    resources: [],
  },
  rows: [
    {
      tabs: [],
      dimension: '100%',
      widgets: [],
    },
  ],
}

const defaultPageStructure = [
  {
    pageId: helpers.uuid(),
    URL:
      'https://cdn.edulastic.com/default/blank_doc-3425532845-1501676954359.pdf',
    pageNo: 1,
    rotate: 0,
  },
]

function* createAssessmentSaga({ payload }) {
  let { fileURI = '', fileTitle = '' } = payload
  const { searchParam = '' } = payload
  let testItem
  let amountOfPDFPages = 0
  let pageStructure = []

  try {
    if (payload.file) {
      fileTitle = payload.file?.name || ''
      fileURI = yield call(
        uploadToS3,
        payload.file,
        aws.s3Folders.DOCS,
        null,
        payload.progressCallback,
        payload.cancelUpload
      )
    }
  } catch (error) {
    const errorMessage = error.message || 'Unable to process PDF upload.'
    notification({ type: 'error', msg: errorMessage })
    yield put(createAssessmentErrorAction({ error: errorMessage }))
    return
  }
  try {
    if (!payload.assessmentId) {
      testItem = yield call(testItemsApi.create, defaultTestItem)
    }
  } catch (error) {
    const errorMessage = 'Unable to create test item.'
    notification({ type: 'error', msg: errorMessage })
    yield put(createAssessmentErrorAction({ error: errorMessage }))
    return
  }

  try {
    if (fileURI) {
      const pdfLoadingTask = pdfjs.getDocument(fileURI)

      const { numPages } = yield pdfLoadingTask.promise
      amountOfPDFPages = numPages

      pageStructure = new Array(amountOfPDFPages)
        .fill({
          URL: fileURI,
        })
        .map((page, index) => ({
          ...page,
          pageNo: index + 1,
        }))
    } else {
      const pdfLoadingTask = pdfjs.getDocument(defaultPageStructure[0].URL)

      const { numPages } = yield pdfLoadingTask.promise
      amountOfPDFPages = numPages

      pageStructure = new Array(amountOfPDFPages)
        .fill({
          URL: defaultPageStructure[0].URL,
          pageId: helpers.uuid(),
        })
        .map((page, index) => ({
          ...page,
          pageNo: index + 1,
        }))
    }

    if (payload.assessmentId) {
      const assessment = yield select(getTestEntitySelector)
      const { scoring } = assessment
      const assessmentPageStructure = get(assessment, 'pageStructure', [])
        .filter((page) => page.URL === 'blank' || payload.isAddPdf) // delete old pdf
        .concat(pageStructure)
        .map((page) => ({
          ...page,
          _id: undefined,
        }))
      const newPageStructure = assessmentPageStructure.length
        ? assessmentPageStructure
        : defaultPageStructure
      const updatedAssessment = {
        ...assessment,
        itemGroups: [],
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
        alreadyLiked: undefined,
        pageStructure: newPageStructure,
      }

      updatedAssessment.itemGroups = produce(
        assessment.itemGroups,
        (itemGroups) => {
          itemGroups[0].items = itemGroups[0].items.map((o) => ({
            itemId: o._id,
            maxScore: scoring[o._id] || helpers.getPoints(o),
            questions: o.data
              ? helpers.getQuestionLevelScore(
                  o,
                  o.data.questions,
                  helpers.getPoints(o),
                  scoring[o._id]
                )
              : {},
          }))
        }
      )
      if (
        !testTypesConstants.TEST_TYPES.COMMON.includes(
          updatedAssessment.testType
        )
      ) {
        delete updatedAssessment.freezeSettings
      }

      if (updatedAssessment.settingId === '') {
        updatedAssessment.settingId = null
      }

      const updatePayload = {
        id: assessment._id,
        data: updatedAssessment,
      }

      const newTest = yield call(testsApi.update, updatePayload)

      const testData = {
        docUrl: fileURI,
        pageStructure: newPageStructure,
        version: newTest.version,
      }

      yield put(setTestDataAction(testData))
      yield put(createAssessmentSuccessAction())
      if (!payload?.avoidRedirect) {
        yield put(push(`/author/assessments/${assessment._id}`))
      }
    } else {
      const userRole = yield select(getUserRole)
      const isReleaseScorePremium = yield select(getReleaseScorePremiumSelector)
      const isAdmin =
        userRole === roleuser.DISTRICT_ADMIN ||
        userRole === roleuser.SCHOOL_ADMIN
      const releaseScore =
        userRole === roleuser.TEACHER && isReleaseScorePremium
          ? testConstant.releaseGradeLabels.WITH_ANSWERS
          : testConstant.releaseGradeLabels.DONT_RELEASE
      const { user } = yield select(getUserSelector)
      const name = without(
        [user.firstName, user.lastName],
        undefined,
        null,
        ''
      ).join(' ')
      const item = {
        itemId: testItem._id,
        maxScore: testItem.maxScore,
        questions: {},
      }
      // removing file extension
      if (fileTitle) {
        fileTitle = fileTitle.replace(/\.[^/.]+$/, '')
      }
      const newAssessment = {
        ...initialTestState,
        title: fileTitle || undefined,
        createdBy: {
          id: user._id,
          name,
        },
        isDocBased: true,
        itemGroups: [{ ...NewGroup, _id: nanoid(), items: [item] }],
        releaseScore,
        assignments: undefined,
        ...(isAdmin
          ? {
              testType:
                testTypesConstants.DEFAULT_ADMIN_TEST_TYPE_MAP[userRole],
            }
          : {}),
      }

      if (payload.videoUrl) {
        newAssessment.testCategory = testCategoryTypes.VIDEO_BASED
        newAssessment.videoUrl = payload.videoUrl
        newAssessment.title = payload.title
        newAssessment.vqPreventSkipping = true
        newAssessment.cw = true

        if (payload.thumbnail) {
          newAssessment.thumbnail = payload.thumbnail
        }
      } else {
        newAssessment.testCategory = testCategoryTypes.DOC_BASED
        newAssessment.docUrl = fileURI
        newAssessment.pageStructure = pageStructure.length
          ? pageStructure
          : defaultPageStructure
      }

      if (
        newAssessment.passwordPolicy !==
        testConstant.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC
      ) {
        delete newAssessment.assignmentPassword
      }
      if (
        newAssessment.passwordPolicy !==
        testConstant.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
      ) {
        delete newAssessment.passwordExpireIn
      }
      // Omit passages in doc basedtest creation flow as backend is not expecting it
      const omitedItems = ['passages']
      if (
        !testTypesConstants.TEST_TYPES.COMMON.includes(newAssessment.testType)
      ) {
        omitedItems.push('freezeSettings')
      }
      const assesmentPayload = omit(newAssessment, omitedItems)

      const assessment = yield call(testsApi.create, assesmentPayload)
      const { vqUsageCount } = yield call(getVQUsageCountApi.getVQUsageCount)
      yield put(
        setUserFeaturesAction({
          featureName: 'vqUsageCount',
          value: vqUsageCount,
        })
      )
      yield put(createAssessmentSuccessAction())

      yield put(receiveTestByIdAction(assessment._id, true, false))
      if (assessment?.testCategory === testCategoryTypes.VIDEO_BASED) {
        yield put(push(`/author/assessments/${assessment._id}${searchParam}`))
      } else {
        yield put(push(`/author/assessments/${assessment._id}`))
      }
      yield put(changeViewAction(docBasedAssessment.tabs.WORKSHEET))
    }
  } catch (error) {
    console.log(error, 'error')
    let errorMessage
    if (error.code === 1) {
      errorMessage = 'Password protected PDF files are not supported'
    } else {
      errorMessage = 'Unable to create assessment.'
    }
    if (error?.response?.data?.message === VQ_QUOTA_EXHAUSTED) {
      const vqQuotaForDistrict = yield select(vqQuotaForDistrictSelector)
      yield put(videoQuizActions.updateSearchString(''))
      yield put(videoQuizActions.resetIsLoading())

      notification({
        type: 'warn',
        msg: `You have reached the maximum limit of ${vqQuotaForDistrict} tests for VideoQuiz.`,
      })
    } else {
      notification({ type: 'error', msg: errorMessage })
    }
    yield put(createAssessmentErrorAction({ error: errorMessage }))
  }
}

function* uploadToDriveSaga({ payload = {} }) {
  try {
    // TODO call the new api and create test
    const {
      token,
      id,
      name,
      size,
      mimeType,
      assessmentId,
      isAddPdf,
      merge,
    } = payload
    const res = yield call(fileApi.uploadFromDrive, {
      token,
      id,
      name,
      folderName: 'doc_based',
      size,
      mimeType,
    })
    const fileURI = res.cdnLocation
    yield put(
      createAssessmentRequestAction({
        fileURI,
        fileTitle: name,
        assessmentId,
        isAddPdf,
        merge,
      })
    )
  } catch (err) {
    notification({ messageKey: 'uploadFailed' })
  }
}

export function* watcherSaga() {
  yield all([
    yield takeLatest(CREATE_ASSESSMENT_REQUEST, createAssessmentSaga),
    yield takeLatest(UPLOAD_TO_DRIVE_REQUEST, uploadToDriveSaga),
  ])
}

const getStateSelector = (state) => state.assessmentCreate

export const getAssessmentCreatingSelector = createSelector(
  getStateSelector,
  (state) => state.creating
)

export const getAssessmentErrorSelector = createSelector(
  getStateSelector,
  (state) => state.error
)

export const percentageUploadedSelector = createSelector(
  getStateSelector,
  (state) => state.percentageUpload
)

export const fileInfoSelector = createSelector(getStateSelector, (state) => ({
  fileName: state.fileName,
  fileSize: state.fileSize,
}))
