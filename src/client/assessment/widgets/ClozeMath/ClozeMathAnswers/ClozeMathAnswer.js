import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Collapse, Icon } from "antd";
import { EduButton } from "@edulastic/common";
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
    const { answer, onChange, onAdd, onDelete, item, t } = this.props;

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
          defaultActiveKey={["0"]}
          onChange={() => {}}
          bordered={false}
          expandIconPosition="right"
          expandIcon={({ isActive }) => (isActive ? <Icon type="caret-up" /> : <Icon type="caret-down" />)}
        >
          {answer.map((responseValue, i) => (
            <Panel header={`Math Input ${i + 1}`} key={`${i}`}>
              {responseValue.map((method, methodIndex) => (
                <MathFormulaAnswerMethod
                  onDelete={() => onDelete({ methodIndex, methodValueIndex: i })}
                  key={methodIndex + i}
                  item={item}
                  index={methodIndex}
                  answerIndex={methodIndex}
                  onChange={_changeMethod(i, methodIndex)}
                  showAdditionals={showAdditionals}
                  handleChangeAdditionals={handleChangeAdditionals}
                  clearAdditionals={clearAdditionals}
                  {...method}
                />
              ))}
              {showAdditionals.length === 0 ? (
                <EduButton onClick={() => onAdd(i)} type="primary" size="large" data-cy="add-new-method">
                  {t("component.math.addComparison")}
                </EduButton>
              ) : null}
            </Panel>
          ))}
        </Collapse>
      </AnswerContainer>
    );
  }
}

ClozeMathAnswer.propTypes = {
  answer: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default withNamespaces("assessment")(ClozeMathAnswer);
