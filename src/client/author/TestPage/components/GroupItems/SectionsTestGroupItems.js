import { EduButton, notification } from '@edulastic/common'
import { IconPencilEdit } from '@edulastic/icons'
import { lightRed2 } from '@edulastic/colors'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Collapse, Tooltip } from 'antd'
import { maxBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { test as testConstants } from '@edulastic/constants'
import Breadcrumb from '../../../src/components/Breadcrumb'
import {
  addNewGroupAction,
  createNewStaticGroup,
  deleteItemsGroupAction,
  getTestEntitySelector,
  hasSectionsSelector,
  updateGroupDataAction,
  setTestDataAction,
} from '../../ducks'
import { removeTestItemsAction } from '../AddItems/ducks'
import {
  BreadcrumbContainer,
  Container,
  ContentBody,
  SectionsTestCreateGroupWrapper,
  GroupField,
  ItemTag,
  Label,
  PanelHeading,
  QuestionTagsContainer,
  QuestionTagsWrapper,
  PanelStyled,
  SectionNameInput,
} from './styled'
import TypeConfirmModal from './TypeConfirmModal'

const { sectionTestActions } = testConstants

const SectionsTestGroupItems = ({
  match,
  updateGroupData,
  addNewGroup,
  removeTestItems,
  deleteItemsGroup,
  test,
  history,
  currentGroupIndex,
  setCurrentGroupIndex,
  groupNotEdited,
  setGroupNotEdited,
  setTestData,
  setSectionsState,
  testId,
  gotoAddItems,
  handleSaveTest,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmModalCategory, setConfirmModalCategory] = useState(null)
  const [deleteGroupIndex, setDeleteGroupIndex] = useState(null)
  const [activePanels, setActivePanels] = useState([])

  const breadcrumbData = [
    {
      title: 'TESTS',
      to: '/author/tests',
    },
    {
      title: 'MANAGE SECTIONS',
      to: '',
    },
  ]

  useEffect(() => {
    setActivePanels(test.itemGroups.map((_, i) => (i + 1).toString()))
  }, [test])

  const handleSelectItems = () => {
    const currentGroupDetails = test.itemGroups[currentGroupIndex]
    const groupNamesFromTest = new Set(
      test.itemGroups.map((g) => `${g.groupName || ''}`.toLowerCase())
    )
    if (!currentGroupDetails.groupName?.length) {
      notification({ messageKey: 'pleaseEnterGroupName' })
      return
    }
    if (groupNamesFromTest.size !== test.itemGroups.length) {
      notification({ messageKey: 'eachGroupShouldHaveUniqueGroupName' })
      return false
    }
    // update the itemGroup corresponding to the current group being edited
    setCurrentGroupIndex(currentGroupIndex, true)
    updateGroupData({
      updatedGroupData: currentGroupDetails,
      groupIndex: currentGroupIndex,
    })
    // switch to "Add Items" section
    const addItemsUrl = match.params?.id
      ? `/author/tests/tab/addItems/id/${match.params.id}`
      : '/author/tests/create/addItems'
    history.push(addItemsUrl)
  }

  const handleChange = (fieldName, value) => {
    const oldGroupData = test.itemGroups[currentGroupIndex]
    let updatedGroupData = { ...oldGroupData }
    // set groupNotEdited for the first edit made to groups
    if (groupNotEdited) {
      setGroupNotEdited(false)
    }
    updatedGroupData = {
      ...updatedGroupData,
      [fieldName]: value,
    }
    updateGroupData({ updatedGroupData, groupIndex: currentGroupIndex })
  }

  const handleConfirmResponse = (value) => {
    if (value === 'YES') {
      if (confirmModalCategory === 'DELETE GROUP') {
        const groupToDelete = test.itemGroups[deleteGroupIndex]
        // deleteItemsGroup => deletes the group and updates the index for remaining
        deleteItemsGroup(groupToDelete.groupName)
        // removeTestItems => removes selected test items for the deleted group
        removeTestItems(groupToDelete.items.map((i) => i._id))
        // if the group being edited is deleted, reset the edit details
        if (currentGroupIndex === deleteGroupIndex) {
          setCurrentGroupIndex(null)
        } else if (currentGroupIndex > deleteGroupIndex) {
          // if the edited group is positioned after the group being deleted
          // currentGroupIndex needs to be updated for the same by a factor of -1
          setCurrentGroupIndex(currentGroupIndex - 1)
        } else {
          // currentGroupIndex < deleteGroupIndex
          // no change required
        }
        setDeleteGroupIndex(null)
        // NOTE: test is not saved after this removal
      } else if (confirmModalCategory === 'DELETE LAST GROUP') {
        setTestData({
          hasSections: false,
          itemGroups: [createNewStaticGroup()],
        })
        setSectionsState(false)
        if (testId) handleSaveTest(sectionTestActions.REMOVE)
        gotoAddItems()
      }
    }
    setConfirmModalCategory(null)
    setShowConfirmModal(false)
  }

  const handleDeleteGroup = (e, index) => {
    e.stopPropagation()
    setDeleteGroupIndex(index)
    if (test.itemGroups.length <= 1) {
      setConfirmModalCategory('DELETE LAST GROUP')
    } else {
      setConfirmModalCategory('DELETE GROUP')
    }

    setShowConfirmModal(true)
  }

  const handleAddGroup = () => {
    if (test.itemGroups.length === 7) {
      notification({ type: 'warn', messageKey: 'cantCreateMoreThan7Groups' })
      return
    }
    const groupNamesFromTest = test.itemGroups.map((g) =>
      `${g.groupName || ''}`.toLowerCase()
    )
    const { index } = maxBy(test?.itemGroups || [], 'index')
    let groupName = `SECTION ${index + 2}`
    for (
      let i = index + 3;
      groupNamesFromTest.includes(groupName.toLowerCase());
      i++
    ) {
      groupName = `SECTION ${i}`
    }

    const data = { ...createNewStaticGroup(), groupName, index: index + 1 }
    addNewGroup(data)
    setActivePanels([...activePanels, (test.itemGroups.length + 1).toString()])
    // make the newly created section active
    setCurrentGroupIndex(test.itemGroups.length)
  }

  const handleEditGroup = (e, itemGroup, index) => {
    if (activePanels.includes((index + 1).toString())) e.stopPropagation()
    setCurrentGroupIndex(index)
  }

  return (
    <Container>
      {showConfirmModal && (
        <TypeConfirmModal
          visible={showConfirmModal}
          handleResponse={handleConfirmResponse}
          confirmModalCategory={confirmModalCategory}
          additionalDeleteText="Delete of section removes the items from this section. You can still add it from the library."
          groupName={
            test.itemGroups?.[
              confirmModalCategory === 'TYPE'
                ? currentGroupIndex
                : deleteGroupIndex
            ]?.groupName
          }
        />
      )}
      <BreadcrumbContainer>
        <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
      </BreadcrumbContainer>
      <SectionsTestCreateGroupWrapper>
        <Collapse
          activeKey={activePanels}
          onChange={(panels) => setActivePanels(panels)}
        >
          {test.itemGroups.map((itemGroup, index) => {
            return (
              <PanelStyled
                header={[
                  <PanelHeading>
                    {currentGroupIndex !== index ? (
                      <Label
                        fontWeight="600"
                        data-cy={`sectionName-${itemGroup.groupName}`}
                      >
                        {itemGroup.groupName}
                      </Label>
                    ) : (
                      <SectionNameInput
                        data-cy="sectionNameInput"
                        type="text"
                        placeholder="Provide a section name (upto 50 characters)"
                        maxLength={50}
                        value={itemGroup.groupName}
                        onClick={(e) => {
                          // Stops the collapsible click event when clicked on input box
                          e.stopPropagation()
                        }}
                        onChange={(e) =>
                          handleChange('groupName', e.target.value)
                        }
                      />
                    )}
                    <div>
                      {currentGroupIndex !== index && (
                        <div
                          data-cy={`editSection-${itemGroup.groupName}`}
                          title="edit"
                          onClick={(e) => handleEditGroup(e, itemGroup, index)}
                        >
                          <IconPencilEdit />
                        </div>
                      )}
                      <div
                        title="Delete"
                        data-cy={`deleteSection-${itemGroup.groupName}`}
                        onClick={(e) => handleDeleteGroup(e, index)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </div>
                    </div>
                  </PanelHeading>,
                ]}
                key={index + 1}
              >
                <ContentBody data-cy={`group-${itemGroup.groupName}`}>
                  <GroupField>
                    <Label>
                      Items <span style={{ color: lightRed2 }}>*</span>
                    </Label>
                    <QuestionTagsWrapper>
                      <QuestionTagsContainer
                        data-cy={`item-container-${itemGroup.groupName}`}
                      >
                        {itemGroup.items
                          .map(({ _id }) =>
                            _id.substring(_id.length, _id.length - 6)
                          )
                          .map((id) => (
                            <ItemTag>{id}</ItemTag>
                          ))}
                      </QuestionTagsContainer>
                      <Tooltip
                        title={
                          currentGroupIndex !== index
                            ? `Click on edit to select items`
                            : null
                        }
                      >
                        {/* Workaround: Need to wrap the button with span as antd tooltip doesn't work for disabled buttons */}
                        <span>
                          <EduButton
                            height="40px"
                            isGhost
                            onClick={handleSelectItems}
                            disabled={currentGroupIndex !== index}
                            data-cy={`selectItemButton-${itemGroup.groupName}`}
                          >
                            Select Items
                          </EduButton>
                        </span>
                      </Tooltip>
                    </QuestionTagsWrapper>
                  </GroupField>
                </ContentBody>
              </PanelStyled>
            )
          })}
        </Collapse>
        <GroupField style={{ marginTop: '15px', marginLeft: '45%' }}>
          <button
            type="button"
            data-cy="add-section"
            onClick={handleAddGroup}
            style={{
              paddingBlock: '12px',
              borderRadius: '7px',
              borderColor: 'transparent',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            <FontAwesomeIcon icon={faPlusCircle} aria-hidden="true" />
            <span style={{ paddingLeft: 10 }}>ADD SECTION</span>
          </button>
        </GroupField>
      </SectionsTestCreateGroupWrapper>
    </Container>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      test: getTestEntitySelector(state),
      hasSections: hasSectionsSelector(state),
    }),
    {
      updateGroupData: updateGroupDataAction,
      addNewGroup: addNewGroupAction,
      removeTestItems: removeTestItemsAction,
      deleteItemsGroup: deleteItemsGroupAction,
      setTestData: setTestDataAction,
    }
  )
)

export default enhance(SectionsTestGroupItems)
