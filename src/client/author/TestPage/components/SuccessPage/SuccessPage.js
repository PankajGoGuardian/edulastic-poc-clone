import { themeColor, darkGrey } from '@edulastic/colors'
import {
  EduButton,
  EduIf,
  FlexContainer,
  notification,
} from '@edulastic/common'
import {
  test as TEST,
  testTypes as testTypesConstants,
  collections as collectionsConstant,
} from '@edulastic/constants'
import { IconLock, IconPencilEdit } from '@edulastic/icons'
import { Divider, Tooltip } from 'antd'
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
  setShareWithGCInProgressAction,
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
  removeTestEntityAction,
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
import { setUserAction } from '../../../../student/Login/ducks'

const { statusConstants, passwordPolicy } = TEST
const { TEST_TYPES } = testTypesConstants
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
      userId,
      setShareWithGCInProgress,
      user,
      setUser,
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
        setShareWithGCInProgress(true) // disable sync with GC button in LCB
        this.timer = setTimeout(() => {
          this.toggleShareWithGC()
          setShareWithGCInProgress(false)
          clearTimeout(this.timer)
        }, timeLeft) // this will enable button after 60 seconds from assignment created.
      }
    }
    localStorage.setItem(
      `recommendedTest:${userId}:isContentUpdatedAutomatically`,
      true
    )
    const temp = user
    temp.recommendedContentUpdated = true
    setUser(temp)
  }

  componentWillUnmount() {
    const { isAssignSuccess, isAsyncAssign, removeTestEntity } = this.props
    this.timer && clearTimeout(this.timer)
    if (isAssignSuccess || isAsyncAssign) removeTestEntity()
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
      if (!assignment._id)
        return notification({
          type: 'info',
          msg: 'Please try to launch LCB from assignment page',
        })
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
      isAsyncAssign,
      history,
      location,
      regradedAssignments,
      isPlaylist,
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
        <EduIf
          condition={[isAssignSuccess, isRegradeSuccess, isAsyncAssign].some(
            (val) => val
          )}
        >
          <EduButton
            isBlue
            isGhost
            data-cy="assignButton"
            onClick={() =>
              history.push(isPlaylist ? `/author/${toUrl}` : toUrl)
            }
          >
            {`Return to ${fromText}`}
          </EduButton>
        </EduIf>
        <AuthorCompleteSignupButton
          renderButton={(handleClick) => (
            <Tooltip
              title={
                isAsyncAssign
                  ? 'Assigning is In Progress. You wil get notification on completion.'
                  : ''
              }
              placement="bottom"
            >
              <span>
                <EduButton
                  isBlue
                  data-cy="assignButton"
                  onClick={handleClick}
                  disabled={isAsyncAssign}
                >
                  {[isAssignSuccess, isRegradeSuccess, isAsyncAssign].some(
                    (val) => val
                  )
                    ? 'Go to Live Classboard'
                    : 'ASSIGN'}
                </EduButton>
              </span>
            </Tooltip>
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

  getAssignSuccessMessage = ({
    moduleTitle,
    title,
    assignment,
    assignmentStatus,
  }) => {
    if (TEST_TYPES.COMMON.includes(assignment.testType)) {
      return `Test ${moduleTitle || title} has been assigned to students in ${
        assignment.class.length
      } classes/groups.`
    }
    return `${
      moduleTitle || title
    } has been assigned in ${assignmentStatus} status.`
  }

  getContentBasedOnOpenPolicy = ({
    openPolicy,
    assignmentStatus,
    startDate,
  }) => {
    let content =
      'Your students can begin work on this assessment once it is opened by you from Live Class Board.'
    if (openPolicy === AUTOMATICALLY_ON_START_DATE) {
      if (assignmentStatus === 'In-Progress') {
        content = 'Your students can begin work on this assessment right away.'
      } else if (startDate) {
        content = `Your students can begin work on this assessment on ${moment(
          startDate
        ).format('Do MMM, YYYY (hh:mm A)')}.`
      } else {
        content =
          'Your students can begin work on this assessment on assigned date and time.'
      }
    }
    return content
  }

  render() {
    const {
      test,
      isPlaylist,
      playlist,
      isAssignSuccess,
      isRegradeSuccess,
      isAsyncAssign,
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
    const isOwnerAndNotAsyncAssign = isOwner && !isAsyncAssign
    const breadCrumbTitleForAssignFlow = `${
      isAssignSuccess || isAsyncAssign ? 'ASSIGN' : 'PUBLISH'
    }`

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
        title: breadCrumbTitleForAssignFlow,
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
        title: breadCrumbTitleForAssignFlow,
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
          to: isPlaylist ? `/author/${toUrl}` : toUrl,
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
        <EduIf condition={isShareModalVisible}>
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
            derivedFromPremiumBankId={test?.derivedFromPremiumBankId}
          />
        </EduIf>

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
            isAssignSuccess={[
              isAssignSuccess,
              isRegradeSuccess,
              isAsyncAssign,
            ].some((val) => val)}
          >
            <EduIf
              condition={[
                isAssignSuccess,
                isRegradeSuccess,
                isAsyncAssign,
                published,
              ].some((val) => val)}
            >
              <FlexContainerWrapperLeft>
                <ImageCard
                  _source={isPlaylist ? playlist : test}
                  isPlaylist={isPlaylist}
                  collections={collections}
                  contentData={contentData}
                />
              </FlexContainerWrapperLeft>
            </EduIf>
            <FlexContainerWrapperRight
              isAssignSuccess={[
                isAssignSuccess,
                isRegradeSuccess,
                isAsyncAssign,
              ].some((val) => val)}
            >
              <EduIf condition={isAsyncAssign}>
                <FlexTitle>Success!</FlexTitle>
                <FlexTextWrapper isAsyncAssign={isAsyncAssign}>
                  Assigning is In Progress. You wil get notification on
                  completion.
                </FlexTextWrapper>
                <Divider />
              </EduIf>
              <EduIf condition={isAssignSuccess}>
                <FlexTitle>Success!</FlexTitle>
                <FlexTextWrapper>
                  {this.getAssignSuccessMessage({
                    moduleTitle,
                    title,
                    assignment,
                    assignmentStatus,
                  })}
                </FlexTextWrapper>
                {assignment.passwordPolicy ===
                passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC ? (
                  <FlexText style={{ textAlign: 'justify' }}>
                    Your students cannot work on this assignment yet. This
                    assignment requires students to enter a password before they
                    can work on the assignment. The auto-generated password is
                    time sensitive and will be revealed to the teacher or the
                    proctor when the assignment is opened. when students are
                    ready, click on the &gt; Open button to view the password,
                    announce to students and make the assignment available for
                    the student to work on.
                  </FlexText>
                ) : TEST_TYPES.COMMON.includes(assignment.testType) ? (
                  <FlexText>
                    You can monitor student progress and responses using the
                    Live Class Board &nbsp;
                    <span
                      onClick={this.handleAssign}
                      style={{ color: themeColor, cursor: 'pointer' }}
                    >
                      Click here
                    </span>
                  </FlexText>
                ) : (
                  <FlexText>
                    <FlexText>
                      {this.getContentBasedOnOpenPolicy({
                        openPolicy,
                        assignmentStatus,
                        startDate: currentClass?.startDate,
                      })}
                    </FlexText>
                    You can monitor student progress and responses using the
                    Live Class Board &nbsp;
                    <span
                      onClick={this.handleAssign}
                      style={{ color: themeColor, cursor: 'pointer' }}
                    >
                      Click here
                    </span>
                    &nbsp;to navigate to the Live Class Board
                  </FlexText>
                )}
                <Divider />
              </EduIf>
              <EduIf condition={isRegradeSuccess}>
                <FlexTitle>Success!</FlexTitle>
                <FlexTextWrapper>
                  Regrade request for <b>{title}</b> is raised.
                </FlexTextWrapper>
                <FlexText>
                  New changes will be reflecting in all selected assignment once
                  the regrade process is completed.
                </FlexText>
                <Divider />
              </EduIf>
              <EduIf condition={published}>
                <FlexTitle>Success!</FlexTitle>
                <FlexTextWrapper>
                  {title} has been published and has been added to your private
                  library.
                </FlexTextWrapper>
                <FlexText>
                  You can assign this to your students to begin working on this
                  test by clicking on the &nbsp;
                  <span
                    onClick={this.handleAssign}
                    style={{ color: themeColor, cursor: 'pointer' }}
                  >
                    Assign
                  </span>{' '}
                  button
                </FlexText>
                <Divider />
              </EduIf>
              <EduIf condition={isOwnerAndNotAsyncAssign}>
                <FlexTitle>Share With Others</FlexTitle>
                <FlexTextWrapper>
                  {title}&nbsp;has been added to your&nbsp;
                  {this.getHighPriorityShared} Library.
                </FlexTextWrapper>
              </EduIf>
              <FlexShareContainer>
                <EduIf condition={isOwnerAndNotAsyncAssign}>
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
                </EduIf>
                <EduIf condition={isOwnerAndNotAsyncAssign}>
                  <FlexText
                    style={{
                      fontSize: '13px',
                      marginBottom: '35px',
                      color: darkGrey,
                    }}
                  >
                    Click on&nbsp;
                    <span
                      onClick={this.onShareModalChange}
                      style={{ color: themeColor, cursor: 'pointer' }}
                    >
                      Edit
                    </span>
                    &nbsp;button to share it with your colleagues.
                  </FlexText>
                </EduIf>
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
      user: get(state, 'user.user', {}),
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
      setShareWithGCInProgress: setShareWithGCInProgressAction,
      setUser: setUserAction,
      removeTestEntity: removeTestEntityAction,
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
