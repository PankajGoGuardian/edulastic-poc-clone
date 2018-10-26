import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Paper, Pagination, withWindowSizes } from '@edulastic/common';
import { compose } from 'redux';
import styled from 'styled-components';

import { mobileWidth } from '@edulastic/colors';
import {
  getItemsPageSelector,
  getItemsLimitSelector,
  getItemsCountSelector,
  getItemsLoadingSelector,
} from '../../selectors/items';
import Item from './Item';
import { receiveTestItemsAction } from '../../actions/testItems';
import { createTestItemAction } from '../../actions/testItem';
import { getTestItemsSelector } from '../../selectors/testItems';
import { getTestItemCreatingSelector } from '../../selectors/testItem';
import ListHeader from '../common/ListHeader';

class TestList extends Component {
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

  handlePrevious = () => {
    const { receiveItems, page, limit } = this.props;
    receiveItems({ page: page - 1, limit });
  };

  handleNext = () => {
    const { receiveItems, page, limit } = this.props;
    receiveItems({ page: page + 1, limit });
  };

  render() {
    const { items, page, limit, count, loading, windowWidth, history, creating } = this.props;
    return (
      <Container>
        <ListHeader
          onSearch={this.handleSearch}
          onCreate={this.handleCreate}
          creating={creating}
          windowWidth={windowWidth}
          title="Test List"
        />
        <Paper style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
          {items.map(item => (
            // eslint-disable-next-line
            <Item key={item.id} item={item} history={history} />
          ))}
        </Paper>
        <Pagination
          onPrevious={this.handlePrevious}
          onNext={this.handleNext}
          page={page}
          itemsPerPage={limit}
          count={count}
          loading={loading}
        />
      </Container>
    );
  }
}

TestList.propTypes = {
  items: PropTypes.array.isRequired,
  receiveItems: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  createItem: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  creating: PropTypes.bool.isRequired,
};

const enhance = compose(
  withWindowSizes,
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

export default enhance(TestList);

const Container = styled.div`
  padding: 20px 40px;

  @media (max-width: ${mobileWidth}) {
    padding: 10px 25px;
  }
`;
