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

class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,

    t: PropTypes.func.isRequired
  };

  moveToItem = () => {
    const { history, item } = this.props;
    history.push(`/author/tests/${item._id}`);
  };

  duplicate = async () => {
    const { history, item } = this.props;
    const test = await assignmentApi.duplicateAssignment(item._id);
    history.push(`/author/tests/${item._id}`);
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
      t,
      authorName,
      owner
    } = this.props;
    return (
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sollicitudin congue metus ut pulvinar. Sed in
            nunc sollicitudin, sodales odio non, lobortis tellus
          </CardDescription>
          <Tags tags={tags} />
        </Inner>
        <ViewButton>VIEW</ViewButton>
        <Footer>
          {authorName && (
            <Author>
              <AuthorName title={authorName}>
                <IconUser /> {authorName}
              </AuthorName>
            </Author>
          )}
          <CardIdWrapper>
            <IconId />
            &nbsp;
            <CardId>123456</CardId>
          </CardIdWrapper>
          <ShareIcon>
            <IconShare color={darkGrey} width={14} height={14} />
            &nbsp;
            {analytics && <IconText>{analytics.usage} 123</IconText>}
          </ShareIcon>
          <LikeIcon>
            <IconHeart color={darkGrey} width={14} height={14} />
            &nbsp;
            {analytics && <IconText>{analytics.likes} 123</IconText>}
          </LikeIcon>
        </Footer>
      </Container>
    );
  }
}

export default withNamespaces("author")(Item);
