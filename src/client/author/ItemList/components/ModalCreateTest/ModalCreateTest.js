import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Form, Input, message } from "antd";

import Modal from "../../../src/components/common/Modal";
import { getSelectedItemSelector } from "../../../TestPage/components/AddItems/ducks";
import { createTestFromCartAction } from "../../ducks";

const ModalCreateTest = ({ onCancel, onProceed, createTestFromCart, amountOfSelectedItems }) => {
  const inputRef = useRef(null);
  const handleProceed = () => {
    if (!inputRef.current.state.value) {
      return message.error("Please provide valid test name");
    }
    createTestFromCart(inputRef.current.state.value);
    onProceed();
  };

  const handleProceedKeyPress = e => {
    if (e.keyCode === 13) {
      handleProceed();
    }
  };

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Modal
      title={`Creating a new test with ${amountOfSelectedItems} items`}
      applyLabel="Proceed"
      onClose={onCancel}
      onApply={handleProceed}
    >
      <Form layout="inline">
        <Form.Item label="Name">
          <Input ref={inputRef} placeholder="Enter test name" onKeyUp={handleProceedKeyPress} />
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
