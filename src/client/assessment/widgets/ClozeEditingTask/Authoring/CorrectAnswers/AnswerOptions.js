import React, { useContext } from "react";
import produce from "immer";
import { FlexContainer, ScrollContext } from "@edulastic/common";
import { CorrectAnswerOptions } from "../../../../styled/CorrectAnswerOptions";
import { CheckboxLabel } from "../../../../styled/CheckboxWithLabel";
import { Label } from "../../../../styled/WidgetOptions/Label";
import { SelectInputStyled as Select } from "../../../../styled/InputStyles";
import { RadioLabel, RadioLabelGroup } from "../../../../styled/RadioWithLabel";

import { displayStyleOptions, displayStyles, subOptions } from "../../constants";

const { Option } = Select;

const AnswerOptions = ({ t, setQuestionData, item }) => {
  const { shuffleOptions, displayStyle = { type: "", option: "" } } = item;
  const optionsChangeHandler = (name, value) => () => {
    setQuestionData(
      produce(item, draft => {
        draft[name] = value;
      })
    );
  };

  const onChangeDisplayStyle = value => {
    setQuestionData(
      produce(item, draft => {
        if (!draft.displayStyle) {
          draft.displayStyle = {};
        }
        draft.displayStyle = {
          type: value,
          option: value === displayStyles.DRAG_DROP ? subOptions.EMPTY : subOptions.DASHED_LINE
        };
      })
    );
  };

  const onChangeDisplayStyleSubOption = ({ target: { value } }) => {
    setQuestionData(
      produce(item, draft => {
        if (!draft.displayStyle) {
          draft.displayStyle = {};
        }
        draft.displayStyle = {
          ...draft.displayStyle,
          option: value
        };
      })
    );
  };

  const isDragDropStyle = displayStyle.type === displayStyles.DRAG_DROP;
  const dStyle = displayStyle.type || displayStyles.TOGGLE;
  const subOp = displayStyle.option ? displayStyle.option : isDragDropStyle ? subOptions.EMPTY : subOptions.DASHED_LINE;

  const { getScrollElement } = useContext(ScrollContext);

  return (
    <CorrectAnswerOptions alignItems="center">
      <CheckboxLabel
        key="shuffleOptions"
        onChange={optionsChangeHandler("shuffleOptions", !shuffleOptions)}
        checked={shuffleOptions}
      >
        <Label style={{ display: "inline" }}>{t("component.cloze.dropDown.shuffleoptions")}</Label>
      </CheckboxLabel>

      <FlexContainer alignItems="center">
        <Select width="160px" onSelect={onChangeDisplayStyle} value={dStyle} getPopupContainer={getScrollElement}>
          {displayStyleOptions.map((op, index) => (
            <Option value={op.value} key={index}>
              {op.label}
            </Option>
          ))}
        </Select>
        <Label ml="8px" marginBottom="0px">
          {t("component.options.displayStyle")}
        </Label>
      </FlexContainer>

      <RadioLabelGroup mt="4px" pl="12px" onChange={onChangeDisplayStyleSubOption} value={subOp}>
        {isDragDropStyle && (
          <RadioLabel labelPadding="8px" value={subOptions.EMPTY}>
            {t("component.options.empty")}
          </RadioLabel>
        )}
        {isDragDropStyle && (
          <RadioLabel labelPadding="8px" value={subOptions.PRE_FILLED}>
            {t("component.options.preFilled")}
          </RadioLabel>
        )}
        {!isDragDropStyle && (
          <RadioLabel labelPadding="8px" value={subOptions.DASHED_LINE}>
            {t("component.options.dashedline")}
          </RadioLabel>
        )}
        {!isDragDropStyle && (
          <RadioLabel labelPadding="8px" value={subOptions.HIGHLIGHT}>
            {t("component.options.highlight")}
          </RadioLabel>
        )}
      </RadioLabelGroup>
    </CorrectAnswerOptions>
  );
};

export default AnswerOptions;
