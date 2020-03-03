import React, { useState } from "react";
import { compose } from "redux";
import { Button, Form, Input } from "antd";
import styled from "styled-components";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";
import { ModalBody, Heading, YesButton } from "./ConfirmModal";
import { backgrounds, themeColor } from "@edulastic/colors";
import { EduButton } from "@edulastic/common";

const DeleteModal = ({ visible, toggleModal, form }) => {
  const [disableButton, setButtonState] = useState(true);

  const handleResponse = e => {
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values && values.confirmationText && values.confirmationText.toUpperCase() === "DELETE") toggleModal("YES");
      }
    });
  };

  const Footer = [
    <EduButton height="40px" isGhost onClick={() => toggleModal("NO")}>
      NO, CANCEL
    </EduButton>,
    <EduButton height="40px" disabled={disableButton} onClick={handleResponse}>
      YES, DELETE
    </EduButton>
  ];

  const Title = [<Heading>Delete Rubric</Heading>];

  const validateText = (rule, value, callback) => {
    if (value && value.toUpperCase() === "DELETE") {
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
      textAlign={"center"}
      onCancel={() => toggleModal("NO")}
    >
      <ModalBody>
        <span>Deleting the Rubric will completely remove the data.</span>
        <span>
          If sure, please type <strong style={{ color: themeColor }}>DELETE</strong> in the space below to proceed.
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

export default enhance(DeleteModal);

const FormItem = styled(Form.Item)`
  width: 80%;
  display: inline-block;
  margin: 10px;
  .ant-input {
    height: 33px;
    background: ${backgrounds.primary};
    padding: 10px 24px;
  }
`;

const TextInput = styled(Input)`
  text-align: center;
`;
