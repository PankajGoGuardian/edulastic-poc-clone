import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Form, Input } from "antd";

import Modal from "../../../src/components/common/Modal";
import { getSelectedItemSelector } from "../../../TestPage/components/AddItems/ducks";
import { createTestFromCartAction } from "../../ducks";

const ModalCreateTest = ({ onCancel, onProceed, createTestFromCart, amountOfSelectedItems }) => {
  const inputRef = useRef(null);
  const [testName, setTestName] = useState("");

  const handleChangeTestName = ({ target: { value } }) => setTestName(value);
  const handleProceed = () => {
    createTestFromCart(testName);
    onProceed();
  };

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Modal
      title={`Creating a new test with ${amountOfSelectedItems} items`}
      applyLabel="Procceed"
      onClose={onCancel}
      onApply={handleProceed}
    >
      <Form layout="inline">
        <Form.Item label="Name">
          <Input ref={inputRef} placeholder="Author Test" value={testName} onChange={handleChangeTestName} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

ModalCreateTest.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onProceed: PropTypes.func.isRequired,
  createTestFromCart: PropTypes.func.isRequired,
  amountOfSelectedItems: PropTypes.number.isRequired
};

export default connect(
  state => ({
    amountOfSelectedItems: getSelectedItemSelector(state).data.length
  }),
  {
    createTestFromCart: createTestFromCartAction
  }
)(ModalCreateTest);
