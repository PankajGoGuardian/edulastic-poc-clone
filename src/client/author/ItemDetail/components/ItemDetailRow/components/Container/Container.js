import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";

import { Tabs } from "@edulastic/common";
import ItemDetailWidget from "../ItemDetailWidget/ItemDetailWidget";
import ItemDetailDropTarget from "../ItemDetailDropTarget/ItemDetailDropTarget";
import { getItemDetailDraggingSelector } from "../../../../ducks";
import { MAX_MOBILE_WIDTH } from "../../../../../src/constants/others";
import AddNew from "../AddNew/AddNew";
import { Content, AddButtonContainer, TabContainer, WidgetContainer } from "./styled";
// src/client/author/ItemDetail/ducks.js
import { setItemLevelScoreAction } from "../../../../ducks";
import { FlexContainer } from "@edulastic/common";
class Container extends Component {
  state = {
    tabIndex: 0
  };

  static propTypes = {
    row: PropTypes.object.isRequired,
    onAdd: PropTypes.func.isRequired,
    dragging: PropTypes.bool.isRequired,
    onDeleteWidget: PropTypes.func.isRequired,
    onEditWidget: PropTypes.func.isRequired,
    onEditTabTitle: PropTypes.func.isRequired,
    rowIndex: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    windowWidth: PropTypes.number.isRequired
  };

  handleTabChange = tabIndex => {
    this.setState({
      tabIndex
    });
  };

  onEditWidgetClick = (widget, rowIndex) => () => {
    const { onEditWidget } = this.props;
    onEditWidget(widget, rowIndex);
  };

  onDeleteWidgetClick = widgetIndex => () => {
    const { onDeleteWidget } = this.props;
    onDeleteWidget(widgetIndex);
  };

  onAddBtnClick = object => () => {
    const { onAdd } = this.props;
    onAdd(object);
  };

  renderTabContent = ({ widgetIndex, widget, rowIndex, flowLayout }) => (
    <ItemDetailWidget
      widget={widget}
      onEdit={this.onEditWidgetClick(widget, rowIndex)}
      onDelete={this.onDeleteWidgetClick(widgetIndex)}
      widgetIndex={widgetIndex}
      itemData={this.props.itemData}
      rowIndex={rowIndex}
      flowLayout={flowLayout}
    />
  );

  renderWidgets = () => {
    const { row, dragging, rowIndex, itemData, setItemLevelScore } = this.props;
    const { tabIndex } = this.state;
    return (
      <WidgetContainer flowLayout={row.flowLayout}>
        {!row.widgets.length && itemData.itemLevelScoring && (
          <FlexContainer justifyContent={"flex-end"} marginBottom={"1em"}>
            <div className="points">Points</div>
            <div>
              <input
                className="ant-input"
                type="number"
                min={0}
                value={itemData.itemLevelScore}
                onChange={e => {
                  const v = parseFloat(e.target.value);
                  setItemLevelScore(v);
                }}
                style={{ maxWidth: "45px" }}
              />
            </div>
          </FlexContainer>
        )}
        {row.widgets.map((widget, i) => (
          <React.Fragment key={i}>
            {dragging && widget.tabIndex === tabIndex && (
              <ItemDetailDropTarget widgetIndex={i} rowIndex={rowIndex} tabIndex={tabIndex} />
            )}
            {!!row.tabs.length &&
              tabIndex === widget.tabIndex &&
              this.renderTabContent({ widgetIndex: i, widget, rowIndex, flowLayout: row.flowLayout })}
            {!row.tabs.length &&
              this.renderTabContent({ widgetIndex: i, widget, rowIndex, flowLayout: row.flowLayout })}
          </React.Fragment>
        ))}
      </WidgetContainer>
    );
  };

  render() {
    const { row, onEditTabTitle, rowIndex, dragging, count, windowWidth } = this.props;
    const { tabIndex } = this.state;
    return (
      <Content
        value={tabIndex}
        style={{
          width: row.dimension,
          marginRight: count - 1 === rowIndex ? "0px" : "30px"
        }}
      >
        {row.tabs && row.tabs.length > 0 && windowWidth > MAX_MOBILE_WIDTH && (
          <TabContainer>
            <Tabs value={tabIndex} onChange={ind => this.handleTabChange(ind)}>
              {row.tabs.map((tab, key) => (
                <Tabs.Tab
                  key={key}
                  label={tab}
                  style={{
                    width: "50%",
                    textAlign: "center",
                    padding: "20px 15px"
                  }}
                  onChange={e => onEditTabTitle(tabIndex, e.target.value)}
                  editable
                />
              ))}
            </Tabs>
          </TabContainer>
        )}
        {!row.widgets.length && dragging && <ItemDetailDropTarget widgetIndex={0} rowIndex={rowIndex} tabIndex={0} />}
        {dragging && row.widgets.filter(w => w.tabIndex === tabIndex).length === 0 && (
          <ItemDetailDropTarget widgetIndex={0} rowIndex={rowIndex} tabIndex={tabIndex} />
        )}
        {this.renderWidgets()}

        <AddButtonContainer justifyContent="center">
          <AddNew onClick={this.onAddBtnClick({ rowIndex, tabIndex })} />
        </AddButtonContainer>
      </Content>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      dragging: getItemDetailDraggingSelector(state)
    }),
    {
      setItemLevelScore: setItemLevelScoreAction
    }
  )
);

export default enhance(Container);
