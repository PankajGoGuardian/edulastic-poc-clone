import { themeColor } from "@edulastic/colors";
import { CustomModalStyled, EduButton, TextInputStyled } from "@edulastic/common";
import { Form } from "antd";
import React from "react";
import styled from "styled-components";
import { StyledClassName } from "../../../../Classes/components/ClassesTable/ArchiveClassModal/styled";

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
    const { modalVisible, schoolData, t } = this.props;
    const { textDeactivate } = this.state;
    const schoolName = schoolData.map(row => <StyledClassName>{row.name}</StyledClassName>);

    return (
      <CustomModalStyled
        visible={modalVisible}
        title={t("school.components.deactivateschool.deactivateschools")}
        onOk={this.onDeactivateSchool}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <EduButton onClick={this.onCloseModal} isGhost type="primary">
            {t("school.components.deactivateschool.nocancel")}
          </EduButton>,
          <EduButton onClick={this.onDeactivateSchool} disabled={textDeactivate.toLowerCase() !== "deactivate"}>
            {t("school.components.deactivateschool.yesdeactivate")}
          </EduButton>
        ]}
      >
        <ModalBody>
          <span>
            {t("common.modalConfirmationText1")} {t("school.components.deactivateschool.schools")}
          </span>
          {schoolName}
          <span>
            {t("common.modalConfirmationText2")}
            <LightGreenSpan>{t("school.components.deactivateschool.deactivate")}</LightGreenSpan>{" "}
            {t("common.modalConfirmationText3")}
          </span>
          <FormItem>
            <TextInputStyled align="center" value={textDeactivate} onChange={this.onChangeInput} />
          </FormItem>
        </ModalBody>
      </CustomModalStyled>
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
`;

export const LightGreenSpan = styled.span`
  color: ${themeColor};
  font-weight: bold;
`;
