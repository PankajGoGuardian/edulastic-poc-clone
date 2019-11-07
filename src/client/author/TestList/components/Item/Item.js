import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { IconHeart, IconShare, IconUser } from "@edulastic/icons";
import { Button } from "antd";
import { assignmentApi } from "@edulastic/api";
import { cardTitleColor } from "@edulastic/colors";
import {
  Container,
  Inner,
  Footer,
  Author,
  AuthorName,
  Header,
  Stars,
  StyledLink,
  TestInfo,
  LikeIcon,
  ShareIcon,
  AuthorWrapper,
  IconText,
  ButtonWrapper,
  TagsWrapper,
  PlaylistId,
  StatusRow,
  Qcount
} from "./styled";
import Tags from "../../../src/components/common/Tags";
import ViewModal from "../ViewModal";
import TestPreviewModal from "../../../Assignments/components/Container/TestPreviewModal";
import { TestStatus, EdulasticVerified } from "../ListItem/styled";

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
    testItemId: "",
    item: {}
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
      item: {
        title,
        tags = [],
        analytics,
        _source,
        thumbnail,
        status,
        _id: testId,
        description,
        collectionName = "",
        summary = {}
      },
      item,
      authorName,
      owner,
      isPlaylist,
      testItemId,
      windowWidth,
      standards
    } = this.props;
    const standardsIdentifiers = standards.map(item => item.identifier);
    const likes = analytics?.[0]?.likes || "0";
    const usage = analytics?.[0]?.usage || "0";
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
          windowWidth={windowWidth}
        />
        <TestPreviewModal
          isModalVisible={isPreviewModalVisible}
          testId={currentTestId}
          closeTestPreviewModal={this.hidePreviewModal}
        />
        <Container
          isPlaylist={isPlaylist}
          src={isPlaylist ? _source.thumbnail : thumbnail}
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
              {(collectionName === "edulastic_certified" || collectionName === "engage_ny") && (
                <EdulasticVerified width={30} height={30} />
              )}
            </Header>
          }
        >
          <TestInfo>
            <StyledLink title={title}>{isPlaylist ? _source.title : title}</StyledLink>
            <TagsWrapper>
              <Tags showInline show={2} tags={standardsIdentifiers} key="standards" isStandards />
              <Tags showInline show={2} tags={tags} key="tags" />
            </TagsWrapper>
          </TestInfo>

          <Inner>
            <StatusRow>
              <Qcount>
                <span>Item(s):</span>
                <span>{summary.totalItems}</span>
              </Qcount>
              {!isPlaylist && (
                <TestStatus status={status} view="tile">
                  {status}
                </TestStatus>
              )}
            </StatusRow>
          </Inner>
          <Footer>
            {authorName && (
              <Author>
                <AuthorWrapper>
                  <IconUser color={cardTitleColor} /> &nbsp;
                  <AuthorName title={authorName}>{authorName}</AuthorName>
                </AuthorWrapper>
              </Author>
            )}
            {testItemId ? <PlaylistId># {testItemId}</PlaylistId> : null}
            {status !== "draft" && (
              <>
                <ShareIcon>
                  <IconShare color={cardTitleColor} width={14} height={14} /> &nbsp;
                  <IconText>{usage}</IconText>
                </ShareIcon>
                <LikeIcon>
                  <IconHeart color={cardTitleColor} width={14} height={14} /> &nbsp;
                  <IconText>{likes}</IconText>
                </LikeIcon>
              </>
            )}
          </Footer>
        </Container>
      </>
    );
  }
}

export default withNamespaces("author")(Item);
