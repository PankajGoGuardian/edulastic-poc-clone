import { useState } from "react";
import { StyledHasLicenseKeyModal, Container } from "./styled";
import { Input, message } from "antd";
import { themeColor, greyishBorder, lightGreySecondary } from "@edulastic/colors";
import { FlexContainer } from "@edulastic/common";
import { ThemeButton } from "../styled/commonStyled";

const getFooterComponent = ({ hideModal, nextAction, isSubscribed, verificationPending }) =>
  !isSubscribed ? (
    <FlexContainer width="450px">
      <ThemeButton onClick={hideModal} disabled={verificationPending}>
        CANCEL
      </ThemeButton>
      <ThemeButton onClick={nextAction} disabled={verificationPending} inverse>
        NEXT
      </ThemeButton>
    </FlexContainer>
  ) : (
    <FlexContainer width="450px">
      <ThemeButton onClick={hideModal} inverse>
        DONE
      </ThemeButton>
    </FlexContainer>
  );

const HasLicenseKeyModal = props => {
  const {
    visible = false,
    closeModal,
    verifyAndUpgradeLicense,
    expDate,
    isSubscribed = false,
    verificationPending = false
  } = props;

  const [licenseKey, setLicenseKey] = useState();

  const hideModal = () => {
    setLicenseKey("");
    closeModal();
  };

  const handleChange = e => setLicenseKey(e.target.value);

  const nextAction = () => {
    if (licenseKey) verifyAndUpgradeLicense(licenseKey);
    else message.warning("Please enter your license key");
  };

  return (
    <StyledHasLicenseKeyModal
      visible={visible}
      title={<h3 style={{ fontWeight: 700, fontSize: "22px" }}>Upgrade to Premium</h3>}
      onCancel={hideModal}
      footer={[getFooterComponent({ hideModal, nextAction, isSubscribed, verificationPending })]}
      centered
    >
      {!isSubscribed && (
        <Container width="480">
          <p>
            Enter your License Key that you received at the end of the order process or via email in the box below, the
            click on "Next"
          </p>
          <br />
          <br />
          <Input
            placeholder="Enter your license key"
            style={{
              width: "85%",
              height: "50px",
              background: lightGreySecondary,
              border: `1px solid ${greyishBorder}`,
              margin: "auto"
            }}
            value={licenseKey}
            onChange={handleChange}
            disabled={verificationPending}
          />
        </Container>
      )}
      {isSubscribed && (
        <Container width="300">
          <h4 style={{ fontWeight: 700 }}>Congratulations!</h4>
          <p>Your account is upgraded to Premium version for a year and the subscription will expire on</p>
          <p style={{ color: themeColor, paddingTop: "8px", fontWeight: 600 }}>{expDate}</p>
          <br />
        </Container>
      )}
    </StyledHasLicenseKeyModal>
  );
};

export default HasLicenseKeyModal;
