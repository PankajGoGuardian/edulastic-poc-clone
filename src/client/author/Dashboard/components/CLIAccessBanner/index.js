import React, { useState } from "react";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import CLILogo from "../../assets/svgs/cli-logo.svg";
import { BaseText, Button, EduLogo, HighlightedText, StyledLogo, StyledText } from "./styled";

const CLIAccessBanner = ({ visible = false, firstName = "", lastName = "", onClose }) => {
  const [bannerVisible, showBanner] = useState(visible);

  return (
    <Modal
      open={bannerVisible}
      onClose={() => {}}
      showCloseIcon={false}
      center
      styles={{
        overlay: {
          background: "#067059",
          zIndex: 1002
        },
        modal: {
          background: "linear-gradient(to top,rgb(155, 225, 93) , rgb(0, 179, 115))",
          width: "320px",
          minHeight: "385px",
          borderRadius: "none",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          boxShadow: "none",
          opacity: 1,
          padding: "40px 20px"
        }
      }}
    >
      <EduLogo />
      <StyledLogo src={CLILogo} />
      <StyledText margin="50px auto 20px auto">
        Welcome <HighlightedText>{`${firstName} ${lastName}`}!</HighlightedText>
      </StyledText>
      <StyledText fontSize="16px">
        You now have access to <br /> CLI collection.
      </StyledText>
      <Button
        onClick={() => {
          onClose();
        }}
      >
        Continue
      </Button>
      <BaseText>Edulastic @ 2018 - All rights reserved.</BaseText>
    </Modal>
  );
};

export default connect(state => ({
  firstName: state.user.user.firstName,
  lastName: state.user.user.lastName
}))(CLIAccessBanner);
