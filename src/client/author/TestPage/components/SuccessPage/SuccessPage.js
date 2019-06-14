import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { receiveTestByIdAction, getTestSelector } from "../../../TestPage/ducks";

import ListHeader from "../../../src/components/common/ListHeader";
import {
  Container,
  AssignButton,
  SecondHeader,
  FlexContainerWrapper,
  FlexTitle,
  FlexTextWrapper,
  FlexText,
  FlexShareContainer,
  FlexShareTitle,
  FlexShareBox,
  FlexShareWithBox,
  IconWrapper,
  TitleCopy
} from "./styled";
import { getPlaylistSelector, receivePlaylistByIdAction } from "../../../PlaylistPage/ducks";
import BreadCrumb from "../../../src/components/Breadcrumb";
import { IconPencilEdit, IconLock } from "@edulastic/icons";
import { blue } from "@edulastic/colors";
import ShareModal from "../../../src/components/common/ShareModal";

const statusConstants = {
  DRAFT: "draft",
  ARCHIVED: "archived",
  PUBLISHED: "published"
};

class SuccessPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShareModalVisible: false
    };
  }

  componentDidMount() {
    const { fetchTestByID, match, isPlaylist, fetchPlaylistById } = this.props;
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
    const { testItem, history } = this.props;
    const { _id } = testItem;
    history.push(`/author/assignments/${_id}`);
  };

  onShareModalChange = () => {
    this.setState({
      isShareModalVisible: !this.state.isShareModalVisible
    });
  };

  renderHeaderButton = () => (
    <AssignButton data-cy="assignButton" onClick={this.handleAssign} color="secondary" variant="create" shadow="none">
      ASSIGN
    </AssignButton>
  );

  render() {
    const { testItem, isPlaylist, playlist } = this.props;
    const { isShareModalVisible } = this.state;
    const { title, _id, sharing, status } = isPlaylist ? playlist : testItem;
    let sharedWith = ((sharing ? sharing[0] : {}) || {}).type;
    let shareUrl = window.location.href.split("publish")[0];
    const playlistBreadCrumbData = [
      {
        title: "PLAY LIST",
        to: "/author/playlists"
      },
      {
        title: `${title}`,
        to: `/author/playlists/${_id}`
      },
      {
        title: `PUBLISH`,
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
        to: `/author/tests/${_id}`
      },
      {
        title: `PUBLISH`,
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
        <ListHeader title={title} btnTitle="ASSIGN" renderButton={this.renderHeaderButton} />

        <Container>
          <SecondHeader>
            <BreadCrumb data={isPlaylist ? playlistBreadCrumbData : breadCrumbData} style={{ position: "unset" }} />
          </SecondHeader>
          <FlexContainerWrapper>
            <FlexTitle>Share With Others</FlexTitle>
            <FlexTextWrapper>
              <b>{title}</b>&nbsp; has been added to your &nbsp;<b> Private Library</b>
            </FlexTextWrapper>
            <FlexText>
              Click on &nbsp;<span style={{ color: blue }}>Edit</span>&nbsp; icon to share it with your colleagues
            </FlexText>
            <FlexShareContainer>
              <FlexShareTitle>Shared With</FlexShareTitle>
              <FlexShareWithBox>
                <IconWrapper>
                  <IconLock />
                </IconWrapper>
                <FlexText>{sharedWith || ""}</FlexText>
                <IconWrapper onClick={this.onShareModalChange}>
                  <IconPencilEdit color={blue} />
                </IconWrapper>
              </FlexShareWithBox>
              <FlexShareTitle>Share</FlexShareTitle>
              <FlexShareBox>
                <TitleCopy copyable>{shareUrl}</TitleCopy>
              </FlexShareBox>
            </FlexShareContainer>
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
      testItem: getTestSelector(state)
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
  testItem: PropTypes.object,
  playlist: PropTypes.object,
  fetchPlaylistById: PropTypes.func.isRequired,
  fetchTestByID: PropTypes.func.isRequired
};
