import React, { Component } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components";

import { withWindowSizes } from "@edulastic/common";

import { themes } from "../../themes";
import TestItemCol from "./containers/TestItemCol";
import { Container, Divider, CollapseBtn } from "./styled/Container";

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
    collapsed: [],
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

  setCollapseView = (index, dir) => {
    const { cols } = this.props;
    const { collapsed } = this.state;
    if (collapsed.length) {
      return this.setState({ collapsed: [], collapseDirection: "" });
    }

    const collapseLength = dir === "left" ? index : cols.length - index;
    const setNewCollapseArray = [...new Array(collapseLength)].map((_, i) =>
      dir === "left" ? i : cols.length - i - 1
    );
    this.setState({
      collapsed: setNewCollapseArray,
      collapseDirection: dir
    });
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
    const { collapsed, collapseDirection } = this.state;
    let questionCount = 0;
    cols
      .filter(item => item.widgets.length > 0)
      .forEach(({ widgets }) => {
        questionCount += widgets.length;
      });
    if (questionCount === 0) {
      return null;
    }

    //show collapse button only in student player or in author preview mode.
    const hasResourceTypeQuestion = cols.flatMap(item => item.widgets).find(item => item.widgetType === "resource");
    const showCollapseButtons = !collapseDirection && hasResourceTypeQuestion && showCollapseBtn;
    return (
      <ThemeProvider theme={themes.default}>
        <Container width={windowWidth} style={style}>
          {cols
            .filter((_, i) => !collapsed.includes(i))
            .map((col, i) => (
              <>
                {i > 0 && showCollapseButtons && (
                  <Divider>
                    <CollapseBtn className="fa fa-arrow-left" onClick={() => this.setCollapseView(i, "left")} />
                    <CollapseBtn className="fa fa-arrow-right" onClick={() => this.setCollapseView(i, "right")} />
                  </Divider>
                )}
                {collapseDirection === "left" && (
                  <CollapseBtn className="fa fa-arrow-right" onClick={this.setCollapseView} />
                )}
                <TestItemCol
                  {...restProps}
                  showCollapseBtn
                  evaluation={evaluation}
                  key={i}
                  col={col}
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
                {collapseDirection === "right" && (
                  <CollapseBtn className="fa fa-arrow-left" onClick={this.setCollapseView} />
                )}
              </>
            ))}
        </Container>
      </ThemeProvider>
    );
  }
}

const enhance = compose(withWindowSizes);

export default enhance(TestItemPreview);
