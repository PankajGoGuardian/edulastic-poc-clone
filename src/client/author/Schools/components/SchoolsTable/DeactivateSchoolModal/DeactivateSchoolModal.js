import React from "react";
import { Form, Button } from "antd";
import { borders, backgrounds, themeColor, whiteSmoke, numBtnColors, white } from "@edulastic/colors";
import styled from "styled-components";
import { StyledClassName, StyledInput } from "../../../../Classes/components/ClassesTable/ArchiveClassModal/styled";
import { ConfirmationModal } from "../../../../src/components/common/ConfirmationModal";
class DeactivateSchoolModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { textDeactivate: "" };
  }

  onCloseModal = () => {
    this.props.closeModal();
  };

  onChangeInput = e => {
    this.setState({ textDeactivate: e.target.value });
  };
  onDeactivateSchool = () => {
    this.props.deactivateSchool();
  };

  render() {
    const { modalVisible, schoolData } = this.props;
    const { textDeactivate } = this.state;
    const schoolName = schoolData.map(row => <StyledClassName>{row.name}</StyledClassName>);

    return (
      <ConfirmationModal
        visible={modalVisible}
        title="Deactivate School(s)"
        onOk={this.onDeactivateSchool}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <Button onClick={this.onCloseModal} ghost type="primary">
            No, Cancel
          </Button>,
          <YesButton onClick={this.onDeactivateSchool} disabled={textDeactivate.toLowerCase() !== "deactivate"}>
            Yes, Deactivate >
          </YesButton>
        ]}
      >
        <ModalBody>
          <span>Are you sure you want to deactivate the following school(s)?</span>
          {schoolName}
          <span>
            If Yes type <LightGreenSpan>DEACTIVATE</LightGreenSpan> in the space given below and proceed.
          </span>
          <FormItem>
            <TextInput value={textDeactivate} onChange={this.onChangeInput} />
          </FormItem>
        </ModalBody>
      </ConfirmationModal>
    );
  }
}

export default DeactivateSchoolModal;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const FormItem = styled(Form.Item)`
  width: 80%;
  display: inline-block;
  margin: 10px;
  .ant-input {
    height: 33px;
    background: ${backgrounds.primary};
    border: 1px solid ${borders.secondary};
    padding: 10px 24px;
  }
`;

const TextInput = styled(StyledInput)`
  text-align: center;
  width: 100%;
`;

const YesButton = styled(Button)`
  color: ${props => (props.disabled ? "rgba(0, 0, 0, 0.25)" : white)} !important;
  background-color: ${props => (props.disabled ? whiteSmoke : themeColor)} !important;
  border-color: ${props => (props.disabled ? numBtnColors.borderColor : themeColor)} !important;
`;

export const LightGreenSpan = styled.span`
  color: ${themeColor};
  font-weight: bold;
`;
