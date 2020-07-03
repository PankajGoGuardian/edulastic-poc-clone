import { CustomModalStyled, EduButton } from "@edulastic/common";
import { Col, Row } from "antd";
import React from "react";
import { InitOptions, LightGreenSpan, ModalFooter, StyledCol, StyledDiv, StyledInput } from "./styled";

const ConfirmationModal = ({
  title,
  show,
  onOk,
  onCancel,
  inputVal,
  onInputChange,
  expectedVal,
  bodyText,
  okText = "",
  canUndone,
  bodyStyle = {}
}) => (
  <CustomModalStyled
    centered
    visible={show}
    width="750px"
    title={title}
    onCancel={onCancel}
    destroyOnClose
    maskClosable={false}
    footer={[
      <ModalFooter>
        <EduButton isGhost key="1" onClick={onCancel}>
          NO, CANCEL
        </EduButton>
        <EduButton data-cy="submitConfirm" key="2" onClick={onOk} disabled={expectedVal !== inputVal.toUpperCase()}>
          {okText.toUpperCase()}
        </EduButton>
      </ModalFooter>
      ]}
  >
    <InitOptions bodyStyle={bodyStyle}>
      <Row>
        <Col span={24}>
          <StyledDiv>{bodyText}</StyledDiv>

          {canUndone ? (
            <StyledDiv>
              If Yes, type<LightGreenSpan> {expectedVal} </LightGreenSpan>
              in the space given below to proceed.
            </StyledDiv>
            ) : (
              <StyledDiv>
                This action can NOT be undone. If you are sure, please type{" "}
                <LightGreenSpan> {expectedVal} </LightGreenSpan> in the space below.
              </StyledDiv>
            )}
        </Col>
      </Row>
      <Row>
        <StyledCol span={24}>
          <StyledInput
            data-cy="confirmationInput"
            value={inputVal}
            onChange={onInputChange}
              // here paste is not allowed, and user has to manually type in inputVal
            onPaste={e => e.preventDefault()}
          />
        </StyledCol>
      </Row>
    </InitOptions>
  </CustomModalStyled>
  );

export default ConfirmationModal;
