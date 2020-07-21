import { CustomModalStyled, EduButton, TextInputStyled } from "@edulastic/common";
import { Col, Row } from "antd";
import { extraDesktopWidth } from "@edulastic/colors";
import styled from "styled-components";
import React from "react";
import { InitOptions, LightGreenSpan, ModalFooter, StyledCol, StyledDiv } from "./styled";

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
  bodyStyle = {},
  bodyTextStyle,
  placeHolder
}) => (
    <ConfirmationModalStyled
      centered
      visible={show}
      width="614px"
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
            <StyledDiv>
              {bodyText}&nbsp;
              {canUndone ? null : <span>This action can NOT be undone.</span>}
            </StyledDiv>

            {canUndone ? (
              <StyledDiv style={bodyTextStyle}>
                If Yes, type<LightGreenSpan> {expectedVal} </LightGreenSpan>
                in the space given below and proceed.
              </StyledDiv>
            ) : (
                <StyledDiv style={bodyTextStyle}>
                  If you are sure, please type{" "}
                  <LightGreenSpan> {expectedVal} </LightGreenSpan> in the space below and
                  proceed.
                </StyledDiv>
              )}
          </Col>
        </Row>
        <Row>
          <StyledCol span={24}>
            <TextInputStyled
              placeholder={placeHolder}
              data-cy="confirmationInput"
              value={inputVal}
              onChange={onInputChange}
              // here paste is not allowed, and user has to manually type in inputVal
              onPaste={e => e.preventDefault()}
            />
          </StyledCol>
        </Row>
      </InitOptions>
    </ConfirmationModalStyled>
  );


export default ConfirmationModal;

export const ConfirmationModalStyled = styled(CustomModalStyled)`
 .ant-modal-title {
    margin-left: 5px;
  }
  @media (min-width: ${extraDesktopWidth}) {
    min-width: 750px !important;
  }
`;

