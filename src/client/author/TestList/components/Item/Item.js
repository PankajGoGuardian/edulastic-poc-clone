import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { uniqBy } from "lodash";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { IconHeart, IconShare, IconUser } from "@edulastic/icons";
import { Button } from "antd";
import { assignmentApi } from "@edulastic/api";
import { cardTitleColor } from "@edulastic/colors";
import { EduButton } from "@edulastic/common";
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
  CollectionNameWrapper,
  ThinLine
} from "./styled";
import { getOrgDataSelector, getCollectionsSelector } from "../../../src/selectors/user";
import Tags from "../../../src/components/common/Tags";
import ViewModal from "../ViewModal";
import TestPreviewModal from "../../../Assignments/components/Container/TestPreviewModal";
import { TestStatus } from "../ListItem/styled";
import { getAuthorCollectionMap, flattenPlaylistStandards } from "../../../dataUtils";
import { DeleteItemModal } from "../DeleteItemModal/deleteItemModal";
import { approveOrRejectSingleTestRequestAction } from "../../ducks";
import TestStatusWrapper from "../TestStatusWrapper/testStatusWrapper";
import { allowDuplicateCheck } from "../../../src/utils/permissionCheck";

const sharedTypeMap = {
  0: "PUBLIC",
  1: "DISTRICT",
  2: "SCHOOL",
  3: "INDIVIDUAL" // can be shown as "ME" / "YOU"
};

class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    authorName: PropTypes.string,
    owner: PropTypes.bool,
    testItemId: PropTypes.string,
    orgCollections: PropTypes.array.isRequired,
    currentTestId: PropTypes.string,
    isPreviewModalVisible: PropTypes.bool,
    isPlaylist: PropTypes.bool,
    approveOrRejectSingleTestRequest: PropTypes.func.isRequired,
    orgData: PropTypes.object.isRequired,
    windowWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    standards: PropTypes.array
  };

  static defaultProps = {
    authorName: "",
    currentTestId: "",
    owner: false,
    isPreviewModalVisible: false,
    testItemId: "",
    isPlaylist: false,
    standards: []
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
    history.push({ pathname: `/author/assignments/${item._id}`, state: { from: "testLibrary" } });
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

  onApprove = (newCollections = []) => {
    const {
      item: { _id: testId },
      approveOrRejectSingleTestRequest
    } = this.props;
    approveOrRejectSingleTestRequest({
      testId,
      status: "published",
      collections: newCollections
    });
  };

  onReject = () => {
    const {
      item: { _id: testId },
      approveOrRejectSingleTestRequest
    } = this.props;
    approveOrRejectSingleTestRequest({ testId, status: "rejected" });
  };

  render() {
    const {
      item: {
        title,
        tags = [],
        analytics,
        _source = {},
        thumbnail,
        status,
        _id: testId,
        collections = [],
        summary = {},
        sharedType,
        isDocBased
      },
      orgCollections,
      item,
      authorName,
      owner,
      isPlaylist,
      testItemId,
      windowWidth,
      standards = [],
      orgData: { itemBanks }
    } = this.props;
    const likes = analytics?.[0]?.likes || "0";
    const usage = analytics?.[0]?.usage || "0";
    const { isOpenModal, currentTestId, isPreviewModalVisible, isDeleteModalOpen } = this.state;

    let collectionName = "PRIVATE";
    if (collections?.length > 0 && itemBanks.length > 0) {
      let filteredCollections = itemBanks.filter(c => collections.find(i => i._id === c._id));
      filteredCollections = uniqBy(filteredCollections, "_id");
      if (filteredCollections.length > 0) collectionName = filteredCollections.map(c => c.name).join(", ");
    } else if (collections?.length && collections.find(o => o.name === "Edulastic Certified")) {
      collectionName = "Edulastic Certified";
    } else if (sharedType) {
      // sharedType comes as number when "Shared with me" filter is selected
      if (!Number.isNaN(+sharedType)) {
        collectionName = sharedTypeMap[+sharedType];
      } else {
        collectionName = sharedType;
      }
    }

    const btnStyle = {
      margin: "0px",
      padding: "5px 10px"
    };

    const allowDuplicate = allowDuplicateCheck(collections, orgCollections, isPlaylist ? "playList" : "test");
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
          allowDuplicate={allowDuplicate}
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
                  <EduButton style={btnStyle} height="32px" onClick={this.moveToItem}>
                    Edit
                  </EduButton>
                )}
                {status === "published" && (
                  <EduButton style={btnStyle} height="32px" onClick={this.assignTest}>
                    Assign
                  </EduButton>
                )}
                {(status === "published" || status === "draft") && (
                  <>
                    <EduButton style={btnStyle} height="32px" onClick={e => this.showPreviewModal(testId, e)}>
                      Preview
                    </EduButton>
                    <EduButton style={btnStyle} height="32px" onClick={this.openModal}>
                      More
                    </EduButton>
                  </>
                )}
              </ButtonWrapper>
              {collections.find(o => o.name === "Edulastic Certified") &&
                getAuthorCollectionMap(false, 30, 30).edulastic_certified.icon}
              {!!collections.length && !isPlaylist && <PremiumLabel>$ PREMIUM</PremiumLabel>}
            </Header>
          }
        >
          <TestInfo isPlaylist={isPlaylist}>
            <StyledLink title={isPlaylist ? _source?.title : title}>{isPlaylist ? _source?.title : title}</StyledLink>
            {isPlaylist && <StyledDesc title={_source.description}>{_source.description}</StyledDesc>}

            {isPlaylist && (
              <TagsWrapper>
                <Tags show={2} tags={flattenPlaylistStandards(_source?.modules)} key="standards" isStandards />
                <Tags show={2} tags={_source.tags || tags} key="tags" />
              </TagsWrapper>
            )}
          </TestInfo>

          {!isPlaylist && (
            <MidRow>
              <Collection>
                <label>COLLECTIONS</label>
                <CollectionNameWrapper title={collectionName}>{collectionName}</CollectionNameWrapper>
              </Collection>
              <Qcount>
                <label>TOTAL ITEMS</label>
                {/**
                 * For doc based wee need to consider
                 *  total number questions and toal number of items
                 *  */}
                <div>{isDocBased ? summary.totalQuestions : summary.totalItems}</div>
              </Qcount>
            </MidRow>
          )}
          {isPlaylist ? <ThinLine /> : null}
          <Inner style={{ paddingLeft: "10px", paddingRight: "10px" }}>
            {authorName && (
              <Author isPlaylist={isPlaylist}>
                <AuthorWrapper>
                  {collections.find(o => o.name === "Edulastic Certified") ? (
                    getAuthorCollectionMap(true, 30, 30).edulastic_certified.icon
                  ) : (
                    <IconUser color={cardTitleColor} />
                  )}
                  <AuthorName title={authorName}>{authorName}</AuthorName>
                </AuthorWrapper>
              </Author>
            )}
            <StatusRow>
              <TestStatusWrapper status={status || _source?.status} checkUser={false}>
                {({ children, ...rest }) => (
                  <TestStatus {...rest} view="tile">
                    {children}
                  </TestStatus>
                )}
              </TestStatusWrapper>
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
    state => ({
      orgData: getOrgDataSelector(state),
      orgCollections: getCollectionsSelector(state)
    }),
    { approveOrRejectSingleTestRequest: approveOrRejectSingleTestRequestAction }
  )
);

export default enhance(Item);
