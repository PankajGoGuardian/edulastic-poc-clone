/* eslint-disable array-callback-return */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { find, cloneDeep, isArray, last } from "lodash";
import "react-quill/dist/quill.snow.css";

import { FroalaEditor } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../utils/variables";

import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

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

  componentDidMount = () => {
    const { fillSections, t, item } = this.props;
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);
    const deskHeight = item.ui_style.layout_height;

    fillSections(
      "main",
      t("component.cloze.text.templatemarkup"),
      node.offsetTop,
      deskHeight ? node.scrollHeight + deskHeight : node.scrollHeight,
      deskHeight === true,
      deskHeight
    );
  };

  componentWillUnmount = () => {
    const { cleanSections } = this.props;

    cleanSections();
  };

  onChangeMarkUp = templateMarkUp => {
    const { item, setQuestionData } = this.props;

    const reduceResponseIds = tmpl => {
      const newResponseIds = [];
      if (!window.$) {
        return newResponseIds;
      }
      const temp = tmpl || "";
      // eslint-disable-next-line no-undef
      const parsedHTML = $("<div />").html(temp);
      // eslint-disable-next-line no-undef
      $(parsedHTML)
        .find("textinput")
        // eslint-disable-next-line func-names
        .each(function(index) {
          // eslint-disable-next-line no-undef
          const id = $(this).attr("id");
          newResponseIds.push({ index, id });
        });

      return newResponseIds;
    };

    const reudceValidations = (responseIds, validation) => {
      const _validation = cloneDeep(validation);
      const _responseIds = cloneDeep(responseIds);
      const validResponses = _validation.valid_response.value;

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
          validResponses.push({ id, value: "", index: response.index });
        } else {
          valid.index = response.index;
        }
      });
      validResponses.sort((a, b) => a.index - b.index);
      _validation.valid_response.value = validResponses;

      // reduce alternate answers
      if (isArray(_validation.alt_responses)) {
        _validation.alt_responses.map(altAnswers => {
          if (_validation.valid_response.value.length > altAnswers.value.length) {
            altAnswers.value.push(last(_validation.valid_response.value));
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

    setQuestionData(
      produce(item, draft => {
        draft.templateMarkUp = templateMarkUp;
        draft.response_ids = reduceResponseIds(templateMarkUp);
        draft.validation = reudceValidations(draft.response_ids, draft.validation);
        updateVariables(draft);
      })
    );
  };

  render() {
    const { t, item } = this.props;

    return (
      <Widget>
        <Subtitle>{t("component.cloze.text.templatemarkup")}</Subtitle>

        <FroalaEditor
          data-cy="templateBox"
          onChange={this.onChangeMarkUp}
          value={item.templateMarkUp}
          toolbarId="cloze-text-template"
          additionalToolbarOptions={["textinput"]}
          theme="border"
        />
      </Widget>
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

export default enhance(TemplateMarkup);
