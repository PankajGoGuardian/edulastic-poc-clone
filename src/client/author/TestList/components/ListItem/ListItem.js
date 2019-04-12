import React, { Component } from "react";
import PropTypes from "prop-types";
import { darkGrey } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { IconHeart, IconShare, IconUser, IconId } from "@edulastic/icons";
import { Col, Button } from "antd";
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
  ViewButton,
  CardIdWrapper,
  CardId,
  Footer,
  ButtonWrapper
} from "./styled";

const ButtonGroup = Button.Group;
class ListItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  };

  moveToItem = () => {
    const { history, item, match } = this.props;
    history.push(`${match.url}/${item._id}`);
  };

  get id() {
    const {
      item: { createdBy = {} }
    } = this.props;
    return `${createdBy.id}`;
  }

  render() {
    const {
      item: { title, analytics, tags },
      t,
      authorName,
      owner = false
    } = this.props;
    return (
      <Container>
        <ContentWrapper>
          <Col span={18}>
            <ListCard
              title={
                <Header>
                  <Stars size="small" />
                  <ButtonWrapper className="showHover">
                    {owner && (
                      <Button type="primary" onClick={this.moveToItem}>
                        Edit
                      </Button>
                    )}

                    <Button type="primary">duplicate</Button>
                  </ButtonWrapper>
                </Header>
              }
            />
            <Inner>
              <div>
                <StyledLink
                // onClick={this.moveToItem}
                >
                  {title}
                </StyledLink>
              </div>
              <Description>
                {
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fermentum metus et luctus lacinia. Nullam vel tincidunt nibh. Duis ac eros nunc."
                }
              </Description>
            </Inner>
          </Col>

          <ViewButtonWrapper span={6}>
            <TypeContainer>{""}</TypeContainer>
            <ViewButton>VIEW</ViewButton>
          </ViewButtonWrapper>

          <Footer span={24}>
            <TagsWrapper span={12}>
              <Tags tags={tags} />
            </TagsWrapper>

            <ItemInformation span={12}>
              <ContentWrapper>
                <Col span={7}>
                  {authorName && (
                    <Author>
                      <IconUser /> &nbsp;
                      <AuthorName title={authorName}>{authorName}</AuthorName>
                    </Author>
                  )}
                </Col>
                <Col span={7}>
                  <CardIdWrapper>
                    <IconId />
                    &nbsp;
                    <CardId>{this.id}</CardId>
                  </CardIdWrapper>
                </Col>
                <Col span={5}>
                  <IconWrapper>
                    <IconShare color={darkGrey} width={14} height={14} />
                    &nbsp;
                    {analytics && <IconText>{analytics.usage} 000</IconText>}
                  </IconWrapper>
                </Col>
                <Col span={5}>
                  <IconWrapper>
                    <IconHeart color={darkGrey} width={14} height={14} />
                    &nbsp;
                    {analytics && <IconText>{analytics.likes} 000</IconText>}
                  </IconWrapper>
                </Col>
              </ContentWrapper>
            </ItemInformation>
          </Footer>
        </ContentWrapper>
      </Container>
    );
  }
}

export default withNamespaces("author")(ListItem);
