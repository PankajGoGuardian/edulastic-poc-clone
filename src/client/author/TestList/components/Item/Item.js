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
  ViewButton,
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
    const { history, item } = this.props;
    history.push(`/author/tests/${item._id}`);
  };

  duplicate = async () => {
    const { history, item } = this.props;
    const duplicateTest = await assignmentApi.duplicateAssignment(item._id);
    history.push(`/author/tests/${duplicateTest._id}`);
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
      item: { title, tags, analytics },
      item,
      authorName,
      owner,
      testItemId
    } = this.props;
    const { isOpenModal } = this.state;

    return (
      <>
        <ViewModal isShow={isOpenModal} close={this.closeModal} item={item} />
        <Container
          title={
            <Header>
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
              <StyledLink title={title} onClick={this.moveToItem}>
                {title}
              </StyledLink>
            </Question>
            <CardDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sollicitudin congue metus ut pulvinar. Sed
              in nunc sollicitudin, sodales odio non, lobortis tellus
            </CardDescription>
            <Tags tags={tags} />
          </Inner>
          <ViewButton onClick={this.openModal}>VIEW</ViewButton>
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
              {analytics && <IconText>{analytics.usage} 0</IconText>}
            </ShareIcon>
            <LikeIcon>
              <IconHeart color={darkGrey} width={14} height={14} /> &nbsp;
              {analytics && <IconText>{analytics.likes} 0</IconText>}
            </LikeIcon>
          </Footer>
        </Container>
      </>
    );
  }
}

export default withNamespaces("author")(Item);
