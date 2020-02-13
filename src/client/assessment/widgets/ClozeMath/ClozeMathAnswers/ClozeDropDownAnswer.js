import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Collapse, Select, Icon } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { greyThemeLight, greyThemeLighter, greyThemeDark2 } from "@edulastic/colors";
import { response } from "@edulastic/constants";
import { SelectInputStyled } from "../../../styled/InputStyles";

const { Panel } = Collapse;
const { Option } = Select;

const AnswerContainer = styled.div`
  margin-top: 16px;
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
  }
`;

const AnswerSelect = styled(SelectInputStyled)`
  min-width: 140px;
  width: ${({ width }) => (!width ? null : `${width}`)};
  height: ${({ height }) => (!height ? null : `${height}`)};

  .ant-select-selection {
    height: ${response.minHeight}px;
  }

  .ant-select-selection__rendered {
    min-height: ${response.minHeight}px;
  }
`;

class ClozeDropDownAnswer extends Component {
  selectChange = (value, dropDownId) => {
    const { onChange: changeAnswers } = this.props;
    changeAnswers({ value, dropDownId });
  };

  render() {
    const { answers, item } = this.props;
    const { options, responseContainers = [] } = item;

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
            const response = responseContainers.find(respCont => respCont.id === answer.id);
            const width =
              response && response.widthpx ? `${response.widthpx}px` : `${item.uiStyle.minWidth}px` || "auto";
            const height = response && response.heightpx ? `${response.heightpx}px` : "auto";
            return (
              <Panel header={`Text Dropdown ${answer.index + 1}`} key={answer.index}>
                <AnswerSelect
                  value={answer.value}
                  onChange={text => this.selectChange(text, answer.id)}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  width={width}
                  height={height}
                >
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
