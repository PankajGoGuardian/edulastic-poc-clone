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
import ViewModal from "../ViewModal";

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
    testItemId: ""
  };

  state = {
    isOpenModal: false
  };

  moveToItem = () => {
    const { history, item, match } = this.props;
    history.push(`${match.url}/${item._id}`);
  };

  closeModal = () => {
    this.setState({ isOpenModal: false });
  };

  openModal = () => {
    this.setState({ isOpenModal: true });
  };

  render() {
    const {
      item: { title, analytics, tags },
      item,
      authorName,
      owner = false,
      testItemId
    } = this.props;
    const { isOpenModal } = this.state;

    return (
      <>
        <ViewModal isShow={isOpenModal} close={this.closeModal} item={item} />
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
                  <StyledLink>{title}</StyledLink>
                </div>
                <Description>
                  {
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fermentum metus et luctus lacinia. Nullam vel tincidunt nibh. Duis ac eros nunc."
                  }
                </Description>
              </Inner>
            </Col>

            <ViewButtonWrapper span={6}>
              <TypeContainer />
              <ViewButton onClick={this.openModal}>VIEW</ViewButton>
            </ViewButtonWrapper>

            <Footer span={24}>
              <TagsWrapper span={12}>
                <Tags tags={tags} />
              </TagsWrapper>

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
                    {analytics && <IconText>{analytics.usage} 000</IconText>}
                  </IconWrapper>
                  <IconWrapper>
                    <IconHeart color={darkGrey} width={14} height={14} /> &nbsp;
                    {analytics && <IconText>{analytics.likes} 000</IconText>}
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
