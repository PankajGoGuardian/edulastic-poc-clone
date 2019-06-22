import React from "react";
import { Row, Col, Button, Modal } from "antd";
import { StyledCol, StyledP, StyledInput, LightBlueSpan } from "./styled";
import PropTypes from "prop-types";

const ConfirmationModal = ({ title, show, onOk, onCancel, inputVal, onInputChange, expectedVal, bodyText, okText }) => {
  return (
    <Modal
      centered
      visible={show}
      title={title}
      onCancel={onCancel}
      maskClosable={false}
      footer={[
        <Button type="primary" key={"1"} onClick={onCancel}>
          No, Cancel
        </Button>,
        <Button type="primary" key={"2"} onClick={onOk} disabled={expectedVal !== inputVal.toUpperCase()}>
          {okText}
        </Button>
      ]}
    >
      <Row>
        <Col span={24}>
          <StyledP>{bodyText}</StyledP>
          <StyledP>
            This action can NOT be undone. If you are sure, please type <LightBlueSpan>{expectedVal}</LightBlueSpan> in
            the space below
          </StyledP>
        </Col>
      </Row>
      <Row>
        <StyledCol span={24}>
          <StyledInput
            value={inputVal}
            onChange={onInputChange}
            // here paste is not allowed, and user has to manually type in inputVal
            onPaste={e => e.preventDefault()}
          />
        </StyledCol>
      </Row>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  title: PropTypes.string,
  show: PropTypes.bool,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  inputVal: PropTypes.any,
  onInputChange: PropTypes.func,
  expectedVal: PropTypes.string,
  bodyText: PropTypes.any,
  okText: PropTypes.string
};
export default ConfirmationModal;
