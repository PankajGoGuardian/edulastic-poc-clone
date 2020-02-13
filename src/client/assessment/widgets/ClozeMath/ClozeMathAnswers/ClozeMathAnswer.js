import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Collapse, Icon } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { greyThemeLight, greyThemeLighter, greyThemeDark2 } from "@edulastic/colors";
import { response as defaultResponse } from "@edulastic/constants";

import MathFormulaAnswerMethod from "../../MathFormula/components/MathFormulaAnswerMethod";

const { Panel } = Collapse;

const AnswerContainer = styled.div`
  .ant-collapse-item {
    border: 1px solid ${greyThemeLight};
    margin-bottom: 16px;

    .ant-collapse-header {
      background-color: ${greyThemeLighter};
      color: ${greyThemeDark2};
      font-weight: 600;
    }

    .ant-collapse-content {
      margin-top: 8px;
    }

    .input__absolute__keyboard {
      position: relative;
    }
  }
`;
class ClozeMathAnswer extends Component {
  state = {
    showAdditionals: []
  };

  render() {
    const {
      answers,
      onChange,
      onAdd,
      onDelete,
      item,
      onChangeKeypad,
      onChangeAllowedOptions,
      toggleAdditional
    } = this.props;
    const { showAdditionals } = this.state;
    const { responseContainers: responseContainers = [], uiStyle } = item;
    const _changeMethod = (methodId, methodIndex) => (prop, val) => {
      onChange({ methodId, methodIndex, prop, value: val });
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
          {answers.map(answer => {
            const response = responseContainers.find(cont => cont.index === answer.index);
            const width = response && response.widthpx ? `${response.widthpx}px` : `${uiStyle.minWidth}px` || "auto";
            const height = response && response.heightpx ? `${response.heightpx}px` : `${defaultResponse.minHeight}px`;
            return (
              <Panel header={`Math Input ${answer.index + 1}`} key={`${answer.index}`}>
                {answer.value.map((method, methodIndex) => (
                  <MathFormulaAnswerMethod
                    onDelete={() => onDelete({ methodIndex, methodId: method.id })}
                    key={methodIndex + answer.index}
                    item={item}
                    index={methodIndex}
                    answer={method.value}
                    answerIndex={methodIndex}
                    onChange={_changeMethod(method.id, methodIndex)}
                    showAdditionals={showAdditionals}
                    handleChangeAdditionals={handleChangeAdditionals}
                    clearAdditionals={clearAdditionals}
                    onAdd={onAdd}
                    onAddIndex={method.id}
                    style={{ width, height }}
                    onChangeKeypad={onChangeKeypad}
                    onChangeAllowedOptions={onChangeAllowedOptions}
                    allowNumericOnly={answer.allowNumericOnly}
                    allowedVariables={answer.allowedVariables}
                    useTemplate={answer.useTemplate}
                    template={answer.template}
                    isClozeMath
                    toggleAdditional={toggleAdditional}
                    {...method}
                  />
                ))}
              </Panel>
            );
          })}
        </Collapse>
      </AnswerContainer>
    );
  }
}

ClozeMathAnswer.propTypes = {
  answers: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onChangeKeypad: PropTypes.func.isRequired,
  onChangeAllowedOptions: PropTypes.func.isRequired,
  toggleAdditional: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default withNamespaces("assessment")(ClozeMathAnswer);
