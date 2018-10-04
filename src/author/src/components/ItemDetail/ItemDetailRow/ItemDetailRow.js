import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { greenDark } from '@edulastic/colors';

import AddNew from '../../ItemAdd/AddNew';
import ItemDetailWidget from './ItemDetailWidget';

export default class ItemDetailRow extends Component {
  static propTypes = {
    row: PropTypes.object.isRequired,
    onAdd: PropTypes.func.isRequired,
  };

  handleEdit = () => {};

  handleDelete = () => {};

  render() {
    const { row, onAdd } = this.props;

    return (
      <Container style={{ width: row.dimension }}>
        {row.widgets.map((widget, i) => (
          <ItemDetailWidget
            key={i}
            widget={widget}
            onEdit={this.handleEdit}
            onDelete={this.handleDelete}
          />
        ))}
        <AddNew moveNew={onAdd} style={{ height: 150, width: '90%', marginBottom: 40 }} />
      </Container>
    );
  }
}

const Container = styled.div`
  border-right: 60px solid ${greenDark};
`;
