import React from "react";
import { find, get } from "lodash";
import PropTypes from "prop-types";
import { MathInput, StaticMath, reformatMathInputLatex, getInnerValuesForStatic } from "@edulastic/common";
import CheckedBlock from "./CheckedBlock";
import { MathInputWrapper } from "./styled/MathInputWrapper";

const ClozeMathInput = ({ resprops = {}, id, responseindex }) => {
  const {
    responseContainers,
    item,
    answers = {},
    checked,
    save,
    disableResponse = false,
    uiStyles,
    isPrintPreview
  } = resprops;
  const { maths: userAnswers = [] } = answers;
  const response = find(responseContainers, cont => cont.id === id);
  const {
    responseIds: { maths = [] }
  } = item;

  const userAnswer = userAnswers[id];
  const { allowNumericOnly } = find(maths, res => res.id === id) || {};
  const { allowedVariables = "" } = find(maths, res => res.id === id) || {};
  const restrictKeys = allowedVariables ? allowedVariables.split(",").map(segment => segment.trim()) : [];
  const { useTemplate, template = "" } = find(maths, res => res.id === id) || {};
  const customKeys = get(item, "customKeys", []);
  const isShowDropdown = item.isUnits && item.showDropdown;

  const studentTemplate = template.replace(/\\embed\{response\}/g, "\\MathQuillMathField{}");
  // this is used for values in the response boxes in template
  const innerValues = getInnerValuesForStatic(studentTemplate, userAnswer?.value);

  const individualWidth = response?.widthpx || 0;
  const individualHeight = response?.heightpx || 0;
  const { heightpx: globalHeight = 0, widthpx: globalWidth = 0, minHeight, minWidth } = item?.uiStyle || {};
  const width = individualWidth || Math.max(parseInt(globalWidth, 10), parseInt(minWidth, 10));
  const height = individualHeight || Math.max(parseInt(globalHeight, 10), parseInt(minHeight, 10));

  const handleSaveAnswer = latex => {
    const value = reformatMathInputLatex(latex);
    if (save) {
      save({ value, index: responseindex }, "maths", id);
    }
  };

  const mathInputProps = {
    hideKeypad: isShowDropdown,
    symbols: isShowDropdown ? ["basic"] : item.symbols,
    restrictKeys,
    allowNumericOnly,
    customKeys: isShowDropdown ? [] : customKeys,
    numberPad: item.numberPad,
    onInput: handleSaveAnswer,
    showResponse: useTemplate
  };

  const staticOrMathInput = useTemplate ? (
    <StaticMath {...mathInputProps} latex={studentTemplate} innerValues={innerValues} />
  ) : (
    <MathInput {...mathInputProps} value={userAnswer?.value} />
  );

  return checked ? (
    <CheckedBlock
      {...resprops}
      width={width}
      height={height}
      userAnswer={userAnswer}
      id={id}
      type="maths"
      isPrintPreview={isPrintPreview}
      isMath
    />
  ) : (
    <MathInputWrapper width={width} disableResponse={disableResponse} height={height} fontSize={uiStyles?.fontSize}>
      {staticOrMathInput}
    </MathInputWrapper>
  );
};

ClozeMathInput.propTypes = {
  id: PropTypes.string.isRequired,
  resprops: PropTypes.object.isRequired,
  responseindex: PropTypes.string.isRequired
};

export default ClozeMathInput;
