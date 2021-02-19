import { createSelector } from 'reselect'
import { createAction } from 'redux-starter-kit'
import {
  test,
  roleuser,
  questionType,
  test as testConst,
  assignmentPolicyOptions,
} from '@edulastic/constants'
import {
  call,
  put,
  all,
  takeEvery,
  takeLatest,
  select,
  take,
} from 'redux-saga/effects'
import { push, replace } from 'connected-react-router'
import {
  keyBy as _keyBy,
  omit,
  get,
  uniqBy,
  uniq as _uniq,
  isEmpty,
  identity,
  differenceBy,
  round,
  pick,
} from 'lodash'
import {
  testsApi,
  assignmentApi,
  contentSharingApi,
  tagsApi,
  passageApi,
  testItemsApi,
  analyticsApi,
} from '@edulastic/api'
import moment from 'moment'
import nanoid from 'nanoid'
import produce from 'immer'
import * as Sentry from '@sentry/browser'

import {
  captureSentryException,
  helpers,
  notification,
  Effects,
} from '@edulastic/common'
import signUpState from '@edulastic/constants/const/signUpState'
import { createGroupSummary } from './utils'
import {
  SET_MAX_ATTEMPT,
  UPDATE_TEST_IMAGE,
  SET_SAFE_BROWSE_PASSWORD,
  ADD_ITEM_EVALUATION,
  CHANGE_PREVIEW,
  APPROVE_OR_REJECT_MULTIPLE_ITEM_SUCCESS,
} from '../src/constants/actions'
import {
  loadQuestionsAction,
  getQuestionsArraySelector,
  UPDATE_QUESTION,
} from '../sharedDucks/questions'
import { evaluateItem } from '../src/utils/evalution'
import createShowAnswerData from '../src/utils/showAnswer'
import {
  getItemsSubjectAndGradeAction,
  setTestItemsAction,
} from './components/AddItems/ducks'
import {
  getUserRole,
  getUserOrgData,
  getUserIdSelector,
  getUserId,
  getIsCurator,
  getUserSignupStatusSelector,
} from '../src/selectors/user'
import { receivePerformanceBandSuccessAction } from '../PerformanceBand/ducks'
import { receiveStandardsProficiencySuccessAction } from '../StandardsProficiency/ducks'
import {
  updateItemDocBasedSaga,
  togglePublishWarningModalAction,
  PROCEED_PUBLISH_ACTION,
  hasStandards,
} from '../ItemDetail/ducks'
import { saveUserWorkAction } from '../../assessment/actions/userWork'
import { isFeatureAccessible } from '../../features/components/FeaturesSwitch'
import { getDefaultSettings } from '../../common/utils/helpers'
import { updateAssingnmentSettingsAction } from '../AssignTest/duck'
import { SET_ITEM_SCORE } from '../src/ItemScore/ducks'
import { getIsloadingAssignmentSelector } from './components/Assign/ducks'
import { sortTestItemQuestions } from '../dataUtils'
import { answersByQId } from '../../assessment/selectors/test'

// constants

const {
  ITEM_GROUP_TYPES,
  ITEM_GROUP_DELIVERY_TYPES,
  completionTypes,
  releaseGradeLabels,
  calculatorTypes,
  evalTypeLabels,
  passwordPolicy,
} = test
const testItemStatusConstants = {
  INREVIEW: 'inreview',
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
}

export const NewGroup = {
  type: ITEM_GROUP_TYPES.STATIC /* Default : static */,
  groupName: 'Group 1' /* For now, auto-generated. */,
  items: [],
  deliveryType: ITEM_GROUP_DELIVERY_TYPES.ALL,
  index: 0,
}
export const createWidget = ({ id, type, title }) => ({
  widgetType: type === 'sectionLabel' ? 'resource' : 'question',
  type,
  title,
  reference: id,
  tabIndex: 0,
})

export const getStaticGroupItemIds = (_test) =>
  (
    _test.itemGroups.flatMap((itemGroup = {}) => {
      if (itemGroup.type === ITEM_GROUP_TYPES.STATIC) {
        return itemGroup?.items.map((item) => item._id) || []
      }
      return []
    }) || []
  ).filter((e) => !!e)

const transformItemGroupsUIToMongo = (itemGroups, scoring = {}) =>
  produce(itemGroups, (_itemGroups) => {
    for (const itemGroup of _itemGroups) {
      if (itemGroup.type === ITEM_GROUP_TYPES.STATIC) {
        const isLimitedDeliveryType =
          itemGroup.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
        // For delivery type:LIMITED scoring should be as how item level scoring works
        itemGroup.items = itemGroup.items.map((o) => ({
          itemId: o._id,
          maxScore: isLimitedDeliveryType
            ? 1
            : scoring[o._id] || helpers.getPoints(o),
          questions: o.data
            ? helpers.getQuestionLevelScore(
                { ...o, isLimitedDeliveryType },
                o.data.questions,
                helpers.getPoints(o),
                scoring[o._id]
              )
            : {},
        }))
      } else itemGroup.items = []
    }
  })

export const getTestGradeAndSubject = (
  group,
  testGrades,
  testSubjects,
  testTags
) => {
  if (group.type === ITEM_GROUP_TYPES.AUTOSELECT) {
    return {
      testGrades: _uniq([...testGrades, ...group.standardDetails.grades]),
      testSubjects: _uniq([...testSubjects, group.standardDetails.subject]),
      testTags: _uniq([...testTags, ...(group.tags || [])]),
    }
  }
  return { testGrades, testSubjects }
}
// user is created ? then he is author not authored and in authors list he is co-author
const authorType = (userId, { createdBy, authors }) => {
  if (userId === createdBy?._id) {
    return 'author'
  }
  if (authors.some((item) => item._id === userId)) {
    return 'co-author'
  }
  return false
}

const isRegraded = (isAuthor, entity, requestedTestId) => {
  if (
    isAuthor &&
    entity._id !== requestedTestId &&
    entity.previousTestId === requestedTestId &&
    entity.status === 'published' &&
    entity.isUsed
  ) {
    return true
  }
  return false
}

export const SET_ASSIGNMENT = '[assignments] set assignment' // TODO remove cyclic dependency
export const CREATE_TEST_REQUEST = '[tests] create test request'
export const CREATE_TEST_SUCCESS = '[tests] create test success'
export const CREATE_TEST_ERROR = '[tests] create test error'

export const UPDATE_TEST_REQUEST = '[tests] update test request'
export const UPDATE_TEST_DOC_BASED_REQUEST =
  '[tests] update doc based test request'
export const UPDATE_TEST_SUCCESS = '[tests] update test success'
export const UPDATE_TEST_ERROR = '[tests] update test error'

export const RECEIVE_TEST_BY_ID_REQUEST = '[tests] receive test by id request'
export const RECEIVE_TEST_BY_ID_SUCCESS = '[tests] receive test by id success'
export const REMOVE_TEST_ENTITY = '[tests] remove entity'
export const RECEIVE_TEST_BY_ID_ERROR = '[tests] receive test by id error'

export const SET_TEST_DATA = '[tests] set test data'
export const SET_DEFAULT_TEST_DATA = '[tests] set default test data'
export const SET_TEST_EDIT_ASSIGNED = '[tests] set edit assigned'
export const REGRADE_TEST = '[regrade] set regrade data'
export const TEST_SHARE = '[test] send test share request'
export const TEST_PUBLISH = '[test] publish test'
export const UPDATE_TEST_STATUS = '[test] update test status'
export const CLEAR_TEST_DATA = '[test] clear test data'
export const TEST_CREATE_SUCCESS = '[test] create test succes'
export const SET_REGRADE_OLD_TESTID = '[test] set regrade old test_id'
export const UPDATE_ENTITY_DATA = '[test] update entity data'
export const RECEIVE_SHARED_USERS_LIST = '[test] receive shared users list'
export const UPDATE_SHARED_USERS_LIST = '[test] update shared with users list'
export const DELETE_SHARED_USER = '[test] delete share user from list'
export const SET_TEST_DATA_AND_SAVE = '[test] set test data and update test'
export const SET_CREATED_ITEM_TO_TEST = '[test] set created item to test'
export const CLEAR_CREATED_ITEMS_FROM_TEST =
  '[test] clear createdItems from test'
export const PREVIEW_CHECK_ANSWER = '[test] check answer for preview modal'
export const PREVIEW_SHOW_ANSWER = '[test] show answer for preview modal'
export const REPLACE_TEST_ITEMS = '[test] replace test items'
export const UPDATE_TEST_DEFAULT_IMAGE = '[test] update default thumbnail image'
export const SET_PASSAGE_ITEMS = '[tests] set passage items'
export const SET_AND_SAVE_PASSAGE_ITEMS = '[tests] set and save passage items'
export const GET_ALL_TAGS_IN_DISTRICT = '[test] get all tags in district'
export const SET_ALL_TAGS = '[test] set all tags'
export const SET_ALL_TAGS_FAILED = '[test] set all tags failure'
export const ADD_NEW_TAG = '[test] add new tag'
export const RECEIVE_DEFAULT_TEST_SETTINGS =
  '[tests] receive default test settings'
export const SET_DEFAULT_TEST_TYPE_PROFILES =
  '[tests] set default test type profiles'
export const PUBLISH_FOR_REGRADE = '[tests] publish test for regrade'
export const DELETE_ANNOTATION = '[tests] delete annotations from test'
export const SET_LOADING_TEST_PAGE = '[tests] set loading'
export const DUPLICATE_TEST_REQUEST = '[tests] duplicate request'
export const UPDATE_TEST_AND_NAVIGATE = '[tests] update test and navigate'
export const APPROVE_OR_REJECT_SINGLE_TEST_REQUEST =
  '[test page] approve or reject single test request'
export const APPROVE_OR_REJECT_SINGLE_TEST_SUCCESS =
  '[test page] approve or reject single test success'
export const UPDATE_GROUP_DATA = '[tests] update group data'
export const ADD_NEW_GROUP = '[tests] add new group'
export const SET_CURRENT_GROUP_INDEX = '[tests] set current group index'
export const DELETE_ITEMS_GROUP = '[tests] delete items group'
export const ADD_ITEMS_TO_AUTOSELECT_GROUPS_REQUEST =
  '[test] add items to autoselect groups request'
export const ADD_ITEMS_TO_AUTOSELECT_GROUP =
  '[test] add items to autoselect group'
export const SET_TEST_PASSAGE_AFTER_CREATE =
  '[test] set passage after passage create'
export const UPDATE_LAST_USED_COLLECTION_LIST =
  '[test] update recent collections'
export const UPDATE_CREATING = '[test] create test request initiated'
export const SET_DEFAULT_SETTINGS_LOADING = '[test] deafult settings loading'
export const SET_AUTOSELECT_ITEMS_FETCHING_STATUS =
  '[test] set autoselect items fetching status'
export const SET_REGRADING_STATE = '[test] set regrading state'
export const SET_EDIT_ENABLE = '[test] set enable edit state'
export const SET_CURRENT_ANNOTATION_TOOL = '[SnapQuiz] annotation tools'
export const UPDATE_ANNOTATION_TOOLS_PROPERTIES =
  '[SnapQuiz] update annotation tools properties'
export const SET_ANNOTATIONS_STACK =
  '[SnapQuiz] reset undo stack and redo stack'
export const UNDO_ANNOTATONS_OPERATION = '[SnapQuiz] UNDO annotations operation'
export const REDO_ANNOTATONS_OPERATION = '[SnapQuiz] REDO annotations operation'
export const TOGGLE_TEST_LIKE = '[test] toggle test like'
export const UPDATE_TEST_LIKE_COUNT = '[test] update test like count'
export const UPDATE_TEST_ITEM_LIKE_COUNT =
  '[test] update test review item like count'
export const RESET_UPDATED_TEST_STATE = '[test] reset test updated state'
export const SET_UPDATING_TEST_FOR_REGRADE_STATE =
  '[test] set updating test for regrade state'
export const SET_NEXT_PREVIEW_ITEM = '[test] set next preview item'
export const GET_TESTID_FROM_VERSIONID = '[test] get testId from versionId'
export const SET_REGRADE_FIRESTORE_DOC_ID = '[test] set regrade firestore docId'
export const SET_CORRECT_PSSAGE_ITEMS_CREATED =
  '[test] set correct passage items data in created items'
export const SET_SHARING_CONTENT_STATE = '[test] set sharing content state'
export const UPDATE_EMAIL_NOTIFICATION_DATA =
  '[test] update email notification data'
export const GET_REGRADE_ACTIONS = '[tests] get available regrade actions'
export const SET_REGRADE_ACTIONS = '[tests] set available regrade actions'
// actions

export const previewCheckAnswerAction = createAction(PREVIEW_CHECK_ANSWER)
export const previewShowAnswerAction = createAction(PREVIEW_SHOW_ANSWER)
export const replaceTestItemsAction = createAction(REPLACE_TEST_ITEMS)
export const setNextPreviewItemAction = createAction(SET_NEXT_PREVIEW_ITEM)
export const updateDefaultThumbnailAction = createAction(
  UPDATE_TEST_DEFAULT_IMAGE
)
export const setPassageItemsAction = createAction(SET_PASSAGE_ITEMS)
export const setAndSavePassageItemsAction = createAction(
  SET_AND_SAVE_PASSAGE_ITEMS
)
export const getAllTagsAction = createAction(GET_ALL_TAGS_IN_DISTRICT)
export const setAllTagsAction = createAction(SET_ALL_TAGS)
export const getDefaultTestSettingsAction = createAction(
  RECEIVE_DEFAULT_TEST_SETTINGS
)
export const publishForRegradeAction = createAction(PUBLISH_FOR_REGRADE)
export const setTestsLoadingAction = createAction(SET_LOADING_TEST_PAGE)
export const duplicateTestRequestAction = createAction(DUPLICATE_TEST_REQUEST)
export const updateTestAndNavigateAction = createAction(
  UPDATE_TEST_AND_NAVIGATE
)
export const removeTestEntityAction = createAction(REMOVE_TEST_ENTITY)
export const approveOrRejectSingleTestRequestAction = createAction(
  APPROVE_OR_REJECT_SINGLE_TEST_REQUEST
)
export const approveOrRejectSingleTestSuccessAction = createAction(
  APPROVE_OR_REJECT_SINGLE_TEST_SUCCESS
)
export const updateGroupDataAction = createAction(UPDATE_GROUP_DATA)
export const addNewGroupAction = createAction(ADD_NEW_GROUP)
export const setCurrentGroupIndexAction = createAction(SET_CURRENT_GROUP_INDEX)
export const deleteItemsGroupAction = createAction(DELETE_ITEMS_GROUP)
export const addItemsToAutoselectGroupsRequestAction = createAction(
  ADD_ITEMS_TO_AUTOSELECT_GROUPS_REQUEST
)
export const addItemsToAutoselectGroupAction = createAction(
  ADD_ITEMS_TO_AUTOSELECT_GROUP
)
export const setTestPassageAction = createAction(SET_TEST_PASSAGE_AFTER_CREATE)
export const updateTestEntityAction = createAction(SET_TEST_DATA)
export const updateLastUsedCollectionListAction = createAction(
  UPDATE_LAST_USED_COLLECTION_LIST
)
export const setIsCreatingAction = createAction(UPDATE_CREATING)
export const setDefaultSettingsLoadingAction = createAction(
  SET_DEFAULT_SETTINGS_LOADING
)
export const setAutoselectItemsFetchingStatusAction = createAction(
  SET_AUTOSELECT_ITEMS_FETCHING_STATUS
)
export const setRegradingStateAction = createAction(SET_REGRADING_STATE)
export const setRegradeFirestoreDocId = createAction(
  SET_REGRADE_FIRESTORE_DOC_ID
)
export const setEditEnableAction = createAction(SET_EDIT_ENABLE)
export const setCurrentAnnotationToolAction = createAction(
  SET_CURRENT_ANNOTATION_TOOL
)
export const updateAnnotationToolsPropertiesAction = createAction(
  UPDATE_ANNOTATION_TOOLS_PROPERTIES
)
export const undoAnnotationsAction = createAction(UNDO_ANNOTATONS_OPERATION)
export const redoAnnotationsAction = createAction(REDO_ANNOTATONS_OPERATION)
export const toggleTestLikeAction = createAction(TOGGLE_TEST_LIKE)
export const updateTestLikeCountAction = createAction(UPDATE_TEST_LIKE_COUNT)
export const updateTestItemLikeCountAction = createAction(
  UPDATE_TEST_ITEM_LIKE_COUNT
)
export const resetUpdatedStateAction = createAction(RESET_UPDATED_TEST_STATE)
export const setUpdatingTestForRegradeStateAction = createAction(
  SET_UPDATING_TEST_FOR_REGRADE_STATE
)
export const getTestIdFromVersionIdAction = createAction(
  GET_TESTID_FROM_VERSIONID
)
export const setSharingContentStateAction = createAction(
  SET_SHARING_CONTENT_STATE
)
export const updateEmailNotificationDataAction = createAction(
  UPDATE_EMAIL_NOTIFICATION_DATA
)

export const setAvailableRegradeAction = createAction(SET_REGRADE_ACTIONS)

export const receiveTestByIdAction = (
  id,
  requestLatest,
  editAssigned,
  isPlaylist = false,
  playlistId = undefined
) => ({
  type: RECEIVE_TEST_BY_ID_REQUEST,
  payload: { id, requestLatest, editAssigned, isPlaylist, playlistId },
})

export const receiveTestByIdSuccess = (entity) => ({
  type: RECEIVE_TEST_BY_ID_SUCCESS,
  payload: { entity },
})

export const receiveTestByIdError = (error) => ({
  type: RECEIVE_TEST_BY_ID_ERROR,
  payload: { error },
})

/**
 * To create a new test from the data passed.
 * @param {object} data
 * @param {boolean} toReview
 * @param {boolean} isCartTest
 */
export const createTestAction = (
  data,
  toReview = false,
  isCartTest = false
) => ({
  type: CREATE_TEST_REQUEST,
  payload: { data, toReview, isCartTest },
})

export const createTestSuccessAction = (entity) => ({
  type: CREATE_TEST_SUCCESS,
  payload: { entity },
})

export const createTestErrorAction = (error) => ({
  type: CREATE_TEST_ERROR,
  payload: { error },
})

export const updateTestAction = (id, data, updateLocal) => ({
  type: UPDATE_TEST_REQUEST,
  payload: { id, data, updateLocal },
})

export const updateDocBasedTestAction = (id, data, updateLocal) => ({
  type: UPDATE_TEST_DOC_BASED_REQUEST,
  payload: { id, data, updateLocal },
})

export const updateTestSuccessAction = (entity) => ({
  type: UPDATE_TEST_SUCCESS,
  payload: { entity },
})

export const updateTestErrorAction = (error) => ({
  type: UPDATE_TEST_ERROR,
  payload: { error },
})

export const setTestDataAction = (data) => ({
  type: SET_TEST_DATA,
  payload: { data },
})

export const setTestDataAndUpdateAction = (data) => ({
  type: SET_TEST_DATA_AND_SAVE,
  payload: data,
})
export const clearTestDataAction = () => ({
  type: CLEAR_TEST_DATA,
})

export const setDefaultTestDataAction = () => ({
  type: SET_DEFAULT_TEST_DATA,
})

export const setCreateSuccessAction = () => ({
  type: TEST_CREATE_SUCCESS,
})

export const setTestEditAssignedAction = createAction(SET_TEST_EDIT_ASSIGNED)
export const setRegradeSettingsDataAction = (payload) => ({
  type: REGRADE_TEST,
  payload,
})

export const sendTestShareAction = createAction(TEST_SHARE)
export const publishTestAction = createAction(TEST_PUBLISH)
export const updateTestStatusAction = createAction(UPDATE_TEST_STATUS)
export const setRegradeOldIdAction = createAction(SET_REGRADE_OLD_TESTID)
export const updateSharedWithListAction = createAction(UPDATE_SHARED_USERS_LIST)
export const receiveSharedWithListAction = createAction(
  RECEIVE_SHARED_USERS_LIST
)
export const deleteSharedUserAction = createAction(DELETE_SHARED_USER)
export const setCreatedItemToTestAction = createAction(SET_CREATED_ITEM_TO_TEST)
export const clearCreatedItemsAction = createAction(
  CLEAR_CREATED_ITEMS_FROM_TEST
)
export const addNewTagAction = createAction(ADD_NEW_TAG)
export const setDefaultTestTypeProfilesAction = createAction(
  SET_DEFAULT_TEST_TYPE_PROFILES
)
export const deleteAnnotationAction = createAction(DELETE_ANNOTATION)
export const setUndoStackAction = createAction(SET_ANNOTATIONS_STACK)
export const setCorrectPassageItemsCreatedAction = createAction(
  SET_CORRECT_PSSAGE_ITEMS_CREATED
)
export const getRegradeSettingsAction = createAction(GET_REGRADE_ACTIONS)

export const defaultImage =
  'https://cdn2.edulastic.com/default/default-test-1.jpg'

// selectors

export const stateSelector = (state) => state.tests

export const playlistStateSelector = (state) => state.playlist

export const getPassageItemsCountSelector = createSelector(
  stateSelector,
  (state) => state.passageItems.length
)

export const getRegradeFirebaseDocIdSelector = createSelector(
  stateSelector,
  (state) => state.regradeFirestoreDocId
)

export const getTestSelector = createSelector(
  stateSelector,
  (state) => state.entity
)

export const getPlaylistSelector = createSelector(
  playlistStateSelector,
  (state) => state.entity
)

export const defaultTestTypeProfilesSelector = createSelector(
  stateSelector,
  (state) => state.defaultTestTypeProfiles
)

export const getDefaultThumbnailSelector = createSelector(
  stateSelector,
  (state) => state.thumbnail
)

export const getlastUsedCollectionListSelector = createSelector(
  stateSelector,
  (state) => state.lastUsedCollectionList || []
)

export const getTestEntitySelector = createSelector(
  stateSelector,
  (state) => state.entity
)

export const getCollectionNameSelector = createSelector(
  getTestEntitySelector,
  (state) => state.collectionName
)

// currently present testItems in the test.
export const getSelectedTestItemsSelector = createSelector(
  getTestEntitySelector,
  (_test) =>
    _test.itemGroups.flatMap((itemGroup) => itemGroup.items || []) || []
)

export const getItemGroupsSelector = createSelector(
  getTestEntitySelector,
  (_test) => _test.itemGroups || []
)

export const getTestItemsSelector = createSelector(
  getTestEntitySelector,
  (_test) => {
    const itemGroups = _test.itemGroups || []
    let testItems =
      itemGroups.flatMap(
        (itemGroup) =>
          itemGroup.items.map((item) => ({
            ...item,
            groupId: itemGroup._id,
            isLimitedDeliveryType:
              itemGroup.deliveryType ===
              ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM,
          })) || []
      ) || []
    testItems = sortTestItemQuestions(testItems)
    return testItems
  }
)

export const getDisableAnswerOnPaperSelector = createSelector(
  getTestEntitySelector,
  (_test) =>
    // disable answer on paper feature for deliveryType:LIMITED_RANDOM or group.type:AUTOSELECT
    _test?.itemGroups?.some(
      (group) =>
        group.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM ||
        group.type === ITEM_GROUP_TYPES.AUTOSELECT
    )
)

export const getCurentTestPassagesSelector = createSelector(
  getTestEntitySelector,
  (_test) => _test.passages || []
)

export const getTestStatusSelector = createSelector(
  getTestEntitySelector,
  (state) => state.status
)

export const getTestIdSelector = createSelector(
  stateSelector,
  (state) => state.entity && state.entity._id
)

export const getContentSharingStateSelector = createSelector(
  stateSelector,
  (state) => state.isSharingContent
)

export const getShouldSendEmailStateSelector = createSelector(
  stateSelector,
  (state) => state.sendEmailNotification
)

export const getShowMessageBodyStateSelector = createSelector(
  stateSelector,
  (state) => state.showMessageBody
)

export const getEmailNotificationMessageSelector = createSelector(
  stateSelector,
  (state) => state.notificationMessage
)

export const getTestsCreatingSelector = createSelector(
  stateSelector,
  (state) => state.creating
)

export const getTestsLoadingSelector = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getAutoSelectItemsLoadingStatusSelector = createSelector(
  stateSelector,
  (state) => state.isFetchingAutoselectItems
)

export const getDefaultSettingsLoadingSelector = createSelector(
  stateSelector,
  (state) => state.isSettingsLoading
)

export const shouldDisableSelector = createSelector(
  getTestsLoadingSelector,
  getIsloadingAssignmentSelector,
  (testLoading, assignmentsLoading) => testLoading || assignmentsLoading
)

export const getRegradingSelector = createSelector(
  stateSelector,
  (state) => state.regrading
)

export const getIsLoadRegradeSettingsSelector = createSelector(
  stateSelector,
  (state) => state.loadRegradeSettings
)

export const getAvaialbleRegradeSettingsSelector = createSelector(
  stateSelector,
  (state) => state.availableRegradeSettings
)

export const showGroupsPanelSelector = createSelector(
  getTestEntitySelector,
  ({ itemGroups }) => {
    if (!itemGroups?.length) {
      return false
    }
    return (
      itemGroups[0].type === ITEM_GROUP_TYPES.AUTOSELECT ||
      itemGroups[0].deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM ||
      itemGroups.length > 1
    )
  }
)

export const getUserListSelector = createSelector(stateSelector, (state) => {
  const usersList = state.sharedUsersList
  const flattenUsers = []
  usersList.forEach(({ permission, sharedType, sharedWith, sharedId }) => {
    if (sharedType === 'INDIVIDUAL' || sharedType === 'SCHOOL') {
      sharedWith.forEach((user) => {
        flattenUsers.push({
          userName: user.name,
          email: user.email || '',
          _userId: user._id,
          sharedType,
          permission,
          sharedId,
        })
      })
    } else {
      flattenUsers.push({
        userName: sharedType,
        sharedType,
        permission,
        sharedId,
      })
    }
  })
  return flattenUsers
})

export const getTestItemsRowsSelector = createSelector(
  getTestSelector,
  (state) =>
    state.itemGroups
      ?.flatMap((itemGroup) => itemGroup.items || [])
      ?.map((item) => {
        if (!item || !item.rows) return []
        return item?.rows?.map((row) => ({
          ...row,
          widgets: row?.widgets?.map((widget) => {
            let referencePopulate = {
              data: null,
            }

            if (
              item.data &&
              item.data.questions &&
              item.data.questions.length
            ) {
              referencePopulate = item.data.questions.find(
                (q) => q._id === widget.reference
              )
            }

            if (
              !referencePopulate &&
              item.data &&
              item.data.resources &&
              item.data.resources.length
            ) {
              referencePopulate = item.data.resources.find(
                (r) => r._id === widget.reference
              )
            }

            return {
              ...widget,
              referencePopulate,
            }
          }),
        }))
      })
)

// reducer
export const createBlankTest = () => ({
  title: undefined,
  description: '',
  releaseScore: test.releaseGradeLabels.DONT_RELEASE,
  maxAttempts: 1,
  testType: test.type.ASSESSMENT,
  markAsDone: test.completionTypes.AUTOMATICALLY,
  generateReport: true,
  safeBrowser: false,
  sebPassword: '',
  blockNavigationToAnsweredQuestions: false,
  shuffleQuestions: false,
  shuffleAnswers: false,
  calcType: test.calculatorKeys[0],
  answerOnPaper: false,
  assignmentPassword: '',
  passwordExpireIn: 15 * 60,
  passwordPolicy: test.passwordPolicy.REQUIRED_PASSWORD_POLICY_OFF,
  maxAnswerChecks: 0,
  scoringType: test.evalTypeLabels.PARTIAL_CREDIT,
  penalty: false,
  isDocBased: false,
  status: 'draft',
  thumbnail: defaultImage,
  itemGroups: [
    {
      ...NewGroup,
      _id: nanoid(),
    },
  ],
  createdBy: {
    _id: '',
    name: '',
  },
  tags: [],
  scoring: {
    total: 0,
    testItems: [],
  },
  standardsTag: {
    curriculum: '',
    standards: [],
  },
  grades: [],
  subjects: [],
  courses: [],
  collections: [],
  analytics: [
    {
      usage: 0,
      likes: 0,
    },
  ],
  passages: [],
  freezeSettings: false,
  multiLanguageEnabled: false,
  playerSkinType: 'edulastic',
})

const initialState = {
  entity: createBlankTest(),
  error: null,
  page: 1,
  limit: 20,
  count: 0,
  updated: false,
  loading: false,
  creating: false,
  isSettingsLoading: false,
  thumbnail: '',
  regradeTestId: '',
  createdItems: [],
  sharedUsersList: [],
  passageItems: [],
  lastUsedCollectionList: [],
  tagsList: { playlist: [], test: [], group: [], testitem: [] },
  defaultTestTypeProfiles: {},
  currentGroupIndex: 0,
  isFetchingAutoselectItems: false,
  regrading: false,
  editEnable: false,
  currentAnnotationTool: 'cursor',
  annotationToolsProperties: {},
  annotationsStack: [],
  updatingTestForRegrade: false,
  nextItemId: null,
  regradeFirestoreDocId: '',
  isSharingContent: false,
  sendEmailNotification: false,
  showMessageBody: false,
  notificationMessage: '',
  loadRegradeSettings: false,
  availableRegradeSettings: [`ADD`, `EDIT`, `REMOVE`, `SETTINGS`],
}

export const testTypeAsProfileNameType = {
  [test.type.ASSESSMENT]: 'class',
  [test.type.PRACTICE]: 'practice',
  [test.type.COMMON]: 'common',
}

const getDefaultScales = (state, payload) => {
  const {
    performanceBandProfiles,
    standardsProficiencyProfiles,
    defaultTestTypeProfiles,
  } = payload
  const testType = testTypeAsProfileNameType[state.entity.testType]
  const bandId =
    performanceBandProfiles.find(
      (item) => item._id === defaultTestTypeProfiles?.performanceBand[testType]
    ) || {}
  const standardId =
    standardsProficiencyProfiles.find(
      (item) =>
        item._id === defaultTestTypeProfiles?.standardProficiency[testType]
    ) || {}
  const performanceBand = isEmpty(state.entity.performanceBand)
    ? {
        name: bandId.name,
        _id: bandId._id,
      }
    : state.entity.performanceBand
  const standardGradingScale = isEmpty(state.entity.standardGradingScale)
    ? {
        name: standardId.name,
        _id: standardId._id,
      }
    : state.entity.standardGradingScale
  return {
    performanceBand,
    standardGradingScale,
  }
}

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_DEFAULT_TEST_DATA:
      return { ...state, entity: createBlankTest(), updated: false }
    case UPDATE_TEST_DEFAULT_IMAGE:
      return { ...state, thumbnail: payload }
    case UPDATE_LAST_USED_COLLECTION_LIST:
      return { ...state, lastUsedCollectionList: payload }
    case RECEIVE_TEST_BY_ID_REQUEST:
      return { ...state, loading: true, error: null }
    case SET_TEST_EDIT_ASSIGNED:
      return { ...state, editAssigned: true }
    case SET_REGRADE_OLD_TESTID:
      return { ...state, regradeTestId: payload }
    case RECEIVE_TEST_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        entity: {
          ...payload.entity,
        },
        updated: state.createdItems.length > 0,
      }
    case REMOVE_TEST_ENTITY:
      return {
        ...state,
        createdItems: [],
        entity: createBlankTest(),
      }
    case RECEIVE_TEST_BY_ID_ERROR:
      return { ...state, loading: false, error: payload.error }

    case DELETE_ANNOTATION: {
      const { entity = {} } = state
      const { annotations = [] } = entity
      const payloadIndex = annotations.find((o) => o.questionId === payload)
        ?.qIndex
      return {
        ...state,
        entity: {
          ...entity,
          annotations: annotations
            .filter((o) => o.questionId !== payload)
            .map((ann) => ({
              ...ann,
              qIndex: ann.qIndex > payloadIndex ? ann.qIndex - 1 : ann.qIndex,
            })),
        },
      }
    }
    case CREATE_TEST_REQUEST:
    case UPDATE_TEST_REQUEST:
    case UPDATE_TEST_DOC_BASED_REQUEST:
      return { ...state, creating: true, error: null }
    case CREATE_TEST_SUCCESS:
    case UPDATE_TEST_SUCCESS:
      return {
        ...state,
        entity: payload.entity,
        createdItems: [],
        error: null,
        updated: false,
        creating: false,
      }
    case UPDATE_ENTITY_DATA: {
      return {
        ...state,
        entity: payload.entity,
        error: null,
        updated: false,
      }
    }
    case CREATE_TEST_ERROR:
    case UPDATE_TEST_ERROR:
      return { ...state, creating: false, error: payload.error }
    case SET_TEST_DATA: {
      let entity = { ...state.entity, ...payload.data }
      if (
        payload.data?.restrictNavigationOut ===
          'warn-and-report-after-n-alerts' &&
        typeof entity?.restrictNavigationOutAttemptsThreshold === 'undefined'
      ) {
        entity = {
          ...entity,
          restrictNavigationOutAttemptsThreshold: 5,
        }
      } else if (payload.data?.restrictNavigationOut === 'warn-and-report') {
        entity = {
          ...entity,
          restrictNavigationOutAttemptsThreshold: undefined,
        }
      }
      return {
        ...state,
        entity,
        updated: true,
      }
    }
    case UPDATE_TEST_IMAGE:
      return {
        ...state,
        entity: {
          ...state.entity,
          thumbnail: payload.fileUrl,
        },
        updated: true,
      }
    case SET_ALL_TAGS:
      return {
        ...state,
        tagsList: { ...state.tagsList, [payload.tagType]: payload.tags },
      }
    case ADD_NEW_TAG:
      return {
        ...state,
        tagsList: {
          ...state.tagsList,
          [payload.tagType]: [
            ...(state.tagsList[payload.tagType] || []),
            payload.tag,
          ],
        },
      }
    case SET_MAX_ATTEMPT:
      return {
        ...state,
        entity: {
          ...state.entity,
          maxAttempts: payload.data,
        },
        updated: true,
      }
    case SET_SAFE_BROWSE_PASSWORD:
      return {
        ...state,
        entity: {
          ...state.entity,
          sebPassword: payload.data,
        },
      }
    case UPDATE_TEST_STATUS:
      return {
        ...state,
        entity: {
          ...state.entity,
          status: payload,
        },
      }
    case CLEAR_TEST_DATA:
      return {
        ...state,
        entity: {
          ...state.entity,
          itemGroups: [
            {
              ...NewGroup,
              _id: nanoid(),
            },
          ],
          grades: [],
          subjects: [],
        },
        updated: false,
        createdItems: [],
        thumbnail: '',
        sharedUsersList: [],
      }
    case SET_CREATED_ITEM_TO_TEST:
      return {
        ...state,
        createdItems: [payload, ...state.createdItems],
        updated: true,
      }
    case TEST_CREATE_SUCCESS:
      return {
        ...state,
        updated: false,
        creating: false,
      }
    case UPDATE_SHARED_USERS_LIST:
      return {
        ...state,
        sharedUsersList: payload,
      }
    case CLEAR_CREATED_ITEMS_FROM_TEST:
      return {
        ...state,
        createdItems: [],
      }
    case REPLACE_TEST_ITEMS:
      return {
        ...state,
        entity: {
          ...payload,
        },
      }
    case SET_PASSAGE_ITEMS:
      return {
        ...state,
        passageItems: [...payload],
      }
    case SET_DEFAULT_TEST_TYPE_PROFILES:
      // eslint-disable-next-line no-case-declarations
      const {
        performanceBand = {},
        standardGradingScale = {},
      } = getDefaultScales(state, payload)
      return {
        ...state,
        defaultTestTypeProfiles: payload.defaultTestTypeProfiles,
        entity: {
          ...state.entity,
          performanceBand,
          standardGradingScale,
        },
      }
    case SET_LOADING_TEST_PAGE:
      return { ...state, loading: payload }
    case UPDATE_QUESTION:
      return produce(state, (_state) => {
        if (_state.entity.isDocBased) {
          const newSubjects =
            payload?.alignment
              ?.flatMap((x) => x.subject)
              ?.filter((x) => x && x?.trim()) || []
          const newGrades =
            payload?.alignment?.flatMap((x) => x.grades || []) || []
          _state.entity.grades = _uniq([..._state.entity.grades, ...newGrades])
          _state.entity.subjects = _uniq([
            ..._state.entity.subjects,
            ...newSubjects,
          ])
        }
      })
    case APPROVE_OR_REJECT_MULTIPLE_ITEM_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const itemIdsMap = _keyBy(payload.itemIds)

      return {
        ...state,
        entity: {
          ...state.entity,
          itemGroups: [
            {
              ...state.entity.itemGroups[0],
              items: state.entity.itemGroups[0].items.map((i) => {
                if (itemIdsMap[i._id]) {
                  return {
                    ...i,
                    status: payload.status,
                  }
                }
                return i
              }),
            },
          ],
        },
      }
    case APPROVE_OR_REJECT_SINGLE_TEST_SUCCESS:
      return {
        ...state,
        entity: {
          ...state.entity,
          status: payload.status,
          collections: payload.collection
            ? payload.collection
            : state.entity.collections,
        },
      }
    case UPDATE_GROUP_DATA:
      // eslint-disable-next-line no-case-declarations
      const { testGrades, testSubjects, testTags } = getTestGradeAndSubject(
        payload?.updatedGroupData,
        state.entity.grades,
        state.entity.subjects,
        state.entity.tags
      )
      return {
        ...state,
        updated: true,
        entity: {
          ...state.entity,
          itemGroups: state.entity.itemGroups.map((group, index) => {
            if (index === payload.groupIndex) return payload.updatedGroupData
            return group
          }),
          grades: testGrades,
          subjects: testSubjects,
          tags: testTags,
        },
      }
    case ADD_NEW_GROUP:
      return {
        ...state,
        entity: {
          ...state.entity,
          itemGroups: [...state.entity.itemGroups, payload],
        },
      }
    case SET_CURRENT_GROUP_INDEX:
      return {
        ...state,
        currentGroupIndex: payload,
      }
    case DELETE_ITEMS_GROUP:
      return {
        ...state,
        updated: true,
        entity: {
          ...state.entity,
          itemGroups: state.entity.itemGroups.filter(
            (g) => g.groupName !== payload
          ),
        },
      }
    case ADD_ITEMS_TO_AUTOSELECT_GROUP:
      return {
        ...state,
        entity: {
          ...state.entity,
          itemGroups: produce(state.entity.itemGroups, (itemGroups) => {
            for (const itemGroup of itemGroups) {
              if (itemGroup.groupName === payload.groupName) {
                itemGroup.items = payload.items
                break
              }
            }
          }),
        },
      }
    case SET_TEST_PASSAGE_AFTER_CREATE:
      return {
        ...state,
        entity: {
          ...state.entity,
          passages: [...(state.entity.passages || []), payload],
        },
      }
    case UPDATE_CREATING:
      return {
        ...state,
        creating: payload,
      }
    case SET_DEFAULT_SETTINGS_LOADING:
      return {
        ...state,
        isSettingsLoading: payload,
      }
    case SET_AUTOSELECT_ITEMS_FETCHING_STATUS:
      return {
        ...state,
        isFetchingAutoselectItems: payload,
      }
    case SET_REGRADING_STATE:
      return {
        ...state,
        regrading: payload,
      }
    case SET_EDIT_ENABLE:
      return {
        ...state,
        editEnable: payload,
      }

    case SET_CURRENT_ANNOTATION_TOOL:
      return {
        ...state,
        currentAnnotationTool: payload,
      }
    case UPDATE_ANNOTATION_TOOLS_PROPERTIES:
      return {
        ...state,
        annotationToolsProperties: produce(
          state.annotationToolsProperties,
          (propertiesByKey) => {
            if (propertiesByKey[payload.key]) {
              propertiesByKey[payload.key] = {
                ...propertiesByKey[payload.key],
                ...payload?.value,
              }
            } else {
              propertiesByKey[payload.key] = payload.value
            }
          }
        ),
      }
    case SET_ANNOTATIONS_STACK:
      return {
        ...state,
        annotationsStack: [],
      }
    case UNDO_ANNOTATONS_OPERATION:
      return produce(state, (draft) => {
        const annotation = draft.entity.annotations.pop()
        draft.annotationsStack.push(annotation)
      })
    case REDO_ANNOTATONS_OPERATION:
      return produce(state, (draft) => {
        const annotation = draft.annotationsStack.pop()
        draft.entity.annotations.push(annotation)
      })

    case UPDATE_TEST_LIKE_COUNT:
      return {
        ...state,
        entity: {
          ...state.entity,
          analytics: [
            {
              usage: state.entity?.analytics?.[0]?.usage,
              likes: payload.toggleValue
                ? (state.entity?.analytics?.[0]?.likes || 0) + 1
                : (state.entity?.analytics?.[0]?.likes || 1) - 1,
            },
          ],
          alreadyLiked: payload.toggleValue,
        },
      }
    case UPDATE_TEST_ITEM_LIKE_COUNT:
      return {
        ...state,
        entity: {
          ...state.entity,
          itemGroups: state.entity.itemGroups.map((itemGroup) => {
            const items = itemGroup.items.map((i) => {
              if (i.versionId === payload.versionId) {
                return {
                  ...i,
                  analytics: [
                    {
                      usage: i?.analytics?.[0]?.usage || 0,
                      likes: payload.toggleValue
                        ? (i?.analytics?.[0]?.likes || 0) + 1
                        : (i?.analytics?.[0]?.likes || 1) - 1,
                    },
                  ],
                  alreadyLiked: payload.toggleValue,
                }
              }
              return i
            })
            return {
              ...itemGroup,
              items,
            }
          }),
        },
      }
    case RESET_UPDATED_TEST_STATE:
      return {
        ...state,
        updated: false,
      }
    case SET_UPDATING_TEST_FOR_REGRADE_STATE:
      return {
        ...state,
        updatingTestForRegrade: payload,
      }
    case SET_NEXT_PREVIEW_ITEM:
      return {
        ...state,
        nextItemId: payload,
      }
    case SET_REGRADE_FIRESTORE_DOC_ID:
      return {
        ...state,
        regradeFirestoreDocId: payload,
      }
    case SET_CORRECT_PSSAGE_ITEMS_CREATED:
      return {
        ...state,
        createdItems: state.createdItems.map(
          (i) => payload.find((it) => it._id === i._id) || i
        ),
      }
    case SET_SHARING_CONTENT_STATE:
      return {
        ...state,
        isSharingContent: payload,
      }
    case UPDATE_EMAIL_NOTIFICATION_DATA:
      return {
        ...state,
        ...payload,
      }
    case GET_REGRADE_ACTIONS:
      return {
        ...state,
        loadRegradeSettings: true,
      }
    case SET_REGRADE_ACTIONS:
      return {
        ...state,
        availableRegradeSettings: payload,
        loadRegradeSettings: false,
      }
    default:
      return state
  }
}

/**
 * Return all question of a test.
 * @param {Object} itemGroups - list of item groups
 *  itemGroups will be array of groups having testItems in it.
 *
 */
export const getQuestions = (itemGroups = []) => {
  const allQuestions = []
  for (const itemGroup of itemGroups) {
    for (const item of itemGroup.items) {
      const { questions = [], resources = [] } = item.data || {}
      const questionsWithItemId = [...questions, ...resources].map((q) => ({
        ...q,
        testItemId: item._id,
      }))
      allQuestions.push(...questionsWithItemId)
    }
  }
  return allQuestions
}

// created user state here bcz of circular dependency.
// login ducks update test state for filters.
const userStateSelector = (state) => state.user

export const getUserFeatures = createSelector(
  userStateSelector,
  (state) => state.user.features
)

export const getReleaseScorePremiumSelector = createSelector(
  getTestSelector,
  getUserFeatures,
  (entity, features) => {
    const { subjects, grades } = entity
    return (
      features.assessmentSuperPowersReleaseScorePremium ||
      (grades &&
        subjects &&
        isFeatureAccessible({
          features,
          inputFeatures: 'assessmentSuperPowersReleaseScorePremium',
          gradeSubject: { grades, subjects },
        }))
    )
  }
)

export const getIsOverrideFreezeSelector = createSelector(
  getTestSelector,
  getUserIdSelector,
  (_test, userId) => {
    if (!_test.freezeSettings) {
      return false
    }
    if (_test?.authors?.some((author) => author._id === userId)) {
      return false
    }
    return true
  }
)

export const getAllTagsSelector = (state, tagType) => {
  const _state = stateSelector(state)
  return get(_state, ['tagsList', tagType], [])
}

export const getCurrentGroupIndexSelector = createSelector(
  stateSelector,
  (state) => state.currentGroupIndex
)

export const getTestSummarySelector = createSelector(
  getTestEntitySelector,
  (state) => createGroupSummary(state)
)

export const getTestCreatedItemsSelector = createSelector(
  stateSelector,
  (state) => get(state, 'createdItems', [])
)

const setTime = (userRole) => {
  const addDate = userRole !== 'teacher' ? 28 : 7
  return moment()
    .add('days', addDate)
    .set({ hour: 23, minute: 0, second: 0, millisecond: 0 })
}

const getAssignSettings = ({ userRole, entity, features, isPlaylist }) => {
  const testType = entity?.testType
  const { ASSESSMENT, COMMON, PRACTICE } = testConst.type
  const isAdmin =
    userRole === roleuser.SCHOOL_ADMIN || userRole === roleuser.DISTRICT_ADMIN
  const settings = {
    startDate: moment(),
    class: [],
    endDate: setTime(userRole),
    passwordPolicy: entity.passwordPolicy,
    passwordExpireIn: entity.passwordExpireIn,
    assignmentPassword: entity.assignmentPassword,
    timedAssignment: entity.timedAssignment,
    restrictNavigationOut: entity.restrictNavigationOut,
    restrictNavigationOutAttemptsThreshold:
      entity.restrictNavigationOutAttemptsThreshold,
    blockSaveAndContinue: entity.blockSaveAndContinue,
  }

  if (isAdmin) {
    settings.testType = testType === PRACTICE ? PRACTICE : COMMON
    settings.openPolicy =
      assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
  }

  if (!isAdmin) {
    settings.testType = testType || ASSESSMENT
    settings.openPolicy = assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE
  }

  if (entity.timedAssignment) {
    settings.allowedTime = entity.allowedTime || 10 * 60 * 1000
    settings.pauseAllowed = entity.pauseAllowed || false
  }

  if (!isPlaylist && features.free && !features.premium) {
    settings.testType = ASSESSMENT
    settings.maxAttempts = 1
    settings.markAsDone = completionTypes.AUTOMATICALLY
    settings.releaseScore = releaseGradeLabels.DONT_RELEASE
    settings.safeBrowser = false
    settings.shuffleAnswers = false
    settings.shuffleQuestions = false
    settings.calcType = calculatorTypes.NONE
    settings.answerOnPaper = false
    settings.maxAnswerChecks = 0
    settings.scoringType = evalTypeLabels.PARTIAL_CREDIT
    settings.penalty = false
    settings.passwordPolicy = passwordPolicy.REQUIRED_PASSWORD_POLICY_OFF
    settings.timedAssignment = false
  }

  return settings
}

function validateRestrictNavigationOut(data) {
  if (
    data?.restrictNavigationOut === 'warn-and-report-after-n-alerts' &&
    !data?.restrictNavigationOutAttemptsThreshold
  ) {
    notification({
      type: 'warning',
      msg: 'Please enter a valid input for Restrict Navigation Out of Test',
    })
    document
      .getElementById('restrict-navigation-out')
      ?.querySelector('.ant-input-number-input')
      ?.focus()
    return false
  }
  return true
}

// saga
function* receiveTestByIdSaga({ payload }) {
  try {
    const tests = yield select((state) => state.tests)
    let createdItems = yield select(getTestCreatedItemsSelector)
    const entity = yield call(testsApi.getById, payload.id, {
      data: true,
      requestLatest: payload.requestLatest,
      editAndRegrade: payload.editAssigned,
      ...(payload.playlistId ? { playlistId: payload.playlistId } : {}),
    })
    const userId = yield select(getUserIdSelector)
    const typeOfAuthor = authorType(userId, entity)
    if (payload.editAssigned && isRegraded(typeOfAuthor, entity, payload.id)) {
      const routerState = yield select(({ router }) => router.location.state) ||
        {}
      yield put(setTestDataAction({ updated: false }))
      yield put(
        push({
          pathname: `/author/assignments/regrade/new/${entity._id}/old/${entity.previousTestId}`,
          state: { ...routerState, isRedirected: true },
        })
      )
      return
    }
    entity.passages = [
      ...entity.passages,
      ...differenceBy(tests.entity.passages, entity.passages, '_id'),
    ]
    const currentGroupIndex = yield select(getCurrentGroupIndexSelector)
    if (entity._id !== payload.id && !payload?.isPlaylist) {
      yield put(
        push({
          pathname: `/author/tests/tab/review/id/${entity._id}`,
          state: {
            showCancelButton: payload.editAssigned,
            editAssigned: payload.editAssigned,
          },
        })
      )
    }

    entity.itemGroups.forEach((itemGroup, groupIndex) => {
      itemGroup.items.forEach((item, itemIndex) => {
        if (
          createdItems?.[0]?._id === item._id ||
          createdItems?.[0]?.previousTestItemId === item._id
        ) {
          entity.itemGroups[groupIndex].items[itemIndex] = createdItems[0]
          createdItems = createdItems?.slice(1) || []
        }
      })
    })

    entity.itemGroups[currentGroupIndex].items = uniqBy(
      [...entity.itemGroups[currentGroupIndex]?.items, ...createdItems],
      (x) => x.previousTestItemId || x._id
    )

    const questions = getQuestions(entity.itemGroups)
    yield put(loadQuestionsAction(_keyBy(questions, 'id')))
    yield put(receiveTestByIdSuccess(entity))
    yield put(getDefaultTestSettingsAction(entity))
    yield put(
      setTestItemsAction(
        entity.itemGroups
          .flatMap((itemGroup) => itemGroup.items || [])
          .map((item) => item._id)
      )
    )
    if (!isEmpty(entity.freeFormNotes)) {
      yield put(
        saveUserWorkAction({
          [entity.itemGroups?.[0]?.items?.[0]?._id]: {
            scratchpad: entity.freeFormNotes || {},
          },
        })
      )
    }
    if (entity.thumbnail === defaultImage) {
      const thumbnail = yield call(testsApi.getDefaultImage, {
        subject: get(entity, 'subjects[0]', 'Other Subjects'),
        standard: get(entity, 'summary.standards[0].identifier', ''),
      })
      yield put(updateDefaultThumbnailAction(thumbnail))
    }

    const userRole = yield select(getUserRole)
    const features = yield select(getUserFeatures)
    const assignSettings = getAssignSettings({
      userRole,
      entity,
      isPlaylist: payload.isPlaylist,
      features,
    })
    yield put(updateAssingnmentSettingsAction(assignSettings))
  } catch (err) {
    captureSentryException(err)
    console.log({ err })
    const errorMessage = 'Unable to retrieve test info.'
    if (err.status === 403) {
      yield put(push('/author/tests'))
      notification({ type: 'error', messageKey: 'curriculumMakeApiErr' })
    } else {
      notification({ msg: errorMessage })
    }
    yield put(receiveTestByIdError(errorMessage))
  }
}

function* createTest(data) {
  const { title, passwordPolicy: _passwordPolicy } = data

  if (title !== undefined && !title.trim().length) {
    return notification({ messageKey: 'nameShouldNotEmpty' })
  }
  if (_passwordPolicy !== test.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC) {
    delete data.assignmentPassword
  }

  if (
    _passwordPolicy !== test.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
  ) {
    delete data.passwordExpireIn
  }
  const omitedItems = [
    'assignments',
    'createdDate',
    'updatedDate',
    'passages', // not accepted by backend validator (testSchema)  EV-10685
    'isUsed',
    'currentTab', // not accepted by backend validator (testSchema) EV-10685,
    'summary',
    'alreadyLiked',
  ]
  if (data.testType !== test.type.COMMON) {
    omitedItems.push('freezeSettings')
  }
  const dataToSend = omit(data, omitedItems)
  // we are getting testItem ids only in payload from cart, but whole testItem Object from test library.
  dataToSend.itemGroups = transformItemGroupsUIToMongo(data.itemGroups)
  const entity = yield call(testsApi.create, dataToSend)
  yield put({
    type: UPDATE_ENTITY_DATA,
    payload: {
      entity: { ...entity, itemGroups: data.itemGroups },
    },
  })
  return entity
}

function* createTestSaga({ payload }) {
  try {
    if (!validateRestrictNavigationOut(payload.data)) {
      return
    }
    const entity = yield createTest(payload.data)
    entity.itemGroups = payload.data.itemGroups
    yield put(createTestSuccessAction(entity))
    const currentTab = payload.isCartTest ? 'description' : 'addItems'
    yield put(replace(`/author/tests/tab/${currentTab}/id/${entity._id}`))
    notification({ type: 'success', messageKey: 'testCreated' })
  } catch (err) {
    captureSentryException(err)
    console.log({ err })

    const errorMessage = err?.data?.message || 'Failed to create test!'
    notification({ msg: errorMessage })
    yield put(createTestErrorAction(errorMessage))
  }
}

function hasInvalidItem(testData) {
  return testData.itemGroups.find((x) => x.items.find((_item) => !_item.itemId))
}

export function* updateTestSaga({ payload }) {
  try {
    if (!validateRestrictNavigationOut(payload.data)) {
      yield put(setTestsLoadingAction(false))
      return
    }
    // dont set loading as true
    if (!payload.disableLoadingIndicator) yield put(setTestsLoadingAction(true))
    const { scoring = {}, currentTab } = payload.data
    const testFieldsToOmit = [
      '_id',
      'updatedDate',
      'createdDate',
      'assignments',
      'authors',
      'createdBy',
      'passages',
      'isUsed',
      'scoring',
      'sharedType',
      'currentTab',
      'summary',
      'alreadyLiked',
    ]
    // remove createdDate and updatedDate
    const oldId = payload.data._id
    if (payload.data.testType !== test.type.COMMON) {
      testFieldsToOmit.push('freezeSettings')
    }

    // Backend doesn't require PARTIAL_CREDIT_IGNORE_INCORRECT
    // Penalty true/false is set to determine the case
    if (
      payload.data.scoringType ===
      test.evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT
    ) {
      payload.data.scoringType = test.evalTypeLabels.PARTIAL_CREDIT
    }

    const pageStructure = get(payload.data, 'pageStructure', []).map(
      (page) => ({
        ...page,
        _id: undefined,
      })
    )

    payload.data.pageStructure = pageStructure.length
      ? pageStructure
      : undefined
    if (
      payload.data.passwordPolicy !==
      test.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
    ) {
      testFieldsToOmit.push('passwordExpireIn')
    }
    if (
      payload.data.passwordPolicy !==
      test.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC
    ) {
      testFieldsToOmit.push('assignmentPassword')
    } else if (
      payload.data.passwordPolicy ===
        test.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC &&
      (!payload.data.assignmentPassword ||
        payload.data.assignmentPassword.length < 6 ||
        payload.data.assignmentPassword.length > 25)
    ) {
      notification({ messageKey: 'enterValidPassword' })
      return yield put(setTestsLoadingAction(false))
    }

    payload.data.itemGroups = transformItemGroupsUIToMongo(
      payload.data.itemGroups,
      scoring
    )

    const role = yield select(getUserRole)
    if (role === roleuser.EDULASTIC_CURATOR) {
      payload.data.performanceBand = pick(payload.data?.performanceBand, [
        '_id',
        'name',
      ])
      payload.data.standardGradingScale = pick(
        payload.data?.standardGradingScale,
        ['_id', 'name']
      )
    }

    const testData = omit(payload.data, testFieldsToOmit)
    if (hasInvalidItem(testData)) {
      console.warn('test data has invalid item', testData)
      Sentry.configureScope((scope) => {
        scope.setExtra('testData', testData)
        Sentry.captureException(new Error('testDataHasInvalidException'))
      })
      return
    }
    const entity = yield call(testsApi.update, { ...payload, data: testData })
    if (isEmpty(entity)) {
      return
    }
    yield put(updateTestSuccessAction(entity))
    const newId = entity._id
    const userRole = yield select(getUserRole)
    const isCurator = yield select(getIsCurator)
    if (oldId !== newId && newId) {
      if (!payload.assignFlow) {
        notification({ type: 'success', messageKey: 'testVersioned' })
        let url = `/author/tests/${newId}/versioned/old/${oldId}`
        if (currentTab) {
          url = `/author/tests/tab/${currentTab}/id/${newId}/old/${oldId}`
        }
        const locationState = yield select(
          (state) => get(state, 'router.location.state'),
          {}
        )
        yield put(
          push({
            pathname: url,
            state: locationState,
          })
        )
      }
    } else if (!payload.assignFlow) {
      if (userRole === roleuser.EDULASTIC_CURATOR || isCurator)
        notification({ type: 'success', messageKey: 'testSaved' })
      else notification({ type: 'success', messageKey: 'testSavedAsDraft' })
    }
    yield put(setTestsLoadingAction(false))
    return entity
  } catch (err) {
    captureSentryException(err, {
      errorMessage: 'failed to update test',
      saga: 'updateTestSaga',
      data: payload,
    })
    console.error(err)
    const errorMessage = err?.data?.message || 'Unable to update the test.'
    notification({ type: 'error', msg: errorMessage })
    yield put(updateTestErrorAction(errorMessage))
    yield put(setTestsLoadingAction(false))
    yield put(setUpdatingTestForRegradeStateAction(false))
  }
}

function* updateTestDocBasedSaga({ payload }) {
  try {
    if (!validateRestrictNavigationOut(payload.data)) {
      yield put(setUpdatingTestForRegradeStateAction(false))
      return
    }
    const _questions =
      payload?.data?.itemGroups?.[0]?.items?.[0]?.data?.questions || []
    const QuestionsbyId = {}
    // rely on versionId else fallback to questionId
    _questions.forEach((q) => {
      QuestionsbyId[q?.versionId || q.id] = q
    })
    const assessmentQuestions = yield select(getQuestionsArraySelector)
    const [testItem] = payload.data.itemGroups[0].items
    delete payload.data.alreadyLiked
    const testItemId = typeof testItem === 'object' ? testItem._id : testItem
    const resourceTypes = [
      questionType.VIDEO,
      questionType.PASSAGE,
      questionType.TEXT,
    ]

    const resources = assessmentQuestions.filter((q) =>
      resourceTypes.includes(q.type)
    )
    const questions = assessmentQuestions
      .filter((q) => !resourceTypes.includes(q.type))
      .map((q) =>
        QuestionsbyId[q.id]?.previousQuestionId
          ? {
              ...q,
              versionId: QuestionsbyId[q.id].versionId,
              previousQuestionId: QuestionsbyId[q.id].previousQuestionId,
            }
          : q
      )
    const updatedTestItem = {
      ...testItem,
      public: undefined,
      authors: undefined,
      version: testItem.version,
      isDocBased: true,
      data: {
        questions,
        resources,
      },
      rows: [
        {
          tabs: [],
          dimension: '100%',
          widgets: assessmentQuestions.map(createWidget),
        },
      ],
      itemLevelScoring: false,
    }

    const response = yield call(updateItemDocBasedSaga, {
      payload: {
        id: testItemId,
        data: updatedTestItem,
        keepData: true,
        redirect: false,
      },
    })

    const { testId, ...updatedItem } = response || {}

    // Updating the annotation question Id references using updated item question ids.
    if (
      updatedItem?.data?.questions?.length &&
      payload?.data?.annotations?.length
    ) {
      const versionedQIdMap = {}
      updatedItem.data.questions.forEach((question) => {
        const oldQId = question.previousQuestionId
        const newQId = question.id
        if (!!oldQId && oldQId !== newQId) {
          versionedQIdMap[oldQId] = newQId
        }
      })
      if (Object.keys(versionedQIdMap).length) {
        payload.data.annotations.forEach((annotation) => {
          annotation.questionId = versionedQIdMap[annotation.questionId]
        })
      }
    }

    const newAssessment = {
      ...payload.data,
      itemGroups: [
        {
          ...payload.data.itemGroups[0],
          items: [{ _id: testItemId, ...updatedItem }],
        },
      ],
    }

    const entityData = yield call(updateTestSaga, {
      payload: { ...payload, data: newAssessment },
    })
    return entityData
  } catch (err) {
    captureSentryException(err, {
      errorMessage: 'failed to update docbased test',
      saga: 'updateTestDocBasedSaga',
      data: payload,
    })
    const errorMessage = err?.data?.message || 'Unable to update the test.'
    notification({ type: 'error', msg: errorMessage })
    yield put(updateTestErrorAction(errorMessage))
    yield put(setUpdatingTestForRegradeStateAction(false))
  }
}

function* updateRegradeDataSaga({ payload }) {
  try {
    yield put(setRegradingStateAction(true))
    yield call(testsApi.publishTest, payload.newTestId)
    const { message, firestoreDocId } = yield call(
      assignmentApi.regrade,
      payload
    )
    yield put(setRegradeFirestoreDocId(firestoreDocId))
    notification({ type: 'info', msg: message })
  } catch (err) {
    const {
      data: { message: errorMessage },
    } = err.response
    captureSentryException(err)
    notification({
      type: 'error',
      msg: errorMessage || 'Unable to publish & regrade.',
    })
    yield put(setRegradeFirestoreDocId(''))
    yield put(setRegradingStateAction(false))
  }
}

function* shareTestSaga({ payload }) {
  try {
    yield put(setSharingContentStateAction(true))
    yield call(contentSharingApi.shareContent, payload)
    yield put(
      receiveSharedWithListAction({
        contentId: payload.contentId,
        contentType: payload.data.contentType,
      })
    )
    yield put(setSharingContentStateAction(false))
    yield put(
      updateEmailNotificationDataAction({
        sendEmailNotification: false,
        showMessageBody: false,
        notificationMessage: '',
      })
    )
    notification({ type: 'success', messageKey: 'sharedPlaylist' })
  } catch (err) {
    const {
      data: { message: errorMessage, invalidEmails = [] },
    } = err.response
    captureSentryException(err)
    const hasInvalidMails = invalidEmails.length > 0
    if (hasInvalidMails) {
      return notification({
        msg: `Invalid mails found (${invalidEmails.join(', ')})`,
      })
    }
    yield put(setSharingContentStateAction(false))
    notification({ msg: errorMessage || 'Sharing failed' })
  }
}

function* publishTestSaga({ payload }) {
  try {
    const { _id: id, test: _test, assignFlow } = payload
    if (!validateRestrictNavigationOut(_test)) {
      return
    }
    const defaultThumbnail = yield select(getDefaultThumbnailSelector)
    _test.thumbnail =
      _test.thumbnail === defaultImage ? defaultThumbnail : _test.thumbnail
    const assessmentQuestions = yield select(getQuestionsArraySelector)
    const resourceTypes = [
      questionType.VIDEO,
      questionType.PASSAGE,
      questionType.TEXT,
      questionType.COMBINATION_MULTIPART,
    ]
    const questions = assessmentQuestions.filter(
      (q) => !resourceTypes.includes(q.type)
    )

    const standardPresent = questions.some(hasStandards)
    // if alignment data is not present, set the flag to open the modal, and wait for
    // an action from the modal.!
    if (!standardPresent && _test.isDocBased) {
      yield put(togglePublishWarningModalAction(true))
      // action dispatched by the modal.
      const { payload: publishItem } = yield take(PROCEED_PUBLISH_ACTION)
      yield put(togglePublishWarningModalAction(false))

      // if he wishes to add some just close the modal, and go to metadata.
      // else continue the normal flow.
      if (!publishItem) {
        return
      }
    }
    const result = yield call(
      _test.isDocBased ? updateTestDocBasedSaga : updateTestSaga,
      {
        payload: { id, data: _test, assignFlow: true },
      }
    )

    if (!result) return

    const features = yield select(getUserFeatures)
    if (features.isPublisherAuthor && !assignFlow) {
      yield call(testsApi.updateTestStatus, {
        testId: id,
        status: testItemStatusConstants.INREVIEW,
      })
      yield put(updateTestStatusAction(testItemStatusConstants.INREVIEW))
      notification({ type: 'success', messageKey: 'reviewPlaylist' })
    } else {
      yield call(testsApi.publishTest, id)
      yield put(updateTestStatusAction(testItemStatusConstants.PUBLISHED))
    }
    if (features.isCurator || features.isPublisherAuthor) {
      yield put(push(`/author/tests?filter=AUTHORED_BY_ME`))
      return notification({
        type: 'success',
        messageKey: 'testSavedSuccessfullyNotVisible',
      })
    }
    if (!assignFlow) {
      notification({ type: 'success', messageKey: 'publishedPlaylist' })
    }
    if (assignFlow) {
      let update = { timedAssignment: _test?.timedAssignment }
      if (_test?.timedAssignment) {
        update = {
          ...update,
          allowedTime: _test?.allowedTime || 10 * 60 * 1000,
          pauseAllowed: _test?.pauseAllowed || false,
        }
      }
      /**
       * during assign flow , putting default settings
       */
      yield put(updateAssingnmentSettingsAction(update))

      yield put(push(`/author/assignments/${id}`))
    } else {
      const role = yield select(getUserRole)
      if (role !== roleuser.EDULASTIC_CURATOR)
        yield put(push(`/author/tests/${id}/publish`))
      else {
        const entityTest = yield select(getTestEntitySelector)
        entityTest.itemGroups.forEach((g) => {
          if (g.type === 'STATIC') {
            g.items.forEach((i) => {
              i.status = 'published'
            })
          }
        })
        yield put(updateTestEntityAction(entityTest))
      }
    }
  } catch (error) {
    Sentry.captureException(error)
    console.error(error)
    notification({
      type: 'success',
      msg: error?.data?.message || 'publish failed.',
    })
  }
}

/**
 *
 * @param {*} payload should be test ID
 */
function* publishForRegrade({ payload }) {
  try {
    yield put(setUpdatingTestForRegradeStateAction(true))
    const _test = yield select(getTestSelector)
    if (_test.isUsed && !test.isInEditAndRegrade) {
      _test.isInEditAndRegrade = true
    }
    if (!validateRestrictNavigationOut(_test)) {
      yield put(setUpdatingTestForRegradeStateAction(false))
      return
    }
    yield call(_test.isDocBased ? updateTestDocBasedSaga : updateTestSaga, {
      payload: {
        id: payload,
        data: _test,
        assignFlow: true,
        disableLoadingIndicator: true,
      },
    })
    const newTestId = yield select(getTestIdSelector)
    const locationState = yield select(({ router }) => router.location.state)
    yield put(
      push({
        pathname: `/author/assignments/regrade/new/${newTestId}/old/${_test.previousTestId}`,
        state: locationState,
      })
    )
    yield put(setUpdatingTestForRegradeStateAction(false))
  } catch (error) {
    Sentry.captureException(error)
    console.error(error)
    notification({ msg: error?.data?.message || 'publish failed.' })
    yield put(setUpdatingTestForRegradeStateAction(false))
  }
}

function* receiveSharedWithListSaga({ payload }) {
  try {
    const result = yield call(contentSharingApi.getSharedUsersList, payload)
    const coAuthors = result.map(
      ({ permission, sharedWith, sharedType, _id }) => ({
        permission,
        sharedWith,
        sharedType,
        sharedId: _id,
      })
    )
    yield put(updateSharedWithListAction(coAuthors))
  } catch (e) {
    Sentry.captureException(e)
    const errorMessage = 'Unable to retrieve shared list.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* deleteSharedUserSaga({ payload }) {
  try {
    yield call(contentSharingApi.deleteSharedUser, payload)
    yield put(
      receiveSharedWithListAction({
        contentId: payload.contentId,
        contentType: payload.contentType,
      })
    )
  } catch (e) {
    Sentry.captureException(e)
    const errorMessage = 'Unable to remove the user.'
    notification({ type: 'error', msg: errorMessage })
  }
}

// TODO: analyse and refactor this logic.
function* setTestDataAndUpdateSaga({ payload }) {
  try {
    let newTest = yield select(getTestSelector)
    // Backend doesn't require PARTIAL_CREDIT_IGNORE_INCORRECT
    // Penalty true/false is set to determine the case
    if (
      newTest.scoringType ===
      test.evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT
    ) {
      newTest = produce(newTest, (draft) => {
        draft.scoringType = test.evalTypeLabels.PARTIAL_CREDIT
      })
    }
    const currentGroupIndex = yield select(getCurrentGroupIndexSelector)
    const { addToTest, item, passageItems = [] } = payload
    if (addToTest) {
      if (passageItems?.length) {
        yield put(setCorrectPassageItemsCreatedAction(passageItems))
      }
      const items = uniqBy([...passageItems, item], '_id')
      newTest = produce(newTest, (draft) => {
        // add only items that are already not present
        items.forEach((i) => {
          if (
            !draft?.itemGroups?.[currentGroupIndex]?.items?.find(
              (x) => x._id === i._id
            )
          ) {
            draft.itemGroups[currentGroupIndex].items.push(i)
          }
        })
      })
    } else {
      newTest = produce(newTest, (draft) => {
        draft.itemGroups = draft.itemGroups.map((itemGroup) => {
          if (itemGroup.type !== ITEM_GROUP_TYPES.AUTOSELECT) {
            itemGroup.items = itemGroup.items.filter(
              (el) => el._id !== item._id
            )
          }
          return itemGroup
        })
      })
    }
    // getting grades and subjects from each question array in test items
    const { itemGroups = [] } = newTest
    const testItems = itemGroups
      .filter(({ type }) => type !== ITEM_GROUP_TYPES.AUTOSELECT)
      .flatMap((itemGroup) => itemGroup.items || [])
    const questionGrades = testItems
      .flatMap((_item) => (_item.data && _item.data.questions) || [])
      .flatMap((question) =>
        question.grades && question.grades.length < 13 ? question.grades : []
      )
    const questionSubjects = testItems
      .flatMap((_item) => (_item.data && _item.data.questions) || [])
      .flatMap((question) => question.subjects || [])
    // alignment object inside questions contains subject and domains
    const getAlignmentsObject = testItems
      .flatMap((_item) => (_item.data && _item.data.questions) || [])
      .flatMap((question) => question.alignment || [])

    const subjects = getAlignmentsObject
      .map((alignment) => alignment.subject)
      .filter(identity)

    // domains inside alignment object holds standards with grades

    const grades = getAlignmentsObject
      .flatMap((alignment) => alignment?.domains)
      .flatMap((domain) => domain?.standards)
      .flatMap((standard) =>
        (standard?.grades?.length || 0) < 13 ? standard?.grades : []
      )
      .filter(identity)

    yield put(
      getItemsSubjectAndGradeAction({
        subjects: _uniq([...subjects, ...questionSubjects]),
        grades: _uniq([...grades, ...questionGrades]),
      })
    )

    yield put(setTestDataAction(newTest))
    const creating = yield select(getTestsCreatingSelector)
    if (newTest._id || creating) {
      return
    }
    yield put(setIsCreatingAction(true))
    if (newTest.thumbnail === defaultImage) {
      const thumbnail = yield call(testsApi.getDefaultImage, {
        subject: get(newTest, 'data.subjects[0]', 'Other Subjects'),
        standard: get(newTest, 'data.summary.standards[0].identifier', ''),
      })
      yield put(updateDefaultThumbnailAction(thumbnail))
    }

    if (!newTest._id) {
      const { title, testContentVisibility } = newTest
      const role = yield select(getUserRole)
      if (!title) {
        return notification({ messageKey: 'nameShouldNotEmpty' })
      }
      if (
        newTest.passwordPolicy !==
        test.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
      ) {
        delete newTest.passwordExpireIn
      }
      if (
        newTest.passwordPolicy !==
        test.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC
      ) {
        delete newTest.assignmentPassword
      } else if (!newTest.assignmentPassword) {
        notification({ messageKey: 'enterValidPassword' })
        return
      }

      let testObj = produce(newTest, (draft) => {
        draft.itemGroups = transformItemGroupsUIToMongo(draft.itemGroups)
        if (
          !testContentVisibility &&
          (role === roleuser.DISTRICT_ADMIN || role === roleuser.SCHOOL_ADMIN)
        ) {
          draft.testContentVisibility = test.testContentVisibility.ALWAYS
        }
      })
      // summary CAN BE REMOVED AS BE WILL CREATE ITS OWN SUMMARY USING ITEMS
      // passages doesnt accepted by BE
      const omitedItems = ['passages', 'summary', 'alreadyLiked']
      if (testObj.testType !== test.type.COMMON) {
        omitedItems.push('freezeSettings')
      }
      testObj = omit(testObj, omitedItems)
      const entity = yield call(testsApi.create, testObj)
      const { itemGroups: _itemGroups } = yield select(getTestSelector)
      yield put({
        type: UPDATE_ENTITY_DATA,
        payload: {
          entity: { ...entity, itemGroups: _itemGroups },
        },
      })
      yield put(setIsCreatingAction(false))
      // TODO: is this logic still relevant?
      if (payload.current) {
        yield put(
          replace(`/author/tests/tab/${payload.current}/id/${entity._id}`)
        )
      } else {
        yield put(
          replace({
            pathname: `/author/tests/tab/addItems/id/${entity._id}`,
            state: { showItemAddedMessage: true, isAuthoredNow: true },
          })
        )
      }
      notification({
        type: 'success',
        msg: `Your work is automatically saved as a draft assessment named ${entity.title}`,
      })
    }

    // if item has passage, add the passage to test as well. (review tab requires it)
    if (item.passageId) {
      const currentPassages = yield select(getCurentTestPassagesSelector)
      const currentPassageIds = currentPassages.map((i) => i._id)
      const newPayload = {}
      if (!currentPassageIds.includes(item.passageId)) {
        const passage = yield call(passageApi.getById, item.passageId)
        newPayload.passages = [...currentPassages, passage]
        yield put(setTestDataAction(newPayload))
      }
    }
  } catch (err) {
    const {
      data: { message: errorMessage },
    } = err.response
    captureSentryException(err)

    notification({
      type: 'error',
      msg: errorMessage || 'Unable to save test.',
    })
  }
}

function* getEvaluation(testItemId, newScore) {
  const testItems = yield select(getTestItemsSelector)
  const testItem = testItems.find((x) => x._id === testItemId) || {}
  const { itemLevelScore, itemLevelScoring = false } = testItem
  const questions = _keyBy(testItem?.data?.questions, 'id')
  const answers = yield select((state) => get(state, 'answers', {}))
  const answersByQids = answersByQId(answers, testItem._id)
  const evaluation = yield evaluateItem(
    answersByQids,
    questions,
    itemLevelScoring,
    newScore || itemLevelScore,
    testItem._id
  )
  return evaluation
}
function* getEvaluationFromItem(testItem, newScore) {
  const { itemLevelScore, itemLevelScoring = false } = testItem
  const questions = _keyBy(testItem.data.questions, 'id')
  const answers = yield select((state) => get(state, 'answers', {}))
  const answersByQids = answersByQId(answers, testItem._id)
  const evaluation = yield evaluateItem(
    answersByQids,
    questions,
    itemLevelScoring,
    newScore || itemLevelScore,
    testItem._id
  )
  return evaluation
}

function* checkAnswerSaga({ payload }) {
  try {
    let evaluationObject = {}
    const { scoring } = yield select(getTestEntitySelector)
    if (payload.isItem) {
      evaluationObject = yield getEvaluationFromItem(
        payload,
        scoring[payload._id]
      )
    } else {
      evaluationObject = yield getEvaluation(payload.id, scoring[payload.id])
    }
    const { evaluation, score, maxScore } = evaluationObject
    yield put({
      type: ADD_ITEM_EVALUATION,
      payload: {
        ...evaluation,
      },
    })
    yield put({
      type: CHANGE_PREVIEW,
      payload: {
        view: 'check',
      },
    })

    yield put({
      type: SET_ITEM_SCORE,
      payload: {
        score: round(score, 2),
        maxScore,
        showScore: true,
      },
    })

    // message.success(`score: ${+score.toFixed(2)}/${maxScore}`);
  } catch (e) {
    Sentry.captureException(e)
    notification({ messageKey: 'checkAnswerFailed' })
    console.log('error checking answer', e)
  }
}

function* showAnswerSaga({ payload }) {
  try {
    const testItems = yield select(getTestItemsSelector)
    const testItem = testItems.find((x) => x._id === payload.id) || {}
    const answers = yield select((state) => get(state, 'answers', {}))
    let questions = _keyBy(testItem.data && testItem.data.questions, 'id')

    // when item is removed from the test, we get the question from the payload (i.e modal case)
    if (!questions || Object.keys(questions).length === 0) {
      const data = (payload.item ? payload.item.data : payload.data) || {
        questions: [],
      }
      // eslint-disable-next-line prefer-destructuring
      questions = data.questions.reduce((acc, curr) => {
        acc[curr.id] = curr
        return acc
      }, {})
    }

    const evaluation = yield createShowAnswerData(
      questions,
      answers,
      testItem._id
    )
    yield put({
      type: CHANGE_PREVIEW,
      payload: {
        view: 'show',
      },
    })
    yield put({
      type: ADD_ITEM_EVALUATION,
      payload: {
        ...evaluation,
      },
    })
  } catch (e) {
    Sentry.captureException(e)
    notification({ messageKey: 'loadAnswerFailed' })
    console.log('error showing answer', e)
  }
}

/** TODO: If this needs to be wired to UI say for loading etc, please move it to redux store
 *  This is meant only for dependent sagas to wait upon if in loading state.
 */
export const TAGS_SAGA_FETCH_STATUS = {
  isLoading: false,
}

function* getAllTagsSaga({ payload }) {
  try {
    TAGS_SAGA_FETCH_STATUS.isLoading = true
    const tags = yield call(tagsApi.getAll, payload.type)
    yield put({
      type: SET_ALL_TAGS,
      payload: { tags, tagType: payload.type },
    })
  } catch (e) {
    Sentry.captureException(e)
    yield put({
      type: SET_ALL_TAGS_FAILED,
    })
    notification({ messageKey: 'getAllTagsFailed' })
  } finally {
    TAGS_SAGA_FETCH_STATUS.isLoading = false
  }
}

function* getDefaultTestSettingsSaga({ payload: testEntity }) {
  try {
    yield put(setDefaultSettingsLoadingAction(true))
    const role = yield select(getUserRole)
    const orgData = yield select(getUserOrgData)
    let payload = {
      orgId: orgData?.districtIds?.[0],
      params: { orgType: 'district' },
    }

    if (role !== roleuser.DISTRICT_ADMIN && orgData.institutionIds.length) {
      payload = {
        orgId: orgData.institutionIds[0] || orgData?.districtIds?.[0],
        params: {
          orgType: 'institution',
        },
      }
    }
    let defaultTestSettings = {}
    if (role !== roleuser.EDULASTIC_CURATOR) {
      const currentSignupState = yield select(getUserSignupStatusSelector)
      if (
        role === roleuser.TEACHER &&
        currentSignupState == signUpState.ACCESS_WITHOUT_SCHOOL
      ) {
        const userId = yield select(getUserIdSelector)
        defaultTestSettings = yield call(testsApi.getDefaultTestSettings, {
          orgId: userId,
          params: { orgType: 'teacher' },
        })
      } else {
        defaultTestSettings = yield call(
          testsApi.getDefaultTestSettings,
          payload
        )
      }
    } else {
      const { performanceBand, standardGradingScale } = testEntity
      const performanceBandProfiles = [performanceBand]
      const standardsProficiencyProfiles = [standardGradingScale]
      const performanceBandId = performanceBand._id
      const standardProficiencyId = standardGradingScale._id
      const defaultTestTypeProfiles = {
        performanceBand: {
          common: performanceBandId,
          class: performanceBandId,
          practice: performanceBandId,
        },
        standardProficiency: {
          common: standardProficiencyId,
          class: standardProficiencyId,
          practice: standardProficiencyId,
        },
      }
      defaultTestSettings = {
        performanceBandProfiles,
        standardsProficiencyProfiles,
        defaultTestTypeProfiles,
      }
    }
    const {
      performanceBandProfiles,
      standardsProficiencyProfiles,
      defaultTestTypeProfiles: defaultTestProfiles,
      partialScore,
    } = defaultTestSettings
    yield put(receivePerformanceBandSuccessAction(performanceBandProfiles))
    yield put(
      receiveStandardsProficiencySuccessAction(standardsProficiencyProfiles)
    )
    yield put(setDefaultTestTypeProfilesAction(defaultTestSettings))
    const performanceBand =
      testEntity?.performanceBand ||
      getDefaultSettings({
        testType: testEntity?.testType,
        defaultTestProfiles,
      })?.performanceBand
    const standardGradingScale =
      testEntity?.standardGradingScale ||
      getDefaultSettings({
        testType: testEntity?.testType,
        defaultTestProfiles,
      })?.standardProficiency
    const testData = yield select(getTestSelector)
    const userId = yield select(getUserId)
    const isAuthor = testData.authors?.some((author) => author._id === userId)
    if (!testData.freezeSettings || isAuthor) {
      yield put(
        updateAssingnmentSettingsAction({
          performanceBand,
          standardGradingScale,
        })
      )
    }
    if ((!testData._id || !testData.title) && partialScore === false) {
      yield put(
        setTestDataAction({
          scoringType: test.evalTypeLabels.ALL_OR_NOTHING,
        })
      )
    }
    yield put(setDefaultSettingsLoadingAction(false))
  } catch (e) {
    Sentry.captureException(e)
    notification({ messageKey: 'getDeafultSettingsFailed' })
    yield put(setDefaultSettingsLoadingAction(false))
  }
}

function* duplicateTestSaga({ payload }) {
  yield put(setTestsLoadingAction(true))
  const { onRegrade = false } = payload
  try {
    const {
      _id,
      title,
      currentTab,
      isInEditAndRegrade = false,
      redirectToNewTest = false,
      cloneItems = false,
    } = payload
    const queryParams = { _id, title, isInEditAndRegrade, cloneItems }
    const data = yield call(assignmentApi.duplicateAssignment, queryParams)
    if (redirectToNewTest) {
      // cloning from test review page or test library (non-regrade flow)
      yield put(push(`/author/tests/${data._id}`))
      yield put(setEditEnableAction(true))
      yield put(setTestsLoadingAction(false))
      yield put(receiveTestByIdAction(data._id, true))
      return
    }
    yield put(push(`/author/tests/tab/${currentTab}/id/${data._id}/old/${_id}`))
    yield put(setTestsLoadingAction(false))
    yield put(receiveTestByIdAction(data._id, true))
  } catch (err) {
    const {
      data: { message: errorMessage },
    } = err.response
    captureSentryException(err)
    yield put(setTestsLoadingAction(false))
    yield put(setEditEnableAction(false))
    if (onRegrade === true && err?.status === 403) {
      yield put(setTestDataAction({ isUsed: false }))
      yield put(setCreateSuccessAction())
      return notification({
        msg: 'Duplicating the test permission denied and failed to regrade',
      })
    }
    return notification({ msg: errorMessage || 'Failed to duplicate test' })
  }
}

/*
 * add passage items to test.
 * dispatched when user want to add all items of passage to the test.
 */
function* setAndSavePassageItems({ payload: { passageItems, page, remove } }) {
  try {
    const currentGroupIndex = yield select(getCurrentGroupIndexSelector)
    const _test = yield select(getTestSelector)
    const { passageId } = passageItems?.[0] || {}
    const currentPassages = yield select(getCurentTestPassagesSelector)
    const currentPassageIds = currentPassages.map((i) => i._id)
    // new payload to update the tests' store's entity.
    const newPayload = {}
    // if passage is not already present, fetch it and add it to the payload.
    if (!currentPassageIds.includes(passageId)) {
      const passage = yield call(passageApi.getById, passageId)
      newPayload.passages = [...currentPassages, passage]
    }
    const testItems = yield select(getSelectedTestItemsSelector)
    newPayload.itemGroups = _test.itemGroups
    if (remove) {
      const passageItemIds = passageItems.map((x) => x._id)
      newPayload.itemGroups[currentGroupIndex].items = uniqBy(
        testItems.filter((x) => !passageItemIds.includes(x._id)),
        (x) => x._id
      )
    } else {
      newPayload.itemGroups[currentGroupIndex].items = uniqBy(
        [...testItems, ...passageItems],
        (x) => x._id
      )
    }
    const itemIds = _uniq(
      newPayload.itemGroups
        .flatMap((itemGroup) => itemGroup.items || [])
        .map((i) => i._id)
    )
    if (!_test._id && page !== 'itemList') {
      yield put(createTestAction({ ..._test, ...newPayload }))
    }
    // for weird reason there is another store to show if a testItem should be shown
    // as selected or not in item banks page. Adding test items to there.
    yield put(setTestItemsAction(itemIds))
    // update the test data wth testItems, and passage if needed.
    yield put(setTestDataAction(newPayload))
  } catch (e) {
    Sentry.captureException(e)
    notification({ messageKey: 'errorAddingPassageItems' })
    console.error('error', e, e.stack)
  }
}

/**
 * this saga is used to update the test before navigation.
 *  like, you want to move to edit/create item.. so save the test before navigating.
 *
 */
function* updateTestAndNavigate({ payload }) {
  try {
    let { pathname } = payload
    const {
      fadeSidebar = false,
      regradeFlow,
      previousTestId,
      testId,
      isEditing,
      isDuplicating,
    } = payload
    const data = yield select(getTestSelector)
    const role = yield select(getUserRole)
    const hasUnsavedChanges = yield select((state) => state?.tests?.updated)
    if (hasUnsavedChanges) {
      const isTestCreated = testId && testId !== 'undefined'
      if (
        !isTestCreated &&
        data.testType === test.type.COMMON &&
        roleuser.DA_SA_ROLE_ARRAY.includes(role) &&
        !data.testContentVisibility
      ) {
        data.testContentVisibility = test.testContentVisibility.ALWAYS
      }
      const _test = !isTestCreated ? yield createTest(data) : {}
      if ((isEditing || isDuplicating) && isTestCreated) {
        yield updateTestSaga({ payload: { data, id: testId } })
      }
      if (!isTestCreated) {
        pathname = pathname.replace('undefined', _test._id)
      }
    }

    yield put(
      push(pathname, {
        isTestFlow: true,
        fadeSidebar,
        regradeFlow,
        previousTestId,
      })
    )
  } catch (e) {
    Sentry.captureException(e)
    notification({ messageKey: 'errorUpdatingTest' })
    console.error('err', e)
  }
}

function* approveOrRejectSingleTestSaga({ payload }) {
  try {
    if (
      payload.status === 'published' &&
      (!payload.collections ||
        (payload.collections && !payload.collections.length))
    ) {
      notification({
        type: 'warn',
        messageKey: 'testNotAssociatedWithCollection',
      })
      return
    }
    payload = omit(payload, ['alreadyLiked'])
    yield call(testsApi.updateTestStatus, payload)
    yield put(approveOrRejectSingleTestSuccessAction(payload))
    notification({
      type: 'success',
      msg: `Test ${
        payload.status === 'published' ? 'Approved' : 'Rejected'
      } Successfully.`,
    })
    yield put(push('/author/tests'))
  } catch (error) {
    Sentry.captureException(error)
    console.error(error)
    notification({
      msg:
        error?.data?.message ||
        `Test ${payload.status === 'published' ? 'Approve' : 'Reject'} Failed.`,
    })
  }
}

function tranformItemGroupToData(itemGroup, index, allStaticGroupItemIds) {
  const optionalFields = {
    depthOfKnowledge: itemGroup.dok,
    authorDifficulty: itemGroup.difficulty,
    tags: itemGroup.tags?.map((tag) => tag.tagName) || [],
  }
  Object.keys(optionalFields).forEach(
    (key) => optionalFields[key] === undefined && delete optionalFields[key]
  )
  return {
    data:
      itemGroup.type === ITEM_GROUP_TYPES.STATIC
        ? null
        : {
            limit: itemGroup.deliverItemsCount,
            search: {
              collectionId: itemGroup.collectionDetails._id,
              standardId: itemGroup.standardDetails.standardId,
              nInItemIds: allStaticGroupItemIds,
              ...optionalFields,
            },
          },
    isFetchItems: itemGroup.type === ITEM_GROUP_TYPES.AUTOSELECT,
    groupName: itemGroup.groupName,
    index,
  }
}

function getItemGroupsTransformed(_test) {
  const allStaticGroupItemIds = getStaticGroupItemIds(_test)
  return _test.itemGroups.map((itemGroup, index) =>
    tranformItemGroupToData(itemGroup, index, allStaticGroupItemIds)
  )
}

function* fetchAutoselectGroupItemsSaga(payload) {
  try {
    const response = yield call(testItemsApi.getAutoSelectedItems, payload)
    return response.items.map((i) => ({ ...i, autoselectedItem: true }))
  } catch (err) {
    captureSentryException(err)
    console.error(err)
    notification({ messageKey: 'failedToFetchAutoselectItems' })
    return null
  }
}

function* addItemsToAutoselectGroupsSaga({ payload: _test }) {
  try {
    yield put(setAutoselectItemsFetchingStatusAction(true))
    const transformedData = getItemGroupsTransformed(_test)
    for (const { isFetchItems, data, groupName } of transformedData) {
      if (isFetchItems) {
        const response = yield fetchAutoselectGroupItemsSaga(data)
        if (response) {
          yield put(
            addItemsToAutoselectGroupAction({ items: response, groupName })
          )
        }
      }
    }
    yield put(setAutoselectItemsFetchingStatusAction(false))
  } catch (err) {
    captureSentryException(err)
    yield put(setAutoselectItemsFetchingStatusAction(false))
    console.error(err)
  }
}

export function* addAutoselectGroupItems({ payload: _test }) {
  try {
    const transformedData = getItemGroupsTransformed(_test)
    const allStaticGroupItemIds = getStaticGroupItemIds(_test)
    const promises = transformedData.map(({ data, isFetchItems }) => {
      if (isFetchItems) {
        return testItemsApi
          .getAutoSelectedItems({
            ...data,
            search: { ...data.search, nInItemIds: allStaticGroupItemIds },
          })
          .then((response) => ({ ...response }))
      }
      return Promise.resolve(null)
    })

    const responses = yield Promise.all(promises)
    const itemGroups = _test.itemGroups.map((itemGroup, i) => {
      if (
        itemGroup.type === ITEM_GROUP_TYPES.AUTOSELECT &&
        transformedData?.[i].isFetchItems
      ) {
        return { ...itemGroup, items: responses[i].items }
      }
      return itemGroup
    })

    return { ..._test, itemGroups }
  } catch (err) {
    captureSentryException(err)
    console.error(err)
  }
}

function* toggleTestLikeSaga({ payload }) {
  try {
    if (payload.contentType === 'TEST')
      yield put(updateTestLikeCountAction(payload))
    else yield put(updateTestItemLikeCountAction(payload))
    yield call(analyticsApi.toggleLike, payload)
  } catch (e) {
    Sentry.captureException(e)
    console.error(e)
    payload = {
      ...payload,
      toggleValue: !payload.toggleValue,
    }
    if (payload.contentType === 'TEST')
      yield put(updateTestLikeCountAction(payload))
    else yield put(updateTestItemLikeCountAction(payload))
  }
}

function* getTestIdFromVersionIdSaga({ payload }) {
  try {
    const { testId } = yield call(testsApi.getTestIdFromVersionId, payload)
    if (testId) {
      yield put(push(`/author/tests/tab/review/id/${testId}`))
      yield put(receiveTestByIdAction(testId, true, false))
    }
  } catch (err) {
    Sentry.captureException(err)
    console.error(err)
    const errorMessage =
      err?.response?.data?.statusCode === 404
        ? 'You can no longer use this, as sharing access has been revoked by author'
        : 'Unable to retrieve test info.'
    yield put(push('/author/tests'))
    if (err.status === 403) {
      notification({ type: 'error', messageKey: 'curriculumMakeApiErr' })
    } else {
      notification({ msg: errorMessage })
    }
  }
}

function* getRegradeSettingsSaga({ payload }) {
  try {
    const result = yield call(assignmentApi.fetchRegradeSettings, payload)
    yield put(setAvailableRegradeAction(result))
  } catch (err) {
    Sentry.captureException(err)
    console.error(err)
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_TEST_BY_ID_REQUEST, receiveTestByIdSaga),
    yield takeEvery(CREATE_TEST_REQUEST, createTestSaga),
    yield takeEvery(UPDATE_TEST_REQUEST, updateTestSaga),
    yield Effects.throttleAction(
      10000,
      UPDATE_TEST_DOC_BASED_REQUEST,
      updateTestDocBasedSaga
    ),
    yield takeEvery(REGRADE_TEST, updateRegradeDataSaga),
    yield takeEvery(TEST_SHARE, shareTestSaga),
    yield takeEvery(TEST_PUBLISH, publishTestSaga),
    yield takeEvery(RECEIVE_SHARED_USERS_LIST, receiveSharedWithListSaga),
    yield takeEvery(DELETE_SHARED_USER, deleteSharedUserSaga),
    yield takeEvery(PREVIEW_CHECK_ANSWER, checkAnswerSaga),
    yield takeEvery(GET_ALL_TAGS_IN_DISTRICT, getAllTagsSaga),
    yield takeEvery(PREVIEW_SHOW_ANSWER, showAnswerSaga),
    yield takeEvery(RECEIVE_DEFAULT_TEST_SETTINGS, getDefaultTestSettingsSaga),
    yield takeEvery(PUBLISH_FOR_REGRADE, publishForRegrade),
    yield takeEvery(DUPLICATE_TEST_REQUEST, duplicateTestSaga),
    yield takeEvery(SET_AND_SAVE_PASSAGE_ITEMS, setAndSavePassageItems),
    yield takeLatest(UPDATE_TEST_AND_NAVIGATE, updateTestAndNavigate),
    yield takeEvery(
      APPROVE_OR_REJECT_SINGLE_TEST_REQUEST,
      approveOrRejectSingleTestSaga
    ),
    yield takeLatest(
      ADD_ITEMS_TO_AUTOSELECT_GROUPS_REQUEST,
      addItemsToAutoselectGroupsSaga
    ),
    yield takeEvery(SET_TEST_DATA_AND_SAVE, setTestDataAndUpdateSaga),
    yield takeLatest(TOGGLE_TEST_LIKE, toggleTestLikeSaga),
    yield takeLatest(GET_TESTID_FROM_VERSIONID, getTestIdFromVersionIdSaga),
    yield takeLatest(GET_REGRADE_ACTIONS, getRegradeSettingsSaga),
  ])
}
