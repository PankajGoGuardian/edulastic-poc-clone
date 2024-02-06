import { createSelector } from 'reselect'
import { createAction } from 'redux-starter-kit'
import {
  roleuser,
  questionType,
  test as testConstants,
  testTypes as testTypesConstants,
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
  isUndefined,
  findLastIndex,
} from 'lodash'
import {
  testsApi,
  assignmentApi,
  contentSharingApi,
  tagsApi,
  passageApi,
  testItemsApi,
  analyticsApi,
  settingsApi,
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
import {
  DEFAULT_TEST_TITLE,
  createGroupSummary,
  getSettingsToSaveOnTestType,
  showRubricToStudentsSetting,
} from './utils'
import {
  SET_MAX_ATTEMPT,
  UPDATE_TEST_IMAGE,
  SET_SAFE_BROWSE_PASSWORD,
  ADD_ITEM_EVALUATION,
  CHANGE_PREVIEW,
  APPROVE_OR_REJECT_MULTIPLE_ITEM_SUCCESS,
  TOGGLE_REGRADE_MODAL,
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
  getUserIdSelector,
  getUserId,
  getIsCurator,
  getUserSignupStatusSelector,
  getUserOrgId,
  currentDistrictInstitutionIds,
  getOrgGroupList,
  isPublisherUserSelector,
  isOrganizationDistrictSelector,
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
import {
  updateAssingnmentSettingsAction,
  UPDATE_ASSIGNMENT_SETTINGS_STATE,
} from '../AssignTest/duck'
import { SET_ITEM_SCORE } from '../src/ItemScore/ducks'
import { getIsloadingAssignmentSelector } from './components/Assign/ducks'
import { sortTestItemQuestions } from '../dataUtils'
import { answersByQId } from '../../assessment/selectors/test'
import { multiFind } from '../../common/utils/main'
import { hasValidResponse } from '../questionUtils'
import { getProfileKey } from '../../common/utils/testTypeUtils'
import selectsData from './components/common/selectsData'
import { itemFields } from '../AssessmentCreate/components/CreateAITest/ducks/constants'
import appConfig from '../../../app-config'

const { videoQuizDefaultCollection } = appConfig

const {
  ITEM_GROUP_TYPES,
  ITEM_GROUP_DELIVERY_TYPES,
  completionTypes,
  releaseGradeLabels,
  evalTypeLabels,
  passwordPolicy,
  testCategoryTypes,
  SHOW_IMMERSIVE_READER,
} = testConstants
const testItemStatusConstants = {
  INREVIEW: 'inreview',
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
}
const { WIDGET_TYPES } = questionType

export const NewGroup = {
  type: ITEM_GROUP_TYPES.STATIC /* Default : static */,
  groupName: 'SECTION 1' /* For now, auto-generated. */,
  items: [],
  deliveryType: ITEM_GROUP_DELIVERY_TYPES.ALL,
  index: 0,
}
export const NewGroupAutoselect = {
  type: ITEM_GROUP_TYPES.AUTOSELECT /* Default : static */,
  groupName: 'SECTION 1' /* For now, auto-generated. */,
  items: [],
  deliveryType: ITEM_GROUP_DELIVERY_TYPES.ALL_RANDOM,
  index: 0,
  difficulty: selectsData.allAuthorDifficulty[0].value,
}
export const createWidget = ({ id, type, title }) => ({
  widgetType: type === 'sectionLabel' ? 'resource' : 'question',
  type,
  title,
  reference: id,
  tabIndex: 0,
})

export const createNewStaticGroup = () => ({
  ...NewGroup,
  _id: nanoid(),
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
      if (
        itemGroup.type === ITEM_GROUP_TYPES.STATIC ||
        (itemGroup.type === ITEM_GROUP_TYPES.AUTOSELECT &&
          itemGroup.items?.length)
      ) {
        delete itemGroup.autoSelectItemsCount
        const isLimitedDeliveryType =
          itemGroup.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
        // For delivery type:LIMITED scoring should be as how item level scoring works
        itemGroup.items = itemGroup.items.map((o) => ({
          itemId: o._id,
          maxScore: isLimitedDeliveryType
            ? itemGroup.itemsDefaultMaxScore || 1
            : scoring[o._id] || helpers.getPoints(o),
          questions: o.data
            ? helpers.getQuestionLevelScore(
                {
                  ...o,
                  isLimitedDeliveryType,
                  itemsDefaultMaxScore: itemGroup.itemsDefaultMaxScore,
                },
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
    const gradesFromGroup = group?.standardDetails?.grades || []
    const subjectsFromGroup = group?.standardDetails?.subject
      ? [group.standardDetails.subject]
      : []
    const tagsFromGroup = group?.tags || []
    return {
      testGrades: _uniq([...testGrades, ...gradesFromGroup]),
      testSubjects: _uniq([...testSubjects, ...subjectsFromGroup]),
      testTags: _uniq([...testTags, ...tagsFromGroup]),
    }
  }
  return { testGrades, testSubjects, testTags: [] }
}

export const isRegradedByCoAuthor = (userId, entity, requestedTestId) => {
  if (
    entity.authors.some((item) => item._id === userId) &&
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
export const SET_FREEZE_TEST_SETTINGS =
  '[tests] set freeze test settings from test'
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
export const REPLACE_TEST_DATA = '[test] replace test data'
export const UPDATE_TEST_DEFAULT_IMAGE = '[test] update default thumbnail image'
export const SET_PASSAGE_ITEMS = '[tests] set passage items'
export const SET_AND_SAVE_PASSAGE_ITEMS = '[tests] set and save passage items'
export const GET_ALL_TAGS_IN_DISTRICT = '[test] get all tags in district'
export const SEARCH_TAG_LIST_REQUEST = '[test] search tags request'
export const SEARCH_TAG_LIST_SUCCESS = '[test] search tags success'
export const SEARCH_TAG_LIST_ERROR = '[test] search tags error'
export const SEARCH_TAGS_BY_IDS_REQUEST = '[test] search tags by id request'
export const APPEND_KNOWN_TAGS = '[test] append known tags'
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
export const DELETE_ITEM_GROUP_BY_GROUP_INDEX =
  '[tests] delete item group by group index'
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
export const SET_DEFAULT_TEST_SETTINGS = '[tests] set default test settings'
export const SAVE_TEST_SETTINGS = '[tests] save test settings'
export const SET_CURRENT_TEST_SETTINGS_ID =
  '[tests] set current test settings id action'
export const FETCH_TEST_SETTINGS_LIST = '[tests] fetch test settings list'
export const SET_TEST_SETTINGS_LIST = '[tests] set test settings list'
export const UPDATE_TEST_SETTING_IN_LIST = '[tests] update test setting in list'
export const ADD_TEST_SETTING_IN_LIST = '[tests] add test setting in list'
export const REMOVE_TEST_SETTING_FROM_LIST =
  '[tests] remove test setting from list'
export const DELETE_TEST_SETTING_REQUEST = '[tests] delete test setting request'
export const UPDATE_TEST_SETTING_REQUEST = '[tests] update test setting request'
export const SET_SHOW_REGRADE_CONFIRM =
  '[tests] set show regrade confirmation popup'
export const SET_SHOW_UPGRADE_POPUP = '[tests] set show upgrade popup'
export const SET_MAX_SHARING_LEVEL_ALLOWED =
  '[tests] set max sharing level allowed'
export const TOGGLE_PENALTY_ON_USING_HINTS =
  '[tests] toggle penalty on using hints'
export const SET_ENABLE_AUDIO_RESONSE_QUESTION =
  '[tests] set enable audio response question'
export const GET_YOUTUBE_THUMBNAIL_REQUEST =
  '[test] get youtube thumbnail request'
export const GET_YOUTUBE_THUMBNAIL_SUCCESS =
  '[test] get youtube thumbnail success'
export const SET_YOUTUBE_THUMBNAIL_FAILURE =
  '[test] set youtube thumbnail failure'
export const SET_ALLOW_SA_DISTRICT_COMMON_SETTING =
  '[tests] set allow school admin district common setting'
// actions

export const previewCheckAnswerAction = createAction(PREVIEW_CHECK_ANSWER)
export const previewShowAnswerAction = createAction(PREVIEW_SHOW_ANSWER)
export const replaceTestDataAction = createAction(REPLACE_TEST_DATA)
export const setNextPreviewItemAction = createAction(SET_NEXT_PREVIEW_ITEM)
export const updateDefaultThumbnailAction = createAction(
  UPDATE_TEST_DEFAULT_IMAGE
)
export const togglePenaltyOnUsingHintsAction = createAction(
  TOGGLE_PENALTY_ON_USING_HINTS
)
export const setEnableAudioResponseQuestionAction = createAction(
  SET_ENABLE_AUDIO_RESONSE_QUESTION
)
export const setPassageItemsAction = createAction(SET_PASSAGE_ITEMS)
export const setAndSavePassageItemsAction = createAction(
  SET_AND_SAVE_PASSAGE_ITEMS
)
export const getAllTagsAction = createAction(GET_ALL_TAGS_IN_DISTRICT)
export const searchTagsAction = createAction(SEARCH_TAG_LIST_REQUEST)
export const searchTagsByIdsAction = createAction(SEARCH_TAGS_BY_IDS_REQUEST)
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
export const deleteItemGroupByGroupIndexAction = createAction(
  DELETE_ITEM_GROUP_BY_GROUP_INDEX
)
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
export const setShowRegradeConfirmPopupAction = createAction(
  SET_SHOW_REGRADE_CONFIRM
)
export const setShowUpgradePopupAction = createAction(SET_SHOW_UPGRADE_POPUP)

export const setAvailableRegradeAction = createAction(SET_REGRADE_ACTIONS)
export const getYoutubeThumbnailAction = createAction(
  GET_YOUTUBE_THUMBNAIL_REQUEST
)
export const setYoutubeThumbnailAction = createAction(
  GET_YOUTUBE_THUMBNAIL_SUCCESS
)

export const setYoutubeThumbnailFailure = createAction(
  SET_YOUTUBE_THUMBNAIL_FAILURE
)
export const setCanSchoolAdminUseDistrictCommonAction = createAction(
  SET_ALLOW_SA_DISTRICT_COMMON_SETTING
)

export const receiveTestByIdAction = (
  id,
  requestLatest,
  editAssigned,
  isPlaylist = false,
  playlistId = undefined,
  options = {}
) => ({
  type: RECEIVE_TEST_BY_ID_REQUEST,
  payload: {
    id,
    requestLatest,
    editAssigned,
    isPlaylist,
    playlistId,
    options: {
      assigningNew: false,
      from: null,
      ...options,
    },
  },
})

export const receiveTestByIdSuccess = (entity) => ({
  type: RECEIVE_TEST_BY_ID_SUCCESS,
  payload: { entity },
})

export const setFreezeTestSettings = (freezeSettings) => ({
  type: SET_FREEZE_TEST_SETTINGS,
  payload: { freezeSettings },
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
export const regradeTestAction = (payload) => ({
  type: REGRADE_TEST,
  payload,
})

export const sendTestShareAction = createAction(TEST_SHARE)
export const publishTestAction = createAction(TEST_PUBLISH)
export const updateTestStatusAction = createAction(UPDATE_TEST_STATUS)
export const setRegradeOldIdAction = createAction(SET_REGRADE_OLD_TESTID)
export const updateSharedWithListAction = createAction(UPDATE_SHARED_USERS_LIST)
export const setMaxSharingLevelAllowedAction = createAction(
  SET_MAX_SHARING_LEVEL_ALLOWED
)
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

export const setDefaultTestSettingsAction = createAction(
  SET_DEFAULT_TEST_SETTINGS
)
export const saveTestSettingsAction = createAction(SAVE_TEST_SETTINGS)
export const setCurrentTestSettingsIdAction = createAction(
  SET_CURRENT_TEST_SETTINGS_ID
)
export const fetchTestSettingsListAction = createAction(
  FETCH_TEST_SETTINGS_LIST
)
export const setTestSettingsListAction = createAction(SET_TEST_SETTINGS_LIST)
export const updateTestSettingInList = createAction(UPDATE_TEST_SETTING_IN_LIST)
export const addTestSettingInList = createAction(ADD_TEST_SETTING_IN_LIST)
export const removeTestSettingFromList = createAction(
  REMOVE_TEST_SETTING_FROM_LIST
)
export const deleteTestSettingRequestAction = createAction(
  DELETE_TEST_SETTING_REQUEST
)
export const updateTestSettingRequestAction = createAction(
  UPDATE_TEST_SETTING_REQUEST
)
export const toggleRegradeModalAction = createAction(TOGGLE_REGRADE_MODAL)

export const defaultImage =
  'https://cdn2.edulastic.com/default/default-test-1.jpg'

// selectors

export const stateSelector = (state) => state.tests

export const playlistStateSelector = (state) => state.playlist

export const canSchoolAdminUseDistrictCommonSelector = createSelector(
  stateSelector,
  (state) => state.canSchoolAdminUseDistrictCommon
)

export const getPenaltyOnUsingHintsSelector = createSelector(
  stateSelector,
  (state) => state.hasPenaltyOnUsingHints
)

export const getPassageItemsCountSelector = createSelector(
  stateSelector,
  (state) => state.passageItems.length
)

export const getPassageItemsSelector = createSelector(
  stateSelector,
  (state) => state.passageItems
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
  (state) => state.defaultTestTypeProfiles || {}
)

export const getDefaultThumbnailSelector = createSelector(
  stateSelector,
  (state) => state.thumbnail
)

export const getYoutubeThumbnailSelector = createSelector(
  stateSelector,
  (state) => state.ytThumbnail
)

export const getlastUsedCollectionListSelector = createSelector(
  stateSelector,
  (state) => state.lastUsedCollectionList || []
)

export const getTestEntitySelector = createSelector(
  stateSelector,
  (state) => state.entity
)

export const getTestEntitySubjectsSelector = createSelector(
  getTestEntitySelector,
  (state) => state?.subjects || []
)

export const getTestEntityGradesSelector = createSelector(
  getTestEntitySelector,
  (state) => state?.grades || []
)

export const getCollectionNameSelector = createSelector(
  getTestEntitySelector,
  (state) => state.collectionName
)

export const getCalcTypesSelector = createSelector(
  getTestEntitySelector,
  (entity) => entity.calcTypes
)

export const isDefaultTestSelector = createSelector(
  getTestEntitySelector,
  (test) => test?.testCategory === testCategoryTypes.DEFAULT
)

export const isDynamicTestSelector = createSelector(
  getTestEntitySelector,
  (test) => test?.testCategory === testCategoryTypes.DYNAMIC_TEST
)

export const hasSectionsSelector = createSelector(
  getTestEntitySelector,
  (test) => !!test?.hasSections
)

export const sectionsEnabledDistrictSelector = createSelector(
  getUserOrgId,
  (districtId) => {
    const sectionsEnabledDistricts = process.env.REACT_APP_SECTIONS_ENABLED_DISTRICTS?.split(
      ','
    )
    return sectionsEnabledDistricts?.includes(districtId)
  }
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
      itemGroups.flatMap((itemGroup) => {
        const isLimitedDeliveryType =
          itemGroup.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
        const itemExtras = {
          groupId: itemGroup._id,
          isLimitedDeliveryType,
        }
        if (isLimitedDeliveryType) {
          itemExtras.itemsDefaultMaxScore = itemGroup.itemsDefaultMaxScore
        }
        return (
          itemGroup.items.map((item) => ({
            ...item,
            ...itemExtras,
          })) || []
        )
      }) || []
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

export const getTestDefaultSettingsSelector = createSelector(
  stateSelector,
  (state) => state.defaultTestSettings
)

export const getTestSettingsListSelector = createSelector(
  stateSelector,
  (state) => state.savedTestSettingsList || []
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

export const getTestsUpdatedSelector = createSelector(
  stateSelector,
  (state) => state.updated
)

export const getTestsLoadingSelector = createSelector(
  stateSelector,
  (state) => state.loading
)

export const isYtLoadingSelector = createSelector(
  stateSelector,
  (state) => state.ytloading
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

export const getRegradeModalStateSelector = createSelector(
  stateSelector,
  (state) => state.regradeModalState
)

export const getIsLoadRegradeSettingsSelector = createSelector(
  stateSelector,
  (state) => state.loadRegradeSettings
)

export const getAvaialbleRegradeSettingsSelector = createSelector(
  stateSelector,
  (state) => state.availableRegradeSettings
)

export const getShowRegradeConfirmPopupSelector = createSelector(
  stateSelector,
  (state) => state.showRegradeConfirmPopup
)

export const getShowUpgradePopupSelector = createSelector(
  stateSelector,
  (state) => state.upgrade
)

export const getIsAudioResponseQuestionEnabled = createSelector(
  stateSelector,
  getUserRole,
  (state, userRole) =>
    [
      state?.enableAudioResponseQuestion,
      userRole === roleuser.EDULASTIC_CURATOR,
    ].some((o) => !!o)
)

export const showGroupsPanelSelector = createSelector(
  getTestEntitySelector,
  hasSectionsSelector,
  ({ itemGroups }, hasSections) => {
    if (!itemGroups?.length) {
      return false
    }
    return (
      itemGroups[0].type === ITEM_GROUP_TYPES.AUTOSELECT ||
      itemGroups[0].deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM ||
      itemGroups.length > 1 ||
      hasSections
    )
  }
)

export const getUserListSelector = createSelector(
  stateSelector,
  getUserOrgId,
  currentDistrictInstitutionIds,
  (state, districtId, institutionIds) => {
    const usersList = state.sharedUsersList || []
    const flattenUsers = []

    usersList.forEach(
      ({
        permission,
        sharedType,
        sharedWith,
        sharedId,
        v1Id,
        v1LinkShareEnabled = 0,
      }) => {
        if (sharedType === 'INDIVIDUAL' || sharedType === 'SCHOOL') {
          sharedWith.forEach((user) => {
            if (
              sharedType === 'SCHOOL' &&
              !institutionIds?.includes(user._id)
            ) {
              return
            }
            flattenUsers.push({
              userName: user.name,
              email: user.email || '',
              _userId: user._id,
              sharedType,
              permission: permission || user.permission,
              sharedId,
            })
          })
        } else {
          const shareData = {
            userName: sharedType,
            sharedType,
            permission: permission || sharedWith?.[0]?.permission,
            sharedId,
            v1Id,
            v1LinkShareEnabled,
          }
          if (sharedType === 'DISTRICT') {
            if (districtId !== sharedWith?.[0]?._id) {
              return
            }
            Object.assign(shareData, {
              shareWithName: sharedWith?.[0]?.name,
            })
          }
          if (sharedType === 'LINK') {
            shareData.v1Id = v1Id
            shareData.v1LinkShareEnabled = v1LinkShareEnabled
            shareData.userName = 'Anyone with link'
          }
          flattenUsers.push(shareData)
        }
      }
    )
    return flattenUsers
  }
)

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

export const getQuestionTypesInTestSelector = createSelector(
  getTestItemsRowsSelector,
  (testItemsRows) => {
    const questionTypes = []
    testItemsRows.forEach((testItemRows = []) => {
      testItemRows.forEach(({ widgets = [] }) => {
        widgets.forEach(({ widgetType, type }) => {
          if (widgetType === WIDGET_TYPES.QUESTION) {
            questionTypes.push(type)
          }
        })
      })
    })
    return questionTypes
  }
)

// reducer
export const createBlankTest = () => ({
  title: DEFAULT_TEST_TITLE,
  description: '',
  releaseScore: releaseGradeLabels.DONT_RELEASE,
  maxAttempts: 1,
  testType: testTypesConstants.TEST_TYPES_VALUES_MAP.ASSESSMENT,
  testCategory: testCategoryTypes.DEFAULT,
  markAsDone: completionTypes.AUTOMATICALLY,
  generateReport: true,
  safeBrowser: false,
  sebPassword: '',
  blockNavigationToAnsweredQuestions: false,
  shuffleQuestions: false,
  shuffleAnswers: false,
  calcTypes: [],
  answerOnPaper: false,
  assignmentPassword: '',
  passwordExpireIn: 15 * 60,
  passwordPolicy: passwordPolicy.REQUIRED_PASSWORD_POLICY_OFF,
  maxAnswerChecks: 0,
  scoringType: evalTypeLabels.PARTIAL_CREDIT,
  penalty: false,
  isDocBased: false,
  status: 'draft',
  thumbnail: defaultImage,
  itemGroups: [createNewStaticGroup()],
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
  keypad: { type: 'item-level', value: 'item-level-keypad', updated: false },
  timedAssignment: false,
  allowedTime: 0,
  hasInstruction: false,
  instruction: '',
  blockSaveAndContinue: false,
  restrictNavigationOut: null,
  restrictNavigationOutAttemptsThreshold: 0,
  showMagnifier: true,
  enableScratchpad: true,
  enableSkipAlert: false,
  showHintsToStudents: true,
  penaltyOnUsingHints: 0,
  allowTeacherRedirect: true,
  showTtsForPassages: true,
  hasSections: undefined,
  [SHOW_IMMERSIVE_READER]: false,
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
  defaultTestSettings: {},
  savedTestSettingsList: [],
  currentTestSettingsId: '',
  regradeModalState: null,
  showRegradeConfirmPopup: false,
  upgrade: false,
  loadingSharedUsers: false,
  allKnownTags: [],
  tagSearchData: {
    result: [],
    isLoading: true,
  },
  hasPenaltyOnUsingHints: false,
  canSchoolAdminUseDistrictCommon: true,
  ytThumbnail: '',
  ytloading: false,
}

const getDefaultScales = (state, payload) => {
  const {
    performanceBandProfiles,
    standardsProficiencyProfiles,
    defaultTestTypeProfiles,
  } = payload
  const testType = getProfileKey(state.entity.testType)
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
          settingId: payload.entity.settingId || '',
        },
        updated: state.createdItems.length > 0,
      }
    case SET_FREEZE_TEST_SETTINGS:
      return {
        ...state,
        entity: {
          ...state.entity,
          ...payload,
        },
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
      const { updated = true, ...payloadData } = payload.data
      let entity = { ...state.entity, ...payloadData }
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
        updated,
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
    case SET_ALL_TAGS_FAILED:
      return {
        ...state,
        tagsList: {
          ...state.tagsList,
          [payload.tagType]: [],
        },
      }
    case SEARCH_TAG_LIST_REQUEST:
      return {
        ...state,
        tagSearchData: {
          result: [],
          isLoading: true,
        },
      }
    case SEARCH_TAG_LIST_SUCCESS:
      return {
        ...state,
        tagSearchData: {
          result: payload,
          isLoading: false,
        },
      }
    case SEARCH_TAG_LIST_ERROR:
      return {
        ...state,
        tagSearchData: {
          result: [],
          isLoading: false,
        },
      }
    case APPEND_KNOWN_TAGS:
      return {
        ...state,
        allKnownTags: uniqBy([...state.allKnownTags, ...payload], '_id'),
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
          itemGroups: [createNewStaticGroup()],
          grades: [],
          subjects: [],
        },
        updated: false,
        createdItems: [],
        thumbnail: '',
        sharedUsersList: [],
        ytThumbnail: '',
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
        loadingSharedUsers: false,
      }
    case CLEAR_CREATED_ITEMS_FROM_TEST:
      return {
        ...state,
        createdItems: [],
      }
    case REPLACE_TEST_DATA:
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
        enableAudioResponseQuestion: payload.enableAudioResponseQuestion,
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
    case DELETE_ITEM_GROUP_BY_GROUP_INDEX:
      return {
        ...state,
        updated: true,
        entity: {
          ...state.entity,
          itemGroups: state.entity.itemGroups.filter(
            (_, index) => index !== payload
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
    case SET_DEFAULT_TEST_SETTINGS:
      return {
        ...state,
        defaultTestSettings: payload,
      }
    case SET_CURRENT_TEST_SETTINGS_ID:
      return {
        ...state,
        currentTestSettingsId: payload,
      }
    case SET_ALLOW_SA_DISTRICT_COMMON_SETTING:
      return {
        ...state,
        canSchoolAdminUseDistrictCommon: payload,
      }
    case SET_TEST_SETTINGS_LIST:
      return {
        ...state,
        savedTestSettingsList: payload,
      }
    case ADD_TEST_SETTING_IN_LIST:
      return {
        ...state,
        savedTestSettingsList: [...state.savedTestSettingsList, payload],
      }
    case REMOVE_TEST_SETTING_FROM_LIST:
      return {
        ...state,
        savedTestSettingsList: state.savedTestSettingsList.filter(
          (t) => t._id !== payload
        ),
      }
    case UPDATE_TEST_SETTING_IN_LIST:
      return {
        ...state,
        savedTestSettingsList: state.savedTestSettingsList.map((t) => {
          if (payload._id === t._id) return payload
          return t
        }),
      }
    case TOGGLE_REGRADE_MODAL:
      return {
        ...state,
        regradeModalState: payload,
      }
    case SET_SHOW_REGRADE_CONFIRM:
      return {
        ...state,
        showRegradeConfirmPopup: payload,
      }
    case SET_SHOW_UPGRADE_POPUP:
      return {
        ...state,
        upgrade: payload,
      }
    case RECEIVE_SHARED_USERS_LIST:
      return {
        ...state,
        loadingSharedUsers: true,
      }
    case SET_MAX_SHARING_LEVEL_ALLOWED:
      return {
        ...state,
        maxSharingLevelAllowed: payload,
      }
    case TOGGLE_PENALTY_ON_USING_HINTS:
      return {
        ...state,
        updated: true,
        hasPenaltyOnUsingHints: payload,
      }
    case SET_ENABLE_AUDIO_RESONSE_QUESTION:
      return {
        ...state,
        enableAudioResponseQuestion: payload,
      }
    case GET_YOUTUBE_THUMBNAIL_REQUEST:
      return {
        ...state,
        ytloading: true,
      }
    case GET_YOUTUBE_THUMBNAIL_SUCCESS:
      return {
        ...state,
        ytThumbnail: payload,
        ytloading: false,
      }
    case SET_YOUTUBE_THUMBNAIL_FAILURE:
      return {
        ...state,
        ytloading: false,
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
      features?.assessmentSuperPowersReleaseScorePremium ||
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

export const getTagSearchSelector = createSelector(stateSelector, (state) =>
  get(state, 'tagSearchData', {})
)

export const getTagSearchListSelector = createSelector(
  getTagSearchSelector,
  (state) => get(state, 'result', [])
)

// tags which were searched for previously are cached as allKnownTags
// and used to display filter tags
export const getKnownTagsSelector = createSelector(stateSelector, (state) =>
  get(state, 'allKnownTags', [])
)

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

export const getCurrentSettingsIdSelector = createSelector(
  stateSelector,
  (state) => state.currentTestSettingsId
)

const setTime = (userRole) => {
  const addDate = userRole !== 'teacher' ? 28 : 7
  return moment()
    .add('days', addDate)
    .set({ hour: 23, minute: 0, second: 0, millisecond: 0 })
}

const getAssignSettings = ({ userRole, entity, features, isPlaylist }) => {
  const testType = entity?.testType
  const { PRACTICE, COMMON } = testTypesConstants.TEST_TYPES
  const {
    ASSESSMENT,
    PRACTICE: _PRACTICE,
  } = testTypesConstants.TEST_TYPES_VALUES_MAP
  const isAdmin =
    userRole === roleuser.SCHOOL_ADMIN || userRole === roleuser.DISTRICT_ADMIN

  const {
    showHintsToStudents = true,
    penaltyOnUsingHints = 0,
    showTtsForPassages = true,
    allowTeacherRedirect = true,
  } = entity

  const settings = {
    startDate: moment(),
    class: [],
    endDate: setTime(userRole),
    passwordPolicy: entity.passwordPolicy,
    passwordExpireIn: entity.passwordExpireIn,
    assignmentPassword: entity.assignmentPassword,
    timedAssignment: entity.timedAssignment,
    restrictNavigationOut: entity.restrictNavigationOut || null,
    restrictNavigationOutAttemptsThreshold:
      entity.restrictNavigationOutAttemptsThreshold || 0,
    blockSaveAndContinue: entity.blockSaveAndContinue || false,
    scoringType: entity.scoringType,
    penalty: entity.penalty,
    blockNavigationToAnsweredQuestions:
      entity.blockNavigationToAnsweredQuestions || false,
    showMagnifier: isUndefined(entity.showMagnifier)
      ? true
      : entity.showMagnifier,
    enableScratchpad: isUndefined(entity.enableScratchpad)
      ? true
      : entity.enableScratchpad,
    enableSkipAlert: !!entity.enableSkipAlert,
    keypad: entity.keypad,
    testType: entity.testType,
    maxAttempts: entity.maxAttempts,
    markAsDone: entity.markAsDone,
    releaseScore: entity.releaseScore,
    safeBrowser: entity.safeBrowser,
    shuffleAnswers: entity.shuffleAnswers,
    shuffleQuestions: entity.shuffleQuestions,
    calcTypes: entity.calcTypes,
    answerOnPaper: entity.answerOnPaper,
    maxAnswerChecks: entity.maxAnswerChecks,
    showRubricToStudents: entity.showRubricToStudents,
    allowAutoEssayEvaluation: entity.allowAutoEssayEvaluation,
    showHintsToStudents,
    penaltyOnUsingHints,
    allowTeacherRedirect,
    showTtsForPassages,
    showImmersiveReader: entity.showImmersiveReader,
    vqPreventSkipping: entity.vqPreventSkipping,
  }

  if (entity.safeBrowser) {
    settings.sebPassword = entity.sebPassword
  }

  if (isAdmin) {
    settings.testType = PRACTICE.includes(testType)
      ? testType
      : COMMON.includes(testType)
      ? testType
      : testTypesConstants.DEFAULT_ADMIN_TEST_TYPE_MAP[userRole]
    settings.openPolicy =
      assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
  }

  if (!isAdmin) {
    settings.testType = testType || ASSESSMENT
    settings.openPolicy = assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE
    delete settings.allowTeacherRedirect
  }

  if (entity.timedAssignment) {
    settings.allowedTime = entity.allowedTime || 10 * 60 * 1000
    settings.pauseAllowed = entity.pauseAllowed || false
  }

  if (!isPlaylist && features.free && !features.premium) {
    settings.testType = PRACTICE.includes(testType) ? _PRACTICE : ASSESSMENT
    settings.maxAttempts = 1
    settings.markAsDone = completionTypes.AUTOMATICALLY
    settings.releaseScore = releaseGradeLabels.DONT_RELEASE
    settings.safeBrowser = false
    settings.shuffleAnswers = false
    settings.shuffleQuestions = false
    settings.calcTypes = []
    settings.answerOnPaper = false
    settings.maxAnswerChecks = 0
    settings.scoringType = evalTypeLabels.PARTIAL_CREDIT
    settings.penalty = false
    settings.passwordPolicy = passwordPolicy.REQUIRED_PASSWORD_POLICY_OFF
    settings.timedAssignment = false
    settings.blockNavigationToAnsweredQuestions = false
    settings.enableSkipAlert = false
    settings.blockSaveAndContinue = false
    settings.restrictNavigationOut = null
    settings.restrictNavigationOutAttemptsThreshold = 0
    settings.showRubricToStudents = false
    settings.allowAutoEssayEvaluation = false
    settings.showHintsToStudents = true
    settings.penaltyOnUsingHints = 0
    settings.showTtsForPassages = true
    settings.referenceDocAttributes = {}
    delete settings.keypad
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

const createDummyItems = (itemCount, group = {}) => {
  const items = []
  for (let i = 0; i < itemCount; i++) {
    const item = {
      _id: `dummyItemId-${i}-${group._id}`,
      isDummyItem: true,
      autoselectedItem: true,
      active: 1,
      algoVariablesEnabled: false,
      autoGrade: true,
      canAddMultipleItems: false,
      collections: [
        {
          name: group?.collectionDetails?.name,
          type: group?.collectionDetails?.type,
          _id: group?.collectionDetails?._id,
        },
      ],
      columns: [],
      curriculums: [],
      premiumContentRestriction: true,
      data: {
        questions: [
          {
            alignment: [],
            grades: [],
            id: `dummyQuestionId-${i}-${group._id}`,
            subjects: [],
            title: '',
            type: 'multipleChoice',
            validation: {
              scoringType: 'exactMatch',
              validResponse: { score: 1, value: [], altResponses: [] },
            },
          },
        ],
        resources: [],
      },
      itemLevelScore: 1,
      itemLevelScoring: true,
      language: 'english',
      maxScore: 1,
      rows: [
        {
          content: '',
          dimension: '100%',
          flowLayout: false,
          tabs: [],
          widgets: [
            {
              reference: `dummyQuestionId-${i}-${group._id}`,
              tabIndex: 0,
              title: '',
              type: '',
              widgetType: 'question',
            },
          ],
        },
      ],
      sharedWith: [],
      standards: [],
      status: 'published',
      subjects: [],
    }
    items.push(item)
  }
  return items
}

/**
 *  Adding dummy items to autoselect groups if a group content is restricted due to subscription expiry
 */
export const fillAutoselectGoupsWithDummyItems = (testEntity) => {
  testEntity.itemGroups.forEach((group) => {
    if (
      group.premiumContentRestriction &&
      group.items.length < group.deliverItemsCount
    ) {
      group.items = [
        ...group.items,
        ...createDummyItems(
          group.deliverItemsCount - group.items.length,
          group
        ),
      ]
    }
  })
}

// saga
export function* receiveTestByIdSaga({ payload }) {
  try {
    const prevTest = yield select(getTestSelector)
    let createdItems = yield select(getTestCreatedItemsSelector)
    const entity = yield call(testsApi.getById, payload.id, {
      data: true,
      requestLatest: payload.requestLatest,
      editAndRegrade: payload.editAssigned,
      ...(payload.playlistId ? { playlistId: payload.playlistId } : {}),
    })
    const userId = yield select(getUserIdSelector)
    if (
      payload.editAssigned &&
      isRegradedByCoAuthor(userId, entity, payload.id)
    ) {
      const regradeAssignments = yield call(
        assignmentApi.fetchRegradeAssignments,
        payload.id
      )
      if (regradeAssignments?.length) {
        yield put(setShowUpgradePopupAction(true))
        yield put(receiveTestByIdSuccess(entity))
        return
      }
    }
    entity.passages = [
      ...entity.passages,
      ...differenceBy(prevTest.passages, entity.passages, '_id'),
    ]
    fillAutoselectGoupsWithDummyItems(entity)
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
        const createdItem = createdItems?.find(
          ({ _id, previousTestItemId }) =>
            _id === item._id || previousTestItemId === item._id
        )
        if (!isEmpty(createdItem)) {
          // update standards with updated db data for testitems
          createdItem.data?.questions?.forEach((createdQuestion) => {
            const question = item?.data?.questions.find(
              ({ id }) => id === createdQuestion.id
            )
            if (!isEmpty(question)) {
              createdQuestion.alignment = [...(question.alignment || [])]
            }
          })
          entity.itemGroups[groupIndex].items[itemIndex] = createdItem
          createdItems = createdItems?.filter(
            ({ _id }) => _id !== createdItem._id
          )
        }
      })
    })
    if (createdItems.length) {
      const createdItemskeyedById = _keyBy(createdItems, '_id')
      entity.itemGroups[currentGroupIndex].items = uniqBy(
        [...entity.itemGroups[currentGroupIndex]?.items, ...createdItems],
        (x) =>
          createdItemskeyedById[x._id] ? x.previousTestItemId || x._id : x._id
      )
    }
    const features = yield select(getUserFeatures)

    const questions = getQuestions(entity.itemGroups)
    yield put(loadQuestionsAction(_keyBy(questions, 'id')))
    yield put(receiveTestByIdSuccess(entity))
    yield put(getDefaultTestSettingsAction(entity))
    yield take(SET_DEFAULT_SETTINGS_LOADING)
    yield take(SET_DEFAULT_SETTINGS_LOADING)
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
    const assignSettings = getAssignSettings({
      userRole,
      entity,
      isPlaylist: payload.isPlaylist,
      features,
    })
    const loadedGroups = yield select((state) => state.assignmentSettings.class)
    const userClassList = yield select(getOrgGroupList)
    const activeGroups = yield select((state) => state.authorGroups.groups)
    if (
      loadedGroups?.length &&
      (userClassList?.filter((x) => x?.active === 1)?.length === 1 ||
        activeGroups?.length === 1)
    ) {
      assignSettings.class = loadedGroups
    }
    yield put(updateAssingnmentSettingsAction(assignSettings))
    yield take(UPDATE_ASSIGNMENT_SETTINGS_STATE)
    let defaultTestSettings = yield select(
      ({ assignmentSettings }) => assignmentSettings
    )
    defaultTestSettings = omit(defaultTestSettings, [
      'startDate',
      'class',
      'endDate',
      'openPolicy',
      'closePolicy',
      'resources',
    ])
    defaultTestSettings = {
      ...defaultTestSettings,
      testContentVisibility: entity.testContentVisibility,
    }
    const state = yield select((s) => ({
      performanceBands: get(s, 'performanceBandReducer.profiles', []),
      standardsProficiencies: get(s, 'standardsProficiencyReducer.data', []),
      defaultTestTypeProfiles: get(s, 'tests.defaultTestTypeProfiles', {}),
    }))
    let assignmentSettings = yield select((s) => s.assignmentSettings)
    if (payload.options?.assigningNew) {
      const performanceBandId =
        state.defaultTestTypeProfiles.performanceBand?.[
          getProfileKey(entity.testType)
        ]
      const standardProficiencyId =
        state.defaultTestTypeProfiles.standardProficiency?.[
          getProfileKey(entity.testType)
        ]
      assignmentSettings = { ...assignmentSettings }
      assignmentSettings.performanceBand = pick(
        multiFind(
          state.performanceBands,
          [{ _id: entity.performanceBand._id }, { _id: performanceBandId }],
          entity.performanceBand
        ),
        ['_id', 'name']
      )
      assignmentSettings.standardGradingScale = pick(
        multiFind(
          state.standardsProficiencies,
          [
            { _id: entity.standardGradingScale._id },
            { _id: standardProficiencyId },
          ],
          entity.standardGradingScale
        ),
        ['_id', 'name']
      )
    }
    yield put(updateAssingnmentSettingsAction(assignmentSettings))
    yield put(setDefaultTestSettingsAction(defaultTestSettings))
    yield put(addItemsToAutoselectGroupsRequestAction(entity))
  } catch (err) {
    captureSentryException(err)
    console.log({ err })
    const errorMessage = 'Unable to retrieve test info.'
    if (err.status === 403) {
      yield put(resetUpdatedStateAction())
      yield put(push('/author/tests'))
      if (payload.editAssigned) {
        notification({
          type: 'error',
          msg: 'You do not have the permission to clone/edit the test.',
          exact: true,
        })
      } else {
        notification({
          type: 'error',
          messageKey: 'curriculumMakeApiErr',
          exact: true,
        })
      }
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
  if (_passwordPolicy !== passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC) {
    delete data.assignmentPassword
  }

  if (_passwordPolicy !== passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC) {
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
    'savePreselected',
  ]
  if (!testTypesConstants.TEST_TYPES.COMMON.includes(data.testType)) {
    omitedItems.push('freezeSettings')
  }
  const dataToSend = omit(data, omitedItems)
  // we are getting testItem ids only in payload from cart, but whole testItem Object from test library.
  dataToSend.itemGroups = transformItemGroupsUIToMongo(data.itemGroups)
  if (dataToSend.settingId === '') {
    dataToSend.settingId = null
  }
  dataToSend.grades = dataToSend.grades?.filter((el) => !!el) || []
  dataToSend.subjects = dataToSend.subjects?.filter((el) => !!el) || []
  const entity = yield call(testsApi.create, dataToSend)
  fillAutoselectGoupsWithDummyItems(data)

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
    const { nextLocation, nextAction } = payload.data
    nextLocation && delete payload.data.nextLocation

    const testItems = get(payload, 'data.itemGroups[0].items', [])
    let aiGeneratedTestItems = testItems
      .filter(({ unsavedItem }) => unsavedItem)
      .map((item) => pick(item, itemFields))
    const newTestItems = payload.data.savePreselected
      ? testItems.filter(({ unsavedItem }) => !unsavedItem) || []
      : []
    if (!isEmpty(aiGeneratedTestItems)) {
      aiGeneratedTestItems = yield call(
        testItemsApi.addItems,
        aiGeneratedTestItems
      )
    }
    const allTestItems = [...newTestItems, ...aiGeneratedTestItems]
    const entity = yield createTest(
      produce(payload.data, (draft) => {
        if ((allTestItems || []).length) {
          draft.itemGroups[0].items = allTestItems
          draft.itemGroups[0].autoSelectItemsCount = undefined
        }
      })
    )

    entity.itemGroups = payload.data.itemGroups.map((group) => {
      group.items = group.items.map((it) => {
        if (it.unsavedItem) delete it.unsavedItem
        return it
      })
      return group
    })

    yield put(createTestSuccessAction(entity))
    yield put(addItemsToAutoselectGroupsRequestAction(entity))
    if (!nextAction) {
      if (nextLocation) {
        yield put(replace(nextLocation))
      } else {
        const pathname = yield select((state) => state.router.location.pathname)
        const currentTabMatch = pathname?.match(
          /(?:\/author\/tests\/(?:create|tab)\/)([^/]+)/
        )
        // try to keep the user on the same tab after test creation
        // Go to `description` tab if user is not on Test Page already, e.g. coming from Item Library.
        const currentTab =
          currentTabMatch?.[1] ||
          (entity.testCategory === testCategoryTypes.DEFAULT
            ? 'addItems'
            : 'description')
        yield put(replace(`/author/tests/tab/${currentTab}/id/${entity._id}`))
      }
    }
    if (entity.aiGenerated && !nextAction) {
      yield put(setIsCreatingAction(true))
      yield put(receiveTestByIdAction(entity._id, true, false))
      yield put(setIsCreatingAction(false))
    }
    if (nextAction) nextAction(entity)

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

const cleanTestItemGroups = (_test) => {
  _test.itemGroups.forEach((group) => {
    if (group.premiumContentRestriction) {
      group.items = []
    }
    delete group.premiumContentRestriction
  })
}

/**
 * update the showRubricToStudents setting if it was set to true
 * and later items with rubric attached are removed from the test
 */
const updateTestSettings = (testItemGroups, testData) => {
  if (
    testItemGroups?.length &&
    !showRubricToStudentsSetting(testItemGroups) &&
    testData.showRubricToStudents
  ) {
    testData.showRubricToStudents = false
    testData.allowAutoEssayEvaluation = false
  }
}

export function* updateTestSaga({ payload }) {
  try {
    if (!validateRestrictNavigationOut(payload.data)) {
      yield put(setTestsLoadingAction(false))
      return
    }
    // dont set loading as true
    if (!payload.disableLoadingIndicator) yield put(setTestsLoadingAction(true))
    const { scoring = {}, currentTab, nextLocation, nextAction } = payload.data
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
      'active',
      'nextLocation',
    ]
    // remove createdDate and updatedDate
    const oldId = payload.data._id
    if (!testTypesConstants.TEST_TYPES.COMMON.includes(payload.data.testType)) {
      testFieldsToOmit.push('freezeSettings')
    }

    // Backend doesn't require PARTIAL_CREDIT_IGNORE_INCORRECT
    // Penalty true/false is set to determine the case
    if (
      payload.data.scoringType ===
      evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT
    ) {
      payload.data.scoringType = evalTypeLabels.PARTIAL_CREDIT
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
      passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
    ) {
      testFieldsToOmit.push('passwordExpireIn')
    }
    if (
      payload.data.passwordPolicy !==
      passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC
    ) {
      testFieldsToOmit.push('assignmentPassword')
    } else if (
      payload.data.passwordPolicy ===
        passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC &&
      (!payload.data.assignmentPassword ||
        payload.data.assignmentPassword.length < 6 ||
        payload.data.assignmentPassword.length > 25)
    ) {
      notification({ messageKey: 'enterValidPassword' })
      return yield put(setTestsLoadingAction(false))
    }

    const aiGeneratedTestItems = []
    let selectedGroupForAI = -1
    payload.data.itemGroups.forEach((itemGroup, index) => {
      itemGroup.items
        .filter(({ unsavedItem }) => unsavedItem)
        .forEach((item) => {
          selectedGroupForAI = index
          aiGeneratedTestItems.push(pick(item, itemFields))
        })
    })

    let newTestItems
    if (!isEmpty(aiGeneratedTestItems)) {
      newTestItems = yield call(testItemsApi.addItems, aiGeneratedTestItems)
    }

    if ((newTestItems || []).length) {
      for (let index = 0; index < payload.data.itemGroups?.length; index++) {
        payload.data.itemGroups[index].items = [
          ...payload.data.itemGroups[index].items,
          ...(index === selectedGroupForAI ? newTestItems : []),
        ].filter(({ unsavedItem }) => !unsavedItem)
      }
    }

    const testItemGroups = payload.data.itemGroups

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
    cleanTestItemGroups(testData)
    updateTestSettings(testItemGroups, testData)
    if (hasInvalidItem(testData)) {
      console.warn('test data has invalid item', testData)
      Sentry.configureScope((scope) => {
        scope.setExtra('testData', testData)
        Sentry.captureException(new Error('testDataHasInvalidException'))
      })
      return
    }
    if (testData.settingId === '') {
      testData.settingId = null
    }
    testData.grades = testData.grades?.filter((el) => !!el) || []
    testData.subjects = testData.subjects?.filter((el) => !!el) || []
    const entity = yield call(testsApi.update, { ...payload, data: testData })
    if (isEmpty(entity)) {
      return
    }
    fillAutoselectGoupsWithDummyItems(entity)
    yield put(updateTestSuccessAction(entity))
    yield put(addItemsToAutoselectGroupsRequestAction(entity))
    const newId = entity._id
    const userRole = yield select(getUserRole)
    const isCurator = yield select(getIsCurator)
    if (!nextAction) {
      if (nextLocation) {
        const locationState = yield select(
          (state) => get(state, 'router.location.state'),
          {}
        )
        yield put(
          push({
            pathname: nextLocation,
            state: locationState,
          })
        )
      } else if (oldId !== newId && newId) {
        if (!payload.assignFlow) {
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
    }
    yield put(setTestsLoadingAction(false))
    if (nextAction) nextAction(entity)
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
          if (versionedQIdMap[annotation.questionId]) {
            annotation.questionId = versionedQIdMap[annotation.questionId]
          }
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

function* updateRegradeDataSaga({ payload: _payload }) {
  try {
    const { notify, ...payload } = _payload
    yield put(setRegradingStateAction(true))
    yield call(testsApi.publishTest, payload.newTestId)
    const { message, firestoreDocId } = yield call(
      assignmentApi.regrade,
      payload
    )
    yield put(setRegradeFirestoreDocId(firestoreDocId))
    if (notify) {
      notification({ type: 'info', msg: message })
    } else {
      notification({
        type: 'info',
        msg: 'Changes made to the test are being published',
      })
    }
  } catch (err) {
    const { data: { message: errorMessage } = {} } = err.response || {}
    captureSentryException(err)
    if (_payload.notify) {
      notification({
        type: 'error',
        msg: errorMessage || 'Unable to publish & regrade.',
      })
    } else {
      notification({
        type: 'error',
        msg: 'Publish failed',
      })
    }
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
    const {
      collectionId,
      collectionName,
      collectionType,
      collectionBucketId,
    } = videoQuizDefaultCollection

    const isPublisher = yield select(isPublisherUserSelector)
    const isOrganization = yield select(isOrganizationDistrictSelector)
    const newTest = produce(_test, (draft) => {
      // for non publisher we are adding video collection to the Test
      if (
        draft.testCategory === testCategoryTypes.VIDEO_BASED &&
        !isPublisher &&
        !isOrganization
      ) {
        draft.collections = uniqBy(
          [
            ...(draft.collections || []),
            {
              _id: collectionId,
              name: collectionName,
              type: collectionType,
              bucketIds: [collectionBucketId],
            },
          ],
          (collection) => collection._id
        )
      }
    })

    const result = yield call(
      newTest.isDocBased ? updateTestDocBasedSaga : updateTestSaga,
      {
        payload: { id, data: newTest, assignFlow: true },
      }
    )

    if (!result) return

    yield put(resetUpdatedStateAction())

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
      let update = {
        timedAssignment: newTest?.timedAssignment,
        showRubricToStudents: newTest.showRubricToStudents,
      }
      if (newTest?.timedAssignment) {
        update = {
          ...update,
          allowedTime: newTest?.allowedTime || 10 * 60 * 1000,
          pauseAllowed: newTest?.pauseAllowed || false,
        }
      }
      /**
       * during assign flow , putting default settings
       */
      yield put(updateAssingnmentSettingsAction(update))

      yield put(
        push(`/author/assignments/${id}`, {
          assessmentAssignedFrom: 'Created New',
        })
      )
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
    if (error.status === 403) {
      return notification({
        type: 'warn',
        msg: error.message,
      })
    }
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
    // cloning the _test as it internally mutating the itemGroups inside updateTestSaga
    const _test = { ...(yield select(getTestSelector)) }
    if (_test.isUsed && !_test.isInEditAndRegrade) {
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
    const result = yield call(assignmentApi.fetchRegradeSettings, {
      oldTestId: _test.previousTestId,
      newTestId: payload,
    })
    yield put(setAvailableRegradeAction(result))
    const isRegradeNeeded = result.some(
      (item) => item === 'ADD' || item === 'EDIT'
    )
    if (isRegradeNeeded) {
      yield put(setShowRegradeConfirmPopupAction(true))
    } else {
      const districtId = yield select(getUserOrgId)
      yield put(setTestsLoadingAction(true))
      yield call(updateRegradeDataSaga, {
        payload: {
          notify: false,
          newTestId: payload,
          oldTestId: _test.previousTestId,
          assignmentList: [],
          districtId,
          applyChangesChoice: 'ALL',
          options: {
            removedQuestion: 'DISCARD',
            testSettings: 'ALL',
            addedQuestion: 'SKIP',
            editedQuestion: 'SCORE',
          },
        },
      })
    }
  } catch (error) {
    Sentry.captureException(error)
    console.error(error)
    notification({ msg: error?.data?.message || 'publish failed.' })
  } finally {
    yield put(setUpdatingTestForRegradeStateAction(false))
  }
}

function* receiveSharedWithListSaga({ payload }) {
  try {
    const { sharedEntities = [], maxSharingLevelAllowed } = yield call(
      contentSharingApi.getSharedUsersList,
      payload
    )
    yield put(setMaxSharingLevelAllowedAction(maxSharingLevelAllowed))
    const coAuthors = sharedEntities.map(
      ({ permission, sharedWith, sharedType, _id }) => ({
        permission,
        sharedWith,
        sharedType,
        sharedId: _id,
      })
    )
    const testData = yield select(getTestEntitySelector)

    const testList = yield select((state) => state.testList.entities)
    const getTest = testList.find(
      (testItem) => testItem._id === payload.contentId
    )
    const v1LinkShareEnabled = testData._id
      ? testData.v1Attributes?.v1LinkShareEnabled === 1
      : getTest?.v1Attributes?.v1LinkShareEnabled === 1
    const v1Id = testData._id ? testData.v1Id : getTest?.v1Id

    if (
      (!coAuthors.length ||
        !coAuthors.some((item) => item.sharedType === 'LINK')) &&
      v1LinkShareEnabled
    ) {
      coAuthors.push({
        permission: 'VIEW',
        sharedWith: [],
        sharedType: 'LINK',
        sharedId: payload.contentId,
        v1LinkShareEnabled: 1,
        v1Id,
      })
    }
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
    if (payload.v1LinkShareEnabled === 1) {
      const testData = yield select(getTestEntitySelector)
      const testList = yield select((state) => state.testList.entities)
      const getTest = testList.find(
        (testItem) => testItem._id === payload.contentId
      )

      const updateTest = testData._id ? testData : getTest
      const { v1Attributes, ...rest } = updateTest

      yield put(replaceTestDataAction(rest))
    }
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
      newTest.scoringType === evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT
    ) {
      newTest = produce(newTest, (draft) => {
        draft.scoringType = evalTypeLabels.PARTIAL_CREDIT
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
      const { title } = newTest
      const role = yield select(getUserRole)
      if (!title) {
        return notification({ messageKey: 'nameShouldNotEmpty' })
      }
      if (
        newTest.passwordPolicy !==
        passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
      ) {
        delete newTest.passwordExpireIn
      }
      if (
        newTest.passwordPolicy !==
        passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC
      ) {
        delete newTest.assignmentPassword
      } else if (!newTest.assignmentPassword) {
        notification({ messageKey: 'enterValidPassword' })
        return
      }

      let testObj = produce(newTest, (draft) => {
        draft.itemGroups = transformItemGroupsUIToMongo(draft.itemGroups)
        if (
          !newTest.testContentVisibility &&
          (role === roleuser.DISTRICT_ADMIN || role === roleuser.SCHOOL_ADMIN)
        ) {
          draft.testContentVisibility =
            testConstants.testContentVisibility.ALWAYS
        }
      })
      // summary CAN BE REMOVED AS BE WILL CREATE ITS OWN SUMMARY USING ITEMS
      // passages doesnt accepted by BE
      const omitedItems = ['passages', 'summary', 'alreadyLiked']
      if (!testTypesConstants.TEST_TYPES.COMMON.includes(testObj.testType)) {
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

      // redirecting to edit-item page instead of test review page if after creating a passage item
      if (payload.fromSaveMultipartItem) {
        if (!isEmpty(payload.routerState)) {
          yield put(
            push({
              pathname: payload.url.replace(
                'tests/undefined',
                `tests/${entity?._id || 'undefined'}`
              ),
              state: payload.routerState,
            })
          )
        } else {
          yield put(
            push(
              payload.url.replace(
                'tests/undefined',
                `tests/${entity?._id || 'undefined'}`
              )
            )
          )
        }
        return
      }
      // TODO: is this logic still relevant?
      if (payload.current) {
        yield put(
          replace(`/author/tests/tab/${payload.current}/id/${entity._id}`)
        )
      } else if (item.isPassageWithQuestions) {
        yield put(replace(`/author/tests/tab/review/id/${entity._id}`))
      } else {
        yield put(
          replace({
            pathname: `/author/tests/tab/review/id/${entity._id}`,
            state: {
              showItemAddedMessage: true,
              isAuthoredNow: true,
              scrollToBottom: true,
            },
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
  const {
    itemLevelScore,
    itemLevelScoring = false,
    itemGradingType,
    assignPartialCredit,
  } = testItem
  const questions = _keyBy(testItem?.data?.questions, 'id')
  const answers = yield select((state) => get(state, 'answers', {}))
  const answersByQids = answersByQId(answers, testItem._id)
  if (!hasValidResponse(answersByQids, questions)) {
    return
  }
  const evaluation = yield evaluateItem(
    answersByQids,
    questions,
    itemLevelScoring,
    newScore,
    itemLevelScore,
    testItem._id,
    itemGradingType,
    assignPartialCredit
  )
  return evaluation
}

function* getEvaluationFromItem(testItem, newScore) {
  const {
    itemLevelScore,
    itemLevelScoring = false,
    itemGradingType,
    assignPartialCredit,
  } = testItem
  const questions = _keyBy(testItem.data.questions, 'id')
  const answers = yield select((state) => get(state, 'answers', {}))
  const answersByQids = answersByQId(answers, testItem._id)
  if (!hasValidResponse(answersByQids, questions)) {
    return
  }
  const evaluation = yield evaluateItem(
    answersByQids,
    questions,
    itemLevelScoring,
    newScore,
    itemLevelScore,
    testItem._id,
    itemGradingType,
    assignPartialCredit
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
    if (isEmpty(evaluationObject)) {
      yield put({
        type: CHANGE_PREVIEW,
        payload: {
          view: 'check',
        },
      })
      return notification({
        type: 'warn',
        messageKey: 'attemptTheQuestonToCheckAnswer',
      })
    }
    const { evaluation, score, maxScore } = evaluationObject
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

    yield put({
      type: ADD_ITEM_EVALUATION,
      payload: {
        ...evaluation,
      },
    })

    // message.success(`score: ${+score.toFixed(2)}/${maxScore}`);
  } catch (e) {
    Sentry.captureException(e)
    notification({ messageKey: 'checkAnswerFailed' })
    console.log('error checking answer', e)
  }
}

function* showAnswerSaga({ payload = {} }) {
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
    yield put({
      type: CHANGE_PREVIEW,
      payload: {
        view: 'show',
      },
    })
    const evaluation = yield createShowAnswerData(
      questions,
      answers,
      testItem._id || payload._id
    )
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
  const tagType = Array.isArray(payload.type) ? payload.type[0] : payload.type
  try {
    TAGS_SAGA_FETCH_STATUS.isLoading = true
    const tags = yield call(tagsApi.getAll, payload.type)
    yield put({
      type: SET_ALL_TAGS,
      payload: { tags, tagType },
    })
  } catch (e) {
    Sentry.captureException(e)
    yield put({
      type: SET_ALL_TAGS_FAILED,
      payload: { tagType },
    })
    notification({ messageKey: 'getAllTagsFailed' })
  } finally {
    TAGS_SAGA_FETCH_STATUS.isLoading = false
  }
}

function* searchTagsSaga({ payload }) {
  try {
    const result = yield call(tagsApi.searchTags, payload)
    let tags = []
    if (payload.aggregate) {
      for (const [key, value] of Object.entries(result)) {
        tags.push({
          _id: key,
          tagName: key,
          tagType: payload?.search?.tagTypes?.[0],
          tagNamesAssociated: value,
        })
      }
    } else {
      const hits = get(result, 'hits.hits', [])
      tags = hits.map(({ _id, _source }) => ({
        _id,
        ..._source,
      }))
    }
    yield put({
      type: SEARCH_TAG_LIST_SUCCESS,
      payload: tags,
    })
    yield put({
      type: APPEND_KNOWN_TAGS,
      payload: tags,
    })
  } catch (e) {
    Sentry.captureException(e)
    yield put({
      type: SEARCH_TAG_LIST_ERROR,
    })
  }
}

function* searchTagsByIdSaga({ payload: ids }) {
  try {
    const payload = {
      page: 1,
      limit: Math.max(1, ids.length),
      search: {
        ids,
      },
    }
    yield* searchTagsSaga({ payload })
  } catch (err) {
    Sentry.captureException(err)
  }
}

function* getDefaultTestSettingsSaga({ payload: testEntity }) {
  try {
    yield put(setDefaultSettingsLoadingAction(true))
    const role = yield select(getUserRole)
    const districtId = yield select(getUserOrgId)
    const institutionIds = yield select(currentDistrictInstitutionIds)
    let payload = {
      orgId: districtId,
      params: { orgType: 'district' },
    }

    if (role !== roleuser.DISTRICT_ADMIN && institutionIds.length) {
      payload = {
        orgId: institutionIds[0] || districtId,
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
          assessment: performanceBandId,
          practice: performanceBandId,
        },
        standardProficiency: {
          common: standardProficiencyId,
          assessment: standardProficiencyId,
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
      canSchoolAdminUseDistrictCommon,
    } = defaultTestSettings
    yield put(
      setCanSchoolAdminUseDistrictCommonAction(canSchoolAdminUseDistrictCommon)
    )
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
          scoringType: evalTypeLabels.ALL_OR_NOTHING,
        })
      )
    }
    yield put(setDefaultSettingsLoadingAction(false))
    if (testEntity?.saveDefaultTestSettings === true) {
      const _test = yield select(getTestEntitySelector)
      const defaultSettings = pick(
        _test,
        getSettingsToSaveOnTestType(_test.isDocBased)
      )
      yield put(setDefaultTestSettingsAction(defaultSettings))
    }
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
      playlistId,
      updatePlaylist = false,
      updateContentVersionId = false,
    } = payload
    const queryParams = {
      _id,
      title,
      isInEditAndRegrade,
      cloneItems,
      playlistId,
      updatePlaylist,
      updateContentVersionId,
    }
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
    notification({ msg: 'You are currently editing a cloned test' })
  } catch (err) {
    const { data = {} } = err.response || {}
    const { message: errorMessage } = data
    captureSentryException(err)
    yield put(setTestsLoadingAction(false))
    yield put(setEditEnableAction(false))
    if (err?.status === 403) {
      if (onRegrade === true) {
        yield put(setTestDataAction({ isUsed: false }))
        yield put(setCreateSuccessAction())
        return notification({
          msg: 'Duplicating the test permission denied and failed to regrade',
        })
      }
      return notification({
        msg: 'You do not have the permission to clone the test.',
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
    const hasSections = yield select(hasSectionsSelector)
    const isDynamicTest = yield select(isDynamicTestSelector)
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
      /**
       * ref: EV-41116
       * For sections and dynamic test first item from passage can exist in group 1
       * and second item from same passage can exist in group 2
       * Thus when removing passage items need to filter from all groups and not
       * only from current group index.
       */
      if (hasSections || isDynamicTest) {
        ;(newPayload.itemGroups || []).forEach((currentItemGroup, index) => {
          const currentGroupItems = currentItemGroup?.items || []
          if (currentGroupItems.length) {
            newPayload.itemGroups[index].items = uniqBy(
              currentGroupItems.filter((x) => !passageItemIds.includes(x._id)),
              (x) => x._id
            )
          }
        })
      } else {
        newPayload.itemGroups[currentGroupIndex].items = uniqBy(
          testItems.filter((x) => !passageItemIds.includes(x._id)),
          (x) => x._id
        )
      }
    } else {
      let newItems = [...testItems]
      /**
       * ref: EV-41010
       * For sections and dynamic test read existing items from respective current group,
       * and not read items from all groups to prevent addition of same items
       * in multiple multiple groups.
       */
      if (
        (hasSections || isDynamicTest) &&
        typeof currentGroupIndex === 'number'
      ) {
        const testItemsInCurrentGroup =
          _test.itemGroups?.[currentGroupIndex]?.items || []
        newItems = [...testItemsInCurrentGroup]
      }
      const lastIdx = findLastIndex(
        newItems,
        (element) => element.passageId === passageId
      )
      if (lastIdx !== -1) {
        newItems.splice(lastIdx + 1, 0, ...passageItems)
      } else newItems = [...newItems, ...passageItems]
      newPayload.itemGroups[currentGroupIndex].items = uniqBy(
        newItems,
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
      scrollToBottom,
    } = payload
    const data = { ...(yield select(getTestSelector)) }
    const role = yield select(getUserRole)
    const hasUnsavedChanges = yield select((state) => state?.tests?.updated)
    if (hasUnsavedChanges) {
      const isTestCreated = testId && testId !== 'undefined'
      if (
        !isTestCreated &&
        testTypesConstants.TEST_TYPES.COMMON.includes(data.testType) &&
        roleuser.DA_SA_ROLE_ARRAY.includes(role) &&
        !data.testContentVisibility
      ) {
        data.testContentVisibility = testConstants.testContentVisibility.ALWAYS
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
        scrollToBottom,
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
              standardIds:
                itemGroup?.standardDetails?.standards?.map(
                  (std) => std.standardId
                ) || [],
              nInItemIds: allStaticGroupItemIds,
              ...optionalFields,
            },
          },
    isFetchItems:
      itemGroup.type === ITEM_GROUP_TYPES.AUTOSELECT &&
      !itemGroup.premiumContentRestriction,
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
    const hasAutoSelectItems = _test.itemGroups.some(
      (g) =>
        g.type === testConstants.ITEM_GROUP_TYPES.AUTOSELECT && !g.items?.length
    )
    if (!hasAutoSelectItems) return
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
    yield put(resetUpdatedStateAction())
    const errorMessage =
      'You can no longer use this, as sharing access has been revoked by author'
    yield put(push('/author/tests'))
    if (err.status === 403) {
      notification({
        type: 'error',
        msg: err?.response?.data?.message || null,
        messageKey: 'curriculumMakeApiErr',
        exact: true,
      })
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

function* fetchSavedTestSettingsListSaga({ payload }) {
  try {
    const settingsList = yield call(settingsApi.getTestSettingsList, payload) ||
      []
    yield put(
      setTestSettingsListAction(
        settingsList.filter((setting) => !!setting?.title)
      )
    )
  } catch (err) {
    Sentry.captureException(err)
  }
}

function* saveTestSettingsSaga({ payload }) {
  try {
    const result = yield call(settingsApi.createTestSetting, payload.data)
    if (payload.switchSetting)
      yield put(setCurrentTestSettingsIdAction(result._id))
    if (payload.switchSettingInTest)
      yield put(setTestDataAction({ settingId: result._id }))
    yield put(addTestSettingInList(result))
    notification({ type: 'success', msg: 'Test settings saved successfully' })
  } catch (err) {
    Sentry.captureException(err)
    const errorMessage =
      err?.response?.data?.message || 'Failed to save test settings'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* deleteTestSettingRequestSaga({ payload }) {
  try {
    yield call(settingsApi.removeTestSetting, payload)
    yield put(removeTestSettingFromList(payload))
    notification({ type: 'success', msg: 'Test setting removed successfully' })
  } catch (err) {
    Sentry.captureException(err)
    const errorMessage =
      err?.response?.data?.message || 'Failed to delete test setting'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* updateTestSettingRequestSaga({ payload }) {
  try {
    const result = yield call(settingsApi.updateTestSetting, payload)
    yield put(updateTestSettingInList(result))
    notification({ type: 'success', msg: 'Test setting updated successfully' })
  } catch (err) {
    Sentry.captureException(err)
    const errorMessage =
      err?.response?.data?.message || 'Failed to udate test setting'
    notification({ type: 'error', msg: errorMessage })
  }
}
function* getYoutubeThumbnailRequestSaga({ payload }) {
  try {
    const result = yield call(testsApi.getYoutubeThumbnail, payload)
    yield put({
      type: GET_YOUTUBE_THUMBNAIL_SUCCESS,
      payload: result?.cdnLocation,
    })
  } catch (err) {
    yield put(setYoutubeThumbnailFailure())
    Sentry.captureException(err)
    const errorMessage =
      err?.response?.data?.message || 'Failed to get thumbnail'
    notification({ type: 'error', msg: errorMessage })
  }
}

export function* watcherSaga() {
  yield all([
    takeEvery(RECEIVE_TEST_BY_ID_REQUEST, receiveTestByIdSaga),
    takeEvery(CREATE_TEST_REQUEST, createTestSaga),
    takeEvery(UPDATE_TEST_REQUEST, updateTestSaga),
    Effects.throttleAction(
      process.env.REACT_APP_QA_ENV ? 60000 : 10000,
      UPDATE_TEST_DOC_BASED_REQUEST,
      updateTestDocBasedSaga
    ),
    takeEvery(REGRADE_TEST, updateRegradeDataSaga),
    takeEvery(TEST_SHARE, shareTestSaga),
    takeEvery(TEST_PUBLISH, publishTestSaga),
    takeEvery(RECEIVE_SHARED_USERS_LIST, receiveSharedWithListSaga),
    takeEvery(DELETE_SHARED_USER, deleteSharedUserSaga),
    takeEvery(PREVIEW_CHECK_ANSWER, checkAnswerSaga),
    takeEvery(GET_ALL_TAGS_IN_DISTRICT, getAllTagsSaga),
    takeEvery(SEARCH_TAG_LIST_REQUEST, searchTagsSaga),
    takeEvery(SEARCH_TAGS_BY_IDS_REQUEST, searchTagsByIdSaga),
    takeEvery(PREVIEW_SHOW_ANSWER, showAnswerSaga),
    takeEvery(RECEIVE_DEFAULT_TEST_SETTINGS, getDefaultTestSettingsSaga),
    takeEvery(PUBLISH_FOR_REGRADE, publishForRegrade),
    takeEvery(DUPLICATE_TEST_REQUEST, duplicateTestSaga),
    takeEvery(SET_AND_SAVE_PASSAGE_ITEMS, setAndSavePassageItems),
    takeLatest(UPDATE_TEST_AND_NAVIGATE, updateTestAndNavigate),
    takeEvery(
      APPROVE_OR_REJECT_SINGLE_TEST_REQUEST,
      approveOrRejectSingleTestSaga
    ),
    takeLatest(
      ADD_ITEMS_TO_AUTOSELECT_GROUPS_REQUEST,
      addItemsToAutoselectGroupsSaga
    ),
    takeEvery(SET_TEST_DATA_AND_SAVE, setTestDataAndUpdateSaga),
    takeLatest(TOGGLE_TEST_LIKE, toggleTestLikeSaga),
    takeLatest(GET_TESTID_FROM_VERSIONID, getTestIdFromVersionIdSaga),
    takeLatest(GET_REGRADE_ACTIONS, getRegradeSettingsSaga),
    takeLatest(FETCH_TEST_SETTINGS_LIST, fetchSavedTestSettingsListSaga),
    takeLatest(SAVE_TEST_SETTINGS, saveTestSettingsSaga),
    takeLatest(DELETE_TEST_SETTING_REQUEST, deleteTestSettingRequestSaga),
    takeLatest(UPDATE_TEST_SETTING_REQUEST, updateTestSettingRequestSaga),
    takeLatest(GET_YOUTUBE_THUMBNAIL_REQUEST, getYoutubeThumbnailRequestSaga),
  ])
}
