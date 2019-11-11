import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Input, message, Row, Col } from "antd";

import Modal from "../../../src/components/common/Modal";
import { getSelectedItemSelector } from "../../../TestPage/components/AddItems/ducks";
import { createTestFromCartAction } from "../../ducks";
import styled from "styled-components";

const ModalCreateTest = ({ onCancel, onProceed, createTestFromCart, selectedItems }) => {
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
      title={`Creating a new test with ${selectedItems?.length} items`}
      applyLabel="Proceed"
      onClose={onCancel}
      onApply={handleProceed}
    >
      <StyledRow>
        <Col span={5}>Test Name</Col>
        <Col span={19}>
          <Input ref={inputRef} placeholder="Enter test name" onKeyUp={handleProceedKeyPress} />
        </Col>
      </StyledRow>
    </Modal>
  );
};

ModalCreateTest.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onProceed: PropTypes.func.isRequired,
  createTestFromCart: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired
};

export default connect(
  state => ({
    selectedItems: getSelectedItemSelector(state)
  }),
  {
    createTestFromCart: createTestFromCartAction
  }
)(ModalCreateTest);

const StyledRow = styled(Row)`
  margin: 24px 0px;
`;
