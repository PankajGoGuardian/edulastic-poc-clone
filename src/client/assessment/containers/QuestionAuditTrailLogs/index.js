import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";
import connect from "react-redux/es/connect/connect";
import { ThemeProvider } from "styled-components";
import { themes } from "../../../theme";
import { get } from "lodash";
import AuditList from "./AuditList";
import PreviewModal from "../../../author/src/components/common/PreviewModal";
import { fetchQuestionPreviewAttachmentsAction } from "../../../author/ItemDetail/ducks";
import { setScratchpadDataAction } from "../../../author/src/components/common/PreviewModal/previewAttachment.ducks";

import { Container, StyledLayout, SpinContainer, StyledSpin, StyledPreviewModal } from "./styled";

const QuestionAuditTrailLogs = ({
  isLoading,
  auditTrails,
  fetchQuestionPreviewAttachments,
  item,
  setScratchpadData
}) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    fetchQuestionPreviewAttachments({
      type: "scratchpad",
      referrerType: "TestItemContent",
      referrerId: item._id
    });
  }, []);

  const handleShowNotes = id => {
    const scratchpad = auditTrails.attachments.find(a => a._id === id);
    setScratchpadData({
      [item._id]: { scratchpad: scratchpad?.data?.scratchpad }
    });
    setShowPreviewModal(true);
  };

  const closeModal = () => setShowPreviewModal(false);

  return (
    <ThemeProvider theme={themes.default}>
      <StyledLayout loading={isLoading ? "true" : "false"}>
        <Container>
          {isLoading && (
            <SpinContainer>
              <StyledSpin size="large" />
            </SpinContainer>
          )}
          <AuditList auditTrails={auditTrails} handleShowNotes={handleShowNotes} />
          {showPreviewModal && (
            <StyledPreviewModal
              isVisible={showPreviewModal}
              page="itemList"
              showAddPassageItemToTestButton={false}
              showEvaluationButtons={false}
              onClose={closeModal}
              data={{ ...item, id: item._id }}
              isEditable={false}
              testId={""}
              isTest={false}
              gotoSummary={() => {}}
              hideButtons
              onlySratchpad
            />
          )}
        </Container>
      </StyledLayout>
    </ThemeProvider>
  );
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      isLoading: get(state, "itemDetail.loadingAuditLogs", false),
      auditTrails: get(state, "itemDetail.previewData", []),
      item: get(state, "itemDetail.item", {})
    }),
    {
      fetchQuestionPreviewAttachments: fetchQuestionPreviewAttachmentsAction,
      setScratchpadData: setScratchpadDataAction
    }
  )
);

export default enhance(QuestionAuditTrailLogs);
