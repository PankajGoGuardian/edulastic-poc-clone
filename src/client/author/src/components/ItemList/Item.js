import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'antd';
import { IconShare, IconHeart } from '@edulastic/icons';
import { textColor, tabletWidth, greenDark } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { MoveLink } from '@edulastic/common';

/* eslint-disable no-underscore-dangle */
class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    windowWidth: PropTypes.number.isRequired
  };

  moveToItem = () => {
    const { history, item, t } = this.props;
    history.push({
      pathname: `/author/items/${item._id}/item-detail`,
      state: {
        backText: t('component.itemAdd.backToItemList'),
        backUrl: '/author/items',
        itemDetail: true
      }
    });
  };

  get description() {
    const { item } = this.props;
    let description = '';

    if (item.data.questions && item.data.questions.length) {
      description = item.data.questions[0].data.stimulus;
    }

    return description;
  }

  render() {
    const { item, t, windowWidth } = this.props;

    return (
      <Container>
        <Question>
          <QuestionContent>
            <MoveLink onClick={this.moveToItem}>{item._id}</MoveLink>
            <div dangerouslySetInnerHTML={{ __html: this.description }} />
          </QuestionContent>
          {windowWidth > 768 && (
            <ViewButton>
              <Button
                style={{ width: 144, height: 50, borderRadius: 65 }}
                onClick={this.moveToItem}
              >
                {t('component.item.view')}
              </Button>
            </ViewButton>
          )}
        </Question>
        <Detail>
          <TypeCategory>
            <CategoryName>Type:</CategoryName>
            <CategoryContent>
              <Label>
                <LabelText>CLOZE DROP DOWN</LabelText>
              </Label>
              <Label>
                <LabelText>MULTIPLE CHOICE</LabelText>
              </Label>
              <Label>
                <LabelText>ORDER LIST</LabelText>
              </Label>
            </CategoryContent>
          </TypeCategory>
          <Categories>
            <DetailCategory>
              <CategoryName>By:</CategoryName>
              <CategoryContent>
                <GreenText>Kevin Hart</GreenText>
              </CategoryContent>
            </DetailCategory>
            <DetailCategory>
              <CategoryName>ID:</CategoryName>
              <CategoryContent>
                <GreenText>123456</GreenText>
              </CategoryContent>
            </DetailCategory>
            <DetailCategory>
              <CategoryName>
                <ShareIcon />
              </CategoryName>
              <CategoryContent>
                <GreyText>9578 (1)</GreyText>
              </CategoryContent>
            </DetailCategory>
            <DetailCategory>
              <CategoryName>
                <HeartIcon />
              </CategoryName>
              <CategoryContent>
                <GreyText>9</GreyText>
              </CategoryContent>
            </DetailCategory>
          </Categories>
        </Detail>
        {windowWidth < 768 && (
          <ViewButton>
            <Button
              style={{ width: '100%', height: 50, borderRadius: 65 }}
              onClick={this.moveToItem}
            >
              {t('component.item.view')}
            </Button>
          </ViewButton>
        )}
      </Container>
    );
  }
}

export default withNamespaces('author')(Item);

const Container = styled.div`
  border-bottom: 1px solid #f2f2f2;
  padding: 27px 0;

  @media (max-width: ${tabletWidth}) {
    flex-direction: column;
    padding: 28px;
  }
`;

const ShareIcon = styled(IconShare)`
  display: flex;
  align-items: center;
  fill: ${greenDark};
`;

const HeartIcon = styled(IconHeart)`
  display: flex;
  align-items: center;
  fill: ${greenDark};
`;

const Question = styled.div`
  display: flex;

  & p {
    margin: 0.5em 0;
    font-size: 13px;
  }

  @media (max-width: ${tabletWidth}) {
    width: 100%;
    margin-bottom: 15px;
    text-align: center;
  }
`;

const QuestionContent = styled.div`
  flex: 1;

  @media (max-width: ${tabletWidth}) {
    text-align: left;
  }
`;

const ViewButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${tabletWidth}) {
    margin-top: 25px;
  }
`;

const Detail = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 18px;

  @media (max-width: ${tabletWidth}) {
    margin-top: 9px;
  }
`;

const TypeCategory = styled.div`
  display: flex;
  margin-right: 24px;
  margin-bottom: 10px;

  @media (max-width: ${tabletWidth}) {
    display: block;
    margin-right: 0px;
  }
`;

const DetailCategory = styled.div`
  display: flex;
  margin-right: 24px;

  @media (max-width: ${tabletWidth}) {
    width: 48%;
    margin-right: 0px;
    margin-top: 22px;
  }
`;

const CategoryName = styled.span`
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: ${textColor};

  @media (max-width: ${tabletWidth}) {
    display: block;
    font-size: 14px;
  }
`;

const CategoryContent = styled.div`
  margin-left: 3px;
  display: flex;

  @media (max-width: ${tabletWidth}) {
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;

const Label = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: solid 1px #b1b1b1;
  height: 24px;
  padding: 6px 14px;
  margin-left: 10px;

  @media (max-width: ${tabletWidth}) {
    margin-left: -3px;
    width: 48%;
    margin-top: 8px;
    height: 30px;
  }
`;

const LabelText = styled.span`
  font-size: 9px;
  letter-spacing: 0.1px;
  text-align: center;
  color: ${textColor};

  @media (max-width: ${tabletWidth}) {
    letter-spacing: 0.2px;
    font-weight: bold;
    font-size: 10px;
  }
`;

const GreenText = styled.span`
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: ${greenDark};

  @media (max-width: ${tabletWidth}) {
    font-size: 14px;
  }
`;

const GreyText = styled.span`
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: ${textColor};

  @media (max-width: ${tabletWidth}) {
    font-size: 14px;
  }
`;

const Categories = styled.div`
  display: flex;
  @media (max-width: ${tabletWidth}) {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 2px;
  }
`;
