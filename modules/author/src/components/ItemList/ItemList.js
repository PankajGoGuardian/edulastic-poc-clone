import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getItemsListSelector,
  getItemsPageSelector,
  getItemsLimitSelector,
  getItemsCountSelector,
  getItemsLoadingSelector,
} from '../../selectors/items';
import Item from './Item';
import { receiveItemsAction } from '../../actions/items';
import Header from './Header';
import { Paper, Pagination } from '../../../../assessment/src/components/common';
import { PaddingDiv } from '../common';

class ItemList extends Component {
  componentDidMount() {
    const { receiveItems, page, limit } = this.props;
    receiveItems({ page, limit });
  }

  handleSearch = (value) => {
    const { receiveItems, limit } = this.props;
    receiveItems({ page: 1, limit, search: value });
  };

  handleCreate = () => {
    console.log('create');
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
    const { items, match, page, limit, count, loading } = this.props;

    return (
      <PaddingDiv top={20} left={40} right={40}>
        <Header onSearch={this.handleSearch} onCreate={this.handleCreate} />
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
      </PaddingDiv>
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
};

export default connect(
  state => ({
    items: getItemsListSelector(state),
    page: getItemsPageSelector(state),
    limit: getItemsLimitSelector(state),
    count: getItemsCountSelector(state),
    loading: getItemsLoadingSelector(state),
  }),
  { receiveItems: receiveItemsAction },
)(ItemList);
