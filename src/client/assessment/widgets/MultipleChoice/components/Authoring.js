import React, { Component } from "react";
import PropTypes from "prop-types";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import produce from "immer";
import uuid from "uuid/v4";

import { withNamespaces } from "@edulastic/localization";
import { PaddingDiv } from "@edulastic/common";
import { setQuestionDataAction } from "../../../../author/QuestionEditor/ducks";

import { ALPHABET } from "../constants/alphabet";
import { updateVariables } from "../../../utils/variables";
import ComposeQuestion from "./ComposeQuestion";
import MultipleChoiceOptions from "./MultipleChoiceOptions";

class Authoring extends Component {
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
        // reorder the options and sort the key based on index
        // editing is based on on index!
        draft.options = arrayMove(draft.options, oldIndex, newIndex).map(({ label }, index) => ({
          value: index,
          label
        }));

        let idx = item.validation.validResponse.value.findIndex(val => val === oldIndex);
        if (idx !== -1) {
          draft.validation.validResponse.value[idx] = newIndex;
        }

        idx = item.validation.validResponse.value.findIndex(val => val === newIndex);
        if (idx !== -1) {
          draft.validation.validResponse.value[idx] = oldIndex;
        }

        if (draft.validation.altResponses) {
          for (let i = 0; i < item.validation.altResponses; i++) {
            const altResponse = draft.validation.altResponses[i];
            idx = item.validation.altResponses[i].value.findIndex(val => val === oldIndex);
            if (idx !== -1) {
              altResponse.value[idx] = newIndex;
            }

            idx = item.validation.altResponses[i].value.findIndex(val => val === newIndex);
            if (idx !== -1) {
              altResponse.value[idx] = oldIndex;
            }
            return altResponse;
          }
        }

        updateVariables(draft);
      })
    );
  };

  remove = index => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options.splice(index, 1);
        for (let i = index + 1; i < draft.options.length; i++) {
          if (draft.variable) {
            draft.variable.variableStatus[`option-${index - 1}`] = draft.variable.variableStatus[`option-${index}`];
          }
        }
        updateVariables(draft);
      })
    );
  };

  addNewChoiceBtn = () => {
    const { item, setQuestionData, t } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options.push({
          value: uuid(),
          label: `${t("component.multiplechoice.choice")} ${ALPHABET[draft.options.length]}`
        });
      })
    );
  };

  editOptions = (index, value) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[index] = {
          value: index,
          label: value
        };
        updateVariables(draft);
      })
    );
  };

  render() {
    const { t, item, setQuestionData, fillSections, cleanSections, fontSize } = this.props;

    return (
      <div>
        <PaddingDiv bottom={0}>
          <ComposeQuestion
            item={item}
            fillSections={fillSections}
            setQuestionData={setQuestionData}
            cleanSections={cleanSections}
            fontSize={fontSize}
          />
          <MultipleChoiceOptions
            item={item}
            fillSections={fillSections}
            setQuestionData={setQuestionData}
            cleanSections={cleanSections}
          />
        </PaddingDiv>
      </div>
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

export default enhance(Authoring);
