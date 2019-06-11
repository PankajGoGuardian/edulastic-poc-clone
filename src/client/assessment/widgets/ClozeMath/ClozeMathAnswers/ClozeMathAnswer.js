import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Collapse, Icon } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { white, darkGrey1, inputBorder } from "@edulastic/colors";

import MathFormulaAnswerMethod from "../../MathFormula/components/MathFormulaAnswerMethod";

const { Panel } = Collapse;

const AnswerContainer = styled.div`
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
class ClozeMathAnswer extends Component {
  state = {
    showAdditionals: []
  };

  render() {
    const { answers, onChange, onAdd, onDelete, item } = this.props;

    const { showAdditionals } = this.state;

    const _changeMethod = (methodValueIndex, methodIndex) => (prop, val) => {
      onChange({ methodValueIndex, methodIndex, prop, value: val });
    };

    const handleChangeAdditionals = (method, direction) => {
      const methods = showAdditionals;

      switch (direction) {
        case "pop":
          methods.splice(methods.findIndex(el => el === method));
          break;
        case "push":
        default:
          methods.push(method);
          break;
      }

      this.setState({
        showAdditionals: methods
      });
    };

    const clearAdditionals = () => {
      this.setState({
        showAdditionals: []
      });
    };

    return (
      <AnswerContainer>
        <Collapse
          // defaultActiveKey={["0"]}
          onChange={() => {}}
          bordered={false}
          expandIconPosition="right"
          expandIcon={({ isActive }) => (isActive ? <Icon type="caret-up" /> : <Icon type="caret-down" />)}
        >
          {answers.map(answer => (
            <Panel header={`Math Input ${answer.index + 1}`} key={`${answer.targetIndex}`}>
              {answer.value.map((method, methodIndex) => (
                <MathFormulaAnswerMethod
                  onDelete={() => onDelete({ methodIndex, methodValueIndex: answer.targetIndex })}
                  key={methodIndex + answer.index}
                  item={item}
                  index={methodIndex}
                  answer={method.value}
                  answerIndex={methodIndex}
                  onChange={_changeMethod(answer.targetIndex, methodIndex)}
                  showAdditionals={showAdditionals}
                  handleChangeAdditionals={handleChangeAdditionals}
                  clearAdditionals={clearAdditionals}
                  onAdd={onAdd}
                  onAddIndex={answer.targetIndex}
                  {...method}
                />
              ))}
            </Panel>
          ))}
        </Collapse>
      </AnswerContainer>
    );
  }
}

ClozeMathAnswer.propTypes = {
  answers: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default withNamespaces("assessment")(ClozeMathAnswer);
