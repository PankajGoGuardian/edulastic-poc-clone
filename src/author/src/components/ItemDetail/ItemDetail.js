import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Paper, Select, Preloader } from '../common';
import { receiveItemByIdAction } from '../../actions/items';
import { getItemSelector, getItemLoadingSelector } from '../../selectors/items';

class ItemDetail extends Component {
  componentDidMount() {
    const { receiveItemById, match } = this.props;
    receiveItemById(match.params.id);
  }

  handleBathtubChange = (value) => {
    console.log(value);
  };

  render() {
    const { item, loading } = this.props;

    if (loading) return <Preloader />;
    if (!item) return null;

    return (
      <Paper>
        <div dangerouslySetInnerHTML={{ __html: item.stimulus }} />
        <p>
          Bathtub{' '}
          <Select
            value="first"
            onChange={this.handleBathtubChange}
            options={[{ value: 'first', label: 'First' }, { value: 'second', label: 'Second' }]}
          />{' '}
          will be empty
        </p>
        <p>
          The time it will take for this bathtub to empty is{' '}
          <Select
            value="first"
            onChange={this.handleBathtubChange}
            options={[{ value: 'first', label: 'First' }, { value: 'second', label: 'Second' }]}
          />{' '}
          will be empty
        </p>
      </Paper>
    );
  }
}

ItemDetail.propTypes = {
  receiveItemById: PropTypes.func.isRequired,
  item: PropTypes.any,
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

ItemDetail.defaultProps = {
  item: null,
};

export default connect(
  state => ({
    item: getItemSelector(state),
    loading: getItemLoadingSelector(state),
  }),
  { receiveItemById: receiveItemByIdAction },
)(ItemDetail);
