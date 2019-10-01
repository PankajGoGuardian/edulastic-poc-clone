import React, { Component } from "react";
import styled from "styled-components";
import Modal from "react-responsive-modal";
import PropTypes from "prop-types";
import { Button, Row, Col } from "antd";
import { withNamespaces } from "@edulastic/localization";

import { secondaryTextColor } from "@edulastic/colors";
import ColWithZoom from "../../../common/components/ColWithZoom";

class SubmitConfirmation extends Component {
  render() {
    const { isVisible, onClose, finishTest, t } = this.props;
    return (
      <ModalConfirmation
        open={isVisible}
        onClose={onClose}
        showCloseIcon={false}
        styles={{
          modal: {
            maxWidth: "640px",
            borderRadius: 5,
            textAlign: "center",
            padding: "20px 30px"
          }
        }}
        center
      >
        <ModalContainer>
          <Title>{t("exitConfirmation.title")}</Title>
          <TitleDescription>{t("exitConfirmation.body")}</TitleDescription>
          <ButtonContainer>
            <Row gutter={20} style={{ width: "100%" }}>
              <ColWithZoom md={12} sm={24} layout={{ xl: 24, lg: 24 }}>
                <StyledButton data-cy="cancel" btnType={1} onClick={onClose}>
                  {t("exitConfirmation.buttonCancel")}
                </StyledButton>
              </ColWithZoom>
              <ColWithZoom md={12} sm={24} layout={{ xl: 24, lg: 24 }}>
                <StyledButton data-cy="proceed" type="primary" btnType={2} onClick={finishTest}>
                  {t("exitConfirmation.buttonProceed")}
                </StyledButton>
              </ColWithZoom>
            </Row>
          </ButtonContainer>
        </ModalContainer>
      </ModalConfirmation>
    );
  }
}

SubmitConfirmation.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  finishTest: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("common")(SubmitConfirmation);

const ModalConfirmation = styled(Modal)`
  border-radius: 5;
  @media screen and (min-width: 768px) {
    min-width: 630px;
  }
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0px 25px 0px;
`;

const Title = styled.div`
  font-size: ${props => props.theme.confirmationPopupTitleTextSize};
  font-weight: bold;
  color: ${secondaryTextColor};
`;

const TitleDescription = styled.div`
  font-size: ${props => props.theme.confirmationPopupButtonTextSize};
  font-weight: 600;
  margin-top: 12px;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 80%;
  margin-top: 60px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  min-height: 40px;
  height: auto;
  background: ${props =>
    props.btnType === 1
      ? props.theme.confirmationPopupButtonTextHoverColor
      : props.theme.confirmationPopupButtonBgColor};
  border-color: ${props => props.theme.confirmationPopupButtonBgColor};
  &:hover,
  &:focus {
    background: ${props =>
      props.btnType === 1
        ? props.theme.confirmationPopupButtonTextHoverColor
        : props.theme.confirmationPopupButtonBgColor};
    border-color: ${props => props.theme.confirmationPopupButtonBgColor};
  }
  span {
    text-transform: uppercase;
    font-size: ${props => props.theme.confirmationPopupButtonTextSize};
    font-weight: 600;
    color: ${props =>
      props.btnType === 1
        ? props.theme.confirmationPopupButtonTextColor
        : props.theme.confirmationPopupButtonTextHoverColor};
  }
  @media screen and (max-width: 767px) {
    margin-top: 10px;
  }
`;
