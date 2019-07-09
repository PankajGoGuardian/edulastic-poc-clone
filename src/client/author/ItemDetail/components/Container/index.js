import React, { useState, useEffect } from "react";
import { compose } from "redux";
import { Spin } from "antd";
import { connect } from "react-redux";
import { get } from "lodash";
import { withRouter } from "react-router-dom";
import MultipleQuestionView from "./Container";
import QuestionView from "../../../QuestionEditor";
import {
  isSingleQuestionViewSelector,
  getItemDetailByIdAction,
  getItemDetailLoadingSelector,
  getItemDetailSelector,
  setRedirectTestAction,
  updateItemDetailByIdAction,
  publishTestItemAction,
  getTestItemStatusSelector,
  clearItemDetailAction
} from "../../ducks";
import { getCurrentQuestionIdSelector } from "../../../sharedDucks/questions";
import SettingsBar from "../SettingsBar";

const ItemDetailContainer = ({
  isSingleQuestionView = false,
  firstQuestion = null,
  setRedirectTest,
  match,
  isLoading = false,
  getItem,
  item,
  updateItem,
  publishTestItem,
  testItemStatus,
  isTestFlow,
  currentUserId,
  clearItem,
  currentQuestionId,
  ...props
}) => {
  const { modalItemId } = props;
  const { id, testId } = match.params;
  // TODO: make it friggin editable or something. Feature is not done yet!
  const [isEditable, setEditable] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMultipart, setMultipart] = useState(false);

  const itemId = id || modalItemId || match.param.itemId;

  useEffect(() => {
    if (testId) {
      setRedirectTestAction(testId);
    }
    getItem(itemId, { data: true, validation: true });
  }, [itemId]);

  const saveItem = () => {
    updateItem(itemId, item, testId, isTestFlow);
  };

  const publishItem = () => {
    publishTestItem(itemId);
    setEditable(false);
  };

  // item is not yet loaded.
  // the store could have values from previous load, in that case
  // makes sure its the one we intend to load. also, if its the same question loaded,
  // makes sure currentQuestionId is there in case of singleQuestionview
  if (isLoading || item._id !== itemId || (isSingleQuestionView && !currentQuestionId))
    return (
      <div>
        <Spin />
      </div>
    );

  const showPublishButton = (!isTestFlow && (itemId && testItemStatus && testItemStatus !== "published")) || isEditable;
  const hasAuthorPermissions = item && item.authors.some(author => author._id === currentUserId);

  const allProps = {
    ...props,
    publishTestItem: publishItem,
    saveItem,
    isEditable,
    setEditable,
    isTestFlow,
    showPublishButton,
    hasAuthorPermissions,
    setShowSettings,
    item,
    setMultipart,
    isMultipart
  };

  return (
    <>
      {showSettings && (
        // TODO: combine this with the other settings bar in itemDetail page. or seprate it
        // and have it in side questionView maybe !? !!Food for thought.
        <SettingsBar
          isSingleQuestion={isSingleQuestionView}
          isMultipart={isMultipart}
          onCancel={() => setShowSettings(false)}
          setMultipart={setMultipart}
        />
      )}
      {isSingleQuestionView && !isMultipart ? (
        <QuestionView isItem {...allProps} />
      ) : (
        <MultipleQuestionView {...allProps} />
      )}
      }{" "}
    </>
  );
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      item: getItemDetailSelector(state),
      testItemStatus: getTestItemStatusSelector(state),
      isSingleQuestionView: isSingleQuestionViewSelector(state),
      isLoading: getItemDetailLoadingSelector(state),
      currentUserId: get(state, ["user", "user", "_id"]),
      currentQuestionId: getCurrentQuestionIdSelector(state)
    }),
    {
      getItem: getItemDetailByIdAction,
      setRedirectTest: setRedirectTestAction,
      updateItem: updateItemDetailByIdAction,
      publishTestItem: publishTestItemAction,
      clearItem: clearItemDetailAction
    }
  )
);

export default enhance(ItemDetailContainer);
