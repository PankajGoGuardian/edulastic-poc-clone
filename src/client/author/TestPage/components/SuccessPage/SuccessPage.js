import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { get } from "lodash";
import { test } from "@edulastic/constants";
import {
  receiveTestByIdAction,
  getTestSelector,
  getUserListSelector as getTestSharedListSelector
} from "../../../TestPage/ducks";

import ListHeader from "../../../src/components/common/ListHeader";
import {
  Container,
  AssignButton,
  SecondHeader,
  FlexContainerWrapper,
  FlexContainerWrapperLeft,
  FlexContainerWrapperRight,
  FlexTitle,
  FlexTextWrapper,
  FlexText,
  FlexShareContainer,
  FlexShareTitle,
  FlexShareBox,
  FlexShareWithBox,
  IconWrapper,
  TitleCopy,
  ShareUrlDiv,
  ImageWrapper
} from "./styled";
import {
  getPlaylistSelector,
  receivePlaylistByIdAction,
  getUserListSelector as getPlayListSharedListSelector
} from "../../../PlaylistPage/ducks";
import BreadCrumb from "../../../src/components/Breadcrumb";
import { IconPencilEdit, IconLock } from "@edulastic/icons";
import { themeColor } from "@edulastic/colors";
import ShareModal from "../../../src/components/common/ShareModal";
import { Divider } from "antd";
import { receiveAssignmentByAssignmentIdAction } from "../../../src/actions/assignments";
import { getCurrentAssignmentSelector } from "../../../src/selectors/assignments";

const { statusConstants, passwordPolicy } = test;

const sharedWithPriorityOrder = ["Public", "District", "School"];

class SuccessPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShareModalVisible: false
    };
  }

  componentDidMount() {
    const { fetchTestByID, match, isPlaylist, fetchPlaylistById, isAssignSuccess, fetchAssignmentById } = this.props;
    const { id: testId, assignmentId } = match.params;
    if (isPlaylist) {
      fetchPlaylistById(match.params.playlistId);
    } else {
      if (testId) {
        fetchTestByID(testId);
      }
    }
    if (isAssignSuccess) {
      fetchAssignmentById(assignmentId);
    }
  }

  handleAssign = () => {
    const { test, history, isAssignSuccess, isRegradeSuccess } = this.props;
    const { _id } = test;
    if (isAssignSuccess || isRegradeSuccess) {
      history.push(`/author/assignments`);
    } else {
      history.push(`/author/assignments/${_id}`);
    }
  };

  onShareModalChange = () => {
    this.setState({
      isShareModalVisible: !this.state.isShareModalVisible
    });
  };

  renderHeaderButton = () => {
    const { isAssignSuccess, isPlaylist, isRegradeSuccess } = this.props;
    return (
      <AssignButton data-cy="assignButton" onClick={this.handleAssign} color="secondary" variant="create" shadow="none">
        {isAssignSuccess || isRegradeSuccess ? "VIEW RESPONSE" : "ASSIGN"}
      </AssignButton>
    );
  };

  get getHighPriorityShared() {
    const { isPlaylist, playListSharedUsersList, testSharedUsersList } = this.props;
    const sharedUserList = isPlaylist ? playListSharedUsersList : testSharedUsersList;
    const mapSharedByType = sharedUserList.map(item => item.sharedType);
    let sharedWith = "Private";
    for (let level of sharedWithPriorityOrder) {
      if (mapSharedByType.includes(level.toUpperCase())) {
        sharedWith = level;
        break;
      }
    }
    return `${sharedWith} Library`;
  }

  render() {
    const { test, isPlaylist, playlist, isAssignSuccess, isRegradeSuccess, assignment = {}, userId } = this.props;
    const { isShareModalVisible } = this.state;
    const { title, _id, status, thumbnail, scoring = {}, grades, subjects, authors = [], summary = {} } = isPlaylist
      ? playlist
      : test;
    const totalPoints = isPlaylist ? scoring.total : summary.totalPoints;
    const shareUrl = `${window.location.origin}/author/${isPlaylist ? "playlists" : "tests"}/${_id}`;
    const currentClass = (assignment.class && assignment.class[0]) || {};
    const assignmentStatus = currentClass.startDate < Date.now() || currentClass.open ? "IN PROGRESS" : "NOT OPEN";
    const isOwner = authors.some(o => o._id === userId);
    const playlistBreadCrumbData = [
      {
        title: "PLAY LIST",
        to: "/author/playlists"
      },
      {
        title: `${title}`,
        to: `/author/playlists/${_id}#review`
      },
      {
        title: `${isAssignSuccess ? "ASSIGN" : "PUBLISH"}`,
        to: ""
      }
    ];

    let hasPremiumQuestion = false;
    if (!isPlaylist) {
      const { testItems = [] } = test;
      hasPremiumQuestion = testItems.some(x => !!x.collectionName);
    }
    const breadCrumbData = [
      {
        title: "TEST LIBRARY",
        to: "/author/tests"
      },
      {
        title: `${title}`,
        to: `/author/tests/${_id}#review`
      },
      {
        title: `${isAssignSuccess ? "ASSIGN" : "PUBLISH"}`,
        to: ""
      }
    ];
    const gradeSubject = { grades, subjects };
    return (
      <div>
        <ShareModal
          isVisible={isShareModalVisible}
          testId={_id}
          hasPremiumQuestion={hasPremiumQuestion}
          isPublished={status === statusConstants.PUBLISHED}
          onClose={this.onShareModalChange}
          gradeSubject={gradeSubject}
        />
        <ListHeader title={title} renderButton={this.renderHeaderButton} />

        <Container>
          <SecondHeader>
            <BreadCrumb data={isPlaylist ? playlistBreadCrumbData : breadCrumbData} style={{ position: "unset" }} />
          </SecondHeader>
          <FlexContainerWrapper isAssignSuccess={isAssignSuccess || isRegradeSuccess}>
            {(isAssignSuccess || isRegradeSuccess) && (
              <FlexContainerWrapperLeft>
                <ImageWrapper imgUrl={thumbnail} />
                <FlexShareWithBox width={"100%"}>
                  <b>Total Points</b> &nbsp; {totalPoints}
                </FlexShareWithBox>
              </FlexContainerWrapperLeft>
            )}
            <FlexContainerWrapperRight isAssignSuccess={isAssignSuccess || isRegradeSuccess}>
              {isAssignSuccess && (
                <>
                  <FlexTitle>Success!</FlexTitle>
                  <FlexTextWrapper>
                    Assignment <b>{title}</b>&nbsp; has been assigned in &nbsp;<b>{assignmentStatus}</b> &nbsp; status
                  </FlexTextWrapper>
                  {assignment.passwordPolicy === passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC ? (
                    <FlexText style={{ textAlign: "justify" }}>
                      Your students cannot work on this assignment yet. This assignment requires students to enter a
                      password before they can work on the assignment. The auto-generated password is time sensitive and
                      will be revealed to the teacher or the proctor when the assignment is opened. when students are
                      ready, click on the > Open button to view the password, announce to students and make the
                      assignment available for the student to work on.
                    </FlexText>
                  ) : (
                    <FlexText>
                      Your students can begin work on this assessment right away.You can monitor student progress and
                      responses by clicking on the &nbsp;
                      <span style={{ color: themeColor }}>View Response</span>&nbsp; button.
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
                    New changes will be reflecting in all selected assignment once the regrade process is completed.
                  </FlexText>
                  <Divider />
                </>
              )}
              {isOwner && (
                <>
                  <FlexTitle>Share With Others</FlexTitle>
                  <FlexTextWrapper>
                    <b>{title}</b>&nbsp;has been added to your&nbsp;<b>{this.getHighPriorityShared}</b>.
                  </FlexTextWrapper>
                  <FlexText>
                    Click on &nbsp;
                    <span onClick={this.onShareModalChange} style={{ color: themeColor, cursor: "pointer" }}>
                      Edit
                    </span>
                    &nbsp;icon to share it with your colleagues.
                  </FlexText>
                </>
              )}
              <FlexShareContainer>
                {isOwner && (
                  <>
                    <FlexShareTitle>Shared With</FlexShareTitle>
                    <FlexShareWithBox>
                      <IconWrapper>
                        <IconLock />
                      </IconWrapper>
                      <FlexText>{this.getHighPriorityShared}</FlexText>
                      <IconWrapper onClick={this.onShareModalChange}>
                        <IconPencilEdit color={themeColor} />
                      </IconWrapper>
                    </FlexShareWithBox>
                  </>
                )}

                <FlexShareTitle>Share</FlexShareTitle>
                <FlexShareBox>
                  <TitleCopy copyable={{ text: shareUrl }}>
                    <ShareUrlDiv title={shareUrl}>{shareUrl}</ShareUrlDiv>
                  </TitleCopy>
                </FlexShareBox>
              </FlexShareContainer>
            </FlexContainerWrapperRight>
          </FlexContainerWrapper>
        </Container>
      </div>
    );
  }
}

const enhance = compose(
  withRouter,
  connect(
    state => ({
      playlist: getPlaylistSelector(state),
      test: getTestSelector(state),
      userId: get(state, "user.user._id", ""),
      assignment: getCurrentAssignmentSelector(state),
      playListSharedUsersList: getPlayListSharedListSelector(state),
      testSharedUsersList: getTestSharedListSelector(state)
    }),
    {
      fetchAssignmentById: receiveAssignmentByAssignmentIdAction,
      fetchPlaylistById: receivePlaylistByIdAction,
      fetchTestByID: receiveTestByIdAction
    }
  )
);
export default enhance(SuccessPage);

SuccessPage.propTypes = {
  match: PropTypes.object.isRequired,
  isAssignSuccess: PropTypes.bool,
  isRegradeSuccess: PropTypes.bool,
  test: PropTypes.object,
  playlist: PropTypes.object,
  fetchPlaylistById: PropTypes.func.isRequired,
  fetchTestByID: PropTypes.func.isRequired
};
