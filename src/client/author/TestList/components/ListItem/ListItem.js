import React, { Component } from "react";
import PropTypes from "prop-types";
import { darkGrey, cardTitleColor, themeColor, fadedBlack } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { IconHeart, IconShare, IconUser, IconId, IconEye, IconClose } from "@edulastic/icons";
import { Col, Checkbox } from "antd";
import { assignmentApi } from "@edulastic/api";
import Tags from "../../../src/components/common/Tags";
import {
  Container,
  ListCard,
  Inner,
  Outer,
  Description,
  Author,
  AuthorName,
  Header,
  Stars,
  StyledLink,
  ItemInformation,
  IconWrapper,
  IconText,
  ViewButtonWrapper,
  ContentWrapper,
  TagsWrapper,
  CardIdWrapper,
  CardId,
  Footer,
  TestStatus,
  StyledModuleName
} from "./styled";
import ViewModal from "../ViewModal";
import TestPreviewModal from "../../../Assignments/components/Container/TestPreviewModal";
import { EllipsisWrapper, ViewButton } from "../Item/styled";
import { getAuthorCollectionMap } from "../../../dataUtils";

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
    history.push(`/author/assignments/${item._id}`);
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

  render() {
    const {
      item: {
        title,
        analytics,
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
      likes = analytics ? analytics[0].likes : "0",
      usage = analytics ? analytics[0].usage : "0"
    } = this.props;
    const standardsIdentifiers = standards.map(item => item.identifier);
    const { isOpenModal, currentTestId, isPreviewModalVisible } = this.state;
    const thumbnailData = isPlaylist ? _source.thumbnail : thumbnail;
    return (
      <>
        <ViewModal
          isShow={isOpenModal}
          close={this.closeModal}
          item={item}
          status={testStatus}
          onEdit={this.moveToItem}
          onDuplicate={this.duplicate}
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
                <div>
                  <ListCard
                    title={
                      <Header src={thumbnailData}>
                        <Stars size="small" />
                      </Header>
                    }
                  />
                  <Inner>
                    <StyledLink title={title}>{isPlaylist ? _source.title : title}</StyledLink>
                    <Description title={isPlaylist ? _source.description : description}>
                      <EllipsisWrapper view="list">{isPlaylist ? _source.description : description}</EllipsisWrapper>
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

                    <Checkbox
                      onChange={e => handleCheckboxAction(e, { _id: item._id, title: item.title })}
                      checked={checked}
                    />
                  </ViewButtonWrapper>
                )}
              </Outer>
            </Col>

            <Footer span={24}>
              <TagsWrapper span={12}>
                {!isPlaylist && (
                  <>
                    <Tags tags={tags} show={1} key="tags" />
                    {tags.length && standardsIdentifiers.length ? <span style={{ marginRight: "10px" }} /> : ""}
                    <Tags tags={standardsIdentifiers} show={1} key="standards" isStandards />
                    <TestStatus
                      style={{
                        marginLeft: tags.length || (standardsIdentifiers && standardsIdentifiers.length) ? "10px" : 0
                      }}
                      status={testStatus}
                    >
                      {testStatus}
                    </TestStatus>
                  </>
                )}
                {collections.find(o => o.name === "Edulastic Certified") &&
                  getAuthorCollectionMap(true, 30, 30)["edulastic_certified"].icon}
              </TagsWrapper>

              <ItemInformation span={12}>
                <ContentWrapper>
                  {authorName && (
                    <Author>
                      {collections.find(o => o.name === "Edulastic Certified") ? (
                        getAuthorCollectionMap(true, 30, 30)["edulastic_certified"].icon
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

export default withNamespaces("author")(ListItem);
