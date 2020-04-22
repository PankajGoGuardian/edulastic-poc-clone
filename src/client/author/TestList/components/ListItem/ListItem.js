import { assignmentApi } from "@edulastic/api";
import { cardTitleColor, darkGrey, fadedBlack, themeColor } from "@edulastic/colors";
import { CheckboxLabel } from "@edulastic/common";
import { roleuser } from "@edulastic/constants";
import { IconClose, IconEye, IconHeart, IconId, IconPlus, IconShare, IconUser } from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";
import { Col } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import TestPreviewModal from "../../../Assignments/components/Container/TestPreviewModal";
import { getAuthorCollectionMap, flattenPlaylistStandards } from "../../../dataUtils";
import {
  AddButtonStyled,
  ViewButton as ViewButtonContainer,
  ViewButtonStyled
} from "../../../ItemList/components/Item/styled";
import Tags from "../../../src/components/common/Tags";
import { getUserRole, isPublisherUserSelector } from "../../../src/selectors/user";
import { approveOrRejectSingleTestRequestAction, getSelectedTestsSelector } from "../../ducks";
import { EllipsisWrapper, ViewButton } from "../Item/styled";
import TestStatusWrapper from "../TestStatusWrapper/testStatusWrapper";
import ViewModal from "../ViewModal";
import {
  Author,
  AuthorName,
  CardId,
  CardIdWrapper,
  Container,
  ContentWrapper,
  Description,
  Footer,
  Header,
  IconText,
  IconWrapper,
  Inner,
  ItemInformation,
  ListCard,
  Outer,
  Stars,
  StyledLink,
  StyledModuleName,
  TagsWrapper,
  TestStatus,
  ViewButtonWrapper
} from "./styled";

class ListItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    authorName: PropTypes.string,
    owner: PropTypes.object,
    testItemId: PropTypes.string
  };

  static defaultProps = {
    authorName: "",
    owner: {},
    currentTestId: "",
    isPreviewModalVisible: false,
    testItemId: ""
  };

  state = {
    isOpenModal: false
  };

  moveToItem = e => {
    e && e.stopPropagation();
    const { history, item, match, mode } = this.props;
    if (mode !== "embedded") {
      history.push(`${match.url}/${item._id}#review`);
    }
  };

  duplicate = async e => {
    e && e.stopPropagation();
    const { history, item } = this.props;
    const duplicateTest = await assignmentApi.duplicateAssignment(item);
    history.push(`/author/tests/${duplicateTest._id}`);
  };

  closeModal = () => {
    this.setState({ isOpenModal: false });
  };

  assignTest = e => {
    e && e.stopPropagation();
    const { history, item } = this.props;
    history.push({
      pathname: `/author/assignments/${item._id}`,
      state: { from: "testLibrary", fromText: "Test Library", toUrl: "/author/tests" }
    });
  };

  openModal = () => {
    this.setState({ isOpenModal: true });
  };

  hidePreviewModal = () => {
    this.setState({ isPreviewModalVisible: false });
  };

  showPreviewModal = testId => {
    this.setState({ isPreviewModalVisible: true, currentTestId: testId });
  };

  onApprove = (newCollections = []) => {
    const {
      item: { _id: testId },
      approveOrRejectSingleTestRequestAction
    } = this.props;
    approveOrRejectSingleTestRequestAction({
      testId,
      status: "published",
      collections: newCollections
    });
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
        analytics = [],
        tags = [],
        _source,
        _id: testId,
        status: testStatus,
        description,
        thumbnail,
        collections = []
      },
      item,
      authorName,
      owner = false,
      testItemId,
      windowWidth,
      isPlaylist,
      isTestAdded,
      mode,
      removeTestFromPlaylist,
      addTestToPlaylist,
      standards,
      handleCheckboxAction,
      checked,
      moduleTitle,
      selectedTests = [],
      onRemoveFromCart,
      onAddToCart,
      t,
      userRole,
      isPublisherUser
    } = this.props;
    const likes = analytics?.[0]?.likes || "0";
    const usage = analytics?.[0]?.usage || "0";
    const standardsIdentifiers = isPlaylist
      ? flattenPlaylistStandards(_source?.modules)
      : standards.map(item => item.identifier);
    const { isOpenModal, currentTestId, isPreviewModalVisible } = this.state;
    const thumbnailData = isPlaylist ? _source.thumbnail : thumbnail;
    const isInCart = !!selectedTests.find(o => o._id === item._id);
    return (
      <>
        <ViewModal
          isShow={isOpenModal}
          close={this.closeModal}
          item={item}
          status={testStatus}
          onEdit={this.moveToItem}
          onDuplicate={this.duplicate}
          onReject={this.onReject}
          onApprove={this.onApprove}
          assign={this.assignTest}
          isPlaylist={isPlaylist}
        />
        <TestPreviewModal
          isModalVisible={isPreviewModalVisible}
          testId={currentTestId}
          closeTestPreviewModal={this.hidePreviewModal}
        />
        <Container onClick={isPlaylist ? this.moveToItem : mode === "embedded" ? "" : this.openModal}>
          <ContentWrapper>
            <Col span={24}>
              <Outer>
                <div style={{ display: "flex" }}>
                  <div>
                    <ListCard
                      title={
                        <Header src={thumbnailData}>
                          <Stars size="small" />
                        </Header>
                      }
                    />
                  </div>

                  <Inner>
                    <StyledLink title={title}>{isPlaylist ? _source.title : title}</StyledLink>
                    <Description title={isPlaylist ? _source.description : description}>
                      <EllipsisWrapper style={{ paddingRight: "15px" }} view="list">
                        {isPlaylist ? _source.description : description}
                      </EllipsisWrapper>
                    </Description>
                  </Inner>
                </div>

                {!isPlaylist && mode === "embedded" && (
                  <ViewButtonWrapper span={6}>
                    {!isTestAdded && mode === "embedded" && (
                      <ViewButton
                        onClick={e => addTestToPlaylist({ ...item, standardIdentifiers: standardsIdentifiers })}
                      >
                        ADD
                      </ViewButton>
                    )}

                    {!isTestAdded && mode === "embedded" && (
                      <ViewButton isTestAdded={isTestAdded} onClick={e => this.showPreviewModal(item._id)}>
                        VIEW
                      </ViewButton>
                    )}

                    {isTestAdded && mode === "embedded" && (
                      <div style={{ cursor: "pointer" }} onClick={e => this.showPreviewModal(item._id)} title="Preview">
                        <IconEye color={themeColor} width={60} />
                      </div>
                    )}

                    {isTestAdded && mode === "embedded" && (
                      <StyledModuleName>
                        <span style={{ width: "100%", textAlign: "center" }}>{moduleTitle}</span>
                        <div style={{ cursor: "pointer" }} onClick={e => removeTestFromPlaylist(item._id)}>
                          <IconClose color={fadedBlack} width={10} />
                        </div>
                      </StyledModuleName>
                    )}

                    <CheckboxLabel
                      onChange={e => handleCheckboxAction(e, { _id: item._id, title: item.title })}
                      checked={checked}
                    />
                  </ViewButtonWrapper>
                )}
                {isPlaylist && (userRole === roleuser.DISTRICT_ADMIN || isPublisherUser) && (
                  <div onClick={e => e.stopPropagation()}>
                    <CheckboxLabel onChange={e => handleCheckboxAction(e, item._id)} checked={checked} />
                  </div>
                )}
                {!isPlaylist &&
                  mode !== "embedded" &&
                  (userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.TEACHER || isPublisherUser) && (
                    <ViewButtonContainer>
                      <ViewButtonStyled
                        onClick={e => {
                          e.stopPropagation();
                          this.showPreviewModal(item._id);
                        }}
                      >
                        <IconEye /> {t("component.itemlist.preview")}
                      </ViewButtonStyled>
                      {userRole !== roleuser.TEACHER && (
                        <AddButtonStyled
                          onClick={e => {
                            e.stopPropagation();
                          }}
                        >
                          <CheckboxLabel
                            checked={isInCart}
                            ml="24px"
                            onChange={e => {
                              isInCart ? onRemoveFromCart(item) : onAddToCart(item);
                            }}
                          />
                        </AddButtonStyled>
                      )}
                    </ViewButtonContainer>
                  )}
              </Outer>
            </Col>

            <Footer span={24}>
              <TagsWrapper span={12}>
                <Tags tags={tags} show={1} key="tags" />
                {tags.length && standardsIdentifiers.length ? <span style={{ marginRight: "10px" }} /> : ""}
                <Tags tags={standardsIdentifiers} show={1} key="standards" isStandards />
                <TestStatusWrapper status={testStatus || _source?.status} checkUser={false}>
                  {({ children, ...rest }) => (
                    <TestStatus
                      style={{
                        marginLeft: tags.length || (standardsIdentifiers && standardsIdentifiers.length) ? "10px" : 0
                      }}
                      {...rest}
                    >
                      {children}
                    </TestStatus>
                  )}
                </TestStatusWrapper>
                {collections.find(o => o.name === "Edulastic Certified") &&
                  getAuthorCollectionMap(true, 30, 30).edulastic_certified.icon}
              </TagsWrapper>

              <ItemInformation span={12}>
                <ContentWrapper>
                  {authorName && (
                    <Author>
                      {collections.find(o => o.name === "Edulastic Certified") ? (
                        getAuthorCollectionMap(true, 30, 30).edulastic_certified.icon
                      ) : (
                        <IconUser color={cardTitleColor} />
                      )}{" "}
                      &nbsp;
                      <AuthorName title={authorName}>{authorName}</AuthorName>
                    </Author>
                  )}
                  <CardIdWrapper>
                    <IconId /> &nbsp;
                    <CardId>{testItemId}</CardId>
                  </CardIdWrapper>
                  <IconWrapper>
                    <IconShare color={darkGrey} width={14} height={14} /> &nbsp;
                    <IconText>{usage}</IconText>
                  </IconWrapper>
                  <IconWrapper>
                    <IconHeart color={darkGrey} width={14} height={14} /> &nbsp;
                    <IconText>{likes}</IconText>
                  </IconWrapper>
                </ContentWrapper>
              </ItemInformation>
            </Footer>
          </ContentWrapper>
        </Container>
      </>
    );
  }
}

const enhance = compose(
  withNamespaces("author"),
  connect(
    state => ({
      selectedTests: getSelectedTestsSelector(state),
      userRole: getUserRole(state),
      isPublisherUser: isPublisherUserSelector(state)
    }),
    { approveOrRejectSingleTestRequestAction }
  )
);

export default enhance(ListItem);
