import React from "react";
import PropTypes from "prop-types";
import Modal from "react-responsive-modal";
import styled from "styled-components";
import { white, desktopWidth, titleColor } from "@edulastic/colors";
import { EduButton, FlexContainer } from "@edulastic/common";

const getCharsToDisplay = (name = "") => {
  const text = name.split(" ");
  if (text.length > 1) return `${text[0][0]}${text[1][0]}`;
  return `${text[0][0]}${text[0][1]}`;
};

const OverallFeedbackModal = ({
  isVisible = false,
  closeCallback = () => {},
  testTitle = "",
  feedbackText = "",
  url = "",
  authorName = ""
}) => (
  <Modal
    open={isVisible}
    onClose={closeCallback}
    footer={null}
    styles={{
      modal: {
        width: "760px",
        padding: "20px 40px",
        background: white
      },
      closeIcon: {
        cursor: "pointer",
        width: "34px",
        height: "34px",
        marginRight: "20px",
        marginTop: "5px"
      }
    }}
  >
    <ModalHeader>assignment feedback</ModalHeader>

    <ModalContent>
      <FlexContainer alignItems="flex-start">
        {url ? <TeacherProfilePic url={url} /> : <TeacherProfilePic>{getCharsToDisplay(authorName)}</TeacherProfilePic>}

        <FlexContainer width="500px" marginLeft="40px" flexDirection="column" alignItems="flext-start">
          <Title>{testTitle}</Title>
          <br />
          <Feedback>{feedbackText}</Feedback>
        </FlexContainer>
      </FlexContainer>
    </ModalContent>

    <ModalFooter>
      <EduButton width="180px" key="close" onClick={closeCallback}>
        close
      </EduButton>
    </ModalFooter>
  </Modal>
);

OverallFeedbackModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  closeCallback: PropTypes.func.isRequired,
  testTitle: PropTypes.string.isRequired,
  feedbackText: PropTypes.string.isRequired,
  url: PropTypes.string,
  assignedBy: PropTypes.string.isRequired
};

export default OverallFeedbackModal;

const ModalHeader = styled.h3`
  width: 680px;
  font-size: 22px;
  font-weight: 600;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-transform: capitalize;
  user-select: none;
`;

const ModalContent = styled.div`
  background: ${white};
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 15px 0px 20px 0px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  user-select: none;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
  width: 420px;
  padding: 10px 20px 10px 0;
  .ant-btn {
    font-size: 10px;
    font-weight: 600;
    min-width: 100px;
    padding-left: 20px;
    padding-right: 20px;
    @media only screen and (max-width: ${desktopWidth}) {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
`;

const Title = styled.div`
  margin: 4px 2px;
  color: ${titleColor};
  font-weight: 600;
  font-size: 14px;
`;

const Feedback = styled.p`
  font-weight: normal;
  font-size: 14px;
`;

const TeacherProfilePic = styled.div`
  width: 120px;
  height: 120px;
  background: #dddddd;
  background-image: url(${({ url }) => url});
  border-radius: 100px;
  margin: 4px;
  text-transform: uppercase;
  font-size: 50px;
  line-height: 120px;
  text-align: center;
  font-weight: 600;
`;
