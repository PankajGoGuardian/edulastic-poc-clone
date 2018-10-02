import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Paper, Pagination, withWindowSizes } from '@edulastic/common';
import { compose } from 'redux';
import styled from 'styled-components';

import { mobileWidth } from '@edulastic/colors';
import {
  getItemsListSelector,
  getItemsPageSelector,
  getItemsLimitSelector,
  getItemsCountSelector,
  getItemsLoadingSelector,
} from '../../selectors/items';
import Item from './Item';
import { receiveItemsAction, createItemAction } from '../../actions/items';
import Header from './Header';

class ItemList extends Component {
  componentDidMount() {
    const { receiveItems, page, limit } = this.props;
    receiveItems({ page, limit });
  }

  handleSearch = (value) => {
    const { receiveItems, limit } = this.props;
    receiveItems({ page: 1, limit, search: value });
  };

  handleCreate = async () => {
    const { history, createItem } = this.props;
    await createItem({ reference: '1234567895' });
    history.push('./add-item');
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
    const { items, match, page, limit, count, loading, windowWidth } = this.props;
    return (
      <Container>
        <Header
          onSearch={this.handleSearch}
          onCreate={this.handleCreate}
          windowWidth={windowWidth}
        />
        <Paper style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
          {items.map(item => (
            // eslint-disable-next-line
            <Item key={item._id} item={item} match={match} />
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

ItemList.propTypes = {
  items: PropTypes.array.isRequired,
  receiveItems: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  createItem: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const enhance = compose(
  withWindowSizes,
  connect(
    state => ({
      items: getItemsListSelector(state),
      page: getItemsPageSelector(state),
      limit: getItemsLimitSelector(state),
      count: getItemsCountSelector(state),
      loading: getItemsLoadingSelector(state),
    }),
    {
      receiveItems: receiveItemsAction,
      createItem: createItemAction,
    },
  ),
);

export default enhance(ItemList);

const Container = styled.div`
  padding: 20px 40px;

  @media (max-width: ${mobileWidth}) {
    padding: 10px 25px;
  }
`;
