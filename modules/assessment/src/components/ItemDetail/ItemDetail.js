import React, { Component } from 'react';
// import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Paper, Select, Preloader } from '../common';
// import { receiveItemByIdAction } from '../../actions/items';
// import { getItemSelector } from '../../selectors/items';

class ItemDetail extends Component {
  componentDidMount() {
    const { receiveItemById, match } = this.props;
    receiveItemById(match.params.id);
  }

  handleBathtubChange = (value) => {
    console.log(value);
  };

  render() {
    const { item } = this.props;
    console.log(item);
    if (!item) return <Preloader />;
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
};

ItemDetail.defaultProps = {
  item: null,
};

export default ItemDetail;
// export default connect(
//   state => ({
//     item: getItemSelector(state),
//   }),
//   { receiveItemById: receiveItemByIdAction },
// )(ItemDetail);
