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
  .ant-collapse-item {
    border: 1px solid ${greyThemeLight};
    margin-bottom: 4px;

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
  width: ${({ width }) => (!width ? null : `${width}`)};
  height: ${({ height }) => (!height ? null : `${height}`)};

  .ant-select-selection {
    height: ${response.minHeight}px;
    min-width: ${({ minWidth }) => `${minWidth || 140}px`};
  }

  .ant-select-selection__rendered {
    min-height: ${response.minHeight}px;
    max-width: 100%;
    min-width: ${({ minWidth }) => `${minWidth || 140}px`};
  }
`;

class ClozeDropDownAnswer extends Component {
  selectChange = (value, dropDownId) => {
    const { onChange: changeAnswers } = this.props;
    changeAnswers({ value, dropDownId });
  };

  get minWidthForOptions() {
    /**
     * the dropdown should have a min width = width of the option having max no of characters
     * basically auto expand
     * calculate the min width of the option based upon the length of characters
     * but max limit is 400px (response.maxWidth);
     *
     * @see https://snapwiz.atlassian.net/browse/EV-12606
     */
    const minWidthMap = {};
    const { item: { options = {} } = {} } = this.props;
    Object.keys(options).forEach(key => {
      const _options = options[key];
      const maxOptionLength = _options.reduce(
        (currentMaxLength, option) => Math.max(currentMaxLength, option.length),
        0
      );
      const splitWidth = Math.max(140, maxOptionLength * 14); // min of 140px, for all choices
      minWidthMap[key] = Math.min(response.maxWidth, splitWidth); // clamp to max 400px
    });
    return minWidthMap;
  }

  getResponseWidth(_response, minWidth) {
    const { item: { uiStyle = {} } = {} } = this.props;
    const respWidth = _response?.widthpx;
    const globalMinWidth = uiStyle?.minWidth;
    if (respWidth || globalMinWidth || minWidth) {
      return `${respWidth || Math.max(minWidth || globalMinWidth)}px`;
    }
    return "auto"; // fallback value
  }

  render() {
    const { answers, item } = this.props;
    const { options, responseContainers = [] } = item;
    const minWidthMap = this.minWidthForOptions;

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
            const _response = responseContainers.find(respCont => respCont.id === answer.id) || {};
            const minWidth = minWidthMap[answer.id];
            const width = this.getResponseWidth(response, minWidth);
            const height = _response.heightpx ? `${_response.heightpx}px` : "auto";
            return (
              <Panel header={`Text Dropdown ${answer.index + 1}`} key={answer.index}>
                <AnswerSelect
                  value={answer.value}
                  onChange={text => this.selectChange(text, answer.id)}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  width={width}
                  height={height}
                  minWidth={minWidth}
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
