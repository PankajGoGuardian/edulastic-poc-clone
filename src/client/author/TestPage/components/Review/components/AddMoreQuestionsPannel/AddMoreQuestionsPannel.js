import { EduButton, FlexContainer, notification } from '@edulastic/common'
import { IconFolderWithLines, IconPlusCircle } from '@edulastic/icons'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { themeColor } from '@edulastic/colors'
import { Tooltip } from 'antd'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import SelectGroupModal from '../../../AddItems/SelectGroupModal'
import { createTestItemAction } from '../../../../../src/actions/testItem'
import { clearDictAlignmentAction } from '../../../../../src/actions/dictionaries'
import {
  getCurrentGroupIndexSelector,
  hasSectionsSelector,
  isDynamicTestSelector,
  setCurrentGroupIndexAction,
} from '../../../../ducks'
import { AddMoreQuestionsPannelTitle, ButtonTextWrapper } from './styled'
import ConfirmTabChange from '../../../Container/ConfirmTabChange'
import { hasUnsavedAiItems } from '../../../../../../assessment/utils/helpers'

const ButtonWrapper = ({ showHowerText, children, title }) => {
  return showHowerText ? (
    <Tooltip title={title || 'Edit test to add new item'} placement="top">
      <span>{children}</span>
    </Tooltip>
  ) : (
    <>{children}</>
  )
}

const AddMoreQuestionsPannel = ({
  onSaveTestId,
  createTestItem,
  test,
  clearDictAlignment,
  handleSave,
  updated,
  hasSections,
  showSelectGroupIndexModal,
  currentGroupIndexValueFromStore,
  handleNavChangeToAddItems,
  setCurrentGroupIndex,
  isEditable,
  isDynamicTest,
  t,
}) => {
  const [showSelectGroupModal, setShowSelectGroupModal] = useState(false)
  const [
    showConfirmationOnTabChange,
    setShowConfirmationOnTabChange,
  ] = useState(false)

  // A copy of this functions exists at src/client/author/TestPage/components/AddItems/AddItems.js
  // If you make any changes here please do so for the above mentioned copy as well
  const handleCreateTestItem = (_test) => {
    const { _id: testId, title } = _test
    const defaultWidgets = {
      rows: [
        {
          tabs: [],
          dimension: '100%',
          widgets: [],
          flowLayout: false,
          content: '',
        },
      ],
    }
    clearDictAlignment()
    onSaveTestId()
    createTestItem(defaultWidgets, true, testId, false, title)
  }

  // A copy of this functions exists at src/client/author/TestPage/components/AddItems/AddItems.js
  // If you make any changes here please do so for the above mentioned copy as well
  const handleSelectGroupModalResponse = (index) => {
    if (index || index === 0) {
      handleSave(undefined, undefined, (_test) => {
        setCurrentGroupIndex(index)
        handleCreateTestItem(_test)
      })
    }
    setShowSelectGroupModal(false)
  }

  // A copy of this functions exists at src/client/author/TestPage/components/AddItems/AddItems.js
  // If you make any changes here please do so for the above mentioned copy as well
  const handleCreateNewItem = (checkAiItems = true) => {
    const { title, itemGroups } = test
    const _hasUnsavedAiItems = hasUnsavedAiItems(itemGroups)
    if (checkAiItems && _hasUnsavedAiItems) {
      setShowConfirmationOnTabChange(true)
      return
    }

    if (!title) {
      notification({ messageKey: 'nameShouldNotEmpty' })
    }

    /* 
		  On create of new item, trigger the save test when:-
			- the test is not having any sections and is updated or
			- the test is having one section or
      - test has unsaved ai changes and not allowed to show the banner for checking ai items
			- If the test is having multiple sections, then the save test is called 
			  after the user selects a particular section from modal
		*/
    if (!hasSections || itemGroups.length === 1) {
      // check if update is needed
      if (hasSections || updated || (!checkAiItems && _hasUnsavedAiItems)) {
        handleSave(undefined, undefined, handleCreateTestItem)
      } else {
        handleCreateTestItem(test)
      }
    }

    /**
     * For sections test the select group index modal should only be shown if group index is not known.
     * When click on select items in a section the group index is known and select group index
     * modal need not be shown once again.
     * showSelectGroupIndexModal - this value is always "true" for all other tests except sections test
     */
    if (
      itemGroups.length > 1 &&
      !showSelectGroupIndexModal &&
      typeof currentGroupIndexValueFromStore === 'number'
    ) {
      handleSelectGroupModalResponse(currentGroupIndexValueFromStore)
      return
    }
    if (itemGroups.length > 1) {
      setShowSelectGroupModal(true)
    }
  }

  const confirmChangeNav = (confirm) => () => {
    if (confirm) {
      handleCreateNewItem(false)
    }
    setShowConfirmationOnTabChange(false)
  }

  return (
    <>
      <FlexContainer
        flexDirection="row"
        justifyContent="center"
        id="pageBottom"
      >
        <AddMoreQuestionsPannelTitle>
          Add more items
        </AddMoreQuestionsPannelTitle>
      </FlexContainer>
      <FlexContainer flexDirection="row" justifyContent="center">
        <ButtonWrapper showHowerText={!isEditable}>
          <EduButton
            height="36px"
            isGhost
            data-cy="createFromLibrary"
            onClick={handleNavChangeToAddItems}
            disabled={!isEditable}
          >
            <IconFolderWithLines color={themeColor} width={16} height={16} />
            <ButtonTextWrapper>ADD FROM LIBRARY</ButtonTextWrapper>
          </EduButton>
        </ButtonWrapper>
        <ButtonWrapper
          showHowerText={!isEditable || isDynamicTest}
          title={isDynamicTest ? t('authoringItemDisabled.info') : ''}
        >
          <EduButton
            height="36px"
            isGhost
            data-cy="createNewItem"
            onClick={handleCreateNewItem}
            disabled={!isEditable || isDynamicTest}
          >
            <IconPlusCircle color={themeColor} width={16} height={16} />
            <ButtonTextWrapper>CREATE NEW ITEM</ButtonTextWrapper>
          </EduButton>
        </ButtonWrapper>
        {showSelectGroupModal && (
          <SelectGroupModal
            visible={showSelectGroupModal}
            test={test}
            handleResponse={handleSelectGroupModalResponse}
          />
        )}
        <ConfirmTabChange
          confirmChangeNav={confirmChangeNav}
          showConfirmationOnTabChange={showConfirmationOnTabChange}
        />
      </FlexContainer>
    </>
  )
}

AddMoreQuestionsPannel.propTypes = {
  onSaveTestId: PropTypes.func,
  test: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  updated: PropTypes.bool.isRequired,
  showSelectGroupIndexModal: PropTypes.bool.isRequired,
  handleNavChangeToAddItems: PropTypes.func.isRequired,
  isEditable: PropTypes.bool.isRequired,
}

AddMoreQuestionsPannel.defaultProps = {
  onSaveTestId: () => {},
}

const enhance = compose(
  withNamespaces('author'),
  connect(
    (state) => ({
      hasSections: hasSectionsSelector(state),
      currentGroupIndexValueFromStore: getCurrentGroupIndexSelector(state),
      isDynamicTest: isDynamicTestSelector(state),
    }),
    {
      createTestItem: createTestItemAction,
      clearDictAlignment: clearDictAlignmentAction,
      setCurrentGroupIndex: setCurrentGroupIndexAction,
    }
  )
)

export default enhance(AddMoreQuestionsPannel)
