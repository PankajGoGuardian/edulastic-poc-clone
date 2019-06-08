import React, { Component } from "react";
import PropTypes from "prop-types";

import { darkGrey } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { IconHeart, IconShare, IconUser, IconId } from "@edulastic/icons";
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
  CardIdWrapper,
  CardId,
  IconText,
  ButtonWrapper
} from "./styled";
import Tags from "../../../src/components/common/Tags";
import ViewModal from "../ViewModal";

class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    authorName: PropTypes.string,
    owner: PropTypes.object,
    testItemId: PropTypes.string
  };

  static defaultProps = {
    authorName: "",
    owner: {},
    testItemId: ""
  };

  state = {
    isOpenModal: false
  };

  moveToItem = () => {
    const { history, item, isPlaylist } = this.props;
    if (isPlaylist) {
      history.push(`/author/playlists/${item._id}`);
    } else {
      history.push(`/author/tests/${item._id}`);
    }
  };

  duplicate = async () => {
    const { history, item } = this.props;
    const duplicateTest = await assignmentApi.duplicateAssignment(item._id);
    history.push(`/author/tests/${duplicateTest._id}`);
  };

  assignTest = () => {
    const { history, item } = this.props;
    history.push(`/author/assignments/${item._id}`);
  };

  closeModal = () => {
    this.setState({ isOpenModal: false });
  };

  openModal = () => {
    this.setState({ isOpenModal: true });
  };

  get name() {
    const {
      item: { createdBy = {} }
    } = this.props;
    return `${createdBy.firstName} ${createdBy.lastName}`;
  }

  render() {
    const {
      item: { title, tags = [], analytics, _source, _id },
      item,
      authorName,
      owner,
      isPlaylist,
      testItemId,
      likes = analytics ? analytics[0].likes : "0",
      usage = analytics ? analytics[0].usage : "0"
    } = this.props;
    const { isOpenModal } = this.state;
    return (
      <>
        <ViewModal
          isShow={isOpenModal}
          close={this.closeModal}
          item={item}
          assign={this.assignTest}
          isPlaylist={isPlaylist}
        />
        <Container
          title={
            <Header src={isPlaylist ? _source.thumbnail : undefined}>
              <Stars />
              <ButtonWrapper className="showHover">
                {owner && (
                  <Button onClick={this.moveToItem} type="primary">
                    Edit
                  </Button>
                )}

                <Button type="primary" onClick={this.duplicate}>
                  duplicate
                </Button>
              </ButtonWrapper>
            </Header>
          }
        >
          <Inner>
            <Question>
              <StyledLink title={title} onClick={isPlaylist ? this.moveToItem : this.openModal}>
                {isPlaylist ? _source.title : title}
              </StyledLink>
            </Question>
            <CardDescription onClick={isPlaylist ? this.moveToItem : ""}>
              {isPlaylist
                ? _source.description
                : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sollicitudin congue metus ut pulvinar. Sed in nunc sollicitudin, sodales odio non, lobortis tellus"}
            </CardDescription>
            {!isPlaylist && <Tags tags={tags} />}
          </Inner>
          <Footer>
            {authorName && (
              <Author>
                <IconUser /> &nbsp;
                <AuthorName title={authorName}>{authorName}</AuthorName>
              </Author>
            )}
            <CardIdWrapper>
              <IconId />
              &nbsp;
              <CardId>{testItemId}</CardId>
            </CardIdWrapper>
            <ShareIcon>
              <IconShare color={darkGrey} width={14} height={14} /> &nbsp;
              <IconText>{usage}</IconText>
            </ShareIcon>
            <LikeIcon>
              <IconHeart color={darkGrey} width={14} height={14} /> &nbsp;
              <IconText>{likes}</IconText>
            </LikeIcon>
          </Footer>
        </Container>
      </>
    );
  }
}

export default withNamespaces("author")(Item);
