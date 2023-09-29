import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import { withRouter } from 'react-router-dom'
import { isObject as _isObject, uniq as _uniq, get, omit } from 'lodash'
import { withWindowSizes, notification, CustomPrompt } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { themeColor, white } from '@edulastic/colors'
import { testsApi } from '@edulastic/api'
import TestPageHeader from '../../../TestPage/components/TestPageHeader/TestPageHeader'
import {
  createPlaylistAction,
  receivePlaylistByIdAction,
  setTestDataAction,
  updatePlaylistAction,
  setDefaultTestDataAction,
  getPlaylistSelector,
  getTestItemsRowsSelector,
  getTestsCreatingSelector,
  getTestsLoadingSelector,
  getTestStatusSelector,
  createNewModuleAction,
  resequenceModulesAction,
  resequenceTestsAction,
  setRegradeOldIdAction,
  moveContentInPlaylistAction,
  publishPlaylistAction,
  updateDefaultPlaylistThumbnailAction,
} from '../../ducks'
import {
  getSelectedItemSelector,
  getItemsSubjectAndGradeAction,
  getItemsSubjectAndGradeSelector,
} from '../../../TestPage/components/AddItems/ducks'
import { loadAssignmentsAction } from '../../../TestPage/components/Assign/ducks'
import { saveCurrentEditingTestIdAction } from '../../../ItemDetail/ducks'
import {
  getUserSelector,
  getCollectionsToAddContent,
  isPublisherUserSelector,
  getUserRole,
  isOrganizationDistrictUserSelector,
  getCollectionsSelector,
} from '../../../src/selectors/user'
import SourceModal from '../../../QuestionEditor/components/SourceModal/SourceModal'
import ShareModal from '../../../src/components/common/ShareModal'
import CurriculumSequence from '../../../CurriculumSequence/components/CurriculumSequence'
import Summary from '../../../TestPage/components/Summary'
import Setting from '../Settings'
import { CollectionsSelectModal } from '../CollectionsSelectModal/collectionsSelectModal'
import { setDefaultInterests } from '../../../dataUtils'
import { convertCollectionOptionsToArray } from '../../../src/utils/util'

// TODO: replace with playlistApi once api is updated
const { getDefaultImage } = testsApi

const statusConstants = {
  DRAFT: 'draft',
  ARCHIVED: 'archived',
  PUBLISHED: 'published',
}

class Container extends PureComponent {
  propTypes = {
    createPlayList: PropTypes.func.isRequired,
    updatePlaylist: PropTypes.func.isRequired,
    setData: PropTypes.func.isRequired,
    setDefaultData: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    creating: PropTypes.bool.isRequired,
    windowWidth: PropTypes.number.isRequired,
    test: PropTypes.object,
    isTestLoading: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
  }

  static defaultProps = {
    test: null,
  }

  state = {
    current: 'summary',
    showModal: false,
    editEnable: false,
    isTextColorPickerVisible: false,
    isBackgroundColorPickerVisible: false,
    expandedModules: [],
    showShareModal: false,
    showSelectCollectionsModal: false,
  }

  componentDidMount() {
    const {
      match,
      receiveTestById,
      setDefaultData,
      history: { location },
      clearTestAssignments,
      editAssigned,
      setRegradeOldId,
    } = this.props

    if (location.hash === '#review') {
      this.handleNavChange('review')()
    }

    if (match.params.id) {
      receiveTestById(match.params.id)
    } else {
      clearTestAssignments([])
      setDefaultData()
    }

    if (editAssigned) {
      setRegradeOldId(match.params.id)
    }
  }

  componentDidUpdate() {
    const { editAssigned, setRegradeOldId, match } = this.props
    if (editAssigned) {
      setRegradeOldId(match.params.id)
    }
  }

  handleNavChange = (value) => () => {
    const { playlist } = this.props
    if (!playlist?.title?.trim()?.length) {
      return notification({ type: 'warn', messageKey: 'empyPlaylistName' })
    }
    if (value === 'source') {
      return this.setState({
        showModal: true,
      })
    }
    this.handleSave(null, true)
    this.setState({
      current: value,
    })
  }

  handleChangeGrade = (grades) => {
    const { setData, playlist } = this.props
    setData({ ...playlist, grades })
    setDefaultInterests({ grades })
  }

  handleChangeSubject = (subjects) => {
    const { setData, playlist, updateDefaultPlaylistThumbnail } = this.props
    setData({ ...playlist, subjects })
    getDefaultImage({
      subject: subjects[0] || 'Other Subjects',
      standard: get(playlist, 'modules[0].data[0].standardIdentifiers[0]', ''),
    }).then((thumbnail) => updateDefaultPlaylistThumbnail(thumbnail))
    setDefaultInterests({ subject: subjects || [] })
  }

  handleChangeCollection = (value, options) => {
    const { setData, playlist, collectionsToShow } = this.props

    const collectionArray = convertCollectionOptionsToArray(options)

    const orgCollectionIds = collectionsToShow.map((o) => o._id)
    const extraCollections = (playlist.collections || []).filter(
      (c) => !orgCollectionIds.includes(c._id)
    )
    setData({
      ...playlist,
      collections: [...collectionArray, ...extraCollections],
    })
  }

  handleChangeColor = (type, value) => {
    this.setState({
      [type]: value,
    })
  }

  collapseExpandModule = (moduleId) => {
    const { playlist } = this.props

    if (!playlist) return null

    const hasContent =
      playlist.modules.filter((module, index) => {
        if (index === moduleId && module.data && module.data.length > 0) {
          return true
        }
        return false
      }).length > 0

    if (!hasContent)
      return notification({ type: 'warn', messageKey: 'moduleHasNOTest' })

    const { expandedModules } = this.state
    if (expandedModules.indexOf(moduleId) === -1) {
      this.setState({ expandedModules: [...expandedModules, moduleId] })
    } else {
      const newExpandedModules = expandedModules.filter((id) => id !== moduleId)
      this.setState({
        expandedModules: newExpandedModules,
      })
    }
  }

  onBeginDrag = ({ fromModuleIndex, fromContentId, contentIndex }) => {
    this.setState({
      fromModuleIndex,
      fromContentId,
      fromContentIndex: contentIndex,
    })
  }

  onDrop = (toModuleIndex, item, afterIndex) => {
    if (item) {
      const {
        fromModuleIndex,
        fromContentId,
        fromContentIndex,
        expandedModules,
      } = this.state
      const { moveContentInPlaylist } = this.props

      if (item.fromPlaylistTestsBox) {
        moveContentInPlaylist({ toModuleIndex, testItem: item, afterIndex })
      } else {
        moveContentInPlaylist({
          fromContentId,
          fromModuleIndex,
          toModuleIndex,
          fromContentIndex,
          testItem: item,
        })
      }
      this.setState({
        expandedModules: [...expandedModules, toModuleIndex],
        droppedItemId: item?.id,
      })
    }
  }

  onSortEnd = (prop) => {
    const { resequenceModules } = this.props
    resequenceModules(prop)
  }

  handleTestsSort = (prop) => {
    const { resequenceTests } = this.props
    resequenceTests(prop)
  }

  handleSaveTestId = () => {
    const { test, saveCurrentEditingTestId } = this.props
    saveCurrentEditingTestId(test._id)
  }

  renderContent = () => {
    const {
      playlist,
      setData,
      isTestLoading,
      history,
      userId,
      isEditPage,
      isCreatePage,
    } = this.props
    const modules = playlist.modules.map((m) => {
      const data = m.data.map((d) => omit(d, ['hidden']))
      m.data = data
      return omit(m, ['hidden'])
    })
    playlist.modules = modules
    const { authors, _id, bgColor = '', textColor = '' } = playlist
    const owner = (authors && authors.some((x) => x._id === userId)) || !_id
    if (isTestLoading) {
      return <Spin />
    }
    const {
      current,
      expandedModules,
      isTextColorPickerVisible,
      isBackgroundColorPickerVisible,
      droppedItemId,
    } = this.state
    const { handleChangeColor } = this
    // TODO: fix this shit!!
    const selectedTests = []
    playlist &&
      playlist.modules &&
      playlist.modules.forEach((module) => {
        _isObject(module) &&
          module.data.forEach((test) => {
            test.contentId && selectedTests.push(test.contentId)
          })
      })
    _uniq(selectedTests)
    switch (current) {
      case 'summary':
        return (
          <Summary
            onShowSource={this.handleNavChange('source')}
            setData={setData}
            test={playlist}
            current={current}
            owner={owner}
            onChangeGrade={this.handleChangeGrade}
            onChangeSubjects={this.handleChangeSubject}
            onChangeCollection={this.handleChangeCollection}
            onChangeColor={handleChangeColor}
            textColor={textColor || white}
            isTextColorPickerVisible={isTextColorPickerVisible}
            isBackgroundColorPickerVisible={isBackgroundColorPickerVisible}
            backgroundColor={bgColor || themeColor}
            isPlaylist
          />
        )
      case 'review':
        return (
          <CurriculumSequence
            mode="embedded"
            handleSavePlaylist={this.handleSave}
            destinationCurriculumSequence={playlist}
            expandedModules={expandedModules}
            onCollapseExpand={this.collapseExpandModule}
            onChangeGrade={this.handleChangeGrade}
            onChangeSubjects={this.handleChangeSubject}
            onBeginDrag={this.onBeginDrag}
            history={history}
            isEditPage={isEditPage}
            isCreatePage={isCreatePage}
            onDrop={this.onDrop}
            current={current}
            onSortEnd={this.onSortEnd}
            handleTestsSort={this.handleTestsSort}
            fromPlaylist
            droppedItemId={droppedItemId}
          />
        )
      case 'settings':
        return (
          <Setting
            current={current}
            onShowSource={this.handleNavChange('source')}
          />
        )
      default:
        return null
    }
  }

  handleSave = (_, hideNotification) => {
    const { playlist, updatePlaylist, createPlayList, collections } = this.props
    if (!playlist?.modules?.length) {
      /**
       * need to save only when at-least a module present
       */
      return
    }
    const smId = collections
      .filter((x) => x?.name?.toLowerCase() === 'spark math')
      .map(({ _id }) => _id)
    const isSMPlaylist = [
      ...(playlist?.collections || []),
      ...(playlist?.clonedCollections || []),
    ]?.some((c) => smId?.includes(c?._id))

    playlist.isSMPlaylist = isSMPlaylist

    if (playlist._id) {
      updatePlaylist(playlist._id, playlist, hideNotification)
    } else {
      createPlayList(playlist)
    }
  }

  onShareModalChange = () => {
    const { showShareModal } = this.state
    this.setState({
      showShareModal: !showShareModal,
    })
  }

  handleApplySource = (source) => {
    const { setData } = this.props
    try {
      const data = JSON.parse(source)
      setData(data)
      this.setState({
        showModal: false,
      })
    } catch (err) {
      console.error(err)
    }
  }

  setShowModal = (value) => () => {
    this.setState({
      showModal: value,
    })
  }

  handlePublishPlaylist = () => {
    const { publishPlaylist, playlist, match } = this.props
    const { grades = [], subjects = [], _id, modules = [] } = playlist
    if (!_id) {
      notification({ messageKey: 'savePlaylistBeforPublishing' })
      return
    }
    if (!grades.length) {
      notification({ messageKey: 'gradeFieldEmpty' })
    }
    if (!subjects.length) {
      notification({ messageKey: 'subjectFieldEmpty' })
    }
    if (!modules.length) {
      notification({ messageKey: 'Addatleast1module' })
    }
    publishPlaylist({ _id, oldId: match.params.oldId })
    this.setState({ editEnable: false })
  }

  onPublishClick = () => {
    const { playlist, isPublisherUser, isOrganizationDistrictUser } = this.props
    if (
      (isPublisherUser || isOrganizationDistrictUser) &&
      !playlist.collections.length
    ) {
      return this.setState({ showSelectCollectionsModal: true })
    }
    this.handlePublishPlaylist()
  }

  onOkCollectionsSelectModal = (status, selectedCollections) => {
    this.setState({ showSelectCollectionsModal: false })
    this.handlePublishPlaylist(selectedCollections)
  }

  onCancelCollectionsSelectModal = () => {
    this.setState({ showSelectCollectionsModal: false })
  }

  onCollectionsSelectChange = (selectedCollections) => {
    const { playlist, setData } = this.props
    setData({ ...playlist, collections: selectedCollections })
  }

  onEnableEdit = () => {
    this.setState({ editEnable: true })
  }

  renderModal = () => {
    const { test } = this.props
    const { showModal } = this.state
    if (showModal) {
      return (
        <SourceModal
          onClose={this.setShowModal(false)}
          onApply={this.handleApplySource}
        >
          {JSON.stringify(test, null, 4)}
        </SourceModal>
      )
    }
  }

  playlistHasDraftTests = () => {
    const { playlist = {} } = this.props
    const modulesData = playlist.modules?.flatMap(({ data }) => data)
    return modulesData.some(({ status }) => status === 'draft')
  }

  render() {
    const {
      creating,
      windowWidth,
      playlist,
      testStatus,
      userId,
      location: { state } = {},
      useRole,
      updated,
    } = this.props
    const {
      showShareModal,
      current,
      editEnable,
      showSelectCollectionsModal,
    } = this.state
    const { _id: testId, status, authors, grades, subjects, collections } =
      playlist || {}
    const showPublishButton =
      (testStatus && testStatus !== statusConstants.PUBLISHED && testId) ||
      editEnable ||
      state?.editFlow
    const hasTestId = !!testId
    const owner =
      (authors && authors.some((x) => x._id === userId)) ||
      !testId ||
      useRole === roleuser.EDULASTIC_CURATOR
    const gradeSubject = { grades, subjects }

    return (
      <>
        <CustomPrompt
          when={!!updated}
          onUnload
          message={(loc = {}) => {
            const { pathname = '' } = loc

            const playlistFlowPath = RegExp('/author/playlists/\\w*')
            const allow =
              playlistFlowPath.test(pathname) ||
              pathname.startsWith('/author/playlists/')

            if (allow) {
              return true
            }

            return 'There are unsaved changes in your playlist. Are you sure you want to leave?'
          }}
        />
        {this.renderModal()}
        <CollectionsSelectModal
          isVisible={showSelectCollectionsModal}
          onOk={this.onOkCollectionsSelectModal}
          onCancel={this.onCancelCollectionsSelectModal}
          title="Collections"
          onChange={this.onCollectionsSelectChange}
          selectedCollections={collections}
          okText="PUBLISH"
        />
        <ShareModal
          shareLabel="PLAYLIST URL"
          isVisible={showShareModal}
          testId={testId}
          isPlaylist
          isPublished={status === statusConstants.PUBLISHED}
          onClose={this.onShareModalChange}
          gradeSubject={gradeSubject}
        />
        <TestPageHeader
          onChangeNav={this.handleNavChange}
          current={current}
          onSave={this.handleSave}
          onShare={this.onShareModalChange}
          onPublish={this.onPublishClick}
          title={playlist.title}
          creating={creating}
          windowWidth={windowWidth}
          showPublishButton={showPublishButton}
          testStatus={testStatus}
          hasTestId={hasTestId}
          editEnable={editEnable}
          onEnableEdit={this.onEnableEdit}
          owner={owner}
          onShowSource={this.handleNavChange('source')}
          isPlaylist
          playlistStatus={status}
          playlistHasDraftTests={this.playlistHasDraftTests}
        />
        {this.renderContent()}
      </>
    )
  }
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    (state) => ({
      playlist: getPlaylistSelector(state),
      rows: getTestItemsRowsSelector(state),
      creating: getTestsCreatingSelector(state),
      selectedRows: getSelectedItemSelector(state),
      user: getUserSelector(state),
      userId: get(state, 'user.user._id', ''),
      updated: get(state, 'playlist.updated', false),
      isTestLoading: getTestsLoadingSelector(state),
      testStatus: getTestStatusSelector(state),
      itemsSubjectAndGrade: getItemsSubjectAndGradeSelector(state),
      collectionsToShow: getCollectionsToAddContent(state),
      isPublisherUser: isPublisherUserSelector(state),
      collections: getCollectionsSelector(state),
      useRole: getUserRole(state),
      isOrganizationDistrictUser: isOrganizationDistrictUserSelector(state),
    }),
    {
      createPlayList: createPlaylistAction,
      updatePlaylist: updatePlaylistAction,
      receiveTestById: receivePlaylistByIdAction,
      setData: setTestDataAction,
      setDefaultData: setDefaultTestDataAction,
      publishPlaylist: publishPlaylistAction,
      setRegradeOldId: setRegradeOldIdAction,
      clearTestAssignments: loadAssignmentsAction,
      saveCurrentEditingTestId: saveCurrentEditingTestIdAction,
      addNewModuleToPlaylist: createNewModuleAction,
      resequenceModules: resequenceModulesAction,
      resequenceTests: resequenceTestsAction,
      moveContentInPlaylist: moveContentInPlaylistAction,
      getItemsSubjectAndGrade: getItemsSubjectAndGradeAction,
      updateDefaultPlaylistThumbnail: updateDefaultPlaylistThumbnailAction,
    }
  )
)

export default enhance(Container)
