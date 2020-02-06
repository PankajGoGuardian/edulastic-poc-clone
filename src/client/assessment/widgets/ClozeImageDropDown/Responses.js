import React, { Component } from "react";
import PropTypes from "prop-types";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import produce from "immer";
import "react-quill/dist/quill.snow.css";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { PaddingDiv } from "@edulastic/common";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { updateVariables } from "../../utils/variables";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import { Subtitle } from "../../styled/Subtitle";
import { CustomStyleBtn } from "../../styled/ButtonStyles";
import SortableList from "../../components/SortableList/index";
import { defaultOptions } from "../../constants/constantsForQuestions";
import Question from "../../components/Question";

class Response extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    setQuestionData: PropTypes.func.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func
  };

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {}
  };

  onChangeQuestion = stimulus => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.stimulus = stimulus;
        updateVariables(draft);
      })
    );
  };

  onSortEnd = (index, { oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[index] = arrayMove(draft.options[index], oldIndex, newIndex);
      })
    );
  };

  remove = (index, itemIndex) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        const oldOptionValue = draft.options[index][itemIndex];
        draft.options[index].splice(itemIndex, 1);
        if (oldOptionValue === draft.validation.validResponse.value[index]) {
          draft.validation.validResponse.value.splice(index, 1, "");
        }
        draft.validation.altResponses = draft.validation.altResponses.map(resp => {
          if (oldOptionValue === resp[index]) {
            resp.value.splice(index, 1, "");
          }
          return resp;
        });
        updateVariables(draft);
      })
    );
  };

  editOptions = (index, itemIndex, e) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.options[index] === undefined) draft.options[index] = [];
        const oldOptionValue = draft.options[index][itemIndex];
        draft.options[index][itemIndex] = e.target.value;
        let maxLength = 0;
        draft.options.forEach(option => {
          option.forEach(opt => {
            maxLength = Math.max(maxLength, opt ? opt.length : 0);
          });
        });
        const finalWidth = 40 + maxLength * 7;
        if (!draft.uiStyle) {
          draft.uiStyle = { widthpx: 140 };
        }
        draft.uiStyle.widthpx = finalWidth < 140 ? 140 : finalWidth > 400 ? 400 : finalWidth;
        if (draft.validation.validResponse.value[index] === oldOptionValue) {
          draft.validation.validResponse.value.splice(index, 1, e.target.value);
        }
        draft.validation.altResponses = draft.validation.altResponses.map(resp => {
          if (resp.value[index] === oldOptionValue) {
            resp.value.splice(index, 1, e.target.value);
          }
          return resp;
        });
        updateVariables(draft);
      })
    );
  };

  addNewChoiceBtn = index => {
    const { item, setQuestionData, t } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.options[index] === undefined) {
          draft.options[index] = [];
        }
        draft.options[index].push(`${t("component.cloze.imageDropDown.newChoice")} ${draft.options[index].length + 1}`);
      })
    );
  };

  render() {
    const { t, fillSections, cleanSections, options, item } = this.props;

    return (
      <Question
        dataCy="choice-response-container"
        section="main"
        label="Responses"
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        {options.map((option, index) => (
          <>
            <Subtitle
              id={getFormattedAttrId(`${item?.title}-${t("component.cloze.imageDropDown.response")} ${index + 1}`)}
              style={{ paddingTop: index > 0 ? "30px" : "0px" }}
            >
              {t("component.cloze.imageDropDown.response")} {index + 1}
            </Subtitle>
            <SortableList
              items={option || []}
              onSortEnd={params => this.onSortEnd(index, params)}
              defaultOptions={defaultOptions}
              useDragHandle
              onRemove={itemIndex => this.remove(index, itemIndex)}
              onChange={(itemIndex, e) => this.editOptions(index, itemIndex, e)}
            />
            <PaddingDiv top={6}>
              <CustomStyleBtn data-cy={`add-new-ch-res-${index}`} onClick={() => this.addNewChoiceBtn(index)}>
                {t("component.cloze.imageDropDown.addnewchoice")}
              </CustomStyleBtn>
            </PaddingDiv>
          </>
        ))}
      </Question>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  withTheme,
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(Response);
