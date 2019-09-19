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
    qIndex: PropTypes.number
  };

  static defaultProps = {
    showFeedback: false,
    multiple: false,
    style: {},
    qIndex: null
  };

  handleTabChange = value => {
    this.setState({
      value
    });
  };

  renderTabContent = (widget, flowLayout, index) => {
    const {
      preview,
      LCBPreviewModal,
      showFeedback,
      multiple,
      questions,
      qIndex,
      evaluation,
      previewTab,
      col,
      ...restProps
    } = this.props;
    const timespent = widget.timespent !== undefined ? widget.timespent : null;

    // question label for preview mode
    const question =
      questions[widget.reference] && questions[widget.reference].qLabel
        ? questions[widget.reference]
        : { ...questions[widget.reference], qLabel: `Q${index + 1}` };
    if (!question) {
      return <div />;
    }

    if (question.activity && question.activity.filtered) {
      return <div />;
    }
    // For Multipart with item level scoring display only one feedback else allow for question level scoring
    const displayFeedback = col.isV1Multipart && !multiple && index > 0 ? false : true;
    return (
      <Tabs.TabContainer>
        <QuestionWrapper
          showFeedback={showFeedback}
          evaluation={evaluation}
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
          LCBPreviewModal={LCBPreviewModal}
          displayFeedback={displayFeedback}
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
        style={style}
        width={col.dimension || "auto"}
        hasCollapseButtons={
          ["studentReport", "studentPlayer"].includes(restProps.viewComponent) && restProps.showCollapseBtn
        }
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
              {col.tabs && !col.tabs.length && this.renderTabContent(widget, col.flowLayout, i)}
            </React.Fragment>
          ))}
        </WidgetContainer>
      </Container>
    );
  }
}

export default TestItemCol;
