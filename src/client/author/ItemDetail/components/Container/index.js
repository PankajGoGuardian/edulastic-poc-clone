/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { Spin } from 'antd'
import { connect } from 'react-redux'
import { get, isEmpty, debounce } from 'lodash'
import { withRouter } from 'react-router-dom'
import MultipleQuestionView from './Container'
import QuestionView from '../../../QuestionEditor'
import {
  isSingleQuestionViewSelector,
  getItemDetailByIdAction,
  getItemDetailLoadingSelector,
  getItemDetailSelector,
  setRedirectTestAction,
  updateItemDetailByIdAction,
  publishTestItemAction,
  getTestItemStatusSelector,
  clearItemDetailAction,
  proceedPublishingItemAction,
  saveCurrentTestItemAction,
  setTestItemScoreUpdatedAction,
} from '../../ducks'
import WarningModal from '../WarningModal'
import { getCurrentQuestionIdSelector } from '../../../sharedDucks/questions'
import SettingsBar from '../SettingsBar'
import { getUserFeatures } from '../../../src/selectors/user'

const ItemDetailContainer = ({
  isSingleQuestionView = false,
  setRedirectTest,
  match,
  isLoading = false,
  getItem,
  item = {},
  history,
  updateItem,
  publishTestItem,
  testItemStatus,
  isTestFlow,
  currentUserId,
  clearItem,
  currentQuestionId,
  showWarningModal,
  saveTestItem,
  proceedPublish,
  userFeatures,
  location,
  setTestItemScoreUpdated,
  ...props
}) => {
  const { modalItemId } = props
  const { id, testId } = match.params
  // TODO: make it friggin editable or something. Feature is not done yet!
  const [isEditable, setEditable] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [isMultipart, setMultipart] = useState(false)

  const itemId = id || modalItemId || match.params.itemId

  useEffect(() => {
    if (testId) {
      setRedirectTestAction(testId)
    }
    if (itemId && itemId !== 'new') {
      const hasValidTestId = testId && testId !== 'undefined'
      getItem(itemId, {
        data: true,
        validation: true,
        ...(hasValidTestId && { testId }),
      })
    }
    const { path = '' } = match
    if (testId && itemId && path.includes('/author/tests')) {
      setTestItemScoreUpdated({
        currentTestItemId: itemId,
        isUpdated: false,
      })
    }
  }, [itemId])

  const saveItem = debounce((shouldRedirectOnPassageRemove = true) => {
    /**
     * using same data while deleting questions
     * src/client/author/ItemDetail/components/Container/Container.js
     */
    updateItem(
      itemId,
      item,
      testId,
      isTestFlow,
      location.state,
      true,
      shouldRedirectOnPassageRemove
    )
  }, 1000)

  const publishItem = () => {
    const status = userFeatures.isPublisherAuthor ? 'inreview' : 'published'
    const obj = {
      isCurator: userFeatures.isCurator,
      isPublisherAuthor: userFeatures.isPublisherAuthor,
      itemId,
      status,
      locationState: { ...location.state },
    }
    publishTestItem(obj)
    setEditable(false)
  }

  if (isEmpty(item) && itemId === 'new') history.push('/author/items')

  // item is not yet loaded.
  // the store could have values from previous load, in that case
  // makes sure its the one we intend to load. also, if its the same question loaded,
  // makes sure currentQuestionId is there in case of singleQuestionview
  if (isLoading || item._id !== itemId)
    return (
      <div>
        <Spin />
      </div>
    )

  const showPublishButton =
    (!isTestFlow &&
      itemId &&
      testItemStatus &&
      testItemStatus !== 'published') ||
    isEditable
  const hasAuthorPermissions =
    item &&
    item.authors &&
    item.authors.some((author) => author._id === currentUserId)

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
    isMultipart,
  }

  return (
    <>
      <WarningModal
        visible={showWarningModal}
        proceedPublish={proceedPublish}
      />
      {showSettings && (
        // TODO: combine this with the other settings bar in itemDetail page. or seprate it
        // and have it in side questionView maybe !? !!Food for thought.
        <SettingsBar
          isSingleQuestion={isSingleQuestionView}
          isMultipart={isMultipart}
          onCancel={() => setShowSettings(false)}
          setMultipart={setMultipart}
          saveTestItem={saveTestItem}
        />
      )}

      {isSingleQuestionView && !item.multipartItem && !isMultipart ? (
        <QuestionView isItem {...allProps} />
      ) : (
        <MultipleQuestionView {...allProps} />
      )}
    </>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      item: getItemDetailSelector(state),
      testItemStatus: getTestItemStatusSelector(state),
      isSingleQuestionView: isSingleQuestionViewSelector(state),
      isLoading: getItemDetailLoadingSelector(state),
      currentUserId: get(state, ['user', 'user', '_id']),
      currentQuestionId: getCurrentQuestionIdSelector(state),
      showWarningModal: get(state, ['itemDetail', 'showWarningModal'], false),
      userFeatures: getUserFeatures(state),
    }),
    {
      getItem: getItemDetailByIdAction,
      setRedirectTest: setRedirectTestAction,
      updateItem: updateItemDetailByIdAction,
      publishTestItem: publishTestItemAction,
      clearItem: clearItemDetailAction,
      proceedPublish: proceedPublishingItemAction,
      saveTestItem: saveCurrentTestItemAction,
      setTestItemScoreUpdated: setTestItemScoreUpdatedAction,
    }
  )
)

export default enhance(ItemDetailContainer)
