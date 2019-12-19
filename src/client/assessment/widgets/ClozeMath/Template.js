/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { withNamespaces } from "react-i18next";
import { cloneDeep, keys as _keys, flattenDeep, isArray, find, last, isEmpty, get } from "lodash";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

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

const initialMathUnit = {
  method: methods.EQUIV_SYMBOLIC,
  options: {
    inverseResult: false
  },
  value: "",
  id: ""
};

const initResponseId = {
  inputs: [],
  maths: [],
  dropDowns: [],
  mathUnits: []
};

class Template extends Component {
  render() {
    const { t, item, setQuestionData, fillSections, cleanSections } = this.props;

    const _reduceResponseIds = (tmpl, prevIds = {}) => {
      const newResponseId = cloneDeep(initResponseId);
      const { mathUnits = [], maths = [] } = prevIds;
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
          const { allowNumericOnly, allowedVariables, useTemplate, template } = maths.find(box => box.id === id) || {};
          newResponseId.maths.push({ index, id, allowNumericOnly, allowedVariables, useTemplate, template });
        } else if (tagName === "mathunit") {
          const prev = mathUnits.find(m => m.id === id);
          if (prev) {
            newResponseId.mathUnits.push({ ...prev, index });
          } else {
            newResponseId.mathUnits.push({ index, id, keypadMode: math.units[0].value });
          }
        } else if (tagName === "textdropdown") {
          newResponseId.dropDowns.push({ index, id });
        }
      }

      $(parsedHTML)
        .find("textinput, mathinput, textdropdown, mathunit")
        .each(findResponseIndexes);

      Object.keys(newResponseId).map(key => {
        if (key !== "scoringType") {
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
      if (_validation.validResponse.value) {
        _validation.validResponse.value.map((val, index) => {
          if (!val[0].id) {
            _validation.validResponse.value.splice(index, 1);
          }
          const isExist = find(_allIds, res => res.id === val[0].id);
          if (!isExist) {
            _validation.validResponse.value.splice(index, 1);
          }
        });
      }

      // remove correct answer (math unit) by delted response box id
      if (_validation.validResponse.mathUnits) {
        _validation.validResponse.mathUnits.value.map((val, index) => {
          if (!val.id) {
            _validation.validResponse.mathUnits.value.splice(index, 1);
          }
          const isExist = find(_allIds, res => res.id === val.id);
          if (!isExist) {
            _validation.validResponse.mathUnits.value.splice(index, 1);
          }
        });
      }

      // remvoe correct answer (text input) by deleted response box id.
      if (_validation.validResponse.textinput) {
        _validation.validResponse.textinput.value.map((val, index) => {
          if (!val.id) {
            _validation.validResponse.textinput.value.splice(index, 1);
          }
          const isExist = find(_allIds, res => res.id === val.id);
          if (!isExist) {
            _validation.validResponse.textinput.value.splice(index, 1);
          }
        });
      }

      // remove correct answer (dropdown) by deleted response box id.
      if (_validation.validResponse.dropdown) {
        _validation.validResponse.dropdown.value.map((val, index) => {
          if (!val.id) {
            _validation.validResponse.dropdown.value.splice(index, 1);
          }
          const isExist = find(_allIds, res => res.id === val.id);
          if (!isExist) {
            _validation.validResponse.dropdown.value.splice(index, 1);
          }
        });
      }

      // add new correct answers with response id
      if (!_validation.validResponse) {
        _validation.validResponse = { score: 1, value: [], dropdown: { value: [] }, textinput: { value: [] } };
      }
      _keys(responseIds).map(responsekey => {
        responseIds[responsekey].map(res => {
          if (responsekey === "inputs") {
            if (!_validation.validResponse.textinput) {
              _validation.validResponse.textinput = { value: [] };
            }
            const isExist = find(_validation.validResponse.textinput.value, valid => valid.id === res.id);
            if (!isExist) {
              _validation.validResponse.textinput.value.push({
                value: "",
                id: res.id
              });
            }
          }
          if (responsekey === "maths") {
            if (!_validation.validResponse.value) {
              _validation.validResponse.value = [];
            }
            const isExist = find(_validation.validResponse.value, valid => (valid[0] ? valid[0].id : "") === res.id);
            if (!isExist) {
              const newArray = [{ ...initialMethod, id: res.id }];
              _validation.validResponse.value.push(newArray);
            }
          }
          if (responsekey === "dropDowns") {
            if (!_validation.validResponse.dropdown) {
              _validation.validResponse.dropdown = { value: [] };
            }
            const isExist = find(_validation.validResponse.dropdown.value, valid => valid.id === res.id);
            if (!isExist) {
              _validation.validResponse.dropdown.value.push({
                value: "",
                id: res.id
              });
            }
          }
          if (responsekey === "mathUnits") {
            if (!_validation.validResponse.mathUnits) {
              _validation.validResponse.mathUnits = { value: [] };
            }
            const isExist = find(_validation.validResponse.mathUnits.value, valid => valid.id === res.id);
            if (!isExist) {
              _validation.validResponse.mathUnits.value.push({
                ...initialMathUnit,
                id: res.id
              });
            }
          }
        });
      });

      // reduce alternate answers
      const maxAltLen = _validation.altResponses ? _validation.altResponses.length : 0;
      if (isArray(_validation.altResponses)) {
        // math input alternate responses
        if (_validation.validResponse.value) {
          _validation.altResponses.map(alt_res => {
            if (!alt_res.value) {
              alt_res.value = {
                value: []
              };
            }
            if (_validation.validResponse.value.length > alt_res.value.length) {
              alt_res.value.push(last(_validation.validResponse.value));
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
        if (_validation.validResponse.textinput) {
          _validation.altResponses.map(alt_res => {
            if (!alt_res.textinput) {
              alt_res.textinput = {
                value: []
              };
            }
            if (_validation.validResponse.textinput.value.length > alt_res.textinput.value.length) {
              alt_res.textinput.value.push(last(_validation.validResponse.textinput.value));
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
        if (_validation.validResponse.dropdown) {
          _validation.altResponses.map(alt_res => {
            if (!alt_res.dropdown) {
              alt_res.dropdown = {
                value: []
              };
            }
            if (_validation.validResponse.dropdown.value.length > alt_res.dropdown.value.length) {
              alt_res.dropdown.value.push(last(_validation.validResponse.dropdown.value));
            }
            alt_res.dropdown.value.map((altAnswer, index) => {
              const isExist = find(_allIds, res => res.id === (altAnswer || "").id);
              if (!isExist) {
                alt_res.dropdown.value.splice(index, 1);
              }
            });
          });
        }
        // Math Unit alternate responses
        if (_validation.validResponse.mathUnits) {
          _validation.altResponses.map(alt_res => {
            if (!alt_res.mathUnits) {
              alt_res.mathUnits = {
                value: []
              };
            }
            if (_validation.validResponse.mathUnits.value.length > alt_res.mathUnits.value.length) {
              alt_res.mathUnits.value.push(last(_validation.validResponse.mathUnits.value));
            }
            alt_res.mathUnits.value.map((altAnswer, index) => {
              const isExist = find(_allIds, res => res.id === (altAnswer || "").id);
              if (!isExist) {
                alt_res.mathUnits.value.splice(index, 1);
              }
            });
          });
        }
      } else if (_validation.validResponse) {
        const newAltValues = {
          score: 1,
          value: [],
          textinput: {
            value: []
          },
          dropdown: {
            value: []
          },
          mathUnits: {
            value: []
          }
        };
        newAltValues.value = cloneDeep(get(_validation, "validResponse.value", []));
        newAltValues.value.map(answer => {
          answer.value = "";
          return answer;
        });
        newAltValues.textinput.value = cloneDeep(get(_validation, "validResponse.textinput.value", []));
        newAltValues.textinput.value.map(answer => {
          answer.value = "";
          return answer;
        });
        newAltValues.dropdown.value = cloneDeep(get(_validation, "validResponse.dropdown.value", []));
        newAltValues.dropdown.value.map(answer => {
          answer.value = "";
          return answer;
        });
        newAltValues.mathUnits.value = cloneDeep(get(_validation, "validResponse.mathUnits.value", []));
        newAltValues.mathUnits.value.map(answer => {
          answer.value = "";
          return answer;
        });
        _validation.altResponses = [];
        for (let i = 0; i < maxAltLen; i++) {
          _validation.altResponses.push({
            score: 1,
            value: newAltValues
          });
        }
      }

      // remove empty valid value if there is no response box(math, dropdown, or textinput)
      if (isEmpty(_validation.validResponse.value)) {
        delete _validation.validResponse.value;
        _validation.altResponses = _validation.altResponses.map(alt_res => {
          delete alt_res.value;
          return alt_res;
        });
      }
      if (_validation.validResponse.textinput && isEmpty(_validation.validResponse.textinput.value)) {
        delete _validation.validResponse.textinput;
        _validation.altResponses = _validation.altResponses.map(alt_res => {
          delete alt_res.textinput;
          return alt_res;
        });
      }
      if (_validation.validResponse.dropdown && isEmpty(_validation.validResponse.dropdown.value)) {
        delete _validation.validResponse.dropdown;
        _validation.altResponses = _validation.altResponses.map(alt_res => {
          delete alt_res.dropdown;
          return alt_res;
        });
      }
      if (_validation.validResponse.mathUnits && isEmpty(_validation.validResponse.mathUnits.value)) {
        delete _validation.validResponse.mathUnits;
        _validation.altResponses = _validation.altResponses.map(alt_res => {
          delete alt_res.mathUnits;
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

        draft.responseIds = _reduceResponseIds(draft.stimulus, draft.responseIds);

        draft.validation = _reduceValidation(draft.responseIds, draft.validation);

        draft.options = _reduceOptions(draft.responseIds, draft.options);
      });

      if (!newItem.options) {
        delete newItem.options;
      }

      if (newItem.validation.validResponse.value) {
        newItem.validation.validResponse.value.map(res => {
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
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.math.composequestion")}`)} data-cy="template">
          {t("component.math.composequestion")}
        </Subtitle>

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
