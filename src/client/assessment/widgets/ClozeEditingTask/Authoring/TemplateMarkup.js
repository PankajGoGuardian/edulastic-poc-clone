/* eslint-disable func-names */
/* eslint-disable array-callback-return */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { find, cloneDeep, isArray } from "lodash";
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

    const reduceValidations = (responseIds, validation) => {
      const _validation = cloneDeep(validation);
      const _responseIds = cloneDeep(responseIds);
      // update valid responses
      const validResponses = {};
      _responseIds.forEach(r => {
        validResponses[r.id] = _validation.validResponse.value[r.id] || "";
      });
      _validation.validResponse.value = validResponses;

      // update alternative responses
      if (isArray(_validation.altResponses)) {
        _validation.altResponses.map(altAnswer => {
          const newAnswers = {};
          _responseIds.forEach(r => {
            newAnswers[r.id] = altAnswer[r.id] || "";
          });
          altAnswer.value = newAnswers;
        });
      }

      return _validation;
    };
    // Fix me: We might not require this for display type input
    const reduceOptions = (responseIds, options = {}) => {
      const _options = cloneDeep(options);

      const optionsKeys = Object.keys(_options);
      if (optionsKeys.length) {
        optionsKeys.map(id => {
          const isExist = find(responseIds, response => response.id === id);
          if (!isExist) {
            delete _options[id];
          }
        });
      }
      return _options;
    };

    setQuestionData(
      produce(item, draft => {
        draft.stimulus = stimulus;
        draft.responseIds = reduceResponseIds(stimulus);
        draft.validation = reduceValidations(draft.responseIds, draft.validation);
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
