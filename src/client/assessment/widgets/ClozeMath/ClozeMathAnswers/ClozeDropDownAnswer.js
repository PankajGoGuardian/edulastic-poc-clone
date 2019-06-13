import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Collapse, Select, Icon } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { white, darkGrey1, inputBorder } from "@edulastic/colors";

const { Panel } = Collapse;
const { Option } = Select;

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

const AnswerSelect = styled(Select)`
  min-width: 120px;
`;

class ClozeDropDownAnswer extends Component {
  selectChange = (value, dropDownId) => {
    const { onChange: changeAnswers } = this.props;
    changeAnswers({ value, dropDownId });
  };

  render() {
    const { answers, item } = this.props;
    const { options } = item;

    return (
      <AnswerContainer>
        <Collapse
          onChange={() => {}}
          bordered={false}
          expandIconPosition="right"
          expandIcon={({ isActive }) => (isActive ? <Icon type="caret-up" /> : <Icon type="caret-down" />)}
        >
          {answers.map(answer => {
            const option = options[answer.id];

            return (
              <Panel header={`Text Dropdown ${answer.index + 1}`} key={answer.index}>
                <AnswerSelect value={answer.value} onChange={text => this.selectChange(text, answer.id)}>
                  {option &&
                    option.map((op, opIndex) => (
                      <Option value={op} key={opIndex}>
                        {op}
                      </Option>
                    ))}
                </AnswerSelect>
              </Panel>
            );
          })}
        </Collapse>
      </AnswerContainer>
    );
  }
}

ClozeDropDownAnswer.propTypes = {
  answers: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default withNamespaces("assessment")(ClozeDropDownAnswer);
