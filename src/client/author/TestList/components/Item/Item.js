import React, { Component } from "react";
import PropTypes from "prop-types";

import { darkGrey } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { IconHeart, IconShare, IconUser, IconId, IconDraft } from "@edulastic/icons";
import { Button } from "antd";
import { assignmentApi } from "@edulastic/api";
import {
  Container,
  Inner,
  CardDescription,
  Footer,
  Author,
  AuthorName,
  Header,
  Stars,
  StyledLink,
  Question,
  LikeIcon,
  ShareIcon,
  AuthorWrapper,
  IconText,
  ButtonWrapper,
  DraftIconWrapper,
  EllipsisWrapper
} from "./styled";
import Tags from "../../../src/components/common/Tags";
import ViewModal from "../ViewModal";
import TestPreviewModal from "../../../Assignments/components/Container/TestPreviewModal";

class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    authorName: PropTypes.string,
    owner: PropTypes.bool,
    testItemId: PropTypes.string
  };

  static defaultProps = {
    authorName: "",
    currentTestId: "",
    owner: false,
    isPreviewModalVisible: false,
    testItemId: ""
  };

  state = {
    isOpenModal: false
  };

  moveToItem = e => {
    e && e.stopPropagation();
    const { history, item, isPlaylist } = this.props;
    if (isPlaylist) {
      history.push(`/author/playlists/${item._id}#review`);
    } else {
      history.push(`/author/tests/${item._id}#review`);
    }
  };

  duplicate = async e => {
    e && e.stopPropagation();
    const { history, item } = this.props;
    const duplicateTest = await assignmentApi.duplicateAssignment(item);
    history.push(`/author/tests/${duplicateTest._id}`);
  };

  assignTest = e => {
    e && e.stopPropagation();
    const { history, item } = this.props;
    history.push(`/author/assignments/${item._id}`);
  };

  closeModal = () => {
    this.setState({ isOpenModal: false });
  };

  openModal = () => {
    this.setState({ isOpenModal: true });
  };

  hidePreviewModal = () => {
    this.setState({ isPreviewModalVisible: false });
  };

  showPreviewModal = (testId, e) => {
    e && e.stopPropagation();
    this.setState({ isPreviewModalVisible: true, currentTestId: testId });
  };

  get name() {
    const {
      item: { createdBy = {} }
    } = this.props;
    return `${createdBy.firstName} ${createdBy.lastName}`;
  }

  render() {
    const {
      item: { title, tags = [], analytics, _source, thumbnail, status, _id: testId, description },
      item,
      authorName,
      owner,
      isPlaylist,
      testItemId,
      likes = analytics ? analytics[0].likes : "0",
      usage = analytics ? analytics[0].usage : "0"
    } = this.props;
    const { isOpenModal, currentTestId, isPreviewModalVisible } = this.state;
    return (
      <>
        <ViewModal
          isShow={isOpenModal}
          close={this.closeModal}
          onDuplicate={this.duplicate}
          onEdit={this.moveToItem}
          item={item}
          status={status}
          owner={owner}
          assign={this.assignTest}
          isPlaylist={isPlaylist}
        />
        <TestPreviewModal
          isModalVisible={isPreviewModalVisible}
          testId={currentTestId}
          hideModal={this.hidePreviewModal}
        />
        <Container
          onClick={isPlaylist ? this.moveToItem : this.openModal}
          title={
            <Header src={isPlaylist ? _source.thumbnail : thumbnail}>
              <Stars />
              <ButtonWrapper className="showHover">
                {owner && status === "draft" && (
                  <Button onClick={this.moveToItem} type="primary">
                    Edit
                  </Button>
                )}

                {status === "draft" && (
                  <Button type="primary" onClick={this.duplicate}>
                    duplicate
                  </Button>
                )}
                {status === "published" && (
                  <Button type="primary" onClick={e => this.showPreviewModal(testId, e)}>
                    Preview
                  </Button>
                )}
                {status === "published" && (
                  <Button type="primary" onClick={this.assignTest}>
                    Assign
                  </Button>
                )}
              </ButtonWrapper>
            </Header>
          }
        >
          <Inner>
            <Question>
              <StyledLink title={title}>{isPlaylist ? _source.title : title}</StyledLink>
            </Question>
            <CardDescription title={isPlaylist ? _source.description : description}>
              <EllipsisWrapper>{isPlaylist ? _source.description : description}</EllipsisWrapper>
            </CardDescription>
            {!isPlaylist && <Tags tags={tags} />}
          </Inner>
          <Footer>
            {authorName && (
              <Author>
                <IconText>Created by</IconText>

                <AuthorWrapper>
                  <IconUser /> &nbsp;
                  <AuthorName title={authorName}>{authorName}</AuthorName>
                </AuthorWrapper>
              </Author>
            )}
            {status !== "draft" && (
              <>
                <ShareIcon>
                  <IconShare color={darkGrey} width={14} height={14} /> &nbsp;
                  <IconText>{usage}</IconText>
                </ShareIcon>
                <LikeIcon>
                  <IconHeart color={darkGrey} width={14} height={14} /> &nbsp;
                  <IconText>{likes}</IconText>
                </LikeIcon>
              </>
            )}
            {status === "draft" && (
              <DraftIconWrapper>
                <IconDraft /> &nbsp;
                <IconText>In Draft</IconText>
              </DraftIconWrapper>
            )}
          </Footer>
        </Container>
      </>
    );
  }
}

export default withNamespaces("author")(Item);
