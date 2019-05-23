import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Collapse, Input } from "antd";

import { withNamespaces } from "@edulastic/localization";

const { Panel } = Collapse;

const AnswerContainer = styled.div`
  margin-top: 16px;
`;

class ClozeInputAnswer extends Component {
  onChangeHandler = (value, inputIndex) => {
    const { onChange: changeAnswers } = this.props;
    changeAnswers({ value, inputIndex });
  };

  render() {
    const { answer } = this.props;

    return (
      <AnswerContainer>
        <Collapse onChange={() => {}}>
          {answer.map((inputValue, inputIndex) => {
            const { value } = inputValue;
            return (
              <Panel header={`Text Input ${inputIndex + 1}`} key={inputIndex}>
                <Input value={value} onChange={e => this.onChangeHandler(e.target.value, inputIndex)} />
              </Panel>
            );
          })}
        </Collapse>
      </AnswerContainer>
    );
  }
}

ClozeInputAnswer.propTypes = {
  answer: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(ClozeInputAnswer);
