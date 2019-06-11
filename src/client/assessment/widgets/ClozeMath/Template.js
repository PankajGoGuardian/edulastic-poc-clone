/* eslint-disable no-undef */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { withNamespaces } from "react-i18next";
import { cloneDeep } from "lodash";

import { math } from "@edulastic/constants";
import { FroalaEditor } from "@edulastic/common";

// import { ToolbarContainer } from "../../styled/ToolbarContainer";
// import { FroalaContainer } from "../../styled/FroalaContainer";
import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

const { methods } = math;

const initialMethod = {
  method: methods.EQUIV_SYMBOLIC,
  value: "",
  options: {}
};

const initResponseIndexes = {
  inputs: [],
  maths: [],
  dropDowns: []
};

class Template extends Component {
  componentDidMount = () => {
    const { fillSections, t, item } = this.props;
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);

    if (item.templateDisplay) fillSections("main", t("component.math.template"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { t, item, setQuestionData } = this.props;

    const _reduceResponseButtons = (mathInputIndexes = [], value) =>
      mathInputIndexes.map(nextIndex => {
        const newArray = [initialMethod];
        const response = value.find((_, i) => nextIndex === i);
        return response || cloneDeep(newArray);
      });

    const _reduceVlaues = (emIndexes = [], value) =>
      emIndexes.map(emIndex => value.find((_, i) => emIndex === i) || "");

    const _reduceResponseIndexes = tmpl => {
      const newResponseIndexes = cloneDeep(initResponseIndexes);

      if (!window.$) {
        return newResponseIndexes;
      }
      const temp = tmpl || "";
      const parsedHTML = $.parseHTML(temp);

      function findResponseIndexes() {
        let index = $(this).attr("index");
        index = parseInt(index, 10);
        const tagName = $(this)[0].tagName.toLowerCase();
        if (tagName === "textinput") {
          newResponseIndexes.inputs.push({ index });
        } else if (tagName === "mathinput") {
          newResponseIndexes.maths.push({ index });
        } else if (tagName === "textdropdown") {
          newResponseIndexes.dropDowns.push({ index });
        }
      }

      $(parsedHTML)
        .find("textinput, mathinput, textdropdown")
        .each(findResponseIndexes);

      return newResponseIndexes;
    };

    const _updateTemplate = (val, mathInputIndexes, dropDownIndexes, inputIndexes) => {
      const newItem = produce(item, draft => {
        draft.template = val;

        draft.validation.valid_response.value = _reduceResponseButtons(
          mathInputIndexes,
          draft.validation.valid_response.value
        );

        draft.validation.valid_dropdown.value = _reduceVlaues(dropDownIndexes, draft.validation.valid_dropdown.value);

        draft.validation.valid_inputs.value = _reduceVlaues(inputIndexes, draft.validation.valid_inputs.value);

        draft.response_indexes = _reduceResponseIndexes(draft.template);

        if (Array.isArray(draft.validation.alt_responses)) {
          draft.validation.alt_responses = draft.validation.alt_responses.map(res => {
            res.value = _reduceResponseButtons(mathInputIndexes, res.value);
            return res;
          });
        }
      });

      newItem.validation.valid_response.value.map(res => {
        if (res && !res.length) {
          res.push(initialMethod);
        }
        return res;
      });

      setQuestionData(newItem);
    };

    return (
      <Widget>
        <Subtitle data-cy="template">{t("component.math.template")}</Subtitle>
        <FroalaEditor
          data-cy="templateBox"
          onChange={_updateTemplate}
          value={item.template}
          additionalToolbarOptions={["responseBoxes"]}
          toolbarId="template-markup-area"
        />
      </Widget>
    );
  }
}

Template.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Template.defaultProps = {
  item: {},
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(Template);
