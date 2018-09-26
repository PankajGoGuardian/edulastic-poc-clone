import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getItemsListSelector } from '../../selectors/items';
import Item from './Item';
import { receiveItemsAction } from '../../actions/items';
import Header from './Header';
import { Paper, Pagination } from '../common';

class ItemList extends Component {
  componentDidMount() {
    const { receiveItems } = this.props;
    receiveItems();
  }

  handleSearch = (value) => {
    console.log(value);
  };

  handleCreate = () => {
    console.log('create');
  };

  handlePrevious = () => {
    console.log('prev');
  };

  handleNext = () => {
    console.log('next');
  };

  render() {
    const { items, match } = this.props;

    return (
      <React.Fragment>
        <Header onSearch={this.handleSearch} onCreate={this.handleCreate} />
        <Paper style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
          {items.map(item => (
            <Item key={item.id} item={item} match={match} />
          ))}
        </Paper>
        <Pagination
          onPrevious={this.handlePrevious}
          onNext={this.handleNext}
          page={1}
          itemsPerPage={10}
          count={95}
        />
      </React.Fragment>
    );
  }
}

ItemList.propTypes = {
  items: PropTypes.array.isRequired,
  receiveItems: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(
  state => ({
    items: getItemsListSelector(state),
  }),
  { receiveItems: receiveItemsAction },
)(ItemList);
