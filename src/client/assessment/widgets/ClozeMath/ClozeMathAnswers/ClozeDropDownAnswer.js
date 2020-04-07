import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import produce from "immer";
import { arrayMove } from "react-sortable-hoc";
import { Collapse, Icon } from "antd";
import { forEach, cloneDeep, get, findIndex } from "lodash";
import { ScrollContext } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { greyThemeLight, greyThemeLighter, greyThemeDark2 } from "@edulastic/colors";
import { response as responseDimensions } from "@edulastic/constants";
import SortableList from "../../../components/SortableList";
import { SelectInputStyled } from "../../../styled/InputStyles";
import { CustomStyleBtn } from "../../../styled/ButtonStyles";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { InnerTitle } from "../../../styled/InnerTitle";
import { updateVariables } from "../../../utils/variables";

const { Panel } = Collapse;
const { Option } = SelectInputStyled;

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
    height: ${responseDimensions.minHeight}px;
  }

  .ant-select-selection__rendered {
    min-height: ${responseDimensions.minHeight}px;
    max-width: 100%;
  }
`;

class ClozeDropDownAnswer extends Component {
  static contextType = ScrollContext;

  selectChange = (value, dropDownId) => {
    const { onChange: changeAnswers } = this.props;
    changeAnswers({ value, dropDownId });
  };

  onSortEnd = dropDownId => ({ oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[dropDownId] = arrayMove(draft.options[dropDownId], oldIndex, newIndex);
      })
    );
  };

  addNewChoiceBtn = dropDownId => () => {
    const { item, setQuestionData, t } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.options[dropDownId] === undefined) draft.options[dropDownId] = [];
        draft.options[dropDownId].push(
          `${t("component.cloze.dropDown.newChoice")} ${draft.options[dropDownId].length + 1}`
        );
      })
    );
  };

  remove = dropDownId => itemIndex => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[dropDownId].splice(itemIndex, 1);
        const validDropDown = cloneDeep(draft.validation.validResponse.dropdown.value);
        forEach(validDropDown, answer => {
          if (answer.id === dropDownId) {
            answer.value = "";
          }
        });
        draft.validation.validResponse.dropdown.value = validDropDown;
        updateVariables(draft);
      })
    );
  };

  editOptions = dropDownId => (itemIndex, e) => {
    const { item, setQuestionData } = this.props;
    const prevDropDownAnswers = get(item, "validation.validResponse.dropdown.value", []);
    const prevAnswerIndex = findIndex(prevDropDownAnswers, answer => answer.id === dropDownId);

    setQuestionData(
      produce(item, draft => {
        if (draft.options[dropDownId] === undefined) draft.options[dropDownId] = [];
        const prevOption = draft.options[dropDownId][itemIndex];
        /**
         * https://snapwiz.atlassian.net/browse/EV-12606
         *
         * we need to take the option, having most number of characters,
         * and then we need to compare if the current value entered has more characters than the previous choices
         * and take the maximum of the two.
         * and then calculate the width based on the maximum, and set the width to the dropdown
         */
        draft.options[dropDownId][itemIndex] = e.target.value;
        const maxLength = draft.options[dropDownId].reduce(
          (currentMaxLength, option) => Math.max(currentMaxLength, option.length),
          0
        );
        const splitWidth = Math.max(Math.max(maxLength, e.target.value.length) * 14, 140);
        const width = Math.min(splitWidth, 400);
        const drpdwnIndex = findIndex(draft.responseIds.dropDowns, drpdwn => drpdwn.id === dropDownId);
        const ind = findIndex(draft.responseContainers, cont => cont.id === dropDownId);
        if (ind === -1) {
          draft.responseContainers.push({
            index: draft.responseIds.dropDowns[drpdwnIndex].index,
            id: dropDownId,
            widthpx: width,
            type: "dropDowns"
          });
        } else {
          draft.responseContainers[ind].widthpx = width;
        }
        if (prevAnswerIndex !== -1) {
          const prevAnswer = prevDropDownAnswers[prevAnswerIndex].value;
          if (prevAnswer && prevAnswer === prevOption) {
            prevDropDownAnswers.splice(prevAnswerIndex, 1, { id: dropDownId, value: e.target.value });
          }
        }

        updateVariables(draft);
      })
    );
  };

  render() {
    const { getScrollElement } = this.context;
    const { answers, item, t } = this.props;
    const { options, responseContainers = [], stimulus } = item;
    const scrollContainer = getScrollElement();

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
                <Row gutter={8}>
                  <Col span={12} align="left">
                    <InnerTitle innerText={`${t("component.math.correctAnswerForDropdown")}`} />
                    <AnswerSelect
                      value={answer.value}
                      onChange={text => this.selectChange(text, answer.id)}
                      getPopupContainer={() => scrollContainer}
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
                  </Col>
                  <Col span={12} align="left">
                    <InnerTitle innerText={`${t("component.math.choicesfordropdown")}`} />
                    <SortableList
                      items={options[answer.id] || []}
                      dirty={stimulus}
                      onSortEnd={this.onSortEnd(answer.id)}
                      useDragHandle
                      onRemove={this.remove(answer.id)}
                      onChange={this.editOptions(answer.id)}
                    />
                    <CustomStyleBtn onClick={this.addNewChoiceBtn(answer.id)}>
                      {t("component.cloze.dropDown.addnewchoice")}
                    </CustomStyleBtn>
                  </Col>
                </Row>
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
