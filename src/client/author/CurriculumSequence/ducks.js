import { buffers } from 'redux-saga'
import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'
import moment from 'moment'
import { message, Modal } from 'antd'
import {
  takeLatest,
  takeEvery,
  put,
  call,
  all,
  select,
  take,
  actionChannel,
} from 'redux-saga/effects'
import { get, flatten, cloneDeep, isEmpty, omit, uniqBy, sumBy } from 'lodash'
import { v4 } from 'uuid'
import { normalize, schema } from 'normalizr'
import { push } from 'connected-react-router'
import * as Sentry from '@sentry/browser'
import { captureSentryException, notification } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import {
  curriculumSequencesApi,
  assignmentApi,
  userContextApi,
  groupApi,
  recommendationsApi,
  TokenStorage as Storage,
  testsApi,
  resourcesApi,
} from '@edulastic/api'
import produce from 'immer'
import { themeColor } from '@edulastic/colors'
import { setCurrentAssignmentAction } from '../TestPage/components/Assign/ducks'
import {
  getUserSelector,
  getUserId,
  getUserRole,
  getCollectionsSelector,
  getWritableCollectionsSelector,
  getCurrentActiveTermIds,
  getCurrentTerm,
  getUserOrgId,
} from '../src/selectors/user'
import {
  allowDuplicateCheck,
  allowContentEditCheck,
} from '../src/utils/permissionCheck'
import {
  publishTestAction,
  receiveTestByIdAction,
  duplicateTestRequestAction,
  getTestSelector,
  UPDATE_TEST_STATUS,
  RECEIVE_TEST_BY_ID_SUCCESS,
} from '../TestPage/ducks'
import {
  fetchGroupMembersAction,
  SET_GROUP_MEMBERS,
  getStudentsSelector,
} from '../sharedDucks/groups'
import {
  receiveLastPlayListAction,
  receiveRecentPlayListsAction,
  receiveLastPlayListSaga,
} from '../Playlist/ducks'

// Constants
export const CURRICULUM_TYPE_GUIDE = 'guide'
export const CURRICULUM_TYPE_CONTENT = 'content'
const DRAFT = 'draft'

// Types
export const FETCH_CURRICULUM_SEQUENCES =
  '[curriculum-sequence] fetch list of curriculum sequences'
export const UPDATE_CURRICULUM_SEQUENCE =
  '[curriculum-sequence-ui] update curriculum sequence'
export const UPDATE_CURRICULUM_SEQUENCE_LIST =
  '[curriculum-sequence-ui] update curriculum sequence list'
export const FETCH_CURRICULUM_SEQUENCES_ERROR =
  '[curriculum-sequence-ui] error no ids provided'
export const PUT_CURRICULUM_SEQUENCE =
  '[curriculum-sequence] put curriculum sequence'
export const SEARCH_CURRICULUM_SEQUENCES =
  '[curriculum-sequence] search curriculum sequences'
export const SEARCH_GUIDES =
  '[curriculum-sequence] search curriculum sequences - guides'
export const SEARCH_GUIDES_RESULT =
  '[curriculum-sequence] search curriculum sequences - guides - result'
export const SEARCH_CONTENT_CURRICULUMS =
  '[curriculum-sequence] search curriculum sequences - content'
export const SEARCH_CONTENT_CURRICULUMS_RESULT =
  '[curriculum-sequence] search curriculum sequences - content - result'
export const CHANGE_GUIDE =
  '[curriculum-sequence] change curriculum sequence (guide)'
export const SET_PUBLISHER = '[curriculum-sequence] set selected publisher'
export const SET_GUIDE = '[curriculum-sequence] set selected guide'
export const SAVE_GUIDE_ALIGNMENT = '[curriculum-sequence] save guide alignment'
export const SET_CONTENT_CURRICULUM =
  '[curriculum-sequence] set selected content'
export const TOGGLE_CHECKED_UNIT_ITEM =
  '[curriculum-sequence] toggle checked unit item'
export const TOGGLE_ADD_CONTENT = '[curriculum-sequence-ui] toggle add content'
export const CREATE_ASSIGNMENT = '[curriculum-sequence] create assignment'
export const CREATE_ASSIGNMENT_NOW =
  '[curriculum-sequence] create assignment now'
export const CREATE_ASSIGNMENT_OK = '[curriculum-sequence] create assignment ok'
export const SET_SELECTED_ITEMS_FOR_ASSIGN =
  '[curriculum-sequence] set selected items for assign'
export const SET_SELECTED_ITEMS_FOR_ASSIGN_INIT =
  '[curriculum-sequence] set selected items for assign init'
export const SET_RECOMMENDATIONS_TO_ASSIGN =
  '[curriculum-sequence] recommendations to assign'
export const SET_DATA_FOR_ASSIGN_INIT =
  '[curriculum-sequence] set data for assign init'
export const SET_DATA_FOR_ASSIGN = '[curriculum-sequence] set data for assign'
export const ADD_CONTENT_TO_CURRICULUM_RESULT =
  '[curriculum-sequence] add content to curriculum result'
export const REMOVE_ITEM_FROM_UNIT =
  '[curriculum-sequence] remove item from unit'
export const SAVE_CURRICULUM_SEQUENCE =
  '[curriculum-sequence] save curriculum sequence'
export const ADD_NEW_UNIT_INIT = '[curriculum-sequence] add new unit init'
export const ADD_NEW_UNIT = '[curriculum-sequence] add new unit'
export const REMOVE_UNIT_INIT = '[curriculum-sequence] remove unit init'
export const REMOVE_UNIT = '[curriculum-sequence] remove unit'
export const UPDATE_ASSIGNMENT = '[curriculum-sequence] update assignment'
export const BATCH_ASSIGN = '[curriculum-sequence] batch assign request'
export const BATCH_ASSIGN_RESULT = '[curriculum-sequence] batch assign result'
export const FETCH_ASSIGNED_REQUEST =
  '[curriculum-sequence] fetch assigned request'
export const FETCH_ASSIGNED_RESULT =
  '[curriculum-sequence] fetch assigned result'
export const USE_THIS_PLAYLIST = '[playlist] use this playlist'
export const CLONE_THIS_PLAYLIST = '[playlist] clone this playlist'
export const APPROVE_OR_REJECT_SINGLE_PLAYLIST_REQUEST =
  '[curriculum-sequence] approve or reject single playlist request'
export const APPROVE_OR_REJECT_SINGLE_PLAYLIST_SUCCESS =
  '[curriculum-sequence] approve or reject single playlist success'
export const SET_PLAYLIST_DATA = '[curriculum-sequence] set playlist data'

// Drop Playlist Action Constants
export const FETCH_CLASS_LIST_BY_DISTRICT_ID =
  '[drop-playlist] fetch class list by district id'
export const FETCH_CLASS_LIST_SUCCESS =
  '[drop-playlist] fetch class list success'
export const FETCH_STUDENT_LIST_BY_GROUP_ID =
  '[drop-playlist] fetch student list by group id'
export const FETCH_STUDENT_LIST_SUCCESS =
  '[drop-playlist] fetch student list success'
export const DROP_PLAYLIST_ACTION =
  '[drop-playlist] drop playlist - grant/revoke access'
export const FETCH_PLAYLIST_ACCESS_LIST =
  '[drop-playlist] fetch playlist access list'
export const UPDATE_DROPPED_ACCESS_LIST =
  '[drop-playlist] update playlist access list'
export const FETCH_PLAYLIST_METRICS =
  '[playlist metrics] fetch playlist metrics'
export const UPDATE_PLAYLIST_METRICS =
  '[playlist metrics] update playlist metrics'
export const FETCH_PLAYLIST_INSIGHTS =
  '[playlist insights] fetch playlist insights'
export const FETCH_PLAYLIST_INSIGHTS_SUCCESS =
  '[playlist insights] fetch playlist insights success'
export const FETCH_PLAYLIST_INSIGHTS_ERROR =
  '[playlist insights] fetch playlist insights error'

// Manage Modules Action Constants
export const ADD_MODULE = '[curriculum-sequence] Add new module'
export const UPDATE_MODULE = '[curriculum-sequence] Update module data'
export const DELETE_MODULE = '[curriculum-sequence] Delete module'
export const ORDER_MODULES = '[curriculum-sequence] Resequence modules'
export const UPDATE_CUSTOMIZED_PLAYLIST =
  '[curriculum-sequence] Update the customized playlist'
export const TOGGLE_MANAGE_MODULE =
  '[curriculum-sequence] toggle manage module modal'

export const FETCH_DIFFERENTIATION_STUDENT_LIST =
  '[differentiation] fetch student list'
export const UPDATE_DIFFERENTIATION_STUDENT_LIST =
  '[differentiation] student list update'
export const FETCH_DIFFERENTIATION_WORK =
  '[differentiation] fetch differentiation work'
export const SET_DIFFERENTIATION_WORK =
  '[differentiation] set differentiation work'
export const SET_DIFFERENTIATION_SELECTED_DATA =
  '[differentiation] set differentiation selected data'
export const ADD_TYPE_BASED_DIFFERENTIATION_RESOURCES =
  '[differentiation] add differentiation resources'
export const REMOVE_TYPE_BASED_DIFFERENTIATION_RESOURCES =
  '[differentiation] remove differentiation resources'
export const CLEAR_ALL_DIFFERENTIATION_RESOURCES =
  '[differentiation] clear all differentiation resources'
export const ADD_TEST_TO_DIFFERENTIATION = '[differentiation] add test'
export const REMOVE_RESOURCE_FROM_DIFFERENTIATION =
  '[differentiation] remove resource'
export const ADD_RECOMMENDATIONS_ACTIONS =
  '[differentiation] add recommendations'
export const UPDATE_FETCH_DIFFERENTIATION_WORK_LOADING_STATE =
  '[differentiation] update fetch work loading state'
export const UPDATE_WORK_STATUS_DATA =
  '[differentiation] update work status data'
export const ADD_RESOURCE_TO_DIFFERENTIATION = '[differentiation] add resource'

export const PLAYLIST_ADD_ITEM_INTO_MODULE =
  '[curriculum-sequence] add item into module'
export const PLAYLIST_ADD_SUBRESOURCE = '[curriculum-sequence] add sub resource'
export const PLAYLIST_REMOVE_SUBRESOURCE =
  '[curriculum-sequence] remove sub resource'
export const UPDATE_DESTINATION_CURRICULUM_SEQUENCE_REQUEST =
  '[playlist] update destination curriculum sequence request'

export const GET_SIGNED_REQUEST_FOR_RESOURCE_REQUEST =
  '[playlist] get signed request for resource request'
export const UPDATE_SIGNED_REQUEST_FOR_RESOURCE =
  '[playlist] update signed request for resource'

export const RESET_DESTINATION = '[playlist] reset destination'
export const SET_DESTINATION_ORIGINAL =
  '[playlist] set destination original data'
export const RESET_DESTINATION_FLAGS = '[playlist] reset destination flags'

export const DUPLICATE_MANAGE_CONTENT = '[playlist] duplicate mange content'
export const PUBLISH_CUSTOMIZED_DRAFT_PLAYLIST =
  '[playlist] publish customized playlist'
export const SET_VIDEO_PREVIEW_RESOURCE_MODAL =
  '[playlist] set video resource modal content'
export const ADD_SUB_RESOURCE_IN_DIFFERENTIATION =
  '[playlist] add sub-resource to test'
export const REMOVE_SUB_RESOURCE_FROM_TEST =
  '[playlist] remove sub-resource from test'
export const SET_SHOW_RIGHT_SIDE_PANEL = '[playlist] set show right side panel'
export const SET_ACTIVE_RIGHT_PANEL = '[playlist] set active right panel view'
export const DELETE_PLAYLIST_REQUEST = '[playlist] delete request'
export const REMOVE_PLAYLIST_FROM_USE = '[playlist] remove from use'

export const UNASSIGN_ASSIGNMENTS_FROM_PLAYLIST =
  '[playlist] unassign assignments'
export const UNASSIGN_ASSINMENTS_SUCCESS =
  '[playlist] unassign assignments success'
export const TOGGLE_ASSIGNMENTS = '[playlist] toggle assignments'
export const SET_CURRENT_ASSIGNMENT_IDS =
  '[playlist] set current assignment ids'
export const DUPLICATE_PLAYLIST_REQUEST = '[playlist] duplicate request'
export const SET_IS_USED_MODAL_VISIBLE =
  '[playlist] show/hide is used modal popup'
export const SET_CUSTOM_TITLE_MODAL_VISIBLE =
  '[playlist] show/hide custom title modal popup'
export const SET_PREVIOUSLY_USED_PLAYLIST_CLONE =
  '[playlist] previously used playlist clone data'

export const EDIT_PLAYLIST_TEST = '[playlist] edit playlist test'
export const SET_USE_THIS_LOADER =
  '[playlist] set/unset loader while using playlist'
export const SET_CURRENT_TERM =
  '[playlist] set/unset user selected ter to load assignments and summary'

// Actions
export const updateCurriculumSequenceList = createAction(
  UPDATE_CURRICULUM_SEQUENCE_LIST
)
export const updateCurriculumSequenceAction = createAction(
  UPDATE_CURRICULUM_SEQUENCE
)
export const searchCurriculumSequencesAction = createAction(
  SEARCH_CURRICULUM_SEQUENCES
)
export const searchGuidesAction = createAction(SEARCH_GUIDES)
export const searchGuideResultAction = createAction(SEARCH_GUIDES_RESULT)
export const searchContentAction = createAction(SEARCH_CONTENT_CURRICULUMS)
export const searchContentResultAction = createAction(
  SEARCH_CONTENT_CURRICULUMS_RESULT
)
export const changeGuideAction = createAction(CHANGE_GUIDE)
export const setPublisherAction = createAction(SET_PUBLISHER)
export const setGuideAction = createAction(SET_GUIDE)
export const setContentCurriculumAction = createAction(SET_CONTENT_CURRICULUM)
export const saveGuideAlignmentAction = createAction(SAVE_GUIDE_ALIGNMENT)
export const toggleCheckedUnitItemAction = createAction(
  TOGGLE_CHECKED_UNIT_ITEM
)
export const toggleAddContentAction = createAction(TOGGLE_ADD_CONTENT)
export const createAssignmentNowAction = createAction(CREATE_ASSIGNMENT_NOW)
export const setSelectedItemsForAssignAction = createAction(
  SET_SELECTED_ITEMS_FOR_ASSIGN_INIT
)
export const setRecommendationsToAssignAction = createAction(
  SET_RECOMMENDATIONS_TO_ASSIGN
)
export const setDataForAssignAction = createAction(SET_DATA_FOR_ASSIGN_INIT)
export const addContentToCurriculumSequenceAction = createAction(
  ADD_CONTENT_TO_CURRICULUM_RESULT
)
export const saveCurriculumSequenceAction = createAction(
  SAVE_CURRICULUM_SEQUENCE
)
export const addNewUnitAction = createAction(ADD_NEW_UNIT_INIT)
export const removeUnitAction = createAction(REMOVE_UNIT_INIT)
export const fetchAssignedAction = createAction(FETCH_ASSIGNED_REQUEST)
export const useThisPlayListAction = createAction(USE_THIS_PLAYLIST)
export const cloneThisPlayListAction = createAction(CLONE_THIS_PLAYLIST)

export const removeItemFromUnitAction = createAction(REMOVE_ITEM_FROM_UNIT)
export const putCurriculumSequenceAction = createAction(PUT_CURRICULUM_SEQUENCE)
export const fetchClassListAction = createAction(
  FETCH_CLASS_LIST_BY_DISTRICT_ID
)
export const fetchClassListSuccess = createAction(FETCH_CLASS_LIST_SUCCESS)
export const fetchStudentListAction = createAction(
  FETCH_STUDENT_LIST_BY_GROUP_ID
)
export const fetchStudentListSuccess = createAction(FETCH_STUDENT_LIST_SUCCESS)
export const dropPlaylistAction = createAction(DROP_PLAYLIST_ACTION)
export const fetchPlaylistDroppedAccessList = createAction(
  FETCH_PLAYLIST_ACCESS_LIST
)
export const updateDroppedAccessList = createAction(UPDATE_DROPPED_ACCESS_LIST)
export const addItemIntoPlaylistModuleAction = createAction(
  PLAYLIST_ADD_ITEM_INTO_MODULE
)
export const addSubresourceToPlaylistAction = createAction(
  PLAYLIST_ADD_SUBRESOURCE
)
export const removeSubResourceAction = createAction(PLAYLIST_REMOVE_SUBRESOURCE)
export const fetchDifferentiationStudentListAction = createAction(
  FETCH_DIFFERENTIATION_STUDENT_LIST
)
export const updateDifferentiationStudentListAction = createAction(
  UPDATE_DIFFERENTIATION_STUDENT_LIST
)
export const fetchDifferentiationWorkAction = createAction(
  FETCH_DIFFERENTIATION_WORK
)
export const setDifferentiationWorkAction = createAction(
  SET_DIFFERENTIATION_WORK
)
export const setDifferentiationSelectedDataAction = createAction(
  SET_DIFFERENTIATION_SELECTED_DATA
)
export const addDifferentiationResourcesAction = createAction(
  ADD_TYPE_BASED_DIFFERENTIATION_RESOURCES
)
export const removeDifferentiationResourcesAction = createAction(
  REMOVE_TYPE_BASED_DIFFERENTIATION_RESOURCES
)
export const clearAllDiffenrentiationResourcesAction = createAction(
  CLEAR_ALL_DIFFERENTIATION_RESOURCES
)
export const addRecommendationsAction = createAction(
  ADD_RECOMMENDATIONS_ACTIONS
)
export const updateFetchWorkLoadingStateAction = createAction(
  UPDATE_FETCH_DIFFERENTIATION_WORK_LOADING_STATE
)
export const updateDestinationCurriculumSequenceRequestAction = createAction(
  UPDATE_DESTINATION_CURRICULUM_SEQUENCE_REQUEST
)
export const updateWorkStatusDataAction = createAction(UPDATE_WORK_STATUS_DATA)
export const addTestToDifferentationAction = createAction(
  ADD_TEST_TO_DIFFERENTIATION
)
export const removeResourceFromDifferentiationAction = createAction(
  REMOVE_RESOURCE_FROM_DIFFERENTIATION
)
export const addResourceToDifferentiationAction = createAction(
  ADD_RESOURCE_TO_DIFFERENTIATION
)
export const addSubResourceToTestInDiffAction = createAction(
  ADD_SUB_RESOURCE_IN_DIFFERENTIATION
)
export const removeSubResourceInDiffAction = createAction(
  REMOVE_SUB_RESOURCE_FROM_TEST
)

export const getSignedRequestAction = createAction(
  GET_SIGNED_REQUEST_FOR_RESOURCE_REQUEST
)
export const updateSinedRequestAction = createAction(
  UPDATE_SIGNED_REQUEST_FOR_RESOURCE
)
export const duplicateManageContentAction = createAction(
  DUPLICATE_MANAGE_CONTENT
)
export const publishCustomizedPlaylistAction = createAction(
  PUBLISH_CUSTOMIZED_DRAFT_PLAYLIST
)
export const setEmbeddedVideoPreviewModal = createAction(
  SET_VIDEO_PREVIEW_RESOURCE_MODAL
)
export const setShowRightSideAction = createAction(SET_SHOW_RIGHT_SIDE_PANEL)
export const setActiveRightPanelViewAction = createAction(
  SET_ACTIVE_RIGHT_PANEL
)
export const deletePlaylistRequestAction = createAction(DELETE_PLAYLIST_REQUEST)
export const removePlaylistFromUseAction = createAction(
  REMOVE_PLAYLIST_FROM_USE
)
export const unassignAssignmentsfromPlaylistAction = createAction(
  UNASSIGN_ASSIGNMENTS_FROM_PLAYLIST
)
export const unassignAssignmentsSuccessAction = createAction(
  UNASSIGN_ASSINMENTS_SUCCESS
)
export const toggleAssignmentsAction = createAction(TOGGLE_ASSIGNMENTS)
export const setCurrentAssignmentIdsAction = createAction(
  SET_CURRENT_ASSIGNMENT_IDS
)
export const duplicatePlaylistRequestAction = createAction(
  DUPLICATE_PLAYLIST_REQUEST
)
export const setUseThisLoading = createAction(SET_USE_THIS_LOADER)

export const setCurrentUserTermAction = createAction(SET_CURRENT_TERM)

export const setIsUsedModalVisibleAction = createAction(
  SET_IS_USED_MODAL_VISIBLE
)
export const setCustomTitleModalVisibleAction = createAction(
  SET_CUSTOM_TITLE_MODAL_VISIBLE
)

export const setPreviouslyUsedPlaylistClone = createAction(
  SET_PREVIOUSLY_USED_PLAYLIST_CLONE
)

export const getAllCurriculumSequencesAction = (
  ids,
  showNotification,
  backgroundFetch = false
) => {
  if (!ids) {
    return {
      type: FETCH_CURRICULUM_SEQUENCES_ERROR,
    }
  }
  return {
    type: FETCH_CURRICULUM_SEQUENCES,
    payload: { ids, showNotification, backgroundFetch },
  }
}
export const approveOrRejectSinglePlaylistRequestAction = createAction(
  APPROVE_OR_REJECT_SINGLE_PLAYLIST_REQUEST
)
export const approveOrRejectSinglePlaylistSuccessAction = createAction(
  APPROVE_OR_REJECT_SINGLE_PLAYLIST_SUCCESS
)
export const setPlaylistDataAction = createAction(SET_PLAYLIST_DATA)
export const receiveCurrentPlaylistMetrics = createAction(
  FETCH_PLAYLIST_METRICS
)
export const updatePlaylistMetrics = createAction(UPDATE_PLAYLIST_METRICS)
export const fetchPlaylistInsightsAction = createAction(FETCH_PLAYLIST_INSIGHTS)
export const onSuccessPlaylistInsightsAction = createAction(
  FETCH_PLAYLIST_INSIGHTS_SUCCESS
)
export const onErrorPlaylistInsightsAction = createAction(
  FETCH_PLAYLIST_INSIGHTS_ERROR
)

// Manage Modules Actions
export const toggleManageModulesVisibilityCSAction = createAction(
  TOGGLE_MANAGE_MODULE
)
export const createNewModuleCSAction = createAction(ADD_MODULE)
export const updateModuleCSAction = createAction(UPDATE_MODULE)
export const deleteModuleCSAction = createAction(DELETE_MODULE)
export const resequenceModulesCSAction = createAction(ORDER_MODULES)
export const updatePlaylistCSAction = createAction(UPDATE_CUSTOMIZED_PLAYLIST)
export const resetDestinationAction = createAction(RESET_DESTINATION)
export const setOriginalDestinationData = createAction(SET_DESTINATION_ORIGINAL)
export const resetDestinationFlags = createAction(RESET_DESTINATION_FLAGS)

export const PLAYLIST_REORDER_TESTS = '[playlist] destination reorder test'
export const playlistDestinationReorderTestsAction = createAction(
  PLAYLIST_REORDER_TESTS
)

export const REMOVE_TEST_FROM_MODULE_PLAYLIST =
  '[playlist edit] test remove from module'
export const playlistTestRemoveFromModuleAction = createAction(
  REMOVE_TEST_FROM_MODULE_PLAYLIST
)

export const TOGGLE_MANAGE_CONTENT_ACTIVE = '[playlist] toggle manage content'
export const toggleManageContentActiveAction = createAction(
  TOGGLE_MANAGE_CONTENT_ACTIVE
)

// Playlist Test Details Modal
export const TOGGLE_PLAYLIST_TEST_DETAILS_MODAL_WITH_ID =
  '[playlist] toggle test details modal'
export const togglePlaylistTestDetailsModalWithId = createAction(
  TOGGLE_PLAYLIST_TEST_DETAILS_MODAL_WITH_ID
)

// use This button notification
export const TOGGLE_SHOW_USE_THIS_NOTIFICATION =
  '[playlist] remove sub-resource from test'
export const toggleShowUseThisNotificationAction = createAction(
  TOGGLE_SHOW_USE_THIS_NOTIFICATION
)

// used to put customized playlist in draft state temporarily...
export const SET_CUSTOMIZE_TO_DRAFT =
  '[playlist] set/unset curriculum sequence to temporary draft state'
export const setCustomizeToDraftAction = createAction(SET_CUSTOMIZE_TO_DRAFT)

// used to reset to original playlist
export const REVERT_CUSTOMIZE_TO_DRAFT =
  '[playlist] revert to original playlist'
export const discardDraftPlaylistAction = createAction(
  REVERT_CUSTOMIZE_TO_DRAFT
)

// used to reset to original playlist
export const CHECK_PREVIOUSLY_CUSTOMIZED =
  '[playlist] check if this playlist is already customized'
export const checkPreviouslyCustomizedAction = createAction(
  CHECK_PREVIOUSLY_CUSTOMIZED
)

export const editPlaylistTestAction = createAction(EDIT_PLAYLIST_TEST)

// State getters
const getCurriculumSequenceState = (state) => state.curriculumSequence

export const getDifferentiationStudentListSelector = (state) =>
  state.curriculumSequence.differentiationStudentList

export const getDifferentiationWorkSelector = (state) =>
  state.curriculumSequence.differentiationWork

export const getDifferentiationWorkLoadingStateSelector = (state) =>
  state.curriculumSequence.isFetchingDifferentiationWork

export const getWorkStatusDataSelector = (state) =>
  state.curriculumSequence.workStatusData

export const getRecommendationsToAssignSelector = createSelector(
  getCurriculumSequenceState,
  (curriculumSequence) => curriculumSequence.recommendationsToAssign
)

export const getDifferentiationSelectedDataSelector = createSelector(
  getCurriculumSequenceState,
  (curriculumSequence) => curriculumSequence.differentiationSelectedData
)

export const getDifferentiationResourcesSelector = createSelector(
  getCurriculumSequenceState,
  (curriculumSequence) => curriculumSequence.differentiationResources
)

const getPublisher = (state) => {
  if (!state.curriculumSequence) return ''

  return state.curriculumSequence.selectedPublisher
}

const getDestinationCurriculumSequence = (state) =>
  state.curriculumSequence.destinationCurriculumSequence

export const getIsUseThisLoading = createSelector(
  getCurriculumSequenceState,
  (curriculumSequence) => curriculumSequence.isUseThisLoading
)

export const getCurrentPlaylistTermId = createSelector(
  getCurriculumSequenceState,
  (curriculumSequence) => curriculumSequence.currentTermId
)

function* makeApiRequest(
  idsForFetch = [],
  showNotification = false,
  forUseThis = false
) {
  try {
    const pathname = yield select((state) => state.router.location.pathname)
    const isMyPlaylist = pathname.includes('use-this')
    let activeTermIds = []
    const selectedPlaylistTermId = yield select(getCurrentPlaylistTermId)
    if (!selectedPlaylistTermId) {
      activeTermIds = yield select(getCurrentActiveTermIds)
    } else {
      activeTermIds = [selectedPlaylistTermId]
    }
    const unflattenedItems = yield all(
      idsForFetch.map((id) =>
        call(curriculumSequencesApi.getCurriculums, {
          id,
          forUseThis: forUseThis || isMyPlaylist,
          termIds: activeTermIds,
        })
      )
    )

    // We're using flatten because return from the server
    // is array even if it's one item, so we flatten it
    const items = flatten(unflattenedItems)
    const recentPlaylists = yield select(
      (state) => state?.playlists?.recentPlayLists || []
    )

    // show notification if when user comes to playlist page and playlist has assigned assignments
    // show only notification for teacher
    if (showNotification) {
      const modules = items?.reduce(
        (acc, curr) => [...acc, ...(curr?.modules || [])],
        []
      )
      const sumOfclasse = modules
        .reduce((acc, curr) => [...acc, ...(curr.data || [])], [])
        .flatMap((x) => x?.assignments || {})
        .reduce((acc, curr) => acc + get(curr, 'class.length', 0), 0)
      const playlistBeingUsed =
        idsForFetch.length === 1 &&
        recentPlaylists.find((x) => x._id === idsForFetch[0])
      if (sumOfclasse > 0 && playlistBeingUsed) {
        notification({ type: 'info', messageKey: 'playlistBeingUsed' })
      }
    }

    const { authors } = items[0]
    const userId = yield select(getUserId)
    if (authors && authors.map((author) => author._id).includes(userId)) {
      items[0].isAuthor = true
    } else {
      items[0].isAuthor = false
    }
    // Normalize data
    if (idsForFetch.length > 1) {
      const curriculumSequenceSchema = new schema.Entity(
        'curriculumSequenceList',
        {},
        { idAttribute: '_id' }
      )
      const userListSchema = [curriculumSequenceSchema]

      const {
        result: allCurriculumSequences,
        entities: { curriculumSequenceList: curriculumSequenceListObject },
      } = normalize(items, userListSchema)

      yield put(
        updateCurriculumSequenceList({
          allCurriculumSequences,
          curriculumSequenceListObject,
        })
      )
    } else {
      yield put(updateCurriculumSequenceAction(items))
    }
  } catch (error) {
    if (error.response.data?.statusCode === 403) {
      /**
       * if permission is denied while trying to access MyPlaylist, then
       * show any one of the recently used playlists.
       */
      try {
        const pathname = yield select((state) => state.router.location.pathname)
        const isMyPlaylist = pathname.includes('use-this')
        const recentPlaylists = yield select(
          (state) => state?.playlists?.recentPlayLists || []
        )
        const currentPlaylistIndex = recentPlaylists?.findIndex(
          ({ _id }) => _id === idsForFetch?.[0]
        )
        if (isMyPlaylist) {
          // currentPlaylistIndex should be -1 if its > -1 then something's not right !
          const index =
            currentPlaylistIndex === -1 ? 0 : currentPlaylistIndex + 1
          const { _id = '' } = recentPlaylists[index] || {}
          if (_id) {
            yield call(makeApiRequest, [_id], false)
            yield put(push(`/author/playlists/playlist/${_id}/use-this`))
            yield call(notification, {
              msg: `You can no longer access '${
                error?.data?.title || 'this'
              }' Playlist as sharing is revoked by the author.`,
            })
            return
          }
        } else if (currentPlaylistIndex !== -1) {
          // if the playlist is in recents then navigate to myPlaylist

          yield call(makeApiRequest, [idsForFetch?.[0]], false, true)
          yield put(
            push(`/author/playlists/playlist/${idsForFetch?.[0]}/use-this`)
          )
          yield call(notification, {
            type: 'warn',
            msg: `You can no longer access '${
              error?.data?.title || 'this'
            }' Playlist as sharing is revoked by the author.`,
          })
          return
        }
        // handle the rest in successive catch block
        throw new Error('Permission Denied !')
      } catch (e) {
        yield put(push('/author/playlists'))
        yield call(notification, {
          msg: `You can no longer access '${
            error?.data?.title || 'this'
          }' Playlist as sharing is revoked by the author.`,
        })
      }
    } else {
      notification({ type: 'warning', messageKey: 'curriculumMakeApiWarn' })
    }
  }
}

function* fetchItemsFromApi({ payload: { ids, showNotification } }) {
  yield call(makeApiRequest, ids, showNotification)
}

/**
 * @typedef {Object} PutCurriculumSequencePayload
 * @property {string} id
 * @property {import('./components/CurriculumSequence').CurriculumSequenceType} curriculumSequence
 */

/**
 * @param {Object<String, String>} args
 * @param {PutCurriculumSequencePayload} [args.payload]
 */
function* putCurriculumSequence({ payload }) {
  const {
    id,
    changedItem,
    curriculumSequence,
    isPlaylist = false,
    showNotification = false,
    toggleModuleNotification = false,
    toggleTestNotification = false,
  } = payload
  const oldData = cloneDeep(curriculumSequence)
  try {
    const dataToSend = omit(curriculumSequence, [
      'authors',
      'createdDate',
      'updatedDate',
      'sharedWith',
      'sharedType',
      'isAuthor',
      'collectionName',
      'testItems',
      'playlistMode',
    ])
    const resourceMap = {}
    dataToSend.modules = dataToSend.modules.map((mod) => {
      mod.data = mod.data.map((test) => {
        if (test.contentType === 'test' && test.resources) {
          const testId = test.contentId
          test.resources = test.resources.map((resource) => {
            const { contentId: resourceId, updateStandards } = resource
            if (updateStandards) {
              resourceMap[testId] = [...(resourceMap[testId] || []), resourceId]
            }
            return omit(resource, ['updateStandards'])
          })
        }
        return omit(test, [
          'standards',
          'alignment',
          'assignments',
          'testType',
          'status',
          'hasStandardsOnCreation',
          'hasRandomQuestions',
        ])
      })
      return mod
    })
    const response = yield curriculumSequencesApi.updateCurriculumSequence(
      id,
      dataToSend
    )
    if (Object.keys(response).length > 0) {
      if (!isEmpty(resourceMap)) {
        yield call(resourcesApi.updateStandards, resourceMap)
      }

      const { authors, version, _id } = response
      const userId = yield select(getUserId)
      if (authors && authors.map((author) => author._id).includes(userId)) {
        response.isAuthor = true
      } else {
        response.isAuthor = false
      }
      oldData._id = _id
      oldData.version = version
      if (showNotification) {
        notification({ type: 'success', messageKey: 'playlistSaved' })
      }

      // will show the notification only when show/hide module.
      if (toggleModuleNotification) {
        const { title: moduleTitle, hidden } = changedItem
        let msg = `"${moduleTitle}" is visible now`
        if (hidden) {
          msg = `"${moduleTitle}" is hidden now.`
        }
        notification({ type: 'success', msg })
      }

      // will show the notification only when show/hide assignment or resource
      if (toggleTestNotification) {
        const { contentTitle, hidden } = changedItem
        let msg = `"${contentTitle}" is visible now`
        if (hidden) {
          msg = `"${contentTitle}" is hidden now.`
        }
        notification({ type: 'success', msg })
      }

      yield put(updateCurriculumSequenceAction(oldData))
      if (isPlaylist) {
        yield put(toggleManageModulesVisibilityCSAction(false))
      }
    }
  } catch (error) {
    notification({ messageKey: 'putCurriculumErr' })
  }
}

function* postSearchCurriculumSequence({ payload }) {
  try {
    const { publisher, type } = payload
    const response = yield call(
      curriculumSequencesApi.searchCurriculumSequences,
      {
        publisher,
        type,
      }
    )
    const ids = response.map((curriculum) => curriculum._id)
    yield call(makeApiRequest, ids)
  } catch (error) {
    notification({ messageKey: 'commonErr' })
  }
}

function* searchGuides({ payload }) {
  try {
    const { publisher, type } = payload
    const response = yield call(
      curriculumSequencesApi.searchCurriculumSequences,
      {
        publisher,
        type,
      }
    )
    yield put(searchGuideResultAction(response))
  } catch (error) {
    notification({ messageKey: 'commonErr' })
  }
}

function* searchContent() {
  try {
    const publisher = yield select(getPublisher)
    const type = CURRICULUM_TYPE_CONTENT
    const response = yield call(
      curriculumSequencesApi.searchCurriculumSequences,
      {
        publisher,
        type,
      }
    )
    yield put(searchContentResultAction(response))
  } catch (error) {
    notification({ messageKey: 'commonErr' })
  }
}

function* changeGuide({ ids }) {
  try {
    yield call(makeApiRequest, ids)
  } catch (error) {
    notification({ messageKey: 'commonErr' })
  }
}

function* setPublisher({ payload }) {
  try {
    const response = yield call(
      curriculumSequencesApi.searchCurriculumSequences,
      {
        publisher: payload,
        type: 'guide',
      }
    )
    yield put(searchGuideResultAction(response))
  } catch (error) {
    notification({ messageKey: 'commonErr' })
    yield searchGuideResultAction([])
  }
}

function* setGuide() {
  // Future logic based on guide selection
}

function* setContentCurriculum({ payload }) {
  const ids = [payload]
  yield call(makeApiRequest, ids)
}

function* saveGuideAlignment() {
  const state = yield select(getCurriculumSequenceState)
  const ids = [state.selectedGuide]
  yield call(makeApiRequest, ids)
}

function* assign({ payload }) {
  const { assignment, assignData } = payload
  const { user } = yield select(getUserSelector)

  assignData.testId = assignment.testId

  try {
    yield call(assignmentApi.create, {
      assignedBy: user._id,
      assignments: [assignData],
    })
  } catch (error) {
    notification({ type: 'warning', msg: error.message })
    return error
  }

  assignment.assigned = true

  yield put({
    type: UPDATE_ASSIGNMENT,
    payload: assignment,
  })
  notification({ type: 'info', msg: `${assignment.id} successfully assigned` })
  return assignment
}

/**
 * @param {import('./components/CurriculumSequence').ModuleData} unitItem
 * @param {import('./components/CurriculumSequence').CurriculumSequenceType} curriculumSequence
 */
function getCurriculumAsssignmentMatch(unitItem, curriculumSequence) {
  let matchingUnitItem = {}

  // here we should go with checking the testIds instead

  curriculumSequence.modules.forEach((m) => {
    m.data.forEach((d) => {
      if (d.testId === unitItem.testId) {
        matchingUnitItem = d
      }
    })
  })

  return { ...matchingUnitItem }
}

function* saveCurriculumSequence({ payload }) {
  // call api and update curriculum
  const destinationCurriculumSequence = {
    ...(yield select(getDestinationCurriculumSequence)),
  }

  const id = destinationCurriculumSequence._id
  delete destinationCurriculumSequence._id

  yield putCurriculumSequence({
    payload: {
      id,
      curriculumSequence: destinationCurriculumSequence,
      isPlaylist: payload?.isPlaylist,
    },
  })
}

function* createAssignmentNow({ payload }) {
  const currentAssignment = payload

  /** @type {State} */
  const curriculumSequenceState = yield select(getCurriculumSequenceState)
  const destinationCurriculumSequence = {
    ...curriculumSequenceState.destinationCurriculumSequence,
  }

  // Fetch test and see if it's published
  yield put(receiveTestByIdAction(currentAssignment.testId))
  yield take(RECEIVE_TEST_BY_ID_SUCCESS)
  const test = yield select(getTestSelector)

  // Publish it if it's not already published
  if (test.status === DRAFT) {
    yield put(publishTestAction(currentAssignment.testId))
    yield take(UPDATE_TEST_STATUS)
  }

  const { user } = yield select(getUserSelector)
  const userClass = user.orgData.defaultClass
  const assignData = { ...curriculumSequenceState.dataForAssign }

  yield put(fetchGroupMembersAction({ classId: userClass }))
  yield take(SET_GROUP_MEMBERS)
  const students = yield select(getStudentsSelector)

  // NOTE: assign count is missing, how to implement it?
  assignData.class.push({ students, _id: userClass })

  const curriculumAssignment = getCurriculumAsssignmentMatch(
    currentAssignment,
    destinationCurriculumSequence
  )

  // assignment already in curriculum
  if (!isEmpty(curriculumAssignment)) {
    const _assignData = curriculumSequenceState.dataForAssign
    yield assign({
      payload: { assignment: currentAssignment, assignData: _assignData },
    })
    yield saveCurriculumSequence()
    return
  }

  // assignment not in destination curriculum
  if (isEmpty(curriculumAssignment)) {
    const destinationModules = destinationCurriculumSequence.modules

    // Create misc unit if it doesn'tREMOVE_PLAYLIST_FROM_USE exist
    const haveMiscUnit =
      destinationModules.map((m) => m.name.toLowerCase()).indexOf('misc') !== -1

    const lastModuleId =
      destinationModules[destinationModules.length - 1] &&
      destinationModules[destinationModules.length - 1].id

    // NOTE: what happens if no modules are present?
    if (!haveMiscUnit) {
      const newUnit = {
        id: v4(),
        data: [],
        name: 'Misc',
      }

      try {
        /* eslint-disable-next-line */
        yield addNewUnit({
          payload: {
            afterUnitId: lastModuleId,
            newUnit,
            shouldSave: false,
          },
        })
        /* eslint-disable-next-line */
        yield addContentToCurriculumSequence({
          payload: {
            contentToAdd: currentAssignment,
            toUnit: newUnit,
          },
        })
        yield assign({
          payload: { assignment: currentAssignment, assignData },
        })
      } catch (error) {
        notification({ messageKey: 'createMiscErr' })
        console.warn('Error create misc unit.', error)
        return
      }
    }

    try {
      // Find misc unit
      const miscUnitIndex = destinationModules
        .map((m) => m.name.toLowerCase())
        .indexOf('misc')

      /* eslint-disable*/
      const response = yield addContentToCurriculumSequence({
        payload: {
          contentToAdd: currentAssignment,
          toUnit: destinationModules[miscUnitIndex],
        },
      })
      const assignResult = yield assign({
        payload: { assignment: currentAssignment, assignData },
      })

      if (response instanceof Error) return response
      if (assignResult instanceof Error) return assignResult
      /* eslint-enable */
    } catch (error) {
      console.warn('Add content to misc unit failed.')
      notification({ messageKey: 'createMiscErr' })
      return
    }

    destinationCurriculumSequence.modules = [
      ...destinationCurriculumSequence.modules.map((moduleItem) => {
        const updatedModule = { ...moduleItem }
        const updatedModuleData = moduleItem.data.map((dataItem) => {
          const updatedDataItem = { ...dataItem }
          return updatedDataItem
        })

        updatedModule.data = updatedModuleData
        return updatedModule
      }),
    ]

    try {
      yield curriculumSequencesApi.updateCurriculumSequence(
        destinationCurriculumSequence._id,
        destinationCurriculumSequence
      )

      yield put(updateCurriculumSequenceAction(destinationCurriculumSequence))
      /* eslint-disable-next-line */
      yield saveCurriculumSequence()
    } catch (error) {
      notification({ messageKey: 'updatingCurriculumErr' })
      console.warn('There was an error updating the curriculum sequence', error)
    }
  }
}

export function* updateDestinationCurriculumSequencesaga({ payload }) {
  try {
    const curriculumSequence = yield select(getDestinationCurriculumSequence)
    curriculumSequence.isSMPlaylist = payload?.isSMPlaylist

    yield put(
      putCurriculumSequenceAction({
        id: curriculumSequence._id,
        curriculumSequence,
        showNotification: payload.showNotification,
      })
    )
  } catch (err) {
    notification({ messageKey: 'updatingCurriculumErr' })
    console.error('update curriculum sequence Error', err)
  }
}

export function* getSignedRequestSaga({ payload }) {
  try {
    yield put(updateSinedRequestAction(null))
    const request = yield call(curriculumSequencesApi.getSignedRequest, payload)
    yield put(updateSinedRequestAction(request))
  } catch (err) {
    notification({ messageKey: 'loadingResourceErr' })
  }
}

function* addContentToCurriculumSequence({ payload }) {
  // TODO: change unit to module to stay consistent
  const { contentToAdd, toUnit } = payload

  if (!contentToAdd || !toUnit) return

  // Prevent duplicated items to be added
  if (toUnit.data.map((item) => item.id).indexOf(contentToAdd.id) !== -1) {
    notification({ type: 'warning', messageKey: 'assignmentExists' })
    return new Error('Assignment already exists.')
  }

  const updatedUnit = { ...toUnit }
  updatedUnit.data.push(contentToAdd)

  yield put({
    type: ADD_CONTENT_TO_CURRICULUM_RESULT,
    payload: updatedUnit,
  })
}

function* setDataForAssign(payload) {
  yield put({
    type: SET_DATA_FOR_ASSIGN,
    payload,
  })
}

function* setSelectedItemsForAssign({ payload }) {
  yield put(setCurrentAssignmentAction(payload))
  yield put({
    type: SET_SELECTED_ITEMS_FOR_ASSIGN,
    payload,
  })
}

function* addNewUnit({ payload }) {
  const { afterUnitId, newUnit, shouldSave = true } = payload

  const curriculumSequenceState = yield select(getCurriculumSequenceState)
  const destinationCurriculumSequence = {
    ...curriculumSequenceState.destinationCurriculumSequence,
  }

  newUnit.id = v4()

  const modules = cloneDeep(destinationCurriculumSequence.modules)
  const moduleIds = destinationCurriculumSequence.modules.map(
    (module) => module.id
  )
  const insertIndex = moduleIds.indexOf(afterUnitId)
  modules.splice(insertIndex + 1, 0, newUnit)

  yield put({
    type: ADD_NEW_UNIT,
    payload: modules,
  })

  if (shouldSave) {
    yield call(saveCurriculumSequence)
  }
}

function* removeUnit({ payload }) {
  const unitId = payload
  const curriculumSequenceState = yield select(getCurriculumSequenceState)
  const destinationCurriculumSequence = {
    ...curriculumSequenceState.destinationCurriculumSequence,
  }

  const modules = cloneDeep(destinationCurriculumSequence.modules)
  const moduleIds = destinationCurriculumSequence.modules.map(
    (module) => module.id
  )
  const unitIndex = moduleIds.indexOf(unitId)
  modules.splice(unitIndex, 1)

  yield put({
    type: REMOVE_UNIT,
    payload: modules,
  })
}

function* fetchAssigned() {
  try {
    const assigned = yield call(assignmentApi.fetchAssigned, '')

    yield put({
      type: FETCH_ASSIGNED_RESULT,
      payload: assigned.assignments,
    })
  } catch (error) {
    return error
  }
}

function* duplicatePlayListSaga({ payload }) {
  try {
    const { _id, title } = payload
    const duplicatedPlaylist = yield call(
      curriculumSequencesApi.duplicatePlayList,
      {
        _id,
        title,
      }
    )
    const newId = duplicatedPlaylist._id
    yield put(push(`/author/playlists/${newId}/edit`))
  } catch (e) {
    console.error(e)
    notification({ messageKey: 'commonErr' })
    Sentry.captureException(e)
  }
}

function* editPlaylistTestSaga({ payload }) {
  try {
    const { testId, playlistId, isTestAssigned } = payload

    if (!testId || !playlistId) {
      notification({ msg: 'Insufficient parameters passed!' })
      return
    }

    // In case of 'View test details' modal, test is already loaded in store.
    let test = yield select(getTestSelector)

    if (!test || test._id !== testId) {
      // Fetch test
      yield put(receiveTestByIdAction(testId, true, false, true, playlistId))
      yield take(RECEIVE_TEST_BY_ID_SUCCESS)
      test = yield select(getTestSelector)
    }

    const userCollections = yield select(getCollectionsSelector)
    const userWritableCollections = yield select(getWritableCollectionsSelector)
    const user = yield select(getUserSelector)
    const userId = get(user, 'user._id')
    const userRole = get(user, 'user.role')
    const userFeatures = get(user, 'user.features')

    const isDuplicateAllowed = allowDuplicateCheck(
      test?.collections,
      userCollections,
      'test'
    )
    const hasCollectionAccess = allowContentEditCheck(
      test?.collections,
      userWritableCollections
    )
    const isOwner = test?.authors?.some((x) => x._id === userId)
    const isEditDisabled = !(
      isOwner ||
      userRole === roleuser.EDULASTIC_CURATOR ||
      (hasCollectionAccess && userFeatures.isCurator)
    )

    if (isEditDisabled && !isDuplicateAllowed) {
      notification({ msg: 'Edit Test is restricted by the author' })
      return
    }

    const tab = test?.title ? 'review' : 'description'
    // Redirect user to edit page of the test.
    if (!isEditDisabled) {
      yield put(
        push({
          pathname: `/author/tests/tab/${tab}/id/${test._id}`,
          state: {
            editTestFlow: true,
          },
        })
      )
      return
    }

    // Clone the test and redirect user to edit page of cloned test.
    if (isDuplicateAllowed) {
      const userWantsToDuplicate = yield call(
        () =>
          new Promise((res) => {
            Modal.confirm({
              title: 'Warning',
              content:
                'Editing the test will create a clone and progress would be tracked separately. Do you still want to edit the test?',
              zIndex: 1500,
              centered: true,
              okButtonProps: {
                style: { background: themeColor, outline: 'none' },
              },
              okText: 'Yes, Proceed',
              cancelText: 'No, Cancel',
              onOk() {
                res(true)
                Modal.destroyAll()
              },
              onCancel() {
                res(false)
                Modal.destroyAll()
              },
            })
          })
      )
      if (userWantsToDuplicate) {
        yield put(
          duplicateTestRequestAction({
            _id: testId,
            title: test?.title || '',
            redirectToNewTest: false,
            // By default we keep reference to all the items in test in cloned test.
            cloneItems: false,
            isInEditAndRegrade: true,
            currentTab: tab,
            playlistId,
            updatePlaylist: true,
            updateContentVersionId: isTestAssigned === false, // if test is not assigned update versionId upfront
          })
        )
      }
    }
  } catch (e) {
    notification({ messageKey: 'commonErr' })
  }
}

function* duplicateManageContentSaga({ payload }) {
  try {
    const { _id: originalId, title: originalTitle, grades, subjects } = payload
    const duplicatedPlaylist = yield call(
      curriculumSequencesApi.duplicatePlayList,
      {
        _id: originalId,
        title: originalTitle,
        forUseThis: true,
      }
    )

    const newId = duplicatedPlaylist._id
    yield all([
      call(userContextApi.setLastUsedPlayList, {
        _id: newId,
        title: originalTitle,
        grades,
        subjects,
      }),
      call(userContextApi.setRecentUsedPlayLists, {
        _id: newId,
        title: originalTitle,
        grades,
        subjects,
      }),
    ])

    yield put(updateCurriculumSequenceAction(duplicatedPlaylist))
    yield put(setOriginalDestinationData(payload))
    yield put(toggleManageContentActiveAction(true))
    yield put(setActiveRightPanelViewAction('manageContent'))
    yield put(setShowRightSideAction(true))
    yield put(
      push(`/author/playlists/playlist/${duplicatedPlaylist._id}/use-this`)
    )
  } catch (error) {
    console.error(error)
    notification({ messageKey: 'commonErr' })
  }
}

function* checkForPreviouslyCustomizedPlaylist({ payload }) {
  try {
    const { _id: originalId } = payload
    const { _id, title, grades, subjects } = yield call(
      curriculumSequencesApi.checkExistingDuplicatedForUser,
      originalId
    )

    const pathname = yield select((state) => state.router.location.pathname)
    const isMyPlaylist = pathname.includes('use-this')
    if (_id !== originalId) {
      if (isMyPlaylist) {
        yield all([
          call(makeApiRequest, [_id], false),
          call(userContextApi.setLastUsedPlayList, {
            _id,
            title,
            grades,
            subjects,
          }),
          call(userContextApi.setRecentUsedPlayLists, {
            _id,
            title,
            grades,
            subjects,
          }),
        ])
      } else {
        yield call(makeApiRequest, [_id], false)
      }

      const locToPush = isMyPlaylist
        ? `/author/playlists/playlist/${_id}/use-this`
        : `/author/playlists/${_id}#review`
      yield put(push(locToPush))
    } else {
      yield put(setCustomizeToDraftAction(true))
    }

    yield put(toggleManageContentActiveAction('manageContent'))
    yield put(setShowRightSideAction(true))
  } catch (error) {
    console.error(error)
    notification({ messageKey: 'commonErr' })
  }
}

function* resetToOriginalPlaylist({ payload }) {
  try {
    // onCancel - fetch original playlist byId and reset flags
    yield call(makeApiRequest, [payload], false)
    yield put(setCustomizeToDraftAction(false))
    yield put(toggleManageContentActiveAction(false))

    const pathname = yield select((state) => state.router.location.pathname)
    const isMyPlaylist = pathname.includes('use-this')

    if (isMyPlaylist) {
      yield put(setActiveRightPanelViewAction('summary'))
    }
  } catch (error) {
    console.error(error)
    notification({ messageKey: 'commonErr' })
  }
}

function* publishDraftCustomizedPlaylist({ payload }) {
  try {
    // throw error if missing payload
    if (!payload) throw new Error('Missing Payload Data...')

    const draftPlaylist = { ...payload }

    // Omit forbidden object keys
    draftPlaylist.modules.forEach(({ data }) => {
      data.forEach((d) => {
        delete d.assignments
        delete d.standards
      })
    })

    // publish customized playlist + unlink & re-link all assignments to new copy
    const customisedPlaylist = yield call(
      curriculumSequencesApi.publishCustomizeDraft,
      {
        _id: draftPlaylist._id,
        data: draftPlaylist.modules,
      }
    )

    const pathname = yield select((state) => state.router.location.pathname)
    const isMyPlaylist = pathname.includes('use-this')

    // set customized playlist in userContext if in myPlaylist
    const { _id, title, grades, subjects } = customisedPlaylist
    if (isMyPlaylist) {
      yield all([
        call(makeApiRequest, [_id], false),
        call(userContextApi.setLastUsedPlayList, {
          _id,
          title,
          grades,
          subjects,
        }),
        call(userContextApi.setRecentUsedPlayLists, {
          _id,
          title,
          grades,
          subjects,
        }),
      ])
    } else {
      yield call(makeApiRequest, [_id], false)
    }

    yield put(setCustomizeToDraftAction(false))
    yield put(toggleManageContentActiveAction(false))
    yield put(setActiveRightPanelViewAction('summary'))

    const locToPush = isMyPlaylist
      ? `/author/playlists/playlist/${_id}/use-this`
      : `/author/playlists/${_id}#review`
    yield put(push(locToPush))
  } catch (e) {
    console.error('Customized draft playlist publish failed - ', e)
    notification({ messageKey: 'publishDraftPlaylistErr' })
  }
}

function* useThisPlayListSaga({ payload }) {
  try {
    yield put(setUseThisLoading(true))
    const {
      _id: playlistId,
      fromUseThis = false,
      customize = false,
      authors = [],
      forceClone = false,
      isStudent,
    } = payload

    const _id = playlistId

    const currentUserId = yield select(getUserId)
    const currentUserRole = yield select(getUserRole)
    const hasPlaylistEditAccess =
      authors?.find((x) => x._id === currentUserId) ||
      currentUserRole === roleuser.EDULASTIC_CURATOR

    /**
     * If customize is enabled and user using the playlist is not
     * an author nor a co-author then the playlist must be cloned with
     * modules referencing the original playlist
     */
    if (
      (customize && fromUseThis && !isStudent && !hasPlaylistEditAccess) ||
      forceClone
    ) {
      const duplicatedPlaylist = yield call(
        curriculumSequencesApi.checkExistingDuplicatedForUser,
        _id
      )

      // if playlist was cloned previously
      if (duplicatedPlaylist?.createdBy && !forceClone) {
        // let the user decide to clone again (or) use the cloned
        yield put(setCustomTitleModalVisibleAction(false))
        yield put(
          setPreviouslyUsedPlaylistClone({
            _id: duplicatedPlaylist._id,
            title: duplicatedPlaylist.title,
            grades: duplicatedPlaylist.grades,
            subjects: duplicatedPlaylist.subjects,
            customize: duplicatedPlaylist.customize,
            authors: duplicatedPlaylist.authors,
            derivedFrom: duplicatedPlaylist.derivedFrom,
          })
        )
        yield put(setIsUsedModalVisibleAction(true))
      } else {
        yield put(setIsUsedModalVisibleAction(false))
        yield put(setCustomTitleModalVisibleAction(true))
        yield put(
          setPreviouslyUsedPlaylistClone({
            _id,
          })
        )
      }
    } else {
      yield put(cloneThisPlayListAction(payload))
    }
  } catch (error) {
    console.error(error)
    notification({ messageKey: 'commonErr' })
  } finally {
    const { notificationCallback = null } = payload
    yield put(setUseThisLoading(false))
    if (notificationCallback) {
      notificationCallback()
    }
  }
}
function* cloneThisPlayListSaga({ payload }) {
  try {
    yield put(setUseThisLoading(true))
    const {
      _id: playlistId,
      title,
      grades,
      subjects,
      groupId,
      onChange,
      isStudent,
      fromUseThis = false,
      fromRemovePlaylist = false,
      customize = false,
      authors = [],
      forceClone = false,
    } = payload

    let _id = playlistId

    const currentUserId = yield select(getUserId)
    const currentUserRole = yield select(getUserRole)
    const hasPlaylistEditAccess =
      authors?.find((x) => x._id === currentUserId) ||
      currentUserRole === roleuser.EDULASTIC_CURATOR

    /**
     * If customize is enabled and user using the playlist is not
     * an author nor a co-author then the playlist must be cloned with
     * modules referencing the original playlist
     */
    if (
      (customize && fromUseThis && !isStudent && !hasPlaylistEditAccess) ||
      forceClone
    ) {
      // get the newly/previously cloned playlist
      const duplicatedPlaylist = yield call(
        curriculumSequencesApi.duplicatePlayList,
        {
          _id,
          title: `${title}`,
          forUseThis: true,
          forceClone,
        }
      )

      // if playlist was cloned previously
      if (duplicatedPlaylist.previouslyCloned) {
        // let the user decide to clone again (or) use the cloned
        yield put(setCustomTitleModalVisibleAction(false))
        yield put(setIsUsedModalVisibleAction(false))
        yield put(
          setPreviouslyUsedPlaylistClone({
            _id: duplicatedPlaylist._id,
            title: duplicatedPlaylist.title,
            grades: duplicatedPlaylist.grades,
            subjects: duplicatedPlaylist.subjects,
            customize: duplicatedPlaylist.customize,
            authors: duplicatedPlaylist.authors,
            derivedFrom: duplicatedPlaylist.derivedFrom,
          })
        )
        return
      }

      _id = duplicatedPlaylist._id

      yield put(receiveLastPlayListAction())
      yield put(receiveRecentPlayListsAction())
      yield put(updateCurriculumSequenceAction(duplicatedPlaylist))
    } else {
      yield call(userContextApi.setLastUsedPlayList, {
        _id,
        title,
        grades,
        subjects,
      })
      yield call(userContextApi.setRecentUsedPlayLists, {
        _id,
        title,
        grades,
        subjects,
      })

      // fetch last used playlist
      yield put(receiveLastPlayListAction())
      if (!isStudent) {
        if (!fromRemovePlaylist)
          yield call(curriculumSequencesApi.usePlaylist, _id)
        yield put(receiveRecentPlayListsAction())
      }
      yield put(getAllCurriculumSequencesAction([_id]))
    }
    yield put(setCustomTitleModalVisibleAction(false))
    yield put(setIsUsedModalVisibleAction(false))
    const location = yield select((state) => state.router.location.pathname)
    const urlHasUseThis = location.match(/use-this/g)
    let termId = yield select(getCurrentPlaylistTermId)
    if (!termId) {
      termId = yield select(getCurrentTerm)
    }
    if (isStudent && onChange) {
      yield put(
        push({
          pathname: `/home/playlist/${_id}`,
          state: { currentGroupId: groupId, fromUseThis },
        })
      )
      yield put(
        receiveCurrentPlaylistMetrics({ groupId, playlistId: _id, termId })
      )
    } else if (onChange && !urlHasUseThis) {
      yield put(
        push({
          pathname: `/author/playlists/${_id}`,
          state: { from: 'playlistLibrary', fromUseThis },
        })
      )
    } else {
      yield put(toggleManageContentActiveAction(false))
      yield put(setShowRightSideAction(true))
      yield put(setActiveRightPanelViewAction('summary'))
      yield put(
        push({
          pathname: `/author/playlists/playlist/${_id}/use-this`,
          state: { from: 'myPlaylist', fromUseThis },
        })
      )
      yield put(receiveCurrentPlaylistMetrics({ playlistId: _id, termId }))
    }
  } catch (error) {
    console.error(error)
    notification({ messageKey: 'commonErr' })
  } finally {
    const { notificationCallback = null } = payload
    yield put(setUseThisLoading(false))
    if (notificationCallback) {
      notificationCallback()
    }
  }
}

function* approveOrRejectSinglePlaylistSaga({ payload }) {
  try {
    if (
      payload.status === 'published' &&
      (!payload.collections ||
        (payload.collections && !payload.collections.length))
    ) {
      notification({ messageKey: 'publishPlaylistErrWithAssociated' })
      return
    }
    yield call(curriculumSequencesApi.updatePlaylistStatus, payload)
    yield put(approveOrRejectSinglePlaylistSuccessAction(payload))
    notification({ type: 'success', messageKey: 'playlistUpdated' })
  } catch (error) {
    console.error(error)
    notification({ type: 'error', messageKey: 'playlistUpdateFailed' })
  }
}

function* fetchClassListByDistrictId() {
  try {
    const data = yield call(groupApi.fetchMyGroups)
    const classList = data.map((x) => ({ classId: x._id, className: x.name }))
    yield put(
      fetchClassListSuccess({
        classList: classList.map((x) => ({
          id: x.classId,
          name: x.className,
          type: 'class',
        })),
      })
    )
  } catch (error) {
    notification({ msg: error?.data?.message })
    console.error(error)
  }
}

function* fetchStudentListByGroupId({ payload }) {
  try {
    const requestPayload = {
      districtId: payload.districtId,
      groupIds: [payload.classId],
    }
    const studentList = yield call(
      groupApi.fetchStudentsByGroupId,
      requestPayload
    )
    yield put(
      fetchStudentListSuccess({
        studentList: studentList.map((x) => ({
          id: x.studentId,
          name: `${x?.firstName || ''} ${x?.lastName || ''}`,
          type: 'student',
          classId: payload.classId,
        })),
      })
    )
  } catch (error) {
    notification({ msg: error?.data?.message })
    console.error(error)
  }
}

function* dropPlaylist({ payload }) {
  try {
    const result = yield call(groupApi.dropPlaylist, payload)
    return result
  } catch (error) {
    notification({ type: 'error', messageKey: 'dropPlaylistErr' })
    console.error(error)
  }
}

function* fetchPlaylistAccessList({ payload }) {
  try {
    if (payload) {
      const { districtId, playlistId } = payload
      const result = yield call(groupApi.fetchPlaylistAccess, playlistId)
      if (result) {
        yield put(updateDroppedAccessList(result))
        const classIds = [
          ...result?.classList?.map((x) => x?._id),
          ...result?.studentList?.map((x) => x?.groupId),
        ]
        if (classIds?.length) {
          yield all(
            classIds.map((classId) =>
              put(fetchStudentListAction({ districtId, classId }))
            )
          )
        }
      }
    }
  } catch (error) {
    notification({ type: 'error', messageKey: 'fetchClassErr' })
    console.error(error)
  }
}

function* fetchPlaylistMetricsSaga({ payload }) {
  try {
    // For curator without districtId
    const districtId = yield select(getUserOrgId)
    if (!districtId) {
      return
    }
    const { playlistId } = payload || {}
    if (!playlistId) {
      throw new Error(
        'Insufficient Data for fetching playlist metrics: PlaylistId is required'
      )
    }
    const result = yield call(
      curriculumSequencesApi.fetchPlaylistMetrics,
      payload
    )
    if (result) {
      yield put(updatePlaylistMetrics(result))
    }
  } catch (error) {
    notification({ type: 'error', messageKey: 'fetchPlaylistErr' })
    console.error(error)
  }
}

function* fetchPlaylistInsightsSaga({ payload }) {
  try {
    const { playlistId } = payload || {}
    if (!playlistId) {
      throw new Error(
        'Insufficient Data for fetching playlist insights: playlistId is required'
      )
    }
    const result = yield call(
      curriculumSequencesApi.fetchPlaylistInsights,
      payload
    )
    if (result) {
      yield put(onSuccessPlaylistInsightsAction(result))
    }
  } catch (error) {
    yield put(onErrorPlaylistInsightsAction(error))
    notification({ type: 'error', messageKey: 'fetchPlaylistInsightsErr' })
    console.error(error)
  }
}

function* fetchDifferentiationStudentListSaga({ payload }) {
  try {
    const { studentList = [] } = yield call(
      assignmentApi.getDifferentiationStudentList,
      payload
    )
    yield put(updateDifferentiationStudentListAction(studentList))
  } catch (err) {
    console.error(err)
    yield call(notification, { msg: err.response.data.message })
  }
}

function structureWorkData(workData, statusData, firstLoad = false) {
  const newState = produce(workData, (draft) => {
    if (firstLoad) {
      Object.keys(statusData).forEach((recommentdationKey) => {
        const testRecommendations = statusData[recommentdationKey]
          .filter((x) => x.derivedFrom === 'TESTS')
          .map(({ resourceId, resourceName, testStandards, resources }) => ({
            testId: resourceId,
            description: resourceName,
            testStandards,
            resources,
          }))

        const lowerCasekey = recommentdationKey.toLowerCase()
        draft[lowerCasekey] = draft[lowerCasekey] || []

        draft[lowerCasekey].push(...testRecommendations)
      })
    }

    Object.keys(draft).forEach((type) => {
      const currentStatusArray = statusData[type.toUpperCase()]
      if (!currentStatusArray) {
        draft[type].forEach((i) => {
          i.status = 'RECOMMENDED'
        })
      } else {
        draft[type].forEach((i) => {
          const currentStatus = currentStatusArray.find((s) => {
            let isStandardRecommended
            if (type.toUpperCase() === 'PRACTICE') {
              isStandardRecommended =
                s.derivedFrom === 'STANDARDS' &&
                s.standardIdentifiers.includes(i.standardIdentifier)
            } else {
              isStandardRecommended =
                s.derivedFrom === 'STANDARDS' &&
                s.standardIdentifiers.includes(i.standardIdentifier) &&
                (!s.skillIdentifiers ||
                  s.skillIdentifiers.includes(i.skillIdentifier))
            }
            const isTestRecommended =
              s.derivedFrom === 'TESTS' && s.resourceId === i.testId

            return isStandardRecommended || isTestRecommended
          })

          if (currentStatus) {
            const { masteryRange, studentTestActivities, users } = currentStatus
            i.status = 'ADDED'
            i.masteryRange = [masteryRange.min, masteryRange.max]
            i.averageMastery =
              (sumBy(studentTestActivities, 'score') /
                sumBy(studentTestActivities, 'maxScore')) *
              100
            i.notStartedCount = users.length - studentTestActivities.length
          } else {
            i.status = 'RECOMMENDED'
            i.masteryRange = [
              currentStatusArray[0].masteryRange.min,
              currentStatusArray[0].masteryRange.max,
            ]
          }
        })
      }
    })
  })
  return newState
}

function* fetchDifferentiationWorkSaga({ payload }) {
  try {
    yield put(updateFetchWorkLoadingStateAction(true))
    const workData = yield call(
      recommendationsApi.getDifferentiationWork,
      payload.testId
    )
    const statusData = yield call(recommendationsApi.getRecommendationsStatus, {
      assignmentId: payload.assignmentId,
      groupId: payload.groupId,
    })
    yield put(updateWorkStatusDataAction(statusData))
    const structuredData = structureWorkData(workData, statusData, true)
    yield put(setDifferentiationWorkAction(structuredData))
    yield put(updateFetchWorkLoadingStateAction(false))
  } catch (err) {
    console.error(err)
    yield put(setDifferentiationWorkAction({}))
    yield put(updateFetchWorkLoadingStateAction(false))
    yield call(notification, { msg: err.response.data.message })
  }
}

function* addRecommendationsSaga({ payload: _payload }) {
  let { recommendations: payload } = _payload
  const { toggleAssignModal } = _payload
  try {
    yield put(setRecommendationsToAssignAction({ isAssigning: true }))
    let response = null
    if (Array.isArray(payload)) {
      for (const payloadItem of payload) {
        response = yield call(
          recommendationsApi.acceptRecommendations,
          payloadItem
        )
      }
    } else {
      response = yield call(recommendationsApi.acceptRecommendations, payload)
    }

    payload = Array.isArray(payload) ? payload[0] : payload
    yield put(updateFetchWorkLoadingStateAction(true))
    const statusData = yield call(recommendationsApi.getRecommendationsStatus, {
      assignmentId: payload.assignmentId,
      groupId: payload.groupId,
    })
    yield put(
      setRecommendationsToAssignAction({
        isAssigning: false,
        isRecommendationAssignView: false,
        recommendations: [],
      })
    )
    yield put(updateWorkStatusDataAction(statusData))
    const workData = yield select(getDifferentiationWorkSelector)
    const structuredData = structureWorkData(workData, statusData)
    yield put(setDifferentiationWorkAction(structuredData))
    yield call(notification, { type: 'success', msg: response.message })
    yield put(updateFetchWorkLoadingStateAction(false))
  } catch (err) {
    console.error(err)
    yield put(setRecommendationsToAssignAction({ isAssigning: false }))
    if (
      err?.response?.data?.statusCode === 404 &&
      err?.response?.data?.error === 'Item Not Found'
    ) {
      toggleAssignModal(false)
      Modal.info({
        title: `Test can’t be assigned as there are no items found with selected standards.`,
        okText: 'Close',
        centered: true,
        width: 500,
        okButtonProps: {
          style: { background: themeColor, outline: 'none' },
        },
        onOk: Modal.destroyAll,
      })
    } else {
      yield call(notification, { msg: err.response.data.message })
    }
  }
}

const moveContentInPlaylist = (state, { payload }) => {
  const {
    toModuleIndex,
    toContentIndex,
    fromModuleIndex,
    fromContentIndex,
  } = payload
  let newPlaylist
  // If no valid destination module.
  if (
    (toModuleIndex !== 0 && !toModuleIndex) ||
    !state.destinationCurriculumSequence.modules?.[toModuleIndex]
  ) {
    notification({ messageKey: 'invalidModuleSelect' })
    return state
  }

  // If valid fromModuleIndex but module is not present in playlist
  if (
    fromModuleIndex >= 0 &&
    !state.destinationCurriculumSequence.modules?.[fromModuleIndex]
  ) {
    return newPlaylist
  }

  const newItem =
    state.destinationCurriculumSequence.modules[fromModuleIndex].data[
      fromContentIndex
    ]
  const isItemExistingInModule = state.destinationCurriculumSequence.modules[
    toModuleIndex
  ]?.data?.some((x) => x?.contentId === newItem?.contentId)

  if (isItemExistingInModule) {
    notification({
      msg: `Dropped ${
        newItem.contentType === 'test' ? 'Test' : 'Resource'
      } already exists in this module`,
    })

    return state
  }

  newPlaylist = produce(state.destinationCurriculumSequence, (draft) => {
    if (!toContentIndex) {
      // Move item to different module
      draft.modules[toModuleIndex].data.push(newItem)
    } else {
      // Move item in same module
      draft.modules[toModuleIndex].data.splice(toContentIndex, 0, newItem)
    }

    draft.modules[fromModuleIndex].data.splice(fromContentIndex, 1)
  })

  return {
    ...state,
    destinationCurriculumSequence: {
      ...state.destinationCurriculumSequence,
      modules: newPlaylist.modules,
    },
  }
}

/**
 * @param {State} state
 * @param {Object<String, String>} args
 * @param {import('./components/CurriculumSequence').CurriculumSequenceType} [args.payload]
 */

function* moveContentToPlaylistSaga(payload) {
  try {
    const state = yield select(getCurriculumSequenceState)
    const newState = moveContentInPlaylist(state, payload)
    yield put(
      putCurriculumSequenceAction({
        id: newState.destinationCurriculumSequence._id,
        curriculumSequence: newState.destinationCurriculumSequence,
      })
    )
  } catch (e) {
    notification({ messageKey: 'movingTestErr' })
  }
}

/**
 *
 * @param  {{payload:{id:string}}}   param0
 */
function* deletePlaylistSaga({ payload: id }) {
  try {
    // this returns promise. so don't call on this
    message.loading('', 0)
    yield call(curriculumSequencesApi.delelePlaylist, id)
    yield call(Storage.addPlaylistIdToDeleted, id)
    message.destroy()
    notification({ type: 'success', messageKey: 'playlistDeleteSuccess' })
    yield put(push('/author/playlists'))
  } catch (e) {
    message.destroy()
    console.error('delete playlist failed -e ', e)
    notification({ messageKey: 'playlistDeleteFailed' })
    Sentry.captureException(e)
  }
}

function* removeFromUseSaga({ payload: id }) {
  try {
    // this returns promise. so don't call on this
    message.loading('', 0)
    yield call(curriculumSequencesApi.delelePlaylistFromUse, id)
    const lastPlaylistResult = yield call(receiveLastPlayListSaga)
    yield put(receiveRecentPlayListsAction())
    message.destroy()
    notification({
      type: 'success',
      messageKey: 'playlistRemoveFromUseSuccess',
    })
    if (lastPlaylistResult?.value) {
      yield put(
        useThisPlayListAction({
          ...lastPlaylistResult.value,
          onChange: true,
          isStudent: false,
          fromRemovePlaylist: true,
        })
      )
    } else {
      yield put(push('/author/playlists'))
    }
  } catch (e) {
    console.error('delete playlist failed -e ', e)
    notification({ messageKey: 'playlistRemoveFromUseFailed' })
    Sentry.captureException(e)
  }
}

function* unassignAssignmentsfromPlaylistSaga({ payload }) {
  try {
    const { playlistId, moduleId, unsetAssignmentCallback, ...data } = payload
    const { deletedIds = [] } = yield call(testsApi.deleteAssignments, data)
    if (deletedIds.length) {
      notification({
        type: 'success',
        msg: 'Assignment(s) successfully unassigned',
      })
      yield put(
        unassignAssignmentsSuccessAction({
          moduleId,
          testId: payload.testId,
          deletedIds,
        })
      )
      yield put(toggleAssignmentsAction({ testId: payload.testId, playlistId }))
      return
    }
    throw new Error('Failed to unassign')
  } catch (err) {
    notification({ msg: 'Failed to unassign Assignment(s)' })
    console.error(err)
    captureSentryException(err)
  }
}

export function* watcherSaga() {
  yield all([
    yield takeLatest(FETCH_CURRICULUM_SEQUENCES, fetchItemsFromApi),
    yield takeLatest(SEARCH_CURRICULUM_SEQUENCES, postSearchCurriculumSequence),
    yield takeLatest(SEARCH_GUIDES, searchGuides),
    yield takeLatest(SEARCH_CONTENT_CURRICULUMS, searchContent),
    yield takeLatest(CHANGE_GUIDE, changeGuide),
    yield takeLatest(SET_PUBLISHER, setPublisher),
    yield takeLatest(SET_GUIDE, setGuide),
    yield takeLatest(SET_CONTENT_CURRICULUM, setContentCurriculum),
    yield takeLatest(SAVE_GUIDE_ALIGNMENT, saveGuideAlignment),
    yield takeLatest(CREATE_ASSIGNMENT_NOW, createAssignmentNow),
    yield takeLatest(SAVE_CURRICULUM_SEQUENCE, saveCurriculumSequence),
    yield takeLatest(SET_DATA_FOR_ASSIGN_INIT, setDataForAssign),
    yield takeLatest(
      SET_SELECTED_ITEMS_FOR_ASSIGN_INIT,
      setSelectedItemsForAssign
    ),
    yield takeLatest(ADD_NEW_UNIT_INIT, addNewUnit),
    yield takeLatest(REMOVE_UNIT_INIT, removeUnit),
    yield takeLatest(FETCH_ASSIGNED_REQUEST, fetchAssigned),
    yield takeLatest(
      ADD_CONTENT_TO_CURRICULUM_RESULT,
      moveContentToPlaylistSaga
    ),
    yield takeLatest(USE_THIS_PLAYLIST, useThisPlayListSaga),
    yield takeLatest(CLONE_THIS_PLAYLIST, cloneThisPlayListSaga),
    yield takeLatest(
      APPROVE_OR_REJECT_SINGLE_PLAYLIST_REQUEST,
      approveOrRejectSinglePlaylistSaga
    ),
    yield takeLatest(
      FETCH_CLASS_LIST_BY_DISTRICT_ID,
      fetchClassListByDistrictId
    ),
    yield takeLatest(FETCH_STUDENT_LIST_BY_GROUP_ID, fetchStudentListByGroupId),
    yield takeLatest(DROP_PLAYLIST_ACTION, dropPlaylist),
    yield takeLatest(FETCH_PLAYLIST_ACCESS_LIST, fetchPlaylistAccessList),
    yield takeLatest(FETCH_PLAYLIST_METRICS, fetchPlaylistMetricsSaga),
    yield takeLatest(FETCH_PLAYLIST_INSIGHTS, fetchPlaylistInsightsSaga),
    yield takeLatest(
      FETCH_DIFFERENTIATION_STUDENT_LIST,
      fetchDifferentiationStudentListSaga
    ),
    yield takeLatest(FETCH_DIFFERENTIATION_WORK, fetchDifferentiationWorkSaga),
    yield takeLatest(ADD_RECOMMENDATIONS_ACTIONS, addRecommendationsSaga),
    yield takeEvery(
      UPDATE_DESTINATION_CURRICULUM_SEQUENCE_REQUEST,
      updateDestinationCurriculumSequencesaga
    ),
    yield takeLatest(
      GET_SIGNED_REQUEST_FOR_RESOURCE_REQUEST,
      getSignedRequestSaga
    ),
    yield takeLatest(DUPLICATE_MANAGE_CONTENT, duplicateManageContentSaga),
    yield takeLatest(
      PUBLISH_CUSTOMIZED_DRAFT_PLAYLIST,
      publishDraftCustomizedPlaylist
    ),
    yield takeLatest(DELETE_PLAYLIST_REQUEST, deletePlaylistSaga),
    yield takeLatest(REMOVE_PLAYLIST_FROM_USE, removeFromUseSaga),
    yield takeLatest(REVERT_CUSTOMIZE_TO_DRAFT, resetToOriginalPlaylist),
    yield takeLatest(
      CHECK_PREVIOUSLY_CUSTOMIZED,
      checkForPreviouslyCustomizedPlaylist
    ),
    yield takeLatest(
      UNASSIGN_ASSIGNMENTS_FROM_PLAYLIST,
      unassignAssignmentsfromPlaylistSaga
    ),
    yield takeLatest(DUPLICATE_PLAYLIST_REQUEST, duplicatePlayListSaga),
    yield takeLatest(EDIT_PLAYLIST_TEST, editPlaylistTestSaga),
  ])

  const currSequenceUpdateQueue = yield actionChannel(
    PUT_CURRICULUM_SEQUENCE,
    buffers.sliding(5)
  )
  while (true) {
    const { payload } = yield take(currSequenceUpdateQueue)

    const { version } = yield select(
      (state) => state.curriculumSequence.destinationCurriculumSequence
    )
    const customizeInDraft = yield select(
      (state) => state.curriculumSequence.customizeInDraft
    )
    /**
     *  1. dont allow any request to be made while in customizeDraft due to only view permission on playlist
     *  2. version from store will be greater than payload version only if previous
     *  api call was resolved, else execute next action from channel
     */
    if (customizeInDraft) {
      yield put(updateCurriculumSequenceAction(payload.curriculumSequence))
    } else if (version <= payload.curriculumSequence?.version) {
      yield call(putCurriculumSequence, { payload })
    }
  }
}

/**
 * @typedef {object} Class
 * @property {String=} _id
 * @property {Number} status
 * @property {Number} totalNumber
 * @property {number} submittedNumber
 */

/**
 * @typedef {object} AssignData
 * @property {Date} startDate
 * @property {Date} endDate
 * @property {String} openPolicy
 * @property {String} closePolicy
 * @property {Class[]} class
 * @property {string} testId
 */

/**
 * @typedef {object} State
 * @property {string[]} allCurriculumSequences
 * @property {Object<string, import('./components/CurriculumSequence').CurriculumSequenceType>} byId
 * @property {import('./components/CurriculumSequence').CurriculumSearchResult} guides
 * @property {import('./components/CurriculumSequence').CurriculumSearchResult} contentCurriculums
 * @property {string} selectedGuide
 * @property {string} selectedContent
 * @property {import('./components/CurriculumSequence').CurriculumSequenceType}
 * destinationCurriculumSequence
 * @property {string[]} checkedUnitItems
 * @property {boolean} isContentExpanded
 * @property {any[]} selectedItemsForAssign
 * @property {AssignData} dataForAssign
 */

/**
 * @typedef {object} NewUnit
 * @property {string} id
 * @property {string} name
 * @property {any[]} data
 */

const getDefaultAssignData = () => ({
  startDate: moment().valueOf(),
  endDate: moment().valueOf(),
  openPolicy: 'Automatically on Start Date',
  closePolicy: 'Automatically on Due Date',
  class: [],
  students: [],
  testId: '',
})

// Reducers
const initialState = {
  activeRightPanel: 'summary',
  allCurriculumSequences: [],
  destinationDirty: false,
  showUseThisNotification: false,
  originalData: null,
  /**
   * @type {Object.<string, import('./components/CurriculumSequence').CurriculumSequenceType>}}
   */
  byId: {},

  /**
   * search result of type = "guide"
   * @type {{id: string, titile: string}[]}
   */
  guides: [],

  /**
   * search result of type = "content"
   * @type {{id: string, title: string}[]}
   */
  contentCurriculums: [],

  /** Selected guide that will appear on the left side */
  selectedGuide: '',

  /** Selected content that will appear on the right side */
  selectedContent: '',

  /** ids of guides that are checkmarked */
  checkedUnitItems: [],

  isContentExpanded: false,

  selectedItemsForAssign: [],

  loading: false,

  destinationCurriculumSequence: {},

  assigned: [],

  dataForAssign: getDefaultAssignData(),

  dropPlaylistSource: {
    searchSource: {
      classList: [],
      studentList: [],
    },
    droppedAccess: {
      classList: [],
      studentList: [],
    },
  },
  playlistMetrics: [],
  classListFetching: false,
  studentListFetching: false,
  playlistInsights: {},
  loadingInsights: true,
  differentiationStudentList: [],
  differentiationWork: {},
  differentiationSelectedData: {},
  differentiationResources: {},
  isFetchingDifferentiationWork: false,
  workStatusData: {},

  // Playlist Test Details State
  playlistTestDetailsModal: {
    isVisible: false,
    currentTestId: null,
  },
  isVideoResourcePreviewModal: false,
  showSumary: true,
  showRightPanel: false,
  customizeInDraft: false,
  currentAssignmentIds: [],

  isConfirmedCustomization: false,
  recommendationsToAssign: {
    isRecommendationAssignView: false,
    isAssigning: false,
    recommendations: [],
  },
  isUsedModalVisible: false,
  customTitleModalVisible: false,
  previouslyUsedPlaylistClone: null,
  isUseThisLoading: false,
}

/**
 * @param {State} state
 * @param {any} param1
 */
const setCurriculumSequencesReducer = (state, { payload }) => {
  // Go trough all sequences and if type is guide, replace current guide
  const idForRemoval = Object.keys(state.byId)
    .map((key) => state.byId[key])
    .filter((item) => item.type === 'guide')
    .map((item) => item._id)[0]

  const newGuideId = Object.keys(payload.curriculumSequenceListObject)
    .map((key) => payload.curriculumSequenceListObject[key])
    .filter((item) => item.type === 'guide')
    .map((item) => item._id)[0]

  const contentIds = Object.keys(payload.curriculumSequenceListObject)
    .map((key) => payload.curriculumSequenceListObject[key])
    .filter((item) => item.type === 'content')
    .map((item) => item._id)
  // Set to latest content Id
  let latestContentCurriculumId
  if (contentIds.length > 0 && !state.selectedContent) {
    latestContentCurriculumId = contentIds[contentIds.length - 1]
  } else if (state.selectedContent) {
    latestContentCurriculumId = state.selectedContent
  } else {
    latestContentCurriculumId = ''
  }

  if (newGuideId && idForRemoval) {
    delete state.byId[idForRemoval]
    state.byId[newGuideId] = payload.allCurriculumSequences[newGuideId]
    state.allCurriculumSequences.splice(
      state.allCurriculumSequences.indexOf(idForRemoval),
      1
    )
  }

  state.allCurriculumSequences = [
    ...state.allCurriculumSequences,
    ...payload.allCurriculumSequences,
  ]
  state.byId = { ...state.byId, ...payload.curriculumSequenceListObject }
  state.destinationCurriculumSequence = { ...state.byId[newGuideId] }
  state.selectedGuide = newGuideId
  state.selectedContent = latestContentCurriculumId
  state.checkedUnitItems = []
  state.loading = false
}

/**
 * @param {State} state
 * @param {Object} param2
 * @param {import('./components/CurriculumSequence').CurriculumSequenceType} [param2.payload]
 */
const updateCurriculumSequenceReducer = (state, { payload }) => {
  const curriculumSequence = payload
  const id =
    (curriculumSequence?.[0] && curriculumSequence[0]._id) ||
    curriculumSequence._id

  state.byId[id] = curriculumSequence?.[0] || curriculumSequence
  // if (curriculumSequence.type === "guide") {
  state.destinationCurriculumSequence =
    curriculumSequence[0] || curriculumSequence
  state.originalData = state.destinationCurriculumSequence
  state.destinationDirty = false
  state.loading = false
  // }
}

/**
 * @param {State} state
 * @param {Object} param2
 * @param {import('./components/CurriculumSequence').ModuleData} [param2.payload]
 */
const updateAssignmentReducer = (state, { payload }) => {
  const assignment = payload
  const updatedModules = state.destinationCurriculumSequence.modules.map(
    (module) => {
      module.data = module.data.map((moduleDataItem) => {
        if (moduleDataItem.testId === payload.testId) {
          return assignment
        }
        return moduleDataItem
      })
      return module
    }
  )

  state.destinationCurriculumSequence.modules = updatedModules
}

const searchGuidesReducer = (state, { payload }) => {
  state.guides = payload

  // When publisher is changed and new guides are available - set them to first one
  if (
    payload &&
    payload[0] &&
    payload[0]._id &&
    payload.map((guides) => guides._id).indexOf(state.selectedGuide) === -1
  ) {
    const defaultSelectedGuide = payload[0]._id
    state.selectedGuide = defaultSelectedGuide
  }
}

const setPublisherReducer = (state, { payload }) => {
  state.selectedPublisher = payload
}

const setGuideReducer = (state, { payload }) => {
  state.selectedGuide = payload
}

const setContentCurriculumReducer = (state, { payload }) => {
  state.selectedContent = payload
}

const searchContentReducer = (state, { payload }) => {
  state.contentCurriculums = payload
}

/**
 * @param {State} state
 * @param {any} param1
 */
const toggleCheckedUnitItemReducer = (state, { payload }) => {
  const currentlyCheckedItemId = payload
  const existingItemIndex = state.checkedUnitItems.indexOf(
    currentlyCheckedItemId
  )
  if (existingItemIndex === -1) {
    state.checkedUnitItems.push(currentlyCheckedItemId)
  } else {
    state.checkedUnitItems.splice(existingItemIndex, 1)
  }
}

const toggleAddContentReducer = (state) => {
  state.isContentExpanded = !state.isContentExpanded
}

/**
 * @param {State} state
 * @param {any} param1
 */
const createAssignmentReducer = (state, { payload }) => {
  const assignmentApiResponse = payload
  const curriculumSequenceState = { ...state }
  const testIdsFromResponse = assignmentApiResponse.map((item) => item.testId)
  const destinationCurriculumSequence = {
    ...state.destinationCurriculumSequence,
  }

  let updatedCurriculumSequence
  curriculumSequenceState.allCurriculumSequences.forEach((curriculumId) => {
    updatedCurriculumSequence = curriculumSequenceState.byId[curriculumId]
    if (updatedCurriculumSequence.type !== 'guide') {
      return
    }

    if (curriculumSequenceState.byId) {
      updatedCurriculumSequence.modules = [
        ...curriculumSequenceState.byId[curriculumId].modules.map(
          (moduleItem) => {
            const updatedModule = { ...moduleItem }
            const updatedModuleData = moduleItem.data.map((dataItem) => {
              const updatedDataItem = { ...dataItem }
              if (testIdsFromResponse.indexOf(dataItem.testId) !== -1) {
                updatedDataItem.assigned = true
              }
              return updatedDataItem
            })

            updatedModule.data = updatedModuleData
            return updatedModule
          }
        ),
      ]
    }
  })

  if (!updatedCurriculumSequence) {
    return { ...state }
  }

  state.selectedItemsForAssign = []
  state.destinationCurriculumSequence = {
    ...destinationCurriculumSequence,
    modules: updatedCurriculumSequence.modules,
  }
}

/**
 * @param {State} state
 * @param {Object<String, String>} args
 * @param {String|null} [args.payload]
 * we pass null when we deliberatly cancel the selected item without any user feedback
 * otherwise we pass *testId*
 */
const setSelectedItemsForAssignReducer = (state, { payload }) => {
  // we pass null when we deliberatly cancel the selected item without any user feedback
  if (!payload && payload !== null) {
    notification({ type: 'error', messageKey: 'noTestId' })
    state.selectedItemsForAssign.pop()
  } else if (payload === null) {
    state.selectedItemsForAssign = []
    state.dataForAssign = getDefaultAssignData()
  } else if (typeof payload === 'string') {
    state.selectedItemsForAssign.push(payload)
  } else if (Array.isArray(payload)) {
    state.selectedItemsForAssign = payload
  }
}

/**
 * @param {State} state
 * @param {Object<String, String>} args
 * @param {Object} [args.payload]
 */
const setRecommendationsToAssignReducer = (state, { payload }) => {
  if (!payload) {
    return state
  }

  const recommendationsToAssign = { ...state.recommendationsToAssign }

  return {
    ...state,
    recommendationsToAssign: {
      ...recommendationsToAssign,
      ...payload,
    },
  }
}

/**
 * @param {State} state
 * @param {any} param1
 */
const setDataForAssignReducer = (state, { payload }) => {
  if (!payload) {
    state.dataForAssign = getDefaultAssignData()
    return
  }
  state.dataForAssign = payload
}

/**
 * @param {State} state
 * @param {Object<String, Object>} param2
 * @param {Object<String, Object>} [param2.payload]
 * @param {String} [param2.payload.moduleId]
 * @param {String} [param2.payload.itemId]
 */
const removeItemFromUnitReducer = (state, { payload }) => {
  const { moduleId, itemId } = payload
  const destinationCurriculumSequence = cloneDeep(
    state.destinationCurriculumSequence
  )
  const modules = [...destinationCurriculumSequence.modules]

  const moduleIndex = destinationCurriculumSequence.modules
    .map((m) => m.id)
    .indexOf(moduleId)

  const itemIndex = destinationCurriculumSequence.modules[moduleIndex].data
    .map((d) => d.id)
    .indexOf(itemId)

  modules[moduleIndex].data.splice(itemIndex, 1)

  destinationCurriculumSequence.modules = modules

  return {
    ...state,
    destinationCurriculumSequence: {
      ...destinationCurriculumSequence,
      modules,
    },
  }
}

/**
 * @param {State} state
 * @param {Object<String, Object>} param2
 * @param {Object<String, Object>} [param2.payload]
 * @param {String} [param2.payload.afterUnitId]
 * @param {import('./components/CurriculumSequence').Module} [param2.payload.newUnit]
 */
const addNewUnitReducer = (state, { payload }) => {
  const modules = payload
  const destinationCurriculumSequence = {
    ...state.destinationCurriculumSequence,
  }

  return {
    ...state,
    destinationCurriculumSequence: {
      ...destinationCurriculumSequence,
      modules,
    },
  }
}

/**
 * @param {State} state
 * @param {Object<String, Object>} param2
 * @param {Object<String, Object>} [param2.payload]
 * @param {String} [param2.payload.afterUnitId]
 * @param {import('./components/CurriculumSequence').Module} [param2.payload.newUnit]
 */
const removeUnitReducer = (state, { payload }) => {
  const modules = payload
  const destinationCurriculumSequence = {
    ...state.destinationCurriculumSequence,
  }

  return {
    ...state,
    destinationCurriculumSequence: {
      ...destinationCurriculumSequence,
      modules,
    },
  }
}

/**
 * @param {State} state
 * @param {Object<String, Object>} param2
 *
 */
const loadAssignedReducer = (state, { payload }) => ({
  ...state,
  assigned: payload,
})

function approveOrRejectSinglePlaylistReducer(state, { payload }) {
  return {
    ...state,
    destinationCurriculumSequence: {
      ...state.destinationCurriculumSequence,
      status: payload.status,
      collections: payload.collections
        ? payload.collections
        : state.destinationCurriculumSequence.collections,
    },
  }
}

function setPlaylistDataReducer(state, { payload }) {
  return {
    ...state,
    destinationCurriculumSequence: {
      ...state.destinationCurriculumSequence,
      ...payload,
    },
  }
}

function updateClassList(state, { payload }) {
  return {
    ...state,
    dropPlaylistSource: {
      ...state.dropPlaylistSource,
      searchSource: {
        ...state.dropPlaylistSource.searchSource,
        classList: payload.classList,
      },
    },
    classListFetching: false,
  }
}

function updateStudentList(state, { payload }) {
  return {
    ...state,
    dropPlaylistSource: {
      ...state.dropPlaylistSource,
      searchSource: {
        ...state.dropPlaylistSource.searchSource,
        studentList: uniqBy(
          state?.dropPlaylistSource?.searchSource?.studentList.concat(
            payload.studentList
          ),
          'id'
        ),
      },
    },
    studentListFetching: false,
  }
}

function updatePlaylistDroppedAccessList(state, { payload }) {
  return {
    ...state,
    dropPlaylistSource: {
      ...state.dropPlaylistSource,
      droppedAccess: {
        classList: payload.classList,
        studentList: payload.studentList,
      },
    },
  }
}

function updatePlaylistMetricsList(state, { payload }) {
  return {
    ...state,
    playlistMetrics: payload,
  }
}

function onSuccessPlaylistInsights(state, { payload }) {
  return {
    ...state,
    playlistInsights: payload,
    loadingInsights: false,
  }
}

function onErrorPlaylistInsights(state) {
  return {
    ...state,
    playlistInsights: {},
    loadingInsights: true,
  }
}

const createNewModuleState = (
  title,
  description,
  moduleId,
  moduleGroupName
) => ({
  title,
  description,
  moduleId,
  moduleGroupName,
  data: [],
})

function toggleManageModuleHandler(state, { payload }) {
  return { ...state, isManageModulesVisible: payload }
}

function updateDifferentiationStudentList(state, { payload }) {
  state.differentiationStudentList = payload
}

export default createReducer(initialState, {
  [UPDATE_CURRICULUM_SEQUENCE_LIST]: setCurriculumSequencesReducer,
  [UPDATE_CURRICULUM_SEQUENCE]: updateCurriculumSequenceReducer,
  [SEARCH_GUIDES_RESULT]: searchGuidesReducer,
  [SEARCH_CONTENT_CURRICULUMS_RESULT]: searchContentReducer,
  [SET_PUBLISHER]: setPublisherReducer,
  [SET_GUIDE]: setGuideReducer,
  [SET_CONTENT_CURRICULUM]: setContentCurriculumReducer,
  [TOGGLE_CHECKED_UNIT_ITEM]: toggleCheckedUnitItemReducer,
  [TOGGLE_ADD_CONTENT]: toggleAddContentReducer,
  [CREATE_ASSIGNMENT_OK]: createAssignmentReducer,
  [SET_SELECTED_ITEMS_FOR_ASSIGN]: setSelectedItemsForAssignReducer,
  [SET_RECOMMENDATIONS_TO_ASSIGN]: setRecommendationsToAssignReducer,
  [SET_DATA_FOR_ASSIGN]: setDataForAssignReducer,
  [REMOVE_ITEM_FROM_UNIT]: removeItemFromUnitReducer,
  [ADD_NEW_UNIT]: addNewUnitReducer,
  [REMOVE_UNIT]: removeUnitReducer,
  [UPDATE_ASSIGNMENT]: updateAssignmentReducer,
  [FETCH_ASSIGNED_RESULT]: loadAssignedReducer,
  [APPROVE_OR_REJECT_SINGLE_PLAYLIST_SUCCESS]: approveOrRejectSinglePlaylistReducer,
  [SET_PLAYLIST_DATA]: setPlaylistDataReducer,
  [FETCH_CLASS_LIST_BY_DISTRICT_ID]: (state) => ({
    ...state,
    classListFetching: true,
  }),
  [FETCH_CLASS_LIST_SUCCESS]: updateClassList,
  [FETCH_STUDENT_LIST_BY_GROUP_ID]: (state) => ({
    ...state,
    studentListFetching: true,
  }),
  [FETCH_STUDENT_LIST_SUCCESS]: updateStudentList,
  [UPDATE_DROPPED_ACCESS_LIST]: updatePlaylistDroppedAccessList,
  [UPDATE_PLAYLIST_METRICS]: updatePlaylistMetricsList,
  [FETCH_PLAYLIST_INSIGHTS_SUCCESS]: onSuccessPlaylistInsights,
  [FETCH_PLAYLIST_INSIGHTS_ERROR]: onErrorPlaylistInsights,
  [TOGGLE_MANAGE_MODULE]: toggleManageModuleHandler,
  [ADD_MODULE]: (state, { payload }) => {
    const newModule = createNewModuleState(
      payload?.title || payload?.moduleName,
      payload?.description,
      payload.moduleId,
      payload.moduleGroupName
    )
    if (!state.destinationCurriculumSequence.modules) {
      state.destinationCurriculumSequence.modules = []
    }
    if (payload?.afterModuleIndex !== undefined) {
      state.destinationCurriculumSequence?.modules?.splice(
        payload.afterModuleIndex,
        0,
        newModule
      )
    } else {
      state.destinationCurriculumSequence?.modules?.push(newModule)
    }
    return state
  },
  [UPDATE_MODULE]: (state, { payload }) => {
    const { id, title, description, moduleId, moduleGroupName } = payload
    if (payload !== undefined) {
      state.destinationCurriculumSequence.modules[id].title = title
      state.destinationCurriculumSequence.modules[id].description = description
      state.destinationCurriculumSequence.modules[id].moduleId = moduleId
      state.destinationCurriculumSequence.modules[
        id
      ].moduleGroupName = moduleGroupName
    }
    return state
  },
  [DELETE_MODULE]: (state, { payload }) => {
    if (payload !== undefined) {
      state.destinationCurriculumSequence?.modules?.splice(payload, 1)
    }
    return state
  },
  [ORDER_MODULES]: (state, { payload }) => {
    const { oldIndex, newIndex } = payload
    const obj = state.destinationCurriculumSequence?.modules?.splice(
      oldIndex,
      1
    )
    state.destinationCurriculumSequence?.modules?.splice(newIndex, 0, obj[0])
    return state
  },
  [UPDATE_DIFFERENTIATION_STUDENT_LIST]: updateDifferentiationStudentList,
  [SET_DIFFERENTIATION_WORK]: (state, { payload }) => {
    state.differentiationWork = payload
  },
  [SET_DIFFERENTIATION_SELECTED_DATA]: (state, { payload }) => {
    state.differentiationSelectedData = {
      ...state.differentiationSelectedData,
      ...payload,
    }
  },
  [ADD_TYPE_BASED_DIFFERENTIATION_RESOURCES]: (state, { payload }) => {
    const {
      type,
      contentId,
      contentTitle,
      contentType,
      contentSubType,
      contentUrl,
    } = payload
    const alreadyPresent = (state.differentiationResources?.[type] || []).find(
      (x) => x.contentId === contentId
    )
    if (!alreadyPresent) {
      state.differentiationResources[type] = [
        ...(state.differentiationResources[type] || []),
        {
          type,
          contentId,
          contentVersionId: contentId,
          description: contentTitle,
          contentTitle,
          contentType,
          contentSubType,
          contentUrl,
        },
      ]
    }
  },
  [REMOVE_TYPE_BASED_DIFFERENTIATION_RESOURCES]: (state, { payload }) => {
    const { type, contentId } = payload
    state.differentiationResources[type] =
      state.differentiationResources?.[type]?.filter(
        (x) => x.contentId !== contentId
      ) || []
  },
  [CLEAR_ALL_DIFFERENTIATION_RESOURCES]: (state) => {
    state.differentiationResources = {}
  },
  [ADD_TEST_TO_DIFFERENTIATION]: (state, { payload }) => {
    const { type, testId, masteryRange, title, testStandards } = payload
    const alreadyPresent = Object.keys(state.differentiationWork)
      .flatMap((x) => state.differentiationWork?.[x] || [])
      .find((x) => x?.testId === testId)
    if (!alreadyPresent) {
      state.differentiationWork[type].push({
        testId,
        description: title,
        status: 'RECOMMENDED',
        masteryRange,
        testStandards,
      })
    }
  },
  [REMOVE_RESOURCE_FROM_DIFFERENTIATION]: (state, { payload }) => {
    const { type, testId } = payload
    state.differentiationWork[type] = state.differentiationWork[type]?.filter(
      (x) => x.testId !== testId
    )
  },
  [ADD_RESOURCE_TO_DIFFERENTIATION]: (state, { payload }) => {
    const {
      type,
      contentId,
      masteryRange,
      contentTitle,
      contentType,
      contentUrl,
    } = payload
    const alreadyPresent = Object.keys(state.differentiationWork)
      .flatMap((x) => state.differentiationWork?.[x] || [])
      .find((x) => x.contentId === contentId)
    if (!alreadyPresent) {
      state.differentiationWork[type].push({
        contentId,
        description: contentTitle,
        status: 'RECOMMENDED',
        masteryRange,
        contentType,
        contentUrl,
      })
    }
  },
  [UPDATE_WORK_STATUS_DATA]: (state, { payload }) => {
    state.workStatusData = payload
  },
  [UPDATE_FETCH_DIFFERENTIATION_WORK_LOADING_STATE]: (state, { payload }) => {
    state.isFetchingDifferentiationWork = payload
  },
  [PLAYLIST_REMOVE_SUBRESOURCE]: (state, { payload }) => {
    const { moduleIndex, contentId, itemIndex, contentSubType } = payload
    if (
      state.destinationCurriculumSequence.modules[moduleIndex].data[itemIndex]
        .resources
    ) {
      state.destinationCurriculumSequence.modules[moduleIndex].data[
        itemIndex
      ].resources = state.destinationCurriculumSequence.modules[
        moduleIndex
      ].data[itemIndex].resources.filter(
        (x) =>
          !(x.contentId === contentId && x.contentSubType === contentSubType)
      )
    }
  },
  [PLAYLIST_ADD_SUBRESOURCE]: (state, { payload }) => {
    const { moduleIndex, item, itemIndex } = payload
    const {
      id: contentId,
      contentType,
      type,
      fromPlaylistTestsBox,
      standardIdentifiers,
      status,
      contentSubType,
      hasStandardsOnCreation,
      standards = [],
      ...itemObj
    } = item
    if (
      !state.destinationCurriculumSequence.modules[moduleIndex].data[itemIndex]
        .resources
    ) {
      state.destinationCurriculumSequence.modules[moduleIndex].data[
        itemIndex
      ].resources = []
    }
    const resources =
      state.destinationCurriculumSequence.modules[moduleIndex].data[itemIndex]
        .resources
    let totalStudentResources = 0
    resources.forEach((r) => {
      if (r.contentSubType === 'STUDENT') totalStudentResources += 1
    })
    if (totalStudentResources >= 5 && contentSubType === 'STUDENT') {
      notification({
        type: 'info',
        messageKey: 'maximumAllowedStudentResources',
      })
      return
    }
    if (
      !resources.find(
        (x) => x.contentId === contentId && x.contentSubType === contentSubType
      )
    ) {
      const updateStandards = !hasStandardsOnCreation && standards.length < 15
      resources.push({
        contentId,
        contentType,
        contentSubType,
        updateStandards,
        ...itemObj,
      })
    }
  },
  [PLAYLIST_ADD_ITEM_INTO_MODULE]: (state, { payload }) => {
    const { moduleIndex, item, afterIndex } = payload
    const content = {
      ...item,
      standards: [],
      assignments: [],
    }
    if (afterIndex || afterIndex === 0) {
      state.destinationCurriculumSequence.modules[moduleIndex].data.splice(
        afterIndex + 1,
        0,
        content
      )
    } else {
      state.destinationCurriculumSequence.modules[moduleIndex].data.push(
        content
      )
    }
    state.destinationDirty = true
  },
  [PLAYLIST_REORDER_TESTS]: (state, { payload }) => {
    const { oldIndex, newIndex, mIndex } = payload
    const [takenOutTest] = state.destinationCurriculumSequence.modules[
      mIndex
    ].data.splice(oldIndex, 1)
    state.destinationCurriculumSequence.modules[mIndex].data.splice(
      newIndex,
      0,
      takenOutTest
    )
    state.destinationDirty = true
  },
  [REMOVE_TEST_FROM_MODULE_PLAYLIST]: (state, { payload }) => {
    const { moduleIndex, itemId } = payload
    if (
      state?.destinationCurriculumSequence?.modules?.[moduleIndex]?.data?.find(
        (x) => x.contentId === itemId
      )
    ) {
      state.destinationCurriculumSequence.modules[
        moduleIndex
      ].data = state.destinationCurriculumSequence.modules[
        moduleIndex
      ].data.filter((x) => x.contentId !== itemId)
      state.destinationDirty = true
    }
  },
  [TOGGLE_MANAGE_CONTENT_ACTIVE]: (state, { payload }) => {
    state.activeRightPanel = payload
  },
  [UPDATE_SIGNED_REQUEST_FOR_RESOURCE]: (state, { payload }) => {
    state.signedRequest = payload
  },
  [TOGGLE_PLAYLIST_TEST_DETAILS_MODAL_WITH_ID]: (state, { payload }) => {
    if (payload?.id) {
      state.playlistTestDetailsModal.isVisible = true
      state.playlistTestDetailsModal.currentTestId = payload.id
      state.playlistTestDetailsModal.requestLatest = payload.requestLatest
      state.playlistTestDetailsModal.isTestAssigned = payload.isTestAssigned
    } else {
      state.playlistTestDetailsModal.isVisible = false
      state.playlistTestDetailsModal.currentTestId = null
      state.playlistTestDetailsModal.requestLatest = undefined
      state.playlistTestDetailsModal.isTestAssigned = undefined
    }
  },
  [RESET_DESTINATION]: (state, { payload }) => {
    if (state.originalData) {
      state.destinationCurriculumSequence = state.originalData
    } else {
      state.destinationCurriculumSequence = {}
    }
    if (payload.isAuthoring || payload.isCreatePage) {
      state.activeRightPanel = 'manageContent'
    } else {
      state.activeRightPanel = 'summary'
    }

    state.destinationDirty = false
  },
  [SET_DESTINATION_ORIGINAL]: (state, { payload }) => {
    state.originalData = payload
  },
  [RESET_DESTINATION_FLAGS]: (state) => {
    state.activeRightPanel = 'summary'
    state.destinationDirty = false
  },
  [SET_VIDEO_PREVIEW_RESOURCE_MODAL]: (state, { payload }) => {
    state.isVideoResourcePreviewModal = payload
  },
  [ADD_SUB_RESOURCE_IN_DIFFERENTIATION]: (state, { payload }) => {
    const {
      type,
      parentTestId,
      contentId,
      contentTitle,
      contentUrl,
      contentType,
    } = payload
    state.differentiationWork[type].forEach((x, i) => {
      if (x.testId === parentTestId) {
        const subResource = {
          contentId,
          contentTitle,
          contentUrl,
          contentType,
        }
        if (!state.differentiationWork[type][i].resources) {
          state.differentiationWork[type][i].resources = [subResource]
        } else if (
          !state.differentiationWork[type][i].resources.find(
            (y) => y.contentId === contentId
          )
        ) {
          state.differentiationWork[type][i].resources.push(subResource)
        }
      }
    })
  },
  [REMOVE_SUB_RESOURCE_FROM_TEST]: (state, { payload }) => {
    const { type, parentTestId, contentId } = payload
    state.differentiationWork[type].forEach((x, i) => {
      if (x.testId === parentTestId) {
        state.differentiationWork[type][
          i
        ].resources = state.differentiationWork[type][i].resources.filter(
          (y) => y.contentId !== contentId
        )
      }
    })
  },
  [FETCH_CURRICULUM_SEQUENCES]: (state, { payload }) => {
    state.loading = !payload.backgroundFetch
  },
  [FETCH_CURRICULUM_SEQUENCES_ERROR]: (state) => {
    state.loading = false
  },
  [SET_SHOW_RIGHT_SIDE_PANEL]: (state, { payload }) => {
    state.showRightPanel = payload
  },
  [SET_ACTIVE_RIGHT_PANEL]: (state, { payload }) => {
    state.activeRightPanel = payload
  },
  [TOGGLE_SHOW_USE_THIS_NOTIFICATION]: (state, { payload }) => {
    state.showUseThisNotification = payload
  },
  [SET_CUSTOMIZE_TO_DRAFT]: (state, { payload }) => {
    state.customizeInDraft = payload
  },
  [UNASSIGN_ASSINMENTS_SUCCESS]: (state, { payload }) => {
    state.destinationCurriculumSequence.modules.forEach((_module) => {
      if (_module._id === payload.moduleId) {
        _module.data.forEach((test) => {
          if (test.contentId === payload.testId) {
            test.assignments = test.assignments.filter(
              ({ _id }) => !payload.deletedIds.includes(_id)
            )
          }
        })
      }
    })
  },
  [TOGGLE_ASSIGNMENTS]: (state, { payload }) => {
    const { testId, playlistId } = payload
    const { currentAssignmentIds } = state
    const { contentId } =
      JSON.parse(sessionStorage.getItem(`playlist/${playlistId}`)) || {}
    sessionStorage.removeItem(`playlist/${playlistId}`)
    if (currentAssignmentIds.includes(testId) || testId === contentId) {
      currentAssignmentIds.splice(
        currentAssignmentIds.findIndex((x) => x === testId),
        1
      )
    } else {
      currentAssignmentIds.push(testId)
    }
  },
  [SET_CURRENT_ASSIGNMENT_IDS]: (state, { payload }) => {
    state.currentAssignmentIds = payload
  },
  [SET_IS_USED_MODAL_VISIBLE]: (state, { payload }) => {
    if (!payload) {
      state.previouslyUsedPlaylistClone = null
    }
    state.isUsedModalVisible = payload
  },
  [SET_CUSTOM_TITLE_MODAL_VISIBLE]: (state, { payload }) => {
    if (!payload) {
      state.previouslyUsedPlaylistClone = null
    }
    state.customTitleModalVisible = payload
  },
  [SET_PREVIOUSLY_USED_PLAYLIST_CLONE]: (state, { payload }) => {
    state.previouslyUsedPlaylistClone = payload
  },
  [SET_USE_THIS_LOADER]: (state, { payload }) => {
    state.isUseThisLoading = payload
  },
  [SET_CURRENT_TERM]: (state, { payload }) => {
    state.currentTermId = payload
  },
})
