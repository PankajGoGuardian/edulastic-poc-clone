import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
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
import { blue } from "@edulastic/colors";
import ShareModal from "../../../src/components/common/ShareModal";
import { Divider } from "antd";

const statusConstants = {
  DRAFT: "draft",
  ARCHIVED: "archived",
  PUBLISHED: "published"
};

const sharedWithPriorityOrder = ["Public", "District", "School"];

class SuccessPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShareModalVisible: false
    };
  }

  componentDidMount() {
    const { fetchTestByID, match, isPlaylist, fetchPlaylistById, isAssignSuccess } = this.props;
    const { id: testId } = match.params;
    if (isPlaylist) {
      fetchPlaylistById(match.params.playlistId);
    } else {
      if (testId) {
        fetchTestByID(testId);
      }
    }
  }

  handleAssign = () => {
    const { test, history, isAssignSuccess } = this.props;
    const { _id } = test;
    if (isAssignSuccess) {
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
    const { isAssignSuccess, isPlaylist } = this.props;
    return (
      !isPlaylist && (
        <AssignButton
          data-cy="assignButton"
          onClick={this.handleAssign}
          color="secondary"
          variant="create"
          shadow="none"
        >
          {isAssignSuccess ? "VIEW RESPONSE" : "ASSIGN"}
        </AssignButton>
      )
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
    const { test, isPlaylist, playlist, isAssignSuccess } = this.props;
    const { isShareModalVisible } = this.state;
    const { title, _id, status, thumbnail, scoring = {} } = isPlaylist ? playlist : test;
    const shareUrl = `${window.location.origin}/author/${isPlaylist ? "playlists" : "tests"}/${_id}`;
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
    return (
      <div>
        <ShareModal
          isVisible={isShareModalVisible}
          testId={_id}
          isPublished={status === statusConstants.PUBLISHED}
          onClose={this.onShareModalChange}
        />
        <ListHeader title={title} renderButton={this.renderHeaderButton} />

        <Container>
          <SecondHeader>
            <BreadCrumb data={isPlaylist ? playlistBreadCrumbData : breadCrumbData} style={{ position: "unset" }} />
          </SecondHeader>
          <FlexContainerWrapper isAssignSuccess={isAssignSuccess}>
            {isAssignSuccess && (
              <FlexContainerWrapperLeft>
                <ImageWrapper imgUrl={thumbnail} />
                <FlexShareWithBox width={"100%"}>
                  <b>Total Points</b> &nbsp; {scoring.total}
                </FlexShareWithBox>
              </FlexContainerWrapperLeft>
            )}
            <FlexContainerWrapperRight isAssignSuccess={isAssignSuccess}>
              {isAssignSuccess && (
                <>
                  <FlexTitle>Success!</FlexTitle>
                  <FlexTextWrapper>
                    <b>{title}</b>&nbsp; has been assigned in &nbsp;<b>{"In Progress"}</b> &nbsp; status
                  </FlexTextWrapper>
                  <FlexText>
                    Your students can begin work on this assessment right away.You can monitor student progress and
                    responses by clicking on the &nbsp;
                    <span style={{ color: blue }}>View Response</span>&nbsp; button.
                  </FlexText>
                  <Divider />
                </>
              )}
              <FlexTitle>Share With Others</FlexTitle>
              <FlexTextWrapper>
                <b>{title}</b>&nbsp;has been added to your&nbsp;<b>{this.getHighPriorityShared}</b>.
              </FlexTextWrapper>
              <FlexText>
                Click on&nbsp;
                <span onClick={this.onShareModalChange} style={{ color: blue, cursor: "pointer" }}>
                  Edit
                </span>
                &nbsp;icon to share it with your colleagues.
              </FlexText>
              <FlexShareContainer>
                <FlexShareTitle>Shared With</FlexShareTitle>
                <FlexShareWithBox>
                  <IconWrapper>
                    <IconLock />
                  </IconWrapper>
                  <FlexText>{this.getHighPriorityShared}</FlexText>
                  <IconWrapper onClick={this.onShareModalChange}>
                    <IconPencilEdit color={blue} />
                  </IconWrapper>
                </FlexShareWithBox>
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
      playListSharedUsersList: getPlayListSharedListSelector(state),
      testSharedUsersList: getTestSharedListSelector(state)
    }),
    {
      fetchPlaylistById: receivePlaylistByIdAction,
      fetchTestByID: receiveTestByIdAction
    }
  )
);
export default enhance(SuccessPage);

SuccessPage.propTypes = {
  match: PropTypes.object.isRequired,
  isAssignSuccess: PropTypes.bool,
  test: PropTypes.object,
  playlist: PropTypes.object,
  fetchPlaylistById: PropTypes.func.isRequired,
  fetchTestByID: PropTypes.func.isRequired
};
