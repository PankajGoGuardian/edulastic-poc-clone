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
    collapseDir: ""
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
      return this.setState({ collapsed: [], collapseDir: "" });
    }
    const setNewCollapseArray = [...new Array(cols.length - index)].map((_, i) => {
      const val = dir === "left" ? i : cols.length - i - 1;
      return val;
    });
    this.setState({
      collapsed: setNewCollapseArray,
      collapseDir: dir
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
      ...restProps
    } = this.props;
    const { collapsed, collapseDir } = this.state;
    let questionCount = 0;
    cols
      .filter(item => item.widgets.length > 0)
      .forEach(({ widgets }) => {
        questionCount += widgets.length;
      });
    if (questionCount === 0) {
      return null;
    }

    return (
      <ThemeProvider theme={themes.default}>
        <Container width={windowWidth} style={style}>
          {cols &&
            cols.length &&
            cols
              .filter((_, i) => !collapsed.includes(i))
              .map((col, i) => (
                <>
                  {i > 0 && !collapseDir ? (
                    <Divider>
                      <CollapseBtn className="fa fa-arrow-left" onClick={() => this.setCollapseView(i, "left")} />
                      <CollapseBtn className="fa fa-arrow-right" onClick={() => this.setCollapseView(i, "right")} />
                    </Divider>
                  ) : (
                    ""
                  )}
                  {collapseDir === "left" ? (
                    <CollapseBtn className="fa fa-arrow-right" onClick={this.setCollapseView} />
                  ) : (
                    ""
                  )}
                  <TestItemCol
                    {...restProps}
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
                  {collapseDir === "right" ? (
                    <CollapseBtn className="fa fa-arrow-left" onClick={this.setCollapseView} />
                  ) : (
                    ""
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
