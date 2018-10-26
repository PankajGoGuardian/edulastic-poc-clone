import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { IconClockCircularOutline } from '@edulastic/icons';
import { grey, blue, darkBlue, textColor, tabletWidth } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { Button } from '@edulastic/common';

/* eslint-disable no-underscore-dangle */
class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  };

  moveToItem = () => {
    const { history, item, t } = this.props;
    history.push({
      pathname: `/author/items/${item.id}/item-detail`,
      state: {
        backText: t('component.itemAdd.backToItemList'),
        backUrl: '/author/items',
        itemDetail: true,
      },
    });
  };

  render() {
    const { item, t } = this.props;
    return (
      <Container>
        <Question>
          <Link onClick={this.moveToItem}>
            {item.id}# <FaAngleDoubleRight />
          </Link>
          <div dangerouslySetInnerHTML={{ __html: item.stimulus }} />
        </Question>
        <Author>
          <div>
            Author: <span>Kevin Hart</span>
          </div>
          <Time>
            <Icon color="#ee1658" /> an hour ago
          </Time>
        </Author>
        <Labels>
          <Label>Order List</Label>
          <Label>Order List</Label>
          <Label>Order List</Label>
        </Labels>
        <View>
          <Button
            style={{
              width: '100%',
              height: 50,
              fontSize: 11,
              fontWeight: 600,
            }}
            variant="extendedFab"
            color="primary"
            outlined
            onClick={this.moveToItem}
          >
            {t('component.item.view')}
          </Button>
        </View>
      </Container>
    );
  }
}

export default withNamespaces('author')(Item);

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${grey};
  padding: 30px 0;

  @media (max-width: ${tabletWidth}) {
    flex-direction: column;
  }
`;

const Link = styled.a`
  font-size: 16px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: ${blue};
  cursor: pointer;

  :hover {
    color: ${darkBlue};
  }
`;

const Icon = styled(IconClockCircularOutline)`
  margin-right: 15px;
`;

const Time = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;

  @media (max-width: ${tabletWidth}) {
    justify-content: center;
  }
`;

const Label = styled.span`
  text-transform: uppercase;
  border-radius: 10px;
  color: ${textColor};
  border: 1px solid #b1b1b1;
  font-size: 8px;
  width: 105px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 7px;
  margin-bottom: 7px;

  :last-child {
    margin-right: 0;
  }

  @media (max-width: ${tabletWidth}) {
    width: 100%;
  }
`;

const Question = styled.div`
  width: 50%;

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

const Author = styled.div`
  width: 15%;
  font-size: 13px;

  @media (max-width: ${tabletWidth}) {
    width: 100%;
    text-align: center;
  }
`;

const Labels = styled.div`
  width: 20%;
  display: flex;
  flex-wrap: wrap;

  @media (max-width: ${tabletWidth}) {
    width: 100%;
    flex-direction: column;
    margin: 20px 0;
  }
`;

const View = styled.div`
  width: 15%;
  display: flex;
  justify-content: flex-end;

  @media (max-width: ${tabletWidth}) {
    width: 100%;
  }
`;
