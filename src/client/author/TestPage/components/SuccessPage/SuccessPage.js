import { themeColor, darkGrey } from '@edulastic/colors'
import { EduButton, FlexContainer } from '@edulastic/common'
import {
  test as TEST,
  collections as collectionsConstant,
} from '@edulastic/constants'
import { IconLock, IconPencilEdit } from '@edulastic/icons'
import { Divider } from 'antd'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { hasUserGotAccessToPremiumItem } from '../../../dataUtils'
import {
  getPlaylistSelector,
  getUserListSelector as getPlayListSharedListSelector,
  receivePlaylistByIdAction,
} from '../../../PlaylistPage/ducks'
import {
  receiveAssignmentByAssignmentIdAction,
  googleSyncAssignmentAction,
} from '../../../src/actions/assignments'
import BreadCrumb from '../../../src/components/Breadcrumb'
import ListHeader from '../../../src/components/common/ListHeader'
import ShareModal from '../../../src/components/common/ShareModal'
import {
  getCurrentAssignmentSelector,
  getAssignmentSyncInProgress,
} from '../../../src/selectors/assignments'
import { getCollectionsSelector } from '../../../src/selectors/user'
import {
  getTestSelector,
  getUserListSelector as getTestSharedListSelector,
  receiveTestByIdAction,
} from '../../ducks'
import {
  Container,
  FlexContainerWrapper,
  FlexContainerWrapperLeft,
  FlexContainerWrapperRight,
  FlexShareBox,
  FlexShareContainer,
  FlexShareTitle,
  FlexShareWithBox,
  FlexText,
  FlexTextWrapper,
  FlexTitle,
  IconWrapper,
  SecondHeader,
  ShareUrlDiv,
  TitleCopy,
  FlexWrapperUrlBox,
  FlexWrapperClassroomBox,
  FlexTitleBox,
  FlexShareMessage,
} from './styled'

import ImageCard from './ImageCard'
import { getAssignmentsSelector, fetchAssignmentsAction } from '../Assign/ducks'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'

const { statusConstants, passwordPolicy, type: _testTypes } = TEST
const { nonPremiumCollectionsToShareContent } = collectionsConstant

const sharedWithPriorityOrder = ['Public', 'District', 'School']
const AUTOMATICALLY_ON_START_DATE = 'Automatically on Start Date'

class SuccessPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShareModalVisible: false,
      shareWithGCEnable: true,
    }
  }

  componentDidMount() {
    const {
      fetchTestByID,
      match,
      isPlaylist,
      fetchPlaylistById,
      isAssignSuccess,
      fetchAssignmentById,
      isRegradeSuccess,
      fetchAssignmentsByTestId,
      autoShareGCAssignment,
      history,
    } = this.props
    const { id: testId, assignmentId } = match.params
    if (isPlaylist) {
      fetchPlaylistById(match.params.playlistId)
    } else if (testId) {
      fetchTestByID(testId)
    }
    if (isAssignSuccess) {
      fetchAssignmentById(assignmentId)
    } else if (isRegradeSuccess) {
      fetchAssignmentsByTestId({ testId, regradeAssignments: true })
    }
    const { createdAt, googleId } = history.location
      ? history.location.state || {}
      : {}
    if (autoShareGCAssignment && !googleId && createdAt) {
      const timeLeft = 60000 - (new Date().getTime() - createdAt)
      if (timeLeft > 0) {
        this.toggleShareWithGC() // disable google share button
        this.timer = setTimeout(() => {
          this.toggleShareWithGC()
          clearTimeout(this.timer)
        }, timeLeft) // this will enable button after 60 seconds from assignment created.
      }
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  handleAssign = () => {
    const {
      test,
      history,
      isAssignSuccess,
      isRegradeSuccess,
      regradedAssignments,
      assignment: _assignment,
    } = this.props
    const { _id } = test
    const assignment = isAssignSuccess
      ? _assignment
      : isRegradeSuccess
      ? regradedAssignments[0]
      : {}
    if (isAssignSuccess || isRegradeSuccess) {
      history.push(
        `/author/classboard/${assignment._id}/${assignment.class?.[0]?._id}`
      )
    } else {
      history.push(`/author/assignments/${_id}`)
    }
  }

  onShareModalChange = () => {
    this.setState((prevState) => ({
      isShareModalVisible: !prevState.isShareModalVisible,
    }))
  }

  toggleShareWithGC = () => {
    this.setState((prevState) => ({
      shareWithGCEnable: !prevState.shareWithGCEnable,
    }))
  }

  renderHeaderButton = () => {
    const {
      isAssignSuccess,
      isRegradeSuccess,
      history,
      location,
      regradedAssignments,
    } = this.props
    const { fromText, toUrl } = location.state || {
      fromText: 'Assignments',
      toUrl: '/author/assignments',
    }
    if (isRegradeSuccess && !regradedAssignments.length) {
      return null
    }
    return (
      <>
        {(isAssignSuccess || isRegradeSuccess) && (
          <EduButton
            isBlue
            isGhost
            data-cy="assignButton"
            onClick={() => history.push(toUrl)}
          >
            {`Return to ${fromText}`}
          </EduButton>
        )}
        <AuthorCompleteSignupButton
          renderButton={(handleClick) => (
            <EduButton isBlue data-cy="assignButton" onClick={handleClick}>
              {isAssignSuccess || isRegradeSuccess
                ? 'Go to Live Classboard'
                : 'ASSIGN'}
            </EduButton>
          )}
          onClick={this.handleAssign}
        />
      </>
    )
  }

  shareWithGoogleClassroom = () => {
    const { googleSyncAssignment, match } = this.props
    const { assignmentId } = match.params
    googleSyncAssignment({
      assignmentIds: [assignmentId],
    })
  }

  get getHighPriorityShared() {
    const {
      isPlaylist,
      playListSharedUsersList,
      testSharedUsersList,
    } = this.props
    const sharedUserList = isPlaylist
      ? playListSharedUsersList
      : testSharedUsersList
    const mapSharedByType = sharedUserList.map((item) => item.sharedType)
    let sharedWith = 'Private'
    for (const level of sharedWithPriorityOrder) {
      if (mapSharedByType.includes(level.toUpperCase())) {
        sharedWith = level
        break
      }
    }
    return sharedWith
  }

  render() {
    const {
      test,
      isPlaylist,
      playlist,
      isAssignSuccess,
      isRegradeSuccess,
      assignment = {},
      userId,
      collections,
      published,
      history,
      syncWithGoogleClassroomInProgress,
      classList,
    } = this.props

    const { isShareModalVisible, shareWithGCEnable } = this.state
    const { title, _id, status, grades, subjects, authors = [] } = isPlaylist
      ? playlist
      : test
    let shareUrl = ''
    if (this.getHighPriorityShared === 'Public' && !isPlaylist) {
      shareUrl = `${window.location.origin}/public/view-test/${_id}`
    } else if (isPlaylist) {
      shareUrl = `${window.location.origin}/author/playlists/${_id}`
    } else {
      shareUrl = `${window.location.origin}/author/tests/verid/${test?.versionId}`
    }
    const currentClass = (assignment.class && assignment.class[0]) || {}
    const assignmentStatus =
      currentClass.startDate < Date.now() || currentClass.open
        ? 'In-Progress'
        : 'Not-Open'
    const isOwner = authors.some((o) => o._id === userId)
    const playlistBreadCrumbData = [
      {
        title: 'MY PLAYLIST',
        to: '/author/playlists',
      },
      {
        title: `${title}`,
        to: `/author/playlists/${_id}#review`,
      },
      {
        title: `${isAssignSuccess ? 'ASSIGN' : 'PUBLISH'}`,
        to: '',
      },
    ]

    let hasPremiumQuestion = false
    if (!isPlaylist) {
      const { itemGroups = [] } = test
      const testItems = (itemGroups || []).flatMap(
        (itemGroup) => itemGroup.items || []
      )
      const premiumOrgCollections = collections.filter(
        ({ _id: id }) =>
          !Object.keys(nonPremiumCollectionsToShareContent).includes(id)
      )
      hasPremiumQuestion = !!testItems.find((i) =>
        hasUserGotAccessToPremiumItem(i.collections, premiumOrgCollections)
      )
    }

    const breadCrumbData = [
      {
        title: 'TEST LIBRARY',
        to: '/author/tests',
      },
      {
        title: `${title}`,
        to: `/author/tests/${_id}#review`,
      },
      {
        title: `${isAssignSuccess ? 'ASSIGN' : 'PUBLISH'}`,
        to: '',
      },
    ]
    const gradeSubject = { grades, subjects }

    const getBreadcrumbData = () => {
      const data = isPlaylist ? playlistBreadCrumbData : breadCrumbData
      if (this.props.location.state?.fromText) {
        const { fromText, toUrl } = this.props.location.state
        data[0] = {
          title: fromText,
          to: toUrl,
        }
      }
      return data
    }

    const contentData = {}
    if (
      isAssignSuccess &&
      isPlaylist &&
      history.location.state &&
      history.location.state.playlistModuleId
    ) {
      const { playlistModuleId: assignedPlaylistModuleId, assignedTestId } =
        history.location.state || {}
      // if test from playlist  was assigned then show test details in /assign/ page
      if (assignedTestId) {
        contentData.title = assignment.title
        const _module = playlist.modules?.find(
          (m) => m?._id === assignedPlaylistModuleId
        )
        contentData.standardIdentifiers = _module?.data?.find(
          (d) => d?.contentId === assignedTestId
        )?.standardIdentifiers
      } else {
        // else module was assigned then show module details
        const _module = playlist.modules?.find(
          (m) => m?._id === assignedPlaylistModuleId
        )
        contentData.title = _module?.title
        contentData.standardIdentifiers = _module?.data?.flatMap(
          (d) => d?.standardIdentifiers
        )
      }
    }

    const { playlistModuleId: assignedPlaylistModuleId } =
      history.location.state || {}
    const _module = playlist.modules?.find(
      (m) => m?._id === assignedPlaylistModuleId
    )
    const moduleTitle = _module?.title || ''
    let isGoogleClassroomAssigned = false
    const { openPolicy, class: clazz = [] } = assignment
    // check if any group assigned is google group
    const assignedClassIds = clazz.map((o) => o._id)
    if (classList.find((o) => assignedClassIds.includes(o._id) && o.googleId)) {
      isGoogleClassroomAssigned = true
    }
    return (
      <div>
        <ShareModal
          shareLabel="TEST URL"
          isVisible={isShareModalVisible}
          isPlaylist={isPlaylist}
          testId={_id}
          hasPremiumQuestion={hasPremiumQuestion}
          isPublished={status === statusConstants.PUBLISHED}
          onClose={this.onShareModalChange}
          gradeSubject={gradeSubject}
          testVersionId={test?.versionId}
        />
        <ListHeader
          title={(_module && _module.title) || title}
          renderButton={this.renderHeaderButton}
        />

        <Container>
          <SecondHeader>
            <BreadCrumb
              data={getBreadcrumbData()}
              style={{ position: 'unset' }}
            />
          </SecondHeader>
          <FlexContainerWrapper
            isAssignSuccess={isAssignSuccess || isRegradeSuccess}
          >
            {(isAssignSuccess || isRegradeSuccess || published) && (
              <FlexContainerWrapperLeft>
                <ImageCard
                  _source={isPlaylist ? playlist : test}
                  isPlaylist={isPlaylist}
                  collections={collections}
                  contentData={contentData}
                />
              </FlexContainerWrapperLeft>
            )}
            <FlexContainerWrapperRight
              isAssignSuccess={isAssignSuccess || isRegradeSuccess}
            >
              {isAssignSuccess && (
                <>
                  <FlexTitle>Success!</FlexTitle>
                  <FlexTextWrapper>
                    {assignment.testType === _testTypes.COMMON
                      ? `Test ${
                          moduleTitle || title
                        } has been assigned to students in ${
                          assignment.class.length
                        } classes/groups.`
                      : `${
                          moduleTitle || title
                        } has been assigned in ${assignmentStatus} status.`}
                  </FlexTextWrapper>
                  {assignment.passwordPolicy ===
                  passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC ? (
                    <FlexText style={{ textAlign: 'justify' }}>
                      Your students cannot work on this assignment yet. This
                      assignment requires students to enter a password before
                      they can work on the assignment. The auto-generated
                      password is time sensitive and will be revealed to the
                      teacher or the proctor when the assignment is opened. when
                      students are ready, click on the &gt; Open button to view
                      the password, announce to students and make the assignment
                      available for the student to work on.
                    </FlexText>
                  ) : assignment.testType === _testTypes.COMMON ? (
                    <FlexText>
                      You can monitor student progress and responses by clicking
                      on the &nbsp;
                      <span
                        onClick={this.handleAssign}
                        style={{ color: themeColor, cursor: 'pointer' }}
                      >
                        Go to Live Class Board
                      </span>
                    </FlexText>
                  ) : (
                    <FlexText>
                      <FlexText>
                        {`Your students can begin work on this assessment ${
                          openPolicy === AUTOMATICALLY_ON_START_DATE
                            ? assignmentStatus === 'In-Progress'
                              ? 'right away'
                              : `on ${
                                  currentClass?.startDate
                                    ? moment(currentClass.startDate).format(
                                        'Do MMM, YYYY (hh:mm A)'
                                      )
                                    : 'assigned date and time'
                                }`
                            : 'once it is opened by you from Live Class Board'
                        }.`}
                      </FlexText>
                      You can monitor student progress and responses by clicking
                      on the &nbsp;
                      <span
                        onClick={this.handleAssign}
                        style={{ color: themeColor, cursor: 'pointer' }}
                      >
                        Go to Live Class Board
                      </span>
                      &nbsp; button.
                    </FlexText>
                  )}
                  <Divider />
                </>
              )}
              {isRegradeSuccess && (
                <>
                  <FlexTitle>Success!</FlexTitle>
                  <FlexTextWrapper>
                    Regrade request for <b>{title}</b> is raised.
                  </FlexTextWrapper>
                  <FlexText>
                    New changes will be reflecting in all selected assignment
                    once the regrade process is completed.
                  </FlexText>
                  <Divider />
                </>
              )}
              {published && (
                <>
                  <FlexTitle>Success!</FlexTitle>
                  <FlexTextWrapper>
                    {title} has been published and has been added to your
                    private library.
                  </FlexTextWrapper>
                  <FlexText>
                    You can assign this to your students to begin working on
                    this test by clicking on the &nbsp;
                    <span
                      onClick={this.handleAssign}
                      style={{ color: themeColor, cursor: 'pointer' }}
                    >
                      Assign
                    </span>{' '}
                    button
                  </FlexText>
                  <Divider />
                </>
              )}
              {isOwner && (
                <>
                  <FlexTitle>Share With Others</FlexTitle>
                  <FlexTextWrapper>
                    {title}&nbsp;has been added to your&nbsp;
                    {this.getHighPriorityShared} Library.
                  </FlexTextWrapper>
                </>
              )}
              <FlexShareContainer>
                {isOwner && (
                  <>
                    <FlexShareTitle>Shared With</FlexShareTitle>
                    <FlexShareWithBox
                      style={{
                        lineHeight: '40px',
                        alignItems: 'center',
                        padding: '0 17px',
                      }}
                    >
                      <FlexContainer>
                        <IconWrapper>
                          <IconLock />
                        </IconWrapper>
                        <FlexText
                          style={{ margin: '0 0 0 17px', fontWeight: '500' }}
                        >
                          {this.getHighPriorityShared} Library
                        </FlexText>
                      </FlexContainer>
                      <IconWrapper onClick={this.onShareModalChange}>
                        <IconPencilEdit color={themeColor} />
                        <FlexText
                          style={{
                            color: themeColor,
                            margin: '0 0 0 10px',
                            fontSize: '11px',
                          }}
                        >
                          EDIT
                        </FlexText>
                      </IconWrapper>
                    </FlexShareWithBox>
                  </>
                )}
                {isOwner && (
                  <FlexText
                    style={{
                      fontSize: '13px',
                      marginBottom: '35px',
                      color: darkGrey,
                    }}
                  >
                    Click on &nbsp;
                    <span
                      onClick={this.onShareModalChange}
                      style={{ color: themeColor, cursor: 'pointer' }}
                    >
                      Edit
                    </span>
                    &nbsp;button to share it with your colleagues.
                  </FlexText>
                )}
                <FlexWrapperUrlBox>
                  <FlexShareTitle>Url to Share</FlexShareTitle>
                  <FlexShareBox>
                    <TitleCopy copyable={{ text: shareUrl }}>
                      <ShareUrlDiv title={shareUrl}>{shareUrl}</ShareUrlDiv>
                    </TitleCopy>
                  </FlexShareBox>
                </FlexWrapperUrlBox>
                {isAssignSuccess && isGoogleClassroomAssigned && (
                  <FlexWrapperClassroomBox>
                    <FlexTitleBox>
                      <FlexShareTitle>
                        Share with Google Classroom
                      </FlexShareTitle>
                      <FlexShareMessage>
                        Click on Google Classroom button to share the assignment
                      </FlexShareMessage>
                    </FlexTitleBox>
                    <EduButton
                      isGhost
                      data-cy="Share with Google Classroom"
                      onClick={this.shareWithGoogleClassroom}
                      disabled={
                        syncWithGoogleClassroomInProgress || !shareWithGCEnable
                      }
                    >
                      Google Classroom
                    </EduButton>
                  </FlexWrapperClassroomBox>
                )}
              </FlexShareContainer>
            </FlexContainerWrapperRight>
          </FlexContainerWrapper>
        </Container>
      </div>
    )
  }
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      playlist: getPlaylistSelector(state),
      test: getTestSelector(state),
      userId: get(state, 'user.user._id', ''),
      autoShareGCAssignment: get(
        state,
        'user.user.orgData.autoShareGCAssignment',
        false
      ),
      assignment: getCurrentAssignmentSelector(state),
      playListSharedUsersList: getPlayListSharedListSelector(state),
      testSharedUsersList: getTestSharedListSelector(state),
      collections: getCollectionsSelector(state),
      regradedAssignments: getAssignmentsSelector(state),
      syncWithGoogleClassroomInProgress: getAssignmentSyncInProgress(state),
      classList: get(state, 'user.user.orgData.classList', []),
    }),
    {
      fetchAssignmentById: receiveAssignmentByAssignmentIdAction,
      fetchAssignmentsByTestId: fetchAssignmentsAction,
      fetchPlaylistById: receivePlaylistByIdAction,
      fetchTestByID: receiveTestByIdAction,
      googleSyncAssignment: googleSyncAssignmentAction,
    }
  )
)
export default enhance(SuccessPage)

SuccessPage.propTypes = {
  match: PropTypes.object.isRequired,
  isAssignSuccess: PropTypes.bool,
  isRegradeSuccess: PropTypes.bool,
  test: PropTypes.object,
  playlist: PropTypes.object,
  fetchPlaylistById: PropTypes.func.isRequired,
  fetchTestByID: PropTypes.func.isRequired,
}

SuccessPage.defaultProps = {
  isAssignSuccess: false,
  isRegradeSuccess: false,
  test: {},
  playlist: {},
}
