/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { withNamespaces } from "react-i18next";
import { cloneDeep, keys as _keys, flattenDeep, isArray, find, last } from "lodash";

import { math } from "@edulastic/constants";
import { FroalaEditor } from "@edulastic/common";

// import { ToolbarContainer } from "../../styled/ToolbarContainer";
// import { FroalaContainer } from "../../styled/FroalaContainer";
import { Subtitle } from "../../styled/Subtitle";
import { Widget, WidgetFRContainer } from "../../styled/Widget";

const { methods } = math;

const initialMethod = {
  method: methods.EQUIV_SYMBOLIC,
  value: "",
  options: {},
  id: ""
};

const initResponseId = {
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

    const _reduceResponseIds = tmpl => {
      const newResponseId = cloneDeep(initResponseId);
      if (!window.$) {
        return newResponseId;
      }
      const temp = tmpl || "";
      const parsedHTML = $.parseHTML(temp);

      function findResponseIndexes(index) {
        const id = $(this).attr("id");
        const tagName = $(this)[0].tagName.toLowerCase();
        if (tagName === "textinput") {
          newResponseId.inputs.push({ index, id });
        } else if (tagName === "mathinput") {
          newResponseId.maths.push({ index, id });
        } else if (tagName === "textdropdown") {
          newResponseId.dropDowns.push({ index, id });
        }
      }

      $(parsedHTML)
        .find("textinput, mathinput, textdropdown")
        .each(findResponseIndexes);

      return newResponseId;
    };

    const _reduceValidation = (responseIds, validation) => {
      const _allIds = flattenDeep(_keys(responseIds).map(key => responseIds[key]));
      const _validation = cloneDeep(validation);

      // remove correct answer for deleted responseƒ
      _keys(_validation).map(key => {
        if (!isArray(_validation[key].value)) return;
        _validation[key].value.map((val, index) => {
          if (key === "valid_response") {
            if (!val[0].id) {
              _validation[key].value.splice(index, 1);
            }
            const isExist = find(_allIds, resId => resId.id === val[0].id);
            if (!isExist) {
              _validation[key].value.splice(index, 1);
            }
          } else {
            if (!val.id) {
              _validation[key].value.splice(index, 1);
            }
            const isExist = find(_allIds, resId => resId.id === val.id);
            if (!isExist) {
              _validation[key].value.splice(index, 1);
            }
          }
        });
      });

      // add new correct answers with response id
      _keys(responseIds).map(responsekey => {
        responseIds[responsekey].map(res => {
          if (responsekey === "inputs") {
            const isExist = find(_validation.valid_inputs.value, valid => valid.id === res.id);
            if (!isExist) {
              _validation.valid_inputs.value.push({
                value: "",
                id: res.id
              });
            }
          }
          if (responsekey === "maths") {
            const isExist = find(_validation.valid_response.value, valid => valid[0].id === res.id);
            if (!isExist) {
              const newArray = [{ ...initialMethod, id: res.id }];
              _validation.valid_response.value.push(newArray);
            }
          }
          if (responsekey === "dropDowns") {
            const isExist = find(_validation.valid_dropdown.value, valid => valid.id === res.id);
            if (!isExist) {
              _validation.valid_dropdown.value.push({
                value: "",
                id: res.id
              });
            }
          }
        });
      });

      // reduce alternate answers
      if (isArray(_validation.alt_responses)) {
        _validation.alt_responses.map(alt_res => {
          if (_validation.valid_response.value.length > alt_res.value.length) {
            alt_res.value.push(last(_validation.valid_response.value));
          }
          alt_res.value.map((altAnswer, index) => {
            const isExist = find(_allIds, resId => resId.id === altAnswer[0].id);
            if (!isExist) {
              alt_res.value.splice(index, 1);
            }
          });
        });
      }

      if (isArray(_validation.alt_inputs)) {
        _validation.alt_inputs.map(alt_res => {
          if (_validation.valid_inputs.value.length > alt_res.value.length) {
            alt_res.value.push(last(_validation.valid_inputs.value));
          }
          alt_res.value.map((altAnswer, index) => {
            const isExist = find(_allIds, resId => resId.id === altAnswer.id);
            if (!isExist) {
              alt_res.value.splice(index, 1);
            }
          });
        });
      }

      if (isArray(_validation.alt_dropdowns)) {
        _validation.alt_dropdowns.map(alt_res => {
          if (_validation.valid_dropdown.value.length > alt_res.value.length) {
            alt_res.value.push(last(_validation.valid_dropdown.value));
          }
          alt_res.value.map((altAnswer, index) => {
            const isExist = find(_allIds, resId => resId.id === altAnswer.id);
            if (!isExist) {
              alt_res.value.splice(index, 1);
            }
          });
        });
      }

      return _validation;
    };

    const _updateTemplate = val => {
      const newItem = produce(item, draft => {
        draft.template = val;

        draft.response_ids = _reduceResponseIds(draft.template);

        draft.validation = _reduceValidation(draft.response_ids, draft.validation);
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

        <WidgetFRContainer>
          <FroalaEditor
            data-cy="templateBox"
            onChange={_updateTemplate}
            value={item.template}
            additionalToolbarOptions={["responseBoxes"]}
            toolbarId="template-markup-area"
          />
        </WidgetFRContainer>
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
