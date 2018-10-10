import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { greenDark } from '@edulastic/colors';
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
    const { onEditWidget, onDeleteWidget, dragging } = this.props;

    return (
      <Tabs.TabContainer>
        {dragging && (
          <ItemDetailDropTarget
            widgetIndex={widgetIndex}
            rowIndex={rowIndex}
            tabIndex={widget.tabIndex}
          />
        )}
        <ItemDetailWidget
          widget={widget}
          onEdit={() => onEditWidget(widget)}
          onDelete={() => onDeleteWidget(widgetIndex)}
          widgetIndex={widgetIndex}
          rowIndex={rowIndex}
        />
      </Tabs.TabContainer>
    );
  };

  render() {
    const { row, onAdd, onEditTabTitle, rowIndex } = this.props;
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
        {row.widgets.map((widget, i) => (
          <React.Fragment key={i}>
            {!!row.tabs.length &&
              value === widget.tabIndex &&
              this.renderTabContent({ widgetIndex: i, widget, rowIndex })}
            {!row.tabs.length && this.renderTabContent({ widgetIndex: i, widget, rowIndex })}
          </React.Fragment>
        ))}
        <FlexContainer justifyContent="center" style={{ marginBottom: 30 }}>
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
  border-right: 60px solid ${greenDark};
`;
