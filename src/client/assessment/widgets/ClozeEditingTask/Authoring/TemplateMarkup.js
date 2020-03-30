/* eslint-disable func-names */
/* eslint-disable array-callback-return */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { find, cloneDeep, last, isArray } from "lodash";
import produce from "immer";
import { withNamespaces } from "@edulastic/localization";
import { FroalaEditor, getFormattedAttrId } from "@edulastic/common";
import { Subtitle } from "../../../styled/Subtitle";
import Question from "../../../components/Question";
import { updateVariables } from "../../../utils/variables";

class TemplateMarkup extends Component {
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

  onChangeMarkUp = stimulus => {
    const { item, setQuestionData } = this.props;

    const reduceResponseIds = tmpl => {
      const newResponseIds = [];
      if (!window.$) {
        return newResponseIds;
      }
      const temp = tmpl || "";
      const parsedHTML = $("<div />").html(temp);

      $(parsedHTML)
        .find("response")
        .each(function(index) {
          const id = $(this).attr("id");
          newResponseIds.push({ index, id });
        });

      return newResponseIds;
    };

    const reudceValidations = (responseIds, validation) => {
      const _validation = cloneDeep(validation);
      const _responseIds = cloneDeep(responseIds);
      const validResponses = _validation.validResponse.value;

      // remove deleted dropdown answer
      validResponses.map((answer, i) => {
        const { id } = answer;
        if (!id) {
          validResponses.splice(i, 1);
        }
        const isExist = find(_responseIds, response => response.id === id);
        if (!isExist) {
          validResponses.splice(i, 1);
        }
      });

      // add new correct answers with response id
      _responseIds.map(response => {
        const { id } = response;
        const valid = find(validResponses, answer => answer.id === id);
        if (!valid) {
          validResponses.push({ id, value: "" });
        } else {
          valid.index = response.index;
        }
      });
      validResponses.sort((a, b) => a.index - b.index);
      _validation.validResponse.value = validResponses;

      // reduce alternate answers
      if (isArray(_validation.altResponses)) {
        _validation.altResponses.map(altAnswers => {
          if (_validation.validResponse.value.length > altAnswers.value.length) {
            altAnswers.value.push(last(_validation.validResponse.value));
          }
          altAnswers.value.map((altAnswer, index) => {
            const isExist = find(_responseIds, response => response.id === altAnswer.id);
            if (!isExist) {
              altAnswers.value.splice(index, 1);
            }
          });
          altAnswers.value.sort((a, b) => a.index - b.index);
        });
      }

      return _validation;
    };

    const reduceOptions = (responseIds, options) => {
      const _options = cloneDeep(options);
      Object.keys(_options).map(id => {
        const isExist = find(responseIds, response => response.id === id);
        if (!isExist) {
          delete _options[id];
        }
      });
      return _options;
    };

    setQuestionData(
      produce(item, draft => {
        draft.stimulus = stimulus;
        draft.responseIds = reduceResponseIds(stimulus);
        draft.validation = reudceValidations(draft.responseIds, draft.validation);
        draft.options = reduceOptions(draft.responseIds, draft.options);
        updateVariables(draft);
      })
    );
  };

  render() {
    const { t, item, fillSections, cleanSections } = this.props;

    return (
      <Question
        section="main"
        label={t("component.cloze.dropDown.composequestion")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(t("component.cloze.dropDown.composequestion"))}>
          {t("component.cloze.dropDown.composequestion")}
        </Subtitle>

        <FroalaEditor
          data-cy="templateBox"
          toolbarId="cloze-dropdown-template-box"
          placeholder={t("component.cloze.dropDown.thisisstem")}
          additionalToolbarOptions={["response"]}
          value={item.stimulus}
          onChange={this.onChangeMarkUp}
          border="border"
        />
      </Question>
    );
  }
}

export default withNamespaces("assessment")(TemplateMarkup);
