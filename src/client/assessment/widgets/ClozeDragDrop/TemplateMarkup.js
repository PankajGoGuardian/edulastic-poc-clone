/* eslint-disable no-undef */
/* eslint-disable func-names */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { cloneDeep, find, isUndefined, isArray } from "lodash";

import { withTheme } from "styled-components";
import { helpers } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import QuestionTextArea from "../../components/QuestionTextArea";
import { updateVariables } from "../../utils/variables";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { Subtitle } from "../../styled/Subtitle";
import { WidgetFRContainer } from "../../styled/Widget";

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
      t("component.cloze.dragDrop.templatemarkup"),
      node.offsetTop,
      deskHeight ? node.scrollHeight + deskHeight : node.scrollHeight,
      deskHeight === true,
      deskHeight
    );

    this.onChangeMarkUp(helpers.reIndexResponses(item.templateMarkUp));
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  onChangeMarkUp = templateMarkUp => {
    const { item, setQuestionData } = this.props;

    const reduceResponse = (tmpl, preIDs, preValidation) => {
      const newResponseIds = [];
      const newValue = [];
      let newAltValue = [];

      const temp = tmpl || "";
      const _preIDs = cloneDeep(preIDs);
      const _preValidation = cloneDeep(preValidation);
      const {
        valid_response: { value },
        alt_responses: altResponses
      } = cloneDeep(_preValidation);

      newAltValue = cloneDeep(altResponses);

      if (!window.$) {
        return { response_ids: newResponseIds, validation: _preValidation };
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

      _preValidation.valid_response.value = newValue;
      if (isArray(newAltValue)) {
        _preValidation.alt_responses = newAltValue;
      }
      return { response_ids: newResponseIds, validation: _preValidation };
    };

    setQuestionData(
      produce(item, draft => {
        draft.templateMarkUp = templateMarkUp;
        const { response_ids, validation } = reduceResponse(templateMarkUp, draft.response_ids, draft.validation);
        draft.response_ids = response_ids;
        draft.validation = validation;
        updateVariables(draft);
      })
    );
  };

  render() {
    const { t, item } = this.props;
    return (
      <>
        <Subtitle>{t("component.cloze.dragDrop.templatemarkup")}</Subtitle>

        <WidgetFRContainer>
          <QuestionTextArea
            placeholder={t("component.cloze.dragDrop.templatemarkupplaceholder")}
            onChange={this.onChangeMarkUp}
            additionalToolbarOptions={["response"]}
            toolbarId="template-markup-area"
            value={item.templateMarkUp}
          />
        </WidgetFRContainer>
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
