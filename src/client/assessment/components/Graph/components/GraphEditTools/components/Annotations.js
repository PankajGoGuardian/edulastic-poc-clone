import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import produce from "immer";
import { isEqual } from "lodash";
import { v4 } from "uuid";

import { withNamespaces } from "@edulastic/localization";
import { Button, FroalaEditor } from "@edulastic/common";
import { IconTrash } from "@edulastic/icons";
import { red, secondaryTextColor, white } from "@edulastic/colors";

import { FroalaInput } from "../styled/FroalaInput";

class Annotations extends Component {
  constructor(props) {
    super(props);

    const { annotations = [] } = props.graphData;

    this.state = {
      ans: annotations.map(e => e.value),
      newAnnotation: ""
    };
  }

  componentDidUpdate(prevProps) {
    const {
      graphData: { annotations }
    } = this.props;

    if (!isEqual(annotations, prevProps.graphData.annotations)) {
      this.updateState();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  updateState = () => {
    const {
      graphData: { annotations = [] }
    } = this.props;

    this.setState({ ans: annotations.map(e => e.value) });
  };

  handleAddAnnotation = () => {
    const { ans, newAnnotation } = this.state;
    const { graphData, setQuestionData } = this.props;

    if (!newAnnotation) {
      return;
    }

    ans.push(newAnnotation);
    this.setState({ ans, newAnnotation: "" });

    setQuestionData(
      produce(graphData, draft => {
        if (!draft.annotations) {
          draft.annotations = [];
        }
        draft.annotations.push({
          id: v4(),
          value: ans[ans.length - 1],
          position: { x: draft.annotations.length * 50, y: 0 },
          size: {
            width: 120,
            height: 80
          }
        });
      })
    );
  };

  handleDeleteAnnotation = index => () => {
    const { graphData, setQuestionData } = this.props;
    setQuestionData(
      produce(graphData, draft => {
        draft.annotations.splice(index, 1);
      })
    );
  };

  handleInput = (value, index = null) => {
    const { ans } = this.state;
    const { graphData, setQuestionData } = this.props;

    if (index === null) {
      this.setState({ newAnnotation: value });
    } else {
      ans[index] = value;
      this.setState({ ans });
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (!graphData.annotations && !graphData.annotations[index]) {
          return;
        }
        setQuestionData(
          produce(graphData, draft => {
            draft.annotations[index].value = value;
          })
        );
        clearTimeout(this.timer);
      }, 600);
    }
  };

  render() {
    const { t } = this.props;
    const { ans, newAnnotation } = this.state;

    const btnStyles = {
      height: "40px",
      minWidth: "40px",
      maxWidth: "40px",
      marginLeft: "5px",
      borderRadius: "4px",
      padding: "5px"
    };

    return (
      <Container>
        {ans.map((an, index) => (
          <Wrapper key={`annotation-wrapper-${index}`} style={{ marginBottom: "7px" }}>
            <FroalaInput style={{ width: "205px" }}>
              <FroalaEditor
                value={an}
                onChange={val => this.handleInput(val, index)}
                toolbarInline
                toolbarVisibleWithoutSelection
                config={{ placeholder: "" }}
              />
            </FroalaInput>
            <Button
              key={`an-del-${index}`}
              style={{ ...btnStyles, backgroundColor: red }}
              onClick={this.handleDeleteAnnotation(index)}
            >
              <IconTrash color={white} />
            </Button>
          </Wrapper>
        ))}
        <Wrapper key="annotation-wrapper-add">
          <FroalaInput style={{ width: "160px" }}>
            <FroalaEditor
              value={newAnnotation}
              onChange={val => this.handleInput(val)}
              style={{ height: "40px", width: "160px" }}
              toolbarInline
              toolbarVisibleWithoutSelection
              config={{ placeholder: "" }}
            />
          </FroalaInput>
          <Button
            key="an-add"
            style={{ ...btnStyles, minWidth: "85px", maxWidth: "85px" }}
            onClick={this.handleAddAnnotation}
            color="primary"
          >
            {t("component.graphing.settingsPopup.addText")}
          </Button>
        </Wrapper>
      </Container>
    );
  }
}

Annotations.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired
};

export default withNamespaces("assessment")(Annotations);

const Container = styled.div`
  padding: 12px 17px;
  color: ${secondaryTextColor};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;
