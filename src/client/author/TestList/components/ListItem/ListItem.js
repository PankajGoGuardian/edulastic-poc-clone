import React, { Component } from "react";
import PropTypes from "prop-types";
import { darkGrey } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { IconHeart, IconShare, IconUser, IconId } from "@edulastic/icons";
import { Col, Button } from "antd";
import { assignmentApi } from "@edulastic/api";
import Tags from "../../../src/components/common/Tags";
import {
  Container,
  ListCard,
  Inner,
  Description,
  Author,
  AuthorName,
  Header,
  Stars,
  StyledLink,
  ItemInformation,
  TypeContainer,
  IconWrapper,
  IconText,
  ViewButtonWrapper,
  ContentWrapper,
  TagsWrapper,
  CardIdWrapper,
  CardId,
  Footer,
  ButtonWrapper,
  AddButton
} from "./styled";
import ViewModal from "../ViewModal";
import { TestStatus } from "../../../TestPage/components/TestPageHeader/styled";
import TestPreviewModal from "../../../Assignments/components/Container/TestPreviewModal";
import { EllipsisWrapper } from "../Item/styled";

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
    const duplicateTest = await assignmentApi.duplicateAssignment(item._id);
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
      item: { title, analytics, tags = [], _source, _id: testId, status: testStatus, description, thumbnail },
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
      likes = analytics ? analytics[0].likes : "0",
      usage = analytics ? analytics[0].usage : "0"
    } = this.props;
    const { isOpenModal, currentTestId, isPreviewModalVisible } = this.state;
    const thumbnailData = isPlaylist ? _source.thumbnail : thumbnail;
    return (
      <>
        <ViewModal
          isShow={isOpenModal}
          close={this.closeModal}
          item={item}
          onEdit={this.moveToItem}
          onDuplicate={this.duplicate}
          assign={this.assignTest}
          isPlaylist={isPlaylist}
        />
        <TestPreviewModal
          isModalVisible={isPreviewModalVisible}
          testId={currentTestId}
          hideModal={this.hidePreviewModal}
        />
        <Container onClick={isPlaylist ? this.moveToItem : this.openModal}>
          <ContentWrapper>
            <Col span={18}>
              <ListCard
                title={
                  <Header src={thumbnailData}>
                    <Stars size="small" />
                    <ButtonWrapper className="showHover">
                      {owner && testStatus === "draft" && (
                        <Button type="primary" onClick={this.moveToItem}>
                          Edit
                        </Button>
                      )}

                      {testStatus === "draft" && (
                        <Button type="primary" onClick={this.duplicate}>
                          duplicate
                        </Button>
                      )}
                      {testStatus === "published" && (
                        <Button
                          type="primary"
                          onClick={e => {
                            e.stopPropagation();
                            this.showPreviewModal(testId);
                          }}
                        >
                          Preview
                        </Button>
                      )}
                      {testStatus === "published" && (
                        <Button type="primary" onClick={this.assignTest}>
                          Assign
                        </Button>
                      )}
                    </ButtonWrapper>
                  </Header>
                }
              />
              <Inner>
                <div>
                  <StyledLink title={title}>{isPlaylist ? _source.title : title}</StyledLink>
                  {mode && (
                    <TestStatus className={testStatus} mode={"embedded"}>
                      {testStatus}
                    </TestStatus>
                  )}
                </div>
                <Description title={isPlaylist ? _source.description : description}>
                  <EllipsisWrapper>{isPlaylist ? _source.description : description}</EllipsisWrapper>
                </Description>
              </Inner>
            </Col>

            {!isPlaylist && mode === "embedded" && (
              <ViewButtonWrapper span={6}>
                <TypeContainer />
                {!isTestAdded && mode === "embedded" && (
                  <AddButton windowWidth={windowWidth} onClick={e => addTestToPlaylist(item)}>
                    ADD
                  </AddButton>
                )}
                {isTestAdded && mode === "embedded" && (
                  <AddButton
                    windowWidth={windowWidth}
                    isTestAdded={isTestAdded}
                    onClick={e => removeTestFromPlaylist(item._id)}
                  >
                    Remove
                  </AddButton>
                )}
              </ViewButtonWrapper>
            )}

            <Footer span={24}>
              <TagsWrapper span={12}>{!isPlaylist && <Tags tags={tags} />}</TagsWrapper>

              <ItemInformation span={12}>
                <ContentWrapper>
                  {authorName && (
                    <Author>
                      <IconUser /> &nbsp;
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
