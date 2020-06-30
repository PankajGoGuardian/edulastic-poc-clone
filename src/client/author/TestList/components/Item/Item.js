import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { uniqBy } from "lodash";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { IconHeart, IconShare, IconUser, IconDynamic } from "@edulastic/icons";
import { assignmentApi } from "@edulastic/api";
import { cardTitleColor, themeColor, red } from "@edulastic/colors";
import { PremiumLabel, EduButton } from "@edulastic/common";
import { roleuser, test } from "@edulastic/constants";
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
  PlaylistDesc,
  MidRow,
  Collection,
  CollectionNameWrapper,
  ThinLine,
  DynamicIconWrapper
} from "./styled";
import {
  getOrgDataSelector,
  getCollectionsSelector,
  isPublisherUserSelector,
  getUserRole,
  getUserId
} from "../../../src/selectors/user";
import Tags from "../../../src/components/common/Tags";
import ViewModal from "../ViewModal";
import TestPreviewModal from "../../../Assignments/components/Container/TestPreviewModal";
import { TestStatus } from "../ListItem/styled";
import { getAuthorCollectionMap, flattenPlaylistStandards, showPremiumLabelOnContent } from "../../../dataUtils";
import { DeleteItemModal } from "../DeleteItemModal/deleteItemModal";
import { approveOrRejectSingleTestRequestAction, toggleTestLikeAction } from "../../ducks";
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
      history.push({
        pathname: `/author/tests/tab/review/id/${item._id}`,
        state: {
          editTestFlow: true
        }
      });
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
    history.push({
      pathname: `/author/assignments/${item._id}`,
      state: { from: "testLibrary", fromText: "Test Library", toUrl: "/author/tests" }
    });
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

  handleLikeTest = e => {
    e.stopPropagation();
    const { item, toggleTestLikeRequest, isTestLiked } = this.props;
    toggleTestLikeRequest({
      contentId: item._id,
      contentType: "TEST",
      toggleValue: !isTestLiked,
      versionId: item.versionId
    });
  };

  render() {
    const {
      item: {
        title,
        tags = [],
        _source = {},
        thumbnail,
        status,
        _id: testId,
        collections = [],
        summary = {},
        sharedType,
        isDocBased
      },
      orgCollections = [],
      item,
      authorName,
      owner: isOwner,
      isPlaylist,
      testItemId,
      windowWidth,
      standards = [],
      orgData: { itemBanks },
      isPublisherUser,
      userRole,
      currentUserId,
      isTestLiked
    } = this.props;
    const { analytics = [] } = isPlaylist ? _source : item;
    const likes = analytics?.[0]?.likes || "0";
    const usage = analytics?.[0]?.usage || "0";
    const { isOpenModal, currentTestId, isPreviewModalVisible, isDeleteModalOpen } = this.state;
    const standardsIdentifiers = isPlaylist
      ? flattenPlaylistStandards(_source?.modules)
      : standards.map(_item => _item.identifier);

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

    const showPremiumTag =
      showPremiumLabelOnContent(isPlaylist ? _source.collections : collections, orgCollections) &&
      !isPublisherUser &&
      !(_source?.createdBy?._id === currentUserId);

    const allowDuplicate =
      allowDuplicateCheck(collections, orgCollections, isPlaylist ? "playList" : "test") || isOwner;

    const isDynamic =
      !isPlaylist &&
      item.itemGroups.some(
        group =>
          group.type === test.ITEM_GROUP_TYPES.AUTOSELECT ||
          group.deliveryType === test.ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
      );
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
          owner={isOwner}
          assign={this.assignTest}
          isPlaylist={isPlaylist}
          windowWidth={windowWidth}
          allowDuplicate={allowDuplicate}
          previewLink={e => this.showPreviewModal(testId, e)}
          isDynamic={isDynamic}
          handleLikeTest={this.handleLikeTest}
          isTestLiked={isTestLiked}
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
                {isOwner && status === "draft" && (
                  <EduButton style={btnStyle} height="32px" onClick={this.moveToItem}>
                    Edit
                  </EduButton>
                )}
                {status === "published" && userRole !== roleuser.EDULASTIC_CURATOR && (
                  <EduButton style={btnStyle} height="32px" onClick={this.assignTest}>
                    Assign
                  </EduButton>
                )}
                {(status === "published" || status === "draft") && (
                  <>
                    <EduButton
                      data-cy="test-preview-button"
                      style={btnStyle}
                      height="32px"
                      onClick={e => this.showPreviewModal(testId, e)}
                    >
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
              {showPremiumTag && <PremiumLabel> PREMIUM</PremiumLabel>}
            </Header>
          }
        >
          <TestInfo isPlaylist={isPlaylist}>
            <StyledLink data-cy="test-title" title={isPlaylist ? _source?.title : title}>
              {isPlaylist ? _source?.title : title}
            </StyledLink>
            {isPlaylist && <PlaylistDesc dangerouslySetInnerHTML={{ __html: _source.description }} />}

            <TagsWrapper data-cy="test-standards" isPlaylist={isPlaylist}>
              <Tags show={4} tags={standardsIdentifiers} key="standards" isStandards margin="0px" />
              {isPlaylist && <Tags data-cy="test-tags" show={2} tags={_source.tags || tags} key="tags" />}
            </TagsWrapper>
          </TestInfo>

          {!isPlaylist && (
            <MidRow>
              <Collection isDynamic>
                <label>COLLECTIONS</label>
                <CollectionNameWrapper data-cy="test-collection" title={collectionName}>
                  {collectionName}
                </CollectionNameWrapper>
              </Collection>
              <Qcount>
                <label>{isDocBased ? "TOTAL QUESTIONS" : "TOTAL ITEMS"}</label>
                {/**
                 * For doc based wee need to consider
                 *  total number questions and toal number of items
                 *  */}
                <div data-cy="test-item-count">{isDocBased ? summary.totalQuestions : summary.totalItems}</div>
              </Qcount>
              {isDynamic && (
                <DynamicIconWrapper title="Dynamic Test. Every student might get different items in assignment">
                  <IconDynamic color={themeColor} />
                </DynamicIconWrapper>
              )}
            </MidRow>
          )}
          {isPlaylist ? <ThinLine /> : null}
          <Inner>
            {authorName && (
              <Author isPlaylist={isPlaylist}>
                <AuthorWrapper>
                  {collections.find(o => o.name === "Edulastic Certified") ? (
                    getAuthorCollectionMap(true, 30, 30).edulastic_certified.icon
                  ) : (
                    <IconUser color={cardTitleColor} />
                  )}
                  <AuthorName data-cy="test-author-name" title={authorName}>
                    {authorName}
                  </AuthorName>
                </AuthorWrapper>
              </Author>
            )}
            <StatusRow>
              <TestStatusWrapper status={status || _source?.status} checkUser={false}>
                {({ children, ...rest }) => (
                  <TestStatus data-cy="test-status" {...rest} view="tile">
                    {children}
                  </TestStatus>
                )}
              </TestStatusWrapper>
            </StatusRow>
          </Inner>

          <Footer>
            {testItemId ? (
              <PlaylistId data-cy="test-id">
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
                {!isPlaylist && (
                  <LikeIcon onClick={this.handleLikeTest}>
                    <IconHeart color={isTestLiked ? red : cardTitleColor} width={14} height={14} /> &nbsp;
                    <IconText>{likes}</IconText>
                  </LikeIcon>
                )}
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
      orgCollections: getCollectionsSelector(state),
      isPublisherUser: isPublisherUserSelector(state),
      userRole: getUserRole(state),
      currentUserId: getUserId(state)
    }),
    {
      approveOrRejectSingleTestRequest: approveOrRejectSingleTestRequestAction,
      toggleTestLikeRequest: toggleTestLikeAction
    }
  )
);

export default enhance(Item);
