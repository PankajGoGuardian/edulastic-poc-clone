import React, { Component } from "react";
import PropTypes from "prop-types";
import { FaAngleDoubleRight } from "react-icons/fa";
import { greenDark } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { IconHeart, IconShare } from "@edulastic/icons";
import { Button } from "antd";
import {
  Container,
  Inner,
  Footer,
  Author,
  AuthorName,
  Icons,
  Header,
  Stars,
  StyledLink,
  Question,
  IconWrapper,
  IconText
} from "./styled";
import Tags from "../../../src/components/common/Tags";
import { assignmentApi } from "@edulastic/api";
const ButtonGroup = Button.Group;

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
          </Header>
        }
      >
        <Inner>
          <Question>
            <StyledLink
            //  onClick={this.moveToItem}
            >
              {title}# <FaAngleDoubleRight />
            </StyledLink>
          </Question>
          <Tags tags={tags} />
        </Inner>
        <Footer>
          {authorName && (
            <Author>
              <span>
                {t("component.item.by")}
                :&nbsp;
              </span>
              <AuthorName>{authorName}</AuthorName>
            </Author>
          )}
          <Icons>
            <IconWrapper>
              <IconHeart color={greenDark} width={16} height={16} />
              &nbsp;
              {analytics && <IconText>{analytics.likes}</IconText>}
            </IconWrapper>
            <IconWrapper>
              <IconShare color={greenDark} width={16} height={16} />
              &nbsp;
              {analytics && <IconText>{analytics.usage}</IconText>}
            </IconWrapper>
          </Icons>
        </Footer>
        <ButtonGroup>
          {owner && (
            <Button onClick={this.moveToItem} type="primary">
              Edit
            </Button>
          )}

          <Button type="primary" onClick={this.duplicate}>
            duplicate
          </Button>
        </ButtonGroup>
      </Container>
    );
  }
}

export default withNamespaces("author")(Item);
