import { backgrounds, numBtnColors, themeColor, white, whiteSmoke } from "@edulastic/colors";
import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { compose } from "redux";
import styled from "styled-components";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";

const DeleteSchoolModal = ({ visible, toggleModal, form, removeSchool, selectedSchool }) => {
  const [disableButton, setButtonState] = useState(true);

  const handleResponse = e => {
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values && values.confirmationText && values.confirmationText.toUpperCase() === "REMOVE") removeSchool();
      }
    });
  };

  const Footer = [
    <Button ghost onClick={() => toggleModal("REMOVE_SCHOOL", false)}>
      NO, CANCEL
    </Button>,
    <YesButton disabled={disableButton} onClick={handleResponse}>
      YES, REMOVE
    </YesButton>
  ];

  const Title = [<Heading>Remove</Heading>];

  const validateText = (rule, value, callback) => {
    if (value && value.toUpperCase() === "REMOVE") {
      setButtonState(false);
      callback();
    } else {
      setButtonState(true);
      callback();
    }
  };

  return (
    <ConfirmationModal
      title={Title}
      centered
      textAlign="left"
      visible={visible}
      footer={Footer}
      onCancel={() => toggleModal("REMOVE_SCHOOL", false)}
      width={700}
    >
      <ModalBody data-cy="removeSchoolModal">
        <span>
          You are about to remove the school <strong>{selectedSchool.name}</strong>.
        </span>
        <span>All assessment and questions shared with {selectedSchool.name} would be moved to private Library.</span>
        <span>
          This action can NOT be undone, please type <strong style={{ color: themeColor }}>REMOVE</strong> in the space
          below to proceed.
        </span>
        <FormItem>
          {form.getFieldDecorator("confirmationText", {
            rules: [
              {
                validator: validateText
              }
            ]
          })(<TextInput type="text" />)}
        </FormItem>
      </ModalBody>
    </ConfirmationModal>
  );
};

const enhance = compose(Form.create());

export default enhance(DeleteSchoolModal);

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: auto;
  font-weight: 600;
  span {
    margin-bottom: 15px;
  }
`;

const FormItem = styled(Form.Item)`
  width: 100%;
  display: inline-block;
  margin: 10px;
  .ant-input {
    height: 33px;
    background: ${backgrounds.primary};
    padding: 10px 24px;
  }
`;

const Heading = styled.h4`
  font-weight: 600;
`;

const TextInput = styled(Input)`
  text-align: center;
`;

const YesButton = styled(Button)`
  color: ${props => (props.disabled ? "rgba(0, 0, 0, 0.25)" : white)} !important;
  background-color: ${props => (props.disabled ? whiteSmoke : themeColor)} !important;
  border-color: ${props => (props.disabled ? numBtnColors.borderColor : themeColor)} !important;
`;
