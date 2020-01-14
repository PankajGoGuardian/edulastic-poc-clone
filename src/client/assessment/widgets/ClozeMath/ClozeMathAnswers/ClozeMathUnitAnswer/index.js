import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Collapse, Icon } from "antd";
import { get } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { response as defaultResponse } from "@edulastic/constants";

import MathFormulaAnswerMethod from "../../../MathFormula/components/MathFormulaAnswerMethod";
import SelectUnit from "./SelectUnit";
import { AnswerContainer } from "./AnswerContainer";

const { Panel } = Collapse;

const ClozeMathUnitAnswer = ({ answer, onChange, item, onChangeKeypad, onChangeAllowedOptions, toggleAdditional }) => {
  const [collapseHeight, setCollapseHeight] = useState("auto");
  const { responseContainers: responseContainers = [], uiStyle, allowedVariables = {} } = item;
  const response = responseContainers.find(cont => cont.index === answer.index);
  const width = response && response.widthpx ? `${response.widthpx}px` : `${uiStyle.minWidth}px` || "auto";
  const height = response && response.heightpx ? `${response.heightpx}px` : `${defaultResponse.minHeight}px`;

  const _changeValue = answerId => (prop, val) => {
    onChange({ answerId, prop, value: val });
  };

  const unitDropdownRef = useRef(null);

  const dropdownVisibleChange = opened => {
    if (!opened) {
      setCollapseHeight("auto");
      return;
    }
    if (opened && unitDropdownRef.current) {
      const popupHeight = (unitDropdownRef.current?.props?.children?.length || 0) * 32;
      setCollapseHeight(Math.max(310, popupHeight));
    }
  };
  const dropdownUnit = (
    <div style={{ position: "relative" }}>
      <SelectUnit
        height={height}
        width={width}
        customUnits={answer.customUnits}
        onChange={_changeValue(answer.id)}
        unit={get(answer, "options.unit", "")}
        keypadMode={answer.keypadMode}
        onDropdownVisibleChange={dropdownVisibleChange}
        forwardedRef={unitDropdownRef}
      />
    </div>
  );
  return (
    <AnswerContainer>
      <Collapse
        onChange={() => {}}
        bordered={false}
        expandIconPosition="right"
        expandIcon={({ isActive }) => (isActive ? <Icon type="caret-up" /> : <Icon type="caret-down" />)}
      >
        <Panel header={`Math with Units ${answer.index + 1}`}>
          <MathFormulaAnswerMethod
            key={answer.index}
            item={item}
            index={0}
            answer={answer.value}
            onChange={_changeValue(answer.id)}
            style={{ width, height }}
            onChangeKeypad={onChangeKeypad}
            onChangeAllowedOptions={onChangeAllowedOptions}
            allowedVariables={answer.allowedVariables || ""}
            toggleAdditional={toggleAdditional}
            customUnits={answer.customUnits}
            keypadMode={answer.keypadMode}
            renderExtra={dropdownUnit}
            containerHeight={collapseHeight}
            showDefaultMode
            {...answer}
          />
        </Panel>
      </Collapse>
    </AnswerContainer>
  );
};

ClozeMathUnitAnswer.propTypes = {
  answer: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onChangeKeypad: PropTypes.func.isRequired,
  onChangeAllowedOptions: PropTypes.func.isRequired,
  toggleAdditional: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default withNamespaces("assessment")(ClozeMathUnitAnswer);
