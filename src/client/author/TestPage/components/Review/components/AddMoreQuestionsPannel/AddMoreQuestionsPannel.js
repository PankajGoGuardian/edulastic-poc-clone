import { EduButton, FlexContainer, notification } from '@edulastic/common'
import { IconFolderWithLines, IconPlusCircle } from '@edulastic/icons'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { themeColor } from '@edulastic/colors'
import { Tooltip } from 'antd'
import SelectGroupModal from '../../../AddItems/SelectGroupModal'
import { createTestItemAction } from '../../../../../src/actions/testItem'
import { clearDictAlignmentAction } from '../../../../../src/actions/dictionaries'
import {
  getCurrentGroupIndexSelector,
  hasSectionsSelector,
  setCurrentGroupIndexAction,
} from '../../../../ducks'
import { AddMoreQuestionsPannelTitle, ButtonTextWrapper } from './styled'

const ButtonWrapper = ({ showHowerText, children }) => {
  return showHowerText ? (
    <Tooltip title="Edit test to add new item" placement="top">
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
}) => {
  const [showSelectGroupModal, setShowSelectGroupModal] = useState(false)

  // A copy of this functions exists at src/client/author/TestPage/components/AddItems/AddItems.js
  // If you make any changes here please do so for the above mentioned copy as well
  const handleCreateTestItem = () => {
    const { _id: testId, title } = test
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
      handleSave()
      setCurrentGroupIndex(index)
      handleCreateTestItem()
    }
    setShowSelectGroupModal(false)
  }

  // A copy of this functions exists at src/client/author/TestPage/components/AddItems/AddItems.js
  // If you make any changes here please do so for the above mentioned copy as well
  const handleCreateNewItem = () => {
    const { _id: testId, title, itemGroups } = test

    if (!title) {
      notification({ messageKey: 'nameShouldNotEmpty' })
    }

    /* 
		  On create of new item, trigger the save test when:-
			- the test is not having any sections and is updated or
			- the test is having one section or
			- If the test is having multiple sections, then the save test is called 
			  after the user selects a particular section from modal
		*/
    if (
      ((!hasSections && updated) || (hasSections && itemGroups.length === 1)) &&
      testId
    ) {
      handleSave()
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
      return
    }
    handleCreateTestItem()
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
        <ButtonWrapper showHowerText={!isEditable}>
          <EduButton
            height="36px"
            isGhost
            data-cy="createNewItem"
            onClick={handleCreateNewItem}
            disabled={!isEditable}
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

const enhance = connect(
  (state) => ({
    hasSections: hasSectionsSelector(state),
    currentGroupIndexValueFromStore: getCurrentGroupIndexSelector(state),
  }),
  {
    createTestItem: createTestItemAction,
    clearDictAlignment: clearDictAlignmentAction,
    setCurrentGroupIndex: setCurrentGroupIndexAction,
  }
)

export default enhance(AddMoreQuestionsPannel)
