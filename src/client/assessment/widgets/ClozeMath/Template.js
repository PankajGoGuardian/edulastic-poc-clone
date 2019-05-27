import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { withNamespaces } from "react-i18next";
import { cloneDeep } from "lodash";

import { math } from "@edulastic/constants";
import { CustomQuillComponent } from "@edulastic/common";

import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

const { methods } = math;

const initialMethod = {
  method: methods.EQUIV_SYMBOLIC,
  value: "",
  options: {}
};

class Template extends Component {
  componentDidMount = () => {
    const { fillSections, t, item } = this.props;
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);

    if (item.templateDisplay) fillSections("main", t("component.math.template"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { t, item, setQuestionData } = this.props;

    const _reduceResponseButtons = (responseIndexes = [], value) =>
      responseIndexes.map(nextIndex => {
        const newArray = [initialMethod];
        const response = value.find((_, i) => nextIndex === i + 1);
        return response || cloneDeep(newArray);
      });

    const _reduceDropDowns = (dropDownIndexes = [], value) =>
      dropDownIndexes.map(nextIndex => {
        const newValue = "";
        const response = value.find((_, i) => nextIndex === i + 1);
        return response || cloneDeep(newValue);
      });

    const _reduceInputs = (dropDownIndexes = [], value) =>
      dropDownIndexes.map(nextIndex => {
        const newValue = "";
        const response = value.find((_, i) => nextIndex === i + 1);
        return response || cloneDeep(newValue);
      });

    const _updateTemplate = (val, responseIndexes, dropDownIndexes, inputIndexes) => {
      const newItem = produce(item, draft => {
        draft.template = val;

        draft.validation.valid_response.value = _reduceResponseButtons(
          responseIndexes,
          draft.validation.valid_response.value
        );

        draft.validation.valid_dropdown.value = _reduceDropDowns(
          dropDownIndexes,
          draft.validation.valid_dropdown.value
        );

        draft.validation.valid_inputs.value = _reduceInputs(inputIndexes, draft.validation.valid_inputs.value);

        if (Array.isArray(draft.validation.alt_responses)) {
          draft.validation.alt_responses = draft.validation.alt_responses.map(res => {
            res.value = _reduceResponseButtons(responseIndexes, res.value);
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
        <CustomQuillComponent
          inputId="templateInput"
          toolbarId="template"
          onChange={_updateTemplate}
          showResponseBtn
          showDropdownBtn
          showTextInputBtn
          value={item.template}
          data-cy="templateBox"
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
