import { themeColor, darkGrey } from "@edulastic/colors";
import { EduButton, FlexContainer } from "@edulastic/common";
import { test } from "@edulastic/constants";
import { IconLock, IconPencilEdit } from "@edulastic/icons";
import { Divider } from "antd";
import { get } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { hasUserGotAccessToPremiumItem } from "../../../dataUtils";
import {
  getPlaylistSelector,
  getUserListSelector as getPlayListSharedListSelector,
  receivePlaylistByIdAction
} from "../../../PlaylistPage/ducks";
import { receiveAssignmentByAssignmentIdAction } from "../../../src/actions/assignments";
import BreadCrumb from "../../../src/components/Breadcrumb";
import ListHeader from "../../../src/components/common/ListHeader";
import ShareModal from "../../../src/components/common/ShareModal";
import { getCurrentAssignmentSelector } from "../../../src/selectors/assignments";
import { getCollectionsSelector } from "../../../src/selectors/user";
import { getTestSelector, getUserListSelector as getTestSharedListSelector, receiveTestByIdAction } from "../../ducks";
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
  FlexWrapperUrlBox
} from "./styled";

import ImageCard from "./ImageCard";

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
    const { test, history, isAssignSuccess, isRegradeSuccess, assignment } = this.props;
    const { _id } = test;
    if (isAssignSuccess || isRegradeSuccess) {
      history.push(`/author/classboard/${assignment._id}/${assignment.class?.[0]?._id}`);
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
    const { isAssignSuccess, isPlaylist, isRegradeSuccess, history, location } = this.props;
    const { fromText, toUrl } = location.state || {};
    return (
      <>
        {(isAssignSuccess || isRegradeSuccess) && (
          <EduButton isGhost data-cy="assignButton" onClick={() => history.push(toUrl)}>
            {`Return to ${fromText}`}
          </EduButton>
        )}
        <EduButton data-cy="assignButton" onClick={this.handleAssign}>
          {isAssignSuccess || isRegradeSuccess ? "Go to Live Classboard" : "ASSIGN"}
        </EduButton>
      </>
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
    const {
      test,
      isPlaylist,
      playlist,
      isAssignSuccess,
      isRegradeSuccess,
      assignment = {},
      userId,
      collections,
      published
    } = this.props;
    const { isShareModalVisible } = this.state;
    const { title, _id, status, grades, subjects, authors = [] } = isPlaylist ? playlist : test;
    const shareUrl = `${window.location.origin}/author/${isPlaylist ? "playlists" : "tests"}/${_id}`;
    const currentClass = (assignment.class && assignment.class[0]) || {};
    const assignmentStatus = currentClass.startDate < Date.now() || currentClass.open ? "In-Progress" : "Not-Open";
    const isOwner = authors.some(o => o._id === userId);
    const playlistBreadCrumbData = [
      {
        title: "MY PLAYLIST",
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
      hasPremiumQuestion = !!testItems.find(i => hasUserGotAccessToPremiumItem(i.collections, collections));
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

    const getBreadcrumbData = () => {
      const data = isPlaylist ? playlistBreadCrumbData : breadCrumbData;
      if (this.props.location.state?.fromText) {
        const { fromText, toUrl } = this.props.location.state;
        data[0] = {
          title: fromText,
          to: toUrl
        };
      }
      return data;
    };

    return (
      <div>
        <ShareModal
          shareLabel={"TEST URL"}
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
            <BreadCrumb data={getBreadcrumbData()} style={{ position: "unset" }} />
          </SecondHeader>
          <FlexContainerWrapper isAssignSuccess={isAssignSuccess || isRegradeSuccess}>
            {(isAssignSuccess || isRegradeSuccess || published) && (
              <FlexContainerWrapperLeft>
                <ImageCard _source={isPlaylist ? playlist : test} isPlaylist={isPlaylist} collections={collections} />
              </FlexContainerWrapperLeft>
            )}
            <FlexContainerWrapperRight isAssignSuccess={isAssignSuccess || isRegradeSuccess}>
              {isAssignSuccess && (
                <>
                  <FlexTitle>Success!</FlexTitle>
                  <FlexTextWrapper>
                    {title}&nbsp; has been assigned in&nbsp;{assignmentStatus}&nbsp;status.
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
                      <FlexText>Your students can begin work on this assessment right away.</FlexText>
                      You can monitor student progress and responses by clicking on the &nbsp;
                      <span onClick={this.handleAssign} style={{ color: themeColor, cursor: "pointer" }}>
                        View Response
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
                    New changes will be reflecting in all selected assignment once the regrade process is completed.
                  </FlexText>
                  <Divider />
                </>
              )}
              {published && (
                <>
                  <FlexTitle>Success!</FlexTitle>
                  <FlexTextWrapper>
                    {title} has been published and has been added to your private library.
                  </FlexTextWrapper>
                  <FlexText>
                    You can assign this to your students to begin working on this test by clicking on the &nbsp;
                    <span onClick={this.handleAssign} style={{ color: themeColor, cursor: "pointer" }}>
                      Assign
                    </span>{" "}
                    button
                  </FlexText>
                  <Divider />
                </>
              )}
              {isOwner && (
                <>
                  <FlexTitle>Share With Others</FlexTitle>
                  <FlexTextWrapper>
                    {title}&nbsp;has been added to your&nbsp;{this.getHighPriorityShared}.
                  </FlexTextWrapper>
                </>
              )}
              <FlexShareContainer>
                {isOwner && (
                  <>
                    <FlexShareTitle>Shared With</FlexShareTitle>
                    <FlexShareWithBox style={{ lineHeight: "40px", alignItems: "center", padding: "0 17px" }}>
                      <FlexContainer>
                        <IconWrapper>
                          <IconLock />
                        </IconWrapper>
                        <FlexText style={{ margin: "0 0 0 17px", fontWeight: "500" }}>
                          {this.getHighPriorityShared}
                        </FlexText>
                      </FlexContainer>
                      <IconWrapper onClick={this.onShareModalChange}>
                        <IconPencilEdit color={themeColor} />
                        <FlexText style={{ color: themeColor, margin: "0 0 0 10px", fontSize: "11px" }}>EDIT</FlexText>
                      </IconWrapper>
                    </FlexShareWithBox>
                  </>
                )}
                {isOwner && (
                  <FlexText style={{ fontSize: "13px", marginBottom: "35px", color: darkGrey }}>
                    Click on &nbsp;
                    <span onClick={this.onShareModalChange} style={{ color: themeColor, cursor: "pointer" }}>
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
      testSharedUsersList: getTestSharedListSelector(state),
      collections: getCollectionsSelector(state)
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
