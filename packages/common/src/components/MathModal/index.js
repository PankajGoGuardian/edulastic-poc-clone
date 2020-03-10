import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { math } from "@edulastic/constants";
import MathInput from "../MathInput";
import KatexInput from "../KatexInput";
import EduButton from "../EduButton";
import FlexContainer from "../FlexContainer";

const defaultSymbols = ["basic", "intermediate", "advanced", "units_si", "units_us", "all"];
const { defaultNumberPad } = math;

const MathModal = ({
  value,
  symbols,
  isEditable,
  numberPad,
  showResponse,
  showDropdown,
  show,
  onSave,
  onClose,
  width
}) => {
  const mathInputRef = useRef(null);
  const [latex, setLatex] = useState(value || "");

  useEffect(() => {
    if (show) {
      if (mathInputRef.current) {
        mathInputRef.current.setFocus();
      }
      setLatex(value);
    }
  }, [show]);

  const onInput = newLatex => {
    setLatex(newLatex);
  };

  const onKeyDown = evt => {
    if (evt.which === 13) {
      onSave(latex);
    }
  };

  return (
    <Modal
      centered
      visible={show}
      title="Edit Math"
      className="math-modal"
      maskClosable={false}
      onCancel={() => onClose()}
      width={width || "785px"}
      wrapProps={{
        style: { overflow: "auto", display: show ? "block" : "none" }
      }}
      footer={
        <FlexContainer justifyContent="flex-start">
          <EduButton isGhost onClick={() => onClose()}>
            CANCEL
          </EduButton>
          <EduButton type="primary" onClick={() => onSave(latex)}>
            OK
          </EduButton>
        </FlexContainer>
      }
    >
      {!isEditable && <KatexInput value={latex} onInput={onInput} />}
      {isEditable && (
        <MathInput
          ref={mathInputRef}
          alwaysShowKeyboard
          defaultFocus
          symbols={symbols}
          numberPad={numberPad}
          showResponse={showResponse}
          showDropdown={showDropdown}
          value={latex}
          onInput={newLatex => onInput(newLatex)}
          onKeyDown={evt => onKeyDown(evt)}
        />
      )}
    </Modal>
  );
};

MathModal.propTypes = {
  show: PropTypes.bool,
  isEditable: PropTypes.bool,
  symbols: PropTypes.array,
  numberPad: PropTypes.array,
  width: PropTypes.string,
  showDropdown: PropTypes.bool,
  showResponse: PropTypes.bool,
  value: PropTypes.string,
  onSave: PropTypes.func,
  onClose: PropTypes.func
};

MathModal.defaultProps = {
  show: false,
  isEditable: true,
  value: "",
  width: null,
  symbols: defaultSymbols,
  numberPad: defaultNumberPad,
  showDropdown: false,
  showResponse: false,
  onSave: () => {},
  onClose: () => {}
};

export default MathModal;
