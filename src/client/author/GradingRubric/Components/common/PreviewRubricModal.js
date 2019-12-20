import React, { useState, useMemo } from "react";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";
import { ModalBody, Heading } from "./ConfirmModal";
import styled from "styled-components";
import PreviewRubricTable from "./PreviewRubricTable";
import { white, title, themeColorLighter } from "@edulastic/colors";
import { sumBy, maxBy } from "lodash";
import { message } from "antd";

const PreviewRubricModal = ({
  visible,
  toggleModal,
  currentRubricData,
  maxScore,
  rubricFeedback,
  shouldValidate = true
}) => {
  const [obtained, setObtained] = useState(0);
  const [rubricResponse, setRubricResponse] = useState({});
  const [validateRubricResponse, setValidateRubricResponse] = useState(false);

  let localMaxScore = 0;

  if (!maxScore)
    localMaxScore = useMemo(() => sumBy(currentRubricData.criteria, c => maxBy(c.ratings, "points").points), [
      currentRubricData.criteria
    ]);
  const Title = [
    <HeaderWrapper>
      <span>{currentRubricData.name}</span>
      <span>
        <span>{obtained}</span>&nbsp;<span>/</span>&nbsp;<span>{maxScore || localMaxScore}</span>
      </span>
    </HeaderWrapper>
  ];

  const handleChange = response => {
    setObtained(response.score);
    setRubricResponse(response);
    setValidateRubricResponse(false);
  };

  const handleCloseRubric = () => {
    const rubricFeedbackLength = Object.keys(rubricResponse.rubricFeedback || {}).length;
    if (rubricFeedbackLength === 0 || !shouldValidate) {
      setValidateRubricResponse(false);
      toggleModal(null);
    } else if (rubricFeedbackLength === currentRubricData.criteria.length) {
      setValidateRubricResponse(false);
      toggleModal(rubricResponse);
    } else {
      message.error("Please select a rating from each criteria.");
      setValidateRubricResponse(true);
    }
  };

  return (
    <StyledModal
      title={Title}
      centered
      textAlign="left"
      visible={visible}
      footer={null}
      onCancel={() => handleCloseRubric()}
      width={"700px"}
    >
      <StyledModalBody>
        <PreviewRubricTable
          data={currentRubricData}
          handleChange={handleChange}
          rubricFeedback={rubricFeedback}
          validateRubricResponse={validateRubricResponse}
        />
      </StyledModalBody>
    </StyledModal>
  );
};

export default PreviewRubricModal;

const StyledModal = styled(ConfirmationModal)`
  max-width: 80%;
  .ant-modal-content {
    background: ${white};
    .ant-modal-close-x {
      height: 60px;
      line-height: 60px;
      .ant-modal-close-icon {
        vertical-align: middle;
      }
    }
    .ant-modal-header {
      background: ${white};
      margin-left: 16px;
      margin-right: 25px;
    }
    .ant-modal-body {
      padding: 0px;
      box-shadow: none;
    }
  }
`;

const StyledModalBody = styled(ModalBody)`
  align-items: start;
`;

const HeaderWrapper = styled.div`
  > span:first-child {
    color: ${title};
    font-size: 25px;
    font-weight: ${props => props.theme.bold};
  }

  > span:last-child {
    font-size: 35px;
    float: right;
    font-weight: 100;

    > span:first-child {
      color: ${themeColorLighter};
      font-weight: ${props => props.theme.bold};
    }

    > span:last-child {
      color: ${title};
      font-weight: ${props => props.theme.bold};
    }
  }
`;
