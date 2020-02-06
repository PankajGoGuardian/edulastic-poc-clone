/* eslint-disable react/no-find-dom-node */
import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { connect } from "react-redux";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { withTheme } from "styled-components";

import "react-quill/dist/quill.snow.css";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../utils/variables";

import QuillSortableList from "../../components/QuillSortableList/index";
import { CustomStyleBtn } from "../../styled/ButtonStyles";
import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";

class PossibleResponses extends Component {
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

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options = arrayMove(draft.options, oldIndex, newIndex);
      })
    );
  };

  remove = index => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.validation.validResponse.value.forEach(arr => {
          if (arr.value.includes(draft.options[index])) {
            arr.value.splice(arr.value.indexOf(draft.options[index]), 1);
          }
        });

        draft.validation.altResponses.forEach(overArr => {
          overArr.value.forEach(arr => {
            if (arr.value.includes(draft.options[index])) {
              arr.value.splice(arr.value.indexOf(draft.options[index]), 1);
            }
          });
        });

        draft.options.splice(index, 1);
        updateVariables(draft);
      })
    );
  };

  editOptions = (index, value) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.validation.validResponse.value.forEach(arr => {
          // arr is null for indices 0 and 1 if we drop answer on 3rd directly
          // so adding optional chaining will prevent page crash
          if (arr?.value.includes(draft.options[index])) {
            arr.value.splice(arr.value.indexOf(draft.options[index]), 1);
          }
        });

        draft.validation.altResponses.forEach(overArr => {
          if (overArr) {
            overArr.value.forEach(arr => {
              if (arr?.value.includes(draft.options[index])) {
                arr.value.splice(arr.value.indexOf(draft.options[index]), 1, value);
              }
            });
          }
        });

        draft.options[index] = value;
        updateVariables(draft);
      })
    );
  };

  addNewChoiceBtn = () => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options.push("");
      })
    );
  };

  render() {
    const { t, item, fillSections, cleanSections } = this.props;

    return (
      <Question
        dataCy="possibleResponses"
        section="main"
        label={t("component.cloze.imageDragDrop.possibleresponses")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.cloze.imageDragDrop.possibleresponses")}`)}>
          {t("component.cloze.imageDragDrop.possibleresponses")}
        </Subtitle>
        <QuillSortableList
          items={item.options}
          onSortEnd={this.onSortEnd}
          useDragHandle
          onRemove={this.remove}
          onChange={this.editOptions}
        />
        <div>
          <CustomStyleBtn data-cy="add-new-ch" onClick={() => this.addNewChoiceBtn()}>
            {t("component.cloze.imageDragDrop.addnewchoice")}
          </CustomStyleBtn>
        </div>
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

export default enhance(PossibleResponses);
