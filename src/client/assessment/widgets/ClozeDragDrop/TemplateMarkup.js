/* eslint-disable no-undef */
/* eslint-disable func-names */
import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { cloneDeep, find, isUndefined, isArray } from "lodash";

import { withTheme } from "styled-components";
import { withNamespaces } from "@edulastic/localization";
import QuestionTextArea from "../../components/QuestionTextArea";
import { updateVariables } from "../../utils/variables";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { Subtitle } from "../../styled/Subtitle";

class TemplateMarkup extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired
  };

  onChangeMarkUp = stimulus => {
    const { item, setQuestionData } = this.props;

    const reduceResponse = (tmpl, preIDs, preValidation) => {
      const newResponseIds = [];
      const newValue = [];
      let newAltValue = [];

      const temp = tmpl || "";
      const _preIDs = cloneDeep(preIDs);
      const _preValidation = cloneDeep(preValidation);
      const {
        validResponse: { value },
        altResponses
      } = cloneDeep(_preValidation);

      newAltValue = cloneDeep(altResponses);

      if (!window.$) {
        return { responseIds: newResponseIds, validation: _preValidation };
      }

      const parsedHTML = $("<div />").html(temp);
      $(parsedHTML)
        .find("response")
        .each(function(index) {
          const id = $(this).attr("id");
          const { index: preIndex } = find(_preIDs, response => response.id === id) || {};

          if (!isUndefined(preIndex)) {
            newValue[index] = value[preIndex];
          } else {
            newValue[index] = null;
          }

          if (isArray(altResponses)) {
            altResponses.map((altResponse, altIndex) => {
              if (!isUndefined(preIndex)) {
                newAltValue[altIndex].value[index] = altResponse.value[preIndex];
              } else {
                newAltValue[altIndex].value[index] = null;
              }
              return null;
            });
          }

          newResponseIds.push({ index, id });
        });

      _preValidation.validResponse.value = newValue;
      if (isArray(newAltValue)) {
        _preValidation.altResponses = newAltValue;
      }
      return { responseIds: newResponseIds, validation: _preValidation };
    };

    setQuestionData(
      produce(item, draft => {
        draft.stimulus = stimulus;
        const { responseIds, validation } = reduceResponse(stimulus, draft.responseIds, draft.validation);
        draft.responseIds = responseIds;
        draft.validation = validation;
        updateVariables(draft);
      })
    );
  };

  render() {
    const { t, item } = this.props;
    return (
      <>
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.cloze.dragDrop.composequestion")}`)}>
          {t("component.cloze.dragDrop.composequestion")}
        </Subtitle>

        <QuestionTextArea
          placeholder={t("component.cloze.dragDrop.thisisstem")}
          onChange={this.onChangeMarkUp}
          additionalToolbarOptions={["response"]}
          toolbarId="template-markup-area"
          value={item.stimulus}
          border="border"
        />
      </>
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

export default enhance(TemplateMarkup);
