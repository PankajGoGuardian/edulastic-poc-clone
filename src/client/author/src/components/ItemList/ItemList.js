import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import { Paper, withWindowSizes } from '@edulastic/common';
import { compose } from 'redux';
import styled from 'styled-components';
import { withNamespaces } from '@edulastic/localization';
import {
  mobileWidth,
  desktopWidth,
  secondaryTextColor,
  greenDark,
  white,
  tabletWidth
} from '@edulastic/colors';

import {
  getItemsLimitSelector,
  getItemsLoadingSelector
} from '../../selectors/items';

import Item from './Item';
import ItemFilter from './ItemFilter';
import { receiveTestItemsAction } from '../../actions/testItems';
import { createTestItemAction } from '../../actions/testItem';
import { getTestItemsSelector } from '../../selectors/testItems';
import { getTestItemCreatingSelector } from '../../selectors/testItem';
import ListHeader from '../common/ListHeader';

class ItemList extends Component {
  componentDidMount() {
    const { receiveItems } = this.props;
    receiveItems({});
  }

  handleSearch = (value) => {
    const { receiveItems } = this.props;
    receiveItems({ page: 1, limit: 10, search: value });
  };

  handleCreate = async () => {
    const { createItem } = this.props;
    createItem({
      rows: [
        {
          tabs: [],
          dimension: '100%',
          widgets: []
        }
      ]
    });
  };

  handlePaginationChange = (page) => {
    const { receiveItems } = this.props;
    const { searchStr } = this.state;

    receiveItems({ page, limit: 10, search: searchStr });
  };

  render() {
    const { items, windowWidth, history, creating, count, t } = this.props;
    return (
      <Container>
        <ListHeader
          onCreate={this.handleCreate}
          creating={creating}
          windowWidth={windowWidth}
          title={t('component.itemlist.header.itemlist')}
        />
        <MainList id="main-list">
          <ItemFilter onSearch={this.handleSearch} windowWidth={windowWidth} />
          <ListItems id="item-list">
            {
              windowWidth > 468 && (
                <Pagination
                  simple={windowWidth <= 768 && true}
                  showTotal={(total, range) =>
                    `${range[0]} to ${range[1]} of ${total}`
                  }
                  onChange={this.handlePaginationChange}
                  defaultPageSize={10}
                  total={count}
                />
              )
            }
            <Items>
              <Paper padding={windowWidth > 768 ? '25px 39px 0px 39px' : '0px'}>
                {items.map(item => (
                  // eslint-disable-next-line
                  <Item
                    key={item.id}
                    item={item}
                    history={history}
                    windowWidth={windowWidth}
                  />
                ))}
              </Paper>
            </Items>
            <Pagination
              simple={windowWidth <= 768 && true}
              showTotal={(total, range) =>
                `${range[0]} to ${range[1]} of ${total}`
              }
              onChange={this.handlePaginationChange}
              defaultPageSize={10}
              total={count}
            />
          </ListItems>
        </MainList>
      </Container>
    );
  }
}

ItemList.propTypes = {
  items: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  receiveItems: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  createItem: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  creating: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
};

const enhance = compose(
  withWindowSizes,
  withNamespaces('author'),
  connect(
    state => ({
      items: getTestItemsSelector(state),
      limit: getItemsLimitSelector(state),
      loading: getItemsLoadingSelector(state),
      creating: getTestItemCreatingSelector(state)
    }),
    {
      receiveItems: receiveTestItemsAction,
      createItem: createTestItemAction
    }
  )
);

export default enhance(ItemList);

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 51px;
  position: relative;

  @media (max-width: ${mobileWidth}) {
    padding-bottom: 40px;
  }
`;

const MainList = styled.div`
  display: flex;
  height: 100%;
  @media (max-width: ${desktopWidth}) {
    display: block;
  }
`;

const ListItems = styled.div`
  flex: 1;
  margin: 29px 40px 0px 29px;

  .ant-pagination {
    display: flex;

    @media (max-width: ${tabletWidth}) {
      justify-content: flex-end;
      margin-left: 29px !important;
      margin-top: 80px !important;
    }
  }

  .ant-pagination-total-text {
    flex: 1;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Open Sans';
    color: ${secondaryTextColor};
    letter-spacing: normal;
  }

  .ant-pagination-item-active {
    border: none;
    opacity: 0.75;
    background-color: ${greenDark};
  }

  .ant-pagination-item-active a {
    color: ${white};
  }

  @media (max-width: ${mobileWidth}) {
    margin: 21px 26px 0px 26px;
  }
`;

const Items = styled.div`
  margin: 14px 0px;

  @media (max-width: ${mobileWidth}) {
    margin: 20px 0px;
  }
`;
