import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Modal } from "antd";

import { getCreateItemModalItemIdSelector } from "../../../src/selectors/testItem";
import { toggleCreateItemModalAction } from "../../../src/actions/testItem";
import ItemDetail from "../../../ItemDetail";
import PickUpQuestionType from "../../../PickUpQuestionType";
import QuestionEditor from "../../../QuestionEditor";
import { saveQuestionAction } from "../../../QuestionEditor/ducks";
import { FullScreenModal, ModalWrapper } from "./styled";

const ConnectedItemDetail = withRouter(ItemDetail);
const ConnectedPickUpQuestionType = withRouter(PickUpQuestionType);
const ConnectedQuestionEditor = withRouter(QuestionEditor);

const toggleBodyScroll = scrollable => {
  document.body.style.overflow = scrollable ? "unset" : "hidden";
};

const createTestItemModalTabs = {
  ITEM_DETAIL: "item_detail",
  PICKUP_QUESTION_TYPE: "pickup_question_type",
  QUESTION_EDIT: "question_edit"
};

const ModalCreateTestItem = ({
  itemId,
  toggleCreateItemModal,
  createType = "Duplicate",
  saveQuestion,
  setAuthoredByMeFilter
}) => {
  const [currentTab, setCurrentTab] = useState(
    createType === "Duplicate" ? createTestItemModalTabs.ITEM_DETAIL : createTestItemModalTabs.PICKUP_QUESTION_TYPE
  );

  const makeNavigateToTab = tab => event => {
    if (event) {
      event.preventDefault();
    }

    setCurrentTab(tab);
  };

  const navigateToItemDetail = makeNavigateToTab(createTestItemModalTabs.ITEM_DETAIL);
  const navigateToPickupQuestionType = makeNavigateToTab(createTestItemModalTabs.PICKUP_QUESTION_TYPE);
  const navigateToQuestionEdit = makeNavigateToTab(createTestItemModalTabs.QUESTION_EDIT);

  // prevent body scrolling when item detail modal is visible
  useEffect(() => {
    toggleBodyScroll(false);

    return () => {
      toggleBodyScroll(true);
    };
  });

  const handleCloseModal = () => {
    toggleCreateItemModal(false);
  };

  const handleToggleConfirmModal = () => {
    Modal.confirm({
      title: "Do you want to save the created test item?",
      onOk() {
        saveQuestion(itemId);
        handleCloseModal();
      },
      onCancel() {
        handleCloseModal();
      },
      okText: "Save",
      cancelText: "Cancel",
      zIndex: 10002
    });
  };

  const renderContent = () => {
    const tabProps = {
      onModalClose: handleToggleConfirmModal,
      modalItemId: itemId,
      navigateToItemDetail,
      navigateToPickupQuestionType,
      navigateToQuestionEdit
    };

    switch (currentTab) {
      case createTestItemModalTabs.ITEM_DETAIL:
        return (
          <ConnectedItemDetail
            {...tabProps}
            itemId={itemId}
            createType={createType}
            onCompleteItemCreation={handleCloseModal}
            setAuthoredByMeFilter={setAuthoredByMeFilter}
            redirectOnEmptyItem={false}
          />
        );
      case createTestItemModalTabs.PICKUP_QUESTION_TYPE:
        return <ConnectedPickUpQuestionType {...tabProps} />;
      case createTestItemModalTabs.QUESTION_EDIT:
        return (
          <ConnectedQuestionEditor
            {...tabProps}
            onCompleteItemCreation={handleCloseModal}
            setAuthoredByMeFilter={setAuthoredByMeFilter}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FullScreenModal>
      <ModalWrapper>{renderContent()}</ModalWrapper>
    </FullScreenModal>
  );
};

ModalCreateTestItem.propTypes = {
  itemId: PropTypes.string,
  toggleCreateItemModal: PropTypes.func.isRequired,
  saveQuestion: PropTypes.func.isRequired
};

ModalCreateTestItem.defaultProps = {
  itemId: undefined
};

const enhance = connect(
  state => ({
    itemId: getCreateItemModalItemIdSelector(state)
  }),
  {
    toggleCreateItemModal: toggleCreateItemModalAction,
    saveQuestion: saveQuestionAction
  }
);

export default enhance(ModalCreateTestItem);
