import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { greenDark } from '@edulastic/colors';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { FlexContainer } from '@edulastic/common';
import ItemDetailWidget from './ItemDetailWidget';
import ItemDetailDropTarget from './ItemDetailDropTarget';
import { getItemDetailDraggingSelector } from '../../../selectors/itemDetail';
import AddNew from './AddNew';

class ItemDetailRow extends Component {
  static propTypes = {
    row: PropTypes.object.isRequired,
    onAdd: PropTypes.func.isRequired,
    dragging: PropTypes.bool.isRequired,
    onDeleteWidget: PropTypes.func.isRequired,
    onEditWidget: PropTypes.func.isRequired,
  };

  render() {
    const { row, onAdd, dragging, onDeleteWidget, onEditWidget } = this.props;

    return (
      <Container style={{ width: row.dimension }}>
        {row.widgets.map((widget, i) => (
          <React.Fragment key={i}>
            {dragging && <ItemDetailDropTarget />}
            <ItemDetailWidget
              key={i}
              widget={widget}
              onEdit={() => onEditWidget(widget)}
              onDelete={() => onDeleteWidget(i)}
            />
          </React.Fragment>
        ))}
        <FlexContainer justifyContent="center" style={{ marginBottom: 30 }}>
          <AddNew onClick={onAdd} />
        </FlexContainer>
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
