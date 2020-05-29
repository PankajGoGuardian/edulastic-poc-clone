import { useState } from "react";
import { StyledPurchaseLicenseModal, Title } from "./styled";
import { Input, Radio, message } from "antd";
import { FlexContainer,notification } from "@edulastic/common";
import { greyishBorder, lightGreySecondary } from "@edulastic/colors";
import { ThemeButton } from "../styled/commonStyled";

const getFooterComponent = ({ hideModal, nextAction }) => (
  <FlexContainer width="450px">
    <ThemeButton onClick={hideModal}>CANCEL</ThemeButton>
    <ThemeButton onClick={nextAction} inverse>
      NEXT
    </ThemeButton>
  </FlexContainer>
);

const PurchaseLicenseModal = props => {
  const { visible = false, closeModal, openPaymentServiceModal } = props;

  const [currentModalState, setCurrentModalState] = useState(1);
  const [radioValue, setRadioValue] = useState(null);
  const [licenseCount, setLicenseCount] = useState();
  const [email, setEmail] = useState();
  const [sharedLicenses, setSharedLicenses] = useState();
  const [inquiryTitle, setInquiryTitle] = useState();
  const [inquiryDescription, setInquiryDescription] = useState();

  const hideModal = () => {
    setRadioValue("");
    setLicenseCount("");
    setEmail("");
    setSharedLicenses("");
    setInquiryTitle("");
    setInquiryDescription("");
    closeModal();
    setCurrentModalState(1);
  };

  const isValidEmail = email => {
    const re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
  };

  const nextAction = () => {
    if (currentModalState === 1) {
      if (licenseCount) {
        if (!isNaN(licenseCount)) {
          if (email) {
            if (isValidEmail(email)) {
              // update store before proceeding
              setCurrentModalState(prev => prev + 1);
            } else notification({ type: "warn", messageKey:"enterValidEmail"});
          } else notification({ type: "warn", messageKey:"emailCantBeEmpty"});
        } else notification({ type: "warn", messageKey:"lisenceShouldBeNumericValue"});
      } else notification({ type: "warn", messageKey:"lisenceCountCantBeEmpty"});
      return; 
    }

    if (currentModalState === 2) {
      if (radioValue) {
        if (radioValue === 1) {
          // replace hideModal with closeModal and update store before proceeding
          hideModal();
          openPaymentServiceModal();
        } else {
          // update store before proceeding
          setCurrentModalState(prev => prev + 1);
        }
      } else notification({ type: "warn", messageKey:"pleaseChoosePurchaseOption"});
      return;
    }

    if (currentModalState === 3) {
      if (inquiryTitle) {
        if (inquiryDescription) {
          // update store before proceeding
        } else notification({ type: "warn", messageKey:"inquiryDescriptionFieldRequired"});
      } else notification({ type: "warn", messageKey:"inquirySubjectFieldRequired"});
      
    }
  };

  const handleModalAChange = (e, attr) => {
    if (attr === "licenseCount") {
      setLicenseCount(e.target.value);
    } else if (attr === "email") {
      setEmail(e.target.value);
    } else {
      setSharedLicenses(e.target.value);
    }
  };

  const handleModalBChange = (e, attr) => {
    if (attr === "title") {
      setInquiryTitle(e.target.value);
    } else {
      setInquiryDescription(e.target.value);
    }
  };

  const handleRadioChange = e => setRadioValue(e.target.value);

  return (
    <StyledPurchaseLicenseModal
      visible={visible}
      title={<h3 style={{ fontWeight: 700 }}>Purchase License</h3>}
      onCancel={hideModal}
      footer={[getFooterComponent({ hideModal, nextAction })]}
      centered
    >
      {currentModalState === 1 && (
        <>
          <p>
            Enter email address of the users who need to be upgraded to premium teacher. <br />
            The licenses key will be sent to individual users via email.
          </p>

          <br />
          <Title>License Count</Title>
          <Input
            placeholder="Enter the no. of license you want to purchase"
            style={{
              width: "65%",
              height: "40px",
              background: lightGreySecondary,
              border: `1px solid ${greyishBorder}`
            }}
            value={licenseCount}
            onChange={e => handleModalAChange(e, "licenseCount")}
          />

          <br />
          <br />

          <Title>Your email id</Title>
          <Input
            placeholder="Enter your email ID"
            style={{
              width: "65%",
              height: "40px",
              background: lightGreySecondary,
              border: `1px solid ${greyishBorder}`
            }}
            value={email}
            onChange={e => handleModalAChange(e, "email")}
          />

          <br />
          <br />

          <Title>share licenses Keys with</Title>
          <Input.TextArea
            placeholder={`Enter the comma separated email ids like...\nJohn.doe@yourschool.com,\njane.doe@yourschool.com, ...`}
            autoSize={false}
            style={{
              height: "155px",
              background: lightGreySecondary,
              border: `1px solid ${greyishBorder}`,
              resize: "none"
            }}
            value={sharedLicenses}
            onChange={e => handleModalAChange(e, "sharedLicenses")}
          />
        </>
      )}

      {currentModalState === 2 && (
        <>
          <p>Choose the purchase option</p> <br />
          <Radio.Group onChange={handleRadioChange} value={radioValue}>
            <Radio value={1}>Pay using Credit Card</Radio>
            <br />
            <br />
            <Radio value={2}>Raise a Purchase Order</Radio>
          </Radio.Group>
        </>
      )}

      {currentModalState === 3 && (
        <>
          <Input
            placeholder="Inquiry about Edulastic Premium"
            style={{
              height: "40px",
              background: lightGreySecondary,
              border: `1px solid ${greyishBorder}`
            }}
            value={inquiryTitle}
            onChange={e => handleModalBChange(e, "title")}
          />
          <br />
          <br />
          <Input.TextArea
            placeholder={`Hello,\nI'm interested in knowing more about the Premium Version of Edulastic.`}
            autoSize={false}
            style={{
              height: "155px",
              background: lightGreySecondary,
              border: `1px solid ${greyishBorder}`,
              resize: "none"
            }}
            value={inquiryDescription}
            onChange={e => handleModalBChange(e, "description")}
          />
        </>
      )}
    </StyledPurchaseLicenseModal>
  );
};

export default PurchaseLicenseModal;
