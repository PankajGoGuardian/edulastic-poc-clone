/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { withNamespaces } from "react-i18next";
import { cloneDeep, keys as _keys, flattenDeep, isArray, find, last, isEmpty } from "lodash";

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
      const parsedHTML = $("<div />").html(temp);

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

      Object.keys(newResponseId).map(key => {
        if (key !== "scoring_type") {
          if (isEmpty(newResponseId[key])) {
            delete newResponseId[key];
          }
        }
      });
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
            if (!_validation.valid_inputs) {
              _validation.valid_inputs = { score: 1, value: [] };
            }
            const isExist = find(_validation.valid_inputs.value, valid => valid.id === res.id);
            if (!isExist) {
              _validation.valid_inputs.value.push({
                value: "",
                id: res.id
              });
            }
          }
          if (responsekey === "maths") {
            if (!_validation.valid_response) {
              _validation.valid_response = { score: 1, value: [] };
            }
            const isExist = find(_validation.valid_response.value, valid => (valid[0] ? valid[0].id : "") === res.id);
            if (!isExist) {
              const newArray = [{ ...initialMethod, id: res.id }];
              _validation.valid_response.value.push(newArray);
            }
          }
          if (responsekey === "dropDowns") {
            if (!_validation.valid_dropdown) {
              _validation.valid_dropdown = { score: 1, value: [] };
            }
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
      const maxAltLen = Math.max(
        _validation.alt_responses ? _validation.alt_responses.length : 0,
        _validation.alt_inputs ? _validation.alt_inputs.length : 0,
        _validation.alt_dropdowns ? _validation.alt_dropdowns.length : 0
      );
      if (isArray(_validation.alt_responses)) {
        if (_validation.valid_response) {
          _validation.alt_responses.map(alt_res => {
            if (_validation.valid_response.value.length > alt_res.value.length) {
              alt_res.value.push(last(_validation.valid_response.value));
            }
            alt_res.value.map((altAnswer, index) => {
              const isExist = find(_allIds, resId => resId.id === (altAnswer ? altAnswer[0] : "").id);
              if (!isExist) {
                alt_res.value.splice(index, 1);
              }
            });
          });
        }
      } else if (_validation.valid_response) {
        const newAltValues = cloneDeep(_validation.valid_response.value || []);
        newAltValues.map(answer => {
          answer.value = "";
          return answer;
        });
        _validation.alt_responses = [];
        for (let i = 0; i < maxAltLen; i++) {
          _validation.alt_responses.push({
            score: 1,
            value: newAltValues
          });
        }
      }

      if (isArray(_validation.alt_inputs)) {
        if (_validation.valid_inputs) {
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
      } else if (_validation.valid_inputs && maxAltLen) {
        const newAltValues = cloneDeep(_validation.valid_inputs.value || []);
        newAltValues.map(answer => {
          answer.value = "";
          return answer;
        });
        _validation.alt_inputs = [];
        for (let i = 0; i < maxAltLen; i++) {
          _validation.alt_inputs.push({
            score: 1,
            value: newAltValues
          });
        }
      }

      if (isArray(_validation.alt_dropdowns)) {
        if (_validation.valid_dropdown) {
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
      } else if (_validation.valid_dropdown) {
        const newAltValues = cloneDeep(_validation.valid_dropdown.value || []);
        newAltValues.map(answer => {
          answer.value = "";
          return answer;
        });
        _validation.alt_dropdowns = [];
        for (let i = 0; i < maxAltLen; i++) {
          _validation.alt_dropdowns.push({
            score: 1,
            value: newAltValues
          });
        }
      }

      // remove empty valid value
      Object.keys(_validation).map(key => {
        if (key === "valid_dropdown") {
          if (isEmpty(_validation[key].value)) {
            delete _validation[key];
            delete _validation.alt_dropdowns;
          }
        }
        if (key === "valid_inputs") {
          if (isEmpty(_validation[key].value)) {
            delete _validation[key];
            delete _validation.alt_inputs;
          }
        }
        if (key === "valid_response") {
          if (isEmpty(_validation[key].value)) {
            delete _validation[key];
            delete _validation.alt_responses;
          }
        }
      });

      return _validation;
    };

    const _reduceOptions = (responseIds = {}, options) => {
      const { dropDowns } = responseIds;
      let _options = cloneDeep(options);
      if (!dropDowns) {
        return;
      }

      if (!_options) {
        _options = {};
      }

      return _options;
    };

    const _updateTemplate = val => {
      const newItem = produce(item, draft => {
        draft.template = val;

        draft.response_ids = _reduceResponseIds(draft.template);

        draft.validation = _reduceValidation(draft.response_ids, draft.validation);

        draft.options = _reduceOptions(draft.response_ids, draft.options);
      });

      if (!newItem.options) {
        delete newItem.options;
      }

      if (newItem.validation.valid_response) {
        newItem.validation.valid_response.value.map(res => {
          if (res && !res.length) {
            res.push(initialMethod);
          }
          return res;
        });
      }

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
          theme="border"
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
