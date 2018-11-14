import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { FlexContainer, Tabs } from '@edulastic/common';
import ItemDetailWidget from './ItemDetailWidget';
import ItemDetailDropTarget from './ItemDetailDropTarget';
import { getItemDetailDraggingSelector } from '../../../selectors/itemDetail';
import AddNew from './AddNew';

class ItemDetailRow extends Component {
  state = {
    value: 0,
  };

  static propTypes = {
    row: PropTypes.object.isRequired,
    onAdd: PropTypes.func.isRequired,
    dragging: PropTypes.bool.isRequired,
    onDeleteWidget: PropTypes.func.isRequired,
    onEditWidget: PropTypes.func.isRequired,
    onEditTabTitle: PropTypes.func.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  handleTabChange = (value) => {
    this.setState({
      value,
    });
  };

  renderTabContent = ({ widgetIndex, widget, rowIndex }) => {
    const { onEditWidget, onDeleteWidget } = this.props;

    return (
      <ItemDetailWidget
        widget={widget}
        onEdit={() => onEditWidget(widget)}
        onDelete={() => onDeleteWidget(widgetIndex)}
        widgetIndex={widgetIndex}
        rowIndex={rowIndex}
      />
    );
  };

  render() {
    const { row, onAdd, onEditTabTitle, rowIndex, dragging } = this.props;
    const { value } = this.state;

    return (
      <Container style={{ width: row.dimension }}>
        {row.tabs &&
          !!row.tabs.length && (
            <Tabs value={value} onChange={this.handleTabChange}>
              {row.tabs.map((tab, tabIndex) => (
                <Tabs.Tab
                  key={tabIndex}
                  label={tab}
                  style={{ width: '50%', textAlign: 'center', padding: '30px 20px 15px' }}
                  onChange={e => onEditTabTitle(tabIndex, e.target.value)}
                  editable
                />
              ))}
            </Tabs>
        )}
        {!row.widgets.length &&
          dragging && <ItemDetailDropTarget widgetIndex={0} rowIndex={rowIndex} tabIndex={0} />}
        {dragging &&
          row.widgets.filter(w => w.tabIndex === value).length === 0 && (
            <ItemDetailDropTarget widgetIndex={0} rowIndex={rowIndex} tabIndex={value} />
        )}
        {row.widgets.map((widget, i) => (
          <React.Fragment key={i}>
            {dragging &&
              widget.tabIndex === value && (
                <ItemDetailDropTarget widgetIndex={i} rowIndex={rowIndex} tabIndex={value} />
            )}
            {!!row.tabs.length &&
              value === widget.tabIndex &&
              this.renderTabContent({ widgetIndex: i, widget, rowIndex })}
            {!row.tabs.length && this.renderTabContent({ widgetIndex: i, widget, rowIndex })}
          </React.Fragment>
        ))}
        <FlexContainer justifyContent="center" style={{ marginBottom: 30, marginRight: 40 }}>
          <AddNew onClick={() => onAdd({ rowIndex, tabIndex: value })} />
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
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  overflow: auto;
  padding-left: 40px;
  padding-top: 20px;
  height: 100%;
`;
