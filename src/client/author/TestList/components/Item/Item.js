import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
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
  Qcount,
  StyledDesc,
  PremiumLabel,
  MidRow,
  Collection,
  ThinLine
} from "./styled";
import Tags from "../../../src/components/common/Tags";
import ViewModal from "../ViewModal";
import TestPreviewModal from "../../../Assignments/components/Container/TestPreviewModal";
import { TestStatus, EdulasticVerified } from "../ListItem/styled";
import { getAuthorCollectionMap } from "../../../dataUtils";
import { DeleteItemModal } from "../DeleteItemModal/deleteItemModal";
import { approveOrRejectSingleTestRequestAction } from "../../ducks";

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
    isOpenModal: false,
    isDeleteModalOpen: false
  };

  moveToItem = e => {
    e && e.stopPropagation();
    const { history, item, isPlaylist } = this.props;
    if (isPlaylist) {
      history.push(`/author/playlists/${item._id}#review`);
    } else {
      history.push(`/author/tests/tab/review/id/${item._id}`);
    }
  };

  duplicate = async e => {
    e && e.stopPropagation();
    const { history, item } = this.props;
    const duplicateTest = await assignmentApi.duplicateAssignment(item);
    history.push(`/author/tests/${duplicateTest._id}`);
  };

  onDelete = async e => {
    e && e.stopPropagation();
    this.setState({ isDeleteModalOpen: true });
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

  onDeleteModelCancel = () => {
    this.setState({ isDeleteModalOpen: false });
  };

  onApprove = () => {
    const {
      item: { _id: testId },
      approveOrRejectSingleTestRequestAction
    } = this.props;
    approveOrRejectSingleTestRequestAction({ testId, status: "published" });
  };

  onReject = () => {
    const {
      item: { _id: testId },
      approveOrRejectSingleTestRequestAction
    } = this.props;
    approveOrRejectSingleTestRequestAction({ testId, status: "rejected" });
  };

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
        collections = [],
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
    const { isOpenModal, currentTestId, isPreviewModalVisible, isDeleteModalOpen } = this.state;

    return (
      <>
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
        {isDeleteModalOpen ? (
          <DeleteItemModal isVisible={isDeleteModalOpen} onCancel={this.onDeleteModelCancel} testId={item._id} />
        ) : null}
        <Container
          isPlaylist={isPlaylist}
          src={isPlaylist ? _source.thumbnail : thumbnail}
          onClick={isPlaylist ? this.moveToItem : this.openModal}
          title={
            <Header src={isPlaylist ? _source.thumbnail : thumbnail}>
              <Stars isPlaylist={isPlaylist} />
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
              {collections.find(o => o.name === "Edulastic Certified") &&
                getAuthorCollectionMap(false, 30, 30)["edulastic_certified"].icon}
              {!!collections.length && !isPlaylist && <PremiumLabel>$ PREMIUM</PremiumLabel>}
            </Header>
          }
        >
          <TestInfo isPlaylist={isPlaylist}>
            <StyledLink title={title}>{isPlaylist ? _source.title : title}</StyledLink>
            {isPlaylist && <StyledDesc title={_source.description}>{_source.description}</StyledDesc>}
            {!isPlaylist && (
              <TagsWrapper>
                <Tags show={2} tags={standardsIdentifiers} key="standards" isStandards />
                <Tags show={2} tags={tags} key="tags" />
              </TagsWrapper>
            )}
          </TestInfo>

          {!isPlaylist && (
            <MidRow>
              <Collection>
                <label>COLLECTIONS</label>
                <div>-</div>
              </Collection>
              <Qcount>
                <label>TOTAL ITEMS</label>
                <div>{summary.totalItems}</div>
              </Qcount>
            </MidRow>
          )}
          {isPlaylist ? <ThinLine /> : null}
          <Inner style={{ paddingLeft: "10px", paddingRight: "10px" }}>
            {authorName && (
              <Author isPlaylist={isPlaylist}>
                <AuthorWrapper>
                  {collections.find(o => o.name === "Edulastic Certified") ? (
                    getAuthorCollectionMap(true, 30, 30)["edulastic_certified"].icon
                  ) : (
                    <IconUser color={cardTitleColor} />
                  )}
                  <AuthorName title={authorName}>{authorName}</AuthorName>
                </AuthorWrapper>
              </Author>
            )}
            <StatusRow>
              <TestStatus status={status || _source?.status} view="tile">
                {status || _source?.status}
              </TestStatus>
            </StatusRow>
          </Inner>

          <Footer style={{ paddingLeft: "10px", paddingRight: "10px" }}>
            {testItemId ? (
              <PlaylistId>
                <span>#</span>
                <span>{testItemId}</span>
              </PlaylistId>
            ) : null}
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

const enhance = compose(
  withNamespaces("author"),
  connect(
    state => ({}),
    { approveOrRejectSingleTestRequestAction }
  )
);

export default enhance(Item);
