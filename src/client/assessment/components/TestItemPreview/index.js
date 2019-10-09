import React, { Component } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { ThemeProvider, withTheme } from "styled-components";

import { withWindowSizes } from "@edulastic/common";

import { themes } from "../../../theme";
import TestItemCol from "./containers/TestItemCol";
import { Container, Divider, CollapseBtn } from "./styled/Container";
import { IconArrowLeft, IconArrowRight } from "@edulastic/icons";

class TestItemPreview extends Component {
  static propTypes = {
    cols: PropTypes.array.isRequired,
    verticalDivider: PropTypes.bool,
    scrolling: PropTypes.bool,
    preview: PropTypes.string.isRequired,
    windowWidth: PropTypes.number.isRequired,
    showFeedback: PropTypes.bool,
    style: PropTypes.object,
    questions: PropTypes.object.isRequired,
    qIndex: PropTypes.number,
    student: PropTypes.object
  };

  static defaultProps = {
    showFeedback: false,
    verticalDivider: false,
    scrolling: false,
    style: { padding: 0, display: "flex" },
    qIndex: null,
    student: {}
  };

  state = {
    collapseDirection: ""
  };
  getStyle = first => {
    const { verticalDivider, scrolling } = this.props;

    const style = {};

    if (first && verticalDivider) {
      style.borderRightWidth = "3px";
      style.borderRightStyle = "solid";
    }

    if (scrolling) {
      style.height = "calc(100vh - 200px)";
      style.overflowY = "auto";
    }

    return style;
  };

  setCollapseView = dir => {
    this.setState(prevState => ({
      collapseDirection: prevState.collapseDirection ? "" : dir
    }));
  };

  renderCollapseButtons = i => {
    const { collapseDirection } = this.state;
    return (
      <Divider isCollapsed={!!collapseDirection} collapseDirection={collapseDirection}>
        <div>
          <CollapseBtn collapseDirection={collapseDirection} onClick={() => this.setCollapseView("left")} left>
            <IconArrowLeft />
          </CollapseBtn>
          <CollapseBtn collapseDirection={collapseDirection} onClick={() => this.setCollapseView("right")} right>
            <IconArrowRight />
          </CollapseBtn>
        </div>
      </Divider>
    );
  };

  render() {
    const {
      cols,
      preview,
      style,
      windowWidth,
      showFeedback,
      questions,
      qIndex,
      student,
      metaData,
      disableResponse,
      evaluation,
      previewTab,
      LCBPreviewModal,
      showCollapseBtn = false,
      ...restProps
    } = this.props;
    const { collapseDirection } = this.state;
    let questionCount = 0;
    cols
      .filter(item => item.widgets.length > 0)
      .forEach(({ widgets = [] }) => {
        questionCount += widgets.length;
      });
    if (questionCount === 0) {
      return null;
    }
    //show collapse button only in student player or in author preview mode.
    const hasResourceTypeQuestion =
      cols.length > 1 && cols.flatMap(item => item.widgets).find(item => item.widgetType === "resource");
    const showCollapseButtons = hasResourceTypeQuestion && showCollapseBtn;
    return (
      <ThemeProvider theme={{ ...themes.default, twoColLayout: this.props.theme?.twoColLayout }}>
        <Container width={windowWidth} style={style} isCollapsed={!!collapseDirection}>
          {cols.map((col, i) => {
            const hideColumn = (collapseDirection === "left" && i === 0) || (collapseDirection === "right" && i === 1);
            if (hideColumn && showCollapseButtons) return "";
            return (
              <>
                {(i > 0 || collapseDirection === "left") && showCollapseButtons && this.renderCollapseButtons(i)}
                <TestItemCol
                  {...restProps}
                  showCollapseBtn={showCollapseButtons}
                  evaluation={evaluation}
                  key={i}
                  col={!!collapseDirection ? { ...col, dimension: "90%" } : col}
                  view="preview"
                  metaData={metaData}
                  preview={preview}
                  multiple={cols.length > 1}
                  style={this.getStyle(i !== cols.length - 1)}
                  windowWidth={windowWidth}
                  showFeedback={showFeedback}
                  questions={questions}
                  qIndex={qIndex}
                  student={student}
                  disableResponse={disableResponse}
                  LCBPreviewModal={LCBPreviewModal}
                />
                {collapseDirection === "right" && showCollapseButtons && this.renderCollapseButtons(i)}
              </>
            );
          })}
        </Container>
      </ThemeProvider>
    );
  }
}

const enhance = compose(
  withWindowSizes,
  withTheme
);

export default enhance(TestItemPreview);
