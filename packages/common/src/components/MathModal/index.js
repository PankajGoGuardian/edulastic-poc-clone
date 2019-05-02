import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import MathInput from "../MathInput";

const MathModal = ({ value, symbols, numberPad, showResponse, show, onSave, onClose }) => {
  const mathInputRef = useRef(null);
  const [latex, setLatex] = useState(value || "");

  useEffect(() => {
    if (show) {
      setLatex(value);
      if (mathInputRef.current) {
        mathInputRef.current.setFocus();
      }
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
    <Modal visible={show} title="Edit Math" maskClosable={false} onOk={() => onSave(latex)} onCancel={() => onClose()}>
      <MathInput
        ref={mathInputRef}
        alwaysShowKeyboard
        symbols={symbols}
        numberPad={numberPad}
        showResponse={showResponse}
        value={latex}
        onInput={newLatex => onInput(newLatex)}
        onKeyDown={evt => onKeyDown(evt)}
      />
    </Modal>
  );
};

MathModal.propTypes = {
  show: PropTypes.bool,
  symbols: PropTypes.array.isRequired,
  numberPad: PropTypes.array.isRequired,
  showResponse: PropTypes.bool,
  value: PropTypes.string,
  onSave: PropTypes.func,
  onClose: PropTypes.func
};

MathModal.defaultProps = {
  show: false,
  value: "",
  showResponse: false,
  onSave: () => {},
  onClose: () => {}
};

export default MathModal;
