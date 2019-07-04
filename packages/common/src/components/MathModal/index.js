import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import MathInput from "../MathInput";
import KatexInput from "../KatexInput";

const MathModal = ({ value, symbols, isEditable, numberPad, showResponse, showDropdown, show, onSave, onClose }) => {
  const mathInputRef = useRef(null);
  const [latex, setLatex] = useState(value || "");

  useEffect(() => {
    if (show) {
      setLatex(value);
      if (mathInputRef.current) {
        mathInputRef.current.setFocus();
      }
    }
  }, [show, mathInputRef.current]);

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
      visible={show}
      title="Edit Math"
      className="math-modal"
      maskClosable={false}
      onOk={() => onSave(latex)}
      onCancel={() => onClose()}
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
  symbols: PropTypes.array.isRequired,
  numberPad: PropTypes.array.isRequired,
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
  showDropdown: false,
  showResponse: false,
  onSave: () => {},
  onClose: () => {}
};

export default MathModal;
