import { createSelector } from 'reselect'
import { createAction } from 'redux-starter-kit'
import { call, put, all, takeEvery, select } from 'redux-saga/effects'
import { push, replace } from 'connected-react-router'
import { omit, get, set, isNumber, isEmpty } from 'lodash'
import {
  curriculumSequencesApi,
  contentSharingApi,
  testsApi,
  resourcesApi,
} from '@edulastic/api'
import produce from 'immer'
import { notification } from '@edulastic/common'
import { white, themeColor } from '@edulastic/colors'
import {
  // SET_MAX_ATTEMPT,
  UPDATE_TEST_IMAGE,
  SET_SAFE_BROWSE_PASSWORD,
} from '../src/constants/actions'
import { getUserFeatures, getCurrentActiveTermIds } from '../src/selectors/user'
import {
  getCurrentPlaylistTermId,
  toggleManageContentActiveAction,
} from '../CurriculumSequence/ducks'
import { cdnURI } from '../../../app-config'

// constants
const playlistStatusConstants = {
  INREVIEW: 'inreview',
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
}

export const defaultImage = `${cdnURI}/default/default-test-1.jpg`

export const SET_ASSIGNMENT = '[assignments] set assignment' // TODO remove cyclic dependency
export const CREATE_PLAYLIST_REQUEST = '[playlist] create playlist request'
export const CREATE_PLAYLIST_SUCCESS = '[playlists] create playlist success'
export const CREATE_PLAYLIST_ERROR = '[playlists] create playlist error'

export const UPDATE_PLAYLIST_REQUEST = '[playlists] update playlist request'
export const UPDATE_PLAYLIST_SUCCESS = '[playlists] update playlist success'
export const UPDATE_PLAYLIST_ERROR = '[playlists] update playlist error'
export const UPDATE_PLAYLIST = '[playlists] update playlist '

export const RECEIVE_PLAYLIST_BY_ID_REQUEST =
  '[playlists] receive playlist by id request'
export const RECEIVE_PLAYLIST_BY_ID_SUCCESS =
  '[playlists] receive playlist by id success'
export const RECEIVE_PLAYLIST_BY_ID_ERROR =
  '[playlists] receive playlist by id error'

export const UPDATE_DEFAULT_PLAYLIST_THUMBNAIL =
  '[playlist] update default playlist thumbnail'
export const SET_TEST_DATA = '[playlists] set playlist data'
export const SET_DEFAULT_TEST_DATA = '[playlists] set default playlist data'
export const SET_TEST_EDIT_ASSIGNED = '[playlists] set edit assigned'
export const TEST_SHARE = '[playlists] send playlist share request'
export const PLAYLIST_PUBLISH = '[playlists] publish playlist'
export const UPDATE_TEST_STATUS = '[playlists] update playlist status'
export const CLEAR_TEST_DATA = '[playlists] clear playlist data'
export const TEST_CREATE_SUCCESS = '[playlists] create playlist succes'
export const SET_REGRADE_OLD_TESTID = '[playlists] set regrade old test_id'
export const UPDATE_ENTITY_DATA = '[playlists] update entity data'
export const RECEIVE_SHARED_USERS_LIST = '[playlists] receive shared users list'
export const UPDATE_SHARED_USERS_LIST =
  '[playlists] update shared with users list'
export const DELETE_SHARED_USER = '[playlists] delete share user from list'
export const ADD_MODULE = '[playlists] Add new module'
export const UPDATE_MODULE = '[playlists] Update module data'
export const DELETE_MODULE = '[playlists] Delete module'
export const ORDER_MODULES = '[playlists] Resequence modules'
export const ORDER_TESTS = '[playlists] Resequence tests in module'
export const ADD_TEST_IN_PLAYLIST = '[playlists] add test to module'
export const ADD_TEST_IN_PLAYLIST_BULK =
  '[playlists] add tests to module in bulk'
export const DELETE_TEST_FROM_PLAYLIST_BULK =
  '[playlists] remove test from module in Bulk'
export const SET_USER_CUSTOMIZE = '[playlists] set user customize'
export const REMOVE_TEST_FROM_MODULE = '[playlists] remove test from module'
export const REMOVE_TEST_FROM_PLAYLIST = '[playlists] remove test from playlist'
export const MOVE_CONTENT = '[playlists] move content in playlist'
export const CHANGE_PLAYLIST_THEME = '[playlists] change playlist theme'

export const PLAYLIST_ADD_SUBRESOURCE = '[playlists] add sub resource'
export const PLAYLIST_REMOVE_SUBRESOURCE = '[playlists] remove sub resource'

// actions

export const addSubresourceToPlaylistAction = createAction(
  PLAYLIST_ADD_SUBRESOURCE
)
export const removeSubResourceAction = createAction(PLAYLIST_REMOVE_SUBRESOURCE)

export const updateDefaultPlaylistThumbnailAction = (thumbnail) => ({
  type: UPDATE_DEFAULT_PLAYLIST_THUMBNAIL,
  payload: { thumbnail },
})

export const receivePlaylistByIdAction = (id) => ({
  type: RECEIVE_PLAYLIST_BY_ID_REQUEST,
  payload: { id },
})

export const receivePlaylistByIdSuccess = (entity) => ({
  type: RECEIVE_PLAYLIST_BY_ID_SUCCESS,
  payload: { entity },
})

export const receivePlaylistByIdError = (error) => ({
  type: RECEIVE_PLAYLIST_BY_ID_ERROR,
  payload: { error },
})

export const createPlaylistAction = (data, toReview = false) => ({
  type: CREATE_PLAYLIST_REQUEST,
  payload: { data, toReview },
})

export const createPlaylistSuccessAction = (entity) => ({
  type: CREATE_PLAYLIST_SUCCESS,
  payload: { entity },
})

export const createPlaylistErrorAction = (error) => ({
  type: CREATE_PLAYLIST_ERROR,
  payload: { error },
})

export const updatePlaylistAction = (id, data, hideNotification) => ({
  type: UPDATE_PLAYLIST_REQUEST,
  payload: { id, data, hideNotification },
})

export const updatePlaylistSuccessAction = (entity) => ({
  type: UPDATE_PLAYLIST_SUCCESS,
  payload: { entity },
})

export const updatePlaylistErrorAction = (error) => ({
  type: UPDATE_PLAYLIST_ERROR,
  payload: { error },
})

export const setTestDataAction = (data) => ({
  type: SET_TEST_DATA,
  payload: { data },
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

export const changePlaylistThemeAction = (payload = {}) => ({
  type: CHANGE_PLAYLIST_THEME,
  payload,
})

export const setTestEditAssignedAction = createAction(SET_TEST_EDIT_ASSIGNED)

export const sendTestShareAction = createAction(TEST_SHARE)
export const publishPlaylistAction = createAction(PLAYLIST_PUBLISH)
export const updatePlaylistStatusAction = createAction(UPDATE_TEST_STATUS)
export const setRegradeOldIdAction = createAction(SET_REGRADE_OLD_TESTID)
export const updateSharedWithListAction = createAction(UPDATE_SHARED_USERS_LIST)
export const receiveSharedWithListAction = createAction(
  RECEIVE_SHARED_USERS_LIST
)
export const deleteSharedUserAction = createAction(DELETE_SHARED_USER)
export const createNewModuleAction = createAction(ADD_MODULE)
export const updateModuleAction = createAction(UPDATE_MODULE)
export const deleteModuleAction = createAction(DELETE_MODULE)
export const resequenceModulesAction = createAction(ORDER_MODULES)
export const resequenceTestsAction = createAction(ORDER_TESTS)
export const createTestInModuleAction = createAction(ADD_TEST_IN_PLAYLIST)
export const addTestToModuleInBulkAction = createAction(
  ADD_TEST_IN_PLAYLIST_BULK
)
export const deleteTestFromModuleInBulkAction = createAction(
  DELETE_TEST_FROM_PLAYLIST_BULK
)
export const setUserCustomizeAction = createAction(SET_USER_CUSTOMIZE)
export const removeTestFromModuleAction = createAction(REMOVE_TEST_FROM_MODULE)
export const removeTestFromPlaylistAction = createAction(
  REMOVE_TEST_FROM_PLAYLIST
)
export const moveContentInPlaylistAction = createAction(MOVE_CONTENT)
// reducer

const initialPlaylistState = {
  title: undefined,
  description: '',
  alignmentInfo: '',
  status: 'draft',
  createdBy: {
    _id: '',
    name: '',
  },
  thumbnail: defaultImage,
  derivedFrom: {
    name: '',
  },
  // FIXME: define schema for modules
  modules: [],
  type: 'content',
  collections: [],
  grades: [],
  subjects: [],
  version: 1,
  tags: [],
  active: 1,
  customize: false,
  bgColor: themeColor,
  textColor: white,
  analytics: [
    {
      usage: 0,
    },
  ],
}

const initialState = {
  entity: initialPlaylistState,
  error: null,
  page: 1,
  limit: 20,
  count: 0,
  loading: false,
  creating: false,
  sharedUsersList: [],
  updated: false,
}

const createNewModuleState = (
  moduleGroupName,
  moduleId,
  title,
  description
) => ({
  moduleGroupName,
  moduleId,
  title,
  description,
  data: [],
})

const createNewTestInModule = (test) => ({
  contentId: test._id,
  contentTitle: test.title,
  contentType: 'test',
  standardIdentifiers: test.standardIdentifiers,
})

const removeTestFromPlaylist = (playlist, payload) => {
  const { moduleIndex, itemId } = payload
  let newPlaylist
  if (moduleIndex >= 0) {
    newPlaylist = produce(playlist, (draft) => {
      if (draft.modules[payload.moduleIndex]) {
        draft.modules[payload.moduleIndex].data = draft?.modules?.[
          payload.moduleIndex
        ]?.data?.filter((content) => content.contentId !== payload.itemId)
      }
    })
  } else {
    newPlaylist = produce(playlist, (draft) => {
      draft.modules.map((mod) => {
        mod.data = mod.data.filter((data) => data.contentId !== itemId)
        return mod
      })
    })
  }
  notification({ type: 'success', messageKey: 'removedTestFromPlaylist' })
  return newPlaylist
}

const removeTestFromPlaylistBulk = (playlist, payload) => {
  const { testIds } = payload
  const newPlaylist = produce(playlist, (draft) => {
    draft.modules.forEach((obj, key) => {
      draft.modules[key].data = draft.modules[key].data.filter(
        (content) => !testIds.includes(content.contentId)
      )
    })
  })
  return newPlaylist
}

const moveContentInPlaylist = (playlist, payload) => {
  const {
    toModuleIndex,
    toContentIndex,
    fromModuleIndex,
    fromContentIndex,
    testItem,
    afterIndex,
  } = payload
  let newPlaylist = playlist

  // If no valid destination module.
  if (
    (toModuleIndex !== 0 && !toModuleIndex) ||
    !playlist.modules?.[toModuleIndex]
  ) {
    notification({ messageKey: 'invalidModuleSelect' })
    return newPlaylist
  }

  // If valid fromModuleIndex but module is not present in playlist
  if (fromModuleIndex >= 0 && !playlist.modules?.[fromModuleIndex]) {
    return newPlaylist
  }

  const newItem =
    fromModuleIndex >= 0
      ? playlist.modules[fromModuleIndex]?.data[fromContentIndex]
      : testItem

  // If the item is already present in destination module
  const isItemExistingInModule = playlist.modules[toModuleIndex]?.data?.some(
    (x) => x?.contentId === (newItem.id || newItem.contentId)
  )

  if (isItemExistingInModule) {
    notification({
      msg: `Dropped ${
        newItem.contentType === 'test' ? 'Test' : 'Resource'
      } already exists in this module`,
    })

    return newPlaylist
  }

  if (fromModuleIndex >= 0) {
    newPlaylist = produce(playlist, (draft) => {
      if (!toContentIndex) {
        // Move item to different module
        draft.modules[toModuleIndex].data.push(newItem)
      } else {
        // Move item in same module
        draft.modules[toModuleIndex].data.splice(toContentIndex, 0, newItem)
      }

      draft.modules[fromModuleIndex].data.splice(fromContentIndex, 1)
    })
  } else if (testItem) {
    // Moving item from test search to a module
    set(testItem, 'contentId', testItem.id)
    const attrsToOmit = ['id', 'type', 'fromPlaylistTestsBox']

    if (testItem.contentType === 'test') {
      attrsToOmit.push(...['contentDescription', 'contentUrl'])
      newPlaylist = produce(playlist, (draft) => {
        if (isNumber(afterIndex) && afterIndex >= 0) {
          draft.modules[toModuleIndex].data.splice(afterIndex + 1, 0, newItem)
        } else {
          draft.modules[toModuleIndex].data.push(newItem)
        }
      })
    } else {
      attrsToOmit.push('standardIdentifiers')
    }

    const newTestItem = omit(testItem, attrsToOmit)

    newPlaylist = produce(playlist, (draft) => {
      if (isNumber(afterIndex) && afterIndex >= 0) {
        draft.modules[toModuleIndex].data.splice(afterIndex + 1, 0, newTestItem)
      } else {
        draft.modules[toModuleIndex].data.push(newTestItem)
      }
    })
  }

  return newPlaylist
}

function addModuleToPlaylist(playlist, payload) {
  const newPlaylist = produce(playlist, (draft) => {
    const newModule = createNewModuleState(
      payload.moduleGroupName,
      payload.moduleId,
      payload.title || payload.moduleName,
      payload.description
    )
    if (payload.afterModuleIndex !== undefined) {
      draft.modules.splice(payload.afterModuleIndex, 0, newModule)
    } else {
      draft.modules.push(newModule)
    }
    return draft
  })
  notification({ type: 'success', messageKey: 'moduleAddedPlaylist' })
  return newPlaylist
}

function updateModuleInPlaylist(playlist, payload) {
  const { id, title, description, moduleId, moduleGroupName } = payload
  const newPlaylist = produce(playlist, (draft) => {
    if (payload !== undefined) {
      if (title) {
        draft.modules[id].title = title
        draft.modules[id].description = description
        draft.modules[id].moduleId = moduleId
        draft.modules[id].moduleGroupName = moduleGroupName
        notification({ type: 'success', messageKey: 'moduleUpdated' })
      } else {
        notification({ messageKey: 'moduleShouldNotEmpty' })
      }
    } else {
      notification({ messageKey: 'updatingMoudleErr' })
    }
    return draft
  })
  return newPlaylist
}

function deleteModuleFromPlaylist(playlist, payload) {
  const newPlaylist = produce(playlist, (draft) => {
    if (payload !== undefined) {
      draft.modules.splice(payload, 1)
      notification({
        type: 'success',
        messageKey: 'moduleRemovedFromPlaylist',
      })
    } else {
      notification({ messageKey: 'moduleRemovedFromPlaylistErr' })
    }
    return draft
  })
  return newPlaylist
}

function resequenceModulesInPlaylist(playlist, payload) {
  const { oldIndex, newIndex } = payload
  const newPlaylist = produce(playlist, (draft) => {
    const obj = draft.modules.splice(oldIndex, 1)
    draft.modules.splice(newIndex, 0, obj[0])
    return draft
  })
  return newPlaylist
}

function resequenceTestsInModule(playlist, payload) {
  const { oldIndex, newIndex, mIndex } = payload
  const newPlaylist = produce(playlist, (draft) => {
    const obj = draft.modules[mIndex].data.splice(oldIndex, 1)
    draft.modules[mIndex].data.splice(newIndex, 0, obj[0])
    return draft
  })
  return newPlaylist
}

function addTestToModule(entity, payload) {
  const { testAdded, moduleIndex } = payload
  entity.modules[moduleIndex] = produce(
    entity.modules[moduleIndex],
    (draft) => {
      const newTest = createNewTestInModule(testAdded)
      draft.data.push(newTest)
      return draft
    }
  )
  notification({ type: 'success', messageKey: 'addedTestToPlaylist' })
  return entity
}

function addTestToModuleInBulk(entity, payload) {
  const { tests, moduleIndex } = payload
  entity.modules[moduleIndex] = produce(
    entity.modules[moduleIndex],
    (draft) => {
      tests.forEach((test) => draft.data.push(createNewTestInModule(test)))
      return draft
    }
  )
  return entity
}

function addSubresource(entity, payload) {
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
  const newEntity = produce(entity, (draft) => {
    if (!draft.modules[moduleIndex].data[itemIndex].resources) {
      draft.modules[moduleIndex].data[itemIndex].resources = []
    }
    const resources = draft.modules[moduleIndex].data[itemIndex].resources

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
      draft.modules[moduleIndex].data[itemIndex].resources = resources
    }
  })
  return newEntity
}

function removeSubResource(entity, payload) {
  const { moduleIndex, contentId, itemIndex, contentSubType } = payload
  const newEntity = produce(entity, (draft) => {
    if (draft.modules[moduleIndex].data[itemIndex].resources) {
      draft.modules[moduleIndex].data[itemIndex].resources = draft.modules[
        moduleIndex
      ].data[itemIndex].resources.filter(
        (x) =>
          !(x.contentId === contentId && x.contentSubType === contentSubType)
      )
    }
  })
  return newEntity
}

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case PLAYLIST_ADD_SUBRESOURCE: {
      const newEntity = addSubresource(state.entity, payload)
      return { ...state, entity: newEntity, updated: true }
    }
    case PLAYLIST_REMOVE_SUBRESOURCE: {
      const newEntity = removeSubResource(state.entity, payload)
      return { ...state, entity: newEntity, updated: true }
    }
    case ADD_MODULE: {
      const newEntity = addModuleToPlaylist(state.entity, payload)
      return { ...state, entity: newEntity, updated: true }
    }
    case UPDATE_MODULE: {
      const newEntity = updateModuleInPlaylist(state.entity, payload)
      return { ...state, entity: newEntity, updated: true }
    }
    case DELETE_MODULE: {
      const newEntity = deleteModuleFromPlaylist(state.entity, payload)
      return { ...state, entity: newEntity, updated: true }
    }
    case ORDER_MODULES: {
      const newEntity = resequenceModulesInPlaylist(state.entity, payload)
      return { ...state, entity: newEntity, updated: true }
    }
    case ORDER_TESTS: {
      const newEntity = resequenceTestsInModule(state.entity, payload)
      return { ...state, entity: newEntity, updated: true }
    }
    case ADD_TEST_IN_PLAYLIST: {
      const newEntity = addTestToModule(state.entity, payload)
      return {
        ...state,
        entity: newEntity,
        updated: true,
      }
    }
    case ADD_TEST_IN_PLAYLIST_BULK: {
      const newEntity = addTestToModuleInBulk(state.entity, payload)
      return {
        ...state,
        entity: newEntity,
        updated: true,
      }
    }
    case DELETE_TEST_FROM_PLAYLIST_BULK: {
      const newEntity = removeTestFromPlaylistBulk(state.entity, payload)
      return { ...state, entity: newEntity, updated: true }
    }
    case REMOVE_TEST_FROM_MODULE: {
      const newEntity = removeTestFromPlaylist(state.entity, payload)
      return { ...state, entity: newEntity, updated: true }
    }
    case MOVE_CONTENT: {
      const newEntity = moveContentInPlaylist(state.entity, payload)
      return { ...state, entity: newEntity, updated: true }
    }
    case REMOVE_TEST_FROM_PLAYLIST: {
      const newEntity = removeTestFromPlaylist(state.entity, payload)
      return { ...state, entity: newEntity, updated: true }
    }
    case UPDATE_PLAYLIST: {
      return { ...state, entity: payload.updatedModule }
    }
    case SET_DEFAULT_TEST_DATA:
      return { ...state, entity: { ...initialPlaylistState } }
    case RECEIVE_PLAYLIST_BY_ID_REQUEST:
      return { ...state, loading: true }
    case SET_TEST_EDIT_ASSIGNED:
      return { ...state, editAssigned: true }
    case SET_REGRADE_OLD_TESTID:
      return { ...state, regradeTestId: payload }
    case RECEIVE_PLAYLIST_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        entity: {
          ...payload.entity,
        },
      }
    case RECEIVE_PLAYLIST_BY_ID_ERROR:
      return { ...state, loading: false, error: payload.error }

    case CREATE_PLAYLIST_REQUEST:
    case UPDATE_PLAYLIST_REQUEST:
      return { ...state, creating: true }
    case CREATE_PLAYLIST_SUCCESS:
    case UPDATE_PLAYLIST_SUCCESS: {
      const { testItems, ...entity } = payload.entity
      return {
        ...state,
        entity: { ...state.entity, ...entity },
        creating: false,
        updated: false,
      }
    }
    case UPDATE_ENTITY_DATA: {
      const { testItems: items, ...dataRest } = payload.entity
      return {
        ...state,
        entity: { ...state.entity, ...dataRest },
      }
    }
    case CREATE_PLAYLIST_ERROR:
    case UPDATE_PLAYLIST_ERROR:
      return { ...state, creating: false, error: payload.error }
    case SET_TEST_DATA:
      return {
        ...state,
        entity: {
          ...state.entity,
          ...payload.data,
        },
      }
    case UPDATE_TEST_IMAGE:
      return {
        ...state,
        entity: {
          ...state.entity,
          thumbnail: payload.fileUrl,
        },
      }
    /* This is never used by playlist but since
     *  this piece of code existed since begining
     *  It's being commented out as a fix for EV-26191
     */
    // case SET_MAX_ATTEMPT:
    //   return {
    //     ...state,
    //     entity: {
    //       ...state.entity,
    //       maxAttempts: payload.data,
    //     },
    //   }
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
          testItems: [],
          grades: [],
          subjects: [],
        },
        sharedUsersList: [],
      }
    case TEST_CREATE_SUCCESS:
      return {
        ...state,
        creating: false,
      }
    case UPDATE_SHARED_USERS_LIST:
      return {
        ...state,
        sharedUsersList: payload,
      }
    case SET_USER_CUSTOMIZE:
      return {
        ...state,
        entity: {
          ...state.entity,
          customize: payload,
        },
        updated: true,
      }
    case CHANGE_PLAYLIST_THEME: {
      const { bgColor = themeColor, textColor = white } = payload
      return {
        ...state,
        entity: {
          ...state.entity,
          bgColor,
          textColor,
        },
        updated: true,
      }
    }
    case UPDATE_DEFAULT_PLAYLIST_THUMBNAIL: {
      const { thumbnail } = payload
      return {
        ...state,
        entity: {
          ...state.entity,
          thumbnail,
        },
        updated: true,
      }
    }
    default:
      return state
  }
}

// selectors

export const stateSelector = (state) => state.playlist

export const getPlaylistSelector = createSelector(
  stateSelector,
  (state) => state.entity
)

export const getPlaylistEntitySelector = createSelector(
  stateSelector,
  (state) => state.entity
)

export const getTestStatusSelector = createSelector(
  getPlaylistEntitySelector,
  (state) => state.status
)

export const getTestIdSelector = createSelector(
  stateSelector,
  (state) => state.entity && state.entity._id
)

export const getTestsCreatingSelector = createSelector(
  stateSelector,
  (state) => state.creating
)

export const getTestsLoadingSelector = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getUserCustomizeSelector = createSelector(stateSelector, (state) =>
  get(state.entity, 'customize', true)
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
  getPlaylistSelector,
  (state) => state
)

// saga
function* receivePlaylistByIdSaga({ payload }) {
  try {
    let activeTermIds = []
    const selectedPlaylistTermId = yield select(getCurrentPlaylistTermId)
    if (!selectedPlaylistTermId) {
      activeTermIds = yield select(getCurrentActiveTermIds)
    } else {
      activeTermIds = [selectedPlaylistTermId]
    }

    const entity = yield call(curriculumSequencesApi.getCurriculums, {
      id: payload.id,
      data: true,
      termIds: activeTermIds,
    })
    if (entity.thumbnail === defaultImage) {
      const thumbnail = yield call(testsApi.getDefaultImage, {
        subject: get(entity, 'subjects[0]', 'Other Subjects'),
        standard: get(entity, 'modules[0].data[0].standardIdentifiers[0]', ''),
      })
      yield put(updateDefaultPlaylistThumbnailAction(thumbnail))
    }
    yield put(receivePlaylistByIdSuccess(entity))
  } catch (err) {
    yield call(notification, { type: 'error', messageKey: 'getPlaylistErr' })
    yield put(receivePlaylistByIdError('getPlaylistErr'))
  }
}

function* createPlaylistSaga({ payload }) {
  const { title } = payload.data
  try {
    if (title !== undefined && !title.trim().length) {
      return yield call(notification, { messageKey: 'nameShouldNotEmpty' })
    }
    const dataToSend = omit(payload.data, [
      'sharedWith',
      'createdDate',
      'updatedDate',
      'testItems',
      'playlistMode',
    ])

    const entity = yield call(curriculumSequencesApi.create, {
      data: dataToSend,
    })
    const hash = payload.toReview ? '#review' : ''
    yield put(createPlaylistSuccessAction(entity))
    yield put(replace(`/author/playlists/${entity._id}/edit${hash}`))

    yield call(notification, {
      type: 'success',
      messageKey: 'playlistCreated',
    })
  } catch (err) {
    yield call(notification, { messageKey: 'playlistCreateErr' })
    yield put(createPlaylistErrorAction('playlistCreateErr'))
  }
}

function* updatePlaylistSaga({ payload }) {
  try {
    // remove createdDate and updatedDate
    const oldId = payload.data._id
    const dataToSend = omit(payload.data, [
      'updatedDate',
      'createdDate',
      'sharedWith',
      'authors',
      'sharedType',
      '_id',
      '__v',
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
          'hasStandardsOnCreation',
          'hasRandomQuestions',
        ])
      })
      return mod
    })

    if (!dataToSend.skin) {
      delete dataToSend.skin
    }

    const entity = yield call(curriculumSequencesApi.update, {
      id: oldId,
      data: dataToSend,
    })

    if (!isEmpty(resourceMap)) {
      yield call(resourcesApi.updateStandards, resourceMap)
    }
    yield put(updatePlaylistSuccessAction(entity))
    if (!payload.hideNotification) {
      yield call(notification, {
        type: 'success',
        messageKey: 'playlistSaved',
      })
    }
    const newId = entity._id
    if (oldId !== newId && newId) {
      yield put(push(`/author/playlists/${newId}/versioned/old/${oldId}`))
    }
  } catch (err) {
    let messageKey = 'updatePlaylistErr'
    if (err?.data?.permissions) {
      if (
        err.response.data.permissions?.length &&
        err.response.data.permissions.includes('read')
      ) {
        messageKey = 'updatePlaylistErrViewOnlyAccess'
      } else {
        messageKey = 'updatePlaylistErrNoAccess'
      }
    }
    yield call(notification, { messageKey })
    yield put(updatePlaylistErrorAction(messageKey))
  }
}

function* shareTestSaga({ payload }) {
  try {
    yield call(contentSharingApi.shareContent, payload)
    yield put(receiveSharedWithListAction(payload.testId))
    yield call(notification, { type: 'success', messageKey: 'sharedPlaylist' })
  } catch (e) {
    yield call(notification, { messageKey: 'sharePlaylistErr' })
  }
}

function* publishPlaylistSaga({ payload }) {
  try {
    const { _id: id } = payload
    const data = yield select(getPlaylistSelector)
    const features = yield select(getUserFeatures)
    if (
      (features.isCurator || features.isPublisherAuthor) &&
      !get(data, 'collections', []).length
    ) {
      yield call(notification, {
        messageKey: 'publishPlaylistErrWithAssociated',
      })
      return
    }
    const dataToSend = omit(data, [
      'updatedDate',
      'createdDate',
      'sharedWith',
      'authors',
      'sharedType',
      '_id',
      '__v',
      'testItems',
    ])
    dataToSend.modules = dataToSend.modules.map((mod) => {
      mod.data = mod.data.map((test) =>
        omit(test, [
          'standards',
          'alignment',
          'assignments',
          'hasStandardsOnCreation',
          'hasRandomQuestions',
        ])
      )
      return mod
    })

    const updatedEntityData = yield call(curriculumSequencesApi.update, {
      id,
      data: dataToSend,
    })
    yield put(updatePlaylistSuccessAction(updatedEntityData))
    yield put(toggleManageContentActiveAction(''))

    if (features.isPublisherAuthor) {
      yield call(curriculumSequencesApi.updatePlaylistStatus, {
        playlistId: id,
        status: playlistStatusConstants.INREVIEW,
      })
      yield put(updatePlaylistStatusAction(playlistStatusConstants.INREVIEW))
      yield call(notification, {
        type: 'success',
        messageKey: 'reviewPlaylist',
      })
    } else {
      yield call(curriculumSequencesApi.publishPlaylist, id)
      yield put(updatePlaylistStatusAction(playlistStatusConstants.PUBLISHED))
      yield call(notification, {
        type: 'success',
        messageKey: 'publishedPlaylist',
      })
    }

    yield put(
      push({
        pathname: `/author/playlists/${id}`,
        state: { publishedPlaylist: true },
      })
    )
  } catch (error) {
    yield call(notification, {
      msg: error?.data?.message,
      messageKey: 'publishPlaylistErr',
    })
  }
}

function* receiveSharedWithListSaga({ payload }) {
  try {
    const { sharedEntities = [] } = yield call(
      contentSharingApi.getSharedUsersList,
      payload
    )
    const coAuthors = sharedEntities.map(
      ({ permission, sharedWith, sharedType, _id }) => ({
        permission,
        sharedWith,
        sharedType,
        sharedId: _id,
      })
    )
    yield put(updateSharedWithListAction(coAuthors))
  } catch (e) {
    yield call(notification, {
      type: 'error',
      messageKey: 'getSharedUsersErr',
    })
  }
}

function* deleteSharedUserSaga({ payload }) {
  try {
    yield call(contentSharingApi.deleteSharedUser, payload)
    yield put(receiveSharedWithListAction(payload.testId))
  } catch (e) {
    yield call(notification, {
      type: 'error',
      messageKey: 'deleteSharedUserErr',
    })
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_PLAYLIST_BY_ID_REQUEST, receivePlaylistByIdSaga),
    yield takeEvery(CREATE_PLAYLIST_REQUEST, createPlaylistSaga),
    yield takeEvery(UPDATE_PLAYLIST_REQUEST, updatePlaylistSaga),
    yield takeEvery(TEST_SHARE, shareTestSaga),
    yield takeEvery(PLAYLIST_PUBLISH, publishPlaylistSaga),
    yield takeEvery(RECEIVE_SHARED_USERS_LIST, receiveSharedWithListSaga),
    yield takeEvery(DELETE_SHARED_USER, deleteSharedUserSaga),
  ])
}
