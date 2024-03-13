import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import PropTypes from 'prop-types'
import { withNamespaces } from '@edulastic/localization'
import { test } from '@edulastic/constants'
import { segmentApi } from '@edulastic/api'
import {
  getOrgDataSelector,
  getCollectionsSelector,
  isPublisherUserSelector,
  getUserRole,
  getUserId,
  isFreeAdminSelector,
  isSAWithoutSchoolsSelector,
  isOrganizationDistrictUserSelector,
  isVideoQuizAndAIEnabledSelector,
  isRedirectToVQAddOnSelector,
} from '../../../src/selectors/user'
import ViewModal from '../ViewModal'
import TestPreviewModal from '../../../Assignments/components/Container/TestPreviewModal'
import {
  flattenPlaylistStandards,
  isPremiumContent,
  showPremiumLabelOnContent,
} from '../../../dataUtils'
import { DeleteItemModal } from '../DeleteItemModal/deleteItemModal'
import {
  approveOrRejectSingleTestRequestAction,
  toggleTestLikeAction,
} from '../../ducks'
import {
  duplicatePlaylistRequestAction,
  getIsUseThisLoading,
  useThisPlayListAction,
  setIsUsedModalVisibleAction,
  setCustomTitleModalVisibleAction,
  cloneThisPlayListAction,
} from '../../../CurriculumSequence/ducks'
import CloneOnUsePlaylistConfirmationModal from '../../../CurriculumSequence/components/CloneOnUsePlaylistConfirmationModal'
import { allowDuplicateCheck } from '../../../src/utils/permissionCheck'
import PlaylistCard from './PlaylistCard'
import TestItemCard from './TestItemCard'
import { duplicateTestRequestAction } from '../../../TestPage/ducks'
import {
  toggleAdminAlertModalAction,
  toggleVerifyEmailModalAction,
  getEmailVerified,
  getVerificationTS,
  isDefaultDASelector,
} from '../../../../student/Login/ducks'
import { getIsPreviewModalVisibleSelector } from '../../../../assessment/selectors/test'
import { setIsTestPreviewVisibleAction } from '../../../../assessment/actions/test'
import CustomTitleOnCloneModal from '../../../CurriculumSequence/components/CustomTitleOnCloneModal'
import { getTestCollectionName } from '../../../utils/testCardDetails'
import { getIsBuyAiSuiteAlertModalVisible } from '../../../utils/videoQuiz'

export const sharedTypeMap = {
  0: 'PUBLIC',
  1: 'DISTRICT',
  2: 'SCHOOL',
  3: 'INDIVIDUAL', // can be shown as "ME" / "YOU"
}

class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    authorName: PropTypes.string,
    owner: PropTypes.bool,
    testItemId: PropTypes.string,
    orgCollections: PropTypes.array.isRequired,
    currentTestId: PropTypes.string,
    isPreviewModalVisible: PropTypes.bool.isRequired,
    isPlaylist: PropTypes.bool,
    approveOrRejectSingleTestRequest: PropTypes.func.isRequired,
    orgData: PropTypes.object.isRequired,
    windowWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    standards: PropTypes.array,
  }

  static defaultProps = {
    authorName: '',
    currentTestId: '',
    owner: false,
    testItemId: '',
    isPlaylist: false,
    standards: [],
  }

  state = {
    isOpenModal: false,
    isDeleteModalOpen: false,
    title: '',
  }

  moveToItem = (e) => {
    e && e.stopPropagation()
    const { history, item, isPlaylist, isTestRecommendation } = this.props
    const source = isTestRecommendation ? 'Recommendation' : 'Library'
    if (isPlaylist) {
      history.push({
        pathname: `/author/playlists/${item._id}`,
        hash: 'review',
        state: {
          assessmentAssignedFrom: source,
        },
      })
    } else {
      const tab = item.title ? 'review' : 'description'
      history.push({
        pathname: `/author/tests/tab/${tab}/id/${item._id}`,
        state: {
          editTestFlow: true,
          assessmentAssignedFrom: source,
          isDynamicTest:
            item?.testCategory === test.testCategoryTypes.DYNAMIC_TEST,
        },
      })
    }
  }

  duplicate = (cloneOption) => {
    const { item, duplicateTest } = this.props
    const { _id, title } = item || {}
    if (_id && title) {
      duplicateTest({
        _id,
        title,
        redirectToNewTest: true,
        cloneItems: cloneOption,
      })
    }
  }

  onDelete = async (e) => {
    e && e.stopPropagation()
    this.setState({ isDeleteModalOpen: true })
  }

  setTitle = (value) => {
    this.setState({ title: value })
  }

  assignTest = (e) => {
    e?.stopPropagation()
    const {
      history,
      item,
      isFreeAdmin,
      isSAWithoutSchools,
      toggleAdminAlertModal,
      emailVerified,
      verificationTS,
      isDefaultDA,
      toggleVerifyEmailModal,
      orgCollections,
      isTestRecommendation,
    } = this.props
    if (isTestRecommendation && !this.state.isOpenModal) {
      segmentApi.genericEventTrack('Recommended_TestClick', {})
    }
    const { collections = [] } = item
    const sparkMathId = orgCollections?.find(
      (x) => x.name.toLowerCase() === 'spark math'
    )?._id
    const selectedCollections = collections.map((x) => x._id)
    const source = isTestRecommendation ? 'Recommendation' : 'Library'
    let expiryDate
    if (!emailVerified && verificationTS && !isDefaultDA) {
      const existingVerificationTS = new Date(verificationTS)
      expiryDate = new Date(
        existingVerificationTS.setDate(existingVerificationTS.getDate() + 14)
      ).getTime()
    }
    if (isFreeAdmin || isSAWithoutSchools) toggleAdminAlertModal()
    else if (expiryDate && expiryDate < Date.now() && !isDefaultDA) {
      toggleVerifyEmailModal(true)
    } else
      history.push({
        pathname: `/author/assignments/${item._id}`,
        state: {
          from: 'testLibrary',
          fromText: 'Test Library',
          toUrl: '/author/tests',
          isSparkMathCollection: selectedCollections.includes(sparkMathId),
          assessmentAssignedFrom: source,
          assessmentTestCategory: item?.testCategory,
        },
      })
  }

  closeModal = () => {
    this.setState({ isOpenModal: false })
  }

  openModal = (source) => {
    const {
      item: { testCategory = '' },

      setAISuiteAlertModalVisibility,
      isRedirectToVQAddOn,
    } = this.props

    if (getIsBuyAiSuiteAlertModalVisible(testCategory, isRedirectToVQAddOn)) {
      setAISuiteAlertModalVisibility(true)
      return
    }
    if (this.props.isTestRecommendation && source !== 'more') {
      segmentApi.genericEventTrack('Recommended_TestClick', {})
    }
    this.setState({ isOpenModal: true })
  }

  hidePreviewModal = () => {
    const { setIsTestPreviewVisible } = this.props
    setIsTestPreviewVisible(false)
    this.setState({ currentTestId: '' })
  }

  showPreviewModal = (testId, e) => {
    e && e.stopPropagation()
    const {
      setIsTestPreviewVisible,
      item: { testCategory = '' },
      isRedirectToVQAddOn,
      setAISuiteAlertModalVisibility,
    } = this.props
    // here

    if (getIsBuyAiSuiteAlertModalVisible(testCategory, isRedirectToVQAddOn)) {
      setAISuiteAlertModalVisibility(true)
      return
    }

    setIsTestPreviewVisible(true)
    this.setState({ currentTestId: testId })
    if (this.props.isTestRecommendation && !this.state.isOpenModal) {
      segmentApi.genericEventTrack('Recommended_TestClick', {})
    }
  }

  get name() {
    const {
      item: { createdBy = {} },
    } = this.props
    return `${createdBy.firstName} ${createdBy.lastName}`
  }

  onDeleteModelCancel = () => {
    this.setState({ isDeleteModalOpen: false })
  }

  onApprove = (newCollections = []) => {
    const {
      item: { _id: testId },
      approveOrRejectSingleTestRequest,
    } = this.props
    approveOrRejectSingleTestRequest({
      testId,
      status: 'published',
      collections: newCollections,
    })
  }

  onReject = () => {
    const {
      item: { _id: testId },
      approveOrRejectSingleTestRequest,
    } = this.props
    approveOrRejectSingleTestRequest({ testId, status: 'rejected' })
  }

  handleLikeTest = (e) => {
    e.stopPropagation()
    const { item, toggleTestLikeRequest, isTestLiked } = this.props
    toggleTestLikeRequest({
      contentId: item._id,
      contentType: 'TEST',
      toggleValue: !isTestLiked,
      versionId: item.versionId,
    })
  }

  handleGotoMyPlaylist = () => {
    const { previouslyUsedPlaylistClone, useThisPlayList } = this.props
    if (previouslyUsedPlaylistClone) {
      const {
        _id,
        title,
        grades,
        subjects,
        customize = null,
        authors,
      } = previouslyUsedPlaylistClone
      useThisPlayList({
        _id,
        title,
        grades,
        subjects,
        authors,
        customize,
        fromUseThis: true,
      })
    }
  }

  handleCreateNewCopy = () => this.handleUseThisClick({ forceClone: true })

  handleUseThisClick = ({ forceClone = false, customTitle = '' }) => {
    const { item, useThisPlayList, cloneThisPlayList } = this.props
    const { title, grades, subjects, customize = null, authors } = item._source
    if (customTitle !== '') {
      cloneThisPlayList({
        _id: item._id,
        title: customTitle,
        grades,
        subjects,
        customize,
        fromUseThis: true,
        authors,
        forceClone,
      })
    } else {
      useThisPlayList({
        _id: item._id,
        title,
        grades,
        subjects,
        customize,
        fromUseThis: true,
        authors,
        forceClone,
      })
    }
  }

  handleCloseCustomTitleModal = () =>
    this.props.setCustomTitleModalVisible(false)

  render() {
    const {
      item: {
        title,
        tags = [],
        _source = {},
        thumbnail,
        _id: testId,
        collections = [],
        summary = {},
        sharedType,
        isDocBased,
        videoUrl,
      },
      orgCollections = [],
      item,
      authorName,
      isPlaylist,
      testItemId,
      windowWidth,
      standards = [],
      orgData: { itemBanks },
      isPublisherUser,
      userRole,
      currentUserId,
      isTestLiked,
      duplicatePlayList,
      isPreviewModalVisible,
      useThisPlayList,
      history,
      isOrganizationDistrictUser,
      isUseThisLoading,
      isUsedModalVisible,
      setIsUsedModalVisible,
      customTitleModalVisible,
      previouslyUsedPlaylistClone,
      isTestRecommendation,
    } = this.props
    const showUsedModal =
      isUsedModalVisible &&
      previouslyUsedPlaylistClone?.derivedFrom?._id === item._id
    const showCustomTitleModal =
      customTitleModalVisible && previouslyUsedPlaylistClone?._id === item._id
    const { status, analytics = [] } = isPlaylist ? _source : item
    const likes = analytics?.[0]?.likes || '0'
    const usage = analytics?.[0]?.usage || '0'
    const { isOpenModal, currentTestId, isDeleteModalOpen } = this.state
    const standardsIdentifiers = isPlaylist
      ? flattenPlaylistStandards(_source?.modules)
      : standards.map((_item) => _item.identifier)

    const collectionName = getTestCollectionName(
      itemBanks,
      collections,
      sharedType
    )

    const btnStyle = {
      margin: '0px',
      padding: '5px 10px',
    }

    const showPremiumTag =
      isPremiumContent(collections) &&
      showPremiumLabelOnContent(
        isPlaylist ? _source.collections : collections,
        orgCollections
      ) &&
      !isPublisherUser &&
      !(_source?.createdBy?._id === currentUserId)
    const authors = isPlaylist ? _source.authors : item.authors
    const isOwner = (authors || []).find((x) => x._id === currentUserId)
    const allowDuplicate =
      allowDuplicateCheck(
        isPlaylist ? _source.collections : collections,
        orgCollections,
        isPlaylist ? 'playList' : 'test'
      ) || isOwner

    const isDynamicTest =
      !isPlaylist &&
      (item?.testCategory === test.testCategoryTypes.DYNAMIC_TEST ||
        // TODO: fallback conditions to be removed after migration for testCategory
        item?.itemGroups?.some(
          (group) =>
            group.type === test.ITEM_GROUP_TYPES.AUTOSELECT ||
            group.deliveryType === test.ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
        ))

    const cardViewProps = {
      _source,
      _id: item._id,
      status,
      collections,
      showPremiumTag,
      tags,
      usage,
      standardsIdentifiers,
      authorName,
      testItemId,
      thumbnail,
      btnStyle,
      userRole,
      testId,
      title,
      collectionName,
      isDocBased,
      summary,
      isDynamicTest,
      openModal: this.openModal,
      moveToItem: this.moveToItem,
      assignTest: this.assignTest,
      showPreviewModal: this.showPreviewModal,
      handleLikeTest: this.handleLikeTest,
      likes,
      isTestLiked,
      allowDuplicate,
      duplicatePlayList,
      history,
      useThisPlayList,
      isPublisherUser,
      isOrganizationDistrictUser,
      isUseThisLoading,
      isTestRecommendation,
      videoUrl,
    }

    const CardViewComponent = isPlaylist ? PlaylistCard : TestItemCard

    return (
      <>
        {isOpenModal && (
          <ViewModal
            isShow={isOpenModal}
            close={this.closeModal}
            onDuplicate={this.duplicate}
            onEdit={this.moveToItem}
            onDelete={this.onDelete}
            onReject={this.onReject}
            onApprove={this.onApprove}
            item={item}
            status={status}
            owner={isOwner}
            assign={this.assignTest}
            isPlaylist={isPlaylist}
            windowWidth={windowWidth}
            allowDuplicate={allowDuplicate}
            previewLink={(e) => this.showPreviewModal(testId, e)}
            isDynamicTest={isDynamicTest}
            handleLikeTest={this.handleLikeTest}
            isTestLiked={isTestLiked}
            collectionName={collectionName}
          />
        )}

        {/* Both conditions required so that preview model will trigger unmount */}
        {isPreviewModalVisible && currentTestId && (
          <TestPreviewModal
            isModalVisible={isPreviewModalVisible}
            testId={currentTestId}
            showStudentPerformance
            closeTestPreviewModal={this.hidePreviewModal}
            resetOnClose={() => {
              this.setState({ currentTestId: '' })
            }}
            unmountOnClose
          />
        )}
        {isDeleteModalOpen ? (
          <DeleteItemModal
            isVisible={isDeleteModalOpen}
            onCancel={this.onDeleteModelCancel}
            testId={item._id}
            test={item}
            view="testLibrary"
          />
        ) : null}

        {showUsedModal ? (
          <CloneOnUsePlaylistConfirmationModal
            isVisible={isUsedModalVisible}
            onCancel={() => setIsUsedModalVisible(false)}
            handleGotoMyPlaylist={this.handleGotoMyPlaylist}
            handleCreateNewCopy={this.handleCreateNewCopy}
          />
        ) : null}
        <CardViewComponent {...cardViewProps} />
        {showCustomTitleModal && (
          <CustomTitleOnCloneModal
            isVisible={customTitleModalVisible}
            onCancel={this.handleCloseCustomTitleModal}
            handleCreateNewCopy={this.handleUseThisClick}
            title={this.state.title}
            setTitle={this.setTitle}
          />
        )}
      </>
    )
  }
}

const enhance = compose(
  withNamespaces('author'),
  connect(
    (state) => ({
      orgData: getOrgDataSelector(state),
      orgCollections: getCollectionsSelector(state),
      isPublisherUser: isPublisherUserSelector(state),
      userRole: getUserRole(state),
      currentUserId: getUserId(state),
      isFreeAdmin: isFreeAdminSelector(state),
      isSAWithoutSchools: isSAWithoutSchoolsSelector(state),
      isPreviewModalVisible: getIsPreviewModalVisibleSelector(state),
      isOrganizationDistrictUser: isOrganizationDistrictUserSelector(state),
      isUseThisLoading: getIsUseThisLoading(state),
      emailVerified: getEmailVerified(state),
      verificationTS: getVerificationTS(state),
      isDefaultDA: isDefaultDASelector(state),
      isUsedModalVisible: state.curriculumSequence?.isUsedModalVisible,
      previouslyUsedPlaylistClone:
        state.curriculumSequence?.previouslyUsedPlaylistClone,
      customTitleModalVisible:
        state.curriculumSequence?.customTitleModalVisible,
      isVideoQuizAndAiEnabled: isVideoQuizAndAIEnabledSelector(state),
      isRedirectToVQAddOn: isRedirectToVQAddOnSelector(state),
    }),
    {
      approveOrRejectSingleTestRequest: approveOrRejectSingleTestRequestAction,
      toggleTestLikeRequest: toggleTestLikeAction,
      duplicatePlayList: duplicatePlaylistRequestAction,
      duplicateTest: duplicateTestRequestAction,
      toggleAdminAlertModal: toggleAdminAlertModalAction,
      toggleVerifyEmailModal: toggleVerifyEmailModalAction,
      setIsTestPreviewVisible: setIsTestPreviewVisibleAction,
      useThisPlayList: useThisPlayListAction,
      cloneThisPlayList: cloneThisPlayListAction,
      setIsUsedModalVisible: setIsUsedModalVisibleAction,
      setCustomTitleModalVisible: setCustomTitleModalVisibleAction,
    }
  )
)

export default enhance(Item)
