import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { greenDark } from '@edulastic/colors';
import { compose } from 'redux';
import { connect } from 'react-redux';

import AddNew from '../../ItemAdd/AddNew';
import ItemDetailWidget from './ItemDetailWidget';
import ItemDetailDropTarget from './ItemDetailDropTarget';
import { getItemDetailDraggingSelector } from '../../../selectors/itemDetail';

class ItemDetailRow extends Component {
  static propTypes = {
    row: PropTypes.object.isRequired,
    onAdd: PropTypes.func.isRequired,
    dragging: PropTypes.bool.isRequired,
  };

  handleEdit = () => {};

  handleDelete = () => {};

  render() {
    const { row, onAdd, dragging } = this.props;

    return (
      <Container style={{ width: row.dimension }}>
        {row.widgets.map((widget, i) => (
          <React.Fragment key={i}>
            {dragging && <ItemDetailDropTarget />}
            <ItemDetailWidget
              key={i}
              widget={widget}
              onEdit={this.handleEdit}
              onDelete={this.handleDelete}
            />
          </React.Fragment>
        ))}
        <AddNew moveNew={onAdd} style={{ height: 150, width: '90%', marginBottom: 40 }} />
      </Container>
    );
  }
}

const enhance = compose(
  connect(state => ({
    dragging: getItemDetailDraggingSelector(state),
  })),
);

export default enhance(ItemDetailRow);

const Container = styled.div`
  border-right: 60px solid ${greenDark};
`;
