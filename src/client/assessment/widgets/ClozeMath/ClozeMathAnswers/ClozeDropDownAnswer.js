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
  selectChange = (value, dropIndex) => {
    const { onChange: changeAnswers } = this.props;
    changeAnswers({ value, dropIndex });
  };

  render() {
    const { answer, item } = this.props;
    const { options } = item;

    return (
      <AnswerContainer>
        <Collapse
          onChange={() => {}}
          bordered={false}
          expandIconPosition="right"
          expandIcon={({ isActive }) => (isActive ? <Icon type="caret-up" /> : <Icon type="caret-down" />)}
        >
          {answer.map((dropDownValue, dropIndex) => {
            const option = options[dropIndex];

            return (
              <Panel header={`Text Dropdown ${dropIndex + 1}`} key={dropIndex}>
                <AnswerSelect value={dropDownValue} onChange={text => this.selectChange(text, dropIndex)}>
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
  answer: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default withNamespaces("assessment")(ClozeDropDownAnswer);
