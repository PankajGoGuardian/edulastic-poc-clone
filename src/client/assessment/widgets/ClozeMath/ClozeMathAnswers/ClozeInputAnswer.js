import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Collapse, Input, Icon } from "antd";
import { white, darkGrey1, inputBorder } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";

const { Panel } = Collapse;

const AnswerContainer = styled.div`
  margin-top: 16px;
  .ant-collapse-item {
    border: 1px solid ${inputBorder};
    margin-bottom: 16px;

    .ant-collapse-header {
      background-color: ${darkGrey1};
      color: ${white};
      font-weight: 600;
    }

    .ant-collapse-content {
      margin-top: 8px;
    }
  }
`;

class ClozeInputAnswer extends Component {
  onChangeHandler = (value, inputIndex) => {
    const { onChange: changeAnswers } = this.props;
    changeAnswers({ value, inputIndex });
  };

  render() {
    const { answers } = this.props;

    return (
      <AnswerContainer>
        <Collapse
          onChange={() => {}}
          bordered={false}
          expandIconPosition="right"
          expandIcon={({ isActive }) => (isActive ? <Icon type="caret-up" /> : <Icon type="caret-down" />)}
        >
          {answers.map(answer => (
            <Panel header={`Text Input ${answer.index + 1}`} key={answer.index}>
              <Input value={answer.value} onChange={e => this.onChangeHandler(e.target.value, answer.targetIndex)} />
            </Panel>
          ))}
        </Collapse>
      </AnswerContainer>
    );
  }
}

ClozeInputAnswer.propTypes = {
  answers: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(ClozeInputAnswer);
