import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tabs } from "@edulastic/common";

import { SMALL_DESKTOP_WIDTH, MAX_MOBILE_WIDTH } from "../../../../constants/others";

import QuestionWrapper from "../../../QuestionWrapper";

import { Container, WidgetContainer } from "./styled/Container";
import { MobileRightSide } from "./styled/MobileRightSide";
import { MobileLeftSide } from "./styled/MobileLeftSide";
import { IconArrow } from "./styled/IconArrow";

class TestItemCol extends Component {
  state = {
    value: 0
  };

  static propTypes = {
    col: PropTypes.object.isRequired,
    preview: PropTypes.string.isRequired,
    windowWidth: PropTypes.number.isRequired,
    showFeedback: PropTypes.bool,
    multiple: PropTypes.bool,
    style: PropTypes.object,
    questions: PropTypes.object.isRequired,
    qIndex: PropTypes.number.isRequired
  };

  static defaultProps = {
    showFeedback: false,
    multiple: false,
    style: {}
  };

  handleTabChange = value => {
    this.setState({
      value
    });
  };

  renderTabContent = (widget, flowLayout) => {
    const { preview, showFeedback, multiple, questions, qIndex, ...restProps } = this.props;
    const timespent = widget.timespent !== undefined ? widget.timespent : null;

    const question = questions[widget.reference];

    if (!question) {
      return <div />;
    }

    return (
      <Tabs.TabContainer>
        <QuestionWrapper
          testItem
          showFeedback={showFeedback}
          multiple={multiple}
          type={widget.type}
          view="preview"
          qIndex={qIndex}
          previewTab={preview}
          timespent={timespent}
          questionId={widget.reference}
          data={{ ...question, smallSize: true }}
          noPadding
          noBoxShadow
          isFlex
          flowLayout={flowLayout}
          {...restProps}
        />
      </Tabs.TabContainer>
    );
  };

  render() {
    const { col, style, windowWidth, ...restProps } = this.props;
    const { value } = this.state;
    return (
      <Container
        value={value}
        style={{
          ...style,
          width: windowWidth < SMALL_DESKTOP_WIDTH ? "100%" : "100%"
        }}
        width={col.dimension}
      >
        {col.tabs && !!col.tabs.length && windowWidth >= MAX_MOBILE_WIDTH && (
          <Tabs value={value} onChange={this.handleTabChange}>
            {col.tabs.map((tab, tabIndex) => (
              <Tabs.Tab
                key={tabIndex}
                label={tab}
                style={{
                  width: "50%",
                  textAlign: "center",
                  padding: "20px 15px"
                }}
                {...restProps}
              />
            ))}
          </Tabs>
        )}
        {col.tabs && windowWidth < MAX_MOBILE_WIDTH && !!col.tabs.length && value === 0 && (
          <MobileRightSide onClick={() => this.handleTabChange(1)}>
            <IconArrow type="left" />
          </MobileRightSide>
        )}
        {col.tabs && windowWidth < MAX_MOBILE_WIDTH && !!col.tabs.length && value === 1 && (
          <MobileLeftSide onClick={() => this.handleTabChange(0)}>
            <IconArrow type="right" />
          </MobileLeftSide>
        )}
        <WidgetContainer flowLayout={col.flowLayout}>
          {col.widgets.map((widget, i) => (
            <React.Fragment key={i}>
              {col.tabs &&
                !!col.tabs.length &&
                value === widget.tabIndex &&
                this.renderTabContent(widget, col.flowLayout)}
              {col.tabs && !col.tabs.length && this.renderTabContent(widget, col.flowLayout)}
            </React.Fragment>
          ))}
        </WidgetContainer>
      </Container>
    );
  }
}

export default TestItemCol;
