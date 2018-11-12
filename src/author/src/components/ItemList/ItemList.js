import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import { Paper, withWindowSizes } from '@edulastic/common';
import { compose } from 'redux';
import styled from 'styled-components';
import { withNamespaces } from '@edulastic/localization';
import { mobileWidth, secondaryTextColor, greenDark, white, tabletWidth } from '@edulastic/colors';

import {
  getItemsPageSelector,
  getItemsLimitSelector,
  getItemsCountSelector,
  getItemsLoadingSelector,
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
    receiveItems();
  }

  handleSearch = (value) => {
    const { receiveItems, limit } = this.props;
    receiveItems({ page: 1, limit, search: value });
  };

  handleCreate = async () => {
    const { createItem } = this.props;
    createItem({
      rows: [
        {
          tabs: [],
          dimension: '100%',
          widgets: [],
        },
      ],
    });
  };

  render() {
    const { items, windowWidth, history, creating, t } = this.props;
    return (
      <Container>
        <ListHeader
          onCreate={this.handleCreate}
          creating={creating}
          windowWidth={windowWidth}
          title={t('component.itemlist.header.itemlist')}
        />
        <MainList>
          <ItemFilter onSearch={this.handleSearch} />
          <ListItems>
            <Pagination
              simple={windowWidth <= 768 && true}
              showTotal={(total, range) => `${range[0]} to ${range[1]} of ${total}`}
              onChange={this.handlePageChange}
              defaultPageSize={20}
              total={300}
            />
            <Items>
              <Paper padding={windowWidth > 768 ? '25px 39px 0px 39px' : '0px'}>
                {items.map(item => (
                  // eslint-disable-next-line
                  <Item key={item.id} item={item} history={history} windowWidth={windowWidth} />
                ))}
              </Paper>
            </Items>
            <Pagination
              simple={windowWidth <= 768 && true}
              showTotal={(total, range) => `${range[0]} to ${range[1]} of ${total}`}
              onChange={this.handlePageChange}
              defaultPageSize={20}
              total={300}
            />
          </ListItems>
        </MainList>
      </Container>
    );
  }
}

ItemList.propTypes = {
  items: PropTypes.array.isRequired,
  receiveItems: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  createItem: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  creating: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

const enhance = compose(
  withWindowSizes,
  withNamespaces('author'),
  connect(
    state => ({
      items: getTestItemsSelector(state),
      page: getItemsPageSelector(state),
      limit: getItemsLimitSelector(state),
      count: getItemsCountSelector(state),
      loading: getItemsLoadingSelector(state),
      creating: getTestItemCreatingSelector(state),
    }),
    {
      receiveItems: receiveTestItemsAction,
      createItem: createTestItemAction,
    },
  ),
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
  position: absolute;
  height: 100%;
  overflow: auto;
  left: 0;
  right: 0;

  @media (max-width: ${mobileWidth}) {
    display: block;
  }
`;

const ListItems = styled.div`
  flex: 1;
  margin: 29px 40px 0px 18px;

  .ant-pagination {
    display: flex;

    @media (max-width: ${tabletWidth}) {
      justify-content: flex-end;
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
