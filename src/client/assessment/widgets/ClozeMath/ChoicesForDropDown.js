import React, { Component } from "react";
import PropTypes from "prop-types";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { forEach, cloneDeep, get, findIndex } from "lodash";
import "react-quill/dist/quill.snow.css";
import produce from "immer";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import { updateVariables } from "../../utils/variables";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import SortableList from "../../components/SortableList/index";
import { Subtitle } from "../../styled/Subtitle";
import { WidgetWrapper } from "../../styled/Widget";
import Question from "../../components/Question";
import { CustomStyleBtn } from "../../styled/ButtonStyles";

class ChoicesForDropDown extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
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

  onSortEnd = (dropDownId, { oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[dropDownId] = arrayMove(draft.options[dropDownId], oldIndex, newIndex);
      })
    );
  };

  remove = (dropDownId, itemIndex) => {
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

  editOptions = (dropDownId, itemIndex, e) => {
    const { item, setQuestionData } = this.props;
    const prevDropDownAnswers = get(item, "validation.validResponse.dropdown.value", []);
    const prevAnswerIndex = findIndex(prevDropDownAnswers, answer => answer.id === dropDownId);

    setQuestionData(
      produce(item, draft => {
        if (draft.options[dropDownId] === undefined) draft.options[dropDownId] = [];
        const prevOption = draft.options[dropDownId][itemIndex];
        draft.options[dropDownId][itemIndex] = e.target.value;
        const splitWidth = Math.max(e.target.value.split("").length * 9, 100);
        const width = Math.min(splitWidth, 400);
        const drpdwnIndex = findIndex(draft.responseIds.dropDowns, drpdwn => drpdwn.id === dropDownId);
        const ind = findIndex(draft.responseContainers, cont => cont.id === dropDownId);
        if (!draft.responseContainers) draft.responseContainers = [];
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

  addNewChoiceBtn = dropDownId => {
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

  render() {
    const { t, item, fillSections, cleanSections } = this.props;
    const { responseIds = {}, options, stimulus } = item;
    const { dropDowns = [] } = responseIds;

    return (
      dropDowns.length > 0 && (
        <WidgetWrapper>
          {dropDowns.map(dropdown => (
            <Question
              section="main"
              dataCy={`choice-dropdown-${dropdown.index}`}
              label={`${t("component.math.choicesfordropdown")} ${dropdown.index + 1}`}
              fillSections={fillSections}
              sectionId={dropdown.id}
              cleanSections={cleanSections}
            >
              <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.math.choicesfordropdown")}`)}>
                {`${t("component.math.choicesfordropdown")} ${dropdown.index + 1}`}
              </Subtitle>
              <SortableList
                items={options[dropdown.id] || []}
                dirty={stimulus}
                onSortEnd={params => this.onSortEnd(dropdown.id, params)}
                useDragHandle
                onRemove={itemIndex => this.remove(dropdown.id, itemIndex)}
                onChange={(itemIndex, e) => this.editOptions(dropdown.id, itemIndex, e)}
              />

              <div>
                <CustomStyleBtn onClick={() => this.addNewChoiceBtn(dropdown.id)}>
                  {t("component.cloze.dropDown.addnewchoice")}
                </CustomStyleBtn>
              </div>
            </Question>
          ))}
        </WidgetWrapper>
      )
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(ChoicesForDropDown);
