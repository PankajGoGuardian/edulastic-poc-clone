/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { withNamespaces } from "react-i18next";
import { cloneDeep, keys as _keys, flattenDeep, isArray, find, last, isEmpty } from "lodash";

import { math } from "@edulastic/constants";
import { FroalaEditor } from "@edulastic/common";

// import { ToolbarContainer } from "../../styled/ToolbarContainer";
// import { FroalaContainer } from "../../styled/FroalaContainer";
import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";

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
  render() {
    const { t, item, setQuestionData, fillSections, cleanSections } = this.props;

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

      // remove correct answer (math input) by deleted response box id
      if (_validation.valid_response.value) {
        _validation.valid_response.value.map((val, index) => {
          if (!val[0].id) {
            _validation.valid_response.value.splice(index, 1);
          }
          const isExist = find(_allIds, res => res.id === val[0].id);
          if (!isExist) {
            _validation.valid_response.value.splice(index, 1);
          }
        });
      }

      // remvoe correct answer (text input) by deleted response box id.
      if (_validation.valid_response.textinput) {
        _validation.valid_response.textinput.value.map((val, index) => {
          if (!val.id) {
            _validation.valid_response.textinput.value.splice(index, 1);
          }
          const isExist = find(_allIds, res => res.id === val.id);
          if (!isExist) {
            _validation.valid_response.textinput.value.splice(index, 1);
          }
        });
      }

      // remove correct answer (dropdown) by deleted response box id.
      if (_validation.valid_response.dropdown) {
        _validation.valid_response.dropdown.value.map((val, index) => {
          if (!val.id) {
            _validation.valid_response.dropdown.value.splice(index, 1);
          }
          const isExist = find(_allIds, res => res.id === val.id);
          if (!isExist) {
            _validation.valid_response.dropdown.value.splice(index, 1);
          }
        });
      }

      // add new correct answers with response id
      if (!_validation.valid_response) {
        _validation.valid_response = { score: 1, value: [], dropdown: { value: [] }, textinput: { value: [] } };
      }
      _keys(responseIds).map(responsekey => {
        responseIds[responsekey].map(res => {
          if (responsekey === "inputs") {
            if (!_validation.valid_response.textinput) {
              _validation.valid_response.textinput = { value: [] };
            }
            const isExist = find(_validation.valid_response.textinput.value, valid => valid.id === res.id);
            if (!isExist) {
              _validation.valid_response.textinput.value.push({
                value: "",
                id: res.id
              });
            }
          }
          if (responsekey === "maths") {
            if (!_validation.valid_response.value) {
              _validation.valid_response.value = [];
            }
            const isExist = find(_validation.valid_response.value, valid => (valid[0] ? valid[0].id : "") === res.id);
            if (!isExist) {
              const newArray = [{ ...initialMethod, id: res.id }];
              _validation.valid_response.value.push(newArray);
            }
          }
          if (responsekey === "dropDowns") {
            if (!_validation.valid_response.dropdown) {
              _validation.valid_response.dropdown = { value: [] };
            }
            const isExist = find(_validation.valid_response.dropdown.value, valid => valid.id === res.id);
            if (!isExist) {
              _validation.valid_response.dropdown.value.push({
                value: "",
                id: res.id
              });
            }
          }
        });
      });

      // reduce alternate answers
      const maxAltLen = _validation.alt_responses ? _validation.alt_responses.length : 0;
      if (isArray(_validation.alt_responses)) {
        // math input alternate responses
        if (_validation.valid_response.value) {
          _validation.alt_responses.map(alt_res => {
            if (_validation.valid_response.value.length > alt_res.value.length) {
              alt_res.value.push(last(_validation.valid_response.value));
            }
            alt_res.value.map((altAnswer, index) => {
              const isExist = find(_allIds, res => res.id === (altAnswer ? altAnswer[0] : "").id);
              if (!isExist) {
                alt_res.value.splice(index, 1);
              }
            });
          });
        }
        // textinput alternate responses
        if (_validation.valid_response.textinput) {
          _validation.alt_responses.map(alt_res => {
            if (_validation.valid_response.textinput.value.length > alt_res.textinput.value.length) {
              alt_res.textinput.value.push(last(_validation.valid_response.textinput.value));
            }
            alt_res.textinput.value.map((altAnswer, index) => {
              const isExist = find(_allIds, res => res.id === (altAnswer || "").id);
              if (!isExist) {
                alt_res.textinput.value.splice(index, 1);
              }
            });
          });
        }
        // dropdown alternate responses
        if (_validation.valid_response.dropdown) {
          _validation.alt_responses.map(alt_res => {
            if (_validation.valid_response.dropdown.value.length > alt_res.dropdown.value.length) {
              alt_res.dropdown.value.push(last(_validation.valid_response.dropdown.value));
            }
            alt_res.dropdown.value.map((altAnswer, index) => {
              const isExist = find(_allIds, res => res.id === (altAnswer || "").id);
              if (!isExist) {
                alt_res.textinput.value.splice(index, 1);
              }
            });
          });
        }
      } else if (_validation.valid_response) {
        const newAltValues = {
          score: 1,
          value: [],
          textinput: {
            value: []
          },
          dropdown: {
            value: []
          }
        };
        newAltValues.value = cloneDeep(_validation.valid_response.value || []);
        newAltValues.value.map(answer => {
          answer.value = "";
          return answer;
        });
        newAltValues.textinput.value = cloneDeep(_validation.valid_response.textinput.value || []);
        newAltValues.textinput.value.map(answer => {
          answer.value = "";
          return answer;
        });
        newAltValues.dropdown.value = cloneDeep(_validation.valid_response.dropdown.value || []);
        newAltValues.dropdown.value.map(answer => {
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

      // remove empty valid value if there is no response box(math, dropdown, or textinput)
      if (isEmpty(_validation.valid_response.value)) {
        delete _validation.valid_response.value;
        _validation.alt_responses = _validation.alt_responses.map(alt_res => {
          delete alt_res.value;
          return alt_res;
        });
      }
      if (_validation.valid_response.textinput && isEmpty(_validation.valid_response.textinput.value)) {
        delete _validation.valid_response.textinput;
        _validation.alt_responses = _validation.alt_responses.map(alt_res => {
          delete alt_res.textinput;
          return alt_res;
        });
      }
      if (_validation.valid_response.dropdown && isEmpty(_validation.valid_response.dropdown.value)) {
        delete _validation.valid_response.dropdown;
        _validation.alt_responses = _validation.alt_responses.map(alt_res => {
          delete alt_res.dropdown;
          return alt_res;
        });
      }

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
        draft.stimulus = val;

        draft.response_ids = _reduceResponseIds(draft.stimulus);

        draft.validation = _reduceValidation(draft.response_ids, draft.validation);

        draft.options = _reduceOptions(draft.response_ids, draft.options);
      });

      if (!newItem.options) {
        delete newItem.options;
      }

      if (newItem.validation.valid_response.value) {
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
      <Question
        section="main"
        label={t("component.math.composequestion")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle data-cy="template">{t("component.math.composequestion")}</Subtitle>

        <FroalaEditor
          data-cy="templateBox"
          onChange={_updateTemplate}
          value={item.stimulus}
          additionalToolbarOptions={["responseBoxes"]}
          toolbarId="template-markup-area"
          border="border"
        />
      </Question>
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
